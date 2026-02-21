import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({ component: App })

function App() {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    const formData = new FormData(form)
    const rawUrl = String(formData.get('url') ?? '').trim()

    if (!rawUrl) return

    const destination = `/${encodeURIComponent(rawUrl)}`
    window.location.assign(destination)
  }

  return (
    <main>
      <h1>Ecommerce Crawl Demo</h1>
      <p>Paste your ecommerce URL and generate an llm.md product page.</p>
      <form onSubmit={handleSubmit}>
        <label htmlFor="url">Ecommerce URL</label>
        <input id="url" name="url" type="url" placeholder="https://shop.example.com" required />
        <button type="submit">Crawl</button>
      </form>
    </main>
  )
}
