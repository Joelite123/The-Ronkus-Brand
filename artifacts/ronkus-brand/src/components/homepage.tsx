import { useRef, useState } from 'react';
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Instagram,
  Search,
} from 'lucide-react';
import {
  categories,
  communityImages,
  testimonialImages,
  type Product,
} from '@/data/catalog';
import { featuredProductsDataSource } from '@/data/featured-products';
import { CustomizeItemDialog } from '@/components/customize-item-dialog';
import { HomeAnchorLink } from '@/components/site-layout';
import { useShop } from '@/components/shop-provider';
import { getCategoryPath } from '@/lib/catalog';
import { Link } from 'wouter';
import {
  createCartItemDraft,
  filterProducts,
  formatNaira,
  getSelectedPrice,
  type CustomizationDetails,
  type ProductSelection,
} from '@/lib/shop';

const instagramUrl = 'https://instagram.com/the_ronkus_brand?dlrf=MTBzaDJjY3dybGhlOA%3D%3D';
const facebookUrl = 'https://www.facebook.com/share/14sWXoMEgGM/';

function Hero() {
  return (
    <section className="hero-section" id="home">
      <div className="page-shell hero-grid">
        <div className="hero-copy fade-up">
          <h1>We Make Your <em>Outfits</em> Complete.</h1>
          <p className="hero-description">
            Discover handcrafted footwear, expressive fashion, statement accessories and personalized pieces made to complement your style.
          </p>
          <div className="hero-actions">
            <HomeAnchorLink className="button-primary" id="products">Shop Collection <ArrowRight size={16} /></HomeAnchorLink>
            <HomeAnchorLink className="button-outline" id="community">Join the Community</HomeAnchorLink>
          </div>
          <div className="hero-footnote">
            <span className="gold-rule" />
            <span>Thoughtful details, with a distinctly personal touch.</span>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-photo-frame">
            <img src="/assets/fashion-editorial.jpg" alt="Ronkus Brand fashion, expressive footwear and a vivid patterned shirt" width="1000" height="1200" fetchPriority="high" decoding="async" />
          </div>
          <div className="hero-photo-caption">
            <span>Wear what feels like you</span>
            <ArrowDown size={16} />
          </div>
          <div className="hero-stamp" aria-hidden="true">
            <span>THE</span>
            <strong>R</strong>
            <span>RONKUS<br />BRAND</span>
          </div>
          <span className="hero-index" aria-hidden="true">01 / 04</span>
        </div>
      </div>
      <div className="hero-bottom-line" aria-hidden="true" />
    </section>
  );
}

function SectionHeading({
  eyebrow,
  title,
  intro,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
}) {
  return (
    <div className="section-heading">
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="section-title">{title}</h2>
      {intro && <p className="section-intro">{intro}</p>}
    </div>
  );
}

function CategorySection() {
  return (
    <section className="category-section page-shell" id="categories">
      <div className="category-heading-row">
        <SectionHeading eyebrow="Find your finishing touch" title="Shop by Category" />
        <p className="category-note">Pieces for the way you move, make and show up.</p>
      </div>
      <div className="category-grid">
        {categories.map((category, index) => (
          <Link
            className={`category-card category-card-${index + 1}`}
            href={getCategoryPath(category)}
            key={category.name}
          >
            <img src={category.image} alt="" width="640" height="480" loading="lazy" decoding="async" />
            <span className="category-shade" />
            <span className="category-card-content">
              <span className="category-number">0{index + 1}</span>
              <strong>{category.name}</strong>
              <span className="category-subcategories">
                {category.subcategories.slice(0, 3).join(' · ')}
              </span>
            </span>
            <span className="category-arrow" aria-hidden="true"><ArrowRight size={18} /></span>
          </Link>
        ))}
      </div>
    </section>
  );
}

function ProductSelectors({
  product,
  selection,
  onChange,
}: {
  product: Product;
  selection: ProductSelection;
  onChange: (selection: ProductSelection) => void;
}) {
  const selectedPrice = getSelectedPrice(product, selection);

  return (
    <div className="product-options">
      {product.options.sizes && (
        <fieldset className="selector-group">
          <legend>Size <span>{selection.size ? `· ${selection.size}` : '· Choose one'}</span></legend>
          <div className="size-options">
            {product.options.sizes.map((size) => (
              <button
                className={selection.size === size ? 'size-choice selected' : 'size-choice'}
                type="button"
                key={size}
                aria-pressed={selection.size === size}
                onClick={() => onChange({ ...selection, size })}
              >
                {size}
              </button>
            ))}
          </div>
        </fieldset>
      )}
      {product.options.yardage && (
        <label className="selector-group yardage-select">
          <span>Yardage</span>
          <select
            value={selection.yardage ?? ''}
            onChange={(event) => onChange({ ...selection, yardage: event.target.value })}
            required
          >
            <option value="">Choose yardage</option>
            {product.options.yardage.map((option) => (
              <option value={option.label} key={option.label}>
                {option.label} — {formatNaira(option.price)}
              </option>
            ))}
          </select>
        </label>
      )}
      {product.options.colors && (
        <fieldset className="selector-group">
          <legend>Colour <span>{selection.color ? `· ${selection.color}` : '· Choose one'}</span></legend>
          <div className="color-options">
            {product.options.colors.map((option) => (
              <button
                className={`color-choice color-${option.toLowerCase()} ${selection.color === option ? 'selected' : ''}`}
                type="button"
                key={option}
                aria-label={`Select ${option} colour`}
                aria-pressed={selection.color === option}
                onClick={() => onChange({ ...selection, color: option })}
              />
            ))}
          </div>
        </fieldset>
      )}
      <div className="product-price-row">
        <span className="product-price">{selectedPrice === undefined ? 'Choose yardage' : formatNaira(selectedPrice)}</span>
        {selection.yardage && <span className="price-unit">for {selection.yardage}</span>}
      </div>
    </div>
  );
}

export function ProductCard({
  product,
  index,
  onCustomize,
}: {
  product: Product;
  index: number;
  onCustomize: (product: Product, color: string) => void;
}) {
  const { addItem } = useShop();
  const [selection, setSelection] = useState<ProductSelection>({});
  const [added, setAdded] = useState(false);
  const selectedPrice = getSelectedPrice(product, selection);
  const needsSize = Boolean(product.options.sizes && !selection.size);
  const needsColor = Boolean(product.options.colors && !selection.color);
  const needsYardage = Boolean(product.options.yardage && !selection.yardage);
  const canAdd = !needsSize && !needsColor && !needsYardage;
  const customizable = Boolean(product.customization?.enabled);

  const updateSelection = (nextSelection: ProductSelection) => {
    setSelection(nextSelection);
    setAdded(false);
  };

  const handleAdd = () => {
    if (!canAdd) return;
    addItem(createCartItemDraft(product, selection));
    setAdded(true);
  };

  const handleCustomize = () => {
    if (!canAdd || !customizable || !selection.color) return;
    onCustomize(product, selection.color);
  };

  const buttonLabel = !canAdd
    ? `Choose ${needsSize ? 'size' : needsColor ? 'colour' : 'yardage'} to add`
    : `${added ? 'Add one more' : 'Add to Cart'} · ${formatNaira(selectedPrice ?? product.price)}`;

  return (
    <article
      className="product-card"
      id={product.customization?.enabled ? 'product-customize' : `product-${product.id}`}
    >
      <div className="product-image-wrap">
        <img
          src={product.image}
          alt={product.name}
          width="640"
          height="640"
          loading="lazy"
          decoding="async"
        />
        {product.availability && <span className="product-badge">{product.availability}</span>}
        <span className="product-index">0{index + 1}</span>
      </div>
      <div className="product-card-body">
        <div className="product-title-row">
          <div>
            <p className="product-category">{product.category}</p>
            <h3>{product.name}</h3>
          </div>
        </div>
        <p className="product-description">{product.description}</p>
        <ProductSelectors product={product} selection={selection} onChange={updateSelection} />
        <div className="product-action-group">
          <button
            className="product-action-button"
            type="button"
            disabled={!canAdd}
            onClick={handleAdd}
          >
            {buttonLabel}
          </button>
          {customizable && (
            <button
              className="product-action-button product-action-secondary"
              type="button"
              disabled={!canAdd}
              onClick={handleCustomize}
            >
              {needsColor ? 'Choose a colour to customize' : 'Customize Your Item'}
              <ArrowRight size={15} aria-hidden="true" />
            </button>
          )}
        </div>
        {added && <p className="product-added-note" role="status">Added to your shopping bag.</p>}
      </div>
    </article>
  );
}

function ProductSection({
  activeCategory,
  onCategoryChange,
  searchText,
  onSearchChange,
  onCustomize,
}: {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  searchText: string;
  onSearchChange: (query: string) => void;
  onCustomize: (product: Product, color: string) => void;
}) {
  const featuredProducts = featuredProductsDataSource.listFeaturedProducts();
  const filteredProducts = filterProducts(featuredProducts, searchText, activeCategory);
  const hasFilter = Boolean(searchText.trim()) || activeCategory !== 'All categories';

  return (
    <section className="product-section" id="products">
      <div className="page-shell">
        <div className="product-heading-row">
          <SectionHeading
            eyebrow="Considered details, everyday character"
            title="Featured Products"
            intro="A few favourites from our world of personal, expressive style."
          />
          <span className="featured-count">
            {filteredProducts.length === featuredProducts.length
              ? `01 — ${String(featuredProducts.length).padStart(2, '0')}`
              : `${filteredProducts.length} OF ${featuredProducts.length}`}
          </span>
        </div>
        <div className="product-controls">
          <label className="product-search">
            <Search size={17} aria-hidden="true" />
            <span className="sr-only">Search featured products</span>
            <input
              type="search"
              value={searchText}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Search the collection"
            />
            {searchText && (
              <button type="button" aria-label="Clear product search" onClick={() => onSearchChange('')}>
                <X size={16} />
              </button>
            )}
          </label>
          <label className="product-category-filter">
            <span>Category</span>
            <select value={activeCategory} onChange={(event) => onCategoryChange(event.target.value)}>
              <option>All categories</option>
              {categories.map((category) => <option key={category.name}>{category.name}</option>)}
            </select>
          </label>
        </div>
        {filteredProducts.length > 0 ? (
          <div className="product-grid">
            {filteredProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} onCustomize={onCustomize} />
            ))}
          </div>
        ) : (
          <div className="products-empty-state">
            <p className="eyebrow">{activeCategory === 'All categories' ? 'No matches yet' : activeCategory}</p>
            <h3>
              {activeCategory === 'All categories'
                ? `No products match “${searchText.trim()}”.`
                : `No products are currently listed in ${activeCategory}.`}
            </h3>
            <p>
              {activeCategory === 'All categories'
                ? 'Try another search, or clear the search to see the featured collection.'
                : 'Browse the configured featured products or contact us for help with this collection.'}
            </p>
            <button
              className="commerce-secondary-button"
              type="button"
              onClick={() => {
                onSearchChange('');
                onCategoryChange('All categories');
              }}
            >
              View all featured products
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

function CraftsmanshipSection() {
  return (
    <section className="craft-section">
      <div className="page-shell craft-layout">
        <div className="craft-copy">
          <p className="eyebrow">Rooted in care. Made with purpose.</p>
          <h2>Craftsmanship<br />You Can <em>Trust.</em></h2>
          <p>
            Registered and built on a passion for craftsmanship, creativity and personal expression, The Ronkus Brand brings together distinctive fashion and handmade quality.
          </p>
          <span className="craft-signature">The Ronkus Brand</span>
        </div>
        <figure className="certificate-frame">
          <img src="/assets/cac-registration.jpg" alt="The Ronkus Brand Certificate of Registration from the Corporate Affairs Commission" width="900" height="1100" loading="lazy" decoding="async" />
          <figcaption>Registration document</figcaption>
        </figure>
        <span className="craft-side-note" aria-hidden="true">DETAILS MATTER · MADE WITH CARE ·</span>
      </div>
    </section>
  );
}

function CarouselSection({
  items,
  testimonials = false,
}: {
  items: { src: string; alt: string }[];
  testimonials?: boolean;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const scrollCarousel = (direction: -1 | 1) => {
    const track = trackRef.current;
    if (track) {
      track.scrollBy({
        left: direction * Math.max(track.clientWidth * 0.72, 240),
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className={`carousel-shell${testimonials ? '' : ' community-carousel'}`}>
      <div
        ref={trackRef}
        className={`carousel-track ${testimonials ? 'testimonial-track' : 'community-track'}`}
        role="region"
        aria-label={testimonials ? 'Customer testimonials' : 'Ronkus community photos'}
        tabIndex={0}
      >
        {items.map((item, index) => (
          <figure className="carousel-item" key={item.src}>
            <img src={item.src} alt={item.alt} width="640" height="760" loading="lazy" decoding="async" />
            <figcaption className="sr-only">
              {testimonials ? `Customer testimonial ${index + 1}` : item.alt}
            </figcaption>
          </figure>
        ))}
      </div>
      <div className="carousel-controls">
        <button
          type="button"
          aria-label={`Previous ${testimonials ? 'testimonial' : 'community'} images`}
          onClick={() => scrollCarousel(-1)}
        >
          <ArrowLeft size={17} />
        </button>
        <button
          type="button"
          aria-label={`Next ${testimonials ? 'testimonial' : 'community'} images`}
          onClick={() => scrollCarousel(1)}
        >
          <ArrowRight size={17} />
        </button>
      </div>
    </div>
  );
}

function TestimonialsSection() {
  return (
    <section className="testimonials-section page-shell">
      <div className="testimonial-heading">
        <div>
          <p className="eyebrow">A little love, shared</p>
          <h2 className="section-title">Loved by Our Customers</h2>
        </div>
        <p className="carousel-hint">Swipe to see more <ArrowRight size={15} /></p>
      </div>
      <CarouselSection items={testimonialImages} testimonials />
    </section>
  );
}

function CommunitySection() {
  return (
    <section className="community-section" id="community">
      <div className="page-shell">
        <div className="community-heading">
          <div>
            <p className="eyebrow">People make the story</p>
            <h2 className="section-title">Become Part of the<br /><em>Ronkus Community.</em></h2>
          </div>
          <div className="community-copy">
            <p>Style is even better when it is shared. Discover the people, creativity and individuality behind The Ronkus Brand.</p>
            <div className="social-actions">
              <a className="button-primary" href={instagramUrl} target="_blank" rel="noopener noreferrer">
                <Instagram size={16} /> Follow on Instagram
              </a>
              <a className="social-text-link" href={facebookUrl} target="_blank" rel="noopener noreferrer">Find us on Facebook <ArrowRight size={14} /></a>
            </div>
          </div>
        </div>
      </div>
      <CarouselSection items={communityImages} />
    </section>
  );
}

function AcademySection() {
  return (
    <section className="academy-section" id="academy">
      <div className="page-shell academy-inner">
        <p className="eyebrow">Learn the work behind the work</p>
        <h2>Shoemaking, from the<br /><em>first step forward.</em></h2>
        <p>
          Turn your interest in shoemaking into practical skills with The Ronkus Brand Shoemaking Academy. Learn the craft while developing the creative and business skills to take your ideas further.
        </p>
        <Link className="button-light" href="/academy">Explore the Shoemaking Academy <ArrowRight size={16} /></Link>
      </div>
      <span className="academy-mark" aria-hidden="true">R</span>
    </section>
  );
}

export default function Homepage() {
  const { addItem, setCartOpen } = useShop();
  const [activeCategory, setActiveCategory] = useState('All categories');
  const [searchText, setSearchText] = useState('');
  const [customizeTarget, setCustomizeTarget] = useState<{ product: Product; color: string } | null>(null);

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
      <Hero />
      <CategorySection />
      <ProductSection
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        searchText={searchText}
        onSearchChange={setSearchText}
        onCustomize={(product, color) => setCustomizeTarget({ product, color })}
      />
      <CraftsmanshipSection />
      <TestimonialsSection />
      <CommunitySection />
      <AcademySection />
      <CustomizeItemDialog
        product={customizeTarget?.product ?? null}
        selectedColor={customizeTarget?.color}
        onClose={() => setCustomizeTarget(null)}
        onAddToCart={addCustomizedItem}
      />
    </>
  );
}
