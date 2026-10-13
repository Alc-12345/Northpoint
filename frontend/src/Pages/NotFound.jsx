import { Link } from 'react-router-dom';
import WorkspacePage from '../Components/WorkspacePage';
export default function NotFound(){
  const role=JSON.parse(localStorage.getItem('authUser')||'{}').role;
  const home=role==='client'?'/client/dashboard':role==='employee'?'/employee-dashboard':'/';
  return <div className="min-h-screen bg-[#f4f4f2] p-6 dark:bg-[#171c24]"><WorkspacePage title="Page not found" subtitle="This address does not match a page in your workspace."><div className="workspace-empty"><h2>Let’s get you back</h2><p className="mb-5">Choose a page in the navigation, or return to your dashboard.</p><Link className="workspace-button" to={localStorage.getItem('authToken')?home:'/login'}>Return to {localStorage.getItem('authToken')?'dashboard':'sign in'}</Link></div></WorkspacePage></div>;
}
