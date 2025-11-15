import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, delay, map, tap } from 'rxjs/operators';
import { UserProfile } from '../../../models/user.model';
import { HttpClient } from '@angular/common/http';
import { ApiResponse } from '../../../models/apiResponse.model';
import { AuthResponse } from '../../../models/authResponse.model';
import { LoginRequest } from '../../../models/loginRequest.model';
import { RegisterRequest } from '../../../models/registerRequest.model';

// Données fake pour la simulation
const FAKE_USERS: UserProfile[] = [
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
      {
        id: 2,
        name: 'Pierre Durand',
        date: new Date('1985-11-12'),
        city: 'Lyon',
        category: 'family',
        photo: 'assets/avatars/avatar2.jpg',
        notes: 'Adore les gâteaux au fromage',
        userId: '1',
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-01-10'),
      },
      {
        id: 3,
        name: 'Alice Bernard',
        date: new Date('1992-11-08'),
        city: 'Toulouse',
        category: 'friend',
        photo: 'assets/avatars/avatar3.jpg',
        notes: 'Aime les fleurs',
        userId: '1',
        createdAt: new Date('2024-01-12'),
        updatedAt: new Date('2024-01-12'),
      },
      {
        id: 4,
        name: 'Lucas Petit',
        date: new Date('1988-11-15'),
        city: 'Bordeaux',
        category: 'colleague',
        photo: 'assets/avatars/avatar4.jpg',
        notes: 'Fan de sport',
        userId: '1',
        createdAt: new Date('2024-01-14'),
        updatedAt: new Date('2024-01-14'),
      },
      {
        id: 5,
        name: 'Emma Laurent',
        date: new Date('1995-11-20'),
        city: 'Lille',
        category: 'family',
        photo: 'assets/avatars/avatar5.jpg',
        notes: 'Adore la musique',
        userId: '1',
        createdAt: new Date('2024-01-16'),
        updatedAt: new Date('2024-01-16'),
      },
      {
        id: 6,
        name: 'Hugo Moreau',
        date: new Date('1991-11-25'),
        city: 'Nantes',
        category: 'friend',
        photo: 'assets/avatars/avatar6.jpg',
        notes: 'Collectionne les livres',
        userId: '1',
        createdAt: new Date('2024-01-18'),
        updatedAt: new Date('2024-01-18'),
      },
      {
        id: 7,
        name: 'Chloé Roux',
        date: new Date('1987-11-30'),
        city: 'Strasbourg',
        category: 'colleague',
        photo: 'assets/avatars/avatar7.jpg',
        notes: 'Voyage souvent',
        userId: '1',
        createdAt: new Date('2024-01-20'),
        updatedAt: new Date('2024-01-20'),
      },
      {
        id: 8,
        name: 'Antoine Michel',
        date: new Date('1993-12-02'),
        city: 'Montpellier',
        category: 'friend',
        photo: 'assets/avatars/avatar8.jpg',
        notes: 'Photographe amateur',
        userId: '1',
        createdAt: new Date('2024-01-22'),
        updatedAt: new Date('2024-01-22'),
      },
      {
        id: 9,
        name: 'Léa Fournier',
        date: new Date('1989-12-05'),
        city: 'Rennes',
        category: 'family',
        photo: 'assets/avatars/avatar9.jpg',
        notes: 'Grande cuisinière',
        userId: '1',
        createdAt: new Date('2024-01-24'),
        updatedAt: new Date('2024-01-24'),
      },
      {
        id: 10,
        name: 'Nathan Girard',
        date: new Date('1994-12-08'),
        city: 'Nice',
        category: 'colleague',
        photo: 'assets/avatars/avatar10.jpg',
        notes: 'Fan de cinéma',
        userId: '1',
        createdAt: new Date('2024-01-26'),
        updatedAt: new Date('2024-01-26'),
      },
      {
        id: 11,
        name: 'Manon Leroy',
        date: new Date('1990-12-12'),
        city: 'Toulon',
        category: 'friend',
        photo: 'assets/avatars/avatar11.jpg',
        notes: 'Aime la nature',
        userId: '1',
        createdAt: new Date('2024-01-28'),
        updatedAt: new Date('2024-01-28'),
      },
      {
        id: 12,
        name: 'Théo Blanc',
        date: new Date('1986-12-15'),
        city: 'Grenoble',
        category: 'family',
        photo: 'assets/avatars/avatar12.jpg',
        notes: 'Sportif accompli',
        userId: '1',
        createdAt: new Date('2024-01-30'),
        updatedAt: new Date('2024-01-30'),
      },
      {
        id: 13,
        name: 'Julie Gauthier',
        date: new Date('1992-12-18'),
        city: 'Dijon',
        category: 'colleague',
        photo: 'assets/avatars/avatar13.jpg',
        notes: 'Passionnée de lecture',
        userId: '1',
        createdAt: new Date('2024-02-01'),
        updatedAt: new Date('2024-02-01'),
      },
      {
        id: 14,
        name: 'Mathieu Barbier',
        date: new Date('1988-12-20'),
        city: 'Angers',
        category: 'friend',
        photo: 'assets/avatars/avatar14.jpg',
        notes: 'Musicien talentueux',
        userId: '1',
        createdAt: new Date('2024-02-03'),
        updatedAt: new Date('2024-02-03'),
      },
      {
        id: 15,
        name: 'Camille Roche',
        date: new Date('1995-12-22'),
        city: 'Clermont-Ferrand',
        category: 'family',
        photo: 'assets/avatars/avatar15.jpg',
        notes: 'Artiste peintre',
        userId: '1',
        createdAt: new Date('2024-02-05'),
        updatedAt: new Date('2024-02-05'),
      },
      {
        id: 16,
        name: 'Quentin Henry',
        date: new Date('1991-12-24'),
        city: 'Limoges',
        category: 'colleague',
        photo: 'assets/avatars/avatar16.jpg',
        notes: 'Geek invétéré',
        userId: '1',
        createdAt: new Date('2024-02-07'),
        updatedAt: new Date('2024-02-07'),
      },
      {
        id: 17,
        name: 'Sarah Perrin',
        date: new Date('1987-12-26'),
        city: 'Amiens',
        category: 'friend',
        photo: 'assets/avatars/avatar17.jpg',
        notes: 'Végétarienne',
        userId: '1',
        createdAt: new Date('2024-02-09'),
        updatedAt: new Date('2024-02-09'),
      },
      {
        id: 18,
        name: 'Alexandre Lemoine',
        date: new Date('1993-12-28'),
        city: 'Brest',
        category: 'family',
        photo: 'assets/avatars/avatar18.jpg',
        notes: 'Marin expérimenté',
        userId: '1',
        createdAt: new Date('2024-02-11'),
        updatedAt: new Date('2024-02-11'),
      },
      {
        id: 19,
        name: 'Laura Caron',
        date: new Date('1989-11-03'),
        city: 'Tours',
        category: 'colleague',
        photo: 'assets/avatars/avatar19.jpg',
        notes: 'Danseuse classique',
        userId: '1',
        createdAt: new Date('2024-02-13'),
        updatedAt: new Date('2024-02-13'),
      },
      {
        id: 20,
        name: 'Benjamin Chevalier',
        date: new Date('1994-11-07'),
        city: 'Reims',
        category: 'friend',
        photo: 'assets/avatars/avatar20.jpg',
        notes: 'Sommelier',
        userId: '1',
        createdAt: new Date('2024-02-15'),
        updatedAt: new Date('2024-02-15'),
      },
      {
        id: 21,
        name: 'Elodie Masson',
        date: new Date('1990-11-10'),
        city: 'Le Havre',
        category: 'family',
        photo: 'assets/avatars/avatar21.jpg',
        notes: 'Architecte',
        userId: '1',
        createdAt: new Date('2024-02-17'),
        updatedAt: new Date('2024-02-17'),
      },
      {
        id: 22,
        name: 'Romain Marchand',
        date: new Date('1986-11-14'),
        city: 'Cannes',
        category: 'colleague',
        photo: 'assets/avatars/avatar22.jpg',
        notes: 'Réalisateur',
        userId: '1',
        createdAt: new Date('2024-02-19'),
        updatedAt: new Date('2024-02-19'),
      },
      {
        id: 23,
        name: 'Charlotte Faure',
        date: new Date('1992-11-17'),
        city: 'Saint-Étienne',
        category: 'friend',
        photo: 'assets/avatars/avatar23.jpg',
        notes: 'Infirmière',
        userId: '1',
        createdAt: new Date('2024-02-21'),
        updatedAt: new Date('2024-02-21'),
      },
      {
        id: 24,
        name: 'Thomas Dubois',
        date: new Date('1988-11-22'),
        city: 'Toulon',
        category: 'family',
        photo: 'assets/avatars/avatar24.jpg',
        notes: 'Ingénieur',
        userId: '1',
        createdAt: new Date('2024-02-23'),
        updatedAt: new Date('2024-02-23'),
      },
      {
        id: 25,
        name: 'Pauline Mercier',
        date: new Date('1995-11-27'),
        city: 'Nîmes',
        category: 'colleague',
        photo: 'assets/avatars/avatar25.jpg',
        notes: 'Journaliste',
        userId: '1',
        createdAt: new Date('2024-02-25'),
        updatedAt: new Date('2024-02-25'),
      },
      {
        id: 26,
        name: 'Maxime Riviere',
        date: new Date('1991-12-01'),
        city: 'Avignon',
        category: 'friend',
        photo: 'assets/avatars/avatar26.jpg',
        notes: 'Poète',
        userId: '1',
        createdAt: new Date('2024-02-27'),
        updatedAt: new Date('2024-02-27'),
      },
      {
        id: 27,
        name: 'Céline Denis',
        date: new Date('1987-12-04'),
        city: 'Nancy',
        category: 'family',
        photo: 'assets/avatars/avatar27.jpg',
        notes: 'Professeure',
        userId: '1',
        createdAt: new Date('2024-03-01'),
        updatedAt: new Date('2024-03-01'),
      },
      {
        id: 28,
        name: 'Jérémy Lambert',
        date: new Date('1993-12-07'),
        city: 'Metz',
        category: 'colleague',
        photo: 'assets/avatars/avatar28.jpg',
        notes: 'Commercial',
        userId: '1',
        createdAt: new Date('2024-03-03'),
        updatedAt: new Date('2024-03-03'),
      },
      {
        id: 29,
        name: 'Anaïs Fontaine',
        date: new Date('1989-12-10'),
        city: 'Besançon',
        category: 'friend',
        photo: 'assets/avatars/avatar29.jpg',
        notes: 'Designer',
        userId: '1',
        createdAt: new Date('2024-03-05'),
        updatedAt: new Date('2024-03-05'),
      },
      {
        id: 30,
        name: 'Kevin Roy',
        date: new Date('1994-12-14'),
        city: 'Caen',
        category: 'family',
        photo: 'assets/avatars/avatar30.jpg',
        notes: 'Pâtissier',
        userId: '1',
        createdAt: new Date('2024-03-07'),
        updatedAt: new Date('2024-03-07'),
      },
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
      {
        id: 32,
        name: 'Émilie Renard',
        date: new Date('1987-11-06'),
        city: 'Lyon',
        category: 'friend',
        photo: 'assets/avatars/avatar32.jpg',
        notes: 'Aime le théâtre',
        userId: '2',
        createdAt: new Date('2024-01-09'),
        updatedAt: new Date('2024-01-09'),
      },
      {
        id: 33,
        name: 'David Perrot',
        date: new Date('1993-11-09'),
        city: 'Paris',
        category: 'family',
        photo: 'assets/avatars/avatar33.jpg',
        notes: 'Fan de jeux vidéo',
        userId: '2',
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-01-10'),
      },
      {
        id: 34,
        name: 'Clara Leger',
        date: new Date('1989-11-11'),
        city: 'Bordeaux',
        category: 'colleague',
        photo: 'assets/avatars/avatar34.jpg',
        notes: 'Photographe',
        userId: '2',
        createdAt: new Date('2024-01-11'),
        updatedAt: new Date('2024-01-11'),
      },
      {
        id: 35,
        name: 'Sébastien Guerin',
        date: new Date('1995-11-13'),
        city: 'Toulouse',
        category: 'friend',
        photo: 'assets/avatars/avatar35.jpg',
        notes: 'Sportif',
        userId: '2',
        createdAt: new Date('2024-01-12'),
        updatedAt: new Date('2024-01-12'),
      },
      {
        id: 36,
        name: 'Morgane Bertrand',
        date: new Date('1991-11-16'),
        city: 'Nantes',
        category: 'family',
        photo: 'assets/avatars/avatar36.jpg',
        notes: 'Chef pâtissière',
        userId: '2',
        createdAt: new Date('2024-01-13'),
        updatedAt: new Date('2024-01-13'),
      },
      {
        id: 37,
        name: 'Vincent Noel',
        date: new Date('1987-11-18'),
        city: 'Lille',
        category: 'colleague',
        photo: 'assets/avatars/avatar37.jpg',
        notes: 'Musicien',
        userId: '2',
        createdAt: new Date('2024-01-14'),
        updatedAt: new Date('2024-01-14'),
      },
      {
        id: 38,
        name: 'Océane Meyer',
        date: new Date('1993-11-21'),
        city: 'Strasbourg',
        category: 'friend',
        photo: 'assets/avatars/avatar38.jpg',
        notes: 'Archéologue',
        userId: '2',
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15'),
      },
      {
        id: 39,
        name: 'Nicolas Weber',
        date: new Date('1989-11-23'),
        city: 'Montpellier',
        category: 'family',
        photo: 'assets/avatars/avatar39.jpg',
        notes: 'Médecin',
        userId: '2',
        createdAt: new Date('2024-01-16'),
        updatedAt: new Date('2024-01-16'),
      },
      {
        id: 40,
        name: 'Fiona Dupuis',
        date: new Date('1994-11-26'),
        city: 'Rennes',
        category: 'colleague',
        photo: 'assets/avatars/avatar40.jpg',
        notes: 'Graphiste',
        userId: '2',
        createdAt: new Date('2024-01-17'),
        updatedAt: new Date('2024-01-17'),
      },
      {
        id: 41,
        name: 'Baptiste Colin',
        date: new Date('1990-11-28'),
        city: 'Nice',
        category: 'friend',
        photo: 'assets/avatars/avatar41.jpg',
        notes: 'Surfeur',
        userId: '2',
        createdAt: new Date('2024-01-18'),
        updatedAt: new Date('2024-01-18'),
      },
      {
        id: 42,
        name: 'Lucie Philippe',
        date: new Date('1986-12-03'),
        city: 'Toulon',
        category: 'family',
        photo: 'assets/avatars/avatar42.jpg',
        notes: 'Biologiste',
        userId: '2',
        createdAt: new Date('2024-01-19'),
        updatedAt: new Date('2024-01-19'),
      },
      {
        id: 43,
        name: 'Raphaël Gerard',
        date: new Date('1992-12-06'),
        city: 'Grenoble',
        category: 'colleague',
        photo: 'assets/avatars/avatar43.jpg',
        notes: 'Alpiniste',
        userId: '2',
        createdAt: new Date('2024-01-20'),
        updatedAt: new Date('2024-01-20'),
      },
      {
        id: 44,
        name: 'Zoé Leclercq',
        date: new Date('1988-12-09'),
        city: 'Dijon',
        category: 'friend',
        photo: 'assets/avatars/avatar44.jpg',
        notes: 'Viticultrice',
        userId: '2',
        createdAt: new Date('2024-01-21'),
        updatedAt: new Date('2024-01-21'),
      },
      {
        id: 45,
        name: 'Victor Jacquet',
        date: new Date('1995-12-11'),
        city: 'Angers',
        category: 'family',
        photo: 'assets/avatars/avatar45.jpg',
        notes: 'Ébéniste',
        userId: '2',
        createdAt: new Date('2024-01-22'),
        updatedAt: new Date('2024-01-22'),
      },
      {
        id: 46,
        name: 'Ines Morel',
        date: new Date('1991-12-13'),
        city: 'Clermont-Ferrand',
        category: 'colleague',
        photo: 'assets/avatars/avatar46.jpg',
        notes: 'Volcanologue',
        userId: '2',
        createdAt: new Date('2024-01-23'),
        updatedAt: new Date('2024-01-23'),
      },
      {
        id: 47,
        name: 'Jordan Roussel',
        date: new Date('1987-12-16'),
        city: 'Limoges',
        category: 'friend',
        photo: 'assets/avatars/avatar47.jpg',
        notes: 'Céramiste',
        userId: '2',
        createdAt: new Date('2024-01-24'),
        updatedAt: new Date('2024-01-24'),
      },
      {
        id: 48,
        name: 'Maëva Gilles',
        date: new Date('1993-12-17'),
        city: 'Amiens',
        category: 'family',
        photo: 'assets/avatars/avatar48.jpg',
        notes: 'Historienne',
        userId: '2',
        createdAt: new Date('2024-01-25'),
        updatedAt: new Date('2024-01-25'),
      },
      {
        id: 49,
        name: 'Alexis Payet',
        date: new Date('1989-12-19'),
        city: 'Brest',
        category: 'colleague',
        photo: 'assets/avatars/avatar49.jpg',
        notes: 'Maritime',
        userId: '2',
        createdAt: new Date('2024-01-26'),
        updatedAt: new Date('2024-01-26'),
      },
      {
        id: 50,
        name: 'Léna Ruiz',
        date: new Date('1994-12-21'),
        city: 'Tours',
        category: 'friend',
        photo: 'assets/avatars/avatar50.jpg',
        notes: 'Linguiste',
        userId: '2',
        createdAt: new Date('2024-01-27'),
        updatedAt: new Date('2024-01-27'),
      },
      {
        id: 51,
        name: 'Tony Lecomte',
        date: new Date('1990-12-23'),
        city: 'Reims',
        category: 'family',
        photo: 'assets/avatars/avatar51.jpg',
        notes: 'Champagniste',
        userId: '2',
        createdAt: new Date('2024-01-28'),
        updatedAt: new Date('2024-01-28'),
      },
      {
        id: 52,
        name: 'Eva Marchetti',
        date: new Date('1986-12-25'),
        city: 'Le Havre',
        category: 'colleague',
        photo: 'assets/avatars/avatar52.jpg',
        notes: 'Capitaine de navire',
        userId: '2',
        createdAt: new Date('2024-01-29'),
        updatedAt: new Date('2024-01-29'),
      },
      {
        id: 53,
        name: 'William Costa',
        date: new Date('1992-12-27'),
        city: 'Cannes',
        category: 'friend',
        photo: 'assets/avatars/avatar53.jpg',
        notes: 'Acteur',
        userId: '2',
        createdAt: new Date('2024-01-30'),
        updatedAt: new Date('2024-01-30'),
      },
      {
        id: 54,
        name: 'Mélanie Rossi',
        date: new Date('1988-12-29'),
        city: 'Saint-Étienne',
        category: 'family',
        photo: 'assets/avatars/avatar54.jpg',
        notes: 'Ingénieure',
        userId: '2',
        createdAt: new Date('2024-01-31'),
        updatedAt: new Date('2024-01-31'),
      },
      {
        id: 55,
        name: 'Jonathan Silva',
        date: new Date('1995-11-01'),
        city: 'Toulon',
        category: 'colleague',
        photo: 'assets/avatars/avatar55.jpg',
        notes: 'Informaticien',
        userId: '2',
        createdAt: new Date('2024-02-01'),
        updatedAt: new Date('2024-02-01'),
      },
      {
        id: 56,
        name: 'Stéphanie Muller',
        date: new Date('1991-11-02'),
        city: 'Nîmes',
        category: 'friend',
        photo: 'assets/avatars/avatar56.jpg',
        notes: 'Archéologue',
        userId: '2',
        createdAt: new Date('2024-02-02'),
        updatedAt: new Date('2024-02-02'),
      },
      {
        id: 57,
        name: 'Damien Fischer',
        date: new Date('1987-11-19'),
        city: 'Avignon',
        category: 'family',
        photo: 'assets/avatars/avatar57.jpg',
        notes: 'Artiste',
        userId: '2',
        createdAt: new Date('2024-02-03'),
        updatedAt: new Date('2024-02-03'),
      },
      {
        id: 58,
        name: 'Coralie Sanchez',
        date: new Date('1993-11-24'),
        city: 'Nancy',
        category: 'colleague',
        photo: 'assets/avatars/avatar58.jpg',
        notes: 'Designer',
        userId: '2',
        createdAt: new Date('2024-02-04'),
        updatedAt: new Date('2024-02-04'),
      },
      {
        id: 59,
        name: 'Mickaël Nguyen',
        date: new Date('1989-11-29'),
        city: 'Metz',
        category: 'friend',
        photo: 'assets/avatars/avatar59.jpg',
        notes: 'Restaurateur',
        userId: '2',
        createdAt: new Date('2024-02-05'),
        updatedAt: new Date('2024-02-05'),
      },
      {
        id: 60,
        name: 'Aurélie Kowalski',
        date: new Date('1994-12-30'),
        city: 'Besançon',
        category: 'family',
        photo: 'assets/avatars/avatar60.jpg',
        notes: 'Horlogère',
        userId: '2',
        createdAt: new Date('2024-02-06'),
        updatedAt: new Date('2024-02-06'),
      },
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

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<UserProfile | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  private users: UserProfile[] = [...FAKE_USERS];
  private nextUserId = 3;

  private useMockApi = false; // Basculer à false pour utiliser le vrai backend
  private apiUrl = 'http://localhost:9000/api';

  constructor(private http: HttpClient) {}

  /**
   * Inscription d'un nouvel utilisateur
   */
  register(
    registerData: RegisterRequest
  ): Observable<ApiResponse<AuthResponse>> {
    if (this.useMockApi) {
      return this.mockRegister(registerData);
    }

    return this.http
      .post<ApiResponse<AuthResponse>>(`${this.apiUrl}/register`, registerData)
      .pipe(
        tap((response) => {
          if (response.success && response.data) {
            this.currentUserSubject.next(response.data.user);
          }
        })
      );
  }

  /**
   * Simulation d'inscription
   */
  private mockRegister(
    registerData: RegisterRequest
  ): Observable<ApiResponse<AuthResponse>> {
    // Vérifie si l'email existe déjà
    const existingUser = this.users.find(
      (user) => user.email === registerData.email
    );
    if (existingUser) {
      return of({
        success: false,
        message: 'Un compte avec cet email existe déjà',
        errors: ['EMAIL_ALREADY_EXISTS'],
      }).pipe(delay(1000));
    }

    // Création du nouvel utilisateur
    const newUser: UserProfile = {
      id: (this.nextUserId++).toString(),
      fullName: registerData.fullName,
      email: registerData.email,
      passwordHash: this.simpleHash(registerData.password),
      bio: '',
      notificationsEnabled: registerData.notificationsEnabled ?? true,
      birthdays: [],
      theme: registerData.theme || 'light',
      language: registerData.language || 'fr',
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'active',
    };

    this.users.push(newUser);

    const authResponse: AuthResponse = {
      user: newUser,
      token: this.generateMockToken(newUser.id),
    };

    return of({
      success: true,
      message: 'Votre compte a été créé avec succès !',
      data: authResponse,
    }).pipe(
      delay(1500),
      tap(() => {
        this.currentUserSubject.next(newUser);
      })
    );
  }

  /**
   * Connexion de l'utilisateur
   */
  login(loginData: LoginRequest): Observable<ApiResponse<AuthResponse>> {
    if (this.useMockApi) {
      return this.mockLogin(loginData);
    }

    return this.http
      .post<ApiResponse<AuthResponse>>(`${this.apiUrl}/login`, loginData)
      .pipe(
        tap((response) => {
          console.log('Login response from the service: ', response);
          if (response.success && response.data) {
            this.currentUserSubject.next(response.data.user);
          }
        })
      );
  }

  /**
   * Simulation de connexion
   */
  private mockLogin(
    loginData: LoginRequest
  ): Observable<ApiResponse<AuthResponse>> {
    const user = this.users.find(
      (u) =>
        u.email === loginData.email &&
        this.simpleHash(u.passwordHash) === this.simpleHash(loginData.password)
    );

    if (!user) {
      return of({
        success: false,
        message: 'Email ou mot de passe incorrect',
        errors: ['INVALID_CREDENTIALS'],
      }).pipe(delay(1000));
    }

    // Met à jour la date de dernière connexion
    user.lastLoginAt = new Date();
    const userIndex = this.users.findIndex((u) => u.id === user.id);
    if (userIndex !== -1) {
      this.users[userIndex] = user;
    }

    const authResponse: AuthResponse = {
      user: user,
      token: this.generateMockToken(user.id),
    };

    console.log('User : ', user);

    return of({
      success: true,
      message: 'Connexion réussie !',
      data: authResponse,
    }).pipe(
      delay(1200),
      tap(() => {
        this.currentUserSubject.next(user);
      })
    );
  }

  /**
   * Déconnexion de l'utilisateur
   */
  logout(): Observable<ApiResponse<void>> {
    if (this.useMockApi) {
      return this.mockLogout();
    }

    return this.http.post<ApiResponse<void>>(`${this.apiUrl}/logout`, {}).pipe(
      tap((response) => {
        if (response.success) {
          this.currentUserSubject.next(null);
        }
      })
    );
  }

  private mockLogout(): Observable<ApiResponse<void>> {
    return of({
      success: true,
      message: 'Déconnexion réussie',
    }).pipe(
      delay(500),
      tap(() => {
        this.currentUserSubject.next(null);
      })
    );
  }

  /**
   * Récupération du profil utilisateur courant
   */
  getCurrentUser(): Observable<ApiResponse<UserProfile>> {
    if (this.useMockApi) {
      return this.mockGetCurrentUser();
    }

    return this.http.get<ApiResponse<UserProfile>>(`${this.apiUrl}/me`).pipe(
      tap((response) => {
        if (response.success && response.data) {
          this.currentUserSubject.next(response.data);
        }
      })
    );
  }

  private mockGetCurrentUser(): Observable<ApiResponse<UserProfile>> {
    const currentUser = this.currentUserSubject.value;

    if (!currentUser) {
      return of({
        success: false,
        message: 'Utilisateur non connecté',
        errors: ['NOT_AUTHENTICATED'],
      }).pipe(delay(800));
    }

    // Récupère les données à jour de l'utilisateur
    const updatedUser = this.users.find((u) => u.id === currentUser.id);

    if (!updatedUser) {
      return of({
        success: false,
        message: 'Utilisateur non trouvé',
        errors: ['USER_NOT_FOUND'],
      }).pipe(delay(800));
    }

    return of({
      success: true,
      message: 'Profil utilisateur récupéré',
      data: updatedUser,
    }).pipe(
      delay(600),
      tap(() => {
        this.currentUserSubject.next(updatedUser);
      })
    );
  }

  /**
   * Mise à jour du profil utilisateur
   */
  updateUserProfile(
    userData: Partial<UserProfile>
  ): Observable<ApiResponse<UserProfile>> {
    if (this.useMockApi) {
      return this.mockUpdateUserProfile(userData);
    }

    return this.http
      .put<ApiResponse<UserProfile>>(`${this.apiUrl}/profile`, userData)
      .pipe(
        tap((response) => {
          if (response.success && response.data) {
            this.currentUserSubject.next(response.data);
          }
        })
      );
  }

  private mockUpdateUserProfile(
    userData: Partial<UserProfile>
  ): Observable<ApiResponse<UserProfile>> {
    const currentUser = this.currentUserSubject.value;

    if (!currentUser) {
      return of({
        success: false,
        message: 'Utilisateur non connecté',
        errors: ['NOT_AUTHENTICATED'],
      }).pipe(delay(800));
    }

    const userIndex = this.users.findIndex((u) => u.id === currentUser.id);

    if (userIndex === -1) {
      return of({
        success: false,
        message: 'Utilisateur non trouvé',
        errors: ['USER_NOT_FOUND'],
      }).pipe(delay(800));
    }

    // Met à jour l'utilisateur
    const updatedUser: UserProfile = {
      ...this.users[userIndex],
      ...userData,
      updatedAt: new Date(),
    };

    this.users[userIndex] = updatedUser;

    return of({
      success: true,
      message: 'Profil mis à jour avec succès',
      data: updatedUser,
    }).pipe(
      delay(1000),
      tap(() => {
        this.currentUserSubject.next(updatedUser);
      })
    );
  }

  /**
   * Demande de réinitialisation de mot de passe
   */
  forgotPassword(email: string): Observable<ApiResponse<void>> {
    if (this.useMockApi) {
      return this.mockForgotPassword(email);
    }

    return this.http.post<ApiResponse<void>>(`${this.apiUrl}/forgot-password`, {
      email,
    });
  }

  private mockForgotPassword(email: string): Observable<ApiResponse<void>> {
    const userExists = this.users.some((u) => u.email === email);

    if (!userExists) {
      return of({
        success: false,
        message: 'Aucun compte trouvé avec cet email',
        errors: ['EMAIL_NOT_FOUND'],
      }).pipe(delay(1000));
    }

    return of({
      success: true,
      message: 'Un email de réinitialisation a été envoyé',
    }).pipe(delay(1500));
  }

  /**
   * Vérification si l'utilisateur est connecté
   */
  isLoggedIn(): boolean {
    return this.currentUserSubject.value !== null;
  }

  /**
   * Récupération de l'utilisateur courant (synchrone)
   */
  getCurrentUserValue(): UserProfile | null {
    return this.currentUserSubject.value;
  }

  /**
   * Méthodes utilitaires pour la simulation
   */
  private simpleHash(password: string): string {
    // Simulation simple de hash - en réalité utiliser bcrypt ou autre
    return btoa(password).substring(0, 8);
  }

  private generateMockToken(userId: string): string {
    // Génère un token mock simple
    return `mock_token_${userId}_${Date.now()}`;
  }

  /**
   * Méthode de développement pour basculer entre mock et vrai API
   */
  setUseMockApi(useMock: boolean): void {
    this.useMockApi = useMock;
  }

  /**
   * Méthode de développement pour réinitialiser les données mock
   */
  resetMockData(): void {
    this.users = [...FAKE_USERS];
    this.nextUserId = 3;
    this.currentUserSubject.next(null);
  }

  /**
   * Méthode de développement pour obtenir tous les utilisateurs (debug)
   */
  getMockUsers(): UserProfile[] {
    return [...this.users];
  }
}
