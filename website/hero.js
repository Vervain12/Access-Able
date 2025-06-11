"use client"

import { Search, MapPin, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { redirect } from "next/navigation"
import { useState } from "react"

export function Hero() {
    return (
        <div>
            {/* Hero Section - Just the text */}
            <section className="relative min-h-[500px] flex items-center justify-center bg-gradient-to-br from-brand-primary/5 via-brand-secondary/5 to-brand-accent/5">
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-100"
                    style={{
                        backgroundImage: "url('/images/hero-bg.avif')",
                    }}
                />
                {/* Overlay for better text readability */}
                <div className="absolute inset-0 bg-white/60"></div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center space-y-8">
                        <div className="space-y-6">
                            <h1 className="text-4xl md:text-6xl lg:text-7xl font-display text-brand-neutral-900 leading-tight">
                                Move Through the World with <span className="text-brand-primary">Confidence</span>
                            </h1>
                            <p className="text-xl md:text-2xl text-brand-neutral-900/80 max-w-4xl mx-auto leading-relaxed">
                                Community-driven accessibility insights powered by AI help you make informed decisions about every
                                public space
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Search Section */}
            <SearchSection />
        </div>
    )
}

function SearchSection() {
    const [searchQuery, setSearchQuery] = useState("")

    const handleSearch = (e) => {
        e.preventDefault()
        if (searchQuery.trim()) {
            redirect(`/search/map?q=${encodeURIComponent(searchQuery)}`)
        } else {
            redirect("/search/map")
        }
    }

    return (
        <section className="py-12 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-2xl mx-auto">
                    <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-brand-neutral-900/40 h-5 w-5" />
                            <Input
                                type="text"
                                placeholder="Search restaurants, parks, hotels, and more"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 h-14 text-lg border-2 border-brand-primary/20 focus:border-brand-primary"
                            />
                        </div>
                        <Button
                            type="submit"
                            size="lg"
                            className="h-14 px-8 bg-brand-primary hover:bg-brand-primary/90 text-white font-medium shadow-lg"
                        >
                            SEARCH
                        </Button>
                    </form>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8">
                    <button
                        onClick={() => redirect("/search/map")}
                        className="flex items-center text-brand-secondary font-medium hover:text-brand-secondary/80 transition-colors"
                    >
                        <MapPin className="h-5 w-5 mr-2" />
                        Explore nearby places
                    </button>
                    <button
                        onClick={() => redirect("/auth")}
                        className="flex items-center text-brand-accent font-medium hover:text-brand-accent/80 transition-colors"
                    >
                        <Users className="h-5 w-5 mr-2" />
                        Join our community
                    </button>
                </div>

                {/* Trust indicators */}
                <div className="pt-12 mt-8 border-t border-brand-neutral-900/10">
                    <p className="text-sm text-brand-neutral-900/60 mb-4 text-center">
                        Trusted by thousands of people with disabilities
                    </p>
                    <div className="flex flex-wrap justify-center items-center gap-8 text-brand-neutral-900/40">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-brand-primary">50K+</div>
                            <div className="text-sm">Places reviewed</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-brand-secondary">25K+</div>
                            <div className="text-sm">Community members</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-brand-accent">100+</div>
                            <div className="text-sm">Cities covered</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
