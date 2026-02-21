import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useState, type FormEvent } from 'react'

export const Route = createFileRoute('/')({
  component: App,
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { prisma } = await import('@/db')
        const body = (await request.json()) as { url?: string }
        const url = String(body?.url ?? '').trim()

        if (!url) {
          return Response.json({ error: 'URL is required.' }, { status: 400 })
        }

        await prisma.page.upsert({
          where: { url },
          create: {
            url,
          },
          update: {},
        })

        return Response.json({ ok: true })
      },
    },
  },
})

function App() {
  const router = useRouter()
  const [url, setUrl] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    console.log('handleSubmit', url)
    event.preventDefault()
    const trimmedUrl = url.trim()
    if (!trimmedUrl || isSubmitting) return

    try {
      setIsSubmitting(true)
      const response = await fetch('/', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({ url: trimmedUrl }),
      })

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as { error?: string } | null
        throw new Error(data?.error ?? 'Failed to crawl page')
      }

      setUrl('')
      router.navigate({ to: '/pages/add/$url', params: { url: trimmedUrl } })
    } catch (error) {
      console.error('Failed to crawl page', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main>
      <h1>Ecommerce Crawl Demo</h1>
      <p>Paste your ecommerce URL and generate an llm.md product page.</p>
      <form onSubmit={handleSubmit}>
        <label htmlFor="url">Ecommerce URL</label>
        <input id="url" name="url" type="url" placeholder="https://shop.example.com" required value={url} onChange={e => setUrl(e.target.value)} />
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Crawling...' : 'Crawl'}
        </button>
      </form>
    </main>
  )
}
