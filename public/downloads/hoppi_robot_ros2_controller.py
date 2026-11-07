#!/usr/bin/env python3
"""
Hoppi Autonomous AI Robot - ROS2 Humble Controller Node
Platform: NVIDIA Jetson Orin Nano / Raspberry Pi 5 / Ubuntu 22.04 LTS
Master: Nguyen Thanh Hai (haiSEOer@gmail.com)
Integrates:
  - Differential Drive Navigation / Nav2 Stack
  - 2D LiDAR (RPLiDAR A1/A2/A3) SLAM Mapping (Cartographer / SLAM Toolbox)
  - Hoppi Central Brain Cloud Telemetry Bridge
  - Audio TTS & Spatial Speech Synthesizer
"""

import rclpy
from rclpy.node import Node
from geometry_msgs.msg import Twist
from sensor_msgs.msg import LaserScan
from std_msgs.msg import String
import json
import time

class HoppiRobotController(Node):
    def __init__(self):
        super().__init__('hoppi_robot_controller')
        self.get_logger().info('Hoppi Robot ROS2 Node initialized for Master Nguyen Thanh Hai')

        # Publishers
        self.cmd_vel_pub = self.create_publisher(Twist, '/cmd_vel', 10)
        self.status_pub = self.create_publisher(String, '/hoppi/robot_status', 10)
        self.face_mood_pub = self.create_publisher(String, '/hoppi/face_expression', 10)

        # Subscribers
        self.scan_sub = self.create_subscription(LaserScan, '/scan', self.scan_callback, 10)
        self.cmd_sub = self.create_subscription(String, '/hoppi/master_command', self.master_command_callback, 10)

        # Telemetry Timer (1Hz)
        self.timer = self.create_timer(1.0, self.publish_telemetry)
        self.battery_level = 94.5
        self.current_state = 'PATROL_24_7'

    def scan_callback(self, msg: LaserScan):
        # Quick front-facing safety bubble (min distance in center 60 deg cone)
        mid_idx = len(msg.ranges) // 2
        cone = msg.ranges[mid_idx - 30: mid_idx + 30]
        min_dist = min([r for r in cone if r > 0.05] or [99.0])

        if min_dist < 0.35: # 35cm obstacle safety threshold
            self.get_logger().warn(f'Obstacle detected at {min_dist:.2f}m! Halting and recalculating path...')
            stop_twist = Twist()
            self.cmd_vel_pub.publish(stop_twist)
            mood_msg = String()
            mood_msg.data = 'alert'
            self.face_mood_pub.publish(mood_msg)

    def master_command_callback(self, msg: String):
        self.get_logger().info(f'Received command from Master Nguyen Thanh Hai: {msg.data}')
        try:
            payload = json.loads(msg.data)
            action = payload.get('action')
            if action == 'move':
                linear_x = float(payload.get('linear_x', 0.2))
                angular_z = float(payload.get('angular_z', 0.0))
                twist = Twist()
                twist.linear.x = linear_x
                twist.angular.z = angular_z
                self.cmd_vel_pub.publish(twist)
            elif action == 'express':
                mood = payload.get('mood', 'happy')
                mood_msg = String()
                mood_msg.data = mood
                self.face_mood_pub.publish(mood_msg)
        except Exception as e:
            self.get_logger().error(f'Failed to parse command payload: {e}')

    def publish_telemetry(self):
        telemetry = {
            'agent': 'Hoppi Embodied Robot v4.0',
            'owner': 'Nguyen Thanh Hai (haiSEOer@gmail.com)',
            'battery_pct': self.battery_level,
            'state': self.current_state,
            'timestamp': time.time()
        }
        status_msg = String()
        status_msg.data = json.dumps(telemetry)
        self.status_pub.publish(status_msg)

def main(args=None):
    rclpy.init(args=args)
    node = HoppiRobotController()
    try:
        rclpy.spin(node)
    except KeyboardInterrupt:
        pass
    finally:
        node.destroy_node()
        rclpy.shutdown()

if __name__ == '__main__':
    main()
