import { ShipWheelIcon as Wheelchair, Eye, Ear, Heart, Users, Zap, Shield } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function FeaturesSection() {
    const features = [
        {
            icon: Users,
            title: "Community-Driven",
            description: "Real reviews from people with disabilities who've actually been there",
            color: "text-brand-primary",
            bgColor: "bg-brand-primary/10",
        },
        {
            icon: Zap,
            title: "AI-Powered Summaries",
            description: "Smart insights that quickly tell you what you need to know",
            color: "text-brand-secondary",
            bgColor: "bg-brand-secondary/10",
        },
        {
            icon: Shield,
            title: "Trustworthy Data",
            description: "Verified accessibility information you can count on",
            color: "text-brand-accent",
            bgColor: "bg-brand-accent/10",
        },
    ]

    const accessibilityTypes = [
        {
            icon: Wheelchair,
            title: "Mobility Access",
            description: "Wheelchair access, ramps, accessible parking, and barrier-free paths",
        },
        {
            icon: Eye,
            title: "Vision Support",
            description: "Braille signage, audio descriptions, high contrast displays, and tactile guides",
        },
        {
            icon: Ear,
            title: "Hearing Access",
            description: "Hearing loops, sign language services, visual alerts, and quiet spaces",
        },
        {
            icon: Heart,
            title: "Inclusive Environment",
            description: "Sensory-friendly spaces, accessible restrooms, and welcoming staff",
        },
    ]

    return (
        <>
            {/* Value Proposition Section */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center space-y-6 mb-16">
                        <h2 className="text-3xl md:text-5xl font-display text-brand-neutral-900">
                            Faster, Stress-Free Decision Making
                        </h2>
                        <p className="text-xl text-brand-neutral-900/70 max-w-3xl mx-auto">
                            Our unique combination of crowdsourced data, AI summaries, and inclusive design empowers you to move
                            through the world with confidence
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 mb-20">
                        {features.map((feature, index) => (
                            <Card
                                key={index}
                                className="text-center border-2 border-gray-200 hover:border-brand-primary/20 hover:shadow-xl transition-all duration-300"
                            >
                                <CardHeader>
                                    <div
                                        className={`mx-auto w-16 h-16 ${feature.bgColor} rounded-full flex items-center justify-center mb-6`}
                                    >
                                        <feature.icon className={`h-8 w-8 ${feature.color}`} />
                                    </div>
                                    <CardTitle className="text-xl font-medium text-brand-neutral-900">{feature.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription className="text-brand-neutral-900/70 text-base leading-relaxed">
                                        {feature.description}
                                    </CardDescription>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Accessibility Types Section */}
            <section className="py-20 bg-gradient-to-br from-brand-neutral-50 to-brand-primary/5">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center space-y-6 mb-16">
                        <h2 className="text-3xl md:text-4xl font-display text-brand-neutral-900">
                            Accessibility Information for Every Need
                        </h2>
                        <p className="text-xl text-brand-neutral-900/70 max-w-3xl mx-auto">
                            Get disability-specific insights that matter to you and your community
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {accessibilityTypes.map((type, index) => (
                            <Card
                                key={index}
                                className="text-center border-2 border-gray-200 hover:border-brand-secondary/30 hover:shadow-lg transition-shadow"
                            >
                                <CardHeader>
                                    <div className="mx-auto w-12 h-12 bg-brand-secondary/10 rounded-full flex items-center justify-center mb-4">
                                        <type.icon className="h-6 w-6 text-brand-secondary" />
                                    </div>
                                    <CardTitle className="text-lg font-medium text-brand-neutral-900">{type.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription className="text-brand-neutral-900/70 leading-relaxed">
                                        {type.description}
                                    </CardDescription>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>
        </>
    )
}
