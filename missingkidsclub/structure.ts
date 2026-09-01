import type {StructureResolver} from 'sanity/structure'
import {CogIcon} from '@sanity/icons'

const SINGLETONS = ['siteSettings']

export const structure: StructureResolver = (S) =>
  S.list()
    .title('MISSINGKIDS.CLUB')
    .items([
      S.listItem()
        .title('Site Settings')
        .icon(CogIcon)
        .child(S.document().schemaType('siteSettings').documentId('siteSettings').title('Site Settings')),
      S.divider(),
      ...S.documentTypeListItems().filter((listItem) => !SINGLETONS.includes(listItem.getId() as string)),
    ])
