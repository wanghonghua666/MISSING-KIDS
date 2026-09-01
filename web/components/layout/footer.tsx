import Link from "next/link"
import type {FooterNavItem} from "@/lib/site-settings"

export type FooterProps = {
  nav?: FooterNavItem[]
  copyright?: string | null
}

function isInternalHref(href: string) {
  return href.startsWith("/") && !href.startsWith("//")
}

export function Footer({nav = [], copyright}: FooterProps) {
  return (
    <div
      className="mk-footer"
      style={{
        backdropFilter: "blur(3px)",
        background: "transparent",
      }}
    >
      <nav className="mk-socials" aria-label="Footer">
        {nav.map((item) =>
          item.url ? (
            <Link
              key={item._key}
              href={item.url}
              target={isInternalHref(item.url) ? undefined : "_blank"}
              rel={isInternalHref(item.url) ? undefined : "noopener noreferrer"}
              className="mk-hover-bright transition-[filter]"
            >
              {item.label}
            </Link>
          ) : (
            <span key={item._key}>{item.label}</span>
          ),
        )}
      </nav>

      <div className="mk-copyright">
        {copyright || "© 2026 MissingKids Lab. All rights reserved."}
      </div>
    </div>
  )
}
