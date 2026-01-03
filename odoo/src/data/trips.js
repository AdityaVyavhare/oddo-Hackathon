// Mock trip data
export const mockTrips = [
  {
    id: '1',
    userId: '1',
    name: 'European Adventure',
    description: 'A wonderful journey through Europe',
    startDate: '2024-06-01',
    endDate: '2024-06-15',
    coverImage: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800',
    cities: [
      {
        cityId: '1',
        name: 'Paris',
        startDate: '2024-06-01',
        endDate: '2024-06-05',
        activities: ['1', '2'],
      },
      {
        cityId: '4',
        name: 'Barcelona',
        startDate: '2024-06-05',
        endDate: '2024-06-10',
        activities: ['7'],
      },
      {
        cityId: '6',
        name: 'London',
        startDate: '2024-06-10',
        endDate: '2024-06-15',
        activities: ['9'],
      },
    ],
    budget: {
      total: 2500,
      transport: 800,
      stay: 1000,
      food: 500,
      activities: 200,
    },
    isPublic: false,
    createdAt: '2024-01-15',
  },
  {
    id: '2',
    userId: '1',
    name: 'Asian Discovery',
    description: 'Exploring Asia',
    startDate: '2024-07-01',
    endDate: '2024-07-20',
    coverImage: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800',
    cities: [
      {
        cityId: '2',
        name: 'Tokyo',
        startDate: '2024-07-01',
        endDate: '2024-07-10',
        activities: ['3', '4'],
      },
      {
        cityId: '5',
        name: 'Bali',
        startDate: '2024-07-10',
        endDate: '2024-07-20',
        activities: ['8'],
      },
    ],
    budget: {
      total: 3000,
      transport: 1200,
      stay: 1200,
      food: 400,
      activities: 200,
    },
    isPublic: true,
    createdAt: '2024-02-01',
  },
];

export const getTripById = (id) => mockTrips.find(t => t.id === id);
export const getTripsByUserId = (userId) => mockTrips.filter(t => t.userId === userId);
export const getPublicTrips = () => mockTrips.filter(t => t.isPublic);


