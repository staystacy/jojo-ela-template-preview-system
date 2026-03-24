/* T-SENTENCE Mock Data */

window.JOJO_DATA['T-SENTENCE'] = {
  v1: {
    K: {
      page_id: 'K-8_U02_P01',
      workbook_id: 'K-8',
      unit: 2, page_in_unit: 1,
      template_id: 'T-SENTENCE', variant: 'v1', grade: 'K',
      domain: 'Writing', skill: 'sentence_with_wordbank',
      ccss: ['L.K.1', 'W.K.3'],
      instruction_text: 'Use the words to write a sentence about the picture.',
      instruction_audio: 'sentence_wordbank.mp3',
      prompts: [
        {
          image: 'boy_dog_park.png',
          instruction: 'Write a sentence about what you see.',
          instruction_audio: 'write_sentence_1.mp3',
          word_bank: ['The', 'boy', 'plays', 'with', 'his', 'dog'],
          expected_sentences: 1,
          input_type: 'type'
        },
        {
          image: 'girl_reading.png',
          instruction: 'Write a sentence about the girl.',
          instruction_audio: 'write_sentence_2.mp3',
          word_bank: ['She', 'is', 'reading', 'a', 'big', 'book'],
          expected_sentences: 1,
          input_type: 'type'
        }
      ]
    }
  },
  v2: {
    G1: {
      page_id: 'G1-7_U01_P03',
      workbook_id: 'G1-7',
      unit: 1, page_in_unit: 3,
      template_id: 'T-SENTENCE', variant: 'v2', grade: 'G1',
      domain: 'Writing', skill: 'picture_prompt_sentence',
      ccss: ['L.1.1', 'W.1.3'],
      instruction_text: 'Look at each picture. Write one or two sentences about it.',
      instruction_audio: null,
      prompts: [
        {
          image: 'birthday_party.png',
          instruction: 'What is happening at the party? Write two sentences.',
          instruction_audio: null,
          word_bank: null,
          expected_sentences: 2,
          input_type: 'type'
        },
        {
          image: 'rainy_day.png',
          instruction: 'What do you see? How do the children feel?',
          instruction_audio: null,
          word_bank: null,
          expected_sentences: 2,
          input_type: 'type'
        }
      ]
    },
    G2: {
      page_id: 'G2-8_U02_P01',
      workbook_id: 'G2-8',
      unit: 2, page_in_unit: 1,
      template_id: 'T-SENTENCE', variant: 'v2', grade: 'G2',
      domain: 'Writing', skill: 'descriptive_sentences',
      ccss: ['L.2.1', 'W.2.3'],
      instruction_text: 'Look at the picture. Write two sentences using adjectives.',
      instruction_audio: null,
      prompts: [
        {
          image: 'forest_scene.png',
          instruction: 'Describe what you see in the forest. Use describing words (adjectives).',
          instruction_audio: null,
          word_bank: null,
          expected_sentences: 2,
          input_type: 'type'
        },
        {
          image: 'beach_scene.png',
          instruction: 'What is happening at the beach? Use at least two adjectives.',
          instruction_audio: null,
          word_bank: null,
          expected_sentences: 2,
          input_type: 'type'
        }
      ]
    }
  },
  v3: {
    G2: {
      page_id: 'G2-8_U04_P02',
      workbook_id: 'G2-8',
      unit: 4, page_in_unit: 2,
      template_id: 'T-SENTENCE', variant: 'v3', grade: 'G2',
      domain: 'Writing', skill: 'paragraph_writing',
      ccss: ['W.2.3'],
      instruction_text: 'Write a short paragraph (3-5 sentences) about the topic.',
      instruction_audio: null,
      prompts: [
        {
          image: null,
          instruction: 'Write about your favorite place to visit. Where is it? What do you do there? Why do you like it?',
          instruction_audio: null,
          word_bank: null,
          expected_sentences: 4,
          input_type: 'type'
        }
      ]
    },
    G3: {
      page_id: 'G3-7_U04_P01',
      workbook_id: 'G3-7',
      unit: 4, page_in_unit: 1,
      template_id: 'T-SENTENCE', variant: 'v3', grade: 'G3',
      domain: 'Writing', skill: 'narrative_paragraph',
      ccss: ['W.3.3'],
      instruction_text: 'Write a narrative paragraph (4-6 sentences) about the prompt below.',
      instruction_audio: null,
      prompts: [
        {
          image: null,
          instruction: 'Imagine you found a treasure map in your backyard. Write a short story about what happens next. Include a beginning, middle, and end.',
          instruction_audio: null,
          word_bank: null,
          expected_sentences: 5,
          input_type: 'type'
        }
      ]
    }
  }
};
