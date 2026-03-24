/* T-CIRCLE Mock Data */

window.JOJO_DATA['T-CIRCLE'] = {
  v1: {
    PreK: {
      page_id: 'PK-2_U01_P03',
      workbook_id: 'PK-2',
      unit: 1, page_in_unit: 3,
      template_id: 'T-CIRCLE', variant: 'v1', grade: 'PreK',
      domain: 'Phonics', skill: 'beginning_sound_b',
      ccss: ['RF.K.2.d'],
      instruction: 'Circle the picture that starts with /b/.',
      instruction_audio: 'circle_b.mp3',
      select_mode: 'single',
      options: [
        { content: 'ball.png', type: 'image', correct: true, audio: 'ball.mp3' },
        { content: 'cat.png', type: 'image', correct: false, audio: 'cat.mp3' },
        { content: 'bus.png', type: 'image', correct: true, audio: 'bus.mp3' },
        { content: 'dog.png', type: 'image', correct: false, audio: 'dog.mp3' }
      ]
    }
  },
  v2: {
    K: {
      page_id: 'K-3_U01_P03',
      workbook_id: 'K-3',
      unit: 1, page_in_unit: 3,
      template_id: 'T-CIRCLE', variant: 'v2', grade: 'K',
      domain: 'Phonics', skill: 'digraph_sh',
      ccss: ['RF.K.3.a'],
      instruction: 'Circle the pictures that start with sh.',
      instruction_audio: 'circle_sh.mp3',
      select_mode: 'multi',
      options: [
        { content: 'ship.png', type: 'image', label: 'ship', correct: true, audio: 'ship.mp3' },
        { content: 'chip.png', type: 'image', label: 'chip', correct: false, audio: 'chip.mp3' },
        { content: 'shop.png', type: 'image', label: 'shop', correct: true, audio: 'shop.mp3' },
        { content: 'sock.png', type: 'image', label: 'sock', correct: false, audio: 'sock.mp3' },
        { content: 'shed.png', type: 'image', label: 'shed', correct: true, audio: 'shed.mp3' },
        { content: 'shell.png', type: 'image', label: 'shell', correct: true, audio: 'shell.mp3' }
      ]
    }
  },
  v3: {
    K: {
      page_id: 'K-5_U01_P03',
      workbook_id: 'K-5',
      unit: 1, page_in_unit: 3,
      template_id: 'T-CIRCLE', variant: 'v3', grade: 'K',
      domain: 'Sight Words', skill: 'sight_word_recognition',
      ccss: ['RF.K.3.c'],
      instruction: 'Circle the word "the" every time you see it.',
      instruction_audio: 'circle_the.mp3',
      select_mode: 'multi',
      options: [
        { content: 'the', type: 'word', correct: true },
        { content: 'they', type: 'word', correct: false },
        { content: 'then', type: 'word', correct: false },
        { content: 'the', type: 'word', correct: true },
        { content: 'there', type: 'word', correct: false },
        { content: 'the', type: 'word', correct: true },
        { content: 'them', type: 'word', correct: false },
        { content: 'that', type: 'word', correct: false }
      ]
    },
    G1: {
      page_id: 'G1-4_U02_P03',
      workbook_id: 'G1-4',
      unit: 2, page_in_unit: 3,
      template_id: 'T-CIRCLE', variant: 'v3', grade: 'G1',
      domain: 'Sight Words', skill: 'sight_word_set_2',
      ccss: ['RF.1.3.g'],
      instruction: 'Circle the word "because" every time you see it.',
      instruction_audio: null,
      select_mode: 'multi',
      options: [
        { content: 'because', type: 'word', correct: true },
        { content: 'became', type: 'word', correct: false },
        { content: 'before', type: 'word', correct: false },
        { content: 'because', type: 'word', correct: true },
        { content: 'behind', type: 'word', correct: false },
        { content: 'because', type: 'word', correct: true }
      ]
    }
  },
  v4: {
    G1: {
      page_id: 'G1-6_U02_P02',
      workbook_id: 'G1-6',
      unit: 2, page_in_unit: 2,
      template_id: 'T-CIRCLE', variant: 'v4', grade: 'G1',
      domain: 'Reading', skill: 'key_details',
      ccss: ['RI.1.1'],
      instruction: 'Read the paragraph. Circle all the naming words (nouns).',
      instruction_audio: null,
      select_mode: 'multi',
      paragraph: 'The little dog ran across the park. He jumped over a log and splashed in the pond. A duck quacked loudly. The boy laughed and threw a ball for the dog.',
      target_words: ['dog', 'park', 'log', 'pond', 'duck', 'boy', 'ball']
    }
  },
  v5: {
    G2: {
      page_id: 'G2-5_U01_P02',
      workbook_id: 'G2-5',
      unit: 1, page_in_unit: 2,
      template_id: 'T-CIRCLE', variant: 'v5', grade: 'G2',
      domain: 'Reading', skill: 'main_idea_details',
      ccss: ['RI.2.1', 'RI.2.2'],
      instruction: 'Circle ALL the sentences that tell about the main idea.',
      instruction_audio: null,
      select_mode: 'multi',
      options: [
        { content: 'Bees live in hives and work together.', type: 'word', correct: true },
        { content: 'Pizza is a popular food in America.', type: 'word', correct: false },
        { content: 'Worker bees collect pollen from flowers.', type: 'word', correct: true },
        { content: 'The queen bee lays all the eggs.', type: 'word', correct: true },
        { content: 'Dogs can learn many tricks.', type: 'word', correct: false },
        { content: 'Bees make honey to feed the hive.', type: 'word', correct: true }
      ]
    }
  }
};
