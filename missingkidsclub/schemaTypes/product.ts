import {defineArrayMember, defineField, defineType} from 'sanity'
import {CaseIcon} from '@sanity/icons'

export default defineType({
  name: 'product',
  title: 'Product',
  type: 'document',
  icon: CaseIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'mainImage',
      title: 'Main Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt text',
          type: 'string',
          validation: (Rule) => Rule.required().warning('Alt text helps SEO and accessibility'),
        }),
      ],
    }),
    defineField({
      name: 'gallery',
      title: 'Gallery',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'image',
          options: {hotspot: true},
          fields: [
            defineField({
              name: 'alt',
              title: 'Alt text',
              type: 'string',
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'price',
      title: 'Price',
      type: 'string',
      description: '例如 999 或 ¥199。前台会在纯数字前自动加上 ¥。',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'size',
      title: 'Size',
      type: 'string',
      description: '留空则详情页不显示尺码',
    }),
    defineField({
      name: 'color',
      title: 'Color',
      type: 'string',
      description: '留空则详情页不显示颜色',
    }),
    defineField({
      name: 'ctaLabel',
      title: 'CTA label',
      type: 'string',
      description: '覆盖站点默认按钮文案，例如 DM On Ins',
    }),
    defineField({
      name: 'ctaUrl',
      title: 'CTA URL',
      type: 'url',
      description: '覆盖站点默认 Instagram 链接。留空则使用 Site Settings 里的 Instagram URL。',
      validation: (Rule) => Rule.uri({scheme: ['http', 'https']}),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{type: 'category'}],
    }),
    defineField({
      name: 'orderRank',
      title: 'Order rank',
      type: 'number',
      description: '控制列表顺序（数值越小越靠前）',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'slug.current',
      media: 'mainImage',
    },
  },
})
