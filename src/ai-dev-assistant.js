/**
 * AI开发辅助系统 - 主入口文件
 * AI Development Assistant - Main Entry Point
 * Version: 1.0.1
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
        lines.push(`**更新时间**: ${new Date().toISOString()}\n`);
        
        lines.push('## 🚀 开发环境设置\n');
        this.generateDevEnvironmentSetup(analysis, lines);
        
        lines.push('## 📋 开发规范\n');
        this.generateCodingStandards(analysis, lines);
        
        lines.push('## 🔧 常用命令\n');
        this.generateCommonCommands(analysis, lines);
        
        lines.push('## 🧪 测试指南\n');
        this.generateTestingGuide(analysis, lines);
        
        lines.push('## 📦 构建和部署\n');
        this.generateBuildGuide(analysis, lines);
        
        lines.push('## 🐛 调试技巧\n');
        this.generateDebuggingTips(analysis, lines);
        
        lines.push('---\n*此文档由 AI 开发辅助系统自动生成*');
        
        return lines.join('\n');
    }

    /**
     * 生成开发环境设置指南
     */
    generateDevEnvironmentSetup(analysis, lines) {
        lines.push('### 前置要求\n');
        
        if (analysis.project.type === 'node') {
            lines.push('- Node.js >= 14.0.0');
            lines.push('- npm >= 6.0.0 或 Yarn >= 1.22.0');
        } else if (analysis.project.language === 'python') {
            lines.push('- Python >= 3.8');
            lines.push('- pip >= 21.0');
        }
        
        lines.push('- Git >= 2.0');
        lines.push('- 代码编辑器（推荐 VS Code）\n');
        
        lines.push('### 项目设置\n');
        lines.push('```bash');
        lines.push('# 克隆项目');
        lines.push('git clone <repository-url>');
        lines.push(`cd ${analysis.metadata.name}`);
        lines.push('');
        
        if (analysis.project.type === 'node') {
            lines.push('# 安装依赖');
            lines.push(analysis.project.packageManager === 'yarn' ? 'yarn install' : 'npm install');
        } else if (analysis.project.language === 'python') {
            lines.push('# 创建虚拟环境');
            lines.push('python -m venv venv');
            lines.push('source venv/bin/activate');
            lines.push('pip install -r requirements.txt');
        }
        
        lines.push('```\n');
    }

    /**
     * 生成编码规范
     */
    generateCodingStandards(analysis, lines) {
        lines.push('### 代码风格\n');
        
        if (analysis.project.language === 'javascript' || analysis.project.language === 'typescript') {
            lines.push('- 使用 ESLint 进行代码检查');
            lines.push('- 使用 Prettier 进行代码格式化');
            lines.push('- 遵循 Airbnb JavaScript 风格指南');
        } else if (analysis.project.language === 'python') {
            lines.push('- 遵循 PEP 8 代码风格');
            lines.push('- 使用 Black 进行代码格式化');
            lines.push('- 使用 pylint 进行代码检查');
        }
        
        lines.push('');
        
        lines.push('### 提交规范\n');
        lines.push('- 使用语义化提交信息（Semantic Commit Messages）');
        lines.push('- 格式：`type(scope): description`');
        lines.push('- 类型：feat, fix, docs, style, refactor, test, chore');
        lines.push('');
    }

    /**
     * 生成常用命令
     */
    generateCommonCommands(analysis, lines) {
        lines.push('```bash');
        
        if (analysis.project.type === 'node') {
            const pm = analysis.project.packageManager === 'yarn' ? 'yarn' : 'npm';
            lines.push('# 开发模式');
            lines.push(`${pm} run dev`);
            lines.push('');
            lines.push('# 构建项目');
            lines.push(`${pm} run build`);
            lines.push('');
            lines.push('# 运行测试');
            lines.push(`${pm} test`);
            lines.push('');
            lines.push('# 代码检查');
            lines.push(`${pm} run lint`);
        }
        
        lines.push('```\n');
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
        
        lines.push('## 📋 部署准备\n');
        lines.push('### 环境要求\n');
        
        if (analysis.project.type === 'node') {
            lines.push('- **Node.js**: >= 14.0.0');
            lines.push('- **npm**: >= 6.0.0 或 **Yarn**: >= 1.22.0');
            lines.push('- **操作系统**: Linux/Ubuntu 18.04+ (推荐)');
        } else if (analysis.project.language === 'python') {
            lines.push('- **Python**: >= 3.8');
            lines.push('- **pip**: >= 21.0');
            lines.push('- **操作系统**: Linux/Ubuntu 18.04+ (推荐)');
        }
        
        lines.push('- **内存**: 至少 2GB RAM');
        lines.push('- **存储**: 至少 10GB 可用空间');
        lines.push('- **网络**: 稳定的互联网连接\n');
        
        // 本地部署
        lines.push('## 🏠 本地部署\n');
        lines.push('### 1. 克隆项目\n');
        lines.push('```bash');
        lines.push('git clone <repository-url>');
        lines.push(`cd ${analysis.metadata.name}`);
        lines.push('```\n');
        
        lines.push('### 2. 安装依赖\n');
        lines.push('```bash');
        if (analysis.project.type === 'node') {
            if (analysis.project.packageManager === 'yarn') {
                lines.push('yarn install');
            } else {
                lines.push('npm install');
            }
        } else if (analysis.project.language === 'python') {
            lines.push('pip install -r requirements.txt');
        }
        lines.push('```\n');
        
        lines.push('### 3. 环境配置\n');
        lines.push('```bash');
        lines.push('# 复制环境变量模板');
        lines.push('cp .env.example .env');
        lines.push('');
        lines.push('# 编辑环境变量');
        lines.push('nano .env');
        lines.push('```\n');
        
        lines.push('### 4. 启动服务\n');
        lines.push('```bash');
        if (analysis.project.type === 'node') {
            if (analysis.project.packageManager === 'yarn') {
                lines.push('yarn start');
            } else {
                lines.push('npm start');
            }
        } else if (analysis.project.language === 'python') {
            lines.push('python app.py');
        }
        lines.push('```\n');
        
        // Docker 部署
        lines.push('## 🐳 Docker 部署\n');
        lines.push('### 构建镜像\n');
        lines.push('```bash');
        lines.push(`docker build -t ${analysis.metadata.name.toLowerCase()} .`);
        lines.push('```\n');
        
        lines.push('### 运行容器\n');
        lines.push('```bash');
        lines.push(`docker run -d -p 3000:3000 --name ${analysis.metadata.name.toLowerCase()} ${analysis.metadata.name.toLowerCase()}`);
        lines.push('```\n');
        
        // 生产环境部署
        lines.push('## 🌐 生产环境部署\n');
        lines.push('### 服务器配置\n');
        lines.push('1. **反向代理**: 使用 Nginx 或 Apache');
        lines.push('2. **进程管理**: 使用 PM2 (Node.js) 或 systemd');
        lines.push('3. **HTTPS**: 配置 SSL 证书');
        lines.push('4. **监控**: 配置日志和性能监控');
        lines.push('5. **备份**: 定期备份数据和配置\n');
        
        if (analysis.project.type === 'node') {
            lines.push('### PM2 部署\n');
            lines.push('```bash');
            lines.push('# 安装 PM2');
            lines.push('npm install -g pm2');
            lines.push('');
            lines.push('# 启动应用');
            lines.push(`pm2 start ecosystem.config.js`);
            lines.push('');
            lines.push('# 保存配置');
            lines.push('pm2 save');
            lines.push('pm2 startup');
            lines.push('```\n');
        }
        
        // 环境变量
        lines.push('## ⚙️ 环境变量配置\n');
        lines.push('| 变量名 | 描述 | 默认值 | 必需 |');
        lines.push('|--------|------|--------|------|');
        lines.push('| `NODE_ENV` | 运行环境 | `development` | 是 |');
        lines.push('| `PORT` | 服务端口 | `3000` | 否 |');
        lines.push('| `DATABASE_URL` | 数据库连接 | - | 是 |');
        lines.push('| `SECRET_KEY` | 加密密钥 | - | 是 |\n');
        
        // 健康检查
        lines.push('## 🔍 健康检查\n');
        lines.push('部署完成后，访问以下端点验证服务状态：\n');
        lines.push('- **健康检查**: `GET /health`');
        lines.push('- **服务状态**: `GET /api/status`');
        lines.push('- **应用信息**: `GET /api/info`\n');
        
        // 故障排除
        lines.push('## 🔧 故障排除\n');
        lines.push('### 常见问题\n');
        lines.push('1. **端口占用**: 检查端口是否被其他进程占用');
        lines.push('2. **依赖缺失**: 确保所有依赖都已正确安装');
        lines.push('3. **环境变量**: 检查必需的环境变量是否设置');
        lines.push('4. **权限问题**: 确保进程有足够的文件访问权限\n');
        
        lines.push('### 日志查看\n');
        lines.push('```bash');
        if (analysis.project.type === 'node') {
            lines.push('# PM2 日志');
            lines.push('pm2 logs');
            lines.push('');
        }
        lines.push('# 系统日志');
        lines.push('tail -f /var/log/application.log');
        lines.push('```\n');
        
        lines.push('---\n*此文档由 AI 开发辅助系统自动生成*');
        
        return lines.join('\n');
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
}

module.exports = AIDevAssistant;
