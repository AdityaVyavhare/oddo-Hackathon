// Mock user data
export const mockUsers = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123', // In real app, this would be hashed
    avatar: null,
    language: 'en',
    createdAt: '2024-01-15',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'password123',
    avatar: null,
    language: 'en',
    createdAt: '2024-01-20',
  },
];

export const getCurrentUser = () => {
  const userId = localStorage.getItem('currentUserId');
  return mockUsers.find(u => u.id === userId) || null;
};

export const authenticateUser = (email, password) => {
  const user = mockUsers.find(u => u.email === email && u.password === password);
  if (user) {
    localStorage.setItem('currentUserId', user.id);
    return user;
  }
  return null;
};

export const logoutUser = () => {
  localStorage.removeItem('currentUserId');
};


