import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import Stripe from "stripe";

const db = new Database("flybook.db");

let stripe: Stripe | null = null;
const getStripe = () => {
  if (!stripe && process.env.STRIPE_SECRET_KEY) {
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  }
  return stripe;
};

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    password TEXT,
    name TEXT,
    frequent_flyer_no TEXT,
    saved_payment_methods TEXT
  );

  CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    type TEXT,
    flight_id TEXT,
    from_city TEXT,
    to_city TEXT,
    departure_time TEXT,
    arrival_time TEXT,
    airline TEXT,
    item_id TEXT,
    name TEXT,
    location TEXT,
    image TEXT,
    rating REAL,
    price REAL,
    status TEXT,
    seat TEXT,
    date TEXT,
    FOREIGN KEY(user_id) REFERENCES users(id)
  );

  -- Mock user and bookings for demo
  INSERT OR REPLACE INTO users (id, email, password, name) VALUES (1, 'demo@example.com', 'password', 'Felix');
  
  -- Upcoming Packages
  INSERT OR REPLACE INTO bookings (id, user_id, type, name, location, image, rating, price, status, date) 
  VALUES (1, 1, 'package', 'Italy, Manarola', 'Italy, Manarola', 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=800&q=80', 4.5, 500, 'confirmed', '2026-06-10T10:00:00');
  
  INSERT OR REPLACE INTO bookings (id, user_id, type, name, location, image, rating, price, status, date) 
  VALUES (8, 1, 'package', 'Bali Paradise', 'Indonesia, Bali', 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80', 4.9, 1200, 'confirmed', '2026-09-05T08:00:00');

  INSERT OR REPLACE INTO bookings (id, user_id, type, name, location, image, rating, price, status, date) 
  VALUES (11, 1, 'package', 'Swiss Alps Adventure', 'Switzerland, Zermatt', 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80', 4.8, 2200, 'confirmed', '2027-01-05T10:00:00');

  -- Past Packages
  INSERT OR REPLACE INTO bookings (id, user_id, type, name, location, image, rating, price, status, date) 
  VALUES (2, 1, 'package', 'Germany, Berlin', 'Germany, Berlin', 'https://images.unsplash.com/photo-1560969184-10fe8719e047?auto=format&fit=crop&w=800&q=80', 4.5, 600, 'confirmed', '2025-12-20T09:00:00');

  INSERT OR REPLACE INTO bookings (id, user_id, type, name, location, image, rating, price, status, date) 
  VALUES (12, 1, 'package', 'Santorini Sunset', 'Greece, Santorini', 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=800&q=80', 4.9, 850, 'confirmed', '2025-08-15T10:00:00');

  -- Upcoming Flights
  INSERT OR REPLACE INTO bookings (id, user_id, type, from_city, to_city, airline, price, status, departure_time, date) 
  VALUES (3, 1, 'flight', 'Sylhet', 'Italy', 'Alaska Airlines', 150, 'confirmed', '2026-05-10T07:30:00', '2026-05-10T07:30:00');

  INSERT OR REPLACE INTO bookings (id, user_id, type, from_city, to_city, airline, price, status, departure_time, date) 
  VALUES (7, 1, 'flight', 'New York', 'Tokyo', 'Japan Airlines', 850, 'confirmed', '2026-08-20T14:00:00', '2026-08-20T14:00:00');

  INSERT OR REPLACE INTO bookings (id, user_id, type, from_city, to_city, airline, price, status, departure_time, date) 
  VALUES (9, 1, 'flight', 'Dubai', 'Maldives', 'Emirates', 450, 'confirmed', '2026-11-12T22:00:00', '2026-11-12T22:00:00');

  -- Past Flights
  INSERT OR REPLACE INTO bookings (id, user_id, type, from_city, to_city, airline, price, status, departure_time, date) 
  VALUES (5, 1, 'flight', 'London', 'Paris', 'British Airways', 120, 'confirmed', '2024-01-15T10:00:00', '2024-01-15T10:00:00');

  INSERT OR REPLACE INTO bookings (id, user_id, type, from_city, to_city, airline, price, status, departure_time, date) 
  VALUES (13, 1, 'flight', 'Singapore', 'Sydney', 'Singapore Airlines', 600, 'confirmed', '2025-05-20T23:00:00', '2025-05-20T23:00:00');

  -- Upcoming Hotels
  INSERT OR REPLACE INTO bookings (id, user_id, type, name, location, image, rating, price, status, date) 
  VALUES (4, 1, 'hotel', 'Water Hotel', 'Italy, Manarola', 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80', 4.8, 15.99, 'confirmed', '2026-05-10T14:00:00');

  INSERT OR REPLACE INTO bookings (id, user_id, type, name, location, image, rating, price, status, date) 
  VALUES (10, 1, 'hotel', 'Burj Al Arab', 'UAE, Dubai', 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=800&q=80', 5.0, 1500, 'confirmed', '2026-11-10T12:00:00');

  -- Past Hotels
  INSERT OR REPLACE INTO bookings (id, user_id, type, name, location, image, rating, price, status, date) 
  VALUES (6, 1, 'hotel', 'Parisian Inn', 'France, Paris', 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80', 4.2, 200, 'confirmed', '2024-01-15T15:00:00');

  INSERT OR REPLACE INTO bookings (id, user_id, type, name, location, image, rating, price, status, date) 
  VALUES (14, 1, 'hotel', 'Tokyo Tower View', 'Japan, Tokyo', 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=800&q=80', 4.7, 350, 'confirmed', '2025-10-10T14:00:00');
`);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // OAuth Routes
  app.get("/api/auth/:provider/url", (req, res) => {
    const { provider } = req.params;
    const redirectUri = `${req.protocol}://${req.get('host')}/auth/callback`;
    
    // Mocking the OAuth URL construction
    const authUrl = `https://${provider}.com/oauth/authorize?client_id=MOCK_ID&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=email%20profile`;
    
    res.json({ url: authUrl });
  });

  app.get("/auth/callback", (req, res) => {
    // In a real app, we'd exchange the code for tokens and store the user
    res.send(`
      <html>
        <body>
          <script>
            if (window.opener) {
              window.opener.postMessage({ type: 'OAUTH_AUTH_SUCCESS' }, '*');
              window.close();
            } else {
              window.location.href = '/';
            }
          </script>
          <p>Authentication successful. This window should close automatically.</p>
        </body>
      </html>
    `);
  });

  // Auth Routes
  app.post("/api/auth/signup", (req, res) => {
    const { email, password, name } = req.body;
    try {
      const stmt = db.prepare("INSERT INTO users (email, password, name) VALUES (?, ?, ?)");
      const info = stmt.run(email, password, name);
      const userId = info.lastInsertRowid;
      
      // Seed dummy data for the new user so they see a populated interface
      seedUserBookings(Number(userId));
      
      res.json({ id: userId, email, name });
    } catch (e) {
      res.status(400).json({ error: "Email already exists" });
    }
  });

  function seedUserBookings(userId: number) {
    const bookings = [
      // Upcoming
      { type: 'package', name: 'Italy, Manarola', location: 'Italy, Manarola', image: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=800&q=80', rating: 4.5, price: 500, status: 'confirmed', date: '2026-06-10T10:00:00' },
      { type: 'flight', from_city: 'New York', to_city: 'Tokyo', airline: 'Japan Airlines', price: 850, status: 'confirmed', departure_time: '2026-08-20T14:00:00', date: '2026-08-20T14:00:00' },
      { type: 'hotel', name: 'Burj Al Arab', location: 'UAE, Dubai', image: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=800&q=80', rating: 5.0, price: 1500, status: 'confirmed', date: '2026-11-10T12:00:00' },
      // Past
      { type: 'package', name: 'Germany, Berlin', location: 'Germany, Berlin', image: 'https://images.unsplash.com/photo-1560969184-10fe8719e047?auto=format&fit=crop&w=800&q=80', rating: 4.5, price: 600, status: 'confirmed', date: '2025-12-20T09:00:00' },
      { type: 'flight', from_city: 'London', to_city: 'Paris', airline: 'British Airways', price: 120, status: 'confirmed', departure_time: '2024-01-15T10:00:00', date: '2024-01-15T10:00:00' },
      { type: 'hotel', name: 'Parisian Inn', location: 'France, Paris', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80', rating: 4.2, price: 200, status: 'confirmed', date: '2024-01-15T15:00:00' }
    ];

    const stmt = db.prepare(`
      INSERT INTO bookings (user_id, type, from_city, to_city, airline, name, location, image, rating, price, status, departure_time, date)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const b of bookings) {
      stmt.run(
        userId, 
        b.type, 
        (b as any).from_city || null, 
        (b as any).to_city || null, 
        (b as any).airline || null, 
        (b as any).name || null, 
        (b as any).location || null, 
        (b as any).image || null, 
        (b as any).rating || null, 
        b.price, 
        b.status, 
        (b as any).departure_time || null, 
        b.date
      );
    }
  }

  app.post("/api/auth/login", (req, res) => {
    const { email, password } = req.body;
    const user = db.prepare("SELECT * FROM users WHERE email = ? AND password = ?").get(email, password);
    if (user) {
      res.json(user);
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  });

  // Stripe Routes
  app.post("/api/create-checkout-session", async (req, res) => {
    const { items, successUrl, cancelUrl } = req.body;
    const stripeClient = getStripe();
    
    if (!stripeClient) {
      console.error("Stripe Secret Key is missing in environment variables.");
      return res.status(500).json({ error: "Stripe is not configured. Please set STRIPE_SECRET_KEY in your environment." });
    }

    try {
      console.log("Creating Stripe Checkout Session for items:", items);
      const session = await stripeClient.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: items.map((item: any) => ({
          price_data: {
            currency: 'usd',
            product_data: {
              name: item.name,
              images: item.image ? [item.image] : [],
            },
            unit_amount: Math.round(item.price * 100),
          },
          quantity: 1,
        })),
        mode: 'payment',
        success_url: successUrl,
        cancel_url: cancelUrl,
      });

      console.log("Session created successfully:", session.id);
      res.json({ id: session.id, url: session.url });
    } catch (e: any) {
      console.error("Stripe Session Creation Error:", e.message);
      res.status(400).json({ error: e.message });
    }
  });

  // Location Search Proxy (to avoid potential CORS and keep it clean)
  app.get("/api/locations/search", async (req, res) => {
    const { q, lat, lon } = req.query;
    if (!q) return res.json([]);
    
    try {
      let url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q as string)}&limit=5`;
      
      // Bias results towards user location if provided
      if (lat && lon) {
        url += `&viewbox=${Number(lon)-0.5},${Number(lat)+0.5},${Number(lon)+0.5},${Number(lat)-0.5}&bounded=0`;
      }

      const response = await fetch(url, {
        headers: {
          'User-Agent': 'FlyBook-App'
        }
      });
      const data = await response.json();
      res.json(data);
    } catch (e) {
      res.status(500).json({ error: "Failed to fetch locations" });
    }
  });

  // Booking Routes
  app.get("/api/bookings/:userId", (req, res) => {
    const userId = req.params.userId;
    let bookings = db.prepare("SELECT * FROM bookings WHERE user_id = ?").all(userId);
    
    // If no bookings found for this user, seed them once for the demo
    if (bookings.length === 0) {
      seedUserBookings(Number(userId));
      bookings = db.prepare("SELECT * FROM bookings WHERE user_id = ?").all(userId);
    }
    
    res.json(bookings);
  });

  app.post("/api/bookings", (req, res) => {
    const { user_id, type, flight_id, from_city, to_city, departure_time, arrival_time, airline, item_id, name, location, image, rating, price, status, seat, date } = req.body;
    const stmt = db.prepare(`
      INSERT INTO bookings (user_id, type, flight_id, from_city, to_city, departure_time, arrival_time, airline, item_id, name, location, image, rating, price, status, seat, date)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const info = stmt.run(user_id, type, flight_id, from_city, to_city, departure_time, arrival_time, airline, item_id, name, location, image, rating, price, status || 'confirmed', seat, date);
    res.json({ id: info.lastInsertRowid });
  });

  app.delete("/api/bookings/:id", (req, res) => {
    db.prepare("DELETE FROM bookings WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });

  // Mock Packages Search
  app.get("/api/packages/search", (req, res) => {
    const packages = [
      {
        id: "PKG-1",
        name: "Italy Manarola",
        location: "Italy, Manarola",
        price: 500,
        rating: 4.5,
        image: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=800&q=80",
        images: [
          "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1504150559654-7255e7c51455?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=800&q=80"
        ],
        description: "A wonderful trip to the most beautiful places on earth. Enjoy the sun, the sea and the local culture.",
        included: ["Flight", "Hotel", "Transfer"],
        duration: "3 days 2 nights",
        category: "Beach",
        weKnowWhatYouWant: "This destination is designed for travelers who seek balance — adventure, relaxation, and unforgettable moments all in one place. From breathtaking natural views to rich local culture, every experience here feels carefully crafted just for you.",
        weKnowWhatYouWantSecondary: "Life on land offers plenty of exciting options for explorers, but this destination goes beyond the ordinary. Whether you’re walking along scenic paths, enjoying local cuisine, or simply relaxing under open skies, every moment feels meaningful.",
        highlights: [
          { title: "Detail 1 – Nature & Scenery", description: "Discover stunning landscapes filled with vibrant colors, fresh air, and peaceful surroundings. Perfect for photography, relaxation, and reconnecting with nature." },
          { title: "Detail 2 – Local Experience", description: "Immerse yourself in authentic local culture. Meet friendly people, taste traditional food, and experience daily life the way locals live it." },
          { title: "Detail 3 – Adventure & Comfort", description: "Enjoy exciting activities during the day and comfortable, well-prepared accommodations at night. This trip blends thrill with ease." }
        ],
        sunsetTitle: "🌅 The Best Sunset Ever!",
        sunsetDescription: "As the day comes to an end, the destination reveals its most magical moment. Golden light spreads across the horizon, reflecting on the landscape and creating a peaceful, unforgettable sunset experience.",
        sunsetDescriptionSecondary: "This is the perfect time to relax, take photos, or simply enjoy the view — a moment that stays with you long after the trip ends.",
        sunsetImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80"
      },
      {
        id: "PKG-2",
        name: "Germany Berlin",
        location: "Germany, Berlin",
        price: 600,
        rating: 4.5,
        image: "https://images.unsplash.com/photo-1560969184-10fe8719e047?auto=format&fit=crop&w=800&q=80",
        images: [
          "https://images.unsplash.com/photo-1560969184-10fe8719e047?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1599946347341-6cd48244c123?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1528728329032-2972f65dfb3f?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1559564484-e48b3e040ff4?auto=format&fit=crop&w=800&q=80"
        ],
        description: "Explore the vibrant history and culture of Berlin. From the Brandenburg Gate to the East Side Gallery.",
        included: ["Flight", "Hotel", "Transfer"],
        duration: "3 days 2 nights",
        category: "Forest",
        weKnowWhatYouWant: "Berlin is a city that never sleeps, offering a unique blend of historical significance and modern urban energy. It's perfect for those who want to dive deep into European history while enjoying a cutting-edge art scene.",
        weKnowWhatYouWantSecondary: "From the remnants of the Berlin Wall to the bustling nightlife of Kreuzberg, every corner of this city tells a story of resilience and creativity.",
        highlights: [
          { title: "Detail 1 – Historical Landmarks", description: "Visit the Brandenburg Gate, Reichstag, and Checkpoint Charlie to witness the pivotal moments of the 20th century." },
          { title: "Detail 2 – Urban Art Scene", description: "Explore the East Side Gallery and numerous street art spots that make Berlin a global capital for creative expression." },
          { title: "Detail 3 – Culinary Diversity", description: "From traditional Currywurst to Michelin-starred dining, Berlin's food scene is as diverse as its population." }
        ],
        sunsetTitle: "🌇 Urban Golden Hour",
        sunsetDescription: "Watch the sun set over the Spree river, casting long shadows across the city's iconic skyline and historical monuments.",
        sunsetDescriptionSecondary: "The rooftop bars offer the perfect vantage point to see the city lights begin to twinkle as the day fades.",
        sunsetImage: "https://images.unsplash.com/photo-1560930950-5cc20e80e392?auto=format&fit=crop&w=1200&q=80"
      },
      {
        id: "PKG-3",
        name: "Venice Beach",
        location: "USA, California",
        price: 700,
        rating: 4.5,
        image: "https://images.unsplash.com/photo-1505118380757-91f5f45d8de4?auto=format&fit=crop&w=800&q=80",
        images: [
          "https://images.unsplash.com/photo-1505118380757-91f5f45d8de4?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=800&q=80"
        ],
        description: "Soak up the sun at Venice Beach. Experience the unique boardwalk, street performers, and beautiful sunsets.",
        included: ["Flight", "Hotel", "Transfer"],
        duration: "2 days 3 night",
        category: "Beach",
        weKnowWhatYouWant: "Venice Beach is the epitome of California cool. It's a place where the eccentric meets the athletic, and where every day feels like a festival of human expression.",
        weKnowWhatYouWantSecondary: "Whether you're here for the surf, the skate park, or the famous Muscle Beach, you'll find an energy that is uniquely Southern Californian.",
        highlights: [
          { title: "Detail 1 – The Boardwalk", description: "A world-famous stretch of shops, street performers, and artists that captures the bohemian spirit of Venice." },
          { title: "Detail 2 – Surf & Skate Culture", description: "Watch world-class skaters at the Venice Beach Skatepark or catch a wave at the Breakwater." },
          { title: "Detail 3 – Sunset Sessions", description: "End your day with a drum circle on the sand as the sun dips below the Pacific horizon." }
        ],
        sunsetTitle: "🌊 Pacific Sunset Magic",
        sunsetDescription: "The California sky turns into a canvas of pink and orange as the sun sets over the ocean, creating a silhouette of palm trees against the horizon.",
        sunsetDescriptionSecondary: "It's the quintessential West Coast experience that you'll never forget.",
        sunsetImage: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=1200&q=80"
      },
      {
        id: "PKG-4",
        name: "Barcelona",
        location: "Spain, Barcelona",
        price: 800,
        rating: 4.5,
        image: "https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=800&q=80",
        images: [
          "https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1539186607619-df476afe3ff1?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1523531294919-4bcd7c65e216?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1511527661048-7fe73d85e9a4?auto=format&fit=crop&w=800&q=80"
        ],
        description: "Discover the architectural wonders of Gaudi and the lively atmosphere of Las Ramblas.",
        included: ["Flight", "Hotel", "Transfer"],
        duration: "3 days 2 nights",
        category: "Beach",
        weKnowWhatYouWant: "Barcelona is a Mediterranean masterpiece where Gothic charm meets Modernist genius. It's a city that celebrates life through its food, its art, and its vibrant street culture.",
        weKnowWhatYouWantSecondary: "From the whimsical spires of the Sagrada Familia to the narrow alleys of the Gothic Quarter, Barcelona is a feast for the senses.",
        highlights: [
          { title: "Detail 1 – Gaudi's Legacy", description: "Explore the surreal architecture of Park Güell, Casa Batlló, and the awe-inspiring Sagrada Família." },
          { title: "Detail 2 – Tapas & Gastronomy", description: "Indulge in the local flavors at La Boqueria market and enjoy endless tapas in the El Born district." },
          { title: "Detail 3 – Mediterranean Vibes", description: "Relax at Barceloneta beach or stroll along the palm-lined Passeig de Colom." }
        ],
        sunsetTitle: "🏰 Catalan Sunset Glow",
        sunsetDescription: "Watch the sun set from Bunkers del Carmel, offering a 360-degree view of the city as the Mediterranean Sea glimmers in the distance.",
        sunsetDescriptionSecondary: "The city's architecture takes on a warm, golden hue that is truly breathtaking.",
        sunsetImage: "https://images.unsplash.com/photo-1523531294919-4bcd7c65e216?auto=format&fit=crop&w=1200&q=80"
      },
      {
        id: "PKG-5",
        name: "Paris",
        location: "France, Paris",
        price: 900,
        rating: 4.5,
        image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80",
        images: [
          "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1549144511-f099e773c147?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?auto=format&fit=crop&w=800&q=80"
        ],
        description: "The city of lights awaits. Visit the Eiffel Tower, the Louvre, and enjoy world-class cuisine.",
        included: ["Flight", "Hotel", "Transfer"],
        duration: "3 days 2 nights",
        category: "Forest",
        weKnowWhatYouWant: "Paris is the ultimate destination for romance, art, and elegance. It's a city where every street feels like a movie set and every meal is a celebration of culinary art.",
        weKnowWhatYouWantSecondary: "Whether you're exploring the grand boulevards or the hidden gardens of Montmartre, Paris will capture your heart.",
        highlights: [
          { title: "Detail 1 – Iconic Landmarks", description: "Ascend the Eiffel Tower, visit the Notre-Dame Cathedral, and walk the historic Champs-Élysées." },
          { title: "Detail 2 – Artistic Treasures", description: "Get lost in the Louvre, the world's largest art museum, and admire the Impressionist masterpieces at Musée d'Orsay." },
          { title: "Detail 3 – Café Culture", description: "Experience the quintessential Parisian life by lingering over a café au lait at a sidewalk bistro." }
        ],
        sunsetTitle: "🗼 Parisian Twilight",
        sunsetDescription: "As the sun sets, the Eiffel Tower begins its hourly sparkle, and the city's bridges are illuminated, reflecting in the Seine river.",
        sunsetDescriptionSecondary: "There's a reason they call it the City of Light, and twilight is when it truly shines.",
        sunsetImage: "https://images.unsplash.com/photo-1500313830540-7b6650a74fd0?auto=format&fit=crop&w=1200&q=80"
      },
      {
        id: "PKG-6",
        name: "Swiss Alps",
        location: "Switzerland, Alps",
        price: 1200,
        rating: 4.9,
        image: "https://images.unsplash.com/photo-1531310197839-ccf54634509e?auto=format&fit=crop&w=800&q=80",
        images: [
          "https://images.unsplash.com/photo-1531310197839-ccf54634509e?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80"
        ],
        description: "Experience the majestic beauty of the Swiss Alps. Perfect for skiing and hiking enthusiasts.",
        included: ["Flight", "Resort", "Ski Pass"],
        duration: "5 days 4 nights",
        category: "Mountain",
        weKnowWhatYouWant: "The Swiss Alps offer a pristine escape into nature's most dramatic landscapes. It's a destination for those who seek the thrill of the peaks and the serenity of alpine meadows.",
        weKnowWhatYouWantSecondary: "With world-class resorts and breathtaking vistas at every turn, this is the ultimate mountain retreat.",
        highlights: [
          { title: "Detail 1 – Peak Adventures", description: "Take the Gornergrat Railway for views of the Matterhorn or ski the legendary slopes of Zermatt." },
          { title: "Detail 2 – Alpine Serenity", description: "Hike through wildflower meadows and past crystal-clear glacial lakes in the Lauterbrunnen Valley." },
          { title: "Detail 3 – Swiss Hospitality", description: "Enjoy traditional fondue in a cozy mountain chalet after a day of exploration." }
        ],
        sunsetTitle: "🏔️ Alpenglow Magic",
        sunsetDescription: "Witness the 'Alpenglow' as the setting sun paints the snow-capped peaks in shades of pink and gold.",
        sunsetDescriptionSecondary: "The silence of the mountains at dusk is a spiritual experience unlike any other.",
        sunsetImage: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80"
      },
      {
        id: "PKG-7",
        name: "Amazon Rainforest",
        location: "Brazil, Amazon",
        price: 1500,
        rating: 4.7,
        image: "https://images.unsplash.com/photo-1516939884455-1445c8652f83?auto=format&fit=crop&w=800&q=80",
        images: [
          "https://images.unsplash.com/photo-1516939884455-1445c8652f83?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1581067720543-54876083f633?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80"
        ],
        description: "Deep dive into the heart of the Amazon. Discover unique wildlife and lush greenery.",
        included: ["Flight", "Eco-lodge", "Guided Tour"],
        duration: "7 days 6 nights",
        category: "Forest",
        weKnowWhatYouWant: "The Amazon is the world's most vital ecosystem, a place of immense biodiversity and ancient wisdom. It's for the true adventurer who wants to disconnect and rediscover the natural world.",
        weKnowWhatYouWantSecondary: "Navigate the winding waterways and listen to the symphony of the jungle as you immerse yourself in this green paradise.",
        highlights: [
          { title: "Detail 1 – Wildlife Encounters", description: "Spot pink river dolphins, colorful macaws, and elusive jaguars in their natural habitat." },
          { title: "Detail 2 – River Expeditions", description: "Canoe through flooded forests and visit remote indigenous communities to learn about their way of life." },
          { title: "Detail 3 – Jungle Trekking", description: "Walk beneath the massive canopy and discover the medicinal secrets of the rainforest's plants." }
        ],
        sunsetTitle: "🌿 Jungle Sunset Symphony",
        sunsetDescription: "As the sun sets over the Amazon river, the sky turns deep crimson and the jungle comes alive with the sounds of nocturnal creatures.",
        sunsetDescriptionSecondary: "The reflection of the setting sun on the water is a sight of pure, raw beauty.",
        sunsetImage: "https://images.unsplash.com/photo-1516939884455-1445c8652f83?auto=format&fit=crop&w=1200&q=80"
      },
      {
        id: "PKG-8",
        name: "Great Barrier Reef",
        location: "Australia, Queensland",
        price: 2000,
        rating: 4.8,
        image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80",
        images: [
          "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1582967788606-a171c1080cb0?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1546026423-cc4642628d2b?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=800&q=80"
        ],
        description: "Explore the world's largest coral reef system. A paradise for divers and snorkelers.",
        included: ["Flight", "Resort", "Diving Gear"],
        duration: "6 days 5 nights",
        category: "Submarine",
        weKnowWhatYouWant: "The Great Barrier Reef is a vibrant underwater metropolis, teeming with life and color. It's a destination for those who want to explore the last great wildernesses of our planet.",
        weKnowWhatYouWantSecondary: "From the tiny clownfish to the majestic humpback whales, the reef offers an encounter with nature that is truly humbling.",
        highlights: [
          { title: "Detail 1 – Underwater Wonders", description: "Dive or snorkel among thousands of species of coral and fish in the world's largest reef system." },
          { title: "Detail 2 – Island Hopping", description: "Visit the stunning Whitsunday Islands and walk on the pure white sands of Whitehaven Beach." },
          { title: "Detail 3 – Marine Conservation", description: "Learn about the efforts to protect this fragile ecosystem and how you can contribute to its preservation." }
        ],
        sunsetTitle: "🌅 Coral Sea Sunset",
        sunsetDescription: "Watch the sun set over the turquoise waters of the Coral Sea, casting a warm glow over the islands and the reef.",
        sunsetDescriptionSecondary: "The transition from the vibrant day to the peaceful night on the reef is magical.",
        sunsetImage: "https://images.unsplash.com/photo-1582967788606-a171c1080cb0?auto=format&fit=crop&w=1200&q=80"
      },
      {
        id: "PKG-9",
        name: "Mount Fuji",
        location: "Japan, Shizuoka",
        price: 1100,
        rating: 4.6,
        image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80",
        images: [
          "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1528164344705-47542687000d?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1490806678282-2d4d3f77eead?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=800&q=80"
        ],
        description: "Witness the iconic beauty of Mount Fuji. Enjoy the serene lakes and traditional Japanese culture.",
        included: ["Flight", "Ryokan", "Train Pass"],
        duration: "4 days 3 nights",
        category: "Mountain",
        weKnowWhatYouWant: "Mount Fuji is more than just a mountain; it's a symbol of Japan's spiritual and natural beauty. It's for the traveler who seeks harmony and inspiration in a landscape of perfect symmetry.",
        weKnowWhatYouWantSecondary: "From the cherry blossoms of spring to the snow-capped peak of winter, Fuji is a timeless masterpiece.",
        highlights: [
          { title: "Detail 1 – Iconic Views", description: "Visit Lake Kawaguchi and the Chureito Pagoda for the most famous views of the mountain." },
          { title: "Detail 2 – Cultural Immersion", description: "Stay in a traditional Ryokan, enjoy an Onsen bath, and experience the art of the tea ceremony." },
          { title: "Detail 3 – Spiritual Journey", description: "Explore the ancient shrines at the base of the mountain and learn about its significance in Japanese culture." }
        ],
        sunsetTitle: "🗻 Fuji Five Lakes Sunset",
        sunsetDescription: "Watch as the sun sets behind Mount Fuji, creating a perfect silhouette against a sky of deep purple and orange.",
        sunsetDescriptionSecondary: "The reflection of the mountain in the still waters of the lakes is a moment of pure Zen.",
        sunsetImage: "https://images.unsplash.com/photo-1528164344705-47542687000d?auto=format&fit=crop&w=1200&q=80"
      },
      {
        id: "PKG-10",
        name: "Maldives",
        location: "Maldives, Male",
        price: 2500,
        rating: 5.0,
        image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=800&q=80",
        images: [
          "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1540202404-a2f29036bb57?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1506953823976-52e1fdc0149a?auto=format&fit=crop&w=800&q=80"
        ],
        description: "The ultimate luxury getaway. Stay in overwater villas and enjoy crystal clear waters.",
        included: ["Flight", "Overwater Villa", "All-inclusive"],
        duration: "5 days 4 nights",
        category: "Beach",
        weKnowWhatYouWant: "The Maldives is the definition of paradise on earth. It's for those who want to escape the world and find themselves in a landscape of infinite blue and white sand.",
        weKnowWhatYouWantSecondary: "With unmatched luxury and privacy, every moment in the Maldives feels like a dream come true.",
        highlights: [
          { title: "Detail 1 – Overwater Luxury", description: "Stay in a private villa perched over the turquoise lagoon, with direct access to the ocean." },
          { title: "Detail 2 – Marine Paradise", description: "Snorkel or dive right from your deck and encounter vibrant coral reefs and gentle sea turtles." },
          { title: "Detail 3 – Island Dining", description: "Enjoy romantic dinners on a private sandbank under the stars, with the sound of the waves as your soundtrack." }
        ],
        sunsetTitle: "🏝️ Maldivian Horizon Sunset",
        sunsetDescription: "Experience the most spectacular sunsets in the world, where the sky and the ocean merge in a symphony of colors.",
        sunsetDescriptionSecondary: "It's the perfect end to another day in paradise.",
        sunsetImage: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1200&q=80"
      }
    ];
    res.json(packages);
  });

  // Mock Hotels Search
  app.get("/api/hotels/search", (req, res) => {
    const hotels = [
      {
        id: "HOTEL-1",
        name: "Santorini Resort",
        location: "Greece, Santorini",
        price: 250,
        rating: 4.8,
        image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=800&q=80",
        images: [
          "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1469796466635-455ede028aca?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1515404929826-76fff9fef204?auto=format&fit=crop&w=800&q=80"
        ],
        description: "A luxury resort with stunning views of the Aegean Sea. Perfect for honeymooners and families alike.",
        amenities: ["Pool", "Spa", "Free WiFi", "Breakfast Included"]
      },
      {
        id: "HOTEL-2",
        name: "Alpine Lodge",
        location: "Switzerland, Zermatt",
        price: 180,
        rating: 4.6,
        image: "https://images.unsplash.com/photo-1502784444187-359ac186c5bb?auto=format&fit=crop&w=800&q=80",
        images: [
          "https://images.unsplash.com/photo-1502784444187-359ac186c5bb?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1519904981063-b0144236c28e?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80"
        ],
        description: "Cozy lodge in the heart of the Alps. Enjoy skiing in winter and hiking in summer.",
        amenities: ["Fireplace", "Ski Storage", "Restaurant", "Sauna"]
      },
      {
        id: "HOTEL-3",
        name: "Beachside Villa",
        location: "Maldives, Male",
        price: 450,
        rating: 4.9,
        image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80",
        images: [
          "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1540202404-a2f29036bb57?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1506953823976-52e1fdc0149a?auto=format&fit=crop&w=800&q=80"
        ],
        description: "Experience the ultimate luxury in our overwater villas. Crystal clear waters and private pools.",
        amenities: ["Private Pool", "Beach Access", "All-inclusive", "Butler Service"]
      }
    ];
    res.json(hotels);
  });

  // Mock Flight Search (In a real app, this would call an external API)
  app.get("/api/flights/search", (req, res) => {
    const { from, to, date } = req.query;
    // Mock data generation
    const airlines = ["SkyHigh", "GlobalJet", "Oceanic", "StarFlyer"];
    const flights = Array.from({ length: 20 }).map((_, i) => {
      const depHour = (6 + i) % 24;
      const arrHour = (depHour + 2 + Math.floor(Math.random() * 5)) % 24;
      return {
        id: `FL-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
        airline: airlines[Math.floor(Math.random() * airlines.length)],
        from: from || "London",
        to: to || "New York",
        departure: `${date || "2024-06-15"}T${depHour.toString().padStart(2, '0')}:00:00`,
        arrival: `${date || "2024-06-15"}T${arrHour.toString().padStart(2, '0')}:00:00`,
        price: 299 + Math.floor(Math.random() * 500),
        duration: "7h 30m",
        class: "Economy"
      };
    });
    res.json(flights);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    
    // SPA fallback for development
    app.get("*", (req, res) => {
      vite.transformIndexHtml(req.url, `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Go Travel</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`).then((html) => {
        res.setHeader("Content-Type", "text/html");
        res.end(html);
      });
    });
  } else {
    app.use(express.static(path.join(process.cwd(), "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(process.cwd(), "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
