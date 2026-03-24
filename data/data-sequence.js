/* T-SEQUENCE Mock Data */

window.JOJO_DATA['T-SEQUENCE'] = {
  v1: {
    K: {
      page_id: 'K-7_U03_P01',
      workbook_id: 'K-7',
      unit: 3, page_in_unit: 1,
      template_id: 'T-SEQUENCE', variant: 'v1', grade: 'K',
      domain: 'Reading', skill: 'story_sequencing',
      ccss: ['RL.K.2'],
      instruction_text: 'Put the story pictures in order. What happened first, next, and last?',
      instruction_audio: 'sequence_story.mp3',
      items: [
        { content: 'egg_in_nest.png', type: 'image', order: 1 },
        { content: 'egg_cracking.png', type: 'image', order: 2 },
        { content: 'baby_bird.png', type: 'image', order: 3 },
        { content: 'bird_flying.png', type: 'image', order: 4 }
      ],
      display_order: [3, 1, 4, 2]
    }
  },
  v2: {
    G1: {
      page_id: 'G1-5_U02_P03',
      workbook_id: 'G1-5',
      unit: 2, page_in_unit: 3,
      template_id: 'T-SEQUENCE', variant: 'v2', grade: 'G1',
      domain: 'Reading', skill: 'event_ordering',
      ccss: ['RL.1.2'],
      instruction_text: 'Read the events. Put them in the correct order.',
      instruction_audio: null,
      items: [
        { content: 'Tom woke up early in the morning.', type: 'text', order: 1 },
        { content: 'He ate cereal and drank orange juice.', type: 'text', order: 2 },
        { content: 'He walked to school with his friend.', type: 'text', order: 3 },
        { content: 'They played tag at recess.', type: 'text', order: 4 },
        { content: 'Tom came home and did his homework.', type: 'text', order: 5 }
      ],
      display_order: [4, 2, 5, 1, 3]
    },
    G2: {
      page_id: 'G2-4_U03_P02',
      workbook_id: 'G2-4',
      unit: 3, page_in_unit: 2,
      template_id: 'T-SEQUENCE', variant: 'v2', grade: 'G2',
      domain: 'Reading', skill: 'event_ordering_fiction',
      ccss: ['RL.2.5'],
      instruction_text: 'Put these story events in order from beginning to end.',
      instruction_audio: null,
      items: [
        { content: 'A tiny seed fell into the dirt.', type: 'text', order: 1 },
        { content: 'Rain came and watered the seed.', type: 'text', order: 2 },
        { content: 'A small green stem pushed up through the soil.', type: 'text', order: 3 },
        { content: 'The plant grew taller every day.', type: 'text', order: 4 },
        { content: 'A beautiful red flower bloomed at the top.', type: 'text', order: 5 }
      ],
      display_order: [3, 5, 1, 4, 2]
    }
  },
  v3: {
    PreK: {
      page_id: 'PK-1_U04_P01',
      workbook_id: 'PK-1',
      unit: 4, page_in_unit: 1,
      template_id: 'T-SEQUENCE', variant: 'v3', grade: 'PreK',
      domain: 'Letters', skill: 'alphabetical_order',
      ccss: ['RF.K.1.d'],
      instruction_text: 'Put the letters in ABC order.',
      instruction_audio: 'sequence_abc.mp3',
      items: [
        { content: 'A', type: 'text', order: 1 },
        { content: 'B', type: 'text', order: 2 },
        { content: 'C', type: 'text', order: 3 },
        { content: 'D', type: 'text', order: 4 }
      ],
      display_order: [2, 4, 1, 3]
    }
  },
  v4: {
    G2: {
      page_id: 'G2-8_U04_P01',
      workbook_id: 'G2-8',
      unit: 4, page_in_unit: 1,
      template_id: 'T-SEQUENCE', variant: 'v4', grade: 'G2',
      domain: 'Writing', skill: 'paragraph_ordering',
      ccss: ['W.2.3'],
      instruction_text: 'Arrange these sentences into a good paragraph.',
      instruction_audio: null,
      items: [
        { content: 'My favorite animal is the dolphin.', type: 'text', order: 1 },
        { content: 'Dolphins are very smart and playful.', type: 'text', order: 2 },
        { content: 'They live in the ocean and swim in groups called pods.', type: 'text', order: 3 },
        { content: 'Dolphins jump out of the water and do flips.', type: 'text', order: 4 },
        { content: 'I hope to see a real dolphin someday!', type: 'text', order: 5 }
      ],
      display_order: [4, 1, 5, 3, 2]
    },
    G3: {
      page_id: 'G3-7_U02_P03',
      workbook_id: 'G3-7',
      unit: 2, page_in_unit: 3,
      template_id: 'T-SEQUENCE', variant: 'v4', grade: 'G3',
      domain: 'Writing', skill: 'paragraph_structure',
      ccss: ['W.3.3'],
      instruction_text: 'Rearrange these sentences to make a well-organized paragraph.',
      instruction_audio: null,
      items: [
        { content: 'Volcanoes are openings in the Earth\'s surface where hot rock and gas escape.', type: 'text', order: 1 },
        { content: 'Deep underground, melted rock called magma builds up pressure.', type: 'text', order: 2 },
        { content: 'When the pressure becomes too great, the volcano erupts.', type: 'text', order: 3 },
        { content: 'Hot lava flows down the sides, and ash fills the sky.', type: 'text', order: 4 },
        { content: 'After the eruption, the lava cools and becomes new rock.', type: 'text', order: 5 },
        { content: 'Over time, plants begin to grow on this new land.', type: 'text', order: 6 }
      ],
      display_order: [4, 6, 2, 1, 5, 3]
    }
  }
};
