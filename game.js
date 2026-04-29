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

    // 检查结果并发放奖励
    checkResult(choice, right, day) {
        if (choice === right) {
            const dayData = GAME_DATA.days[day - 1];
            alert(`✨ 恭喜完成第${day}天！获得知识碎片📚 x${dayData.fragments}，资金💰 x50`);
            
            // 更新状态
            Game.state.knowledge += dayData.fragments;
            Game.state.money += 50;
            
            // 解锁下一天
            if (day === Game.state.unlockedDays && day < 28) {
                Game.state.unlockedDays++;
            }
            
            Game.save();
            Game.updateUI();
            Game.renderDayGrid();
            document.getElementById('task-modal').remove();
        } else {
            alert("💔 答案有误，再温习一下内容吧！");
        }
    }
};

// 覆盖 index.html 中的 startDay，使其调用引擎
Game.startDay = (day) => GameEngine.initTask(day);
