"use client"

import { useState, useEffect } from "react"
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
  imageUrl?: string
}

export function RobotPlanner() {
  const [generatedConfig, setGeneratedConfig] = useState<RobotConfig | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [savedConfigs, setSavedConfigs] = useState<RobotConfig[]>([])
  const [selectedRobotId, setSelectedRobotId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("code")
  const [isClient, setIsClient] = useState(false)
  const { toast } = useToast()

  // Check of we op de client zijn (voorkomt hydration mismatch)
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Laad opgeslagen robots uit localStorage bij het opstarten
  useEffect(() => {
    if (!isClient) return

    const loadSavedConfigs = () => {
      try {
        const saved = localStorage.getItem("savedRobotConfigs")
        if (saved) {
          const configs = JSON.parse(saved) as RobotConfig[]
          setSavedConfigs(configs)
        }
      } catch (error) {
        console.error("Error loading saved configs:", error)
        toast({
          title: "Fout bij laden",
          description: "Kon opgeslagen robots niet laden.",
          variant: "destructive",
        })
      }
    }

    loadSavedConfigs()
  }, [isClient, toast])

  // Sla robots op in localStorage wanneer savedConfigs verandert
  useEffect(() => {
    if (!isClient) return

    try {
      localStorage.setItem("savedRobotConfigs", JSON.stringify(savedConfigs))
    } catch (error) {
      console.error("Error saving configs:", error)
      toast({
        title: "Fout bij opslaan",
        description: "Kon robots niet opslaan.",
        variant: "destructive",
      })
    }
  }, [savedConfigs, isClient, toast])

  const handleGenerate = async (prompt: string, image?: File, withImage?: boolean) => {
    setIsGenerating(true)

    try {
      let imageBase64: string | undefined

      // Converteer afbeelding naar base64 indien aanwezig
      if (image) {
        const reader = new FileReader()
        imageBase64 = await new Promise<string>((resolve, reject) => {
          reader.onloadend = () => resolve(reader.result as string)
          reader.onerror = reject
          reader.readAsDataURL(image)
        })
      }

      // Roep de API aan
      const response = await fetch("/api/generate-robot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: prompt || "Genereer een basis robot met motoren en sensoren",
          image: imageBase64,
          withImage: Boolean(withImage),
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Er is een fout opgetreden bij het genereren van de robot")
      }

      const config = await response.json()

      setGeneratedConfig(config)
      setSelectedRobotId(config.id)

      toast({
        title: "Robot gegenereerd!",
        description: `${config.name} is succesvol aangemaakt met AI.`,
      })
    } catch (error) {
      console.error("Error generating robot:", error)
      toast({
        title: "Fout bij genereren",
        description: error instanceof Error ? error.message : "Er is een onbekende fout opgetreden",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
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
                    Voer een beschrijving in of upload een afbeelding om een professioneel robotontwerp te genereren met AI, of
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

                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
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
                    <CircuitDiagram 
                      config={generatedConfig} 
                      onNavigateToAssembly={() => setActiveTab("assembly")}
                    />
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
