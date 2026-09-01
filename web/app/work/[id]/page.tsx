import type {Metadata} from "next"
import Image from "next/image"
import {notFound} from "next/navigation"
import {Header} from "@/components/layout/header"
import {Footer} from "@/components/layout/footer"
import {MainContent} from "@/components/layout/main-content"
import {TransitionLink} from "@/components/layout/transition-link"
import {sanityClient} from "@/lib/sanity.client"
import {productBySlugQuery} from "@/lib/sanity.queries"
import {sanityImageUrl} from "@/lib/sanity.image"
import {formatPrice} from "@/lib/price"
import {getSiteSettings} from "@/lib/site-settings"

export const revalidate = 60

interface Props {
  params: Promise<{id: string}>
}

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {id} = await params
  const product = await sanityClient.fetch(productBySlugQuery, {slug: id})
  if (!product) return {title: "Not found"}
  return {
    title: product.title,
    description: product.description || undefined,
    openGraph: {
      images: sanityImageUrl(product.mainImage, {width: 1200, quality: 80})
        ? [{url: sanityImageUrl(product.mainImage, {width: 1200, quality: 80}) as string}]
        : undefined,
    },
  }
}

export default async function WorkDetailPage({params}: Props) {
  const {id} = await params
  const [product, settings] = await Promise.all([
    sanityClient.fetch(productBySlugQuery, {slug: id}),
    getSiteSettings(),
  ])

  if (!product) notFound()

  const images = [
    product.mainImage
      ? {
          url: sanityImageUrl(product.mainImage, {width: 1600, quality: 85}) || "/logo.png",
          alt: product.mainImage.alt || product.title,
        }
      : null,
    ...(product.gallery ?? []).map((image: {alt?: string | null}) => {
      const url = sanityImageUrl(image, {width: 1600, quality: 85})
      if (!url) return null
      return {url, alt: image.alt || product.title}
    }),
  ].filter((image): image is {url: string; alt: string} => Boolean(image))

  const price = formatPrice(product.price)
  const ctaHref = product.ctaUrl || settings.instagramUrl
  const ctaLabel = product.ctaLabel || settings.productCtaLabel

  return (
    <div className="w-full min-h-screen flex flex-col">
      <Header />
      <MainContent className="flex-1 w-full flex items-center justify-center gap-0 pt-[180px] pb-[90px] pl-[120px] pr-[120px] mt-[90px] mb-[90px]">
        <div className="w-full max-w-[960px] md:max-w-[1280px] flex flex-col md:flex-row items-center justify-start gap-[40px] p-[32px] md:p-[48px] mk-glass-blur-18 mk-work-layout text-left">
          <div className="min-w-0 w-full max-w-[786px] h-fit rounded-xl overflow-visible flex flex-col items-center gap-0 px-0 mx-0 mk-product-hero mk-product-hero-scroll">
            <div className="flex w-full flex-col items-center gap-[24px] py-[24px]">
              {images.map((image) => (
                <div
                  key={image.url}
                  className="relative w-full aspect-[1017/767] max-h-[70vh] mk-product-hero-img-wrap"
                >
                  <Image
                    src={image.url}
                    alt={image.alt}
                    fill
                    sizes="(min-width: 769px) 786px, 100vw"
                    className="object-contain"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="min-w-0 flex-1 flex flex-col justify-center items-start gap-[24px] px-[24px] md:px-[48px] mk-mono mk-product-detail-content font-semibold leading-[31px]">
            <div className="flex w-full flex-col gap-[8px]">
              <span className="text-[12px] tracking-[0.3em] text-[#ef4444]">PRODUCT DETAIL</span>
              <h1 className="w-full text-right text-[48px] md:text-[112px] font-bold leading-[0.625]">
                {product.title}
              </h1>
            </div>

            {price ? <div className="text-[18px] font-bold text-[#ef4444]">{price}</div> : null}

            {product.description ? (
              <div className="text-[13px] leading-relaxed text-[rgba(99,99,99,0.9)] whitespace-pre-wrap">
                {product.description}
              </div>
            ) : null}

            {product.size || product.color ? (
              <div className="mt-[16px] flex flex-wrap gap-[12px] text-[12px] text-[rgba(41,41,41,0.9)]">
                {product.size ? (
                  <span className="px-[10px] py-[4px] rounded-full">Size: {product.size}</span>
                ) : null}
                {product.color ? (
                  <span className="px-[10px] py-[4px] rounded-full">Color: {product.color}</span>
                ) : null}
              </div>
            ) : null}

            <div className="mt-auto flex gap-[16px] text-[12px]">
              {ctaHref ? (
                <a
                  href={ctaHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-[16px] py-[8px] text-[#ef4444] mk-hover-bright"
                >
                  {ctaLabel}
                </a>
              ) : null}
              <TransitionLink
                href="/work"
                transitionMs={360}
                className="px-[16px] py-[8px] text-white/80 rounded-full mk-hover-bright"
              >
                返回商品列表
              </TransitionLink>
            </div>
          </div>
        </div>
      </MainContent>
      <Footer nav={settings.footerNav} copyright={settings.copyright} />
    </div>
  )
}
