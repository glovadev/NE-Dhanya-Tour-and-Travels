import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { db, auth } from '@/lib/firebase/config';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, writeBatch } from 'firebase/firestore';
import {
  initialSiteSettings,
  initialDestinations,
  initialTouristPlaces,
  initialTourPackages,
  initialVehicles,
  initialBlogPosts,
  initialReviews,
} from '@/data/seedData';

// Helper to replace all image URLs with Cloudinary equivalents
function replaceWithCloudinary<T>(data: T, map: Record<string, string>): T {
  if (typeof data === 'string') {
    if (map[data]) return map[data] as unknown as T;
    // Check without leading slash
    const stripped = data.startsWith('/') ? data.slice(1) : '/' + data;
    if (map[stripped]) return map[stripped] as unknown as T;
    // Check if filename in map matches
    for (const [key, val] of Object.entries(map)) {
      if (data === key || data.endsWith(key)) {
        return val as unknown as T;
      }
    }
    return data;
  }
  if (Array.isArray(data)) {
    return data.map(item => replaceWithCloudinary(item, map)) as unknown as T;
  }
  if (data !== null && typeof data === 'object') {
    const updated: Record<string, any> = {};
    for (const [key, val] of Object.entries(data)) {
      updated[key] = replaceWithCloudinary(val, map);
    }
    return updated as T;
  }
  return data;
}

export async function POST(req: Request) {
  try {
    if (!db || !auth) {
      return NextResponse.json({ error: "Firebase not configured on server." }, { status: 500 });
    }

    // Authenticate with admin credentials to gain write permissions
    try {
      await signInWithEmailAndPassword(auth, "admin@nedhanyatours.com", "Admin@123456");
    } catch (authErr: any) {
      console.error("Firebase auth failed during migration:", authErr);
      return NextResponse.json({ error: "Firebase authentication failed: " + authErr.message }, { status: 401 });
    }

    // Load image map
    const mapPath = path.join(process.cwd(), 'scripts', 'image-map.json');
    let imageMap: Record<string, string> = {};
    if (fs.existsSync(mapPath)) {
      imageMap = JSON.parse(fs.readFileSync(mapPath, 'utf-8'));
    }

    console.log(`Loaded ${Object.keys(imageMap).length} image mappings.`);

    // 1. Migrate Site Settings
    const updatedSettings = replaceWithCloudinary(initialSiteSettings, imageMap);
    await setDoc(doc(db, 'siteSettings', 'main'), updatedSettings, { merge: true });

    // 2. Migrate Destinations
    const updatedDestinations = replaceWithCloudinary(initialDestinations, imageMap);
    for (const dest of updatedDestinations) {
      await setDoc(doc(db, 'destinations', dest.slug), dest, { merge: true });
    }

    // 3. Migrate Tourist Places
    const updatedPlaces = replaceWithCloudinary(initialTouristPlaces, imageMap);
    for (const place of updatedPlaces) {
      const docId = place.id || `${place.destinationSlug}_${place.slug}`;
      await setDoc(doc(db, 'touristPlaces', docId), place, { merge: true });
    }

    // 4. Migrate Tour Packages
    const updatedPackages = replaceWithCloudinary(initialTourPackages, imageMap);
    for (const pkg of updatedPackages) {
      await setDoc(doc(db, 'tourPackages', pkg.slug), pkg, { merge: true });
    }

    // 5. Migrate Vehicles
    const updatedVehicles = replaceWithCloudinary(initialVehicles, imageMap);
    for (const vehicle of updatedVehicles) {
      await setDoc(doc(db, 'vehicles', vehicle.slug), vehicle, { merge: true });
    }

    // 6. Migrate Blog Posts
    const updatedBlogs = replaceWithCloudinary(initialBlogPosts, imageMap);
    for (const blog of updatedBlogs) {
      await setDoc(doc(db, 'blogs', blog.slug), blog, { merge: true });
    }

    // 7. Migrate Reviews
    const updatedReviews = replaceWithCloudinary(initialReviews, imageMap);
    for (const review of updatedReviews) {
      await setDoc(doc(db, 'reviews', review.id), review, { merge: true });
    }

    return NextResponse.json({
      success: true,
      message: "Successfully migrated all data and images to Cloudinary and Firebase Firestore!",
      counts: {
        destinations: updatedDestinations.length,
        places: updatedPlaces.length,
        packages: updatedPackages.length,
        vehicles: updatedVehicles.length,
        blogs: updatedBlogs.length,
        reviews: updatedReviews.length,
        imagesMapped: Object.keys(imageMap).length,
      }
    });
  } catch (error: any) {
    console.error("Migration error:", error);
    return NextResponse.json({ error: error.message || "Failed migration" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  return POST(req);
}
