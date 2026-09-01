import {EarthGlobeIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'
import InspostInput from '../../components/inputs/inspostInput'

export default defineType({
  name: 'inspost',
  title: 'Embedded',
  type: 'object',
  icon: EarthGlobeIcon,
  components: {input: InspostInput},
  fields: [
    defineField({
      name: 'url',
      title: 'URL',
      description: 'Instagram, YouTube, X, SoundCloud, TikTok, Vimeo, or any embeddable URL',
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
        title: title ? `Embedded: ${title}` : 'Embedded',
        subtitle: url,
      }
    },
  },
})
