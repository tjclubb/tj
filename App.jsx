import { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Toast from './components/Toast';
import Intro from './components/Intro';
import useSite from './hooks/useSite';
import Home from './pages/Home';
import Shop from './pages/Shop';
import Product from './pages/Product';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Brands from './pages/Brands';
import About from './pages/About';
import Contact from './pages/Contact';
import Legal from './pages/Legal';
import Admin from './pages/Admin';
import NotFound from './pages/NotFound';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  const { pathname } = useLocation();
  const site = useSite();

  useEffect(() => {
    document.title = site.tagline ? `${site.name} | ${site.tagline}` : site.name;
  }, [site.name, site.tagline]);

  return (
    <div className="flex min-h-screen flex-col">
      <Intro />
      <ScrollToTop />
      {site.banner && (
        <div className="bg-gold px-4 py-2 text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-black">
          {site.banner}
        </div>
      )}
      <Header />
      <main key={pathname} className="anim-page flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<Product />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/brands" element={<Brands />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/legal/:slug" element={<Legal />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <Toast />
    </div>
  );
}
