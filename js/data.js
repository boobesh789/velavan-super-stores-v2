/* ==========================================================================
   Velavan Super Stores — Site Content Data
   Edit this file to change categories, products, offers, gallery, or reviews.
   No store photos have been uploaded yet — product/gallery images use emoji
   placeholders. Replace `image: null` with a path like
   "assets/images/products/rice-1kg.jpg" once photos are added, and the
   markup will automatically render <img> instead of the emoji icon.
   ========================================================================== */

const STORE_DATA = {
  categories: [
    { id: 'grocery',   label: 'Grocery',    icon: '🌾' },
    { id: 'vegetables', label: 'Vegetables', icon: '🥦' },
    { id: 'fruits',    label: 'Fruits',      icon: '🍎' },
    { id: 'dairy',     label: 'Dairy',       icon: '🥛' },
    { id: 'snacks',    label: 'Snacks',      icon: '🍪' },
    { id: 'beverages', label: 'Beverages',   icon: '🧃' },
    { id: 'household', label: 'Household',   icon: '🧺' },
    { id: 'personal',  label: 'Personal Care', icon: '🧴' },
  ],

  products: [
    { id: 'p1', name: 'Sona Masoori Rice 5kg', category: 'grocery', price: 340, unit: '5 kg bag', icon: '🌾', image: null, tag: null },
    { id: 'p2', name: 'Toor Dal 1kg', category: 'grocery', price: 165, unit: '1 kg pack', icon: '🫘', image: null, tag: null },
    { id: 'p3', name: 'Sunflower Oil 1L', category: 'grocery', price: 148, unit: '1 litre', icon: '🛢️', image: null, tag: 'Popular' },
    { id: 'p4', name: 'Fresh Tomatoes', category: 'vegetables', price: 30, unit: '1 kg', icon: '🍅', image: null, tag: null },
    { id: 'p5', name: 'Onions', category: 'vegetables', price: 28, unit: '1 kg', icon: '🧅', image: null, tag: null },
    { id: 'p6', name: 'Potatoes', category: 'vegetables', price: 25, unit: '1 kg', icon: '🥔', image: null, tag: null },
    { id: 'p7', name: 'Green Chillies', category: 'vegetables', price: 12, unit: '250 g', icon: '🌶️', image: null, tag: null },
    { id: 'p8', name: 'Bananas', category: 'fruits', price: 45, unit: 'dozen', icon: '🍌', image: null, tag: null },
    { id: 'p9', name: 'Apples', category: 'fruits', price: 180, unit: '1 kg', icon: '🍎', image: null, tag: 'Fresh' },
    { id: 'p10', name: 'Full Cream Milk', category: 'dairy', price: 32, unit: '500 ml', icon: '🥛', image: null, tag: null },
    { id: 'p11', name: 'Curd (Fresh)', category: 'dairy', price: 40, unit: '400 g cup', icon: '🍶', image: null, tag: null },
    { id: 'p12', name: 'Paneer', category: 'dairy', price: 90, unit: '200 g', icon: '🧀', image: null, tag: null },
    { id: 'p13', name: 'Banana Chips', category: 'snacks', price: 55, unit: '200 g pack', icon: '🍌', image: null, tag: 'Local Favourite' },
    { id: 'p14', name: 'Murukku', category: 'snacks', price: 60, unit: '250 g pack', icon: '🥨', image: null, tag: null },
    { id: 'p15', name: 'Biscuits Assorted', category: 'snacks', price: 30, unit: 'pack', icon: '🍪', image: null, tag: null },
    { id: 'p16', name: 'Buttermilk', category: 'beverages', price: 15, unit: '200 ml', icon: '🥤', image: null, tag: null },
    { id: 'p17', name: 'Tea Powder', category: 'beverages', price: 95, unit: '250 g', icon: '🍵', image: null, tag: null },
    { id: 'p18', name: 'Filter Coffee Powder', category: 'beverages', price: 110, unit: '250 g', icon: '☕', image: null, tag: 'Popular' },
    { id: 'p19', name: 'Dish Wash Liquid', category: 'household', price: 85, unit: '500 ml', icon: '🧴', image: null, tag: null },
    { id: 'p20', name: 'Laundry Detergent', category: 'household', price: 120, unit: '1 kg', icon: '🧺', image: null, tag: null },
    { id: 'p21', name: 'Incense Sticks', category: 'household', price: 40, unit: 'pack', icon: '🕯️', image: null, tag: null },
    { id: 'p22', name: 'Toothpaste', category: 'personal', price: 65, unit: '150 g', icon: '🪥', image: null, tag: null },
    { id: 'p23', name: 'Bathing Soap (3-pack)', category: 'personal', price: 90, unit: '3 x 100 g', icon: '🧼', image: null, tag: null },
    { id: 'p24', name: 'Hair Oil', category: 'personal', price: 75, unit: '200 ml', icon: '🧴', image: null, tag: null },
  ],

  offers: [
    { badge: 'This Week', title: '10% off on all Grocery', desc: 'Rice, dals, oils & staples — every day essentials, less spend.' },
    { badge: 'Fresh Deal', title: 'Buy 2kg Vegetables, Get Coriander Free', desc: 'On all fresh vegetable purchases above 2kg.' },
    { badge: 'Combo', title: 'Tea + Biscuits Combo ₹99', desc: 'Filter coffee powder or tea powder with any biscuit pack.' },
  ],

  gallery: [
    // size values matched to each photo's real aspect ratio so object-fit:cover
    // doesn't crop away the important content:
    //   'wide' = landscape/panoramic shots (aspect ~1.3-1.9)
    //   'tall' = portrait/vertical shots (aspect < 0.8)
    //   ''     = roughly square-ish, fits default 1-col tile
    { image: 'assets/images/gallery/storefront-exterior.jpg', label: 'Store Front', size: 'wide' },
    { image: 'assets/images/gallery/snacks-confectionery.jpg', label: 'Snacks & Confectionery', size: 'tall' },
    { image: 'assets/images/gallery/personal-care-aisle.jpg', label: 'Personal Care Section', size: 'wide' },
    { image: 'assets/images/gallery/billing-counter.jpg', label: 'Billing Counter', size: 'wide' },
    { image: 'assets/images/gallery/store-aisle-wide.jpg', label: 'Store Aisles', size: 'tall' },
    { image: 'assets/images/gallery/toy-section-2.jpg', label: 'Toys & Gifts', size: 'tall' },
    { image: 'assets/images/gallery/grocery-aisle.jpg', label: 'Grocery Aisle', size: 'wide' },
    { image: 'assets/images/gallery/store-interior.jpg', label: 'Store Interior', size: 'wide' },
  ],

  reviews: [
    { name: 'Karthik R.', stars: 5, text: 'Everything I need is here — fresh vegetables and the staff always help me find things quickly.' },
    { name: 'Meena S.', stars: 5, text: 'Best general store near Salangapalayam. Good prices and it stays open till late which really helps.' },
    { name: 'Prakash V.', stars: 4, text: 'Great variety for a store this size. Would love more snack options but overall very happy.' },
    { name: 'Divya M.', stars: 5, text: 'Clean, well organised, and the owner is always polite. My family shops here every week.' },
    { name: 'Suresh K.', stars: 5, text: 'Quick WhatsApp ordering saved me a trip during the rains. Delivered fresh and on time.' },
  ],
};
/* ==========================================================================
   Velavan Super Stores — Site Content Data
   Edit this file to change categories, products, offers, gallery, or reviews.
   No store photos have been uploaded yet — product/gallery images use emoji
   placeholders. Replace `image: null` with a path like
   "assets/images/products/rice-1kg.jpg" once photos are added, and the
   markup will automatically render <img> instead of the emoji icon.
   ========================================================================== */

const STORE_DATA = {
  categories: [
    { id: 'grocery',   label: 'Grocery',    icon: '🌾' },
    { id: 'vegetables', label: 'Vegetables', icon: '🥦' },
    { id: 'fruits',    label: 'Fruits',      icon: '🍎' },
    { id: 'dairy',     label: 'Dairy',       icon: '🥛' },
    { id: 'snacks',    label: 'Snacks',      icon: '🍪' },
    { id: 'beverages', label: 'Beverages',   icon: '🧃' },
    { id: 'household', label: 'Household',   icon: '🧺' },
    { id: 'personal',  label: 'Personal Care', icon: '🧴' },
  ],

  products: [
    { id: 'p1', name: 'Sona Masoori Rice 5kg', category: 'grocery', price: 340, unit: '5 kg bag', icon: '🌾', image: null, tag: null },
    { id: 'p2', name: 'Toor Dal 1kg', category: 'grocery', price: 165, unit: '1 kg pack', icon: '🫘', image: null, tag: null },
    { id: 'p3', name: 'Sunflower Oil 1L', category: 'grocery', price: 148, unit: '1 litre', icon: '🛢️', image: null, tag: 'Popular' },
    { id: 'p4', name: 'Fresh Tomatoes', category: 'vegetables', price: 30, unit: '1 kg', icon: '🍅', image: null, tag: null },
    { id: 'p5', name: 'Onions', category: 'vegetables', price: 28, unit: '1 kg', icon: '🧅', image: null, tag: null },
    { id: 'p6', name: 'Potatoes', category: 'vegetables', price: 25, unit: '1 kg', icon: '🥔', image: null, tag: null },
    { id: 'p7', name: 'Green Chillies', category: 'vegetables', price: 12, unit: '250 g', icon: '🌶️', image: null, tag: null },
    { id: 'p8', name: 'Bananas', category: 'fruits', price: 45, unit: 'dozen', icon: '🍌', image: null, tag: null },
    { id: 'p9', name: 'Apples', category: 'fruits', price: 180, unit: '1 kg', icon: '🍎', image: null, tag: 'Fresh' },
    { id: 'p10', name: 'Full Cream Milk', category: 'dairy', price: 32, unit: '500 ml', icon: '🥛', image: null, tag: null },
    { id: 'p11', name: 'Curd (Fresh)', category: 'dairy', price: 40, unit: '400 g cup', icon: '🍶', image: null, tag: null },
    { id: 'p12', name: 'Paneer', category: 'dairy', price: 90, unit: '200 g', icon: '🧀', image: null, tag: null },
    { id: 'p13', name: 'Banana Chips', category: 'snacks', price: 55, unit: '200 g pack', icon: '🍌', image: null, tag: 'Local Favourite' },
    { id: 'p14', name: 'Murukku', category: 'snacks', price: 60, unit: '250 g pack', icon: '🥨', image: null, tag: null },
    { id: 'p15', name: 'Biscuits Assorted', category: 'snacks', price: 30, unit: 'pack', icon: '🍪', image: null, tag: null },
    { id: 'p16', name: 'Buttermilk', category: 'beverages', price: 15, unit: '200 ml', icon: '🥤', image: null, tag: null },
    { id: 'p17', name: 'Tea Powder', category: 'beverages', price: 95, unit: '250 g', icon: '🍵', image: null, tag: null },
    { id: 'p18', name: 'Filter Coffee Powder', category: 'beverages', price: 110, unit: '250 g', icon: '☕', image: null, tag: 'Popular' },
    { id: 'p19', name: 'Dish Wash Liquid', category: 'household', price: 85, unit: '500 ml', icon: '🧴', image: null, tag: null },
    { id: 'p20', name: 'Laundry Detergent', category: 'household', price: 120, unit: '1 kg', icon: '🧺', image: null, tag: null },
    { id: 'p21', name: 'Incense Sticks', category: 'household', price: 40, unit: 'pack', icon: '🕯️', image: null, tag: null },
    { id: 'p22', name: 'Toothpaste', category: 'personal', price: 65, unit: '150 g', icon: '🪥', image: null, tag: null },
    { id: 'p23', name: 'Bathing Soap (3-pack)', category: 'personal', price: 90, unit: '3 x 100 g', icon: '🧼', image: null, tag: null },
    { id: 'p24', name: 'Hair Oil', category: 'personal', price: 75, unit: '200 ml', icon: '🧴', image: null, tag: null },
  ],

  offers: [
    { badge: 'This Week', title: '10% off on all Grocery', desc: 'Rice, dals, oils & staples — every day essentials, less spend.' },
    { badge: 'Fresh Deal', title: 'Buy 2kg Vegetables, Get Coriander Free', desc: 'On all fresh vegetable purchases above 2kg.' },
    { badge: 'Combo', title: 'Tea + Biscuits Combo ₹99', desc: 'Filter coffee powder or tea powder with any biscuit pack.' },
  ],

  gallery: [
    { image: 'assets/images/gallery/storefront-exterior.jpg', label: 'Store Front', size: 'wide' },
    { image: 'assets/images/gallery/store-aisle-wide.jpg', label: 'Store Aisles', size: 'tall' },
    { image: 'assets/images/gallery/personal-care-aisle.jpg', label: 'Personal Care Section', size: '' },
    { image: 'assets/images/gallery/billing-counter.jpg', label: 'Billing Counter', size: '' },
    { image: 'assets/images/gallery/snacks-confectionery.jpg', label: 'Snacks & Confectionery', size: 'tall' },
    { image: 'assets/images/gallery/toy-section-2.jpg', label: 'Toys & Gifts', size: 'wide' },
    { image: 'assets/images/gallery/grocery-aisle.jpg', label: 'Grocery Aisle', size: '' },
    { image: 'assets/images/gallery/store-interior.jpg', label: 'Store Interior', size: '' },
  ],

  reviews: [
    { name: 'Karthik R.', stars: 5, text: 'Everything I need is here — fresh vegetables and the staff always help me find things quickly.' },
    { name: 'Meena S.', stars: 5, text: 'Best general store near Salangapalayam. Good prices and it stays open till late which really helps.' },
    { name: 'Prakash V.', stars: 4, text: 'Great variety for a store this size. Would love more snack options but overall very happy.' },
    { name: 'Divya M.', stars: 5, text: 'Clean, well organised, and the owner is always polite. My family shops here every week.' },
    { name: 'Suresh K.', stars: 5, text: 'Quick WhatsApp ordering saved me a trip during the rains. Delivered fresh and on time.' },
  ],
};
      
