import { ArrowRight } from 'lucide-react';
import { Link } from 'wouter';
import { LogoBackdrop } from '@/components/logo-backdrop';

export default function NotFound() {
  return (
    <section className="backdrop-page not-found-page">
      <LogoBackdrop density="medium" />
      <div className="not-found-content page-shell">
        <p className="eyebrow">The Ronkus Brand</p>
        <span className="not-found-code" aria-hidden="true">404</span>
        <h1>We couldn't find that page.</h1>
        <p>The page may have moved, or the address may be incorrect. Find your way back to something made for you.</p>
        <div className="not-found-actions">
          <Link className="button-primary" href="/">Home <ArrowRight size={16} aria-hidden="true" /></Link>
          <Link className="button-outline" href="/shop">Browse the Shop <ArrowRight size={16} aria-hidden="true" /></Link>
        </div>
      </div>
    </section>
  );
}
