// 后台服务脚本，处理提醒和通知
chrome.runtime.onInstalled.addListener(() => {
  console.log('日历待办事项扩展已安装');
  
  // 创建示例待办事项
  const exampleTodos = [
    {
      id: '1',
      title: '欢迎使用日历待办事项',
      description: '这是一个示例任务，您可以点击扩展图标查看完整功能',
      date: new Date().toISOString().split('T')[0],
      completed: false,
      priority: 'medium'
    }
  ];
  
  // 初始化存储
  chrome.storage.local.set({ todos: JSON.stringify(exampleTodos) }, () => {
    console.log('初始化待办事项完成');
  });
  
  // 设置每日提醒检查
  chrome.alarms.create('checkTodayTasks', {
    periodInMinutes: 60 // 每小时检查一次
  });
});

// 监听提醒
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'checkTodayTasks') {
    checkTodayTasks();
  }
});

// 检查今日任务并发送提醒
function checkTodayTasks() {
  chrome.storage.local.get(['todos'], function(result) {
    if (!result.todos || result.todos.length === 0) return;
    
    const today = new Date();
    const todayString = today.toISOString().split('T')[0]; // YYYY-MM-DD
    
    // 过滤今天的未完成任务
    const todayTasks = JSON.parse(result.todos).filter(todo => 
      todo.date === todayString && !todo.completed
    );
    
    if (todayTasks.length > 0) {
      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icons/icon-128.png',
        title: '今日待办提醒',
        message: `您有 ${todayTasks.length} 个待办事项需要完成`,
        priority: 2
      });
    }
  });
}

// 监听扩展图标点击事件
chrome.action.onClicked.addListener(() => {
  // 打开主应用
  chrome.tabs.create({ url: 'index.html' });
}); 