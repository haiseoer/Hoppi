#!/usr/bin/env bash

# ==============================================================================
# HOPPI AI 24/7 - SHELL SCRIPT PACKAGER FOR ELECTRON BUILDER (.exe, .dmg, .AppImage)
# Author: Nguyễn Thanh Hải (Master Architect)
# ==============================================================================

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

cd "$ROOT_DIR"

echo "=========================================================================="
echo "  HOPPI AI 24/7 - AUTOMATED DESKTOP PACKAGING SCRIPT"
echo "  Target: .exe (Windows), .dmg (macOS), .AppImage (Linux)"
echo "=========================================================================="

# Check for node
if ! command -v node &> /dev/null; then
    echo "❌ Lỗi: Node.js chưa được cài đặt. Vui lòng cài đặt Node.js trước khi tiếp tục."
    exit 1
fi

# Ensure dist exists
if [ ! -f "$ROOT_DIR/dist/index.html" ]; then
    echo "⚡ Đang biên dịch mã nguồn giao diện (Vite build)..."
    npm run build
fi

# Delegate to the Node.js CLI packager with all arguments
node "$ROOT_DIR/scripts/package-app.cjs" "$@"
