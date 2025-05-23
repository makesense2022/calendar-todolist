# 日历待办事项 - Chrome 扩展版本

这是日历待办事项应用的 Chrome 扩展版本，提供轻量级的待办事项管理功能。

## 简化版特点

此版本是对原网页应用功能的精简，重点关注在浏览器中快速管理待办事项：

- **简洁界面**: 精简的弹出窗口设计，聚焦于任务列表
- **基本功能**: 查看所有待办事项，区分优先级和完成状态
- **本地存储**: 使用 Chrome 存储 API 保存所有数据
- **轻量级**: 加载速度快，资源占用少

## 技术实现

简化版扩展做了以下技术调整：

- 使用轻量级的 React 组件，移除了复杂的日历和表单组件
- 简化了 CSS 和状态管理
- 直接使用 Chrome 存储 API 替代复杂的数据同步机制
- 移除了不必要的依赖

## 如何使用

1. 点击 Chrome 工具栏中的扩展图标，查看当前待办事项
2. 如需添加或编辑任务，点击"点击图标以打开完整应用"按钮
3. 任务按优先级使用不同颜色标记：
   - 红色: 高优先级
   - 橙色: 中等优先级
   - 绿色: 低优先级

## 对比完整版

| 功能          | 简化扩展版  | 完整网页版   |
| ------------- | ----------- | ------------ |
| 查看任务      | ✅          | ✅           |
| 添加/编辑任务 | ❌          | ✅           |
| 日历视图      | ❌          | ✅           |
| 天气信息      | ❌          | ✅           |
| 任务筛选      | ❌          | ✅           |
| 优先级标记    | ✅          | ✅           |
| 存储方式      | Chrome 存储 | localStorage |

## 开发扩展

如需自行构建和修改此扩展：

1. 确保已安装 Node.js 和 npm
2. 克隆仓库：`git clone <仓库地址>`
3. 安装依赖：`npm install`
4. 生成图标：`node scripts/generate-icons.js`
5. 构建扩展：`npm run build:extension`

构建完成后，打开 Chrome 浏览器的扩展管理页面(`chrome://extensions/`)，启用开发者模式，点击"加载已解压的扩展"按钮，然后选择项目中的`dist`目录进行加载。

## Chrome 插件版本

## 功能特点

- **简化界面**: 弹出窗口显示当月日历和任务列表
- **基础功能**: 查看、添加、完成和删除任务
- **本地存储**: 使用 Chrome 存储 API 保存任务数据
- **技术实现**: React 组件和 TypeScript 类型支持

## 开发环境设置

1. 克隆项目仓库

```bash
git clone https://github.com/yourusername/calendar-todolist.git
cd calendar-todolist
```

2. 安装依赖

```bash
npm install
```

3. 创建必要的插件图标

```bash
mkdir -p public/icons
touch public/icons/icon-{16,48,128}.png
# 请替换为实际的图标文件
```

4. 开发模式运行

```bash
npm run dev
```

## 构建 Chrome 插件

构建生产版本的 Chrome 插件:

```bash
npm run build:extension
```

这将在`dist`目录生成插件文件。

## 在 Chrome 浏览器中测试

1. 打开 Chrome 浏览器
2. 访问`chrome://extensions/`
3. 启用"开发者模式"(右上角)
4. 点击"加载已解压的扩展程序"
5. 选择项目中的`dist`目录

插件将被添加到 Chrome 浏览器中。点击工具栏中的插件图标可以使用日历待办事项功能。

## 发布到 Chrome 网上应用店

1. 准备必要的素材

   - 至少一张 1280x800 或 640x400 的截图
   - 128x128 的应用图标
   - 详细的应用描述

2. 注册 Chrome 开发者账号

   - 访问[Chrome 开发者控制台](https://chrome.google.com/webstore/devconsole)
   - 支付一次性注册费($5.00 USD)

3. 上传应用

   - 将`dist`目录打包为 zip 文件
   - 在开发者控制台点击"新建项目"
   - 上传 zip 文件
   - 填写所有必要的详细信息、截图和图标

4. 发布应用
   - 提交审核
   - 等待 Google 团队审核(通常需要几天时间)

## 注意事项

- Chrome 插件审核过程相对严格，确保你的插件符合[开发者计划政策](https://developer.chrome.com/docs/webstore/program_policies/)
- 首次审核可能需要更长时间，后续更新通常会更快

## 更新插件

1. 修改版本号

   - 更新`public/manifest.json`中的版本号

2. 重新构建插件

```bash
npm run build:extension
```

3. 在开发者控制台上传新版本
   - 在你的插件管理页面选择"上传更新版本"
   - 上传新的 zip 文件
   - 提交审核

## 插件架构

基本文件结构:

- `popup.html`: 点击插件图标时显示的弹出窗口
- `background.js`: 后台脚本，处理提醒和通知
- `manifest.json`: 插件配置文件，定义权限和功能
- 存储: 使用 Chrome Storage API 保存任务数据

## 已知问题和解决方法

### 已知问题

1. **数据同步问题**：

   - 弹窗中添加的任务可能不会立即显示在完整日历应用中
   - 日历上也没有相应日期标记
   - 原因：弹窗和完整日历应用使用了不同的数据加载机制

2. **新标签页交互问题**：
   - 新标签页（index.html）中点击"点击添加"或"添加新任务"按钮可能无法正常工作
   - 原因：Next.js 应用和插件 HTML 页面的交互存在冲突

### 临时解决方法

1. **对于数据同步问题**：

   - 添加任务后，关闭并重新打开新标签页
   - 或重启浏览器以强制同步数据

2. **对于新标签页交互问题**：
   - 优先通过弹窗界面添加任务
   - 然后刷新新标签页查看完整日历

### 后续版本改进计划

1. **统一存储机制**：

   - 将弹窗和完整日历应用使用相同的数据存取方式
   - 实现实时数据同步

2. **优化 Next.js 集成**：

   - 改进 Next.js 应用与 Chrome 插件页面的集成
   - 确保所有功能在两种环境下都能正常工作

3. **添加数据自动同步功能**：
   - 实现数据变更时的自动通知和刷新机制
   - 减少用户手动操作需求
