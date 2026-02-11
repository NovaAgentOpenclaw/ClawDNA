import { Navigation } from "@/components/navigation"
import { TokenBanner } from "@/components/token-banner"
import { HeroSection } from "@/components/hero-section"
import { LiveEvolutionFeed } from "@/components/live-evolution-feed"
import { FeaturedAgentsCarousel } from "@/components/featured-agents-carousel"
import { EvolutionSection } from "@/components/evolution-section"
import { AgentsSection } from "@/components/agents-section"
import { BreedingSection } from "@/components/breeding-section"
import { BreedingSimulatorTeaser } from "@/components/breeding-simulator-teaser"
import { CommunitySection } from "@/components/community-section"
import { TokenomicsSection } from "@/components/tokenomics-section"
import { FAQSection } from "@/components/faq-section"
import { FinalCta } from "@/components/final-cta"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="relative min-h-screen">
      <div className="grain" />
      <Navigation />
      <TokenBanner />
      <HeroSection />
      <LiveEvolutionFeed />
      <FeaturedAgentsCarousel />
      <EvolutionSection />
      <AgentsSection />
      <BreedingSection />
      <BreedingSimulatorTeaser />
      <CommunitySection />
      <TokenomicsSection />
      <FAQSection />
      <FinalCta />
      <Footer />
    </main>
  )
}
