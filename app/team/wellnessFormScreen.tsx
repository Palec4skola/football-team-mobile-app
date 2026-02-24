import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "expo-router";

import { useTodayWellness } from "@/hooks/useTodayWellness";
import { localDateKey } from "@/utils/dateUtils";
import {
  WellnessForm,
  type WellnessFormValues,
} from "@/components/WellnessForm";
import { auth } from "@/firebase";
import { useActiveTeam } from "@/hooks/useActiveTeam";
function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v));
}

export default function WellnessFormScreen() {
  const router = useRouter();
  const dateKey = useMemo(() => localDateKey(), []);
  const { teamId } = useActiveTeam();
  const userId = auth.currentUser!.uid;

  const { entry, loading, error, save } = useTodayWellness(
    teamId,
    userId,
    dateKey,
  );

  const [values, setValues] = useState<WellnessFormValues>({
    sleepHoursText: "8",
    sleepQuality: 3,
    fatigue: 3,
    muscleSoreness: 3,
    stress: 3,
    mood: 3,
    energy: 3,
    injuryNote: "",
  });

  useEffect(() => {
    if (!entry) return;
    setValues({
      sleepHoursText: String(entry.sleepHours ?? 8),
      sleepQuality: entry.sleepQuality ?? 3,
      fatigue: entry.fatigue ?? 3,
      muscleSoreness: entry.muscleSoreness ?? 3,
      stress: entry.stress ?? 3,
      mood: entry.mood ?? 3,
      energy: entry.energy ?? 3,
      injuryNote: entry.injuryNote ?? "",
    });
  }, [entry]);

  const onChange = (patch: Partial<WellnessFormValues>) =>
    setValues((prev) => ({ ...prev, ...patch }));

  const onSubmit = async () => {
  const sleepHours = Number(values.sleepHoursText.replace(",", "."));

  const basePayload = {
    sleepHours: clamp(sleepHours, 0, 12),
    sleepQuality: values.sleepQuality,
    fatigue: values.fatigue,
    muscleSoreness: values.muscleSoreness,
    stress: values.stress,
    mood: values.mood,
    energy: values.energy,
  };

  const note = values.injuryNote.trim();

  const payload =
    note.length > 0
      ? { ...basePayload, injuryNote: note }
      : basePayload;

  const ok = await save(payload);
  if (!ok) return;

  router.push("/team/wellness");
};

  return (
    <WellnessForm
      dateKey={dateKey}
      values={values}
      onChange={onChange}
      submitting={loading}
      errorText={error}
      score={entry?.score ?? null}
      onSubmit={onSubmit}
    />
  );
}
