# 🚀 HƯỚNG DẪN CÀI ĐẶT & XUẤT BẢN HOPPI AI ĐA NỀN TẢNG
### (Windows .EXE / .MSI, Android APK, iPhone & iPad iOS, macOS, Linux)
**Chủ sở hữu:** Nguyễn Thanh Hải (haiSEOer@gmail.com)  
**Phiên bản:** Hoppi Autonomous AI Agent v4.5 Enterprise  

---

## 🌟 1. DANH SÁCH TÍNH NĂNG ĐÃ HOÀN THIỆN 100%
Toàn bộ mã nguồn bạn tải về đã hoàn tất trọn vẹn các phân hệ sau:
1. **Lõi Siêu Trợ Lý Tự Trị 24/7 (Autonomous Engine)**: Kết nối Gemini 3.8 Flash, tự học qua RAG đa tầng, tự động đối soát khoảng trống tri thức, chế độ SLM nội bộ khi ngoại tuyến.
2. **Bảo Mật Sinh Trắc Học & Token Thiết Bị**: Nhận diện FaceID quét khuôn mặt, mã PIN bảo mật, Trusted Devices Token, phân quyền Khách vs Chủ nhân (HITL Approval).
3. **Phân Hệ Đa Tác Vụ**:
   - **Code Agent**: Viết code, debug, refactor, kiểm tra bảo mật, Git commit.
   - **Sales & CRM Agent**: Quản lý khách hàng, tự động chăm sóc Zalo/Fanpage, phân tích tâm lý chốt đơn.
   - **LAN / IoT Smart Mesh**: Quản lý thiết bị thông minh phòng khách, studio, ban công.
4. **Giám Sát Hiệu Năng & Đo Lường Năng Lượng**:
   - **Bản Đồ 2D Floorplan**: Trực quan hóa mặt bằng, node mạng, bản đồ nhiệt cường độ sóng Wi-Fi.
   - **Smart Power Optimizer**: Tự động phát hiện pin < 15% để đề xuất tắt các app ngầm ngốn tài nguyên.
   - **Công Tắc Power Saver (1-Click Mesh Sync)**: Ép toàn bộ thiết bị mesh giảm 60% tốc độ xả pin qua BroadcastChannel.
   - **Depletion HUD & Sparkline 60 Phút**: Biểu đồ sparkline và đồng hồ dự báo giờ cạn pin chi tiết.
   - **Lịch Sử Tiêu Hao 7 Ngày**: Bảng số liệu từng giờ kèm nút **Xuất CSV** để mở trên Excel/Sheets.
   - **Biểu Đồ Nan Hoa (Radial Bar Chart)**: Tỷ trọng tiêu thụ điện và phát hiện thiết bị ngốn điện nhất.
   - **Bản Đồ Nhiệt Thiết Bị (Device Heat Map)**: Lưới mã màu nhiệt (Cool -> Moderate -> High -> Extreme) định vị thiết bị hoạt động mạnh nhất.
   - **Biểu Đồ Thanh Phân Đoạn Băng Thông (Traffic Ratio)**: Đo lường tỷ lệ App Nội Bộ vs Mesh IoT, chẩn đoán điểm nghẽn mạng thời gian thực.

---

## 💻 2. CÀI ĐẶT TRÊN MÁY TÍNH WINDOWS (XUẤT FILE .EXE TRỰC TIẾP TRONG 2 GIÂY)

### ⭐ Cách 1: Xuất File .EXE Trực Tiếp - KHÔNG CẦN CÀI ĐẶT BẤT KỲ PHẦN MỀM GÌ (Khuyên Dùng Nhất!)
Nếu máy tính của bạn chưa có Node.js hoặc bạn muốn có file `.exe` ngay lập tức:
1. Giải nén thư mục mã nguồn vừa tải về.
2. Click đúp chuột vào file:
   ```cmd
   TAO_FILE_EXE_NGAY_LAP_TUC_KHONG_CAN_NODEJS.bat
   ```
3. Script sẽ sử dụng trình biên dịch Windows Native C# (`csc.exe` có sẵn 100% trên Windows 10/11) để tạo ra file:
   **`Hoppi_AI_Assistant_24-7.exe`** ngay trong thư mục và tự động tạo icon Shortcut ra màn hình Desktop cho bạn!
4. Bạn chỉ cần click đúp vào file `Hoppi_AI_Assistant_24-7.exe` để mở ứng dụng chạy độc lập!

### ⭐ Cách 2: Chạy Ngay 1-Click Dạng Desktop App (Không Cần Biên Dịch)
- Click đúp vào file:
  ```cmd
  CHAY_NGAY_HOPPI_DESKTOP.bat
  ```
- Hoppi sẽ mở ngay tức khắc trong cửa sổ độc lập (App Mode của Microsoft Edge / Chrome), mượt mà, không có thanh địa chỉ web rườm rà.

### ⭐ Cách 3: Đóng Gói Bộ Cài Đặt Lớn Hoppi-Setup.exe (Electron Builder)
1. Cài đặt **Node.js LTS** từ [nodejs.org](https://nodejs.org).
2. Click đúp vào file:
   ```cmd
   CAI_DAT_TU_DONG_WINDOWS.bat
   ```
3. File cài đặt `dist_installer/Hoppi-Setup.exe` sẽ được tạo tự động. *(Lưu ý: Nếu máy tính chưa có Node.js, file này sẽ tự động chuyển sang Cách 1 để tạo file .exe cho bạn!)*

---

## 📱 3. CÀI ĐẶT TRÊN ĐIỆN THOẠI IPHONE & MÁY TÍNH BẢNG IPAD (iOS / iPadOS)

*Do chính sách của Apple, các file định dạng `.ipa` cài đặt trực tiếp bên ngoài bắt buộc phải có tài khoản Apple Developer hoặc Xcode. Tuy nhiên, Apple hỗ trợ giải pháp **Web App Standalone** chạy mượt mà 100% như ứng dụng gốc tải từ App Store mà không cần tài khoản:*

1. Mở trình duyệt **Safari** trên iPhone hoặc iPad.
2. Truy cập vào đường link ứng dụng Hoppi của bạn (hoặc link máy chủ nội bộ LAN).
3. Nhấn vào nút **Chia sẻ (Share)** ở thanh điều khiển dưới cùng (biểu tượng hình vuông có mũi tên chỉ lên ⬆️).
4. Cuộn xuống và chọn **"Thêm vào Màn hình chính"** (Add to Home Screen).
5. Nhấn **Thêm** (Add) ở góc trên bên phải.
6. **Kết quả:** Biểu tượng **Hoppi AI** sẽ xuất hiện ngay trên màn hình chính của iPhone/iPad:
   - Mở ứng dụng toàn màn hình (Full-screen, ẩn hoàn toàn thanh URL Safari).
   - Hỗ trợ lưu trữ cục bộ, FaceID mô phỏng, và thông báo âm thanh tiếng Việt.

---

## 🤖 4. CÀI ĐẶT TRÊN ĐIỆN THOẠI & MÁY TÍNH BẢNG ANDROID (DẠNG APK HOẶC PWA APP)

### Cách 1: Cài đặt tức thì (Android WebAPK - Nhanh và Nhẹ Nhất)
1. Mở ứng dụng trên trình duyệt **Google Chrome** trên điện thoại/tablet Android.
2. Chrome sẽ tự động hiển thị thông báo ở cạnh dưới: **"Thêm Hoppi AI vào Màn hình chính"** hoặc bạn nhấn vào menu **3 dấu chấm** ở góc trên bên phải -> Chọn **"Cài đặt ứng dụng" (Install app)**.
3. Nhấn **Cài đặt**.
4. Android sẽ tự động tạo gói APK hệ thống và thêm icon Hoppi vào danh sách ứng dụng điện thoại của bạn, mở toàn màn hình độc lập.

### Cách 2: Đóng gói thành file `.apk` bằng Capacitor (Dành cho nhà phát triển)
1. Trong thư mục dự án trên máy tính, chạy các lệnh sau:
   ```bash
   npm install @capacitor/core @capacitor/cli @capacitor/android
   npx cap init "Hoppi AI" "com.hoppi.autonomous.agent" --web-dir dist
   npm run build
   npx cap add android
   npx cap open android
   ```
2. Android Studio sẽ tự động mở lên, bạn chỉ cần chọn **Build > Build Bundle(s) / APK(s) > Build APK(s)** để xuất file `app-release.apk` và chép vào điện thoại để cài đặt.

---

## 🍎 5. CÀI ĐẶT TRÊN MACBOOK / MACOS HOẶC LINUX
- Trên macOS/Linux, mở Terminal tại thư mục dự án và chạy:
  ```bash
  chmod +x installer_package/start-macos-linux.sh
  ./installer_package/start-macos-linux.sh
  ```
- Hoặc đóng gói thành file `.dmg` / `.app` trên Mac:
  ```bash
  npx electron-builder --mac
  ```

---

## 🔑 6. BIẾN MÔI TRƯỜNG & KHÓA API (TÙY CHỌN)
Tạo file `.env` tại thư mục gốc với nội dung:
```env
PORT=3000
GEMINI_API_KEY=your_gemini_api_key_here
```
*(Nếu chưa có API key, ứng dụng vẫn vận hành mượt mà với bộ não phản xạ SLM cục bộ 24/7).*
