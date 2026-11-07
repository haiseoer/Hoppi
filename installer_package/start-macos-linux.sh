#!/bin/bash
echo "====================================================================="
echo "   KHOI CHAY SIEU AI TRO LY HOPPI (NGUYEN THANH HAI) TREN MAC/LINUX"
echo "====================================================================="

if ! command -v node &> /dev/null; then
    echo "[LOI] Node.js chua duoc cai dat. Vui long cai dat Node.js tai https://nodejs.org/"
    exit 1
fi

if [ ! -d "node_modules" ]; then
    echo "Dang cai dat thu vien..."
    npm install
fi

echo "Dang khoi chay Hoppi AI tren cong 3000..."
npm run dev
