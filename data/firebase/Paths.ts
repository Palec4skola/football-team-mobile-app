export const paths = {
  teams: () => "teams",
  team: (teamId: string) => `teams/${teamId}`,
  members: (teamId: string) => `teams/${teamId}/members`,
  member: (teamId: string, uid: string) => `teams/${teamId}/members/${uid}`,

  trainings: (teamId: string) => `teams/${teamId}/trainings`,
  training: (teamId: string, trainingId: string) =>
    `teams/${teamId}/trainings/${trainingId}`,
  trainingAttendance: (teamId: string, trainingId: string) =>
    `teams/${teamId}/trainings/${trainingId}/attendance`,
  trainingAttendanceDoc: (teamId: string, trainingId: string, uid: string) =>
    `teams/${teamId}/trainings/${trainingId}/attendance/${uid}`,

  matches: (teamId: string) => `teams/${teamId}/matches`,
  match: (teamId: string, matchId: string) =>
    `teams/${teamId}/matches/${matchId}`,

  wellnessDays: (teamId: string) => `teams/${teamId}/wellnessDays`,
  wellnessResponses: (teamId: string, dayId: string) =>
    `teams/${teamId}/wellnessDays/${dayId}/responses`,
};
