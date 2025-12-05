import { GlobalConfig } from 'payload/types';

export const Settings: GlobalConfig = {
  slug: 'settings',
  fields: [
    {
      name: 'homePage',
      type: 'relationship',
      relationTo: 'pages',
      label: 'Select Homepage',
      required: true,
    }
  ]
};
