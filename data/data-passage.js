/* T-PASSAGE Mock Data — Full reading passages with comprehension questions */

window.JOJO_DATA['T-PASSAGE'] = {
  v1: {
    K: {
      page_id: 'K-7_U01_P02',
      workbook_id: 'K-7',
      unit: 1, page_in_unit: 2,
      template_id: 'T-PASSAGE', variant: 'v1', grade: 'K',
      domain: 'Reading', skill: 'picture_comprehension',
      ccss: ['RL.K.1', 'RL.K.2'],
      instruction_text: 'Read the story. Answer the questions.',
      instruction_audio: 'passage_k.mp3',
      passage: {
        title: 'The Big Red Ball',
        text: 'Sam has a big red ball. He kicks the ball in the park. The ball goes up, up, up! It lands in a tree. A bird looks at the ball. Sam laughs. Dad helps Sam get the ball back.',
        image: 'red_ball.png',
        word_count: 42,
        genre: 'fiction'
      },
      questions: [
        { question: 'What color is the ball?', response_type: 'circle',
          options: [{ text: 'red', correct: true }, { text: 'blue', correct: false }] },
        { question: 'Where does the ball land?', response_type: 'circle',
          options: [{ text: 'in a tree', correct: true }, { text: 'in the pond', correct: false }] },
        { question: 'Who helps Sam?', response_type: 'circle',
          options: [{ text: 'Dad', correct: true }, { text: 'Mom', correct: false }] }
      ]
    }
  },
  v2: {
    G1: {
      page_id: 'G1-5_U01_P03',
      workbook_id: 'G1-5',
      unit: 1, page_in_unit: 3,
      template_id: 'T-PASSAGE', variant: 'v2', grade: 'G1',
      domain: 'Reading', skill: 'story_elements',
      ccss: ['RL.1.1', 'RL.1.3'],
      instruction_text: 'Read the story. Then answer the questions.',
      instruction_audio: null,
      passage: {
        title: 'Lily and the Lost Kitten',
        text: 'Lily was walking home from school when she heard a tiny sound. Meow! Meow! She looked behind a bush and found a small orange kitten. It was shaking and wet from the rain. "Don\'t worry," said Lily. She picked up the kitten and wrapped it in her jacket. At home, Lily gave the kitten warm milk. Mom said they could keep it if no one came to claim it. Lily named the kitten Sunny because its fur was the color of sunshine.',
        image: 'lily_kitten.png',
        word_count: 87,
        genre: 'fiction'
      },
      questions: [
        { question: 'Where did Lily find the kitten?', response_type: 'circle',
          options: [{ text: 'behind a bush', correct: true }, { text: 'at school', correct: false }] },
        { question: 'How was the kitten feeling?', response_type: 'type', answer: 'The kitten was scared and wet.', answer_lines: 1 },
        { question: 'Why did Lily name the kitten Sunny?', response_type: 'type', answer: 'Because its fur was the color of sunshine.', answer_lines: 1 },
        { question: 'What kind of person is Lily? How do you know?', response_type: 'type', answer: 'Lily is kind because she helped the kitten.', answer_lines: 1 }
      ]
    }
  },
  v3: {
    G2: {
      page_id: 'G2-4_U02_P01',
      workbook_id: 'G2-4',
      unit: 2, page_in_unit: 1,
      template_id: 'T-PASSAGE', variant: 'v3', grade: 'G2',
      domain: 'Reading', skill: 'character_analysis',
      ccss: ['RL.2.1', 'RL.2.3'],
      instruction_text: 'Read the story carefully. Answer each question in a complete sentence.',
      instruction_audio: null,
      passage: {
        title: 'The Science Fair Project',
        text: 'Maya wanted to win the school science fair more than anything. She decided to build a model volcano that would really erupt. Every day after school, she worked on her project. She mixed baking soda and vinegar to test the eruption. Sometimes it fizzed too much and made a big mess in the kitchen. Her older brother Jake laughed at the mess, but he also helped her paint the volcano to look realistic. On the day of the fair, Maya was so nervous that her hands were shaking. When she pressed the button and the volcano erupted perfectly, the whole class cheered. She did not win first place — a boy named Carlos won with his solar-powered car. But Maya won second place, and she was proud because she had never given up, even when things got messy.',
        image: 'volcano_project.png',
        word_count: 148,
        genre: 'fiction'
      },
      questions: [
        { question: 'What was Maya\'s science fair project?', response_type: 'type', answer: 'Maya built a model volcano that could erupt.', answer_lines: 2 },
        { question: 'What problem did Maya face while working on her project?', response_type: 'type', answer: 'The eruption sometimes fizzed too much and made a mess.', answer_lines: 2 },
        { question: 'How did Maya feel at the science fair? Use evidence from the text.', response_type: 'type', answer: 'She was nervous because her hands were shaking.', answer_lines: 2 },
        { question: 'What is the lesson or message of this story?', response_type: 'type', answer: 'You should be proud of your hard work even if you don\'t win first place.', answer_lines: 2 },
        { question: 'How did Jake help Maya? Was he a good brother?', response_type: 'type', answer: 'Jake helped paint the volcano. Even though he laughed, he still helped.', answer_lines: 2 }
      ]
    }
  },
  v4: {
    G3: {
      page_id: 'G3-2_U01_P02',
      workbook_id: 'G3-2',
      unit: 1, page_in_unit: 2,
      template_id: 'T-PASSAGE', variant: 'v4', grade: 'G3',
      domain: 'Reading', skill: 'theme_analysis',
      ccss: ['RL.3.1', 'RL.3.2'],
      instruction_text: 'Read the passage. Answer each question with complete sentences and evidence from the text.',
      instruction_audio: null,
      passage: {
        title: 'The Tallest Sunflower',
        text: 'Every spring, the students in Mrs. Chen\'s class planted sunflower seeds in the school garden. This year, there was a contest to see who could grow the tallest sunflower by the end of June.\n\nEmma planted her seed in a sunny corner and watered it every single day. She measured it each week and recorded the height in her notebook. Her friend Noah planted his seed nearby, but he often forgot to water it. By May, Emma\'s sunflower was already taller than her desk.\n\nOne morning, Emma noticed that Noah\'s plant was wilting badly. Its leaves were brown and drooping. She knew she was competing against Noah, but she couldn\'t just watch his plant die. After watering her own sunflower, she quietly watered Noah\'s too.\n\nShe kept doing this every day without telling anyone. Slowly, Noah\'s sunflower came back to life. By June, Emma\'s sunflower was the tallest in the class at 5 feet 2 inches. Noah\'s was close behind at 4 feet 10 inches.\n\nWhen Mrs. Chen asked Emma how her sunflower grew so well, Emma smiled and said, "I think sunflowers grow best when you take care of more than just your own." Mrs. Chen gave Emma a special award for both the tallest sunflower and the kindest gardener.',
        image: 'sunflower_garden.png',
        word_count: 212,
        genre: 'fiction',
        allow_annotation: true
      },
      questions: [
        { question: 'What is the theme of this story? Support your answer with evidence.', response_type: 'type', answer: 'The theme is that kindness and helping others is more important than winning. Emma helped Noah even though they were competing.', answer_lines: 3 },
        { question: 'How are Emma and Noah different as characters?', response_type: 'type', answer: 'Emma is responsible and kind — she waters every day and helps Noah. Noah is forgetful and doesn\'t take care of his plant.', answer_lines: 3 },
        { question: 'Why did Emma water Noah\'s plant secretly?', response_type: 'type', answer: 'She probably didn\'t want Noah to feel bad or didn\'t want attention for being helpful.', answer_lines: 3 },
        { question: 'What does Emma\'s last sentence to Mrs. Chen mean?', response_type: 'type', answer: 'She means that when you care for others, good things happen for everyone, not just yourself.', answer_lines: 3 },
        { question: 'Do you think Emma deserved both awards? Explain your thinking.', response_type: 'type', answer: 'Yes, because she worked hard on her own sunflower AND helped Noah\'s plant survive. She was both skilled and kind.', answer_lines: 4 }
      ]
    }
  },
  v5: {
    G2: {
      page_id: 'G2-5_U04_P01',
      workbook_id: 'G2-5',
      unit: 4, page_in_unit: 1,
      template_id: 'T-PASSAGE', variant: 'v5', grade: 'G2',
      domain: 'Reading', skill: 'compare_texts',
      ccss: ['RI.2.9'],
      instruction_text: 'Read both passages. Then answer the questions comparing them.',
      instruction_audio: null,
      passages: [
        {
          title: 'Honey Bees',
          text: 'Honey bees are amazing insects that live in large groups called colonies. A colony can have up to 60,000 bees! Each bee has a job. Worker bees fly from flower to flower collecting nectar and pollen. They bring it back to the hive and turn the nectar into honey. The queen bee\'s only job is to lay eggs. Bees communicate by doing a special "waggle dance" that tells other bees where to find flowers.',
          word_count: 70,
          genre: 'nonfiction'
        },
        {
          title: 'Butterflies',
          text: 'Butterflies are colorful insects that go through an amazing change called metamorphosis. They start life as tiny eggs, then become caterpillars that eat leaves all day long. After a few weeks, the caterpillar makes a chrysalis around itself. Inside, it transforms into a beautiful butterfly. Unlike bees, butterflies live alone. They drink nectar from flowers using a long, curly tongue called a proboscis.',
          word_count: 64,
          genre: 'nonfiction'
        }
      ],
      questions: [
        { question: 'How are bees and butterflies similar?', response_type: 'type', answer: 'Both are insects that visit flowers and drink nectar.', answer_lines: 2 },
        { question: 'How are bees and butterflies different in how they live?', response_type: 'type', answer: 'Bees live in large groups (colonies) but butterflies live alone.', answer_lines: 2 },
        { question: 'Which insect goes through metamorphosis?', response_type: 'type', answer: 'Butterflies go through metamorphosis.', answer_lines: 2 },
        { question: 'What special ability does each insect have?', response_type: 'type', answer: 'Bees do a waggle dance. Butterflies transform in a chrysalis.', answer_lines: 2 }
      ]
    }
  },
  v6: {
    G2: {
      page_id: 'G2-5_U03_P02',
      workbook_id: 'G2-5',
      unit: 3, page_in_unit: 2,
      template_id: 'T-PASSAGE', variant: 'v6', grade: 'G2',
      domain: 'Reading', skill: 'charts_and_data',
      ccss: ['RI.2.5', 'RI.2.7'],
      instruction_text: 'Read the passage and look at the chart. Use both to answer the questions.',
      instruction_audio: null,
      passage: {
        title: 'Animals at Green Lake Park',
        text: 'The students in Mr. Kim\'s class visited Green Lake Park to count animals for a science project. They spent two hours walking around the lake and recording every animal they saw. They were surprised to find so many different kinds of animals in one park! Ducks were the most common animal. The students also spotted squirrels running up trees, rabbits hiding in the bushes, and a few turtles sunning themselves on rocks.',
        image: 'green_lake.png',
        word_count: 73,
        genre: 'nonfiction'
      },
      chart: {
        type: 'bar_chart',
        title: 'Animals Counted at Green Lake Park',
        data: [
          { label: 'Ducks', value: 14 },
          { label: 'Squirrels', value: 8 },
          { label: 'Rabbits', value: 5 },
          { label: 'Turtles', value: 3 },
          { label: 'Birds', value: 11 }
        ]
      },
      questions: [
        { question: 'Which animal did the students see the most?', response_type: 'type', answer: 'The students saw the most ducks (14).', answer_lines: 1 },
        { question: 'How many more ducks than rabbits did they count?', response_type: 'type', answer: 'They counted 9 more ducks than rabbits (14 - 5 = 9).', answer_lines: 1 },
        { question: 'Why do you think there were fewer turtles than ducks?', response_type: 'type', answer: 'Turtles are slower and harder to spot, or there may just be fewer turtles living at the lake.', answer_lines: 2 },
        { question: 'What was the total number of animals counted?', response_type: 'type', answer: 'The total was 41 animals (14 + 8 + 5 + 3 + 11).', answer_lines: 1 },
        { question: 'Does the chart match what the passage says? How do you know?', response_type: 'type', answer: 'Yes, the passage says ducks were most common and the chart shows ducks with the highest bar.', answer_lines: 2 }
      ]
    },
    G3: {
      page_id: 'G3-3_U04_P01',
      workbook_id: 'G3-3',
      unit: 4, page_in_unit: 1,
      template_id: 'T-PASSAGE', variant: 'v6', grade: 'G3',
      domain: 'Reading', skill: 'nonfiction_with_data',
      ccss: ['RI.3.1', 'RI.3.7'],
      instruction_text: 'Read the article and study the chart. Answer using evidence from both.',
      instruction_audio: null,
      passage: {
        title: 'Water Usage at Oakwood Elementary',
        text: 'Oakwood Elementary School wanted to save water. The principal, Ms. Torres, asked each grade to track how much water they used during one week. The fifth graders used the most water because they had the largest class and ran a garden-watering project. The first graders used the least because there were fewer students and they mostly drank from water fountains.\n\nAfter seeing the results, the school started a "Water Wise" program. They put up signs near sinks reminding students to turn off the faucet. They installed special low-flow faucets in the bathrooms. By the next month, total water use dropped by almost 20 percent.',
        image: 'water_chart.png',
        word_count: 112,
        genre: 'nonfiction'
      },
      chart: {
        type: 'bar_chart',
        title: 'Weekly Water Use by Grade (gallons)',
        data: [
          { label: '1st', value: 45 },
          { label: '2nd', value: 62 },
          { label: '3rd', value: 78 },
          { label: '4th', value: 85 },
          { label: '5th', value: 110 }
        ]
      },
      questions: [
        { question: 'Which grade used the most water? Why?', response_type: 'type', answer: '5th grade used 110 gallons because they had the largest class and a garden project.', answer_lines: 2 },
        { question: 'How much more water did 5th graders use than 1st graders?', response_type: 'type', answer: '65 more gallons (110 - 45 = 65).', answer_lines: 1 },
        { question: 'What two things did the school do to save water?', response_type: 'type', answer: 'They put up signs near sinks and installed low-flow faucets.', answer_lines: 2 },
        { question: 'The school saved 20% of water. If total weekly use was 380 gallons, about how many gallons did they save?', response_type: 'type', answer: 'About 76 gallons (380 x 0.20 = 76).', answer_lines: 2 }
      ]
    }
  }
};
