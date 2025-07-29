# 🚀 terrapi

> A simple CLI tool for Terraform project scaffolding

[![npm version](https://badge.fury.io/js/terrapi.svg)](https://badge.fury.io/js/terrapi)
[![CI/CD](https://github.com/iamdantz/terrapi/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/iamdantz/terrapi/actions/workflows/ci-cd.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen.svg)](https://nodejs.org/)

---

## 📋 Table of Contents

- [🎯 What is terrapi?](#-what-is-terrapi)
- [✨ Features](#-features)
- [🚀 Quick Start](#-quick-start)
- [📦 Installation](#-installation)
- [🎮 Usage](#-usage)
- [🏗️ Generated Project Structure](#️-generated-project-structure)
- [🌟 Examples](#-examples)
- [⚙️ Command Reference](#️-command-reference)
- [🛠️ Development](#️-development)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

---

## 🎯 What is terrapi?

**terrapi** is a simple CLI tool that helps you quickly scaffold well-structured Terraform projects. Whether you're working with AWS, Azure, or Google Cloud Platform, terrapi generates production-ready infrastructure-as-code templates.

---

## 🚀 Quick Start

Get started with terrapi in seconds:

```bash
# Interactive mode - asks for all options
npx terrapi init

# Direct mode - specify everything upfront
npx terrapi init my-infrastructure --provider aws --external-modules false --git-init true
```
The wizard will ask you:
- 📁 **Project name or path**
- ☁️ **Cloud provider** (AWS/Azure/GCP)
- 📦 **Module preference** (Local vs External)
- 🔧 **Git initialization**

That's it! 🎉 Your Terraform project is ready to go.

---

## 🏗️ Generated Project Structure

terrapi creates a well-organized project structure:

```
my-terraform-project/
├── 📄 main.tf              # Main Terraform configuration
├── 📄 variables.tf         # Input variables definition
├── 📄 outputs.tf           # Output values
├── 📄 versions.tf          # Provider version constraints
├── 📄 providers.tf         # Provider configurations
├── 📄 backend.tf           # Backend configuration
├── 📄 .gitignore           # Git ignore rules for Terraform
├── 📁 config/              # Environment-specific configurations
│   ├── 📄 dev.tfvars       # Development variables
│   ├── 📄 staging.tfvars   # Staging variables
│   └── 📄 prod.tfvars      # Production variables
└── 📁 modules/             # Local modules (if selected)
    └── 📁 vpc/
        ├── 📄 main.tf
        ├── 📄 variables.tf
        └── 📄 outputs.tf
```

### 📋 File Descriptions

| File | Purpose |
|------|---------|
| `main.tf` | Main resource definitions and module calls |
| `variables.tf` | Input variable declarations |
| `outputs.tf` | Output value definitions |
| `versions.tf` | Terraform and provider version constraints |
| `providers.tf` | Provider configuration (region, credentials) |
| `backend.tf` | Remote state backend configuration |
| `config/*.tfvars` | Environment-specific variable values |
| `modules/` | Reusable local modules (optional) |

---

## ⚙️ Command Reference

### 🎯 Main Command

```bash
terrapi init [project-name] [options]
```

### 🏷️ Options

| Flag | Alias | Type | Description | Default |
|------|-------|------|-------------|---------|
| `--provider` | `-p` | `string` | Cloud provider (`aws`\|`azure`\|`gcp`) | Interactive |
| `--external-modules` | | `boolean` | Use external modules instead of local | Interactive |
| `--git-init` | | `boolean` | Initialize git repository | Interactive |
| `--force` | `-f` | `boolean` | Overwrite existing directory | `false` |
| `--verbose` | `-v` | `boolean` | Enable verbose logging | `false` |
| `--help` | `-h` | | Show help information | |
| `--version` | | | Show version number | |

---

## 🛠️ Development

### 🔧 Prerequisites

- Node.js ≥ 16.0.0
- npm ≥ 8.0.0
- Git

### 🚀 Setup

```bash
# Clone the repository
git clone https://github.com/iamdantz/terrapi.git
cd terrapi

# Install dependencies
npm install

# Build the project
npm run build

# Test locally
node dist/cli.js init test-project
```

---

## 🤝 Contributing

We welcome contributions! Here's how to get started:

### 🐛 Bug Reports

Found a bug? Please [open an issue](https://github.com/iamdantz/terrapi/issues) with:

- **Environment:** OS, Node.js version, npm version
- **Steps to reproduce:** Clear reproduction steps
- **Expected vs Actual:** What should happen vs what happens
- **Logs:** Any error messages or verbose output

### ✨ Feature Requests

Have an idea? [Open an issue](https://github.com/iamdantz/terrapi/issues) with:

- **Use case:** What problem does this solve?
- **Proposal:** How should it work?
- **Examples:** Mock CLI usage or output

### 🔧 Development Workflow

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Make** your changes
4. **Commit** with clear messages: `git commit -m 'feat: add amazing feature'`
5. **Push** to your fork: `git push origin feature/amazing-feature`
6. **Open** a Pull Request


### 🚀 Release Process

Releases are automated via GitHub Actions:

1. **Update version:** `./scripts/release.sh patch|minor|major`
2. **Push changes:** Automatically triggers CI/CD
3. **Publish:** Auto-publishes to npm and creates GitHub release

---

## 📚 Related Projects

- **[Terraform](https://www.terraform.io/)** - Infrastructure as Code
- **[AWS Provider](https://registry.terraform.io/providers/hashicorp/aws/latest)** - AWS resources
- **[Azure Provider](https://registry.terraform.io/providers/hashicorp/azurerm/latest)** - Azure resources  
- **[Google Provider](https://registry.terraform.io/providers/hashicorp/google/latest)** - GCP resources

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🔗 Links

- 📦 **[npm package](https://www.npmjs.com/package/terrapi)**
- 🏠 **[GitHub repository](https://github.com/iamdantz/terrapi)**
- 🐛 **[Issues & Bug reports](https://github.com/iamdantz/terrapi/issues)**
- 📚 **[Terraform Documentation](https://www.terraform.io/docs)**

---

<div align="center">

**Made with ❤️ by [iamdantz](https://github.com/iamdantz)**

*If terrapi helped you, consider [⭐ starring the repo](https://github.com/iamdantz/terrapi)*

</div>