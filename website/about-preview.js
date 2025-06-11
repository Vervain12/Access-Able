import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Target, Users, Globe } from "lucide-react"

export function AboutPreview() {
    return (
        <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
                    <div className="space-y-8">
                        <div className="space-y-6">
                            <h2 className="text-3xl md:text-4xl font-display text-brand-neutral-900 leading-tight">
                                Empowering Independence Through Community
                            </h2>
                            <p className="text-lg text-brand-neutral-900/70 leading-relaxed">
                                Access Able was born from a simple belief: people with disabilities deserve to move through the world
                                with confidence, dignity, and independence. We're building a community-driven platform that surfaces
                                trustworthy, disability-specific accessibility insights for every public place.
                            </p>
                            <p className="text-lg text-brand-neutral-900/70 leading-relaxed">
                                By combining the power of community knowledge with AI technology, we're making it easier than ever to
                                find accessible spaces that meet your specific needs.
                            </p>
                        </div>
                        <Link href="/about">
                            <Button size="lg" className="bg-brand-primary hover:bg-brand-primary/90 text-white font-medium">
                                Learn More About Our Mission
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                    </div>
                    <div className="relative">

                        <Image
                            src="/images/about-preview.avif"
                            alt="Community members using accessibility features"
                            width={600}
                            height={400}
                            className="rounded-lg shadow-lg"
                        />

                    </div>
                </div>

                {/* Mission highlights */}
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="text-center space-y-4">
                        <div className="w-16 h-16 bg-brand-primary/10 rounded-full flex items-center justify-center mx-auto">
                            <Target className="h-8 w-8 text-brand-primary" />
                        </div>
                        <h3 className="text-xl font-medium text-brand-neutral-900">Our Vision</h3>
                        <p className="text-brand-neutral-900/70">
                            A world where accessibility information empowers confident, independent movement through public spaces
                        </p>
                    </div>
                    <div className="text-center space-y-4">
                        <div className="w-16 h-16 bg-brand-secondary/10 rounded-full flex items-center justify-center mx-auto">
                            <Users className="h-8 w-8 text-brand-secondary" />
                        </div>
                        <h3 className="text-xl font-medium text-brand-neutral-900">Our Mission</h3>
                        <p className="text-brand-neutral-900/70">
                            Provide a community-driven platform with trustworthy, disability-specific accessibility insights
                        </p>
                    </div>
                    <div className="text-center space-y-4">
                        <div className="w-16 h-16 bg-brand-accent/10 rounded-full flex items-center justify-center mx-auto">
                            <Globe className="h-8 w-8 text-brand-accent" />
                        </div>
                        <h3 className="text-xl font-medium text-brand-neutral-900">Our Impact</h3>
                        <p className="text-brand-neutral-900/70">
                            Creating inclusive communities where everyone can participate fully in public life
                        </p>
                    </div>
                </div>
            </div>
        </section >
    )
}
