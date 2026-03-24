# JOJO ELA Workbook Library — 框架設計文件

> 本文件說明 43 本 Workbook 圖書館框架的完整設計邏輯。
> 包含：為什麼這麼做、考慮過什麼替代方案、研究數據支撐、教育專家與家長視角的優化。
> 版本：v3.1 | 2026-03-19

---

## 一、產品形態：為什麼選「圖書館書架」而不是「KUMON 線性課程」

### 最終決策

JOJO ELA 採用「**圖書館書架**」模式——家長看到一個按年級分層的書架，每層擺著 6-10 本 Workbook，每本聚焦一個明確主題（如 "Short Vowel Words" 或 "Fiction Comprehension"），點進去做完就算掌握該主題。

**不是**每天推 5 頁、**不是**動態調整難度、**不是** spaced repetition。就是一本本練習冊，選了就做。

### 考慮過的三種模式

| 模式 | 代表產品 | 優點 | 缺點 | JOJO 是否適合 |
|------|---------|------|------|-------------|
| **A. 線性每日推進** | KUMON | 教學邏輯嚴謹；進度可控 | 需要每日習慣養成；不適合 MVP 驗證；開發成本高（需要自適應算法） | ❌ 未來再做 |
| **B. 圖書館書架** | Amazon Workbook / Scholastic | 家長直覺好懂；MVP 最快；每本獨立可售 | 沒有學習路徑引導；家長可能選錯級別 | ✅ 現在做 |
| **C. Skill-based 自由練習** | iXL | 粒度最細；自適應最靈活 | 需要龐大題庫；需要 SmartScore 系統；前端開發重 | ❌ 太重 |

### 選 B 的三個核心理由

**1. MVP 驗證速度**
圖書館模式的最小可行產品是「1 本 Workbook」。上架一本 K 年級 Sight Words，如果家長買單，就驗證了需求。線性課程模式的 MVP 至少需要整個 K 年級的 9 本全部做完才有意義。

**2. 家長心智模型**
銷量數據（附錄 B）顯示，美國家長在 Amazon 搜 "sight words workbook kindergarten"，不是搜 "K level 5 reading program"。家長的購買行為是「按主題選書」而非「報名一個課程」。圖書館模式完全貼合這個行為。

**3. JOJO Math 的現有基礎設施**
JOJO Math 已有「圖書館」功能框架，ELA 可以直接復用。不需要為線性課程重新開發進度系統、解鎖邏輯、每日推送。

### 圖書館模式的已知風險與對策

| 風險 | 對策 |
|------|------|
| 家長不知道從哪本開始 | 每本 Workbook 標注 "Recommended Starting Point" 標籤；後台按 Phonics 進階順序做推薦排序 |
| 孩子做完一本不知道下一本做什麼 | 結算頁推薦「下一本 Workbook」 |
| 沒有復習機制 | MVP 階段不做；未來版本加入 spaced repetition |
| 難度不匹配 | 每本標注 Ages + Grade；未來版本加入 Placement Test |

---

## 二、研究數據摘要

以下是影響框架設計的關鍵研究發現，來自 7 份研究報告的精華。

### 2.1 KUMON 研究精華（01-KUMON）

**KUMON Reading Program 結構：** 23 個 Level，每個 Level 200 頁 worksheet。PreK-G3 涵蓋 12 個 Level（7A → CII），分為 Word Building 和 Sentence Building 兩大區塊。

**核心啟示：**
- KUMON 的 small-step approach 被證明有效——每一步難度增加極小
- KUMON 使用 SCT（Standard Completion Time）作為精熟指標，K 階段 1-2 分鐘/頁，G3 階段 2-4 分鐘/頁
- 閱讀速度目標：2A=50 WCPM → AI=60 → AII=70 → BI=75 → BII=85 → CI=95 → CII=110
- KUMON 的分級是按能力而非年齡——JOJO 可借鑒但在 MVP 階段先用年級分

**我們借鑒了什麼：** Phonics 進階順序（附錄 B 的解鎖樹）、每頁完成時間標準、閱讀速度里程碑

**我們沒有照搬什麼：** 每日一張的線性推進模式、200 頁/level 的厚度、紙筆為主的互動形式

### 2.2 Phonics Worksheet 研究精華（02-Phonics）

**122 份 PDF 樣本分析結果：**
- 美國 K-3 的 Phonics worksheet 有 27 種主要題型
- PreK 主要題型：Letter Recognition, Beginning Sounds, Rhyming
- K 主要題型：CVC Words, Letter-Sound Correspondence, Short Vowels, Word Families
- G1 主要題型：Consonant Blends, Digraphs, CVCe, Vowel Teams
- G2 主要題型：R-Controlled Vowels, Diphthongs, Silent Letters, Multisyllable
- G3 主要題型：Prefixes & Suffixes, Syllable Division, Homophones

**12 種可複用的 Worksheet 設計模式：**
1. 圖片+首字母填空（PreK-K）
2. 單字-圖片配對/連線（K-G1）
3. 讀句子圈目標音（G1-G2）
4. 分類排序（K-G2）
5. 描寫→書寫遞進（PreK-K）
6. Elkonin 聲音盒子（K-G1）
7. CVC→CVCe 變換（G1）
8. 字族階梯（K-G1）
9. 選正確母音組合填入（G2-G3）
10. 同音字句子選擇（G2-G3）
11. 按代碼著色（PreK-G1）
12. 轉盤/骰子遊戲棋盤（K-G2）

### 2.3 Sight Words / Vocabulary 研究精華（03-SightWords）

**兩大體系並行：**
- Dolch 220 字（5 級）— 1936 年，至今仍最普遍用於 K-2
- Fry 1000 字（每 100 一組）— 1957 年，前 100 字覆蓋所有印刷材料的 50%

**K 年級結束應掌握的 Sight Words：~92 字**（Dolch Pre-Primer 40 + Primer 52）

**教學研究發現：一個新字需要在不同語境中遇到 4-14 次才能真正學會**。最有效的練習在同一頁提供 3+ 種不同的練習方式（Read → Trace → Write → Use in Sentence）。

**設計影響：** 每個 Sight Words Unit 都要確保同一批字在 5 頁內出現至少 5-7 次，跨多種互動形式。

### 2.4 Reading Comprehension / Writing 研究精華（04-ReadingComp）

**文章長度隨年級遞增：**

| 年級 | 文章長度 | 問題數 | 回答形式 |
|------|---------|--------|---------|
| PreK | 0-10 字（圖片為主） | 2-3 | 圈選/連線 |
| K | 38-90 字 | 3-5 | 二選一圈選 |
| G1 | 80-120 字 | 3-4 | 短句書寫 |
| G2 | 150-250 字 | 3-5 | 混合（MC+書寫） |
| G3 | 200-350 字 | 4-6 | 段落式書寫 |

**Fiction vs Nonfiction 比例轉折：** G2 是關鍵轉折年級。K=85% Fiction → G1=70% → G2=40% → G3=30%。Common Core 強調 informational text，nonfiction 比重持續上升。

**Writing 題型演進：** K=看圖寫一句 → G1=句型+標點 → G2=段落入門 → G3=多段落+Opinion/Narrative/Informational 三種文體

### 2.5 CCSS 標準研究精華（05-Standards）

**CCSS 覆蓋 ~40 個州**，是美國最廣泛採用的教學標準。未採用的州（Texas 的 TEKS、Virginia 的 SOL、Alaska、Nebraska）的標準在 K-3 ELA 核心內容上與 CCSS 高度重疊。

**六大 Strand 中，JOJO ELA 覆蓋五個：**
- ✅ RF (Reading: Foundational Skills) — Phonics 系列 Workbook
- ✅ RL (Reading: Literature) — Fiction Reading Workbook
- ✅ RI (Reading: Informational Text) — Nonfiction Reading Workbook
- ✅ L (Language) — Vocabulary, Grammar, Spelling Workbook
- ✅ W (Writing) — Writing Workbook
- ❌ SL (Speaking & Listening) — 不做（麥克風設備差異太大）

**關鍵 CCSS 節點：**
- RF 只到 G5，其中 Print Concepts 和 Phonological Awareness 到 G1 結束
- G2 開始沒有 RF.x.1 和 RF.x.2，只剩 Phonics(RF.x.3) 和 Fluency(RF.x.4)
- 這解釋了為什麼 G2-G3 的 Phonics workbook 數量驟降

### 2.6 iXL ELA 研究精華（06-iXL）

**iXL PreK-G3 共 1,040 個獨立 Skill**，按 Section → Category → Skill 三層組織。

**Skill 粒度模式（以 Short A 為例）：**
- PreK: 2 skills（看圖選字：大寫版 + 小寫版）
- K: 3 skills（選字 + 填空 + 選句）
- G1: 4 skills（選字 + 讀 word family + 填空 + 選句）
- 規律：receptive → productive → contextual，逐年級增加

**iXL 的 SmartScore 系統：**
- 不是簡單正確率，而是考慮連續正確的穩定性
- 80 分 = Proficiency，100 分 = Mastery
- 90→100 分進入 Challenge Zone，答對 +1-2 分、答錯 -3-8 分

**我們借鑒了什麼：** Domain 分類邏輯、同一概念多互動形式的設計、CCSS 對標方式
**我們沒有照搬什麼：** 1,040 個 micro-skill 的粒度（太碎）、SmartScore 算法（MVP 不需要）

### 2.7 Workbook 市場銷量研究精華（07-Market）

**美國兒童教育書市：~35 億美元/年**，workbook/study aids 是成長最快的子品類。

**主題銷量排行：** Sight Words > Phonics > Mixed ELA > Letters > Reading Comp > Writing > Spelling > Vocabulary

**最大購買年級：Kindergarten**。評論數最高的產品集中在 K 年級。

**暢銷書定價：每頁 $0.03-0.10，中位數 $0.05-0.07**

**家長最常抱怨的 Top 3：**
1. "Too easy / not challenging enough" — 難度設計不足
2. "Too repetitive / boring" — 練習形式單調
3. "No answer key" — 沒有即時回饋

**最佳上線時機：4-5 月**（搶 Summer Bridge + Back-to-School 雙高峰）

---

## 三、教育專家視角的 3 個優化

### 優化 1：PreK 增加一本 Print Awareness Workbook

**問題：** 原框架 PreK 直接從字母開始，跳過了 Print Concepts（RF.K.1）——「文字從左到右」「字和字之間有空格」「書有封面和頁碼」這些閱讀前概念。CCSS RF.K.1 明確要求這些技能，且 KUMON 的 7A Level 也是從「指著圖片認字」開始，不是從字母開始。

**優化：** PreK 增加 **PK-0: Book & Print Basics**（書本與文字入門），放在 PK-1 之前。內容包含：左右翻頁方向、文字從左到右的追蹤、辨認書的封面/標題/頁碼、區分字母/字/句子。這是 CCSS RF.K.1.a-c 的預備，也確保最年幼的孩子有正確的起點。

**跨州覆蓋：** 即使 Texas（TEKS）和 Virginia（SOL）不用 CCSS，它們的 PreK Guidelines 也包含 Print Awareness。這個 Workbook 在所有州都適用。

### 優化 2：G1 Writing 從 1 本拆為 2 本——Handwriting 與 Sentence Writing 分離

**問題：** 原框架 G1 的 Writing 只有 1 本（G1-7 Sentence Writing），但 CCSS L.1.1.a 明確要求「Print all upper- and lowercase letters」。G1 孩子的 handwriting 技能差異極大——有些孩子字母都沒寫熟就被要求寫句子，認知負荷太高。iXL 的 G1 也把 letter formation 和 sentence construction 分開放在不同 Category。

**優化：** G1 增加 **G1-7a: Handwriting Practice**（字母書寫練習），原 G1-7 重新編號為 G1-7b。Handwriting 這本專練大小寫字母的正確書寫、字母間距、在格線上書寫。這本 Workbook 高度利用 JOJO 的 Apple Pencil 手寫辨識引擎——這正是 JOJO 相對於紙本 workbook 的核心差異化。

**跨州覆蓋：** 每一個州的 G1 標準都包含 handwriting/letter formation。Texas TEKS 1.2.A 明確要求 "print upper- and lowercase letters legibly"。

### 優化 3：G2-G3 的 Reading Comprehension 加入 Paired Passages 與 Cross-Curricular 主題

**問題：** 原框架 G3 有一本獨立的 "Compare Texts"（G3-4），但 G2 沒有。然而，CCSS RI.2.9 就已經要求「Compare and contrast the most important points presented by two texts on the same topic」。此外，K12Reader 的 G2-G3 研究顯示，暢銷 Reading Comp workbook 的核心差異化是 cross-curricular 主題（科學、社會、歷史），而非純文學故事。

**優化：**
- G2-5 Nonfiction Comprehension 增加一個 Unit 專門做 "Compare Two Texts on the Same Topic"（從 5 units 增為 6 units, 30 頁）
- G2 和 G3 的 Reading Comp workbook 的短文主題明確標注跨學科領域（Science / Social Studies / Health / Arts），在 Workbook subtitle 中體現。例如 G2-5 的 subtitle 從 "Read to learn" 改為 "Read to learn — science, history & the world around you"
- G3-3 的 subtitle 同步調整

**跨州覆蓋：** CCSS RI.2.9 和 RI.3.9 都要求 paired passage 比較。Texas TEKS 也有對應要求（2.6.H, 3.6.H）。Cross-curricular 是 Next Generation Science Standards (NGSS) 和 C3 Social Studies Framework 倡導的整合方向。

---

## 四、家長視角的 3 個優化

### 優化 1：每本 Workbook 加上 Age Range 標示，不只標 Grade

**問題：** 美國家長搜 workbook 時，搜「Ages 4-6」的頻率高於搜「Pre-K」。Amazon 暢銷書分析顯示，"Ages X-X" 是出現頻率最高的賣點關鍵詞（★★★★★）。很多 homeschool 家長的孩子不按年級分，用年齡更直覺。

**優化：** 每本 Workbook 同時標注 Grade 和 Age Range。

| Grade | Age Range |
|-------|-----------|
| Pre-K | Ages 3-5 |
| K | Ages 5-6 |
| G1 | Ages 6-7 |
| G2 | Ages 7-8 |
| G3 | Ages 8-9 |

在圖書館的卡片 UI 上，Grade 是主標籤，Age 是副標籤。

### 優化 2：Title 和 Subtitle 改用「家長搜尋語言」而非教學術語

**問題：** 原框架有些 Title 太學術——"R-Controlled Vowels & Diphthongs"、"Syllable Mastery"、"Print Awareness"。普通家長不知道這些詞是什麼意思。銷量研究顯示，評論數最高的 workbook 用的是平易近人的語言——"Learn to Read"、"101 Fun Activities"、"Sound it out!"。

**優化：** 所有 Title 和 Subtitle 遵循以下原則：
- Title 用家長能懂的日常語言
- Subtitle 用動詞開頭，描述孩子會做什麼
- 保留教學術語作為 tag/metadata，不放在 Title 中

優化前後對比範例：

| 原 Title | 優化後 Title | 優化後 Subtitle |
|---------|------------|----------------|
| R-Controlled Vowels & Diphthongs | **Tricky Vowel Sounds** | When r changes the vowel — ar, or, er & more |
| Syllable Mastery | **Break Big Words Apart** | Split long words into parts and read them with ease |
| Advanced Phonics | **Tricky Spelling Patterns** | Soft c, silent letters & vowel surprises |
| Grammar Foundations | **How Sentences Work** | Nouns, verbs & building sentences that make sense |
| Fiction Comprehension: Deep Reading | **Story Detectives** | Find themes, character clues & hidden meanings |
| Nonfiction Comprehension: Think & Analyze | **Read & Discover** | Explore science, history & the world through reading |

### 優化 3：每本 Workbook 封面增加「What Your Child Will Learn」清單

**問題：** 家長在 Amazon 的評論中高頻提到 "Not enough explanation for parents"。家長想知道：這本 workbook 到底教什麼？做完之後孩子能多會什麼？但很多 workbook 的封面只有一個模糊的標題。

**優化：** 每本 Workbook 的封面/詳情頁增加一個「What Your Child Will Learn」bullets（3-5 個），用家長語言寫，不用 CCSS 編號。

範例（K-1 Short Vowel Words）：
```
✓ Sound out and read 3-letter words like cat, bed, pig
✓ Tell the difference between short a, e, i, o, u sounds
✓ Write CVC words from pictures and sounds
✓ Read simple sentences using CVC words
✓ Build confidence for reading longer words
```

這個資訊同時出現在：圖書館的 Workbook 卡片預覽、Workbook 首頁、App Store 的截圖。

---

## 五、年級區別的設計邏輯

### 為什麼 PreK 只有 6 本而 G2-G3 有 10 本？

這反映了美國 ELA 教學的自然結構——**年級越高，domain 越多**：

| Grade | 活躍 Domain 數 | 原因 |
|-------|--------------|------|
| PreK | 3（Phonics, Letters, Vocabulary） | 孩子還在建立最基礎的聲音和字母概念，不需要閱讀理解和寫作 |
| K | 4（Phonics, Sight Words, Reading, Writing） | 開始拼讀和認字，閱讀理解和寫作剛萌芽 |
| G1 | 5（+Fluency） | Phonics 進入 CVCe/Vowel Teams 複雜期，Reading Comp 獨立，Fluency 開始計時 |
| G2 | 6（+Vocabulary, Grammar） | 「learning to read → reading to learn」轉折，Spelling/Grammar 獨立出現 |
| G3 | 7（+Poetry/Literary） | Phonics 收尾，Reading Comp 主導，Writing 分文體，Literary devices 入門 |

### 為什麼 Phonics 從 PreK 的 3 本降到 G3 的 1 本？

這是 Science of Reading 的核心規律——**解碼能力（Decoding）在 G1 之前是主角，之後逐漸交棒給理解能力（Comprehension）**：

```
Phonics workbook 數量：
PreK ████████ 3本
K    ████████████ 4本（峰值）
G1   █████████ 3本
G2   █████ 2本
G3   ██ 1本（只剩前後綴/多音節收尾）
```

```
Reading Comp workbook 數量：
PreK  0本
K    ██ 1本
G1   █████ 2本
G2   █████ 2本
G3   ██████████ 3本（峰值）
```

這個交叉點在 G1-G2 之間，跟 KUMON 的 Level 3A→2A→AI 轉折一致，也跟市場數據（G2 開始 Reading Comp 銷量超過 Phonics）一致。

### 為什麼 Sight Words 只出到 G2 就停了？

Dolch + Fry 的研究數據顯示：
- K 結束掌握 ~92 字（Dolch Pre-Primer 40 + Primer 52）
- G1 結束掌握 ~200 字（+ Dolch 1st Grade 41 + Fry 101-200）
- G2 掌握 Fry 201-300 + 開始用 prefix/suffix 推測新字

到 G3，孩子應該已經轉向用**字彙策略**（context clues, word parts, dictionary）認識新字，而不是靠死記 sight words。所以 G3 沒有獨立 Sight Words workbook，取而代之的是 Vocabulary Strategies（G3-5）。

這也跟 Amazon 銷量數據一致：Sight Words workbook 在 G3 幾乎沒有獨立市場。

---

## 六、最終 Workbook 清單（43+3 優化 = 46 本）

經過教育專家和家長視角的優化，最終框架從 43 本調整為 **46 本**：
- PreK 從 5 本增為 **6 本**（+PK-0 Print Awareness）
- G1 從 9 本增為 **10 本**（Writing 拆為 Handwriting + Sentence Writing）
- G2 的 Nonfiction Comp 從 25 頁增為 30 頁（+1 unit Paired Passages）
- 所有 Title/Subtitle 按家長語言優化
- 所有 Workbook 加上 Age Range

完整清單見附件 CSV。

---

## 七、下一步

| 項目 | 優先級 | 說明 |
|------|--------|------|
| 選定 MVP 首批 3 本 Workbook | P0 | 建議 K-1 + K-5 + K-3（Short Vowels + Sight Words + Digraphs） |
| 設計每頁的題型和互動細節 | P0 | 從 MVP 3 本開始，每頁的 interaction + item_count + layout |
| 圖片素材需求清單 | P1 | 第一批 3 本大約需要 200-300 張插圖 |
| TTS 音頻生成 | P1 | LISTEN 類型的頁面需要的音頻列表 |
| Workbook 封面設計 | P1 | 確定視覺風格（卡通角色 + 鮮豔色彩 = 市場最受歡迎） |
| 家長端結算頁設計 | P2 | Unit 完成後的成績呈現 + 下一本推薦 |

---

*文件版本 v3.1 | 2026-03-19*
