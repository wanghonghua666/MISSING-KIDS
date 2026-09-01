import {defineField, defineType} from 'sanity'
import {PlayIcon} from '@sanity/icons'

export default defineType({
  name: 'youtube',
  title: 'YouTube',
  type: 'object',
  icon: PlayIcon,
  fields: [
    defineField({
      name: 'url',
      title: 'YouTube URL',
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
        title: 'YouTube',
        subtitle: url,
      }
    },
  },
})

