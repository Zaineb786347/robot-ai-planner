"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"
import type { RobotConfig } from "./robot-planner"

type CircuitDiagramProps = {
  config: RobotConfig
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

export function CircuitDiagram({ config }: CircuitDiagramProps) {
  const totalPrice = config.components.reduce((sum, comp) => sum + comp.price * comp.quantity, 0)

  return (
    <div className="space-y-4">
      <Card className="border-border bg-card/50 backdrop-blur-sm p-6 shadow-lg">
        <h3 className="mb-4 text-lg font-semibold text-card-foreground">Circuit Schema</h3>
        <div className="rounded-lg border border-border bg-gradient-to-br from-muted/30 to-muted/10 p-8">
          <div className="space-y-4">
            {config.circuit.connections.map((conn, index) => (
              <div key={index} className="flex items-center gap-4">
                <Badge variant="outline" className="min-w-[140px] justify-center font-medium shadow-sm">
                  {conn.from}
                </Badge>
                <div className="flex-1 border-t-2 border-dashed border-primary/60"></div>
                <Badge className="bg-primary text-primary-foreground shadow-md font-semibold">{conn.pin}</Badge>
                <div className="flex-1 border-t-2 border-dashed border-primary/60"></div>
                <Badge variant="outline" className="min-w-[140px] justify-center font-medium shadow-sm">
                  {conn.to}
                </Badge>
              </div>
            ))}
          </div>
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
          <Button className="w-full gap-2 shadow-md" size="lg">
            <ExternalLink className="h-4 w-4" />
            Bestel alle onderdelen
          </Button>
        </div>
      </Card>
    </div>
  )
}
