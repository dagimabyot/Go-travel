import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc } from 'firebase/firestore';
import fs from 'fs';

const firebaseConfig = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf-8'));

const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

const HOTELS = [
  {
    id: 'h_ritz_paris',
    name: 'Ritz Paris',
    destinationId: 'eiffelTower',
    rating: 5,
    price: 1200,
    location: '15 Place Vendôme, 75001 Paris, France',
    city: 'Paris',
    country: 'France',
    contact: '+33 1 43 16 30 30',
    image: 'https://images.unsplash.com/photo-1541971875076-8f970d573be6?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80'
    ],
    amenities: ['Spa', 'Pool', 'Fine Dining', 'Butler Service', 'Free WiFi'],
    highlights: ['Historic luxury', 'Iconic Bar Hemingway', 'Cooking school'],
    description: 'A legendary hotel in the heart of Paris, offering unparalleled luxury and service since 1898.'
  },
  {
    id: 'h_shangri_la_paris',
    name: 'Shangri-La Paris',
    destinationId: 'eiffelTower',
    rating: 5,
    price: 950,
    location: '10 Avenue d\'Iéna, 75116 Paris, France',
    city: 'Paris',
    country: 'France',
    contact: '+33 1 53 67 19 98',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80',
    amenities: ['Eiffel Tower Views', 'Michelin Star Dining', 'Indoor Pool', 'Spa'],
    highlights: ['Former residence of Prince Roland Bonaparte', 'Stunning views', 'Elegant decor'],
    description: 'Experience royal treatment in this former palace with breathtaking views of the Eiffel Tower.'
  },
  {
    id: 'h_hotel_hassler_rome',
    name: 'Hotel Hassler Roma',
    destinationId: 'colosseum',
    rating: 5,
    price: 800,
    location: 'Piazza della Trinità dei Monti, 6, 00187 Roma RM, Italy',
    city: 'Rome',
    country: 'Italy',
    contact: '+39 06 699341',
    image: 'https://images.unsplash.com/photo-1551882547-ff43c63e1c04?auto=format&fit=crop&w=800&q=80',
    amenities: ['Rooftop Terrace', 'Michelin Star Restaurant', 'Spa', 'Fitness Center'],
    highlights: ['Top of the Spanish Steps', 'Panoramic city views', 'Historic elegance'],
    description: 'One of the world\'s most famous hotels, located at the top of the Spanish Steps.'
  },
  {
    id: 'h_hotel_artemide_rome',
    name: 'Hotel Artemide',
    destinationId: 'colosseum',
    rating: 4,
    price: 350,
    location: 'Via Nazionale, 22, 00184 Roma RM, Italy',
    city: 'Rome',
    country: 'Italy',
    contact: '+39 06 489911',
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80',
    amenities: ['Free Minibar', 'Rooftop Bar', 'Spa', 'Breakfast Included'],
    highlights: ['Excellent service', 'Central location', 'Modern amenities'],
    description: 'A charming 4-star hotel offering exceptional hospitality and a central location on Via Nazionale.'
  },
  {
    id: 'h_park_hyatt_tokyo',
    name: 'Park Hyatt Tokyo',
    destinationId: 'mountFuji',
    rating: 5,
    price: 700,
    location: '3-7-1-2 Nishi-Shinjuku, Shinjuku-ku, Tokyo, Japan',
    city: 'Tokyo',
    country: 'Japan',
    contact: '+81 3 5322 1234',
    image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80',
    amenities: ['Skyline Views', 'Indoor Pool', 'Spa', 'Jazz Bar'],
    highlights: ['Lost in Translation filming location', 'Stunning views of Mt. Fuji', 'World-class service'],
    description: 'An oasis of calm high above the bustling streets of Shinjuku, offering breathtaking views.'
  }
];

async function seedHotels() {
  console.log('Starting to seed hotels...');
  
  for (const hotel of HOTELS) {
    try {
      await setDoc(doc(db, 'hotels', hotel.id), hotel);
      console.log(`Seeded: ${hotel.name}`);
    } catch (error) {
      console.error(`Error seeding ${hotel.name}:`, error);
    }
  }
  
  console.log('Finished seeding hotels.');
}

seedHotels();
