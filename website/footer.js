import Link from "next/link"
import { Accessibility, Mail, Phone, Heart } from "lucide-react"

export function Footer() {
    return (
        <footer className="bg-brand-neutral-900 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="space-y-6">
                        <Link href="/" className="flex items-center space-x-2">
                            <Accessibility className="h-8 w-8 text-brand-primary" />
                            <span className="text-xl font-display">AccessAble</span>
                        </Link>
                        <p className="text-brand-neutral-50/70 leading-relaxed">
                            Empowering people with disabilities to move through the world with confidence, dignity, and independence.
                        </p>
                        <div className="flex items-center space-x-2 text-sm text-brand-neutral-50/60">
                            <Heart className="h-4 w-4 text-brand-primary" />
                            <span>Built with accessibility in mind</span>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-medium text-lg mb-6 text-brand-neutral-50">Quick Links</h3>
                        <ul className="space-y-3">
                            <li>
                                <Link href="/" className="text-brand-neutral-50/70 hover:text-brand-primary transition-colors">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link href="/about" className="text-brand-neutral-50/70 hover:text-brand-primary transition-colors">
                                    About
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="text-brand-neutral-50/70 hover:text-brand-primary transition-colors">
                                    Contact
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-brand-neutral-50/70 hover:text-brand-primary transition-colors">
                                    Search Places
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Community */}
                    <div>
                        <h3 className="font-medium text-lg mb-6 text-brand-neutral-50">Community</h3>
                        <ul className="space-y-3">
                            <li>
                                <Link href="#" className="text-brand-neutral-50/70 hover:text-brand-secondary transition-colors">
                                    Join Our Community
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-brand-neutral-50/70 hover:text-brand-secondary transition-colors">
                                    Contribute Reviews
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-brand-neutral-50/70 hover:text-brand-secondary transition-colors">
                                    Accessibility Guidelines
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-brand-neutral-50/70 hover:text-brand-secondary transition-colors">
                                    Community Standards
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h3 className="font-medium text-lg mb-6 text-brand-neutral-50">Support</h3>
                        <ul className="space-y-3">
                            <li>
                                <Link href="#" className="text-brand-neutral-50/70 hover:text-brand-accent transition-colors">
                                    Help Center
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-brand-neutral-50/70 hover:text-brand-accent transition-colors">
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-brand-neutral-50/70 hover:text-brand-accent transition-colors">
                                    Terms of Service
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-brand-neutral-50/70 hover:text-brand-accent transition-colors">
                                    Accessibility Statement
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-brand-neutral-50/10 mt-12 pt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                        <p className="text-brand-neutral-50/60 text-sm">&copy; 2025 AccessAble. All rights reserved.</p>
                        <div className="flex items-center space-x-6 text-sm text-brand-neutral-50/60">
                            <div className="flex items-center space-x-2">
                                <Mail className="h-4 w-4" />
                                <span>hello@accessable.com</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Phone className="h-4 w-4" />
                                <span>+1 (555) 123-4567</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}
