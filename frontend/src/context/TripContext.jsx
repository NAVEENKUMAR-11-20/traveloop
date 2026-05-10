import { createContext, useContext, useState, useEffect } from 'react';

const TripContext = createContext(null);

const DEMO_TRIPS = [
  {
    id: 1,
    title: 'Exploring Tokyo',
    description: 'A week-long adventure through the vibrant streets of Tokyo, from ancient temples to futuristic tech districts.',
    destination: 'Tokyo, Japan',
    start_date: '2026-06-15',
    end_date: '2026-06-22',
    cover_image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80',
    budget: 285000,
    spent: 98000,
    status: 'upcoming',
    cities: ['Tokyo', 'Kyoto', 'Osaka'],
    itinerary: [
      { day: 1, date: '2026-06-15', title: 'Arrival & Shibuya', activities: [
        { time: '14:00', name: 'Check in at hotel', cost: 0, type: 'accommodation' },
        { time: '16:00', name: 'Shibuya Crossing & Hachiko', cost: 0, type: 'sightseeing' },
        { time: '19:00', name: 'Dinner at Ichiran Ramen', cost: 1200, type: 'food' },
      ]},
      { day: 2, date: '2026-06-16', title: 'Temples & Gardens', activities: [
        { time: '09:00', name: 'Meiji Shrine', cost: 0, type: 'sightseeing' },
        { time: '12:00', name: 'Harajuku Street Food', cost: 1600, type: 'food' },
        { time: '15:00', name: 'Shinjuku Gyoen Garden', cost: 400, type: 'sightseeing' },
      ]},
      { day: 3, date: '2026-06-17', title: 'Akihabara & Tech', activities: [
        { time: '10:00', name: 'Akihabara Electric Town', cost: 4000, type: 'shopping' },
        { time: '14:00', name: 'TeamLab Borderless', cost: 2400, type: 'entertainment' },
      ]},
    ],
    packing: [
      { id: 1, item: 'Passport', category: 'documents', checked: true },
      { id: 2, item: 'Travel adapter', category: 'electronics', checked: true },
      { id: 3, item: 'Comfortable walking shoes', category: 'clothing', checked: false },
      { id: 4, item: 'Sunscreen', category: 'toiletries', checked: false },
      { id: 5, item: 'Rain jacket', category: 'clothing', checked: false },
      { id: 6, item: 'Paracetamol', category: 'medicines', checked: false },
    ],
    journal: [
      { id: 1, date: '2026-06-15', title: 'First impressions', content: 'Tokyo is absolutely breathtaking. The energy here is unlike anything I\'ve experienced.' },
    ],
  },
  {
    id: 2,
    title: 'Rajasthan Heritage Tour',
    description: 'Discover the royal palaces, desert forts, and vibrant culture of Rajasthan.',
    destination: 'Jaipur, India',
    start_date: '2026-07-10',
    end_date: '2026-07-16',
    cover_image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800&q=80',
    budget: 65000,
    spent: 12000,
    status: 'upcoming',
    cities: ['Jaipur', 'Udaipur', 'Jodhpur'],
    itinerary: [
      { day: 1, date: '2026-07-10', title: 'Arrival & Hawa Mahal', activities: [
        { time: '15:00', name: 'Check in at Heritage Hotel', cost: 0, type: 'accommodation' },
        { time: '17:00', name: 'Hawa Mahal visit', cost: 200, type: 'sightseeing' },
        { time: '20:00', name: 'Dinner at Chokhi Dhani', cost: 1500, type: 'food' },
      ]},
    ],
    packing: [
      { id: 1, item: 'Aadhar Card', category: 'documents', checked: false },
      { id: 2, item: 'Cotton clothes', category: 'clothing', checked: false },
    ],
    journal: [],
  },
  {
    id: 3,
    title: 'Bali Retreat',
    description: 'A wellness and adventure retreat in the tropical paradise of Bali.',
    destination: 'Bali, Indonesia',
    start_date: '2026-08-01',
    end_date: '2026-08-10',
    cover_image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80',
    budget: 220000,
    spent: 0,
    status: 'planning',
    cities: ['Ubud', 'Seminyak', 'Nusa Penida'],
    itinerary: [],
    packing: [],
    journal: [],
  },
  {
    id: 4,
    title: 'Manali Weekend',
    description: 'A quick weekend getaway to the snowy mountains of Himachal.',
    destination: 'Manali, India',
    start_date: '2026-05-01',
    end_date: '2026-05-03',
    cover_image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&q=80',
    budget: 25000,
    spent: 23500,
    status: 'completed',
    cities: ['Manali'],
    itinerary: [
      { day: 1, date: '2026-05-01', title: 'Arrival & Hadimba Temple', activities: [
        { time: '10:00', name: 'Hadimba Temple', cost: 0, type: 'sightseeing' },
        { time: '13:00', name: 'Lunch at Johnson Cafe', cost: 1200, type: 'food' },
        { time: '15:00', name: 'Solang Valley', cost: 2500, type: 'sightseeing' },
        { time: '20:00', name: 'Mall Road walk', cost: 800, type: 'shopping' },
      ]},
    ],
    packing: [],
    journal: [
      { id: 1, date: '2026-05-01', title: 'Mountain magic', content: 'The snow-capped peaks of Manali are mesmerizing. Best weekend trip ever!' },
    ],
  },
];

export function TripProvider({ children }) {
  const [trips, setTrips] = useState(() => {
    const saved = localStorage.getItem('traveloop_trips');
    return saved ? JSON.parse(saved) : DEMO_TRIPS;
  });

  useEffect(() => {
    localStorage.setItem('traveloop_trips', JSON.stringify(trips));
  }, [trips]);

  const addTrip = (trip) => {
    const newTrip = {
      ...trip,
      id: Date.now(),
      spent: 0,
      status: 'planning',
      cities: [],
      itinerary: [],
      packing: [],
      journal: [],
    };
    setTrips(prev => [newTrip, ...prev]);
    return newTrip;
  };

  const updateTrip = (id, updates) => {
    setTrips(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const deleteTrip = (id) => {
    setTrips(prev => prev.filter(t => t.id !== id));
  };

  const getTrip = (id) => trips.find(t => t.id === Number(id));

  const addItineraryDay = (tripId, day) => {
    setTrips(prev => prev.map(t => {
      if (t.id === Number(tripId)) {
        return { ...t, itinerary: [...t.itinerary, day] };
      }
      return t;
    }));
  };

  const updateItinerary = (tripId, itinerary) => {
    setTrips(prev => prev.map(t => {
      if (t.id === Number(tripId)) {
        return { ...t, itinerary };
      }
      return t;
    }));
  };

  const addPackingItem = (tripId, item) => {
    setTrips(prev => prev.map(t => {
      if (t.id === Number(tripId)) {
        return { ...t, packing: [...t.packing, { id: Date.now(), ...item }] };
      }
      return t;
    }));
  };

  const togglePackingItem = (tripId, itemId) => {
    setTrips(prev => prev.map(t => {
      if (t.id === Number(tripId)) {
        return {
          ...t,
          packing: t.packing.map(p => p.id === itemId ? { ...p, checked: !p.checked } : p),
        };
      }
      return t;
    }));
  };

  const removePackingItem = (tripId, itemId) => {
    setTrips(prev => prev.map(t => {
      if (t.id === Number(tripId)) {
        return { ...t, packing: t.packing.filter(p => p.id !== itemId) };
      }
      return t;
    }));
  };

  const resetChecklist = (tripId) => {
    setTrips(prev => prev.map(t => {
      if (t.id === Number(tripId)) {
        return { ...t, packing: t.packing.map(p => ({ ...p, checked: false })) };
      }
      return t;
    }));
  };

  const addJournalEntry = (tripId, entry) => {
    setTrips(prev => prev.map(t => {
      if (t.id === Number(tripId)) {
        return { ...t, journal: [...t.journal, { id: Date.now(), ...entry }] };
      }
      return t;
    }));
  };

  const updateJournalEntry = (tripId, entryId, updates) => {
    setTrips(prev => prev.map(t => {
      if (t.id === Number(tripId)) {
        return { ...t, journal: t.journal.map(j => j.id === entryId ? { ...j, ...updates } : j) };
      }
      return t;
    }));
  };

  const deleteJournalEntry = (tripId, entryId) => {
    setTrips(prev => prev.map(t => {
      if (t.id === Number(tripId)) {
        return { ...t, journal: t.journal.filter(j => j.id !== entryId) };
      }
      return t;
    }));
  };

  return (
    <TripContext.Provider value={{
      trips, addTrip, updateTrip, deleteTrip, getTrip,
      addItineraryDay, updateItinerary,
      addPackingItem, togglePackingItem, removePackingItem, resetChecklist,
      addJournalEntry, updateJournalEntry, deleteJournalEntry,
    }}>
      {children}
    </TripContext.Provider>
  );
}

export const useTrips = () => {
  const ctx = useContext(TripContext);
  if (!ctx) throw new Error('useTrips must be used within TripProvider');
  return ctx;
};
