import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { prisma } from '#/db'
import { ExternalLink } from 'lucide-react'

const getPages = createServerFn({
  method: 'GET',
}).handler(async () => {
  return await prisma.page.findMany({
    orderBy: { createdAt: 'desc' },
  })
})

export const Route = createFileRoute('/pages/')({
  component: PagesIndex,
  loader: async () => await getPages(),
})

function PagesIndex() {
  const router = useRouter()
  const pages = Route.useLoaderData()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    const url = formData.get('url') as string
    if (!url?.trim()) return
    // Navigate to add route with URL in path - this triggers the add
    router.navigate({
      to: '/pages/add/$url',
      params: { url: url.trim() },
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-2">Saved Pages</h1>
        <p className="text-gray-400 mb-6">
          Paste any URL into the path to add it to the database. Visit{' '}
          <code className="px-2 py-1 bg-slate-700 rounded text-cyan-400">
            /pages/add/&lt;encoded-url&gt;
          </code>{' '}
          or use the form below.
        </p>

        <form
          onSubmit={handleSubmit}
          className="flex gap-2 mb-8 p-4 rounded-lg bg-slate-800/50 border border-slate-700"
        >
          <input
            type="url"
            name="url"
            placeholder="https://example.com"
            required
            className="flex-1 px-4 py-3 rounded-lg border border-slate-600 bg-slate-900 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
          <button
            type="submit"
            className="px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-lg transition-colors"
          >
            Add Page
          </button>
        </form>

        <ul className="space-y-3">
          {pages.map((page) => (
            <li
              key={page.id}
              className="flex items-center justify-between p-4 rounded-lg bg-slate-800/50 border border-slate-700 hover:border-cyan-500/50 transition-colors"
            >
              <a
                href={page.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-400 hover:text-cyan-300 truncate flex-1 mr-4"
              >
                {page.url}
              </a>
              <a
                href={page.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-gray-400 hover:text-cyan-400 transition-colors"
                aria-label="Open in new tab"
              >
                <ExternalLink size={18} />
              </a>
            </li>
          ))}
          {pages.length === 0 && (
            <li className="text-center py-12 text-gray-500">
              No pages yet. Add one above!
            </li>
          )}
        </ul>
      </div>
    </div>
  )
}
