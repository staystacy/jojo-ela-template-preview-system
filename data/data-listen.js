/* T-LISTEN Mock Data */

window.JOJO_DATA['T-LISTEN'] = {
  v1: {
    PreK: {
      page_id: 'PK-2_U01_P05',
      workbook_id: 'PK-2',
      unit: 1, page_in_unit: 5,
      template_id: 'T-LISTEN', variant: 'v1', grade: 'PreK',
      domain: 'Phonics', skill: 'phoneme_identification',
      ccss: ['RF.K.2.a'],
      instruction_text: 'Listen to the sound. Circle the letter you hear.',
      instruction_audio: 'listen_phoneme.mp3',
      cell_size: 56,
      items: [
        { audio: 'phoneme_b.mp3', audio_type: 'phoneme', response_type: 'circle',
          options: [
            { content: 'B', correct: true },
            { content: 'D', correct: false },
            { content: 'P', correct: false },
            { content: 'G', correct: false }
          ] },
        { audio: 'phoneme_s.mp3', audio_type: 'phoneme', response_type: 'circle',
          options: [
            { content: 'Z', correct: false },
            { content: 'S', correct: true },
            { content: 'F', correct: false },
            { content: 'C', correct: false }
          ] },
        { audio: 'phoneme_m.mp3', audio_type: 'phoneme', response_type: 'circle',
          options: [
            { content: 'N', correct: false },
            { content: 'W', correct: false },
            { content: 'M', correct: true },
            { content: 'H', correct: false }
          ] },
        { audio: 'phoneme_t.mp3', audio_type: 'phoneme', response_type: 'circle',
          options: [
            { content: 'T', correct: true },
            { content: 'K', correct: false },
            { content: 'D', correct: false },
            { content: 'P', correct: false }
          ] }
      ]
    }
  },
  v2: {
    PreK: {
      page_id: 'PK-3_U02_P01',
      workbook_id: 'PK-3',
      unit: 2, page_in_unit: 1,
      template_id: 'T-LISTEN', variant: 'v2', grade: 'PreK',
      domain: 'Phonics', skill: 'word_recognition',
      ccss: ['RF.K.2.d'],
      instruction_text: 'Listen to the word. Circle its picture.',
      instruction_audio: 'listen_word_pic.mp3',
      cell_size: 56,
      items: [
        { audio: 'cat.mp3', audio_type: 'word', response_type: 'circle',
          options: [
            { content: 'cat.png', correct: true },
            { content: 'car.png', correct: false },
            { content: 'cup.png', correct: false },
            { content: 'cow.png', correct: false }
          ] },
        { audio: 'sun.mp3', audio_type: 'word', response_type: 'circle',
          options: [
            { content: 'sit.png', correct: false },
            { content: 'sun.png', correct: true },
            { content: 'six.png', correct: false },
            { content: 'sad.png', correct: false }
          ] },
        { audio: 'bed.mp3', audio_type: 'word', response_type: 'circle',
          options: [
            { content: 'bat.png', correct: false },
            { content: 'bus.png', correct: false },
            { content: 'bed.png', correct: true },
            { content: 'box.png', correct: false }
          ] }
      ]
    }
  },
  v3: {
    K: {
      page_id: 'K-9_U04_P02',
      workbook_id: 'K-9',
      unit: 4, page_in_unit: 2,
      template_id: 'T-LISTEN', variant: 'v3', grade: 'K',
      domain: 'Phonics', skill: 'dictation_word',
      ccss: ['RF.K.3.b'],
      instruction_text: 'Listen to the word. Write it in the boxes.',
      instruction_audio: 'listen_write.mp3',
      cell_size: 48,
      items: [
        { audio: 'run.mp3', audio_type: 'word', response_type: 'write', answer: 'run' },
        { audio: 'big.mp3', audio_type: 'word', response_type: 'write', answer: 'big' },
        { audio: 'hop.mp3', audio_type: 'word', response_type: 'write', answer: 'hop' },
        { audio: 'wet.mp3', audio_type: 'word', response_type: 'write', answer: 'wet' },
        { audio: 'fun.mp3', audio_type: 'word', response_type: 'write', answer: 'fun' }
      ]
    }
  },
  v4: {
    G1: {
      page_id: 'G1-8_U03_P02',
      workbook_id: 'G1-8',
      unit: 3, page_in_unit: 2,
      template_id: 'T-LISTEN', variant: 'v4', grade: 'G1',
      domain: 'Fluency', skill: 'sentence_dictation',
      ccss: ['RF.1.4.b'],
      instruction_text: 'Listen to the sentence. Type it exactly as you hear it.',
      instruction_audio: 'listen_sentence.mp3',
      cell_size: 40,
      items: [
        { audio: 'sent_1.mp3', audio_type: 'sentence', response_type: 'type', answer: 'The big dog ran to the park.' },
        { audio: 'sent_2.mp3', audio_type: 'sentence', response_type: 'type', answer: 'She can see the red bird.' },
        { audio: 'sent_3.mp3', audio_type: 'sentence', response_type: 'type', answer: 'We like to play in the rain.' }
      ]
    }
  }
};
