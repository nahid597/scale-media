#!/bin/bash

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔═══════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║          AWS Credentials Security Check                   ║${NC}"
echo -e "${BLUE}╚═══════════════════════════════════════════════════════════╝${NC}"
echo ""

ISSUES=0

# Check if .env is in .gitignore
if [ -f ".gitignore" ]; then
    if grep -q "^\.env$" .gitignore || grep -q "^\.env$" .gitignore; then
        echo -e "${GREEN}✓ .env is in .gitignore${NC}"
    else
        echo -e "${RED}✗ .env is NOT in .gitignore${NC}"
        echo -e "  ${YELLOW}Add '.env' to your .gitignore file${NC}"
        ISSUES=$((ISSUES + 1))
    fi
else
    echo -e "${YELLOW}⚠ .gitignore file not found${NC}"
    ISSUES=$((ISSUES + 1))
fi

# Check if .env exists
if [ -f ".env" ]; then
    echo -e "${YELLOW}⚠ .env file exists${NC}"
    
    # Check if it contains real credentials
    if grep -q "AWS_ACCESS_KEY_ID=AKIA" .env; then
        echo -e "${RED}✗ .env contains real AWS credentials (starts with AKIA)${NC}"
        echo -e "  ${YELLOW}You should:${NC}"
        echo -e "  ${YELLOW}1. Rotate these credentials immediately in AWS IAM${NC}"
        echo -e "  ${YELLOW}2. Never commit .env to version control${NC}"
        ISSUES=$((ISSUES + 1))
    fi
    
    # Check if it's in git tracking
    if git ls-files --error-unmatch .env > /dev/null 2>&1; then
        echo -e "${RED}✗ .env is tracked by git${NC}"
        echo -e "  ${YELLOW}Run: git rm --cached .env${NC}"
        echo -e "  ${YELLOW}Then commit this change${NC}"
        ISSUES=$((ISSUES + 1))
    else
        echo -e "${GREEN}✓ .env is not tracked by git${NC}"
    fi
fi

# Check if .env.example exists
if [ -f ".env.example" ]; then
    echo -e "${GREEN}✓ .env.example exists${NC}"
    
    # Verify it doesn't contain real credentials
    if grep -q "AWS_ACCESS_KEY_ID=AKIA" .env.example; then
        echo -e "${RED}✗ .env.example contains real credentials!${NC}"
        ISSUES=$((ISSUES + 1))
    fi
else
    echo -e "${YELLOW}⚠ .env.example file not found${NC}"
    echo -e "  ${YELLOW}Create one to help other developers${NC}"
fi

# Check git history for credentials
echo ""
echo -e "${BLUE}Checking git history for exposed credentials...${NC}"
if git log --all --full-history --source --oneline -- .env | head -n 5; then
    echo -e "${RED}✗ .env has been committed in the past!${NC}"
    echo -e "  ${YELLOW}You should rotate your AWS credentials${NC}"
    ISSUES=$((ISSUES + 1))
else
    echo -e "${GREEN}✓ No .env commits found in recent history${NC}"
fi

echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
if [ $ISSUES -eq 0 ]; then
    echo -e "${GREEN}✓ All security checks passed!${NC}"
else
    echo -e "${RED}✗ Found $ISSUES security issue(s)${NC}"
    echo -e "${YELLOW}Please address the issues above${NC}"
fi
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
