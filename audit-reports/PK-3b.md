# Audit · PK-3b

Total pages: **30**

## A. 渲染失敗的頁
_None — every page is supported by an existing translator._

## B. 缺資源的按鈕 / 圖片
| Page | slot | label | expects (category) | filename |
|------|------|-------|--------------------|----------|
| U01_P04.json | instruction.audio | `match_the_picture_to_the_word` | instruction | `match_the_picture_to_the_word` |
| U01_P05.json | instruction.audio | `match_the_picture_to_the_word` | instruction | `match_the_picture_to_the_word` |
| U02_P02.json | topic[0].row[0].audio | `cow` | word | `cow` |
| U02_P03.json | topic[0].row[0].audio | `horse` | word | `horse` |
| U02_P04.json | instruction.audio | `match_the_picture_to_the_word` | instruction | `match_the_picture_to_the_word` |
| U02_P04.json | topic[0].pair[1].left.audio | `cow` | word | `cow` |
| U02_P04.json | topic[0].pair[3].left.audio | `horse` | word | `horse` |
| U02_P05.json | instruction.audio | `sort_the_pictures_pet_or_farm` | instruction | `sort_the_pictures_pet_or_farm` |
| U03_P01.json | topic[0].row[0].audio | `milk` | word | `milk` |
| U03_P03.json | topic[0].row[0].audio | `bread` | word | `bread` |
| U03_P04.json | instruction.audio | `match_the_picture_to_the_word` | instruction | `match_the_picture_to_the_word` |
| U03_P04.json | topic[0].pair[2].left.audio | `milk` | word | `milk` |
| U03_P04.json | topic[0].pair[3].left.audio | `bread` | word | `bread` |
| U03_P05.json | instruction.audio | `listen_to_the_word_circle_the_picture` | instruction | `listen_to_the_word_circle_the_picture` |
| U03_P05.json | topic[0].option[0].audio | `bread` | word | `bread` |
| U03_P05.json | topic[0].option[3].audio | `milk` | word | `milk` |
| U04_P03.json | topic[0].row[0].audio | `water` | word | `water` |
| U04_P04.json | instruction.audio | `match_the_picture_to_the_word` | instruction | `match_the_picture_to_the_word` |
| U04_P04.json | topic[0].pair[1].left.audio | `water` | word | `water` |
| U04_P05.json | instruction.audio | `put_the_pictures_in_order_making_breakfast` | instruction | `put_the_pictures_in_order_making_breakfast` |
| U05_P03.json | topic[0].row[0].audio | `train` | word | `train` |
| U05_P04.json | instruction.audio | `match_the_picture_to_the_word` | instruction | `match_the_picture_to_the_word` |
| U05_P04.json | topic[0].pair[2].left.audio | `plane` | word | `plane` |
| U05_P04.json | topic[0].pair[3].left.audio | `boat` | word | `boat` |
| U05_P05.json | instruction.audio | `match_the_picture_to_the_word` | instruction | `match_the_picture_to_the_word` |
| U05_P05.json | topic[0].pair[0].left.audio | `plane` | word | `plane` |
| U05_P05.json | topic[0].pair[1].left.audio | `train` | word | `train` |
| U05_P05.json | topic[0].pair[3].left.audio | `boat` | word | `boat` |
| U06_P01.json | instruction.audio | `match_the_picture_to_the_word` | instruction | `match_the_picture_to_the_word` |
| U06_P02.json | instruction.audio | `match_the_picture_to_the_word` | instruction | `match_the_picture_to_the_word` |
| U06_P02.json | topic[0].pair[0].left.audio | `cow` | word | `cow` |
| U06_P02.json | topic[0].pair[2].left.audio | `horse` | word | `horse` |
| U06_P03.json | instruction.audio | `sort_the_pictures_food_or_transport` | instruction | `sort_the_pictures_food_or_transport` |
| U06_P04.json | instruction.audio | `listen_to_the_word_circle_the_picture` | instruction | `listen_to_the_word_circle_the_picture` |
| U06_P04.json | topic[0].option[0].audio | `bread` | word | `bread` |
| U06_P04.json | topic[0].option[1].audio | `water` | word | `water` |
| U06_P04.json | topic[0].option[4].audio | `boat` | word | `boat` |
| U06_P04.json | topic[0].option[5].audio | `train` | word | `train` |
| U06_P05.json | instruction.audio | `listen_to_the_word_circle_the_picture` | instruction | `listen_to_the_word_circle_the_picture` |
| U06_P05.json | topic[0].option[0].audio | `horse` | word | `horse` |
| U06_P05.json | topic[0].option[1].audio | `cow` | word | `cow` |

Top missing assets (deduped):

- instruction:match_the_picture_to_the_word × 9
- word:cow × 4
- word:horse × 4
- word:bread × 4
- word:milk × 3
- instruction:listen_to_the_word_circle_the_picture × 3
- word:water × 3
- word:train × 3
- word:boat × 3
- word:plane × 2
- instruction:sort_the_pictures_pet_or_farm × 1
- instruction:put_the_pictures_in_order_making_breakfast × 1
- instruction:sort_the_pictures_food_or_transport × 1

## C. 資源語意錯位
| Page | slot | label | expects | actually plays |
|------|------|-------|---------|----------------|
| U01_P01.json | topic[0].json_schema | `(schema mismatch)` | json_schema | `wordsList.length=1 (spec: 2)/null` |
| U01_P02.json | topic[0].json_schema | `(schema mismatch)` | json_schema | `wordsList.length=1 (spec: 2)/null` |
| U01_P03.json | topic[0].json_schema | `(schema mismatch)` | json_schema | `wordsList.length=1 (spec: 2)/null` |
| U02_P01.json | topic[0].json_schema | `(schema mismatch)` | json_schema | `wordsList.length=1 (spec: 2)/null` |
| U02_P02.json | topic[0].json_schema | `(schema mismatch)` | json_schema | `wordsList.length=1 (spec: 2)/null` |
| U02_P03.json | topic[0].json_schema | `(schema mismatch)` | json_schema | `wordsList.length=1 (spec: 2)/null` |
| U03_P01.json | topic[0].json_schema | `(schema mismatch)` | json_schema | `wordsList.length=1 (spec: 2)/null` |
| U03_P02.json | topic[0].json_schema | `(schema mismatch)` | json_schema | `wordsList.length=1 (spec: 2)/null` |
| U03_P03.json | topic[0].json_schema | `(schema mismatch)` | json_schema | `wordsList.length=1 (spec: 2)/null` |
| U04_P01.json | topic[0].json_schema | `(schema mismatch)` | json_schema | `wordsList.length=1 (spec: 2)/null` |
| U04_P02.json | topic[0].json_schema | `(schema mismatch)` | json_schema | `wordsList.length=1 (spec: 2)/null` |
| U04_P03.json | topic[0].json_schema | `(schema mismatch)` | json_schema | `wordsList.length=1 (spec: 2)/null` |
| U05_P01.json | topic[0].json_schema | `(schema mismatch)` | json_schema | `wordsList.length=1 (spec: 2)/null` |
| U05_P02.json | topic[0].json_schema | `(schema mismatch)` | json_schema | `wordsList.length=1 (spec: 2)/null` |
| U05_P03.json | topic[0].json_schema | `(schema mismatch)` | json_schema | `wordsList.length=1 (spec: 2)/null` |
