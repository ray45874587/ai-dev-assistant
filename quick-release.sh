#!/bin/bash

# 🚀 简化的GitHub发布准备脚本

set -e

# 颜色定义
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_message() {
    echo -e "${2}${1}${NC}"
}

print_message "🚀 AI开发辅助系统 GitHub发布准备" $BLUE
echo

# 获取当前版本
CURRENT_VERSION=$(node -p "require('./package.json').version")
print_message "📌 当前版本: v${CURRENT_VERSION}" $BLUE

# 检查必要文件
print_message "📁 检查项目文件..." $YELLOW

files_to_check=(
    "README.md"
    "INSTALL_GUIDE.md"
    "CONTRIBUTING.md"
    "CHANGELOG.md"
    "LICENSE"
    "package.json"
    "bin/ai-dev"
    "install.sh"
    "src/ai-dev-assistant.js"
    "src/ai-rules-engine.js"
)

all_files_exist=true
for file in "${files_to_check[@]}"; do
    if [[ -f "$file" ]] || [[ -d "$file" ]]; then
        print_message "  ✅ $file" $GREEN
    else
        print_message "  ❌ $file 缺失" $RED
        all_files_exist=false
    fi
done

if [[ "$all_files_exist" = true ]]; then
    print_message "✅ 所有必要文件都存在" $GREEN
else
    print_message "❌ 有文件缺失，请检查" $RED
    exit 1
fi

# 生成发布清单
cat > RELEASE_CHECKLIST.md << EOF
# 🚀 AI开发辅助系统发布指南

## 📋 GitHub发布步骤

### 1️⃣ 在GitHub创建新仓库
1. 访问 https://github.com/new
2. 仓库名称: \`ai-dev-assistant\`
3. 描述: \`🤖 基于第一性原理的通用AI开发助手，让AI真正理解你的项目\`
4. 设置为 **Public** 公开仓库
5. 不要初始化README（我们已经有了）
6. 点击 "Create repository"

### 2️⃣ 推送代码到GitHub
复制并运行以下命令（记得替换YOUR_USERNAME为你的GitHub用户名）：

\`\`\`bash
# 进入项目目录
cd /mnt/f/My_host/2025/Lingooo.com/public_html/Lingooo_next/ai-dev-assistant

# 初始化Git仓库（如果还没有）
git init

# 添加远程仓库
git remote add origin https://github.com/YOUR_USERNAME/ai-dev-assistant.git

# 设置主分支名
git branch -M main

# 添加所有文件
git add .

# 提交代码
git commit -m "🎉 Initial release v${CURRENT_VERSION} - Universal AI Development Assistant"

# 推送到GitHub
git push -u origin main
\`\`\`

### 3️⃣ 创建发布标签
\`\`\`bash
# 创建标签
git tag -a v${CURRENT_VERSION} -m "Release v${CURRENT_VERSION}"

# 推送标签
git push origin v${CURRENT_VERSION}
\`\`\`

### 4️⃣ 创建GitHub Release
1. 访问你的仓库页面
2. 点击 "Releases" 标签
3. 点击 "Create a new release"
4. 选择标签: \`v${CURRENT_VERSION}\`
5. 发布标题: \`AI开发辅助系统 v${CURRENT_VERSION}\`
6. 发布说明模板：

\`\`\`markdown
## 🎉 AI开发辅助系统首次发布！

### ✨ 核心特性
- 🧠 **智能项目分析**: 自动识别项目类型和技术栈
- 🎯 **个性化AI规则**: 基于项目特性生成定制AI助手规则
- 🔒 **安全隔离**: 完全不影响现有项目配置
- ⚡ **即插即用**: 30秒安装，零配置启动

### 🚀 快速开始
\\\`\\\`\\\`bash
# 直接下载使用
curl -fsSL https://raw.githubusercontent.com/YOUR_USERNAME/ai-dev-assistant/main/install.sh | bash

# 或克隆仓库
git clone https://github.com/YOUR_USERNAME/ai-dev-assistant.git
cd ai-dev-assistant
./install.sh
./bin/ai-dev init
\\\`\\\`\\\`

### 🎯 适用场景
✅ VS Code Copilot、Claude、Cursor等AI工具用户
✅ 团队协作开发项目
✅ 需要AI理解项目上下文
✅ 代码质量保障需求

### 📚 文档
- [完整安装指南](./INSTALL_GUIDE.md)
- [贡献指南](./CONTRIBUTING.md)
- [更新日志](./CHANGELOG.md)

---
🌟 让AI真正理解你的项目！欢迎Star和Fork！
\`\`\`

7. 点击 "Publish release"

## 🎯 发布后推广

### 社区分享
- [ ] 在相关技术社区分享
- [ ] 写技术博客介绍
- [ ] 社交媒体宣传

### 用户反馈
- [ ] 收集用户使用反馈
- [ ] 回复GitHub Issues
- [ ] 持续改进功能

## 📊 项目信息
- **版本**: v${CURRENT_VERSION}
- **许可证**: MIT
- **主要语言**: JavaScript/Bash
- **支持平台**: Linux, macOS, Windows (WSL)

---
*生成时间: $(date)*
EOF

print_message "🎉 发布准备完成！" $GREEN
echo
print_message "📋 下一步：查看 RELEASE_CHECKLIST.md 获取详细发布步骤" $BLUE
print_message "🔗 记得在GitHub发布后分享你的项目链接！" $YELLOW
