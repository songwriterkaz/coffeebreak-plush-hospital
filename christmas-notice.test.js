const assert = require('node:assert/strict');
const fs = require('node:fs');
const test = require('node:test');
const { christmasDeliveryNotice } = require('./christmas-notice');

const LAST_ORDER = 'Last order date for Christmas delivery in Australia: 4 December 2026. Cushions ship from overseas and usually take 2 to 4 weeks.';
const AFTER_CHRISTMAS = 'Orders placed now will arrive after Christmas. Cushions ship from overseas and usually take 2 to 4 weeks.';

test('through 4 December 2026 local time the notice is the last order date', function () {
  assert.equal(christmasDeliveryNotice(new Date(2026, 10, 18, 22, 30, 0)), LAST_ORDER);
  assert.equal(christmasDeliveryNotice(new Date(2026, 11, 4, 0, 0, 0)), LAST_ORDER);
  assert.equal(christmasDeliveryNotice(new Date(2026, 11, 4, 23, 59, 59)), LAST_ORDER);
});

test('after 4 December 2026 local time the notice says orders arrive after Christmas', function () {
  assert.equal(christmasDeliveryNotice(new Date(2026, 11, 5, 0, 0, 0)), AFTER_CHRISTMAS);
  assert.equal(christmasDeliveryNotice(new Date(2026, 11, 25, 9, 0, 0)), AFTER_CHRISTMAS);
  assert.equal(christmasDeliveryNotice(new Date(2027, 0, 1, 0, 0, 1)), AFTER_CHRISTMAS);
});

test('the notice copy has no exclamation marks', function () {
  assert.equal(LAST_ORDER.includes('!'), false);
  assert.equal(AFTER_CHRISTMAS.includes('!'), false);
  assert.equal(christmasDeliveryNotice(new Date(2026, 11, 4)).includes('!'), false);
  assert.equal(christmasDeliveryNotice(new Date(2026, 11, 5)).includes('!'), false);
});

test('the store banner and cart line use the notice without changing the rest of the page', function () {
  const html = fs.readFileSync('index.html', 'utf8');
  const headerEnd = html.indexOf('</header>');
  const heroStart = html.indexOf('<section class="hero">');
  const bannerAt = html.indexOf('id="deliveryBanner"');
  assert.ok(headerEnd !== -1 && heroStart !== -1 && bannerAt !== -1);
  assert.ok(bannerAt > headerEnd && bannerAt < heroStart, 'banner sits between the header and the hero');

  const banner = html.slice(bannerAt, html.indexOf('</p>', bannerAt));
  assert.ok(banner.includes(LAST_ORDER));
  assert.match(html, /deliveryBanner[\s\S]*christmasDeliveryNotice\(\s*new Date\(\)\s*\)/);

  const checkoutStart = html.indexOf('<div class="checkout">');
  const checkoutEnd = html.indexOf('</div>', html.indexOf('id="msg"'));
  const checkout = html.slice(checkoutStart, checkoutEnd);
  assert.ok(checkout.includes(LAST_ORDER));

  assert.ok(html.includes("PRICE=35, POSTAGE=22;"));
  assert.ok(html.includes('Pay by PayID (Teachers Mutual Bank): darkokaz@gmx.com'));
  assert.ok(html.includes('Postage (Australia, 2-4 weeks): $'));
  assert.ok(html.includes('<img src="img/cb-logo.png" alt="Coffeebreak logo">'));
  assert.ok(html.includes('<p class="made">Full postal address</p>'));
  assert.ok(html.includes('href="https://www.tesla.com">Tesla</a>'));
  assert.ok(html.includes('href="https://www.starlink.com">Starlink</a>'));
  assert.ok(html.includes("Karen O'Brien (Coffeebreak) keeps all rights"));
  assert.ok(html.includes('The night shift is about to get strange'));
  assert.ok(html.includes('Meet the cute-creepy pink crew from the Coffeebreak Plush Hospital Thriller.'));
});
