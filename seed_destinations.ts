import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc } from 'firebase/firestore';
import fs from 'fs';
import { FAMOUS_PLACES } from './src/data/destinations.ts';

const firebaseConfig = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf-8'));

const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

async function seedDestinations() {
  console.log('Starting to seed destinations...');
  
  for (const dest of FAMOUS_PLACES) {
    const destId = dest.place.replace('dest_', '').replace('_place', '');
    
    // Add generic detailed info if missing
    const detailedDest = {
      ...dest,
      highlights: dest.highlights || [
        "Major Landmark Visit – Explore the most iconic site of this location.",
        "Local Culture Experience – Immerse yourself in the traditions and lifestyle of the area.",
        "Scenic Views – Enjoy breathtaking panoramas and photo opportunities."
      ],
      sunsetExperience: dest.sunsetExperience || "Enjoy a peaceful evening as the sun sets over the horizon, painting the sky in vibrant colors.",
      duration: dest.duration || "Full day (approx. 8 hours)",
      meals: dest.meals || "Local lunch included",
      transportation: dest.transportation || "Comfortable air-conditioned transport included",
      weather: dest.weather || "The weather is generally pleasant year-round, but check local forecasts before your trip."
    };

    try {
      await setDoc(doc(db, 'destinations', destId), detailedDest);
      console.log(`Seeded: ${destId}`);
    } catch (error) {
      console.error(`Error seeding ${destId}:`, error);
    }
  }
  
  console.log('Finished seeding destinations.');
}

seedDestinations();
