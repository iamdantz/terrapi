#!/bin/bash

# Script to create a terrapi release
# Usage: ./scripts/release.sh [patch|minor|major]

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

show_help() {
    echo "Usage: $0 [patch|minor|major]"
    echo ""
    echo "Options:"
    echo "  patch   Increment patch version (1.0.0 → 1.0.1)"
    echo "  minor   Increment minor version (1.0.0 → 1.1.0)"
    echo "  major   Increment major version (1.0.0 → 2.0.0)"
    echo ""
    echo "Example:"
    echo "  $0 patch"
}

if [ $# -eq 0 ]; then
    echo -e "${RED}Error: Release type is required${NC}"
    show_help
    exit 1
fi

RELEASE_TYPE=$1

if [[ ! "$RELEASE_TYPE" =~ ^(patch|minor|major)$ ]]; then
    echo -e "${RED}Error: Invalid release type: $RELEASE_TYPE${NC}"
    show_help
    exit 1
fi

echo -e "${BLUE}🚀 Starting $RELEASE_TYPE release for terrapi${NC}"

CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "main" ]; then
    echo -e "${RED}Error: You must be on 'main' branch to create a release${NC}"
    echo "Current branch: $CURRENT_BRANCH"
    exit 1
fi

if [ -n "$(git status --porcelain)" ]; then
    echo -e "${RED}Error: There are uncommitted changes${NC}"
    echo "Please commit all changes before creating a release"
    git status
    exit 1
fi

CURRENT_VERSION=$(node -p "require('./package.json').version")
echo -e "${BLUE}Current version: $CURRENT_VERSION${NC}"

echo -e "${YELLOW}🧪 Running tests...${NC}"
npm test

echo -e "${YELLOW}🔍 Running linting...${NC}"
npm run lint

echo -e "${YELLOW}📦 Incrementing version...${NC}"
npm run "version:$RELEASE_TYPE"

NEW_VERSION=$(node -p "require('./package.json').version")
echo -e "${GREEN}New version: $NEW_VERSION${NC}"

echo -e "${YELLOW}📝 Changes to push:${NC}"
git log --oneline "$CURRENT_VERSION"..HEAD || echo "No commits since last version"

echo -e "${YELLOW}❓ Continue with release v$NEW_VERSION? (y/N)${NC}"
read -r CONFIRM

if [[ ! "$CONFIRM" =~ ^[Yy]$ ]]; then
    echo -e "${RED}Release cancelled${NC}"
    # Revert version change
    git reset --hard HEAD~1
    exit 1
fi

echo -e "${YELLOW}📤 Pushing changes to GitHub...${NC}"
git push origin main --follow-tags

echo -e "${GREEN}✅ Release v$NEW_VERSION completed!${NC}"
echo -e "${BLUE}CI/CD pipeline will run automatically and publish to npm${NC}"
echo -e "${BLUE}You can track progress at: https://github.com/iamdantz/terrapi/actions${NC}"
