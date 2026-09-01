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
