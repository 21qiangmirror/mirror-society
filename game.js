/**
 * game.js - 核心逻辑控制（整合增强版）
 */
const GameEngine = {
    // 1. 启动任务
    initTask(dayIndex) {
        const dayData = GAME_DATA.days[dayIndex - 1];
        if (!dayData) return;

        const modalHtml = `
            <div id="task-modal" style="position:fixed; top:50%; left:50%; transform:translate(-50%,-50%); width:90%; max-width:500px; background:white; border:5px solid #8B5A2B; border-radius:30px; padding:25px; z-index:2000; box-shadow: 0 10px 30px rgba(0,0,0,0.2);">
                <h2 style="color:#8B5A2B; text-align:center;">📍 第${dayData.day}天 · ${dayData.title}</h2>
                <div style="background:#FFF8E7; padding:15px; border-radius:15px; margin-bottom:20px; max-height:300px; overflow-y:auto;">
                    <p><strong>📖 学习内容：</strong>${dayData.content}</p>
                    <p>💡 <strong>核心概念：</strong>${dayData.concepts.join('、')}</p>
                </div>
                <button onclick="GameEngine.startQuiz(${dayIndex})" class="btn-primary" style="width:100%">开始练习题 →</button>
                <button onclick="document.getElementById('task-modal').remove()" style="display:block; margin:10px auto; background:none; border:none; color:#8B5A2B; cursor:pointer;">[暂时离开]</button>
            </div>
        `;
        const div = document.createElement('div');
        div.id = "task-modal-container";
        div.innerHTML = modalHtml;
        document.body.appendChild(div);
    },

    // 2. 答题系统
    startQuiz(dayIndex) {
        const dayData = GAME_DATA.days[dayIndex - 1];
        const quiz = dayData.questions[0]; 
        
        const modal = document.getElementById('task-modal');
        modal.innerHTML = `
            <h3 style="text-align:center;">📝 练习题</h3>
            <p style="font-weight:bold; margin-bottom:20px;">${quiz.q}</p>
            ${quiz.options.map((opt, i) => `
                <button onclick="GameEngine.checkResult(${i}, ${quiz.right}, ${dayIndex})" class="btn-primary" style="width:100%; margin:8px 0; background:white; color:#8B5A2B;">${opt}</button>
            `).join('')}
        `;
    },

    // 3. 检查结果、发放奖励并解锁百科
    checkResult(choice, right, dayIndex) {
        if (choice === right) {
            const dayData = GAME_DATA.days[dayIndex - 1];
            
            // 奖励资源
            Game.state.money += 50;
            Game.state.knowledge += dayData.fragments;
            
            // 解锁百科概念
            if (!Game.state.unlockedConcepts) Game.state.unlockedConcepts = [];
            dayData.concepts.forEach(c => {
                if (!Game.state.unlockedConcepts.includes(c)) {
                    Game.state.unlockedConcepts.push(c);
                }
            });

            // 记录完成情况并解锁下一天
            if (!Game.state.completedTasks.includes(dayIndex)) {
                Game.state.completedTasks.push(dayIndex);
            }
            if (dayIndex === Game.state.unlockedDays && dayIndex < 28) {
                Game.state.unlockedDays++;
            }

            alert(`🍭 答对了！获得 💰x50 和 📚知识碎片x${dayData.fragments}\n已解锁百科：${dayData.concepts.join(', ')}`);
            
            Game.save();
            Game.updateUI();
            Game.renderDayGrid();
            document.getElementById('task-modal-container').remove();
        } else {
            alert("💔 配方不对，饼干碎了（答案错误），再看一遍内容吧！");
        }
    },

    // 4. 设施升级逻辑
    upgradeFacility(fId) {
        const facility = GAME_DATA.facilities.find(f => f.id === fId);
        if (!Game.state.facilities) Game.state.facilities = {};
        const currentLevel = Game.state.facilities[facility.name] || 0;
        const cost = facility.baseCost * (currentLevel + 1);

        if (Game.state.money >= cost) {
            Game.state.money -= cost;
            Game.state.facilities[facility.name] = currentLevel + 1;
            Game.state.prestige += 10;
            
            this.checkInstituteLevel();
            Game.save();
            Game.updateUI();
            this.renderFacilities();
            alert(`🏗️ ${facility.name} 升级成功！当前等级：Lv.${currentLevel + 1}`);
        } else {
            alert("💰 资金不足，快去完成任务赚取奖励吧！");
        }
    },

    // 5. 检查研究所等级与称号
    checkInstituteLevel() {
        const totalLevels = Object.values(Game.state.facilities || {}).reduce((a, b) => a + b, 0);
        let newLevel = 1;
        if (totalLevels >= 15) newLevel = 6;
        else if (totalLevels >= 10) newLevel = 5;
        else if (totalLevels >= 6) newLevel = 4;
        else if (totalLevels >= 3) newLevel = 3;
        else if (totalLevels >= 1) newLevel = 2;
        
        Game.state.level = newLevel;
        const titles = ["白丁", "学徒", "研究小组", "团队", "中心", "殿堂"];
        Game.state.title = titles[newLevel - 1];
    },

    // 6. 渲染设施页面内容
    renderFacilities() {
        const container = document.getElementById('facility-list');
        if (!container) return;
        
        if (!Game.state.facilities) Game.state.facilities = {};
        
        container.innerHTML = GAME_DATA.facilities.map(f => {
            const lvl = Game.state.facilities[f.name] || 0;
            const cost = f.baseCost * (lvl + 1);
            return `
                <div class="npc-box" style="flex-direction: column; align-items: flex-start; margin-bottom:15px;">
                    <div style="display:flex; align-items:center; gap:10px; width:100%;">
                        <span style="font-size:30px;">${f.emoji}</span>
                        <div style="flex-grow:1">
                            <strong style="display:block">${f.name}</strong>
                            <span style="font-size:12px; color:#8B5A2B">等级: Lv.${lvl}</span>
                        </div>
                        <button onclick="GameEngine.upgradeFacility('${f.id}')" class="btn-primary" style="font-size:12px; padding:8px 12px;">
                            升级 💰${cost}
                        </button>
                    </div>
                    <p style="font-size:12px; margin:10px 0 0 0; opacity:0.8;">${f.desc}</p>
                </div>
            `;
        }).join('');
    },

    // 7. 动态生成百科全书
    renderWiki() {
        const container = document.getElementById('concept-list');
        if (!container) return;

        const unlocked = Game.state.unlockedConcepts || [];
        if (unlocked.length === 0) {
            container.innerHTML = "<p style='text-align:center; width:100%; opacity:0.5; padding:20px;'>尚未解锁任何核心概念，快去学习吧！</p>";
            return;
        }

        container.innerHTML = unlocked.map(concept => `
            <div style="background:white; border:3px solid #8B5A2B; border-radius:15px; padding:15px; margin-bottom:10px; width:100%; box-shadow: 0 4px 0 #8B5A2B;">
                <strong style="color:#FFAA5C; font-size:16px;"># ${concept}</strong>
                <p style="font-size:14px; margin:8px 0 0 0; line-height:1.4;">${GAME_DATA.wiki[concept] || "定义正在整理中..."}</p>
            </div>
        `).join('');
    }
};

// 绑定初始化任务到主逻辑
Game.startDay = (day) => GameEngine.initTask(day);
