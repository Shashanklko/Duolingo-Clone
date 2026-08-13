import Sidebar from "@/components/shared/Sidebar";
import MobileNav from "@/components/shared/MobileNav";
import AuthModal from "@/components/modals/AuthModal";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Sidebar />
      <main className="lg:pl-[256px] h-full pt-[50px] lg:pt-0">
        <div 
          className="h-full min-h-screen transition-colors duration-300"
          style={{ backgroundColor: "var(--bg-primary)", color: "var(--text-primary)" }}
        >
          {children}
        </div>
      </main>
      <MobileNav />
      <AuthModal />
    </>
  );
}
