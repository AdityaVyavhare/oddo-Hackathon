// Mock city data
export const cities = [
  {
    id: '1',
    name: 'Paris',
    country: 'France',
    region: 'Europe',
    costIndex: 85,
    popularity: 95,
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800',
    description: 'The City of Light, known for art, fashion, and culture.',
  },
  {
    id: '2',
    name: 'Tokyo',
    country: 'Japan',
    region: 'Asia',
    costIndex: 90,
    popularity: 92,
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800',
    description: 'A vibrant metropolis blending tradition and modernity.',
  },
  {
    id: '3',
    name: 'New York',
    country: 'USA',
    region: 'North America',
    costIndex: 95,
    popularity: 98,
    image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800',
    description: 'The city that never sleeps, full of energy and opportunities.',
  },
  {
    id: '4',
    name: 'Barcelona',
    country: 'Spain',
    region: 'Europe',
    costIndex: 70,
    popularity: 88,
    image: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=800',
    description: 'Beautiful architecture, beaches, and vibrant nightlife.',
  },
  {
    id: '5',
    name: 'Bali',
    country: 'Indonesia',
    region: 'Asia',
    costIndex: 45,
    popularity: 90,
    image: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=800',
    description: 'Tropical paradise with stunning beaches and rich culture.',
  },
  {
    id: '6',
    name: 'London',
    country: 'UK',
    region: 'Europe',
    costIndex: 88,
    popularity: 94,
    image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800',
    description: 'Historic capital with world-class museums and culture.',
  },
  {
    id: '7',
    name: 'Dubai',
    country: 'UAE',
    region: 'Middle East',
    costIndex: 80,
    popularity: 85,
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800',
    description: 'Luxury destination with modern architecture and shopping.',
  },
  {
    id: '8',
    name: 'Sydney',
    country: 'Australia',
    region: 'Oceania',
    costIndex: 82,
    popularity: 87,
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
    description: 'Stunning harbor city with beautiful beaches and landmarks.',
  },
];

export const getCityById = (id) => cities.find(c => c.id === id);
export const searchCities = (query, filters = {}) => {
  let results = cities;
  
  if (query) {
    const lowerQuery = query.toLowerCase();
    results = results.filter(city => 
      city.name.toLowerCase().includes(lowerQuery) ||
      city.country.toLowerCase().includes(lowerQuery)
    );
  }
  
  if (filters.country) {
    results = results.filter(city => city.country === filters.country);
  }
  
  if (filters.region) {
    results = results.filter(city => city.region === filters.region);
  }
  
  return results;
};


