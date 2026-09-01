import {defineField, defineType} from 'sanity'
import {CommentIcon} from '@sanity/icons'

export default defineType({
  name: 'tweet',
  title: 'Tweet',
  type: 'object',
  icon: CommentIcon,
  fields: [
    defineField({
      name: 'url',
      title: 'Tweet URL',
      type: 'url',
      validation: (Rule) => Rule.uri({scheme: ['http', 'https']}).required(),
    }),
  ],
  preview: {
    select: {
      url: 'url',
    },
    prepare({url}) {
      return {
        title: 'Tweet',
        subtitle: url,
      }
    },
  },
})

