"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, Accessibility, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { redirect } from "next/navigation"
import { createClient } from "@/utils/supabase/client"
import { signOut } from "@/app/services/account-services-client"
import dynamic from "next/dynamic"

// Disabling server side rendering with a wrapper to fix hydration error.
// If it takes too long to load find a different solution
const NavigationWrapper = dynamic(() => import("./navigation").then(mod => mod.Navigation), {
    ssr: false,
})

export default function NavigationClientWrapper() {
  return <NavigationWrapper />
}

export function Navigation() {
    const [isOpen, setIsOpen] = useState(false)
    const [signedIn, setSignedIn] = useState(false);
    const [loading, setLoading] = useState(true);
    const reloadAfterSignout = async () => {
        await signOut();
    }

    useEffect(() => {
        const checkSignIn = async () => {
            const supabase = await createClient();
            const { data: { user } } = await supabase.auth.getUser();
            console.log("Current user: ", user?.id);
            if (user) {
                setSignedIn(true);
            }
            setLoading(false); 
        }
        checkSignIn();
    }, []);


    const navItems = [
        { href: "/search/map", label: "Map" },
        { href: "/suggestions", label: "Suggested Places" },
        { href: "/reviews", label: "My Reviews" },
        { href: "/profile", label: "Profile" },
    ]

    // Prevent body scroll when menu is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden"
        } else {
            document.body.style.overflow = "unset"
        }

        return () => {
            document.body.style.overflow = "unset"
        }
    }, [isOpen])

    if (loading) return null;

    return (
        <header className="sticky top-0 z-50 w-full bg-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="relative flex h-16 items-center justify-between">
                    {/* Logo - Fixed left */}
                    <Link href="/" className="flex items-center space-x-2">
                        <Accessibility className="h-8 w-8 text-brand-primary" />
                        <span className="text-xl font-display text-brand-neutral-900">Access Able</span>
                    </Link>

                    {/* Desktop Navigation - Absolutely centered */}
                    <nav className="hidden md:flex items-center absolute left-1/2 transform -translate-x-1/2">
                        <div className="flex items-center space-x-6">
                            {navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className="text-sm font-medium text-brand-neutral-900 transition-colors hover:text-brand-primary"
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </div>
                    </nav>

                    {/* Right side content */}
                    <div className="flex items-center">
                        {!signedIn ? (
                            <div className="hidden md:flex items-center space-x-4">
                                <Button
                                    variant="outline"
                                    className="border-brand-secondary text-brand-secondary hover:bg-brand-secondary hover:text-white hover:cursor-pointer"
                                    onClick={() => redirect("/search/map")}
                                >
                                    Continue as Guest
                                </Button>
                                <Button className="bg-brand-primary hover:cursor-pointer hover:bg-brand-primary/90" onClick={() => redirect("/auth")}>
                                    Login / Signup
                                </Button>
                            </div>                        
                        ) : (
                            <Button 
                                variant="outline"
                                className="w-full bg-white hover:bg-brand-primary/90 border-1 border-gray-300 hover:cursor-pointer"
                                onClick={reloadAfterSignout}
                            >Logout</Button>
                        )}

                        {/* Mobile Navigation Button */}
                        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
                            <Menu className="h-6 w-6" />
                            <span className="sr-only">Toggle navigation menu</span>
                        </Button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation Overlay - Always rendered */}
            <div className={`fixed inset-0 z-50 md:hidden transition-all duration-300 ${isOpen ? "visible" : "invisible"}`}>
                {/* Background overlay */}
                <div
                    className={`fixed inset-0 bg-black transition-opacity duration-300 ${isOpen ? "opacity-50" : "opacity-0"}`}
                    onClick={() => setIsOpen(false)}
                />

                {/* Slide-out menu */}
                <div
                    className={`fixed right-0 top-0 h-full w-[300px] bg-white border-l border-gray-200 p-6 transform transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "translate-x-full"
                        }`}
                >
                    {/* Close button */}
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-display text-brand-neutral-900">Menu</h2>
                        <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                            <X className="h-6 w-6" />
                        </Button>
                    </div>

                    {/* Navigation items */}
                    <div className="flex flex-col space-y-4">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="text-lg font-medium text-brand-neutral-900 transition-colors hover:text-brand-primary"
                                onClick={() => setIsOpen(false)}
                            >
                                {item.label}
                            </Link>
                        ))}
                        <div className="flex flex-col space-y-2 pt-4 border-t border-gray-200 mt-2">
                            {!signedIn ? (
                                <div>
                                    <Button
                                        variant="outline"
                                        className="w-full border-brand-secondary text-brand-secondary hover:bg-brand-secondary hover:text-white"
                                        onClick={() => {
                                            redirect("/search/map")
                                            setIsOpen(false)
                                        }}
                                    >
                                        Continue as Guest
                                    </Button>
                                    <Button
                                        className="w-full bg-brand-primary hover:bg-brand-primary/90"
                                        onClick={() => {
                                            redirect("/auth")
                                            setIsOpen(false)
                                        }}
                                    >
                                        Login / Signup
                                    </Button>
                                </div>
                            ) : (
                                <Button 
                                    variant="outline"
                                    className="w-full bg-white hover:bg-brand-primary/90 border-1 border-gray-300"
                                    onClick={reloadAfterSignout}
                                >Logout</Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    )
}