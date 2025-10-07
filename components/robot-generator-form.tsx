"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Upload, Sparkles } from "lucide-react"

type RobotGeneratorFormProps = {
  onGenerate: (prompt: string, image?: File) => void
  isGenerating: boolean
}

export function RobotGeneratorForm({ onGenerate, isGenerating }: RobotGeneratorFormProps) {
  const [prompt, setPrompt] = useState("")
  const [image, setImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (prompt.trim() || image) {
      onGenerate(prompt, image || undefined)
      setPrompt("")
      setImage(null)
      setImagePreview(null)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="prompt" className="text-foreground">
          Beschrijf je robot
        </Label>
        <Textarea
          id="prompt"
          placeholder="Bijv: Een lijnvolger robot met twee motoren en IR sensoren..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="min-h-[120px] resize-none bg-input text-foreground"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-foreground">Of upload een afbeelding</Label>
        <div className="flex flex-col gap-3">
          <label
            htmlFor="image-upload"
            className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-muted/50 px-4 py-8 text-sm text-muted-foreground transition-colors hover:bg-muted"
          >
            <Upload className="h-5 w-5" />
            <span>Klik om afbeelding te uploaden</span>
            <input id="image-upload" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
          </label>
          {imagePreview && (
            <div className="relative overflow-hidden rounded-lg border border-border">
              <img src={imagePreview || "/placeholder.svg"} alt="Preview" className="h-32 w-full object-cover" />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute right-2 top-2"
                onClick={() => {
                  setImage(null)
                  setImagePreview(null)
                }}
              >
                Verwijder
              </Button>
            </div>
          )}
        </div>
      </div>

      <Button type="submit" className="w-full gap-2" disabled={isGenerating || (!prompt.trim() && !image)}>
        {isGenerating ? (
          <>
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
            Genereren...
          </>
        ) : (
          <>
            <Sparkles className="h-4 w-4" />
            Genereer Robot
          </>
        )}
      </Button>
    </form>
  )
}
