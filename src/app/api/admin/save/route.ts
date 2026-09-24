import { NextResponse } from 'next/server';
import { db, auth } from '@/lib/firebase/config';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { revalidatePath } from 'next/cache';

function cleanUndefined(obj: any): any {
  if (obj === undefined) return null;
  if (obj === null) return null;
  if (Array.isArray(obj)) return obj.map(cleanUndefined);
  if (typeof obj === 'object') {
    const cleaned: Record<string, any> = {};
    for (const [key, value] of Object.entries(obj)) {
      if (value !== undefined) {
        cleaned[key] = cleanUndefined(value);
      }
    }
    return cleaned;
  }
  return obj;
}

async function ensureServerAuth() {
  if (!auth) throw new Error("Firebase Auth is not initialized on server");
  if (!auth.currentUser) {
    await signInWithEmailAndPassword(auth, "admin@nedhanyatours.com", "Admin@123456");
  }
}

export async function POST(req: Request) {
  try {
    if (!db) {
      return NextResponse.json({ success: false, error: "Firebase DB not configured" }, { status: 500 });
    }

    const { collectionName, docId, data } = await req.json();
    if (!collectionName || !docId || !data) {
      return NextResponse.json({ success: false, error: "Missing required fields (collectionName, docId, data)" }, { status: 400 });
    }

    await ensureServerAuth();

    const sanitizedData = cleanUndefined(data);
    await setDoc(doc(db, collectionName, docId), sanitizedData, { merge: true });

    // Invalidate Next.js caches across all public pages
    revalidatePath('/', 'layout');
    revalidatePath('/tour-packages', 'page');
    revalidatePath('/destinations', 'page');
    revalidatePath('/car-rental', 'page');
    revalidatePath('/blog', 'page');
    revalidatePath('/hotel-booking', 'page');
    revalidatePath('/about-us', 'page');
    revalidatePath('/contact', 'page');

    return NextResponse.json({ success: true, docId });
  } catch (err: any) {
    console.error("API /admin/save error:", err);
    return NextResponse.json({ success: false, error: err?.message || "Failed to save document" }, { status: 500 });
  }
}
