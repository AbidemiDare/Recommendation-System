// import Header from "./Header";
import MobileNav from "./MobileNav";
import Sidebar from "./Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />

      <div>
        {/* <Header/> */}

        <main className="p-6">
          {children}
        </main>

        <MobileNav />
      </div>
    </div>
  );
}