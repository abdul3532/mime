export type CrawledProduct = {
  name: string
  description: string
  price: number
  currency: string
  stock: number
  buyUrl: string
}

const normalizeBaseUrl = (inputUrl: string) => {
  const parsed = new URL(inputUrl)
  return `${parsed.protocol}//${parsed.host}`
}

export const mockCrawlProducts = async (inputUrl: string): Promise<CrawledProduct[]> => {
  const baseUrl = normalizeBaseUrl(inputUrl)

  return [
    {
      name: 'Starter Tee',
      description: 'Soft cotton t-shirt for daily wear.',
      price: 2499,
      currency: 'USD',
      stock: 18,
      buyUrl: `${baseUrl}/products/starter-tee`,
    },
    {
      name: 'Canvas Tote',
      description: 'Reusable tote bag with reinforced handles.',
      price: 1999,
      currency: 'USD',
      stock: 42,
      buyUrl: `${baseUrl}/products/canvas-tote`,
    },
    {
      name: 'Travel Mug',
      description: 'Insulated mug with leak-resistant lid.',
      price: 3299,
      currency: 'USD',
      stock: 9,
      buyUrl: `${baseUrl}/products/travel-mug`,
    },
  ]
}
