import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'soundCloud',
  title: 'SoundCloud embed',
  type: 'object',
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

