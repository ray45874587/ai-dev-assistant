/**
 * AI开发辅助系统 - AI规则引擎
 * AI Development Assistant - AI Rules Engine
 * Version: 1.0.1
 */

const fs = require('fs');
const path = require('path');

class AIRulesEngine {
    constructor(projectPath = '.') {
        this.projectPath = path.resolve(projectPath);
        this.configDir = path.join(this.projectPath, '.ai-dev-assistant', 'config');
        // 使用独立的配置文件名，避免与现有项目冲突
        this.rulesPath = path.join(this.projectPath, '.ai-dev-assistant-rules.json');
        this.instructionsPath = path.join(this.projectPath, '.ai-dev-instructions.md');
        
        this.rules = {};
        this.context = {};
        
        this.loadRules();
        this.loadContext();
    }

    /**
     * 加载AI规则
     */
    loadRules() {
        try {
            if (fs.existsSync(this.rulesPath)) {
                this.rules = JSON.parse(fs.readFileSync(this.rulesPath, 'utf8'));
            } else {
                this.rules = this.getDefaultRules();
            }
        } catch (error) {
            console.warn('加载AI规则失败:', error.message);
            this.rules = this.getDefaultRules();
        }
    }

    /**
     * 加载项目上下文
     */
    loadContext() {
        try {
            const contextFiles = [
                'project-config.json',
                'dev-focus.json'
            ];
            
            contextFiles.forEach(file => {
                const filePath = path.join(this.configDir, file);
                if (fs.existsSync(filePath)) {
                    const key = path.basename(file, '.json');
                    this.context[key] = JSON.parse(fs.readFileSync(filePath, 'utf8'));
                }
            });
        } catch (error) {
            console.warn('加载项目上下文失败:', error.message);
        }
    }

    /**
     * 获取默认规则
     */
    getDefaultRules() {
        return {
            version: "1.0.0",
            name: "AI开发辅助系统规则集",
            description: "基于第一性原理的AI协同开发规则，确保高效、安全、可维护的代码",
            projectType: "generic",
            language: "zh-cn",
            
            corePhilosophy: {
                firstPrinciples: "所有决策基于第一性原理：简单性、可维护性、性能、安全性",
                aiCollaboration: "AI助手应理解项目上下文，提供精准建议",
                preventionFirst: "事前预防优于事后修复"
            },

            rules: {
                codeQuality: {
                    description: "代码质量保障规则",
                    checks: [
                        { id: "naming-convention", description: "使用清晰、一致的命名规范", severity: "error" },
                        { id: "function-complexity", description: "单个函数复杂度不超过10", severity: "warning" },
                        { id: "file-size", description: "单个文件不超过500行", severity: "warning" },
                        { id: "error-handling", description: "必须有适当的错误处理", severity: "error" }
                    ]
                },
                
                security: {
                    description: "安全性规则",
                    checks: [
                        { id: "input-validation", description: "所有用户输入必须验证", severity: "error" },
                        { id: "sql-injection", description: "使用参数化查询防止SQL注入", severity: "error" },
                        { id: "xss-prevention", description: "输出转义防止XSS攻击", severity: "error" },
                        { id: "sensitive-data", description: "敏感数据不得硬编码", severity: "error" }
                    ]
                },
                
                performance: {
                    description: "性能优化规则", 
                    checks: [
                        { id: "async-operations", description: "I/O操作必须异步处理", severity: "warning" },
                        { id: "memory-leaks", description: "避免内存泄漏", severity: "error" },
                        { id: "unnecessary-loops", description: "避免不必要的循环嵌套", severity: "warning" }
                    ]
                }
            },

            aiInstructions: {
                general: "理解项目架构和业务逻辑，提供符合项目风格的代码建议",
                codeReview: "重点关注安全性、性能和可维护性",
                documentation: "生成清晰、准确的中文文档",
                testing: "建议全面的测试用例，包括边界条件"
            }
        };
    }

    /**
     * 更新规则配置
     */
    async updateRules(projectType, customRules = {}) {
        console.log('🔧 更新AI规则配置...');
        
        // 基于项目类型调整规则
        this.rules.projectType = projectType;
        this.adaptRulesForProjectType(projectType);
        
        // 应用自定义规则
        this.applyCustomRules(customRules);
        
        // 保存规则
        await this.saveRules();
        
        // 生成AI指令文档
        await this.generateInstructions();
        
        console.log('✅ AI规则配置更新完成');
    }

    /**
     * 基于项目类型调整规则
     */
    adaptRulesForProjectType(projectType) {
        switch (projectType) {
            case 'next-js':
                this.addNextJSRules();
                break;
            case 'react':
                this.addReactRules();
                break;
            case 'node':
                this.addNodeJSRules();
                break;
            case 'python':
                this.addPythonRules();
                break;
            case 'typescript':
                this.addTypeScriptRules();
                break;
            default:
                // 保持通用规则
                break;
        }
    }

    /**
     * 添加Next.js特定规则
     */
    addNextJSRules() {
        // 确保rules对象存在
        if (!this.rules.rules) {
            this.rules.rules = {};
        }
        
        if (!this.rules.rules.nextjs) {
            this.rules.rules.nextjs = {
                description: "Next.js特定规则",
                checks: [
                    { id: "ssg-optimization", description: "优先使用SSG而非SSR", severity: "info" },
                    { id: "image-optimization", description: "使用next/image组件优化图片", severity: "warning" },
                    { id: "dynamic-imports", description: "大型组件使用动态导入", severity: "info" },
                    { id: "api-routes", description: "API路由应包含错误处理", severity: "error" },
                    { id: "meta-tags", description: "页面应包含适当的SEO标签", severity: "warning" }
                ]
            };
        }

        // 更新AI指令
        if (!this.rules.aiInstructions) {
            this.rules.aiInstructions = {};
        }
        this.rules.aiInstructions.nextjs = "重点关注性能优化、SEO和用户体验，建议使用Next.js最佳实践";
    }

    /**
     * 添加React特定规则
     */
    addReactRules() {
        // 确保rules对象存在
        if (!this.rules.rules) {
            this.rules.rules = {};
        }
        
        if (!this.rules.rules.react) {
            this.rules.rules.react = {
                description: "React特定规则",
                checks: [
                    { id: "hooks-rules", description: "遵循React Hooks规则", severity: "error" },
                    { id: "component-naming", description: "组件使用PascalCase命名", severity: "error" },
                    { id: "prop-types", description: "使用PropTypes或TypeScript定义props", severity: "warning" },
                    { id: "key-prop", description: "列表渲染必须包含key属性", severity: "error" },
                    { id: "useeffect-cleanup", description: "useEffect应包含清理函数", severity: "warning" }
                ]
            };
        }

        if (!this.rules.aiInstructions) {
            this.rules.aiInstructions = {};
        }
        this.rules.aiInstructions.react = "遵循React最佳实践，关注组件设计和状态管理";
    }

    /**
     * 添加Node.js特定规则
     */
    addNodeJSRules() {
        // 确保rules对象存在
        if (!this.rules.rules) {
            this.rules.rules = {};
        }
        
        if (!this.rules.rules.nodejs) {
            this.rules.rules.nodejs = {
                description: "Node.js特定规则",
                checks: [
                    { id: "async-await", description: "优先使用async/await而非Promise链", severity: "info" },
                    { id: "error-first", description: "回调函数使用error-first模式", severity: "warning" },
                    { id: "stream-usage", description: "大文件操作使用流", severity: "warning" },
                    { id: "env-variables", description: "配置使用环境变量", severity: "error" },
                    { id: "middleware-order", description: "Express中间件顺序要正确", severity: "error" }
                ]
            };
        }

        if (!this.rules.aiInstructions) {
            this.rules.aiInstructions = {};
        }
        this.rules.aiInstructions.nodejs = "关注服务器性能、安全性和错误处理";
    }

    /**
     * 添加Python特定规则
     */
    addPythonRules() {
        // 确保rules对象存在
        if (!this.rules.rules) {
            this.rules.rules = {};
        }
        
        if (!this.rules.rules.python) {
            this.rules.rules.python = {
                description: "Python特定规则",
                checks: [
                    { id: "pep8-style", description: "遵循PEP 8代码风格", severity: "warning" },
                    { id: "type-hints", description: "使用类型提示", severity: "info" },
                    { id: "docstrings", description: "函数和类应有文档字符串", severity: "warning" },
                    { id: "exception-handling", description: "使用具体的异常类型", severity: "warning" },
                    { id: "list-comprehension", description: "适当使用列表推导式", severity: "info" }
                ]
            };
        }

        if (!this.rules.aiInstructions) {
            this.rules.aiInstructions = {};
        }
        this.rules.aiInstructions.python = "遵循Python风格指南，关注代码可读性和性能";
    }

    /**
     * 添加TypeScript特定规则
     */
    addTypeScriptRules() {
        // 确保rules对象存在
        if (!this.rules.rules) {
            this.rules.rules = {};
        }
        
        if (!this.rules.rules.typescript) {
            this.rules.rules.typescript = {
                description: "TypeScript特定规则",
                checks: [
                    { id: "strict-mode", description: "启用TypeScript严格模式", severity: "error" },
                    { id: "type-safety", description: "避免使用any类型", severity: "warning" },
                    { id: "interface-naming", description: "接口使用I前缀或描述性名称", severity: "info" },
                    { id: "generic-constraints", description: "泛型使用适当的约束", severity: "info" },
                    { id: "null-checks", description: "启用严格的null检查", severity: "error" }
                ]
            };
        }

        if (!this.rules.aiInstructions) {
            this.rules.aiInstructions = {};
        }
        this.rules.aiInstructions.typescript = "利用TypeScript类型系统提高代码安全性和可维护性";
    }

    /**
     * 应用自定义规则
     */
    applyCustomRules(customRules) {
        if (customRules.rules) {
            // 合并规则
            Object.keys(customRules.rules).forEach(category => {
                if (this.rules.rules[category]) {
                    // 合并现有类别
                    this.rules.rules[category] = {
                        ...this.rules.rules[category],
                        ...customRules.rules[category]
                    };
                } else {
                    // 添加新类别
                    this.rules.rules[category] = customRules.rules[category];
                }
            });
        }

        if (customRules.aiInstructions) {
            // 合并AI指令
            this.rules.aiInstructions = {
                ...this.rules.aiInstructions,
                ...customRules.aiInstructions
            };
        }
    }

    /**
     * 保存规则到文件
     */
    async saveRules() {
        try {
            fs.writeFileSync(this.rulesPath, JSON.stringify(this.rules, null, 2));
            console.log('📝 AI规则已保存到 .ai-dev-assistant-rules.json');
        } catch (error) {
            console.error('保存AI规则失败:', error.message);
            throw error;
        }
    }

    /**
     * 生成AI指令文档
     */
    async generateInstructions() {
        const instructions = this.generateInstructionsMarkdown();
        
        try {
            fs.writeFileSync(this.instructionsPath, instructions);
            console.log('📝 AI指令已保存到 .ai-dev-instructions.md');
        } catch (error) {
            console.error('保存AI指令失败:', error.message);
            throw error;
        }
    }

    /**
     * 生成指令Markdown内容
     */
    generateInstructionsMarkdown() {
        const lines = [];
        
        lines.push('# 🤖 AI开发助手指令\n');
        lines.push(`**项目类型**: ${this.rules.projectType}`);
        lines.push(`**规则版本**: ${this.rules.version}`);
        lines.push(`**最后更新**: ${new Date().toISOString()}\n`);
        
        // 核心理念
        lines.push('## 🎯 核心理念\n');
        lines.push(`**第一性原理**: ${this.rules.corePhilosophy.firstPrinciples}`);
        lines.push(`**AI协作**: ${this.rules.corePhilosophy.aiCollaboration}`);
        lines.push(`**预防优先**: ${this.rules.corePhilosophy.preventionFirst}\n`);
        
        // 开发规则
        lines.push('## 📋 开发规则\n');
        
        Object.entries(this.rules.rules).forEach(([category, ruleSet]) => {
            lines.push(`### ${this.getCategoryDisplayName(category)}\n`);
            lines.push(`${ruleSet.description}\n`);
            
            if (ruleSet.checks) {
                ruleSet.checks.forEach(check => {
                    const severityEmoji = this.getSeverityEmoji(check.severity);
                    lines.push(`- ${severityEmoji} **${check.id}**: ${check.description}`);
                });
                lines.push('');
            }
        });
        
        // AI指令
        lines.push('## 🤖 AI助手指令\n');
        
        Object.entries(this.rules.aiInstructions).forEach(([key, instruction]) => {
            const displayName = this.getInstructionDisplayName(key);
            lines.push(`**${displayName}**: ${instruction}\n`);
        });
        
        // 项目上下文
        if (Object.keys(this.context).length > 0) {
            lines.push('## 📊 项目上下文\n');
            
            if (this.context['project-config']) {
                const config = this.context['project-config'];
                lines.push(`**项目名称**: ${config.name || 'Unknown'}`);
                lines.push(`**项目类型**: ${config.type || 'Unknown'}`);
                if (config.ai && config.ai.focus) {
                    lines.push(`**开发焦点**: ${config.ai.focus.join(', ')}`);
                }
                lines.push('');
            }
            
            if (this.context['dev-focus']) {
                const focus = this.context['dev-focus'];
                if (focus.priorities && focus.priorities.length > 0) {
                    lines.push(`**当前优先级**: ${focus.priorities.join(', ')}`);
                }
                if (focus.activeFeatures && focus.activeFeatures.length > 0) {
                    lines.push(`**激活功能**: ${focus.activeFeatures.join(', ')}`);
                }
                lines.push('');
            }
        }
        
        // 使用指南
        lines.push('## 📖 使用指南\n');
        lines.push('1. **理解上下文**: 始终参考项目结构和业务逻辑');
        lines.push('2. **遵循规则**: 严格按照上述规则进行代码审查和建议');
        lines.push('3. **提供解释**: 每个建议都要说明原因和好处');
        lines.push('4. **考虑影响**: 评估更改对整个项目的影响');
        lines.push('5. **持续学习**: 根据项目发展调整建议策略\n');
        
        // 相关文件
        lines.push('## 📁 相关文件\n');
        lines.push('- `.ai-dev-assistant-rules.json` - 详细规则配置');
        lines.push('- `.ai-dev-assistant/context/` - 项目上下文信息');
        lines.push('- `.ai-dev-assistant/config/` - 系统配置\n');
        
        lines.push('---\n*由AI开发辅助系统自动生成*');
        
        return lines.join('\n');
    }

    /**
     * 获取类别显示名称
     */
    getCategoryDisplayName(category) {
        const names = {
            codeQuality: '代码质量',
            security: '安全性',
            performance: '性能优化',
            nextjs: 'Next.js',
            react: 'React',
            nodejs: 'Node.js',
            python: 'Python',
            typescript: 'TypeScript'
        };
        return names[category] || category;
    }

    /**
     * 获取严重性表情符号
     */
    getSeverityEmoji(severity) {
        const emojis = {
            error: '🚫',
            warning: '⚠️',
            info: 'ℹ️'
        };
        return emojis[severity] || '📝';
    }

    /**
     * 获取指令显示名称
     */
    getInstructionDisplayName(key) {
        const names = {
            general: '通用指导',
            codeReview: '代码审查',
            documentation: '文档编写',
            testing: '测试建议',
            nextjs: 'Next.js开发',
            react: 'React开发',
            nodejs: 'Node.js开发',
            python: 'Python开发',
            typescript: 'TypeScript开发'
        };
        return names[key] || key;
    }

    /**
     * 验证代码规则
     */
    async validateCode(filePath, content) {
        const violations = [];
        const fileExtension = path.extname(filePath).toLowerCase();
        
        // 基于文件类型选择相应规则
        const applicableRules = this.getApplicableRules(fileExtension);
        
        for (const ruleCategory of applicableRules) {
            const categoryRules = this.rules.rules[ruleCategory];
            if (categoryRules && categoryRules.checks) {
                for (const rule of categoryRules.checks) {
                    const violation = await this.checkRule(rule, filePath, content);
                    if (violation) {
                        violations.push({
                            rule: rule.id,
                            category: ruleCategory,
                            severity: rule.severity,
                            description: rule.description,
                            ...violation
                        });
                    }
                }
            }
        }
        
        return violations;
    }

    /**
     * 获取适用的规则
     */
    getApplicableRules(fileExtension) {
        const rules = ['codeQuality', 'security', 'performance'];
        
        switch (fileExtension) {
            case '.js':
            case '.jsx':
                rules.push('nodejs', 'react');
                break;
            case '.ts':
            case '.tsx':
                rules.push('typescript', 'react');
                break;
            case '.py':
                rules.push('python');
                break;
        }
        
        // 基于项目类型添加规则
        if (this.rules.projectType === 'next-js') {
            rules.push('nextjs');
        }
        
        return rules.filter(rule => this.rules.rules[rule]);
    }

    /**
     * 检查单个规则
     */
    async checkRule(rule, filePath, content) {
        switch (rule.id) {
            case 'function-complexity':
                return this.checkFunctionComplexity(content);
            case 'file-size':
                return this.checkFileSize(content);
            case 'naming-convention':
                return this.checkNamingConvention(content, filePath);
            case 'error-handling':
                return this.checkErrorHandling(content);
            case 'input-validation':
                return this.checkInputValidation(content);
            case 'sql-injection':
                return this.checkSQLInjection(content);
            case 'xss-prevention':
                return this.checkXSSPrevention(content);
            case 'async-operations':
                return this.checkAsyncOperations(content);
            default:
                return null;
        }
    }

    /**
     * 检查函数复杂度
     */
    checkFunctionComplexity(content) {
        const functions = content.match(/function\s+\w+|const\s+\w+\s*=\s*\(.*?\)\s*=>/g);
        if (!functions) return null;
        
        // 简单的复杂度检查（计算控制结构）
        const complexityKeywords = ['if', 'else', 'for', 'while', 'switch', 'catch', '&&', '||'];
        const avgComplexity = complexityKeywords.reduce((sum, keyword) => {
            return sum + (content.match(new RegExp(`\\b${keyword}\\b`, 'g')) || []).length;
        }, 0) / functions.length;
        
        if (avgComplexity > 10) {
            return {
                line: 1,
                message: `函数平均复杂度过高: ${avgComplexity.toFixed(1)}`
            };
        }
        
        return null;
    }

    /**
     * 检查文件大小
     */
    checkFileSize(content) {
        const lines = content.split('\n').length;
        if (lines > 500) {
            return {
                line: lines,
                message: `文件过大: ${lines} 行，建议拆分`
            };
        }
        return null;
    }

    /**
     * 检查命名约定
     */
    checkNamingConvention(content, filePath) {
        // 简单检查：查找可能的命名问题
        const badNames = content.match(/\b[a-z]+[A-Z][a-z]*_[a-z]+\b/g);
        if (badNames && badNames.length > 0) {
            return {
                line: 1,
                message: `发现不一致的命名规范: ${badNames[0]}`
            };
        }
        return null;
    }

    /**
     * 检查错误处理
     */
    checkErrorHandling(content) {
        const hasAsync = content.includes('async') || content.includes('await');
        const hasTryCatch = content.includes('try') && content.includes('catch');
        
        if (hasAsync && !hasTryCatch) {
            return {
                line: 1,
                message: '异步代码缺少错误处理'
            };
        }
        return null;
    }

    /**
     * 检查输入验证
     */
    checkInputValidation(content) {
        const hasUserInput = content.includes('req.body') || content.includes('req.params') || content.includes('req.query');
        const hasValidation = content.includes('validate') || content.includes('sanitize');
        
        if (hasUserInput && !hasValidation) {
            return {
                line: 1,
                message: '用户输入缺少验证'
            };
        }
        return null;
    }

    /**
     * 检查SQL注入
     */
    checkSQLInjection(content) {
        const hasSQLQuery = content.includes('SELECT') || content.includes('INSERT') || content.includes('UPDATE') || content.includes('DELETE');
        const hasStringConcatenation = content.includes('+') && hasSQLQuery;
        
        if (hasStringConcatenation) {
            return {
                line: 1,
                message: '可能存在SQL注入风险，建议使用参数化查询'
            };
        }
        return null;
    }

    /**
     * 检查XSS防护
     */
    checkXSSPrevention(content) {
        const hasHTMLOutput = content.includes('innerHTML') || content.includes('dangerouslySetInnerHTML');
        const hasEscaping = content.includes('escape') || content.includes('sanitize');
        
        if (hasHTMLOutput && !hasEscaping) {
            return {
                line: 1,
                message: 'HTML输出缺少转义，可能存在XSS风险'
            };
        }
        return null;
    }

    /**
     * 检查异步操作
     */
    checkAsyncOperations(content) {
        const hasFileIO = content.includes('fs.readFile') || content.includes('fs.writeFile');
        const hasAsyncVersion = content.includes('fs.promises') || content.includes('async') || content.includes('await');
        
        if (hasFileIO && !hasAsyncVersion) {
            return {
                line: 1,
                message: 'I/O操作建议使用异步版本'
            };
        }
        return null;
    }

    /**
     * 生成代码建议
     */
    async generateSuggestions(filePath, content) {
        const suggestions = [];
        const violations = await this.validateCode(filePath, content);
        
        violations.forEach(violation => {
            suggestions.push({
                type: 'rule-violation',
                severity: violation.severity,
                message: violation.description,
                suggestion: this.getRuleSuggestion(violation.rule),
                line: violation.line
            });
        });
        
        // 基于项目类型生成额外建议
        const projectSuggestions = this.getProjectSpecificSuggestions(filePath, content);
        suggestions.push(...projectSuggestions);
        
        return suggestions;
    }

    /**
     * 获取规则建议
     */
    getRuleSuggestion(ruleId) {
        const suggestions = {
            'function-complexity': '考虑将复杂函数拆分为更小的函数',
            'file-size': '考虑将大文件拆分为多个模块',
            'naming-convention': '确保使用一致的命名约定',
            'error-handling': '添加适当的try-catch块',
            'input-validation': '使用验证库（如joi、yup）验证输入',
            'sql-injection': '使用ORM或参数化查询',
            'xss-prevention': '使用模板引擎的自动转义功能',
            'async-operations': '使用async/await或Promise处理异步操作'
        };
        return suggestions[ruleId] || '请参考相关最佳实践';
    }

    /**
     * 获取项目特定建议
     */
    getProjectSpecificSuggestions(filePath, content) {
        const suggestions = [];
        const fileExtension = path.extname(filePath).toLowerCase();
        
        if (this.rules.projectType === 'next-js') {
            // Next.js特定建议
            if (filePath.includes('/pages/') && !content.includes('getStaticProps') && !content.includes('getServerSideProps')) {
                suggestions.push({
                    type: 'optimization',
                    severity: 'info',
                    message: '考虑使用SSG或SSR优化页面性能',
                    suggestion: '添加getStaticProps或getServerSideProps'
                });
            }
        }
        
        if (fileExtension === '.jsx' || fileExtension === '.tsx') {
            // React特定建议
            if (!content.includes('import React') && content.includes('<')) {
                suggestions.push({
                    type: 'import',
                    severity: 'error',
                    message: 'JSX文件需要导入React',
                    suggestion: "添加 import React from 'react'"
                });
            }
        }
        
        return suggestions;
    }

    /**
     * 获取规则摘要
     */
    getRulesSummary() {
        return {
            version: this.rules.version,
            projectType: this.rules.projectType,
            totalRules: Object.keys(this.rules.rules).length,
            totalChecks: Object.values(this.rules.rules).reduce((sum, category) => {
                return sum + (category.checks ? category.checks.length : 0);
            }, 0),
            lastUpdated: new Date().toISOString()
        };
    }
}

// 如果直接运行此文件
if (require.main === module) {
    async function main() {
        const engine = new AIRulesEngine();
        try {
            // 示例：更新规则
            await engine.updateRules('next-js');
            console.log('\n🎉 AI规则引擎测试完成！');
            console.log('📊 规则摘要:', engine.getRulesSummary());
        } catch (error) {
            console.error('AI规则引擎测试失败:', error.message);
            process.exit(1);
        }
    }
    
    main();
}

module.exports = AIRulesEngine;
