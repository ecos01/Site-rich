import {useLocation} from 'react-router';

// Shim: next/navigation → React Router equivalents.
// redirect: RR's redirect returns a Response to throw (server loaders/actions).
// notFound: throw a 404 Response. usePathname: read RR location.
export {redirect} from 'react-router';

export function notFound(): never {
  throw new Response('Not Found', {status: 404});
}

export function usePathname(): string {
  return useLocation().pathname;
}
