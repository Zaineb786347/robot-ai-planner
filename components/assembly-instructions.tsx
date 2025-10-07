"use client"

import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { CheckCircle2 } from "lucide-react"
import type { RobotConfig } from "./robot-planner"

type AssemblyInstructionsProps = {
  config: RobotConfig
}

export function AssemblyInstructions({ config }: AssemblyInstructionsProps) {
  return (
    <div className="space-y-4">
      <Card className="border-border bg-card p-6">
        <h3 className="mb-4 text-lg font-semibold text-card-foreground">Montage Instructies</h3>
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
              <span className="text-sm font-semibold text-accent">{config.performance.efficiency}%</span>
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
