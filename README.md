# 🤖 AI开发辅助系统
<img width="680" height="285" alt="image" src="https://github.com/user-attachments/assets/9d9fa0cd-10a7-42e7-b0c1-06a5ed3c5b7c" />

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-1.2.0-green.svg)](package.json)
[![Node](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen.svg)](package.json)

> 基于第一性原理的通用AI开发助手，让AI真正理解你的项目

## ✨ 核心特性

- 🧠 **智能项目感知**: 自动识别项目类型、技术栈和架构
- 📋 **上下文管理**: 为AI助手提供精准的项目上下文
- 🛡️ **开发规范**: 内置代码规范和最佳实践约束
- 🔄 **智能更新**: 自动同步项目变更和文档
- 🔧 **即插即用**: 零配置启动，5分钟集成完成
- 🌍 **多语言支持**: 中英文界面和文档

## 🎯 适用场景

✅ **AI编程工具用户**: VS Code Copilot、Claude、Cursor、Tabnine等  
✅ **团队协作开发**: 统一开发规范和AI助手行为  
✅ **项目上下文管理**: 让AI理解项目架构和业务逻辑  
✅ **代码质量保障**: 自动化代码审查和规范检查  

## ⚡ 快速开始

### 1️⃣ 安装系统

```bash
# 方式1: 直接下载 (推荐)
curl -fsSL https://raw.githubusercontent.com/ray45874587/ai-dev-assistant/main/install.sh | bash

# 方式2: Git克隆
git clone https://github.com/ray45874587/ai-dev-assistant.git
cd ai-dev-assistant
./setup.sh

# 方式3: NPM安装
npm install -g ai-dev-assistant
ai-dev-init
```

### 2️⃣ 初始化项目

```bash
cd your-project
ai-dev-init
```

### 3️⃣ 开始使用

系统将自动：
- 🔍 分析您的项目结构
- 📝 生成项目上下文文档
- ⚙️ 配置AI助手规则
- 🚀 启用智能开发模式

## 📁 系统架构

```
your-project/
├── .ai-dev-assistant/          # 系统核心目录
│   ├── config/                 # 配置文件
│   │   ├── ai-rules.json      # AI助手规则
│   │   ├── project-config.json # 项目配置
│   │   └── dev-focus.json     # 开发焦点
│   ├── context/               # 上下文文件
│   │   ├── project-overview.md
│   │   ├── architecture.md
│   │   └── components/
│   ├── scripts/               # 自动化脚本
│   │   ├── context-updater.js
│   │   ├── code-analyzer.js
│   │   └── doc-generator.js
│   └── templates/             # 模板文件
├── .copilot-rules.json        # Copilot规则 (自动生成)
├── .ai-instructions.md        # AI指令 (自动生成)
└── README.md                  # 项目说明 (自动更新)
```

## 🔧 核心组件

### 1. 智能项目分析器
```javascript
// 自动识别项目类型和技术栈
const projectInfo = await analyzeProject();
// 输出: { type: 'next-js', stack: ['react', 'typescript'], ... }
```

### 2. 上下文管理器
```javascript
// 智能生成项目上下文
await generateContext('architecture');
await generateContext('components');
await generateContext('api');
```

### 3. AI规则引擎
```javascript
// 动态配置AI助手行为
await configureAIRules({
  focus: 'performance',
  style: 'enterprise',
  language: 'zh-cn'
});
```

## 📋 配置说明

### 基础配置 (.ai-dev-assistant/config/project-config.json)

```json
{
  "name": "your-project",
  "type": "auto-detect",
  "language": "zh-cn",
  "ai": {
    "focus": ["performance", "security", "maintainability"],
    "style": "enterprise",
    "verbosity": "normal"
  },
  "features": {
    "auto-context": true,
    "code-analysis": true,
    "doc-generation": true,
    "security-audit": true
  }
}
```

### AI规则配置 (.copilot-rules.json)

```json
{
  "version": "1.0.0",
  "name": "AI开发辅助系统规则集",
  "rules": {
    "codeQuality": {
      "enforceTypeScript": true,
      "requireTests": true,
      "maxComplexity": 10
    },
    "security": {
      "validateInputs": true,
      "preventInjection": true,
      "auditDependencies": true
    }
  }
}
```

## 🤖 AI助手命令

### 基础命令
```bash
ai-dev status          # 查看系统状态
ai-dev update          # 更新项目上下文
ai-dev analyze         # 分析代码质量
ai-dev docs            # 生成文档
ai-dev focus <area>    # 设置开发焦点
```

### 高级命令
```bash
ai-dev audit           # 安全审计
ai-dev refactor <path> # 智能重构
ai-dev optimize        # 性能优化建议
ai-dev test            # 生成测试用例
```

## 🔄 自动化工作流

### Git Hooks集成
```bash
# 提交前自动更新上下文
git commit → ai-dev update → 提交

# 推送前自动审计
git push → ai-dev audit → 推送
```

### CI/CD集成
```yaml
# .github/workflows/ai-dev-assistant.yml
- name: Update AI Context
  run: ai-dev update --ci
  
- name: Security Audit
  run: ai-dev audit --fail-on-high
```

## 🛡️ 安全特性

- ✅ **输入验证**: 防止注入攻击
- ✅ **权限控制**: 细粒度访问控制
- ✅ **审计日志**: 完整操作记录
- ✅ **依赖扫描**: 自动漏洞检测

## 🌍 多语言支持

```javascript
// 中文环境
ai-dev config --language zh-cn

// 英文环境  
ai-dev config --language en-us

// 自动检测
ai-dev config --language auto
```

## 📊 性能监控

```bash
# 查看系统性能
ai-dev metrics

# 输出示例:
# ✅ 上下文更新: 2.3s
# ✅ 代码分析: 1.8s  
# ✅ 文档生成: 0.9s
# 📊 总体评分: 95/100
```

## 🔧 自定义扩展

### 添加自定义规则
```javascript
// .ai-dev-assistant/config/custom-rules.js
module.exports = {
  rules: {
    'custom-naming': {
      pattern: /^[A-Z][a-zA-Z0-9]*$/,
      message: '组件名必须使用PascalCase'
    }
  }
};
```

### 添加自定义分析器
```javascript
// .ai-dev-assistant/analyzers/custom.js
module.exports = {
  name: 'custom-analyzer',
  analyze: async (projectPath) => {
    // 自定义分析逻辑
    return { score: 85, suggestions: [...] };
  }
};
```

## 📚 更多资源

- 📖 [完整文档](https://github.com/ray45874587/ai-dev-assistant/ai-dev-assistant.docs)
- 🎥 [视频教程](https://youtube.com/ai-dev-assistant)
- 💬 [社区讨论](https://github.com/ray45874587/ai-dev-assistant/discussions)
- 🐛 [问题反馈](https://github.com/ray45874587/ai-dev-assistant/issues)

## 🤝 贡献指南

我们欢迎社区贡献！请查看 [CONTRIBUTING.md](CONTRIBUTING.md) 了解详情。

## 📄 许可证

本项目采用 [MIT License](LICENSE) 开源协议。

## 🙏 致谢

感谢所有贡献者和AI编程工具的开发团队！

---

⭐ 如果这个项目对您有帮助，请给我们一个星标！
