import {defineField, defineType} from 'sanity'
import InspostInput from "../../components/inputs/inspostInput"

export default defineType({
  name: 'inspost',
  title: 'Inspost embed',
  type: 'object',
  components: {input: InspostInput},
  fields: [
    defineField({
      name: 'url',
      title: 'Inspost URL (embed)',
      type: 'url',
      validation: (Rule) => Rule.uri({scheme: ['http', 'https']}).required(),
    }),
    defineField({
      name: 'height',
      title: 'Embed height (px)',
      type: 'number',
      validation: (Rule) => Rule.min(200).max(2000),
    }),
    defineField({
      name: 'title',
      title: 'Accessibility title',
      type: 'string',
    }),
  ],
  preview: {
    select: {
      url: 'url',
      title: 'title',
    },
    prepare({url, title}) {
      return {
        title: title ? `Inspost: ${title}` : 'Inspost',
        subtitle: url,
      }
    },
  },
})

