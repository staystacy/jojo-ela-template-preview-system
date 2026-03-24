/* T-SORT Mock Data */

window.JOJO_DATA['T-SORT'] = {
  v1: {
    K: {
      page_id: 'K-2_U01_P03',
      workbook_id: 'K-2',
      unit: 1, page_in_unit: 3,
      template_id: 'T-SORT', variant: 'v1', grade: 'K',
      domain: 'Phonics', skill: 'word_family_sort_at_an',
      ccss: ['RF.K.3.d'],
      instruction_text: 'Sort the pictures into the right word family.',
      instruction_audio: 'sort_at_an.mp3',
      buckets: [
        { label: '-at family', id: 'at' },
        { label: '-an family', id: 'an' }
      ],
      cards: [
        { content: 'cat.png', type: 'image', correct_bucket: 'at' },
        { content: 'fan.png', type: 'image', correct_bucket: 'an' },
        { content: 'bat.png', type: 'image', correct_bucket: 'at' },
        { content: 'man.png', type: 'image', correct_bucket: 'an' },
        { content: 'hat.png', type: 'image', correct_bucket: 'at' },
        { content: 'van.png', type: 'image', correct_bucket: 'an' }
      ]
    }
  },
  v2: {
    K: {
      page_id: 'K-3_U02_P01',
      workbook_id: 'K-3',
      unit: 2, page_in_unit: 1,
      template_id: 'T-SORT', variant: 'v2', grade: 'K',
      domain: 'Phonics', skill: 'digraph_sort_sh_ch',
      ccss: ['RF.K.3.a'],
      instruction_text: 'Read each word. Drop it in the right bucket.',
      instruction_audio: 'sort_sh_ch.mp3',
      buckets: [
        { label: 'sh', id: 'sh' },
        { label: 'ch', id: 'ch' }
      ],
      cards: [
        { content: 'ship', type: 'word', correct_bucket: 'sh' },
        { content: 'chin', type: 'word', correct_bucket: 'ch' },
        { content: 'shop', type: 'word', correct_bucket: 'sh' },
        { content: 'chop', type: 'word', correct_bucket: 'ch' },
        { content: 'shed', type: 'word', correct_bucket: 'sh' },
        { content: 'chat', type: 'word', correct_bucket: 'ch' },
        { content: 'shell', type: 'word', correct_bucket: 'sh' },
        { content: 'chest', type: 'word', correct_bucket: 'ch' }
      ]
    },
    G1: {
      page_id: 'G1-1_U03_P01',
      workbook_id: 'G1-1',
      unit: 3, page_in_unit: 1,
      template_id: 'T-SORT', variant: 'v2', grade: 'G1',
      domain: 'Phonics', skill: 'CVCe_sort',
      ccss: ['RF.1.3.c'],
      instruction_text: 'Sort the words: short vowel or long vowel (silent e)?',
      instruction_audio: 'sort_cvce.mp3',
      buckets: [
        { label: 'Short Vowel (CVC)', id: 'cvc' },
        { label: 'Long Vowel (CVCe)', id: 'cvce' }
      ],
      cards: [
        { content: 'cap', type: 'word', correct_bucket: 'cvc' },
        { content: 'cape', type: 'word', correct_bucket: 'cvce' },
        { content: 'hop', type: 'word', correct_bucket: 'cvc' },
        { content: 'hope', type: 'word', correct_bucket: 'cvce' },
        { content: 'kit', type: 'word', correct_bucket: 'cvc' },
        { content: 'kite', type: 'word', correct_bucket: 'cvce' },
        { content: 'cub', type: 'word', correct_bucket: 'cvc' },
        { content: 'cube', type: 'word', correct_bucket: 'cvce' }
      ]
    }
  },
  v3: {
    G1: {
      page_id: 'G1-2_U03_P02',
      workbook_id: 'G1-2',
      unit: 3, page_in_unit: 2,
      template_id: 'T-SORT', variant: 'v3', grade: 'G1',
      domain: 'Phonics', skill: 'vowel_team_sort',
      ccss: ['RF.1.3.c'],
      instruction_text: 'Sort each word by its vowel team.',
      instruction_audio: 'sort_vowel_teams.mp3',
      buckets: [
        { label: 'ai / ay', id: 'ai' },
        { label: 'ee / ea', id: 'ee' },
        { label: 'oa / ow', id: 'oa' }
      ],
      cards: [
        { content: 'rain', type: 'word', correct_bucket: 'ai' },
        { content: 'tree', type: 'word', correct_bucket: 'ee' },
        { content: 'boat', type: 'word', correct_bucket: 'oa' },
        { content: 'play', type: 'word', correct_bucket: 'ai' },
        { content: 'read', type: 'word', correct_bucket: 'ee' },
        { content: 'snow', type: 'word', correct_bucket: 'oa' },
        { content: 'tail', type: 'word', correct_bucket: 'ai' },
        { content: 'seed', type: 'word', correct_bucket: 'ee' },
        { content: 'goat', type: 'word', correct_bucket: 'oa' }
      ]
    }
  },
  v4: {
    G2: {
      page_id: 'G2-5_U02_P03',
      workbook_id: 'G2-5',
      unit: 2, page_in_unit: 3,
      template_id: 'T-SORT', variant: 'v4', grade: 'G2',
      domain: 'Reading', skill: 'fact_vs_opinion',
      ccss: ['RI.2.8'],
      instruction_text: 'Is it a fact or an opinion? Sort each sentence.',
      instruction_audio: null,
      buckets: [
        { label: 'Fact', id: 'fact' },
        { label: 'Opinion', id: 'opinion' }
      ],
      cards: [
        { content: 'The sun rises in the east.', type: 'sentence', correct_bucket: 'fact' },
        { content: 'Chocolate ice cream is the best flavor.', type: 'sentence', correct_bucket: 'opinion' },
        { content: 'There are seven days in a week.', type: 'sentence', correct_bucket: 'fact' },
        { content: 'Cats are better pets than dogs.', type: 'sentence', correct_bucket: 'opinion' },
        { content: 'Water freezes at 32 degrees Fahrenheit.', type: 'sentence', correct_bucket: 'fact' },
        { content: 'Summer is the most fun season.', type: 'sentence', correct_bucket: 'opinion' }
      ]
    }
  }
};
