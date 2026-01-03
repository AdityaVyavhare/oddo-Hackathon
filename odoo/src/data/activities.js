// Mock activity data
export const activities = [
  {
    id: '1',
    name: 'Eiffel Tower Visit',
    cityId: '1',
    type: 'Sightseeing',
    duration: 120,
    cost: 25,
    image: 'https://images.unsplash.com/photo-1511739001646-5b0c76349a5e?w=800',
    description: 'Visit the iconic Eiffel Tower and enjoy panoramic views of Paris.',
    rating: 4.8,
  },
  {
    id: '2',
    name: 'Louvre Museum',
    cityId: '1',
    type: 'Museum',
    duration: 180,
    cost: 17,
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800',
    description: 'Explore the world\'s largest art museum and home to the Mona Lisa.',
    rating: 4.9,
  },
  {
    id: '3',
    name: 'Shibuya Crossing',
    cityId: '2',
    type: 'Sightseeing',
    duration: 30,
    cost: 0,
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800',
    description: 'Experience the world\'s busiest pedestrian crossing.',
    rating: 4.5,
  },
  {
    id: '4',
    name: 'Tokyo Skytree',
    cityId: '2',
    type: 'Sightseeing',
    duration: 90,
    cost: 20,
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800',
    description: 'Visit the tallest tower in Japan with stunning city views.',
    rating: 4.7,
  },
  {
    id: '5',
    name: 'Statue of Liberty',
    cityId: '3',
    type: 'Sightseeing',
    duration: 120,
    cost: 24,
    image: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=800',
    description: 'Iconic symbol of freedom and democracy.',
    rating: 4.6,
  },
  {
    id: '6',
    name: 'Central Park Walk',
    cityId: '3',
    type: 'Outdoor',
    duration: 90,
    cost: 0,
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800',
    description: 'Relaxing walk through New York\'s famous park.',
    rating: 4.8,
  },
  {
    id: '7',
    name: 'Sagrada Familia',
    cityId: '4',
    type: 'Sightseeing',
    duration: 120,
    cost: 26,
    image: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=800',
    description: 'Gaudi\'s masterpiece, a stunning basilica in Barcelona.',
    rating: 4.9,
  },
  {
    id: '8',
    name: 'Beach Day',
    cityId: '5',
    type: 'Outdoor',
    duration: 240,
    cost: 10,
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800',
    description: 'Relax on beautiful Bali beaches.',
    rating: 4.7,
  },
  {
    id: '9',
    name: 'Big Ben',
    cityId: '6',
    type: 'Sightseeing',
    duration: 60,
    cost: 0,
    image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800',
    description: 'See London\'s iconic clock tower.',
    rating: 4.6,
  },
  {
    id: '10',
    name: 'Burj Khalifa',
    cityId: '7',
    type: 'Sightseeing',
    duration: 90,
    cost: 35,
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800',
    description: 'Visit the world\'s tallest building.',
    rating: 4.8,
  },
];

export const getActivityById = (id) => activities.find(a => a.id === id);
export const getActivitiesByCity = (cityId) => activities.filter(a => a.cityId === cityId);
export const searchActivities = (query, filters = {}) => {
  let results = activities;
  
  if (query) {
    const lowerQuery = query.toLowerCase();
    results = results.filter(activity => 
      activity.name.toLowerCase().includes(lowerQuery) ||
      activity.description.toLowerCase().includes(lowerQuery)
    );
  }
  
  if (filters.type) {
    results = results.filter(activity => activity.type === filters.type);
  }
  
  if (filters.maxCost !== undefined) {
    results = results.filter(activity => activity.cost <= filters.maxCost);
  }
  
  if (filters.maxDuration !== undefined) {
    results = results.filter(activity => activity.duration <= filters.maxDuration);
  }
  
  return results;
};


