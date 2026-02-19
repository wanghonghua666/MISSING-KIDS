import Link from "next/link"

export function Footer() {
  return (
    <div
      className="mk-footer"
      style={{
        backdropFilter: "blur(3px)",
      
        background: "transparent",
      }}
    >
      <div className="mk-socials">
        <Link
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#ef4444] mk-hover-bright transition-[filter]"
        >
          instagram
        </Link>
      </div>

      <div className="mk-copyright">
        © 2026 MissingKids Lab. All rights reserved.
      </div>
    </div>
  )
}
