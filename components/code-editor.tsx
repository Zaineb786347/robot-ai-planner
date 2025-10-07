"use client"

import { Badge } from "@/components/ui/badge"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Copy, Download, Edit2, Save, Check } from "lucide-react"
import type { RobotConfig } from "./robot-planner"
import { useToast } from "@/hooks/use-toast"

type CodeEditorProps = {
  config: RobotConfig
}

export function CodeEditor({ config }: CodeEditorProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [code, setCode] = useState(config.arduinoCode)
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    toast({
      title: "Code gekopieerd",
      description: "De Arduino code is naar je klembord gekopieerd.",
    })
  }

  const handleDownload = () => {
    const blob = new Blob([code], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${config.name.toLowerCase().replace(/\s+/g, "_")}.ino`
    a.click()
    URL.revokeObjectURL(url)
    toast({
      title: "Download gestart",
      description: `${config.name}.ino wordt gedownload.`,
    })
  }

  const handleSave = () => {
    setIsEditing(false)
    toast({
      title: "Code opgeslagen",
      description: "Je wijzigingen zijn opgeslagen.",
    })
  }

  return (
    <div className="space-y-4">
      <Card className="border-border bg-card/50 backdrop-blur-sm p-6 shadow-lg">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-card-foreground">Arduino Code</h3>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={isEditing ? handleSave : () => setIsEditing(true)}
              className="gap-2 shadow-sm"
            >
              {isEditing ? (
                <>
                  <Save className="h-4 w-4" />
                  Opslaan
                </>
              ) : (
                <>
                  <Edit2 className="h-4 w-4" />
                  Bewerken
                </>
              )}
            </Button>
            <Button variant="outline" size="sm" onClick={handleCopy} className="gap-2 shadow-sm bg-transparent">
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? "Gekopieerd!" : "Kopiëren"}
            </Button>
            <Button variant="outline" size="sm" onClick={handleDownload} className="gap-2 shadow-sm bg-transparent">
              <Download className="h-4 w-4" />
              Download
            </Button>
          </div>
        </div>

        {isEditing ? (
          <Textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="min-h-[500px] font-mono text-sm bg-muted text-foreground border-border shadow-inner"
          />
        ) : (
          <pre className="overflow-x-auto rounded-lg bg-gradient-to-br from-muted to-muted/80 p-4 shadow-inner">
            <code className="font-mono text-sm text-foreground">{code}</code>
          </pre>
        )}
      </Card>

      <Card className="border-border bg-card/50 backdrop-blur-sm p-6 shadow-lg">
        <h3 className="mb-4 text-lg font-semibold text-card-foreground">Optimalisatie Voorstellen</h3>
        <div className="space-y-4">
          {config.optimizations.map((opt, index) => (
            <div
              key={index}
              className="rounded-lg border border-border bg-gradient-to-br from-muted/50 to-muted/30 p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-semibold text-foreground">{opt.title}</h4>
                <Badge variant="outline" className="text-xs">
                  Optimalisatie {index + 1}
                </Badge>
              </div>
              <p className="mb-3 text-sm text-muted-foreground">{opt.description}</p>
              <div className="rounded bg-background/80 p-3 border border-border">
                <p className="text-sm font-mono text-foreground leading-relaxed">{opt.implementation}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
