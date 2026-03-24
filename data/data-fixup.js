/* T-FIXUP Mock Data */

window.JOJO_DATA['T-FIXUP'] = {
  v1: {
    G1: {
      page_id: 'G1-7b_U03_P02',
      workbook_id: 'G1-7b',
      unit: 3, page_in_unit: 2,
      template_id: 'T-FIXUP', variant: 'v1', grade: 'G1',
      domain: 'Writing', skill: 'capitalization_punctuation',
      ccss: ['L.1.2'],
      instruction_text: 'Circle the mistakes. Then write the correct sentence.',
      instruction_audio: 'fixup_cap_punct.mp3',
      items: [
        {
          incorrect_sentence: 'the cat sat on the mat',
          errors: [
            { word_index: 0, type: 'capitalization', incorrect: 'the', correct: 'The' },
            { word_index: 6, type: 'punctuation', incorrect: 'mat', correct: 'mat.' }
          ],
          correct_sentence: 'The cat sat on the mat.',
          input_type: 'type'
        },
        {
          incorrect_sentence: 'i like to play with my dog',
          errors: [
            { word_index: 0, type: 'capitalization', incorrect: 'i', correct: 'I' },
            { word_index: 7, type: 'punctuation', incorrect: 'dog', correct: 'dog.' }
          ],
          correct_sentence: 'I like to play with my dog.',
          input_type: 'type'
        },
        {
          incorrect_sentence: 'we went to the park on saturday',
          errors: [
            { word_index: 0, type: 'capitalization', incorrect: 'we', correct: 'We' },
            { word_index: 6, type: 'capitalization', incorrect: 'saturday', correct: 'Saturday' },
            { word_index: 6, type: 'punctuation', incorrect: 'saturday', correct: 'Saturday.' }
          ],
          correct_sentence: 'We went to the park on Saturday.',
          input_type: 'type'
        },
        {
          incorrect_sentence: 'do you like ice cream',
          errors: [
            { word_index: 0, type: 'capitalization', incorrect: 'do', correct: 'Do' },
            { word_index: 4, type: 'punctuation', incorrect: 'cream', correct: 'cream?' }
          ],
          correct_sentence: 'Do you like ice cream?',
          input_type: 'type'
        }
      ]
    }
  },
  v2: {
    G2: {
      page_id: 'G2-3_U03_P03',
      workbook_id: 'G2-3',
      unit: 3, page_in_unit: 3,
      template_id: 'T-FIXUP', variant: 'v2', grade: 'G2',
      domain: 'Spelling', skill: 'spelling_correction',
      ccss: ['L.2.2.d'],
      instruction_text: 'Find the spelling mistake in each sentence. Circle it and write the correct sentence.',
      instruction_audio: null,
      items: [
        {
          incorrect_sentence: 'The children are runing in the park.',
          errors: [{ word_index: 3, type: 'spelling', incorrect: 'runing', correct: 'running' }],
          correct_sentence: 'The children are running in the park.',
          input_type: 'type'
        },
        {
          incorrect_sentence: 'She is hopeing to win the race.',
          errors: [{ word_index: 2, type: 'spelling', incorrect: 'hopeing', correct: 'hoping' }],
          correct_sentence: 'She is hoping to win the race.',
          input_type: 'type'
        },
        {
          incorrect_sentence: 'The babys are sleeping now.',
          errors: [{ word_index: 1, type: 'spelling', incorrect: 'babys', correct: 'babies' }],
          correct_sentence: 'The babies are sleeping now.',
          input_type: 'type'
        },
        {
          incorrect_sentence: 'He is the hapiest boy in class.',
          errors: [{ word_index: 3, type: 'spelling', incorrect: 'hapiest', correct: 'happiest' }],
          correct_sentence: 'He is the happiest boy in class.',
          input_type: 'type'
        },
        {
          incorrect_sentence: 'We are makeing a sandcastle.',
          errors: [{ word_index: 2, type: 'spelling', incorrect: 'makeing', correct: 'making' }],
          correct_sentence: 'We are making a sandcastle.',
          input_type: 'type'
        }
      ]
    }
  },
  v3: {
    G2: {
      page_id: 'G2-10_U02_P03',
      workbook_id: 'G2-10',
      unit: 2, page_in_unit: 3,
      template_id: 'T-FIXUP', variant: 'v3', grade: 'G2',
      domain: 'Grammar', skill: 'verb_tense_correction',
      ccss: ['L.2.1'],
      instruction_text: 'Find the grammar mistake. Circle it and write the correct sentence.',
      instruction_audio: null,
      items: [
        {
          incorrect_sentence: 'She goed to the store yesterday.',
          errors: [{ word_index: 1, type: 'verb_form', incorrect: 'goed', correct: 'went' }],
          correct_sentence: 'She went to the store yesterday.',
          input_type: 'type'
        },
        {
          incorrect_sentence: 'The birds is singing in the tree.',
          errors: [{ word_index: 2, type: 'subject_verb', incorrect: 'is', correct: 'are' }],
          correct_sentence: 'The birds are singing in the tree.',
          input_type: 'type'
        },
        {
          incorrect_sentence: 'Him likes to eat pizza.',
          errors: [{ word_index: 0, type: 'pronoun', incorrect: 'Him', correct: 'He' }],
          correct_sentence: 'He likes to eat pizza.',
          input_type: 'type'
        },
        {
          incorrect_sentence: 'We eated lunch at noon.',
          errors: [{ word_index: 1, type: 'verb_form', incorrect: 'eated', correct: 'ate' }],
          correct_sentence: 'We ate lunch at noon.',
          input_type: 'type'
        }
      ]
    },
    G3: {
      page_id: 'G3-8_U01_P03',
      workbook_id: 'G3-8',
      unit: 1, page_in_unit: 3,
      template_id: 'T-FIXUP', variant: 'v3', grade: 'G3',
      domain: 'Grammar', skill: 'tense_consistency',
      ccss: ['L.3.1'],
      instruction_text: 'Each sentence has a grammar error. Find it, circle it, and rewrite correctly.',
      instruction_audio: null,
      items: [
        {
          incorrect_sentence: 'The dog chased the ball and then he catch it.',
          errors: [{ word_index: 8, type: 'verb_form', incorrect: 'catch', correct: 'caught' }],
          correct_sentence: 'The dog chased the ball and then he caught it.',
          input_type: 'type'
        },
        {
          incorrect_sentence: 'Neither the boys nor the girl were ready.',
          errors: [{ word_index: 6, type: 'subject_verb', incorrect: 'were', correct: 'was' }],
          correct_sentence: 'Neither the boys nor the girl was ready.',
          input_type: 'type'
        },
        {
          incorrect_sentence: 'Each of the students have their own desk.',
          errors: [{ word_index: 4, type: 'subject_verb', incorrect: 'have', correct: 'has' }],
          correct_sentence: 'Each of the students has their own desk.',
          input_type: 'type'
        }
      ]
    }
  },
  v4: {
    G3: {
      page_id: 'G3-8_U05_P02',
      workbook_id: 'G3-8',
      unit: 5, page_in_unit: 2,
      template_id: 'T-FIXUP', variant: 'v4', grade: 'G3',
      domain: 'Grammar', skill: 'mixed_errors',
      ccss: ['L.3.1', 'L.3.2'],
      instruction_text: 'Each sentence has multiple errors. Find them all, then write the correct version.',
      instruction_audio: null,
      items: [
        {
          incorrect_sentence: 'the dog runed to the park and him was happy',
          errors: [
            { word_index: 0, type: 'capitalization', incorrect: 'the', correct: 'The' },
            { word_index: 2, type: 'spelling', incorrect: 'runed', correct: 'ran' },
            { word_index: 7, type: 'pronoun', incorrect: 'him', correct: 'he' },
            { word_index: 9, type: 'punctuation', incorrect: 'happy', correct: 'happy.' }
          ],
          correct_sentence: 'The dog ran to the park and he was happy.',
          input_type: 'type'
        },
        {
          incorrect_sentence: 'me and sarah goed to the libary on wenesday',
          errors: [
            { word_index: 0, type: 'pronoun', incorrect: 'me', correct: 'Sarah' },
            { word_index: 2, type: 'capitalization', incorrect: 'sarah', correct: 'and I' },
            { word_index: 3, type: 'verb_form', incorrect: 'goed', correct: 'went' },
            { word_index: 6, type: 'spelling', incorrect: 'libary', correct: 'library' },
            { word_index: 8, type: 'capitalization', incorrect: 'wenesday', correct: 'Wednesday.' }
          ],
          correct_sentence: 'Sarah and I went to the library on Wednesday.',
          input_type: 'type'
        },
        {
          incorrect_sentence: 'their is too many cats in the house',
          errors: [
            { word_index: 0, type: 'homophone', incorrect: 'their', correct: 'There' },
            { word_index: 2, type: 'grammar', incorrect: 'too', correct: 'too' },
            { word_index: 6, type: 'punctuation', incorrect: 'house', correct: 'house.' }
          ],
          correct_sentence: 'There are too many cats in the house.',
          input_type: 'type'
        }
      ]
    }
  }
};
