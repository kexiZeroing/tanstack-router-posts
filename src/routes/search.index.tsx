import * as React from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'

interface SearchParams {
  q: string;
}

async function fetchPosts(query: string = "") {
  if (query === "") {
    return [];
  }

  const r = await fetch(
    `https://jsonplaceholder.typicode.com/posts?title_like=^${query}`
  );
  return await r.json();
}

export const Route = createFileRoute('/search/')({
  component: SearchRoute,
  loaderDeps: ({ search: { q } }) => ({ q }),
  loader: ({ deps: { q } }) => fetchPosts(q),
  validateSearch: (search: { q: string }): SearchParams => {
    return {
      q: (search.q as string) || "",
    };
  },
})

function SearchRoute() {
  const posts = Route.useLoaderData();

  return (
    <div className='p-4'>
      <h1 className='font-bold'>Search Results</h1>

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
      )) }      
    </div>
  );
}
