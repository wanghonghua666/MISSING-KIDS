import {defineArrayMember, defineField, defineType} from 'sanity'
import {CogIcon} from '@sanity/icons'

export default defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  icon: CogIcon,
  fields: [
    defineField({
      name: 'siteTitle',
      title: 'Site title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'siteDescription',
      title: 'Site description',
      type: 'text',
      rows: 3,
      description: '用于浏览器标签和搜索结果摘要',
    }),
    defineField({
      name: 'headerNav',
      title: 'Header navigation',
      type: 'array',
      description:
        '顶栏链接，拖动即可排序。自定义页面请先在左侧 Pages 里创建，再选「Page」挂上来。',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'headerNavItem',
          fields: [
            defineField({
              name: 'label',
              title: 'Label',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'linkType',
              title: 'Link to',
              type: 'string',
              options: {
                list: [
                  {title: 'Home', value: 'home'},
                  {title: 'Work', value: 'work'},
                  {title: 'Page', value: 'page'},
                  {title: 'External URL', value: 'url'},
                ],
                layout: 'radio',
              },
              initialValue: 'page',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'page',
              title: 'Page',
              type: 'reference',
              to: [{type: 'page'}],
              hidden: ({parent}) => parent?.linkType !== 'page',
              validation: (Rule) =>
                Rule.custom((value, context) => {
                  const parent = context.parent as {linkType?: string} | undefined
                  if (parent?.linkType === 'page' && !value) return '请选择一个页面'
                  return true
                }),
            }),
            defineField({
              name: 'url',
              title: 'URL',
              type: 'url',
              hidden: ({parent}) => parent?.linkType !== 'url',
              validation: (Rule) =>
                Rule.custom((value, context) => {
                  const parent = context.parent as {linkType?: string} | undefined
                  if (parent?.linkType !== 'url') return true
                  if (!value) return '请填写链接'
                  if (!/^https?:\/\//.test(String(value))) return '用 https:// 完整地址'
                  return true
                }),
            }),
          ],
          preview: {
            select: {
              title: 'label',
              linkType: 'linkType',
              url: 'url',
              pageTitle: 'page.title',
            },
            prepare({title, linkType, url, pageTitle}) {
              const subtitle =
                linkType === 'home'
                  ? '/home'
                  : linkType === 'work'
                    ? '/work'
                    : linkType === 'page'
                      ? pageTitle || 'Page'
                      : url || 'External'
              return {title: title || 'Untitled', subtitle}
            },
          },
        }),
      ],
    }),
    defineField({
      name: 'footerNav',
      title: 'Footer navigation',
      type: 'array',
      description:
        '页脚左下角。填了链接的文字会有悬停发光；只写文字、不填链接则是静态标签。',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'footerNavItem',
          fields: [
            defineField({
              name: 'label',
              title: 'Text',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'url',
              title: 'Link',
              type: 'string',
              description: '可填 https://... 或站内路径 /work。留空则为纯文字，没有悬停效果。',
              validation: (Rule) =>
                Rule.custom((value) => {
                  if (!value) return true
                  if (/^https?:\/\//.test(value) || value.startsWith('/')) return true
                  return '用 https:// 完整地址，或 / 开头的站内路径'
                }),
            }),
          ],
          preview: {
            select: {title: 'label', subtitle: 'url'},
            prepare({title, subtitle}) {
              return {
                title: title || 'Untitled',
                subtitle: subtitle || '纯文字（无链接）',
              }
            },
          },
        }),
      ],
    }),
    defineField({
      name: 'instagramUrl',
      title: 'Instagram URL',
      type: 'url',
      description: '商品详情「DM」按钮默认链接。页脚导航请在上面的 Footer navigation 里添加。',
      validation: (Rule) => Rule.uri({scheme: ['http', 'https']}),
    }),
    defineField({
      name: 'productCtaLabel',
      title: 'Product CTA label',
      type: 'string',
      description: '商品详情默认按钮文案，例如 DM On Ins',
      initialValue: 'DM On Ins',
    }),
    defineField({
      name: 'copyright',
      title: 'Copyright',
      type: 'string',
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Site Settings'}
    },
  },
})
