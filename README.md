# Tanstack Router Posts

Run `npm create @tanstack/router@latest` to create an example project that uses Tanstack Router to render a list of posts from the JSONPlaceholder API.

**Features:**
1. File-based Routing
2. 100% inferred TypeScript support
3. Automatic route prefetching
4. Built-in route loader with SWR caching
5. Deferred data loading with `defer` and `Await`

**Accessing Search Params via `routeOptions.loaderDeps`**

```tsx
// /routes/posts.tsx
export const Route = createFileRoute('/posts')({
  // Use zod to validate and parse the search params
  validateSearch: z.object({
    offset: z.number().int().nonnegative().catch(0),
  }),
  // Pass the offset to your loader deps via the loaderDeps function
  loaderDeps: ({ search: { offset } }) => ({ offset }),
  // Use the offset from context in the loader function
  loader: async ({ deps: { offset } }) =>
    fetchPosts({
      offset,
    }),
})
```

**Deferred data loading**

```tsx
export const Route = createFileRoute('/posts/$postId')({
  loader: async () => {
    // Fetch some slower data, but do not await it
    const slowDataPromise = fetchSlowData()

    // Fetch and await some data that resolves quickly
    const fastData = await fetchFastData()

    return {
      fastData,
      // Wrap the slow promise in `defer()`
      deferredSlowData: defer(slowDataPromise),
    }
  },
  component: PostIdComponent,
})

function PostIdComponent() {
  const { deferredSlowData } = Route.useLoaderData()

  return (
    <Await promise={deferredSlowData} fallback={<div>Loading...</div>}>
      {(data) => {
        return <div>{data}</div>
      }}
    </Await>
  )
}
```

**Notes about Data Loading**
- By default, the `staleTime` is set to 0, meaning that the route's data will always be considered stale and will always be reloaded in the background when the route is rematched.
- By default, a previously preloaded route is considered fresh for 30 seconds. This means if a route is preloaded, then preloaded again within 30 seconds, the second preload will be ignored. This prevents unnecessary preloads from happening too frequently. When a route is loaded normally, the standard `staleTime` is used.
- By default, the `gcTime` is set to 30 minutes, meaning that any route data that has not been accessed in 30 minutes will be garbage collected and removed from the cache.
- `router.invalidate()` will force all active routes to reload their loaders immediately and mark every cached route's data as stale.

`staleTime` for navigations is set to 0ms (and 30 seconds for preloads) which means that the route's data will always be considered stale and will always be reloaded in the background when the route is matched and navigated to. This is a good default for most use cases, but you may find that some route data is more static or potentially expensive to load. In these cases, you can use the `staleTime` option to control how long the route's data is considered fresh for navigations.

```tsx
// /routes/posts.tsx
export const Route = createFileRoute('/posts')({
  loader: () => fetchPosts(),
  // Consider the route's data fresh for 10 seconds
  staleTime: 10_000,
})
```

This means that if the user navigates to `/posts` from `/about` within 10 seconds of the last loader result, the route's data will not be reloaded. If the user then navigates to `/posts` from `/about` after 10 seconds, the route's data will be reloaded in the background.

**Preloading** in TanStack Router is a way to load a route before the user actually navigates to it. By default, preloaded data is considered fresh for 30 seconds. Preloading will start after 50ms of the user hovering or touching a `<Link>` component. You can change this delay by setting the `defaultPreloadDelay` option on your router.

- Preloading by **"intent"** works by using hover and touch start events on `<Link>` components to preload the dependencies for the destination route.
- Preloading by **"viewport"** works by using the Intersection Observer API to preload the dependencies for the destination route when the `<Link>` component is in the viewport.
- Preloading by **"render"** works by preloading the dependencies for the destination route as soon as the `<Link>` component is rendered in the DOM.
