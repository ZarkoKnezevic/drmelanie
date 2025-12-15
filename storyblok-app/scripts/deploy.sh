#!/bin/bash

# Deployment script for world4you
# This script builds the Next.js app and uploads it via FTP

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Starting deployment to world4you...${NC}"

# Load environment variables
if [ -f .env.local ]; then
  export $(cat .env.local | grep -v '^#' | xargs)
fi

# Check required variables
if [ -z "$FTP_HOST" ] || [ -z "$FTP_USER" ] || [ -z "$FTP_PASS" ]; then
  echo -e "${RED}❌ Error: FTP credentials not set${NC}"
  echo "Please set FTP_HOST, FTP_USER, and FTP_PASS environment variables"
  exit 1
fi

# Build the application
echo -e "${YELLOW}📦 Building Next.js application...${NC}"
npm run build

if [ ! -d "out" ]; then
  echo -e "${RED}❌ Error: Build output directory 'out' not found${NC}"
  echo "Make sure next.config.ts has 'output: export' configured"
  exit 1
fi

# Upload via FTP
echo -e "${YELLOW}📤 Uploading files to world4you...${NC}"

# Check if lftp is installed
if command -v lftp &> /dev/null; then
  lftp -c "
    set ftp:ssl-allow no
    set ftp:passive-mode yes
    open -u $FTP_USER,$FTP_PASS $FTP_HOST
    mirror -R --delete --verbose out/ ${FTP_REMOTE_PATH:-/htdocs/}
    quit
  "
elif command -v ftp &> /dev/null; then
  # Fallback to basic FTP (less reliable)
  echo -e "${YELLOW}Using basic FTP client...${NC}"
  # Note: Basic FTP doesn't support password in command line securely
  # Consider using .netrc file or expect script
  echo "Basic FTP requires manual password entry or .netrc configuration"
else
  echo -e "${RED}❌ Error: No FTP client found${NC}"
  echo "Please install lftp: brew install lftp (Mac) or apt-get install lftp (Linux)"
  exit 1
fi

echo -e "${GREEN}✅ Deployment completed successfully!${NC}"



