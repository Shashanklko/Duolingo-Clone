import AuthModal from "@/components/modals/AuthModal";

export default function MarketingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <AuthModal />
      {children}
    </div>
  );
}
