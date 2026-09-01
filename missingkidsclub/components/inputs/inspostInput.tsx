import * as React from 'react'
import {PatchEvent, set} from 'sanity'
import {resolveEmbed} from '../../lib/embedUrl'

const SITE_URL = process.env.SANITY_STUDIO_SITE_URL || 'http://localhost:3001'

function InstagramPreview({permalink, title}: {permalink: string; title?: string}) {
  const [failed, setFailed] = React.useState(false)
  const imageSrc = `${SITE_URL.replace(/\/$/, '')}/api/instagram-image?url=${encodeURIComponent(permalink)}`

  if (failed) {
    return (
      <div style={{padding: 16, fontSize: 12, opacity: 0.8}}>
        预览图抓取失败，可直接打开：{' '}
        <a href={permalink} target="_blank" rel="noreferrer">
          {permalink}
        </a>
      </div>
    )
  }

  return (
    <div>
      <img
        src={imageSrc}
        alt={title || 'Instagram post'}
        onError={() => setFailed(true)}
        style={{display: 'block', width: '100%', height: 'auto'}}
      />
      <div style={{padding: '10px 12px', fontSize: 12, opacity: 0.75}}>
        Instagram 官方嵌入在本地经常加载不出，这里显示帖子首图。
      </div>
    </div>
  )
}

export default function InspostInput(props: any) {
  const {renderDefault, value, onChange} = props

  const url: string = typeof value?.url === 'string' ? value.url : ''
  const embed = url ? resolveEmbed(url) : null
  const height: number =
    typeof value?.height === 'number' ? value.height : embed?.defaultHeight || 520
  const isInstagram = embed?.kind === 'instagram'

  const setHeight = React.useCallback(
    (h: number) => {
      onChange?.(PatchEvent.from(set(h, ['height'])))
    },
    [onChange],
  )

  return (
    <div>
      {renderDefault?.(props)}

      {embed ? (
        <div style={{marginTop: 12}}>
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12}}>
            <div style={{fontSize: 12, opacity: 0.7}}>
              {isInstagram ? `预览（${embed.label}）` : `预览（${embed.label}）· 拖动滑杆调高度`}
            </div>
            {isInstagram ? null : (
              <div style={{display: 'flex', alignItems: 'center', gap: 10}}>
                <span style={{fontSize: 12, opacity: 0.7}}>{height}px</span>
                <input
                  type="range"
                  min={200}
                  max={2000}
                  value={height}
                  onChange={(e) => setHeight(Number(e.target.value))}
                />
              </div>
            )}
          </div>

          <div
            style={{
              marginTop: 10,
              borderRadius: 8,
              overflow: 'hidden',
              border: '1px solid rgba(255,255,255,0.12)',
              background: isInstagram ? '#111' : 'transparent',
            }}
          >
            {isInstagram && embed.permalink ? (
              <InstagramPreview permalink={embed.permalink} title={value?.title} />
            ) : (
              <iframe
                src={embed.src}
                title={value?.title || `${embed.label} preview`}
                style={{width: '100%', height, border: 0, display: 'block'}}
                loading="eager"
                referrerPolicy="strict-origin-when-cross-origin"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            )}
          </div>
        </div>
      ) : null}
    </div>
  )
}
