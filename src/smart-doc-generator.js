/**
 * 智能文档生成器 - 基于AI分析自动生成项目文档
 * Smart Document Generator - AI-powered project documentation
 * Version: 1.2.0
 */

const fs = require('fs');
const path = require('path');

class SmartDocGenerator {
    constructor(projectPath) {
        this.projectPath = projectPath;
    }

    /**
     * 智能生成所有文档
     */
    async generateAllDocs(analysis, targetDir) {
        console.log('智能生成项目文档...');
        
        const docs = [];
        
        try {
            // 基于分析结果智能选择需要生成的文档
            const neededDocs = this.determineNeededDocs(analysis);
            
            for (const docType of neededDocs) {
                const docPath = await this.generateDoc(docType, analysis, targetDir);
                if (docPath) docs.push(docPath);
            }
            
            console.log(`已生成 ${docs.length} 个文档`);
            return docs;
            
        } catch (error) {
            console.error('文档生成失败:', error.message);
            return [];
        }
    }

    /**
     * AI决定需要生成哪些文档
     */
    determineNeededDocs(analysis) {
        const docs = ['analysis-report']; // 基础分析报告
        
        // 基于项目特征智能决定
        if (this.isWebProject(analysis)) docs.push('deployment');
        if (this.isComplexProject(analysis)) docs.push('architecture');
        if (this.isDevelopmentProject(analysis)) docs.push('development');
        if (!this.hasReadme()) docs.push('readme');
        
        return docs;
    }

    /**
     * 生成单个文档
     */
    async generateDoc(docType, analysis, targetDir) {
        const generators = {
            'readme': () => this.generateSmartReadme(analysis),
            'analysis-report': () => this.generateAnalysisReport(analysis),
            'architecture': () => this.generateArchitectureDoc(analysis),
            'deployment': () => this.generateDeploymentDoc(analysis),
            'development': () => this.generateDevelopmentDoc(analysis)
        };

        const generator = generators[docType];
        if (!generator) return null;

        try {
            const content = generator();
            const fileName = this.getFileName(docType);
            const filePath = path.join(targetDir, fileName);
            
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`生成文档: ${fileName}`);
            
            return path.relative(this.projectPath, filePath);
        } catch (error) {
            console.warn(`${docType} 文档生成失败:`, error.message);
            return null;
        }
    }

    /**
     * 智能README生成 - 基于实际项目分析
     */
    generateSmartReadme(analysis) {
        const lines = [];
        
        // 基于实际项目数据动态生成
        lines.push(`# ${analysis.metadata.name}\n`);
        
        // 根据实际检测到的项目类型生成描述
        const actualDescription = this.generateRealDescription(analysis);
        lines.push(`${actualDescription}\n`);
        
        // 基于实际检测到的技术栈
        if (analysis.project.framework.length > 0) {
            lines.push('## Technology Stack\n');
            lines.push('Based on project analysis:\n');
            analysis.project.framework.forEach(tech => {
                lines.push(`- ${tech}`);
            });
            lines.push('');
        }
        
        // 根据实际项目结构生成快速开始
        const realQuickStart = this.generateRealQuickStart(analysis);
        if (realQuickStart) {
            lines.push('## Quick Start\n');
            lines.push(realQuickStart);
            lines.push('');
        }
        
        // 基于真实代码度量
        lines.push('## Project Metrics\n');
        lines.push(`- **Files**: ${analysis.codeMetrics.totalFiles.toLocaleString()}`);
        lines.push(`- **Lines of Code**: ${analysis.codeMetrics.totalLines.toLocaleString()}`);
        lines.push(`- **Project Type**: ${analysis.project.type}`);
        lines.push(`- **Primary Language**: ${analysis.project.language}`);
        lines.push('');
        
        lines.push('---\n*This README was intelligently generated based on actual project analysis*');
        
        return lines.join('\n');
    }

    /**
     * 基于实际项目生成真实描述
     */
    generateRealDescription(analysis) {
        const descriptions = [];
        
        // 基于实际文件结构分析
        if (analysis.project.type === 'wordpress') {
            if (analysis.structure.directories['wp-content/themes']) {
                descriptions.push('A WordPress website with custom themes');
            }
            if (analysis.structure.directories['wp-content/plugins']) {
                descriptions.push('featuring custom plugins');
            }
            if (analysis.structure.files['wp-config.php']) {
                descriptions.push('and configured database connection');
            }
        } else if (analysis.project.type === 'node') {
            const packageInfo = this.analyzePackageJson(analysis);
            if (packageInfo) {
                descriptions.push(`A Node.js ${packageInfo.type || 'application'}`);
                if (packageInfo.dependencies.length > 0) {
                    descriptions.push(`using ${packageInfo.dependencies.slice(0, 3).join(', ')}`);
                }
            }
        }
        
        return descriptions.join(' ') || `A ${analysis.project.type} project with ${analysis.codeMetrics.totalFiles} files`;
    }

    /**
     * 基于实际项目结构生成真实的快速开始指南
     */
    generateRealQuickStart(analysis) {
        const steps = [];
        
        if (analysis.project.type === 'wordpress') {
            steps.push('1. Configure database connection in wp-config.php');
            steps.push('2. Upload files to web server');
            steps.push('3. Run WordPress installation');
            
            // 基于实际检测到的内容
            if (analysis.structure.directories['wp-content/themes']) {
                steps.push('4. Activate custom theme in WordPress admin');
            }
            if (analysis.structure.directories['wp-content/plugins']) {
                steps.push('5. Enable required plugins');
            }
        } else if (analysis.project.type === 'node') {
            if (analysis.structure.files['package.json']) {
                steps.push('1. npm install');
                const packageData = this.getPackageJsonData(analysis);
                if (packageData && packageData.scripts) {
                    if (packageData.scripts.start) {
                        steps.push('2. npm start');
                    }
                    if (packageData.scripts.dev) {
                        steps.push('2. npm run dev');
                    }
                }
            }
        }
        
        return steps.length > 0 ? steps.join('\n') : null;
    }

    /**
     * 分析package.json内容
     */
    analyzePackageJson(analysis) {
        const packageFile = path.join(this.projectPath, 'package.json');
        if (fs.existsSync(packageFile)) {
            try {
                const content = fs.readFileSync(packageFile, 'utf8');
                const packageData = JSON.parse(content);
                return {
                    type: packageData.description ? 'application' : 'module',
                    dependencies: Object.keys(packageData.dependencies || {}),
                    scripts: packageData.scripts || {}
                };
            } catch (error) {
                return null;
            }
        }
        return null;
    }

    /**
     * 获取package.json数据
     */
    getPackageJsonData(analysis) {
        return this.analyzePackageJson(analysis);
    }

    /**
     * 智能分析报告生成
     */
    generateAnalysisReport(analysis) {
        const lines = [];
        
        lines.push(`# ${analysis.metadata.name} - Project Analysis Report\n`);
        lines.push(`**Analysis Time**: ${new Date().toLocaleString()}`);
        lines.push(`**Project Type**: ${analysis.project.type}`);
        lines.push(`**Quality Score**: ${analysis.quality.score}/100\n`);
        
        // Key Metrics
        lines.push('## Project Overview\n');
        lines.push(`- Total Files: ${analysis.codeMetrics.totalFiles.toLocaleString()}`);
        lines.push(`- Lines of Code: ${analysis.codeMetrics.totalLines.toLocaleString()}`);
        lines.push(`- Complexity: ${analysis.codeMetrics.complexity}\n`);
        
        // AI Recommendations
        if (analysis.quality.suggestions.length > 0) {
            lines.push('## AI Recommendations\n');
            analysis.quality.suggestions.slice(0, 5).forEach((suggestion, i) => {
                lines.push(`${i + 1}. ${suggestion}`);
            });
            lines.push('');
        }
        
        lines.push('---\n*Generated by AI Development Assistant*');
        
        return lines.join('\n');
    }

    /**
     * 基于实际项目分析功能
     */
    isWebProject(analysis) {
        const webTypes = ['wordpress', 'react', 'next-js', 'vue', 'laravel'];
        return webTypes.includes(analysis.project.type);
    }

    isComplexProject(analysis) {
        return analysis.codeMetrics.totalFiles > 100 || 
               analysis.codeMetrics.complexity === 'high';
    }

    isDevelopmentProject(analysis) {
        return analysis.project.type !== 'unknown' && 
               analysis.codeMetrics.totalFiles > 10;
    }

    hasReadme() {
        return fs.existsSync(path.join(this.projectPath, 'README.md'));
    }

    getFileName(docType) {
        const fileNames = {
            'readme': 'README.md',
            'analysis-report': 'Project-Analysis-Report.md',
            'architecture': 'Architecture-Documentation.md',
            'deployment': 'Deployment-Guide.md',
            'development': 'Development-Guide.md'
        };
        
        return fileNames[docType] || `${docType}.md`;
    }

    // 基于实际项目生成架构文档
    generateArchitectureDoc(analysis) {
        const lines = [];
        
        lines.push('# Architecture Documentation\n');
        lines.push(`**Project**: ${analysis.metadata.name}`);
        lines.push(`**Type**: ${analysis.project.type}`);
        lines.push(`**Analysis Date**: ${new Date().toLocaleString()}\n`);
        
        // 基于实际项目结构分析架构
        lines.push('## Project Structure Analysis\n');
        
        // 按实际目录结构生成
        const directories = Object.entries(analysis.structure.directories)
            .filter(([dir, info]) => info.fileCount > 0)
            .sort(([, a], [, b]) => b.fileCount - a.fileCount);
        
        if (directories.length > 0) {
            lines.push('### Directory Structure (by file count)\n');
            directories.slice(0, 15).forEach(([dirName, info]) => {
                lines.push(`**${dirName}/** (${info.fileCount} files)`);
                
                // 基于目录名和内容智能分析功能
                const functionality = this.analyzeDirFunctionality(dirName, analysis);
                if (functionality) {
                    lines.push(`- ${functionality}`);
                }
                lines.push('');
            });
        }
        
        // 基于实际文件分析架构模式
        lines.push('## Architecture Patterns\n');
        
        if (analysis.project.type === 'wordpress') {
            const patterns = this.analyzeWordPressPatterns(analysis);
            patterns.forEach(pattern => lines.push(`- ${pattern}`));
        } else if (analysis.project.type === 'node') {
            const patterns = this.analyzeNodePatterns(analysis);
            patterns.forEach(pattern => lines.push(`- ${pattern}`));
        }
        lines.push('');
        
        // 基于实际技术栈
        if (analysis.project.framework.length > 0) {
            lines.push('## Technology Stack\n');
            analysis.project.framework.forEach(tech => {
                lines.push(`- **${tech}**: Detected in project`);
            });
            lines.push('');
        }
        
        // 基于实际代码复杂度
        lines.push('## Complexity Analysis\n');
        lines.push(`- **Overall Complexity**: ${analysis.codeMetrics.complexity}`);
        lines.push(`- **Total Files**: ${analysis.codeMetrics.totalFiles.toLocaleString()}`);
        lines.push(`- **Lines of Code**: ${analysis.codeMetrics.totalLines.toLocaleString()}`);
        
        if (analysis.codeMetrics.complexity === 'high') {
            lines.push('\n⚠️ **High Complexity Detected**');
            lines.push('- Consider modular architecture');
            lines.push('- Implement separation of concerns');
            lines.push('- Use dependency injection patterns');
        }
        
        lines.push('\n---\n*Generated from actual project structure analysis*');
        
        return lines.join('\n');
    }

    /**
     * 基于实际目录分析功能
     */
    analyzeDirFunctionality(dirName, analysis) {
        const lowerDir = dirName.toLowerCase();
        
        // WordPress特定分析
        if (analysis.project.type === 'wordpress') {
            if (lowerDir.includes('theme')) return 'WordPress theme files - controls site appearance';
            if (lowerDir.includes('plugin')) return 'WordPress plugin files - extends functionality';
            if (lowerDir === 'wp-admin') return 'WordPress administration interface';
            if (lowerDir === 'wp-includes') return 'WordPress core functions and libraries';
            if (lowerDir === 'wp-content') return 'User-generated content and customizations';
            if (lowerDir.includes('upload')) return 'Media files and user uploads';
        }
        
        // 通用目录分析
        if (lowerDir.includes('src') || lowerDir.includes('source')) return 'Source code files';
        if (lowerDir.includes('lib') || lowerDir.includes('library')) return 'Library and utility functions';
        if (lowerDir.includes('asset') || lowerDir.includes('static')) return 'Static assets (CSS, JS, images)';
        if (lowerDir.includes('config')) return 'Configuration files';
        if (lowerDir.includes('test')) return 'Test files and testing utilities';
        if (lowerDir.includes('doc')) return 'Documentation files';
        if (lowerDir.includes('api')) return 'API endpoints and handlers';
        if (lowerDir.includes('component')) return 'Reusable components';
        if (lowerDir.includes('service')) return 'Service layer implementations';
        if (lowerDir.includes('model')) return 'Data models and schemas';
        if (lowerDir.includes('controller')) return 'Request handlers and controllers';
        if (lowerDir.includes('view')) return 'View templates and UI components';
        
        return null;
    }

    /**
     * 分析WordPress架构模式
     */
    analyzeWordPressPatterns(analysis) {
        const patterns = [];
        
        if (analysis.structure.directories['wp-content/themes']) {
            patterns.push('**Theme Architecture**: Separates presentation from content');
        }
        if (analysis.structure.directories['wp-content/plugins']) {
            patterns.push('**Plugin Architecture**: Modular functionality extensions');
        }
        if (analysis.structure.files['functions.php']) {
            patterns.push('**Hook System**: Event-driven programming model');
        }
        patterns.push('**MVC Pattern**: WordPress follows loose MVC architecture');
        
        return patterns;
    }

    /**
     * 分析Node.js架构模式
     */
    analyzeNodePatterns(analysis) {
        const patterns = [];
        
        const packageData = this.analyzePackageJson(analysis);
        if (packageData) {
            if (packageData.dependencies.includes('express')) {
                patterns.push('**Express.js**: Web application framework');
            }
            if (packageData.dependencies.includes('react')) {
                patterns.push('**React Architecture**: Component-based UI');
            }
            if (packageData.dependencies.includes('mongoose')) {
                patterns.push('**MongoDB Integration**: NoSQL database layer');
            }
        }
        
        if (analysis.structure.directories['routes']) {
            patterns.push('**Route-based Architecture**: URL-to-handler mapping');
        }
        if (analysis.structure.directories['models']) {
            patterns.push('**Model Layer**: Data abstraction layer');
        }
        if (analysis.structure.directories['controllers']) {
            patterns.push('**Controller Pattern**: Request handling logic');
        }
        
        return patterns;
    }

    generateDeploymentDoc(analysis) {
        const lines = [];
        
        lines.push('# Deployment Guide\n');
        lines.push(`**Project Type**: ${analysis.project.type}`);
        lines.push(`**Analyzed**: ${new Date().toLocaleString()}\n`);
        
        // 基于实际项目类型和检测到的文件生成部署指南
        if (analysis.project.type === 'wordpress') {
            lines.push('## WordPress Deployment\n');
            
            // 检查实际配置文件
            if (analysis.structure.files['wp-config.php']) {
                lines.push('### Database Configuration');
                lines.push('✅ wp-config.php detected');
                lines.push('- Update database credentials in wp-config.php');
                lines.push('- Ensure database server is accessible\n');
            } else {
                lines.push('### Database Configuration');
                lines.push('⚠️ wp-config.php not found');
                lines.push('- Create wp-config.php from wp-config-sample.php');
                lines.push('- Configure database credentials\n');
            }
            
            // 检查主题和插件
            if (analysis.structure.directories['wp-content/themes']) {
                const themeCount = Object.keys(analysis.structure.directories).filter(dir => 
                    dir.startsWith('wp-content/themes/')).length;
                lines.push('### Themes');
                lines.push(`✅ ${themeCount} theme(s) detected`);
                lines.push('- Upload theme files to wp-content/themes/');
                lines.push('- Activate theme in WordPress admin\n');
            }
            
            if (analysis.structure.directories['wp-content/plugins']) {
                const pluginCount = Object.keys(analysis.structure.directories).filter(dir => 
                    dir.startsWith('wp-content/plugins/')).length;
                lines.push('### Plugins');
                lines.push(`✅ ${pluginCount} plugin(s) detected`);
                lines.push('- Upload plugin files to wp-content/plugins/');
                lines.push('- Activate plugins in WordPress admin\n');
            }
            
            // 检查上传目录
            if (analysis.structure.directories['wp-content/uploads']) {
                lines.push('### Uploads Directory');
                lines.push('✅ Uploads directory exists');
                lines.push('- Ensure wp-content/uploads is writable (755 permissions)\n');
            }
            
        } else if (analysis.project.type === 'node') {
            lines.push('## Node.js Deployment\n');
            
            // 基于实际package.json
            const packageData = this.analyzePackageJson(analysis);
            if (packageData) {
                lines.push('### Dependencies');
                lines.push('✅ package.json detected');
                lines.push('```bash');
                lines.push('npm install');
                lines.push('```\n');
                
                if (packageData.scripts.build) {
                    lines.push('### Build');
                    lines.push('```bash');
                    lines.push('npm run build');
                    lines.push('```\n');
                }
                
                if (packageData.scripts.start) {
                    lines.push('### Start Application');
                    lines.push('```bash');
                    lines.push('npm start');
                    lines.push('```\n');
                }
            }
            
            // 检查环境配置
            if (analysis.structure.files['.env']) {
                lines.push('### Environment Configuration');
                lines.push('✅ .env file detected');
                lines.push('- Configure environment variables');
                lines.push('- Copy .env to production server\n');
            }
            
        } else {
            lines.push('## Generic Deployment\n');
            lines.push(`Project contains ${analysis.codeMetrics.totalFiles} files`);
            lines.push(`Primary language: ${analysis.project.language}`);
            lines.push('Deployment steps depend on your hosting environment.\n');
        }
        
        // 基于实际文件大小和复杂度给出建议
        if (analysis.codeMetrics.totalFiles > 1000) {
            lines.push('## Performance Considerations\n');
            lines.push(`⚠️ Large project detected (${analysis.codeMetrics.totalFiles.toLocaleString()} files)`);
            lines.push('- Consider using a CDN for static assets');
            lines.push('- Implement caching strategies');
            lines.push('- Monitor server resources\n');
        }
        
        lines.push('---\n*Generated based on actual project analysis*');
        
        return lines.join('\n');
    }

    generateDevelopmentDoc(analysis) {
        const lines = [];
        
        lines.push('# Development Guide\n');
        lines.push(`**Project**: ${analysis.metadata.name}`);
        lines.push(`**Type**: ${analysis.project.type}`);
        lines.push(`**Language**: ${analysis.project.language}\n`);
        
        // 基于实际环境要求
        lines.push('## Environment Requirements\n');
        
        if (analysis.project.type === 'wordpress') {
            lines.push('### WordPress Environment');
            lines.push('- **PHP**: 7.4 or higher');
            lines.push('- **MySQL**: 5.7 or higher (or MariaDB 10.3+)');
            lines.push('- **Web Server**: Apache or Nginx');
            
            if (analysis.structure.files['wp-config.php']) {
                lines.push('- **Configuration**: wp-config.php already configured');
            } else {
                lines.push('- **Configuration**: Set up wp-config.php');
            }
            
        } else if (analysis.project.type === 'node') {
            const packageData = this.analyzePackageJson(analysis);
            if (packageData) {
                lines.push('### Node.js Environment');
                lines.push('- **Node.js**: Latest LTS version recommended');
                lines.push('- **npm**: Comes with Node.js');
                
                // 基于实际依赖分析要求
                if (packageData.dependencies.length > 0) {
                    lines.push('\n### Key Dependencies');
                    packageData.dependencies.slice(0, 10).forEach(dep => {
                        lines.push(`- ${dep}`);
                    });
                }
            }
        }
        lines.push('');
        
        // 基于实际项目结构的开发工作流
        lines.push('## Development Workflow\n');
        
        if (analysis.project.type === 'wordpress') {
            lines.push('### WordPress Development');
            
            if (analysis.structure.directories['wp-content/themes']) {
                lines.push('#### Theme Development');
                lines.push('1. Navigate to wp-content/themes/');
                lines.push('2. Create or modify theme files');
                lines.push('3. Test changes in WordPress admin');
                lines.push('');
            }
            
            if (analysis.structure.directories['wp-content/plugins']) {
                lines.push('#### Plugin Development');
                lines.push('1. Navigate to wp-content/plugins/');
                lines.push('2. Create or modify plugin files');
                lines.push('3. Activate/test plugins in WordPress admin');
                lines.push('');
            }
            
        } else if (analysis.project.type === 'node') {
            const packageData = this.analyzePackageJson(analysis);
            if (packageData && packageData.scripts) {
                lines.push('### Available Scripts');
                Object.entries(packageData.scripts).forEach(([script, command]) => {
                    lines.push(`- **${script}**: \`npm run ${script}\``);
                    lines.push(`  - ${command}`);
                });
                lines.push('');
            }
        }
        
        // 基于实际代码质量给出开发建议
        lines.push('## Development Best Practices\n');
        
        if (analysis.quality.score < 70) {
            lines.push('### Code Quality Improvements');
            analysis.quality.suggestions.forEach(suggestion => {
                lines.push(`- ${suggestion}`);
            });
            lines.push('');
        }
        
        // 基于实际文件结构给出建议
        if (analysis.codeMetrics.totalFiles > 500) {
            lines.push('### Large Project Considerations');
            lines.push('- Use modular development approach');
            lines.push('- Implement proper file organization');
            lines.push('- Consider performance optimization');
            lines.push('');
        }
        
        // 基于实际项目给出工具建议
        lines.push('## Recommended Tools\n');
        
        if (analysis.project.type === 'wordpress') {
            lines.push('### WordPress Development Tools');
            lines.push('- **Local Development**: Local by Flywheel, XAMPP, or WAMP');
            lines.push('- **Code Editor**: VS Code with WordPress extensions');
            lines.push('- **Debugging**: Query Monitor plugin');
            lines.push('- **Version Control**: Git for theme/plugin development');
            
        } else if (analysis.project.type === 'node') {
            lines.push('### Node.js Development Tools');
            lines.push('- **Code Editor**: VS Code with Node.js extensions');
            lines.push('- **Package Manager**: npm or yarn');
            lines.push('- **Process Manager**: PM2 for production');
            lines.push('- **Testing**: Jest, Mocha, or similar');
        }
        
        lines.push('\n---\n*Generated based on actual project analysis*');
        
        return lines.join('\n');
    }

    // 简化的辅助方法
    generateDirectoryStructure(analysis) {
        const dirs = Object.keys(analysis.structure.directories);
        return dirs.slice(0, 10).map(dir => `- ${dir}/`).join('\n');
    }
}

module.exports = SmartDocGenerator;
