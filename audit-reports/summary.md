# Audit Summary — 5 Workbook 盤點

> 日期：2026-05-25  
> 驗證方式：純 script（`scripts/audit-workbook.mjs`）逐頁解 JSON → 模擬 translator → 比對 `/api/asset-manifest`；外加 Claude Preview MCP 對代表頁抓真實 DOM 確認 audit 判斷正確。

## 總體分數（修復後）

| Workbook | Pages | A (渲染失敗) | B (缺資源) | C (語意錯位) | 健康度 |
|----------|-------|--------------|------------|--------------|--------|
| PK-1a | 30 | 0 | 0 | 0 | **全綠** |
| PK-1b | 30 | 0 | 0 | 0 | **全綠** |
| PK-2a | 30 | 0 ✅ (was 12) | 14 (3 unique TTS) | 0 ✅ (was 3) | **TTS 待補** |
| PK-2b | 30 | 0 ✅ (was 12) | 14 (3 unique TTS) | 0 ✅ (was 3) | **TTS 待補** |
| K-1b  | 30 | 0 | 0 | 0 | **全綠** |

A / C 已透過 `feat/bitable-mode` 的 code 修復解決（見下方「已修復」段）。B 是 instruction TTS 缺檔，由別的 session 處理。

> *A 欄的「12」是 12 條 topic-level 錯誤訊息 — 實際上同一頁有 4 個 topic（4 道題）都列了一次，去重後 PK-2a/PK-2b 各 3 頁。  
> *B 欄的「14」是 14 條 instruction-key 級的缺漏 — 去重後 3 個 unique TTS 檔案沒生。

## 已修復（2026-05-25）

兩個 bug 在這次 session 一併修了，commit 在當前 worktree branch（`claude/hopeful-aryabhata-3227b8`）— 主 worktree 需要 fast-forward 到 `feat/bitable-mode`：

```
cd /Users/stacywang/Desktop/Code\ Project/jojo-ela-template-preview-system
git merge claude/hopeful-aryabhata-3227b8 --ff-only
```

**已改 3 個檔案**：
- `renderers/renderer-write.js` — 加 optional `item.prefill` 支援（backwards-compat）
- `data/bitable-mode.js` — circle_picture fallback (1 行) + 新增 `translateInitialSoundSpelling`、`TOPIC_TRANSLATORS`、`TEMPLATE_VARIANT_MAP`、`TOPIC_DEFAULT_INSTR` 各一條
- `data/bitable-mode.test.html` — 31 → 34 test cases（全綠）

**驗證**：
- audit script 重跑：A 12→0、C 3→0、B 維持 14（TTS 缺檔）
- bitable-mode.test.html：34/34 passing
- 瀏覽器 DOM 抓真實渲染：PK-2a U02_P05 `dog` card 現有 `data-correct="true"`；PK-2a U04_P03 4 個 item 渲染成功，每題第 1 格 `ws-cell-answer`、其他格 `ws-cell-trace`（淡色預填 displaySuffix）；T-SPELL Variant 1 label 跟 spec 對齊

## 原問題詳細（pre-fix 紀錄）

### 1. 【translator bug】 `english_circle_picture` 沒讀 `correctAnswer`
- **影響**：PK-2a / PK-2b 各 3 頁（U02_P05、U04_P05、U06_P03），共 6 頁。畫面渲染出來，6 張圖卡正常顯示，但**沒有任何卡被標為「正確答案」**（瀏覽器抓 DOM 確認 `data-correct="false"` 全 6 張）。
- **根因**：[data/bitable-mode.js:847](data/bitable-mode.js) `translatePage` 對 `english_circle_picture` 走 custom branch：  
  ```js
  correct: (t.correctWords || []).slice()
  ```
  但這 6 頁 JSON 是 `correctAnswer: "dog"`（單選 string），不是 `correctWords: [...]`（多選 array），所以 `correct = []` → renderCircleMultiRow 的 `if (!correct) return;` 全部 skip → SVG circle 一個都沒畫。
- **修法**（一行 fallback）：`correct: (t.correctWords || (t.correctAnswer ? [t.correctAnswer] : []))`
- **建議**：進 plan mode 改 `data/bitable-mode.js`，commit 到 `feat/bitable-mode`。

### 2. 【新 translator 需求】 `english_initial_sound_spelling`
- **影響**：PK-2a / PK-2b 各 3 頁（U04_P03、U05_P03、U06_P04），共 6 頁全黃框 “Not yet rendered · ??? › (unknown topicType: english_initial_sound_spelling)”。
- **JSON 形態**（PK-2a U04_P03）：
  ```json
  {
    "topicType": "english_initial_sound_spelling",
    "word": "jam", "displaySuffix": "am",
    "answer": "j", "answer_phoneme_id": "onset_dz"
  }
  ```
  4 個 topic / 頁，意思是「看圖、聽單字、寫首字母」。
- **問題**：translator 沒實作。畫面只有黃框，孩子根本看不到題。
- **不要直接寫 code** — 此 topicType 不在現有 16 個 SSOT 列表中。Stacy 要先決定：
  - 走哪個既有 template（看起來像 T-SPELL/T-WRITE 變體，但只填 1 個 box）
  - 或 T-SOUNDBOX partial fill（前 1 box 待填、後面 displaySuffix 預填）
  - 或新增 variant
- **建議**：列入 backlog，由 Stacy 決定 template 對應後再寫 translator。

### 3. 【缺 TTS】 3 個 instruction key 沒生
PK-2a / PK-2b 各 8、3、3 頁、共 28 個位置缺，去重 3 個 unique key：

| instruction key | 缺幾頁/本 | 來自 topicType |
|-----------------|-----------|---------------|
| `match_the_picture_to_its_first_letter` | 8 × 2 = 16 | english_matching (matchType: picture_to_letter，PK-2 系變體) |
| `listen_to_the_sound_circle_the_picture_that_starts_with_that_sound` | 3 × 2 = 6 | english_circle_picture |
| `look_at_the_picture_listen_to_the_word_write_the_first_letter` | 3 × 2 = 6 | english_initial_sound_spelling |

- **影響**：頂部「audio: ⚠ Missing audio: <key>.mp3 (instruction TTS)」按鈕 disabled。題目本身能 render。
- **修法**：在 Bitable Resource Library 對應條目補 TTS（或在本地 `10-Final-Assets/audio/instruction/` 補檔，server `getAssetManifest()` 有 5s TTL 會自動 pick up）。

## 觀察（非 audit 缺陷，但值得後續討論）

1. **PK-2 系 `english_circle_picture` 教學設計缺 phoneme 提示**  
   instruction text 是「Listen to the sound. Circle the picture that starts with that sound」，但 page JSON 只有 `targetLetter: "D"` + `targetSound: "/d/"`，translator 沒把 `targetSound` 作為單獨可點的 phoneme audio button 渲染出來。孩子點 instruction button 只會聽到整段英文，聽不到 `/d/` 本身。這屬「題型體驗」議題，可單獨開 task 討論。

2. **`english_circle_picture` 跨年級兩種 JSON schema 並存**  
   - PK-2 系：`correctAnswer: "dog"` (string, single choice) — T-CIRCLE variant 1
   - 其他可能的 workbook：`correctWords: [...]` (array, multi-select for digraph) — T-CIRCLE variant 2
   
   translator 對 variant 1 沒處理（即 bug #1）。修 fallback 即可同時支援。

3. **Renderer 與 translator 的 audio button 邊界**  
   `english_circle_word` / `english_sort_words` / `english_sequence` / `english_word_transform_picture` 的 translator 雖然包了 `audio` 欄位給 item，但對應 renderer (`renderer-circle.js` / `-sort.js` / `-sequence.js` / `-transform.js`) **沒讀**這個欄位，所以這些題型卡片**完全靜音**（只有頂部 instruction 有聲）。  
   若教研期望這些卡片可點發音，需要修對應 renderer（屬「合約變更」，CLAUDE.md 禁區）。  
   若教研期望靜音（純視覺操作），現狀正確。

## 下一步建議

按 ROI 排序：

1. **修 bug #1（5 min）** — 一行 fallback，立即修復 6 頁的「看不到答案」問題。Plan + commit 到 `feat/bitable-mode`。
2. **補 3 個 instruction TTS（依 TTS 流程）** — 不需碰 code，加檔即可被 server 自動 pick up。
3. **決定 `english_initial_sound_spelling` 對應哪個 template**（需 Stacy 拍板）— 確定後再寫 translator。
4. **討論觀察 #1** — circle_picture 是否要加 phoneme audio button（教學體驗議題）。

## 附錄：每本詳細報告

- [PK-1a.md](PK-1a.md)
- [PK-1b.md](PK-1b.md)
- [PK-2a.md](PK-2a.md)
- [PK-2b.md](PK-2b.md)
- [K-1b.md](K-1b.md)

驗證腳本：[scripts/audit-workbook.mjs](../scripts/audit-workbook.mjs)（純 node，無依賴；對 manifest 變動敏感，重跑即可拿到最新狀態）。
