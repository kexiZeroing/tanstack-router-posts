import * as React from 'react'
import { Link, Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  return (
    <>
      <div className="pl-5 py-2 flex gap-2 text-lg">
        <Link
          to="/"
          search={{ page: 1 }}
          activeProps={{
            className: "font-bold",
          }}
          activeOptions={{
            includeSearch: false,
          }}
        >
          Posts
        </Link>
        <div className="mx-5">|</div>
        <Link
          to="/about"
          activeProps={{
            className: 'font-bold',
          }}
        >
          About
        </Link>
      </div>
      <hr />
      <Outlet />
      <TanStackRouterDevtools position="bottom-right" />
    </>
  )
}
