// data/questions.js

// 将问题数据导出，以便在其他地方引用
export const questions = [
  {
    question: "You're in a café, want Wi-Fi password: What's the most natural way to ask for the password?",
    options: [
      "Please give me your signal.",
      "Do you have Wi-Fi I can connect to?",
      "I need Wi-Fi for the internet now.",
      "Where is the internet password?"
    ],
    answer: 1,
  },
  {
    question: "You're lost in a foreign city and asking for directions to the metro station. What's the most effective way?",
    options: [
      "Metro station where?",
      "Help. I lost. Metro me.",
      "Can you tell me how to get to the metro station?",
      "I want go train now. Show me."
    ],
    answer: 2,
  },
  {
    question: "What does \"figure out\" mean in this sentence: \"I can't figure out how to solve this problem.\"",
    options: [
      "Forget about",
      "Understand",
      "Change",
      "Write down"
    ],
    answer: 1,
  },
  {
    question: "\"I'll ping you later\" is a casual way to say \"I'll contact you again soon.\"",
    options: [
      "True",
      "False"
    ],
    answer: 0,
  },
  {
    question: "Choose the correct sentence:",
    options: [
      "He has go to the office.",
      "He gone to office.",
      "He has gone to the office.",
      "He have went to the office."
    ],
    answer: 2,
  },
  {
    question: "Which of the following sentences uses \"pick up\" correctly?",
    options: [
      "I want to pick up the internet.",
      "She pick up tired today.",
      "I will pick up my daughter from school.",
      "He pick up the job last month."
    ],
    answer: 2,
  },
  {
    question: "\"Shoot me an email\" is an aggressive or rude way to say \"send me an email.\"",
    options: [
      "True",
      "False"
    ],
    answer: 1,
  },
  {
    question: "\"Circle back\" means \"I'll return to this topic later.\"",
    options: [
      "True",
      "False"
    ],
    answer: 0,
  },
  {
    question: "You're calling a hotel to ask if they received your booking. What should you say?",
    options: [
      "Do you have my room now?",
      "I made a booking before. Tell me now.",
      "Can I check if my reservation is confirmed?",
      "I want to know if my booking is good."
    ],
    answer: 2,
  },
  {
    question: "In a team meeting: Your manager asks for your project update. You reply:",
    options: [
      "Some finished, some not.",
      "Still doing it. A bit slow.",
      "We're 75% done, and on track for the deadline.",
      "We are doing okay, not finished yet."
    ],
    answer: 2,
  },
  {
    question: "Ending a Zoom call politely: What's a natural way to close a professional call?",
    options: [
      "Finish now, I go.",
      "Bye-bye, see you next time.",
      "Okay, done.",
      "Thanks for your time. Let's follow up by email."
    ],
    answer: 3,
  },
  {
    question: "Job interview: answering \"Tell me about yourself.\"",
    options: [
      "I am good person. I do good job.",
      "I have 5 years' experience in marketing and I'm passionate about digital strategy.",
      "My name is Lily. I like watching movies and cooking.",
      "I am a hardworking person who wants to work."
    ],
    answer: 1,
  },
];
export const evaluationLevels = [
  {
    "min_score": 0,
    "max_score": 4,
    "title": "Beginner Migrant",
    "description": "你的语言迁徙力刚刚启程，基础词汇和表达仍需加强，建议系统提升英语沟通自信心。"
  },
  {
    "min_score": 5,
    "max_score": 8,
    "title": "Functional Migrant",
    "description": "你已具备一定的跨境生存能力，在日常生活和简单职场沟通中可应对自如，但仍存在表达不自然或语法不准确的情况。"
  },
  {
    "min_score": 9,
    "max_score": 11,
    "title": "Confident Migrant",
    "description": "你具备清晰表达与理解复杂语境的能力，可以在跨国团队中良好合作，具备较强的语言迁徙力。"
  },
  {
    "min_score": 12,
    "max_score": 12,
    "title": "Strategic Migrant",
    "description": "恭喜！你的英语已经具备强大的迁徙能力，可轻松应对职场、社交与国际环境中的高阶交流，真正实现全球化语言适应力。"
  }
]