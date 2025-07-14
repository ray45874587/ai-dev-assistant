/**
 * AI开发辅助系统 v1.2.0
 * 智能项目分析和文档生成工具
 * 优化精简版 - 专注AI智能分析，杜绝硬编码
 */

const fs = require('fs');
const path = require('path');
const IntelligentProjectAnalyzer = require('./project-analyzer');
const ContextManager = require('./context-manager');
const AIRulesEngine = require('./ai-rules-engine');
const SmartDocGenerator = require('./smart-doc-generator');

class AIDevAssistant {
    constructor(projectPath = process.cwd()) {
        this.version = '1.2.0';
        this.projectPath = path.resolve(projectPath);
        
        // 统一目录结构 - 所有系统文件都在"AI助手文档"目录下
        this.docsDir = path.join(this.projectPath, 'AI助手文档');
        this.contextDir = path.join(this.docsDir, '.system'); // 系统文件子目录
        this.currentAnalysis = null;
        
        // 确保目录存在
        this.ensureDirectories();
        
        // 核心组件 - 智能化架构
        this.analyzer = new IntelligentProjectAnalyzer(this.projectPath);
        this.contextManager = new ContextManager(this.contextDir, this.projectPath);
        this.rulesEngine = new AIRulesEngine(this.projectPath, this.docsDir);
        this.docGenerator = new SmartDocGenerator(this.projectPath);
        
        // 智能配置初始化
        this.config = this.adaptiveConfig();
        this.intelligentFocusAdjustment();
    }

    /**
     * 确保必要的目录存在
     */
    ensureDirectories() {
        if (!fs.existsSync(this.docsDir)) {
            fs.mkdirSync(this.docsDir, { recursive: true });
        }
        if (!fs.existsSync(this.contextDir)) {
            fs.mkdirSync(this.contextDir, { recursive: true });
        }
    }

    /**
     * 自适应配置 - AI驱动的配置生成
     */
    adaptiveConfig() {
        const projectType = this.analyzer.quickTypeDetection();
        return {
            analysis: {
                depth: projectType === 'complex' ? 'deep' : 'standard',
                focus: this.detectProjectFocus(),
                smartFiltering: true
            },
            documentation: {
                style: 'intelligent',
                format: 'markdown',
                aiGenerated: true
            },
            performance: {
                enableCache: true,
                maxFileSize: '10MB',
                smartSkipping: true
            }
        };
    }

    /**
     * 智能焦点调整 - 根据项目特征自动调整分析重点
     */
    intelligentFocusAdjustment() {
        const projectIndicators = this.analyzer.getProjectIndicators();
        
        if (projectIndicators.isWebProject) {
            this.config.analysis.priorityAreas = ['frontend', 'backend', 'assets'];
        } else if (projectIndicators.isAPIProject) {
            this.config.analysis.priorityAreas = ['routes', 'controllers', 'models'];
        } else {
            this.config.analysis.priorityAreas = ['core', 'modules', 'utils'];
        }
    }

    /**
     * 项目焦点智能检测
     */
    detectProjectFocus() {
        const indicators = this.analyzer.getProjectIndicators();
        
        if (indicators.hasDatabase) return 'data-driven';
        if (indicators.hasAPI) return 'service-oriented';
        if (indicators.hasUI) return 'user-interface';
        if (indicators.hasAutomation) return 'automation';
        
        return 'general';
    }

    /**
     * 主分析方法 - AI驱动的智能分析
     */
    async analyze() {
        try {
            console.log(`AI开发辅助系统 v${this.version} - 智能项目分析`);
            console.log(`项目路径: ${this.projectPath}`);
            console.log('正在进行AI智能分析...\n');
            
            // AI智能分析
            this.currentAnalysis = await this.analyzer.analyze();
            
            // 智能上下文管理
            await this.contextManager.updateContext(this.currentAnalysis);
            
            console.log('分析完成！');
            return this.currentAnalysis;
            
        } catch (error) {
            console.error('分析失败:', error.message);
            throw error;
        }
    }

    /**
     * 智能生成项目文档
     */
    async generateDocs() {
        try {
            if (!this.currentAnalysis) {
                console.log('正在进行项目分析...');
                await this.analyze();
            }
            
            console.log('正在智能生成项目文档...');
            
            // 使用统一的文档目录
            const generatedDocs = await this.docGenerator.generateAllDocs(
                this.currentAnalysis, 
                this.docsDir
            );
            
            if (generatedDocs.length > 0) {
                console.log(`\n成功生成 ${generatedDocs.length} 个文档:`);
                generatedDocs.forEach(doc => console.log(`- ${doc}`));
                
                this.displayAnalysisSummary();
                
                return {
                    success: true,
                    files: generatedDocs,
                    docsDirectory: 'AI助手文档'
                };
            } else {
                console.warn('未生成任何文档');
                return { success: false, files: [] };
            }
            
        } catch (error) {
            console.error('文档生成失败:', error.message);
            return { success: false, error: error.message };
        }
    }

    /**
     * 显示分析摘要
     */
    displayAnalysisSummary() {
        if (!this.currentAnalysis) return;
        
        const analysis = this.currentAnalysis;
        
        console.log('\n📊 项目分析摘要:');
        console.log(`项目类型: ${analysis.project.type}`);
        console.log(`代码质量: ${analysis.quality.score}/100`);
        console.log(`文件总数: ${analysis.codeMetrics.totalFiles}`);
        console.log(`代码行数: ${analysis.codeMetrics.totalLines}`);
        
        if (analysis.quality.suggestions.length > 0) {
            console.log('\n💡 AI建议:');
            analysis.quality.suggestions.slice(0, 3).forEach((suggestion, i) => {
                console.log(`${i + 1}. ${suggestion}`);
            });
        }
    }

    /**
     * 获取项目概览 - 智能化项目概况
     */
    async getProjectOverview() {
        try {
            if (!this.currentAnalysis) {
                await this.analyze();
            }
            
            return {
                name: this.currentAnalysis.metadata.name,
                type: this.currentAnalysis.project.type,
                language: this.currentAnalysis.project.language,
                framework: this.currentAnalysis.project.framework,
                quality: {
                    score: this.currentAnalysis.quality.score,
                    level: this.getQualityLevel(this.currentAnalysis.quality.score)
                },
                metrics: {
                    files: this.currentAnalysis.codeMetrics.totalFiles,
                    lines: this.currentAnalysis.codeMetrics.totalLines,
                    complexity: this.currentAnalysis.codeMetrics.complexity
                },
                aiInsights: this.generateAIInsights()
            };
            
        } catch (error) {
            console.error('获取项目概览失败:', error.message);
            return null;
        }
    }

    /**
     * 生成AI洞察
     */
    generateAIInsights() {
        if (!this.currentAnalysis) return [];
        
        const insights = [];
        const analysis = this.currentAnalysis;
        
        // 智能洞察生成
        if (analysis.quality.score >= 80) {
            insights.push('项目代码质量良好，维护性较强');
        } else if (analysis.quality.score >= 60) {
            insights.push('项目代码质量中等，建议优化');
        } else {
            insights.push('项目代码质量需要改进');
        }
        
        if (analysis.codeMetrics.complexity === 'high') {
            insights.push('项目复杂度较高，建议模块化重构');
        }
        
        if (analysis.project.type === 'wordpress') {
            insights.push('WordPress项目，注意安全性和性能优化');
        }
        
        return insights;
    }

    /**
     * 获取质量等级
     */
    getQualityLevel(score) {
        if (score >= 80) return '优秀';
        if (score >= 60) return '良好';
        if (score >= 40) return '一般';
        return '需要改进';
    }

    /**
     * 健康检查 - 系统状态验证
     */
    async healthCheck() {
        const checks = {
            projectPath: fs.existsSync(this.projectPath),
            analyzer: this.analyzer instanceof IntelligentProjectAnalyzer,
            contextManager: this.contextManager instanceof ContextManager,
            rulesEngine: this.rulesEngine instanceof AIRulesEngine,
            docGenerator: this.docGenerator instanceof SmartDocGenerator
        };
        
        const allHealthy = Object.values(checks).every(check => check === true);
        
        return {
            healthy: allHealthy,
            version: this.version,
            checks,
            timestamp: new Date().toISOString()
        };
    }

    /**
     * 快速分析 - 轻量级项目检查
     */
    async quickAnalysis() {
        try {
            console.log('正在进行快速AI分析...');
            
            const quickResult = await this.analyzer.quickAnalyze();
            
            console.log(`项目类型: ${quickResult.type}`);
            console.log(`主要语言: ${quickResult.language}`);
            console.log(`文件数量: ${quickResult.fileCount}`);
            
            return quickResult;
            
        } catch (error) {
            console.error('快速分析失败:', error.message);
            return null;
        }
    }

    /**
     * 清理缓存和临时文件
     */
    async cleanup() {
        try {
            await this.contextManager.cleanup();
            console.log('清理完成');
            return true;
        } catch (error) {
            console.error('清理失败:', error.message);
            return false;
        }
    }

    /**
     * 获取系统信息
     */
    getSystemInfo() {
        return {
            version: this.version,
            projectPath: this.projectPath,
            contextDir: this.contextDir,
            config: this.config,
            features: [
                'AI智能项目分析',
                '智能文档生成',
                '自适应配置',
                '上下文感知',
                '质量评估'
            ]
        };
    }

    /**
     * 单文件分析 - AI智能单文件分析
     */
    async analyzeFile(filePath, saveToFile = false) {
        try {
            const absolutePath = path.resolve(this.projectPath, filePath);
            
            // 检查文件是否存在
            if (!fs.existsSync(absolutePath)) {
                throw new Error(`文件不存在: ${filePath}`);
            }
            
            // 检查是否为文件（不是目录）
            const stats = fs.statSync(absolutePath);
            if (!stats.isFile()) {
                throw new Error(`路径不是文件: ${filePath}`);
            }
            
            // 读取文件内容
            const content = fs.readFileSync(absolutePath, 'utf8');
            const extension = path.extname(filePath).toLowerCase();
            
            console.log(`🔍 正在深度分析文件: ${filePath}`);
            console.log('📊 执行AI智能业务逻辑分析...');
            
            // 基本文件信息
            const fileInfo = {
                name: path.basename(filePath),
                path: filePath,
                extension: extension,
                size: stats.size,
                lines: content.split('\n').length,
                lastModified: stats.mtime,
                encoding: 'utf8'
            };
            
            // AI智能文件类型和用途分析
            const intelligentTypeAnalysis = await this.performIntelligentTypeAnalysis(content, extension, filePath);
            
            // AI业务逻辑深度分析
            const businessLogicAnalysis = await this.performBusinessLogicAnalysis(content, extension, intelligentTypeAnalysis);
            
            // AI架构模式识别
            const architectureAnalysis = await this.performArchitectureAnalysis(content, extension, filePath);
            
            // AI代码质量深度分析
            const qualityAnalysis = await this.performDeepQualityAnalysis(content, extension, businessLogicAnalysis);
            
            // AI安全性专业分析
            const securityAnalysis = await this.performProfessionalSecurityAnalysis(content, extension, businessLogicAnalysis);
            
            // AI复杂度和可维护性分析
            const complexityAnalysis = await this.performComplexityAndMaintainabilityAnalysis(content, extension, businessLogicAnalysis);
            
            // AI依赖关系和影响分析
            const dependencyAnalysis = await this.performDependencyImpactAnalysis(content, extension, filePath);
            
            // AI性能优化建议
            const performanceAnalysis = await this.performPerformanceAnalysis(content, extension, businessLogicAnalysis);
            
            // AI综合改进建议
            const improvementSuggestions = await this.generateIntelligentImprovementSuggestions(
                content, extension, businessLogicAnalysis, qualityAnalysis, securityAnalysis, architectureAnalysis
            );
            
            const analysisResult = {
                fileInfo,
                intelligentType: intelligentTypeAnalysis,
                businessLogic: businessLogicAnalysis,
                architecture: architectureAnalysis,
                quality: qualityAnalysis,
                security: securityAnalysis,
                complexity: complexityAnalysis,
                dependencies: dependencyAnalysis,
                performance: performanceAnalysis,
                improvements: improvementSuggestions,
                timestamp: new Date().toISOString()
            };
            
            console.log('✅ AI智能分析完成');
            
            // 如果需要保存到文件，生成分析报告
            if (saveToFile) {
                const reportPath = await this.saveIntelligentFileAnalysisReport(analysisResult);
                analysisResult.reportPath = reportPath;
            }
            
            return analysisResult;
            
        } catch (error) {
            throw new Error(`文件分析失败: ${error.message}`);
        }
    }

    /**
     * AI智能文件类型和用途分析
     */
    async performIntelligentTypeAnalysis(content, extension, filePath) {
        const analysis = {
            primaryType: '',
            specificPurpose: '',
            frameworkRole: '',
            businessContext: '',
            technicalClassification: ''
        };
        
        // 基础类型映射
        const typeMap = {
            '.js': 'JavaScript',
            '.jsx': 'React JSX',
            '.ts': 'TypeScript',
            '.tsx': 'TypeScript React',
            '.php': 'PHP',
            '.py': 'Python',
            '.html': 'HTML',
            '.css': 'CSS',
            '.json': 'JSON配置',
            '.md': 'Markdown文档'
        };
        
        analysis.primaryType = typeMap[extension] || '未知类型';
        
        // PHP文件深度分析
        if (extension === '.php') {
            if (content.includes('wp_') || content.includes('wordpress') || content.includes('get_header()')) {
                analysis.technicalClassification = 'WordPress主题/插件文件';
                
                if (content.includes('wp-config')) {
                    analysis.specificPurpose = 'WordPress核心配置文件';
                    analysis.businessContext = '管理数据库连接、安全密钥、调试设置等核心配置';
                } else if (content.includes('index.php') && filePath.includes('index.php')) {
                    analysis.specificPurpose = 'WordPress主入口文件';
                    analysis.businessContext = '处理所有HTTP请求的路由分发和WordPress核心加载';
                } else if (content.includes('function ') && content.includes('add_action')) {
                    analysis.specificPurpose = 'WordPress功能扩展文件';
                    analysis.businessContext = '实现自定义功能、钩子处理和主题/插件逻辑';
                } else if (content.includes('class ') && content.includes('extends')) {
                    analysis.specificPurpose = 'WordPress面向对象组件';
                    analysis.businessContext = '封装业务逻辑的类文件，提供可重用的功能模块';
                }
            } else if (content.includes('class ') && content.includes('public function')) {
                analysis.technicalClassification = 'PHP面向对象类文件';
                analysis.specificPurpose = '业务逻辑封装类';
                analysis.businessContext = '实现特定业务功能的面向对象代码组件';
            } else if (content.includes('$_GET') || content.includes('$_POST')) {
                analysis.technicalClassification = 'PHP Web处理脚本';
                analysis.specificPurpose = 'HTTP请求处理文件';
                analysis.businessContext = '处理用户输入、表单提交或API接口逻辑';
            }
        }
        
        // JavaScript文件深度分析
        if (extension === '.js' || extension === '.jsx') {
            if (content.includes('import React') || content.includes('from \'react\'')) {
                analysis.technicalClassification = 'React组件文件';
                if (content.includes('useState') || content.includes('useEffect')) {
                    analysis.specificPurpose = 'React功能组件';
                    analysis.businessContext = '实现用户界面交互和状态管理的前端组件';
                } else if (content.includes('class ') && content.includes('extends Component')) {
                    analysis.specificPurpose = 'React类组件';
                    analysis.businessContext = '基于类的React组件，处理复杂的生命周期和状态逻辑';
                }
            } else if (content.includes('module.exports') || content.includes('require(')) {
                analysis.technicalClassification = 'Node.js模块';
                analysis.specificPurpose = 'Node.js后端模块';
                analysis.businessContext = '服务器端业务逻辑、API处理或工具函数模块';
            } else if (content.includes('express') || content.includes('app.get') || content.includes('app.post')) {
                analysis.technicalClassification = 'Express.js路由/中间件';
                analysis.specificPurpose = 'Web API路由处理';
                analysis.businessContext = '处理HTTP请求、API端点和中间件逻辑';
            }
        }
        
        return analysis;
    }

    /**
     * AI业务逻辑深度分析
     */
    async performBusinessLogicAnalysis(content, extension, typeAnalysis) {
        const analysis = {
            mainPurpose: '',
            keyFunctions: [],
            businessRules: [],
            dataFlow: '',
            userInteractions: [],
            integrations: [],
            businessValue: ''
        };
        
        const lines = content.split('\n');
        
        // 函数提取和分析
        const functionPatterns = {
            '.php': [
                /function\s+(\w+)\s*\(/g,
                /public\s+function\s+(\w+)\s*\(/g,
                /private\s+function\s+(\w+)\s*\(/g
            ],
            '.js': [
                /function\s+(\w+)\s*\(/g,
                /const\s+(\w+)\s*=\s*\(/g,
                /(\w+)\s*:\s*function/g
            ]
        };
        
        // 提取关键函数
        const patterns = functionPatterns[extension] || functionPatterns['.js'];
        patterns.forEach(pattern => {
            let match;
            while ((match = pattern.exec(content)) !== null) {
                const functionName = match[1];
                const functionContext = this.extractFunctionContext(content, functionName);
                analysis.keyFunctions.push({
                    name: functionName,
                    purpose: this.inferFunctionPurpose(functionName, functionContext),
                    businessRole: this.inferBusinessRole(functionName, functionContext)
                });
            }
        });
        
        // 业务规则识别
        if (extension === '.php') {
            if (content.includes('wp-config')) {
                analysis.mainPurpose = 'WordPress站点核心配置管理';
                analysis.businessRules.push('数据库连接参数配置');
                analysis.businessRules.push('安全密钥和盐值设置');
                analysis.businessRules.push('调试模式控制');
                analysis.dataFlow = '配置信息 → WordPress核心 → 整个站点功能';
                analysis.businessValue = '确保WordPress站点能够正常运行并保持安全性';
            } else if (content.includes('$_POST') || content.includes('$_GET')) {
                analysis.mainPurpose = '用户输入处理和业务逻辑执行';
                analysis.userInteractions.push('接收用户表单数据');
                analysis.userInteractions.push('处理HTTP请求参数');
                analysis.dataFlow = '用户输入 → 验证处理 → 业务逻辑 → 响应输出';
            } else if (content.includes('add_action') || content.includes('add_filter')) {
                analysis.mainPurpose = 'WordPress功能扩展和定制化';
                analysis.businessRules.push('响应WordPress核心事件');
                analysis.businessRules.push('修改或扩展默认行为');
                analysis.dataFlow = 'WordPress事件 → 自定义处理 → 修改结果';
                analysis.businessValue = '为网站提供定制化功能和用户体验';
            }
        }
        
        // 集成分析
        const integrationPatterns = [
            { pattern: /mysql_|mysqli_|PDO/i, type: '数据库集成' },
            { pattern: /curl_|file_get_contents|wp_remote/i, type: 'HTTP/API集成' },
            { pattern: /mail\(|wp_mail/i, type: '邮件系统集成' },
            { pattern: /session_start|$_SESSION/i, type: '会话管理' },
            { pattern: /json_encode|json_decode/i, type: 'JSON数据处理' }
        ];
        
        integrationPatterns.forEach(({ pattern, type }) => {
            if (pattern.test(content)) {
                analysis.integrations.push(type);
            }
        });
        
        return analysis;
    }

    /**
     * AI架构模式识别
     */
    async performArchitectureAnalysis(content, extension, filePath) {
        const analysis = {
            architecturalPattern: '',
            designPatterns: [],
            codeOrganization: '',
            separationOfConcerns: '',
            scalabilityFactors: []
        };
        
        // 架构模式识别
        if (content.includes('class ') && content.includes('extends')) {
            analysis.architecturalPattern = '面向对象架构';
            if (content.includes('interface ') || content.includes('implements ')) {
                analysis.designPatterns.push('接口隔离原则');
            }
        } else if (content.includes('function ') && !content.includes('class ')) {
            analysis.architecturalPattern = '过程式编程';
        }
        
        // 设计模式识别
        if (content.includes('getInstance') || content.includes('instance')) {
            analysis.designPatterns.push('单例模式');
        }
        if (content.includes('factory') || content.includes('Factory')) {
            analysis.designPatterns.push('工厂模式');
        }
        if (content.includes('observer') || content.includes('Observer')) {
            analysis.designPatterns.push('观察者模式');
        }
        
        // WordPress特定架构
        if (content.includes('add_action') || content.includes('add_filter')) {
            analysis.architecturalPattern = 'WordPress钩子架构';
            analysis.designPatterns.push('事件驱动模式');
        }
        
        // 代码组织评估
        const functionCount = (content.match(/function\s+\w+/g) || []).length;
        const classCount = (content.match(/class\s+\w+/g) || []).length;
        
        if (classCount > 0 && functionCount / classCount < 10) {
            analysis.codeOrganization = '良好的类封装';
        } else if (functionCount > 20 && classCount === 0) {
            analysis.codeOrganization = '功能过多，建议模块化';
        } else {
            analysis.codeOrganization = '标准的代码组织';
        }
        
        return analysis;
    }

    /**
     * 深度代码质量分析
     */
    async performDeepQualityAnalysis(content, extension, businessLogic) {
        const lines = content.split('\n');
        const totalLines = lines.length;
        
        // 基础指标
        const codeLines = lines.filter(line => line.trim() && !this.isCommentLine(line, extension)).length;
        const commentLines = lines.filter(line => this.isCommentLine(line, extension)).length;
        const emptyLines = totalLines - codeLines - commentLines;
        
        // 高级质量指标
        const qualityMetrics = {
            totalLines,
            codeLines,
            commentLines,
            emptyLines,
            commentRatio: commentLines / totalLines,
            codeComplexity: this.calculateAdvancedComplexity(content),
            maintainabilityIndex: this.calculateMaintainabilityIndex(content, codeLines),
            technicalDebt: this.assessTechnicalDebt(content, extension),
            readabilityScore: this.assessReadability(content, extension),
            testCoverage: this.assessTestIndicators(content)
        };
        
        // 质量评分算法
        let score = 100;
        
        // 注释质量
        if (qualityMetrics.commentRatio < 0.1) score -= 25;
        else if (qualityMetrics.commentRatio < 0.2) score -= 10;
        
        // 复杂度惩罚
        if (qualityMetrics.codeComplexity > 50) score -= 30;
        else if (qualityMetrics.codeComplexity > 20) score -= 15;
        
        // 可维护性
        if (qualityMetrics.maintainabilityIndex < 50) score -= 20;
        else if (qualityMetrics.maintainabilityIndex < 70) score -= 10;
        
        // 技术债务
        score -= qualityMetrics.technicalDebt * 5;
        
        // 可读性
        if (qualityMetrics.readabilityScore < 60) score -= 15;
        
        return {
            score: Math.max(0, Math.min(100, score)),
            metrics: qualityMetrics,
            level: this.getQualityLevel(score),
            recommendations: this.generateQualityRecommendations(qualityMetrics)
        };
    }

    /**
     * 专业安全性分析
     */
    async performProfessionalSecurityAnalysis(content, extension, businessLogic) {
        const vulnerabilities = [];
        const securityWarnings = [];
        const securityStrengths = [];
        
        // 高危漏洞检测
        const highRiskPatterns = [
            { pattern: /eval\s*\(/g, type: '代码注入', severity: 'critical', description: 'eval()函数可执行任意代码' },
            { pattern: /exec\s*\(|system\s*\(|shell_exec/g, type: '命令注入', severity: 'critical', description: '系统命令执行函数' },
            { pattern: /\$_GET\[.*\]\s*without\s*validation/g, type: 'XSS漏洞', severity: 'high', description: '未验证的GET参数直接使用' }
        ];
        
        // SQL注入检测
        if (extension === '.php') {
            if (content.includes('mysql_query') || content.includes('mysqli_query')) {
                if (!content.includes('prepare') && !content.includes('bind_param')) {
                    vulnerabilities.push({
                        type: 'SQL注入',
                        severity: 'critical',
                        description: '使用直接SQL查询而非参数化查询',
                        recommendation: '使用预处理语句和参数绑定'
                    });
                }
            }
            
            // XSS检测
            if (content.includes('echo $_') || content.includes('print $_')) {
                vulnerabilities.push({
                    type: 'XSS漏洞',
                    severity: 'high',
                    description: '直接输出用户输入数据',
                    recommendation: '使用htmlspecialchars()或其他转义函数'
                });
            }
            
            // CSRF检测
            if (content.includes('$_POST') && !content.includes('wp_nonce') && !content.includes('csrf')) {
                securityWarnings.push({
                    type: 'CSRF风险',
                    description: '缺少CSRF保护机制',
                    recommendation: '实施token验证或使用WordPress nonce'
                });
            }
        }
        
        // 敏感信息泄露检测
        const sensitivePatterns = [
            { pattern: /password\s*=\s*['"]\w+['"]/i, type: '硬编码密码' },
            { pattern: /api[_-]?key\s*=\s*['"]\w+['"]/i, type: '硬编码API密钥' },
            { pattern: /secret\s*=\s*['"]\w+['"]/i, type: '硬编码密钥' }
        ];
        
        sensitivePatterns.forEach(({ pattern, type }) => {
            if (pattern.test(content)) {
                vulnerabilities.push({
                    type: '敏感信息泄露',
                    severity: 'high',
                    description: `发现${type}`,
                    recommendation: '使用环境变量或安全的配置管理'
                });
            }
        });
        
        // 安全优势识别
        if (content.includes('sanitize_') || content.includes('validate_')) {
            securityStrengths.push('使用了数据验证和清理函数');
        }
        if (content.includes('wp_nonce')) {
            securityStrengths.push('实施了WordPress CSRF保护');
        }
        if (content.includes('prepare(') && content.includes('bind_')) {
            securityStrengths.push('使用了参数化查询');
        }
        
        const riskLevel = vulnerabilities.some(v => v.severity === 'critical') ? 'critical' :
                         vulnerabilities.some(v => v.severity === 'high') ? 'high' :
                         securityWarnings.length > 0 ? 'medium' : 'low';
        
        return {
            riskLevel,
            vulnerabilities,
            warnings: securityWarnings,
            strengths: securityStrengths,
            totalIssues: vulnerabilities.length + securityWarnings.length,
            securityScore: this.calculateSecurityScore(vulnerabilities, securityWarnings, securityStrengths)
        };
    }

    /**
     * 复杂度和可维护性分析
     */
    async performComplexityAndMaintainabilityAnalysis(content, extension, businessLogic) {
        const metrics = {
            cyclomaticComplexity: this.calculateCyclomaticComplexity(content),
            cognitiveComplexity: this.calculateCognitiveComplexity(content),
            maintainabilityIndex: this.calculateMaintainabilityIndex(content),
            couplingLevel: this.assessCoupling(content, extension),
            cohesionLevel: this.assessCohesion(content, extension)
        };
        
        return {
            ...metrics,
            overallComplexity: this.determineOverallComplexity(metrics),
            maintainabilityLevel: this.determineMaintainabilityLevel(metrics),
            refactoringPriority: this.determineRefactoringPriority(metrics),
            recommendations: this.generateComplexityRecommendations(metrics)
        };
    }

    /**
     * 依赖关系和影响分析
     */
    async performDependencyImpactAnalysis(content, extension, filePath) {
        const dependencies = {
            external: [],
            internal: [],
            frameworks: [],
            libraries: []
        };
        
        // 外部依赖识别
        if (extension === '.php') {
            // WordPress依赖
            const wpFunctions = content.match(/wp_\w+/g) || [];
            if (wpFunctions.length > 0) {
                dependencies.frameworks.push({
                    name: 'WordPress',
                    functions: [...new Set(wpFunctions)],
                    dependencyLevel: 'high'
                });
            }
            
            // 数据库依赖
            if (content.includes('mysql') || content.includes('mysqli') || content.includes('PDO')) {
                dependencies.external.push({
                    name: 'MySQL数据库',
                    type: 'database',
                    critical: true
                });
            }
        }
        
        // 文件间依赖
        const includePatterns = [
            /require\s*\(\s*['"]([^'"]+)['"]\s*\)/g,
            /include\s*\(\s*['"]([^'"]+)['"]\s*\)/g,
            /import\s+.*from\s+['"]([^'"]+)['"]/g
        ];
        
        includePatterns.forEach(pattern => {
            let match;
            while ((match = pattern.exec(content)) !== null) {
                dependencies.internal.push({
                    file: match[1],
                    type: 'file_dependency'
                });
            }
        });
        
        return {
            dependencies,
            impactAnalysis: this.analyzeChangeImpact(dependencies),
            riskAssessment: this.assessDependencyRisks(dependencies)
        };
    }

    /**
     * 性能分析
     */
    async performPerformanceAnalysis(content, extension, businessLogic) {
        const issues = [];
        const optimizations = [];
        
        // 数据库查询优化
        if (content.includes('mysql_query') || content.includes('mysqli_query')) {
            const queryCount = (content.match(/query\s*\(/g) || []).length;
            if (queryCount > 5) {
                issues.push({
                    type: '数据库查询过多',
                    impact: 'high',
                    description: `检测到${queryCount}个数据库查询`,
                    solution: '考虑查询优化、缓存或批量处理'
                });
            }
        }
        
        // 循环优化
        const loopCount = (content.match(/for\s*\(|while\s*\(|foreach\s*\(/g) || []).length;
        if (loopCount > 3 && content.includes('query')) {
            issues.push({
                type: '循环中的数据库查询',
                impact: 'critical',
                description: 'N+1查询问题',
                solution: '使用JOIN查询或预加载数据'
            });
        }
        
        // 内存使用
        if (content.includes('file_get_contents') && !content.includes('stream')) {
            optimizations.push({
                type: '内存优化',
                description: '大文件读取可能消耗大量内存',
                suggestion: '使用流式处理或分块读取'
            });
        }
        
        return {
            performanceScore: this.calculatePerformanceScore(issues),
            issues,
            optimizations,
            recommendations: this.generatePerformanceRecommendations(issues, optimizations)
        };
    }

    /**
     * 生成智能改进建议
     */
    async generateIntelligentImprovementSuggestions(content, extension, businessLogic, quality, security, architecture) {
        const suggestions = {
            immediate: [],
            shortTerm: [],
            longTerm: [],
            architecture: [],
            business: []
        };
        
        // 立即需要处理的问题
        if (security.vulnerabilities.length > 0) {
            suggestions.immediate.push({
                priority: 'critical',
                category: '安全性',
                action: '修复安全漏洞',
                details: security.vulnerabilities.map(v => v.description),
                impact: '防止安全事故和数据泄露'
            });
        }
        
        // 短期改进建议
        if (quality.score < 70) {
            suggestions.shortTerm.push({
                priority: 'high',
                category: '代码质量',
                action: '提升代码质量',
                details: quality.recommendations,
                impact: '提高代码可维护性和团队开发效率'
            });
        }
        
        // 长期架构建议
        if (architecture.architecturalPattern === '过程式编程' && businessLogic.keyFunctions.length > 10) {
            suggestions.longTerm.push({
                priority: 'medium',
                category: '架构重构',
                action: '向面向对象架构迁移',
                details: ['创建业务逻辑类', '实现单一责任原则', '提高代码复用性'],
                impact: '提升系统的可扩展性和可维护性'
            });
        }
        
        // 业务逻辑优化
        if (businessLogic.businessRules.length > 5 && !content.includes('class ')) {
            suggestions.business.push({
                priority: 'medium',
                category: '业务逻辑',
                action: '业务规则集中管理',
                details: ['创建业务规则类', '实现配置化管理', '提高业务逻辑的可测试性'],
                impact: '降低业务逻辑维护成本，提高系统灵活性'
            });
        }
        
        return suggestions;
    }

    // 辅助方法实现
    extractFunctionContext(content, functionName) {
        const lines = content.split('\n');
        for (let i = 0; i < lines.length; i++) {
            if (lines[i].includes(`function ${functionName}`) || lines[i].includes(`${functionName}(`)) {
                return lines.slice(i, i + 10).join('\n');
            }
        }
        return '';
    }

    inferFunctionPurpose(functionName, context) {
        const purposeMap = {
            'get': '数据获取',
            'set': '数据设置',
            'save': '数据保存',
            'delete': '数据删除',
            'update': '数据更新',
            'validate': '数据验证',
            'sanitize': '数据清理',
            'render': '页面渲染',
            'handle': '事件处理',
            'process': '业务处理'
        };
        
        for (const [keyword, purpose] of Object.entries(purposeMap)) {
            if (functionName.toLowerCase().includes(keyword)) {
                return purpose;
            }
        }
        
        return '业务逻辑处理';
    }

    inferBusinessRole(functionName, context) {
        if (context.includes('database') || context.includes('query')) {
            return '数据访问层';
        } else if (context.includes('validate') || context.includes('sanitize')) {
            return '数据验证层';
        } else if (context.includes('render') || context.includes('display')) {
            return '表现层';
        } else {
            return '业务逻辑层';
        }
    }

    isCommentLine(line, extension) {
        const trimmed = line.trim();
        if (extension === '.php') {
            return trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('*') || trimmed.startsWith('#');
        } else if (extension === '.js' || extension === '.jsx') {
            return trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('*');
        }
        return false;
    }

    calculateAdvancedComplexity(content) {
        const complexityKeywords = [
            { pattern: '\\bif\\b', name: 'if' },
            { pattern: '\\belse\\b', name: 'else' },
            { pattern: '\\bfor\\b', name: 'for' },
            { pattern: '\\bwhile\\b', name: 'while' },
            { pattern: '\\bswitch\\b', name: 'switch' },
            { pattern: '\\bcase\\b', name: 'case' },
            { pattern: '\\bcatch\\b', name: 'catch' },
            { pattern: '&&', name: '&&' },
            { pattern: '\\|\\|', name: '||' },
            { pattern: '\\?', name: '?' }
        ];
        let complexity = 1;
        
        complexityKeywords.forEach(item => {
            try {
                const matches = content.match(new RegExp(item.pattern, 'g'));
                if (matches) {
                    complexity += matches.length;
                }
            } catch (e) {
                // 忽略正则表达式错误
            }
        });
        
        return complexity;
    }

    calculateMaintainabilityIndex(content, codeLines = null) {
        if (!codeLines) {
            codeLines = content.split('\n').filter(line => line.trim()).length;
        }
        
        const complexity = this.calculateAdvancedComplexity(content);
        const commentRatio = (content.match(/\/\/|\/\*|\*|#/g) || []).length / codeLines;
        
        // 简化的可维护性指数计算
        let maintainabilityIndex = 100;
        maintainabilityIndex -= Math.log(codeLines) * 5;
        maintainabilityIndex -= complexity * 2;
        maintainabilityIndex += commentRatio * 20;
        
        return Math.max(0, Math.min(100, maintainabilityIndex));
    }

    assessTechnicalDebt(content, extension) {
        let debtScore = 0;
        
        // 代码异味检测
        if (content.includes('TODO') || content.includes('FIXME') || content.includes('HACK')) {
            debtScore += 2;
        }
        
        // 重复代码检测
        const lines = content.split('\n');
        const duplicateLines = lines.length - new Set(lines).size;
        if (duplicateLines > lines.length * 0.1) {
            debtScore += 3;
        }
        
        // 长函数检测
        const functions = content.match(/function\s+\w+.*?(?=function|\Z)/gs) || [];
        const longFunctions = functions.filter(func => func.split('\n').length > 50);
        debtScore += longFunctions.length;
        
        return Math.min(10, debtScore);
    }

    assessReadability(content, extension) {
        let readabilityScore = 100;
        
        const lines = content.split('\n');
        const avgLineLength = lines.reduce((sum, line) => sum + line.length, 0) / lines.length;
        
        if (avgLineLength > 100) readabilityScore -= 20;
        if (avgLineLength > 120) readabilityScore -= 10;
        
        // 命名质量评估
        const variableNames = content.match(/\$\w+|\bvar\s+\w+|\blet\s+\w+|\bconst\s+\w+/g) || [];
        const shortNames = variableNames.filter(name => name.length < 4);
        if (shortNames.length > variableNames.length * 0.5) {
            readabilityScore -= 15;
        }
        
        return Math.max(0, readabilityScore);
    }

    assessTestIndicators(content) {
        const testKeywords = ['test', 'spec', 'assert', 'expect', 'mock', 'stub'];
        const hasTests = testKeywords.some(keyword => content.toLowerCase().includes(keyword));
        return hasTests ? 80 : 20;
    }

    generateQualityRecommendations(metrics) {
        const recommendations = [];
        
        if (metrics.commentRatio < 0.15) {
            recommendations.push('增加代码注释，提高代码可读性');
        }
        
        if (metrics.codeComplexity > 30) {
            recommendations.push('降低代码复杂度，考虑函数拆分');
        }
        
        if (metrics.maintainabilityIndex < 60) {
            recommendations.push('重构代码以提高可维护性');
        }
        
        if (metrics.technicalDebt > 5) {
            recommendations.push('处理技术债务，清理代码异味');
        }
        
        return recommendations;
    }

    calculateSecurityScore(vulnerabilities, warnings, strengths) {
        let score = 100;
        
        vulnerabilities.forEach(vuln => {
            if (vuln.severity === 'critical') score -= 30;
            else if (vuln.severity === 'high') score -= 20;
            else score -= 10;
        });
        
        warnings.forEach(() => score -= 5);
        strengths.forEach(() => score += 10);
        
        return Math.max(0, Math.min(100, score));
    }

    calculateCyclomaticComplexity(content) {
        const keywords = [
            { pattern: '\\bif\\b', name: 'if' },
            { pattern: '\\belse\\b', name: 'else' },
            { pattern: '\\belseif\\b', name: 'elseif' },
            { pattern: '\\bfor\\b', name: 'for' },
            { pattern: '\\bforeach\\b', name: 'foreach' },
            { pattern: '\\bwhile\\b', name: 'while' },
            { pattern: '\\bdo\\b', name: 'do' },
            { pattern: '\\bswitch\\b', name: 'switch' },
            { pattern: '\\bcase\\b', name: 'case' },
            { pattern: '\\bcatch\\b', name: 'catch' },
            { pattern: '&&', name: '&&' },
            { pattern: '\\|\\|', name: '||' }
        ];
        let complexity = 1;
        
        keywords.forEach(item => {
            try {
                const regex = new RegExp(item.pattern, 'g');
                const matches = content.match(regex);
                if (matches) complexity += matches.length;
            } catch (e) {
                // 忽略正则表达式错误
            }
        });
        
        return complexity;
    }

    calculateCognitiveComplexity(content) {
        // 认知复杂度的简化计算
        let complexity = 0;
        const lines = content.split('\n');
        let nestingLevel = 0;
        
        lines.forEach(line => {
            const trimmed = line.trim();
            
            if (trimmed.includes('if') || trimmed.includes('for') || trimmed.includes('while')) {
                complexity += (1 + nestingLevel);
                if (trimmed.includes('{')) nestingLevel++;
            }
            
            if (trimmed.includes('}')) {
                nestingLevel = Math.max(0, nestingLevel - 1);
            }
        });
        
        return complexity;
    }

    assessCoupling(content, extension) {
        // 耦合度评估
        const externalReferences = (content.match(/require|include|import|wp_/g) || []).length;
        if (externalReferences > 10) return 'high';
        if (externalReferences > 5) return 'medium';
        return 'low';
    }

    assessCohesion(content, extension) {
        // 内聚性评估
        const functions = (content.match(/function\s+\w+/g) || []).length;
        const classes = (content.match(/class\s+\w+/g) || []).length;
        
        if (classes > 0 && functions / classes < 10) return 'high';
        if (classes > 0 && functions / classes < 20) return 'medium';
        return 'low';
    }

    determineOverallComplexity(metrics) {
        if (metrics.cyclomaticComplexity > 50 || metrics.cognitiveComplexity > 30) return 'very_high';
        if (metrics.cyclomaticComplexity > 20 || metrics.cognitiveComplexity > 15) return 'high';
        if (metrics.cyclomaticComplexity > 10 || metrics.cognitiveComplexity > 10) return 'medium';
        return 'low';
    }

    determineMaintainabilityLevel(metrics) {
        if (metrics.maintainabilityIndex > 80) return 'excellent';
        if (metrics.maintainabilityIndex > 60) return 'good';
        if (metrics.maintainabilityIndex > 40) return 'fair';
        return 'poor';
    }

    determineRefactoringPriority(metrics) {
        if (metrics.cyclomaticComplexity > 30 && metrics.maintainabilityIndex < 50) return 'urgent';
        if (metrics.cyclomaticComplexity > 20 || metrics.maintainabilityIndex < 60) return 'high';
        if (metrics.cyclomaticComplexity > 10 || metrics.maintainabilityIndex < 70) return 'medium';
        return 'low';
    }

    generateComplexityRecommendations(metrics) {
        const recommendations = [];
        
        if (metrics.cyclomaticComplexity > 20) {
            recommendations.push('将复杂函数分解为更小的函数');
        }
        
        if (metrics.couplingLevel === 'high') {
            recommendations.push('减少外部依赖，提高模块独立性');
        }
        
        if (metrics.cohesionLevel === 'low') {
            recommendations.push('提高类和模块的内聚性');
        }
        
        return recommendations;
    }

    analyzeChangeImpact(dependencies) {
        const impact = {
            level: 'low',
            affectedSystems: [],
            recommendations: []
        };
        
        if (dependencies.frameworks.length > 0) {
            impact.level = 'high';
            impact.affectedSystems.push('框架依赖系统');
            impact.recommendations.push('谨慎修改，确保向后兼容性');
        }
        
        if (dependencies.external.some(dep => dep.critical)) {
            impact.level = 'critical';
            impact.affectedSystems.push('核心业务系统');
            impact.recommendations.push('需要全面测试和回滚计划');
        }
        
        return impact;
    }

    assessDependencyRisks(dependencies) {
        const risks = [];
        
        if (dependencies.external.length > 5) {
            risks.push({
                type: '依赖过多',
                level: 'medium',
                description: '外部依赖较多可能影响系统稳定性'
            });
        }
        
        return risks;
    }

    calculatePerformanceScore(issues) {
        let score = 100;
        
        issues.forEach(issue => {
            if (issue.impact === 'critical') score -= 30;
            else if (issue.impact === 'high') score -= 20;
            else score -= 10;
        });
        
        return Math.max(0, score);
    }

    generatePerformanceRecommendations(issues, optimizations) {
        const recommendations = [];
        
        if (issues.some(issue => issue.type.includes('数据库'))) {
            recommendations.push('优化数据库查询，使用索引和缓存');
        }
        
        if (issues.some(issue => issue.type.includes('循环'))) {
            recommendations.push('优化算法复杂度，减少不必要的循环');
        }
        
        optimizations.forEach(opt => {
            recommendations.push(opt.suggestion);
        });
        
        return recommendations;
    }

    /**
     * 保存文件分析报告到AI助手文档目录
     */
    async saveIntelligentFileAnalysisReport(analysisResult) {
        try {
            const fileName = analysisResult.fileInfo.name;
            const baseName = path.basename(fileName, path.extname(fileName));
            const reportFileName = `智能文件分析报告-${baseName}-${Date.now()}.md`;
            const reportPath = path.join(this.docsDir, reportFileName);
            
            const report = this.generateIntelligentAnalysisMarkdown(analysisResult);
            
            // 确保目录存在
            this.ensureDirectories();
            
            // 写入报告文件
            fs.writeFileSync(reportPath, report, 'utf8');
            
            console.log(`📄 智能分析报告已保存: ${reportFileName}`);
            
            return reportPath;
            
        } catch (error) {
            throw new Error(`保存分析报告失败: ${error.message}`);
        }
    }

    /**
     * 生成智能文件分析的详细Markdown报告
     */
    generateIntelligentAnalysisMarkdown(analysisResult) {
        const { 
            fileInfo, 
            intelligentType, 
            businessLogic, 
            architecture, 
            quality, 
            security, 
            complexity, 
            dependencies, 
            performance, 
            improvements, 
            timestamp 
        } = analysisResult;
        
        const lines = [];
        
        // 文档头部
        lines.push(`# 🤖 AI智能文件分析报告`);
        lines.push(`## 📄 ${fileInfo.name}`);
        lines.push('');
        lines.push(`**分析时间**: ${new Date(timestamp).toLocaleString('zh-CN')}`);
        lines.push(`**文件路径**: \`${fileInfo.path}\``);
        lines.push(`**AI智能识别**: ${intelligentType.specificPurpose || intelligentType.primaryType}`);
        lines.push('');
        
        // 执行摘要
        lines.push('## 📋 执行摘要');
        lines.push('');
        lines.push(`**文件用途**: ${businessLogic.mainPurpose || '业务逻辑处理文件'}`);
        lines.push(`**业务价值**: ${businessLogic.businessValue || '为系统提供核心功能支持'}`);
        lines.push(`**技术分类**: ${intelligentType.technicalClassification}`);
        lines.push(`**架构模式**: ${architecture.architecturalPattern}`);
        lines.push(`**质量评分**: ${quality.score}/100 (${this.getQualityLevelChinese(quality.level)})`);
        lines.push(`**安全评分**: ${security.securityScore}/100 (${this.getSecurityLevelChinese(security.riskLevel)})`);
        lines.push('');
        
        // 文件基本信息
        lines.push('## 📊 文件信息概览');
        lines.push('');
        lines.push('| 属性 | 值 | 说明 |');
        lines.push('|------|-----|------|');
        lines.push(`| 文件名 | ${fileInfo.name} | 当前分析的文件 |`);
        lines.push(`| 文件大小 | ${(fileInfo.size / 1024).toFixed(2)} KB | 文件物理大小 |`);
        lines.push(`| 代码行数 | ${fileInfo.lines} 行 | 包含所有行数 |`);
        lines.push(`| 最后修改 | ${fileInfo.lastModified.toLocaleString('zh-CN')} | 文件修改时间 |`);
        lines.push(`| 技术栈 | ${intelligentType.primaryType} | 使用的技术 |`);
        lines.push('');
        
        // 业务逻辑深度分析
        if (businessLogic.mainPurpose) {
            lines.push('## 🎯 业务逻辑深度分析');
            lines.push('');
            lines.push(`**核心目的**: ${businessLogic.mainPurpose}`);
            lines.push('');
            
            if (businessLogic.keyFunctions.length > 0) {
                lines.push('### 🔧 核心功能分析');
                lines.push('');
                lines.push('| 函数名 | 业务用途 | 技术角色 |');
                lines.push('|--------|----------|----------|');
                businessLogic.keyFunctions.forEach(func => {
                    lines.push(`| \`${func.name}\` | ${func.purpose} | ${func.businessRole} |`);
                });
                lines.push('');
            }
            
            if (businessLogic.businessRules.length > 0) {
                lines.push('### 📋 业务规则识别');
                lines.push('');
                businessLogic.businessRules.forEach((rule, index) => {
                    lines.push(`${index + 1}. **${rule}**`);
                });
                lines.push('');
            }
            
            if (businessLogic.dataFlow) {
                lines.push('### 🔄 数据流分析');
                lines.push('');
                lines.push(`**数据流向**: ${businessLogic.dataFlow}`);
                lines.push('');
            }
            
            if (businessLogic.userInteractions.length > 0) {
                lines.push('### 👤 用户交互模式');
                lines.push('');
                businessLogic.userInteractions.forEach((interaction, index) => {
                    lines.push(`- ${interaction}`);
                });
                lines.push('');
            }
            
            if (businessLogic.integrations.length > 0) {
                lines.push('### 🔗 系统集成分析');
                lines.push('');
                businessLogic.integrations.forEach(integration => {
                    lines.push(`- **${integration}**: 与外部系统的集成点`);
                });
                lines.push('');
            }
        }
        
        // 架构设计分析
        lines.push('## 🏗️ 架构设计分析');
        lines.push('');
        lines.push(`**架构模式**: ${architecture.architecturalPattern}`);
        lines.push(`**代码组织**: ${architecture.codeOrganization}`);
        lines.push('');
        
        if (architecture.designPatterns.length > 0) {
            lines.push('### 🎨 设计模式识别');
            lines.push('');
            architecture.designPatterns.forEach(pattern => {
                lines.push(`- **${pattern}**: 提升代码结构和可维护性`);
            });
            lines.push('');
        }
        
        if (architecture.scalabilityFactors.length > 0) {
            lines.push('### 📈 可扩展性因素');
            lines.push('');
            architecture.scalabilityFactors.forEach(factor => {
                lines.push(`- ${factor}`);
            });
            lines.push('');
        }
        
        // 代码质量深度分析
        lines.push('## 📊 代码质量深度分析');
        lines.push('');
        lines.push(`**综合评分**: ${quality.score}/100 (${this.getQualityLevelChinese(quality.level)})`);
        lines.push('');
        
        lines.push('### 📈 质量指标详解');
        lines.push('');
        lines.push('| 指标 | 数值 | 评估 | 影响 |');
        lines.push('|------|------|------|------|');
        lines.push(`| 总行数 | ${quality.metrics.totalLines} | ${quality.metrics.totalLines > 500 ? '文件较大' : '合理大小'} | 维护难度 |`);
        lines.push(`| 代码行数 | ${quality.metrics.codeLines} | ${quality.metrics.codeLines > 300 ? '逻辑复杂' : '逻辑适中'} | 理解难度 |`);
        lines.push(`| 注释覆盖率 | ${(quality.metrics.commentRatio * 100).toFixed(1)}% | ${quality.metrics.commentRatio > 0.2 ? '注释充足' : '注释不足'} | 可读性 |`);
        lines.push(`| 可维护性指数 | ${quality.metrics.maintainabilityIndex.toFixed(1)} | ${quality.metrics.maintainabilityIndex > 70 ? '易维护' : '难维护'} | 开发效率 |`);
        lines.push(`| 技术债务等级 | ${quality.metrics.technicalDebt}/10 | ${quality.metrics.technicalDebt < 3 ? '债务较少' : '需要重构'} | 长期成本 |`);
        lines.push(`| 可读性评分 | ${quality.metrics.readabilityScore} | ${quality.metrics.readabilityScore > 80 ? '易读' : '难读'} | 团队协作 |`);
        lines.push('');
        
        if (quality.recommendations.length > 0) {
            lines.push('### 💡 质量改进建议');
            lines.push('');
            quality.recommendations.forEach((rec, index) => {
                lines.push(`${index + 1}. ${rec}`);
            });
            lines.push('');
        }
        
        // 安全性专业分析
        lines.push('## 🛡️ 安全性专业分析');
        lines.push('');
        lines.push(`**安全评分**: ${security.securityScore}/100`);
        lines.push(`**风险级别**: ${this.getSecurityLevelChinese(security.riskLevel)}`);
        lines.push(`**问题总数**: ${security.totalIssues} 个`);
        lines.push('');
        
        if (security.vulnerabilities.length > 0) {
            lines.push('### 🚨 严重安全漏洞');
            lines.push('');
            security.vulnerabilities.forEach((vuln, index) => {
                lines.push(`#### ${index + 1}. ${vuln.type} (${vuln.severity.toUpperCase()})`);
                lines.push(`**问题描述**: ${vuln.description}`);
                lines.push(`**修复建议**: ${vuln.recommendation}`);
                lines.push('');
            });
        }
        
        if (security.warnings.length > 0) {
            lines.push('### ⚠️ 安全警告');
            lines.push('');
            security.warnings.forEach((warning, index) => {
                lines.push(`#### ${index + 1}. ${warning.type}`);
                lines.push(`**风险描述**: ${warning.description}`);
                lines.push(`**建议措施**: ${warning.recommendation}`);
                lines.push('');
            });
        }
        
        if (security.strengths.length > 0) {
            lines.push('### ✅ 安全优势');
            lines.push('');
            security.strengths.forEach(strength => {
                lines.push(`- ${strength}`);
            });
            lines.push('');
        }
        
        // 复杂度和可维护性分析
        lines.push('## 🔍 复杂度和可维护性分析');
        lines.push('');
        lines.push(`**整体复杂度**: ${complexity.overallComplexity}`);
        lines.push(`**可维护性等级**: ${complexity.maintainabilityLevel}`);
        lines.push(`**重构优先级**: ${complexity.refactoringPriority}`);
        lines.push('');
        
        lines.push('### 📊 复杂度指标');
        lines.push('');
        lines.push('| 指标 | 数值 | 等级 | 说明 |');
        lines.push('|------|------|------|------|');
        lines.push(`| 圈复杂度 | ${complexity.cyclomaticComplexity} | ${complexity.cyclomaticComplexity < 10 ? '简单' : complexity.cyclomaticComplexity < 20 ? '中等' : '复杂'} | 代码逻辑复杂程度 |`);
        lines.push(`| 认知复杂度 | ${complexity.cognitiveComplexity} | ${complexity.cognitiveComplexity < 15 ? '易理解' : '难理解'} | 人类理解难度 |`);
        lines.push(`| 耦合程度 | ${complexity.couplingLevel} | ${complexity.couplingLevel} | 模块间依赖关系 |`);
        lines.push(`| 内聚程度 | ${complexity.cohesionLevel} | ${complexity.cohesionLevel} | 模块内功能相关性 |`);
        lines.push('');
        
        if (complexity.recommendations.length > 0) {
            lines.push('### 🔧 复杂度优化建议');
            lines.push('');
            complexity.recommendations.forEach((rec, index) => {
                lines.push(`${index + 1}. ${rec}`);
            });
            lines.push('');
        }
        
        // 依赖关系和影响分析
        if (dependencies) {
            lines.push('## 🔗 依赖关系和影响分析');
            lines.push('');
            
            if (dependencies.dependencies.frameworks.length > 0) {
                lines.push('### 🏗️ 框架依赖');
                lines.push('');
                dependencies.dependencies.frameworks.forEach(framework => {
                    lines.push(`**${framework.name}** (依赖级别: ${framework.dependencyLevel})`);
                    if (framework.functions) {
                        lines.push(`- 使用的函数: ${framework.functions.slice(0, 10).join(', ')}${framework.functions.length > 10 ? '...' : ''}`);
                    }
                    lines.push('');
                });
            }
            
            if (dependencies.dependencies.external.length > 0) {
                lines.push('### 🌐 外部依赖');
                lines.push('');
                dependencies.dependencies.external.forEach(dep => {
                    lines.push(`- **${dep.name}** (${dep.type})${dep.critical ? ' - 关键依赖' : ''}`);
                });
                lines.push('');
            }
            
            if (dependencies.impactAnalysis) {
                lines.push('### 📊 变更影响分析');
                lines.push('');
                lines.push(`**影响级别**: ${dependencies.impactAnalysis.level}`);
                if (dependencies.impactAnalysis.affectedSystems.length > 0) {
                    lines.push('**受影响系统**:');
                    dependencies.impactAnalysis.affectedSystems.forEach(system => {
                        lines.push(`- ${system}`);
                    });
                }
                lines.push('');
            }
        }
        
        // 性能分析
        if (performance) {
            lines.push('## ⚡ 性能分析');
            lines.push('');
            lines.push(`**性能评分**: ${performance.performanceScore}/100`);
            lines.push('');
            
            if (performance.issues.length > 0) {
                lines.push('### 🚨 性能问题');
                lines.push('');
                performance.issues.forEach((issue, index) => {
                    lines.push(`#### ${index + 1}. ${issue.type} (${issue.impact.toUpperCase()})`);
                    lines.push(`**问题描述**: ${issue.description}`);
                    lines.push(`**解决方案**: ${issue.solution}`);
                    lines.push('');
                });
            }
            
            if (performance.optimizations.length > 0) {
                lines.push('### 🔧 性能优化建议');
                lines.push('');
                performance.optimizations.forEach((opt, index) => {
                    lines.push(`${index + 1}. **${opt.type}**: ${opt.description}`);
                    lines.push(`   - 建议: ${opt.suggestion}`);
                    lines.push('');
                });
            }
        }
        
        // AI智能改进建议
        if (improvements) {
            lines.push('## 🚀 AI智能改进建议');
            lines.push('');
            
            if (improvements.immediate.length > 0) {
                lines.push('### 🔴 立即处理 (CRITICAL)');
                lines.push('');
                improvements.immediate.forEach((item, index) => {
                    lines.push(`#### ${index + 1}. ${item.action} (${item.category})`);
                    lines.push(`**优先级**: ${item.priority.toUpperCase()}`);
                    lines.push(`**业务影响**: ${item.impact}`);
                    lines.push('**具体措施**:');
                    item.details.forEach(detail => {
                        lines.push(`- ${detail}`);
                    });
                    lines.push('');
                });
            }
            
            if (improvements.shortTerm.length > 0) {
                lines.push('### 🟡 短期改进 (1-2周内)');
                lines.push('');
                improvements.shortTerm.forEach((item, index) => {
                    lines.push(`#### ${index + 1}. ${item.action} (${item.category})`);
                    lines.push(`**业务影响**: ${item.impact}`);
                    lines.push('**改进措施**:');
                    item.details.forEach(detail => {
                        lines.push(`- ${detail}`);
                    });
                    lines.push('');
                });
            }
            
            if (improvements.longTerm.length > 0) {
                lines.push('### 🟢 长期规划 (1个月以上)');
                lines.push('');
                improvements.longTerm.forEach((item, index) => {
                    lines.push(`#### ${index + 1}. ${item.action} (${item.category})`);
                    lines.push(`**战略价值**: ${item.impact}`);
                    lines.push('**实施路径**:');
                    item.details.forEach(detail => {
                        lines.push(`- ${detail}`);
                    });
                    lines.push('');
                });
            }
            
            if (improvements.business.length > 0) {
                lines.push('### 💼 业务优化建议');
                lines.push('');
                improvements.business.forEach((item, index) => {
                    lines.push(`#### ${index + 1}. ${item.action}`);
                    lines.push(`**业务价值**: ${item.impact}`);
                    lines.push('**优化方向**:');
                    item.details.forEach(detail => {
                        lines.push(`- ${detail}`);
                    });
                    lines.push('');
                });
            }
        }
        
        // 总结和行动计划
        lines.push('## 📝 总结和行动计划');
        lines.push('');
        lines.push('### 🎯 核心发现');
        lines.push('');
        lines.push(`1. **业务价值**: ${businessLogic.businessValue || '该文件在系统中发挥重要作用'}`);
        lines.push(`2. **技术特征**: ${intelligentType.technicalClassification}`);
        lines.push(`3. **质量状况**: ${quality.level} (${quality.score}/100分)`);
        lines.push(`4. **安全状况**: ${security.riskLevel} (${security.securityScore}/100分)`);
        lines.push(`5. **维护难度**: ${complexity.maintainabilityLevel}`);
        lines.push('');
        
        lines.push('### 📋 优先行动清单');
        lines.push('');
        let actionCount = 1;
        
        if (security.vulnerabilities.length > 0) {
            lines.push(`${actionCount++}. **立即修复安全漏洞** - 防止安全事故`);
        }
        
        if (quality.score < 70) {
            lines.push(`${actionCount++}. **提升代码质量** - 改善维护性和可读性`);
        }
        
        if (complexity.refactoringPriority === 'urgent' || complexity.refactoringPriority === 'high') {
            lines.push(`${actionCount++}. **重构复杂代码** - 降低维护成本`);
        }
        
        if (performance && performance.issues.length > 0) {
            lines.push(`${actionCount++}. **优化性能问题** - 提升用户体验`);
        }
        
        lines.push('');
        
        // 结尾
        lines.push('---');
        lines.push('');
        lines.push('**📊 分析统计**');
        lines.push(`- 分析引擎: AI开发辅助系统 v1.2.0`);
        lines.push(`- 分析时间: ${new Date().toLocaleString('zh-CN')}`);
        lines.push(`- 分析深度: 业务逻辑 + 技术架构 + 安全性 + 性能`);
        lines.push(`- 报告类型: 智能综合分析报告`);
        lines.push('');
        lines.push('*此报告由AI智能分析引擎生成，基于文件的实际内容和业务逻辑进行深度分析*');
        
        return lines.join('\n');
    }

    /**
     * 获取安全级别的中文描述
     */
    getSecurityLevelChinese(level) {
        const levels = {
            'very low': '极低风险',
            'low': '低风险',
            'medium': '中等风险',
            'high': '高风险',
            'critical': '严重风险'
        };
        return levels[level] || level;
    }

    /**
     * 获取质量级别的中文描述
     */
    getQualityLevelChinese(level) {
        const levels = {
            'excellent': '优秀',
            'good': '良好',
            'fair': '一般',
            'poor': '较差',
            'very poor': '很差'
        };
        return levels[level] || level;
    }
}

module.exports = AIDevAssistant;
