# Contributing to AI开发辅助系统

感谢你对AI开发辅助系统的关注！我们欢迎所有形式的贡献。

## 🤝 如何贡献

### 报告Bug
1. 检查是否已有相关Issue
2. 使用Bug报告模板
3. 提供详细的重现步骤
4. 包含系统环境信息

### 功能建议
1. 检查是否已有相关讨论
2. 使用功能请求模板
3. 详细描述使用场景
4. 说明预期行为

### 代码贡献
1. Fork项目
2. 创建特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交变更 (`git commit -m 'Add amazing feature'`)
4. 推送分支 (`git push origin feature/amazing-feature`)
5. 创建Pull Request

## 📋 开发环境

### 必要条件
- Node.js >= 14.0.0
- Git
- 支持Bash的终端

### 本地开发
```bash
# 克隆项目
git clone https://github.com/your-username/ai-dev-assistant.git
cd ai-dev-assistant

# 安装依赖
npm install

# 运行测试
npm test

# 在测试项目中验证
mkdir test-project && cd test-project
../install.sh
../bin/ai-dev init
```

## 🏗️ 项目结构

```
ai-dev-assistant/
├── bin/              # CLI可执行文件
├── src/              # 核心源代码
├── templates/        # 项目模板
├── config/           # 默认配置
├── tests/            # 测试文件
├── docs/             # 文档
└── scripts/          # 构建脚本
```

## 🎯 代码规范

### JavaScript代码
- 使用ES6+语法
- 遵循Standard JS风格
- 添加适当的注释
- 包含错误处理

### 文档
- 使用Markdown格式
- 包含代码示例
- 保持中英文双语
- 更新相关文档

### 提交信息
- 使用清晰的提交信息
- 格式：`type(scope): description`
- 类型：feat, fix, docs, style, refactor, test

## 🧪 测试要求

### 单元测试
- 为新功能添加测试
- 确保测试覆盖率 > 80%
- 测试文件命名：`*.test.js`

### 集成测试
- 测试完整工作流
- 验证多个项目类型
- 测试错误处理

### 手动测试
- 在真实项目中验证
- 测试不同操作系统
- 验证向后兼容性

## 🔍 Pull Request检查清单

- [ ] 代码通过所有测试
- [ ] 添加必要的测试用例
- [ ] 更新相关文档
- [ ] 代码遵循项目规范
- [ ] 提交信息清晰明确
- [ ] 无冲突需要解决

## 🏷️ 版本发布

### 版本号规则
遵循语义化版本控制 (SemVer)：
- MAJOR.MINOR.PATCH
- 破坏性变更：MAJOR
- 新功能：MINOR
- Bug修复：PATCH

### 发布流程
1. 更新版本号
2. 更新CHANGELOG.md
3. 创建Git标签
4. 发布GitHub Release
5. 发布NPM包

## 🆘 获取帮助

- 📖 查看[文档](./README.md)
- 💬 参与[讨论](https://github.com/your-username/ai-dev-assistant/discussions)
- 🐛 报告[问题](https://github.com/your-username/ai-dev-assistant/issues)
- 📧 联系维护者

## 🌟 贡献者

感谢所有贡献者的努力！你的名字将出现在[贡献者列表](https://github.com/your-username/ai-dev-assistant/graphs/contributors)中。

---

再次感谢你的贡献！让我们一起让AI开发辅助系统变得更好！
