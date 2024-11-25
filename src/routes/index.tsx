import * as React from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { z } from "zod"

const pages = 3
const postsPerPage = 5

async function fetchPosts(page: number = 1) {
  const r = await fetch(
    `https://jsonplaceholder.typicode.com/posts?_start=${(page - 1) * postsPerPage}&_limit=${postsPerPage}`
  )
  return await r.json()
}

export const Route = createFileRoute('/')({
  component: IndexComponent,
  loaderDeps: ({ search: { page } }) => ({ page }),
  loader: ({ deps: { page } }) => fetchPosts(page),
  validateSearch: z.object({
    page: z.number().catch(1),
  }),
})

function IndexComponent() {
  const posts = Route.useLoaderData()
  const { page } = Route.useSearch()

  return (
    <div className='p-4'>
      <div className="flex justify-start pr-5 py-5">
        <div className="flex gap-1 text-xl font-bold">
          {new Array(pages).fill(0).map((_, i) =>
            page === i + 1 ? (
              <div
                key={i}
                className="px-4 py-2 border border-gray-300 rounded bg-indigo-800 text-white">
                {i + 1}
              </div>
            ) : (
              <Link
                key={i}
                from={Route.id}
                search={{
                  page: i + 1,
                }}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-indigo-200"
              >
                {i + 1}
              </Link>
            )
          )}
        </div>
      </div>
      <div>
        { posts.map((post: any) => (
          <div key={post.id} className="p-2">
            <Link
              to="/posts/$postId"
              params={{
                postId: post.id,
              }}
              key={post.id}
            >
              <h3 className="font-bold">{post.id}. {post.title}</h3>
            </Link>
            <p>{post.body}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
