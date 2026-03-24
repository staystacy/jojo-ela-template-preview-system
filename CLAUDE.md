# CLAUDE.md — JOJO ELA Template Preview

> 版本：v1 | 日期：2026-03-20
> 此文件供 Claude Code 在每個 session 開始時自動讀取，理解專案背景、規範和工作流。

---

## 一、專案定位

### 這是什麼
`jojo-ela-template-preview` 是 JOJO ELA Worksheet 的**題版預覽、審校與資源管理工具**。

它服務於整個 ELA 產品線的開發流程——從 template 設計確認、題目數據審校、到最終的資源產製。不是面向終端用戶的產品。

### 產品背景
JOJO Math 是一款 iPad + iPhone 兒童學習 App（手寫為核心互動）。ELA 是新產品線，目標用戶是美國 PreK-G3 兒童（4-10 歲）。

ELA 產品採用「圖書館書架」模式——45 本 Workbook，每本 20-30 頁，家長選一本讓孩子做。不是每日推題的線性課程。

### 此 Repo 的全生命週期

```
階段 1：Template 渲染設計確認
  → 用假數據渲染 16 個 Template，調整視覺細節
  
階段 2：題目數據審校  
  → 放入真實題目 JSON，渲染真實頁面，教研和產品審校
  
階段 3：資源產製
  → TTS 語音、圖片資源的產製流程管理
  → 只有選定的正式資源才放入 repo
  
階段 4：產品交互 & UI 原型
  → 基於確認的 template 產出產品需求文檔、交互規格
  
階段 5：教研資源產出
  → 題目生成、答案驗證、CCSS 對標檢查
```

---

## 二、使用者

只有 **Stacy**（JOJO Math COO）使用此 repo，身兼多重角色：

| 角色 | 在此 repo 做什麼 |
|------|----------------|
| 教研 | 審校題目內容、檢查 CCSS 對標、驗證 phonics 進階邏輯 |
| 產品/UX | 確認 template 交互設計、產出 UI 原型圖、寫產品需求文檔 |
| 開發 | 完善 preview tool 功能、調整渲染邏輯 |
| 資源產製 | 管理 TTS 語音和圖片資源的產製流程 |

### Stacy 的溝通偏好
- 繁體中文為主，專有名詞保留英文
- 高效直接，不需要冗長解釋
- 偏好「減法」——最小改動、最大效果，不做不必要的加法
- 程式碼內的註釋和變數名用英文

---

## 三、Repo 結構

```
jojo-ela-template-preview/
├── CLAUDE.md                    ← 你正在讀的這個文件
├── README.md                    ← GitHub 展示用，簡述如何使用
├── index.html                   ← Preview 工具主頁面
├── styles.css                   ← 樣式（含 JOJO 色系變數）
├── app.js                       ← 渲染邏輯
│
├── data/                        ← 題目數據
│   ├── mock/                    ← 假數據（階段 1 用）
│   │   ├── T-CIRCLE.json
│   │   ├── T-SOUNDBOX.json
│   │   └── ...
│   └── workbooks/               ← 真實題目數據（階段 2+ 用）
│       ├── K-1/
│       │   ├── U01_P01.json
│       │   ├── U01_P02.json
│       │   └── ...
│       └── ...
│
├── assets/                      ← 正式資源（只放已選定的）
│   ├── images/                  ← 圖片（PNG/SVG）
│   │   ├── phonics/
│   │   ├── sight-words/
│   │   └── reading/
│   ├── audio/                   ← 音頻（MP3）
│   │   ├── tts-word/
│   │   ├── tts-phoneme/
│   │   ├── tts-sentence/
│   │   └── tts-instruction/
│   └── fonts/                   ← 教學字體（如 Andika）
│
├── docs/                        ← 設計與規格文件
│   ├── JOJO-ELA-Template-System-v2.md
│   ├── JOJO-ELA-Workbook-Library-Framework.md
│   ├── JOJO-ELA-Workbook-Library.csv
│   ├── JOJO-ELA-Framework-Design-Doc.md
│   └── ui-specs/                ← UI 原型圖和產品需求文檔（後續產出）
│
└── scripts/                     ← 輔助腳本
    ├── generate-tts.py          ← TTS 語音批量生成（後續）
    ├── generate-mock-data.py    ← 假數據生成
    └── validate-data.py         ← 題目數據驗證（後續）
```

### 資源管理規則

**放入 repo 的：**
- 已選定的正式圖片和音頻（`assets/`）
- 題目數據 JSON（`data/`）
- 設計文件（`docs/`）

**不放入 repo 的：**
- 資源產製過程中的候選版本（TTS 做 4-5 版選最好的那個才放）
- 大於 50MB 的單個文件
- 任何臨時文件

---

## 四、視覺風格規範

### 核心方向
**像一本印刷精美的兒童練習冊，溫暖、乾淨、有紙感。不是遊戲 App，不是考試軟體。**

### CSS 變數（所有樣式必須使用這些變數）

```css
:root {
  /* 底色 */
  --page-bg: #FDF8F0;
  --card-bg: #FFFFFF;
  --demo-bg: #FFF5E6;
  
  /* 主色 */
  --jojo-teal: #5BC5C8;
  --jojo-blue: #6BB8E8;
  --item-number: #A8D8EA;
  
  /* 書寫色 */
  --pencil-blue: #7EC8F0;
  --trace-guide: #D6EDFA;
  
  /* 文字 */
  --text-primary: #4A4A4A;
  --text-secondary: #888888;
  --text-hint: #CCCCCC;
  
  /* 邊框 */
  --cell-border: #C8DFE8;
  --card-border: #E8E8E8;
  --warm-divider: #F0E8E0;
  
  /* 功能色 */
  --correct: #7BC67E;
  --incorrect: #E88B8B;
  --annotation: #FF8A80;
}
```

### 絕對禁止
- ❌ 純白 `#FFFFFF` 作為頁面底色（用 `--page-bg` 暖米白）
- ❌ 漸變（gradient）
- ❌ 陰影（box-shadow）
- ❌ 深色/暗色背景
- ❌ 遊戲風格 UI（星星、寶石、彈跳動畫）
- ❌ Inter / Roboto / Arial 等冷感字體

### 組件速查

| 組件 | 邊框 | 背景 | 圓角 |
|------|------|------|------|
| 手寫格（空白） | 1.5px dashed `--cell-border` | `--card-bg` | 8px |
| 手寫格（描紅） | 同上 | 同上 + 引導字 `--trace-guide` | 8px |
| 音頻按鈕 | none | `--jojo-blue` | 50%（正圓） |
| 題號圓圈 | none | `--item-number` + 白色數字 | 50% |
| 示範區 | 2px solid `--jojo-teal` | `--demo-bg` 或 `--card-bg` | 12px |
| 圖片佔位 | none | `--demo-bg` | 12px |
| Word Bank pill | 1px solid `--card-border` | `--card-bg` | 16px |
| 分類桶 | 2px dashed `--cell-border` | `#FAFAF5` | 12px |
| Typing 輸入區 | 1.5px solid `--cell-border` | `--card-bg` | 8px |
| 短文閱讀區 | 1px solid `--warm-divider` | `--card-bg` | 12px |

---

## 五、數據格式規範

### Page-Level JSON Schema

每一頁 worksheet 對應一個 JSON 文件：

```json
{
  "page_id": "K-1_U01_P03",
  "workbook_id": "K-1",
  "unit": 1,
  "page_in_unit": 3,
  "template_id": "T-SOUNDBOX",
  "variant": "v2",
  "grade": "K",
  "domain": "Phonics",
  "skill": "CVC_short_a",
  "ccss": ["RF.K.3.b"],
  "instruction_text": "Listen to the word. Write each sound in a box.",
  "instruction_audio": "instruction_soundbox_cvc.mp3",
  "cell_size": 48,
  "items_per_page": 5,
  "items": []
}
```

### Item-Level 字段（因 Template 而異）

完整的字段規格見 `docs/JOJO-ELA-Template-System-v2.md` 的「字段規格匯總」章節。

### 文件命名規則
- 假數據：`data/mock/T-{TEMPLATE_ID}.json`
- 真實數據：`data/workbooks/{WORKBOOK_ID}/U{NN}_P{NN}.json`
- 圖片：`assets/images/{domain}/{filename}.png`
- 音頻：`assets/audio/{type}/{filename}.mp3`

---

## 六、技術偏好

### 必須遵守
- **純前端**：HTML + CSS + Vanilla JS，零框架依賴
- **Zero Build**：clone 後直接打開 `index.html` 就能跑
- **部署到 GitHub Pages**：`index.html` 在根目錄
- **使用 `/mnt/skills/public/frontend-design/SKILL.md`** 確保 UI 品質

### Coding Style
- 變數名和註釋用英文
- CSS 使用上方定義的 CSS 變數，不硬編碼色值
- JS 用 ES6+（const/let、arrow functions、template literals）
- 不用 class-based 架構，用函數式渲染（`renderTemplate(data)` → DOM）
- 文件保持精簡——如果單文件能解決就不拆文件

### 不需要做的事
- ❌ 真正的手寫辨識
- ❌ 真正的音頻播放（🔊 按鈕是靜態的，後續階段再接）
- ❌ 做題/計分邏輯
- ❌ 後端/數據庫
- ❌ 用戶登入
- ❌ Mobile responsive（桌面審校工具）
- ❌ 頂部導航列渲染（由 JOJO Math 產品團隊提供）

---

## 七、工作流定義

### 工作流 A：Template 渲染調整
```
Stacy 說：「T-CIRCLE 的選項間距太小，改大一點」
Claude Code：
  1. 讀 CLAUDE.md 了解上下文
  2. 找到 T-CIRCLE 的渲染函數
  3. 調整 CSS gap 值
  4. commit + push
```

### 工作流 B：真實題目數據審校
```
Stacy 說：「K-1 的 Unit 1 題目做好了，放到 data/workbooks/K-1/ 裡，幫我渲染看看」
Claude Code：
  1. 讀 JSON 文件
  2. 驗證格式是否符合 schema
  3. 在 preview tool 中渲染
  4. 如有問題，指出具體字段錯誤
```

### 工作流 C：資源產製
```
Stacy 說：「幫我用 TTS 生成 K-1 Word Bank 裡所有字的語音」
Claude Code：
  1. 讀 data/workbooks/K-1/ 裡的 JSON，提取所有需要語音的字
  2. 用 TTS API 批量生成
  3. Stacy 在本地聽選（不放 repo）
  4. 選定的正式版本放入 assets/audio/
```

### 工作流 D：教研資源產出
```
Stacy 說：「幫我生成 K-1 Short Vowel Words 所有 Unit 的題目 JSON」
Claude Code：
  1. 讀 Template System 和 Workbook Framework
  2. 按規格生成每頁的 JSON 數據
  3. 確保 phonics 內容教育正確（真實 CVC 字、正確 IPA）
  4. 輸出到 data/workbooks/K-1/
```

### 工作流 E：UI 原型 / 產品需求文檔
```
Stacy 說：「幫我把 T-PASSAGE 的交互流程寫成 PRD」
Claude Code：
  1. 讀 Template System
  2. 產出 MD 格式的 PRD，放到 docs/ui-specs/
  3. 包含交互流程、字段說明、邊界情況
```

---

## 八、16 個 Template 快速索引

| ID | 名稱 | 輸入方式 | 適用年級 |
|----|------|---------|---------|
| T-TRACE | 描紅遞進 | ✏️ 手寫 | PreK-G1 |
| T-WRITE | 獨立書寫 | ✏️ 手寫 | PreK-G3 |
| T-SOUNDBOX | 聲音盒 | ✏️ 手寫 | K-G2 |
| T-BLEND | 音素合成 | ✏️ 手寫 | PreK-G1 |
| T-CIRCLE | 圈選 | ✏️ 圈選 | PreK-G3 |
| T-MATCH | 連線 | ✏️ 畫線 | PreK-G3 |
| T-SORT | 拖拽分類 | 👆 拖拽 | K-G3 |
| T-FILLIN | 填空 | ✏️ 手寫 | K-G3 |
| T-LISTEN | 聽音作答 | ✏️ 圈/寫 | PreK-G2 |
| T-FINDWORD | 找字圈選 | ✏️ 圈選 | K-G2 |
| T-LADDER | 字族階梯 | ✏️ 手寫 | K-G1 |
| T-PASSAGE | 短文閱讀 | ✏️ 圈 + ⌨️ 打字 | K-G3 |
| T-SEQUENCE | 排序 | 👆 拖拽 | PreK-G3 |
| T-SENTENCE | 句子書寫 | ⌨️ Typing | K-G3 |
| T-FIXUP | 改錯 | ✏️ 圈 + ⌨️ 打字 | G1-G3 |
| T-TRANSFORM | 變換 | ✏️/⌨️ | G1-G3 |

### 書寫交互規則
| 內容 | 方式 | 設備 |
|------|------|------|
| 字母/單字（≤6 字母） | ✏️ 手寫 | iPad 全屏 / iPhone 小白板 |
| 句子（7+ 字母） | ⌨️ Typing | iPad 和 iPhone 都彈鍵盤 |

---

## 九、關聯知識

如果需要教育學背景知識（Phonics 進階順序、CCSS 標準、Sight Words 體系等），參考 `docs/` 目錄下的設計文件。核心公式：

**閱讀能力 = 解碼 (Phonics + Sight Words) × 語言理解 (Vocabulary + Comprehension)**

Phonics 進階路線：音素覺察 → 字母音 → CVC → Digraphs → Blends → CVCe → Vowel Teams → R-controlled → Diphthongs → 多音節 → 前後綴

---

*首次建立：2026-03-20 | 由 Stacy 和 Claude 協作定義*
