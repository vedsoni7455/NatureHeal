export type Role = "patient" | "doctor" | "admin";

export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  experience: number;
  rating: number;
  reviews: number;
  bio: string;
  image: string;
  consultationFee: number;
  available: string[];
  languages: string[];
}

export interface Appointment {
  id: string;
  doctorId: string;
  doctorName: string;
  patientName: string;
  date: string;
  time: string;
  type: "video" | "voice" | "message" | "in-person";
  status: "pending" | "confirmed" | "completed" | "cancelled";
  symptoms?: string;
  prescription?: string;
  rating?: number;
  meetingLink?: string;
}

export const mockDoctors: Doctor[] = [
  {
    id: "d1",
    name: "Dr. Anjali Sharma",
    specialization: "Naturopathy",
    experience: 12,
    rating: 4.9,
    reviews: 248,
    bio: "Specializes in panchakarma, herbal medicine, and lifestyle-based healing for chronic conditions.",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop",
    consultationFee: 45,
    available: ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"],
    languages: ["English", "Hindi", "Sanskrit"],
  },
  {
    id: "d2",
    name: "Dr. Marcus Webb",
    specialization: "Homeopathy",
    experience: 18,
    rating: 4.8,
    reviews: 412,
    bio: "Classical homeopath with focus on chronic illness, allergies, and pediatric care.",
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop",
    consultationFee: 60,
    available: ["08:00", "09:00", "13:00", "14:00", "17:00"],
    languages: ["English", "German"],
  },
  {
    id: "d3",
    name: "Dr. Priya Iyer",
    specialization: "Ayurvedic Medicine",
    experience: 9,
    rating: 4.9,
    reviews: 187,
    bio: "Dosha-based diagnosis, herbal formulations, and integrative wellness coaching.",
    image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop",
    consultationFee: 40,
    available: ["10:00", "11:00", "12:00", "15:00", "16:00"],
    languages: ["English", "Tamil", "Hindi"],
  },
  {
    id: "d4",
    name: "Dr. Liam O'Connor",
    specialization: "Holistic Nutrition",
    experience: 7,
    rating: 4.7,
    reviews: 156,
    bio: "Personalized nutrition therapy, gut healing protocols, and mind-body connection.",
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=400&fit=crop",
    consultationFee: 50,
    available: ["09:00", "10:00", "13:00", "14:00", "17:00", "18:00"],
    languages: ["English"],
  },
  {
    id: "d5",
    name: "Dr. Yuki Tanaka",
    specialization: "Mind-Body Medicine",
    experience: 14,
    rating: 4.9,
    reviews: 301,
    bio: "Meditation, breathwork, and somatic therapy for stress, anxiety, and insomnia.",
    image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400&h=400&fit=crop",
    consultationFee: 55,
    available: ["08:00", "11:00", "14:00", "16:00", "19:00"],
    languages: ["English", "Japanese"],
  },
  {
    id: "d6",
    name: "Dr. Sofia Reyes",
    specialization: "Herbal Medicine",
    experience: 11,
    rating: 4.8,
    reviews: 224,
    bio: "Western and Amazonian herbalism, plant-based remedies, and seasonal wellness.",
    image: "https://images.unsplash.com/photo-1638202993928-7267aad84c31?w=400&h=400&fit=crop",
    consultationFee: 48,
    available: ["09:00", "10:00", "12:00", "15:00", "17:00"],
    languages: ["English", "Spanish", "Portuguese"],
  },
];

export const mockAppointments: Appointment[] = [
  {
    id: "a1",
    doctorId: "d1",
    doctorName: "Dr. Anjali Sharma",
    patientName: "You",
    date: "2026-06-18",
    time: "10:00",
    type: "video",
    status: "confirmed",
    symptoms: "Recurring insomnia and afternoon fatigue.",
    meetingLink: "https://meet.google.com/healora-demo",
  },
  {
    id: "a2",
    doctorId: "d3",
    doctorName: "Dr. Priya Iyer",
    patientName: "You",
    date: "2026-06-22",
    time: "15:00",
    type: "video",
    status: "pending",
    symptoms: "Want a dosha consultation and seasonal diet review.",
  },
  {
    id: "a3",
    doctorId: "d2",
    doctorName: "Dr. Marcus Webb",
    patientName: "You",
    date: "2026-05-30",
    time: "09:00",
    type: "video",
    status: "completed",
    symptoms: "Seasonal allergies.",
    prescription: "Allium cepa 30C — 3 pellets, 2x daily for 14 days. Avoid dairy.",
    rating: 5,
  },
];

export const specializations = [
  "All",
  "Naturopathy",
  "Homeopathy",
  "Ayurvedic Medicine",
  "Holistic Nutrition",
  "Mind-Body Medicine",
  "Herbal Medicine",
];

export const symptomOptions = [
  { id: "headache", label: "Headache", category: "Pain" },
  { id: "fatigue", label: "Fatigue", category: "General" },
  { id: "nausea", label: "Nausea", category: "Digestive" },
  { id: "fever", label: "Fever", category: "General" },
  { id: "cough", label: "Cough", category: "Respiratory" },
  { id: "shortness", label: "Shortness of breath", category: "Respiratory" },
  { id: "chest_pain", label: "Chest pain", category: "Cardiac" },
  { id: "palpitations", label: "Palpitations", category: "Cardiac" },
  { id: "insomnia", label: "Insomnia", category: "Mental health" },
  { id: "anxiety", label: "Anxiety", category: "Mental health" },
  { id: "stress", label: "Stress", category: "Mental health" },
  { id: "joint_pain", label: "Joint pain", category: "Pain" },
  { id: "back_pain", label: "Back pain", category: "Pain" },
  { id: "bloating", label: "Bloating", category: "Digestive" },
  { id: "skin_rash", label: "Skin rash", category: "Skin" },
  { id: "dizziness", label: "Dizziness", category: "Neurological" },
];

export function getDoctor(id: string) {
  return mockDoctors.find((d) => d.id === id);
}
