import PageTemplate, { generateMetadata } from './[slug]/page'

// src/app/page.tsx
import { redirect } from 'next/navigation';

export default function Home() {
  redirect('/underconstruction');
}


export { generateMetadata }
