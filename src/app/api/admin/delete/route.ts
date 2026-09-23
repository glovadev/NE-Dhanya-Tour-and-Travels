import { NextResponse } from 'next/server';
import { db, auth } from '@/lib/firebase/config';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, deleteDoc } from 'firebase/firestore';
import { revalidatePath } from 'next/cache';

async function ensureServerAuth() {
  if (!auth) return;
  if (!auth.currentUser) {
    try {
      await signInWithEmailAndPassword(auth, "admin@nedhanyatours.com", "Admin@123456");
    } catch (e: any) {
      console.warn("Server auth sign in warning:", e?.message);
    }
  }
}

export async function POST(req: Request) {
  try {
    if (!db) {
      return NextResponse.json({ success: false, error: "Firebase DB not configured" }, { status: 500 });
    }

    const { collectionName, docId } = await req.json();
    if (!collectionName || !docId) {
      return NextResponse.json({ success: false, error: "Missing required fields (collectionName, docId)" }, { status: 400 });
    }

    await ensureServerAuth();

    await deleteDoc(doc(db, collectionName, docId));

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
    console.error("API /admin/delete error:", err);
    return NextResponse.json({ success: false, error: err?.message || "Failed to delete document" }, { status: 500 });
  }
}
