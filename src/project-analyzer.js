/**
 * AI开发辅助系统 - 智能项目分析器
 * AI Development Assistant - Intelligent Project Analyzer
 * Version: 1.2.0
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
                version: '1.2.0'
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
            
            console.log('✅ 项目分析完成');
            return this.analysis;
        } catch (error) {
            console.error('❌ 分析过程中发生错误:', error.message);
            throw error;
        }
    }

    /**
     * 检测项目类型和技术栈
     */
    async detectProjectType() {
        console.log('📋 检测项目类型...');
        
        const rootFiles = this.listFiles(this.projectPath);
        const allFiles = this.getAllFiles(this.projectPath);
        
        // 优先检测特定平台和CMS
        if (this.detectWordPress(rootFiles, allFiles)) {
            return;
        }
        
        if (this.detectLaravel(rootFiles, allFiles)) {
            return;
        }
        
        if (this.detectDrupal(rootFiles, allFiles)) {
            return;
        }
        
        if (this.detectDjango(rootFiles, allFiles)) {
            return;
        }
        
        if (this.detectMagento(rootFiles, allFiles)) {
            return;
        }
        
        if (this.detectSymfony(rootFiles, allFiles)) {
            return;
        }
        
        // 检测Node.js项目
        if (rootFiles.includes('package.json')) {
            const pkg = this.readJsonFile('package.json');
            this.analysis.project.type = 'node';
            this.analysis.project.language = 'javascript';
            this.analysis.project.packageManager = this.detectPackageManager();
            
            // 检测框架
            this.detectNodeFramework(pkg);
            
            // 检测TypeScript
            if (pkg.devDependencies?.typescript || rootFiles.includes('tsconfig.json')) {
                this.analysis.project.language = 'typescript';
            }
        }
        
        // 检测Python项目
        else if (rootFiles.includes('requirements.txt') || rootFiles.includes('pyproject.toml') || rootFiles.includes('setup.py')) {
            this.analysis.project.type = 'python';
            this.analysis.project.language = 'python';
            this.analysis.project.packageManager = 'pip';
            
            if (rootFiles.includes('pyproject.toml')) {
                this.analysis.project.buildTool = 'poetry';
            }
        }
        
        // 检测其他语言
        else if (rootFiles.includes('Cargo.toml')) {
            this.analysis.project.type = 'rust';
            this.analysis.project.language = 'rust';
            this.analysis.project.packageManager = 'cargo';
        }
        
        else if (rootFiles.includes('go.mod')) {
            this.analysis.project.type = 'go';
            this.analysis.project.language = 'go';
            this.analysis.project.packageManager = 'go-modules';
        }
        
        // 检测Java项目
        else if (rootFiles.includes('pom.xml') || rootFiles.includes('build.gradle')) {
            this.analysis.project.type = 'java';
            this.analysis.project.language = 'java';
            this.analysis.project.packageManager = rootFiles.includes('pom.xml') ? 'maven' : 'gradle';
        }
        
        // 检测.NET项目
        else if (rootFiles.some(f => f.endsWith('.csproj') || f.endsWith('.sln'))) {
            this.analysis.project.type = 'dotnet';
            this.analysis.project.language = 'csharp';
            this.analysis.project.packageManager = 'nuget';
        }
        
        // 检测PHP项目（通用）
        else if (this.detectGenericPHP(rootFiles, allFiles)) {
            // PHP项目检测逻辑已在detectGenericPHP中处理
        }
        
        // 检测静态站点
        else if (this.detectStaticSite(rootFiles, allFiles)) {
            // 静态站点检测逻辑已在detectStaticSite中处理
        }
        
        // 检测构建工具
        this.detectBuildTool(rootFiles);
    }

    /**
     * 检测Node.js框架
     */
    detectNodeFramework(pkg) {
        const deps = { ...pkg.dependencies, ...pkg.devDependencies };
        
        if (deps.next) {
            this.analysis.project.framework.push('Next.js');
            this.analysis.project.type = 'next-js';
        }
        if (deps.react) {
            this.analysis.project.framework.push('React');
        }
        if (deps.vue) {
            this.analysis.project.framework.push('Vue');
        }
        if (deps.angular || deps['@angular/core']) {
            this.analysis.project.framework.push('Angular');
        }
        if (deps.express) {
            this.analysis.project.framework.push('Express');
        }
        if (deps.koa) {
            this.analysis.project.framework.push('Koa');
        }
        if (deps.nestjs || deps['@nestjs/core']) {
            this.analysis.project.framework.push('NestJS');
        }
    }

    /**
     * 检测包管理器
     */
    detectPackageManager() {
        const rootFiles = this.listFiles(this.projectPath);
        
        if (rootFiles.includes('yarn.lock')) return 'yarn';
        if (rootFiles.includes('pnpm-lock.yaml')) return 'pnpm';
        if (rootFiles.includes('package-lock.json')) return 'npm';
        return 'npm';
    }

    /**
     * 检测构建工具
     */
    detectBuildTool(files) {
        if (files.includes('webpack.config.js')) {
            this.analysis.project.buildTool = 'webpack';
        } else if (files.includes('vite.config.js') || files.includes('vite.config.ts')) {
            this.analysis.project.buildTool = 'vite';
        } else if (files.includes('rollup.config.js')) {
            this.analysis.project.buildTool = 'rollup';
        } else if (files.includes('gulpfile.js')) {
            this.analysis.project.buildTool = 'gulp';
        } else if (files.includes('Makefile')) {
            this.analysis.project.buildTool = 'make';
        }
    }

    /**
     * 检测WordPress项目
     */
    detectWordPress(rootFiles, allFiles) {
        // WordPress核心文件检测
        const wpCoreFiles = ['wp-config.php', 'wp-load.php', 'wp-blog-header.php'];
        const wpCoreDirs = ['wp-content', 'wp-admin', 'wp-includes'];
        
        const hasWpConfig = rootFiles.includes('wp-config.php') || rootFiles.includes('wp-config-sample.php');
        const hasWpContent = fs.existsSync(path.join(this.projectPath, 'wp-content'));
        const hasWpAdmin = fs.existsSync(path.join(this.projectPath, 'wp-admin'));
        
        // 检测主题和插件
        const hasThemes = fs.existsSync(path.join(this.projectPath, 'wp-content', 'themes'));
        const hasPlugins = fs.existsSync(path.join(this.projectPath, 'wp-content', 'plugins'));
        
        if (hasWpConfig && hasWpContent && hasWpAdmin) {
            this.analysis.project.type = 'wordpress';
            this.analysis.project.language = 'php';
            this.analysis.project.framework.push('WordPress');
            this.analysis.project.packageManager = 'composer'; // 如果有composer.json
            
            // 检测WordPress版本
            this.detectWordPressVersion();
            
            // 检测主题和插件
            if (hasThemes) this.analysis.project.framework.push('WordPress Themes');
            if (hasPlugins) this.analysis.project.framework.push('WordPress Plugins');
            
            return true;
        }
        
        return false;
    }

    /**
     * 检测Laravel项目
     */
    detectLaravel(rootFiles, allFiles) {
        const hasArtisan = rootFiles.includes('artisan');
        const hasComposer = rootFiles.includes('composer.json');
        const hasLaravelDirs = fs.existsSync(path.join(this.projectPath, 'app')) && 
                               fs.existsSync(path.join(this.projectPath, 'bootstrap'));
        
        if (hasArtisan && hasComposer && hasLaravelDirs) {
            try {
                const composer = this.readJsonFile('composer.json');
                if (composer.require && composer.require['laravel/framework']) {
                    this.analysis.project.type = 'laravel';
                    this.analysis.project.language = 'php';
                    this.analysis.project.framework.push('Laravel');
                    this.analysis.project.packageManager = 'composer';
                    this.analysis.project.buildTool = 'laravel-mix';
                    return true;
                }
            } catch (e) {
                // 继续检测
            }
        }
        
        return false;
    }

    /**
     * 检测Django项目
     */
    detectDjango(rootFiles, allFiles) {
        const hasManagePy = rootFiles.includes('manage.py');
        const hasDjangoFiles = allFiles.some(f => f.includes('settings.py') || f.includes('urls.py'));
        const hasRequirements = rootFiles.includes('requirements.txt');
        
        if (hasManagePy || hasDjangoFiles) {
            this.analysis.project.type = 'django';
            this.analysis.project.language = 'python';
            this.analysis.project.framework.push('Django');
            this.analysis.project.packageManager = 'pip';
            
            if (rootFiles.includes('poetry.lock')) {
                this.analysis.project.packageManager = 'poetry';
            }
            
            return true;
        }
        
        return false;
    }

    /**
     * 检测Drupal项目
     */
    detectDrupal(rootFiles, allFiles) {
        const hasDrupalFiles = rootFiles.some(f => f.includes('index.php')) &&
                               fs.existsSync(path.join(this.projectPath, 'core')) &&
                               fs.existsSync(path.join(this.projectPath, 'sites'));
        
        const hasComposer = rootFiles.includes('composer.json');
        
        if (hasDrupalFiles && hasComposer) {
            try {
                const composer = this.readJsonFile('composer.json');
                if (composer.require && (composer.require['drupal/core'] || composer.require['drupal/core-recommended'])) {
                    this.analysis.project.type = 'drupal';
                    this.analysis.project.language = 'php';
                    this.analysis.project.framework.push('Drupal');
                    this.analysis.project.packageManager = 'composer';
                    return true;
                }
            } catch (e) {
                // 继续检测
            }
        }
        
        return false;
    }

    /**
     * 检测Magento项目
     */
    detectMagento(rootFiles, allFiles) {
        const hasMagentoFiles = fs.existsSync(path.join(this.projectPath, 'app', 'etc')) &&
                                fs.existsSync(path.join(this.projectPath, 'pub')) &&
                                rootFiles.includes('composer.json');
        
        if (hasMagentoFiles) {
            try {
                const composer = this.readJsonFile('composer.json');
                if (composer.require && composer.require['magento/product-community-edition']) {
                    this.analysis.project.type = 'magento';
                    this.analysis.project.language = 'php';
                    this.analysis.project.framework.push('Magento');
                    this.analysis.project.packageManager = 'composer';
                    return true;
                }
            } catch (e) {
                // 继续检测
            }
        }
        
        return false;
    }

    /**
     * 检测Symfony项目
     */
    detectSymfony(rootFiles, allFiles) {
        const hasSymfonyFiles = rootFiles.includes('symfony.lock') || 
                                fs.existsSync(path.join(this.projectPath, 'config')) &&
                                fs.existsSync(path.join(this.projectPath, 'src'));
        
        if (hasSymfonyFiles && rootFiles.includes('composer.json')) {
            try {
                const composer = this.readJsonFile('composer.json');
                if (composer.require && Object.keys(composer.require).some(pkg => pkg.startsWith('symfony/'))) {
                    this.analysis.project.type = 'symfony';
                    this.analysis.project.language = 'php';
                    this.analysis.project.framework.push('Symfony');
                    this.analysis.project.packageManager = 'composer';
                    return true;
                }
            } catch (e) {
                // 继续检测
            }
        }
        
        return false;
    }

    /**
     * 检测通用PHP项目
     */
    detectGenericPHP(rootFiles, allFiles) {
        const phpFiles = allFiles.filter(f => f.endsWith('.php')).length;
        const totalFiles = allFiles.length;
        const phpRatio = phpFiles / totalFiles;
        
        // 如果PHP文件占比超过30%，认为是PHP项目
        if (phpRatio > 0.3 && phpFiles > 5) {
            this.analysis.project.type = 'php';
            this.analysis.project.language = 'php';
            
            if (rootFiles.includes('composer.json')) {
                this.analysis.project.packageManager = 'composer';
            }
            
            // 检测常见PHP框架
            if (allFiles.some(f => f.includes('CodeIgniter'))) {
                this.analysis.project.framework.push('CodeIgniter');
            }
            if (allFiles.some(f => f.includes('CakePHP'))) {
                this.analysis.project.framework.push('CakePHP');
            }
            
            return true;
        }
        
        return false;
    }

    /**
     * 检测静态站点
     */
    detectStaticSite(rootFiles, allFiles) {
        const htmlFiles = allFiles.filter(f => f.endsWith('.html')).length;
        const cssFiles = allFiles.filter(f => f.endsWith('.css')).length;
        const jsFiles = allFiles.filter(f => f.endsWith('.js')).length;
        
        // 检测Jekyll
        if (rootFiles.includes('_config.yml') && fs.existsSync(path.join(this.projectPath, '_posts'))) {
            this.analysis.project.type = 'jekyll';
            this.analysis.project.language = 'ruby';
            this.analysis.project.framework.push('Jekyll');
            return true;
        }
        
        // 检测Hugo
        if (rootFiles.includes('config.toml') || rootFiles.includes('config.yaml')) {
            this.analysis.project.type = 'hugo';
            this.analysis.project.language = 'go';
            this.analysis.project.framework.push('Hugo');
            return true;
        }
        
        // 检测Gatsby
        if (rootFiles.includes('gatsby-config.js')) {
            this.analysis.project.type = 'gatsby';
            this.analysis.project.language = 'javascript';
            this.analysis.project.framework.push('Gatsby');
            return true;
        }
        
        // 通用静态站点
        if (htmlFiles > 0 && (htmlFiles + cssFiles + jsFiles) > allFiles.length * 0.5) {
            this.analysis.project.type = 'static';
            this.analysis.project.language = 'html';
            return true;
        }
        
        return false;
    }

    /**
     * 检测WordPress版本
     */
    detectWordPressVersion() {
        try {
            const versionFile = path.join(this.projectPath, 'wp-includes', 'version.php');
            if (fs.existsSync(versionFile)) {
                const content = fs.readFileSync(versionFile, 'utf8');
                const versionMatch = content.match(/\$wp_version\s*=\s*['"]([^'"]+)['"]/);
                if (versionMatch) {
                    this.analysis.project.version = versionMatch[1];
                }
            }
        } catch (e) {
            // 忽略错误
        }
    }

    /**
     * 获取所有文件列表（递归）
     */
    getAllFiles(dir, fileList = []) {
        try {
            const files = fs.readdirSync(dir);
            
            for (const file of files) {
                const filePath = path.join(dir, file);
                const stat = fs.statSync(filePath);
                
                if (stat.isDirectory()) {
                    // 忽略常见的忽略目录
                    if (!this.shouldIgnoreDirectory(file)) {
                        this.getAllFiles(filePath, fileList);
                    }
                } else {
                    fileList.push(path.relative(this.projectPath, filePath));
                }
            }
        } catch (e) {
            // 忽略访问权限错误
        }
        
        return fileList;
    }

    /**
     * 检查是否应该忽略目录
     */
    shouldIgnoreDirectory(dirName) {
        const ignoreDirs = [
            'node_modules', '.git', '.svn', '.hg',
            'vendor', '__pycache__', '.pytest_cache',
            'target', 'build', 'dist', '.gradle',
            '.idea', '.vscode', '.vs'
        ];
        
        return ignoreDirs.includes(dirName) || dirName.startsWith('.');
    }

    /**
     * 分析项目结构
     */
    async analyzeStructure() {
        console.log('📁 分析项目结构...');
        
        this.analysis.structure.directories = this.scanDirectory(this.projectPath, 4);
        this.analysis.structure.files = this.analyzeFileTypes();
        this.analysis.structure.patterns = this.detectStructurePatterns();
    }

    /**
     * 扫描目录结构
     */
    scanDirectory(dir, maxDepth = 3, currentDepth = 0) {
        if (currentDepth >= maxDepth) return {};
        
        const structure = {};
        const ignoreDirs = [
            'node_modules', '.git', '.svn', '.hg',
            'dist', 'build', 'coverage', '.next',
            '__pycache__', '.pytest_cache',
            'target', 'vendor'
        ];
        
        try {
            const items = fs.readdirSync(dir);
            for (const item of items) {
                if (item.startsWith('.') && !item.startsWith('.ai-')) continue;
                if (ignoreDirs.includes(item)) continue;
                
                const itemPath = path.join(dir, item);
                const stat = fs.statSync(itemPath);
                
                if (stat.isDirectory()) {
                    structure[item] = {
                        type: 'directory',
                        children: this.scanDirectory(itemPath, maxDepth, currentDepth + 1)
                    };
                } else {
                    structure[item] = {
                        type: 'file',
                        size: stat.size,
                        extension: path.extname(item)
                    };
                }
            }
        } catch (error) {
            // 忽略权限错误
        }
        
        return structure;
    }

    /**
     * 分析文件类型分布
     */
    analyzeFileTypes() {
        const fileTypes = {};
        this.walkDirectory(this.projectPath, (filePath) => {
            const ext = path.extname(filePath).toLowerCase();
            if (ext) {
                fileTypes[ext] = (fileTypes[ext] || 0) + 1;
            }
        });
        
        return fileTypes;
    }

    /**
     * 检测结构模式
     */
    detectStructurePatterns() {
        const patterns = [];
        const dirs = Object.keys(this.analysis.structure.directories);
        
        // MVC模式
        if (dirs.includes('models') && dirs.includes('views') && dirs.includes('controllers')) {
            patterns.push('MVC');
        }
        
        // 组件化模式
        if (dirs.includes('components') || dirs.includes('src')) {
            patterns.push('Component-Based');
        }
        
        // 微服务模式
        if (dirs.includes('services') || dirs.includes('microservices')) {
            patterns.push('Microservices');
        }
        
        // 分层架构
        if (dirs.includes('api') && dirs.includes('database')) {
            patterns.push('Layered');
        }
        
        return patterns;
    }

    /**
     * 分析依赖关系
     */
    async analyzeDependencies() {
        console.log('📦 分析依赖关系...');
        
        if (this.analysis.project.type === 'node') {
            await this.analyzeNodeDependencies();
        } else if (this.analysis.project.type === 'python') {
            await this.analyzePythonDependencies();
        }
    }

    /**
     * 分析Node.js依赖
     */
    async analyzeNodeDependencies() {
        try {
            const pkg = this.readJsonFile('package.json');
            
            this.analysis.dependencies.production = Object.keys(pkg.dependencies || {});
            this.analysis.dependencies.development = Object.keys(pkg.devDependencies || {});
            
            // 分析安全风险
            await this.analyzeSecurityDependencies(pkg);
        } catch (error) {
            console.warn('⚠️ 无法分析Node.js依赖:', error.message);
        }
    }

    /**
     * 分析Python依赖
     */
    async analyzePythonDependencies() {
        try {
            if (fs.existsSync('requirements.txt')) {
                const content = fs.readFileSync('requirements.txt', 'utf8');
                this.analysis.dependencies.production = content
                    .split('\n')
                    .filter(line => line.trim() && !line.startsWith('#'))
                    .map(line => line.split('==')[0].split('>=')[0].split('<=')[0].trim());
            }
        } catch (error) {
            console.warn('⚠️ 无法分析Python依赖:', error.message);
        }
    }

    /**
     * 分析安全依赖
     */
    async analyzeSecurityDependencies(pkg) {
        const knownSecurityPackages = [
            'helmet', 'cors', 'bcrypt', 'jsonwebtoken',
            'express-rate-limit', 'express-validator'
        ];
        
        const securityDeps = [];
        const allDeps = { ...pkg.dependencies, ...pkg.devDependencies };
        
        for (const dep of knownSecurityPackages) {
            if (allDeps[dep]) {
                securityDeps.push(dep);
            }
        }
        
        this.analysis.dependencies.security = securityDeps;
    }

    /**
     * 计算代码指标
     */
    async calculateMetrics() {
        console.log('📊 计算代码指标...');
        
        let totalFiles = 0;
        let totalLines = 0;
        
        this.walkDirectory(this.projectPath, (filePath) => {
            if (this.isCodeFile(filePath)) {
                totalFiles++;
                try {
                    const content = fs.readFileSync(filePath, 'utf8');
                    totalLines += content.split('\n').length;
                } catch (error) {
                    // 忽略读取错误
                }
            }
        });
        
        this.analysis.codeMetrics.totalFiles = totalFiles;
        this.analysis.codeMetrics.totalLines = totalLines;
        this.analysis.codeMetrics.complexity = this.estimateComplexity(totalFiles, totalLines);
    }

    /**
     * 判断是否为代码文件
     */
    isCodeFile(filePath) {
        const codeExtensions = [
            '.js', '.ts', '.jsx', '.tsx', '.py', '.java', '.c', '.cpp',
            '.cs', '.php', '.rb', '.go', '.rs', '.swift', '.kt'
        ];
        return codeExtensions.includes(path.extname(filePath).toLowerCase());
    }

    /**
     * 估算复杂度
     */
    estimateComplexity(fileCount, lineCount) {
        if (fileCount < 50 && lineCount < 5000) return 'low';
        if (fileCount < 200 && lineCount < 20000) return 'medium';
        return 'high';
    }

    /**
     * 评估代码质量
     */
    async assessQuality() {
        console.log('🔍 评估代码质量...');
        
        let score = 100;
        const issues = [];
        const suggestions = [];
        
        // 检查项目结构
        if (!fs.existsSync('README.md')) {
            score -= 10;
            issues.push('缺少README.md文档');
            suggestions.push('添加项目说明文档');
        }
        
        // 检查测试
        if (!this.hasTests()) {
            score -= 20;
            issues.push('Missing test files');
            suggestions.push('Add unit tests and integration tests');
        }
        
        // 检查配置文件
        if (this.analysis.project.type === 'node') {
            if (!fs.existsSync('.gitignore')) {
                score -= 5;
                issues.push('缺少.gitignore文件');
                suggestions.push('添加.gitignore以忽略不必要的文件');
            }
            
            if (!fs.existsSync('package-lock.json') && !fs.existsSync('yarn.lock')) {
                score -= 10;
                issues.push('缺少依赖锁文件');
                suggestions.push('运行npm install或yarn安装依赖');
            }
        }
        
        // 检查代码复杂度
        if (this.analysis.codeMetrics.complexity === 'high') {
            score -= 15;
            issues.push('代码复杂度较高');
            suggestions.push('Consider refactoring large files and complex functions');
        }
        
        this.analysis.quality = {
            score: Math.max(0, score),
            issues,
            suggestions
        };
    }

    /**
     * 检查是否有测试
     */
    hasTests() {
        const testDirs = ['test', 'tests', '__tests__', 'spec'];
        const testFiles = ['test.js', 'test.ts', 'spec.js', 'spec.ts'];
        
        // 检查测试目录
        for (const dir of testDirs) {
            if (fs.existsSync(dir)) return true;
        }
        
        // 检查测试文件
        for (const file of testFiles) {
            if (fs.existsSync(file)) return true;
        }
        
        // 检查包含test的文件
        try {
            const files = fs.readdirSync(this.projectPath);
            return files.some(file => 
                file.includes('.test.') || 
                file.includes('.spec.') ||
                file.endsWith('.test.js') ||
                file.endsWith('.test.ts')
            );
        } catch (error) {
            return false;
        }
    }

    /**
     * 安全审计
     */
    async securityAudit() {
        console.log('🛡️ 执行安全审计...');
        
        const vulnerabilities = [];
        const risks = [];
        const recommendations = [];
        
        // 检查环境变量文件
        if (fs.existsSync('.env')) {
            risks.push('发现.env文件，确保不要提交敏感信息');
            recommendations.push('将.env添加到.gitignore');
        }
        
        // 检查Node.js安全
        if (this.analysis.project.type === 'node') {
            const pkg = this.readJsonFile('package.json');
            
            // 检查安全相关依赖
            if (!this.analysis.dependencies.security.length) {
                risks.push('缺少安全相关依赖');
                recommendations.push('考虑添加helmet、cors等安全中间件');
            }
            
            // 检查已知漏洞依赖
            if (pkg.dependencies?.lodash && !pkg.dependencies.lodash.startsWith('^4.17.21')) {
                vulnerabilities.push('lodash版本可能存在安全漏洞');
            }
        }
        
        this.analysis.security = {
            vulnerabilities,
            risks,
            recommendations
        };
    }

    /**
     * 生成AI上下文
     */
    async generateAIContext() {
        console.log('🤖 生成AI上下文...');
        
        const focusAreas = [];
        const priority = [];
        
        // 基于项目类型确定焦点
        if (this.analysis.project.framework.includes('React') || 
            this.analysis.project.framework.includes('Next.js')) {
            focusAreas.push('前端性能优化', 'SEO优化', '组件设计');
        }
        
        if (this.analysis.project.framework.includes('Express')) {
            focusAreas.push('API设计', '中间件优化', '安全防护');
        }
        
        // 基于质量评估确定优先级
        if (this.analysis.quality.score < 70) {
            priority.push('代码质量提升');
        }
        
        if (!this.hasTests()) {
            priority.push('测试覆盖');
        }
        
        if (this.analysis.security.risks.length > 0) {
            priority.push('安全加固');
        }
        
        // 基于复杂度确定开发阶段
        let developmentPhase = 'maintenance';
        if (this.analysis.codeMetrics.totalFiles < 20) {
            developmentPhase = 'early';
        } else if (this.analysis.codeMetrics.complexity === 'high') {
            developmentPhase = 'mature';
        }
        
        this.analysis.aiContext = {
            focusAreas,
            developmentPhase,
            technicalDebt: this.analysis.quality.score < 60 ? 'high' : 
                          this.analysis.quality.score < 80 ? 'medium' : 'low',
            priority
        };
    }

    /**
     * 工具方法：列出文件
     */
    listFiles(dir) {
        try {
            return fs.readdirSync(dir);
        } catch (error) {
            return [];
        }
    }

    /**
     * 工具方法：读取JSON文件
     */
    readJsonFile(filePath) {
        try {
            return JSON.parse(fs.readFileSync(filePath, 'utf8'));
        } catch (error) {
            return {};
        }
    }

    /**
     * 工具方法：遍历目录
     */
    walkDirectory(dir, callback, ignoreDirs = ['node_modules', '.git', 'dist', 'build']) {
        try {
            const items = fs.readdirSync(dir);
            for (const item of items) {
                if (item.startsWith('.') && !item.startsWith('.ai-')) continue;
                if (ignoreDirs.includes(item)) continue;
                
                const itemPath = path.join(dir, item);
                const stat = fs.statSync(itemPath);
                
                if (stat.isDirectory()) {
                    this.walkDirectory(itemPath, callback, ignoreDirs);
                } else {
                    callback(itemPath);
                }
            }
        } catch (error) {
            // 忽略权限错误
        }
    }

    /**
     * 保存分析结果
     */
    async saveAnalysis(outputPath = '.ai-dev-assistant/context/project-analysis.json') {
        try {
            const dir = path.dirname(outputPath);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
            
            fs.writeFileSync(outputPath, JSON.stringify(this.analysis, null, 2));
            console.log(`✅ 分析结果已保存到: ${outputPath}`);
        } catch (error) {
            console.error('❌ 保存分析结果失败:', error.message);
        }
    }

    /**
     * 生成分析报告
     */
    generateReport() {
        const report = [];
        
        report.push('# 🔍 项目分析报告\n');
        report.push(`**分析时间**: ${this.analysis.metadata.analyzedAt}`);
        report.push(`**项目名称**: ${this.analysis.metadata.name}`);
        report.push(`**项目类型**: ${this.analysis.project.type}`);
        report.push(`**主要语言**: ${this.analysis.project.language}\n`);
        
        if (this.analysis.project.framework.length > 0) {
            report.push(`**框架**: ${this.analysis.project.framework.join(', ')}\n`);
        }
        
        report.push('## 📊 代码指标\n');
        report.push(`- 文件总数: ${this.analysis.codeMetrics.totalFiles}`);
        report.push(`- 代码行数: ${this.analysis.codeMetrics.totalLines}`);
        report.push(`- 复杂度: ${this.analysis.codeMetrics.complexity}\n`);
        
        report.push('## 🎯 质量评估\n');
        report.push(`**质量评分**: ${this.analysis.quality.score}/100\n`);
        
        if (this.analysis.quality.issues.length > 0) {
            report.push('**发现的问题**:');
            this.analysis.quality.issues.forEach(issue => {
                report.push(`- ${issue}`);
            });
            report.push('');
        }
        
        if (this.analysis.quality.suggestions.length > 0) {
            report.push('**改进建议**:');
            this.analysis.quality.suggestions.forEach(suggestion => {
                report.push(`- ${suggestion}`);
            });
            report.push('');
        }
        
        report.push('## 🛡️ 安全评估\n');
        
        if (this.analysis.security.vulnerabilities.length > 0) {
            report.push('**安全漏洞**:');
            this.analysis.security.vulnerabilities.forEach(vuln => {
                report.push(`- ⚠️ ${vuln}`);
            });
            report.push('');
        }
        
        if (this.analysis.security.risks.length > 0) {
            report.push('**安全风险**:');
            this.analysis.security.risks.forEach(risk => {
                report.push(`- ⚠️ ${risk}`);
            });
            report.push('');
        }
        
        if (this.analysis.security.recommendations.length > 0) {
            report.push('**安全建议**:');
            this.analysis.security.recommendations.forEach(rec => {
                report.push(`- 🔒 ${rec}`);
            });
            report.push('');
        }
        
        report.push('## 🤖 AI 开发建议\n');
        report.push(`**开发阶段**: ${this.analysis.aiContext.developmentPhase}`);
        report.push(`**技术债务**: ${this.analysis.aiContext.technicalDebt}\n`);
        
        if (this.analysis.aiContext.focusAreas.length > 0) {
            report.push('**关注领域**:');
            this.analysis.aiContext.focusAreas.forEach(area => {
                report.push(`- ${area}`);
            });
            report.push('');
        }
        
        if (this.analysis.aiContext.priority.length > 0) {
            report.push('**优先事项**:');
            this.analysis.aiContext.priority.forEach(item => {
                report.push(`- 🎯 ${item}`);
            });
            report.push('');
        }
        
        report.push('---\n*由AI开发辅助系统自动生成*');
        
        return report.join('\n');
    }

    /**
     * 保存分析报告
     */
    async saveReport(outputPath = '.ai-dev-assistant/context/analysis-report.md') {
        try {
            const report = this.generateReport();
            const dir = path.dirname(outputPath);
            
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
            
            fs.writeFileSync(outputPath, report);
            console.log(`✅ 分析报告已保存到: ${outputPath}`);
        } catch (error) {
            console.error('❌ 保存分析报告失败:', error.message);
        }
    }

    /**
     * 快速项目类型检测 - 用于配置初始化
     */
    quickTypeDetection() {
        try {
            const packageJson = path.join(this.projectPath, 'package.json');
            const composerJson = path.join(this.projectPath, 'composer.json');
            const wpConfig = path.join(this.projectPath, 'wp-config.php');
            
            // 检查文件数量来判断复杂度
            const fileCount = this.getQuickFileCount();
            
            if (fs.existsSync(wpConfig)) return 'wordpress';
            if (fs.existsSync(packageJson)) {
                const pkg = JSON.parse(fs.readFileSync(packageJson, 'utf8'));
                if (pkg.dependencies && Object.keys(pkg.dependencies).length > 20) {
                    return 'complex';
                }
                return 'node';
            }
            if (fs.existsSync(composerJson)) return 'php';
            if (fileCount > 100) return 'complex';
            
            return 'simple';
        } catch (error) {
            return 'unknown';
        }
    }

    /**
     * 获取项目指示器 - 用于智能焦点调整
     */
    getProjectIndicators() {
        const indicators = {
            isWebProject: false,
            isAPIProject: false,
            hasDatabase: false,
            hasAPI: false,
            hasUI: false,
            hasAutomation: false
        };

        try {
            // 检查Web项目标识
            const webFiles = [
                'index.html', 'index.php', 'package.json', 
                'composer.json', 'wp-config.php'
            ];
            indicators.isWebProject = webFiles.some(file => 
                fs.existsSync(path.join(this.projectPath, file))
            );

            // 检查API项目标识
            const apiIndicators = ['routes', 'api', 'controllers', 'endpoints'];
            indicators.isAPIProject = apiIndicators.some(indicator => 
                fs.existsSync(path.join(this.projectPath, indicator))
            );

            // 检查数据库相关
            const dbFiles = [
                'database.php', 'config/database.php', 'models',
                'migrations', '.env'
            ];
            indicators.hasDatabase = dbFiles.some(file => 
                fs.existsSync(path.join(this.projectPath, file))
            );

            // 检查UI相关
            const uiIndicators = ['assets', 'css', 'js', 'templates', 'views'];
            indicators.hasUI = uiIndicators.some(indicator => 
                fs.existsSync(path.join(this.projectPath, indicator))
            );

            // 检查自动化
            const autoFiles = ['Gruntfile.js', 'Gulpfile.js', 'webpack.config.js'];
            indicators.hasAutomation = autoFiles.some(file => 
                fs.existsSync(path.join(this.projectPath, file))
            );

            return indicators;
        } catch (error) {
            return indicators;
        }
    }

    /**
     * 快速文件计数
     */
    getQuickFileCount() {
        try {
            let count = 0;
            const scanDir = (dir, depth = 0) => {
                if (depth > 3) return; // 限制深度避免性能问题
                
                const files = fs.readdirSync(dir);
                files.forEach(file => {
                    const fullPath = path.join(dir, file);
                    try {
                        const stat = fs.statSync(fullPath);
                        if (stat.isDirectory() && !this.shouldSkipDirectory(file)) {
                            scanDir(fullPath, depth + 1);
                        } else if (stat.isFile()) {
                            count++;
                        }
                    } catch (error) {
                        // 忽略权限错误等
                    }
                });
            };
            
            scanDir(this.projectPath);
            return count;
        } catch (error) {
            return 0;
        }
    }

    /**
     * 快速分析 - 轻量级项目检查
     */
    async quickAnalyze() {
        try {
            const projectType = this.detectProjectType();
            const language = this.detectPrimaryLanguage();
            const fileCount = this.getQuickFileCount();
            
            return {
                type: projectType,
                language: language,
                fileCount: fileCount,
                framework: this.detectFramework(projectType),
                complexity: fileCount > 100 ? 'high' : fileCount > 50 ? 'medium' : 'low'
            };
        } catch (error) {
            console.error('快速分析失败:', error.message);
            return {
                type: 'unknown',
                language: 'unknown',
                fileCount: 0,
                framework: [],
                complexity: 'unknown'
            };
        }
    }

    // ...existing code...
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
