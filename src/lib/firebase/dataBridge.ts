import { 
  Destination, 
  TouristPlace, 
  TourPackage, 
  Vehicle, 
  BlogPost, 
  BlogCategory, 
  SiteSettings, 
  Enquiry,
  Review 
} from '@/types';
import { 
  initialDestinations, 
  initialTouristPlaces, 
  initialVehicles, 
  initialTourPackages, 
  initialBlogPosts, 
  initialBlogCategories, 
  initialSiteSettings,
  initialReviews 
} from '@/data/seedData';
import { db, isFirebaseConfigured } from './config';
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  addDoc, 
  updateDoc,
  deleteDoc, 
  query, 
  where 
} from 'firebase/firestore';

// In-memory / cache fallback store for local dev
let localSettings: SiteSettings = { ...initialSiteSettings };
let localDestinations: Destination[] = [...initialDestinations];
let localPlaces: TouristPlace[] = [...initialTouristPlaces];
let localPackages: TourPackage[] = [...initialTourPackages];
let localVehicles: Vehicle[] = [...initialVehicles];
let localBlogs: BlogPost[] = [...initialBlogPosts];
let localCategories: BlogCategory[] = [...initialBlogCategories];
let localReviews: Review[] = [...initialReviews];
let localEnquiries: Enquiry[] = [
  {
    id: "enq-demo-1",
    name: "Aakash Sharma",
    phone: "+91 98765 43210",
    destination: "Meghalaya",
    travelDate: "2026-10-15",
    travellers: 4,
    travelType: "personal",
    vehiclePreference: "Innova Crysta",
    message: "Looking for 5 days Meghalaya tour for family with elderly parents.",
    sourcePage: "/tour-packages/meghalaya-escape",
    status: "new",
    createdAt: new Date().toISOString(),
  }
];

// SITE SETTINGS
const SETTINGS_STORAGE_KEY = 'ne_dhanya_settings_cache';

export async function getSiteSettings(): Promise<SiteSettings> {
  if (isFirebaseConfigured && db) {
    try {
      const snap = await getDoc(doc(db, 'siteSettings', 'main'));
      if (snap.exists()) {
        const data = snap.data() as SiteSettings;
        setSilentStorage(SETTINGS_STORAGE_KEY, data);
        localSettings = data;
        return data;
      }
    } catch (e) {
      console.warn("Failed fetching siteSettings from Firestore, using fallback", e);
    }
  }
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.companyName) {
          return parsed;
        }
      }
    } catch (e) {}
  }
  return localSettings;
}

export async function saveSiteSettings(settings: SiteSettings): Promise<boolean> {
  const saved = await serverSaveDoc('siteSettings', 'main', settings);
  if (saved) {
    localSettings = { ...settings };
    setSilentStorage(SETTINGS_STORAGE_KEY, settings);
  }
  return saved;
}

// Local Storage Keys
const DESTINATIONS_STORAGE_KEY = 'ne_dhanya_destinations_cache';
const PLACES_STORAGE_KEY = 'ne_dhanya_places_cache';
const PACKAGES_STORAGE_KEY = 'ne_dhanya_packages_cache';
const VEHICLES_STORAGE_KEY = 'ne_dhanya_vehicles_cache';
const BLOGS_STORAGE_KEY = 'ne_dhanya_blogs_cache';
const REVIEWS_STORAGE_KEY = 'ne_dhanya_reviews_cache';

// Helper: Safely get array from localStorage with fallback
function getStoredItems<T>(key: string, fallback: T[]): T[] {
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(key);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn(`Could not read localStorage for ${key}`, e);
    }
  }
  return [...fallback];
}

// Helper: Silently cache items without triggering mutation events or loops
function setSilentStorage<T>(key: string, data: T) {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      // ignore
    }
  }
}

// Helper: Safely save array to localStorage and dispatch mutation event + purge Next.js server cache
function saveStoredItems<T>(key: string, items: T[], eventName: string) {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(key, JSON.stringify(items));
      window.dispatchEvent(new Event(eventName));
      fetch('/api/admin/revalidate', { method: 'POST' }).catch(() => {});
    } catch (e) {
      console.warn(`Could not write localStorage for ${key}`, e);
    }
  }
}

// Helper: Execute document save via authenticated server API route or fallback to direct Firestore
async function serverSaveDoc(collectionName: string, docId: string, data: any): Promise<boolean> {
  if (typeof window !== 'undefined') {
    try {
      const res = await fetch('/api/admin/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ collectionName, docId, data })
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success === true) return true;
      }
    } catch (e) {
      console.warn(`Failed /api/admin/save for ${collectionName}/${docId}`, e);
    }
  }

  // Fallback for SSR or direct Firestore
  if (isFirebaseConfigured && db) {
    try {
      await setDoc(doc(db, collectionName, docId), data, { merge: true });
      return true;
    } catch (e) {
      console.error(`Direct Firestore setDoc failed for ${collectionName}/${docId}:`, e);
      return false;
    }
  }
  return true;
}

// Helper: Execute document delete via authenticated server API route or fallback to direct Firestore
async function serverDeleteDoc(collectionName: string, docId: string): Promise<boolean> {
  if (typeof window !== 'undefined') {
    try {
      const res = await fetch('/api/admin/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ collectionName, docId })
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success === true) return true;
      }
    } catch (e) {
      console.warn(`Failed /api/admin/delete for ${collectionName}/${docId}`, e);
    }
  }

  // Fallback for SSR or direct Firestore
  if (isFirebaseConfigured && db) {
    try {
      await deleteDoc(doc(db, collectionName, docId));
      return true;
    } catch (e) {
      console.error(`Direct Firestore deleteDoc failed for ${collectionName}/${docId}:`, e);
      return false;
    }
  }
  return true;
}

// DESTINATIONS
export async function getAllDestinations(): Promise<Destination[]> {
  if (isFirebaseConfigured && db) {
    try {
      const snap = await getDocs(collection(db, 'destinations'));
      if (!snap.empty) {
        const firestoreData = snap.docs.map(d => ({ id: d.id, ...d.data() } as Destination));
        setSilentStorage(DESTINATIONS_STORAGE_KEY, firestoreData);
        localDestinations = firestoreData;
        return firestoreData;
      }
    } catch (e) {
      console.warn("Failed fetching destinations from Firestore, using local fallback", e);
    }
  }
  const local = getStoredItems<Destination>(DESTINATIONS_STORAGE_KEY, initialDestinations);
  localDestinations = local;
  return local;
}

export async function getDestinationBySlug(slug: string): Promise<Destination | null> {
  const dests = await getAllDestinations();
  return dests.find(d => d.slug.toLowerCase() === slug.toLowerCase()) || null;
}

export async function saveDestination(dest: Destination): Promise<boolean> {
  const docId = dest.slug || dest.id || `dest-${Date.now()}`;
  const saved = await serverSaveDoc('destinations', docId, dest);

  if (saved) {
    const current = getStoredItems<Destination>(DESTINATIONS_STORAGE_KEY, initialDestinations);
    const idx = current.findIndex(d => d.id === dest.id || d.slug === dest.slug);
    if (idx >= 0) {
      current[idx] = dest;
    } else {
      current.push(dest);
    }
    saveStoredItems(DESTINATIONS_STORAGE_KEY, current, 'ne_dhanya_destinations_updated');
    localDestinations = current;
  }
  return saved;
}

export async function deleteDestination(slugOrId: string): Promise<boolean> {
  const deleted = await serverDeleteDoc('destinations', slugOrId);

  const current = getStoredItems<Destination>(DESTINATIONS_STORAGE_KEY, initialDestinations).filter(
    d => d.id !== slugOrId && d.slug !== slugOrId
  );
  saveStoredItems(DESTINATIONS_STORAGE_KEY, current, 'ne_dhanya_destinations_updated');
  localDestinations = current;
  return deleted;
}

// TOURIST PLACES
export async function getAllTouristPlaces(): Promise<TouristPlace[]> {
  if (isFirebaseConfigured && db) {
    try {
      const snap = await getDocs(collection(db, 'touristPlaces'));
      if (!snap.empty) {
        const firestoreData = snap.docs.map(d => ({ id: d.id, ...d.data() } as TouristPlace));
        setSilentStorage(PLACES_STORAGE_KEY, firestoreData);
        localPlaces = firestoreData;
        return firestoreData;
      }
    } catch (e) {
      console.warn("Failed fetching tourist places from Firestore, using local fallback", e);
    }
  }
  const local = getStoredItems<TouristPlace>(PLACES_STORAGE_KEY, initialTouristPlaces);
  localPlaces = local;
  return local;
}

export async function getTouristPlacesByDestination(destSlug: string): Promise<TouristPlace[]> {
  const places = await getAllTouristPlaces();
  return places.filter(p => p.destinationSlug.toLowerCase() === destSlug.toLowerCase());
}

export async function getTouristPlaceBySlug(destSlug: string, placeSlug: string): Promise<TouristPlace | null> {
  const places = await getTouristPlacesByDestination(destSlug);
  return places.find(p => p.slug.toLowerCase() === placeSlug.toLowerCase()) || null;
}

export async function saveTouristPlace(place: TouristPlace): Promise<boolean> {
  const docId = place.id || `${place.destinationSlug}_${place.slug}`;
  const saved = await serverSaveDoc('touristPlaces', docId, place);

  if (saved) {
    const current = getStoredItems<TouristPlace>(PLACES_STORAGE_KEY, initialTouristPlaces);
    const idx = current.findIndex(p => p.id === place.id || (p.destinationSlug === place.destinationSlug && p.slug === place.slug));
    if (idx >= 0) {
      current[idx] = place;
    } else {
      current.push(place);
    }
    saveStoredItems(PLACES_STORAGE_KEY, current, 'ne_dhanya_places_updated');
    localPlaces = current;
  }
  return saved;
}

export async function deleteTouristPlace(slugOrId: string): Promise<boolean> {
  const deleted = await serverDeleteDoc('touristPlaces', slugOrId);

  const current = getStoredItems<TouristPlace>(PLACES_STORAGE_KEY, initialTouristPlaces).filter(
    p => p.id !== slugOrId && p.slug !== slugOrId && `${p.destinationSlug}_${p.slug}` !== slugOrId
  );
  saveStoredItems(PLACES_STORAGE_KEY, current, 'ne_dhanya_places_updated');
  localPlaces = current;
  return deleted;
}

// TOUR PACKAGES
export async function getAllPackages(): Promise<TourPackage[]> {
  if (isFirebaseConfigured && db) {
    try {
      const snap = await getDocs(collection(db, 'tourPackages'));
      if (!snap.empty) {
        const firestoreData = snap.docs.map(d => ({ id: d.id, ...d.data() } as TourPackage));
        setSilentStorage(PACKAGES_STORAGE_KEY, firestoreData);
        localPackages = firestoreData;
        return firestoreData;
      }
    } catch (e) {
      console.warn("Failed fetching packages from Firestore, using local fallback", e);
    }
  }
  const local = getStoredItems<TourPackage>(PACKAGES_STORAGE_KEY, initialTourPackages);
  localPackages = local;
  return local;
}

export async function getPackageBySlug(slug: string): Promise<TourPackage | null> {
  const pkgs = await getAllPackages();
  return pkgs.find(p => p.slug.toLowerCase() === slug.toLowerCase()) || null;
}

export async function getPackagesByDestination(destSlug: string): Promise<TourPackage[]> {
  const pkgs = await getAllPackages();
  return pkgs.filter(p => p.destinationSlug.toLowerCase() === destSlug.toLowerCase());
}

export async function savePackage(pkg: TourPackage): Promise<boolean> {
  const docId = pkg.slug || pkg.id || `pkg-${Date.now()}`;
  const saved = await serverSaveDoc('tourPackages', docId, pkg);

  if (saved) {
    const current = getStoredItems<TourPackage>(PACKAGES_STORAGE_KEY, initialTourPackages);
    const idx = current.findIndex(p => p.id === pkg.id || p.slug === pkg.slug);
    if (idx >= 0) {
      current[idx] = pkg;
    } else {
      current.unshift(pkg);
    }
    saveStoredItems(PACKAGES_STORAGE_KEY, current, 'ne_dhanya_packages_updated');
    localPackages = current;
  }
  return saved;
}

export async function deletePackage(slugOrId: string): Promise<boolean> {
  const deleted = await serverDeleteDoc('tourPackages', slugOrId);

  const current = getStoredItems<TourPackage>(PACKAGES_STORAGE_KEY, initialTourPackages).filter(
    p => p.id !== slugOrId && p.slug !== slugOrId
  );
  saveStoredItems(PACKAGES_STORAGE_KEY, current, 'ne_dhanya_packages_updated');
  localPackages = current;
  return deleted;
}

// VEHICLES
export async function getAllVehicles(): Promise<Vehicle[]> {
  if (isFirebaseConfigured && db) {
    try {
      const snap = await getDocs(collection(db, 'vehicles'));
      if (!snap.empty) {
        const firestoreData = snap.docs.map(d => ({ id: d.id, ...d.data() } as Vehicle));
        setSilentStorage(VEHICLES_STORAGE_KEY, firestoreData);
        localVehicles = firestoreData;
        return firestoreData;
      }
    } catch (e) {
      console.warn("Failed fetching vehicles from Firestore, using local fallback", e);
    }
  }
  const local = getStoredItems<Vehicle>(VEHICLES_STORAGE_KEY, initialVehicles);
  localVehicles = local;
  return local;
}

export async function getVehicleBySlug(slug: string): Promise<Vehicle | null> {
  const vehicles = await getAllVehicles();
  return vehicles.find(v => v.slug.toLowerCase() === slug.toLowerCase()) || null;
}

export async function saveVehicle(vehicle: Vehicle): Promise<boolean> {
  const docId = vehicle.slug || vehicle.id || `veh-${Date.now()}`;
  const saved = await serverSaveDoc('vehicles', docId, vehicle);

  if (saved) {
    const current = getStoredItems<Vehicle>(VEHICLES_STORAGE_KEY, initialVehicles);
    const idx = current.findIndex(v => v.id === vehicle.id || v.slug === vehicle.slug);
    if (idx >= 0) {
      current[idx] = vehicle;
    } else {
      current.push(vehicle);
    }
    saveStoredItems(VEHICLES_STORAGE_KEY, current, 'ne_dhanya_vehicles_updated');
    localVehicles = current;
  }
  return saved;
}

export async function deleteVehicle(slugOrId: string): Promise<boolean> {
  const deleted = await serverDeleteDoc('vehicles', slugOrId);

  const current = getStoredItems<Vehicle>(VEHICLES_STORAGE_KEY, initialVehicles).filter(
    v => v.id !== slugOrId && v.slug !== slugOrId
  );
  saveStoredItems(VEHICLES_STORAGE_KEY, current, 'ne_dhanya_vehicles_updated');
  localVehicles = current;
  return deleted;
}

// BLOGS
export async function getAllBlogPosts(): Promise<BlogPost[]> {
  if (isFirebaseConfigured && db) {
    try {
      const snap = await getDocs(collection(db, 'blogs'));
      if (!snap.empty) {
        const firestoreData = snap.docs.map(d => ({ id: d.id, ...d.data() } as BlogPost));
        setSilentStorage(BLOGS_STORAGE_KEY, firestoreData);
        localBlogs = firestoreData;
        return firestoreData;
      }
    } catch (e) {
      console.warn("Failed fetching blogs from Firestore, using fallback", e);
    }
  }
  const local = getStoredItems<BlogPost>(BLOGS_STORAGE_KEY, initialBlogPosts);
  localBlogs = local;
  return local;
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const blogs = await getAllBlogPosts();
  return blogs.find(b => b.slug.toLowerCase() === slug.toLowerCase()) || null;
}

export async function saveBlogPost(post: BlogPost): Promise<boolean> {
  const docId = post.slug || post.id || `blog-${Date.now()}`;
  const saved = await serverSaveDoc('blogs', docId, post);

  if (saved) {
    const current = getStoredItems<BlogPost>(BLOGS_STORAGE_KEY, initialBlogPosts);
    const idx = current.findIndex(b => b.id === post.id || b.slug === post.slug);
    if (idx >= 0) {
      current[idx] = post;
    } else {
      current.unshift(post);
    }
    saveStoredItems(BLOGS_STORAGE_KEY, current, 'ne_dhanya_blogs_updated');
    localBlogs = current;
  }
  return saved;
}

export async function deleteBlogPost(slugOrId: string): Promise<boolean> {
  const deleted = await serverDeleteDoc('blogs', slugOrId);

  const current = getStoredItems<BlogPost>(BLOGS_STORAGE_KEY, initialBlogPosts).filter(
    b => b.id !== slugOrId && b.slug !== slugOrId
  );
  saveStoredItems(BLOGS_STORAGE_KEY, current, 'ne_dhanya_blogs_updated');
  localBlogs = current;
  return deleted;
}

export async function getAllBlogCategories(): Promise<BlogCategory[]> {
  return localCategories;
}

// ENQUIRIES
export async function getAllEnquiries(): Promise<Enquiry[]> {
  if (isFirebaseConfigured && db) {
    try {
      const snap = await getDocs(collection(db, 'enquiries'));
      if (!snap.empty) {
        return snap.docs.map(d => ({ id: d.id, ...d.data() } as Enquiry));
      }
    } catch (e) {
      console.warn("Failed fetching enquiries from Firestore", e);
    }
  }
  return localEnquiries;
}

export async function submitEnquiry(enquiryData: Omit<Enquiry, 'id' | 'createdAt' | 'status'>): Promise<{ success: boolean; id: string }> {
  const newEnquiry: Enquiry = {
    ...enquiryData,
    id: `enq-${Date.now()}`,
    status: 'new',
    createdAt: new Date().toISOString()
  };

  localEnquiries.unshift(newEnquiry);

  if (isFirebaseConfigured && db) {
    try {
      const docRef = await addDoc(collection(db, 'enquiries'), newEnquiry);
      return { success: true, id: docRef.id };
    } catch (e) {
      console.error("Failed storing enquiry in Firestore", e);
    }
  }
  return { success: true, id: newEnquiry.id };
}

export async function updateEnquiryStatus(id: string, status: Enquiry['status']): Promise<boolean> {
  const item = localEnquiries.find(e => e.id === id);
  if (item) {
    item.status = status;
  }

  const saved = await serverSaveDoc('enquiries', id, { status });
  return saved;
}

// REVIEWS & TESTIMONIALS
function getStoredLocalReviews(): Review[] {
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(REVIEWS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.filter(r => r && (r.name || r.review));
        }
      }
    } catch (e) {
      console.warn("Could not parse local reviews cache", e);
    }
  }
  return [...initialReviews];
}

function saveStoredLocalReviews(reviews: Review[]) {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(reviews));
      window.dispatchEvent(new Event('ne_dhanya_reviews_updated'));
      fetch('/api/admin/revalidate', { method: 'POST' }).catch(() => {});
    } catch (e) {
      console.warn("Could not save to local reviews cache", e);
    }
  }
}

export async function getAllReviews(): Promise<Review[]> {
  if (isFirebaseConfigured && db) {
    try {
      const snap = await getDocs(collection(db, 'reviews'));
      if (!snap.empty) {
        const firestoreReviews = snap.docs
          .map(d => {
            const data = d.data();
            return {
              ...data,
              id: data.id || d.id
            } as Review;
          })
          .filter(r => r && (r.name || r.review));

        setSilentStorage(REVIEWS_STORAGE_KEY, firestoreReviews);
        localReviews = firestoreReviews;
        return firestoreReviews;
      }
    } catch (e) {
      console.warn("Failed fetching reviews from Firestore, using persistent local fallback", e);
    }
  }

  const local = getStoredLocalReviews();
  localReviews = local;
  return local;
}

export async function getApprovedReviews(): Promise<Review[]> {
  const all = await getAllReviews();
  return all.filter(r => r.status === 'approved');
}

export async function submitReview(reviewData: Omit<Review, 'id' | 'createdAt' | 'status'>): Promise<{ success: boolean; id: string }> {
  const newReview: Review = {
    ...reviewData,
    id: `rev-${Date.now()}`,
    status: 'pending',
    createdAt: new Date().toISOString()
  };

  // 1. Save to persistent local storage immediately
  const current = getStoredLocalReviews();
  current.unshift(newReview);
  saveStoredLocalReviews(current);
  localReviews = current;

  // 2. Save to Firestore with explicit document ID so it matches perfectly
  if (isFirebaseConfigured && db) {
    try {
      await setDoc(doc(db, 'reviews', newReview.id), newReview, { merge: true });
      return { success: true, id: newReview.id };
    } catch (e) {
      console.error("Failed storing review in Firestore (saved locally)", e);
    }
  }
  return { success: true, id: newReview.id };
}

export async function updateReviewStatus(id: string, status: Review['status']): Promise<boolean> {
  const current = getStoredLocalReviews();
  const item = current.find(r => r.id === id);
  if (item) {
    item.status = status;
    saveStoredLocalReviews(current);
    localReviews = current;
  }

  const saved = await serverSaveDoc('reviews', id, { status });
  return saved;
}

export async function deleteReview(id: string): Promise<boolean> {
  const deleted = await serverDeleteDoc('reviews', id);

  const current = getStoredLocalReviews().filter(r => r.id !== id);
  saveStoredLocalReviews(current);
  localReviews = current;
  return deleted;
}
