const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs } = require('firebase/firestore');
const { loadEnv } = require('./load-env');
loadEnv();

const app = initializeApp({
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
});
const db = getFirestore(app);

async function check() {
  const destSnap = await getDocs(collection(db, 'destinations'));
  console.log('Destinations in Firestore:', destSnap.docs.map(d => d.id));
  const pkgSnap = await getDocs(collection(db, 'tourPackages'));
  console.log('Tour Packages in Firestore:', pkgSnap.docs.map(d => d.id));
  const placeSnap = await getDocs(collection(db, 'touristPlaces'));
  console.log('Tourist Places count in Firestore:', placeSnap.size);
  const vSnap = await getDocs(collection(db, 'vehicles'));
  console.log('Vehicles in Firestore:', vSnap.docs.map(d => d.id));
  const bSnap = await getDocs(collection(db, 'blogs'));
  console.log('Blogs in Firestore:', bSnap.docs.map(d => d.id));
  const rSnap = await getDocs(collection(db, 'reviews'));
  console.log('Reviews in Firestore:', rSnap.size);
  const { doc, getDoc } = require('firebase/firestore');
  const sSnap = await getDoc(doc(db, 'siteSettings', 'main'));
  console.log('SiteSettings exists in Firestore:', sSnap.exists());
  process.exit(0);
}
check().catch(console.error);
