/**
 * AI开发辅助系统 - 智能项目分析器
 * AI Development Assistant - Intelligent Project Analyzer
 * Version: 1.0.3
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

class IntelligentProjectAnalyzer {
    constructor(projectPath = '.') {
        this.projectPath = path.resolve(projectPath);
        this.analysis = {
            metadata: {
                name: path.basename(this.projectPath),
                path: this.projectPath,
                analyzedAt: new Date().toISOString(),
                version: '1.0.2'
            },
            project: {
                type: 'unknown',
                language: 'unknown',
                framework: [],
                buildTool: 'unknown',
                packageManager: 'unknown'
            },
            structure: {
                directories: {},
                files: {},
                patterns: []
            },
            dependencies: {
                production: [],
                development: [],
                security: [],
                outdated: []
            },
            codeMetrics: {
                totalFiles: 0,
                totalLines: 0,
                complexity: 'unknown',
                testCoverage: 0,
                duplicateCode: 0
            },
            quality: {
                score: 0,
                issues: [],
                suggestions: []
            },
            security: {
                vulnerabilities: [],
                risks: [],
                recommendations: []
            },
            aiContext: {
                focusAreas: [],
                developmentPhase: 'unknown',
                technicalDebt: 'low',
                priority: []
            }
        };
    }

    /**
     * 执行完整的项目分析
     */
    async analyze() {
        console.log('🔍 开始智能项目分析...');
        
        try {
            await this.detectProjectType();
            await this.analyzeStructure();
            await this.analyzeDependencies();
            await this.calculateMetrics();
            await this.assessQuality();
            await this.securityAudit();
            await this.generateAIContext();
            
            // 新增：深度业务逻辑分析
            await this.analyzeBusinessLogic();
            await this.analyzeDataFlow();
            await this.analyzeArchitecturePatterns();
            await this.extractKeyComponents();
            
            console.log('✅ 项目分析完成');
            return this.analysis;
        } catch (error) {
            console.error('❌ 分析过程中发生错误:', error.message);
            throw error;
        }
    }

    /**
     * 深度分析业务逻辑
     */
    async analyzeBusinessLogic() {
        console.log('🧠 分析业务逻辑...');
        
        const businessLogic = {
            coreFeatures: [],
            userWorkflows: [],
            businessRules: [],
            dataModels: [],
            apiEndpoints: [],
            userRoles: [],
            businessProcesses: []
        };

        // 分析WordPress特有的业务逻辑
        if (this.analysis.project.type === 'wordpress') {
            businessLogic.coreFeatures = await this.analyzeWordPressFeatures();
            businessLogic.userWorkflows = await this.analyzeWordPressWorkflows();
            businessLogic.businessRules = await this.analyzeWordPressBusinessRules();
            businessLogic.userRoles = await this.analyzeWordPressRoles();
        }
        
        // 分析Laravel业务逻辑
        else if (this.analysis.project.type === 'laravel') {
            businessLogic.coreFeatures = await this.analyzeLaravelFeatures();
            businessLogic.apiEndpoints = await this.analyzeLaravelRoutes();
            businessLogic.dataModels = await this.analyzeLaravelModels();
        }
        
        // 分析Node.js业务逻辑
        else if (this.analysis.project.type === 'node') {
            businessLogic.apiEndpoints = await this.analyzeNodeEndpoints();
            businessLogic.businessProcesses = await this.analyzeNodeBusinessProcesses();
        }

        this.analysis.businessLogic = businessLogic;
    }

    /**
     * 分析WordPress核心功能
     */
    async analyzeWordPressFeatures() {
        const features = [];
        const functionsFiles = [];
        
        // 扫描functions.php文件
        this.walkDirectory(this.projectPath, (filePath) => {
            if (path.basename(filePath) === 'functions.php' || filePath.includes('functions.php')) {
                functionsFiles.push(filePath);
            }
        });

        for (const file of functionsFiles) {
            try {
                const content = fs.readFileSync(file, 'utf8');
                
                // 分析主题支持
                const themeSupports = content.match(/add_theme_support\(\s*['"](.*?)['"]/g);
                if (themeSupports) {
                    themeSupports.forEach(support => {
                        const match = support.match(/add_theme_support\(\s*['"](.*?)['"]/);
                        if (match) {
                            features.push({
                                type: 'theme_support',
                                name: match[1],
                                description: this.getThemeSupportDescription(match[1]),
                                file: path.relative(this.projectPath, file)
                            });
                        }
                    });
                }

                // 分析自定义文章类型
                const postTypes = content.match(/register_post_type\(\s*['"](.*?)['"],/g);
                if (postTypes) {
                    postTypes.forEach(postType => {
                        const match = postType.match(/register_post_type\(\s*['"](.*?)['"],/);
                        if (match) {
                            features.push({
                                type: 'custom_post_type',
                                name: match[1],
                                description: `自定义文章类型：${match[1]}，用于管理特定类型的内容`,
                                file: path.relative(this.projectPath, file)
                            });
                        }
                    });
                }

                // 分析自定义字段
                const metaBoxes = content.match(/add_meta_box\(/g);
                if (metaBoxes) {
                    features.push({
                        type: 'meta_boxes',
                        name: 'custom_fields',
                        description: `包含${metaBoxes.length}个自定义字段，用于扩展内容编辑功能`,
                        file: path.relative(this.projectPath, file)
                    });
                }

                // 分析AJAX功能
                const ajaxActions = content.match(/wp_ajax_\w+/g);
                if (ajaxActions) {
                    const uniqueActions = [...new Set(ajaxActions)];
                    features.push({
                        type: 'ajax_functionality',
                        name: 'ajax_handlers',
                        description: `包含${uniqueActions.length}个AJAX处理器，提供动态交互功能`,
                        actions: uniqueActions,
                        file: path.relative(this.projectPath, file)
                    });
                }

                // 分析短代码
                const shortcodes = content.match(/add_shortcode\(\s*['"](.*?)['"],/g);
                if (shortcodes) {
                    shortcodes.forEach(shortcode => {
                        const match = shortcode.match(/add_shortcode\(\s*['"](.*?)['"],/);
                        if (match) {
                            features.push({
                                type: 'shortcode',
                                name: match[1],
                                description: `短代码 [${match[1]}]，可在内容中插入动态功能`,
                                file: path.relative(this.projectPath, file)
                            });
                        }
                    });
                }

            } catch (error) {
                console.warn(`无法分析文件 ${file}:`, error.message);
            }
        }

        return features;
    }

    /**
     * 获取主题支持功能描述
     */
    getThemeSupportDescription(support) {
        const descriptions = {
            'post-thumbnails': '特色图片支持，允许为文章设置缩略图',
            'custom-logo': '自定义Logo支持，允许用户上传网站Logo',
            'title-tag': '动态标题标签支持，SEO优化',
            'html5': 'HTML5标记支持，现代化的HTML结构',
            'custom-background': '自定义背景支持，允许用户设置背景图片',
            'custom-header': '自定义头部支持，允许用户设置头部图片',
            'post-formats': '文章格式支持，支持不同类型的文章展示',
            'customize-selective-refresh-widgets': '小工具选择性刷新，提升定制器体验',
            'editor-styles': '编辑器样式支持，后台编辑器样式与前台一致',
            'responsive-embeds': '响应式嵌入支持，自适应视频等媒体内容',
            'wp-block-styles': '区块样式支持，Gutenberg编辑器样式',
            'align-wide': '宽对齐支持，允许内容宽屏显示'
        };
        return descriptions[support] || `主题支持功能：${support}`;
    }

    /**
     * 分析WordPress用户工作流
     */
    async analyzeWordPressWorkflows() {
        const workflows = [];
        
        // 分析管理员工作流
        workflows.push({
            role: 'administrator',
            name: '内容管理工作流',
            description: '管理员可以创建、编辑、发布文章，管理用户权限，配置网站设置',
            steps: [
                '登录WordPress后台',
                '创建或编辑文章/页面',
                '设置特色图片和SEO信息',
                '发布内容',
                '管理评论和用户'
            ]
        });

        // 分析编辑者工作流
        workflows.push({
            role: 'editor',
            name: '内容编辑工作流',
            description: '编辑者专注于内容的创建和编辑，确保内容质量',
            steps: [
                '登录编辑界面',
                '使用Gutenberg编辑器创建内容',
                '添加媒体文件和格式化文本',
                '预览和提交审核',
                '发布经过审核的内容'
            ]
        });

        return workflows;
    }

    /**
     * 分析WordPress业务规则
     */
    async analyzeWordPressBusinessRules() {
        const rules = [];

        // 用户权限规则
        rules.push({
            category: 'user_permissions',
            name: '用户权限管理',
            description: 'WordPress基于角色的权限系统，不同角色具有不同的操作权限',
            details: [
                '管理员：拥有所有权限，可以管理用户、插件、主题',
                '编辑者：可以发布和管理所有文章',
                '作者：只能发布和管理自己的文章',
                '贡献者：可以写文章但需要审核才能发布',
                '订阅者：只能管理自己的用户资料'
            ]
        });

        // 内容发布规则
        rules.push({
            category: 'content_publishing',
            name: '内容发布流程',
            description: '内容从创建到发布的完整流程和规则',
            details: [
                '草稿状态：内容正在编辑中，不对外显示',
                '待审核：内容完成编写，等待编辑者审核',
                '已发布：内容通过审核，对外公开显示',
                '私有：内容仅对管理员和编辑者可见',
                '密码保护：需要密码才能查看的内容'
            ]
        });

        return rules;
    }

    /**
     * 分析WordPress用户角色
     */
    async analyzeWordPressRoles() {
        return [
            {
                role: 'administrator',
                name: '管理员',
                description: '拥有最高权限，可以管理整个网站',
                capabilities: ['manage_options', 'edit_users', 'install_plugins', 'edit_themes']
            },
            {
                role: 'editor',
                name: '编辑者',
                description: '管理网站内容，审核和发布文章',
                capabilities: ['publish_posts', 'edit_others_posts', 'delete_others_posts', 'moderate_comments']
            },
            {
                role: 'author',
                name: '作者',
                description: '创建和发布自己的文章',
                capabilities: ['publish_posts', 'edit_posts', 'delete_posts', 'upload_files']
            },
            {
                role: 'contributor',
                name: '贡献者',
                description: '创建文章但需要审核才能发布',
                capabilities: ['edit_posts', 'delete_posts']
            },
            {
                role: 'subscriber',
                name: '订阅者',
                description: '基础用户权限，主要用于评论和个人资料管理',
                capabilities: ['read']
            }
        ];
    }

    /**
     * 分析数据流
     */
    async analyzeDataFlow() {
        console.log('🔄 分析数据流...');
        
        const dataFlow = {
            inputSources: [],
            dataProcessing: [],
            outputDestinations: [],
            dataStorage: []
        };

        if (this.analysis.project.type === 'wordpress') {
            // WordPress数据流分析
            dataFlow.inputSources = [
                {
                    source: 'WordPress后台',
                    description: '管理员和编辑者通过后台界面输入内容',
                    dataTypes: ['文章', '页面', '媒体文件', '用户数据', '设置选项']
                },
                {
                    source: '前台表单',
                    description: '访客通过评论表单、联系表单等提交数据',
                    dataTypes: ['评论', '联系信息', '用户注册信息']
                },
                {
                    source: 'REST API',
                    description: '第三方应用通过WordPress REST API提交数据',
                    dataTypes: ['API请求数据', '外部系统集成数据']
                }
            ];

            dataFlow.dataProcessing = [
                {
                    process: '内容处理',
                    description: 'WordPress核心处理用户提交的内容，进行清理和格式化',
                    steps: ['数据验证', '安全过滤', '格式转换', '钩子处理']
                },
                {
                    process: '权限验证',
                    description: '检查用户权限，确保只有授权用户可以执行特定操作',
                    steps: ['用户身份验证', '角色权限检查', '操作权限验证']
                }
            ];

            dataFlow.dataStorage = [
                {
                    storage: 'MySQL数据库',
                    description: 'WordPress使用MySQL存储所有结构化数据',
                    tables: ['wp_posts', 'wp_users', 'wp_options', 'wp_postmeta', 'wp_comments']
                },
                {
                    storage: '文件系统',
                    description: '媒体文件和主题文件存储在服务器文件系统',
                    locations: ['wp-content/uploads', 'wp-content/themes', 'wp-content/plugins']
                }
            ];
        }

        this.analysis.dataFlow = dataFlow;
    }

    /**
     * 分析架构模式
     */
    async analyzeArchitecturePatterns() {
        console.log('🏗️ 分析架构模式...');
        
        const patterns = [];

        if (this.analysis.project.type === 'wordpress') {
            patterns.push({
                pattern: 'Plugin Architecture',
                name: '插件架构模式',
                description: 'WordPress使用插件架构，通过钩子系统实现功能扩展',
                implementation: '通过add_action和add_filter实现松耦合的功能扩展',
                benefits: ['高度可扩展', '模块化开发', '向后兼容']
            });

            patterns.push({
                pattern: 'MVC-like Pattern',
                name: 'MVC类似模式',
                description: 'WordPress虽然不是严格的MVC，但具有类似的分层结构',
                implementation: '模板文件（View）、函数（Controller）、数据库（Model）分离',
                benefits: ['关注点分离', '代码重用', '易于维护']
            });

            patterns.push({
                pattern: 'Hook System',
                name: '钩子系统模式',
                description: '基于事件驱动的钩子系统，允许在特定时机执行自定义代码',
                implementation: '动作钩子（Actions）和过滤器钩子（Filters）',
                benefits: ['事件驱动', '高度灵活', '插件化开发']
            });
        }

        this.analysis.architecturePatterns = patterns;
    }

    /**
     * 提取关键组件
     */
    async extractKeyComponents() {
        console.log('🔧 提取关键组件...');
        
        const components = [];

        if (this.analysis.project.type === 'wordpress') {
            // 分析主题组件
            const themeComponents = await this.analyzeWordPressThemeComponents();
            components.push(...themeComponents);

            // 分析插件组件
            const pluginComponents = await this.analyzeWordPressPluginComponents();
            components.push(...pluginComponents);
        }

        this.analysis.keyComponents = components;
    }

    /**
     * 分析WordPress主题组件
     */
    async analyzeWordPressThemeComponents() {
        const components = [];
        const themeDir = path.join(this.projectPath, 'wp-content', 'themes');
        
        if (!fs.existsSync(themeDir)) {
            return components;
        }

        try {
            const themes = fs.readdirSync(themeDir);
            
            for (const theme of themes) {
                const themePath = path.join(themeDir, theme);
                const stat = fs.statSync(themePath);
                
                if (stat.isDirectory()) {
                    const themeFiles = fs.readdirSync(themePath);
                    
                    // 分析主题的关键文件
                    const themeComponent = {
                        type: 'theme',
                        name: theme,
                        description: `WordPress主题：${theme}`,
                        files: [],
                        features: []
                    };

                    // 检查关键模板文件
                    const templateFiles = {
                        'index.php': '主模板文件，所有页面的默认模板',
                        'style.css': '主题样式文件，定义网站外观',
                        'functions.php': '主题功能文件，添加自定义功能',
                        'header.php': '头部模板，包含网站头部HTML',
                        'footer.php': '底部模板，包含网站底部HTML',
                        'sidebar.php': '侧边栏模板，显示小工具区域',
                        'single.php': '单篇文章模板',
                        'page.php': '页面模板',
                        'archive.php': '归档页面模板',
                        'search.php': '搜索结果页面模板',
                        '404.php': '404错误页面模板'
                    };

                    for (const [file, desc] of Object.entries(templateFiles)) {
                        if (themeFiles.includes(file)) {
                            themeComponent.files.push({
                                name: file,
                                description: desc,
                                path: path.join('wp-content', 'themes', theme, file)
                            });
                        }
                    }

                    // 分析functions.php中的功能
                    const functionsFile = path.join(themePath, 'functions.php');
                    if (fs.existsSync(functionsFile)) {
                        const content = fs.readFileSync(functionsFile, 'utf8');
                        
                        if (content.includes('register_nav_menus')) {
                            themeComponent.features.push('自定义菜单支持');
                        }
                        if (content.includes('add_theme_support')) {
                            themeComponent.features.push('主题功能支持');
                        }
                        if (content.includes('wp_enqueue_style') || content.includes('wp_enqueue_script')) {
                            themeComponent.features.push('资源管理');
                        }
                    }

                    components.push(themeComponent);
                }
            }
        } catch (error) {
            console.warn('分析主题组件时出错:', error.message);
        }

        return components;
    }

    /**
     * 分析WordPress插件组件
     */
    async analyzeWordPressPluginComponents() {
        const components = [];
        const pluginDir = path.join(this.projectPath, 'wp-content', 'plugins');
        
        if (!fs.existsSync(pluginDir)) {
            return components;
        }

        try {
            const plugins = fs.readdirSync(pluginDir);
            
            for (const plugin of plugins) {
                const pluginPath = path.join(pluginDir, plugin);
                const stat = fs.statSync(pluginPath);
                
                if (stat.isDirectory()) {
                    const pluginComponent = {
                        type: 'plugin',
                        name: plugin,
                        description: `WordPress插件：${plugin}`,
                        mainFile: null,
                        features: [],
                        hooks: []
                    };

                    // 查找主插件文件
                    const pluginFiles = fs.readdirSync(pluginPath);
                    const mainFile = pluginFiles.find(file => 
                        file.endsWith('.php') && (
                            file === `${plugin}.php` || 
                            file === 'index.php' ||
                            file === 'main.php'
                        )
                    );

                    if (mainFile) {
                        pluginComponent.mainFile = path.join('wp-content', 'plugins', plugin, mainFile);
                        
                        // 分析插件功能
                        const content = fs.readFileSync(path.join(pluginPath, mainFile), 'utf8');
                        
                        // 提取插件头部信息
                        const headerMatch = content.match(/Plugin Name:\s*(.+)/);
                        if (headerMatch) {
                            pluginComponent.description = headerMatch[1].trim();
                        }

                        // 分析钩子使用
                        const actionHooks = content.match(/add_action\(\s*['"](.*?)['"],/g);
                        if (actionHooks) {
                            pluginComponent.hooks.push(...actionHooks.map(hook => {
                                const match = hook.match(/add_action\(\s*['"](.*?)['"],/);
                                return match ? { type: 'action', name: match[1] } : null;
                            }).filter(Boolean));
                        }

                        const filterHooks = content.match(/add_filter\(\s*['"](.*?)['"],/g);
                        if (filterHooks) {
                            pluginComponent.hooks.push(...filterHooks.map(hook => {
                                const match = hook.match(/add_filter\(\s*['"](.*?)['"],/);
                                return match ? { type: 'filter', name: match[1] } : null;
                            }).filter(Boolean));
                        }
                    }

                    components.push(pluginComponent);
                }
            }
        } catch (error) {
            console.warn('分析插件组件时出错:', error.message);
        }

        return components;
    }
}

// 如果直接运行此文件
if (require.main === module) {
    async function main() {
        const analyzer = new IntelligentProjectAnalyzer();
        try {
            await analyzer.analyze();
            await analyzer.saveAnalysis();
            await analyzer.saveReport();
            
            console.log('\n🎉 项目分析完成！');
            console.log('📁 查看分析结果:');
            console.log('   - .ai-dev-assistant/context/project-analysis.json');
            console.log('   - .ai-dev-assistant/context/analysis-report.md');
        } catch (error) {
            console.error('分析失败:', error.message);
            process.exit(1);
        }
    }
    
    main();
}

module.exports = IntelligentProjectAnalyzer;
