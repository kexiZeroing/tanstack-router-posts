import * as React from 'react'
import { createFileRoute, defer, Await } from '@tanstack/react-router'

interface SearchParams {
  q: string;
}

async function fetchPosts(query: string = "") {
  if (query === "") {
    return [];
  }

  const r = await fetch(
    `https://jsonplaceholder.typicode.com/posts?title_like=${query}`
  );
  return await r.json();
}

async function fetchPostComments(id: string) {
  const r = await fetch(
    `https://jsonplaceholder.typicode.com/posts/${id}/comments`
  );
  return await r.json();
}

export const Route = createFileRoute('/search/')({
  component: SearchRoute,
  loaderDeps: ({ search: { q } }) => ({ q }),
  loader: async ({ deps: { q } }) => {
    const posts = await fetchPosts(q);
    return {
      posts,
      firstPostComments: posts?.[0]?.id ? defer(fetchPostComments(posts[0].id)) : null,
    };
  },
  validateSearch: (search: { q: string }): SearchParams => {
    return {
      q: (search.q as string) || "",
    };
  },
})

function SearchRoute() {
  const { posts, firstPostComments } = Route.useLoaderData();

  return (
    <>
      {firstPostComments && (
        <div className="my-5 p-4">
          <React.Suspense fallback={<div>Loading...</div>}>
            <Await promise={firstPostComments}>
              {(comments) => (
                <div>
                  <h2 className="font-bold border-b">Post {posts[0].id}'s Comments</h2>
                  <ul>
                    {comments.map((comment: any) => (
                      <li key={comment.id} className='my-2 p-2'>
                        <h3>{comment.id}: {comment.name}</h3>
                        <p>{comment.email}</p>
                        <p>{comment.body}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </Await>
          </React.Suspense>
        </div>
      )}

      <div className='p-4'>
        <h2 className='font-bold border-b'>Search Results</h2>

        { posts.map((post: any) => (
          <div key={post.id} className="p-2">
            <h3 className="font-bold">{post.id}. {post.title}</h3>
            <p>{post.body}</p>
          </div>
        )) }      
      </div>
    </>
  );
}
