import type {Metadata} from "next"
import {Inter, JetBrains_Mono, Noto_Sans_SC} from "next/font/google"
import "./globals.css"
import {RouteTransitionProvider} from "@/components/layout/transition-provider"
import {getSiteSettings} from "@/lib/site-settings"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
})

const notoSansSc = Noto_Sans_SC({
  subsets: ["latin"],
  weight: ["300", "400"],
  variable: "--font-heiti",
  display: "swap",
})

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  return {
    title: {
      default: settings.siteTitle,
      template: `%s · ${settings.siteTitle}`,
    },
    description: settings.siteDescription,
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-CN">
      <head>
        <link rel="preload" href="/logo.png?v=4" as="image" type="image/png" />
      </head>
      <body className={`${inter.variable} ${jetbrainsMono.variable} ${notoSansSc.variable} font-sans antialiased`}>
        <RouteTransitionProvider>{children}</RouteTransitionProvider>
      </body>
    </html>
  )
}
