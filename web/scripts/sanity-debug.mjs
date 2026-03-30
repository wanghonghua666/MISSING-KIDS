import {createClient} from "@sanity/client"

const client = createClient({
  projectId: "wjldnct8",
  dataset: "production",
  apiVersion: "2025-01-01",
  useCdn: false,
})

const query = /* groq */ `
*[_type == "post"] | order(publishedAt desc)[0]{
  _id,
  title,
  "slug": slug.current,
  publishedAt,
  body[]{
    _type,
    url,
    height,
    title
  }
}
`

const data = await client.fetch(query)
console.log(JSON.stringify(data, null, 2))

