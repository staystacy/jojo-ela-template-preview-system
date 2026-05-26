# JSON Fix Required — T-TRACE Word variant 8/9/10

> 日期：2026-05-26  
> 範圍：8 workbook，67 個 page  
> 對接：給「page JSON 修正 session」處理；preview tool repo 的 renderer + translator 已修好，4-word / 1-word 都會 fallback 渲染（取前 2 word + console.warn），畫面不會崩，可邊修邊驗。

## 背景

T-TRACE Word variant 8（Shadow Writing）/ variant 9（Guided to Freehand）/ variant 10（Freehand Writing）spec 規定每頁 4 cells = **2 word × 2 cells**（每 word 描兩次）。JSON `wordsList` 應該是 **長度 2** 的陣列。

spec：
- file:///Users/stacywang/Desktop/JOJO-Worksheet-Research/Framework/ELA-Template-json.html#8-shadow-writing---word-4-cells
- file:///Users/stacywang/Desktop/JOJO-Worksheet-Research/Framework/ELA-Template-json.html#9-guided-to-freehand---word-4-cells
- file:///Users/stacywang/Desktop/JOJO-Worksheet-Research/Framework/ELA-Template-json.html#10-freehand-writing---word-4-cells

## 待修清單

### A. K / G1 系列（5 workbook, 23 page）— wordsList.length=4，要砍 2

每 page 跟教研對齊「保留哪 2 word」（通常是 phonics skill 最代表的兩個）。

| Workbook | Page | guideMode | 現有 wordsList (4 word) | 該保留 (待教研定) |
|----------|------|-----------|------------------------|-------------------|
| G1-1 | U01_P01 | All Guide | cake, make, name, lake | _____, _____ |
| G1-1 | U02_P01 | All Guide | bike, kite, time, nine | _____, _____ |
| G1-1 | U03_P01 | All Guide | bone, home, note, rose | _____, _____ |
| G1-1 | U04_P01 | Guided to Freehand | cube, tube, cute, mule | _____, _____ |
| G1-2 | U01_P01 | All Guide | rain, train, paint, mail | _____, _____ |
| G1-2 | U02_P01 | All Guide | tree, bee, feet, sheep | _____, _____ |
| G1-2 | U03_P01 | All Guide | boat, coat, road, goat | _____, _____ |
| G1-2 | U04_P01 | Guided to Freehand | snow, blow, slow, grow | _____, _____ |
| K-1a | U01_P01 | All Guide | cat, hat, map, bag | _____, _____ |
| K-1a | U02_P01 | All Guide | van, fan, bat, can | _____, _____ |
| K-1a | U03_P01 | All Guide | pig, pin, sit, bib | _____, _____ |
| K-1a | U04_P01 | Guided to Freehand | dig, fin, hit, kid | _____, _____ |
| K-1a | U05_P01 | Free | cat, pig, hat, kid | _____, _____ |
| K-1b | U01_P01 | All Guide | box, dog, fox, hop | _____, _____ |
| K-1b | U02_P01 | All Guide | hot, log, mop, box | _____, _____ |
| K-1b | U03_P01 | All Guide | bug, bus, cup, cut | _____, _____ |
| K-1b | U04_P01 | Guided to Freehand | gum, hug, jug, bug | _____, _____ |
| K-1b | U05_P01 | Free | bed, hen, net, pen | _____, _____ |
| K-2 | U01_P01 | All Guide | cat, hat, bat, mat | _____, _____ |
| K-2 | U02_P01 | All Guide | pig, big, dig, wig | _____, _____ |
| K-2 | U03_P01 | All Guide | top, hop, mop, pop | _____, _____ |
| K-2 | U04_P01 | All Guide | bug, hug, jug, mug | _____, _____ |
| K-2 | U05_P01 | All Guide | hen, men, pen, ten | _____, _____ |

### B. PK-3 系列（3 workbook, 44 page）— wordsList.length=1，要補 1

每 page 跟教研對齊「補哪 1 word」（同主題 / 同 word family / 同 sight word 階段）。

#### PK-3a (Family & Body Words) — 15 page
| Page | 現有 (1 word) | 該補的第 2 word (待教研定) |
|------|--------------|---------------------------|
| U01_P01 | mom | _____ |
| U01_P02 | dad | _____ |
| U01_P03 | baby | _____ |
| U02_P01 | sister | _____ |
| U02_P02 | brother | _____ |
| U02_P03 | grandma | _____ |
| U03_P01 | head | _____ |
| U03_P02 | eyes | _____ |
| U03_P03 | ears | _____ |
| U04_P01 | mouth | _____ |
| U04_P02 | hands | _____ |
| U04_P03 | feet | _____ |
| U05_P01 | shirt | _____ |
| U05_P02 | pants | _____ |
| U05_P03 | coat | _____ |

#### PK-3b (Animals & Food) — 15 page
| Page | 現有 (1 word) | 該補的第 2 word (待教研定) |
|------|--------------|---------------------------|
| U01_P01 | dog | _____ |
| U01_P02 | cat | _____ |
| U01_P03 | bird | _____ |
| U02_P01 | fish | _____ |
| U02_P02 | cow | _____ |
| U02_P03 | horse | _____ |
| U03_P01 | milk | _____ |
| U03_P02 | apple | _____ |
| U03_P03 | bread | _____ |
| U04_P01 | egg | _____ |
| U04_P02 | cake | _____ |
| U04_P03 | water | _____ |
| U05_P01 | car | _____ |
| U05_P02 | bus | _____ |
| U05_P03 | train | _____ |

#### PK-3c (Colors & Shapes) — 14 page
| Page | 現有 (1 word) | 該補的第 2 word (待教研定) |
|------|--------------|---------------------------|
| U01_P01 | red | _____ |
| U01_P02 | blue | _____ |
| U01_P03 | yellow | _____ |
| U02_P01 | green | _____ |
| U02_P02 | black | _____ |
| U02_P03 | white | _____ |
| U03_P01 | circle | _____ |
| U03_P02 | square | _____ |
| U04_P01 | one | _____ |
| U04_P02 | two | _____ |
| U04_P03 | three | _____ |
| U05_P01 | sun | _____ |
| U05_P02 | rain | _____ |
| U05_P03 | snow | _____ |

## 沒受影響（已是 spec-perfect 2-word）

- **K-3**：U01_P01 (ship/shop), U02_P01 (chip/chop), U03_P01 (this/that), U04_P01 (wish/cash), U05_P01 (this/that)
- **K-4**：U01_P01 (black/block), U02_P01 (stop/stag), U03_P01 (frog/Fred), U04_P01 (snap/snip), U05_P01 (step/stick)

K-3 / K-4 的 trace_word page 是後期生成的，已對齊 spec — 不必動。

## 修法流程

對每個 workbook 一批處理：

1. 跟教研對齊每 page 的「2 word 決定」（填上表的空白欄）
2. 改 page JSON（路徑 `/Users/stacywang/Desktop/JOJO-Worksheet-Research/03-Preview-Tool/data/workbooks/<WB>/U??_P??.json`），把 `englishLetterTopicList[0].wordsList` 變成 length-2 陣列
3. 對保留的每個 word，確認：
   - `imageName` 對應的 `.webp` 在 `/Users/stacywang/Desktop/JOJO-Worksheet-Research/10-Final-Assets/images/word/` 存在
   - `audioName` 對應的 `.mp3` 在 `/Users/stacywang/Desktop/JOJO-Worksheet-Research/10-Final-Assets/audio/word/` 存在
   - 缺檔的 word 列出來給 producer 補（不要直接放上去否則 audit 會報 missing）
4. 跑 audit 驗：
   ```
   cd "/Users/stacywang/Desktop/Code Project/jojo-ela-template-preview-system"
   node scripts/audit-workbook.mjs <WB>
   ```
   看 C 段所有 `wordsList.length=X (spec: 2)` warning 全消即完成。

## 邊界

- 不要動 preview tool repo 的 renderer / translator code（已修，fallback 對 4-word / 1-word 都不崩）
- 不要動 spec doc
- 只動 page JSON
- commit 建議：`fix(data): align T-TRACE Word wordsList.length to spec (2 per page) — <WB>`
- research repo 確認 git managed 再 commit，沒 git 就單純存檔
