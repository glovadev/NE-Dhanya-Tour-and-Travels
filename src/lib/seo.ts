import { Destination, TouristPlace, TourPackage, BlogPost, FAQItem, SiteSettings } from '@/types';

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://nedhanyatours.com';

export function getTravelAgencySchema(settings: SiteSettings) {
  return {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    "@id": `${SITE_URL}/#organization`,
    "name": settings.businessName,
    "url": SITE_URL,
    "logo": "https://res.cloudinary.com/bpi3s64e/image/upload/v1790142056/ne_dhaniya_tours/logo-new.png",
    "image": settings.defaultOgImage,
    "description": settings.defaultMetaDescription,
    "telephone": settings.phoneNumber,
    "priceRange": "$$",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Guwahati",
      "addressRegion": "Assam",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 26.1445,
      "longitude": 91.7362
    },
    "areaServed": [
      "Assam",
      "Meghalaya",
      "Arunachal Pradesh",
      "Nagaland",
      "Sikkim",
      "Mizoram",
      "Tripura",
      "Bhutan"
    ],
    "openingHours": "Mo-Su 07:00-22:00"
  };
}

export function getTouristDestinationSchema(dest: Destination) {
  return {
    "@context": "https://schema.org",
    "@type": "TouristDestination",
    "name": dest.name,
    "description": dest.shortDescription,
    "url": `${SITE_URL}/destinations/${dest.slug}`,
    "image": dest.heroImage,
    "touristType": [
      "Adventure",
      "Nature",
      "Family",
      "Honeymoon",
      "Cultural"
    ]
  };
}

export function getTouristAttractionSchema(place: TouristPlace) {
  return {
    "@context": "https://schema.org",
    "@type": "TouristAttraction",
    "name": place.name,
    "description": place.shortDescription,
    "url": `${SITE_URL}/destinations/${place.destinationSlug}/${place.slug}`,
    "image": place.heroImage,
    "isAccessibleForFree": true,
    "publicAccess": true
  };
}

export function getBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url.startsWith('http') ? item.url : `${SITE_URL}${item.url}`
    }))
  };
}

export function getFaqSchema(faqs: FAQItem[]) {
  if (!faqs || faqs.length === 0) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(f => ({
      "@type": "Question",
      "name": f.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": f.answer
      }
    }))
  };
}

export function getArticleSchema(blog: BlogPost) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": blog.title,
    "description": blog.excerpt,
    "image": [blog.featuredImage],
    "datePublished": blog.publishedAt,
    "dateModified": blog.updatedAt || blog.publishedAt,
    "author": {
      "@type": "Person",
      "name": blog.author
    },
    "publisher": {
      "@type": "Organization",
      "name": "NE Dhanya Tour and Travels",
      "logo": {
        "@type": "ImageObject",
        "url": "https://res.cloudinary.com/bpi3s64e/image/upload/v1790142056/ne_dhaniya_tours/logo-new.png"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${SITE_URL}/blog/${blog.slug}`
    }
  };
}
