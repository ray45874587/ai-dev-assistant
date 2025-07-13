# AI开发辅助系统 部署指南

## 🚀 快速部署到新项目

### 方法1: 使用安装脚本（推荐）

```bash
# 1. 下载安装脚本
curl -L https://raw.githubusercontent.com/your-repo/ai-dev-assistant/main/install.sh -o install.sh

# 2. 运行安装脚本
chmod +x install.sh
./install.sh

# 3. 开始使用
ai-dev status
```

### 方法2: 手动安装

```bash
# 1. 克隆仓库
git clone https://github.com/your-repo/ai-dev-assistant.git

# 2. 进入目录
cd ai-dev-assistant

# 3. 全局安装
npm install -g .

# 4. 在任意项目中初始化
cd /path/to/your/project
ai-dev init
```

### 方法3: 直接复制文件

```bash
# 1. 下载系统文件
wget https://github.com/your-repo/ai-dev-assistant/archive/main.zip
unzip main.zip

# 2. 复制到项目
cp -r ai-dev-assistant-main/.ai-dev-assistant ./
cp ai-dev-assistant-main/.copilot-rules.json ./
cp ai-dev-assistant-main/.ai-instructions.md ./

# 3. 手动配置
# 编辑 .copilot-rules.json 适配你的项目
```

## 📦 集成到现有项目

### Next.js 项目

```bash
# 进入Next.js项目目录
cd your-nextjs-project

# 初始化AI助手
ai-dev init

# 设置前端开发焦点
ai-dev focus performance

# 分析项目
ai-dev analyze
```

### Node.js API项目

```bash
# 进入Node.js项目目录
cd your-nodejs-api

# 初始化AI助手
ai-dev init

# 设置后端开发焦点
ai-dev focus security

# 执行安全审计
ai-dev audit
```

### React应用

```bash
# 进入React项目目录
cd your-react-app

# 初始化AI助手
ai-dev init

# 设置组件开发焦点
ai-dev focus testing

# 生成文档
ai-dev docs
```

### Python项目

```bash
# 进入Python项目目录
cd your-python-project

# 初始化AI助手
ai-dev init

# 设置代码质量焦点
ai-dev focus refactoring

# 分析代码
ai-dev analyze
```

## 🔧 自定义配置

### 项目特定规则

创建 `.ai-dev-assistant/config/custom-rules.json`:

```json
{
  "rules": {
    "custom": {
      "description": "项目特定规则",
      "checks": [
        {
          "id": "api-versioning",
          "description": "API必须包含版本号",
          "severity": "error"
        }
      ]
    }
  },
  "aiInstructions": {
    "custom": "遵循公司特定的编码规范和架构模式"
  }
}
```

### 团队配置模板

创建 `.ai-dev-assistant/templates/team-config.json`:

```json
{
  "team": "Frontend Team",
  "standards": {
    "codeStyle": "airbnb",
    "testCoverage": 80,
    "performance": {
      "lighthouse": 90,
      "bundleSize": "500kb"
    }
  },
  "workflows": {
    "preCommit": ["lint", "test", "ai-analyze"],
    "prReview": ["ai-audit", "performance-check"]
  }
}
```

## 🤖 CI/CD 集成

### GitHub Actions

创建 `.github/workflows/ai-assistant.yml`:

```yaml
name: AI Development Assistant

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  ai-analysis:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        
    - name: Install AI Dev Assistant
      run: |
        npm install -g https://github.com/your-repo/ai-dev-assistant.git
        
    - name: Initialize AI Assistant
      run: ai-dev init
      
    - name: Analyze Code Quality
      run: ai-dev analyze
      
    - name: Security Audit
      run: ai-dev audit
      
    - name: Upload Reports
      uses: actions/upload-artifact@v3
      with:
        name: ai-reports
        path: .ai-dev-assistant/context/
```

### GitLab CI

创建 `.gitlab-ci.yml`:

```yaml
stages:
  - ai-analysis

ai-code-analysis:
  stage: ai-analysis
  image: node:18
  script:
    - npm install -g https://github.com/your-repo/ai-dev-assistant.git
    - ai-dev init
    - ai-dev analyze
    - ai-dev audit
  artifacts:
    reports:
      junit: .ai-dev-assistant/context/*.xml
    paths:
      - .ai-dev-assistant/context/
  only:
    - merge_requests
    - main
```

### Jenkins Pipeline

创建 `Jenkinsfile`:

```groovy
pipeline {
    agent any
    
    stages {
        stage('AI Analysis') {
            steps {
                sh 'npm install -g https://github.com/your-repo/ai-dev-assistant.git'
                sh 'ai-dev init'
                sh 'ai-dev analyze'
                sh 'ai-dev audit'
            }
            post {
                always {
                    archiveArtifacts artifacts: '.ai-dev-assistant/context/*', fingerprint: true
                }
            }
        }
    }
}
```

## 🔀 Git Hooks 集成

### 预提交钩子

创建 `.git/hooks/pre-commit`:

```bash
#!/bin/bash

# 检查AI助手是否已安装
if command -v ai-dev &> /dev/null; then
    echo "🤖 运行AI代码分析..."
    
    # 更新上下文
    ai-dev update
    
    # 分析变更的文件
    git diff --cached --name-only | while read file; do
        if [[ "$file" =~ \.(js|ts|jsx|tsx|py)$ ]]; then
            ai-dev analyze "$file"
        fi
    done
    
    echo "✅ AI分析完成"
fi
```

### 提交消息钩子

创建 `.git/hooks/commit-msg`:

```bash
#!/bin/bash

# 使用AI助手优化提交消息
if command -v ai-dev &> /dev/null; then
    # 这里可以添加提交消息分析逻辑
    echo "📝 提交消息已记录"
fi
```

## 🐳 Docker 集成

### Dockerfile

```dockerfile
FROM node:18-alpine

# 安装AI开发助手
RUN npm install -g https://github.com/your-repo/ai-dev-assistant.git

# 设置工作目录
WORKDIR /app

# 复制项目文件
COPY . .

# 初始化AI助手
RUN ai-dev init

# 运行分析
RUN ai-dev analyze

# 生成文档
RUN ai-dev docs

EXPOSE 3000

CMD ["npm", "start"]
```

### docker-compose.yml

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    volumes:
      - ./.ai-dev-assistant:/app/.ai-dev-assistant
    environment:
      - AI_DEV_FOCUS=performance
      
  ai-analyzer:
    image: node:18-alpine
    volumes:
      - .:/workspace
    working_dir: /workspace
    command: |
      sh -c "
        npm install -g https://github.com/your-repo/ai-dev-assistant.git &&
        ai-dev init &&
        ai-dev analyze &&
        ai-dev audit
      "
```

## 📊 监控和报告

### 定期分析脚本

创建 `scripts/ai-monitor.sh`:

```bash
#!/bin/bash

# 定期AI分析脚本
echo "🔍 开始定期AI分析..."

# 更新上下文
ai-dev update

# 分析代码质量
ai-dev analyze > reports/daily-analysis.txt

# 安全审计
ai-dev audit > reports/daily-security.txt

# 生成报告
ai-dev docs

echo "📊 分析完成，报告已生成"

# 可选：发送邮件通知
# mail -s "AI分析报告" team@company.com < reports/daily-analysis.txt
```

### Crontab 定时任务

```bash
# 每天早上9点运行AI分析
0 9 * * * cd /path/to/project && ./scripts/ai-monitor.sh

# 每周一生成详细报告
0 9 * * 1 cd /path/to/project && ai-dev docs && ai-dev audit
```

## 🎯 最佳实践

### 1. 团队协作

- 确保所有团队成员使用相同的AI规则配置
- 定期同步 `.ai-dev-assistant/config/` 目录
- 在代码评审中参考AI建议

### 2. 渐进式部署

```bash
# 第一步：在单个项目中试用
ai-dev init
ai-dev analyze

# 第二步：配置团队规则
# 编辑 .copilot-rules.json

# 第三步：集成到CI/CD
# 添加到GitHub Actions

# 第四步：推广到其他项目
# 复制配置文件
```

### 3. 性能优化

- 大型项目可以分模块分析
- 使用 `.ai-dev-assistant/config/ignore.json` 排除不需要分析的文件
- 定期清理过期的分析数据

### 4. 安全考虑

- 不要在公共仓库中提交包含敏感信息的配置
- 使用环境变量管理API密钥
- 定期更新AI助手版本

## 🆘 故障排除

### 常见问题

1. **命令不存在**
   ```bash
   # 重新安装
   npm uninstall -g ai-dev-assistant
   npm install -g https://github.com/your-repo/ai-dev-assistant.git
   ```

2. **权限错误**
   ```bash
   # 修复权限
   sudo chown -R $(whoami) ~/.npm
   sudo chmod +x /usr/local/bin/ai-dev
   ```

3. **分析失败**
   ```bash
   # 清理并重新初始化
   ai-dev clean
   ai-dev init
   ```

## 📞 支持和贡献

- **文档**: [README.md](./README.md)
- **问题报告**: [GitHub Issues](https://github.com/your-repo/ai-dev-assistant/issues)
- **功能请求**: [GitHub Discussions](https://github.com/your-repo/ai-dev-assistant/discussions)
- **贡献指南**: [CONTRIBUTING.md](./CONTRIBUTING.md)

---

*由AI开发辅助系统自动生成*
