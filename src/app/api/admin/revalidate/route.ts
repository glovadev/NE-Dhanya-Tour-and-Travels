import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function POST() {
  try {
    revalidatePath('/', 'layout');
    revalidatePath('/destinations', 'page');
    revalidatePath('/tour-packages', 'page');
    revalidatePath('/car-rental', 'page');
    revalidatePath('/blog', 'page');
    revalidatePath('/hotel-booking', 'page');
    revalidatePath('/contact', 'page');
    revalidatePath('/about-us', 'page');
    return NextResponse.json({ revalidated: true, now: Date.now() });
  } catch (err: any) {
    return NextResponse.json({ revalidated: false, error: err?.message || 'Revalidation failed' }, { status: 500 });
  }
}
