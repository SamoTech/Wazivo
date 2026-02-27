# Contributing to Wazivo 💙

First off, thank you for considering contributing to Wazivo! It's people like you that make Wazivo such a great tool.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)

## 📜 Code of Conduct

This project and everyone participating in it is governed by our commitment to creating a welcoming and respectful environment. By participating, you are expected to uphold this standard.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Git
- A GitHub account
- A Groq API key (free at [console.groq.com](https://console.groq.com))

### Setup

1. **Fork the repository** on GitHub

2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR-USERNAME/Wazivo.git
   cd Wazivo
   ```

3. **Add upstream remote**
   ```bash
   git remote add upstream https://github.com/SamoTech/Wazivo.git
   ```

4. **Install dependencies**
   ```bash
   npm install
   ```

5. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env and add your GROQ_API_KEY
   ```

6. **Run development server**
   ```bash
   npm run dev
   ```

## 🤝 How Can I Contribute?

### Reporting Bugs 🐛

Before creating bug reports, please check existing issues. When you create a bug report, include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples**
- **Describe the behavior you observed and expected**
- **Include screenshots if relevant**
- **Include your environment** (OS, browser, Node version)

### Suggesting Enhancements 💡

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion:

- **Use a clear and descriptive title**
- **Provide a step-by-step description** of the suggested enhancement
- **Explain why this enhancement would be useful**
- **List any similar features** in other applications

### Contributing Code 💻

Look for issues labeled:
- `good first issue` - Great for newcomers
- `help wanted` - Issues where we need help
- `bug` - Bug fixes needed
- `enhancement` - New features

## 🔧 Development Workflow

### 1. Create a Branch

```bash
# Update your local main
git checkout main
git pull upstream main

# Create a feature branch
git checkout -b feature/amazing-feature
# or
git checkout -b fix/bug-description
```

### 2. Make Your Changes

- Write clean, maintainable code
- Follow the coding standards (see below)
- Add tests for new functionality
- Update documentation if needed

### 3. Test Your Changes

```bash
# Run unit tests
npm test

# Run linter
npm run lint

# Run type checker
npm run type-check

# Test locally
npm run dev
```

### 4. Commit Your Changes

Follow our [commit guidelines](#commit-guidelines).

```bash
git add .
git commit -m "✨ Add amazing feature"
```

### 5. Push and Create Pull Request

```bash
git push origin feature/amazing-feature
```

Then create a Pull Request on GitHub.

## 📐 Coding Standards

### TypeScript

- Use TypeScript for all new code
- Avoid `any` types - use proper typing
- Use interfaces for object shapes
- Use enums for fixed sets of values

### React Components

- Use functional components with hooks
- Keep components small and focused
- Extract reusable logic into custom hooks
- Use meaningful component and prop names

### File Organization

```
src/app/
├── components/     # React components
├── lib/           # Business logic
├── config/        # Configuration
├── types/         # TypeScript types
└── api/           # API routes
```

### Naming Conventions

- **Components**: PascalCase (`FileUpload.tsx`)
- **Utilities**: camelCase (`validation.ts`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_FILE_SIZE`)
- **Types/Interfaces**: PascalCase (`AnalysisReport`)

### Code Style

- Use 2 spaces for indentation
- Use single quotes for strings
- Add semicolons
- Max line length: 100 characters
- Use arrow functions for callbacks

```typescript
// Good ✅
const handleClick = (event: React.MouseEvent) => {
  console.log('Clicked!');
};

// Bad ❌
function handleClick(event) {
  console.log("Clicked!")
}
```

## 📝 Commit Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/):

### Format

```
<type>(<scope>): <subject>
```

### Types

- ✨ `feat`: New feature
- 🐛 `fix`: Bug fix
- 📝 `docs`: Documentation changes
- 💄 `style`: Code style changes (formatting, no logic change)
- ♻️ `refactor`: Code refactoring
- ⚡ `perf`: Performance improvements
- ✅ `test`: Adding or updating tests
- 🔧 `chore`: Maintenance tasks
- 🚀 `deploy`: Deployment-related changes

### Examples

```bash
✨ feat(upload): Add drag and drop support
🐛 fix(parser): Handle edge case in PDF parsing
📝 docs(readme): Update installation instructions
♻️ refactor(api): Simplify error handling logic
✅ test(validation): Add URL validation tests
```

## 🔄 Pull Request Process

### Before Submitting

- [ ] Code follows the style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] Tests added/updated
- [ ] All tests pass
- [ ] No console errors or warnings
- [ ] Lint passes
- [ ] Branch is up to date with main

### PR Title Format

Follow commit convention:

```
✨ feat: Add user profile page
🐛 fix: Resolve upload timeout issue
```

### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
How has this been tested?

## Screenshots (if applicable)

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-reviewed
- [ ] Commented complex code
- [ ] Documentation updated
- [ ] Tests added
- [ ] Tests pass
```

### Review Process

1. **Automated checks** must pass (tests, lint)
2. **Code review** by maintainer
3. **Changes requested** if needed
4. **Approval** and merge

### After Merge

- Your PR will be merged into `main`
- Changes will be automatically deployed to production
- You'll be added to contributors list! 🎉

## 🎯 Good First Issues

Looking for where to start? Check out issues labeled `good first issue`:

- Fix typos in documentation
- Add missing tests
- Improve error messages
- Add input validation
- Optimize performance

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Groq API Documentation](https://console.groq.com/docs)

## 💬 Questions?

Feel free to:

- Open a discussion on GitHub
- Comment on relevant issues
- Reach out to [@SamoTech](https://github.com/SamoTech)

## 🙏 Thank You!

Your contributions, no matter how small, make Wazivo better for everyone. Thank you for taking the time to contribute! ❤️

---

**Happy Coding!** 🚀
