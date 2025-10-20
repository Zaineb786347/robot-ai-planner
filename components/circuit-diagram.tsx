"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, Zap, Circle } from "lucide-react"
import type { RobotConfig } from "./robot-planner"

type CircuitDiagramProps = {
  config: RobotConfig
  onNavigateToAssembly?: () => void
}

const productLinks: Record<string, string> = {
  "Arduino Uno R3": "https://store.arduino.cc/products/arduino-uno-rev3",
  "IR Lijn Sensor Module":
    "https://www.tinytronics.nl/shop/nl/sensoren/optisch/infrarood/tcrt5000-ir-lijn-volg-sensor-module",
  "DC Motor met Wiel": "https://www.tinytronics.nl/shop/nl/robotica-en-cnc/motoren/dc-motoren/dc-motor-met-wiel-3-6v",
  "L298N Motor Driver":
    "https://www.tinytronics.nl/shop/nl/robotica-en-cnc/motor-controllers/l298n-dual-h-bridge-motor-driver",
  "9V Batterij + Houder":
    "https://www.tinytronics.nl/shop/nl/power/batterijen/9v/9v-batterij-houder-met-dc-barrel-connector",
  "Jumper Kabels":
    "https://www.tinytronics.nl/shop/nl/kabels-en-connectoren/kabels-en-adapters/prototyping-kabels/dupont-compatible-en-jumper/dupont-jumper-draad-male-male-10cm-10-stuks",
  "Chassis Kit":
    "https://www.tinytronics.nl/shop/nl/robotica-en-cnc/robot-onderdelen/chassis/2wd-smart-robot-car-chassis-kit",
}

export function CircuitDiagram({ config, onNavigateToAssembly }: CircuitDiagramProps) {
  const totalPrice = config.components.reduce((sum, comp) => sum + comp.price * comp.quantity, 0)

  return (
    <div className="space-y-4">
      <Card className="border-border bg-card p-6 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-card-foreground flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-500" />
            Circuit Schema
          </h3>
          <Badge variant="outline" className="font-mono text-xs">
            Rev 1.0
          </Badge>
        </div>
        
        {/* Professional Circuit Diagram */}
        <div className="rounded-xl border-2 border-slate-700 dark:border-slate-600 bg-slate-900 dark:bg-slate-950 p-8 shadow-2xl overflow-x-auto">
          {/* Grid Background Pattern */}
          <div className="relative min-h-[400px]" style={{
            backgroundImage: `
              linear-gradient(rgba(100, 116, 139, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(100, 116, 139, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px'
          }}>
            <div className="space-y-8 relative">
              {config.circuit.connections.map((conn, index) => (
                <div key={index} className="relative">
                  {/* Connection Line Container */}
                  <div className="flex items-center gap-0">
                    {/* From Component (Left Side) */}
                    <div className="relative group">
                      <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-6 py-3 rounded-lg shadow-lg border-2 border-blue-400 font-mono text-sm font-bold min-w-[180px] text-center hover:shadow-blue-500/50 transition-all">
                        {conn.from}
                      </div>
                      {/* Connection Point (Left) */}
                      <div className="absolute -right-2 top-1/2 -translate-y-1/2">
                        <Circle className="h-4 w-4 fill-yellow-400 text-yellow-500" />
                      </div>
                    </div>

                    {/* Connection Wire with Animation */}
                    <div className="flex-1 flex items-center relative px-4">
                      <div className="w-full h-1 bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400 relative overflow-hidden rounded-full shadow-lg shadow-yellow-500/50">
                        {/* Animated pulse effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-pulse"></div>
                      </div>
                      
                      {/* Pin Badge (Center) */}
                      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                        <div className="bg-gradient-to-br from-orange-500 to-red-600 text-white px-4 py-2 rounded-md shadow-xl border-2 border-orange-300 font-mono text-xs font-black tracking-wider hover:scale-110 transition-transform">
                          {conn.pin}
                        </div>
                      </div>
                    </div>

                    {/* To Component (Right Side) */}
                    <div className="relative group">
                      {/* Connection Point (Right) */}
                      <div className="absolute -left-2 top-1/2 -translate-y-1/2">
                        <Circle className="h-4 w-4 fill-yellow-400 text-yellow-500" />
                      </div>
                      <div className="bg-gradient-to-r from-green-600 to-green-500 text-white px-6 py-3 rounded-lg shadow-lg border-2 border-green-400 font-mono text-sm font-bold min-w-[180px] text-center hover:shadow-green-500/50 transition-all">
                        {conn.to}
                      </div>
                    </div>
                  </div>

                  {/* Connection Label */}
                  <div className="mt-2 text-center">
                    <span className="text-xs font-mono text-slate-400 bg-slate-800/50 px-2 py-1 rounded">
                      Connection #{index + 1}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Schema Info Footer */}
            <div className="mt-8 pt-4 border-t border-slate-700 flex items-center justify-between text-xs font-mono text-slate-400">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-sm"></div>
                  <span>Input</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-sm"></div>
                  <span>Output</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <span>Connection Point</span>
                </div>
              </div>
              <div className="text-slate-500">
                {config.circuit.connections.length} Total Connections
              </div>
            </div>
          </div>
        </div>

        {/* Technical Notes */}
        <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 rounded-lg">
          <p className="text-xs text-amber-900 dark:text-amber-200 font-medium flex items-center gap-2">
            <Zap className="h-4 w-4" />
            <strong>Waarschuwing:</strong> Controleer alle verbindingen voordat u de voeding aansluit. Verkeerde aansluitingen kunnen componenten beschadigen.
          </p>
        </div>
      </Card>

      <Card className="border-border bg-card/50 backdrop-blur-sm p-6 shadow-lg">
        <h3 className="mb-4 text-lg font-semibold text-card-foreground">Benodigde Onderdelen</h3>
        <div className="space-y-2">
          {config.components.map((comp, index) => {
            const productLink = productLinks[comp.name]
            return (
              <div
                key={index}
                className="flex items-center justify-between rounded-lg border border-border bg-gradient-to-r from-muted/50 to-muted/30 p-3 hover:from-muted/70 hover:to-muted/50 transition-all"
              >
                <div className="flex items-center gap-3 flex-1">
                  <Badge variant="secondary" className="shadow-sm font-semibold">
                    {comp.quantity}x
                  </Badge>
                  <span className="text-sm font-medium text-foreground">{comp.name}</span>
                  {productLink && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 gap-1 text-xs"
                      onClick={() => window.open(productLink, "_blank")}
                    >
                      <ExternalLink className="h-3 w-3" />
                      Bekijk
                    </Button>
                  )}
                </div>
                <span className="text-sm font-semibold text-foreground">
                  €{(comp.price * comp.quantity).toFixed(2)}
                </span>
              </div>
            )
          })}
          <div className="mt-4 flex items-center justify-between rounded-lg border-2 border-primary bg-gradient-to-r from-primary/10 to-primary/5 p-4 shadow-md">
            <span className="font-semibold text-foreground">Totaal</span>
            <span className="text-xl font-bold text-primary">€{totalPrice.toFixed(2)}</span>
          </div>
          <Button 
            className="w-full gap-2 shadow-md" 
            size="lg"
            onClick={onNavigateToAssembly}
          >
            <ExternalLink className="h-4 w-4" />
            Bestel alle onderdelen
          </Button>
        </div>
      </Card>
    </div>
  )
}
