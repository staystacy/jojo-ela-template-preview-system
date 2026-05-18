# JOJO ELA Template Preview System

Internal review tool for rendering and reviewing 16 JOJO ELA Worksheet Templates across PreK-G3.

## Directory Structure

```
docs/
  framework/          # Core design documents
    JOJO-ELA-Template-System-v2.md        # 16 Template specs (layout, variants, JSON fields)
    JOJO-ELA-Workbook-Library-Framework.md # 43 Workbook library (PreK-G3)
    JOJO-ELA-Framework-Design-Doc.md       # Design rationale & research summary
  research/           # Background research (7 areas)
    01-KUMON-Reading/
    02-Phonics-Worksheets/
    03-SightWords-Vocab-Spelling/
    04-ReadingComp-Fluency-Writing/
    05-Standards-Research/
    06-iXL-Worksheets/
    07-Workbook-Market/
  prompt/             # Claude Code build prompt
    Claude-Code-Prompt-Template-Preview-v2.md
src/                  # Preview tool source code (TBD)
```

## Usage with Claude Code

1. Open this repo in Claude Code
2. Reference `docs/prompt/Claude-Code-Prompt-Template-Preview-v2.md` as the build prompt
3. Claude Code reads the framework docs and builds the preview tool into `src/`

## Key Documents

| Document | Purpose |
|----------|---------|
| Template System v2 | 16 templates with variants, JSON schema, layout specs |
| Workbook Library | 43 workbooks across PreK-G3, unit breakdowns |
| Framework Design Doc | Why decisions were made, research data, expert/parent optimizations |
| Preview Prompt v2 | Full build instructions for the preview tool |

## 本地 Bitable 模式

從 Bitable 抓 Approved 單元的 `generator_output`，在瀏覽器渲染練習題給審教者比對。

### 前置
- Node.js ≥ 18
- `lark-cli` 已安裝且 `lark-cli auth login` 完成
- 資產目錄存在於 `~/Desktop/JOJO-Worksheet-Research/10-Final-Assets/`
- Bitable `generator_output` 含 `instructionText`（K-1_U01 已 ready）

### 啟動
```bash
npm install
source ~/.config/stacy-secrets/.env   # 載入 lark-cli token
node server.js                          # 預設 :3000
```
瀏覽器開 [http://localhost:3000](http://localhost:3000)，header 切到 **Bitable Mode**。

### 環境變數（可選）
| Var | Default |
|---|---|
| `PORT` | 3000 |
| `ASSETS_DIR` | `~/Desktop/JOJO-Worksheet-Research/10-Final-Assets` |
| `BITABLE_BASE_TOKEN` | `YSoZbDOKCadq3Ys4c9Gl0FkYgqe` |
| `BITABLE_TABLE_ID` | `tblRw0GDwu5DXVJG` |
| `BITABLE_HOST` | `feishu.cn` |
| `LARK_CLI_BIN` | `lark-cli` |
| `CACHE_TTL_MS` | 300000（5 分鐘）|

### 單元測試
打開 [http://localhost:3000/data/bitable-mode.test.html](http://localhost:3000/data/bitable-mode.test.html)
看 translator 測試結果（全綠才能發 PR）。

### 支援的 topicType（K-1_U01）
- `english_sound_box_full` → T-SOUNDBOX v2
- `english_sound_box_partial_fill` → T-SOUNDBOX v1
- `english_picture_spelling` → T-WRITE v2
- `english_circle_picture` → Bitable 專用 multi-row renderer
- `english_matching` → T-MATCH v2

### 已知限制
- 目前只支援上述 5 種 topicType（新型別→ unsupported notice）
- 缺資產的 word fallback 為帶 `⚠ <file> missing` 警示的灰色 placeholder
- instruction 音檔（`{unit_code}_p{N}.mp3`）尚未生成，按鈕一律 disabled
