import * as React from 'react'
import { createFileRoute, useNavigate, Outlet } from '@tanstack/react-router'

interface SearchParams {
  q: string;
}

export const Route = createFileRoute('/search')({
  component: SearchComponent,
  validateSearch: (search: { q: string }): SearchParams => {
    return {
      q: (search.q as string) || "",
    };
  },
})

function SearchComponent() {
  const { q } = Route.useSearch();
  const navigate = useNavigate({ from: Route.id });
  const [newQuery, setNewQuery] = React.useState(q);

  return (
    <div className="p-4">
      <div className="flex gap-2">
        <input
          value={newQuery}
          onChange={(e) => {
            setNewQuery(e.target.value);
          }}
          onKeyUp={(e) => {
            if (e.key === "Enter") {
              navigate({
                search: (old: { q: string }) => ({
                  ...old,
                  q: newQuery,
                }),
              });
            }
          }}
          className="border-2 border-gray-300 rounded-md p-1 text-black"
        />
        <button
          className='bg-indigo-600 text-white p-1 rounded-md'
          onClick={() => {
            navigate({
              search: (old: { q: string }) => ({
                ...old,
                q: newQuery,
              }),
            });
          }}
        >
          Search
        </button>
      </div>
      <Outlet />
    </div>
  );
}
