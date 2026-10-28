import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, MessageCircle } from 'lucide-react';
import { Link } from 'wouter';
import { categories, type Category, type Product } from '@/data/catalog';
import { CustomizeItemDialog } from '@/components/customize-item-dialog';
import { LogoBackdrop } from '@/components/logo-backdrop';
import { ProductCard } from '@/components/homepage';
import { featuredProductsDataSource } from '@/data/featured-products';
import { filterProducts, buildWhatsAppUrl, createCartItemDraft, type CustomizationDetails } from '@/lib/shop';
import {
  findCategoryBySlug,
  findSubcategoryBySlug,
  getCategoryPath,
  getSubcategoryPath,
} from '@/lib/catalog';
import { useShop } from '@/components/shop-provider';

function CategoryCards() {
  return (
    <div className="category-grid">
      {categories.map((category, index) => (
        <Link
          className={`category-card category-card-${index + 1}`}
          href={getCategoryPath(category)}
          key={category.name}
        >
          <img src={category.image} alt="" />
          <span className="category-shade" />
          <span className="category-card-content">
            <span className="category-number">0{index + 1}</span>
            <strong>{category.name}</strong>
            <span className="category-subcategories">{category.subcategories.slice(0, 3).join(' · ')}</span>
          </span>
          <span className="category-arrow" aria-hidden="true"><ArrowRight size={18} /></span>
        </Link>
      ))}
    </div>
  );
}

export function ShopOverviewPage() {
  return (
    <section className="backdrop-page shop-overview-page">
      <LogoBackdrop density="medium" />
      <div className="shop-overview page-shell">
        <p className="eyebrow">Explore The Ronkus Brand</p>
        <h1 className="section-title">Shop by Category</h1>
        <p className="section-intro">Pieces for the way you move, make and show up.</p>
        <CategoryCards />
      </div>
    </section>
  );
}

function SubcategorySlider({
  category,
  activeSubcategory,
}: {
  category: Category;
  activeSubcategory?: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const activeChipRef = useRef<HTMLAnchorElement>(null);
  const activePath = activeSubcategory
    ? getSubcategoryPath(category, activeSubcategory)
    : getCategoryPath(category);

  useEffect(() => {
    activeChipRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center',
    });
  }, [activePath]);

  const scroll = (direction: -1 | 1) => {
    trackRef.current?.scrollBy({
      left: direction * Math.max(trackRef.current.clientWidth * 0.7, 180),
      behavior: 'smooth',
    });
  };

  const chips = [
    { name: 'All', href: getCategoryPath(category), active: !activeSubcategory },
    ...category.subcategories.map((subcategory) => ({
      name: subcategory,
      href: getSubcategoryPath(category, subcategory),
      active: activeSubcategory === subcategory,
    })),
  ];

  return (
    <div className="subcategory-slider page-shell" role="region" aria-label={`${category.name} subcategories`}>
      <button className="subcategory-arrow" type="button" aria-label="Scroll subcategories left" onClick={() => scroll(-1)}>
        <ArrowLeft size={17} />
      </button>
      <div className="subcategory-track" ref={trackRef} role="list">
        {chips.map((chip) => (
          <Link
            className={`subcategory-chip${chip.active ? ' is-active' : ''}`}
            href={chip.href}
            key={chip.name}
            ref={chip.active ? activeChipRef : undefined}
            role="listitem"
            aria-current={chip.active ? 'page' : undefined}
          >
            {chip.name}
          </Link>
        ))}
      </div>
      <button className="subcategory-arrow" type="button" aria-label="Scroll subcategories right" onClick={() => scroll(1)}>
        <ArrowRight size={17} />
      </button>
    </div>
  );
}

function CategoryProducts({
  category,
  subcategory,
}: {
  category: Category;
  subcategory?: string;
}) {
  const { addItem, setCartOpen } = useShop();
  const [customizeTarget, setCustomizeTarget] = useState<{ product: Product; color: string } | null>(null);
  const inventory = featuredProductsDataSource.listFeaturedProducts();
  const categoryProducts = filterProducts(inventory, '', category.name);
  const filteredProducts = subcategory
    ? filterProducts(categoryProducts, subcategory, category.name)
    : categoryProducts;

  const addCustomizedItem = (customization: CustomizationDetails) => {
    if (!customizeTarget) return;
    addItem(createCartItemDraft(
      customizeTarget.product,
      { color: customizeTarget.color },
      customization,
    ));
    setCustomizeTarget(null);
    setCartOpen(true);
  };

  return (
    <>
      {filteredProducts.length > 0 ? (
        <div className="category-product-grid">
          {filteredProducts.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              index={index}
              onCustomize={(target, color) => setCustomizeTarget({ product: target, color })}
            />
          ))}
        </div>
      ) : (
        <div className="category-empty-state">
          <p className="eyebrow">Made with intention</p>
          <h2>New pieces arriving soon</h2>
          <p>
            {subcategory
              ? `We are adding new pieces to ${subcategory}. Message us on WhatsApp and we will be happy to help.`
              : `We are preparing more ${category.name.toLowerCase()} for you. Get in touch and we will be happy to help.`}
          </p>
          <a
            className="button-primary"
            href={buildWhatsAppUrl(`Hello The Ronkus Brand, I would like to know about ${subcategory ?? category.name}.`)}
            target="_blank"
            rel="noreferrer"
          >
            <MessageCircle size={16} /> Chat with us on WhatsApp
          </a>
        </div>
      )}
      <CustomizeItemDialog
        product={customizeTarget?.product ?? null}
        selectedColor={customizeTarget?.color}
        onClose={() => setCustomizeTarget(null)}
        onAddToCart={addCustomizedItem}
      />
    </>
  );
}

export function CategoryPage({
  categorySlug,
  subcategorySlug,
}: {
  categorySlug: string;
  subcategorySlug?: string;
}) {
  const category = findCategoryBySlug(categorySlug);
  if (!category) return null;
  const subcategory = subcategorySlug ? findSubcategoryBySlug(category, subcategorySlug) : undefined;
  if (subcategorySlug && !subcategory) return null;
  const productCount = filterProducts(
    featuredProductsDataSource.listFeaturedProducts(),
    subcategory ?? '',
    category.name,
  ).length;

  return (
    <section className="category-page">
      <LogoBackdrop density="high" />
      <div className="category-page-content">
        <header className="category-banner" style={{ backgroundImage: `url("${category.image}")` }}>
          <div className="category-banner-inner page-shell">
            <p className="eyebrow">The Ronkus Brand collection</p>
            <h1>{category.name}</h1>
            <p>{category.subcategories.join(' · ')}</p>
          </div>
        </header>
        <SubcategorySlider category={category} activeSubcategory={subcategory} />
        <section className="category-products page-shell" aria-label={`${category.name} products`}>
          <div className="category-products-heading">
            <div>
              <p className="eyebrow">{subcategory ?? category.name}</p>
              <h2>{subcategory ? `${subcategory}` : `Discover ${category.name}`}</h2>
            </div>
            <span>{productCount} {productCount === 1 ? 'piece' : 'pieces'}</span>
          </div>
          <CategoryProducts category={category} subcategory={subcategory} />
        </section>
      </div>
    </section>
  );
}

export function ComingSoonPage({ title }: { title: string }) {
  return (
    <section className="coming-soon-page page-shell">
      <p className="eyebrow">The Ronkus Brand</p>
      <h1>{title}</h1>
      <span className="coming-soon-rule" />
      <p>We are working on something special. Please check back soon.</p>
      <Link className="button-primary" href="/shop">Explore the collections <ArrowRight size={16} /></Link>
    </section>
  );
}

export function isKnownCategoryRoute(categorySlug: string, subcategorySlug?: string): boolean {
  const category = findCategoryBySlug(categorySlug);
  return Boolean(category && (!subcategorySlug || findSubcategoryBySlug(category, subcategorySlug)));
}
