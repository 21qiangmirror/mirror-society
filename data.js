/**
 * data.js - 社会学研究所内容数据库
 */
const GAME_DATA = {
    // 角色定义
    roles: {
        director: { name: "研研所长", emoji: "🥐", title: "奶油泡芙", intro: "欢迎来到社会学研究所！" },
        theory: { name: "阿麦", emoji: "🌾", title: "小麦穗", intro: "理论是观察社会的显微镜。" }
    },

    // 第一周：社会学入门任务
    days: [
        {
            day: 1,
            title: "社会是什么",
            topic: "了解社会学的基本概念",
            content: "社会学是研究社会事实、社会互动及其规律的科学。社会的特征包括群体性、联系性和整体性。",
            concepts: ["社会", "社会学", "社会化"],
            fragments: 18,
            questions: [
                {
                    q: "关于‘社会’的概念，以下说法正确的是？",
                    options: ["社会就是一群人聚在一起", "社会具有群体性、联系性和整体性", "社会不需要整体性"],
                    right: 1
                }
            ]
        },
        {
            day: 2,
            title: "社会角色",
            topic: "探讨个体与位置的关系",
            content: "社会角色是与社会地位相一致的权利、义务和行为模式。常见的现象有角色冲突和角色不清。",
            concepts: ["社会角色", "角色集", "角色冲突"],
            fragments: 22,
            questions: [
                {
                    q: "一个人同时扮演父亲、经理和儿子时感到的压力属于？",
                    options: ["角色冲突", "角色不清", "角色失败"],
                    right: 0
                }
            ]
        },
        // 后续天数按此结构扩展...
    ],

    // 设施系统
    facilities: [
        { name: "接待大厅", emoji: "🏛️", cost: 100, desc: "每日签到、随机事件" },
        { name: "档案室", emoji: "📁", cost: 150, desc: "查看历史任务记录" }
    ]
};
