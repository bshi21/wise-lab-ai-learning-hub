# WISE Lab AI 学习中心

这是一个纯静态、中英双语的信息集散网站：它不托管课程、不收集学习进度、不执行 RAG、数据连接或自动化；它把不同角色带到适当的官方课程、视频与精选技术参考。

页面右上角的“中 / EN”可切换语言。选择会保存在当前浏览器中，打开另一条学习路径时会自动保持相同语言；如浏览器禁用本地存储，网站仍会以中文正常打开。

## 本地预览

在本目录运行：

```powershell
& 'C:\Users\shil6\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe' -m http.server 4173
```

然后在浏览器打开 `http://localhost:4173`。按 `Ctrl+C` 停止预览服务器。也可以直接双击 `index.html`，但使用本地服务器更接近之后的部署环境。

## 检查页面是否都可访问

```powershell
& 'C:\Users\shil6\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' tests/site-smoke.test.mjs
```

## 文件说明

- `index.html`：首页、角色入口、连接数据/自动简报的四步判断和资源分级说明。
- `foundations.html`：学生、科研助理和初学者的 AI 基础学习路径。
- `advanced-research.html`：博后与技术研究人员的 agent、RAG、连接器、评估和运维学习路径。
- `academic-workflows.html`：教职与团队负责人的 Microsoft 365、会议、写作、数据和自动简报学习路径。
- `styles.css`：全站视觉主题、桌面布局、手机响应式布局和可访问性样式。
- `i18n.js`：英文内容层和中英切换逻辑；默认中文内容仍直接保存在四个 HTML 页面中，以确保无脚本时也可阅读。
- `assets/WISE_NEW_LIGHT.png`：浅色背景页头使用的 WISE Lab logo。
- `assets/WISE_NEW_DARK.png`：深色页脚使用的 WISE Lab logo。
- `tests/site-smoke.test.mjs`：验证首页及三条学习路径可由静态服务器正确提供。

## 内容维护

每条外部资源都应保留提供者、格式、适用人群、前置条件、学习成果、访问说明和最后核验日期。每季度检查链接、QUT 访问条件与产品能力变化；涉及连接器、机构数据或自动化时，先确认批准路径和人工审阅责任。
