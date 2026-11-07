#!/usr/bin/env python3
"""
Hoppi Autonomous AI Agent - Standard PKZIP Packager for Windows / macOS / Linux
Creates 100% compatible zip archives that extract cleanly in Windows Compressed Folders (zipfldr.dll),
WinRAR, 7-Zip, macOS Archive Utility, and Linux unzip without "Cặp đã nén rỗng" error.
"""

import os
import sys
import time
import zipfile
from pathlib import Path

def create_release_zip():
    script_dir = Path(__file__).resolve().parent
    root_dir = script_dir.parent
    dist_dir = root_dir / 'dist'
    out_dir = root_dir / 'public' / 'downloads'
    out_dir.mkdir(parents=True, exist_ok=True)
    out_zip = out_dir / 'hoppi-autonomous-ai-agent-full-source.zip'

    print(f"[PACKAGER] Starting Windows-compatible zip generation at {out_zip}...")

    # Items to include
    include_items = [
        'Hoppi_AI_Desktop.exe',
        'Cai_Dat_Tu_Dong_Hoppi.exe',
        'CHAY_NGAY_HOPPI_DESKTOP.bat',
        'CHAY_HOPPI_MASCOT_DESKTOP.bat',
        'TAO_ICON_DESKTOP_WINDOWS.bat',
        'CAI_DAT_TU_DONG_WINDOWS.bat',
        'HUONG_DAN_SU_DUNG_WINDOWS.txt',
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
        'electron-builder.json',
    ]

    # Exclusions
    excluded_names = {
        'node_modules',
        '.git',
        '.DS_Store',
        'Thumbs.db',
    }

    total_files = 0
    total_bytes = 0

    with zipfile.ZipFile(str(out_zip), 'w', compression=zipfile.ZIP_DEFLATED, compresslevel=6) as zf:
        for item_name in include_items:
            item_path = root_dir / item_name
            if not item_path.exists():
                print(f"[PACKAGER] Warning: '{item_name}' not found, skipping.")
                continue

            if item_path.is_file():
                arcname = item_name
                stat = item_path.stat()
                mtime = time.localtime(stat.st_mtime)
                date_time = (mtime.tm_year, mtime.tm_mon, mtime.tm_mday, mtime.tm_hour, mtime.tm_min, mtime.tm_sec)

                zinfo = zipfile.ZipInfo(arcname, date_time=date_time)
                # DOS archive bit (0x20) and Unix permissions (0o100755 for exe/bat, 0o100644 for others)
                is_exec = arcname.endswith(('.exe', '.bat', '.sh'))
                unix_mode = 0o100755 if is_exec else 0o100644
                zinfo.external_attr = 0x20 | (unix_mode << 16)
                zinfo.compress_type = zipfile.ZIP_DEFLATED

                with open(item_path, 'rb') as f:
                    zf.writestr(zinfo, f.read())
                total_files += 1
                total_bytes += stat.st_size

            elif item_path.is_dir():
                for root, dirs, files in os.walk(item_path):
                    # Filter in-place
                    dirs[:] = [d for d in dirs if d not in excluded_names]

                    rel_root = Path(root).relative_to(root_dir)
                    rel_root_str = str(rel_root).replace('\\', '/') + '/'

                    # Add directory record with DOS directory bit 0x10 and Unix 0o40755
                    dir_stat = Path(root).stat()
                    dir_mtime = time.localtime(dir_stat.st_mtime)
                    dir_date_time = (dir_mtime.tm_year, dir_mtime.tm_mon, dir_mtime.tm_mday, dir_mtime.tm_hour, dir_mtime.tm_min, dir_mtime.tm_sec)

                    dir_info = zipfile.ZipInfo(rel_root_str, date_time=dir_date_time)
                    dir_info.external_attr = 0x10 | (0o40755 << 16)
                    dir_info.compress_type = zipfile.ZIP_DEFLATED
                    zf.writestr(dir_info, b'')

                    for fname in files:
                        if fname in excluded_names or fname.endswith(('.zip', '.mp4', '.tmp')):
                            continue
                        fpath = Path(root) / fname
                        frel = str(fpath.relative_to(root_dir)).replace('\\', '/')

                        fstat = fpath.stat()
                        fmtime = time.localtime(fstat.st_mtime)
                        fdate_time = (fmtime.tm_year, fmtime.tm_mon, fmtime.tm_mday, fmtime.tm_hour, fmtime.tm_min, fmtime.tm_sec)

                        file_info = zipfile.ZipInfo(frel, date_time=fdate_time)
                        is_exec = frel.endswith(('.exe', '.bat', '.sh'))
                        unix_mode = 0o100755 if is_exec else 0o100644
                        file_info.external_attr = 0x20 | (unix_mode << 16)
                        file_info.compress_type = zipfile.ZIP_DEFLATED

                        with open(fpath, 'rb') as f:
                            zf.writestr(file_info, f.read())
                        total_files += 1
                        total_bytes += fstat.st_size

    zip_size_mb = out_zip.stat().st_size / (1024 * 1024)
    print(f"[PACKAGER] Complete! Added {total_files} files ({total_bytes / (1024 * 1024):.2f} MB uncompressed).")
    print(f"[PACKAGER] Zip file generated: {out_zip} ({zip_size_mb:.2f} MB)")

if __name__ == '__main__':
    create_release_zip()
