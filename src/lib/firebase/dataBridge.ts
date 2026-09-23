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
export async function getSiteSettings(): Promise<SiteSettings> {
  if (isFirebaseConfigured && db) {
    try {
      const snap = await getDoc(doc(db, 'siteSettings', 'main'));
      if (snap.exists()) {
        return snap.data() as SiteSettings;
      }
    } catch (e) {
      console.warn("Failed fetching siteSettings from Firestore, using fallback", e);
    }
  }
  return localSettings;
}

export async function saveSiteSettings(settings: SiteSettings): Promise<boolean> {
  localSettings = { ...settings };
  if (isFirebaseConfigured && db) {
    try {
      await setDoc(doc(db, 'siteSettings', 'main'), settings, { merge: true });
      return true;
    } catch (e) {
      console.error("Failed saving siteSettings to Firestore", e);
      return false;
    }
  }
  return true;
}

// Local Storage Keys
const DESTINATIONS_STORAGE_KEY = 'ne_dhanya_destinations_cache';
const PLACES_STORAGE_KEY = 'ne_dhanya_places_cache';
const PACKAGES_STORAGE_KEY = 'ne_dhanya_packages_cache';
const VEHICLES_STORAGE_KEY = 'ne_dhanya_vehicles_cache';

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

// Helper: Safely save array to localStorage and dispatch event
function saveStoredItems<T>(key: string, items: T[], eventName: string) {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(key, JSON.stringify(items));
      window.dispatchEvent(new Event(eventName));
    } catch (e) {
      console.warn(`Could not write localStorage for ${key}`, e);
    }
  }
}

// DESTINATIONS
export async function getAllDestinations(): Promise<Destination[]> {
  const local = getStoredItems<Destination>(DESTINATIONS_STORAGE_KEY, initialDestinations);

  if (isFirebaseConfigured && db) {
    try {
      const snap = await getDocs(collection(db, 'destinations'));
      if (!snap.empty) {
        const firestoreData = snap.docs.map(d => ({ id: d.id, ...d.data() } as Destination));
        // Merge with local data prioritizing updated items
        const firestoreSlugs = new Set(firestoreData.map(d => d.slug));
        const localOnly = local.filter(d => !firestoreSlugs.has(d.slug));
        const merged = [...localOnly, ...firestoreData];
        saveStoredItems(DESTINATIONS_STORAGE_KEY, merged, 'ne_dhanya_destinations_updated');
        localDestinations = merged;
        return merged;
      }
    } catch (e) {
      console.warn("Failed fetching destinations from Firestore, using local fallback", e);
    }
  }
  localDestinations = local;
  return local;
}

export async function getDestinationBySlug(slug: string): Promise<Destination | null> {
  const dests = await getAllDestinations();
  return dests.find(d => d.slug.toLowerCase() === slug.toLowerCase()) || null;
}

export async function saveDestination(dest: Destination): Promise<boolean> {
  const current = getStoredItems<Destination>(DESTINATIONS_STORAGE_KEY, initialDestinations);
  const idx = current.findIndex(d => d.id === dest.id || d.slug === dest.slug);
  if (idx >= 0) {
    current[idx] = dest;
  } else {
    current.push(dest);
  }
  saveStoredItems(DESTINATIONS_STORAGE_KEY, current, 'ne_dhanya_destinations_updated');
  localDestinations = current;

  if (isFirebaseConfigured && db) {
    try {
      await setDoc(doc(db, 'destinations', dest.slug), dest, { merge: true });
      return true;
    } catch (e) {
      console.error("Failed saving destination to Firestore", e);
      return false;
    }
  }
  return true;
}

export async function deleteDestination(slugOrId: string): Promise<boolean> {
  const current = getStoredItems<Destination>(DESTINATIONS_STORAGE_KEY, initialDestinations).filter(
    d => d.id !== slugOrId && d.slug !== slugOrId
  );
  saveStoredItems(DESTINATIONS_STORAGE_KEY, current, 'ne_dhanya_destinations_updated');
  localDestinations = current;

  if (isFirebaseConfigured && db) {
    try {
      await deleteDoc(doc(db, 'destinations', slugOrId));
    } catch (e) {
      console.error("Failed deleting destination in Firestore", e);
    }
  }
  return true;
}

// TOURIST PLACES
export async function getAllTouristPlaces(): Promise<TouristPlace[]> {
  const local = getStoredItems<TouristPlace>(PLACES_STORAGE_KEY, initialTouristPlaces);

  if (isFirebaseConfigured && db) {
    try {
      const snap = await getDocs(collection(db, 'touristPlaces'));
      if (!snap.empty) {
        const firestoreData = snap.docs.map(d => ({ id: d.id, ...d.data() } as TouristPlace));
        const firestoreIds = new Set(firestoreData.map(p => p.id || `${p.destinationSlug}_${p.slug}`));
        const localOnly = local.filter(p => !firestoreIds.has(p.id) && !firestoreIds.has(`${p.destinationSlug}_${p.slug}`));
        const merged = [...localOnly, ...firestoreData];
        saveStoredItems(PLACES_STORAGE_KEY, merged, 'ne_dhanya_places_updated');
        localPlaces = merged;
        return merged;
      }
    } catch (e) {
      console.warn("Failed fetching tourist places from Firestore, using local fallback", e);
    }
  }
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
  const current = getStoredItems<TouristPlace>(PLACES_STORAGE_KEY, initialTouristPlaces);
  const idx = current.findIndex(p => p.id === place.id || (p.destinationSlug === place.destinationSlug && p.slug === place.slug));
  if (idx >= 0) {
    current[idx] = place;
  } else {
    current.push(place);
  }
  saveStoredItems(PLACES_STORAGE_KEY, current, 'ne_dhanya_places_updated');
  localPlaces = current;

  if (isFirebaseConfigured && db) {
    try {
      const docId = place.id || `${place.destinationSlug}_${place.slug}`;
      await setDoc(doc(db, 'touristPlaces', docId), place, { merge: true });
      return true;
    } catch (e) {
      console.error("Failed saving place to Firestore", e);
      return false;
    }
  }
  return true;
}

export async function deleteTouristPlace(slugOrId: string): Promise<boolean> {
  const current = getStoredItems<TouristPlace>(PLACES_STORAGE_KEY, initialTouristPlaces).filter(
    p => p.id !== slugOrId && p.slug !== slugOrId && `${p.destinationSlug}_${p.slug}` !== slugOrId
  );
  saveStoredItems(PLACES_STORAGE_KEY, current, 'ne_dhanya_places_updated');
  localPlaces = current;

  if (isFirebaseConfigured && db) {
    try {
      await deleteDoc(doc(db, 'touristPlaces', slugOrId));
    } catch (e) {
      console.error("Failed deleting place in Firestore", e);
    }
  }
  return true;
}

// TOUR PACKAGES
export async function getAllPackages(): Promise<TourPackage[]> {
  const local = getStoredItems<TourPackage>(PACKAGES_STORAGE_KEY, initialTourPackages);

  if (isFirebaseConfigured && db) {
    try {
      const snap = await getDocs(collection(db, 'tourPackages'));
      if (!snap.empty) {
        const firestoreData = snap.docs.map(d => ({ id: d.id, ...d.data() } as TourPackage));
        const firestoreSlugs = new Set(firestoreData.map(p => p.slug));
        const localOnly = local.filter(p => !firestoreSlugs.has(p.slug));
        const merged = [...localOnly, ...firestoreData];
        saveStoredItems(PACKAGES_STORAGE_KEY, merged, 'ne_dhanya_packages_updated');
        localPackages = merged;
        return merged;
      }
    } catch (e) {
      console.warn("Failed fetching packages from Firestore, using local fallback", e);
    }
  }
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
  const current = getStoredItems<TourPackage>(PACKAGES_STORAGE_KEY, initialTourPackages);
  const idx = current.findIndex(p => p.id === pkg.id || p.slug === pkg.slug);
  if (idx >= 0) {
    current[idx] = pkg;
  } else {
    current.unshift(pkg);
  }
  saveStoredItems(PACKAGES_STORAGE_KEY, current, 'ne_dhanya_packages_updated');
  localPackages = current;

  if (isFirebaseConfigured && db) {
    try {
      await setDoc(doc(db, 'tourPackages', pkg.slug), pkg, { merge: true });
      return true;
    } catch (e) {
      console.error("Failed saving package to Firestore", e);
      return false;
    }
  }
  return true;
}

export async function deletePackage(slugOrId: string): Promise<boolean> {
  const current = getStoredItems<TourPackage>(PACKAGES_STORAGE_KEY, initialTourPackages).filter(
    p => p.id !== slugOrId && p.slug !== slugOrId
  );
  saveStoredItems(PACKAGES_STORAGE_KEY, current, 'ne_dhanya_packages_updated');
  localPackages = current;

  if (isFirebaseConfigured && db) {
    try {
      await deleteDoc(doc(db, 'tourPackages', slugOrId));
    } catch (e) {
      console.error("Failed deleting package in Firestore", e);
    }
  }
  return true;
}

// VEHICLES
export async function getAllVehicles(): Promise<Vehicle[]> {
  const local = getStoredItems<Vehicle>(VEHICLES_STORAGE_KEY, initialVehicles);

  if (isFirebaseConfigured && db) {
    try {
      const snap = await getDocs(collection(db, 'vehicles'));
      if (!snap.empty) {
        const firestoreData = snap.docs.map(d => ({ id: d.id, ...d.data() } as Vehicle));
        const firestoreSlugs = new Set(firestoreData.map(v => v.slug));
        const localOnly = local.filter(v => !firestoreSlugs.has(v.slug));
        const merged = [...localOnly, ...firestoreData];
        saveStoredItems(VEHICLES_STORAGE_KEY, merged, 'ne_dhanya_vehicles_updated');
        localVehicles = merged;
        return merged;
      }
    } catch (e) {
      console.warn("Failed fetching vehicles from Firestore, using local fallback", e);
    }
  }
  localVehicles = local;
  return local;
}

export async function getVehicleBySlug(slug: string): Promise<Vehicle | null> {
  const vehicles = await getAllVehicles();
  return vehicles.find(v => v.slug.toLowerCase() === slug.toLowerCase()) || null;
}

export async function saveVehicle(vehicle: Vehicle): Promise<boolean> {
  const current = getStoredItems<Vehicle>(VEHICLES_STORAGE_KEY, initialVehicles);
  const idx = current.findIndex(v => v.id === vehicle.id || v.slug === vehicle.slug);
  if (idx >= 0) {
    current[idx] = vehicle;
  } else {
    current.push(vehicle);
  }
  saveStoredItems(VEHICLES_STORAGE_KEY, current, 'ne_dhanya_vehicles_updated');
  localVehicles = current;

  if (isFirebaseConfigured && db) {
    try {
      await setDoc(doc(db, 'vehicles', vehicle.slug), vehicle, { merge: true });
      return true;
    } catch (e) {
      console.error("Failed saving vehicle to Firestore", e);
      return false;
    }
  }
  return true;
}

export async function deleteVehicle(slugOrId: string): Promise<boolean> {
  const current = getStoredItems<Vehicle>(VEHICLES_STORAGE_KEY, initialVehicles).filter(
    v => v.id !== slugOrId && v.slug !== slugOrId
  );
  saveStoredItems(VEHICLES_STORAGE_KEY, current, 'ne_dhanya_vehicles_updated');
  localVehicles = current;

  if (isFirebaseConfigured && db) {
    try {
      await deleteDoc(doc(db, 'vehicles', slugOrId));
    } catch (e) {
      console.error("Failed deleting vehicle in Firestore", e);
    }
  }
  return true;
}

// BLOGS
export async function getAllBlogPosts(): Promise<BlogPost[]> {
  if (isFirebaseConfigured && db) {
    try {
      const snap = await getDocs(collection(db, 'blogs'));
      if (!snap.empty) {
        return snap.docs.map(d => ({ id: d.id, ...d.data() } as BlogPost));
      }
    } catch (e) {
      console.warn("Failed fetching blogs from Firestore, using fallback", e);
    }
  }
  return localBlogs;
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const blogs = await getAllBlogPosts();
  return blogs.find(b => b.slug.toLowerCase() === slug.toLowerCase()) || null;
}

export async function saveBlogPost(post: BlogPost): Promise<boolean> {
  const idx = localBlogs.findIndex(b => b.id === post.id || b.slug === post.slug);
  if (idx >= 0) {
    localBlogs[idx] = post;
  } else {
    localBlogs.push(post);
  }

  if (isFirebaseConfigured && db) {
    try {
      await setDoc(doc(db, 'blogs', post.slug), post, { merge: true });
      return true;
    } catch (e) {
      console.error("Failed saving blog post to Firestore", e);
      return false;
    }
  }
  return true;
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

  if (isFirebaseConfigured && db) {
    try {
      await updateDoc(doc(db, 'enquiries', id), { status });
      return true;
    } catch (e) {
      console.error("Failed updating enquiry status in Firestore", e);
      return false;
    }
  }
  return true;
}

// REVIEWS & TESTIMONIALS
const REVIEWS_STORAGE_KEY = 'ne_dhanya_reviews_cache';

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
    } catch (e) {
      console.warn("Could not save to local reviews cache", e);
    }
  }
}

export async function getAllReviews(): Promise<Review[]> {
  const local = getStoredLocalReviews();

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

        // Merge: Never let older Firestore data overwrite a locally approved review
        const merged = firestoreReviews.map(fr => {
          const localMatch = local.find(lr => lr.id === fr.id);
          if (localMatch && localMatch.status === 'approved' && fr.status !== 'approved') {
            return { ...fr, status: 'approved' as const };
          }
          return fr;
        });

        const firestoreIds = new Set(merged.map(r => r.id));
        const localOnly = local.filter(r => !firestoreIds.has(r.id));
        const finalReviews = [...localOnly, ...merged].filter(r => r && (r.name || r.review));

        saveStoredLocalReviews(finalReviews);
        localReviews = finalReviews;
        return finalReviews;
      }
    } catch (e) {
      console.warn("Failed fetching reviews from Firestore, using persistent local fallback", e);
    }
  }

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
  // 1. Update in local storage immediately
  const current = getStoredLocalReviews();
  const item = current.find(r => r.id === id);
  if (item) {
    item.status = status;
    saveStoredLocalReviews(current);
    localReviews = current;
  }

  // 2. Update in Firestore
  if (isFirebaseConfigured && db) {
    try {
      // First try direct document key update
      await setDoc(doc(db, 'reviews', id), { status }, { merge: true });
    } catch (e) {
      console.warn("Direct doc update failed, trying query by id field", e);
      try {
        const q = query(collection(db, 'reviews'), where('id', '==', id));
        const qSnap = await getDocs(q);
        for (const d of qSnap.docs) {
          await updateDoc(d.ref, { status });
        }
      } catch (err2) {
        console.error("Failed updating review status in Firestore", err2);
      }
    }
  }
  return true;
}

export async function deleteReview(id: string): Promise<boolean> {
  const current = getStoredLocalReviews().filter(r => r.id !== id);
  saveStoredLocalReviews(current);
  localReviews = current;

  if (isFirebaseConfigured && db) {
    try {
      await deleteDoc(doc(db, 'reviews', id));
    } catch (e) {
      console.error("Failed deleting review in Firestore", e);
    }
  }
  return true;
}
