import {PortableText, type PortableTextComponents} from "@portabletext/react"
import {InstagramEmbed} from "@/components/blog/instagram-embed"
import {sanityImageUrl} from "@/lib/sanity.image"
import {knockoutImageSrc} from "@/lib/knockout-background"
import {
  resolveEmbed,
  toSoundCloudEmbedUrl,
  toTweetEmbedUrl,
  toYoutubeEmbedUrl,
} from "@/lib/embeds"

const components: PortableTextComponents = {
  types: {
    image: ({value}) => {
      const src = knockoutImageSrc(sanityImageUrl(value, {width: 1600, quality: 88}))
      if (!src) return null
      return (
        <figure className="my-[16px] flex justify-center w-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={value.alt || ""}
            className="max-w-full max-h-[min(90vh,1200px)] w-auto rounded-[8px]"
          />
        </figure>
      )
    },
    youtube: ({value}) => {
      const src = value?.url ? toYoutubeEmbedUrl(value.url) : null
      if (!src) return null
      return (
        <div className="my-[16px] aspect-video w-full max-w-[720px] mx-auto">
          <iframe
            src={src}
            className="w-full h-full rounded-[8px]"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title="YouTube embed"
          />
        </div>
      )
    },
    soundCloud: ({value}) => {
      if (!value?.url) return null
      return (
        <div className="my-[16px] w-full max-w-[720px] mx-auto">
          <iframe
            width="100%"
            height="166"
            scrolling="no"
            frameBorder="no"
            allow="autoplay"
            src={toSoundCloudEmbedUrl(value.url)}
            title="SoundCloud embed"
          />
        </div>
      )
    },
    tweet: ({value}) => {
      if (!value?.url) return null
      const embedSrc = toTweetEmbedUrl(value.url)
      if (!embedSrc) {
        return (
          <div className="my-[16px] w-full max-w-[520px] mx-auto text-[13px]">
            <a href={value.url} target="_blank" rel="noreferrer" className="text-[#ef4444] underline">
              {value.url}
            </a>
          </div>
        )
      }
      return (
        <div className="my-[16px] w-full max-w-[520px] mx-auto min-h-[420px]">
          <iframe
            src={embedSrc}
            title="Tweet embed"
            className="w-full h-[480px] rounded-[8px] border-0 bg-black/20"
          />
        </div>
      )
    },
    inspost: ({value}) => {
      if (!value?.url) return null
      const embed = resolveEmbed(value.url)
      const height = typeof value?.height === "number" ? value.height : embed.defaultHeight

      return (
        <div className="my-[16px] w-full max-w-[min(1110px,100%)] mx-auto">
          {embed.kind === "instagram" && embed.permalink ? (
            <InstagramEmbed permalink={embed.permalink} title={value?.title} />
          ) : (
            <iframe
              src={embed.src}
              title={value?.title || `${embed.label} embed`}
              className="w-full rounded-[8px] border-0 bg-black/20"
              style={{height: `${height}px`}}
              loading="eager"
              referrerPolicy="strict-origin-when-cross-origin"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          )}
          <div className="mt-[8px] text-[12px] text-gray-300/70">
            如果嵌入不可用，你可以手动打开：
            <a
              href={value.url}
              target="_blank"
              rel="noreferrer"
              className="ml-[6px] text-[#ef4444] underline underline-offset-2"
            >
              {value.url}
            </a>
          </div>
        </div>
      )
    },
  },
}

export function PortableBody({value}: {value: unknown}) {
  return <PortableText value={value as never} components={components} />
}
