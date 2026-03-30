export const blogBySlugQuery = `
*[_type == "post" && slug.current == $slug][0]{
  _id,
  title,
  slug,
  publishedAt,
  body
}
`

export const allProductsWithCategoryQuery = `
*[_type == "product" && defined(slug.current)] | order(orderRank asc){
  _id,
  title,
  "slug": slug.current,
  "image": mainImage{
    asset->{
      _id,
      url
    },
    alt
  },
  price,
  "category": category->{
    _id,
    title,
    "slug": slug.current
  }
}
`

export const allCategoriesQuery = `
*[_type == "category"] | order(orderRank asc){
  _id,
  title,
  "slug": slug.current
}
`

