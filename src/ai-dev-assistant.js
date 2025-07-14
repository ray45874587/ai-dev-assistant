/**
 * AI开发辅助系统 - 主入口文件
 * AI Development Assistant - Main Entry Point
 * Version: 1.1.1
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
            version: '1.0.1',
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
            // 先进行完整的项目分析
            const analysis = await this.analyzer.analyze();
            
            // 创建文档目录
            const aiDocsDir = path.join(this.projectPath, 'AI助手文档');
            const aiDocsDirEn = path.join(this.projectPath, 'AIAssistantDocs');
            
            // 优先使用中文目录名，如果已有英文目录则使用英文
            let targetDocsDir = aiDocsDir;
            if (fs.existsSync(aiDocsDirEn) && !fs.existsSync(aiDocsDir)) {
                targetDocsDir = aiDocsDirEn;
            } else if (!fs.existsSync(aiDocsDir) && !fs.existsSync(aiDocsDirEn)) {
                targetDocsDir = aiDocsDir; // 默认使用中文
            }
            
            // 确保文档目录存在
            if (!fs.existsSync(targetDocsDir)) {
                fs.mkdirSync(targetDocsDir, { recursive: true });
                console.log(`📁 创建文档目录: ${path.basename(targetDocsDir)}/`);
            }
            
            // 生成多种文档
            const generatedFiles = [];
            
            // 1. 生成项目README（如果不存在）
            const readmePath = await this.generateProjectReadme(analysis);
            if (readmePath) {
                generatedFiles.push(readmePath);
            }
            
            // 2. 生成项目分析报告（在docs目录）
            const analysisReportPath = await this.generateProjectAnalysisReport(analysis, targetDocsDir);
            if (analysisReportPath) {
                generatedFiles.push(analysisReportPath);
            }
            
            // 3. 生成API文档（如果是后端项目）
            if (this.isBackendProject(analysis)) {
                const apiDocPath = await this.generateApiDocs(analysis, targetDocsDir);
                if (apiDocPath) {
                    generatedFiles.push(apiDocPath);
                }
            }
            
            // 4. 生成架构文档
            const archDocPath = await this.generateArchitectureDocs(analysis, targetDocsDir);
            if (archDocPath) {
                generatedFiles.push(archDocPath);
            }
            
            // 5. 生成开发指南
            const devGuidePath = await this.generateDevelopmentGuide(analysis, targetDocsDir);
            if (devGuidePath) {
                generatedFiles.push(devGuidePath);
            }
            
            // 6. 生成部署指南
            const deployGuidePath = await this.generateDeploymentGuide(analysis, targetDocsDir);
            if (deployGuidePath) {
                generatedFiles.push(deployGuidePath);
            }
            
            // 7. 生成文档索引
            const indexPath = await this.generateDocsIndex(analysis, targetDocsDir, generatedFiles);
            if (indexPath) {
                generatedFiles.push(indexPath);
            }
            
            // 8. 生成AI指令文档（保持在根目录，供AI助手使用）
            await this.rulesEngine.generateInstructions();
            
            // 9. 内部分析报告（保存到AI系统目录）
            await this.analyzer.saveReport();
            const overview = await this.contextManager.getContextSummary();
            
            console.log('✅ 文档生成完成');
            
            return {
                success: true,
                files: generatedFiles,
                docsDirectory: path.basename(targetDocsDir)
            };
            
        } catch (error) {
            console.error('文档生成失败:', error.message);
            throw error;
        }
    }

    /**
     * 判断是否为后端项目
     */
    isBackendProject(analysis) {
        const backendFrameworks = ['Express', 'Koa', 'Nest.js', 'Fastify'];
        return analysis.project.framework.some(fw => backendFrameworks.includes(fw)) ||
               analysis.project.type === 'node' ||
               analysis.project.language === 'python';
    }

    /**
     * 生成项目README
     */
    async generateProjectReadme(analysis) {
        const readmePath = path.join(this.projectPath, 'README.md');
        
        // 如果已存在README，不覆盖
        if (fs.existsSync(readmePath)) {
            console.log('ℹ️ README.md已存在，跳过生成');
            return null;
        }
        
        const content = this.generateReadmeContent(analysis);
        
        try {
            fs.writeFileSync(readmePath, content);
            console.log('✅ 项目README已生成');
            return 'README.md';
        } catch (error) {
            console.warn('README生成失败:', error.message);
            return null;
        }
    }

    /**
     * 生成README内容
     */
    generateReadmeContent(analysis) {
        const lines = [];
        
        lines.push(`# ${analysis.metadata.name}\n`);
        
        // 项目描述
        lines.push('## 📋 项目概述\n');
        lines.push(`- **项目类型**: ${analysis.project.type}`);
        lines.push(`- **主要语言**: ${analysis.project.language}`);
        if (analysis.project.framework.length > 0) {
            lines.push(`- **技术框架**: ${analysis.project.framework.join(', ')}`);
        }
        lines.push(`- **包管理器**: ${analysis.project.packageManager}`);
        lines.push('');
        
        // 项目结构
        lines.push('## 📁 项目结构\n');
        lines.push('```');
        this.generateStructureTree(analysis.structure.directories, lines, '');
        lines.push('```\n');
        
        // 快速开始
        lines.push('## 🚀 快速开始\n');
        this.generateQuickStartGuide(analysis, lines);
        
        // 开发指南
        lines.push('## 💻 开发指南\n');
        lines.push('### 环境要求\n');
        if (analysis.project.type === 'node') {
            lines.push('- Node.js >= 14.0.0');
            if (analysis.project.packageManager === 'npm') {
                lines.push('- npm >= 6.0.0');
            } else if (analysis.project.packageManager === 'yarn') {
                lines.push('- Yarn >= 1.22.0');
            }
        } else if (analysis.project.language === 'python') {
            lines.push('- Python >= 3.8');
            lines.push('- pip >= 21.0');
        }
        lines.push('');
        
        // 质量指标
        if (analysis.quality.score) {
            lines.push('## 📊 代码质量\n');
            lines.push(`- **质量评分**: ${analysis.quality.score}/100`);
            lines.push(`- **文件总数**: ${analysis.codeMetrics.totalFiles}`);
            lines.push(`- **代码行数**: ${analysis.codeMetrics.totalLines}`);
            lines.push(`- **复杂度**: ${analysis.codeMetrics.complexity}`);
            lines.push('');
        }
        
        // 贡献指南
        lines.push('## 🤝 贡献指南\n');
        lines.push('1. Fork 本仓库');
        lines.push('2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)');
        lines.push('3. 提交更改 (`git commit -m \'Add some AmazingFeature\'`)');
        lines.push('4. 推送到分支 (`git push origin feature/AmazingFeature`)');
        lines.push('5. 打开 Pull Request\n');
        
        // 许可证
        lines.push('## 📄 许可证\n');
        lines.push('本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详细信息。\n');
        
        lines.push('---\n*此文档由 AI 开发辅助系统自动生成*');
        
        return lines.join('\n');
    }

    /**
     * 生成结构树
     */
    generateStructureTree(directories, lines, prefix) {
        const entries = Object.entries(directories);
        entries.forEach(([name, info], index) => {
            const isLast = index === entries.length - 1;
            const symbol = isLast ? '└── ' : '├── ';
            lines.push(`${prefix}${symbol}${name}`);
            
            if (info.type === 'directory' && info.children) {
                const newPrefix = prefix + (isLast ? '    ' : '│   ');
                this.generateStructureTree(info.children, lines, newPrefix);
            }
        });
    }

    /**
     * 生成快速开始指南
     */
    generateQuickStartGuide(analysis, lines) {
        lines.push('### 安装依赖\n');
        
        if (analysis.project.type === 'node') {
            if (analysis.project.packageManager === 'yarn') {
                lines.push('```bash');
                lines.push('yarn install');
                lines.push('```\n');
            } else {
                lines.push('```bash');
                lines.push('npm install');
                lines.push('```\n');
            }
            
            lines.push('### 运行项目\n');
            lines.push('```bash');
            if (analysis.project.packageManager === 'yarn') {
                lines.push('yarn start');
            } else {
                lines.push('npm start');
            }
            lines.push('```\n');
            
            lines.push('### 运行测试\n');
            lines.push('```bash');
            if (analysis.project.packageManager === 'yarn') {
                lines.push('yarn test');
            } else {
                lines.push('npm test');
            }
            lines.push('```\n');
            
        } else if (analysis.project.language === 'python') {
            lines.push('```bash');
            lines.push('# 创建虚拟环境');
            lines.push('python -m venv venv');
            lines.push('');
            lines.push('# 激活虚拟环境');
            lines.push('source venv/bin/activate  # Linux/Mac');
            lines.push('venv\\Scripts\\activate     # Windows');
            lines.push('');
            lines.push('# 安装依赖');
            lines.push('pip install -r requirements.txt');
            lines.push('```\n');
        }
    }

    /**
     * 生成API文档
     */
    async generateApiDocs(analysis, targetDir = null) {
        const apiDocPath = path.join(targetDir || this.contextDir, 'API文档.md');
        
        try {
            const content = this.generateApiContent(analysis);
            fs.writeFileSync(apiDocPath, content);
            console.log('✅ API文档已生成');
            return path.relative(this.projectPath, apiDocPath);
        } catch (error) {
            console.warn('API文档生成失败:', error.message);
            return null;
        }
    }

    /**
     * 生成API文档内容
     */
    generateApiContent(analysis) {
        const lines = [];
        
        lines.push('# 📋 API 文档\n');
        lines.push(`**项目**: ${analysis.metadata.name}`);
        lines.push(`**生成时间**: ${new Date().toISOString()}\n`);
        
        lines.push('## 🌐 基础信息\n');
        lines.push(`- **项目类型**: ${analysis.project.type}`);
        lines.push(`- **技术框架**: ${analysis.project.framework.join(', ')}`);
        lines.push('');
        
        // 这里可以扫描代码生成实际的API路由
        lines.push('## 📌 API 端点\n');
        lines.push('> 注意：以下是基于代码分析的API端点，请根据实际情况调整\n');
        
        // TODO: 实际扫描代码获取API路由
        lines.push('### 基础路由\n');
        lines.push('| 方法 | 路径 | 描述 |');
        lines.push('|------|------|------|');
        lines.push('| GET | `/health` | 健康检查 |');
        lines.push('| GET | `/api/status` | 服务状态 |');
        lines.push('');
        
        lines.push('## 🔧 请求/响应格式\n');
        lines.push('### 标准响应格式\n');
        lines.push('```json');
        lines.push('{');
        lines.push('  "success": true,');
        lines.push('  "data": {},');
        lines.push('  "message": "操作成功",');
        lines.push('  "timestamp": "2023-01-01T00:00:00Z"');
        lines.push('}');
        lines.push('```\n');
        
        lines.push('---\n*此文档由 AI 开发辅助系统自动生成*');
        
        return lines.join('\n');
    }

    /**
     * 生成架构文档
     */
    async generateArchitectureDocs(analysis, targetDir = null) {
        const archDocPath = path.join(targetDir || this.contextDir, '架构文档.md');
        
        try {
            const content = this.generateArchitectureContent(analysis);
            fs.writeFileSync(archDocPath, content);
            console.log('✅ 架构文档已生成');
            return path.relative(this.projectPath, archDocPath);
        } catch (error) {
            console.warn('架构文档生成失败:', error.message);
            return null;
        }
    }

    /**
     * 生成架构文档内容
     */
    generateArchitectureContent(analysis) {
        const lines = [];
        
        lines.push('# 🏗️ 项目架构\n');
        lines.push(`**项目**: ${analysis.metadata.name}`);
        lines.push(`**架构分析时间**: ${new Date().toISOString()}\n`);
        
        lines.push('## 🎯 架构概览\n');
        lines.push(`- **项目类型**: ${analysis.project.type}`);
        lines.push(`- **主要语言**: ${analysis.project.language}`);
        lines.push(`- **技术栈**: ${analysis.project.framework.join(', ')}`);
        lines.push(`- **架构模式**: ${analysis.structure.patterns.join(', ') || '待识别'}\n`);
        
        lines.push('## 📁 目录结构\n');
        this.generateDirectoryDescription(analysis.structure.directories, lines);
        
        lines.push('## 🔗 依赖关系\n');
        if (analysis.dependencies.production.length > 0) {
            lines.push('### 生产依赖\n');
            analysis.dependencies.production.forEach(dep => {
                lines.push(`- **${dep.name}**: ${dep.version || 'latest'}`);
            });
            lines.push('');
        }
        
        lines.push('## 📊 复杂度分析\n');
        lines.push(`- **总文件数**: ${analysis.codeMetrics.totalFiles}`);
        lines.push(`- **代码行数**: ${analysis.codeMetrics.totalLines}`);
        lines.push(`- **复杂度等级**: ${analysis.codeMetrics.complexity}`);
        lines.push('');
        
        lines.push('## 🔐 安全考虑\n');
        if (analysis.security.risks.length > 0) {
            lines.push('### 识别的风险\n');
            analysis.security.risks.forEach(risk => {
                lines.push(`- ⚠️ ${risk}`);
            });
            lines.push('');
        }
        
        if (analysis.security.recommendations.length > 0) {
            lines.push('### 安全建议\n');
            analysis.security.recommendations.forEach(rec => {
                lines.push(`- 🔒 ${rec}`);
            });
            lines.push('');
        }
        
        lines.push('## 🚀 性能考虑\n');
        lines.push('### 性能优化建议\n');
        if (analysis.project.type === 'node') {
            lines.push('- 使用 PM2 进行进程管理');
            lines.push('- 实施缓存策略');
            lines.push('- 优化数据库查询');
        }
        if (analysis.project.framework.includes('React') || analysis.project.framework.includes('Next.js')) {
            lines.push('- 实施代码分割');
            lines.push('- 优化图片加载');
            lines.push('- 使用 CDN');
        }
        lines.push('');
        
        lines.push('---\n*此文档由 AI 开发辅助系统自动生成*');
        
        return lines.join('\n');
    }

    /**
     * 生成目录描述
     */
    generateDirectoryDescription(directories, lines) {
        const commonDescriptions = {
            'src': '源代码目录',
            'lib': '库文件目录',
            'components': 'React组件目录',
            'pages': '页面文件目录',
            'api': 'API接口目录',
            'utils': '工具函数目录',
            'hooks': 'React Hooks目录',
            'services': '服务层目录',
            'models': '数据模型目录',
            'controllers': '控制器目录',
            'middleware': '中间件目录',
            'routes': '路由目录',
            'config': '配置文件目录',
            'public': '静态资源目录',
            'assets': '资源文件目录',
            'styles': '样式文件目录',
            'tests': '测试文件目录',
            'docs': '文档目录'
        };
        
        Object.entries(directories).forEach(([name, info]) => {
            if (info.type === 'directory') {
                const description = commonDescriptions[name] || '项目目录';
                lines.push(`- **${name}/**: ${description}`);
            }
        });
        lines.push('');
    }

    /**
     * 生成开发指南
     */
    async generateDevelopmentGuide(analysis, targetDir = null) {
        const devGuidePath = path.join(targetDir || this.contextDir, '开发指南.md');
        
        try {
            const content = this.generateDevelopmentContent(analysis);
            fs.writeFileSync(devGuidePath, content);
            console.log('✅ 开发指南已生成');
            return path.relative(this.projectPath, devGuidePath);
        } catch (error) {
            console.warn('开发指南生成失败:', error.message);
            return null;
        }
    }

    /**
     * 生成开发指南内容
     */
    generateDevelopmentContent(analysis) {
        const lines = [];
        
        lines.push('# 💻 开发指南\n');
        lines.push(`**项目**: ${analysis.metadata.name}`);
        lines.push(`**项目类型**: ${analysis.project.type}`);
        lines.push(`**主要技术**: ${analysis.project.framework.join(', ') || analysis.project.language}`);
        lines.push(`**更新时间**: ${new Date().toLocaleString()}\n`);
        
        // 智能生成项目概述
        lines.push('## � 项目概述\n');
        lines.push(this.generateProjectOverview(analysis));
        lines.push('');
        
        lines.push('## � 开发环境设置\n');
        this.generateDevEnvironmentSetup(analysis, lines);
        
        lines.push('## � 开发规范\n');
        this.generateCodingStandards(analysis, lines);
        
        lines.push('## 🔧 开发工作流\n');
        this.generateDevelopmentWorkflow(analysis, lines);
        
        lines.push('## 🧪 测试指南\n');
        this.generateTestingGuide(analysis, lines);
        
        lines.push('## 🐛 调试技巧\n');
        this.generateDebuggingTips(analysis, lines);
        
        lines.push('---\n*此文档基于项目实际结构自动生成*');
        
        return lines.join('\n');
    }

    /**
     * 智能生成项目概述
     */
    generateProjectOverview(analysis) {
        const lines = [];
        const projectType = analysis.project.type;
        const frameworks = analysis.project.framework;
        const language = analysis.project.language;
        
        lines.push(`这是一个${projectType}项目`);
        
        if (frameworks.length > 0) {
            lines.push(`，使用${frameworks.join('、')}技术栈`);
        }
        
        lines.push(`，主要开发语言为${language}。`);
        
        // 基于实际文件结构描述项目
        if (analysis.structure.directories) {
            const dirs = Object.keys(analysis.structure.directories);
            if (dirs.length > 0) {
                lines.push(`\n项目包含${dirs.length}个主要目录：`);
                dirs.slice(0, 5).forEach(dir => {
                    lines.push(`- **${dir}**: ${this.getDirectoryDescription(dir, projectType)}`);
                });
            }
        }
        
        // 基于代码指标描述复杂度
        lines.push(`\n项目规模：${analysis.codeMetrics.totalFiles}个文件，约${analysis.codeMetrics.totalLines.toLocaleString()}行代码，复杂度为${analysis.codeMetrics.complexity}。`);
        
        return lines.join('');
    }

    /**
     * 智能获取目录描述
     */
    getDirectoryDescription(dirName, projectType) {
        // 通用目录描述
        const commonDescriptions = {
            'src': '源代码目录',
            'lib': '库文件目录',
            'config': '配置文件目录',
            'public': '公共资源目录',
            'assets': '静态资源目录',
            'docs': '文档目录',
            'tests': '测试文件目录',
            'scripts': '脚本文件目录'
        };
        
        // 项目类型特定描述
        const typeSpecificDescriptions = {
            'wordpress': {
                'wp-content': 'WordPress内容目录',
                'wp-admin': 'WordPress管理后台',
                'wp-includes': 'WordPress核心文件',
                'themes': '主题文件目录',
                'plugins': '插件文件目录',
                'uploads': '媒体文件目录'
            },
            'node': {
                'node_modules': '依赖包目录',
                'routes': '路由文件目录',
                'controllers': '控制器目录',
                'models': '数据模型目录',
                'middleware': '中间件目录',
                'views': '视图模板目录'
            },
            'react': {
                'components': 'React组件目录',
                'pages': '页面组件目录',
                'hooks': 'React Hooks目录',
                'services': '服务层目录',
                'utils': '工具函数目录'
            }
        };
        
        // 优先使用项目特定描述
        if (typeSpecificDescriptions[projectType] && typeSpecificDescriptions[projectType][dirName]) {
            return typeSpecificDescriptions[projectType][dirName];
        }
        
        // 使用通用描述
        if (commonDescriptions[dirName]) {
            return commonDescriptions[dirName];
        }
        
        // 默认描述
        return '项目目录';
    }

    /**
     * 智能生成开发工作流
     */
    generateDevelopmentWorkflow(analysis, lines) {
        const projectType = analysis.project.type;
        const frameworks = analysis.project.framework;
        
        if (projectType === 'wordpress') {
            lines.push('### WordPress开发工作流\n');
            lines.push('1. **主题开发**');
            lines.push('   - 修改主题文件（如 functions.php、style.css）');
            lines.push('   - 在本地环境测试样式和功能');
            lines.push('   - 使用WordPress编码标准');
            lines.push('');
            lines.push('2. **插件开发**');
            lines.push('   - 创建插件目录和主文件');
            lines.push('   - 使用WordPress钩子系统');
            lines.push('   - 遵循WordPress插件开发指南');
            lines.push('');
            lines.push('3. **内容管理**');
            lines.push('   - 通过后台管理界面发布内容');
            lines.push('   - 配置菜单和小工具');
            lines.push('   - 管理媒体文件');
        } else if (frameworks.includes('React')) {
            lines.push('### React开发工作流\n');
            lines.push('1. **组件开发**');
            lines.push('   - 创建可复用的React组件');
            lines.push('   - 使用React Hooks管理状态');
            lines.push('   - 编写组件测试');
            lines.push('');
            lines.push('2. **状态管理**');
            lines.push('   - 使用useState和useEffect');
            lines.push('   - 考虑Context API或Redux');
            lines.push('   - 优化组件性能');
        } else if (frameworks.includes('Express')) {
            lines.push('### Node.js/Express开发工作流\n');
            lines.push('1. **API开发**');
            lines.push('   - 设计RESTful接口');
            lines.push('   - 编写路由处理器');
            lines.push('   - 实现中间件');
            lines.push('');
            lines.push('2. **数据库集成**');
            lines.push('   - 设计数据模型');
            lines.push('   - 编写数据库查询');
            lines.push('   - 实现数据验证');
        } else {
            lines.push('### 通用开发工作流\n');
            lines.push('1. **代码开发**');
            lines.push('   - 遵循项目编码规范');
            lines.push('   - 编写可维护的代码');
            lines.push('   - 添加适当的注释');
            lines.push('');
            lines.push('2. **版本控制**');
            lines.push('   - 使用Git管理代码版本');
            lines.push('   - 编写清晰的提交信息');
            lines.push('   - 定期推送到远程仓库');
        }
        lines.push('');
    }

    /**
     * 生成测试指南
     */
    generateTestingGuide(analysis, lines) {
        if (!this.hasTestsInAnalysis(analysis)) {
            lines.push('> ⚠️ 当前项目缺少测试文件，建议添加测试\n');
        }
        
        lines.push('### 测试策略\n');
        lines.push('- **单元测试**: 测试独立的函数和组件');
        lines.push('- **集成测试**: 测试模块间的交互');
        lines.push('- **端到端测试**: 测试完整的用户流程\n');
        
        if (analysis.project.type === 'node') {
            lines.push('### 推荐测试工具\n');
            lines.push('- **Jest**: 单元测试框架');
            lines.push('- **Supertest**: HTTP 接口测试');
            if (analysis.project.framework.includes('React')) {
                lines.push('- **React Testing Library**: React 组件测试');
            }
            lines.push('');
        }
    }

    /**
     * 生成构建指南
     */
    generateBuildGuide(analysis, lines) {
        lines.push('### 本地构建\n');
        lines.push('```bash');
        
        if (analysis.project.type === 'node') {
            const pm = analysis.project.packageManager === 'yarn' ? 'yarn' : 'npm';
            lines.push(`${pm} run build`);
        }
        
        lines.push('```\n');
        
        lines.push('### 生产部署\n');
        lines.push('1. 确保所有测试通过');
        lines.push('2. 构建生产版本');
        lines.push('3. 配置环境变量');
        lines.push('4. 部署到目标环境\n');
    }

    /**
     * 生成调试技巧
     */
    generateDebuggingTips(analysis, lines) {
        lines.push('### 常用调试方法\n');
        
        if (analysis.project.type === 'node') {
            lines.push('- 使用 `console.log()` 进行基础调试');
            lines.push('- 使用 Node.js inspector 进行深度调试');
            lines.push('- VS Code 断点调试配置');
        }
        
        lines.push('- 浏览器开发者工具');
        lines.push('- 网络请求分析');
        lines.push('- 性能分析工具\n');
    }

    /**
     * 检查分析结果中是否有测试
     */
    hasTestsInAnalysis(analysis) {
        return Object.keys(analysis.structure.directories).some(dir => 
            dir.includes('test') || dir.includes('spec') || dir.includes('__tests__')
        );
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
            version: '1.0.1',
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

    /**
     * 生成项目分析报告（在docs目录）
     */
    async generateProjectAnalysisReport(analysis, targetDir) {
        const reportPath = path.join(targetDir, '项目分析报告.md');
        
        try {
            const content = this.generateDetailedAnalysisContent(analysis);
            fs.writeFileSync(reportPath, content);
            console.log('✅ 项目分析报告已生成');
            return path.relative(this.projectPath, reportPath);
        } catch (error) {
            console.warn('项目分析报告生成失败:', error.message);
            return null;
        }
    }

    /**
     * 生成详细分析内容
     */
    generateDetailedAnalysisContent(analysis) {
        const lines = [];
        
        lines.push(`# 📊 ${analysis.metadata.name} - 项目分析报告\n`);
        lines.push(`**分析时间**: ${new Date().toISOString()}`);
        lines.push(`**项目路径**: ${analysis.metadata.path}`);
        lines.push(`**系统版本**: ${analysis.metadata.version}\n`);
        
        // 项目概览
        lines.push('## 🎯 项目概览\n');
        lines.push(`- **项目名称**: ${analysis.metadata.name}`);
        lines.push(`- **项目类型**: ${analysis.project.type}`);
        lines.push(`- **主要语言**: ${analysis.project.language}`);
        lines.push(`- **技术框架**: ${analysis.project.framework.join(', ') || '无'}`);
        lines.push(`- **构建工具**: ${analysis.project.buildTool}`);
        lines.push(`- **包管理器**: ${analysis.project.packageManager}`);
        lines.push('');
        
        // 代码统计
        lines.push('## 📈 代码统计\n');
        lines.push(`- **总文件数**: ${analysis.codeMetrics.totalFiles}`);
        lines.push(`- **代码行数**: ${analysis.codeMetrics.totalLines.toLocaleString()}`);
        lines.push(`- **复杂度等级**: ${analysis.codeMetrics.complexity}`);
        lines.push(`- **测试覆盖率**: ${analysis.codeMetrics.testCoverage}%`);
        lines.push('');
        
        // 文件类型分布
        if (Object.keys(analysis.structure.files).length > 0) {
            lines.push('## 📁 文件类型分布\n');
            lines.push('| 文件类型 | 数量 | 占比 |');
            lines.push('|----------|------|------|');
            
            const totalFiles = Object.values(analysis.structure.files).reduce((sum, count) => sum + count, 0);
            Object.entries(analysis.structure.files)
                .sort(([,a], [,b]) => b - a)
                .forEach(([ext, count]) => {
                    const percentage = ((count / totalFiles) * 100).toFixed(1);
                    lines.push(`| ${ext} | ${count} | ${percentage}% |`);
                });
            lines.push('');
        }
        
        // 依赖分析
        if (analysis.dependencies.production.length > 0) {
            lines.push('## 📦 依赖分析\n');
            lines.push(`- **生产依赖**: ${analysis.dependencies.production.length} 个`);
            lines.push(`- **开发依赖**: ${analysis.dependencies.development.length} 个`);
            lines.push(`- **安全依赖**: ${analysis.dependencies.security.length} 个`);
            
            if (analysis.dependencies.production.length > 0) {
                lines.push('\n### 主要生产依赖\n');
                analysis.dependencies.production.slice(0, 10).forEach(dep => {
                    lines.push(`- **${dep.name}**: ${dep.version || 'latest'}`);
                });
            }
            lines.push('');
        }
        
        // 质量评估
        lines.push('## 🎯 质量评估\n');
        lines.push(`- **整体评分**: ${analysis.quality.score}/100`);
        
        const getScoreLevel = (score) => {
            if (score >= 90) return '优秀 🏆';
            if (score >= 80) return '良好 ✅';
            if (score >= 70) return '一般 ⚠️';
            if (score >= 60) return '待改进 🔧';
            return '需重构 ⛔';
        };
        
        lines.push(`- **质量等级**: ${getScoreLevel(analysis.quality.score)}`);
        lines.push('');
        
        if (analysis.quality.issues.length > 0) {
            lines.push('### 发现的问题\n');
            analysis.quality.issues.forEach((issue, index) => {
                lines.push(`${index + 1}. ⚠️ ${issue}`);
            });
            lines.push('');
        }
        
        if (analysis.quality.suggestions.length > 0) {
            lines.push('### 改进建议\n');
            analysis.quality.suggestions.forEach((suggestion, index) => {
                lines.push(`${index + 1}. 💡 ${suggestion}`);
            });
            lines.push('');
        }
        
        // 安全评估
        lines.push('## 🛡️ 安全评估\n');
        
        if (analysis.security.vulnerabilities.length > 0) {
            lines.push('### ⚠️ 安全漏洞\n');
            analysis.security.vulnerabilities.forEach((vuln, index) => {
                lines.push(`${index + 1}. 🚨 ${vuln}`);
            });
            lines.push('');
        }
        
        if (analysis.security.risks.length > 0) {
            lines.push('### ⚠️ 安全风险\n');
            analysis.security.risks.forEach((risk, index) => {
                lines.push(`${index + 1}. ⚠️ ${risk}`);
            });
            lines.push('');
        }
        
        if (analysis.security.recommendations.length > 0) {
            lines.push('### 🔒 安全建议\n');
            analysis.security.recommendations.forEach((rec, index) => {
                lines.push(`${index + 1}. ${rec}`);
            });
            lines.push('');
        }
        
        // AI 开发建议
        lines.push('## 🤖 AI 开发建议\n');
        lines.push(`- **开发阶段**: ${analysis.aiContext.developmentPhase}`);
        lines.push(`- **技术债务**: ${analysis.aiContext.technicalDebt}`);
        lines.push('');
        
        if (analysis.aiContext.focusAreas.length > 0) {
            lines.push('### 🎯 关注领域\n');
            analysis.aiContext.focusAreas.forEach(area => {
                lines.push(`- ${area}`);
            });
            lines.push('');
        }
        
        if (analysis.aiContext.priority.length > 0) {
            lines.push('### 📋 优先事项\n');
            analysis.aiContext.priority.forEach((item, index) => {
                lines.push(`${index + 1}. ${item}`);
            });
            lines.push('');
        }
        
        // 架构模式
        if (analysis.structure.patterns.length > 0) {
            lines.push('## 🏗️ 架构模式\n');
            analysis.structure.patterns.forEach(pattern => {
                lines.push(`- **${pattern}**: 检测到此架构模式`);
            });
            lines.push('');
        }
        
        lines.push('---\n');
        lines.push('*本报告由 AI 开发辅助系统自动生成*\n');
        lines.push(`*生成时间: ${new Date().toLocaleString('zh-CN')}*`);
        
        return lines.join('\n');
    }

    /**
     * 生成部署指南
     */
    async generateDeploymentGuide(analysis, targetDir) {
        const deployPath = path.join(targetDir, '部署指南.md');
        
        try {
            const content = this.generateDeploymentContent(analysis);
            fs.writeFileSync(deployPath, content);
            console.log('✅ 部署指南已生成');
            return path.relative(this.projectPath, deployPath);
        } catch (error) {
            console.warn('部署指南生成失败:', error.message);
            return null;
        }
    }

    /**
     * 生成部署指南内容
     */
    generateDeploymentContent(analysis) {
        const lines = [];
        
        lines.push(`# 🚀 ${analysis.metadata.name} - 部署指南\n`);
        lines.push(`**更新时间**: ${new Date().toISOString()}\n`);
        
        // 基于实际项目类型生成部署指南
        if (analysis.project.type === 'wordpress') {
            this.generateWordPressDeploymentGuide(analysis, lines);
        } else if (analysis.project.type === 'node') {
            this.generateNodeDeploymentGuide(analysis, lines);
        } else if (analysis.project.language === 'python') {
            this.generatePythonDeploymentGuide(analysis, lines);
        } else if (analysis.project.framework.includes('Laravel')) {
            this.generateLaravelDeploymentGuide(analysis, lines);
        } else if (analysis.project.framework.includes('React')) {
            this.generateReactDeploymentGuide(analysis, lines);
        } else {
            this.generateGenericDeploymentGuide(analysis, lines);
        }
        
        lines.push('---\n*此文档由 AI 开发辅助系统基于实际项目内容自动生成*');
        
        return lines.join('\n');
    }

    /**
     * 生成WordPress部署指南
     */
    generateWordPressDeploymentGuide(analysis, lines) {
        lines.push('## 📋 WordPress 部署准备\n');
        lines.push('### 服务器环境要求\n');
        lines.push('- **PHP**: >= 7.4 (推荐 8.0+)');
        lines.push('- **MySQL**: >= 5.7 或 **MariaDB**: >= 10.3');
        lines.push('- **Web服务器**: Apache 2.4+ 或 Nginx 1.18+');
        lines.push('- **内存**: 至少 512MB RAM (推荐 1GB+)');
        lines.push('- **存储**: 至少 1GB 可用空间');
        lines.push('- **SSL证书**: 推荐使用HTTPS\n');
        
        lines.push('### PHP扩展要求\n');
        lines.push('- curl');
        lines.push('- gd 或 imagick');
        lines.push('- json');
        lines.push('- mbstring');
        lines.push('- mysql');
        lines.push('- xml');
        lines.push('- zip\n');
        
        lines.push('## 🏠 本地开发环境\n');
        lines.push('### 使用XAMPP/WAMP/MAMP\n');
        lines.push('1. 下载并安装XAMPP、WAMP或MAMP');
        lines.push('2. 启动Apache和MySQL服务');
        lines.push('3. 将项目文件复制到web根目录');
        lines.push('4. 创建数据库并导入数据');
        lines.push('5. 配置wp-config.php\n');
        
        lines.push('### 数据库配置\n');
        lines.push('```sql');
        lines.push('CREATE DATABASE wordpress_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;');
        lines.push('CREATE USER \'wp_user\'@\'localhost\' IDENTIFIED BY \'strong_password\';');
        lines.push('GRANT ALL PRIVILEGES ON wordpress_db.* TO \'wp_user\'@\'localhost\';');
        lines.push('FLUSH PRIVILEGES;');
        lines.push('```\n');
        
        lines.push('### wp-config.php 配置\n');
        lines.push('```php');
        lines.push('// 数据库设置');
        lines.push('define(\'DB_NAME\', \'wordpress_db\');');
        lines.push('define(\'DB_USER\', \'wp_user\');');
        lines.push('define(\'DB_PASSWORD\', \'strong_password\');');
        lines.push('define(\'DB_HOST\', \'localhost\');');
        lines.push('');
        lines.push('// 安全密钥 - 请使用 WordPress 密钥生成器生成');
        lines.push('// https://api.wordpress.org/secret-key/1.1/salt/');
        lines.push('```\n');
        
        lines.push('## 🌐 生产环境部署\n');
        lines.push('### 1. 服务器准备\n');
        lines.push('```bash');
        lines.push('# Ubuntu/Debian 安装LAMP');
        lines.push('sudo apt update');
        lines.push('sudo apt install apache2 mysql-server php php-mysql php-curl php-gd php-mbstring php-xml php-zip');
        lines.push('```\n');
        
        lines.push('### 2. 文件上传\n');
        lines.push('```bash');
        lines.push('# 使用rsync上传文件');
        lines.push('rsync -avz --exclude=\'wp-config.php\' ./ user@server:/var/www/html/');
        lines.push('');
        lines.push('# 或使用FTP/SFTP工具上传');
        lines.push('```\n');
        
        lines.push('### 3. 文件权限设置\n');
        lines.push('```bash');
        lines.push('# 设置WordPress文件权限');
        lines.push('sudo chown -R www-data:www-data /var/www/html/');
        lines.push('sudo find /var/www/html/ -type d -exec chmod 755 {} \\;');
        lines.push('sudo find /var/www/html/ -type f -exec chmod 644 {} \\;');
        lines.push('sudo chmod 600 wp-config.php');
        lines.push('```\n');
        
        lines.push('### 4. Apache虚拟主机配置\n');
        lines.push('```apache');
        lines.push('<VirtualHost *:80>');
        lines.push('    ServerName your-domain.com');
        lines.push('    DocumentRoot /var/www/html');
        lines.push('    ErrorLog ${APACHE_LOG_DIR}/error.log');
        lines.push('    CustomLog ${APACHE_LOG_DIR}/access.log combined');
        lines.push('</VirtualHost>');
        lines.push('```\n');
        
        lines.push('## 🔒 安全配置\n');
        lines.push('### .htaccess 安全设置\n');
        lines.push('```apache');
        lines.push('# 禁止访问敏感文件');
        lines.push('<Files wp-config.php>');
        lines.push('    order allow,deny');
        lines.push('    deny from all');
        lines.push('</Files>');
        lines.push('');
        lines.push('# 禁止目录浏览');
        lines.push('Options -Indexes');
        lines.push('```\n');
        
        lines.push('### SSL/HTTPS 配置\n');
        lines.push('```bash');
        lines.push('# 使用Let\'s Encrypt获取免费SSL证书');
        lines.push('sudo apt install certbot python3-certbot-apache');
        lines.push('sudo certbot --apache -d your-domain.com');
        lines.push('```\n');
        
        lines.push('## 🔧 故障排除\n');
        lines.push('### 常见问题\n');
        lines.push('1. **数据库连接错误**: 检查wp-config.php中的数据库配置');
        lines.push('2. **文件权限问题**: 确保web服务器有读写权限');
        lines.push('3. **插件冲突**: 停用所有插件后逐个激活测试');
        lines.push('4. **内存限制**: 增加PHP内存限制');
        lines.push('5. **白屏死机**: 检查PHP错误日志\n');
        
        lines.push('### 调试模式\n');
        lines.push('```php');
        lines.push('// 在wp-config.php中启用调试');
        lines.push('define(\'WP_DEBUG\', true);');
        lines.push('define(\'WP_DEBUG_LOG\', true);');
        lines.push('define(\'WP_DEBUG_DISPLAY\', false);');
        lines.push('```\n');
    }

    /**
     * 生成Node.js部署指南
     */
    generateNodeDeploymentGuide(analysis, lines) {
        // Node.js 特定的部署指南
        lines.push('## � Node.js 部署准备\n');
        lines.push('### 环境要求\n');
        lines.push('- **Node.js**: >= 14.0.0 (推荐 18.x LTS)');
        lines.push('- **npm**: >= 6.0.0 或 **Yarn**: >= 1.22.0');
        lines.push('- **操作系统**: Linux/Ubuntu 18.04+ (推荐)');
        lines.push('- **内存**: 至少 1GB RAM');
        lines.push('- **存储**: 至少 5GB 可用空间\n');
        
        lines.push('### 常见部署平台\n');
        lines.push('- **Vercel**: 针对Next.js应用的零配置部署');
        lines.push('- **Heroku**: 支持Node.js的云平台');
        lines.push('- **Docker**: 容器化部署');
        lines.push('- **PM2**: 进程管理器，支持负载均衡\n');
        
        lines.push('### 部署步骤\n');
        lines.push('1. 确保代码已推送到Git仓库');
        lines.push('2. 登录到服务器');
        lines.push('3. 克隆代码仓库');
        lines.push('4. 安装依赖');
        lines.push('5. 配置环境变量');
        lines.push('6. 启动应用');
        lines.push('7. 配置反向代理（如Nginx）\n');
        
        lines.push('### 示例：在Ubuntu上使用PM2部署\n');
        lines.push('```bash');
        lines.push('# 更新系统和安装依赖');
        lines.push('sudo apt update');
        lines.push('sudo apt install -y nodejs npm');
        lines.push('');
        lines.push('# 全局安装PM2');
        lines.push('sudo npm install -g pm2');
        lines.push('');
        lines.push('# 克隆项目');
        lines.push('git clone <repository-url>');
        lines.push('cd <project-directory>');
        lines.push('');
        lines.push('# 安装项目依赖');
        lines.push('npm install');
        lines.push('');
        lines.push('# 启动项目');
        lines.push('pm2 start index.js --name "my-app"');
        lines.push('');
        lines.push('# 设置开机自启');
        lines.push('pm2 startup');
        lines.push('pm2 save');
        lines.push('```');
    }

    /**
     * 生成Laravel部署指南
     */
    generateLaravelDeploymentGuide(analysis, lines) {
        // Laravel 特定的部署指南
        lines.push('## � Laravel 部署准备\n');
        lines.push('### 环境要求\n');
        lines.push('- **PHP**: >= 8.0');
        lines.push('- **Composer**: 最新版本');
        lines.push('- **MySQL**: >= 5.7 或 **PostgreSQL**: >= 10');
        lines.push('- **Redis**: 推荐用于缓存和队列');
        
        lines.push('### 常见部署平台\n');
        lines.push('- **Laravel Forge**: Laravel官方托管平台');
        lines.push('- **DigitalOcean**: 云服务器，适合手动部署');
        lines.push('- **Heroku**: 支持PHP的云平台');
        lines.push('- **Docker**: 容器化部署\n');
        
        lines.push('### 部署步骤\n');
        lines.push('1. 确保代码已推送到Git仓库');
        lines.push('2. 登录到服务器');
        lines.push('3. 克隆代码仓库');
        lines.push('4. 安装依赖');
        lines.push('5. 配置环境变量');
        lines.push('6. 运行数据库迁移');
        lines.push('7. 启动队列监听器（如使用队列）');
        lines.push('8. 配置反向代理（如Nginx）\n');
        
        lines.push('### 示例：在Ubuntu上使用Laravel部署\n');
        lines.push('```bash');
        lines.push('# 更新系统和安装依赖');
        lines.push('sudo apt update');
        lines.push('sudo apt install -y php php-cli php-mbstring unzip');
        lines.push('');
        lines.push('# 安装Composer');
        lines.push('curl -sS https://getcomposer.org/installer | php');
        lines.push('sudo mv composer.phar /usr/local/bin/composer');
        lines.push('');
        lines.push('# 克隆项目');
        lines.push('git clone <repository-url>');
        lines.push('cd <project-directory>');
        lines.push('');
        lines.push('# 安装项目依赖');
        lines.push('composer install');
        lines.push('');
        lines.push('# 复制环境文件');
        lines.push('cp .env.example .env');
        lines.push('');
        lines.push('# 生成应用密钥');
        lines.push('php artisan key:generate');
        lines.push('');
        lines.push('# 运行数据库迁移');
        lines.push('php artisan migrate');
        lines.push('');
        lines.push('# 启动队列监听器');
        lines.push('php artisan queue:work');
        lines.push('');
        lines.push('# 配置开机自启');
        lines.push('sudo nano /etc/systemd/system/laravel-worker.service');
        lines.push('```\n');
    }

    /**
     * 生成React部署指南
     */
    generateReactDeploymentGuide(analysis, lines) {
        // React 特定的部署指南
        lines.push('## 📋 React 应用部署\n');
        lines.push('### 构建要求\n');
        lines.push('- **Node.js**: >= 14.0.0');
        lines.push('- **npm**: >= 6.0.0 或 **Yarn**: >= 1.22.0');
        lines.push('- **Web服务器**: Nginx, Apache, 或静态托管服务');
        
        lines.push('### 常见部署平台\n');
        lines.push('- **Vercel**: 针对Next.js应用的零配置部署');
        lines.push('- **Netlify**: 静态网站托管，支持CI/CD');
        lines.push('- **Heroku**: 支持Node.js的云平台');
        lines.push('- **Docker**: 容器化部署\n');
        
        lines.push('### 部署步骤\n');
        lines.push('1. 确保代码已推送到Git仓库');
        lines.push('2. 登录到服务器');
        lines.push('3. 克隆代码仓库');
        lines.push('4. 安装依赖');
        lines.push('5. 构建项目');
        lines.push('6. 配置环境变量');
        lines.push('7. 启动应用');
        lines.push('8. 配置反向代理（如Nginx）\n');
        
        lines.push('### 示例：在Ubuntu上使用Docker部署\n');
        lines.push('```bash');
        lines.push('# 安装Docker和Docker Compose');
        lines.push('sudo apt update');
        lines.push('sudo apt install -y docker.io docker-compose');
        lines.push('');
        lines.push('# 克隆项目');
        lines.push('git clone <repository-url>');
        lines.push('cd <project-directory>');
        lines.push('');
        lines.push('# 构建Docker镜像');
        lines.push('sudo docker-compose build');
        lines.push('');
        lines.push('# 启动容器');
        lines.push('sudo docker-compose up -d');
        lines.push('');
        lines.push('# 配置Nginx反向代理');
        lines.push('sudo nano /etc/nginx/sites-available/default');
        lines.push('```');
    }

    /**
     * 生成通用部署指南
     */
    generateGenericDeploymentGuide(analysis, lines) {
        lines.push('## 📋 通用部署指南\n');
        lines.push('本项目的具体部署步骤请根据实际技术栈进行配置。\n');
        
        lines.push('### 基本要求\n');
        lines.push(`- **项目类型**: ${analysis.project.type}`);
        lines.push(`- **主要语言**: ${analysis.project.language}`);
        if (analysis.project.framework.length > 0) {
            lines.push(`- **使用框架**: ${analysis.project.framework.join(', ')}`);
        }
        lines.push('- **服务器环境**: 根据技术栈配置相应环境\n');
    }

    /**
     * 生成文档索引
     */
    async generateDocsIndex(analysis, targetDir, generatedFiles) {
        const indexPath = path.join(targetDir, 'README.md');
        
        try {
            const content = this.generateDocsIndexContent(analysis, generatedFiles);
            fs.writeFileSync(indexPath, content);
            console.log('✅ 文档索引已生成');
            return path.relative(this.projectPath, indexPath);
        } catch (error) {
            console.warn('文档索引生成失败:', error.message);
            return null;
        }
    }

    /**
     * 生成文档索引内容
     */
    generateDocsIndexContent(analysis, generatedFiles) {
        const lines = [];
        
        lines.push(`# 📚 ${analysis.metadata.name} - 项目文档\n`);
        lines.push(`**最后更新**: ${new Date().toLocaleString('zh-CN')}\n`);
        
        lines.push('## 📋 文档目录\n');
        
        // 过滤并分类文档
        const docs = generatedFiles.filter(file => file && (file.includes('AI助手文档/') || file.includes('AIAssistantDocs/'))).map(file => {
            const basename = path.basename(file);
            const name = basename.replace('.md', '');
            return { name, file, basename };
        });
        
        if (docs.length > 0) {
            docs.forEach(doc => {
                let icon = '📄';
                if (doc.name.includes('API')) icon = '🌐';
                else if (doc.name.includes('架构')) icon = '🏗️';
                else if (doc.name.includes('开发')) icon = '💻';
                else if (doc.name.includes('部署')) icon = '🚀';
                else if (doc.name.includes('分析')) icon = '📊';
                
                lines.push(`- ${icon} [${doc.name}](${doc.basename})`);
            });
        }
        
        lines.push('');
        
        // 项目快速信息
        lines.push('## ℹ️ 项目信息\n');
        lines.push(`- **项目类型**: ${analysis.project.type}`);
        lines.push(`- **主要语言**: ${analysis.project.language}`);
        lines.push(`- **质量评分**: ${analysis.quality.score}/100`);
        lines.push(`- **复杂度**: ${analysis.codeMetrics.complexity}`);
        lines.push('');
        
        // 快速链接
        lines.push('## 🔗 快速链接\n');
        lines.push('- [返回项目根目录](../README.md)');
        lines.push('- [查看源代码](../src/)');
        if (analysis.project.type === 'node') {
            lines.push('- [查看 package.json](../package.json)');
        }
        lines.push('');
        
        lines.push('## 📝 文档说明\n');
        lines.push('本文档集合由 AI 开发辅助系统自动生成，包含了项目的详细分析、开发指南、部署说明等内容。');
        lines.push('如需更新文档，请在项目根目录运行 `ai-dev docs` 命令。\n');
        
        lines.push('---\n*由 AI 开发辅助系统自动生成*');
        
        return lines.join('\n');
    }

    /**
     * 为单个文件生成详细文档
     */
    async generateFileDocumentation(filePath) {
        console.log(`📄 为文件生成文档: ${filePath}`);
        
        try {
            // 确保文件存在
            const fullPath = path.resolve(this.projectPath, filePath);
            if (!fs.existsSync(fullPath)) {
                throw new Error(`文件不存在: ${filePath}`);
            }
            
            // 读取文件内容
            const fileContent = fs.readFileSync(fullPath, 'utf8');
            const fileExtension = path.extname(filePath).toLowerCase();
            const fileName = path.basename(filePath);
            const relativePath = path.relative(this.projectPath, fullPath);
            
            // 获取项目分析结果
            let projectAnalysis;
            const analysisPath = path.join(this.contextDir, 'project-analysis.json');
            if (fs.existsSync(analysisPath)) {
                projectAnalysis = JSON.parse(fs.readFileSync(analysisPath, 'utf8'));
            } else {
                // 如果没有项目分析，进行快速分析
                projectAnalysis = await this.analyzer.analyze();
            }
            
            // 分析文件类型和内容
            const fileAnalysis = this.analyzeFileContent(fileContent, fileExtension, fileName);
            
            // 生成文档内容
            const docContent = this.generateFileDocContent(
                filePath, 
                fileContent, 
                fileAnalysis, 
                projectAnalysis
            );
            
            // 确保AI助手文档目录存在
            const aiDocsDir = path.join(this.projectPath, 'AI助手文档');
            const aiDocsDirEn = path.join(this.projectPath, 'AIAssistantDocs');
            
            let targetDocsDir = aiDocsDir;
            if (fs.existsSync(aiDocsDirEn) && !fs.existsSync(aiDocsDir)) {
                targetDocsDir = aiDocsDirEn;
            }
            
            if (!fs.existsSync(targetDocsDir)) {
                fs.mkdirSync(targetDocsDir, { recursive: true });
            }
            
            // 创建文件专用的文档目录
            const fileDocsDir = path.join(targetDocsDir, '文件文档');
            if (!fs.existsSync(fileDocsDir)) {
                fs.mkdirSync(fileDocsDir, { recursive: true });
            }
            
            // 生成文档文件名
            const docFileName = `${fileName.replace(/\.[^/.]+$/, '')}_文档.md`;
            const docFilePath = path.join(fileDocsDir, docFileName);
            
            // 写入文档文件
            fs.writeFileSync(docFilePath, docContent);
            
            // 生成改进建议
            const suggestions = this.generateFileSuggestions(fileAnalysis, projectAnalysis);
            
            console.log('✅ 文件文档生成完成');
            
            return {
                success: true,
                docFile: path.relative(this.projectPath, docFilePath),
                suggestions: suggestions,
                codeComments: false // 暂时不修改原文件
            };
            
        } catch (error) {
            console.error('文件文档生成失败:', error.message);
            throw error;
        }
    }

    /**
     * 智能分析文件内容
     */
    analyzeFileContent(content, extension, fileName) {
        const analysis = {
            type: 'unknown',
            language: this.getLanguageFromExtension(extension),
            size: content.length,
            lines: content.split('\n').length,
            functions: [],
            classes: [],
            variables: [],
            comments: [],
            imports: [],
            exports: [],
            complexity: 'low',
            documentation: false,
            framework: null,
            purposes: [],
            patterns: [],
            security: {
                issues: [],
                suggestions: []
            }
        };

        // 智能检测框架
        analysis.framework = this.detectFileFramework(fileName, content);
        
        // 智能分析用途
        analysis.purposes = this.analyzeFilePurpose(fileName, content, analysis.framework);

        // 通用代码分析
        this.analyzeGenericContent(content, analysis);

        // 语言特定分析
        if (extension === '.php') {
            this.analyzePHPContent(content, analysis);
        } else if (['.js', '.jsx', '.ts', '.tsx'].includes(extension)) {
            this.analyzeJavaScriptContent(content, analysis);
        } else if (['.css', '.scss', '.sass', '.less'].includes(extension)) {
            this.analyzeCSSContent(content, analysis);
        } else if (['.html', '.htm'].includes(extension)) {
            this.analyzeHTMLContent(content, analysis);
        } else if (extension === '.py') {
            this.analyzePythonContent(content, analysis);
        }

        // 计算复杂度
        analysis.complexity = this.calculateFileComplexity(analysis);

        return analysis;
    }

    /**
     * 通用代码分析
     */
    analyzeGenericContent(content, analysis) {
        // 检测模式
        const patterns = {
            'mvc': /controller|model|view/i,
            'singleton': /singleton|instance/i,
            'factory': /factory|create/i,
            'observer': /observer|notify|subscribe/i,
            'decorator': /decorator|wrapper/i
        };

        analysis.patterns = Object.entries(patterns)
            .filter(([name, pattern]) => pattern.test(content))
            .map(([name]) => name);

        // 检测文档
        analysis.documentation = content.includes('/**') || content.includes('"""') || 
                                content.includes('///') || content.includes('##');

        // 提取注释
        const commentPatterns = [
            /\/\*[\s\S]*?\*\//g,  // /* */ 注释
            /\/\/.*$/gm,           // // 注释
            /#.*$/gm,              // # 注释
            /"""[\s\S]*?"""/g,     // Python 文档字符串
        ];

        commentPatterns.forEach(pattern => {
            const matches = content.match(pattern);
            if (matches) {
                analysis.comments.push(...matches);
            }
        });
    }

    /**
     * 从扩展名获取语言
     */
    getLanguageFromExtension(extension) {
        const languageMap = {
            '.php': 'php',
            '.js': 'javascript',
            '.jsx': 'javascript',
            '.ts': 'typescript',
            '.tsx': 'typescript',
            '.css': 'css',
            '.scss': 'scss',
            '.sass': 'sass',
            '.less': 'less',
            '.html': 'html',
            '.htm': 'html',
            '.py': 'python',
            '.java': 'java',
            '.cs': 'csharp',
            '.rb': 'ruby',
            '.go': 'go',
            '.rs': 'rust'
        };
        return languageMap[extension] || 'unknown';
    }

    /**
     * 智能检测文件的框架类型
     */
    detectFileFramework(fileName, content) {
        const patterns = {
            wordpress: [/wp_\w+\(/, /add_action\(/, /add_filter\(/, /\$wpdb/, /WP_\w+/],
            laravel: [/use Illuminate\\/, /Artisan::/, /Route::/, /Schema::/],
            django: [/from django/, /django\./, /models\.Model/, /HttpResponse/],
            react: [/import React/, /useState/, /useEffect/, /jsx|tsx$/],
            vue: [/Vue\./, /<template>/, /<script>/, /\.vue$/],
            angular: [/@Component/, /@Injectable/, /Angular/, /ng-/],
            express: [/express\(\)/, /app\.get/, /app\.post/, /req\s*,\s*res/],
            symfony: [/use Symfony\\/, /namespace App\\/, /@Route/, /Controller/]
        };

        for (const [framework, framePatterns] of Object.entries(patterns)) {
            if (framePatterns.some(pattern => pattern.test(content) || pattern.test(fileName))) {
                return framework;
            }
        }
        return null;
    }

    /**
     * 智能分析文件用途
     */
    analyzeFilePurpose(fileName, content, framework = null) {
        const purposes = [];
        
        // 通用模式检测
        if (content.includes('function') || content.includes('def ') || content.includes('class ')) {
            purposes.push('logic');
        }
        if (content.includes('SELECT') || content.includes('INSERT') || content.includes('UPDATE')) {
            purposes.push('database');
        }
        if (content.includes('route') || content.includes('endpoint') || content.includes('api')) {
            purposes.push('routing');
        }
        if (content.includes('test') || content.includes('Test') || content.includes('assert')) {
            purposes.push('testing');
        }
        if (content.includes('config') || content.includes('Config') || fileName.includes('config')) {
            purposes.push('configuration');
        }

        return purposes.length > 0 ? purposes : ['general'];
    }

    /**
     * 分析PHP内容
     */
    analyzePHPContent(content, analysis) {
        // 提取函数
        const functionMatches = content.match(/function\s+(\w+)\s*\([^)]*\)/g);
        if (functionMatches) {
            analysis.functions = functionMatches.map(match => {
                const name = match.match(/function\s+(\w+)/)[1];
                return { name, type: 'function' };
            });
        }

        // 提取类
        const classMatches = content.match(/class\s+(\w+)/g);
        if (classMatches) {
            analysis.classes = classMatches.map(match => {
                const name = match.match(/class\s+(\w+)/)[1];
                return { name, type: 'class' };
            });
        }

        // 通用安全检查
        this.checkGeneralSecurity(content, analysis, 'php');

        // 检查文档注释
        analysis.documentation = content.includes('/**') && content.includes('*/');
    }

    /**
     * 通用安全检查
     */
    checkGeneralSecurity(content, analysis, language) {
        const securityIssues = [];
        const suggestions = [];

        // 通用安全模式
        const securityPatterns = {
            'input_validation': {
                patterns: [/\$_(GET|POST|REQUEST)/, /request\.(get|post)/, /input\(/],
                message: '发现用户输入，需要验证和清理',
                suggestion: '对所有用户输入进行验证、清理和转义'
            },
            'sql_injection': {
                patterns: [/query.*\$/, /sql.*\+/, /SELECT.*\$/, /INSERT.*\$/],
                message: '可能存在SQL注入风险',
                suggestion: '使用参数化查询或ORM来防止SQL注入'
            },
            'xss_risk': {
                patterns: [/echo\s+\$/, /print\s+\$/, /innerHTML\s*=/, /document\.write/],
                message: '可能存在XSS风险',
                suggestion: '对输出内容进行HTML转义'
            },
            'file_inclusion': {
                patterns: [/include\s+\$/, /require\s+\$/, /file_get_contents\s*\(/],
                message: '文件操作风险',
                suggestion: '验证文件路径，使用白名单机制'
            }
        };

        Object.entries(securityPatterns).forEach(([type, config]) => {
            if (config.patterns.some(pattern => pattern.test(content))) {
                securityIssues.push(config.message);
                suggestions.push(config.suggestion);
            }
        });

        analysis.security.issues = securityIssues;
        analysis.security.suggestions = suggestions;
    }

    /**
     * 分析Python内容
     */
    analyzePythonContent(content, analysis) {
        // 提取函数
        const functionMatches = content.match(/def\s+(\w+)\s*\([^)]*\):/g);
        if (functionMatches) {
            analysis.functions = functionMatches.map(match => {
                const name = match.match(/def\s+(\w+)/)[1];
                return { name, type: 'function' };
            });
        }

        // 提取类
        const classMatches = content.match(/class\s+(\w+).*:/g);
        if (classMatches) {
            analysis.classes = classMatches.map(match => {
                const name = match.match(/class\s+(\w+)/)[1];
                return { name, type: 'class' };
            });
        }

        // 通用安全检查
        this.checkGeneralSecurity(content, analysis, 'python');
    }

    /**
     * 分析JavaScript内容
     */
    analyzeJavaScriptContent(content, analysis) {
        // 提取函数
        const functionPatterns = [
            /function\s+(\w+)/g,
            /const\s+(\w+)\s*=\s*\([^)]*\)\s*=>/g,
            /let\s+(\w+)\s*=\s*function/g,
            /(\w+)\s*:\s*function/g
        ];

        functionPatterns.forEach(pattern => {
            const matches = [...content.matchAll(pattern)];
            if (matches) {
                matches.forEach(match => {
                    analysis.functions.push({ name: match[1], type: 'function' });
                });
            }
        });

        // 提取类
        const classMatches = content.match(/class\s+(\w+)/g);
        if (classMatches) {
            analysis.classes = classMatches.map(match => {
                const name = match.match(/class\s+(\w+)/)[1];
                return { name, type: 'class' };
            });
        }

        // 通用安全检查
        this.checkGeneralSecurity(content, analysis, 'javascript');
    }

    /**
     * 计算文件复杂度
     */
    calculateFileComplexity(analysis) {
        let score = 0;
        
        score += analysis.functions.length * 2;
        score += analysis.classes.length * 3;
        score += Math.floor(analysis.lines / 100);
        
        if (score < 10) return 'low';
        if (score < 25) return 'medium';
        return 'high';
    }

    /**
     * 生成文件文档内容
     */
    generateFileDocContent(filePath, content, fileAnalysis, projectAnalysis) {
        const lines = [];
        const fileName = path.basename(filePath);
        
        lines.push(`# 📄 ${fileName} - 文件文档\n`);
        lines.push(`**文件路径**: ${filePath}`);
        lines.push(`**文件类型**: ${fileAnalysis.language}`);
        lines.push(`**文件大小**: ${Math.round(fileAnalysis.size / 1024 * 100) / 100} KB`);
        lines.push(`**代码行数**: ${fileAnalysis.lines}`);
        lines.push(`**复杂度**: ${fileAnalysis.complexity}`);
        
        if (fileAnalysis.type === 'wordpress') {
            lines.push(`**WordPress类型**: ${fileAnalysis.wordpressType}`);
        }
        
        lines.push(`**生成时间**: ${new Date().toLocaleString()}\n`);

        // 文件概述
        lines.push('## 📋 文件概述\n');
        lines.push(this.generateFileOverview(fileName, fileAnalysis, content));
        lines.push('');

        // 功能分析
        if (fileAnalysis.functions.length > 0 || fileAnalysis.classes.length > 0) {
            lines.push('## 🔧 功能分析\n');
            
            if (fileAnalysis.classes.length > 0) {
                lines.push('### 类定义\n');
                fileAnalysis.classes.forEach(cls => {
                    lines.push(`- **${cls.name}**: ${this.generateGenericDescription(cls.name, 'class')}`);
                });
                lines.push('');
            }
            
            if (fileAnalysis.functions.length > 0) {
                lines.push('### 函数定义\n');
                fileAnalysis.functions.forEach(func => {
                    lines.push(`- **${func.name}**: ${this.generateFunctionDescription(func.name, content)}`);
                });
                lines.push('');
            }
        }

        // 框架特定功能
        if (fileAnalysis.framework) {
            lines.push(`## 🎯 ${fileAnalysis.framework.toUpperCase()}框架功能\n`);
            lines.push(this.generateFrameworkFunctionality(content, fileAnalysis));
            lines.push('');
        }

        // 代码示例
        lines.push('## 💡 使用示例\n');
        lines.push(this.generateUsageExamples(fileName, fileAnalysis, content));
        lines.push('');

        // 安全分析
        if (fileAnalysis.security.issues.length > 0) {
            lines.push('## 🛡️ 安全分析\n');
            lines.push('### ⚠️ 发现的安全问题\n');
            fileAnalysis.security.issues.forEach(issue => {
                lines.push(`- ${issue}`);
            });
            lines.push('');
            
            if (fileAnalysis.security.suggestions.length > 0) {
                lines.push('### 🔒 安全建议\n');
                fileAnalysis.security.suggestions.forEach(suggestion => {
                    lines.push(`- ${suggestion}`);
                });
                lines.push('');
            }
        }

        // 改进建议
        lines.push('## 📈 改进建议\n');
        const suggestions = this.generateFileSuggestions(fileAnalysis, projectAnalysis);
        suggestions.forEach(suggestion => {
            lines.push(`- ${suggestion}`);
        });
        lines.push('');

        // 相关文件
        lines.push('## 🔗 相关文件\n');
        lines.push(this.generateRelatedFiles(filePath, projectAnalysis));
        lines.push('');

        lines.push('---\n*此文档由 AI 开发辅助系统自动生成*');
        
        return lines.join('\n');
    }

    /**
     * 智能生成文件概述
     */
    generateFileOverview(fileName, fileAnalysis, content) {
        const framework = fileAnalysis.framework;
        const purposes = fileAnalysis.purposes;
        
        let overview = `这是一个${fileAnalysis.language}文件`;
        
        if (framework) {
            overview += `，属于${framework}框架`;
        }
        
        if (purposes.length > 0) {
            const purposeMap = {
                'logic': '业务逻辑',
                'database': '数据库操作',
                'routing': '路由处理',
                'testing': '测试代码',
                'configuration': '配置文件',
                'general': '通用功能'
            };
            const purposeTexts = purposes.map(p => purposeMap[p] || p);
            overview += `，主要用于${purposeTexts.join('、')}`;
        }
        
        overview += `，包含${fileAnalysis.lines}行代码`;
        
        if (fileAnalysis.functions.length > 0) {
            overview += `，定义了${fileAnalysis.functions.length}个函数`;
        }
        
        if (fileAnalysis.classes.length > 0) {
            overview += `，包含${fileAnalysis.classes.length}个类`;
        }
        
        return overview + '。';
    }

    /**
     * 智能生成函数描述
     */
    generateFunctionDescription(functionName, content) {
        // 通用函数名模式分析
        const patterns = {
            'init|initialize|setup': '初始化函数',
            'save|store|create|insert': '数据保存函数',
            'get|fetch|load|read|retrieve': '数据获取函数',
            'update|modify|edit|change': '数据更新函数',
            'delete|remove|destroy': '数据删除函数',
            'validate|check|verify': '数据验证函数',
            'render|display|show|draw': '内容渲染函数',
            'handle|process|execute': '业务处理函数',
            'connect|disconnect|open|close': '连接管理函数',
            'send|receive|transmit': '数据传输函数'
        };

        for (const [pattern, description] of Object.entries(patterns)) {
            if (new RegExp(pattern, 'i').test(functionName)) {
                return description;
            }
        }

        return '自定义函数，执行特定业务逻辑';
    }

    /**
     * 智能生成框架功能说明
     */
    generateFrameworkFunctionality(content, fileAnalysis) {
        const framework = fileAnalysis.framework;
        if (!framework) return '- 包含通用的业务逻辑';

        const frameworkFeatures = {
            wordpress: this.getWordPressFeatures(content),
            laravel: this.getLaravelFeatures(content),
            django: this.getDjangoFeatures(content),
            react: this.getReactFeatures(content),
            vue: this.getVueFeatures(content),
            express: this.getExpressFeatures(content)
        };

        return frameworkFeatures[framework] || `- 使用${framework}框架的相关功能`;
    }

    /**
     * 通用框架特性检测
     */
    getWordPressFeatures(content) {
        const features = [];
        const patterns = {
            'add_action': '动作钩子注册',
            'add_filter': '过滤器钩子注册',
            'wp_enqueue': '资源文件加载',
            'register_post_type': '自定义文章类型',
            'wp_ajax': 'AJAX请求处理'
        };

        Object.entries(patterns).forEach(([pattern, desc]) => {
            if (content.includes(pattern)) {
                features.push(`- **${desc}**: 使用${pattern}实现相关功能`);
            }
        });

        return features.length > 0 ? features.join('\n') : '- WordPress相关功能';
    }

    getLaravelFeatures(content) {
        const features = [];
        const patterns = {
            'Route::': '路由定义',
            'Schema::': '数据库迁移',
            'Model': '数据模型',
            'Controller': '控制器逻辑'
        };

        Object.entries(patterns).forEach(([pattern, desc]) => {
            if (content.includes(pattern)) {
                features.push(`- **${desc}**: Laravel框架${desc.toLowerCase()}功能`);
            }
        });

        return features.length > 0 ? features.join('\n') : '- Laravel框架功能';
    }

    getDjangoFeatures(content) {
        const features = [];
        const patterns = {
            'models.Model': '数据模型定义',
            'HttpResponse': 'HTTP响应处理',
            'url(': 'URL路由配置',
            'render': '模板渲染'
        };

        Object.entries(patterns).forEach(([pattern, desc]) => {
            if (content.includes(pattern)) {
                features.push(`- **${desc}**: Django框架${desc.toLowerCase()}功能`);
            }
        });

        return features.length > 0 ? features.join('\n') : '- Django框架功能';
    }

    getReactFeatures(content) {
        const features = [];
        const patterns = {
            'useState': 'React状态管理',
            'useEffect': 'React副作用处理',
            'Component': 'React组件定义',
            'props': 'React组件属性'
        };

        Object.entries(patterns).forEach(([pattern, desc]) => {
            if (content.includes(pattern)) {
                features.push(`- **${desc}**: ${desc}功能`);
            }
        });

        return features.length > 0 ? features.join('\n') : '- React组件功能';
    }

    getVueFeatures(content) {
        const features = [];
        const patterns = {
            '<template>': 'Vue模板结构',
            '<script>': 'Vue组件逻辑',
            'data()': 'Vue数据定义',
            'methods': 'Vue方法定义'
        };

        Object.entries(patterns).forEach(([pattern, desc]) => {
            if (content.includes(pattern)) {
                features.push(`- **${desc}**: ${desc}功能`);
            }
        });

        return features.length > 0 ? features.join('\n') : '- Vue组件功能';
    }

    getExpressFeatures(content) {
        const features = [];
        const patterns = {
            'app.get': 'GET路由处理',
            'app.post': 'POST路由处理',
            'middleware': '中间件使用',
            'express()': 'Express应用初始化'
        };

        Object.entries(patterns).forEach(([pattern, desc]) => {
            if (content.includes(pattern)) {
                features.push(`- **${desc}**: ${desc}功能`);
            }
        });

        return features.length > 0 ? features.join('\n') : '- Express服务器功能';
    }

    /**
     * 智能生成使用示例
     */
    generateUsageExamples(fileName, fileAnalysis, content) {
        const framework = fileAnalysis.framework;
        const language = fileAnalysis.language;
        
        // 根据框架生成示例
        if (framework === 'wordpress') {
            if (fileName === 'functions.php') {
                return '```php\n// 在主题的functions.php中添加功能\n// 文件会自动被WordPress加载\n```';
            }
            return '```php\n// WordPress相关功能，通过插件或主题激活\n// 遵循WordPress开发标准\n```';
        }
        
        if (framework === 'laravel') {
            return '```php\n// Laravel框架文件\n// 通过路由或服务容器调用相关功能\n```';
        }
        
        if (framework === 'react') {
            return '```jsx\n// React组件使用\n// import Component from \'./path/to/component\'\n// <Component {...props} />\n```';
        }
        
        if (framework === 'vue') {
            return '```vue\n<!-- Vue组件使用 -->\n<!-- <component-name></component-name> -->\n```';
        }
        
        if (framework === 'express') {
            return '```javascript\n// Express路由或中间件\n// 通过app.use()或路由调用\n```';
        }
        
        // 通用语言示例
        if (language === 'javascript') {
            return '```javascript\n// 在HTML中引入此文件\n// <script src="path/to/file.js"></script>\n```';
        }
        
        if (language === 'python') {
            return '```python\n# Python模块导入\n# import module_name\n# 或 from module_name import function_name\n```';
        }
        
        return '```\n// 根据文件类型在适当的地方引入和使用\n```';
    }

    /**
     * 智能生成文件改进建议
     */
    generateFileSuggestions(fileAnalysis, projectAnalysis) {
        const suggestions = [];
        
        // 通用改进建议
        if (!fileAnalysis.documentation) {
            suggestions.push('添加详细的代码注释和函数文档');
        }
        
        if (fileAnalysis.complexity === 'high') {
            suggestions.push('考虑将复杂的函数拆分为更小的、更易维护的函数');
        }
        
        if (fileAnalysis.lines > 500) {
            suggestions.push('文件较大，考虑模块化拆分以提高可维护性');
        }
        
        // 框架特定建议
        if (fileAnalysis.framework) {
            suggestions.push(`遵循${fileAnalysis.framework}框架的最佳实践和编码标准`);
            
            if (fileAnalysis.framework === 'wordpress') {
                suggestions.push('使用WordPress标准的PHPDoc注释格式');
                suggestions.push('确保代码符合WordPress编码规范');
            } else if (fileAnalysis.framework === 'react') {
                suggestions.push('考虑使用React Hooks优化组件逻辑');
                suggestions.push('添加PropTypes或TypeScript类型定义');
            } else if (fileAnalysis.framework === 'laravel') {
                suggestions.push('使用Laravel的服务容器和依赖注入');
                suggestions.push('遵循PSR-4自动加载标准');
            }
        }
        
        // 安全建议
        if (fileAnalysis.security.suggestions.length > 0) {
            suggestions.push(...fileAnalysis.security.suggestions);
        }
        
        // 模式建议
        if (fileAnalysis.patterns.length === 0) {
            suggestions.push('考虑应用合适的设计模式来改善代码结构');
        }
        
        // 测试建议
        if (!fileAnalysis.purposes.includes('testing')) {
            suggestions.push('为核心功能添加单元测试');
        }
        
        return suggestions.length > 0 ? suggestions : ['代码结构良好，继续保持当前的开发实践'];
    }

    /**
     * 智能生成相关文件
     */
    generateRelatedFiles(filePath, projectAnalysis) {
        const fileName = path.basename(filePath);
        const relatedFiles = [];
        const directory = path.dirname(filePath);
        
        // 基于项目类型推荐相关文件
        if (projectAnalysis.project.framework.includes('WordPress')) {
            if (fileName === 'functions.php') {
                relatedFiles.push('- style.css - 主题样式文件');
                relatedFiles.push('- index.php - 主题主模板');
                relatedFiles.push('- wp-config.php - WordPress配置文件');
            } else if (directory.includes('wp-content/themes/')) {
                relatedFiles.push('- functions.php - 主题函数文件');
                relatedFiles.push('- style.css - 主题样式文件');
            } else if (directory.includes('wp-content/plugins/')) {
                relatedFiles.push('- 其他插件文件');
                relatedFiles.push('- wp-config.php - WordPress配置文件');
            }
        } else if (projectAnalysis.project.framework.includes('Laravel')) {
            if (fileName.includes('Controller')) {
                relatedFiles.push('- routes/web.php - 路由定义');
                relatedFiles.push('- resources/views/ - 视图模板');
                relatedFiles.push('- app/Models/ - 数据模型');
            } else if (fileName.includes('Model')) {
                relatedFiles.push('- database/migrations/ - 数据库迁移');
                relatedFiles.push('- app/Http/Controllers/ - 控制器');
            }
        } else if (projectAnalysis.project.framework.includes('React')) {
            if (fileName.includes('Component')) {
                relatedFiles.push('- package.json - 项目依赖');
                relatedFiles.push('- src/index.js - 应用入口');
                relatedFiles.push('- public/index.html - HTML模板');
            }
        } else if (projectAnalysis.project.framework.includes('Express')) {
            if (fileName.includes('route')) {
                relatedFiles.push('- app.js - 应用主文件');
                relatedFiles.push('- package.json - 项目配置');
                relatedFiles.push('- middleware/ - 中间件文件');
            }
        }
        
        // 通用相关文件推荐
        if (relatedFiles.length === 0) {
            relatedFiles.push('- package.json - 项目配置文件');
            relatedFiles.push('- README.md - 项目说明文档');
            relatedFiles.push('- .gitignore - Git忽略规则');
        }
        
        return relatedFiles.join('\n');
    }

    /**
     * 生成CSS内容分析（占位符）
     */
    analyzeCSSContent(content, analysis) {
        // CSS分析逻辑
        analysis.type = 'stylesheet';
    }

    /**
     * 生成HTML内容分析（占位符）
     */
    analyzeHTMLContent(content, analysis) {
        // HTML分析逻辑
        analysis.type = 'template';
    }

    /**
     * 通用描述生成
     */
    generateGenericDescription(name, type) {
        const patterns = {
            'class': {
                'controller': '控制器类，处理HTTP请求和响应',
                'model': '数据模型类，表示数据结构',
                'service': '服务类，提供业务逻辑',
                'helper': '辅助类，提供工具方法',
                'widget': '小工具类，提供UI组件',
                'admin': '管理类，处理后台功能',
                'api': 'API类，处理接口逻辑',
                'db|database': '数据库操作类',
                'auth': '认证相关类',
                'config': '配置管理类'
            },
            'function': {
                'init|initialize|setup': '初始化函数',
                'save|store|create|insert': '数据保存函数',
                'get|fetch|load|read|retrieve': '数据获取函数',
                'update|modify|edit|change': '数据更新函数',
                'delete|remove|destroy': '数据删除函数',
                'validate|check|verify': '数据验证函数',
                'render|display|show|draw': '内容渲染函数',
                'handle|process|execute': '业务处理函数'
            }
        };

        const typePatterns = patterns[type] || {};
        for (const [pattern, description] of Object.entries(typePatterns)) {
            if (new RegExp(pattern, 'i').test(name)) {
                return description;
            }
        }

        return type === 'class' ? '自定义类，提供特定功能' : '自定义函数，执行特定操作';
    }
}

module.exports = AIDevAssistant;
