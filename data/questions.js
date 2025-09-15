// data/questions.js

// 将问题数据导出，以便在其他地方引用
export const questions = [{
	"question": "Café Wi-Fi: 你在咖啡店想问 Wi-Fi 密码，最自然的说法是？",
	"options": ["“Please give me your signal.”", "“Do you have Wi-Fi I can connect to?”", "“I need Wi-Fi for the internet now.”", "“Where is the internet password?”"],
	"answer": 1
},
{
	"question": "找地铁: 你迷路了，想问地铁站怎么走。",
	"options": ["“Metro station where?”", "“Help. I lost. Metro me.”", "“Can you tell me how to get to the metro station?”", "“I want go train now. Show me.”"],
	"answer": 2
},
{
	"question": "词义理解: “I can’t figure out how to fix it.” 这里 “figure out” 的意思是？",
	"options": ["Forget about", "Understand", "Change", "Write down"],
	"answer": 1
},
{
	"question": "口语表达: “I’ll ping you later” 的意思是 “我稍后联系你”。",
	"options": ["True", "False"],
	"answer": 0
},
{
	"question": "正确时态",
	"options": ["“He has go to the office.”", "“He gone to office.”", "“He has gone to the office.”", "“He have went to the office.”"],
	"answer": 2
},
{
	"question": "Pick up 用法",
	"options": ["“I want to pick up the internet.”", "“She pick up tired today.”", "“I will pick up my daughter from school.”", "“He pick up the job last month.”"],
	"answer": 2
},
{
	"question": "商务口语: “Shoot me an email” 是很凶的说法。",
	"options": ["True", "False"],
	"answer": 1
},
{
	"question": "订房确认: 你打电话给酒店确认预订，应怎么说？",
	"options": ["“Do you have my room now?”", "“I made a booking before. Tell me now.”", "“Can I check if my reservation is confirmed?”", "“I want to know if my booking is good.”"],
	"answer": 2
},
{
	"question": "会议汇报: 经理问项目进度，你说：",
	"options": ["“Some finished, some not.”", "“Still doing it. A bit slow.”", "“We’re 75% done and on track for the deadline.”", "“We are doing okay, not finished yet.”"],
	"answer": 2
},
{
	"question": "结束视频会议: 结束专业视频会议的自然说法是：",
	"options": ["“Finish now, I go.”", "“Bye-bye, see you next time.”", "“Okay, done.”", "“Thanks for your time. Let’s follow up by email.”"],
	"answer": 3
}];
export const evaluationLevels = [
  {
    "min_score": 0,
    "max_score": 4,
    "title": "Beginner Migrant 起步阶段",
    "description": "你的语言迁徙力刚刚启程，基础词汇和表达仍需加强，建议系统提升英语沟通自信心。"
  },
  {
    "min_score": 5,
    "max_score": 6,
    "title": "Functional Migrant 初级迁徙者",
    "description": "你已具备一定的跨境生存能力，在日常生活和简单职场沟通中可应对自如，但仍存在表达不自然或语法不准确的情况。"
  },
  {
    "min_score": 7,
    "max_score": 8,
    "title": "Confident Migrant 高级迁徙者",
    "description": "你具备清晰表达与理解复杂语境的能力，可以在跨国团队中良好合作，具备较强的语言迁徙力。"
  },
  {
    "min_score": 9,
    "max_score": 10,
    "title": "Strategic Migrant 全球迁徙力满分",
    "description": "恭喜！你的英语已经具备强大的迁徙能力，可轻松应对职场、社交与国际环境中的高阶交流，真正实现全球化语言适应力。"
  }
]