/**
 * game.js - 核心逻辑控制
 */
const GameEngine = {
    // 启动任务
    initTask(dayIndex) {
        const dayData = GAME_DATA.days[dayIndex - 1];
        if (!dayData) return;

        // 渲染任务详情页 UI
        const body = document.getElementById('game-body') || document.body; // 临时展示逻辑
        const modalHtml = `
            <div id="task-modal" style="position:fixed; top:50%; left:50%; transform:translate(-50%,-50%); width:90%; max-width:500px; background:white; border:5px solid #8B5A2B; border-radius:30px; padding:25px; z-index:2000;">
                <h2 style="color:#8B5A2B; text-align:center;">📍 第${dayData.day}天 · ${dayData.title}</h2>
                <div style="background:#FFF8E7; padding:15px; border-radius:15px; margin-bottom:20px;">
                    <p><strong>📖 学习内容：</strong>${dayData.content}</p>
                    <p>💡 <strong>核心概念：</strong>${dayData.concepts.join('、')}</p>
                </div>
                <button onclick="GameEngine.startQuiz(${dayIndex})" class="btn-primary" style="width:100%">开始练习题 →</button>
                <button onclick="document.getElementById('task-modal').remove()" style="display:block; margin:10px auto; background:none; border:none; color:#8B5A2B; cursor:pointer;">[暂时离开]</button>
            </div>
        `;
        const div = document.createElement('div');
        div.innerHTML = modalHtml;
        document.body.appendChild(div);
    },

    // 答题系统
    startQuiz(dayIndex) {
        const dayData = GAME_DATA.days[dayIndex - 1];
        const quiz = dayData.questions[0]; // 取第一道题作为演示
        
        const modal = document.getElementById('task-modal');
        modal.innerHTML = `
            <h3 style="text-align:center;">📝 练习题</h3>
            <p style="font-weight:bold;">${quiz.q}</p>
            ${quiz.options.map((opt, i) => `
                <button onclick="GameEngine.checkResult(${i}, ${quiz.right}, ${dayIndex})" class="btn-primary" style="width:100%; margin:8px 0; background:white;">${opt}</button>
            `).join('')}
        `;
    },

    // 检查结果并发放

        /**
 * game.js 逻辑增强
 */

// 1. 设施升级逻辑
GameEngine.upgradeFacility = function(fId) {
    const facility = GAME_DATA.facilities.find(f => f.id === fId);
    const currentLevel = Game.state.facilities[facility.name] || 0;
    const cost = facility.baseCost * (currentLevel + 1);

    if (Game.state.money >= cost) {
        Game.state.money -= cost;
        Game.state.facilities[facility.name] = currentLevel + 1;
        
        // 增加声望
        Game.state.prestige += 10;
        
        // 检查研究所等级提升
        this.checkInstituteLevel();
        
        Game.save();
        Game.updateUI();
        this.renderFacilities();
        alert(`🏗️ ${facility.name} 升级成功！当前等级：Lv.${currentLevel + 1}`);
    } else {
        alert("💰 资金不足，快去完成任务赚取奖励吧！");
    }
};

// 2. 检查研究所等级
GameEngine.checkInstituteLevel = function() {
    const totalLevels = Object.values(Game.state.facilities).reduce((a, b) => a + b, 0);
    if (totalLevels >= 15) Game.state.level = 6;
    else if (totalLevels >= 10) Game.state.level = 5;
    else if (totalLevels >= 6) Game.state.level = 4;
    else if (totalLevels >= 3) Game.state.level = 3;
    else if (totalLevels >= 1) Game.state.level = 2;
    
    // 更新称号
    const titles = ["白丁", "学徒", "研究小组", "团队", "中心", "殿堂"];
    Game.state.title = titles[Game.state.level - 1];
};

// 3. 渲染设施页面
GameEngine.renderFacilities = function() {
    const container = document.getElementById('facility-list');
    if (!container) return;
    
    container.innerHTML = GAME_DATA.facilities.map(f => {
        const lvl = Game.state.facilities[f.name] || 0;
        const cost = f.baseCost * (lvl + 1);
        return `
            <div class="npc-box" style="flex-direction: column; align-items: flex-start;">
                <div style="display:flex; align-items:center; gap:10px; width:100%;">
                    <span style="font-size:30px;">${f.emoji}</span>
                    <strong>${f.name} (Lv.${lvl})</strong>
                    <button onclick="GameEngine.upgradeFacility('${f.id}')" class="btn-primary" style="margin-left:auto; font-size:12px;">
                        升级 (💰${cost})
                    </button>
                </div>
                <p style="font-size:12px; margin:5px 0 0 40px; opacity:0.8;">${f.desc}</p>
            </div>
        `;
    }).join('');
};

// 4. 动态生成百科全书
GameEngine.renderWiki = function() {
    const container = document.getElementById('concept-list');
    if (!container) return;

    // 只有在已解锁的概念中显示的才叫“百科”
    const unlocked = Game.state.unlockedConcepts || [];
    if (unlocked.length === 0) {
        container.innerHTML = "<p style='text-align:center; width:100%; opacity:0.5;'>尚未解锁任何核心概念，快去学习吧！</p>";
        return;
    }

    container.innerHTML = unlocked.map(concept => `
        <div style="background:white; border:2px solid #8B5A2B; border-radius:15px; padding:10px; margin:5px; width:100%;">
            <strong style="color:#FFAA5C;"># ${concept}</strong>
            <p style="font-size:13px; margin:5px 0 0 0;">${GAME_DATA.wiki[concept] || "定义整理中..."}</p>
        </div>
    `).join('');
};

// 5. 修改原有的 checkResult，加入概念解锁逻辑
const oldCheckResult = GameEngine.checkResult;
GameEngine.checkResult = function(choice, right, day) {
    if (choice === right) {
        const dayData = GAME_DATA.days[day - 1];
        // 将当天概念加入已解锁列表
        if (!Game.state.unlockedConcepts) Game.state.unlockedConcepts = [];
        dayData.concepts.forEach(c => {
            if (!Game.state.unlockedConcepts.includes(c)) {
                Game.state.unlockedConcepts.push(c);
            }
        });
    }
    oldCheckResult.call(this, choice, right, day);
};
    }
};

// 覆盖 index.html 中的 startDay，使其调用引擎
Game.startDay = (day) => GameEngine.initTask(day);
