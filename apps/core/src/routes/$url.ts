import { createFileRoute } from '@tanstack/react-router'
import { prisma } from '#/db'
import { mockCrawlProducts } from '#/lib/mock-crawler'

const buildLlmMarkdown = (sourceUrl: string, products: Array<{
  id: number
  name: string
  description: string
  price: number
  currency: string
  stock: number
}>) => {
  const lines: string[] = []
  lines.push('# Product Catalog')
  lines.push('')
  lines.push(`Source: ${sourceUrl}`)
  lines.push(`Total products: ${products.length}`)
  lines.push('')
  lines.push('## Products')
  lines.push('')

  for (const product of products) {
    lines.push(`### ${product.name}`)
    lines.push(`- id: ${product.id}`)
    lines.push(`- description: ${product.description}`)
    lines.push(`- price: ${product.price} ${product.currency}`)
    lines.push(`- stock: ${product.stock}`)
    lines.push(`- buy: /action/buy/${product.id}`)
    lines.push('')
  }

  return `${lines.join('\n').trim()}\n`
}

export const Route = createFileRoute('/$url')({
  component: () => null,
  server: {
    handlers: {
      GET: async ({ params }) => {
        const decodedUrl = decodeURIComponent(params.url)
        const isValidUrl = decodedUrl.startsWith('http://') || decodedUrl.startsWith('https://')

        if (!isValidUrl) {
          return new Response('Expected an encoded ecommerce URL in the path.', {
            status: 400,
            headers: { 'content-type': 'text/plain; charset=utf-8' },
          })
        }

        const page = await prisma.page.upsert({
          where: { url: decodedUrl },
          create: { url: decodedUrl },
          update: {},
        })

        const existingProducts = await prisma.product.findMany({
          where: { pageId: page.id },
          orderBy: { id: 'asc' },
        })

        if (existingProducts.length === 0) {
          const crawledProducts = await mockCrawlProducts(decodedUrl)

          await prisma.product.createMany({
            data: crawledProducts.map((product) => ({
              pageId: page.id,
              name: product.name,
              description: product.description,
              price: product.price,
              currency: product.currency,
              stock: product.stock,
              buyUrl: product.buyUrl,
            })),
          })
        }

        const products = await prisma.product.findMany({
          where: { pageId: page.id },
          orderBy: { id: 'asc' },
        })

        const markdown = buildLlmMarkdown(decodedUrl, products)
        return new Response(markdown, {
          headers: { 'content-type': 'text/markdown; charset=utf-8' },
        })
      },
    },
  },
})
