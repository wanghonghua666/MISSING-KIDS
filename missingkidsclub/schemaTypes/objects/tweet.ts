import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'tweet',
  title: 'Tweet embed',
  type: 'object',
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

