/* T-TRACE Mock Data */

window.JOJO_DATA['T-TRACE'] = {
  v1: {
    PreK: {
      page_id: 'PK-1_U01_P01',
      workbook_id: 'PK-1',
      unit: 1,
      page_in_unit: 1,
      template_id: 'T-TRACE',
      variant: 'v1',
      grade: 'PreK',
      domain: 'Letters',
      skill: 'letter_recognition_B',
      ccss: ['RF.K.1.d'],
      instruction_text: 'Trace the letter. Say its sound.',
      instruction_audio: 'trace_letter_b.mp3',
      cell_size: 56,
      demo_area: { content: 'B', animation: 'stroke_order', audio: 'phoneme_b.mp3' },
      cells: [
        { scaffold: 'trace', content: 'B' },
        { scaffold: 'trace', content: 'B' },
        { scaffold: 'faded', content: 'B' },
        { scaffold: 'faded', content: 'B' },
        { scaffold: 'blank', content: 'B' },
        { scaffold: 'blank', content: 'B' },
        { scaffold: 'blank', content: 'B' },
        { scaffold: 'blank', content: 'B' }
      ]
    },
    K: {
      page_id: 'K-5_U01_P02',
      workbook_id: 'K-5',
      unit: 1,
      page_in_unit: 2,
      template_id: 'T-TRACE',
      variant: 'v1',
      grade: 'K',
      domain: 'Sight Words',
      skill: 'sight_word_the',
      ccss: ['RF.K.3.c'],
      instruction_text: 'Trace the word. Read it aloud.',
      instruction_audio: 'trace_word_the.mp3',
      cell_size: 48,
      demo_area: { content: 'the', animation: 'stroke_order', audio: 'word_the.mp3' },
      cells: [
        { scaffold: 'trace', content: 'the' },
        { scaffold: 'trace', content: 'the' },
        { scaffold: 'faded', content: 'the' },
        { scaffold: 'faded', content: 'the' },
        { scaffold: 'blank', content: 'the' },
        { scaffold: 'blank', content: 'the' }
      ]
    }
  },
  v2: {
    K: {
      page_id: 'K-5_U02_P03',
      workbook_id: 'K-5',
      unit: 2,
      page_in_unit: 3,
      template_id: 'T-TRACE',
      variant: 'v2',
      grade: 'K',
      domain: 'Sight Words',
      skill: 'sight_word_said',
      ccss: ['RF.K.3.c'],
      instruction_text: 'Trace each word. Then write it on your own.',
      instruction_audio: 'trace_cvc.mp3',
      cell_size: 48,
      demo_area: { content: 'said', animation: 'stroke_order', audio: 'word_said.mp3' },
      cells: [
        { scaffold: 'trace', content: 'said' },
        { scaffold: 'faded', content: 'said' },
        { scaffold: 'blank', content: 'said' },
        { scaffold: 'blank', content: 'said' },
        { scaffold: 'blank', content: 'said' },
        { scaffold: 'blank', content: 'said' }
      ]
    },
    G1: {
      page_id: 'G1-4_U01_P01',
      workbook_id: 'G1-4',
      unit: 1,
      page_in_unit: 1,
      template_id: 'T-TRACE',
      variant: 'v2',
      grade: 'G1',
      domain: 'Sight Words',
      skill: 'sight_word_because',
      ccss: ['RF.1.3.g'],
      instruction_text: 'Trace the word. Use it in a sentence.',
      instruction_audio: 'trace_because.mp3',
      cell_size: 40,
      demo_area: { content: 'because', animation: 'stroke_order', audio: 'word_because.mp3' },
      cells: [
        { scaffold: 'trace', content: 'because' },
        { scaffold: 'faded', content: 'because' },
        { scaffold: 'blank', content: 'because' },
        { scaffold: 'blank', content: 'because' }
      ]
    }
  }
};
