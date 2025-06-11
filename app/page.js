import { Hero } from "@/website/hero"
import { FeaturesSection } from "@/website/features-section"
import { AboutPreview } from "@/website/about-preview"

export default function HomePage() {
  return (
    <main>
      <Hero />
      <FeaturesSection />
      <AboutPreview />
    </main>
  )
}