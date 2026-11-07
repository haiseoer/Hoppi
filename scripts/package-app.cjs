#!/usr/bin/env node

/**
 * ============================================================================
 * HOPPI AUTONOMOUS AI AGENT - CROSS-PLATFORM DESKTOP PACKAGER CLI
 * Packages React Vite application into native .exe, .dmg, and .AppImage
 * Author: Nguyễn Thanh Hải (Master Architect)
 * ============================================================================
 */

const { spawn, execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

// ANSI Color Helpers
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  cyan: '\x1b[36m',
  emerald: '\x1b[32m',
  amber: '\x1b[33m',
  rose: '\x1b[31m',
  purple: '\x1b[35m',
  blue: '\x1b[34m',
};

const ROOT_DIR = path.resolve(__dirname, '..');
const DIST_DIR = path.join(ROOT_DIR, 'dist');
const OUTPUT_DIR = path.join(ROOT_DIR, 'dist_installer');
const CONFIG_FILE = path.join(ROOT_DIR, 'electron-builder.json');

function logBanner() {
  console.log(`
${colors.cyan}${colors.bright}╔════════════════════════════════════════════════════════════════════════╗
║             HOPPI AI 24/7 - DESKTOP APPLICATION PACKAGER              ║
║         Cross-Platform Native Bundler (.exe / .dmg / .AppImage)        ║
╚════════════════════════════════════════════════════════════════════════╝${colors.reset}
  `);
}

function printHelp() {
  console.log(`
${colors.bright}CÁCH SỬ DỤNG / USAGE:${colors.reset}
  node scripts/package-app.cjs [FLAG]

${colors.bright}CÁC THAM SỐ / FLAGS:${colors.reset}
  ${colors.emerald}--win,   -w${colors.reset}     Đóng gói cho Windows (.exe NSIS Installer & Portable)
  ${colors.emerald}--mac,   -m${colors.reset}     Đóng gói cho macOS (.dmg Installer & .zip)
  ${colors.emerald}--linux, -l${colors.reset}     Đóng gói cho Linux (.AppImage Standalone & .deb)
  ${colors.emerald}--all,   -a${colors.reset}     Đóng gói toàn bộ nền tảng (.exe, .dmg, .AppImage)
  ${colors.amber}--clean, -c${colors.reset}     Dọn dẹp thư mục dist/ và dist_installer/
  ${colors.cyan}--help,  -h${colors.reset}     Hiển thị hướng dẫn này

${colors.bright}VÍ DỤ / EXAMPLES:${colors.reset}
  npm run package:win       # Đóng gói Windows .exe
  npm run package:mac       # Đóng gói macOS .dmg
  npm run package:linux     # Đóng gói Linux .AppImage
  npm run package:all       # Đóng gói tất cả
  node scripts/package-app.cjs   # Chạy chế độ menu tương tác
  `);
}

function runCommand(command, args, cwd = ROOT_DIR) {
  return new Promise((resolve, reject) => {
    console.log(`${colors.dim}> ${command} ${args.join(' ')}${colors.reset}\n`);
    const proc = spawn(command, args, {
      cwd,
      stdio: 'inherit',
      shell: true,
    });

    proc.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command failed with exit code ${code}`));
      }
    });

    proc.on('error', (err) => {
      reject(err);
    });
  });
}

async function ensureViteBuild() {
  const indexHtml = path.join(DIST_DIR, 'index.html');
  if (!fs.existsSync(indexHtml)) {
    console.log(`${colors.amber}⚡ Chưa tìm thấy thư mục dist/. Đang tiến hành biên dịch Vite production...${colors.reset}`);
    await runCommand('npm', ['run', 'build']);
    console.log(`${colors.emerald}✓ Biên dịch Vite thành công!${colors.reset}\n`);
  } else {
    console.log(`${colors.emerald}✓ Đã tìm thấy bản build web tại /dist.${colors.reset}`);
  }
}

async function cleanDirectories() {
  console.log(`${colors.amber}🧹 Đang dọn dẹp thư mục đầu ra...${colors.reset}`);
  if (fs.existsSync(OUTPUT_DIR)) {
    fs.rmSync(OUTPUT_DIR, { recursive: true, force: true });
  }
  console.log(`${colors.emerald}✓ Đã dọn dẹp xong!${colors.reset}\n`);
}

function listGeneratedArtifacts() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    console.log(`${colors.amber}Thư mục đầu ra ${OUTPUT_DIR} chưa có file nào.${colors.reset}`);
    return;
  }

  const files = fs.readdirSync(OUTPUT_DIR);
  const targetFiles = files.filter(
    (f) =>
      f.endsWith('.exe') ||
      f.endsWith('.dmg') ||
      f.endsWith('.AppImage') ||
      f.endsWith('.deb') ||
      f.endsWith('.zip')
  );

  console.log(`\n${colors.cyan}${colors.bright}════════════════════════════════════════════════════════════════════════${colors.reset}`);
  console.log(`${colors.emerald}${colors.bright}🎉 KẾT QUẢ XUẤT FILE NATIVE THÀNH CÔNG:${colors.reset}`);
  console.log(`${colors.dim}Thư mục: ${OUTPUT_DIR}${colors.reset}\n`);

  if (targetFiles.length === 0) {
    console.log(`${colors.amber}Không tìm thấy file installer trong ${OUTPUT_DIR}.${colors.reset}`);
  } else {
    targetFiles.forEach((file) => {
      const fullPath = path.join(OUTPUT_DIR, file);
      const stat = fs.statSync(fullPath);
      const sizeMb = (stat.size / (1024 * 1024)).toFixed(1);
      let badge = `${colors.cyan}[FILE]${colors.reset}`;

      if (file.endsWith('.exe')) badge = `${colors.emerald}[WINDOWS .EXE]${colors.reset}`;
      if (file.endsWith('.dmg')) badge = `${colors.purple}[MACOS .DMG]  ${colors.reset}`;
      if (file.endsWith('.AppImage')) badge = `${colors.amber}[LINUX APP]   ${colors.reset}`;

      console.log(`  ${badge} ${colors.bright}${file}${colors.reset} (${sizeMb} MB)`);
    });
  }

  console.log(`${colors.cyan}${colors.bright}════════════════════════════════════════════════════════════════════════${colors.reset}\n`);
}

async function packagePlatform(target) {
  await ensureViteBuild();

  const builderArgs = ['electron-builder', '--config', 'electron-builder.json'];

  switch (target) {
    case 'win':
      console.log(`\n${colors.cyan}🚀 Đang đóng gói bản cài đặt Native Windows (.exe)...${colors.reset}`);
      builderArgs.push('--win');
      break;
    case 'mac':
      console.log(`\n${colors.purple}🚀 Đang đóng gói bản cài đặt Native macOS (.dmg)...${colors.reset}`);
      builderArgs.push('--mac');
      break;
    case 'linux':
      console.log(`\n${colors.amber}🚀 Đang đóng gói bản cài đặt Native Linux (.AppImage)...${colors.reset}`);
      builderArgs.push('--linux');
      break;
    case 'all':
      console.log(`\n${colors.cyan}🚀 Đang đóng gói toàn bộ 3 nền tảng (.exe, .dmg, .AppImage)...${colors.reset}`);
      builderArgs.push('--win', '--mac', '--linux');
      break;
    default:
      throw new Error(`Nền tảng không hợp lệ: ${target}`);
  }

  try {
    await runCommand('npx', builderArgs);
    listGeneratedArtifacts();
  } catch (err) {
    console.error(`\n${colors.rose}❌ Lỗi trong quá trình đóng gói electron-builder:${colors.reset}`, err.message);
    console.log(`\n${colors.amber}💡 MẸO HỖ TRỢ XUẤT ĐA NỀN TẢNG:${colors.reset}`);
    console.log(`  - Để build file .exe: Chạy trên máy tính Windows hoặc cài đặt 'wine' trên Linux/macOS.`);
    console.log(`  - Để build file .dmg: Chạy trên máy tính macOS.`);
    console.log(`  - Để build file .AppImage: Chạy trên Linux hoặc container Docker.`);
    console.log(`  - Bạn có thể chạy: ${colors.cyan}npx electron-builder --win${colors.reset} để đóng gói riêng cho Windows.`);
  }
}

async function promptInteractiveMenu() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    console.log(`${colors.bright}Vui lòng chọn nền tảng bạn muốn đóng gói:${colors.reset}\n`);
    console.log(`  ${colors.cyan}1.${colors.reset} Windows (.exe Setup & Portable)`);
    console.log(`  ${colors.purple}2.${colors.reset} macOS (.dmg Apple Silicon & Intel)`);
    console.log(`  ${colors.amber}3.${colors.reset} Linux (.AppImage & .deb)`);
    console.log(`  ${colors.emerald}4.${colors.reset} Tất cả nền tảng (.exe + .dmg + .AppImage)`);
    console.log(`  ${colors.rose}5.${colors.reset} Dọn dẹp thư mục dist_installer/`);
    console.log(`  ${colors.dim}0. Thoát${colors.reset}\n`);

    rl.question(`${colors.bright}Nhập lựa chọn của bạn (0-5) [Mặc định: 1]: ${colors.reset}`, async (answer) => {
      rl.close();
      const choice = answer.trim() || '1';

      switch (choice) {
        case '1':
          await packagePlatform('win');
          break;
        case '2':
          await packagePlatform('mac');
          break;
        case '3':
          await packagePlatform('linux');
          break;
        case '4':
          await packagePlatform('all');
          break;
        case '5':
          await cleanDirectories();
          break;
        case '0':
          console.log('\nĐã thoát.');
          break;
        default:
          console.log(`${colors.rose}Lựa chọn không hợp lệ.${colors.reset}`);
          break;
      }
      resolve();
    });
  });
}

async function main() {
  logBanner();

  const args = process.argv.slice(2);

  if (args.includes('--help') || args.includes('-h')) {
    printHelp();
    return;
  }

  if (args.includes('--clean') || args.includes('-c')) {
    await cleanDirectories();
    return;
  }

  if (args.includes('--win') || args.includes('-w')) {
    await packagePlatform('win');
    return;
  }

  if (args.includes('--mac') || args.includes('-m')) {
    await packagePlatform('mac');
    return;
  }

  if (args.includes('--linux') || args.includes('-l')) {
    await packagePlatform('linux');
    return;
  }

  if (args.includes('--all') || args.includes('-a')) {
    await packagePlatform('all');
    return;
  }

  // If no arguments provided, launch interactive CLI menu
  await promptInteractiveMenu();
}

main().catch((err) => {
  console.error(`\n${colors.rose}Lỗi không mong muốn:${colors.reset}`, err);
  process.exit(1);
});
