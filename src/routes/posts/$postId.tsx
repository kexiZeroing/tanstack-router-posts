import * as React from 'react'
import { createFileRoute } from '@tanstack/react-router'

function fetchPost(id: string) {
  return fetch(
    `https://jsonplaceholder.typicode.com/posts/${id}`
  ).then((r) => r.json())
}

export const Route = createFileRoute('/posts/$postId')({
  component: PostComponent,
  loader: ({ params: { postId } }) => fetchPost(postId),
})

function PostComponent() {
  const post = Route.useLoaderData()

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">{post.title}</h1>
      <p>{post.body}</p>
    </div>
  )
}
