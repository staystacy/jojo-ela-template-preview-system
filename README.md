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

## 本地 JSON 模式

從本地 `data/workbooks/<workbook>/U<NN>_P<NN>.json` 讀題目（每頁一個 JSON），對齊研發 spec，在瀏覽器渲染給審教者比對。

### 前置
- Node.js ≥ 18
- 題目 JSON 在 `~/Desktop/JOJO-Worksheet-Research/03-Preview-Tool/data/workbooks/<workbook>/`
- 資產目錄在 `~/Desktop/JOJO-Worksheet-Research/10-Final-Assets/`
- JSON 標準參考 `Framework/ELA-Template-json-260518.html`

### 啟動
```bash
npm install
node server.js   # 預設 :3000，Ctrl-C 結束
```
瀏覽器開 [http://localhost:3000](http://localhost:3000)，header 切到 **Bitable Mode**（歷史名稱，現在讀本地 JSON）。

### 環境變數（可選）
| Var | Default |
|---|---|
| `PORT` | 3000 |
| `ASSETS_DIR` | `~/Desktop/JOJO-Worksheet-Research/10-Final-Assets` |
| `PAGES_DIR` | `~/Desktop/JOJO-Worksheet-Research/03-Preview-Tool/data/workbooks` |

### 單元測試
打開 [http://localhost:3000/data/bitable-mode.test.html](http://localhost:3000/data/bitable-mode.test.html)
看 translator 測試結果（全綠才能發 PR）。

### 已實作的 topicType（K-1a 全部 9 種）
| topicType | 母題版 / 子題版 |
|---|---|
| `english_sound_box_full` | T-SOUNDBOX › Sound Box - Full (2 Rows) |
| `english_sound_box_partial_fill` | T-SOUNDBOX › Sound Box - Partial Fill (4 Rows, 2x2) |
| `english_picture_spelling` | T-SPELL › Picture Spelling (4 Cells) |
| `english_circle_picture` | T-CIRCLE › Circle Picture by Sound / Pictures by Digraph |
| `english_matching` | T-MATCH › Match Picture to Word (4 Pairs) |
| `english_trace_word` | T-TRACE › Shadow / Guided to Freehand / Freehand Writing - Word (4 Cells) |
| `english_onset_rime_blend` | T-BLEND › Onset-Rime Blend (2 Rows) |
| `english_phoneme_blend_picture` | T-BLEND › Phoneme Blend - Picture Support (2 Rows) |
| `english_word_bank_cloze` | T-FILLIN › Word Bank Cloze (2 Rows) |
| `english_find_word` | T-FINDWORD › Find Words in Grid |

### 已知限制
- 缺資產的 word fallback 為帶 `⚠ <file> missing` 警示的灰色 placeholder
- instruction 音檔（`{unit_code}_p{N}.mp3`）尚未生成，按鈕一律 disabled
