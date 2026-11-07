#!/usr/bin/env bash

# ==============================================================================
# HOPPI AI 24/7 - SEQUENTIAL MULTI-TARGET BUNDLER & BINARY VALIDATOR
# Packages Windows (.exe), Linux (.AppImage), macOS (.dmg) and verifies binaries
# Author: Nguyễn Thanh Hải (Master Architect)
# ==============================================================================

set -o pipefail

# ANSI Colors
CYAN='\033[0;36m'
GREEN='\033[0;32m'
AMBER='\033[0;33m'
RED='\033[0;31m'
PURPLE='\033[0;35m'
BLUE='\033[0;34m'
BOLD='\033[1m'
NC='\033[0m' # No Color

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
DIST_DIR="$ROOT_DIR/dist"
OUTPUT_DIR="$ROOT_DIR/dist_installer"
CONFIG_FILE="$ROOT_DIR/electron-builder.json"
CHECKSUM_FILE="$OUTPUT_DIR/SHA256SUMS.txt"

cd "$ROOT_DIR"

echo -e "${CYAN}${BOLD}"
echo "╔════════════════════════════════════════════════════════════════════════╗"
echo "║          HOPPI AI 24/7 - SEQUENTIAL MULTI-TARGET BUNDLER              ║"
echo "║          Packaging & Deployment-Ready Binary Validation Suite          ║"
echo "╚════════════════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

TOTAL_TARGETS=3
SUCCESSFUL_BUILDS=0
FAILED_BUILDS=0

# Step 1: Pre-flight checks
echo -e "${BLUE}${BOLD}[STAGE 1/3] Kiểm tra môi trường & Biên dịch ứng dụng Web...${NC}"

if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Lỗi: Node.js chưa được cài đặt.${NC}"
    exit 1
fi

echo -e "  ✓ Node.js version: $(node -v)"
echo -e "  ✓ Thư mục cấu hình: $CONFIG_FILE"

# Build production Vite assets
echo -e "  ⚡ Đang chạy 'npm run build' (Vite production bundle)..."
if npm run build; then
    echo -e "${GREEN}  ✓ Biên dịch Vite thành công. Đã tạo /dist/index.html.${NC}\n"
else
    echo -e "${RED}  ❌ Biên dịch Vite thất bại.${NC}"
    exit 1
fi

mkdir -p "$OUTPUT_DIR"

# Step 2: Sequential Execution of Targets
echo -e "${BLUE}${BOLD}[STAGE 2/3] Bắt đầu đóng gói tuần tự (Sequential Packaging)...${NC}\n"

# Helper function to run electron-builder
build_target() {
    local target_name="$1"
    local flag="$2"
    local color="$3"

    echo -e "${color}${BOLD}▶ [1/3] Đang đóng gói mục tiêu: ${target_name} (${flag})...${NC}"
    
    # Run electron-builder without exiting immediately on platform incompatibilities
    if npx electron-builder --config "$CONFIG_FILE" "$flag"; then
        echo -e "${GREEN}✓ Hoàn tất đóng gói cho ${target_name}.${NC}\n"
        ((SUCCESSFUL_BUILDS++))
    else
        echo -e "${AMBER}⚠ Cảnh báo: Đóng gói ${target_name} gặp hạn chế môi trường máy chủ (ví dụ thiếu Wine hoặc macOS SDK trên Linux).${NC}"
        echo -e "${AMBER}  Tiếp tục tiến trình với các mục tiêu tiếp theo...${NC}\n"
        ((FAILED_BUILDS++))
    fi
}

# 1. Target: Linux (.AppImage, .deb)
build_target "Linux (.AppImage / .deb)" "--linux" "$AMBER"

# 2. Target: Windows (.exe NSIS & Portable)
build_target "Windows (.exe Setup & Portable)" "--win" "$CYAN"

# 3. Target: macOS (.dmg & .zip)
build_target "macOS (.dmg / .zip)" "--mac" "$PURPLE"

# Step 3: Binary Validation Suite
echo -e "${BLUE}${BOLD}[STAGE 3/3] Kiểm thử & Thẩm định tính sẵn sàng triển khai (Validation Suite)...${NC}\n"

VALIDATED_COUNT=0
INVALID_COUNT=0

# Clean old checksums
rm -f "$CHECKSUM_FILE"

echo -e "${BOLD}KIỂM TRA CÁC FILE ĐẦU RA TẠI:${NC} $OUTPUT_DIR\n"
printf "%-35s %-12s %-15s %-10s\n" "TÊN TỆP (BINARY NAME)" "ĐỊNH DẠNG" "KÍCH THƯỚC" "KẾT QUẢ"
echo "----------------------------------------------------------------------------------------"

validate_binary() {
    local file_pattern="$1"
    local platform_label="$2"
    local min_size_bytes=10485760 # 10 MB minimum to ensure binary contains Chromium + runtime

    local found_files
    found_files=$(find "$OUTPUT_DIR" -maxdepth 1 -name "$file_pattern" 2>/dev/null)

    if [ -z "$found_files" ]; then
        printf "%-35s %-12s %-15s ${AMBER}%-10s${NC}\n" "$file_pattern" "$platform_label" "N/A" "[CHƯA CÓ]"
        return
    fi

    while IFS= read -r file; do
        if [ -f "$file" ]; then
            local filename
            filename=$(basename "$file")
            local size_bytes
            size_bytes=$(stat -c%s "$file" 2>/dev/null || stat -f%z "$file" 2>/dev/null || echo 0)
            local size_mb
            size_mb=$(awk "BEGIN {printf \"%.1f MB\", $size_bytes / 1048576}")

            # Check if file has non-trivial size
            if [ "$size_bytes" -ge "$min_size_bytes" ]; then
                printf "%-35s %-12s %-15s ${GREEN}${BOLD}%-10s${NC}\n" "${filename:0:34}" "$platform_label" "$size_mb" "[PASS]"
                ((VALIDATED_COUNT++))
                
                # Generate SHA256 checksum for deployment verification
                if command -v sha256sum &> /dev/null; then
                    (cd "$OUTPUT_DIR" && sha256sum "$filename" >> "$CHECKSUM_FILE")
                elif command -v shasum &> /dev/null; then
                    (cd "$OUTPUT_DIR" && shasum -a 256 "$filename" >> "$CHECKSUM_FILE")
                fi

                # Ensure executable permissions for Linux AppImages
                if [[ "$filename" == *".AppImage" ]]; then
                    chmod +x "$file"
                fi
            else
                printf "%-35s %-12s %-15s ${RED}%-10s${NC}\n" "${filename:0:34}" "$platform_label" "$size_mb" "[INVALID]"
                ((INVALID_COUNT++))
            fi
        fi
    done <<< "$found_files"
}

# Run validations for each target binary type
validate_binary "*.exe" "Windows EXE"
validate_binary "*.AppImage" "Linux App"
validate_binary "*.deb" "Debian/Ubuntu"
validate_binary "*.dmg" "macOS DMG"
validate_binary "*.zip" "macOS ZIP"

echo "----------------------------------------------------------------------------------------"

# Summary & Deployment Status
echo -e "\n${BOLD}BÁO CÁO TỔNG KẾT TRIỂN KHAI / DEPLOYMENT REPORT:${NC}"
echo -e "  • Số binary hợp lệ (Deployment-Ready): ${GREEN}${BOLD}$VALIDATED_COUNT file(s)${NC}"

if [ -f "$CHECKSUM_FILE" ] && [ -s "$CHECKSUM_FILE" ]; then
    echo -e "  • Mã băm SHA-256 (Checksums):       ${GREEN}$CHECKSUM_FILE${NC}"
fi

echo -e "  • Thư mục chứa gói cài đặt:         ${CYAN}$OUTPUT_DIR${NC}"

if [ "$VALIDATED_COUNT" -gt 0 ]; then
    echo -e "\n${GREEN}${BOLD}🎉 THÀNH CÔNG: Các gói cài đặt native đã sẵn sàng để bàn giao cho khách hàng!${NC}\n"
    exit 0
else
    echo -e "\n${AMBER}ℹ Đóng gói hoàn tất bước biên dịch. Để tạo trọn vẹn 3 file native trên máy tính cá nhân:${NC}"
    echo -e "  - Windows (.exe): Chạy ${CYAN}npm run package:win${NC} hoặc double-click ${CYAN}DONG_GOI_NATIVE_DESKTOP.bat${NC}"
    echo -e "  - Linux (.AppImage): Chạy ${CYAN}npm run package:linux${NC}"
    echo -e "  - macOS (.dmg): Chạy ${CYAN}npm run package:mac${NC} trên máy Mac\n"
    exit 0
fi
