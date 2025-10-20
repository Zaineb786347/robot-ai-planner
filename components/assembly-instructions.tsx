"use client"

import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { CheckCircle2, ExternalLink, Cpu, Youtube } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { RobotConfig } from "./robot-planner"

type AssemblyInstructionsProps = {
  config: RobotConfig
}

export function AssemblyInstructions({ config }: AssemblyInstructionsProps) {
  // Component links mapping voor veelgebruikte onderdelen
  const componentLinks: Record<string, string> = {
    "Arduino Uno": "https://www.arduino.cc/en/Main/Products",
    "Raspberry Pi": "https://www.raspberrypi.com/products/",
    "ESP32": "https://www.espressif.com/en/products/socs/esp32",
    "L298N Motor Driver": "https://www.pololu.com/category/94/pololu-dual-mc33926-motor-driver",
    "HC-SR04 Ultrasonic Sensor": "https://www.sparkfun.com/products/15569",
    "Servo Motor": "https://www.adafruit.com/category/107",
    "DC Motor": "https://www.pololu.com/category/22/brushed-dc-gearmotors",
    "Battery": "https://www.adafruit.com/category/574",
    "Breadboard": "https://www.adafruit.com/category/146",
    "Jumper Wires": "https://www.adafruit.com/category/306",
    "LED": "https://www.adafruit.com/category/89",
    "Resistor": "https://www.adafruit.com/category/316",
    "Sensor": "https://www.adafruit.com/category/35"
  }

  // Functie om te zoeken naar bekende componenten en link te genereren
  const getComponentLink = (componentName: string): string => {
    const componentLower = componentName.toLowerCase()
    for (const [key, link] of Object.entries(componentLinks)) {
      if (componentLower.includes(key.toLowerCase())) {
        return link
      }
    }
    // Fallback naar Google shopping zoeken
    return `https://www.google.com/search?q=${encodeURIComponent(componentName + " buy online")}`
  }

  // Genereer een YouTube zoek URL gebaseerd op de robot naam
  const getYouTubeSearchUrl = (): string => {
    const searchQuery = `${config.name} assembly instructions tutorial`
    return `https://www.youtube.com/results?search_query=${encodeURIComponent(searchQuery)}`
  }

  return (
    <div className="space-y-4">
      <Card className="border-border bg-card p-6">
        <h3 className="mb-4 text-lg font-semibold text-card-foreground">Benodigde Onderdelen</h3>
        <div className="space-y-2">
          {config.components.map((component, index) => (
            <div key={index} className="flex items-center justify-between rounded-lg border border-border bg-muted/50 p-3 hover:bg-muted transition-colors">
              <div className="flex items-center gap-3">
                <span className="text-sm text-foreground font-medium">{component.name}</span>
                <span className="text-xs text-muted-foreground">x{component.quantity}</span>
                <span className="text-xs text-muted-foreground">€{component.price.toFixed(2)}</span>
              </div>
              <a
                href={getComponentLink(component.name)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-sm text-primary hover:text-primary/80 hover:underline transition-colors"
              >
                Bekijk
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-foreground">Totale kosten:</span>
            <span className="text-lg font-bold text-primary">
              €{config.components.reduce((sum, comp) => sum + (comp.price * comp.quantity), 0).toFixed(2)}
            </span>
          </div>
        </div>
      </Card>

      <Card className="border-border bg-card p-6">
        <h3 className="mb-4 text-lg font-semibold text-card-foreground">Robot Visualisatie</h3>
        {config.imageUrl ? (
          <div className="relative w-full aspect-square rounded-lg overflow-hidden border border-border bg-muted">
            <img
              src={config.imageUrl}
              alt={`Visualisatie van ${config.name}`}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="relative w-full aspect-square rounded-lg overflow-hidden border border-border bg-muted flex items-center justify-center">
            <div className="text-center p-8">
              <Cpu className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Geen afbeelding beschikbaar voor deze robot
              </p>
            </div>
          </div>
        )}
        <div className="mt-4 p-4 bg-muted/50 rounded-lg">
          <h4 className="text-sm font-semibold text-foreground mb-2">{config.name}</h4>
          <p className="text-sm text-muted-foreground">{config.description}</p>
        </div>
      </Card>

      <Card className="border-border bg-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-card-foreground">Montage Instructies</h3>
          <Button
            variant="outline"
            size="sm"
            className="gap-2 bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900 hover:bg-red-100 dark:hover:bg-red-950/40 text-red-700 dark:text-red-400"
            onClick={() => window.open(getYouTubeSearchUrl(), '_blank')}
          >
            <Youtube className="h-4 w-4" />
            Video Tutorial
          </Button>
        </div>
        <div className="space-y-3">
          {config.instructions.map((instruction, index) => (
            <div key={index} className="flex gap-4 rounded-lg border border-border bg-muted/50 p-4">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                {index + 1}
              </div>
              <p className="flex-1 text-sm leading-relaxed text-foreground">{instruction}</p>
            </div>
          ))}
        </div>
      </Card>

      <Card className="border-border bg-card p-6">
        <h3 className="mb-4 text-lg font-semibold text-card-foreground">Prestatie Indicatoren</h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">Snelheid</span>
              <span className="text-sm font-semibold text-primary">{config.performance.speed}%</span>
            </div>
            <Progress value={config.performance.speed} className="h-2" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">Energie-efficiëntie</span>
              <span className="text-sm font-semibold text-green-600 dark:text-green-400">{config.performance.efficiency}%</span>
            </div>
            <Progress value={config.performance.efficiency} className="h-2" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">Nauwkeurigheid</span>
              <span className="text-sm font-semibold text-chart-3">{config.performance.accuracy}%</span>
            </div>
            <Progress value={config.performance.accuracy} className="h-2" />
          </div>
        </div>
      </Card>

      <Card className="border-border bg-card p-6">
        <h3 className="mb-4 text-lg font-semibold text-card-foreground">Tips & Waarschuwingen</h3>
        <div className="space-y-3">
          <div className="flex gap-3 rounded-lg border border-accent/50 bg-accent/10 p-4">
            <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-accent" />
            <p className="text-sm text-foreground">
              Test alle verbindingen met een multimeter voordat je de batterij aansluit
            </p>
          </div>
          <div className="flex gap-3 rounded-lg border border-accent/50 bg-accent/10 p-4">
            <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-accent" />
            <p className="text-sm text-foreground">Kalibreer de sensoren op het oppervlak waar de robot zal rijden</p>
          </div>
          <div className="flex gap-3 rounded-lg border border-destructive/50 bg-destructive/10 p-4">
            <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-destructive" />
            <p className="text-sm text-foreground">
              Let op de polariteit bij het aansluiten van de batterij en motoren
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}
