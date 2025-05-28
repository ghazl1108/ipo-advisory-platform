"use client"

// src/components/SiteHeader.jsx
import { useState, useEffect } from "react"
import { Link, NavLink, useLocation } from "react-router-dom"
import { Button } from "./ui/Button"
import { Menu, X } from "lucide-react"

export default function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  // Handle scroll event to change header style on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false)
  }, [location.pathname])

  // Custom scroll function for smooth scrolling to sections
  const scrollToSection = (id) => {
    // Close the mobile menu if open
    setIsMenuOpen(false)

    // If we're not on the home page, navigate to home first
    if (location.pathname !== "/") {
      // We need to navigate to home page and then scroll
      // This is a workaround since we can't directly scroll to an element
      // that doesn't exist on the current page
      localStorage.setItem("scrollToSection", id)
      return
    }

    // Find the element and scroll to it
    const element = document.getElementById(id)
    if (element) {
      // Add a small delay to ensure the element is in the DOM
      setTimeout(() => {
        element.scrollIntoView({ behavior: "smooth" })
      }, 100)
    }
  }

  // Check if we need to scroll to a section after navigation
  useEffect(() => {
    if (location.pathname === "/") {
      const sectionToScroll = localStorage.getItem("scrollToSection")
      if (sectionToScroll) {
        localStorage.removeItem("scrollToSection")
        setTimeout(() => {
          scrollToSection(sectionToScroll)
        }, 500) // Give the page time to render
      }
    }
  }, [location.pathname])

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b transition-all duration-200 ${
        scrolled ? "bg-white shadow-sm" : "bg-white"
      }`}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center">
            {/* Larger logo without text */}
            <img
              src="/images/logo.png"
              alt="IPO Prediction"
              className="h-32 w-auto" // Increased from h-8 to h-12
              onError={(e) => {
                console.error("Logo failed to load")
                e.target.style.display = "none"
              }}
            />
            {/* Removed the text "IPO Predict" */}
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? "text-sm font-medium text-blue-600"
                : "text-sm font-medium text-slate-700 hover:text-blue-600 transition-colors"
            }
            end
          >
            Home
          </NavLink>
          <button
            onClick={() => scrollToSection("about")}
            className="text-sm font-medium text-slate-700 hover:text-blue-600 transition-colors"
          >
            About
          </button>
          <button
            onClick={() => scrollToSection("how-it-works")}
            className="text-sm font-medium text-slate-700 hover:text-blue-600 transition-colors"
          >
            How It Works
          </button>
          <button
            onClick={() => scrollToSection("predictions")}
            className="text-sm font-medium text-slate-700 hover:text-blue-600 transition-colors"
          >
            Predictions
          </button>
          {/* Removed "Register Company" NavLink */}
        </nav>

        {/* Desktop Action Buttons */}
        <div className="hidden md:flex items-center gap-4">
          <Link to="/login">
            <Button variant="outline" size="sm" className="hidden md:flex">
              Login
            </Button>
          </Link>
          {/* Kept only the Login button, removed Register button */}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden flex items-center text-slate-700"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? "text-blue-600 font-medium py-2" : "text-slate-700 hover:text-blue-600 py-2"
              }
              end
            >
              Home
            </NavLink>
            <button
              onClick={() => scrollToSection("about")}
              className="text-left text-slate-700 hover:text-blue-600 py-2"
            >
              About
            </button>
            <button
              onClick={() => scrollToSection("how-it-works")}
              className="text-left text-slate-700 hover:text-blue-600 py-2"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollToSection("predictions")}
              className="text-left text-slate-700 hover:text-blue-600 py-2"
            >
              Predictions
            </button>
            {/* Removed "Register Company" NavLink */}
            <div className="pt-2 flex flex-col space-y-2">
              <Link to="/login">
                <Button variant="outline" className="w-full">
                  Login
                </Button>
              </Link>
              {/* Removed Register button from mobile menu */}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
