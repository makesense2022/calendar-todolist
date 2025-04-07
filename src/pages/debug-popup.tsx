import React from 'react';

// 导入弹窗组件代码（简化版，排除Chrome API相关部分）
const DebugPopup = () => {
  return (
    <div className="p-8 bg-gray-200 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">弹窗组件调试页面</h1>
      
      <div className="border-2 border-blue-500 p-2 inline-block bg-white">
        {/* 任务表单部分 */}
        <div className="bg-white rounded-lg shadow p-3 mb-2 w-[350px] h-[400px] flex flex-col">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-md font-semibold">添加新任务</h2>
            <button className="text-xs text-gray-500 hover:text-gray-700">
              取消
            </button>
          </div>
          
          <form className="flex flex-col flex-1">
            <div className="space-y-3 flex-1">
              <div>
                <label className="block text-sm text-gray-700 mb-1">标题</label>
                <input 
                  type="text" 
                  className="w-full px-2 py-1 text-sm border rounded"
                  placeholder="任务标题"
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-700 mb-1">日期</label>
                <input 
                  type="date" 
                  className="w-full px-2 py-1 text-sm border rounded"
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-700 mb-1">优先级</label>
                <select className="w-full px-2 py-1 text-sm border rounded">
                  <option value="low">低</option>
                  <option value="medium">中</option>
                  <option value="high">高</option>
                </select>
              </div>
            </div>
            
            <div className="mt-4 pt-2 border-t border-gray-200">
              <button 
                type="button"
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-3 rounded-md text-sm font-bold flex items-center justify-center"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                保存任务
              </button>
            </div>
          </form>
        </div>
      </div>
      
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-2">调试注意事项</h2>
        <ul className="list-disc ml-6">
          <li>此页面仅用于测试弹窗组件的样式和布局</li>
          <li>按钮点击不会触发实际功能</li>
          <li>通过Next.js开发服务器访问: <code className="bg-gray-100 px-1">http://localhost:3000/debug-popup</code></li>
        </ul>
      </div>
    </div>
  );
};

export default DebugPopup; 