import { services } from '@/lib/site';
import { articles } from '@/lib/content';

const base = 'https://www.esdspvtltd.in';

export default function sitemap() {
  const pages = ['', '/services', '/industries', '/academy', '/incident-response', '/insights', '/resources', '/about', '/careers', '/faq', '/contact', '/privacy-policy', '/terms'];
  return [
    ...pages.map((p) => ({ url: base + p, changeFrequency: 'monthly', priority: p === '' ? 1 : 0.7 })),
    ...services.map((s) => ({ url: `${base}/services/${s.id}`, changeFrequency: 'monthly', priority: 0.8 })),
    ...articles.map((a) => ({ url: `${base}/insights/${a.slug}`, lastModified: a.date, changeFrequency: 'yearly', priority: 0.6 })),
  ];
}
