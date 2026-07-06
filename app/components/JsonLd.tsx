// Renders one or more JSON-LD schemas. An array is wrapped in @graph so it ships as one <script> tag.
export function JsonLd({data}: {data: object | object[]}) {
  const payload = Array.isArray(data)
    ? {
        '@context': 'https://schema.org',
        '@graph': data.map((item) => {
          const {'@context': _context, ...rest} = item as Record<string, unknown>;
          return rest;
        }),
      }
    : data;

  return (
    <script
      type="application/ld+json"
      // Safe: payload is always a developer-built schema object, never raw user input.
      dangerouslySetInnerHTML={{__html: JSON.stringify(payload).replace(/</g, '\\u003c')}}
    />
  );
}
