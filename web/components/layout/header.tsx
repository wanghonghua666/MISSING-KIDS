"use client"

import * as React from "react"
import Image from "next/image"
import { TransitionLink } from "@/components/layout/transition-link"

export function Header() {
  const [menuOpen, setMenuOpen] = React.useState(false)

  return (
    <>
      <header className="mk-header">
        <TransitionLink href="/home" className="mk-logo-link flex items-center justify-center">
          <Image src="/logo.png" alt="MissingKids Lab" width={120} height={120} priority className="select-none" />
        </TransitionLink>

        {/* Desktop nav — hidden on mobile via CSS */}
        <nav className="mk-desktop-nav w-[212px] h-[52px] flex items-center justify-center gap-[32px]">
          <TransitionLink href="/home" className="mk-mono w-[77px] h-[33px] flex items-center justify-center text-[20px] font-semibold leading-[30px] text-[#ef4444]">
            Home
          </TransitionLink>
          <TransitionLink href="/work" className="mk-mono w-[77px] h-[33px] flex items-center justify-center text-[20px] font-semibold leading-[30px] text-[#ef4444]">
            Work
          </TransitionLink>
        </nav>

        {/* Mobile hamburger — hidden on desktop via CSS */}
        <button
          className="mk-mobile-menu mk-hover-bright"
          aria-label="Menu"
          onClick={() => setMenuOpen(true)}
        >
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#ab2f33" strokeWidth="2" strokeLinecap="round">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      </header>

      {/* Mobile nav overlay */}
      {menuOpen && (
        <div className="mk-mobile-nav-overlay" onClick={() => setMenuOpen(false)}>
          <div className="mk-mobile-nav-panel" onClick={(e) => e.stopPropagation()}>
            <button className="mk-mobile-nav-close mk-hover-bright" onClick={() => setMenuOpen(false)} aria-label="Close">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ab2f33" strokeWidth="2" strokeLinecap="round">
                <line x1="4" y1="4" x2="20" y2="20" />
                <line x1="20" y1="4" x2="4" y2="20" />
              </svg>
            </button>
            <nav className="mk-mobile-nav-links">
              <TransitionLink href="/home" className="mk-mono text-[28px] font-semibold text-[#ef4444]" onClick={() => setMenuOpen(false)}>
                Home
              </TransitionLink>
              <TransitionLink href="/work" className="mk-mono text-[28px] font-semibold text-[#ef4444]" onClick={() => setMenuOpen(false)}>
                Work
              </TransitionLink>
            </nav>
          </div>
        </div>
      )}
    </>
  )
}
