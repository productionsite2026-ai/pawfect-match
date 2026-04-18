// Demo data for dashboard preview when no real data exists
import dogGolden from "@/assets/dog-golden.jpg";
import dogPoodle from "@/assets/dog-poodle.jpg";
import avatarWalker from "@/assets/avatar-walker.jpg";

// Try to import optional demo images, fallback to defaults
let demoDogMax = dogGolden;
let demoDogBella = dogPoodle;
let demoWalkerLucas = avatarWalker;
let demoWalkerSophie = avatarWalker;

try { demoDogMax = new URL("@/assets/demo-dog-max.jpg", import.meta.url).href; } catch {}
try { demoDogBella = new URL("@/assets/demo-dog-bella.jpg", import.meta.url).href; } catch {}
try { demoWalkerLucas = new URL("@/assets/demo-walker-lucas.jpg", import.meta.url).href; } catch {}
try { demoWalkerSophie = new URL("@/assets/demo-walker-sophie.jpg", import.meta.url).href; } catch {}

export const DEMO_WALKERS = [
  { id: '1', name: 'Lucas', lastName: 'Bernard', city: 'Paris 16e', avatar: demoWalkerLucas, rating: 4.9, reviews: 47, walks: 156, verified: true, experience: 5, hourlyRate: 18, bio: 'Éducateur canin certifié, 5 ans d\'expérience. Spécialiste des grands chiens.' },
  { id: '2', name: 'Julie', lastName: 'Dubois', city: 'Lyon 6e', avatar: demoWalkerSophie, rating: 4.7, reviews: 32, walks: 98, verified: true, experience: 3, hourlyRate: 15, bio: 'Passionnée des animaux, diplômée en comportement canin.' },
  { id: '3', name: 'Maxime', lastName: 'Roux', city: 'Marseille 8e', avatar: demoWalkerLucas, rating: 4.8, reviews: 28, walks: 112, verified: true, experience: 4, hourlyRate: 20, bio: 'Runner et amoureux des chiens. Parcours sportifs.' },
  { id: '4', name: 'Léa', lastName: 'Garcia', city: 'Bordeaux', avatar: demoWalkerSophie, rating: 5.0, reviews: 15, walks: 67, verified: true, experience: 7, hourlyRate: 22, bio: 'Vétérinaire de formation, soins et promenades.' },
  { id: '5', name: 'Antoine', lastName: 'Martinez', city: 'Toulouse', avatar: demoWalkerLucas, rating: 4.6, reviews: 21, walks: 45, verified: false, experience: 2, hourlyRate: 16, bio: 'Pet-sitter professionnel, disponible week-end.' },
];

export const DEMO_OWNERS = [
  { id: '1', name: 'Sophie', lastName: 'Martin', city: 'Paris 16e', avatar: demoWalkerSophie },
  { id: '2', name: 'Pierre', lastName: 'Durand', city: 'Lyon 6e', avatar: demoWalkerLucas },
  { id: '3', name: 'Camille', lastName: 'Leroy', city: 'Marseille 8e', avatar: demoWalkerSophie },
  { id: '4', name: 'Thomas', lastName: 'Moreau', city: 'Bordeaux', avatar: demoWalkerLucas },
  { id: '5', name: 'Emma', lastName: 'Petit', city: 'Toulouse', avatar: demoWalkerSophie },
];

export const DEMO_DOGS = [
  { id: '1', name: 'Max', breed: 'Labrador Retriever', age: 4, weight: 32, size: 'large' as const, photo: demoDogMax, ownerId: '1', temperament: 'Joueur', vaccinated: true },
  { id: '2', name: 'Bella', breed: 'Caniche', age: 3, weight: 8, size: 'small' as const, photo: demoDogBella, ownerId: '1', temperament: 'Calme', vaccinated: true },
  { id: '3', name: 'Rex', breed: 'Berger Allemand', age: 5, weight: 38, size: 'large' as const, photo: demoDogMax, ownerId: '2', temperament: 'Protecteur', vaccinated: true },
  { id: '4', name: 'Pixel', breed: 'Chihuahua', age: 3, weight: 2, size: 'small' as const, photo: demoDogBella, ownerId: '3', temperament: 'Énergique', vaccinated: true },
  { id: '5', name: 'Charlie', breed: 'Golden Retriever', age: 4, weight: 30, size: 'large' as const, photo: demoDogMax, ownerId: '4', temperament: 'Amical', vaccinated: true },
  { id: '6', name: 'Luna', breed: 'Border Collie', age: 3, weight: 18, size: 'medium' as const, photo: demoDogBella, ownerId: '5', temperament: 'Intelligent', vaccinated: true },
];

export const DEMO_REVIEWS = [
  { id: '1', rating: 5, comment: 'Lucas est fantastique avec Max ! Très professionnel et ponctuel. Il a envoyé des photos pendant toute la balade.', reviewerName: 'Sophie', reviewerAvatar: demoWalkerSophie, date: '10 mars 2026', walkerId: '1' },
  { id: '2', rating: 5, comment: 'Encore une super promenade pour Bella. Merci Lucas !', reviewerName: 'Sophie', reviewerAvatar: demoWalkerSophie, date: '12 mars 2026', walkerId: '1' },
  { id: '3', rating: 4, comment: 'Julie est douce avec Rex, il l\'adore. Petit retard de 5 min.', reviewerName: 'Pierre', reviewerAvatar: demoWalkerLucas, date: '8 mars 2026', walkerId: '2' },
  { id: '4', rating: 5, comment: 'Maxime a pris soin de Pixel comme si c\'était le sien. GPS impeccable.', reviewerName: 'Camille', reviewerAvatar: demoWalkerSophie, date: '15 mars 2026', walkerId: '3' },
  { id: '5', rating: 5, comment: 'Léa est exceptionnelle. Charlie était ravi et bien fatigué au retour !', reviewerName: 'Thomas', reviewerAvatar: demoWalkerLucas, date: '5 mars 2026', walkerId: '4' },
  { id: '6', rating: 4, comment: 'Antoine est gentil, Luna a bien profité de sa balade au parc.', reviewerName: 'Emma', reviewerAvatar: demoWalkerSophie, date: '14 mars 2026', walkerId: '5' },
];

export const DEMO_BOOKINGS = [
  { id: '1', dogName: 'Max', dogPhoto: demoDogMax, ownerName: 'Sophie', ownerAvatar: demoWalkerSophie, walkerName: 'Lucas', walkerAvatar: demoWalkerLucas, date: '25 mars', time: '09:00', duration: 60, price: 18, status: 'confirmed' as const, service: 'Promenade' },
  { id: '2', dogName: 'Rex', dogPhoto: demoDogMax, ownerName: 'Pierre', ownerAvatar: demoWalkerLucas, walkerName: 'Julie', walkerAvatar: demoWalkerSophie, date: '26 mars', time: '14:00', duration: 60, price: 15, status: 'pending' as const, service: 'Promenade' },
  { id: '3', dogName: 'Pixel', dogPhoto: demoDogBella, ownerName: 'Camille', ownerAvatar: demoWalkerSophie, walkerName: 'Maxime', walkerAvatar: demoWalkerLucas, date: '27 mars', time: '16:00', duration: 30, price: 10, status: 'pending' as const, service: 'Visite' },
  { id: '4', dogName: 'Charlie', dogPhoto: demoDogMax, ownerName: 'Thomas', ownerAvatar: demoWalkerLucas, walkerName: 'Léa', walkerAvatar: demoWalkerSophie, date: '24 mars', time: '10:00', duration: 60, price: 22, status: 'confirmed' as const, service: 'Promenade' },
];

// Dashboard-v2 mock data
export const mockDogs = [
  { id: "demo-1", name: "Max", breed: "Golden Retriever", age: 3, size: "large" as const, weight: 30, photo_url: demoDogMax, temperament: "Joueur et sociable", special_needs: null, is_neutered: true, vaccinations_up_to_date: true, owner_id: "demo", created_at: null, updated_at: null },
  { id: "demo-2", name: "Bella", breed: "Caniche", age: 5, size: "small" as const, weight: 8, photo_url: demoDogBella, temperament: "Calme", special_needs: "Arthrose légère - éviter les escaliers", is_neutered: true, vaccinations_up_to_date: true, owner_id: "demo", created_at: null, updated_at: null },
];

export const mockBookings = [
  {
    id: "demo-b1", dog_id: "demo-1", owner_id: "demo", walker_id: "w1",
    scheduled_date: new Date(Date.now() + 86400000).toISOString().split("T")[0],
    scheduled_time: "09:00", duration_minutes: 30, status: "confirmed" as const,
    service_type: "promenade" as const, address: "Parc de la Tête d'Or",
    notes: null, price: 15, created_at: null, updated_at: null,
    owner_confirmed: true, walker_confirmed: true, cancellation_reason: null,
    cancelled_by: null, latitude: null, longitude: null, city: "Lyon",
    dogs: { name: "Max", breed: "Golden Retriever", photo_url: demoDogMax },
  },
  {
    id: "demo-b2", dog_id: "demo-2", owner_id: "demo", walker_id: null,
    scheduled_date: new Date(Date.now() + 172800000).toISOString().split("T")[0],
    scheduled_time: "14:00", duration_minutes: 45, status: "pending" as const,
    service_type: "promenade" as const, address: "Jardin du Luxembourg",
    notes: "Bella a peur des grands chiens, merci de la tenir en laisse courte.", price: 20, created_at: null, updated_at: null,
    owner_confirmed: false, walker_confirmed: false, cancellation_reason: null,
    cancelled_by: null, latitude: null, longitude: null, city: "Paris",
    dogs: { name: "Bella", breed: "Caniche", photo_url: demoDogBella },
  },
  {
    id: "demo-b3", dog_id: "demo-1", owner_id: "demo", walker_id: "w1",
    scheduled_date: new Date(Date.now() - 172800000).toISOString().split("T")[0],
    scheduled_time: "10:00", duration_minutes: 60, status: "completed" as const,
    service_type: "promenade" as const, address: "Bois de Vincennes",
    notes: null, price: 22, created_at: null, updated_at: null,
    owner_confirmed: true, walker_confirmed: true, cancellation_reason: null,
    cancelled_by: null, latitude: null, longitude: null, city: "Paris",
    dogs: { name: "Max", breed: "Golden Retriever", photo_url: demoDogMax },
  },
];

export const mockWalkerProfile = {
  id: "demo-wp", user_id: "demo", hourly_rate: 18, max_dogs: 4,
  experience_years: 5, rating: 4.8, total_reviews: 47, total_walks: 312,
  verified: true, services: ["promenade", "garde", "visite"] as const,
  available_days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
  available_hours_start: "08:00", available_hours_end: "19:00",
  service_radius_km: 10, latitude: null, longitude: null,
  created_at: null, updated_at: null,
};

export const mockProfile = {
  id: "demo", email: "demo@dogwalking.fr", first_name: "Marie",
  last_name: "Dupont", bio: "Passionnée par les animaux depuis toujours 🐾",
  avatar_url: demoWalkerSophie, city: "Lyon", address: "12 rue des Jardins", phone: "06 12 34 56 78",
  postal_code: "69006", user_type: "both" as const,
  created_at: null, updated_at: null,
};

export const mockNearbyWalkers = [
  {
    id: "w1", user_id: "w1", rating: 4.9, total_reviews: 89, hourly_rate: 15,
    verified: true, total_walks: 456, experience_years: 7, max_dogs: 3,
    services: ["promenade"] as any, available_days: null, available_hours_start: null,
    available_hours_end: null, service_radius_km: 5, latitude: null, longitude: null,
    created_at: null, updated_at: null,
    profiles: { id: "w1", first_name: "Lucas", last_name: "Martin", avatar_url: demoWalkerLucas },
  },
  {
    id: "w2", user_id: "w2", rating: 4.7, total_reviews: 34, hourly_rate: 12,
    verified: true, total_walks: 178, experience_years: 3, max_dogs: 4,
    services: ["promenade", "garde"] as any, available_days: null, available_hours_start: null,
    available_hours_end: null, service_radius_km: 8, latitude: null, longitude: null,
    created_at: null, updated_at: null,
    profiles: { id: "w2", first_name: "Sophie", last_name: "Bernard", avatar_url: demoWalkerSophie },
  },
  {
    id: "w3", user_id: "w3", rating: 4.5, total_reviews: 21, hourly_rate: 18,
    verified: false, total_walks: 95, experience_years: 2, max_dogs: 2,
    services: ["promenade"] as any, available_days: null, available_hours_start: null,
    available_hours_end: null, service_radius_km: 3, latitude: null, longitude: null,
    created_at: null, updated_at: null,
    profiles: { id: "w3", first_name: "Emma", last_name: "Petit", avatar_url: demoWalkerSophie },
  },
];

export const mockEarnings = { today: 45, week: 215, month: 890, trend: 12 };

export const mockUpcomingBookings = [
  { id: "1", dogName: "Max", date: "Lun 24 Mars", time: "09:00", duration: "30 min", status: "confirmée" as const },
  { id: "2", dogName: "Bella", date: "Mar 25 Mars", time: "14:00", duration: "45 min", status: "en_attente" as const },
  { id: "3", dogName: "Rocky", date: "Mer 26 Mars", time: "10:30", duration: "60 min", status: "confirmée" as const },
];