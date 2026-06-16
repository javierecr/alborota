import { createClient } from '@prismicio/client';
import { seoConfig } from '~~/app/seo/config';
import { routes } from '~~/prismic/routes.js';
import { repositoryName } from '~~/slicemachine.config.json';

interface SitemapEntry {
  loc: string;
  lastmod?: string;
  changefreq: string;
  priority: string;
}

function formatDate(date?: string | null): string | undefined {
  if (!date) return undefined;
  return new Date(date).toISOString().split('T')[0];
}

function buildUrl(path: string): string {
  return path === '/' ? `${seoConfig.siteUrl}/` : `${seoConfig.siteUrl}${path}`;
}

function renderSitemap(entries: SitemapEntry[]): string {
  const urls = entries.map((entry) => {
    const lastmod = entry.lastmod ? `\n    <lastmod>${entry.lastmod}</lastmod>` : '';
    return `  <url>\n    <loc>${entry.loc}</loc>${lastmod}\n    <changefreq>${entry.changefreq}</changefreq>\n    <priority>${entry.priority}</priority>\n  </url>`;
  }).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;
}

const staticEntries: SitemapEntry[] = [
  { loc: buildUrl('/'), changefreq: 'weekly', priority: '1.0' },
  { loc: buildUrl('/tienda'), changefreq: 'daily', priority: '0.9' },
  { loc: buildUrl('/nosotros'), changefreq: 'monthly', priority: '0.7' },
  { loc: buildUrl('/cotizar'), changefreq: 'monthly', priority: '0.7' },
  { loc: buildUrl('/galeria'), changefreq: 'weekly', priority: '0.8' },
];

async function loadDynamicEntries(): Promise<SitemapEntry[]> {
  const client = createClient(repositoryName, { routes });
  const [colecciones, productos] = await Promise.all([
    client.getAllByType('coleccion'),
    client.getAllByType('producto'),
  ]);
  return [
    ...colecciones.map(doc => ({
      loc: buildUrl(doc.url ?? `/colecciones/${doc.uid}`),
      lastmod: formatDate(doc.last_publication_date),
      changefreq: 'weekly',
      priority: '0.8',
    })),
    ...productos.map(doc => ({
      loc: buildUrl(doc.url ?? `/productos/${doc.uid}`),
      lastmod: formatDate(doc.last_publication_date),
      changefreq: 'weekly',
      priority: '0.8',
    })),
  ];
}

export default defineCachedEventHandler(
  async (event) => {
    let dynamicEntries: SitemapEntry[] = [];
    try {
      dynamicEntries = await loadDynamicEntries();
    } catch { /* prevent sitemap errors from breaking crawlers */ }

    setHeader(event, 'Content-Type', 'text/xml; charset=utf-8');
    setHeader(event, 'Cache-Control', 'public, max-age=600, s-maxage=600, stale-while-revalidate=86400');
    return renderSitemap([...staticEntries, ...dynamicEntries]);
  },
  { name: 'sitemap-xml', maxAge: 60 * 30, swr: true, staleMaxAge: 60 * 60 * 24, getKey: () => 'default' },
);
