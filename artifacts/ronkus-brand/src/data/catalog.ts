export type Category = {
  name: string;
  subcategories: string[];
  image: string;
};

export type Product = {
  name: string;
  category: string;
  price: string;
  description: string;
  image: string;
  sizes?: string[];
  colors?: string[];
  yardage?: { label: string; price: string }[];
  badge?: string;
  customize?: boolean;
};

export const categories: Category[] = [
  {
    name: 'Footwear',
    subcategories: ['Sneakers', 'Sandals', 'Loafers', 'Heels', 'Flats', 'Platform', 'Mules'],
    image: '/assets/white-heels.jpg',
  },
  {
    name: 'Bags & Totes',
    subcategories: ['Leather Handbags', 'Totes', 'Carry-alls'],
    image: '/assets/community-customers.jpg',
  },
  {
    name: 'Clothing & Fabrics',
    subcategories: ['Vintage Shirts', 'Tees', 'Hoodies', 'Sweatshirts', 'T-Shirts', 'African Print Fabrics'],
    image: '/assets/african-fabric.jpg',
  },
  {
    name: 'Hair Accessories',
    subcategories: ['Bonnets', 'Scrunchies', 'Scarves', 'Head Wraps'],
    image: '/assets/bonnets.jpg',
  },
  {
    name: 'Chef Aprons & Caps',
    subcategories: ['Cook/Baker Caps', 'Cooking Aprons'],
    image: '/assets/aprons.jpg',
  },
  {
    name: 'Others',
    subcategories: ['Wallets', 'Bottles', 'Bracelets'],
    image: '/assets/leather-wallet.jpg',
  },
];

export const products: Product[] = [
  {
    name: 'ESSENCE',
    category: 'Footwear',
    price: '₦15,000',
    description: 'A refined pair of slides with a clean, versatile look, designed to bring effortless style to everyday outfits.',
    image: '/assets/essence-slides.jpg',
    sizes: ['36', '37', '38', '39', '40', '41', '42', '43'],
    colors: ['Black', 'Red', 'Pink'],
    badge: 'Ready to Order',
  },
  {
    name: 'Customized Apron',
    category: 'Chef Aprons & Caps',
    price: '₦10,000',
    description: 'A practical apron personalized with your chosen design or branding—ideal for cooking, baking and business use.',
    image: '/assets/aprons.jpg',
    colors: ['Black', 'Red', 'Pink'],
    customize: true,
  },
  {
    name: 'African Print Fabrics',
    category: 'Clothing & Fabrics',
    price: '',
    description: 'Vibrant African print fabrics with expressive patterns for creating distinctive outfits and personal styles.',
    image: '/assets/african-fabric.jpg',
    yardage: [
      { label: '3 yards', price: '₦3,000' },
      { label: '6 yards', price: '₦6,000' },
    ],
  },
  {
    name: 'Men Vintage Shirt',
    category: 'Clothing & Fabrics',
    price: '₦10,000',
    description: 'A statement vintage-style shirt featuring expressive prints, with other beautiful prints available.',
    image: '/assets/print-shirt.jpg',
    sizes: ['S', 'M', 'L', 'XL'],
  },
];

export const testimonialImages = [
  { src: '/assets/testimonial-slides.jpg', alt: 'Customer testimonial graphic featuring customized slides' },
  { src: '/assets/testimonial-bag.jpg', alt: 'Customer testimonial graphic featuring a Ronkus Brand bag' },
  { src: '/assets/testimonial-sandals.jpg', alt: 'Customer testimonial graphic featuring handmade sandals' },
];

export const communityImages = [
  { src: '/assets/community-customers.jpg', alt: 'Customers sharing their style in Ronkus Brand tote bags' },
  { src: '/assets/family-style.jpg', alt: 'Family in coordinated expressive print outfits' },
  { src: '/assets/customer-portrait.jpg', alt: 'Founder portrait for The Ronkus Brand' },
  { src: '/assets/blue-ensemble.jpg', alt: 'Customer wearing a blue patterned ensemble' },
  { src: '/assets/style-editorial.jpg', alt: 'Customer wearing an expressive patterned look' },
];
