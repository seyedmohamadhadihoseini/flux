import Header from '@/components/homepage/Header';
import Footer from '@/components/homepage/Footer';

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow pt-16">
        {children}
      </main>
      
      <Footer />
    </div>
  );
}