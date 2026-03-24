/* T-LADDER Mock Data */

window.JOJO_DATA['T-LADDER'] = {
  v1: {
    K: {
      page_id: 'K-2_U01_P01',
      workbook_id: 'K-2',
      unit: 1, page_in_unit: 1,
      template_id: 'T-LADDER', variant: 'v1', grade: 'K',
      domain: 'Phonics', skill: 'word_family_at',
      ccss: ['RF.K.3.d'],
      instruction_text: 'Climb the ladder! Change the first letter to make new words.',
      instruction_audio: 'ladder_at.mp3',
      cell_size: 48,
      ladders: [
        {
          word_family: '-at',
          rungs: [
            { hint: 'c', answer: 'cat', image: 'cat.png' },
            { hint: 'h', answer: 'hat', image: 'hat.png' },
            { hint: 'b', answer: 'bat', image: 'bat.png' },
            { hint: 'm', answer: 'mat', image: 'mat.png' },
            { hint: 'r', answer: 'rat', image: 'rat.png' }
          ]
        },
        {
          word_family: '-ig',
          rungs: [
            { hint: 'b', answer: 'big', image: 'big.png' },
            { hint: 'd', answer: 'dig', image: 'dig.png' },
            { hint: 'f', answer: 'fig', image: 'fig.png' },
            { hint: 'p', answer: 'pig', image: 'pig.png' },
            { hint: 'w', answer: 'wig', image: 'wig.png' }
          ]
        }
      ]
    }
  },
  v2: {
    K: {
      page_id: 'K-2_U03_P01',
      workbook_id: 'K-2',
      unit: 3, page_in_unit: 1,
      template_id: 'T-LADDER', variant: 'v2', grade: 'K',
      domain: 'Phonics', skill: 'word_family_mixed',
      ccss: ['RF.K.3.d'],
      instruction_text: 'Build word family ladders. Change the first letter each time.',
      instruction_audio: 'ladder_mixed.mp3',
      cell_size: 48,
      ladders: [
        {
          word_family: '-ot',
          rungs: [
            { hint: 'h', answer: 'hot', image: 'hot.png' },
            { hint: 'd', answer: 'dot', image: 'dot.png' },
            { hint: 'g', answer: 'got', image: null },
            { hint: 'l', answer: 'lot', image: null },
            { hint: 'n', answer: 'not', image: null }
          ]
        },
        {
          word_family: '-ub',
          rungs: [
            { hint: 'c', answer: 'cub', image: 'cub.png' },
            { hint: 'h', answer: 'hub', image: null },
            { hint: 'r', answer: 'rub', image: null },
            { hint: 's', answer: 'sub', image: 'sub.png' },
            { hint: 't', answer: 'tub', image: 'tub.png' }
          ]
        }
      ]
    },
    G1: {
      page_id: 'G1-9_U02_P01',
      workbook_id: 'G1-9',
      unit: 2, page_in_unit: 1,
      template_id: 'T-LADDER', variant: 'v2', grade: 'G1',
      domain: 'Phonics', skill: 'word_family_advanced',
      ccss: ['RF.1.3.d'],
      instruction_text: 'Climb up! Use blends to start each word.',
      instruction_audio: 'ladder_blend.mp3',
      cell_size: 40,
      ladders: [
        {
          word_family: '-ip',
          rungs: [
            { hint: 'dr', answer: 'drip', image: null },
            { hint: 'fl', answer: 'flip', image: null },
            { hint: 'gr', answer: 'grip', image: null },
            { hint: 'sl', answer: 'slip', image: null },
            { hint: 'tr', answer: 'trip', image: 'trip.png' },
            { hint: 'sk', answer: 'skip', image: null }
          ]
        },
        {
          word_family: '-ack',
          rungs: [
            { hint: 'bl', answer: 'black', image: null },
            { hint: 'cr', answer: 'crack', image: null },
            { hint: 'sn', answer: 'snack', image: 'snack.png' },
            { hint: 'st', answer: 'stack', image: null },
            { hint: 'tr', answer: 'track', image: null }
          ]
        }
      ]
    }
  }
};
