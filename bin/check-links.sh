#!/usr/bin/env bash
#
# Link Checker Script
# Checks for broken links in blog content using lychee
#
# Usage:
#   ./bin/check-links.sh                 # Check internal links only (requires build)
#   ./bin/check-links.sh --external      # Check all links (including external)
#   ./bin/check-links.sh --verbose       # Show detailed output
#   ./bin/check-links.sh --skip-build    # Skip build step (use existing .output/public/)
#

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Default options
CHECK_EXTERNAL=false
VERBOSE=""
SKIP_BUILD=false
USE_GET=false
LYCHEE_ARGS=""

# Parse arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    --external|-e)
      CHECK_EXTERNAL=true
      shift
      ;;
    --verbose|-v)
      VERBOSE="--verbose"
      shift
      ;;
    --skip-build|-s)
      SKIP_BUILD=true
      shift
      ;;
    --get|-g)
      USE_GET=true
      shift
      ;;
    --help|-h)
      echo "Usage: $0 [OPTIONS]"
      echo ""
      echo "Options:"
      echo "  --external, -e    Check external links (slower)"
      echo "  --verbose, -v     Show detailed output"
      echo "  --skip-build, -s  Skip build step (use existing .output/public/)"
      echo "  --get, -g         Use GET method instead of HEAD (more compatible)"
      echo "  --help, -h        Show this help message"
      exit 0
      ;;
    *)
      echo "Unknown option: $1"
      echo "Use --help for usage information"
      exit 1
      ;;
  esac
done

# Check if lychee is installed
if ! command -v lychee &> /dev/null; then
    echo -e "${YELLOW}Lychee is not installed.${NC}"
    echo ""
    echo "Install it with one of the following methods:"
    echo ""
    echo "  # macOS (via Homebrew)"
    echo "  brew install lychee"
    echo ""
    echo "  # Linux (via cargo)"
    echo "  cargo install lychee"
    echo ""
    echo "  # Or download from: https://github.com/lycheeverse/lychee/releases"
    echo ""
    exit 1
fi

echo -e "${GREEN}Checking links in blog content...${NC}"
echo ""

# Build the site first to check internal links properly
if [ "$SKIP_BUILD" = false ]; then
    echo -e "${YELLOW}Generating static site to check internal links...${NC}"
    pnpm generate > /dev/null 2>&1
    echo -e "${GREEN}Generate complete.${NC}"
    echo ""
fi

# Verify output directory exists
if [ ! -d ".output/public" ]; then
    echo -e "${RED}Error: .output/public/ directory not found. Run 'pnpm generate' first or remove --skip-build flag.${NC}"
    exit 1
fi

# Build base arguments - check built HTML files in .output/public/
# --root-dir resolves root-relative links against the output folder
OUTPUT_DIR="$(pwd)/.output/public"
LYCHEE_ARGS="--config lychee.toml --no-progress --root-dir \"$OUTPUT_DIR\" $VERBOSE"

# Add offline mode for internal-only checks
if [ "$CHECK_EXTERNAL" = false ]; then
    echo -e "${YELLOW}Checking internal links only (use --external to check all links)${NC}"
    LYCHEE_ARGS="$LYCHEE_ARGS --offline"
else
    echo -e "${YELLOW}Checking all links (internal and external)${NC}"
fi

# Use GET method if requested (more compatible but slower)
if [ "$USE_GET" = true ]; then
    echo -e "${YELLOW}Using GET method (more compatible)${NC}"
    LYCHEE_ARGS="$LYCHEE_ARGS --method get"
fi

echo ""

# Run lychee on built HTML files
if eval lychee $LYCHEE_ARGS "'.output/public/**/*.html'"; then
    echo ""
    echo -e "${GREEN}All links are valid!${NC}"
    exit 0
else
    echo ""
    echo -e "${RED}Found broken links${NC}"
    echo ""
    echo "Run with --verbose flag for more details:"
    echo "  ./bin/check-links.sh --verbose"
    exit 1
fi
