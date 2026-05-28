---
name: jojo-ela-audit
description: JOJO ELA preview tool 的 workbook 完整檢核 — 對 ready 清單跑資源檢核 (A=0/B=0/C=0) + browser render smoke + fingerprint 自動判斷哪本需重檢。觸發詞：「audit <清單>」「檢核 <workbook 清單>」「ELA workbook 檢核」「ready 資源檢查」。
---

# JOJO ELA Workbook Audit

當 user 給 ready 清單（例如 `audit PK-1a, K-1b, G1-2`），按此流程跑。

## 通過標準（永不變）

| 項目 | 通過條件 |
|------|---------|
| A | 每頁 topicType 有 translator/extractor，translator 不丟錯 |
| B | 每個 audio/image 引用都在 manifest 找得到 |
| C | audio category 路由正確（`letter:` / `rime:` / `phoneme:` / `word:` hint 走到對的目錄） |
| Render | browser-level `translatePage` + `renderPage` 每頁都產出 DOM child |

## 流程

### Step 1 — Fingerprint check（決定哪本要跑）

先確認 server 在 3000：用 Claude_Preview MCP `preview_start` (config name `preview`)，或 `node server.js &`。

```bash
node scripts/audit-fingerprint.mjs check <wb1> <wb2> ...
```

回傳 JSON，每本標 `stale: true|false`。Stale 原因可能：
- `never audited` — 從未檢核
- `last result: fail` — 上次失敗
- `page JSON changed` — Jason 動過 page JSON
- `asset manifest changed` — 資源檔有增刪
- `audit code changed` — translator / audit script 改過 → 全部 stale

**fresh 的 workbook 直接跳過**，不跑 audit/smoke，省時間。報告時列出來告訴 user「已綠無變更」。

### Step 2 — Audit script（只對 stale 清單）

```bash
node scripts/audit-workbook.mjs <stale wb 1> <stale wb 2> ...
```

要求：所有 stale workbook 都 A=0 B=0 C=0、`audit-reports/_stats.md` Δ 欄沒有 ↑ regression。

### Step 3 — Browser render smoke（只對 stale 清單）

用 `mcp__Claude_Preview__preview_eval`（serverId 來自 `preview_start`），navigate 到 `/` 後跑：

```js
(async () => {
  const READY = [/* stale workbook list */];
  await window.JOJO_BITABLE.loadAssetManifest();
  const failures = [];
  let total = 0;
  for (const wb of READY) {
    const ud = await (await fetch('/api/units?workbook=' + wb)).json();
    const units = (ud.units || []).filter(u => u.workbook === wb);
    for (const u of units) {
      const unit = await (await fetch('/api/unit/' + u.unit_code)).json();
      for (let i = 0; i < (unit.pages || []).length; i++) {
        total++;
        const page = unit.pages[i];
        try {
          const t = window.JOJO_BITABLE.translatePage(page, unit.content_pool, unit.unit_code, 'K');
          const tmp = document.createElement('div');
          window.JOJO_BITABLE.renderPage(t, tmp);
          if (tmp.querySelectorAll('*').length === 0 || t.kind === 'unsupported') {
            failures.push({ wb, unit: u.unit_code, page: i+1, pageId: page.pageId, kind: t.kind });
          }
        } catch (e) {
          failures.push({ wb, unit: u.unit_code, page: i+1, err: e.message });
        }
      }
    }
  }
  return { total, pass: total - failures.length, fail: failures.length, failures };
})()
```

要求：`fail === 0`。

### Step 4 — 更新 fingerprint

僅對「audit + smoke 都通過」的 workbook 跑：

```bash
node scripts/audit-fingerprint.mjs update <passed wb 1> <passed wb 2> ... --result=pass
```

任何失敗的 workbook → 用 `--result=fail` 寫入（下次自動 stale）。

### Step 5 — 報告

用以下格式給 user：

```
Audit 結果（總 N 本）

跳過 X 本（fresh，無變更）：
- PK-1a (上次 2026-05-28)
- ...

檢核 Y 本：
| Workbook | A | B | C | Render | 結論 |
|----------|---|---|---|--------|------|
| K-3      | 0 | 0 | 0 | 30/30  | pass |
| ...      |   |   |   |        |      |

[若有 fail：列細節並建議怎麼修]
```

### Step 6 — Commit 決策

- **無 code change**（git diff 只有 audit-reports/）→ 可以 commit fingerprint+stats，但**不要 push main 等 user 確認**
- **有 code change**（修了 translator / audit）→ commit 但**不 push main**
- 若 user 沒明確要求 commit → 預設不 commit，等指示

## 路徑速查

| 項目 | 路徑 |
|-----|------|
| Page JSON 來源 | `/Users/stacywang/Desktop/JOJO-Worksheet-Research/03-Preview-Tool/data/workbooks/<WB>/U??_P??.json` |
| Audio/Image 資產 | `/Users/stacywang/Desktop/JOJO-Worksheet-Research/10-Final-Assets/{audio,images}/<category>/` |
| Audit script | `scripts/audit-workbook.mjs` |
| Fingerprint script | `scripts/audit-fingerprint.mjs` |
| Audit reports | `audit-reports/<WB>.md` + `_stats.md` + `_fingerprints.json` |
| Preview server | `node server.js` @ http://localhost:3000 |
| Preview server (MCP) | `mcp__Claude_Preview__preview_start` config `preview` |

## 邊界條件

- Worktree 有未 commit 變更 → 警告 user 但繼續跑
- Server port 3000 被佔 → `preview_start` 會 reuse
- Workbook 在 `PAGES_DIR` 不存在 → 報錯 + 跳過該本，繼續跑其他本
- Audit A>0 或 B>0 或 C>0 → 該本標 fail，更新 fingerprint 為 `result=fail`
- 若 user 明確說「force re-audit」→ 略過 fingerprint check，全跑

## 完整 ready 清單參考

當前 ready：`PK-1a / PK-1b / PK-2a / PK-2b / PK-3c / PK-4 / K-1a / K-1b / K-2 / K-5a / K-5b / G1-2`

清單會增長 — user 給的 ready 清單為準，這份僅供參考。
