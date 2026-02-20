# 桃瀬日和 Live2D 接入说明

当前版本已实装右下角 AI 助手，并支持真实 Live2D 渲染。

## 1. 当前资源路径
模型入口：`/live2d/hiyori/hiyori_pro_t11.model3.json`

对应本地目录：
- `public/live2d/hiyori/hiyori_pro_t11.model3.json`
- `public/live2d/hiyori/hiyori_pro_t11.moc3`
- `public/live2d/hiyori/hiyori_pro_t11.2048/texture_00.png`
- `public/live2d/hiyori/hiyori_pro_t11.2048/texture_01.png`
- `public/live2d/hiyori/motion/*.motion3.json`

## 2. 渲染方式
`AssistantWidget` 会在浏览器端动态加载：
- `pixi.js`
- `pixi-live2d-display`

然后将 Live2D 模型渲染到右下角助手容器。

## 3. 回退机制
如果 `model3.json` 不存在，会自动回退到立绘模式：
- `/static/assistant/hiyori-placeholder.jpg`

如果 `model3.json` 存在，但 Live2D 运行时加载失败（如 CDN、WebGL、模型解析异常），也会回退到立绘模式，
并在面板中显示 `Live2D 错误：...`，不再误报“未检测到 model3.json”。

## 4. 你后续可以做的增强
1. 增加动作触发（点击/空闲时播放不同 motion）。
2. 按页面路由切换提示语。
3. 将聊天输入接到后端 `/api/assistant/chat`。
