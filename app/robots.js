export default function robots() {
  return {
    rules: { userAgent: '*', allow: '/', disallow: '/offline' },
    sitemap: 'https://www.esdspvtltd.in/sitemap.xml',
  };
}
