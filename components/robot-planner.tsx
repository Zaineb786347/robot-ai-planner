"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RobotGeneratorForm } from "./robot-generator-form"
import { CodeEditor } from "./code-editor"
import { CircuitDiagram } from "./circuit-diagram"
import { AssemblyInstructions } from "./assembly-instructions"
import { ConfigurationComparison } from "./configuration-comparison"
import { Cpu, Code, Zap, Wrench, Save, Download, Trash2, Eye } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export type RobotConfig = {
  id: string
  name: string
  description: string
  arduinoCode: string
  components: Array<{
    name: string
    quantity: number
    price: number
  }>
  circuit: {
    connections: Array<{
      from: string
      to: string
      pin: string
    }>
  }
  instructions: string[]
  optimizations: Array<{
    title: string
    description: string
    implementation: string
  }>
  performance: {
    speed: number
    efficiency: number
    accuracy: number
  }
}

function generateRobotFromPrompt(prompt: string): RobotConfig {
  const lowerPrompt = prompt.toLowerCase()
  const id = Date.now().toString()

  // Generate random variation (0, 1, or 2) for different configurations
  const variation = Math.floor(Math.random() * 3)

  // Detect robot type from prompt
  if (lowerPrompt.includes("lijn") || lowerPrompt.includes("line")) {
    const variants = [
      {
        name: "Lijnvolger Robot - Budget",
        speedBoost: 0,
        priceMultiplier: 1.0,
        components: [
          { name: "Arduino Uno R3", quantity: 1, price: 25.0 },
          { name: "IR Lijn Sensor Module", quantity: 2, price: 3.5 },
          { name: "DC Motor met Wiel", quantity: 2, price: 8.0 },
          { name: "L298N Motor Driver", quantity: 1, price: 6.5 },
          { name: "9V Batterij + Houder", quantity: 1, price: 5.0 },
          { name: "Jumper Kabels", quantity: 20, price: 4.0 },
          { name: "Chassis Kit", quantity: 1, price: 12.0 },
        ],
        performance: { speed: 75, efficiency: 80, accuracy: 85 },
      },
      {
        name: "Lijnvolger Robot - Pro",
        speedBoost: 30,
        priceMultiplier: 1.3,
        components: [
          { name: "Arduino Mega 2560", quantity: 1, price: 38.0 },
          { name: "TCRT5000 IR Sensor Array", quantity: 1, price: 12.0 },
          { name: "N20 Micro Motor met Encoder", quantity: 2, price: 15.0 },
          { name: "DRV8833 Motor Driver", quantity: 1, price: 8.5 },
          { name: "Li-ion Batterij 7.4V + Lader", quantity: 1, price: 18.0 },
          { name: "Jumper Kabels", quantity: 20, price: 4.0 },
          { name: "Aluminium Chassis", quantity: 1, price: 22.0 },
          { name: 'OLED Display 0.96"', quantity: 1, price: 6.5 },
        ],
        performance: { speed: 92, efficiency: 88, accuracy: 95 },
      },
      {
        name: "Lijnvolger Robot - Advanced",
        speedBoost: 50,
        priceMultiplier: 1.5,
        components: [
          { name: "Arduino Nano", quantity: 1, price: 18.0 },
          { name: "QTR-8A Reflectance Sensor", quantity: 1, price: 16.0 },
          { name: "Pololu Micro Metal Gearmotor", quantity: 2, price: 22.0 },
          { name: "TB6612FNG Motor Driver", quantity: 1, price: 9.5 },
          { name: "LiPo Batterij 11.1V + Lader", quantity: 1, price: 28.0 },
          { name: "Jumper Kabels", quantity: 20, price: 4.0 },
          { name: "Carbon Fiber Chassis", quantity: 1, price: 35.0 },
          { name: "MPU6050 Gyroscoop", quantity: 1, price: 7.5 },
        ],
        performance: { speed: 98, efficiency: 92, accuracy: 98 },
      },
    ]

    const variant = variants[variation]

    return {
      id,
      name: variant.name,
      description: "Een autonome robot die zwarte lijnen kan volgen met behulp van IR-sensoren",
      arduinoCode: `// ${variant.name} Code
#define LEFT_SENSOR A0
#define RIGHT_SENSOR A1
#define LEFT_MOTOR 9
#define RIGHT_MOTOR 10

int threshold = 500;
int baseSpeed = ${150 + variant.speedBoost};

void setup() {
  pinMode(LEFT_MOTOR, OUTPUT);
  pinMode(RIGHT_MOTOR, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  int leftValue = analogRead(LEFT_SENSOR);
  int rightValue = analogRead(RIGHT_SENSOR);
  
  if (leftValue < threshold && rightValue < threshold) {
    moveForward(baseSpeed);
  }
  else if (leftValue > threshold && rightValue < threshold) {
    turnLeft();
  }
  else if (leftValue < threshold && rightValue > threshold) {
    turnRight();
  }
  else {
    stopMotors();
  }
  
  delay(10);
}

void moveForward(int speed) {
  analogWrite(LEFT_MOTOR, speed);
  analogWrite(RIGHT_MOTOR, speed);
}

void turnLeft() {
  analogWrite(LEFT_MOTOR, baseSpeed - 50);
  analogWrite(RIGHT_MOTOR, baseSpeed + 50);
}

void turnRight() {
  analogWrite(LEFT_MOTOR, baseSpeed + 50);
  analogWrite(RIGHT_MOTOR, baseSpeed - 50);
}

void stopMotors() {
  analogWrite(LEFT_MOTOR, 0);
  analogWrite(RIGHT_MOTOR, 0);
}`,
      components: variant.components,
      circuit: {
        connections: [
          { from: "IR Sensor Links", to: "Arduino", pin: "A0" },
          { from: "IR Sensor Rechts", to: "Arduino", pin: "A1" },
          { from: "Motor Driver IN1", to: "Arduino", pin: "D9" },
          { from: "Motor Driver IN2", to: "Arduino", pin: "D10" },
          { from: "Motor Driver VCC", to: "Batterij", pin: "+9V" },
          { from: "Motor Driver GND", to: "Arduino", pin: "GND" },
        ],
      },
      instructions: [
        "Bevestig de Arduino op het chassis met schroeven",
        "Monteer de twee DC motoren aan de achterkant van het chassis",
        "Plaats de IR sensoren aan de voorkant, gericht naar beneden",
        "Verbind de motor driver met de Arduino volgens het schema",
        "Sluit beide motoren aan op de motor driver outputs",
        "Verbind de IR sensoren met de analoge pinnen A0 en A1",
        "Bevestig de batterijhouder en sluit aan op de motor driver",
        "Upload de code naar de Arduino via USB",
        "Test de sensoren op een wit oppervlak met zwarte lijn",
        "Kalibreer de threshold waarde indien nodig",
      ],
      optimizations: [
        {
          title: "Energie-efficiëntie verbeteren",
          description: "Verminder stroomverbruik door dynamische snelheidsregeling",
          implementation: "Voeg PWM-modulatie toe die de motorsnelheid aanpast op basis van de lijndetectie.",
        },
        {
          title: "Snelheid optimaliseren",
          description: "Verhoog de reactietijd en maximale snelheid",
          implementation: "Implementeer PID-regeling voor vloeiendere bewegingen.",
        },
      ],
      performance: variant.performance,
    }
  } else if (
    lowerPrompt.includes("obstakel") ||
    lowerPrompt.includes("obstacle") ||
    lowerPrompt.includes("ultrasoon")
  ) {
    const variants = [
      {
        name: "Obstakel Vermijder - Basis",
        components: [
          { name: "Arduino Uno R3", quantity: 1, price: 25.0 },
          { name: "HC-SR04 Ultrasone Sensor", quantity: 1, price: 4.5 },
          { name: "SG90 Servo Motor", quantity: 1, price: 5.0 },
          { name: "DC Motor met Wiel", quantity: 2, price: 8.0 },
          { name: "L298N Motor Driver", quantity: 1, price: 6.5 },
          { name: "9V Batterij + Houder", quantity: 1, price: 5.0 },
          { name: "Jumper Kabels", quantity: 20, price: 4.0 },
          { name: "Chassis Kit", quantity: 1, price: 12.0 },
        ],
        performance: { speed: 70, efficiency: 75, accuracy: 90 },
      },
      {
        name: "Obstakel Vermijder - Multi-Sensor",
        components: [
          { name: "Arduino Uno R3", quantity: 1, price: 25.0 },
          { name: "HC-SR04 Ultrasone Sensor", quantity: 3, price: 4.5 },
          { name: "MG90S Servo Motor", quantity: 1, price: 7.5 },
          { name: "DC Motor met Wiel", quantity: 2, price: 8.0 },
          { name: "L298N Motor Driver", quantity: 1, price: 6.5 },
          { name: "Li-ion Batterij 7.4V", quantity: 1, price: 15.0 },
          { name: "Jumper Kabels", quantity: 30, price: 5.0 },
          { name: "Chassis Kit", quantity: 1, price: 12.0 },
          { name: "Buzzer Module", quantity: 1, price: 2.5 },
        ],
        performance: { speed: 78, efficiency: 82, accuracy: 95 },
      },
      {
        name: "Obstakel Vermijder - Premium",
        components: [
          { name: "Arduino Mega 2560", quantity: 1, price: 38.0 },
          { name: "VL53L0X ToF Sensor", quantity: 4, price: 12.0 },
          { name: "MG996R Servo Motor", quantity: 1, price: 12.0 },
          { name: "N20 Motor met Encoder", quantity: 2, price: 15.0 },
          { name: "DRV8833 Motor Driver", quantity: 1, price: 8.5 },
          { name: "LiPo Batterij 11.1V", quantity: 1, price: 28.0 },
          { name: "Jumper Kabels", quantity: 30, price: 5.0 },
          { name: "Aluminium Chassis", quantity: 1, price: 22.0 },
          { name: "OLED Display", quantity: 1, price: 6.5 },
          { name: "RGB LED Strip", quantity: 1, price: 8.5 },
        ],
        performance: { speed: 88, efficiency: 90, accuracy: 98 },
      },
    ]

    const variant = variants[variation]

    return {
      id,
      name: variant.name,
      description: "Een autonome robot die obstakels detecteert en vermijdt met ultrasone sensoren",
      arduinoCode: `// ${variant.name} Code
#define TRIG_PIN 7
#define ECHO_PIN 6
#define LEFT_MOTOR 9
#define RIGHT_MOTOR 10
#define SERVO_PIN 11

#include <Servo.h>

Servo scanner;
int baseSpeed = 180;
int safeDistance = 30;

void setup() {
  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);
  pinMode(LEFT_MOTOR, OUTPUT);
  pinMode(RIGHT_MOTOR, OUTPUT);
  scanner.attach(SERVO_PIN);
  scanner.write(90);
  Serial.begin(9600);
}

void loop() {
  int distance = measureDistance();
  
  if (distance > safeDistance) {
    moveForward();
  } else {
    stopMotors();
    delay(200);
    
    scanner.write(30);
    delay(500);
    int leftDistance = measureDistance();
    
    scanner.write(150);
    delay(500);
    int rightDistance = measureDistance();
    
    scanner.write(90);
    
    if (leftDistance > rightDistance) {
      turnLeft();
      delay(500);
    } else {
      turnRight();
      delay(500);
    }
  }
  
  delay(50);
}

int measureDistance() {
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);
  
  long duration = pulseIn(ECHO_PIN, HIGH);
  int distance = duration * 0.034 / 2;
  return distance;
}

void moveForward() {
  analogWrite(LEFT_MOTOR, baseSpeed);
  analogWrite(RIGHT_MOTOR, baseSpeed);
}

void turnLeft() {
  analogWrite(LEFT_MOTOR, 0);
  analogWrite(RIGHT_MOTOR, baseSpeed);
}

void turnRight() {
  analogWrite(LEFT_MOTOR, baseSpeed);
  analogWrite(RIGHT_MOTOR, 0);
}

void stopMotors() {
  analogWrite(LEFT_MOTOR, 0);
  analogWrite(RIGHT_MOTOR, 0);
}`,
      components: variant.components,
      circuit: {
        connections: [
          { from: "Ultrasone Sensor TRIG", to: "Arduino", pin: "D7" },
          { from: "Ultrasone Sensor ECHO", to: "Arduino", pin: "D6" },
          { from: "Servo Motor", to: "Arduino", pin: "D11" },
          { from: "Motor Driver IN1", to: "Arduino", pin: "D9" },
          { from: "Motor Driver IN2", to: "Arduino", pin: "D10" },
          { from: "Motor Driver VCC", to: "Batterij", pin: "+9V" },
          { from: "Motor Driver GND", to: "Arduino", pin: "GND" },
        ],
      },
      instructions: [
        "Bevestig de Arduino op het chassis",
        "Monteer de DC motoren aan de achterkant",
        "Bevestig de servo motor aan de voorkant van het chassis",
        "Monteer de ultrasone sensor op de servo motor",
        "Verbind de motor driver met de Arduino",
        "Sluit de servo motor aan op pin D11",
        "Verbind de ultrasone sensor met pins D7 en D6",
        "Bevestig de batterijhouder",
        "Upload de code naar de Arduino",
        "Test de obstakeldetectie op verschillende afstanden",
      ],
      optimizations: [
        {
          title: "Detectie verbeteren",
          description: "Voeg meerdere sensoren toe voor betere omgevingsdetectie",
          implementation: "Installeer extra ultrasone sensoren aan de zijkanten voor 180° detectie.",
        },
        {
          title: "Reactietijd optimaliseren",
          description: "Snellere beslissingen bij obstakels",
          implementation: "Verminder delay tijden en gebruik interrupt-based sensing.",
        },
      ],
      performance: variant.performance,
    }
  } else if (lowerPrompt.includes("arm") || lowerPrompt.includes("grijp") || lowerPrompt.includes("pick")) {
    const variants = [
      {
        name: "Robotarm - 4DOF Basis",
        components: [
          { name: "Arduino Uno R3", quantity: 1, price: 25.0 },
          { name: "SG90 Servo Motor", quantity: 4, price: 5.0 },
          { name: "Robotarm Frame Kit", quantity: 1, price: 28.0 },
          { name: "12V Voeding Adapter", quantity: 1, price: 8.0 },
          { name: "Jumper Kabels", quantity: 20, price: 4.0 },
          { name: "Breadboard", quantity: 1, price: 6.0 },
        ],
        performance: { speed: 60, efficiency: 70, accuracy: 85 },
      },
      {
        name: "Robotarm - 5DOF Pro",
        components: [
          { name: "Arduino Mega 2560", quantity: 1, price: 38.0 },
          { name: "MG996R Servo Motor", quantity: 4, price: 12.0 },
          { name: "MG90S Servo Motor", quantity: 1, price: 7.5 },
          { name: "Aluminium Robotarm Kit", quantity: 1, price: 45.0 },
          { name: "12V 5A Voeding", quantity: 1, price: 15.0 },
          { name: "Jumper Kabels", quantity: 30, price: 5.0 },
          { name: "Breadboard", quantity: 1, price: 6.0 },
          { name: "Joystick Module", quantity: 1, price: 6.5 },
        ],
        performance: { speed: 75, efficiency: 80, accuracy: 92 },
      },
      {
        name: "Robotarm - 6DOF Industrial",
        components: [
          { name: "Arduino Mega 2560", quantity: 1, price: 38.0 },
          { name: "DS3218 Servo Motor", quantity: 5, price: 18.0 },
          { name: "MG996R Servo Motor", quantity: 1, price: 12.0 },
          { name: "Industrial Robotarm Frame", quantity: 1, price: 85.0 },
          { name: "12V 10A Voeding", quantity: 1, price: 28.0 },
          { name: "Jumper Kabels", quantity: 40, price: 6.0 },
          { name: "PCA9685 Servo Driver", quantity: 1, price: 12.5 },
          { name: "PS2 Controller", quantity: 1, price: 15.0 },
          { name: "Force Sensor", quantity: 1, price: 9.5 },
        ],
        performance: { speed: 85, efficiency: 88, accuracy: 98 },
      },
    ]

    const variant = variants[variation]

    return {
      id,
      name: variant.name,
      description: "Een gecontroleerde robotarm met servo's en een grijper voor precisiewerk",
      arduinoCode: `// ${variant.name} Code
#include <Servo.h>

Servo base;
Servo shoulder;
Servo elbow;
Servo gripper;

void setup() {
  base.attach(3);
  shoulder.attach(5);
  elbow.attach(6);
  gripper.attach(9);
  
  base.write(90);
  shoulder.write(90);
  elbow.write(90);
  gripper.write(10);
  
  Serial.begin(9600);
  delay(1000);
}

void loop() {
  pickAndPlace();
  delay(2000);
}

void pickAndPlace() {
  moveArm(90, 45, 45, 10);
  delay(1000);
  
  gripper.write(90);
  delay(500);
  
  moveArm(90, 90, 90, 90);
  delay(1000);
  
  moveArm(45, 90, 90, 90);
  delay(1000);
  
  moveArm(45, 45, 45, 90);
  delay(1000);
  
  gripper.write(10);
  delay(500);
  
  moveArm(90, 90, 90, 10);
  delay(1000);
}

void moveArm(int basePos, int shoulderPos, int elbowPos, int gripperPos) {
  base.write(basePos);
  shoulder.write(shoulderPos);
  elbow.write(elbowPos);
  gripper.write(gripperPos);
}`,
      components: variant.components,
      circuit: {
        connections: [
          { from: "Base Servo", to: "Arduino", pin: "D3" },
          { from: "Shoulder Servo", to: "Arduino", pin: "D5" },
          { from: "Elbow Servo", to: "Arduino", pin: "D6" },
          { from: "Gripper Servo", to: "Arduino", pin: "D9" },
          { from: "Servo VCC", to: "Voeding", pin: "+12V" },
          { from: "Servo GND", to: "Arduino", pin: "GND" },
        ],
      },
      instructions: [
        "Monteer de base servo op het platform",
        "Bevestig de shoulder servo op de base",
        "Monteer de elbow servo op de shoulder",
        "Bevestig de grijper met servo aan het einde",
        "Verbind alle servo's met de Arduino volgens schema",
        "Sluit de externe voeding aan voor de servo's",
        "Zorg voor gemeenschappelijke ground tussen Arduino en voeding",
        "Upload de code naar de Arduino",
        "Kalibreer de servo posities indien nodig",
        "Test de bewegingen zonder belasting eerst",
      ],
      optimizations: [
        {
          title: "Precisie verbeteren",
          description: "Voeg feedback sensoren toe voor nauwkeurige positionering",
          implementation: "Installeer potentiometers op elke joint voor positie feedback.",
        },
        {
          title: "Vloeiende beweging",
          description: "Implementeer smooth servo bewegingen",
          implementation: "Gebruik incrementele servo updates in plaats van directe posities.",
        },
      ],
      performance: variant.performance,
    }
  } else if (lowerPrompt.includes("bluetooth") || lowerPrompt.includes("afstand") || lowerPrompt.includes("remote")) {
    const variants = [
      {
        name: "Bluetooth Robot - Standaard",
        components: [
          { name: "Arduino Uno R3", quantity: 1, price: 25.0 },
          { name: "HC-05 Bluetooth Module", quantity: 1, price: 7.5 },
          { name: "DC Motor met Wiel", quantity: 2, price: 8.0 },
          { name: "L298N Motor Driver", quantity: 1, price: 6.5 },
          { name: "9V Batterij + Houder", quantity: 1, price: 5.0 },
          { name: "Jumper Kabels", quantity: 20, price: 4.0 },
          { name: "Chassis Kit", quantity: 1, price: 12.0 },
          { name: "LED Verlichting", quantity: 2, price: 2.0 },
        ],
        performance: { speed: 75, efficiency: 78, accuracy: 80 },
      },
      {
        name: "Bluetooth Robot - Advanced",
        components: [
          { name: "Arduino Mega 2560", quantity: 1, price: 38.0 },
          { name: "HC-06 Bluetooth Module", quantity: 1, price: 8.5 },
          { name: "N20 Motor met Encoder", quantity: 2, price: 15.0 },
          { name: "DRV8833 Motor Driver", quantity: 1, price: 8.5 },
          { name: "Li-ion Batterij 7.4V", quantity: 1, price: 15.0 },
          { name: "Jumper Kabels", quantity: 30, price: 5.0 },
          { name: "Aluminium Chassis", quantity: 1, price: 22.0 },
          { name: "WS2812B LED Strip", quantity: 1, price: 9.5 },
          { name: "Buzzer Module", quantity: 1, price: 2.5 },
        ],
        performance: { speed: 88, efficiency: 85, accuracy: 88 },
      },
      {
        name: "Bluetooth Robot - Pro FPV",
        components: [
          { name: "Arduino Mega 2560", quantity: 1, price: 38.0 },
          { name: "HC-12 RF Module", quantity: 1, price: 12.5 },
          { name: "Pololu Motor met Encoder", quantity: 2, price: 22.0 },
          { name: "TB6612FNG Motor Driver", quantity: 1, price: 9.5 },
          { name: "LiPo Batterij 11.1V", quantity: 1, price: 28.0 },
          { name: "Jumper Kabels", quantity: 40, price: 6.0 },
          { name: "Carbon Fiber Chassis", quantity: 1, price: 35.0 },
          { name: "FPV Camera + Transmitter", quantity: 1, price: 45.0 },
          { name: "RGB LED Matrix", quantity: 1, price: 15.0 },
          { name: "MPU6050 Gyroscoop", quantity: 1, price: 7.5 },
        ],
        performance: { speed: 95, efficiency: 90, accuracy: 92 },
      },
    ]

    const variant = variants[variation]

    return {
      id,
      name: variant.name,
      description: "Een robot die je kunt besturen via Bluetooth met je smartphone",
      arduinoCode: `// ${variant.name} Code
#include <SoftwareSerial.h>

SoftwareSerial bluetooth(2, 3);
#define LEFT_MOTOR_FWD 5
#define LEFT_MOTOR_BWD 6
#define RIGHT_MOTOR_FWD 9
#define RIGHT_MOTOR_BWD 10

int speed = 200;
char command;

void setup() {
  pinMode(LEFT_MOTOR_FWD, OUTPUT);
  pinMode(LEFT_MOTOR_BWD, OUTPUT);
  pinMode(RIGHT_MOTOR_FWD, OUTPUT);
  pinMode(RIGHT_MOTOR_BWD, OUTPUT);
  
  bluetooth.begin(9600);
  Serial.begin(9600);
  stopMotors();
}

void loop() {
  if (bluetooth.available()) {
    command = bluetooth.read();
    
    switch(command) {
      case 'F': moveForward(); break;
      case 'B': moveBackward(); break;
      case 'L': turnLeft(); break;
      case 'R': turnRight(); break;
      case 'S': stopMotors(); break;
      case '0'...'9':
        speed = map(command - '0', 0, 9, 100, 255);
        break;
    }
  }
}

void moveForward() {
  analogWrite(LEFT_MOTOR_FWD, speed);
  analogWrite(RIGHT_MOTOR_FWD, speed);
  analogWrite(LEFT_MOTOR_BWD, 0);
  analogWrite(RIGHT_MOTOR_BWD, 0);
}

void moveBackward() {
  analogWrite(LEFT_MOTOR_FWD, 0);
  analogWrite(RIGHT_MOTOR_FWD, 0);
  analogWrite(LEFT_MOTOR_BWD, speed);
  analogWrite(RIGHT_MOTOR_BWD, speed);
}

void turnLeft() {
  analogWrite(LEFT_MOTOR_FWD, 0);
  analogWrite(RIGHT_MOTOR_FWD, speed);
  analogWrite(LEFT_MOTOR_BWD, speed);
  analogWrite(RIGHT_MOTOR_BWD, 0);
}

void turnRight() {
  analogWrite(LEFT_MOTOR_FWD, speed);
  analogWrite(RIGHT_MOTOR_FWD, 0);
  analogWrite(LEFT_MOTOR_BWD, 0);
  analogWrite(RIGHT_MOTOR_BWD, speed);
}

void stopMotors() {
  analogWrite(LEFT_MOTOR_FWD, 0);
  analogWrite(RIGHT_MOTOR_FWD, 0);
  analogWrite(LEFT_MOTOR_BWD, 0);
  analogWrite(RIGHT_MOTOR_BWD, 0);
}`,
      components: variant.components,
      circuit: {
        connections: [
          { from: "Bluetooth RX", to: "Arduino", pin: "D2" },
          { from: "Bluetooth TX", to: "Arduino", pin: "D3" },
          { from: "Motor Driver IN1", to: "Arduino", pin: "D5" },
          { from: "Motor Driver IN2", to: "Arduino", pin: "D6" },
          { from: "Motor Driver IN3", to: "Arduino", pin: "D9" },
          { from: "Motor Driver IN4", to: "Arduino", pin: "D10" },
          { from: "Motor Driver VCC", to: "Batterij", pin: "+9V" },
        ],
      },
      instructions: [
        "Bevestig de Arduino op het chassis",
        "Monteer de DC motoren met wielen",
        "Installeer de motor driver",
        "Verbind de Bluetooth module met Arduino",
        "Sluit de motoren aan op de motor driver",
        "Verbind de motor driver met de Arduino pins",
        "Bevestig de batterijhouder",
        "Installeer optionele LED verlichting",
        "Upload de code naar de Arduino",
        "Koppel je smartphone via Bluetooth (PIN: 1234)",
        "Download een Bluetooth controller app",
        "Test de besturing in een open ruimte",
      ],
      optimizations: [
        {
          title: "Bereik vergroten",
          description: "Verbeter het Bluetooth bereik tot 100 meter",
          implementation: "Upgrade naar HC-05 met externe antenne of gebruik HC-12 RF module.",
        },
        {
          title: "Feedback toevoegen",
          description: "Stuur sensor data terug naar smartphone",
          implementation: "Voeg sensoren toe en stuur data via bluetooth.print() terug.",
        },
      ],
      performance: variant.performance,
    }
  } else {
    // Default: verschillende basis robots
    const variants = [
      {
        name: "Basis Robot - Starter Kit",
        components: [
          { name: "Arduino Uno R3", quantity: 1, price: 25.0 },
          { name: "DC Motor met Wiel", quantity: 2, price: 8.0 },
          { name: "L293D Motor Driver", quantity: 1, price: 4.5 },
          { name: "IR Sensor Module", quantity: 1, price: 3.5 },
          { name: "9V Batterij + Houder", quantity: 1, price: 5.0 },
          { name: "Jumper Kabels", quantity: 20, price: 4.0 },
          { name: "Basis Chassis", quantity: 1, price: 10.0 },
        ],
        performance: { speed: 65, efficiency: 70, accuracy: 75 },
      },
      {
        name: "Basis Robot - Sensor Pack",
        components: [
          { name: "Arduino Uno R3", quantity: 1, price: 25.0 },
          { name: "DC Motor met Wiel", quantity: 2, price: 8.0 },
          { name: "L298N Motor Driver", quantity: 1, price: 6.5 },
          { name: "Ultrasone Sensor", quantity: 1, price: 4.5 },
          { name: "IR Sensor Module", quantity: 2, price: 3.5 },
          { name: "Li-ion Batterij 7.4V", quantity: 1, price: 15.0 },
          { name: "Jumper Kabels", quantity: 30, price: 5.0 },
          { name: "Chassis Kit", quantity: 1, price: 12.0 },
          { name: "LED Module", quantity: 1, price: 3.0 },
        ],
        performance: { speed: 75, efficiency: 78, accuracy: 82 },
      },
      {
        name: "Basis Robot - Complete Set",
        components: [
          { name: "Arduino Mega 2560", quantity: 1, price: 38.0 },
          { name: "N20 Motor met Encoder", quantity: 2, price: 15.0 },
          { name: "DRV8833 Motor Driver", quantity: 1, price: 8.5 },
          { name: "HC-SR04 Ultrasone Sensor", quantity: 2, price: 4.5 },
          { name: "TCRT5000 IR Sensor", quantity: 3, price: 3.0 },
          { name: "LiPo Batterij 11.1V", quantity: 1, price: 28.0 },
          { name: "Jumper Kabels", quantity: 40, price: 6.0 },
          { name: "Aluminium Chassis", quantity: 1, price: 22.0 },
          { name: "OLED Display", quantity: 1, price: 6.5 },
          { name: "Buzzer + LED Pack", quantity: 1, price: 5.0 },
        ],
        performance: { speed: 82, efficiency: 85, accuracy: 88 },
      },
    ]

    const variant = variants[variation]

    return {
      id,
      name: variant.name,
      description: "Een veelzijdige robot met sensoren en motoren voor diverse toepassingen",
      arduinoCode: `// ${variant.name} Code
#define MOTOR_LEFT 9
#define MOTOR_RIGHT 10
#define SENSOR_PIN A0

int sensorValue = 0;
int motorSpeed = 150;

void setup() {
  pinMode(MOTOR_LEFT, OUTPUT);
  pinMode(MOTOR_RIGHT, OUTPUT);
  pinMode(SENSOR_PIN, INPUT);
  Serial.begin(9600);
}

void loop() {
  sensorValue = analogRead(SENSOR_PIN);
  
  if (sensorValue > 512) {
    moveForward();
  } else {
    stopMotors();
  }
  
  delay(100);
}

void moveForward() {
  analogWrite(MOTOR_LEFT, motorSpeed);
  analogWrite(MOTOR_RIGHT, motorSpeed);
}

void stopMotors() {
  analogWrite(MOTOR_LEFT, 0);
  analogWrite(MOTOR_RIGHT, 0);
}`,
      components: variant.components,
      circuit: {
        connections: [
          { from: "Sensor", to: "Arduino", pin: "A0" },
          { from: "Motor Driver IN1", to: "Arduino", pin: "D9" },
          { from: "Motor Driver IN2", to: "Arduino", pin: "D10" },
          { from: "Motor Driver VCC", to: "Batterij", pin: "+9V" },
          { from: "Motor Driver GND", to: "Arduino", pin: "GND" },
        ],
      },
      instructions: [
        "Bevestig de Arduino op het chassis",
        "Monteer de motoren met wielen",
        "Installeer de motor driver",
        "Verbind de sensor met de Arduino",
        "Sluit de motoren aan op de driver",
        "Bevestig de batterijhouder",
        "Upload de code",
        "Test de functionaliteit",
      ],
      optimizations: [
        {
          title: "Functionaliteit uitbreiden",
          description: "Voeg meer sensoren en actuatoren toe",
          implementation: "Installeer extra sensoren voor complexere taken.",
        },
        {
          title: "Efficiëntie verbeteren",
          description: "Optimaliseer het stroomverbruik",
          implementation: "Gebruik sleep modes en efficiëntere componenten.",
        },
      ],
      performance: variant.performance,
    }
  }
}

export function RobotPlanner() {
  const [generatedConfig, setGeneratedConfig] = useState<RobotConfig | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [savedConfigs, setSavedConfigs] = useState<RobotConfig[]>([])
  const [selectedRobotId, setSelectedRobotId] = useState<string | null>(null)
  const { toast } = useToast()

  const handleGenerate = async (prompt: string, image?: File) => {
    setIsGenerating(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const config = generateRobotFromPrompt(prompt || "basis robot")

    setGeneratedConfig(config)
    setSelectedRobotId(config.id)
    setIsGenerating(false)

    toast({
      title: "Robot gegenereerd!",
      description: `${config.name} is succesvol aangemaakt.`,
    })
  }

  const handleSaveConfig = () => {
    if (generatedConfig && !savedConfigs.find((c) => c.id === generatedConfig.id)) {
      setSavedConfigs([...savedConfigs, generatedConfig])
      toast({
        title: "Robot opgeslagen",
        description: `${generatedConfig.name} is toegevoegd aan je opgeslagen configuraties.`,
      })
    } else if (generatedConfig) {
      toast({
        title: "Al opgeslagen",
        description: "Deze robot configuratie is al opgeslagen.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteConfig = (id: string) => {
    setSavedConfigs(savedConfigs.filter((c) => c.id !== id))
    if (selectedRobotId === id) {
      setGeneratedConfig(null)
      setSelectedRobotId(null)
    }
    toast({
      title: "Robot verwijderd",
      description: "De robot configuratie is verwijderd uit je opgeslagen items.",
    })
  }

  const handleViewConfig = (config: RobotConfig) => {
    setGeneratedConfig(config)
    setSelectedRobotId(config.id)
    toast({
      title: "Robot geladen",
      description: `${config.name} wordt nu weergegeven.`,
    })
  }

  const handleDownload = () => {
    if (!generatedConfig) return
    const blob = new Blob([generatedConfig.arduinoCode], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${generatedConfig.name.toLowerCase().replace(/\s+/g, "_")}.ino`
    a.click()
    URL.revokeObjectURL(url)
    toast({
      title: "Download gestart",
      description: `${generatedConfig.name}.ino wordt gedownload.`,
    })
  }

  const isCurrentRobotSaved = generatedConfig ? savedConfigs.some((c) => c.id === generatedConfig.id) : false

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/80 shadow-lg">
                <Cpu className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">AI Robot Planner</h1>
                <p className="text-sm text-muted-foreground">Professionele robotontwerpen met AI</p>
              </div>
            </div>
            {savedConfigs.length > 0 && (
              <div className="flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2">
                <Save className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-primary">{savedConfigs.length} opgeslagen</span>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-[400px_1fr]">
          <div className="space-y-6">
            <Card className="border-border bg-card/50 backdrop-blur-sm p-6 shadow-lg">
              <h2 className="mb-4 text-lg font-semibold text-card-foreground">Robot Genereren</h2>
              <RobotGeneratorForm onGenerate={handleGenerate} isGenerating={isGenerating} />
            </Card>

            {generatedConfig && (
              <Card className="border-border bg-card/50 backdrop-blur-sm p-6 shadow-lg">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-base font-semibold text-card-foreground">Gegenereerde Robot</h3>
                  {isCurrentRobotSaved ? (
                    <span className="text-xs bg-green-500/20 text-green-500 px-2 py-1 rounded-full">Opgeslagen</span>
                  ) : (
                    <span className="text-xs bg-yellow-500/20 text-yellow-500 px-2 py-1 rounded-full animate-pulse">
                      Nieuw
                    </span>
                  )}
                </div>
                <div className="space-y-3">
                  <div className="rounded-lg bg-muted/50 p-4">
                    <p className="font-semibold text-foreground">{generatedConfig.name}</p>
                    <p className="text-sm text-muted-foreground mt-1">{generatedConfig.description}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      onClick={handleSaveConfig}
                      size="sm"
                      className="gap-2 shadow-md"
                      disabled={isCurrentRobotSaved}
                    >
                      <Save className="h-4 w-4" />
                      {isCurrentRobotSaved ? "Opgeslagen" : "Opslaan"}
                    </Button>
                    <Button onClick={handleDownload} variant="outline" size="sm" className="gap-2 bg-transparent">
                      <Download className="h-4 w-4" />
                      Download
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            {savedConfigs.length > 0 && (
              <Card className="border-border bg-card/50 backdrop-blur-sm p-6 shadow-lg">
                <h3 className="mb-3 text-base font-semibold text-card-foreground">Opgeslagen Robots</h3>
                <div className="space-y-2">
                  {savedConfigs.map((config) => (
                    <div
                      key={config.id}
                      className={`flex items-center justify-between rounded-lg p-3 transition-all cursor-pointer ${
                        selectedRobotId === config.id
                          ? "bg-primary/20 border-2 border-primary shadow-md"
                          : "bg-muted/50 hover:bg-muted border-2 border-transparent"
                      }`}
                      onClick={() => handleViewConfig(config)}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-foreground truncate">{config.name}</p>
                          {selectedRobotId === config.id && (
                            <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                              Actief
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          €{config.components.reduce((sum, c) => sum + c.price * c.quantity, 0).toFixed(2)} •{" "}
                          {config.components.length} onderdelen
                        </p>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleViewConfig(config)
                          }}
                          className="h-8 w-8 p-0"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteConfig(config.id)
                          }}
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            {!generatedConfig ? (
              <Card className="border-border bg-card/50 backdrop-blur-sm p-12 shadow-lg">
                <div className="flex flex-col items-center justify-center text-center">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/10">
                    <Cpu className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-foreground">Geen robot geselecteerd</h3>
                  <p className="text-sm text-muted-foreground max-w-md">
                    Voer een beschrijving in of upload een afbeelding om een professioneel robotontwerp te genereren, of
                    selecteer een opgeslagen robot om de details te bekijken
                  </p>
                </div>
              </Card>
            ) : (
              <>
                <Card className="border-border bg-card/50 backdrop-blur-sm p-4 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-semibold text-foreground">{generatedConfig.name}</h2>
                      <p className="text-sm text-muted-foreground">{generatedConfig.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <p className="text-sm font-medium text-foreground">
                          €{generatedConfig.components.reduce((sum, c) => sum + c.price * c.quantity, 0).toFixed(2)}
                        </p>
                        <p className="text-xs text-muted-foreground">{generatedConfig.components.length} onderdelen</p>
                      </div>
                    </div>
                  </div>
                </Card>

                <Tabs defaultValue="code" className="w-full">
                  <TabsList className="grid w-full grid-cols-4 bg-muted/50 backdrop-blur-sm">
                    <TabsTrigger value="code" className="gap-2">
                      <Code className="h-4 w-4" />
                      Code
                    </TabsTrigger>
                    <TabsTrigger value="circuit" className="gap-2">
                      <Zap className="h-4 w-4" />
                      Circuit
                    </TabsTrigger>
                    <TabsTrigger value="assembly" className="gap-2">
                      <Wrench className="h-4 w-4" />
                      Montage
                    </TabsTrigger>
                    <TabsTrigger value="compare" className="gap-2">
                      <Cpu className="h-4 w-4" />
                      Vergelijk
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="code" className="mt-6">
                    <CodeEditor config={generatedConfig} />
                  </TabsContent>

                  <TabsContent value="circuit" className="mt-6">
                    <CircuitDiagram config={generatedConfig} />
                  </TabsContent>

                  <TabsContent value="assembly" className="mt-6">
                    <AssemblyInstructions config={generatedConfig} />
                  </TabsContent>

                  <TabsContent value="compare" className="mt-6">
                    <ConfigurationComparison configs={savedConfigs.length > 0 ? savedConfigs : [generatedConfig]} />
                  </TabsContent>
                </Tabs>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
