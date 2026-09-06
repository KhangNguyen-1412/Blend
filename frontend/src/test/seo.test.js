import { describe, it, expect, beforeEach } from 'vitest';
import { updateSEO, SEO_CONFIG } from '../utils/seo';

describe('SEO and Structured Data Utility', () => {
  beforeEach(() => {
    document.title = '';
    document.head.innerHTML = '';
  });

  it('sets document title and meta description for home page', () => {
    updateSEO('home');
    expect(document.title).toBe(SEO_CONFIG.pages.home.title);

    const metaDesc = document.querySelector('meta[name="description"]');
    expect(metaDesc).not.toBeNull();
    expect(metaDesc.getAttribute('content')).toBe(SEO_CONFIG.pages.home.description);
  });

  it('sets canonical link correctly with base URL', () => {
    updateSEO('menu');
    const canonicalLink = document.querySelector('link[rel="canonical"]');
    expect(canonicalLink).not.toBeNull();
    expect(canonicalLink.getAttribute('href')).toBe(`${SEO_CONFIG.baseUrl}${SEO_CONFIG.pages.menu.canonical}`);
  });

  it('sets OpenGraph properties correctly', () => {
    updateSEO('story');
    const ogTitle = document.querySelector('meta[property="og:title"]');
    const ogType = document.querySelector('meta[property="og:type"]');
    expect(ogTitle.getAttribute('content')).toBe(SEO_CONFIG.pages.story.title);
    expect(ogType.getAttribute('content')).toBe('website');
  });

  it('sets robots meta to noindex for admin/dashboard pages', () => {
    updateSEO('dashboard');
    const robots = document.querySelector('meta[name="robots"]');
    expect(robots.getAttribute('content')).toBe('noindex, nofollow');
  });
});
