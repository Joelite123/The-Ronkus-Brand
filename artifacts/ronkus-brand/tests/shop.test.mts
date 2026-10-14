import assert from 'node:assert/strict';
import test from 'node:test';
import { customizationSettings, products } from '../src/data/catalog.ts';
import {
  buildWhatsAppMessage,
  buildWhatsAppUrl,
  createCartItemDraft,
  filterProducts,
  getCartSubtotal,
  mergeCartItem,
  type CartItem,
} from '../src/lib/shop.ts';

const essence = products.find((product) => product.id === 'essence')!;
const apron = products.find((product) => product.id === 'customized-apron')!;
const fabric = products.find((product) => product.id === 'african-print-fabrics')!;

test('cart additions require each configured option', () => {
  assert.throws(() => createCartItemDraft(essence, { size: '36' }), /Select a colour/);
  assert.throws(() => createCartItemDraft(essence, { color: 'Red' }), /Select a size/);
  assert.throws(() => createCartItemDraft(essence, { size: '44', color: 'Red' }), /Select a size/);
  assert.throws(() => createCartItemDraft(fabric, {}), /Select a yardage/);
});

test('yardage selection controls the product price', () => {
  const threeYards = createCartItemDraft(fabric, { yardage: '3 yards' });
  const sixYards = createCartItemDraft(fabric, { yardage: '6 yards' });
  assert.equal(threeYards.unitPrice, 3000);
  assert.equal(sixYards.unitPrice, 6000);
  assert.equal(threeYards.options.color, undefined);
});

test('customized apron keeps colour, instructions and its configured fee', () => {
  const customized = createCartItemDraft(
    apron,
    { color: 'Pink' },
    {
      type: 'Branding/Logo',
      instructions: 'Place the round logo at the centre of the top pocket.',
      fee: customizationSettings.fee,
    },
  );
  assert.equal(customized.options.color, 'Pink');
  assert.equal(customized.options.customization?.type, 'Branding/Logo');
  assert.equal(customized.options.customization?.instructions, 'Place the round logo at the centre of the top pocket.');
  assert.equal(customized.options.customization?.fee, 2000);
  assert.equal(customized.unitPrice, 12000);
});

test('matching variants merge while different options and instructions stay distinct', () => {
  const first = createCartItemDraft(essence, { size: '38', color: 'Black' });
  const same = createCartItemDraft(essence, { size: '38', color: 'Black' });
  const differentSize = createCartItemDraft(essence, { size: '39', color: 'Black' });
  let cart: CartItem[] = [];
  cart = mergeCartItem(cart, first);
  cart = mergeCartItem(cart, same);
  cart = mergeCartItem(cart, differentSize);
  assert.equal(cart.length, 2);
  assert.deepEqual(cart.map((item) => item.quantity), [2, 1]);

  const customOne = createCartItemDraft(apron, { color: 'Red' }, {
    type: 'Personalised Details',
    instructions: 'Add the name Tola on the upper chest.',
    fee: 2000,
  });
  const customTwo = createCartItemDraft(apron, { color: 'Red' }, {
    type: 'Personalised Details',
    instructions: 'Add the name Zainab on the upper chest.',
    fee: 2000,
  });
  cart = mergeCartItem(cart, customOne);
  cart = mergeCartItem(cart, customTwo);
  assert.equal(cart.length, 4);
  assert.equal(cart[2].quantity, 1);
  assert.equal(cart[3].quantity, 1);
  assert.equal(getCartSubtotal(cart), 69000);
});

test('search and category filters only return configured inventory', () => {
  assert.deepEqual(filterProducts(products, 'slides', 'All categories').map((item) => item.id), ['essence']);
  assert.deepEqual(filterProducts(products, '', 'Clothing & Fabrics').map((item) => item.id), [
    'african-print-fabrics',
    'men-vintage-shirt',
  ]);
  assert.deepEqual(filterProducts(products, '', 'Bags & Totes'), []);
});

test('WhatsApp order message and URL include customer, options, customization and calculated totals', () => {
  const cartItem = createCartItemDraft(apron, { color: 'Black' }, {
    type: 'Other Request',
    instructions: 'Add a small name on the left pocket.',
    fee: 2000,
  });
  const cart = mergeCartItem([], cartItem);
  const message = buildWhatsAppMessage(
    { name: 'Ada Okafor', phone: '+234 800 111 2222', address: '12 Market Road, Lagos' },
    cart,
    getCartSubtotal(cart),
  );
  const url = new URL(buildWhatsAppUrl(message));

  assert.equal(url.host, 'wa.me');
  assert.equal(url.pathname, '/2348160309308');
  assert.equal(url.searchParams.get('text'), message);
  assert.match(message, /Name: Ada Okafor/);
  assert.match(message, /Colour: Black/);
  assert.match(message, /Customization type: Other Request/);
  assert.match(message, /Customization fee: ₦?2,000 per item/);
  assert.match(message, /Line total: ₦?12,000/);
  assert.match(message, /Order total: ₦?12,000/);
});
