import { createRootRoute, Link, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'

export const Route = createRootRoute({
  component: () => (
    <section className='w-screen h-screen flex flex-col'>
      <header className='flex items-center justify-center p-4'>
        <h1 className='font-bold text-3xl'>
          COMIC EDITOR!
        </h1>
      </header>
      <main className='flex-grow'>
        <Outlet />
      </main>
      <TanStackRouterDevtools />
    </section>
  ),
})