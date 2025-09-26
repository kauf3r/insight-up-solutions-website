import { useEffect } from 'react';

interface SEOProps {
  title: string;
  description: string;
  ogTitle?: string;
  ogDescription?: string;
}

export function SEO({ title, description, ogTitle, ogDescription }: SEOProps) {
  useEffect(() => {
    // Set document title
    document.title = title;
    
    // Set or update meta description
    let metaDescription = document.querySelector('meta[name="description"]') as HTMLMetaElement;
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.name = 'description';
      document.head.appendChild(metaDescription);
    }
    metaDescription.content = description;
    
    // Set or update Open Graph title
    let ogTitleMeta = document.querySelector('meta[property="og:title"]') as HTMLMetaElement;
    if (!ogTitleMeta) {
      ogTitleMeta = document.createElement('meta');
      ogTitleMeta.setAttribute('property', 'og:title');
      document.head.appendChild(ogTitleMeta);
    }
    ogTitleMeta.content = ogTitle || title;
    
    // Set or update Open Graph description
    let ogDescMeta = document.querySelector('meta[property="og:description"]') as HTMLMetaElement;
    if (!ogDescMeta) {
      ogDescMeta = document.createElement('meta');
      ogDescMeta.setAttribute('property', 'og:description');
      document.head.appendChild(ogDescMeta);
    }
    ogDescMeta.content = ogDescription || description;
    
    // Set Open Graph type
    let ogTypeMeta = document.querySelector('meta[property="og:type"]') as HTMLMetaElement;
    if (!ogTypeMeta) {
      ogTypeMeta = document.createElement('meta');
      ogTypeMeta.setAttribute('property', 'og:type');
      ogTypeMeta.content = 'website';
      document.head.appendChild(ogTypeMeta);
    }
  }, [title, description, ogTitle, ogDescription]);
  
  return null;
}