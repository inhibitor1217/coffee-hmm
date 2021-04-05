import { env } from '../../util';

class SitemapService {
  generate(subUrls: string[]): string {
    return this.template(
      [
        this.urlItem(env('BASE_APP_URL')),
        ...subUrls
          .map((subUrl) => this.getUrl(subUrl))
          .map((url) => this.urlItem(url)),
      ].join('')
    );
  }

  private getUrl(subUrl: string): string {
    return `${env('BASE_APP_URL')}${subUrl}`;
  }

  private template(content: string): string {
    return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${content}</urlset>`;
  }

  private urlItem(url: string): string {
    return `<url><loc>${url}</loc><changefreq>daily</changefreq></url>`;
  }
}

export default new SitemapService();
