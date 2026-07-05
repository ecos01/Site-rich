import {Link as RRLink, type LinkProps} from 'react-router';
import {forwardRef} from 'react';

// Shim: next/link → React Router Link. Maps next's `href` to RR's `to`, ignores
// next-only props (prefetch). Aliased in vite.config so `import Link from 'next/link'`
// resolves here — no per-file rewrite across the ported components.
type NextLinkProps = Omit<LinkProps, 'to'> & {
  href: LinkProps['to'];
  prefetch?: boolean;
};

const Link = forwardRef<HTMLAnchorElement, NextLinkProps>(function Link(
  {href, prefetch: _prefetch, ...rest},
  ref,
) {
  return <RRLink ref={ref} to={href} {...rest} />;
});

export default Link;
