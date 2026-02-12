'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'

export default function Home() {
  const [isLogoHovered, setIsLogoHovered] = useState(false)

  useEffect(() => {
    // Scroll-triggered blur for footer
    const handleScroll = () => {
      const footer = document.querySelector('footer')
      const scrolled = window.scrollY > 100
      if (footer) {
        if (scrolled) {
          footer.classList.add('blurred')
        } else {
          footer.classList.remove('blurred')
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    // Add blur to header when logo is hovered
    const header = document.querySelector('header')
    if (header) {
      if (isLogoHovered) {
        header.classList.add('logo-hover-blur')
      } else {
        header.classList.remove('logo-hover-blur')
      }
    }
  }, [isLogoHovered])

  return (
    <>
      <header>
        <a
          href="https://www.instagram.com/missingkids_lab/"
          target="_blank"
          rel="noopener noreferrer"
          onMouseEnter={() => setIsLogoHovered(true)}
          onMouseLeave={() => setIsLogoHovered(false)}
        >
          <Image
            src="/logo.png"
            alt="Logo"
            width={120}
            height={120}
            className="logo"
            priority
          />
        </a>
      </header>

      <footer>
        <div className="social-links">
          <a
            href="https://www.instagram.com/missingkids_lab/"
            target="_blank"
            rel="noopener noreferrer"
          >
            instagram
          </a>
        </div>
        <p>&copy; 2026 MissingKids Lab. All rights reserved.</p>
      </footer>
    </>
  )
}
