import { NextRequest, NextResponse } from "next/server"

// Gebruik de Edge runtime voor lagere latency
export const runtime = "edge"

export async function POST(request: NextRequest) {
  try {
    const { prompt, image, withImage } = await request.json()

    if (!prompt && !image) {
      return NextResponse.json({ error: "Prompt of afbeelding is vereist" }, { status: 400 })
    }

    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: "OpenAI API key niet geconfigureerd" }, { status: 500 })
    }

    // Construeer de messages voor OpenAI
    const messages: Array<{
      role: "system" | "user"
      content: string | Array<{ type: string; text?: string; image_url?: { url: string } }>
    }> = [
      {
        role: "system",
        content: `Je bent een expert in robotica en Arduino programmering. Genereer een complete robot configuratie in JSON formaat op basis van de gebruikersinvoer.

Het JSON object moet exact deze structuur hebben:
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
- Minimaal 2-3 optimalisaties worden gegeven`,
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

    // Call OpenAI API (met timeout en lagere max_tokens voor snellere responses)
    const controller = new AbortController()
    const chatTimeout = setTimeout(() => controller.abort(), 30000)
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: image ? "gpt-4o" : "gpt-4o-mini",
        messages: messages,
        response_format: { type: "json_object" },
        temperature: 0.6,
        max_tokens: 2000,
      }),
      signal: controller.signal,
    })
    clearTimeout(chatTimeout)

    if (!response.ok) {
      const error = await response.json()
      console.error("OpenAI API Error:", error)
      return NextResponse.json(
        { error: `OpenAI API error: ${error.error?.message || "Unknown error"}` },
        { status: response.status }
      )
    }

    const data = await response.json()
    const robotConfig = JSON.parse(data.choices[0].message.content)

    // Optioneel: genereer een afbeelding van de robot met DALL-E (kost extra tijd)
    let imageUrl: string | undefined
    if (withImage === true) {
      try {
        const imagePrompt = `A detailed 3D render of a ${robotConfig.name}: ${robotConfig.description}. The robot should look technical and realistic, showing the components like motors, sensors, and Arduino board. Studio lighting, white background, product photography style.`

        const imageController = new AbortController()
        const imageTimeout = setTimeout(() => imageController.abort(), 20000)
        const imageResponse = await fetch("https://api.openai.com/v1/images/generations", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: "dall-e-3",
            prompt: imagePrompt,
            n: 1,
            size: "512x512",
            quality: "standard",
          }),
          signal: imageController.signal,
        })
        clearTimeout(imageTimeout)

        if (imageResponse.ok) {
          const imageData = await imageResponse.json()
          imageUrl = imageData.data?.[0]?.url
        }
      } catch (imageError) {
        console.error("Error generating robot image:", imageError)
        // Ga door zonder afbeelding
      }
    }

    // Voeg ID en imageUrl toe aan de configuratie
    const configWithId = {
      id: Date.now().toString(),
      ...robotConfig,
      imageUrl,
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
