# JOJO ELA — Template System v2（精简版）

> 16 个 Template × Variant 参数控制 = 覆盖 45 本 Workbook
> 全设备一致体验（iPad + iPhone）
> 版本：v2.0 | 2026-03-20

---

## 核心规则

### 产品约束
- **5 页结算**：做题过程无即时反饋，写完一个 Unit（5 页）统一批改
- **全设备一致**：iPad 和 iPhone 体验相同，没有「iPad 专属」题目
- **进度条已有**：Template 不涉及导航/进度条设计

### 书写交互规则

| 书写内容 | 交互方式 | iPad | iPhone |
|---------|---------|------|--------|
| 单个字母 | ✏️ 手写 | 全屏书写 | 小白板 |
| 单字（1-6 字母） | ✏️ 手写 | 全屏书写 | 小白板 |
| 句子（7+ 字母） | ⌨️ Typing | 弹键盘 | 弹键盘 |
| 段落 | ⌨️ Typing | 弹键盘 | 弹键盘 |

### 每本 Workbook 的 Template 使用规则
- 一本 Workbook（20-30 页）至少出现 **4-5 种不同 Template**
- 同一 Template 在一本 Workbook 中最多 **3-4 次**（可用不同 Variant）
- 同一 Unit（5 页）内至少 **2-3 种 Template** 交替

### Variant 控制维度

| 维度 | 代码 | 说明 | 示例 |
|------|------|------|------|
| Scaffold | `scaffold` | 书写辅助程度 | trace → faded → blank |
| Quantity | `qty` | 每页题数/选项数 | 4 → 6 → 8 |
| Audio | `audio` | 音频触发方式 | none → tap_to_play → auto_instruction |
| Visual | `visual` | 图片提示有无 | image → image+word → word_only |
| Cell Size | `cell_size` | 手写格尺寸 | PK=56px / K=48px / G1+=40px |
| Input | `input` | 输入方式 | handwrite → type |

### 🔊 音频按钮统一规范
- 尺寸：**36×36px**
- 位置：始终在该题的**左侧固定位置**
- 所有带音频的 Template 统一此规范

---

## Template 总览（16 个）

| # | ID | 名称 | 孩子做什么 | 输入方式 | 适用年级 |
|---|-----|------|-----------|---------|---------|
| 1 | T-TRACE | 描红递进 | 沿虚线描写字母/单字，同一 Unit 内从描红→淡色→空白递进 | ✏️ 手写 | PreK-G1 |
| 2 | T-WRITE | 独立书写 | 看图/听音，在格子中写字母或单字 | ✏️ 手写 | PreK-G3 |
| 3 | T-SOUNDBOX | 声音盒 | 看图/听音，逐格填入音素对应字母 | ✏️ 手写 | K-G2 |
| 4 | T-BLEND | 音素合成 | 逐个听音素，拼写出完整单字 | ✏️ 手写 | PreK-G1 |
| 5 | T-CIRCLE | 圈选 | 用笔在正确答案上画圈 | ✏️ 圈选 | PreK-G3 |
| 6 | T-MATCH | 连线 | 从左到右画线连接配对项 | ✏️ 画线 | PreK-G3 |
| 7 | T-SORT | 拖拽分类 | 把卡片拖到正确分类桶 | 👆 拖拽 | K-G3 |
| 8 | T-FILLIN | 填空 | 在不完整的字/句中手写填入缺少部分 | ✏️ 手写 | K-G3 |
| 9 | T-LISTEN | 听音作答 | 听音频后圈选或手写 | ✏️ 圈/写 | PreK-G2 |
| 10 | T-FINDWORD | 找字圈选 | 在字阵或段落中找出并圈出目标字 | ✏️ 圈选 | K-G2 |
| 11 | T-LADDER | 字族阶梯 | 换首字母造新字，逐级向上 | ✏️ 手写 | K-G1 |
| 12 | T-PASSAGE | 短文阅读 | 读短文，圈选或打字回答问题 | ✏️ 圈 + ⌨️ 打字 | K-G3 |
| 13 | T-SEQUENCE | 排序 | 把打乱的图片/句子拖到正确顺序 | 👆 拖拽 | PreK-G3 |
| 14 | T-SENTENCE | 句子书写 | 看提示，用键盘打出句子 | ⌨️ Typing | K-G3 |
| 15 | T-FIXUP | 改错 | 圈出句中错误 + 键盘打出正确版本 | ✏️ 圈 + ⌨️ 打字 | G1-G3 |
| 16 | T-TRANSFORM | 变换 | 按规则把字/词变成另一个 | ✏️ 手写（单字）/ ⌨️ 打字（句子） | G1-G3 |

---

## 各 Template 详细规格

### 1. T-TRACE — 描红递进

**Layout：** 左侧示范区（笔顺动画位置）+ 右侧 2×4 手写格，从左到右支架递减

**关键设计：同一 Unit 内体现递进**
- Page 1: 全格描红
- Page 2-3: 首格描红 + 后续淡色
- Page 4-5: 首格描红 + 后续空白

| Variant | scaffold | audio | cell_size | 适用年级 | 用于 |
|---------|----------|-------|-----------|---------|------|
| v1 | trace→faded→blank（字母） | 点示范区听发音 | PK=56 / K=48 | PreK-K | PK-1, K-5 |
| v2 | trace→faded→blank（CVC 单字） | 点示范区听发音+例句 | K=48 / G1=40 | K-G1 | K-5, K-6, G1-4 |

**字段规格：**
```
instruction_audio: "Trace the letter. Say its sound."
demo_area: { content: "b", animation: stroke_order, audio: phoneme }
cells: [ {scaffold: "trace"}, {scaffold: "faded"}, {scaffold: "blank"}, ... ]
```

---

### 2. T-WRITE — 独立书写

**Layout：** 上方提示区（图片/音频/文字）+ 下方排列多组手写格

| Variant | 提示方式 | 写什么 | qty | 适用年级 | 用于 |
|---------|---------|-------|-----|---------|------|
| v1 | 图片 + 首字母提示 | 单字母 | 6-8 | PreK-K | PK-2, PK-3 |
| v2 | 图片（无提示） | 完整单字 | 4-6 | K-G1 | K-1, G1-1 |
| v3 | 🔊 听音 | 完整单字 | 4-6 | K-G2 | K-3, G1-3 |
| v4 | 文字定义/提示 | 单字 | 4-6 | G2-G3 | G2-3, G3-6 |

**字段规格：**
```
items: [
  { prompt_image: "cat.png", prompt_audio: "cat.mp3", hint: "c__", answer: "cat" },
  ...
]
```

---

### 3. T-SOUNDBOX — 声音盒

**Layout：** 每行 = 图片 + 🔊 + 3-5 个连续方格。一页 4-6 行。

**K 入门版（v1）支持逐格语音引导：** 点 🔊 后系统逐格高亮并播放对应音素。

| Variant | 格数 | 预填 | audio | 适用年级 | 用于 |
|---------|------|------|-------|---------|------|
| v1 | 3 (CVC) | 部分字母已填 | 逐格音素引导 | K | K-1 前 1-2 Unit |
| v2 | 3 (CVC) | 全空白 | 点图听完整字 | K-G1 | K-1, K-2 |
| v3 | 4 (CCVC/CVCC) | 全空白 | 点图听完整字 | K-G1 | K-3, K-4 |
| v4 | 4-5 (CVCe/VT) | 全空白 | 点图听完整字 | G1-G2 | G1-1, G1-2 |

**字段规格：**
```
items: [
  { image: "cat.png", audio: "cat.mp3", phonemes: ["k","æ","t"], boxes: 3, prefill: ["c","",""] },
  ...
]
```

---

### 4. T-BLEND — 音素合成（新增）

**Layout：** 每行 = 3-4 个音素按钮（各自可点听）+ 箭头 → 单字书写区。一页 4-6 行。

**与 T-SOUNDBOX 的区别：** SOUNDBOX 是拆（字→音素），BLEND 是拼（音素→字）。方向相反。

| Variant | 音素数 | 图片提示 | 适用年级 | 用于 |
|---------|-------|---------|---------|------|
| v1 | 2 (onset+rime) | 有图片 | PreK | PK-2, PK-3 |
| v2 | 3 (CVC) | 有图片 | K | K-1, K-9 |
| v3 | 4 (CCVC) | 无图片 | K-G1 | K-4, G1-9 |

**字段规格：**
```
items: [
  { phoneme_audios: ["k.mp3","æ.mp3","t.mp3"], image: "cat.png", answer: "cat" },
  ...
]
```

---

### 5. T-CIRCLE — 圈选

**Layout：** 指令区 + Grid 排列选项卡（图片/文字），孩子画圈选择

**最高频 Template——几乎所有 Workbook 都会用到。**

| Variant | 选项内容 | qty | audio | 适用年级 | 用于 |
|---------|---------|-----|-------|---------|------|
| v1 | 图片 | 4 | 语音指令 | PreK-K | PK-2, PK-5, K-1 |
| v2 | 图片+文字 | 4-6 | 点触发音 | K-G1 | K-3, G1-1 |
| v3 | 纯文字（单字） | 6-8 | 可选 | K-G2 | K-5, G1-4, G2-1 |
| v4 | 短段落中圈字 | 段落(6-8 目标词) | 无 | G1-G3 | G1-6, G2-4, G3-8 |
| v5 | 多选（圈所有正确的） | 6-10 | 无 | G1-G3 | G2-5, G3-3 |

**字段规格：**
```
instruction: "Circle the picture that starts with /sh/."
instruction_audio: "circle_sh.mp3"
options: [
  { content: "ship.png", type: "image", correct: true, audio: "ship.mp3" },
  { content: "cat.png", type: "image", correct: false, audio: "cat.mp3" },
  ...
]
select_mode: "single" | "multi"
```

---

### 6. T-MATCH — 连线

**Layout：** 左栏 + 右栏，中间画线。PreK=3 对，K=4 对，G1+=5-6 对。

| Variant | 左栏 | 右栏 | audio | 适用年级 | 用于 |
|---------|------|------|-------|---------|------|
| v1 | 大写字母 | 小写字母 | 点触发音 | PreK | PK-1 |
| v2 | 单字 | 图片 | 点触发音 | PreK-K | PK-3, K-1 |
| v3 | 🔊 音频 | 单字/图片 | 点左听音 | K-G1 | K-3, G1-3 |
| v4 | 单字 | 单字(同/反义) | 无 | G1-G3 | G2-6, G3-5 |

**字段规格：**
```
pairs: [
  { left: {content:"cat", type:"word", audio:"cat.mp3"}, right: {content:"cat.png", type:"image"} },
  ...
]
max_pairs: { PreK: 3, K: 4, G1: 5, G2: 6 }
```

---

### 7. T-SORT — 拖拽分类

**Layout：** 上方散布字卡 + 下方 2-3 个分类桶

| Variant | 卡片 | 桶数 | qty | 适用年级 | 用于 |
|---------|------|------|-----|---------|------|
| v1 | 图片卡 | 2 | 6-8 | K | PK-4, K-2 |
| v2 | 单字卡 | 2 | 6-8 | K-G1 | K-3, G1-1 |
| v3 | 单字卡 | 3 | 8-10 | G1-G2 | G1-2, G2-1 |
| v4 | 句子/短语 | 2-3 | 4-6 | G2-G3 | G2-5, G3-8 |

**字段规格：**
```
buckets: [ {label:"sh", id:"sh"}, {label:"ch", id:"ch"} ]
cards: [
  { content: "ship", type: "word", correct_bucket: "sh" },
  { content: "chin", type: "word", correct_bucket: "ch" },
  ...
]
```

---

### 8. T-FILLIN — 填空

**Layout：** 每行 = 图片(可选) + 不完整字/句 + 手写填空格。一页 4-8 行。

| Variant | 填什么 | 提示 | input | 适用年级 | 用于 |
|---------|-------|------|-------|---------|------|
| v1 | 首字母 | 图片 + _at | ✏️ 手写 | PreK-K | PK-2, K-2 |
| v2 | 中间母音 | 图片 + c_t | ✏️ 手写 | K-G1 | K-1 |
| v3 | 整个单字 | 句子空格 + word bank | ✏️ 手写 | K-G2 | K-5, G1-4 |
| v4 | 字母组合(digraph/blend) | 图片 + ___ip | ✏️ 手写 | K-G2 | K-3, G2-1 |
| v5 | 前/后缀 | 字根 + 空格 | ✏️ 手写 | G2-G3 | G2-7, G3-1 |

**字段规格：**
```
items: [
  { 
    image: "cat.png",
    display: "c_t",
    blank_position: 1,
    blank_length: 1,
    answer: "a",
    word_bank: null,
    audio: "cat.mp3"
  },
  ...
]
```

---

### 9. T-LISTEN — 听音作答

**Layout：** 每题 = 🔊 按钮 + 作答区（圈选或手写）

| Variant | 听什么 | 做什么 | input | 适用年级 | 用于 |
|---------|-------|-------|-------|---------|------|
| v1 | 单音素 | 从 4 个字母中圈选 | ✏️ 圈 | PreK | PK-2 |
| v2 | 单字 | 从 4 张图中圈选 | ✏️ 圈 | PreK-K | PK-3, K-1 |
| v3 | 单字 | 手写听到的字 | ✏️ 手写 | K-G2 | K-9, G1-8 |
| v4 | 句子 | 打字听到的句子 | ⌨️ Typing | G1-G3 | G1-8, G2-9, G3-9 |

**字段规格：**
```
items: [
  {
    audio: "cat.mp3",
    audio_type: "word",
    response_type: "circle",
    options: [ {content:"cat.png", correct:true}, ... ],
    answer: "cat"
  },
  ...
]
```

---

### 10. T-FINDWORD — 找字圈选

**Layout：** 顶部显示目标字 + 下方字阵或段落

| Variant | 搜索区域 | 目标字数 | 适用年级 | 用于 |
|---------|---------|---------|---------|------|
| v1 | 5×5 字阵 | 2-3 个 | K | K-5, K-6 |
| v2 | 6×6 字阵 | 3-4 个 | K-G1 | K-6, G1-4 |
| v3 | 短段落 | 圈出所有目标词 | G1-G2 | G1-4, G2-7 |

**字段规格：**
```
target_words: ["the", "said", "was"]
grid: [["the","cat","big","said","run"], ["and","was","the","for","see"], ...]
// 或 paragraph 模式:
paragraph: "The cat said it was time to go. The dog said it was not."
```

---

### 11. T-LADDER — 字族阶梯

**Layout：** 阶梯结构，每阶 = 首字母提示 + 手写格 + 图片。一页 2 组（各 5 阶）。

| Variant | 字根类型 | 阶数 | 适用年级 | 用于 |
|---------|---------|------|---------|------|
| v1 | CVC 字族 (-at, -ig) | 5 | K | K-2 |
| v2 | 混合字族 | 5-6 | K-G1 | K-2, G1-9 |

**字段规格：**
```
ladders: [
  {
    word_family: "-at",
    rungs: [
      { hint: "h", answer: "hat", image: "hat.png" },
      { hint: "b", answer: "bat", image: "bat.png" },
      ...
    ]
  }
]
```

---

### 12. T-PASSAGE — 短文阅读+作答

**Layout：** 左半 = 短文区（带插图，G2+ 支持 Apple Pencil 草稿标注）+ 右半 = 问答区

| Variant | 文长 | 回答方式 | 题数 | 回答行数 | 适用年级 | 用于 |
|---------|------|---------|------|---------|---------|------|
| v1 | 30-50 字+大图 | ✏️ 圈选(二选一) | 3 | — | K | K-7 |
| v2 | 60-100 字 | ✏️ 圈选 + ⌨️ 短打字 | 3-4 | 1 行 | G1 | G1-5, G1-6 |
| v3 | 100-200 字 | ⌨️ 打字 | 4-5 | 2 行 | G2 | G2-4, G2-5 |
| v4 | 200-350 字 | ⌨️ 打字 | 4-5 | 3-4 行 | G3 | G3-2, G3-3 |
| v5 | 两篇对照(各100-150字) | ⌨️ 打字 | 3-4 | 2-3 行 | G2-G3 | G2-5, G3-4 |
| v6 | NF + 图表 | ⌨️ 打字 | 4-5 | 2 行 | G2-G3 | G2-5, G3-3 |

**字段规格：**
```
passage: {
  title: "The Red Bird",
  text: "A little red bird sat on a tree...",
  image: "red_bird.png",
  word_count: 45,
  genre: "fiction",
  allow_annotation: true  // G2+ 草稿标注
}
questions: [
  {
    question: "Where did the bird sit?",
    question_audio: null,
    response_type: "circle",
    options: [{text:"on a tree", correct:true}, {text:"in a nest", correct:false}],
    answer: null
  },
  {
    question: "Why did the bird fly away?",
    response_type: "type",
    options: null,
    answer: "Because a cat came.",
    answer_lines: 1
  }
]
// v6 额外字段:
chart: { type: "bar_chart", data: [...], title: "Birds in the Park" }
```

---

### 13. T-SEQUENCE — 排序

**Layout：** 上方打乱元素 + 下方排列槽位（1→2→3→4）

| Variant | 排什么 | 互动 | qty | 适用年级 | 用于 |
|---------|-------|------|-----|---------|------|
| v1 | 故事图片 | 👆 拖拽 | 3-4 张 | PreK-K | K-7 |
| v2 | 事件句子 | 👆 拖拽 | 4-5 句 | G1-G2 | G1-5, G2-4 |
| v3 | 字母顺序 | ✏️ 手写 | 3-4 行 | PreK-K | PK-1 |
| v4 | 句子组段落 | 👆 拖拽 | 4-6 句 | G2-G3 | G2-8, G3-7 |

**字段规格：**
```
items: [
  { content: "First, the bird sat on a tree.", order: 1, type: "text" },
  { content: "Then, a cat came.", order: 2, type: "text" },
  ...
]
display_order: [3, 1, 4, 2]  // 打乱后的显示顺序
```

---

### 14. T-SENTENCE — 句子书写

**Layout：** 上方提示区（图片/word bank/指令）+ 下方 Typing 输入区

**全部使用 ⌨️ Typing 键盘输入。**

| Variant | 提示 | 输入 | 题数 | 适用年级 | 用于 |
|---------|------|------|------|---------|------|
| v1 | Word bank + 图片 | ⌨️ 1 句 | 2-3 | K-G1 | K-8, G1-7b |
| v2 | 图片提示 | ⌨️ 1-2 句 | 2-3 | G1-G2 | G1-7b, G2-8 |
| v3 | 文字 prompt | ⌨️ 3-5 句 | 1-2 | G2-G3 | G2-8, G3-7 |

**字段规格：**
```
prompt: {
  image: "park_scene.png",
  instruction: "Look at the picture. Write 3 sentences about it.",
  instruction_audio: "write_3_sentences.mp3",
  word_bank: ["boy", "park", "dog", "run", "happy", "sunny"],
  expected_sentences: 3,
  input_type: "type"
}
```

---

### 15. T-FIXUP — 改错

**Layout：** 每行 = 有错句子（✏️ 圈出错误）+ 下方 Typing 输入区（打出正确版本）

| Variant | 错误类型 | 题数 | 适用年级 | 用于 |
|---------|---------|------|---------|------|
| v1 | 大写/标点 | 4-5 | G1 | G1-7b |
| v2 | 拼写 | 4-5 | G2-G3 | G2-3, G3-6 |
| v3 | 文法(tense/pronoun) | 3-4 | G2-G3 | G2-10, G3-8 |
| v4 | 综合(一句多错) | 3-4 | G3 | G3-8 |

**字段规格：**
```
items: [
  {
    incorrect_sentence: "the dog runed to the park.",
    errors: [
      { position: 0, type: "capitalization", incorrect: "the", correct: "The" },
      { position: 2, type: "spelling", incorrect: "runed", correct: "ran" },
      { position: 5, type: "punctuation", incorrect: "park.", correct: "park." }
    ],
    correct_sentence: "The dog ran to the park.",
    input_type: "type"
  },
  ...
]
```

---

### 16. T-TRANSFORM — 变换

**Layout：** 每行 = 原始字/句 + → 箭头 + 手写格或 Typing 区

| Variant | 变什么 | input | 题数 | 适用年级 | 用于 |
|---------|-------|-------|------|---------|------|
| v1 | CVC → CVCe | ✏️ 手写 | 5-6 | G1 | G1-1 |
| v2 | 字根+前后缀 | ✏️ 手写 | 5-6 | G1-G3 | G1-9, G2-3, G3-1 |
| v3 | 动词时态 | ✏️ 手写 | 4-6 | G2-G3 | G2-10, G3-8 |
| v4 | 单复数 | ✏️ 手写 | 4-6 | G1-G2 | G2-10 |
| v5 | 句子改写 | ⌨️ Typing | 3-4 | G3 | G3-7, G3-8 |

**字段规格：**
```
items: [
  {
    original: "cap",
    rule: "add_silent_e",
    answer: "cape",
    image: "cape.png",
    input_type: "handwrite"
  },
  ...
]
```

---

## Template × Workbook 覆盖矩阵

✓ = 核心使用（该 WB 必用此 Template）
○ = 偶尔使用（1-2 页）

| WB | TRACE | WRITE | SBOX | BLEND | CIRCLE | MATCH | SORT | FILLIN | LISTEN | FIND | LADDER | PASSAGE | SEQ | SENT | FIX | TRANS | 合计 |
|----|-------|-------|------|-------|--------|-------|------|--------|--------|------|--------|---------|-----|------|-----|-------|------|
| PK-0 | | | | | ✓ | ✓ | ○ | | | | | | ✓ | | | | 4 |
| PK-1 | ✓ | ✓ | | | ✓ | ✓ | | | ○ | | | | ✓ | | | | 6 |
| PK-2 | | ✓ | | ✓ | ✓ | ✓ | | ✓ | ✓ | | | | | | | | 6 |
| PK-3 | ○ | ✓ | ✓ | ✓ | ✓ | ✓ | | | ✓ | | | | | | | | 7 |
| PK-4 | | ✓ | | | ✓ | ✓ | ✓ | | ✓ | | | | | | | | 5 |
| PK-5 | | | | | ✓ | ✓ | ✓ | | ✓ | | | | | | | | 4 |
| K-1 | ○ | ✓ | ✓ | ✓ | ✓ | ✓ | | ✓ | ✓ | | | | | | | | 8 |
| K-2 | | ✓ | ✓ | | ✓ | | ✓ | ✓ | | | ✓ | | | | | | 6 |
| K-3 | | ✓ | ✓ | | ✓ | | ✓ | ✓ | ✓ | | | | | | | | 6 |
| K-4 | | ✓ | ✓ | | ✓ | ○ | ✓ | ✓ | ✓ | | | | | | | | 7 |
| K-5 | ✓ | ✓ | | | ✓ | | | ✓ | | ✓ | | | | | | | 5 |
| K-6 | ✓ | ✓ | | | ✓ | | | ✓ | | ✓ | | | | | | | 5 |
| K-7 | | | | | ✓ | ✓ | | | | | | ✓ | ✓ | | | | 4 |
| K-8 | | | | | ✓ | | ✓ | | | | | | | ✓ | | | 4 |
| K-9 | | ✓ | ✓ | ✓ | ✓ | | ✓ | ✓ | ✓ | | | ✓ | | | | | 8 |
| G1-1 | | ✓ | ✓ | | ✓ | | ✓ | | | | ✓ | | | | | ✓ | 6 |
| G1-2 | | ✓ | ✓ | | ✓ | | ✓ | ✓ | ✓ | | | | | | | | 6 |
| G1-3 | | ✓ | ✓ | | ✓ | ✓ | | ✓ | ✓ | | | | | | | | 6 |
| G1-4 | ✓ | ✓ | | | ✓ | | | ✓ | | ✓ | | | | | | | 5 |
| G1-5 | | | | | ✓ | ✓ | | | | | | ✓ | ✓ | | | | 4 |
| G1-6 | | | | | ✓ | ✓ | | | | | | ✓ | | | | | 4 |
| G1-7a | ✓ | ✓ | | | | | | | | | | | | | | | 2 |
| G1-7b | | | | | ✓ | | | | | | | | | ✓ | ✓ | | 3 |
| G1-8 | | | | | ✓ | | | | ✓ | ✓ | | ✓ | | | | | 4 |
| G1-9 | | ✓ | | ○ | ✓ | ✓ | ✓ | ✓ | | | | ✓ | | | | ✓ | 8 |
| G2-1 | | ✓ | | | ✓ | | ✓ | ✓ | ✓ | | | | | | | | 5 |
| G2-2 | | ✓ | | | ✓ | | ✓ | ✓ | | | | | | | | | 4 |
| G2-3 | | ✓ | | | ✓ | | ✓ | | | | | | | ✓ | | ✓ | 5 |
| G2-4 | | | | | ✓ | | | | | | | ✓ | ✓ | ✓ | | | 4 |
| G2-5 | | | | | ✓ | ✓ | ✓ | | | | | ✓ | | ✓ | | | 5 |
| G2-6 | | ✓ | | | ✓ | ✓ | ✓ | ✓ | | | | | | | | | 5 |
| G2-7 | ✓ | ✓ | | | ✓ | | | ✓ | | ✓ | | | | | | | 5 |
| G2-8 | | | | | | | | | | | | | ✓ | ✓ | | ✓ | 3 |
| G2-9 | | | | | | | | | ✓ | | | ✓ | | ✓ | | | 3 |
| G2-10 | | | | | ✓ | ✓ | ✓ | ✓ | | | | | | | ✓ | ✓ | 6 |
| G3-1 | | ✓ | | | ✓ | ✓ | ✓ | ✓ | | | | | | | | ✓ | 6 |
| G3-2 | | | | | ✓ | | | | | | | ✓ | | ✓ | | | 3 |
| G3-3 | | | | | ✓ | | ✓ | | | | | ✓ | | ✓ | | | 4 |
| G3-4 | | | | | ✓ | | | | | | | ✓ | | ✓ | | | 3 |
| G3-5 | | ✓ | | | ✓ | ✓ | ✓ | ✓ | | | | ✓ | | | | | 6 |
| G3-6 | | ✓ | | | ✓ | | | ✓ | ✓ | | | | | | ✓ | | 5 |
| G3-7 | | | | | | | | | | | | | ✓ | ✓ | ✓ | ✓ | 4 |
| G3-8 | | | | | ✓ | | ✓ | ✓ | | | | | | | ✓ | ✓ | 5 |
| G3-9 | | | | | | | | | ✓ | | | ✓ | | ✓ | | | 3 |
| G3-10 | | | | | ✓ | ✓ | | ✓ | | | | ✓ | | ✓ | | | 5 |

---

## 字段规格汇总（供 UI 图和出题系统使用）

### 所有 Template 共用的 Page-Level 字段

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

  "items": [ ... ]
}
```

### Item-Level 字段（因 Template 而异）

**通用字段（所有 item 都有）：**
```json
{
  "item_id": "K-1_U01_P03_I01",
  "answer": "cat",
  "correct": true
}
```

**图片字段：**
```json
{
  "image": "cat.png",
  "image_alt": "a cat"
}
```

**音频字段：**
```json
{
  "audio_word": "cat.mp3",
  "audio_phonemes": ["k.mp3", "ae.mp3", "t.mp3"],
  "audio_sentence": null
}
```

**选项字段（T-CIRCLE, T-MATCH, T-PASSAGE 用）：**
```json
{
  "options": [
    { "content": "cat", "type": "word", "correct": true, "image": "cat.png", "audio": "cat.mp3" },
    { "content": "dog", "type": "word", "correct": false, "image": "dog.png", "audio": "dog.mp3" }
  ],
  "select_mode": "single"
}
```

**书写字段（T-TRACE, T-WRITE, T-SOUNDBOX, T-FILLIN 用）：**
```json
{
  "display": "c_t",
  "blank_position": [1],
  "scaffold": "faded",
  "stroke_order_animation": true,
  "input_type": "handwrite"
}
```

**Typing 字段（T-SENTENCE, T-FIXUP, T-PASSAGE 回答区用）：**
```json
{
  "input_type": "type",
  "expected_length": "sentence",
  "max_chars": 100,
  "placeholder": "Type your answer..."
}
```

**排序字段（T-SEQUENCE 用）：**
```json
{
  "items": [
    { "content": "story_img_1.png", "type": "image", "order": 1 },
    { "content": "story_img_2.png", "type": "image", "order": 2 }
  ],
  "display_order": [3, 1, 4, 2]
}
```

**分类字段（T-SORT 用）：**
```json
{
  "buckets": [ {"label": "sh", "id": "sh"}, {"label": "ch", "id": "ch"} ],
  "cards": [
    { "content": "ship", "type": "word", "correct_bucket": "sh" }
  ]
}
```

**变换字段（T-TRANSFORM 用）：**
```json
{
  "original": "cap",
  "rule": "add_silent_e",
  "answer": "cape",
  "image": "cape.png",
  "input_type": "handwrite"
}
```

**改错字段（T-FIXUP 用）：**
```json
{
  "incorrect_sentence": "the dog runed to the park.",
  "errors": [
    { "word_index": 0, "type": "capitalization", "incorrect": "the", "correct": "The" },
    { "word_index": 2, "type": "verb_form", "incorrect": "runed", "correct": "ran" }
  ],
  "correct_sentence": "The dog ran to the park.",
  "input_type": "type"
}
```

---

*Template System v2.0 | 2026-03-20*
*16 Templates × 3-5 Variants = 60+ 页面样貌*
*覆盖 45 本 Workbook，全设备一致体验*
