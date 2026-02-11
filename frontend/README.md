# ClawDNA v3 - Retro-Futuristic Frontend

A bold, anti-AI-slop frontend for ClawDNA - an AI agent evolution platform on Solana.

## 🎨 Design Philosophy

**Tone**: Retro-Futuristic + Brutalist
- Neon accents on deep void backgrounds
- CRT/terminal aesthetics mixed with DNA helix motifs
- Raw, exposed structure with dramatic typography

## 🚀 Tech Stack

- **Framework**: Next.js 14 + React 18 + TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Custom shadcn/ui components
- **Animations**: Framer Motion
- **Icons**: Lucide React

## 🎯 Key Features

### Visual Elements
- **Animated DNA Helix**: 3D rotating DNA helix in hero that morphs during scroll
- **Particle Field**: Interactive particle background with connection lines
- **Glitch Effects**: Hover effects with glitch animations
- **Glow Effects**: Pulsing neon glows on interactive elements
- **Grain Overlay**: Subtle noise texture for that retro feel
- **Grid Background**: Cyberpunk-style grid pattern

### Sections
1. **Hero**: Staggered reveal animation with DNA helix and particle field
2. **Evolution**: 4-step process cards with staggered entrance
3. **Agents**: Agent type cards with animated visuals and traits
4. **Breeding**: Interactive breeding visualization with animated connections
5. **Tokenomics**: Animated pie chart with token allocation
6. **FAQ**: Accordion with smooth expand/collapse
7. **Footer**: Links and social icons

### Typography
- **Headlines**: Space Grotesk (bold, sci-fi feel)
- **Body**: JetBrains Mono (terminal/code aesthetic)
- **Accent**: System font stack with custom weights

### Color Palette
```css
--bg-primary: #0a0a0f
--bg-secondary: #12121a
--text-primary: #f0f0f5
--accent-cyan: #00f0ff
--accent-purple: #a855f7
--accent-green: #00ff88
```

## 📁 Project Structure

```
frontend-v3/
├── app/
│   ├── globals.css      # Global styles with custom animations
│   ├── layout.tsx       # Root layout with fonts
│   └── page.tsx         # Main page composing all sections
├── components/
│   ├── navigation.tsx   # Fixed header with mobile menu
│   ├── hero-section.tsx # Hero with DNA helix & particles
│   ├── dna-helix.tsx    # Animated 3D DNA helix component
│   ├── particle-field.tsx # Canvas-based particle system
│   ├── evolution-section.tsx
│   ├── agents-section.tsx
│   ├── breeding-section.tsx
│   ├── tokenomics-section.tsx
│   ├── faq-section.tsx
│   └── footer.tsx
├── components/ui/       # shadcn/ui components
│   ├── button.tsx
│   ├── badge.tsx
│   ├── card.tsx
│   └── accordion.tsx
├── config/
│   └── site.ts          # All content configuration
├── lib/
│   └── utils.ts         # Utility functions (cn)
└── public/              # Static assets
```

## 🛠️ Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 📝 Content Management

All content is centralized in `config/site.ts`. Edit this file to update:
- Navigation links
- Hero text and stats
- Evolution steps
- Agent types and traits
- Breeding features
- Tokenomics data
- FAQ items
- Footer links

## 🎭 Custom Components

### Button Variants
- `glow`: Cyan glow effect with hover scale
- `glitch`: Purple border with glitch hover effect

### Badge Variants
- `glow`: Cyan glow badge
- `cyan`/`purple`/`green`: Color-coded badges

## 🌐 Deployment

This project is optimized for Vercel deployment:

```bash
vercel
```

## 🎨 Design Decisions

1. **No generic fonts**: Space Grotesk + JetBrains Mono instead of Inter/Roboto
2. **No evenly-distributed palettes**: 70-20-10 rule with dominant dark + sharp accents
3. **High contrast CTAs**: Buttons pop dramatically against dark backgrounds
4. **Orchestrated animations**: Staggered reveals and scroll-triggered entrances
5. **Unforgettable elements**: DNA helix, particle field, glitch effects

## 🔮 Future Enhancements

- [ ] 3D agent viewer with Three.js
- [ ] Interactive breeding simulator
- [ ] Real-time agent marketplace
- [ ] Wallet connection integration
- [ ] Live agent battles/arena

---

Built for the Solana Hackathon 2024. Evolve the future.
