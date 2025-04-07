'use client';

import React, { useState } from 'react';

const DebugPage = () => {
  const [showForm, setShowForm] = useState(true);
  
  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">弹窗调试页</h1>
      
      <div className="flex gap-4">
        <div className="border-2 border-dashed border-blue-500 p-2 inline-block">
          <div className="flex flex-col h-[500px] w-[350px] bg-gray-50 p-2 overflow-hidden">
            <h1 className="text-lg font-bold text-center text-blue-600 mb-2">
              日历待办事项
            </h1>
            
            {showForm ? (
              <div className="bg-white rounded-lg shadow p-3 mb-2 overflow-auto flex-1 flex flex-col" style={{border: '1px solid red'}}>
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-md font-semibold">添加新任务</h2>
                  <button 
                    onClick={() => setShowForm(false)}
                    className="text-xs text-gray-500 hover:text-gray-700"
                  >
                    取消
                  </button>
                </div>
                
                <form className="flex flex-col flex-1" style={{border: '1px solid blue', minHeight: '300px'}}>
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
                      <select 
                        className="w-full px-2 py-1 text-sm border rounded"
                      >
                        <option value="low">低</option>
                        <option value="medium">中</option>
                        <option value="high">高</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-2 border-t" style={{border: '1px solid green'}}>
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
            ) : (
              <div className="flex justify-end mb-2 space-x-2">
                <button 
                  onClick={() => setShowForm(true)}
                  className="text-xs bg-green-500 hover:bg-green-600 text-white py-1 px-2 rounded"
                >
                  + 添加任务
                </button>
              </div>
            )}
            
            <div className="mt-1 text-center">
              <button 
                className="text-sm bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded"
              >
                打开完整日历应用
              </button>
            </div>
          </div>
        </div>
        
        <div className="flex-1">
          <h2 className="text-xl font-bold mb-2">解决方案指南</h2>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">排查按钮不显示的可能原因</h3>
            <ul className="list-disc list-inside space-y-2">
              <li>
                <strong>布局问题</strong>: 表单容器高度不足或溢出问题
                <p className="text-sm ml-6">确保容器有足够高度且不被其他元素遮挡</p>
              </li>
              <li>
                <strong>Flexbox布局</strong>: 检查flex-col和flex-1属性是否正确应用
                <p className="text-sm ml-6">调整flex-1的分配确保留下按钮空间</p>
              </li>
              <li>
                <strong>边距问题</strong>: mt-auto或间距不足
                <p className="text-sm ml-6">尝试使用明确的padding或margin</p>
              </li>
              <li>
                <strong>样式冲突</strong>: 确认Tailwind样式正确加载
                <p className="text-sm ml-6">检查CSS优先级冲突</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DebugPage; 