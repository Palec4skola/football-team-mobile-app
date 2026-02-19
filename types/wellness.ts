export type WellnessEntry = {
  sleepHours: number;
  sleepQuality: number;    // 1-5
  fatigue: number;         // 1-5
  muscleSoreness: number;  // 1-5
  stress: number;          // 1-5
  mood: number;            // 1-5
  energy: number;          // 1-5
  injuryNote?: string;

  score: number;
  createdAt: any; // Timestamp
  updatedAt: any; // Timestamp
};