export type FaqGroup =
  | 'ORDERING'
  | 'CUSTOM ORDERS'
  | 'DELIVERY & PAYMENT'
  | 'ABOUT & ACADEMY';

export type FaqItem = {
  group: FaqGroup;
  question: string;
  answer: string;
};

export const faqItems: FaqItem[] = [
  {
    group: 'ORDERING',
    question: 'How do I place an order?',
    answer: 'Add your pieces to your bag, then choose Checkout via WhatsApp. Your order summary is sent straight to us, and we confirm availability, your total and delivery details with you there.',
  },
  {
    group: 'ORDERING',
    question: 'Are your products really handmade?',
    answer: 'Yes. Every item is crafted by skilled artisans who pay close attention to detail, from stitching to finishing touches. We use premium leathers, durable fabrics and silk-soft satin so each piece looks beautiful and lasts.',
  },
  {
    group: 'ORDERING',
    question: 'How do I choose my size?',
    answer: 'Sizes vary by style. Many of our footwear styles are available across a range of sizes, and we can make a pair to fit your feet. Tell us your size when you order, or message us on WhatsApp and we will guide you.',
  },
  {
    group: 'CUSTOM ORDERS',
    question: 'Can I order something personalised?',
    answer: 'Absolutely. We make customised pieces including branded tees, personalised T-shirts, aprons and tote bags. You can choose your colours, embroidery or design, and we will bring your idea to life.',
  },
  {
    group: 'CUSTOM ORDERS',
    question: 'How much do custom pieces cost?',
    answer: 'Pricing depends on the item and the design or content you want. Send us your idea on WhatsApp and we will give you a clear quote.',
  },
  {
    group: 'CUSTOM ORDERS',
    question: 'Can I order branded items for my business or event?',
    answer: 'Yes. We make branded aprons, chef caps, tees and tote bags for businesses, kitchens and events. Message us your design and the quantity you need for a quote.',
  },
  {
    group: 'DELIVERY & PAYMENT',
    question: 'Where are you based?',
    answer: 'We are based in Ile-Ife, Osun State, Nigeria.',
  },
  {
    group: 'DELIVERY & PAYMENT',
    question: 'Do you offer delivery or pickup?',
    answer: 'You can choose pickup or delivery. Delivery fees depend on your area, and we confirm the fee with you before your order is finalised. Message us with your location and we will confirm what is available.',
  },
  {
    group: 'DELIVERY & PAYMENT',
    question: 'How do I pay?',
    answer: 'After you send your order on WhatsApp, we confirm the total and share payment details with you there.',
  },
  {
    group: 'DELIVERY & PAYMENT',
    question: 'How long will my order take?',
    answer: 'Ready-to-order pieces are quicker. Made-to-order and customised pieces take longer because each one is made for you. We will confirm a timeline when we confirm your order.',
  },
  {
    group: 'ABOUT & ACADEMY',
    question: 'Who is The Ronkus Brand?',
    answer: 'The Ronkus Brand is a Nigerian fashion and lifestyle brand founded in 2017, making handmade unisex footwear, bags, clothing, hair accessories, chef aprons and caps, and more. We make your outfits complete.',
  },
  {
    group: 'ABOUT & ACADEMY',
    question: 'Do you teach shoemaking?',
    answer: 'Yes. Our Shoemaking Academy offers hands-on training for beginners who want to become skilled shoemakers. See the Shoemaking Academy page for details, or message us on WhatsApp.',
  },
  {
    group: 'ABOUT & ACADEMY',
    question: 'How can I stay updated on new pieces and offers?',
    answer: 'Join our community and follow us on WhatsApp Status and Instagram (@the_ronkus_brand) for styling tips, behind-the-scenes looks and exclusive offers.',
  },
];
