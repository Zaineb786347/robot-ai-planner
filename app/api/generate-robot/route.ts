import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { prompt, image, withImage } = await request.json()

    if (!prompt && !image) {
      return NextResponse.json({ error: "Prompt of afbeelding is vereist" }, { status: 400 })
    }

    const apiKey = process.env.GROQ_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: "Groq API key niet geconfigureerd" }, { status: 500 })
    }

    // Construeer de messages voor OpenAI
    const messages: Array<{
      role: "system" | "user"
      content: string | Array<{ type: string; text?: string; image_url?: { url: string } }>
    }> = [
      {
        role: "system",
        content: `Je bent een expert in robotica en Arduino programmering. Genereer een complete robot configuratie in JSON formaat op basis van de gebruikersinvoer.

Geef ALLEEN geldig JSON terug, geen andere tekst of uitleg. Het JSON object moet exact deze structuur hebben:
{
  "name": "Robot Naam",
  "description": "Beschrijving van de robot",
  "arduinoCode": "Complete Arduino C++ code met alle functies",
  "components": [
    {"name": "Component naam", "quantity": 1, "price": 25.00}
  ],
  "circuit": {
    "connections": [
      {"from": "Component A", "to": "Component B", "pin": "D9"}
    ]
  },
  "instructions": [
    "Stap 1",
    "Stap 2"
  ],
  "optimizations": [
    {
      "title": "Optimalisatie titel",
      "description": "Beschrijving",
      "implementation": "Hoe te implementeren"
    }
  ],
  "performance": {
    "speed": 85,
    "efficiency": 80,
    "accuracy": 90
  }
}

Zorg dat:
- De Arduino code volledig werkbaar is met alle benodigde functies
- Componentprijzen realistisch zijn in euro's
- Alle circuit connecties correct en specifiek zijn
- Instructies gedetailleerd en in het Nederlands zijn
- Performance scores tussen 0-100 zijn
- Minimaal 2-3 optimalisaties worden gegeven
- Je antwoord begint met { en eindigt met }`,
      },
    ]

    // Als er een afbeelding is, voeg deze toe aan de prompt
    if (image) {
      messages.push({
        role: "user",
        content: [
          {
            type: "text",
            text: prompt || "Genereer een robot configuratie op basis van deze afbeelding.",
          },
          {
            type: "image_url",
            image_url: {
              url: image,
            },
          },
        ],
      })
    } else {
      messages.push({
        role: "user",
        content: prompt,
      })
    }

    // Call Groq API (OpenAI-compatible, gratis en snel)
    const controller = new AbortController()
    const chatTimeout = setTimeout(() => controller.abort(), 30000)
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: messages,
        temperature: 0.6,
        max_tokens: 2000,
      }),
      signal: controller.signal,
    })
    clearTimeout(chatTimeout)

    if (!response.ok) {
      const error = await response.json()
      console.error("Groq API Error:", error)
      return NextResponse.json(
        { error: `Groq API error: ${error.error?.message || JSON.stringify(error)}` },
        { status: response.status }
      )
    }

    const data = await response.json()
    const content = data.choices[0].message.content

    // Extraheer JSON uit de response
    const jsonMatch = content.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      return NextResponse.json({ error: "Geen geldige JSON ontvangen van het model" }, { status: 500 })
    }

    // Fix ongeëscapede control characters in JSON strings (bijv. newlines in Arduino code)
    const sanitizeJson = (str: string) => {
      let inString = false
      let escaped = false
      let result = ""
      for (const char of str) {
        if (escaped) {
          escaped = false
          result += char
        } else if (char === "\\" && inString) {
          escaped = true
          result += char
        } else if (char === '"') {
          inString = !inString
          result += char
        } else if (inString && char.charCodeAt(0) < 32) {
          if (char === "\n") result += "\\n"
          else if (char === "\r") result += "\\r"
          else if (char === "\t") result += "\\t"
          else result += `\\u${char.charCodeAt(0).toString(16).padStart(4, "0")}`
        } else {
          result += char
        }
      }
      return result
    }

    const robotConfig = JSON.parse(sanitizeJson(jsonMatch[0]))

    // Voeg ID toe aan de configuratie
    const configWithId = {
      id: Date.now().toString(),
      ...robotConfig,
    }

    return NextResponse.json(configWithId)
  } catch (error) {
    console.error("Error generating robot:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Er is een fout opgetreden" },
      { status: 500 }
    )
  }
}
