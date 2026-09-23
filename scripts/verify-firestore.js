const { initializeApp } = require('firebase/app');
const { getFirestore, doc, getDoc, collection, getDocs } = require('firebase/firestore');

const { loadEnv } = require('./load-env');
loadEnv();

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function verify() {
  const destSnap = await getDocs(collection(db, 'destinations'));
  console.log('Firestore destinations count:', destSnap.size);
  const placesSnap = await getDocs(collection(db, 'touristPlaces'));
  console.log('Firestore touristPlaces count:', placesSnap.size);
  const pkgSnap = await getDocs(collection(db, 'tourPackages'));
  console.log('Firestore tourPackages count:', pkgSnap.size);
  const vSnap = await getDocs(collection(db, 'vehicles'));
  console.log('Firestore vehicles count:', vSnap.size);

  const sampleDest = destSnap.docs[0].data();
  console.log('Sample destination (id: ' + destSnap.docs[0].id + ') heroImage:', sampleDest.heroImage);

  const samplePlace = placesSnap.docs[0].data();
  console.log('Sample place (id: ' + placesSnap.docs[0].id + ') heroImage:', samplePlace.heroImage);

  const samplePkg = pkgSnap.docs[0].data();
  console.log('Sample package (id: ' + pkgSnap.docs[0].id + ') heroImage:', samplePkg.heroImage);

  const sampleVehicle = vSnap.docs[0].data();
  console.log('Sample vehicle (id: ' + vSnap.docs[0].id + ') image:', sampleVehicle.image);

  process.exit(0);
}

verify().catch(e => {
  console.error("Verification error:", e);
  process.exit(1);
});
