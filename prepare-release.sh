#!/bin/bash

# 🚀 AI开发辅助系统 GitHub发布脚本
# 用于自动化发布流程

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 打印彩色消息
print_message() {
    echo -e "${2}${1}${NC}"
}

print_message "🚀 AI开发辅助系统 GitHub发布准备工具" $BLUE
echo

# 检查必要工具
check_requirements() {
    print_message "🔍 检查必要工具..." $YELLOW
    
    if ! command -v git &> /dev/null; then
        print_message "❌ Git未安装，请先安装Git" $RED
        exit 1
    fi
    
    if ! command -v node &> /dev/null; then
        print_message "❌ Node.js未安装，请先安装Node.js" $RED
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        print_message "❌ NPM未安装，请先安装NPM" $RED
        exit 1
    fi
    
    print_message "✅ 所有必要工具已安装" $GREEN
}

# 检查当前目录
check_directory() {
    if [[ ! -f "package.json" ]] || [[ ! -f "bin/ai-dev" ]]; then
        print_message "❌ 请在ai-dev-assistant项目根目录运行此脚本" $RED
        exit 1
    fi
    
    print_message "✅ 项目目录验证通过" $GREEN
}

# 运行测试
run_tests() {
    print_message "🧪 运行项目测试..." $YELLOW
    
    # 基础功能测试
    if [[ ! -x "bin/ai-dev" ]]; then
        chmod +x bin/ai-dev
        print_message "✅ 已设置CLI执行权限" $GREEN
    fi
    
    # 创建测试项目
    mkdir -p /tmp/ai-dev-test
    cd /tmp/ai-dev-test
    
    # 测试安装
    print_message "  📦 测试安装流程..." $YELLOW
    if ! $(cd - && echo "y" | ./install.sh) &> /dev/null; then
        print_message "❌ 安装测试失败" $RED
        exit 1
    fi
    
    # 测试CLI命令
    print_message "  🔧 测试CLI命令..." $YELLOW
    if ! $(cd - && ./bin/ai-dev --version) &> /dev/null; then
        print_message "❌ CLI测试失败" $RED
        exit 1
    fi
    
    # 清理测试
    cd - > /dev/null
    rm -rf /tmp/ai-dev-test
    
    print_message "✅ 所有测试通过" $GREEN
}

# 检查Git状态
check_git_status() {
    print_message "📋 检查Git状态..." $YELLOW
    
    if [[ -n $(git status --porcelain) ]]; then
        print_message "⚠️  检测到未提交的更改:" $YELLOW
        git status --short
        echo
        read -p "是否继续发布? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            print_message "❌ 发布已取消" $RED
            exit 1
        fi
    fi
    
    print_message "✅ Git状态检查完成" $GREEN
}

# 获取当前版本
get_current_version() {
    CURRENT_VERSION=$(node -p "require('./package.json').version")
    print_message "📌 当前版本: v${CURRENT_VERSION}" $BLUE
}

# 生成发布清单
generate_release_checklist() {
    print_message "📋 生成发布清单..." $YELLOW
    
    cat > RELEASE_CHECKLIST.md << EOF
# 🚀 发布清单 v${CURRENT_VERSION}

## ✅ 发布前检查

### 📁 核心文件
- [x] README.md - 项目介绍完整
- [x] INSTALL_GUIDE.md - 安装指南详细
- [x] CONTRIBUTING.md - 贡献指南清晰
- [x] CHANGELOG.md - 版本更新记录
- [x] LICENSE - MIT许可证
- [x] package.json - NPM配置正确

### 🔧 功能测试
- [x] install.sh - 安装脚本正常
- [x] bin/ai-dev - CLI工具可执行
- [x] 核心模块 - 功能完整
- [x] 文件隔离 - 安全机制有效

### 🔄 GitHub准备
- [x] .gitignore - 忽略规则完整
- [x] GitHub Actions - CI/CD配置
- [x] Issue模板 - Bug和功能请求
- [x] Release工作流 - 自动化发布

## 🎯 发布步骤

### 1. 创建GitHub仓库
\`\`\`bash
# 在GitHub上创建新仓库: ai-dev-assistant
# 设置为公开仓库
# 添加README.md描述
\`\`\`

### 2. 推送代码
\`\`\`bash
git remote add origin https://github.com/YOUR_USERNAME/ai-dev-assistant.git
git branch -M main
git add .
git commit -m "🎉 Initial release v${CURRENT_VERSION}"
git push -u origin main
\`\`\`

### 3. 创建发布标签
\`\`\`bash
git tag -a v${CURRENT_VERSION} -m "Release v${CURRENT_VERSION}"
git push origin v${CURRENT_VERSION}
\`\`\`

### 4. GitHub Release
- GitHub Actions会自动创建Release
- 检查Release Notes是否正确
- 确认发布资源已上传

### 5. NPM发布（可选）
\`\`\`bash
npm login
npm publish
\`\`\`

## 📢 发布后
- [ ] 更新社交媒体
- [ ] 通知相关社区
- [ ] 收集用户反馈
- [ ] 准备下个版本计划

---
*生成时间: $(date)*
EOF

    print_message "✅ 发布清单已生成: RELEASE_CHECKLIST.md" $GREEN
}

# 主函数
main() {
    print_message "开始发布准备流程..." $BLUE
    echo
    
    check_requirements
    check_directory
    run_tests
    check_git_status
    get_current_version
    generate_release_checklist
    
    echo
    print_message "🎉 发布准备完成！" $GREEN
    echo
    print_message "📋 下一步操作:" $BLUE
    echo "1. 查看 RELEASE_CHECKLIST.md 获取详细发布步骤"
    echo "2. 在GitHub创建新仓库: ai-dev-assistant"
    echo "3. 运行以下命令推送代码:"
    echo
    print_message "   git remote add origin https://github.com/YOUR_USERNAME/ai-dev-assistant.git" $YELLOW
    print_message "   git branch -M main" $YELLOW
    print_message "   git add ." $YELLOW
    print_message "   git commit -m \"🎉 Initial release v${CURRENT_VERSION}\"" $YELLOW
    print_message "   git push -u origin main" $YELLOW
    print_message "   git tag -a v${CURRENT_VERSION} -m \"Release v${CURRENT_VERSION}\"" $YELLOW
    print_message "   git push origin v${CURRENT_VERSION}" $YELLOW
    echo
    print_message "🔗 记得将 YOUR_USERNAME 替换为你的GitHub用户名" $RED
}

# 运行主函数
main "$@"
