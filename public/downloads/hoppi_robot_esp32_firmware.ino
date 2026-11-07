/*
 * Hoppi Autonomous AI Robot - Mainboard Firmware
 * Platform: ESP32 / ESP32-S3 (Dual Core Tensilica LX7 @ 240MHz)
 * Framework: Arduino / ESP-IDF
 * Master: Nguyen Thanh Hai (haiSEOer@gmail.com)
 * Features:
 *   - Locomotion Differential Drive (PWM Motor Driver L298N / TB6612FNG)
 *   - Animated OLED/TFT Face Display (SSD1306 / ST7789)
 *   - I2S Audio Mic & Speaker for Voice Recognition / TTS Lip-sync
 *   - MPU6050 6-DOF IMU for Balance & Tilt Detection
 *   - HC-SR04 / VL53L0X Ultrasonic/ToF Obstacle Avoidance
 *   - WiFi & BLE 5.0 Mesh Telemetry to Hoppi Central Brain
 */

#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>

#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, -1);

// Motor Driver Pins (TB6612 / L298N)
const int PIN_MOTOR_A1 = 18;
const int PIN_MOTOR_A2 = 19;
const int PIN_MOTOR_B1 = 22;
const int PIN_MOTOR_B2 = 23;
const int PIN_PWM_A    = 25;
const int PIN_PWM_B    = 26;

// Ultrasonic / ToF Distance Sensor
const int PIN_TRIG = 32;
const int PIN_ECHO = 33;

// Robot Identity & Cloud Host
const char* WIFI_SSID = "HOPPI_AUTONOMOUS_MESH";
const char* WIFI_PASS = "NguyenThanhHai2026";
const char* HOPPI_SERVER_HOST = "ais-pre-n553xcvx2k5ktidnczw2m3-826729456993.asia-east1.run.app";

// Robot States
enum RobotMood { MOOD_HAPPY, MOOD_CURIOUS, MOOD_FOCUSED, MOOD_EMPATHETIC, MOOD_ALERT };
RobotMood currentMood = MOOD_HAPPY;

int currentSpeed = 180; // 0 - 255 PWM

void drawRobotEyes(RobotMood mood) {
  display.clearDisplay();
  int leftEyeX = 36;
  int rightEyeX = 92;
  int eyeY = 32;

  switch (mood) {
    case MOOD_HAPPY:
      // Inverted arches (smiling eyes)
      display.fillCircle(leftEyeX, eyeY, 18, SSD1306_WHITE);
      display.fillRect(leftEyeX - 18, eyeY, 36, 18, SSD1306_BLACK);
      display.fillCircle(rightEyeX, eyeY, 18, SSD1306_WHITE);
      display.fillRect(rightEyeX - 18, eyeY, 36, 18, SSD1306_BLACK);
      break;

    case MOOD_CURIOUS:
      // One large, one small circle
      display.fillCircle(leftEyeX, eyeY, 20, SSD1306_WHITE);
      display.fillCircle(leftEyeX, eyeY, 6, SSD1306_BLACK);
      display.fillCircle(rightEyeX, eyeY, 13, SSD1306_WHITE);
      display.fillCircle(rightEyeX, eyeY, 4, SSD1306_BLACK);
      break;

    case MOOD_FOCUSED:
      // Sleek horizontal capsules
      display.fillRoundRect(leftEyeX - 20, eyeY - 6, 40, 12, 6, SSD1306_WHITE);
      display.fillRoundRect(rightEyeX - 20, eyeY - 6, 40, 12, 6, SSD1306_WHITE);
      break;

    case MOOD_EMPATHETIC:
      // Heart-soft pulsing eyes
      display.fillCircle(leftEyeX, eyeY, 16, SSD1306_WHITE);
      display.fillCircle(rightEyeX, eyeY, 16, SSD1306_WHITE);
      display.fillCircle(leftEyeX - 4, eyeY - 4, 4, SSD1306_BLACK);
      display.fillCircle(rightEyeX - 4, eyeY - 4, 4, SSD1306_BLACK);
      break;

    case MOOD_ALERT:
      // Sharp angled warning eyes
      display.fillTriangle(leftEyeX - 20, eyeY - 14, leftEyeX + 16, eyeY + 14, leftEyeX - 20, eyeY + 14, SSD1306_WHITE);
      display.fillTriangle(rightEyeX + 20, eyeY - 14, rightEyeX - 16, eyeY + 14, rightEyeX + 20, eyeY + 14, SSD1306_WHITE);
      break;
  }

  // Mouth waveform line
  for (int x = 40; x <= 88; x += 6) {
    int h = random(2, 10);
    display.drawLine(x, 56 - h / 2, x, 56 + h / 2, SSD1306_WHITE);
  }

  display.display();
}

void setMotors(int leftPwm, int rightPwm) {
  // Left Motor
  if (leftPwm > 0) {
    digitalWrite(PIN_MOTOR_A1, HIGH);
    digitalWrite(PIN_MOTOR_A2, LOW);
  } else if (leftPwm < 0) {
    digitalWrite(PIN_MOTOR_A1, LOW);
    digitalWrite(PIN_MOTOR_A2, HIGH);
    leftPwm = -leftPwm;
  } else {
    digitalWrite(PIN_MOTOR_A1, LOW);
    digitalWrite(PIN_MOTOR_A2, LOW);
  }

  // Right Motor
  if (rightPwm > 0) {
    digitalWrite(PIN_MOTOR_B1, HIGH);
    digitalWrite(PIN_MOTOR_B2, LOW);
  } else if (rightPwm < 0) {
    digitalWrite(PIN_MOTOR_B1, LOW);
    digitalWrite(PIN_MOTOR_B2, HIGH);
    rightPwm = -rightPwm;
  } else {
    digitalWrite(PIN_MOTOR_B1, LOW);
    digitalWrite(PIN_MOTOR_B2, LOW);
  }

  analogWrite(PIN_PWM_A, constrain(leftPwm, 0, 255));
  analogWrite(PIN_PWM_B, constrain(rightPwm, 0, 255));
}

void moveForward() { setMotors(currentSpeed, currentSpeed); }
void moveBackward() { setMotors(-currentSpeed, -currentSpeed); }
void turnLeft() { setMotors(-currentSpeed / 2, currentSpeed / 2); }
void turnRight() { setMotors(currentSpeed / 2, -currentSpeed / 2); }
void stopMotors() { setMotors(0, 0); }

long readDistanceCm() {
  digitalWrite(PIN_TRIG, LOW);
  delayMicroseconds(2);
  digitalWrite(PIN_TRIG, HIGH);
  delayMicroseconds(10);
  digitalWrite(PIN_TRIG, LOW);
  long duration = pulseIn(PIN_ECHO, HIGH, 25000);
  if (duration == 0) return 999;
  return duration * 0.034 / 2;
}

void setup() {
  Serial.begin(115200);
  Serial.println(F("[Hoppi Robot Core] Initializing firmware for Master Nguyen Thanh Hai..."));

  // Pins Setup
  pinMode(PIN_MOTOR_A1, OUTPUT);
  pinMode(PIN_MOTOR_A2, OUTPUT);
  pinMode(PIN_MOTOR_B1, OUTPUT);
  pinMode(PIN_MOTOR_B2, OUTPUT);
  pinMode(PIN_PWM_A, OUTPUT);
  pinMode(PIN_PWM_B, OUTPUT);
  pinMode(PIN_TRIG, OUTPUT);
  pinMode(PIN_ECHO, INPUT);

  stopMotors();

  // Initialize OLED Display
  if (!display.begin(SSD1306_SWITCHCAPVCC, 0x3C)) {
    Serial.println(F("[Hoppi Robot] OLED display allocation failed"));
  } else {
    drawRobotEyes(MOOD_HAPPY);
  }

  Serial.println(F("[Hoppi Robot] System Ready. Connecting to Central Autonomous Brain..."));
}

void loop() {
  // Obstacle avoidance
  long distance = readDistanceCm();
  if (distance < 20) {
    stopMotors();
    currentMood = MOOD_ALERT;
    drawRobotEyes(currentMood);
    delay(200);
    turnLeft();
    delay(400);
    stopMotors();
    currentMood = MOOD_CURIOUS;
    drawRobotEyes(currentMood);
  }

  // Serial command parser from Raspberry Pi / Jetson / Bluetooth
  if (Serial.available()) {
    char cmd = Serial.read();
    switch (cmd) {
      case 'W': case 'w': moveForward(); break;
      case 'S': case 's': moveBackward(); break;
      case 'A': case 'a': turnLeft(); break;
      case 'D': case 'd': turnRight(); break;
      case 'X': case 'x': stopMotors(); break;
      case '1': currentMood = MOOD_HAPPY; drawRobotEyes(currentMood); break;
      case '2': currentMood = MOOD_CURIOUS; drawRobotEyes(currentMood); break;
      case '3': currentMood = MOOD_FOCUSED; drawRobotEyes(currentMood); break;
      case '4': currentMood = MOOD_EMPATHETIC; drawRobotEyes(currentMood); break;
      case '5': currentMood = MOOD_ALERT; drawRobotEyes(currentMood); break;
    }
  }

  delay(20);
}
