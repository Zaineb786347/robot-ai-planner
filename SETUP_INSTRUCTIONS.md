# AI Robot Planner - Installatie Instructies

## Wat is er veranderd?

De applicatie gebruikt nu **echte OpenAI API** in plaats van hardcoded placeholders voor het genereren van robot configuraties.

## Setup

### 1. Installeer Dependencies

```bash
pnpm install
```

### 2. Environment Variables

De OpenAI API key staat al in `.env.local`. Deze is automatisch geconfigureerd.

### 3. Start de Development Server

```bash
pnpm dev
```

De applicatie draait nu op `http://localhost:3000`

## Hoe het werkt

### API Route
- **Locatie**: `app/api/generate-robot/route.ts`
- **Functie**: Ontvangt prompts/afbeeldingen en roept de OpenAI API aan
- **Model**: Gebruikt `gpt-4o` voor afbeeldingen en `gpt-4o-mini` voor tekst
- **Output**: Gestructureerde JSON met complete robot configuratie

### Frontend
- **Locatie**: `components/robot-planner.tsx`
- **Functie**: Stuurt gebruikersinvoer naar de API
- **Features**:
  - Real-time generatie met AI
  - Afbeelding upload ondersteuning
  - Error handling
  - Loading states

## Features

✅ **AI-Gegenereerde Robot Configuraties**
- Volledige Arduino code
- Componenten lijst met prijzen
- Circuit diagrammen
- Montage instructies
- Performance metrics
- Optimalisatie suggesties

✅ **Afbeelding Support**
- Upload een afbeelding van een robot
- AI analyseert en genereert bijpassende configuratie

✅ **Opslaan & Vergelijken**
- Sla meerdere configuraties op
- Vergelijk verschillende ontwerpen
- Download Arduino code (.ino bestanden)

## API Kosten

Het project gebruikt:
- **gpt-4o-mini** voor tekst prompts (goedkoper, sneller)
- **gpt-4o** voor afbeeldingen (duurder, maar nodig voor vision)

Houd je OpenAI API usage in de gaten via: https://platform.openai.com/usage

## Troubleshooting

### "OpenAI API key niet geconfigureerd"
- Controleer of `.env.local` bestaat
- Herstart de development server

### "Module not found" errors
```bash
pnpm install
```

### Type errors
```bash
pnpm build
```

## Beveiliging

⚠️ **BELANGRIJK**: 
- De `.env.local` file staat in `.gitignore`
- Commit **NOOIT** je API key naar Git
- Voor productie: gebruik environment variables op je hosting platform
