import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'youtube',
  title: 'YouTube embed',
  type: 'object',
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

