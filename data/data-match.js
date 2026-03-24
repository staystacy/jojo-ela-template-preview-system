/* T-MATCH Mock Data */

window.JOJO_DATA['T-MATCH'] = {
  v1: {
    PreK: {
      page_id: 'PK-1_U02_P01',
      workbook_id: 'PK-1',
      unit: 2, page_in_unit: 1,
      template_id: 'T-MATCH', variant: 'v1', grade: 'PreK',
      domain: 'Letters', skill: 'upper_lower_match',
      ccss: ['RF.K.1.d'],
      instruction_text: 'Draw a line from each big letter to its small letter.',
      instruction_audio: 'match_upper_lower.mp3',
      pairs: [
        { left: { content: 'A', type: 'word', audio: 'letter_a.mp3' }, right: { content: 'a', type: 'word' } },
        { left: { content: 'B', type: 'word', audio: 'letter_b.mp3' }, right: { content: 'b', type: 'word' } },
        { left: { content: 'D', type: 'word', audio: 'letter_d.mp3' }, right: { content: 'd', type: 'word' } }
      ]
    }
  },
  v2: {
    PreK: {
      page_id: 'PK-3_U01_P02',
      workbook_id: 'PK-3',
      unit: 1, page_in_unit: 2,
      template_id: 'T-MATCH', variant: 'v2', grade: 'PreK',
      domain: 'Phonics', skill: 'word_picture_match',
      ccss: ['RF.K.3.b'],
      instruction_text: 'Draw a line from each word to its picture.',
      instruction_audio: 'match_word_pic.mp3',
      pairs: [
        { left: { content: 'cat', type: 'word', audio: 'cat.mp3' }, right: { content: 'cat.png', type: 'image' } },
        { left: { content: 'sun', type: 'word', audio: 'sun.mp3' }, right: { content: 'sun.png', type: 'image' } },
        { left: { content: 'dog', type: 'word', audio: 'dog.mp3' }, right: { content: 'dog.png', type: 'image' } }
      ]
    },
    K: {
      page_id: 'K-1_U03_P02',
      workbook_id: 'K-1',
      unit: 3, page_in_unit: 2,
      template_id: 'T-MATCH', variant: 'v2', grade: 'K',
      domain: 'Phonics', skill: 'CVC_word_picture',
      ccss: ['RF.K.3.b'],
      instruction_text: 'Match each word to the right picture.',
      instruction_audio: 'match_cvc.mp3',
      pairs: [
        { left: { content: 'pig', type: 'word', audio: 'pig.mp3' }, right: { content: 'pig.png', type: 'image' } },
        { left: { content: 'cup', type: 'word', audio: 'cup.mp3' }, right: { content: 'cup.png', type: 'image' } },
        { left: { content: 'bed', type: 'word', audio: 'bed.mp3' }, right: { content: 'bed.png', type: 'image' } },
        { left: { content: 'fox', type: 'word', audio: 'fox.mp3' }, right: { content: 'fox.png', type: 'image' } }
      ]
    }
  },
  v3: {
    K: {
      page_id: 'K-3_U02_P03',
      workbook_id: 'K-3',
      unit: 2, page_in_unit: 3,
      template_id: 'T-MATCH', variant: 'v3', grade: 'K',
      domain: 'Phonics', skill: 'digraph_audio_match',
      ccss: ['RF.K.3.a'],
      instruction_text: 'Listen to the sound. Match it to the right word.',
      instruction_audio: 'match_audio.mp3',
      pairs: [
        { left: { content: 'sh sound', type: 'word', audio: 'phoneme_sh.mp3' }, right: { content: 'ship', type: 'word' } },
        { left: { content: 'ch sound', type: 'word', audio: 'phoneme_ch.mp3' }, right: { content: 'chin', type: 'word' } },
        { left: { content: 'th sound', type: 'word', audio: 'phoneme_th.mp3' }, right: { content: 'thin', type: 'word' } },
        { left: { content: 'wh sound', type: 'word', audio: 'phoneme_wh.mp3' }, right: { content: 'when', type: 'word' } }
      ]
    }
  },
  v4: {
    G2: {
      page_id: 'G2-6_U01_P02',
      workbook_id: 'G2-6',
      unit: 1, page_in_unit: 2,
      template_id: 'T-MATCH', variant: 'v4', grade: 'G2',
      domain: 'Vocabulary', skill: 'synonyms',
      ccss: ['L.2.5.a'],
      instruction_text: 'Draw a line to match each word with its synonym.',
      instruction_audio: null,
      pairs: [
        { left: { content: 'happy', type: 'word' }, right: { content: 'glad', type: 'word' } },
        { left: { content: 'big', type: 'word' }, right: { content: 'large', type: 'word' } },
        { left: { content: 'fast', type: 'word' }, right: { content: 'quick', type: 'word' } },
        { left: { content: 'small', type: 'word' }, right: { content: 'tiny', type: 'word' } },
        { left: { content: 'start', type: 'word' }, right: { content: 'begin', type: 'word' } },
        { left: { content: 'sad', type: 'word' }, right: { content: 'unhappy', type: 'word' } }
      ]
    },
    G3: {
      page_id: 'G3-5_U03_P01',
      workbook_id: 'G3-5',
      unit: 3, page_in_unit: 1,
      template_id: 'T-MATCH', variant: 'v4', grade: 'G3',
      domain: 'Vocabulary', skill: 'antonyms',
      ccss: ['L.3.5.b'],
      instruction_text: 'Match each word with its antonym (opposite).',
      instruction_audio: null,
      pairs: [
        { left: { content: 'ancient', type: 'word' }, right: { content: 'modern', type: 'word' } },
        { left: { content: 'generous', type: 'word' }, right: { content: 'selfish', type: 'word' } },
        { left: { content: 'courage', type: 'word' }, right: { content: 'fear', type: 'word' } },
        { left: { content: 'triumph', type: 'word' }, right: { content: 'defeat', type: 'word' } },
        { left: { content: 'expand', type: 'word' }, right: { content: 'shrink', type: 'word' } }
      ]
    }
  }
};
