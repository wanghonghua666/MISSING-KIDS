import type {StructureResolver} from 'sanity/structure'
import {CogIcon, DocumentIcon, DocumentTextIcon} from '@sanity/icons'
import {orderableDocumentListDeskItem} from '@sanity/orderable-document-list'

const SINGLETONS = ['siteSettings']
const ORDERABLE_TYPES = ['post']
const STRUCTURED_TYPES = [...SINGLETONS, ...ORDERABLE_TYPES, 'page']

export const structure: StructureResolver = (S, context) =>
  S.list()
    .title('MISSINGKIDS.CLUB')
    .items([
      S.listItem()
        .title('Site Settings')
        .icon(CogIcon)
        .child(S.document().schemaType('siteSettings').documentId('siteSettings').title('Site Settings')),
      S.divider(),
      S.listItem()
        .id('pages')
        .title('Pages')
        .icon(DocumentIcon)
        .child(S.documentTypeList('page').title('Pages')),
      orderableDocumentListDeskItem({
        type: 'post',
        title: 'Blog Post',
        icon: DocumentTextIcon,
        S,
        context,
      }),
      ...S.documentTypeListItems().filter((listItem) => {
        const id = listItem.getId() as string
        return !STRUCTURED_TYPES.includes(id)
      }),
    ])
