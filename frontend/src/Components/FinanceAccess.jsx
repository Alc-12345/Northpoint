import { Navigate } from 'react-router-dom';
import { canUseFinance } from '../utils/financeAccess';
import { isPanelPreview } from '../utils/auth';

export default function FinanceAccess({ children }) {
  if (!localStorage.getItem('authToken') && !isPanelPreview()) return <Navigate to="/login" replace />;
  if (!canUseFinance()) return <div className="p-8 text-gray-800 dark:text-white" role="alert"><h1 className="text-xl font-semibold">Access denied</h1><p className="mt-2">Finance is available only to administrators.</p></div>;
  return children;
}
