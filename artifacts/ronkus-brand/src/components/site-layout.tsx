import { useState, type MouseEvent, type ReactNode } from 'react';
import {
  ArrowRight,
  ChevronDown,
  Instagram,
  Menu,
  ShoppingBag,
  X,
} from 'lucide-react';
import { Link, useLocation } from 'wouter';
import { categories } from '@/data/catalog';
import { useShop } from '@/components/shop-provider';
import { ShoppingCartDialog } from '@/components/shopping-cart-dialog';
import { getCategoryPath } from '@/lib/catalog';

const instagramUrl = 'https://instagram.com/the_ronkus_brand?dlrf=MTBzaDJjY3dybGhlOA%3D%3D';
const facebookUrl = 'https://www.facebook.com/share/14sWXoMEgGM/';

function BrandLogo({ className = '' }: { className?: string }) {
  return (
    <Link className={`brand-logo ${className}`} href="/" aria-label="The Ronkus Brand home">
      <img src="/assets/logo.png" alt="The Ronkus Brand" />
    </Link>
  );
}

export function HomeAnchorLink({
  id,
  children,
  className,
}: {
  id: string;
  children: ReactNode;
  className?: string;
}) {
  const [location, navigate] = useLocation();

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    const changingPage = location !== '/';
    if (changingPage) navigate('/');
    window.setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }, changingPage ? 50 : 0);
  };

  return (
    <a className={className} href={`/#${id}`} onClick={handleClick}>
      {children}
    </a>
  );
}

function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const { itemCount, setCartOpen } = useShop();

  const closeMenus = () => {
    setMobileOpen(false);
    setShopOpen(false);
  };

  const exploreLinks = [
    { label: 'Shoemaking Academy', href: '/academy' },
    { label: 'FAQ', href: '/faq' },
    { label: 'Contact / About Us', href: '/contact' },
  ];

  return (
    <header className="site-header">
      <div className="page-shell header-inner">
        <BrandLogo />
        <nav className="desktop-nav" aria-label="Main navigation">
          <Link href="/">Home</Link>
          <div className="shop-nav-wrap">
            <button
              className={`nav-shop ${shopOpen ? 'is-open' : ''}`}
              type="button"
              aria-expanded={shopOpen}
              aria-controls="shop-menu"
              onClick={() => setShopOpen(!shopOpen)}
            >
              Shop <ChevronDown size={14} />
            </button>
            {shopOpen && (
              <div className="shop-dropdown" id="shop-menu">
                <Link href="/shop" onClick={closeMenus}>All categories</Link>
                {categories.map((category) => (
                  <Link key={category.name} href={getCategoryPath(category)} onClick={closeMenus}>
                    {category.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
          {exploreLinks.map((item) => (
            <Link href={item.href} key={item.label}>{item.label}</Link>
          ))}
        </nav>
        <div className="header-actions">
          <button
            className="cart-link"
            type="button"
            aria-label={`Open shopping bag, ${itemCount} ${itemCount === 1 ? 'item' : 'items'}`}
            aria-haspopup="dialog"
            onClick={() => setCartOpen(true)}
          >
            <ShoppingBag size={19} strokeWidth={1.6} />
            {itemCount > 0 && <span className="cart-count" aria-hidden="true">{itemCount}</span>}
          </button>
          <button
            className="mobile-menu-button"
            type="button"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
      {mobileOpen && (
        <nav className="mobile-nav" aria-label="Mobile navigation">
          <Link href="/" onClick={closeMenus}>Home</Link>
          <button
            className="mobile-shop-toggle"
            type="button"
            aria-expanded={shopOpen}
            onClick={() => setShopOpen(!shopOpen)}
          >
            Shop <ChevronDown size={16} />
          </button>
          {shopOpen && (
            <div className="mobile-shop-list">
              <Link href="/shop" onClick={closeMenus}>All categories</Link>
              {categories.map((category) => (
                <Link key={category.name} href={getCategoryPath(category)} onClick={closeMenus}>
                  {category.name}
                </Link>
              ))}
            </div>
          )}
          {exploreLinks.map((item) => (
            <Link href={item.href} key={item.label} onClick={closeMenus}>{item.label}</Link>
          ))}
        </nav>
      )}
    </header>
  );
}

function Footer() {
  return (
    <footer className="site-footer" id="footer">
      <div className="page-shell footer-main">
        <div className="footer-brand-column">
          <BrandLogo className="footer-logo" />
          <p>Handcrafted fashion and personal details to bring your whole look together.</p>
          <div className="footer-socials">
            <a href={instagramUrl} target="_blank" rel="noreferrer" aria-label="The Ronkus Brand on Instagram"><Instagram size={17} /></a>
            <a href={facebookUrl} target="_blank" rel="noreferrer" aria-label="The Ronkus Brand on Facebook">f</a>
          </div>
          <a className="footer-email" href="mailto:theronkusbrand@gmail.com">theronkusbrand@gmail.com</a>
        </div>
        <div className="footer-links-column">
          <p className="footer-column-title">Explore</p>
          <Link href="/">Home</Link>
          <Link href="/shop">Shop</Link>
          <Link href="/academy">Shoemaking Academy</Link>
          <Link href="/faq">FAQ</Link>
          <Link href="/contact">Contact / About Us</Link>
        </div>
        <div className="footer-links-column">
          <p className="footer-column-title">Shop categories</p>
          {categories.map((category) => (
            <Link key={category.name} href={getCategoryPath(category)}>{category.name}</Link>
          ))}
        </div>
        <div className="footer-note">
          <span>Personal expression,</span>
          <em>made tangible.</em>
          <span className="footer-flourish">TRB · BN 7907530</span>
        </div>
      </div>
      <div className="page-shell footer-bottom">
        <span>© {new Date().getFullYear()} The Ronkus Brand</span>
        <HomeAnchorLink id="home">Back to top <ArrowRight size={14} /></HomeAnchorLink>
      </div>
    </footer>
  );
}

export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
      <ShoppingCartDialog />
    </>
  );
}
