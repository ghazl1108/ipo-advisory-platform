import SiteHeader from './SiteHeader';
import SiteFooter from './SiteFooter';

export default function Layout({ children }) {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-800">
      <SiteHeader />
      <main className="flex-grow px-6 py-10">{children}</main>
      <SiteFooter />
    </div>
  );
}