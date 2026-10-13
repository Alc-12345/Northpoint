
import ClientSidebar from "../Components/inner/ClientSidebar";


export default function ClientLayout({ children }) {
  return (
    <div className="nav-shell client-theme flex min-h-screen bg-[#0b1220] flex-col">
 
      <div className="flex flex-1">
        <ClientSidebar />
        <main className="nav-content nav-client-page ml-64 flex-1 p-6 bg-[#0b1220]">
          {children}
        </main>
      </div>
    </div>
  );
}
