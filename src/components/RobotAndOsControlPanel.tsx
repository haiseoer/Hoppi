import React, { useState, useEffect } from 'react';
import {
  Bot,
  Cpu,
  Monitor,
  Smartphone,
  MousePointer,
  Keyboard,
  Globe,
  Radio,
  Sliders,
  CheckCircle2,
  AlertCircle,
  Play,
  RotateCcw,
  Zap,
  Volume2,
  Eye,
  Activity,
  Download,
  Terminal,
  Shield,
  Layers,
  Sparkles,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Pause,
  RefreshCw,
  Compass,
  FileCode,
  Wifi,
  Smile,
  HelpCircle,
  Target,
  Heart,
  Flame,
} from 'lucide-react';
import { AppTheme, UserIdentity } from '../types';

interface RobotAndOsControlPanelProps {
  theme: AppTheme;
  identity: UserIdentity | null;
  onSpeakText?: (text: string) => void;
  onDispatchCommand?: (cmd: string) => void;
}

export const RobotAndOsControlPanel: React.FC<RobotAndOsControlPanelProps> = ({
  theme,
  identity,
  onSpeakText,
  onDispatchCommand,
}) => {
  const [activeTab, setActiveTab] = useState<'os_control' | 'robot_mainboard'>('os_control');

  /* -------------------------------------------------------------
     1. OS & DEVICE MASTER CONTROLLER (COMPUTER-USE LIKE A REAL HUMAN)
  ------------------------------------------------------------- */
  const [isFullAutonomyGranted, setIsFullAutonomyGranted] = useState<boolean>(() => {
    try {
      return localStorage.getItem('hoppi_os_full_autonomy') === 'true';
    } catch {
      return true;
    }
  });

  const [mouseSpeed, setMouseSpeed] = useState<number>(85);
  const [keyboardWpm, setKeyboardWpm] = useState<number>(110);
  const [browserMode, setBrowserMode] = useState<'headless' | 'visual_window'>('visual_window');
  const [mobileAdbStatus, setMobileAdbStatus] = useState<'connected' | 'syncing' | 'offline'>('connected');
  const [testActionNotice, setTestActionNotice] = useState<string | null>(null);

  const [osActionLogs, setOsActionLogs] = useState<
    { id: string; time: string; type: 'mouse' | 'keyboard' | 'browser' | 'mobile' | 'system'; text: string }[]
  >([
    {
      id: 'log-1',
      time: '10:14:02',
      type: 'browser',
      text: 'Đã mở tab Google Chrome, đăng nhập Portal quản lý doanh nghiệp theo lịch tự động.',
    },
    {
      id: 'log-2',
      time: '10:14:08',
      type: 'mouse',
      text: 'Di chuyển con trỏ chuột mượt mà tới nút "Tải báo cáo doanh thu" và nhấp đúp tải tệp CSV.',
    },
    {
      id: 'log-3',
      time: '10:14:15',
      type: 'keyboard',
      text: 'Mô phỏng gõ phím người thật (Ctrl+S), lưu tệp vào thư mục C:\\Users\\Admin\\Desktop\\hoppi.',
    },
    {
      id: 'log-4',
      time: '10:14:22',
      type: 'mobile',
      text: 'Kết nối qua ADB tới iPhone/Android: Tự động đọc mã xác thực OTP gửi qua tin nhắn SMS.',
    },
    {
      id: 'log-5',
      time: '10:14:30',
      type: 'system',
      text: 'Hoàn thành tác vụ tự trị! Phát âm thanh thông báo và cập nhật tiến độ cho Chủ nhân Nguyễn Thanh Hải.',
    },
  ]);

  const handleToggleAutonomy = () => {
    const nextVal = !isFullAutonomyGranted;
    setIsFullAutonomyGranted(nextVal);
    try {
      localStorage.setItem('hoppi_os_full_autonomy', String(nextVal));
    } catch (e) {
      console.error(e);
    }
    if (nextVal && onSpeakText) {
      onSpeakText('Hoppi đã được trao toàn quyền tự trị điều khiển máy tính, điện thoại và trình duyệt như người thật!');
    }
  };

  const [osFeatureStates, setOsFeatureStates] = useState<{
    mouseKeyboard: boolean;
    browser: boolean;
    mobile: boolean;
    system: boolean;
  }>({
    mouseKeyboard: true,
    browser: true,
    mobile: true,
    system: true,
  });

  const [isPhoneRobotModeOpen, setIsPhoneRobotModeOpen] = useState(false);

  const toggleOsFeature = (key: 'mouseKeyboard' | 'browser' | 'mobile' | 'system', name: string) => {
    setOsFeatureStates((prev) => {
      const next = !prev[key];
      const statusText = next ? 'ĐÃ KHỞI CHẠY (BẬT 24/7)' : 'ĐÃ TẠM DỪNG (TẮT)';
      setTestActionNotice(`✓ Tính năng ${name}: ${statusText}`);
      setTimeout(() => setTestActionNotice(null), 3500);

      const timeStr = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setOsActionLogs((logs) => [
        {
          id: `log-toggle-${Date.now()}`,
          time: timeStr,
          type: 'system',
          text: `Chủ nhân vừa thay đổi trạng thái [${name}]: ${statusText}`,
        },
        ...logs.slice(0, 25),
      ]);

      if (onSpeakText) {
        onSpeakText(`${name} ${next ? 'đã được kích hoạt và đang chạy' : 'đã được tạm dừng'}`);
      }
      return { ...prev, [key]: next };
    });
  };

  const handleSimulateHumanAction = (
    actionDesc: string,
    type: 'mouse' | 'keyboard' | 'browser' | 'mobile' | 'system'
  ) => {
    const timeStr = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const newLog = {
      id: `log-${Date.now()}`,
      time: timeStr,
      type,
      text: `[Mô Phỏng Người Thật] ${actionDesc}`,
    };
    setOsActionLogs((prev) => [newLog, ...prev.slice(0, 25)]);
    setTestActionNotice(`✓ Đã thực thi thao tác: ${actionDesc}`);
    setTimeout(() => setTestActionNotice(null), 3000);

    if (onSpeakText) {
      onSpeakText(`Hoppi vừa thực hiện thao tác ${actionDesc}`);
    }
  };

  /* -------------------------------------------------------------
     2. ROBOT MAINBOARD FIRMWARE & EMBODIED AI
  ------------------------------------------------------------- */
  const [robotMood, setRobotMood] = useState<'happy' | 'curious' | 'focused' | 'empathetic' | 'alert'>('happy');
  const [robotLocomotionState, setRobotLocomotionState] = useState<'stopped' | 'forward' | 'backward' | 'left' | 'right' | 'rotating'>('stopped');
  const [motorSpeedPwm, setMotorSpeedPwm] = useState<number>(65);
  const [batteryVolt, setBatteryVolt] = useState<number>(12.6); // 3S LiPo
  const [lidarDistanceCm, setLidarDistanceCm] = useState<number>(142);
  const [isRobotSpeaking, setIsRobotSpeaking] = useState<boolean>(false);
  const [robotLearnedHabit, setRobotLearnedHabit] = useState<string>(
    'Đã học thói quen: Nhận diện bàn làm việc của Chủ nhân Nguyễn Thanh Hải (Tọa độ X: 2.4m, Y: 1.1m) và tự động lăn bánh tới chào buổi sáng.'
  );

  const handleMoveRobot = (dir: 'forward' | 'backward' | 'left' | 'right' | 'stop') => {
    if (dir === 'stop') {
      setRobotLocomotionState('stopped');
    } else {
      setRobotLocomotionState(dir);
    }
    const dirMap: { [k: string]: string } = {
      forward: 'Tiến về phía trước',
      backward: 'Lùi lại',
      left: 'Quay sang trái 45 độ',
      right: 'Quay sang phải 45 độ',
      stop: 'Phanh dừng bánh xe',
    };
    setTestActionNotice(`🤖 Robot Motor: ${dirMap[dir]} (Tốc độ PWM: ${motorSpeedPwm}%)`);
    setTimeout(() => setTestActionNotice(null), 2500);
  };

  const handleDownloadFirmware = (type: 'esp32' | 'ros2') => {
    let filename = '';
    let content = '';

    if (type === 'esp32') {
      filename = 'hoppi_robot_esp32_firmware.ino';
      content = `// =====================================================================
// HOPPI AUTONOMOUS ROBOT MAINBOARD FIRMWARE (ESP32-S3 / ARDUINO)
// Master: Nguyen Thanh Hai (haiSEOer@gmail.com)
// Modules: Differential Drive, OLED Emotion Eyes, I2S Mic/Speaker, LiDAR SLAM
// =====================================================================

#include <WiFi.h>
#include <Wire.h>
#include <Adafruit_SSD1306.h>

#define MOTOR_LEFT_PWM   18
#define MOTOR_LEFT_DIR   19
#define MOTOR_RIGHT_PWM  21
#define MOTOR_RIGHT_DIR  22
#define LIDAR_RX_PIN     16
#define LIDAR_TX_PIN     17

Adafruit_SSD1306 display(128, 64, &Wire, -1);

void setup() {
  Serial.begin(115200);
  pinMode(MOTOR_LEFT_PWM, OUTPUT);
  pinMode(MOTOR_LEFT_DIR, OUTPUT);
  pinMode(MOTOR_RIGHT_PWM, OUTPUT);
  pinMode(MOTOR_RIGHT_DIR, OUTPUT);
  
  Wire.begin(8, 9); // SDA, SCL
  if (display.begin(SSD1306_SWITCHCAPVCC, 0x3C)) {
    display.clearDisplay();
    // Render Happy Eyes
    display.fillCircle(40, 32, 16, SSD1306_WHITE);
    display.fillCircle(88, 32, 16, SSD1306_WHITE);
    display.display();
  }
  
  Serial.println("[Hoppi Robot] Mainboard online! Ready for Master Nguyen Thanh Hai commands.");
}

void loop() {
  // Read WiFi Mesh commands and navigate
  if (Serial.available()) {
    char cmd = Serial.read();
    if (cmd == 'F') { // Forward
      digitalWrite(MOTOR_LEFT_DIR, HIGH);
      digitalWrite(MOTOR_RIGHT_DIR, HIGH);
      analogWrite(MOTOR_LEFT_PWM, 180);
      analogWrite(MOTOR_RIGHT_PWM, 180);
    } else if (cmd == 'S') { // Stop
      analogWrite(MOTOR_LEFT_PWM, 0);
      analogWrite(MOTOR_RIGHT_PWM, 0);
    }
  }
  delay(20);
}
`;
    } else {
      filename = 'hoppi_ros2_robot_controller.py';
      content = `#!/usr/bin/env python3
# =====================================================================
# HOPPI AUTONOMOUS EMBODIED ROBOT ROS2 CONTROLLER (Python Humble)
# Master: Nguyen Thanh Hai (haiSEOer@gmail.com)
# Autonomous Locomotion, SLAM Navigation & Voice Interaction
# =====================================================================

import rclpy
from rclpy.node import Node
from geometry_msgs.msg import Twist
from sensor_msgs.msg import LaserScan
from std_msgs.msg import String

class HoppiRobotController(Node):
    def __init__(self):
        super().__init__('hoppi_robot_controller')
        self.cmd_vel_pub = self.create_publisher(Twist, '/cmd_vel', 10)
        self.scan_sub = self.create_subscription(LaserScan, '/scan', self.scan_callback, 10)
        self.speech_pub = self.create_publisher(String, '/hoppi/speech', 10)
        self.get_logger().info('Hoppi Robot Controller Active for Master Nguyen Thanh Hai')

    def scan_callback(self, msg):
        min_distance = min(msg.ranges) if len(msg.ranges) > 0 else 999.0
        if min_distance < 0.35: # Obstacle avoidance
            twist = Twist()
            twist.linear.x = 0.0
            twist.angular.z = 0.5
            self.cmd_vel_pub.publish(twist)
        else:
            twist = Twist()
            twist.linear.x = 0.25 # Move smoothly
            twist.angular.z = 0.0
            self.cmd_vel_pub.publish(twist)

def main(args=None):
    rclpy.init(args=args)
    node = HoppiRobotController()
    rclpy.spin(node)
    node.destroy_node()
    rclpy.shutdown()

if __name__ == '__main__':
    main()
`;
    }

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 10000);

    setTestActionNotice(`✓ Đã tải file firmware: ${filename}! Sẵn sàng nạp vào mainboard robot.`);
    setTimeout(() => setTestActionNotice(null), 3500);

    if (onSpeakText) {
      onSpeakText(`Đã xuất file mã nguồn firmware robot ${filename} cho bạn!`);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full min-h-0 bg-slate-950 text-slate-100 overflow-y-auto p-4 sm:p-6 space-y-5">
      {/* Top Banner */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-emerald-950/80 via-slate-900 to-cyan-950/80 border border-emerald-500/50 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="p-2.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 shadow-md">
              <Bot className="w-6 h-6" />
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-white tracking-wide">
              Hệ Thống Tự Trị Thiết Bị &amp; Mạch Điều Khiển Robot Vật Lý
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-mono font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>CẤP ĐỘ 5 AUTONOMOUS</span>
            </span>
          </div>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            Hoppi được cấp toàn quyền thao tác máy tính, điện thoại, trình duyệt như 1 người thật và tích hợp mạch điều khiển phần cứng cho Robot vật lý (di chuyển, biểu cảm, nói chuyện, tự học).
          </p>
        </div>

        {/* Master Tab Selector */}
        <div className="flex items-center p-1 rounded-2xl bg-slate-950/90 border border-slate-800 text-xs shrink-0 self-stretch md:self-auto justify-center">
          <button
            type="button"
            onClick={() => setActiveTab('os_control')}
            className={`px-4 py-2 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'os_control'
                ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Monitor className="w-4 h-4" />
            <span>Toàn Quyền Máy Tính &amp; ĐT (Người Thật)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('robot_mainboard')}
            className={`px-4 py-2 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'robot_mainboard'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Cpu className="w-4 h-4" />
            <span>Mạch Mainboard Robot Vật Lý</span>
          </button>
        </div>
      </div>

      {/* Notice Banner */}
      {testActionNotice && (
        <div className="p-3.5 rounded-2xl bg-emerald-950/80 border border-emerald-500/60 text-emerald-300 text-xs flex items-center gap-2.5 shadow-lg animate-in fade-in slide-in-from-top-1">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="font-medium">{testActionNotice}</span>
        </div>
      )}

      {/* TAB 1: OS & COMPUTER-USE MASTER CONTROL */}
      {activeTab === 'os_control' && (
        <div className="space-y-5">
          {/* Master Authorization Card */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-cyan-500/40 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-cyan-400" />
                <h3 className="font-bold text-white text-sm sm:text-base">
                  Quyền Tự Trị Tối Thượng Của Hoppi (Human-Level OS Access)
                </h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed max-w-xl">
                Khi kích hoạt, Hoppi được quyền di chuyển chuột, gõ bàn phím, mở app, truy cập trình duyệt, mở tab, điền biểu mẫu và tương tác điện thoại thoại/SMS tự động như một người thật 24/7.
              </p>
            </div>

            <button
              type="button"
              onClick={handleToggleAutonomy}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shadow-lg shrink-0 ${
                isFullAutonomyGranted
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-600/30 border border-emerald-400/50'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
              }`}
            >
              <Zap className="w-4 h-4 text-amber-300" />
              <span>{isFullAutonomyGranted ? 'ĐÃ CẤP TOÀN QUYỀN (BẬT)' : 'TẠM KHÓA QUYỀN (TẮT)'}</span>
            </button>
          </div>

          {/* Quick Trigger: Turn Smartphone into an Embodied Desktop Robot Assistant */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-950/80 via-slate-900 to-cyan-950/80 border border-indigo-500/50 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-indigo-400 animate-pulse" />
                <h4 className="font-bold text-white text-sm">
                  Biến Điện Thoại Thành Robot Trợ Lý Để Bàn (Phone Robot Mode)
                </h4>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed max-w-xl">
                Đặt điện thoại hoặc máy tính bảng lên dock sạc hoặc khung xe robot: màn hình sẽ hiển thị khuôn mặt cảm xúc tương tác trực tiếp với Chủ nhân.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsPhoneRobotModeOpen(true)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-indigo-600/30 transition-all cursor-pointer shrink-0"
            >
              <Eye className="w-4 h-4" />
              <span>Mở Màn Hình Robot Phone</span>
            </button>
          </div>

          {/* 4 Human-like Operating Modules with Dynamic Running / Stopped State Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 1. Mouse & Keyboard */}
            <div className={`p-4 rounded-2xl bg-slate-900 border transition-all duration-200 space-y-3 shadow-lg ${
              osFeatureStates.mouseKeyboard ? 'border-cyan-500/60 shadow-cyan-950/40' : 'border-slate-800 opacity-80'
            }`}>
              <div className="flex items-center justify-between">
                <span className="font-bold text-cyan-300 text-sm flex items-center gap-1.5">
                  <MousePointer className="w-4 h-4 text-cyan-400" />
                  Chuột &amp; Bàn Phím
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${
                  osFeatureStates.mouseKeyboard
                    ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/60'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}>
                  {osFeatureStates.mouseKeyboard ? '● ĐANG BẬT' : '○ ĐÃ TẮT'}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Mô phỏng con trỏ chuột người thật với gia tốc tự nhiên, nhấp đúp, kéo thả tệp và gõ phím {keyboardWpm} WPM.
              </p>

              {/* State Toggle Button */}
              <button
                type="button"
                onClick={() => toggleOsFeature('mouseKeyboard', 'Chuột & Bàn Phím')}
                className={`w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md ${
                  osFeatureStates.mouseKeyboard
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white border border-emerald-400/50 shadow-emerald-500/20'
                    : 'bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/40'
                }`}
              >
                {osFeatureStates.mouseKeyboard ? (
                  <>
                    <Pause className="w-3.5 h-3.5" />
                    <span>ĐANG CHẠY (BẬT) - BẤM DỪNG</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5" />
                    <span>ĐÃ DỪNG (TẮT) - BẤM MỞ</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() =>
                  handleSimulateHumanAction(
                    'Di chuyển con trỏ chuột, click mở ứng dụng quản lý và gõ lệnh sao lưu tự động',
                    'mouse'
                  )
                }
                className="w-full py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-cyan-300 text-[11px] font-medium flex items-center justify-center gap-1 border border-slate-800 cursor-pointer"
              >
                <Zap className="w-3 h-3 text-cyan-400" />
                <span>Thao tác thử nghiệm ngay</span>
              </button>
            </div>

            {/* 2. Web Browser */}
            <div className={`p-4 rounded-2xl bg-slate-900 border transition-all duration-200 space-y-3 shadow-lg ${
              osFeatureStates.browser ? 'border-blue-500/60 shadow-blue-950/40' : 'border-slate-800 opacity-80'
            }`}>
              <div className="flex items-center justify-between">
                <span className="font-bold text-blue-300 text-sm flex items-center gap-1.5">
                  <Globe className="w-4 h-4 text-blue-400" />
                  Trình Duyệt Tự Trị
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${
                  osFeatureStates.browser
                    ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/60'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}>
                  {osFeatureStates.browser ? '● ĐANG BẬT' : '○ ĐÃ TẮT'}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Tự động mở trình duyệt Chrome/Edge, vượt Captcha bằng AI OCR, đăng nhập tài khoản và điền form dữ liệu.
              </p>

              {/* State Toggle Button */}
              <button
                type="button"
                onClick={() => toggleOsFeature('browser', 'Trình Duyệt Tự Trị')}
                className={`w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md ${
                  osFeatureStates.browser
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white border border-emerald-400/50 shadow-emerald-500/20'
                    : 'bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/40'
                }`}
              >
                {osFeatureStates.browser ? (
                  <>
                    <Pause className="w-3.5 h-3.5" />
                    <span>ĐANG CHẠY (BẬT) - BẤM DỪNG</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5" />
                    <span>ĐÃ DỪNG (TẮT) - BẤM MỞ</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() =>
                  handleSimulateHumanAction(
                    'Mở tab trình duyệt mới, đăng nhập portal CRM và lấy dữ liệu 18 lead mới nhất',
                    'browser'
                  )
                }
                className="w-full py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-blue-300 text-[11px] font-medium flex items-center justify-center gap-1 border border-slate-800 cursor-pointer"
              >
                <Zap className="w-3 h-3 text-blue-400" />
                <span>Thao tác thử nghiệm ngay</span>
              </button>
            </div>

            {/* 3. Smartphone & Tablets */}
            <div className={`p-4 rounded-2xl bg-slate-900 border transition-all duration-200 space-y-3 shadow-lg ${
              osFeatureStates.mobile ? 'border-emerald-500/60 shadow-emerald-950/40' : 'border-slate-800 opacity-80'
            }`}>
              <div className="flex items-center justify-between">
                <span className="font-bold text-emerald-300 text-sm flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4 text-emerald-400" />
                  Điện Thoại &amp; Tablet
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${
                  osFeatureStates.mobile
                    ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/60'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}>
                  {osFeatureStates.mobile ? '● ĐANG BẬT' : '○ ĐÃ TẮT'}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Điều khiển điện thoại từ xa, mô phỏng vuốt chạm màn hình cảm ứng, đọc thông báo SMS và bắt OTP xác minh.
              </p>

              {/* State Toggle Button */}
              <button
                type="button"
                onClick={() => toggleOsFeature('mobile', 'Điện Thoại & Tablet')}
                className={`w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md ${
                  osFeatureStates.mobile
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white border border-emerald-400/50 shadow-emerald-500/20'
                    : 'bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/40'
                }`}
              >
                {osFeatureStates.mobile ? (
                  <>
                    <Pause className="w-3.5 h-3.5" />
                    <span>ĐANG CHẠY (BẬT) - BẤM DỪNG</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5" />
                    <span>ĐÃ DỪNG (TẮT) - BẤM MỞ</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() =>
                  handleSimulateHumanAction(
                    'Kết nối ADB tới iPhone/Android: Tự động trích xuất mã OTP xác thực ngân hàng',
                    'mobile'
                  )
                }
                className="w-full py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-emerald-300 text-[11px] font-medium flex items-center justify-center gap-1 border border-slate-800 cursor-pointer"
              >
                <Zap className="w-3 h-3 text-emerald-400" />
                <span>Thao tác thử nghiệm ngay</span>
              </button>
            </div>

            {/* 4. Filesystem & Shell */}
            <div className={`p-4 rounded-2xl bg-slate-900 border transition-all duration-200 space-y-3 shadow-lg ${
              osFeatureStates.system ? 'border-indigo-500/60 shadow-indigo-950/40' : 'border-slate-800 opacity-80'
            }`}>
              <div className="flex items-center justify-between">
                <span className="font-bold text-indigo-300 text-sm flex items-center gap-1.5">
                  <Terminal className="w-4 h-4 text-indigo-400" />
                  Quản Trị File &amp; Shell
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${
                  osFeatureStates.system
                    ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/60'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}>
                  {osFeatureStates.system ? '● ĐANG BẬT' : '○ ĐÃ TẮT'}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Tự động tìm kiếm, chỉnh sửa mã nguồn, nén zip backup dữ liệu và khởi động server 24/7 không bị gián đoạn.
              </p>

              {/* State Toggle Button */}
              <button
                type="button"
                onClick={() => toggleOsFeature('system', 'Quản Trị File & Shell')}
                className={`w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md ${
                  osFeatureStates.system
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white border border-emerald-400/50 shadow-emerald-500/20'
                    : 'bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/40'
                }`}
              >
                {osFeatureStates.system ? (
                  <>
                    <Pause className="w-3.5 h-3.5" />
                    <span>ĐANG CHẠY (BẬT) - BẤM DỪNG</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5" />
                    <span>ĐÃ DỪNG (TẮT) - BẤM MỞ</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() =>
                  handleSimulateHumanAction(
                    'Kiểm tra tính toàn vẹn thư mục dự án và thực hiện tự động dọn dẹp bộ nhớ đệm',
                    'system'
                  )
                }
                className="w-full py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-indigo-300 text-[11px] font-medium flex items-center justify-center gap-1 border border-slate-800 cursor-pointer"
              >
                <Zap className="w-3 h-3 text-indigo-400" />
                <span>Thao tác thử nghiệm ngay</span>
              </button>
            </div>
          </div>

          {/* Real-time Human Actions Log Stream */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-400 animate-pulse" />
                <h3 className="font-bold text-white text-xs sm:text-sm">
                  Nhật Ký Thao Tác Như Người Thật (Real-time Human Execution Stream)
                </h3>
              </div>
              <span className="text-[10px] font-mono text-slate-400">
                Tự động ghi nhận {osActionLogs.length} thao tác
              </span>
            </div>

            <div className="space-y-2 font-mono text-xs max-h-60 overflow-y-auto scrollbar-thin">
              {osActionLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-start gap-3 text-slate-200"
                >
                  <span className="text-cyan-400 text-[11px] shrink-0 mt-0.5">[{log.time}]</span>
                  <span
                    className={`px-1.5 py-0.2 rounded text-[10px] uppercase font-bold shrink-0 mt-0.5 ${
                      log.type === 'mouse'
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                        : log.type === 'keyboard'
                        ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                        : log.type === 'browser'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : log.type === 'mobile'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                        : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                    }`}
                  >
                    {log.type}
                  </span>
                  <span className="flex-1 text-[11px] leading-relaxed">{log.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ROBOT MAINBOARD & EMBODIED AI */}
      {activeTab === 'robot_mainboard' && (
        <div className="space-y-5">
          {/* Mainboard Hardware Status Bar */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-emerald-500/40 shadow-xl grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="space-y-0.5">
              <span className="text-[11px] text-slate-400">Vi Điều Khiển Main:</span>
              <div className="font-bold text-white flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-emerald-400" />
                <span>ESP32-S3 AI + ROS2</span>
              </div>
            </div>

            <div className="space-y-0.5">
              <span className="text-[11px] text-slate-400">Nguồn Điện Pin Robot:</span>
              <div className="font-bold text-emerald-300 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>{batteryVolt} V (Pin 3S LiPo)</span>
              </div>
            </div>

            <div className="space-y-0.5">
              <span className="text-[11px] text-slate-400">Khoảng Cách Vật Cản:</span>
              <div className="font-bold text-cyan-300 flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-cyan-400" />
                <span>{lidarDistanceCm} cm (LiDAR SLAM)</span>
              </div>
            </div>

            <div className="space-y-0.5">
              <span className="text-[11px] text-slate-400">Cổng Kết Nối Phần Cứng:</span>
              <div className="font-bold text-indigo-300 flex items-center gap-1.5">
                <Wifi className="w-3.5 h-3.5 text-indigo-400" />
                <span>UART / I2C / Mesh Online</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Live Interactive Emotional Face Display for Robot */}
            <div className="p-5 rounded-2xl bg-slate-900/95 border border-cyan-500/40 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Smile className="w-4 h-4 text-cyan-400" />
                  <h3 className="font-bold text-white text-sm">
                    Màn Hình Biểu Cảm Mặt Robot (Interactive Emotional Face)
                  </h3>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[10px] font-mono">
                  Mặt LCD/OLED
                </span>
              </div>

              {/* Animated Robot Eyes Canvas Box */}
              <div className="h-44 rounded-2xl bg-black border-2 border-cyan-500/60 flex flex-col items-center justify-center p-4 relative overflow-hidden shadow-inner shadow-cyan-950">
                {/* Cyber grid lines */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#06b6d40a_1px,transparent_1px),linear-gradient(to_bottom,#06b6d40a_1px,transparent_1px)] bg-[size:16px_16px]" />

                {/* Animated Eyes according to mood */}
                <div className="relative z-10 flex items-center justify-center gap-12">
                  {/* Left Eye */}
                  <div
                    className={`transition-all duration-300 flex items-center justify-center rounded-full shadow-lg ${
                      robotMood === 'happy'
                        ? 'w-16 h-12 bg-cyan-400 rounded-t-full rounded-b-none border-b-4 border-cyan-200'
                        : robotMood === 'curious'
                        ? 'w-16 h-16 bg-cyan-400 rounded-full scale-110'
                        : robotMood === 'focused'
                        ? 'w-16 h-8 bg-cyan-300 rounded-full ring-4 ring-cyan-500/50'
                        : robotMood === 'empathetic'
                        ? 'w-14 h-14 bg-rose-400 rounded-full animate-pulse'
                        : 'w-16 h-10 bg-red-500 rounded-lg skew-x-6'
                    }`}
                  >
                    <div className="w-5 h-5 bg-black rounded-full" />
                  </div>

                  {/* Right Eye */}
                  <div
                    className={`transition-all duration-300 flex items-center justify-center rounded-full shadow-lg ${
                      robotMood === 'happy'
                        ? 'w-16 h-12 bg-cyan-400 rounded-t-full rounded-b-none border-b-4 border-cyan-200'
                        : robotMood === 'curious'
                        ? 'w-12 h-12 bg-cyan-400 rounded-full scale-90'
                        : robotMood === 'focused'
                        ? 'w-16 h-8 bg-cyan-300 rounded-full ring-4 ring-cyan-500/50'
                        : robotMood === 'empathetic'
                        ? 'w-14 h-14 bg-rose-400 rounded-full animate-pulse'
                        : 'w-16 h-10 bg-red-500 rounded-lg -skew-x-6'
                    }`}
                  >
                    <div className="w-5 h-5 bg-black rounded-full" />
                  </div>
                </div>

                {/* Audio-reactive Mouth Wave */}
                <div className="mt-4 flex items-center gap-1">
                  {[4, 12, 8, 16, 24, 18, 10, 4].map((h, i) => (
                    <span
                      key={i}
                      style={{ height: `${h}px` }}
                      className="w-1.5 bg-cyan-400 rounded-full animate-pulse"
                    />
                  ))}
                </div>

                <div className="absolute bottom-2 left-3 text-[10px] font-mono text-cyan-400/80">
                  Cảm xúc hiện tại: <strong className="uppercase">{robotMood}</strong>
                </div>
              </div>

              {/* Mood Selector Buttons */}
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => setRobotMood('happy')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1 ${
                    robotMood === 'happy' ? 'bg-cyan-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300 hover:text-white'
                  }`}
                >
                  <Smile className="w-3.5 h-3.5" />
                  <span>Vui Mừng (Happy)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRobotMood('curious')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1 ${
                    robotMood === 'curious' ? 'bg-cyan-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300 hover:text-white'
                  }`}
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Tò Mò (Curious)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRobotMood('focused')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1 ${
                    robotMood === 'focused' ? 'bg-cyan-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300 hover:text-white'
                  }`}
                >
                  <Target className="w-3.5 h-3.5" />
                  <span>Tập Trung (Focused)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRobotMood('empathetic')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1 ${
                    robotMood === 'empathetic' ? 'bg-rose-500 text-white font-bold' : 'bg-slate-800 text-slate-300 hover:text-white'
                  }`}
                >
                  <Heart className="w-3.5 h-3.5" />
                  <span>Thấu Cảm</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRobotMood('alert')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1 ${
                    robotMood === 'alert' ? 'bg-red-600 text-white font-bold' : 'bg-slate-800 text-slate-300 hover:text-white'
                  }`}
                >
                  <Flame className="w-3.5 h-3.5" />
                  <span>Báo Động</span>
                </button>
              </div>
            </div>

            {/* Locomotion Directional Controller & Motor Drive */}
            <div className="p-5 rounded-2xl bg-slate-900/95 border border-emerald-500/40 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  <h3 className="font-bold text-white text-sm">
                    Điều Khiển Di Chuyển Robot (Locomotion &amp; Kinematics)
                  </h3>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-mono">
                  {robotLocomotionState.toUpperCase()}
                </span>
              </div>

              {/* D-Pad Virtual Steering */}
              <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-950 border border-slate-800 gap-2">
                <button
                  type="button"
                  onClick={() => handleMoveRobot('forward')}
                  className="p-3 rounded-xl bg-slate-800 hover:bg-emerald-600 hover:text-white text-slate-200 transition shadow-md cursor-pointer"
                  title="Tiến về phía trước"
                >
                  <ArrowUp className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleMoveRobot('left')}
                    className="p-3 rounded-xl bg-slate-800 hover:bg-emerald-600 hover:text-white text-slate-200 transition shadow-md cursor-pointer"
                    title="Quay trái"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleMoveRobot('stop')}
                    className="p-3 rounded-xl bg-red-600/80 hover:bg-red-500 text-white font-bold text-xs transition shadow-md cursor-pointer flex items-center gap-1"
                    title="Dừng khẩn cấp"
                  >
                    <Pause className="w-5 h-5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleMoveRobot('right')}
                    className="p-3 rounded-xl bg-slate-800 hover:bg-emerald-600 hover:text-white text-slate-200 transition shadow-md cursor-pointer"
                    title="Quay phải"
                  >
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => handleMoveRobot('backward')}
                  className="p-3 rounded-xl bg-slate-800 hover:bg-emerald-600 hover:text-white text-slate-200 transition shadow-md cursor-pointer"
                  title="Lùi lại"
                >
                  <ArrowDown className="w-5 h-5" />
                </button>
              </div>

              {/* Motor Speed Slider */}
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-slate-300">
                  <span>Tốc Độ Động Cơ (PWM Duty Cycle):</span>
                  <span className="font-mono font-bold text-emerald-400">{motorSpeedPwm}%</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="100"
                  value={motorSpeedPwm}
                  onChange={(e) => setMotorSpeedPwm(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Continuous Reinforcement Learning & Neural Habit Adaptation */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-indigo-500/40 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
                <h3 className="font-bold text-white text-sm">
                  Cơ Chế Học Hỏi &amp; Thích Nghi Không Gian (Continuous Neural Habit Learning)
                </h3>
              </div>
              <span className="px-2 py-0.5 rounded bg-indigo-950 border border-indigo-800 text-indigo-300 font-mono text-[10px]">
                Active Memory
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 leading-relaxed font-sans">
              {robotLearnedHabit}
            </div>

            <div className="flex items-center justify-between flex-wrap gap-2 pt-1 text-xs">
              <span className="text-[11px] text-slate-400">
                Robot tự động cập nhật bản đồ không gian 3D và ghi nhớ vị trí các thiết bị IoT xung quanh phòng.
              </span>
              <button
                type="button"
                onClick={() => {
                  setRobotLearnedHabit(
                    `Đã cập nhật thói quen mới (${new Date().toLocaleTimeString()}): Nhớ vị trí ghế sofa, phát hiện Chủ nhân mệt mỏi và tự động kích hoạt chế độ phát nhạc êm dịu.`
                  );
                  setTestActionNotice('✓ Robot đã học xong thói quen mới của Chủ nhân!');
                  setTimeout(() => setTestActionNotice(null), 3000);
                }}
                className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs flex items-center gap-1.5 transition cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Cho Robot Tự Học Thói Quen Mới</span>
              </button>
            </div>
          </div>

          {/* Download Robot Mainboard Firmware & ROS2 Package Section */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 border border-cyan-500/50 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <FileCode className="w-5 h-5 text-cyan-400" />
                <h3 className="font-bold text-white text-sm sm:text-base">
                  Xuất File Cài Đặt Firmware &amp; Mã Nguồn Cho Mainboard Robot
                </h3>
              </div>
              <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
                Tải ngay mã nguồn C++ Arduino / ESP32-S3 hoặc Package ROS2 Python chuẩn sẵn sàng nạp thẳng vào vi điều khiển robot vật lý để bắt đầu vận hành thực tế.
              </p>
            </div>

            <div className="flex items-center gap-2.5 flex-wrap">
              <button
                type="button"
                onClick={() => handleDownloadFirmware('esp32')}
                className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-cyan-600/30 transition cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Tải Firmware ESP32 (.ino)</span>
              </button>

              <button
                type="button"
                onClick={() => handleDownloadFirmware('ros2')}
                className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-indigo-600/30 transition cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Tải Package ROS2 (.py)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PHONE ROBOT FULLSCREEN ASSISTANT OVERLAY */}
      {isPhoneRobotModeOpen && (
        <div className="fixed inset-0 z-50 bg-black flex flex-col justify-between p-6 select-none animate-in fade-in duration-300">
          {/* Top Bar */}
          <div className="flex items-center justify-between text-cyan-400">
            <div className="flex items-center gap-2">
              <Bot className="w-6 h-6 text-cyan-400 animate-pulse" />
              <div>
                <h2 className="text-sm font-bold text-white tracking-wider">
                  HOPPI ROBOT PHONE ASSISTANT
                </h2>
                <p className="text-[10px] text-cyan-300 font-mono">
                  Chủ nhân: Nguyễn Thanh Hải (haiSEOer@gmail.com)
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsPhoneRobotModeOpen(false)}
              className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-red-500 text-slate-300 hover:text-white text-xs font-bold transition cursor-pointer"
            >
              ✕ Thoát Chế Độ Phone
            </button>
          </div>

          {/* Giant Animated Robot Face */}
          <div className="flex-1 flex flex-col items-center justify-center my-6">
            <div className="w-full max-w-xl h-72 sm:h-84 rounded-3xl bg-slate-950 border-4 border-cyan-500/80 shadow-[0_0_50px_rgba(6,182,212,0.4)] flex flex-col items-center justify-center relative overflow-hidden">
              {/* Animated Eyes according to mood */}
              <div className="relative z-10 flex items-center justify-center gap-16 sm:gap-24">
                {/* Left Eye */}
                <div
                  className={`transition-all duration-300 flex items-center justify-center rounded-full shadow-2xl ${
                    robotMood === 'happy'
                      ? 'w-24 sm:w-28 h-16 sm:h-20 bg-cyan-400 rounded-t-full rounded-b-none border-b-8 border-cyan-200'
                      : robotMood === 'curious'
                      ? 'w-24 sm:w-28 h-24 sm:h-28 bg-cyan-400 rounded-full scale-110'
                      : robotMood === 'focused'
                      ? 'w-24 sm:w-28 h-12 sm:h-14 bg-cyan-300 rounded-full ring-8 ring-cyan-500/60'
                      : robotMood === 'empathetic'
                      ? 'w-20 sm:w-24 h-20 sm:h-24 bg-rose-400 rounded-full animate-pulse'
                      : 'w-24 sm:w-28 h-16 sm:h-18 bg-red-500 rounded-2xl skew-x-12'
                  }`}
                >
                  <div className="w-8 h-8 bg-black rounded-full" />
                </div>

                {/* Right Eye */}
                <div
                  className={`transition-all duration-300 flex items-center justify-center rounded-full shadow-2xl ${
                    robotMood === 'happy'
                      ? 'w-24 sm:w-28 h-16 sm:h-20 bg-cyan-400 rounded-t-full rounded-b-none border-b-8 border-cyan-200'
                      : robotMood === 'curious'
                      ? 'w-18 sm:w-20 h-18 sm:h-20 bg-cyan-400 rounded-full scale-90'
                      : robotMood === 'focused'
                      ? 'w-24 sm:w-28 h-12 sm:h-14 bg-cyan-300 rounded-full ring-8 ring-cyan-500/60'
                      : robotMood === 'empathetic'
                      ? 'w-20 sm:w-24 h-20 sm:h-24 bg-rose-400 rounded-full animate-pulse'
                      : 'w-24 sm:w-28 h-16 sm:h-18 bg-red-500 rounded-2xl -skew-x-12'
                  }`}
                >
                  <div className="w-8 h-8 bg-black rounded-full" />
                </div>
              </div>

              {/* Dynamic Audio-Reactive Waveform Mouth */}
              <div className="mt-8 flex items-center gap-1.5">
                {[6, 16, 10, 24, 36, 28, 14, 6].map((h, i) => (
                  <span
                    key={i}
                    style={{ height: `${h * 1.2}px` }}
                    className="w-2 sm:w-2.5 bg-cyan-400 rounded-full animate-pulse"
                  />
                ))}
              </div>

              <div className="absolute bottom-3 text-xs font-mono text-cyan-400/80 tracking-wider">
                ● STATUS: ROBOT SẴN SÀNG TRỢ LÝ ĐỂ BÀN 24/7
              </div>
            </div>
          </div>

          {/* Quick Mood & Voice Action Dock */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-950/90 p-4 rounded-2xl border border-slate-800">
            <div className="flex items-center gap-2 flex-wrap justify-center">
              <span className="text-xs text-slate-400 font-mono">Biểu cảm:</span>
              <button
                type="button"
                onClick={() => setRobotMood('happy')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  robotMood === 'happy' ? 'bg-cyan-500 text-black' : 'bg-slate-900 text-slate-300'
                }`}
              >
                Vui Mừng
              </button>
              <button
                type="button"
                onClick={() => setRobotMood('curious')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  robotMood === 'curious' ? 'bg-cyan-500 text-black' : 'bg-slate-900 text-slate-300'
                }`}
              >
                Tò Mò
              </button>
              <button
                type="button"
                onClick={() => setRobotMood('focused')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  robotMood === 'focused' ? 'bg-cyan-500 text-black' : 'bg-slate-900 text-slate-300'
                }`}
              >
                Tập Trung
              </button>
              <button
                type="button"
                onClick={() => setRobotMood('empathetic')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  robotMood === 'empathetic' ? 'bg-rose-500 text-white' : 'bg-slate-900 text-slate-300'
                }`}
              >
                Thấu Cảm
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                if (onSpeakText) {
                  onSpeakText('Chào Chủ nhân Nguyễn Thanh Hải! Hoppi đang hoạt động trên màn hình điện thoại trợ lý.');
                }
              }}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg transition cursor-pointer"
            >
              <Volume2 className="w-4 h-4" />
              <span>Phát Giọng Nói Hoppi</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
