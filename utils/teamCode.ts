export function generateTeamCode(length = 4): string {
  const chars = "ABCDEFGHJKMNPQRSTUVWXYZ23456789"; // bez I,O,1,0 (menej omylov)
  let out = "";
  for (let i = 0; i < length; i++) {
    out += chars[Math.floor(Math.random() * chars.length)];
  }
  return out;
}
