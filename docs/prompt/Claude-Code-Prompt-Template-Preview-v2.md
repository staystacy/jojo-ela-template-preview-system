# Claude Code 任務：JOJO ELA Template Preview Tool v2

> 版本：v2 | 日期：2026-03-20
> 變更：移除 Stitch Design 依賴，改由 Claude Code 直接使用 frontend-design skill 完成 UI

---

## 任務概述

構建一個 **JOJO ELA Worksheet Template Preview 工具**，用於渲染和審校 16 個 Worksheet Template。

- 部署到 GitHub Pages，讓團隊通過網址查看
- 現階段用假數據，後續替換真實 JSON/圖片/音頻
- 是內部審校工具，不是面向用戶的產品

---

## 你需要讀的文件

**開始前必須讀完：**

1. **`/mnt/skills/public/frontend-design/SKILL.md`** — 使用此 skill 的設計指引，確保 UI 品質
2. **`JOJO-ELA-Template-System-v2.md`** — 16 個 Template 的完整規格（Layout、Variant、字段 JSON）
3. **`JOJO-ELA-Workbook-Library-Framework.md`** — 45 本 Workbook 清單，了解 Template 的使用上下文

---

## 視覺風格（最重要！）

### 設計方向

**像一本印刷精美的兒童練習冊被攤開在 iPad 上。溫暖、乾淨、有紙感。**

這是一個教育產品，不是遊戲 App，也不是考試軟體。想像一本 Scholastic 或 Brain Quest 的練習冊——彩色的、圓潤的、讓小朋友想拿起筆來寫的感覺。

### 參考 JOJO Math App 的視覺語言

JOJO Math App 的截圖特徵（Claude Code 需要還原這種氛圍）：

1. **暖米白底色**——不是純白 `#FFFFFF`，而是帶一點奶油黃的暖白。這是和 iXL 等冷白 UI 拉開差距的關鍵。
2. **頁面外框**——薄荷綠/青綠色的圓角邊框（border-radius 約 16px）
3. **手寫格**——藍灰色虛線框（dashed），格子內部是白色
4. **題號**——淺藍色圓圈包裹白色數字 ①②③
5. **教學展示區**——暖黃色奶油底色的區塊，放大字展示、帶圖片
6. **整體留白充足**——不擁擠，像紙本一樣有呼吸感

### 色系規範

```css
:root {
  /* 底色 */
  --page-bg: #FDF8F0;           /* 暖米白頁面底色 */
  --card-bg: #FFFFFF;            /* 白色卡片/格子 */
  --demo-bg: #FFF5E6;            /* 暖黃奶油色（教學展示區） */
  
  /* 主色 */
  --jojo-teal: #5BC5C8;          /* 青綠色（外框、品牌色） */
  --jojo-blue: #6BB8E8;          /* 天藍色（音頻按鈕） */
  --item-number: #A8D8EA;        /* 題號圓圈背景 */
  
  /* 書寫色 */
  --pencil-blue: #7EC8F0;        /* 手寫筆跡 */
  --trace-guide: #D6EDFA;        /* 描紅淺色引導 */
  
  /* 文字 */
  --text-primary: #4A4A4A;       /* 主文字（深灰非純黑） */
  --text-secondary: #888888;     /* 次要/指令 */
  --text-hint: #CCCCCC;          /* 佔位符 */
  
  /* 邊框 */
  --cell-border: #C8DFE8;        /* 手寫格虛線 */
  --card-border: #E8E8E8;        /* 卡片邊框 */
  --warm-divider: #F0E8E0;       /* 暖灰分隔線 */
  
  /* 功能色 */
  --correct: #7BC67E;            /* 結算頁-正確 */
  --incorrect: #E88B8B;          /* 結算頁-錯誤 */
  
  /* 標注色（Preview 工具專用） */
  --annotation: #FF8A80;         /* 字段標注框 */
}
```

### 字體

- 主字體：系統 rounded sans-serif（`-apple-system, "SF Pro Rounded", "Nunito", sans-serif`）
- 教學字體（手寫格內的引導字）：`"Andika", "Comic Neue", sans-serif`
- 代碼/JSON 面板：`"SF Mono", "Fira Code", monospace`

**不要用：** Inter, Roboto, Arial, Space Grotesk 等 AI 常用的冷感字體

### 手繪感元素

圈選筆跡和連線筆跡需要有**手繪不規則感**：

```css
/* 圈選：用 SVG path 而非 <ellipse>，帶隨機微偏移 */
.circle-gesture {
  stroke: var(--pencil-blue);
  stroke-width: 2.5px;
  fill: none;
  /* path 數據要有微小的不規則——不要完美的幾何圓 */
}

/* 連線：用 quadratic bezier curve，不要直線 */
.line-gesture {
  stroke: var(--pencil-blue);
  stroke-width: 2.5px;
  fill: none;
}
```

### 絕對禁止

- ❌ 純白 `#FFFFFF` 作為頁面底色（必須用暖米白 `#FDF8F0`）
- ❌ 任何漸變（gradient）
- ❌ 任何陰影（box-shadow）
- ❌ 深色/暗色背景
- ❌ 遊戲風格 UI（星星、寶石、進度環、彈跳動畫）
- ❌ 冰冷的灰白考試軟體風格
- ❌ emoji 作為圖標（音頻按鈕用 SVG 三角形）

---

## 只渲染 Worksheet 內容區域

**不要渲染頂部導航列。** 導航列（返回鍵、進度條、頁碼、翻頁箭頭）已由 JOJO Math 產品團隊設計，ELA 復用。

Preview 工具渲染的是**導航列以下的 Worksheet 內容區域**。

---

## 頁面結構

```
┌──────────────────────────────────────────────────┐
│  JOJO ELA Template Preview             v2 [日期]  │  ← 工具 Header
├────────────┬─────────────────────────────────────┤
│            │                                     │
│  Template  │      Worksheet 內容渲染區            │
│  列表      │      （暖米白背景 #FDF8F0）          │
│            │      （aspect-ratio ~4:3）           │
│  16 個     │                                     │
│  Template  │                                     │
│  可點擊    │                                     │
│  切換      │                                     │
│            ├─────────────────────────────────────┤
│            │  Variant: [v1] [v2] [v3] [v4]       │
│            │  Grade:   [PreK] [K] [G1] [G2] [G3] │
│            │  [☐ 顯示字段標注]                    │
│            ├─────────────────────────────────────┤
│            │  JSON Data（可摺疊）                  │
│            │  { "template": "T-CIRCLE", ... }    │
└────────────┴─────────────────────────────────────┘
```

### 左側面板
- 16 個 Template 列表
- 每個顯示：Template ID + 名稱 + 適用年級彩色 tag
- 選中高亮用 `--jojo-teal`
- 年級 tag 顏色：PreK=`#E8F5E9` / K=`#E3F2FD` / G1=`#FFF3E0` / G2=`#F3E5F5` / G3=`#FCE4EC`

### 右側主區域
- **Worksheet 渲染區**：暖米白背景，最大寬度 960px，模擬 iPad 內容區
- **Variant 選擇器**：一排按鈕切換 Variant
- **Grade 選擇器**：切換同一 Variant 不同年級的 cell_size 和 qty 參數
- **字段標注 Toggle**：checkbox 開啟後覆蓋標注層
- **JSON 面板**：可摺疊，顯示當前渲染的完整 JSON

---

## 技術要求

- **純前端**：`index.html` + `styles.css` + `app.js` + `data/` 目錄（或合併為單文件）
- **零依賴**：不用任何框架。純 HTML + CSS + Vanilla JS。
- **Zero Build**：clone 後直接打開 `index.html` 就能跑
- **使用 frontend-design skill** 確保 UI 品質不是 AI slop

---

## 假數據要求

為所有 16 個 Template 的所有 Variant 生成教育上合理的假數據（不要 lorem ipsum）。

數據要覆蓋不同年級內容：
- PreK：字母、簡單 CVC（cat, dog, sun）
- K：digraphs（sh, ch, th）、sight words（the, said, was）
- G1：CVCe（cake, bike）、vowel teams（rain, tree）
- G2：spelling rules（hopping, making）、reading passages 100-200 字
- G3：prefixes/suffixes（unhappy, careful）、reading passages 200-350 字

**閱讀短文需要有完整的故事/文章**，不要只寫 "This is a sample passage..."。寫真正的 30-350 字短文（虛構故事或知識類文章），配真正的閱讀理解問題。

---

## 字段標注模式

Toggle 開啟後，在渲染結果上覆蓋標注層：

- 每個可配置字段用 `--annotation` 色（`#FF8A80`）1px dashed 框圈出
- 框左下角有小標籤（8px monospace，`#FF8A80` 背景白色字）
- 標籤內容 = JSON 字段名（如 `instruction_text`、`answer`、`image`）
- hover 標籤時，JSON 面板中對應字段高亮

---

## GitHub Pages 部署

- Repo：`jojo-ela-template-preview`
- `index.html` 在根目錄
- 開啟 GitHub Pages
- README.md 說明使用方式和如何替換真實數據

---

## 品質檢查清單

- [ ] 16 個 Template 全部渲染，無遺漏
- [ ] 每個 Template 的每個 Variant 可切換
- [ ] 視覺風格是暖米白紙本練習冊感（不是冷白 iXL 風格）
- [ ] 手寫格虛線是 `#C8DFE8` 藍灰色（不是灰色）
- [ ] 音頻按鈕是 `#6BB8E8` 天藍圓形（不是灰色方形）
- [ ] 題號是 `#A8D8EA` 淺藍圓圈白色數字
- [ ] 圈選筆跡有手繪不規則感（不是完美幾何圓）
- [ ] 假數據教育上合理（真實的 CVC 字、sight words、短文）
- [ ] 字段標注完整且可 toggle
- [ ] JSON 面板與渲染同步
- [ ] GitHub Pages 網址可訪問

---

## 不需要做的事

- ❌ 不渲染頂部導航列
- ❌ 不需要真正的手寫辨識
- ❌ 不需要真正的音頻播放
- ❌ 不需要做題/計分邏輯
- ❌ 不需要後端/數據庫
- ❌ 不需要 mobile responsive（桌面審校工具）
- ❌ 不需要動畫效果（靜態渲染）

---

*v2 | 2026-03-20 | 變更：移除 Stitch Design 依賴，改由 Claude Code 直接用 frontend-design skill；視覺風格規範內嵌；色系對齊 JOJO Math App 截圖*
