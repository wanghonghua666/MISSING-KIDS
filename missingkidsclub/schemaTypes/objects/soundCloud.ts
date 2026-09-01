import {defineField, defineType} from 'sanity'
import {BoltIcon} from '@sanity/icons'

export default defineType({
  name: 'soundCloud',
  title: 'SoundCloud',
  type: 'object',
  icon: BoltIcon,
  fields: [
    defineField({
      name: 'url',
      title: 'SoundCloud URL (embed)',
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
        title: 'SoundCloud',
        subtitle: url,
      }
    },
  },
})

