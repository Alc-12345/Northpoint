// Match the backend requireAdmin policy, including the superadmin role.
export const hasFinanceAccess = user => ['admin', 'superadmin'].includes(user?.role);

export function canUseFinance() {
  try {
    return hasFinanceAccess(JSON.parse(localStorage.getItem('authUser') || 'null'));
  } catch {
    return false;
  }
}
