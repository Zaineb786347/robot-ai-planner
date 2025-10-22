"use client"

import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TrendingUp, Zap, Target, Battery, ChevronDown, ChevronUp } from "lucide-react"
import type { RobotConfig } from "./robot-planner"
import { useState } from "react"

type ConfigurationComparisonProps = {
  configs: RobotConfig[]
}

export function ConfigurationComparison({ configs }: ConfigurationComparisonProps) {
  const [showComponents, setShowComponents] = useState(false)

  if (configs.length === 0) {
    return (
      <Card className="border-border bg-card/50 backdrop-blur-sm p-12 shadow-lg">
        <div className="text-center">
          <p className="text-muted-foreground">Geen configuraties om te vergelijken</p>
          <p className="text-sm text-muted-foreground mt-2">
            Sla eerst enkele robot configuraties op om ze te vergelijken
          </p>
        </div>
      </Card>
    )
  }

  const getPerformanceColor = (value: number) => {
    if (value >= 80) return "bg-green-500"
    if (value >= 60) return "bg-yellow-500"
    return "bg-red-500"
  }

  const calculateBatteryLife = (config: RobotConfig) => {
    const baseHours = 4
    const efficiencyMultiplier = config.performance.efficiency / 100
    const componentCount = config.components.reduce((sum, c) => sum + c.quantity, 0)
    const batteryLife = (baseHours * efficiencyMultiplier * (20 / componentCount)).toFixed(1)
    return Number.parseFloat(batteryLife)
  }

  return (
    <Card className="border-border bg-card/50 backdrop-blur-sm p-6 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-card-foreground">Configuratie Vergelijking</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Vergelijk {configs.length} robot{configs.length > 1 ? "s" : ""} op onderdelen, prijzen en prestaties
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => setShowComponents(!showComponents)} className="gap-2">
          {showComponents ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          {showComponents ? "Verberg" : "Toon"} Onderdelen
        </Button>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-muted/50">
              <TableHead className="text-foreground font-semibold min-w-[180px]">Eigenschap</TableHead>
              {configs.map((config) => (
                <TableHead key={config.id} className="text-foreground font-semibold min-w-[200px]">
                  <div className="flex flex-col gap-1">
                    <span>{config.name}</span>
                    <span className="text-xs text-muted-foreground font-normal">{config.description}</span>
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow className="border-border hover:bg-muted/50 bg-muted/20">
              <TableCell className="font-medium text-foreground">Totale Prijs</TableCell>
              {configs.map((config) => {
                const totalPrice = config.components.reduce((sum, c) => sum + c.price * c.quantity, 0)
                return (
                  <TableCell key={config.id}>
                    <Badge variant="secondary" className="shadow-sm font-bold text-base">
                      €{totalPrice.toFixed(2)}
                    </Badge>
                  </TableCell>
                )
              })}
            </TableRow>

            <TableRow className="border-border hover:bg-muted/50">
              <TableCell className="font-medium text-foreground">Aantal Onderdelen</TableCell>
              {configs.map((config) => (
                <TableCell key={config.id} className="text-foreground font-medium">
                  {config.components.reduce((sum, c) => sum + c.quantity, 0)} stuks ({config.components.length} types)
                </TableCell>
              ))}
            </TableRow>

            {showComponents && (
              <>
                <TableRow className="border-border bg-muted/30">
                  <TableCell colSpan={configs.length + 1} className="font-semibold text-foreground py-3">
                    Onderdelen Specificatie
                  </TableCell>
                </TableRow>
                {configs[0].components.map((_, index) => (
                  <TableRow key={index} className="border-border hover:bg-muted/50">
                    <TableCell className="font-medium text-muted-foreground text-sm">Onderdeel {index + 1}</TableCell>
                    {configs.map((config) => {
                      const component = config.components[index]
                      if (!component) {
                        return (
                          <TableCell key={config.id} className="text-muted-foreground text-sm">
                            -
                          </TableCell>
                        )
                      }
                      return (
                        <TableCell key={config.id}>
                          <div className="space-y-1">
                            <p className="text-sm font-medium text-foreground">{component.name}</p>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">
                                {component.quantity}x
                              </Badge>
                              <Badge variant="secondary" className="text-xs font-semibold">
                                €{(component.price * component.quantity).toFixed(2)}
                              </Badge>
                            </div>
                          </div>
                        </TableCell>
                      )
                    })}
                  </TableRow>
                ))}
              </>
            )}

            <TableRow className="border-border bg-muted/30">
              <TableCell colSpan={configs.length + 1} className="font-semibold text-foreground py-3">
                Geschatte Prestaties
              </TableCell>
            </TableRow>

            <TableRow className="border-border hover:bg-muted/50">
              <TableCell className="font-medium text-foreground">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  Snelheid
                </div>
              </TableCell>
              {configs.map((config) => (
                <TableCell key={config.id}>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full ${getPerformanceColor(config.performance.speed)} transition-all`}
                        style={{ width: `${config.performance.speed}%` }}
                      />
                    </div>
                    <Badge className="bg-primary text-primary-foreground shadow-sm">{config.performance.speed}%</Badge>
                  </div>
                </TableCell>
              ))}
            </TableRow>

            <TableRow className="border-border hover:bg-muted/50">
              <TableCell className="font-medium text-foreground">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-accent" />
                  Efficiëntie
                </div>
              </TableCell>
              {configs.map((config) => (
                <TableCell key={config.id}>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full ${getPerformanceColor(config.performance.efficiency)} transition-all`}
                        style={{ width: `${config.performance.efficiency}%` }}
                      />
                    </div>
                    <Badge className="bg-accent text-accent-foreground shadow-sm">
                      {config.performance.efficiency}%
                    </Badge>
                  </div>
                </TableCell>
              ))}
            </TableRow>

            <TableRow className="border-border hover:bg-muted/50">
              <TableCell className="font-medium text-foreground">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-chart-3" />
                  Nauwkeurigheid
                </div>
              </TableCell>
              {configs.map((config) => (
                <TableCell key={config.id}>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full ${getPerformanceColor(config.performance.accuracy)} transition-all`}
                        style={{ width: `${config.performance.accuracy}%` }}
                      />
                    </div>
                    <Badge className="bg-chart-3 text-primary-foreground shadow-sm">
                      {config.performance.accuracy}%
                    </Badge>
                  </div>
                </TableCell>
              ))}
            </TableRow>

            <TableRow className="border-border hover:bg-muted/50">
              <TableCell className="font-medium text-foreground">
                <div className="flex items-center gap-2">
                  <Battery className="h-4 w-4 text-green-500" />
                  Batterijduur
                </div>
              </TableCell>
              {configs.map((config) => {
                const batteryLife = calculateBatteryLife(config)
                return (
                  <TableCell key={config.id}>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                        <div
                          className="h-full bg-green-500 transition-all"
                          style={{ width: `${Math.min(batteryLife * 20, 100)}%` }}
                        />
                      </div>
                      <Badge className="bg-green-500 text-white shadow-sm">{batteryLife}u</Badge>
                    </div>
                  </TableCell>
                )
              })}
            </TableRow>

            <TableRow className="border-border hover:bg-muted/50">
              <TableCell className="font-medium text-foreground">Optimalisaties</TableCell>
              {configs.map((config) => (
                <TableCell key={config.id}>
                  <Badge variant="outline" className="shadow-sm">
                    {config.optimizations.length} voorstellen
                  </Badge>
                </TableCell>
              ))}
            </TableRow>

            <TableRow className="border-border bg-muted/30">
              <TableCell colSpan={configs.length + 1} className="font-semibold text-foreground py-3">
                Aanbeveling
              </TableCell>
            </TableRow>
            <TableRow className="border-border hover:bg-muted/50">
              <TableCell className="font-medium text-foreground">Beste Keuze Voor</TableCell>
              {configs.map((config) => {
                const totalPrice = config.components.reduce((sum, c) => sum + c.price * c.quantity, 0)
                const avgPerformance =
                  (config.performance.speed + config.performance.efficiency + config.performance.accuracy) / 3

                let recommendation = ""
                if (totalPrice < 50) recommendation = "Budget"
                else if (avgPerformance > 80) recommendation = "Prestaties"
                else if (config.performance.efficiency > 80) recommendation = "Efficiëntie"
                else recommendation = "Balans"

                return (
                  <TableCell key={config.id}>
                    <Badge className="bg-black text-white shadow-lg font-bold text-sm px-3 py-1">
                      {recommendation}
                    </Badge>
                  </TableCell>
                )
              })}
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </Card>
  )
}
