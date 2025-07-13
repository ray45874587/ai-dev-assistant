/**
 * AI开发辅助系统 - 主入口文件
 * AI Development Assistant - Main Entry Point
 * Version: 1.0.0
 */

const fs = require('fs');
const path = require('path');
const IntelligentProjectAnalyzer = require('./project-analyzer');
const ContextManager = require('./context-manager');
const AIRulesEngine = require('./ai-rules-engine');

class AIDevAssistant {
    constructor(projectPath = '.') {
        this.projectPath = path.resolve(projectPath);
        this.systemDir = path.join(this.projectPath, '.ai-dev-assistant');
        this.configDir = path.join(this.systemDir, 'config');
        this.contextDir = path.join(this.systemDir, 'context');
        
        // 初始化组件
        this.analyzer = new IntelligentProjectAnalyzer(this.projectPath);
        this.contextManager = new ContextManager(this.projectPath);
        this.rulesEngine = new AIRulesEngine(this.projectPath);
        
        this.config = this.loadConfig();
    }

    /**
     * 加载配置
     */
    loadConfig() {
        const configPath = path.join(this.configDir, 'project-config.json');
        
        if (fs.existsSync(configPath)) {
            try {
                return JSON.parse(fs.readFileSync(configPath, 'utf8'));
            } catch (error) {
                console.warn('配置加载失败:', error.message);
            }
        }
        
        return this.getDefaultConfig();
    }

    /**
     * 获取默认配置
     */
    getDefaultConfig() {
        return {
            version: '1.0.0',
            name: path.basename(this.projectPath),
            type: 'unknown',
            language: 'zh-cn',
            createdAt: new Date().toISOString(),
            ai: {
                focus: ['performance', 'security', 'maintainability'],
                style: 'enterprise',
                verbosity: 'normal',
                autoUpdate: true
            },
            features: {
                autoContext: true,
                codeAnalysis: true,
                docGeneration: true,
                securityAudit: false,
                gitHooks: false
            },
            paths: {
                source: 'src',
                tests: 'tests',
                docs: 'docs',
                config: 'config'
            }
        };
    }

    /**
     * 初始化系统
     */
    async initialize() {
        console.log('🚀 初始化AI开发辅助系统...');
        
        try {
            // 1. 分析项目
            console.log('📊 分析项目结构...');
            const analysis = await this.analyzer.analyze();
            
            // 2. 更新配置
            await this.updateConfigFromAnalysis(analysis);
            
            // 3. 初始化规则引擎
            console.log('🔧 配置AI规则引擎...');
            await this.rulesEngine.updateRules(this.config.type);
            
            // 4. 生成初始上下文
            console.log('📝 生成项目上下文...');
            await this.contextManager.updateContext();
            
            // 5. 保存分析结果
            await this.analyzer.saveAnalysis();
            await this.analyzer.saveReport();
            
            console.log('✅ AI开发辅助系统初始化完成！');
            
            return {
                success: true,
                config: this.config,
                analysis: analysis,
                message: '系统已成功初始化'
            };
            
        } catch (error) {
            console.error('❌ 初始化失败:', error.message);
            throw error;
        }
    }

    /**
     * 基于分析结果更新配置
     */
    async updateConfigFromAnalysis(analysis) {
        // 更新项目类型
        this.config.type = analysis.project.type;
        this.config.language = analysis.project.language;
        
        // 更新框架信息
        if (analysis.project.framework.length > 0) {
            this.config.framework = analysis.project.framework;
        }
        
        // 基于分析结果调整AI焦点
        this.adjustAIFocus(analysis);
        
        // 保存更新的配置
        await this.saveConfig();
    }

    /**
     * 调整AI焦点
     */
    adjustAIFocus(analysis) {
        const focus = [...this.config.ai.focus];
        
        // 基于质量评分调整焦点
        if (analysis.quality.score < 70) {
            if (!focus.includes('code-quality')) {
                focus.push('code-quality');
            }
        }
        
        // 基于安全评估调整焦点
        if (analysis.security.vulnerabilities.length > 0 || analysis.security.risks.length > 0) {
            if (!focus.includes('security')) {
                focus.unshift('security'); // 优先级最高
            }
        }
        
        // 基于复杂度调整焦点
        if (analysis.codeMetrics.complexity === 'high') {
            if (!focus.includes('refactoring')) {
                focus.push('refactoring');
            }
        }
        
        // 基于项目类型调整焦点
        if (analysis.project.type === 'next-js' || analysis.project.framework.includes('React')) {
            if (!focus.includes('performance')) {
                focus.push('performance');
            }
            if (!focus.includes('user-experience')) {
                focus.push('user-experience');
            }
        }
        
        this.config.ai.focus = focus;
    }

    /**
     * 保存配置
     */
    async saveConfig() {
        const configPath = path.join(this.configDir, 'project-config.json');
        
        try {
            // 确保目录存在
            if (!fs.existsSync(this.configDir)) {
                fs.mkdirSync(this.configDir, { recursive: true });
            }
            
            fs.writeFileSync(configPath, JSON.stringify(this.config, null, 2));
            console.log('📝 配置已保存');
        } catch (error) {
            console.error('配置保存失败:', error.message);
            throw error;
        }
    }

    /**
     * 更新系统
     */
    async update() {
        console.log('🔄 更新AI开发辅助系统...');
        
        try {
            // 1. 重新分析项目
            const analysis = await this.analyzer.analyze();
            
            // 2. 更新上下文
            await this.contextManager.updateContext();
            
            // 3. 更新配置
            await this.updateConfigFromAnalysis(analysis);
            
            // 4. 保存结果
            await this.analyzer.saveAnalysis();
            await this.analyzer.saveReport();
            
            console.log('✅ 系统更新完成');
            
            return {
                success: true,
                timestamp: new Date().toISOString(),
                changes: this.getSystemChanges(analysis)
            };
            
        } catch (error) {
            console.error('❌ 系统更新失败:', error.message);
            throw error;
        }
    }

    /**
     * 获取系统变更
     */
    getSystemChanges(analysis) {
        const changes = [];
        
        // 检查是否有新的依赖
        if (analysis.dependencies.production.length !== this.config.lastDependencyCount) {
            changes.push({
                type: 'dependencies',
                message: `依赖数量变化: ${analysis.dependencies.production.length}`
            });
            this.config.lastDependencyCount = analysis.dependencies.production.length;
        }
        
        // 检查复杂度变化
        if (analysis.codeMetrics.complexity !== this.config.lastComplexity) {
            changes.push({
                type: 'complexity',
                message: `复杂度变化: ${this.config.lastComplexity} -> ${analysis.codeMetrics.complexity}`
            });
            this.config.lastComplexity = analysis.codeMetrics.complexity;
        }
        
        return changes;
    }

    /**
     * 分析代码
     */
    async analyzeCode(filePath = null) {
        console.log('🔍 分析代码...');
        
        try {
            if (filePath) {
                // 分析单个文件
                return await this.analyzeSingleFile(filePath);
            } else {
                // 分析整个项目
                return await this.analyzer.analyze();
            }
        } catch (error) {
            console.error('代码分析失败:', error.message);
            throw error;
        }
    }

    /**
     * 分析单个文件
     */
    async analyzeSingleFile(filePath) {
        if (!fs.existsSync(filePath)) {
            throw new Error(`文件不存在: ${filePath}`);
        }
        
        const content = fs.readFileSync(filePath, 'utf8');
        const violations = await this.rulesEngine.validateCode(filePath, content);
        const suggestions = await this.rulesEngine.generateSuggestions(filePath, content);
        
        return {
            file: filePath,
            violations,
            suggestions,
            metrics: {
                lines: content.split('\n').length,
                size: content.length,
                complexity: this.analyzer.assessComponentComplexity ? 
                    this.analyzer.assessComponentComplexity(content) : 'unknown'
            }
        };
    }

    /**
     * 生成文档
     */
    async generateDocs() {
        console.log('📚 生成项目文档...');
        
        try {
            // 生成分析报告
            await this.analyzer.saveReport();
            
            // 生成AI指令文档
            await this.rulesEngine.generateInstructions();
            
            // 生成上下文概览
            const overview = await this.contextManager.getContextSummary();
            
            console.log('✅ 文档生成完成');
            
            return {
                success: true,
                files: [
                    '.ai-dev-assistant/context/analysis-report.md',
                    '.ai-instructions.md',
                    '.ai-dev-assistant/context/project-overview.md'
                ]
            };
            
        } catch (error) {
            console.error('文档生成失败:', error.message);
            throw error;
        }
    }

    /**
     * 安全审计
     */
    async securityAudit() {
        console.log('🛡️ 执行安全审计...');
        
        try {
            const analysis = await this.analyzer.analyze();
            const securityIssues = [];
            
            // 收集安全问题
            if (analysis.security.vulnerabilities.length > 0) {
                securityIssues.push(...analysis.security.vulnerabilities.map(v => ({
                    type: 'vulnerability',
                    severity: 'high',
                    message: v
                })));
            }
            
            if (analysis.security.risks.length > 0) {
                securityIssues.push(...analysis.security.risks.map(r => ({
                    type: 'risk',
                    severity: 'medium',
                    message: r
                })));
            }
            
            // 生成安全报告
            const report = this.generateSecurityReport(securityIssues, analysis.security.recommendations);
            
            // 保存报告
            const reportPath = path.join(this.contextDir, 'security-report.md');
            fs.writeFileSync(reportPath, report);
            
            console.log('✅ 安全审计完成');
            
            return {
                success: true,
                issues: securityIssues,
                recommendations: analysis.security.recommendations,
                reportPath
            };
            
        } catch (error) {
            console.error('安全审计失败:', error.message);
            throw error;
        }
    }

    /**
     * 生成安全报告
     */
    generateSecurityReport(issues, recommendations) {
        const lines = [];
        
        lines.push('# 🛡️ 安全审计报告\n');
        lines.push(`**审计时间**: ${new Date().toISOString()}`);
        lines.push(`**项目**: ${this.config.name}\n`);
        
        // 问题概述
        lines.push('## 📊 问题概述\n');
        lines.push(`- 发现问题: ${issues.length}`);
        const highSeverity = issues.filter(i => i.severity === 'high').length;
        const mediumSeverity = issues.filter(i => i.severity === 'medium').length;
        lines.push(`- 高风险: ${highSeverity}`);
        lines.push(`- 中风险: ${mediumSeverity}\n`);
        
        // 详细问题
        if (issues.length > 0) {
            lines.push('## ⚠️ 发现的问题\n');
            issues.forEach((issue, index) => {
                const severityEmoji = issue.severity === 'high' ? '🚨' : '⚠️';
                lines.push(`${index + 1}. ${severityEmoji} **${issue.type}**: ${issue.message}`);
            });
            lines.push('');
        }
        
        // 修复建议
        if (recommendations.length > 0) {
            lines.push('## 🔧 修复建议\n');
            recommendations.forEach((rec, index) => {
                lines.push(`${index + 1}. ${rec}`);
            });
            lines.push('');
        }
        
        lines.push('---\n*由AI开发辅助系统生成*');
        
        return lines.join('\n');
    }

    /**
     * 设置开发焦点
     */
    async setFocus(area) {
        console.log(`🎯 设置开发焦点: ${area}`);
        
        try {
            const focusPath = path.join(this.configDir, 'dev-focus.json');
            let focusConfig = {
                currentFocus: area,
                priorities: [area],
                activeFeatures: this.config.features ? Object.keys(this.config.features).filter(f => this.config.features[f]) : [],
                lastUpdated: new Date().toISOString()
            };
            
            // 如果配置已存在，更新它
            if (fs.existsSync(focusPath)) {
                const existing = JSON.parse(fs.readFileSync(focusPath, 'utf8'));
                focusConfig = {
                    ...existing,
                    currentFocus: area,
                    lastUpdated: new Date().toISOString()
                };
                
                // 添加到优先级列表（如果还没有）
                if (!focusConfig.priorities.includes(area)) {
                    focusConfig.priorities.unshift(area);
                }
            }
            
            fs.writeFileSync(focusPath, JSON.stringify(focusConfig, null, 2));
            
            // 基于焦点更新AI规则
            await this.updateRulesForFocus(area);
            
            console.log(`✅ 开发焦点已设置为: ${area}`);
            
            return {
                success: true,
                focus: area,
                config: focusConfig
            };
            
        } catch (error) {
            console.error('设置开发焦点失败:', error.message);
            throw error;
        }
    }

    /**
     * 基于焦点更新规则
     */
    async updateRulesForFocus(area) {
        const customRules = {};
        
        switch (area) {
            case 'performance':
                customRules.aiInstructions = {
                    ...this.rulesEngine.rules.aiInstructions,
                    performance: '重点关注性能优化，包括代码效率、内存使用和响应时间'
                };
                break;
            case 'security':
                customRules.aiInstructions = {
                    ...this.rulesEngine.rules.aiInstructions,
                    security: '优先考虑安全性，严格检查输入验证、身份认证和数据保护'
                };
                break;
            case 'testing':
                customRules.aiInstructions = {
                    ...this.rulesEngine.rules.aiInstructions,
                    testing: '强调测试驱动开发，确保代码质量和可靠性'
                };
                break;
        }
        
        if (Object.keys(customRules).length > 0) {
            await this.rulesEngine.updateRules(this.config.type, customRules);
        }
    }

    /**
     * 获取系统状态
     */
    getStatus() {
        const status = {
            version: '1.0.0',
            project: {
                name: this.config.name,
                type: this.config.type,
                language: this.config.language
            },
            system: {
                initialized: fs.existsSync(this.systemDir),
                configExists: fs.existsSync(path.join(this.configDir, 'project-config.json')),
                rulesExists: fs.existsSync(path.join(this.projectPath, '.ai-dev-assistant-rules.json')),
                contextExists: fs.existsSync(this.contextDir)
            },
            features: this.config.features,
            lastUpdate: this.config.lastUpdate || null,
            health: 'healthy'
        };
        
        // 检查系统健康状态
        const requiredFiles = [
            path.join(this.configDir, 'project-config.json'),
            path.join(this.projectPath, '.ai-dev-assistant-rules.json'),
            path.join(this.projectPath, '.ai-dev-instructions.md')
        ];
        
        const missingFiles = requiredFiles.filter(file => !fs.existsSync(file));
        if (missingFiles.length > 0) {
            status.health = 'warning';
            status.issues = [`缺少文件: ${missingFiles.map(f => path.basename(f)).join(', ')}`];
        }
        
        return status;
    }

    /**
     * 清理系统
     */
    async cleanup() {
        console.log('🧹 清理AI开发辅助系统...');
        
        try {
            const filesToRemove = [
                this.systemDir,
                path.join(this.projectPath, '.ai-dev-assistant-rules.json'),
                path.join(this.projectPath, '.ai-dev-instructions.md')
            ];
            
            filesToRemove.forEach(item => {
                if (fs.existsSync(item)) {
                    if (fs.statSync(item).isDirectory()) {
                        fs.rmSync(item, { recursive: true, force: true });
                    } else {
                        fs.unlinkSync(item);
                    }
                    console.log(`🗑️ 已删除: ${path.basename(item)}`);
                }
            });
            
            console.log('✅ 系统清理完成');
            
            return { success: true };
            
        } catch (error) {
            console.error('系统清理失败:', error.message);
            throw error;
        }
    }
}

module.exports = AIDevAssistant;
