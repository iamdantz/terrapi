# Terrapi

Terrapi is a CLI tool designed to scaffold Terraform projects with best practices, moving away from "Copy/Paste" environments towards scalable, DRY architectures.

## Philosophy

We believe that Infrastructure as Code should be as maintainable and scalable as application code. Terrapi provides opinionated, battle-tested templates that prioritize the "UX Developer" experience.

## Templates

### 1. Standard (`standard`)
**Best for:** Most projects, from personal demos to production applications.
-   **Stack:** Native Terraform.
-   **Key Feature:** **Environment Wrappers**. Separate `main.tf` for each environment (`dev`, `prod`) allows for complete flexibility while sharing core logic via modules.
-   **Structure:**
    ```
    ├── modules/                 # Reusable logic
    ├── environments/
    │   ├── dev/                 # Dev specific config & state
    │   └── prod/                # Prod specific config & state
    ```

### 2. Terragrunt (`terragrunt`)
**Best for:** Large-scale infrastructure, multi-team setups.
-   **Stack:** Terraform + Terragrunt.
-   **Key Feature:** **DRY Architecture**. Configuration is reduced to inputs in `terragrunt.hcl` files. Handles backend creation automatically.
-   **Structure:**
    ```
    ├── modules/                 # Reusable logic
    ├── terragrunt.hcl           # Root config
    ├── environments/
    │   ├── dev/                 # Dev inputs
    │   └── prod/                # Prod inputs
    ```

## Prerequisites

- Node.js (v18+)
- Terraform CLI (v1.0+)
- Terragrunt (Optional, for Terragrunt template)

## Installation

```bash
git clone <repository-url>
cd terrapi
npm install
npm run build
```

## Usage

To start the interactive wizard:

```bash
npm start init
```

Follow the prompts to select your project name, cloud provider, and architecture template.

## Project Structure

```text
terrapi/
├── src/             # CLI Source Code
│   ├── commands/    # Command definitions
│   ├── core/        # Core logic & interfaces
│   ├── generators/  # Template generators
│   └── utils/       # Helpers
├── templates/       # EJS Templates
│   ├── standard/    # Standard Native template
│   └── terragrunt/  # Advanced Terragrunt template
```