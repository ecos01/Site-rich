import type {CSSProperties} from 'react';

// Shim: next/image → plain <img>. Covers the props the ported components use
// (src, alt, width, height, fill, className, priority, sizes). Drops next-only
// props (unoptimized, quality, placeholder). `fill` emulates next's absolute fill.
type ImageProps = {
  src: string | {src: string};
  alt: string;
  width?: number | string;
  height?: number | string;
  fill?: boolean;
  className?: string;
  style?: CSSProperties;
  sizes?: string;
  priority?: boolean;
  unoptimized?: boolean;
  loading?: 'eager' | 'lazy';
};

export default function Image({
  src,
  alt,
  width,
  height,
  fill,
  className,
  style,
  sizes,
  priority,
  unoptimized: _unoptimized,
  loading,
}: ImageProps) {
  const url = typeof src === 'string' ? src : src?.src;
  const fillStyle: CSSProperties = fill
    ? {position: 'absolute', inset: 0, width: '100%', height: '100%'}
    : {};
  return (
    <img
      src={url}
      alt={alt}
      width={fill ? undefined : width}
      height={fill ? undefined : height}
      className={className}
      style={{...fillStyle, ...style}}
      sizes={sizes}
      loading={priority ? 'eager' : (loading ?? 'lazy')}
    />
  );
}
