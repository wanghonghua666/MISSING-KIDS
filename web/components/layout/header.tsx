"use client"

import * as React from "react"
import {TransitionLink} from "@/components/layout/transition-link"
import type {HeaderNavItem} from "@/lib/site-settings"

type Props = {
  items?: HeaderNavItem[]
}

const FALLBACK: HeaderNavItem[] = [
  {_key: "home", label: "Home", href: "/home", external: false},
  {_key: "work", label: "Work", href: "/work", external: false},
]

export function Header({items}: Props) {
  const [menuOpen, setMenuOpen] = React.useState(false)
  const nav = items && items.length > 0 ? items : FALLBACK

  return (
    <>
      <header className="mk-header">
        <TransitionLink href="/home" className="mk-logo-link flex items-center">
          <img
            src="/logo.png?v=4"
            alt="MissingKids Lab"
            width={120}
            height={120}
            decoding="async"
            fetchPriority="high"
            className="mk-logo-img select-none"
          />
        </TransitionLink>

        <nav className="mk-desktop-nav h-[52px] w-auto max-w-[min(640px,52vw)] flex items-center justify-end gap-[32px]">
          {nav.map((item) => (
            <TransitionLink
              key={item._key}
              href={item.href}
              target={item.external ? "_blank" : undefined}
              rel={item.external ? "noopener noreferrer" : undefined}
              className="mk-mono h-[33px] flex items-center justify-center text-[20px] font-semibold leading-[30px] text-[#ef4444] whitespace-nowrap"
            >
              {item.label}
            </TransitionLink>
          ))}
        </nav>

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
              {nav.map((item) => (
                <TransitionLink
                  key={item._key}
                  href={item.href}
                  target={item.external ? "_blank" : undefined}
                  rel={item.external ? "noopener noreferrer" : undefined}
                  className="mk-mono text-[28px] font-semibold text-[#ef4444]"
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </TransitionLink>
              ))}
            </nav>
          </div>
        </div>
      )}
    </>
  )
}
