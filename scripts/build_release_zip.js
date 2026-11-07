import fs from 'fs';
import path from 'path';
import JSZip from 'jszip';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const zip = new JSZip();

function addFolderToZip(folderPath, zipFolder) {
  const entries = fs.readdirSync(folderPath, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(folderPath, entry.name);
    const relPath = path.relative(rootDir, fullPath).replace(/\\/g, '/');

    // Skip node_modules, .git, large mp4 video files
    if (
      entry.name === 'node_modules' ||
      entry.name === '.git' ||
      entry.name.endsWith('.mp4') ||
      entry.name.endsWith('.zip')
    ) {
      continue;
    }

    if (entry.isDirectory()) {
      addFolderToZip(fullPath, zipFolder);
    } else if (entry.isFile()) {
      try {
        const fileData = fs.readFileSync(fullPath);
        zip.file(relPath, fileData, {
          date: fs.statSync(fullPath).mtime || new Date(),
          createFolders: true,
        });
      } catch (err) {
        console.warn(`Skipped ${relPath}:`, err.message);
      }
    }
  }
}

async function buildZip() {
  console.log('Packaging Hoppi release zip with pre-built dist & executables...');
  
  // Specific files and directories to bundle
  const itemsToInclude = [
    'Hoppi_AI_Desktop.exe',
    'Cai_Dat_Tu_Dong_Hoppi.exe',
    'CHAY_NGAY_HOPPI_DESKTOP.bat',
    'TAO_ICON_DESKTOP_WINDOWS.bat',
    'CAI_DAT_TU_DONG_WINDOWS.bat',
    'dist',
    'src',
    'src_exe',
    'public',
    'package.json',
    'tsconfig.json',
    'vite.config.ts',
    'server.ts',
    'index.html',
    'metadata.json',
  ];

  for (const item of itemsToInclude) {
    const p = path.join(rootDir, item);
    if (!fs.existsSync(p)) continue;
    const stat = fs.statSync(p);
    if (stat.isDirectory()) {
      addFolderToZip(p, zip);
    } else {
      const fileData = fs.readFileSync(p);
      zip.file(item, fileData, {
        date: stat.mtime || new Date(),
      });
    }
  }

  const outPath = path.join(rootDir, 'public', 'downloads', 'hoppi-autonomous-ai-agent-full-source.zip');
  const buffer = await zip.generateAsync({
    type: 'nodebuffer',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 },
  });

  fs.writeFileSync(outPath, buffer);
  console.log(`Zip built successfully! Size: ${(buffer.length / 1024 / 1024).toFixed(2)} MB at ${outPath}`);
}

buildZip().catch(console.error);
