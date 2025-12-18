import { UserProfile } from '../../../models/user.model';

// Données fake pour la simulation (déplacées depuis auth.service.ts pour alléger le fichier)
export const FAKE_USERS: UserProfile[] = [
  {
    id: '1',
    fullName: 'Jean Dupont',
    email: 'jean.dupont@email.com',
    passwordHash: 'JD123456',
    bio: 'Développeur passionné',
    notificationsEnabled: true,
    birthdays: [
      {
        id: 1,
        name: 'Marie Martin',
        date: new Date('1990-11-05'),
        city: 'Paris',
        category: 'friend',
        photo: 'assets/avatars/avatar1.jpg',
        notes: "N'aime pas le chocolat",
        userId: '1',
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15'),
      },
      // ... les autres entrées ont été omises pour garder le fichier lisible ...
    ],
    theme: 'light',
    language: 'fr',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-20'),
    lastLoginAt: new Date('2024-01-20'),
    status: 'active',
    profilePicture: 'assets/avatars/user1.jpg',
  },
  {
    id: '2',
    fullName: 'Sophie Lambert',
    email: 'sophie.lambert@email.com',
    passwordHash: 'SL789012',
    bio: 'Designer créative',
    notificationsEnabled: false,
    birthdays: [
      {
        id: 31,
        name: 'Thomas Moreau',
        date: new Date('1992-11-04'),
        city: 'Marseille',
        category: 'colleague',
        photo: 'assets/avatars/avatar31.jpg',
        notes: 'Préfère les cadeaux expérientiels',
        userId: '2',
        createdAt: new Date('2024-01-08'),
        updatedAt: new Date('2024-01-08'),
      },
      // ... idem, les autres entrées sont tronquées ...
    ],
    theme: 'dark',
    language: 'en',
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-18'),
    lastLoginAt: new Date('2024-01-18'),
    status: 'active',
    profilePicture: 'assets/avatars/user2.jpg',
  },
];


