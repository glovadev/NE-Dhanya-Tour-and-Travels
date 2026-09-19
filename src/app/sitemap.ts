import { MetadataRoute } from 'next';
import { 
  getAllDestinations, 
  getAllTouristPlaces, 
  getAllPackages, 
  getAllBlogPosts 
} from '@/lib/firebase/dataBridge';

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://nedhaniyatours.com';

  const [destinations, places, packages, blogs] = await Promise.all([
    getAllDestinations(),
    getAllTouristPlaces(),
    getAllPackages(),
    getAllBlogPosts()
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${siteUrl}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${siteUrl}/destinations`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${siteUrl}/tour-packages`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${siteUrl}/car-rental`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${siteUrl}/hotel-booking`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${siteUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${siteUrl}/about-us`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${siteUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ];

  // Destination state routes
  const destinationRoutes: MetadataRoute.Sitemap = destinations.map((d) => ({
    url: `${siteUrl}/destinations/${d.slug}`,
    lastModified: new Date(d.updatedAt || d.createdAt || Date.now()),
    changeFrequency: 'weekly',
    priority: 0.85,
  }));

  // Tourist place routes
  const placeRoutes: MetadataRoute.Sitemap = places.map((p) => ({
    url: `${siteUrl}/destinations/${p.destinationSlug}/${p.slug}`,
    lastModified: new Date(p.updatedAt || p.createdAt || Date.now()),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // Package routes
  const packageRoutes: MetadataRoute.Sitemap = packages.map((pkg) => ({
    url: `${siteUrl}/tour-packages/${pkg.slug}`,
    lastModified: new Date(pkg.updatedAt || pkg.createdAt || Date.now()),
    changeFrequency: 'weekly',
    priority: 0.85,
  }));

  // Blog routes
  const blogRoutes: MetadataRoute.Sitemap = blogs.map((b) => ({
    url: `${siteUrl}/blog/${b.slug}`,
    lastModified: new Date(b.updatedAt || b.publishedAt || Date.now()),
    changeFrequency: 'monthly',
    priority: 0.75,
  }));

  return [
    ...staticRoutes,
    ...destinationRoutes,
    ...placeRoutes,
    ...packageRoutes,
    ...blogRoutes,
  ];
}
