/**
 * AI开发辅助系统 - 上下文管理器
 * AI Development Assistant - Context Manager
 * Version: 1.2.0
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

class ContextManager {
    constructor(contextDir = '.', projectPath = null) {
        this.contextDir = path.resolve(contextDir);
        this.projectPath = projectPath ? path.resolve(projectPath) : path.dirname(this.contextDir);
        this.configDir = path.join(this.contextDir, 'config');
        this.dataDir = path.join(this.contextDir, 'data');
        
        // 确保目录存在
        this.ensureDirectories();
    }

    /**
     * 确保必要目录存在
     */
    ensureDirectories() {
        const dirs = [this.contextDir, this.configDir, this.dataDir];
        dirs.forEach(dir => {
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
        });
    }

    /**
     * 更新完整上下文
     */
    async updateContext() {
        console.log('🔄 开始更新项目上下文...');
        
        try {
            await this.updateProjectOverview();
            await this.updateComponentsMap();
            await this.updateDependencyGraph();
            await this.updateRecentChanges();
            await this.updateDevelopmentFocus();
            
            console.log('✅ 项目上下文更新完成');
        } catch (error) {
            console.error('❌ 上下文更新失败:', error.message);
            throw error;
        }
    }

    /**
     * 更新项目概览
     */
    async updateProjectOverview() {
        console.log('📋 更新项目概览...');
        
        const overview = {
            metadata: {
                name: path.basename(this.projectPath),
                path: this.projectPath,
                lastUpdated: new Date().toISOString()
            },
            structure: await this.analyzeProjectStructure(),
            techStack: await this.analyzeTechStack(),
            keyFiles: await this.identifyKeyFiles(),
            metrics: await this.calculateProjectMetrics()
        };
        
        const overviewPath = path.join(this.contextDir, 'project-overview.json');
        fs.writeFileSync(overviewPath, JSON.stringify(overview, null, 2));
        
        // 同时生成Markdown版本
        const markdownContent = this.generateOverviewMarkdown(overview);
        const markdownPath = path.join(this.contextDir, 'project-overview.md');
        fs.writeFileSync(markdownPath, markdownContent);
    }

    /**
     * 分析项目结构
     */
    async analyzeProjectStructure() {
        const structure = {
            directories: {},
            patterns: [],
            conventions: []
        };
        
        // 扫描主要目录
        const mainDirs = this.getMainDirectories();
        structure.directories = mainDirs;
        
        // 检测结构模式
        structure.patterns = this.detectStructurePatterns(mainDirs);
        
        // 检测命名约定
        structure.conventions = this.detectNamingConventions();
        
        return structure;
    }

    /**
     * 获取主要目录
     */
    getMainDirectories() {
        const ignoreDirs = [
            'node_modules', '.git', '.svn', 'dist', 'build', 
            'coverage', '.next', '__pycache__', 'target'
        ];
        
        const directories = {};
        
        try {
            const items = fs.readdirSync(this.projectPath);
            for (const item of items) {
                if (ignoreDirs.includes(item)) continue;
                
                const itemPath = path.join(this.projectPath, item);
                const stat = fs.statSync(itemPath);
                
                if (stat.isDirectory()) {
                    directories[item] = {
                        purpose: this.guessDirPurpose(item),
                        fileCount: this.countFiles(itemPath),
                        size: this.getDirSize(itemPath)
                    };
                }
            }
        } catch (error) {
            console.warn('无法读取项目目录:', error.message);
        }
        
        return directories;
    }

    /**
     * 猜测目录用途
     */
    guessDirPurpose(dirName) {
        const purposes = {
            'src': '源代码',
            'lib': '库文件',
            'components': '组件',
            'pages': '页面',
            'api': 'API接口',
            'utils': '工具函数',
            'helpers': '辅助函数',
            'services': '服务层',
            'models': '数据模型',
            'views': '视图',
            'controllers': '控制器',
            'middleware': '中间件',
            'config': '配置文件',
            'public': '静态资源',
            'assets': '资源文件',
            'styles': '样式文件',
            'css': '样式文件',
            'scss': '样式文件',
            'tests': '测试文件',
            'test': '测试文件',
            '__tests__': '测试文件',
            'spec': '测试规范',
            'docs': '文档',
            'documentation': '文档',
            'scripts': '脚本',
            'tools': '工具',
            'bin': '可执行文件',
            'types': '类型定义',
            'typings': '类型定义'
        };
        
        return purposes[dirName.toLowerCase()] || '未知用途';
    }

    /**
     * 计算文件数量
     */
    countFiles(dir) {
        let count = 0;
        try {
            const items = fs.readdirSync(dir);
            for (const item of items) {
                const itemPath = path.join(dir, item);
                const stat = fs.statSync(itemPath);
                
                if (stat.isFile()) {
                    count++;
                } else if (stat.isDirectory() && !item.startsWith('.')) {
                    count += this.countFiles(itemPath);
                }
            }
        } catch (error) {
            // 忽略错误
        }
        return count;
    }

    /**
     * 计算目录大小
     */
    getDirSize(dir) {
        let size = 0;
        try {
            const items = fs.readdirSync(dir);
            for (const item of items) {
                const itemPath = path.join(dir, item);
                const stat = fs.statSync(itemPath);
                
                if (stat.isFile()) {
                    size += stat.size;
                } else if (stat.isDirectory() && !item.startsWith('.')) {
                    size += this.getDirSize(itemPath);
                }
            }
        } catch (error) {
            // 忽略错误
        }
        return size;
    }

    /**
     * 检测结构模式
     */
    detectStructurePatterns(directories) {
        const patterns = [];
        const dirNames = Object.keys(directories);
        
        // MVC模式
        if (dirNames.includes('models') && dirNames.includes('views') && dirNames.includes('controllers')) {
            patterns.push('MVC');
        }
        
        // 组件化架构
        if (dirNames.includes('components')) {
            patterns.push('Component-Based');
        }
        
        // 分层架构
        if (dirNames.includes('services') && dirNames.includes('models')) {
            patterns.push('Layered Architecture');
        }
        
        // Next.js结构
        if (dirNames.includes('pages') && dirNames.includes('public')) {
            patterns.push('Next.js Structure');
        }
        
        // 微服务结构
        if (dirNames.includes('services') && dirNames.includes('api')) {
            patterns.push('Microservices');
        }
        
        return patterns;
    }

    /**
     * 检测命名约定
     */
    detectNamingConventions() {
        const conventions = [];
        
        // 分析文件命名模式
        const files = this.getAllFiles();
        const patterns = {
            camelCase: /^[a-z][a-zA-Z0-9]*$/,
            kebabCase: /^[a-z][a-z0-9-]*$/,
            snakeCase: /^[a-z][a-z0-9_]*$/,
            PascalCase: /^[A-Z][a-zA-Z0-9]*$/
        };
        
        const counts = {};
        Object.keys(patterns).forEach(pattern => counts[pattern] = 0);
        
        files.forEach(file => {
            const basename = path.basename(file, path.extname(file));
            Object.entries(patterns).forEach(([name, regex]) => {
                if (regex.test(basename)) {
                    counts[name]++;
                }
            });
        });
        
        // 找出主要命名约定
        const maxCount = Math.max(...Object.values(counts));
        Object.entries(counts).forEach(([name, count]) => {
            if (count === maxCount && count > 0) {
                conventions.push(name);
            }
        });
        
        return conventions;
    }

    /**
     * 获取所有文件
     */
    getAllFiles(dir = this.projectPath, files = []) {
        const ignoreDirs = ['node_modules', '.git', 'dist', 'build'];
        
        try {
            const items = fs.readdirSync(dir);
            for (const item of items) {
                if (item.startsWith('.') && !item.startsWith('.ai-')) continue;
                if (ignoreDirs.includes(item)) continue;
                
                const itemPath = path.join(dir, item);
                const stat = fs.statSync(itemPath);
                
                if (stat.isFile()) {
                    files.push(itemPath);
                } else if (stat.isDirectory()) {
                    this.getAllFiles(itemPath, files);
                }
            }
        } catch (error) {
            // 忽略错误
        }
        
        return files;
    }

    /**
     * 分析技术栈
     */
    async analyzeTechStack() {
        const techStack = {
            languages: [],
            frameworks: [],
            libraries: [],
            tools: [],
            runtime: 'unknown'
        };
        
        // 分析package.json
        if (fs.existsSync('package.json')) {
            const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
            techStack.runtime = 'Node.js';
            
            // 分析依赖
            const allDeps = { ...pkg.dependencies, ...pkg.devDependencies };
            
            // 检测语言
            if (allDeps.typescript || fs.existsSync('tsconfig.json')) {
                techStack.languages.push('TypeScript');
            } else {
                techStack.languages.push('JavaScript');
            }
            
            // 检测框架
            const frameworks = {
                'react': 'React',
                'next': 'Next.js',
                'vue': 'Vue.js',
                '@angular/core': 'Angular',
                'express': 'Express.js',
                'koa': 'Koa.js',
                '@nestjs/core': 'NestJS'
            };
            
            Object.entries(frameworks).forEach(([dep, name]) => {
                if (allDeps[dep]) {
                    techStack.frameworks.push(name);
                }
            });
            
            // 检测主要库
            const importantLibs = [
                'lodash', 'axios', 'moment', 'dayjs', 'jquery',
                'redux', 'mobx', 'rxjs', 'mongoose', 'sequelize'
            ];
            
            importantLibs.forEach(lib => {
                if (allDeps[lib]) {
                    techStack.libraries.push(lib);
                }
            });
            
            // 检测工具
            const tools = {
                'webpack': 'Webpack',
                'vite': 'Vite',
                'rollup': 'Rollup',
                'babel': 'Babel',
                'eslint': 'ESLint',
                'prettier': 'Prettier',
                'jest': 'Jest',
                'mocha': 'Mocha',
                'cypress': 'Cypress'
            };
            
            Object.entries(tools).forEach(([dep, name]) => {
                if (allDeps[dep]) {
                    techStack.tools.push(name);
                }
            });
        }
        
        // 分析Python项目
        if (fs.existsSync('requirements.txt') || fs.existsSync('pyproject.toml')) {
            techStack.runtime = 'Python';
            techStack.languages.push('Python');
        }
        
        return techStack;
    }

    /**
     * 识别关键文件
     */
    async identifyKeyFiles() {
        const keyFiles = {
            entry: [],
            config: [],
            documentation: [],
            tests: [],
            build: []
        };
        
        const files = fs.readdirSync(this.projectPath);
        
        // 入口文件
        const entryFiles = ['index.js', 'index.ts', 'main.js', 'main.ts', 'app.js', 'app.ts', 'server.js'];
        entryFiles.forEach(file => {
            if (files.includes(file)) {
                keyFiles.entry.push(file);
            }
        });
        
        // 配置文件
        const configFiles = [
            'package.json', 'tsconfig.json', 'webpack.config.js', 'vite.config.js',
            'next.config.js', 'tailwind.config.js', 'jest.config.js',
            '.eslintrc.js', '.prettierrc', '.gitignore', '.env.example'
        ];
        configFiles.forEach(file => {
            if (files.includes(file)) {
                keyFiles.config.push(file);
            }
        });
        
        // 文档文件
        const docFiles = ['README.md', 'CHANGELOG.md', 'LICENSE', 'CONTRIBUTING.md'];
        docFiles.forEach(file => {
            if (files.includes(file)) {
                keyFiles.documentation.push(file);
            }
        });
        
        // 测试文件
        files.forEach(file => {
            if (file.includes('.test.') || file.includes('.spec.') || file === 'jest.setup.js') {
                keyFiles.tests.push(file);
            }
        });
        
        // 构建文件
        const buildFiles = ['Dockerfile', 'docker-compose.yml', 'Makefile', '.github'];
        buildFiles.forEach(file => {
            if (files.includes(file)) {
                keyFiles.build.push(file);
            }
        });
        
        return keyFiles;
    }

    /**
     * 计算项目指标
     */
    async calculateProjectMetrics() {
        const metrics = {
            totalFiles: 0,
            totalLines: 0,
            lastModified: null,
            fileTypes: {},
            complexity: 'unknown'
        };
        
        const files = this.getAllFiles();
        metrics.totalFiles = files.length;
        
        let latestModified = 0;
        
        files.forEach(file => {
            try {
                const stat = fs.statSync(file);
                
                // 更新最后修改时间
                if (stat.mtime.getTime() > latestModified) {
                    latestModified = stat.mtime.getTime();
                    metrics.lastModified = stat.mtime.toISOString();
                }
                
                // 统计文件类型
                const ext = path.extname(file).toLowerCase();
                if (ext) {
                    metrics.fileTypes[ext] = (metrics.fileTypes[ext] || 0) + 1;
                }
                
                // 计算代码行数（仅代码文件）
                if (this.isCodeFile(file)) {
                    const content = fs.readFileSync(file, 'utf8');
                    metrics.totalLines += content.split('\n').length;
                }
            } catch (error) {
                // 忽略错误
            }
        });
        
        // 估算复杂度
        metrics.complexity = this.estimateComplexity(metrics.totalFiles, metrics.totalLines);
        
        return metrics;
    }

    /**
     * 判断是否为代码文件
     */
    isCodeFile(filePath) {
        const codeExtensions = [
            '.js', '.ts', '.jsx', '.tsx', '.py', '.java', '.c', '.cpp',
            '.cs', '.php', '.rb', '.go', '.rs', '.swift', '.kt', '.vue'
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
     * 生成概览Markdown
     */
    generateOverviewMarkdown(overview) {
        const lines = [];
        
        lines.push('# 📊 项目概览\n');
        lines.push(`**项目名称**: ${overview.metadata.name}`);
        lines.push(`**最后更新**: ${overview.metadata.lastUpdated}`);
        lines.push('');
        
        // 技术栈
        lines.push('## 🛠️ 技术栈\n');
        lines.push(`**运行时**: ${overview.techStack.runtime}`);
        if (overview.techStack.languages.length > 0) {
            lines.push(`**语言**: ${overview.techStack.languages.join(', ')}`);
        }
        if (overview.techStack.frameworks.length > 0) {
            lines.push(`**框架**: ${overview.techStack.frameworks.join(', ')}`);
        }
        if (overview.techStack.libraries.length > 0) {
            lines.push(`**主要库**: ${overview.techStack.libraries.join(', ')}`);
        }
        lines.push('');
        
        // 项目结构
        lines.push('## 📁 项目结构\n');
        Object.entries(overview.structure.directories).forEach(([dir, info]) => {
            lines.push(`- **${dir}/** - ${info.purpose} (${info.fileCount} 文件)`);
        });
        lines.push('');
        
        if (overview.structure.patterns.length > 0) {
            lines.push('**架构模式**: ' + overview.structure.patterns.join(', '));
            lines.push('');
        }
        
        // 关键文件
        lines.push('## 🔑 关键文件\n');
        Object.entries(overview.keyFiles).forEach(([category, files]) => {
            if (files.length > 0) {
                const categoryNames = {
                    entry: '入口文件',
                    config: '配置文件',
                    documentation: '文档文件',
                    tests: '测试文件',
                    build: '构建文件'
                };
                lines.push(`**${categoryNames[category]}**: ${files.join(', ')}`);
            }
        });
        lines.push('');
        
        // 项目指标
        lines.push('## 📈 项目指标\n');
        lines.push(`- 总文件数: ${overview.metrics.totalFiles}`);
        lines.push(`- 代码行数: ${overview.metrics.totalLines}`);
        lines.push(`- 复杂度: ${overview.metrics.complexity}`);
        if (overview.metrics.lastModified) {
            lines.push(`- 最后修改: ${new Date(overview.metrics.lastModified).toLocaleString()}`);
        }
        lines.push('');
        
        lines.push('---\n*由AI开发辅助系统自动生成*');
        
        return lines.join('\n');
    }

    /**
     * 更新组件映射
     */
    async updateComponentsMap() {
        console.log('🧩 更新组件映射...');
        
        const componentsMap = {
            lastUpdated: new Date().toISOString(),
            components: {},
            relationships: {},
            exports: {},
            imports: {}
        };
        
        // 查找组件文件
        const componentDirs = ['src/components', 'components', 'src', 'lib'];
        
        for (const dir of componentDirs) {
            if (fs.existsSync(dir)) {
                await this.scanComponentsInDir(dir, componentsMap);
            }
        }
        
        const mapPath = path.join(this.contextDir, 'components-map.json');
        fs.writeFileSync(mapPath, JSON.stringify(componentsMap, null, 2));
    }

    /**
     * 扫描目录中的组件
     */
    async scanComponentsInDir(dir, componentsMap) {
        try {
            const items = fs.readdirSync(dir);
            
            for (const item of items) {
                const itemPath = path.join(dir, item);
                const stat = fs.statSync(itemPath);
                
                if (stat.isDirectory()) {
                    await this.scanComponentsInDir(itemPath, componentsMap);
                } else if (this.isComponentFile(item)) {
                    const componentInfo = await this.analyzeComponent(itemPath);
                    if (componentInfo) {
                        const relativePath = path.relative(this.projectPath, itemPath);
                        componentsMap.components[relativePath] = componentInfo;
                    }
                }
            }
        } catch (error) {
            // 忽略错误
        }
    }

    /**
     * 判断是否为组件文件
     */
    isComponentFile(filename) {
        const componentExtensions = ['.js', '.jsx', '.ts', '.tsx', '.vue'];
        const ext = path.extname(filename);
        return componentExtensions.includes(ext);
    }

    /**
     * 分析组件
     */
    async analyzeComponent(filePath) {
        try {
            const content = fs.readFileSync(filePath, 'utf8');
            const info = {
                name: this.extractComponentName(filePath, content),
                type: this.detectComponentType(content),
                exports: this.extractExports(content),
                imports: this.extractImports(content),
                props: this.extractProps(content),
                hooks: this.extractHooks(content),
                size: content.length,
                complexity: this.assessComponentComplexity(content)
            };
            
            return info;
        } catch (error) {
            console.warn(`无法分析组件 ${filePath}:`, error.message);
            return null;
        }
    }

    /**
     * 提取组件名称
     */
    extractComponentName(filePath, content) {
        const filename = path.basename(filePath, path.extname(filePath));
        
        // 尝试从文件内容中提取
        const matches = content.match(/(?:function|const|class)\s+([A-Z][A-Za-z0-9_]*)/);
        if (matches) {
            return matches[1];
        }
        
        // 使用文件名
        return filename;
    }

    /**
     * 检测组件类型
     */
    detectComponentType(content) {
        if (content.includes('class') && content.includes('extends')) {
            return 'class';
        }
        if (content.includes('function') || content.includes('const') && content.includes('=>')) {
            return 'functional';
        }
        return 'unknown';
    }

    /**
     * 提取导出
     */
    extractExports(content) {
        const exports = [];
        
        // 默认导出
        const defaultExport = content.match(/export\s+default\s+([A-Za-z0-9_]+)/);
        if (defaultExport) {
            exports.push({ type: 'default', name: defaultExport[1] });
        }
        
        // 命名导出
        const namedExports = content.match(/export\s+{([^}]+)}/g);
        if (namedExports) {
            namedExports.forEach(exp => {
                const names = exp.match(/{([^}]+)}/)[1].split(',');
                names.forEach(name => {
                    exports.push({ type: 'named', name: name.trim() });
                });
            });
        }
        
        return exports;
    }

    /**
     * 提取导入
     */
    extractImports(content) {
        const imports = [];
        const importRegex = /import\s+.*?\s+from\s+['"`]([^'"`]+)['"`]/g;
        let match;
        
        while ((match = importRegex.exec(content)) !== null) {
            imports.push(match[1]);
        }
        
        return imports;
    }

    /**
     * 提取Props
     */
    extractProps(content) {
        const props = [];
        
        // TypeScript接口
        const interfaceMatch = content.match(/interface\s+\w*Props\s*{([^}]+)}/);
        if (interfaceMatch) {
            const propsContent = interfaceMatch[1];
            const propMatches = propsContent.match(/(\w+):\s*([^;]+)/g);
            if (propMatches) {
                propMatches.forEach(prop => {
                    const [name, type] = prop.split(':').map(s => s.trim());
                    props.push({ name, type: type.replace(';', '') });
                });
            }
        }
        
        return props;
    }

    /**
     * 提取Hooks
     */
    extractHooks(content) {
        const hooks = [];
        const hookRegex = /use[A-Z][A-Za-z0-9]*/g;
        const matches = content.match(hookRegex);
        
        if (matches) {
            // 去重
            const uniqueHooks = [...new Set(matches)];
            hooks.push(...uniqueHooks);
        }
        
        return hooks;
    }

    /**
     * 评估组件复杂度
     */
    assessComponentComplexity(content) {
        const lines = content.split('\n').length;
        const cyclomaticComplexity = (content.match(/if|for|while|switch|catch/g) || []).length;
        
        if (lines > 200 || cyclomaticComplexity > 10) return 'high';
        if (lines > 100 || cyclomaticComplexity > 5) return 'medium';
        return 'low';
    }

    /**
     * 更新依赖图
     */
    async updateDependencyGraph() {
        console.log('🔗 更新依赖图...');
        
        const dependencyGraph = {
            lastUpdated: new Date().toISOString(),
            nodes: {},
            edges: [],
            clusters: {}
        };
        
        // 分析文件依赖关系
        const files = this.getAllFiles().filter(file => this.isCodeFile(file));
        
        for (const file of files) {
            try {
                const content = fs.readFileSync(file, 'utf8');
                const relativePath = path.relative(this.projectPath, file);
                
                dependencyGraph.nodes[relativePath] = {
                    type: this.getFileType(file),
                    size: content.length,
                    exports: this.extractExports(content),
                    imports: this.extractImports(content)
                };
                
                // 分析内部依赖
                const internalImports = this.extractInternalImports(content, file);
                internalImports.forEach(importPath => {
                    dependencyGraph.edges.push({
                        from: relativePath,
                        to: importPath,
                        type: 'import'
                    });
                });
                
            } catch (error) {
                console.warn(`无法分析文件 ${file}:`, error.message);
            }
        }
        
        const graphPath = path.join(this.contextDir, 'dependency-graph.json');
        fs.writeFileSync(graphPath, JSON.stringify(dependencyGraph, null, 2));
    }

    /**
     * 提取内部导入
     */
    extractInternalImports(content, currentFile) {
        const imports = [];
        const importRegex = /import\s+.*?\s+from\s+['"`]([^'"`]+)['"`]/g;
        let match;
        
        while ((match = importRegex.exec(content)) !== null) {
            const importPath = match[1];
            
            // 只处理相对导入
            if (importPath.startsWith('.')) {
                const resolvedPath = this.resolveImportPath(importPath, currentFile);
                if (resolvedPath) {
                    imports.push(resolvedPath);
                }
            }
        }
        
        return imports;
    }

    /**
     * 解析导入路径
     */
    resolveImportPath(importPath, currentFile) {
        const currentDir = path.dirname(currentFile);
        const absolutePath = path.resolve(currentDir, importPath);
        
        // 尝试不同的扩展名
        const extensions = ['.js', '.ts', '.jsx', '.tsx', '.vue'];
        
        for (const ext of extensions) {
            const fullPath = absolutePath + ext;
            if (fs.existsSync(fullPath)) {
                return path.relative(this.projectPath, fullPath);
            }
        }
        
        // 尝试index文件
        for (const ext of extensions) {
            const indexPath = path.join(absolutePath, 'index' + ext);
            if (fs.existsSync(indexPath)) {
                return path.relative(this.projectPath, indexPath);
            }
        }
        
        return null;
    }

    /**
     * 获取文件类型
     */
    getFileType(filePath) {
        const ext = path.extname(filePath).toLowerCase();
        const dirname = path.dirname(filePath).toLowerCase();
        
        if (dirname.includes('component')) return 'component';
        if (dirname.includes('page')) return 'page';
        if (dirname.includes('api')) return 'api';
        if (dirname.includes('util') || dirname.includes('helper')) return 'utility';
        if (dirname.includes('service')) return 'service';
        if (dirname.includes('model')) return 'model';
        if (dirname.includes('type')) return 'types';
        if (dirname.includes('test') || filePath.includes('.test.') || filePath.includes('.spec.')) return 'test';
        
        return 'unknown';
    }

    /**
     * 更新最近变更
     */
    async updateRecentChanges() {
        console.log('📝 更新最近变更...');
        
        const changes = {
            lastUpdated: new Date().toISOString(),
            recentFiles: [],
            summary: {}
        };
        
        // 获取最近修改的文件
        const files = this.getAllFiles();
        const fileStats = [];
        
        files.forEach(file => {
            try {
                const stat = fs.statSync(file);
                fileStats.push({
                    path: path.relative(this.projectPath, file),
                    modified: stat.mtime,
                    size: stat.size
                });
            } catch (error) {
                // 忽略错误
            }
        });
        
        // 按修改时间排序，取最近20个
        fileStats.sort((a, b) => b.modified - a.modified);
        changes.recentFiles = fileStats.slice(0, 20).map(file => ({
            ...file,
            modified: file.modified.toISOString()
        }));
        
        // 生成摘要
        const now = new Date();
        const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        
        changes.summary = {
            lastDay: fileStats.filter(f => f.modified > oneDayAgo).length,
            lastWeek: fileStats.filter(f => f.modified > oneWeekAgo).length,
            total: fileStats.length
        };
        
        const changesPath = path.join(this.contextDir, 'recent-changes.json');
        fs.writeFileSync(changesPath, JSON.stringify(changes, null, 2));
    }

    /**
     * 更新开发焦点
     */
    async updateDevelopmentFocus() {
        console.log('🎯 更新开发焦点...');
        
        const focus = {
            lastUpdated: new Date().toISOString(),
            currentPhase: 'development',
            priorities: [],
            recommendations: [],
            metrics: {}
        };
        
        // 读取现有配置
        const configPath = path.join(this.configDir, 'dev-focus.json');
        if (fs.existsSync(configPath)) {
            try {
                const existingConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
                focus.currentPhase = existingConfig.currentFocus || 'development';
                focus.priorities = existingConfig.priorities || [];
            } catch (error) {
                console.warn('无法读取现有焦点配置:', error.message);
            }
        }
        
        // 基于项目分析生成建议
        focus.recommendations = await this.generateDevelopmentRecommendations();
        
        // 计算开发指标
        focus.metrics = await this.calculateDevelopmentMetrics();
        
        fs.writeFileSync(configPath, JSON.stringify(focus, null, 2));
    }

    /**
     * 生成开发建议
     */
    async generateDevelopmentRecommendations() {
        const recommendations = [];
        
        // 检查测试覆盖
        if (!this.hasTests()) {
            recommendations.push({
                type: 'testing',
                priority: 'high',
                message: '建议添加单元测试和集成测试'
            });
        }
        
        // 检查文档
        if (!fs.existsSync('README.md')) {
            recommendations.push({
                type: 'documentation',
                priority: 'medium',
                message: '建议添加项目文档'
            });
        }
        
        // 检查类型安全
        if (this.hasJavaScript() && !this.hasTypeScript()) {
            recommendations.push({
                type: 'type-safety',
                priority: 'medium',
                message: '考虑迁移到TypeScript以提高类型安全'
            });
        }
        
        // 检查性能
        const metrics = await this.calculateProjectMetrics();
        if (metrics.complexity === 'high') {
            recommendations.push({
                type: 'performance',
                priority: 'medium',
                message: '项目复杂度较高，建议进行代码重构'
            });
        }
        
        return recommendations;
    }

    /**
     * 检查是否有测试
     */
    hasTests() {
        const testDirs = ['test', 'tests', '__tests__', 'spec'];
        const hasTestDir = testDirs.some(dir => fs.existsSync(dir));
        
        if (hasTestDir) return true;
        
        // 检查测试文件
        const files = this.getAllFiles();
        return files.some(file => 
            file.includes('.test.') || 
            file.includes('.spec.') ||
            path.basename(file).startsWith('test.')
        );
    }

    /**
     * 检查是否有JavaScript
     */
    hasJavaScript() {
        const files = this.getAllFiles();
        return files.some(file => path.extname(file) === '.js' || path.extname(file) === '.jsx');
    }

    /**
     * 检查是否有TypeScript
     */
    hasTypeScript() {
        return fs.existsSync('tsconfig.json') || this.getAllFiles().some(file => 
            path.extname(file) === '.ts' || path.extname(file) === '.tsx'
        );
    }

    /**
     * 计算开发指标
     */
    async calculateDevelopmentMetrics() {
        const files = this.getAllFiles();
        
        return {
            totalFiles: files.length,
            codeFiles: files.filter(file => this.isCodeFile(file)).length,
            testFiles: files.filter(file => 
                file.includes('.test.') || 
                file.includes('.spec.')
            ).length,
            configFiles: files.filter(file => 
                file.includes('config') || 
                file.endsWith('.json') ||
                file.endsWith('.yml') ||
                file.endsWith('.yaml')
            ).length,
            hasDocumentation: fs.existsSync('README.md'),
            hasTypeScript: this.hasTypeScript(),
            hasTesting: this.hasTests()
        };
    }

    /**
     * 获取上下文摘要
     */
    async getContextSummary() {
        const summaryPath = path.join(this.contextDir, 'context-summary.json');
        
        if (fs.existsSync(summaryPath)) {
            try {
                return JSON.parse(fs.readFileSync(summaryPath, 'utf8'));
            } catch (error) {
                console.warn('无法读取上下文摘要:', error.message);
            }
        }
        
        // 生成新的摘要
        return await this.generateContextSummary();
    }

    /**
     * 生成上下文摘要
     */
    async generateContextSummary() {
        const summary = {
            lastUpdated: new Date().toISOString(),
            project: {
                name: path.basename(this.projectPath),
                type: 'unknown',
                complexity: 'unknown'
            },
            health: {
                score: 0,
                issues: [],
                strengths: []
            },
            recommendations: []
        };
        
        // 读取其他上下文文件
        try {
            const overviewPath = path.join(this.contextDir, 'project-overview.json');
            if (fs.existsSync(overviewPath)) {
                const overview = JSON.parse(fs.readFileSync(overviewPath, 'utf8'));
                summary.project.type = overview.techStack.runtime;
                summary.project.complexity = overview.metrics.complexity;
            }
            
            const focusPath = path.join(this.configDir, 'dev-focus.json');
            if (fs.existsSync(focusPath)) {
                const focus = JSON.parse(fs.readFileSync(focusPath, 'utf8'));
                summary.recommendations = focus.recommendations || [];
            }
        } catch (error) {
            console.warn('读取上下文文件时出错:', error.message);
        }
        
        // 保存摘要
        const summaryPath = path.join(this.contextDir, 'context-summary.json');
        fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));
        
        return summary;
    }

    /**
     * 清理临时文件和缓存
     */
    async cleanup() {
        console.log('🧹 开始清理系统文件...');
        
        try {
            const tempFiles = [
                'temp-analysis.json',
                'analysis-cache.json',
                'temp-overview.json'
            ];
            
            let cleanedCount = 0;
            
            // 清理临时文件
            tempFiles.forEach(file => {
                const filePath = path.join(this.dataDir, file);
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                    cleanedCount++;
                    console.log(`🗑️ 删除临时文件: ${file}`);
                }
            });
            
            // 清理过期的分析结果（超过7天）
            const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
            
            if (fs.existsSync(this.dataDir)) {
                const files = fs.readdirSync(this.dataDir);
                files.forEach(file => {
                    const filePath = path.join(this.dataDir, file);
                    const stats = fs.statSync(filePath);
                    
                    if (file.startsWith('analysis-') && file.endsWith('.json') && stats.mtime.getTime() < sevenDaysAgo) {
                        fs.unlinkSync(filePath);
                        cleanedCount++;
                        console.log(`🗑️ 删除过期文件: ${file}`);
                    }
                });
            }
            
            if (cleanedCount === 0) {
                console.log('✨ 没有需要清理的文件');
            } else {
                console.log(`✅ 清理完成，删除了 ${cleanedCount} 个文件`);
            }
            
            return { success: true, cleanedFiles: cleanedCount };
        } catch (error) {
            console.error('❌ 清理过程中出现错误:', error.message);
            throw error;
        }
    }
}

// 如果直接运行此文件
if (require.main === module) {
    async function main() {
        const manager = new ContextManager();
        try {
            await manager.updateContext();
            console.log('\n🎉 上下文更新完成！');
            console.log('📁 查看结果:');
            console.log('   - .ai-dev-assistant/context/project-overview.md');
            console.log('   - .ai-dev-assistant/context/components-map.json');
            console.log('   - .ai-dev-assistant/context/dependency-graph.json');
        } catch (error) {
            console.error('上下文更新失败:', error.message);
            process.exit(1);
        }
    }
    
    main();
}

module.exports = ContextManager;
