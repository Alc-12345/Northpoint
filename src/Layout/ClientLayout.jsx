
import ClientSidebar from "../Components/inner/ClientSidebar";

export default function ClientLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-[#07111f]">
      <ClientSidebar />

      <main className="ml-64 flex-1 p-6">
        {children}
      </main>
    </div>
  );
}