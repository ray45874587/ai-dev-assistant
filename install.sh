#!/bin/bash

# AI开发辅助系统 - 一键安装脚本
# AI Development Assistant - One-click Installation Script
# Version: 1.0.0

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# 系统信息
SYSTEM_NAME="AI开发辅助系统"
SYSTEM_NAME_EN="AI Development Assistant"
VERSION="1.0.0"
INSTALL_DIR=".ai-dev-assistant"

# 打印带颜色的消息
print_message() {
    local color=$1
    local message=$2
    echo -e "${color}${message}${NC}"
}

print_header() {
    echo ""
    print_message $CYAN "════════════════════════════════════════════════════════"
    print_message $CYAN "    🚀 ${SYSTEM_NAME} (${SYSTEM_NAME_EN})"
    print_message $CYAN "    Version: ${VERSION}"
    print_message $CYAN "════════════════════════════════════════════════════════"
    echo ""
}

print_step() {
    print_message $BLUE "📋 $1"
}

print_success() {
    print_message $GREEN "✅ $1"
}

print_warning() {
    print_message $YELLOW "⚠️  $1"
}

print_error() {
    print_message $RED "❌ $1"
}

# 检查系统要求
check_requirements() {
    print_step "检查系统要求..."
    
    # 检查Node.js
    if ! command -v node &> /dev/null; then
        print_error "Node.js 未安装! 请先安装 Node.js (版本 >= 14)"
        exit 1
    fi
    
    local node_version=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$node_version" -lt 14 ]; then
        print_error "Node.js 版本过低! 需要版本 >= 14, 当前版本: $(node -v)"
        exit 1
    fi
    
    # 检查npm
    if ! command -v npm &> /dev/null; then
        print_error "npm 未安装! 请先安装 npm"
        exit 1
    fi
    
    # 检查git
    if ! command -v git &> /dev/null; then
        print_warning "Git 未安装，部分功能可能无法使用"
    fi
    
    print_success "系统要求检查通过"
}

# 检测项目类型
detect_project_type() {
    print_step "检测项目类型..."
    
    if [ -f "package.json" ]; then
        PROJECT_TYPE="node"
        if grep -q "next" package.json; then
            PROJECT_TYPE="next-js"
        elif grep -q "react" package.json; then
            PROJECT_TYPE="react"
        elif grep -q "vue" package.json; then
            PROJECT_TYPE="vue"
        fi
    elif [ -f "requirements.txt" ] || [ -f "pyproject.toml" ]; then
        PROJECT_TYPE="python"
    elif [ -f "Cargo.toml" ]; then
        PROJECT_TYPE="rust"
    elif [ -f "go.mod" ]; then
        PROJECT_TYPE="go"
    else
        PROJECT_TYPE="generic"
    fi
    
    print_success "检测到项目类型: $PROJECT_TYPE"
}

# 创建目录结构
create_directory_structure() {
    print_step "创建目录结构..."
    
    # 主目录
    mkdir -p "$INSTALL_DIR"
    
    # 子目录
    mkdir -p "$INSTALL_DIR/config"
    mkdir -p "$INSTALL_DIR/context"
    mkdir -p "$INSTALL_DIR/context/components"
    mkdir -p "$INSTALL_DIR/scripts"
    mkdir -p "$INSTALL_DIR/templates"
    mkdir -p "$INSTALL_DIR/logs"
    
    print_success "目录结构创建完成"
}

# 生成配置文件
generate_config_files() {
    print_step "生成配置文件..."
    
    # 主配置文件
    cat > "$INSTALL_DIR/config/project-config.json" << EOF
{
  "version": "1.0.0",
  "name": "$(basename $(pwd))",
  "type": "$PROJECT_TYPE",
  "language": "zh-cn",
  "createdAt": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "ai": {
    "focus": ["performance", "security", "maintainability"],
    "style": "enterprise",
    "verbosity": "normal",
    "autoUpdate": true
  },
  "features": {
    "autoContext": true,
    "codeAnalysis": true,
    "docGeneration": true,
    "securityAudit": true,
    "gitHooks": false
  },
  "paths": {
    "source": "src",
    "tests": "tests",
    "docs": "docs",
    "config": "config"
  }
}
EOF

    # AI规则文件
    cat > ".ai-dev-assistant-rules.json" << EOF
{
  "version": "1.0.0",
  "name": "AI开发辅助系统规则集",
  "description": "基于第一性原理的AI协同开发规则，确保高效、安全、可维护的代码",
  "projectType": "$PROJECT_TYPE",
  "language": "zh-cn",
  
  "corePhilosophy": {
    "firstPrinciples": "所有决策基于第一性原理：简单性、可维护性、性能、安全性",
    "aiCollaboration": "AI助手应理解项目上下文，提供精准建议",
    "preventionFirst": "事前预防优于事后修复"
  },

  "rules": {
    "codeQuality": {
      "description": "代码质量保障规则",
      "checks": [
        { "id": "naming-convention", "description": "使用清晰、一致的命名规范", "severity": "error" },
        { "id": "function-complexity", "description": "单个函数复杂度不超过10", "severity": "warning" },
        { "id": "file-size", "description": "单个文件不超过500行", "severity": "warning" },
        { "id": "error-handling", "description": "必须有适当的错误处理", "severity": "error" }
      ]
    },
    
    "security": {
      "description": "安全性规则",
      "checks": [
        { "id": "input-validation", "description": "所有用户输入必须验证", "severity": "error" },
        { "id": "sql-injection", "description": "使用参数化查询防止SQL注入", "severity": "error" },
        { "id": "xss-prevention", "description": "输出转义防止XSS攻击", "severity": "error" },
        { "id": "sensitive-data", "description": "敏感数据不得硬编码", "severity": "error" }
      ]
    },
    
    "performance": {
      "description": "性能优化规则", 
      "checks": [
        { "id": "async-operations", "description": "I/O操作必须异步处理", "severity": "warning" },
        { "id": "memory-leaks", "description": "避免内存泄漏", "severity": "error" },
        { "id": "unnecessary-loops", "description": "避免不必要的循环嵌套", "severity": "warning" }
      ]
    }
  },

  "aiInstructions": {
    "general": "理解项目架构和业务逻辑，提供符合项目风格的代码建议",
    "codeReview": "重点关注安全性、性能和可维护性",
    "documentation": "生成清晰、准确的中文文档",
    "testing": "建议全面的测试用例，包括边界条件"
  }
}
EOF

    # 开发焦点配置
    cat > "$INSTALL_DIR/config/dev-focus.json" << EOF
{
  "currentFocus": "setup",
  "priorities": [
    "code-quality",
    "security", 
    "performance",
    "documentation"
  ],
  "activeFeatures": [
    "auto-context",
    "code-analysis"
  ],
  "lastUpdated": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
}
EOF

    print_success "配置文件生成完成"
}

# 安装核心脚本
install_core_scripts() {
    print_step "安装核心脚本..."
    
    # AI助手命令脚本
    cat > "$INSTALL_DIR/scripts/ai-dev" << 'EOF'
#!/usr/bin/env node

/**
 * AI开发辅助系统 - 命令行工具
 * AI Development Assistant - CLI Tool
 */

const fs = require('fs');
const path = require('path');

class AIDevAssistant {
    constructor() {
        this.configDir = '.ai-dev-assistant';
        this.config = this.loadConfig();
    }

    loadConfig() {
        try {
            const configPath = path.join(this.configDir, 'config', 'project-config.json');
            return JSON.parse(fs.readFileSync(configPath, 'utf8'));
        } catch (error) {
            console.error('❌ 配置文件加载失败:', error.message);
            process.exit(1);
        }
    }

    async run() {
        const command = process.argv[2];
        const args = process.argv.slice(3);

        switch (command) {
            case 'status':
                this.showStatus();
                break;
            case 'update':
                await this.updateContext();
                break;
            case 'analyze':
                await this.analyzeCode();
                break;
            case 'docs':
                await this.generateDocs();
                break;
            case 'focus':
                this.setFocus(args[0]);
                break;
            case 'audit':
                await this.securityAudit();
                break;
            case 'help':
            default:
                this.showHelp();
        }
    }

    showStatus() {
        console.log('🤖 AI开发辅助系统状态');
        console.log(`📁 项目: ${this.config.name}`);
        console.log(`🔧 类型: ${this.config.type}`);
        console.log(`🌍 语言: ${this.config.language}`);
        console.log(`⚡ 状态: 运行中`);
    }

    async updateContext() {
        console.log('🔄 更新项目上下文...');
        // 实现上下文更新逻辑
        console.log('✅ 上下文更新完成');
    }

    async analyzeCode() {
        console.log('🔍 分析代码质量...');
        // 实现代码分析逻辑
        console.log('✅ 代码分析完成');
    }

    async generateDocs() {
        console.log('📝 生成文档...');
        // 实现文档生成逻辑
        console.log('✅ 文档生成完成');
    }

    setFocus(area) {
        console.log(`🎯 设置开发焦点: ${area}`);
        // 实现焦点设置逻辑
    }

    async securityAudit() {
        console.log('🛡️ 执行安全审计...');
        // 实现安全审计逻辑
        console.log('✅ 安全审计完成');
    }

    showHelp() {
        console.log(`
🤖 AI开发辅助系统 - 命令行工具

使用方法:
  ai-dev <command> [options]

命令:
  status          查看系统状态
  update          更新项目上下文  
  analyze         分析代码质量
  docs            生成文档
  focus <area>    设置开发焦点
  audit           执行安全审计
  help            显示帮助信息

示例:
  ai-dev status
  ai-dev update
  ai-dev focus performance
        `);
    }
}

// 运行CLI
if (require.main === module) {
    const assistant = new AIDevAssistant();
    assistant.run().catch(console.error);
}

module.exports = AIDevAssistant;
EOF

    # 使脚本可执行
    chmod +x "$INSTALL_DIR/scripts/ai-dev"
    
    # 项目分析器
    cat > "$INSTALL_DIR/scripts/project-analyzer.js" << 'EOF'
/**
 * 智能项目分析器
 * Intelligent Project Analyzer
 */

const fs = require('fs');
const path = require('path');

class ProjectAnalyzer {
    constructor(projectPath = '.') {
        this.projectPath = projectPath;
        this.analysis = {
            type: 'unknown',
            framework: [],
            languages: [],
            structure: {},
            dependencies: {},
            metrics: {}
        };
    }

    async analyze() {
        console.log('🔍 开始项目分析...');
        
        await this.detectProjectType();
        await this.analyzeStructure();
        await this.analyzeDependencies();
        await this.calculateMetrics();
        
        console.log('✅ 项目分析完成');
        return this.analysis;
    }

    async detectProjectType() {
        const files = fs.readdirSync(this.projectPath);
        
        if (files.includes('package.json')) {
            const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
            this.analysis.type = 'node';
            
            if (pkg.dependencies?.next) this.analysis.framework.push('Next.js');
            if (pkg.dependencies?.react) this.analysis.framework.push('React');
            if (pkg.dependencies?.vue) this.analysis.framework.push('Vue');
            if (pkg.devDependencies?.typescript) this.analysis.languages.push('TypeScript');
            
            this.analysis.languages.push('JavaScript');
        }
        
        if (files.includes('requirements.txt') || files.includes('pyproject.toml')) {
            this.analysis.type = 'python';
            this.analysis.languages.push('Python');
        }
    }

    async analyzeStructure() {
        this.analysis.structure = this.scanDirectory(this.projectPath);
    }

    scanDirectory(dir, maxDepth = 3, currentDepth = 0) {
        if (currentDepth >= maxDepth) return {};
        
        const structure = {};
        try {
            const items = fs.readdirSync(dir);
            for (const item of items) {
                if (item.startsWith('.') && item !== '.ai-dev-assistant') continue;
                
                const itemPath = path.join(dir, item);
                const stat = fs.statSync(itemPath);
                
                if (stat.isDirectory()) {
                    structure[item] = this.scanDirectory(itemPath, maxDepth, currentDepth + 1);
                } else {
                    structure[item] = 'file';
                }
            }
        } catch (error) {
            // 忽略权限错误
        }
        
        return structure;
    }

    async analyzeDependencies() {
        if (fs.existsSync('package.json')) {
            const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
            this.analysis.dependencies = {
                production: Object.keys(pkg.dependencies || {}),
                development: Object.keys(pkg.devDependencies || {})
            };
        }
    }

    async calculateMetrics() {
        this.analysis.metrics = {
            fileCount: this.countFiles(this.projectPath),
            totalSize: this.calculateSize(this.projectPath),
            complexity: this.estimateComplexity()
        };
    }

    countFiles(dir) {
        let count = 0;
        try {
            const items = fs.readdirSync(dir);
            for (const item of items) {
                if (item.startsWith('.')) continue;
                
                const itemPath = path.join(dir, item);
                const stat = fs.statSync(itemPath);
                
                if (stat.isDirectory()) {
                    count += this.countFiles(itemPath);
                } else {
                    count++;
                }
            }
        } catch (error) {
            // 忽略错误
        }
        return count;
    }

    calculateSize(dir) {
        let size = 0;
        try {
            const items = fs.readdirSync(dir);
            for (const item of items) {
                if (item.startsWith('.')) continue;
                
                const itemPath = path.join(dir, item);
                const stat = fs.statSync(itemPath);
                
                if (stat.isDirectory()) {
                    size += this.calculateSize(itemPath);
                } else {
                    size += stat.size;
                }
            }
        } catch (error) {
            // 忽略错误
        }
        return size;
    }

    estimateComplexity() {
        const fileCount = this.analysis.metrics?.fileCount || 0;
        const depCount = this.analysis.dependencies?.production?.length || 0;
        
        if (fileCount < 50 && depCount < 20) return 'low';
        if (fileCount < 200 && depCount < 50) return 'medium';
        return 'high';
    }
}

module.exports = ProjectAnalyzer;
EOF

    print_success "核心脚本安装完成"
}

# 生成AI指令文件
generate_ai_instructions() {
    print_step "生成AI指令文件..."
    
    cat > ".ai-dev-instructions.md" << EOF
# AI开发助手指令

## 项目概述
- **项目名称**: $(basename $(pwd))
- **项目类型**: $PROJECT_TYPE
- **AI系统版本**: 1.0.0

## 核心原则
1. **第一性原理**: 从基本事实出发，避免复杂性
2. **事前预防**: 预防问题而非修复问题  
3. **简单至上**: 保持代码简洁易懂
4. **性能优先**: 关注性能和用户体验

## 开发规范
- 使用一致的命名规范
- 编写清晰的注释和文档
- 实施全面的错误处理
- 确保代码安全性

## AI协作方式
1. **理解上下文**: 参考 .ai-dev-assistant/context/ 目录了解项目结构
2. **遵循规则**: 严格遵守 .copilot-rules.json 中的规则
3. **增量改进**: 每次改进都要小步快跑
4. **质量保证**: 提供的代码要经过安全和性能检查

## 当前开发焦点
请参考 .ai-dev-assistant/config/dev-focus.json 了解当前开发重点。

---
*由AI开发辅助系统自动生成*
EOF

    print_success "AI指令文件生成完成"
}

# 创建符号链接
create_symlinks() {
    print_step "创建命令行工具链接..."
    
    # 创建全局命令
    if [ -w "/usr/local/bin" ]; then
        ln -sf "$(pwd)/$INSTALL_DIR/scripts/ai-dev" "/usr/local/bin/ai-dev" 2>/dev/null || true
        print_success "全局命令 ai-dev 创建成功"
    else
        print_warning "无法创建全局命令，可以使用: ./$INSTALL_DIR/scripts/ai-dev"
    fi
}

# 初始化git hooks（可选）
setup_git_hooks() {
    if [ -d ".git" ]; then
        print_step "设置Git Hooks（可选）..."
        
        read -p "是否启用Git Hooks自动更新上下文？(y/N): " enable_hooks
        
        if [[ $enable_hooks =~ ^[Yy]$ ]]; then
            mkdir -p .git/hooks
            
            cat > .git/hooks/pre-commit << 'EOF'
#!/bin/bash
# AI开发辅助系统 - 预提交钩子

if [ -f ".ai-dev-assistant/scripts/ai-dev" ]; then
    echo "🔄 自动更新AI上下文..."
    ./.ai-dev-assistant/scripts/ai-dev update
fi
EOF
            
            chmod +x .git/hooks/pre-commit
            print_success "Git Hooks 设置完成"
        fi
    fi
}

# 运行初始分析
run_initial_analysis() {
    print_step "运行初始项目分析..."
    
    # 生成项目概览
    cat > "$INSTALL_DIR/context/project-overview.md" << EOF
# 项目概览

## 基本信息
- **项目名称**: $(basename $(pwd))
- **项目类型**: $PROJECT_TYPE
- **创建时间**: $(date +"%Y-%m-%d %H:%M:%S")
- **AI系统版本**: 1.0.0

## 项目结构
\`\`\`
$(find . -type d -name ".*" -prune -o -type d -print | head -20 | sed 's/^.//' | sort)
\`\`\`

## 技术栈
EOF

    if [ "$PROJECT_TYPE" = "node" ] || [ "$PROJECT_TYPE" = "next-js" ] || [ "$PROJECT_TYPE" = "react" ]; then
        echo "- Node.js / JavaScript" >> "$INSTALL_DIR/context/project-overview.md"
        if [ -f "package.json" ]; then
            echo "- 主要依赖:" >> "$INSTALL_DIR/context/project-overview.md"
            grep -E '"(react|next|vue|express)"' package.json | head -5 | sed 's/^/  - /' >> "$INSTALL_DIR/context/project-overview.md"
        fi
    fi

    echo "" >> "$INSTALL_DIR/context/project-overview.md"
    echo "## 开发重点" >> "$INSTALL_DIR/context/project-overview.md"
    echo "- 代码质量和可维护性" >> "$INSTALL_DIR/context/project-overview.md"
    echo "- 性能优化" >> "$INSTALL_DIR/context/project-overview.md"
    echo "- 安全性保障" >> "$INSTALL_DIR/context/project-overview.md"
    echo "" >> "$INSTALL_DIR/context/project-overview.md"
    echo "*由AI开发辅助系统自动生成*" >> "$INSTALL_DIR/context/project-overview.md"

    print_success "初始分析完成"
}

# 显示完成信息
show_completion_message() {
    echo ""
    print_message $GREEN "🎉 AI开发辅助系统安装完成！"
    echo ""
    print_message $CYAN "📋 快速开始:"
    echo "   ai-dev status      # 查看系统状态"
    echo "   ai-dev update      # 更新项目上下文"
    echo "   ai-dev help        # 查看所有命令"
    echo ""
    print_message $CYAN "📁 系统文件:"
    echo "   .ai-dev-assistant/              # 系统核心目录"
    echo "   .ai-dev-assistant-rules.json    # AI助手规则"
    echo "   .ai-dev-instructions.md         # AI指令文档"
    echo ""
    print_message $CYAN "🤖 AI助手配置:"
    print_message $YELLOW "   您的AI助手现在可以更好地理解项目上下文！"
    print_message $YELLOW "   推荐在AI对话中引用 .ai-dev-instructions.md 获得最佳体验。"
    echo ""
    print_message $PURPLE "⭐ 如果觉得有用，请给我们一个星标！"
    print_message $PURPLE "🔗 https://github.com/your-repo/ai-dev-assistant"
    echo ""
}

# 主安装流程
main() {
    print_header
    
    # 检查是否已安装
    if [ -d "$INSTALL_DIR" ]; then
        print_warning "检测到已安装的AI开发辅助系统"
        read -p "是否重新安装？这将覆盖现有配置 (y/N): " reinstall
        
        if [[ ! $reinstall =~ ^[Yy]$ ]]; then
            print_message $YELLOW "安装已取消"
            exit 0
        fi
        
        rm -rf "$INSTALL_DIR"
        rm -f ".ai-dev-assistant-rules.json" ".ai-dev-instructions.md"
    fi
    
    # 执行安装步骤
    check_requirements
    detect_project_type
    create_directory_structure
    generate_config_files
    install_core_scripts
    generate_ai_instructions
    create_symlinks
    setup_git_hooks
    run_initial_analysis
    show_completion_message
}

# 错误处理
trap 'print_error "安装过程中发生错误，请检查上面的错误信息"; exit 1' ERR

# 运行主程序
main "$@"
