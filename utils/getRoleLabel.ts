export function getRoleLabel(rolesRaw: string[] | string | undefined): string {
  const roles = Array.isArray(rolesRaw)
    ? rolesRaw
    : rolesRaw
      ? [rolesRaw]
      : [];

  if (roles.length === 0) return 'Žiadna rola';
  if (roles.includes('coach') && roles.includes('player')) return 'Tréner a Hráč';
  if (roles.includes('coach')) return 'Tréner';
  if (roles.includes('player')) return 'Hráč';

  return roles.join(', ');
}
