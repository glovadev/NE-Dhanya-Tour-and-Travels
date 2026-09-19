export type TravelMode = 'personal' | 'sharing' | 'both';

export type TourType = 
  | 'family' 
  | 'honeymoon' 
  | 'adventure' 
  | 'wildlife' 
  | 'group' 
  | 'budget' 
  | 'luxury';

export interface FAQItem {
  question: string;
  answer: string;
}

export interface HowToReach {
  byAir: string;
  byRail: string;
  byRoad: string;
}

export interface ItineraryDay {
  day: number;
  title: string;
  description: string;
  nightStay?: string;
  mealsIncluded?: string;
}

export interface Destination {
  id: string;
  name: string;
  slug: string;
  state: string;
  shortDescription: string;
  description: string;
  heroImage: string;
  gallery?: string[];
  bestTimeToVisit: string;
  howToReach: HowToReach;
  travelTips: string[];
  popularPlaces: string[];
  faqs: FAQItem[];
  seoTitle: string;
  seoDescription: string;
  ogImage?: string;
  canonicalUrl?: string;
  status: 'published' | 'draft';
  featured?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TouristPlace {
  id: string;
  name: string;
  slug: string;
  destinationSlug: string;
  destinationName: string;
  shortDescription: string;
  description: string;
  heroImage: string;
  gallery?: string[];
  topThingsToDo: string[];
  bestTimeToVisit: string;
  howToReach: HowToReach;
  travelTips: string[];
  faqs: FAQItem[];
  relatedPackages?: string[];
  seoTitle: string;
  seoDescription: string;
  ogImage?: string;
  status: 'published' | 'draft';
  createdAt: string;
  updatedAt: string;
}

export interface TourPackage {
  id: string;
  name: string;
  slug: string;
  destinationSlug: string;
  destinationName: string;
  duration: string;
  tourType: TourType[];
  travelMode: TravelMode;
  shortDescription: string;
  description: string;
  heroImage: string;
  gallery?: string[];
  highlights: string[];
  itinerary: ItineraryDay[];
  inclusions: string[];
  exclusions: string[];
  vehicleOptions: string[];
  hotelOptions: string[];
  faqs: FAQItem[];
  seoTitle: string;
  seoDescription: string;
  ogImage?: string;
  featured: boolean;
  status: 'published' | 'draft';
  createdAt: string;
  updatedAt: string;
}

export interface Vehicle {
  id: string;
  name: string;
  slug: string;
  seatingCapacity: string;
  description: string;
  image: string;
  gallery?: string[];
  idealFor: string;
  comfortLevel?: string;
  luggageCapacity?: string;
  acAvailable?: boolean;
  status: 'active' | 'inactive';
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string; // Markdown or HTML content
  featuredImage: string;
  category: string;
  tags: string[];
  author: string;
  readingTime: string;
  publishedAt: string;
  updatedAt: string;
  status: 'draft' | 'scheduled' | 'published' | 'archived';
  seoTitle: string;
  seoDescription: string;
  canonicalUrl?: string;
  ogImage?: string;
  noIndex?: boolean;
  faqs?: FAQItem[];
  relatedDestinations?: string[];
  relatedPackages?: string[];
  createdAt: string;
}

export interface Enquiry {
  id: string;
  name: string;
  phone: string;
  destination: string;
  travelDate: string;
  travellers: number;
  travelType: 'personal' | 'sharing' | 'not-sure';
  vehiclePreference?: string;
  message?: string;
  sourcePage?: string;
  status: 'new' | 'contacted' | 'follow-up' | 'converted' | 'closed';
  createdAt: string;
}

export interface SiteSettings {
  businessName: string;
  tagline: string;
  whatsappNumber: string;
  phoneNumber: string;
  secondaryPhoneNumber?: string;
  email: string;
  address: string;
  googleMapsUrl?: string;
  businessHours: string;
  socialLinks: {
    facebook?: string;
    instagram?: string;
    youtube?: string;
  };
  defaultMetaTitle: string;
  defaultMetaDescription: string;
  defaultOgImage: string;
  websiteName: string;
}

export type AdminRole = 'super-admin' | 'content-manager' | 'enquiry-manager';

export interface AdminUser {
  id: string;
  email: string;
  displayName: string;
  role: AdminRole;
  createdAt: string;
}

export interface MediaItem {
  id: string;
  url: string;
  filename: string;
  altText: string;
  caption?: string;
  folder?: string;
  uploadedBy?: string;
  createdAt: string;
}

export interface Review {
  id: string;
  name: string;
  location: string;
  avatar?: string;
  rating: number;
  tourName: string;
  travelMode?: string;
  highlight?: string;
  review: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}
