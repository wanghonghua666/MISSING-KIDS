'use client'
import { CMSLink } from '@/components/Link'
import { Cart } from '@/components/Cart'
import { OpenCartButton } from '@/components/Cart/OpenCart'
import Link from 'next/link'
import React, { Suspense } from 'react'

import { MobileMenu } from './MobileMenu'
import type { Header } from 'src/payload-types'

import { LogoIcon } from '@/components/icons/logo'
import { usePathname } from 'next/navigation'
import { cn } from '@/utilities/cn'

type Props = {
  header: Header
}

export function HeaderClient({ header }: Props) {
  const menu = header.navItems || []
  const pathname = usePathname()

  // 获取 logo URL
  const getLogoUrl = () => {
    // 优先使用 header 中的 logo
    if (header.logo && typeof header.logo === 'object') {
      // 如果 logo 是对象，尝试获取 url
      if ('url' in header.logo && header.logo.url) {
        // 如果 url 是相对路径，添加服务器 URL
        const url = header.logo.url as string
        if (url.startsWith('/')) {
          return `${process.env.NEXT_PUBLIC_SERVER_URL || ''}${url}`
        }
        return url
      }
      // 如果有 id，使用 API 获取
      if ('id' in header.logo && header.logo.id) {
        return `${process.env.NEXT_PUBLIC_SERVER_URL || ''}/api/media/${header.logo.id}`
      }
    }
    // 如果没有，使用默认的 logo ID
    return `${process.env.NEXT_PUBLIC_SERVER_URL || ''}/api/media/693305337f12910b2f184eed`
  }

  const logoUrl = getLogoUrl()

  return (
    <header className="relative z-20 bg-transparent border-none shadow-none !bg-transparent">
      <nav className="flex items-center md:items-end justify-between container pt-2">
        <div className="block flex-none md:hidden">
          <Suspense fallback={null}>
            <MobileMenu menu={menu} />
          </Suspense>
        </div>
        <div className="flex w-full items-end justify-between">
          <div className="flex w-full items-end gap-6 md:w-1/3">
            <Link className="flex w-full items-center justify-center pt-4 pb-4 md:w-auto" href="/">
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt="Logo"
                  className="h-10 w-auto"
                />
              ) : (
                <LogoIcon className="w-6 h-auto" />
              )}
            </Link>
            {menu.length ? (
              <ul className="hidden gap-4 text-sm md:flex md:items-center">
                {menu.map((item) => (
                  <li key={item.id}>
                    <CMSLink
                      {...item.link}
                      size={'clear'}
                      className={cn('relative navLink', {
                        active:
                          item.link.url && item.link.url !== '/'
                            ? pathname.includes(item.link.url)
                            : false,
                      })}
                      appearance="nav"
                    />
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          <div className="flex justify-end md:w-1/3 gap-4">
            <Suspense fallback={<OpenCartButton />}>
              <Cart />
            </Suspense>
          </div>
        </div>
      </nav>
    </header>
  )
}
