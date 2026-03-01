import type { WellnessSaveInput } from "@/data/firebase/WellnessRepo"; // alebo si typ presuň do shared

function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v));
}

// 1..5 -> 0..1
function pos1to5(v: number) {
  return clamp((v - 1) / 4, 0, 1);
}

// 1..5 kde nižšie je lepšie -> 1..0
function neg1to5(v: number) {
  return 1 - pos1to5(v);
}

// ideál okolo 8h
function sleepHoursScore(hours: number) {
  const diff = Math.abs(hours - 8);
  const score = 1 - diff / 4; // 8->1, 6/10->0.5, 4/12->0
  return clamp(score, 0, 1);
}

export function computeWellnessScore10(e: WellnessSaveInput): number {
  const s =
    pos1to5(e.energy) +
    pos1to5(e.mood) +
    pos1to5(e.sleepQuality) +
    sleepHoursScore(e.sleepHours) +
    neg1to5(e.fatigue) +
    neg1to5(e.stress) +
    neg1to5(e.muscleSoreness);

  const score0to1 = s / 7;
  return Math.round(score0to1 * 10); // 0..10
}