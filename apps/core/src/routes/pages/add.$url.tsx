import { createFileRoute, redirect } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { prisma } from '#/db'

const addPage = createServerFn({
  method: 'POST',
})
  .inputValidator((data: { url: string }) => data)
  .handler(async ({ data }) => {
    const decoded = decodeURIComponent(data.url)
    if (!decoded.startsWith('http://') && !decoded.startsWith('https://')) {
      throw new Error('URL must start with http:// or https://')
    }
    return await prisma.page.upsert({
      where: { url: decoded },
      create: { url: decoded },
      update: {},
    })
  })

export const Route = createFileRoute('/pages/add/$url')({
  loader: async ({ params }) => {
    const url = decodeURIComponent(params.url)
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      throw redirect({ to: '/pages' })
    }
    await addPage({ data: { url } })
    throw redirect({ to: '/pages' })
  },
  component: AddPageRedirect,
})

function AddPageRedirect() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <p className="text-gray-400">Adding page...</p>
    </div>
  )
}
