# 日历任务管理系统

一个现代化的日历和待办事项管理应用，支持多种视图和丰富的任务管理功能。

## 功能特点

- **日历视图**：支持月/周/日三种视图切换
- **待办事项管理**：创建、编辑、删除和查看待办事项
- **任务属性**：支持标题、日期、时间、优先级、备注等属性
- **重复任务**：支持设置每天/每周/每月重复的任务
- **本地存储**：使用 localStorage 保存数据，支持离线使用

## 技术栈

- **Next.js** - React 框架
- **TypeScript** - 类型安全的 JavaScript
- **Tailwind CSS** - 实用优先的 CSS 框架
- **Zustand** - 状态管理
- **Framer Motion** - 动画库
- **Date-fns** - 日期处理
- **React Hook Form** - 表单处理

## 运行项目

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 启动生产服务器
npm start
```

## 开发说明

- 应用基于组件化架构设计
- 使用 Zustand 进行状态管理，所有数据保存在 localStorage
- 响应式设计，适配桌面和移动设备
- 支持浅色/深色模式

## 使用方法

1. 选择日历视图（月/周/日）
2. 点击日期或时间槽创建新任务
3. 在右侧边栏查看和管理所有任务
4. 点击任务可查看详情和编辑

## 联系与支持

如有问题或建议，请通过 Issues 提交反馈。

## Chrome 扩展版本

本项目现在支持作为 Chrome 浏览器扩展使用，允许用户直接从浏览器访问日历和待办事项。

### 特点

- 浏览器工具栏快速访问日历和待办事项
- 简洁的弹出窗口界面，显示当前任务
- 使用 Chrome 存储 API 保存数据

### 安装说明

1. 克隆仓库并安装依赖：

```bash
git clone <仓库地址>
cd calendar-todolist
npm install
```

2. 构建 Chrome 扩展：

```bash
npm run build:extension
```

3. 在 Chrome 浏览器中加载扩展：

   - 打开 Chrome 浏览器，进入 `chrome://extensions/`
   - 启用"开发者模式"（右上角）
   - 点击"加载已解压的扩展"
   - 选择项目中的 `dist` 目录

4. 扩展将出现在 Chrome 工具栏中，点击图标即可使用日历待办事项功能。
