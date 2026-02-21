import { createFileRoute } from '@tanstack/react-router'
import { prisma } from '#/db'

/**
 * This route is used to track when a user clicks the buy button on a product.
 * then redirect to the buy url.
 */ 
export const Route = createFileRoute('/action/buy/$id')({
  component: () => null,
  server: {
    handlers: {
      GET: async ({ params }) => {
        const id = Number(params.id)
        if (!Number.isInteger(id) || id < 1) {
          return new Response('Invalid product id.', {
            status: 400,
            headers: { 'content-type': 'text/plain; charset=utf-8' },
          })
        }

        const product = await prisma.product.findUnique({ where: { id } })
        if (!product) {
          return new Response('Product not found.', {
            status: 404,
            headers: { 'content-type': 'text/plain; charset=utf-8' },
          })
        }

        console.info('[buy-click]', {
          productId: product.id,
          productName: product.name,
          buyUrl: product.buyUrl,
          clickedAt: new Date().toISOString(),
        })

        return Response.redirect(product.buyUrl, 302)
      },
    },
  },
})
