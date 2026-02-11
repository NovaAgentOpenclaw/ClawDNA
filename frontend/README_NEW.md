# ClawDNA - Multi-Page React Frontend

A complete multi-page React application for the ClawDNA AI Agent Evolution Platform, built with React Router, TypeScript, Tailwind CSS, and Framer Motion.

## 🚀 Features

### Pages

1. **Home (/)** - Landing page with hero section, feature highlights, and statistics
2. **Population (/population)** - Agent grid with advanced filtering, sorting, and search
3. **Evolution (/evolution)** - Real-time charts showing fitness progression and generation history
4. **Breeding (/breeding)** - Interactive interface for selecting and breeding agents
5. **Leaderboard (/leaderboard)** - Rankings table with podium display and detailed agent modals

### Components

#### Reusable UI Components
- **Card** - Flexible card container with variants (hover, glow)
- **Button** - Multiple variants (primary, secondary, ghost, danger, outline)
- **Badge** - Colored badges for status indicators
- **Input** - Form inputs with icon support and error states

#### Domain Components
- **AgentCard** - Displays agent information with traits, fitness, and metadata
- **TraitBar** - Visual representation of individual agent traits
- **StatCard** - Dashboard stat cards with trend indicators
- **Navigation** - Responsive navigation bar with mobile menu

### Key Features

✅ **Fully Responsive** - Mobile-first design with breakpoints for all screen sizes
✅ **Dark Theme** - Professional dark UI with neon green accents
✅ **Smooth Animations** - Framer Motion animations for page transitions and interactions
✅ **TypeScript** - Full type safety throughout the application
✅ **Mock Data** - 50+ generated agents with realistic traits and fitness scores
✅ **Advanced Filtering** - Filter by generation, fitness, mutation status
✅ **Sorting** - Sort by fitness, generation, age, and trait values
✅ **Interactive Breeding** - Select parents, view compatibility, predict offspring traits
✅ **Charts** - Line and radar charts for visualizing evolution progress
✅ **Modals** - Agent detail modals with full trait analysis

## 🛠️ Tech Stack

- **React 18.2** - UI library
- **TypeScript 5.2** - Type safety
- **React Router 6.21** - Client-side routing
- **Tailwind CSS 3.4** - Utility-first styling
- **Framer Motion 11.0** - Animation library
- **Chart.js 4.4** - Data visualization
- **Vite 5.0** - Build tool and dev server
- **Lucide React** - Icon library

## 📦 Installation

```bash
cd clawdna-fresh/frontend
npm install
```

## 🚀 Development

Start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## 🏗️ Build

Build for production:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

## 📁 Project Structure

```
src/
├── components/          # Reusable components
│   ├── ui/             # Base UI components
│   │   ├── Card.tsx
│   │   ├── Button.tsx
│   │   ├── Badge.tsx
│   │   └── Input.tsx
│   ├── AgentCard.tsx   # Agent display component
│   ├── TraitBar.tsx    # Trait visualization
│   ├── StatCard.tsx    # Statistics card
│   ├── Navigation.tsx  # App navigation
│   └── Dashboard.tsx   # Legacy dashboard (can be removed)
├── pages/              # Route pages
│   ├── HomePage.tsx
│   ├── PopulationPage.tsx
│   ├── EvolutionPage.tsx
│   ├── BreedingPage.tsx
│   └── LeaderboardPage.tsx
├── hooks/              # Custom React hooks
│   ├── useSimulation.ts
│   └── useSolana.ts
├── lib/                # Utilities
│   └── utils.ts       # Helper functions
├── data/               # Mock data
│   └── mock.ts
├── types/              # TypeScript types
│   └── index.ts
├── App.tsx             # Root component with routing
├── main.tsx            # App entry point
└── index.css           # Global styles

```

## 🎨 Theme & Styling

### Color Palette

- **Background**: `#0a0a0f`, `#111118`, `#1a1a24`
- **Neon Green**: `#22c55e` (primary accent)
- **Text**: `#fafafa` (primary), `#a1a1aa` (secondary)
- **Borders**: `#27272a`

### Custom Tailwind Classes

- `.glass-panel` - Glassmorphic background
- `.neon-glow` - Neon shadow effect
- `.btn-primary` - Primary button style
- `.text-gradient` - Gradient text effect
- `.agent-card` - Agent card styling

## 🧩 Component Usage

### AgentCard

```tsx
<AgentCard
  agent={agent}
  rank={1}
  onClick={() => handleSelect(agent)}
  isSelected={selected?.id === agent.id}
  selectable={true}
  compact={false}
/>
```

### TraitBar

```tsx
<TraitBar
  trait="speed"
  value={0.85}
  size="md"
  showIcon={true}
  showValue={true}
  animated={true}
/>
```

### StatCard

```tsx
<StatCard
  title="Average Fitness"
  value={formatNumber(3.42)}
  subtitle="Population average"
  icon={BarChart3}
  trend={12.5}
  color="neon"
/>
```

## 🔄 Routing

The app uses React Router v6 with a layout wrapper:

```tsx
<BrowserRouter>
  <Routes>
    <Route element={<Layout />}>
      <Route path="/" element={<HomePage />} />
      <Route path="/population" element={<PopulationPage />} />
      <Route path="/evolution" element={<EvolutionPage />} />
      <Route path="/breeding" element={<BreedingPage />} />
      <Route path="/leaderboard" element={<LeaderboardPage />} />
    </Route>
  </Routes>
</BrowserRouter>
```

## 📊 Data Flow

### Mock Data Generation

The app uses mock data for demonstration:

- **50 agents** with randomized traits
- **20 generations** of evolutionary history
- Trait values between 0-1
- Fitness scores calculated from trait combinations

### State Management

- Local component state using `useState`
- Derived state with `useMemo` for performance
- Custom hook `useSimulation` for evolution logic

## 🎯 Next Steps

### Potential Enhancements

1. **Backend Integration**
   - Connect to real API endpoints
   - Implement WebSocket for real-time updates
   - User authentication and sessions

2. **Advanced Features**
   - Agent comparison tool
   - Export/import agent data
   - Breeding history visualization
   - Tournament mode

3. **Performance**
   - Code splitting for routes
   - Virtual scrolling for large lists
   - Image optimization

4. **Testing**
   - Unit tests with Vitest
   - Component tests with Testing Library
   - E2E tests with Playwright

## 📝 License

MIT License - Feel free to use this project for your own purposes.

## 🤝 Contributing

Contributions are welcome! Please follow the existing code style and component patterns.

---

Built with ❤️ for the Colosseum AI Agent Hackathon 2026
