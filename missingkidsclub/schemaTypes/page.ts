import {defineArrayMember, defineField, defineType} from 'sanity'
import {DocumentIcon} from '@sanity/icons'

const RESERVED = new Set(['home', 'work', 'blog', 'product', 'api', 'page'])

export default defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  icon: DocumentIcon,
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
      description: '前台地址是 /slug。不要用 home、work、blog。',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) =>
        Rule.required().custom((value) => {
          const current = value?.current?.trim().toLowerCase()
          if (!current) return '需要 slug'
          if (RESERVED.has(current)) return `不能使用保留路径 /${current}`
          return true
        }),
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      options: {
        insertMenu: {
          filter: true,
          showIcons: true,
          views: [{name: 'list'}],
        },
      },
      of: [
        defineArrayMember({type: 'block'}),
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
        defineArrayMember({type: 'inspost'}),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'slug.current',
    },
  },
})
