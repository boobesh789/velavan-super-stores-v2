/* ==========================================================================
   Velavan Super Stores — Main Interactivity
   Handles: header scroll state, mobile drawer, search overlay + live search,
   rendering of categories/products/offers/gallery/reviews from data.js,
   category filtering.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // ---------------------------------------------------------------------
  // Guard: STORE_DATA must be defined by js/data.js, loaded before this
  // file in index.html. If it's missing — wrong script order, a 404 on
  // js/data.js, a case-mismatched filename (GitHub Pages is case-sensitive,
  // unlike Windows), or a duplicate upload — every render call below would
  // throw and silently kill ALL sections (categories, offers, filters,
  // products, gallery, reviews). Previously this only logged to console,
  // which is invisible unless DevTools is open. Now it also shows a plain
  // on-page message so the problem is visible immediately.
  // ---------------------------------------------------------------------
  if (typeof STORE_DATA === 'undefined') {
    const msg = 'STORE_DATA is undefined — js/data.js did not load. ' +
      'Check that js/data.js exists on GitHub with that EXACT name and ' +
      'capitalization, and that it appears before js/main.js in index.html.';
    console.error('[main.js] ' + msg);
    const banner = document.createElement('div');
    banner.setAttribute('role', 'alert');
    banner.style.cssText = 'position:fixed;top:0;left:0;right:0;z-index:9999;' +
      'background:#B00020;color:#fff;padding:14px 20px;font:600 14px/1.5 ' +
      'sans-serif;text-align:center;';
    banner.textContent = '⚠ Website content failed to load: ' + msg;
    document.body.prepend(banner);
    return;
  }

  document.getElementById('year').textContent = new Date().getFullYear();

  /* ---------- Header scroll state ---------- */
  const header = document.getElementById('siteHeader');
  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 12);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile drawer ---------- */
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');

  function closeDrawer() {
    mobileDrawer.classList.remove('open');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
  }
  hamburgerBtn.addEventListener('click', () => {
    const isOpen = mobileDrawer.classList.toggle('open');
    hamburgerBtn.setAttribute('aria-expanded', String(isOpen));
  });
  mobileDrawer.querySelectorAll('a').forEach(a => a.addEventListener('click', closeDrawer));

  /* ---------- Search overlay ---------- */
  const searchToggle = document.getElementById('searchToggle');
  const searchOverlay = document.getElementById('searchOverlay');
  const searchInput = document.getElementById('searchInput');
  const searchClose = document.getElementById('searchClose');
  const searchResults = document.getElementById('searchResults');

  function openSearch() {
    searchOverlay.classList.add('open');
    searchToggle.setAttribute('aria-expanded', 'true');
    setTimeout(() => searchInput.focus(), 200);
  }
  function closeSearch() {
    searchOverlay.classList.remove('open');
    searchToggle.setAttribute('aria-expanded', 'false');
    searchInput.value = '';
    searchResults.innerHTML = '';
  }
  searchToggle.addEventListener('click', () => {
    searchOverlay.classList.contains('open') ? closeSearch() : openSearch();
  });
  searchClose.addEventListener('click', closeSearch);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { closeSearch(); closeDrawer(); }
  });

  function renderSearchResults(query) {
    const q = query.trim().toLowerCase();
    if (!q) { searchResults.innerHTML = ''; return; }
    const matches = STORE_DATA.products.filter(p => p.name.toLowerCase().includes(q));
    if (matches.length === 0) {
      searchResults.innerHTML = `<p class="no-results">No products found for "${escapeHtml(query)}".</p>`;
      return;
    }
    searchResults.innerHTML = matches.slice(0, 8).map(p => `
      <a href="#products" class="search-result-item" data-jump="${p.id}"
         style="display:flex;align-items:center;gap:12px;padding:10px 8px;border-radius:10px;">
        <span style="font-size:1.4rem;">${p.icon}</span>
        <span style="flex:1;">
          <strong style="display:block;font-size:0.92rem;">${escapeHtml(p.name)}</strong>
          <span style="font-size:0.78rem;color:var(--color-ink-soft);">${escapeHtml(p.unit)}</span>
        </span>
        <span style="font-weight:700;color:var(--color-primary);">₹${p.price}</span>
      </a>
    `).join('');

    searchResults.querySelectorAll('[data-jump]').forEach(el => {
      el.addEventListener('click', () => closeSearch());
    });
  }

  searchInput.addEventListener('input', (e) => renderSearchResults(e.target.value));

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  /* ---------- Render Categories ---------- */
  try {
    const categoriesScroll = document.getElementById('categoriesScroll');
    if (!categoriesScroll) throw new Error('#categoriesScroll element not found in DOM');
    categoriesScroll.innerHTML = STORE_DATA.categories.map(cat => `
      <button class="category-chip stagger-item" data-cat="${cat.id}" aria-pressed="false">
        <span class="cat-icon">${cat.icon}</span>
        <span class="cat-label">${cat.label}</span>
      </button>
    `).join('');
  } catch (err) {
    console.error('[main.js] Failed to render categories:', err);
  }

  /* ---------- Render Offers ---------- */
  try {
    const offersGrid = document.getElementById('offersGrid');
    if (!offersGrid) throw new Error('#offersGrid element not found in DOM');
    offersGrid.innerHTML = STORE_DATA.offers.map(o => `
      <div class="offer-card stagger-item">
        <span class="offer-badge">${escapeHtml(o.badge)}</span>
        <h3>${escapeHtml(o.title)}</h3>
        <p>${escapeHtml(o.desc)}</p>
      </div>
    `).join('');
  } catch (err) {
    console.error('[main.js] Failed to render offers:', err);
  }

  /* ---------- Render Product Filter Chips ---------- */
  const filterBar = document.getElementById('filterBar');
  try {
    if (!filterBar) throw new Error('#filterBar element not found in DOM');
    STORE_DATA.categories.forEach(cat => {
      const chip = document.createElement('button');
      chip.className = 'filter-chip';
      chip.dataset.filter = cat.id;
      chip.textContent = cat.label;
      filterBar.appendChild(chip);
    });
  } catch (err) {
    console.error('[main.js] Failed to render filter chips:', err);
  }

  /* ---------- Render Products ---------- */
  const productsGrid = document.getElementById('productsGrid');
  const noResults = document.getElementById('noResults');

  function productCardHtml(p) {
    const media = p.image
      ? `<img src="${p.image}" alt="${escapeHtml(p.name)}" loading="lazy">`
      : p.icon;
    return `
      <article class="product-card stagger-item" data-cat="${p.category}">
        <div class="product-media">
          ${p.tag ? `<span class="product-tag">${escapeHtml(p.tag)}</span>` : ''}
          ${media}
        </div>
        <div class="product-body">
          <span class="product-cat">${escapeHtml(p.category)}</span>
          <span class="product-name">${escapeHtml(p.name)}</span>
          <div class="product-footer">
            <span class="product-price">₹${p.price} <small>/ ${escapeHtml(p.unit)}</small></span>
            <button class="add-btn" aria-label="Enquire about ${escapeHtml(p.name)}" data-product="${p.id}">+</button>
          </div>
        </div>
      </article>
    `;
  }

  function renderProducts(filter = 'all') {
    if (!productsGrid) {
      console.error('[main.js] #productsGrid element not found in DOM — cannot render products.');
      return;
    }
    try {
      const list = filter === 'all'
        ? STORE_DATA.products
        : STORE_DATA.products.filter(p => p.category === filter);

      productsGrid.innerHTML = list.map(productCardHtml).join('');
      if (noResults) noResults.hidden = list.length !== 0;

      productsGrid.querySelectorAll('.add-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const product = STORE_DATA.products.find(p => p.id === btn.dataset.product);
          if (product) {
            const msg = encodeURIComponent(`Hi Velavan Super Stores, I'd like to enquire about: ${product.name} (₹${product.price} / ${product.unit})`);
            window.open(`https://wa.me/919047665999?text=${msg}`, '_blank', 'noopener');
          }
        });
      });

      // Animate newly rendered cards in (GSAP if available)
      if (window.gsap) {
        gsap.fromTo(productsGrid.querySelectorAll('.stagger-item'),
          { opacity: 0, y: 16, scale: 0.98 },
          { opacity: 1, y: 0, scale: 1, duration: 0.45, stagger: 0.03, ease: 'power2.out' }
        );
      } else {
        productsGrid.querySelectorAll('.stagger-item').forEach(el => el.classList.add('is-revealed'));
      }
    } catch (err) {
      console.error('[main.js] Failed to render products:', err);
    }
  }

  renderProducts('all');

  /* ---------- Filter interactions (chips + category cards) ---------- */
  const categoriesScrollEl = document.getElementById('categoriesScroll');

  function setActiveFilter(filterId) {
    if (filterBar) {
      filterBar.querySelectorAll('.filter-chip').forEach(chip => {
        chip.classList.toggle('active', chip.dataset.filter === filterId);
      });
    }
    if (categoriesScrollEl) {
      categoriesScrollEl.querySelectorAll('.category-chip').forEach(chip => {
        const isActive = chip.dataset.cat === filterId;
        chip.classList.toggle('active', isActive);
        chip.setAttribute('aria-pressed', String(isActive));
      });
    }
    renderProducts(filterId);
  }

  if (filterBar) {
    filterBar.addEventListener('click', (e) => {
      const chip = e.target.closest('.filter-chip');
      if (!chip) return;
      setActiveFilter(chip.dataset.filter);
    });
  }

  if (categoriesScrollEl) {
    categoriesScrollEl.addEventListener('click', (e) => {
      const chip = e.target.closest('.category-chip');
      if (!chip) return;
      const alreadyActive = chip.classList.contains('active');
      setActiveFilter(alreadyActive ? 'all' : chip.dataset.cat);
      const productsSection = document.getElementById('products');
      if (productsSection) productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  /* ---------- Render Gallery ---------- */
  try {
    const galleryGrid = document.getElementById('galleryGrid');
    if (!galleryGrid) throw new Error('#galleryGrid element not found in DOM');
    galleryGrid.innerHTML = STORE_DATA.gallery.map(g => {
      const media = g.image
        ? `<img src="${g.image}" alt="${escapeHtml(g.label)}" loading="lazy">`
        : `<span style="font-size:2.4rem;">${g.icon || '🏪'}</span>`;
      return `
        <figure class="gallery-item ${g.size} stagger-item" aria-label="${escapeHtml(g.label)}">
          ${media}
          <figcaption class="gallery-caption">${escapeHtml(g.label)}</figcaption>
        </figure>
      `;
    }).join('');
  } catch (err) {
    console.error('[main.js] Failed to render gallery:', err);
  }

  /* ---------- Render Reviews ---------- */
  try {
    const reviewsTrack = document.getElementById('reviewsTrack');
    if (!reviewsTrack) throw new Error('#reviewsTrack element not found in DOM');
    reviewsTrack.innerHTML = STORE_DATA.reviews.map(r => `
      <article class="review-card stagger-item">
        <div class="review-stars" aria-label="${r.stars} out of 5 stars">${'★'.repeat(r.stars)}${'☆'.repeat(5 - r.stars)}</div>
        <p class="review-text">${escapeHtml(r.text)}</p>
        <p class="review-author">${escapeHtml(r.name)}</p>
      </article>
    `).join('');
  } catch (err) {
    console.error('[main.js] Failed to render reviews:', err);
  }

  // Initial stagger reveal for categories/gallery/reviews handled by animations.js ScrollTrigger
});
/* ==========================================================================
   Velavan Super Stores — Main Interactivity
   Handles: header scroll state, mobile drawer, search overlay + live search,
   rendering of categories/products/offers/gallery/reviews from data.js,
   category filtering.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // ---------------------------------------------------------------------
  // Guard: STORE_DATA must be defined by js/data.js, loaded before this
  // file in index.html. If it's missing — wrong script order, a 404 on
  // js/data.js, or a stray syntax error in data.js — every render call
  // below would previously throw ReferenceError on first use and silently
  // kill ALL sections after it (categories, offers, filters, products,
  // gallery, reviews) with nothing visible to the store owner. Fail loud
  // and stop cleanly instead.
  // ---------------------------------------------------------------------
  if (typeof STORE_DATA === 'undefined') {
    console.error(
      '[main.js] STORE_DATA is undefined. js/data.js did not load before ' +
      'js/main.js, or failed to load entirely. Check: (1) index.html script ' +
      'order — data.js must appear before main.js, (2) the file actually ' +
      'exists at js/data.js on the deployed site, (3) browser Network tab ' +
      'for a 404 on js/data.js.'
    );
    return;
  }

  document.getElementById('year').textContent = new Date().getFullYear();

  /* ---------- Header scroll state ---------- */
  const header = document.getElementById('siteHeader');
  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 12);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile drawer ---------- */
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');

  function closeDrawer() {
    mobileDrawer.classList.remove('open');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
  }
  hamburgerBtn.addEventListener('click', () => {
    const isOpen = mobileDrawer.classList.toggle('open');
    hamburgerBtn.setAttribute('aria-expanded', String(isOpen));
  });
  mobileDrawer.querySelectorAll('a').forEach(a => a.addEventListener('click', closeDrawer));

  /* ---------- Search overlay ---------- */
  const searchToggle = document.getElementById('searchToggle');
  const searchOverlay = document.getElementById('searchOverlay');
  const searchInput = document.getElementById('searchInput');
  const searchClose = document.getElementById('searchClose');
  const searchResults = document.getElementById('searchResults');

  function openSearch() {
    searchOverlay.classList.add('open');
    searchToggle.setAttribute('aria-expanded', 'true');
    setTimeout(() => searchInput.focus(), 200);
  }
  function closeSearch() {
    searchOverlay.classList.remove('open');
    searchToggle.setAttribute('aria-expanded', 'false');
    searchInput.value = '';
    searchResults.innerHTML = '';
  }
  searchToggle.addEventListener('click', () => {
    searchOverlay.classList.contains('open') ? closeSearch() : openSearch();
  });
  searchClose.addEventListener('click', closeSearch);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { closeSearch(); closeDrawer(); }
  });

  function renderSearchResults(query) {
    const q = query.trim().toLowerCase();
    if (!q) { searchResults.innerHTML = ''; return; }
    const matches = STORE_DATA.products.filter(p => p.name.toLowerCase().includes(q));
    if (matches.length === 0) {
      searchResults.innerHTML = `<p class="no-results">No products found for "${escapeHtml(query)}".</p>`;
      return;
    }
    searchResults.innerHTML = matches.slice(0, 8).map(p => `
      <a href="#products" class="search-result-item" data-jump="${p.id}"
         style="display:flex;align-items:center;gap:12px;padding:10px 8px;border-radius:10px;">
        <span style="font-size:1.4rem;">${p.icon}</span>
        <span style="flex:1;">
          <strong style="display:block;font-size:0.92rem;">${escapeHtml(p.name)}</strong>
          <span style="font-size:0.78rem;color:var(--color-ink-soft);">${escapeHtml(p.unit)}</span>
        </span>
        <span style="font-weight:700;color:var(--color-primary);">₹${p.price}</span>
      </a>
    `).join('');

    searchResults.querySelectorAll('[data-jump]').forEach(el => {
      el.addEventListener('click', () => closeSearch());
    });
  }

  searchInput.addEventListener('input', (e) => renderSearchResults(e.target.value));

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  /* ---------- Render Categories ---------- */
  try {
    const categoriesScroll = document.getElementById('categoriesScroll');
    if (!categoriesScroll) throw new Error('#categoriesScroll element not found in DOM');
    categoriesScroll.innerHTML = STORE_DATA.categories.map(cat => `
      <button class="category-chip stagger-item" data-cat="${cat.id}" aria-pressed="false">
        <span class="cat-icon">${cat.icon}</span>
        <span class="cat-label">${cat.label}</span>
      </button>
    `).join('');
  } catch (err) {
    console.error('[main.js] Failed to render categories:', err);
  }

  /* ---------- Render Offers ---------- */
  try {
    const offersGrid = document.getElementById('offersGrid');
    if (!offersGrid) throw new Error('#offersGrid element not found in DOM');
    offersGrid.innerHTML = STORE_DATA.offers.map(o => `
      <div class="offer-card stagger-item">
        <span class="offer-badge">${escapeHtml(o.badge)}</span>
        <h3>${escapeHtml(o.title)}</h3>
        <p>${escapeHtml(o.desc)}</p>
      </div>
    `).join('');
  } catch (err) {
    console.error('[main.js] Failed to render offers:', err);
  }

  /* ---------- Render Product Filter Chips ---------- */
  const filterBar = document.getElementById('filterBar');
  try {
    if (!filterBar) throw new Error('#filterBar element not found in DOM');
    STORE_DATA.categories.forEach(cat => {
      const chip = document.createElement('button');
      chip.className = 'filter-chip';
      chip.dataset.filter = cat.id;
      chip.textContent = cat.label;
      filterBar.appendChild(chip);
    });
  } catch (err) {
    console.error('[main.js] Failed to render filter chips:', err);
  }

  /* ---------- Render Products ---------- */
  const productsGrid = document.getElementById('productsGrid');
  const noResults = document.getElementById('noResults');

  function productCardHtml(p) {
    const media = p.image
      ? `<img src="${p.image}" alt="${escapeHtml(p.name)}" loading="lazy">`
      : p.icon;
    return `
      <article class="product-card stagger-item" data-cat="${p.category}">
        <div class="product-media">
          ${p.tag ? `<span class="product-tag">${escapeHtml(p.tag)}</span>` : ''}
          ${media}
        </div>
        <div class="product-body">
          <span class="product-cat">${escapeHtml(p.category)}</span>
          <span class="product-name">${escapeHtml(p.name)}</span>
          <div class="product-footer">
            <span class="product-price">₹${p.price} <small>/ ${escapeHtml(p.unit)}</small></span>
            <button class="add-btn" aria-label="Enquire about ${escapeHtml(p.name)}" data-product="${p.id}">+</button>
          </div>
        </div>
      </article>
    `;
  }

  function renderProducts(filter = 'all') {
    if (!productsGrid) {
      console.error('[main.js] #productsGrid element not found in DOM — cannot render products.');
      return;
    }
    try {
      const list = filter === 'all'
        ? STORE_DATA.products
        : STORE_DATA.products.filter(p => p.category === filter);

      productsGrid.innerHTML = list.map(productCardHtml).join('');
      if (noResults) noResults.hidden = list.length !== 0;

      productsGrid.querySelectorAll('.add-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const product = STORE_DATA.products.find(p => p.id === btn.dataset.product);
          if (product) {
            const msg = encodeURIComponent(`Hi Velavan Super Stores, I'd like to enquire about: ${product.name} (₹${product.price} / ${product.unit})`);
            window.open(`https://wa.me/919047665999?text=${msg}`, '_blank', 'noopener');
          }
        });
      });

      // Animate newly rendered cards in (GSAP if available)
      if (window.gsap) {
        gsap.fromTo(productsGrid.querySelectorAll('.stagger-item'),
          { opacity: 0, y: 16, scale: 0.98 },
          { opacity: 1, y: 0, scale: 1, duration: 0.45, stagger: 0.03, ease: 'power2.out' }
        );
      } else {
        productsGrid.querySelectorAll('.stagger-item').forEach(el => el.classList.add('is-revealed'));
      }
    } catch (err) {
      console.error('[main.js] Failed to render products:', err);
    }
  }

  renderProducts('all');

  /* ---------- Filter interactions (chips + category cards) ---------- */
  const categoriesScrollEl = document.getElementById('categoriesScroll');

  function setActiveFilter(filterId) {
    if (filterBar) {
      filterBar.querySelectorAll('.filter-chip').forEach(chip => {
        chip.classList.toggle('active', chip.dataset.filter === filterId);
      });
    }
    if (categoriesScrollEl) {
      categoriesScrollEl.querySelectorAll('.category-chip').forEach(chip => {
        const isActive = chip.dataset.cat === filterId;
        chip.classList.toggle('active', isActive);
        chip.setAttribute('aria-pressed', String(isActive));
      });
    }
    renderProducts(filterId);
  }

  if (filterBar) {
    filterBar.addEventListener('click', (e) => {
      const chip = e.target.closest('.filter-chip');
      if (!chip) return;
      setActiveFilter(chip.dataset.filter);
    });
  }

  if (categoriesScrollEl) {
    categoriesScrollEl.addEventListener('click', (e) => {
      const chip = e.target.closest('.category-chip');
      if (!chip) return;
      const alreadyActive = chip.classList.contains('active');
      setActiveFilter(alreadyActive ? 'all' : chip.dataset.cat);
      const productsSection = document.getElementById('products');
      if (productsSection) productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  /* ---------- Render Gallery ---------- */
  try {
    const galleryGrid = document.getElementById('galleryGrid');
    if (!galleryGrid) throw new Error('#galleryGrid element not found in DOM');
    galleryGrid.innerHTML = STORE_DATA.gallery.map(g => {
      const media = g.image
        ? `<img src="${g.image}" alt="${escapeHtml(g.label)}" loading="lazy">`
        : `<span style="font-size:2.4rem;">${g.icon || '🏪'}</span>`;
      return `
        <figure class="gallery-item ${g.size} stagger-item" aria-label="${escapeHtml(g.label)}">
          ${media}
          <figcaption class="gallery-caption">${escapeHtml(g.label)}</figcaption>
        </figure>
      `;
    }).join('');
  } catch (err) {
    console.error('[main.js] Failed to render gallery:', err);
  }

  /* ---------- Render Reviews ---------- */
  try {
    const reviewsTrack = document.getElementById('reviewsTrack');
    if (!reviewsTrack) throw new Error('#reviewsTrack element not found in DOM');
    reviewsTrack.innerHTML = STORE_DATA.reviews.map(r => `
      <article class="review-card stagger-item">
        <div class="review-stars" aria-label="${r.stars} out of 5 stars">${'★'.repeat(r.stars)}${'☆'.repeat(5 - r.stars)}</div>
        <p class="review-text">${escapeHtml(r.text)}</p>
        <p class="review-author">${escapeHtml(r.name)}</p>
      </article>
    `).join('');
  } catch (err) {
    console.error('[main.js] Failed to render reviews:', err);
  }

  // Initial stagger reveal for categories/gallery/reviews handled by animations.js ScrollTrigger
});
/* ==========================================================================
   Velavan Super Stores — Main Interactivity
   Handles: header scroll state, mobile drawer, search overlay + live search,
   rendering of categories/products/offers/gallery/reviews from data.js,
   category filtering.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('year').textContent = new Date().getFullYear();

  /* ---------- Header scroll state ---------- */
  const header = document.getElementById('siteHeader');
  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 12);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile drawer ---------- */
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');

  function closeDrawer() {
    mobileDrawer.classList.remove('open');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
  }
  hamburgerBtn.addEventListener('click', () => {
    const isOpen = mobileDrawer.classList.toggle('open');
    hamburgerBtn.setAttribute('aria-expanded', String(isOpen));
  });
  mobileDrawer.querySelectorAll('a').forEach(a => a.addEventListener('click', closeDrawer));

  /* ---------- Search overlay ---------- */
  const searchToggle = document.getElementById('searchToggle');
  const searchOverlay = document.getElementById('searchOverlay');
  const searchInput = document.getElementById('searchInput');
  const searchClose = document.getElementById('searchClose');
  const searchResults = document.getElementById('searchResults');

  function openSearch() {
    searchOverlay.classList.add('open');
    searchToggle.setAttribute('aria-expanded', 'true');
    setTimeout(() => searchInput.focus(), 200);
  }
  function closeSearch() {
    searchOverlay.classList.remove('open');
    searchToggle.setAttribute('aria-expanded', 'false');
    searchInput.value = '';
    searchResults.innerHTML = '';
  }
  searchToggle.addEventListener('click', () => {
    searchOverlay.classList.contains('open') ? closeSearch() : openSearch();
  });
  searchClose.addEventListener('click', closeSearch);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { closeSearch(); closeDrawer(); }
  });

  function renderSearchResults(query) {
    const q = query.trim().toLowerCase();
    if (!q) { searchResults.innerHTML = ''; return; }
    const matches = STORE_DATA.products.filter(p => p.name.toLowerCase().includes(q));
    if (matches.length === 0) {
      searchResults.innerHTML = `<p class="no-results">No products found for "${escapeHtml(query)}".</p>`;
      return;
    }
    searchResults.innerHTML = matches.slice(0, 8).map(p => `
      <a href="#products" class="search-result-item" data-jump="${p.id}"
         style="display:flex;align-items:center;gap:12px;padding:10px 8px;border-radius:10px;">
        <span style="font-size:1.4rem;">${p.icon}</span>
        <span style="flex:1;">
          <strong style="display:block;font-size:0.92rem;">${escapeHtml(p.name)}</strong>
          <span style="font-size:0.78rem;color:var(--color-ink-soft);">${escapeHtml(p.unit)}</span>
        </span>
        <span style="font-weight:700;color:var(--color-primary);">₹${p.price}</span>
      </a>
    `).join('');

    searchResults.querySelectorAll('[data-jump]').forEach(el => {
      el.addEventListener('click', () => closeSearch());
    });
  }

  searchInput.addEventListener('input', (e) => renderSearchResults(e.target.value));

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  /* ---------- Render Categories ---------- */
  const categoriesScroll = document.getElementById('categoriesScroll');
  categoriesScroll.innerHTML = STORE_DATA.categories.map(cat => `
    <button class="category-chip stagger-item" data-cat="${cat.id}" aria-pressed="false">
      <span class="cat-icon">${cat.icon}</span>
      <span class="cat-label">${cat.label}</span>
    </button>
  `).join('');

  /* ---------- Render Offers ---------- */
  const offersGrid = document.getElementById('offersGrid');
  offersGrid.innerHTML = STORE_DATA.offers.map(o => `
    <div class="offer-card stagger-item">
      <span class="offer-badge">${escapeHtml(o.badge)}</span>
      <h3>${escapeHtml(o.title)}</h3>
      <p>${escapeHtml(o.desc)}</p>
    </div>
  `).join('');

  /* ---------- Render Product Filter Chips ---------- */
  const filterBar = document.getElementById('filterBar');
  STORE_DATA.categories.forEach(cat => {
    const chip = document.createElement('button');
    chip.className = 'filter-chip';
    chip.dataset.filter = cat.id;
    chip.textContent = cat.label;
    filterBar.appendChild(chip);
  });

  /* ---------- Render Products ---------- */
  const productsGrid = document.getElementById('productsGrid');
  const noResults = document.getElementById('noResults');

  function productCardHtml(p) {
    const media = p.image
      ? `<img src="${p.image}" alt="${escapeHtml(p.name)}" loading="lazy">`
      : p.icon;
    return `
      <article class="product-card stagger-item" data-cat="${p.category}">
        <div class="product-media">
          ${p.tag ? `<span class="product-tag">${escapeHtml(p.tag)}</span>` : ''}
          ${media}
        </div>
        <div class="product-body">
          <span class="product-cat">${escapeHtml(p.category)}</span>
          <span class="product-name">${escapeHtml(p.name)}</span>
          <div class="product-footer">
            <span class="product-price">₹${p.price} <small>/ ${escapeHtml(p.unit)}</small></span>
            <button class="add-btn" aria-label="Enquire about ${escapeHtml(p.name)}" data-product="${p.id}">+</button>
          </div>
        </div>
      </article>
    `;
  }

  function renderProducts(filter = 'all') {
    const list = filter === 'all'
      ? STORE_DATA.products
      : STORE_DATA.products.filter(p => p.category === filter);

    productsGrid.innerHTML = list.map(productCardHtml).join('');
    noResults.hidden = list.length !== 0;

    productsGrid.querySelectorAll('.add-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const product = STORE_DATA.products.find(p => p.id === btn.dataset.product);
        if (product) {
          const msg = encodeURIComponent(`Hi Velavan Super Stores, I'd like to enquire about: ${product.name} (₹${product.price} / ${product.unit})`);
          window.open(`https://wa.me/919047665999?text=${msg}`, '_blank', 'noopener');
        }
      });
    });

    // Animate newly rendered cards in (GSAP if available)
    if (window.gsap) {
      gsap.fromTo(productsGrid.querySelectorAll('.stagger-item'),
        { opacity: 0, y: 16, scale: 0.98 },
        { opacity: 1, y: 0, scale: 1, duration: 0.45, stagger: 0.03, ease: 'power2.out' }
      );
    } else {
      productsGrid.querySelectorAll('.stagger-item').forEach(el => el.classList.add('is-revealed'));
    }
  }

  renderProducts('all');

  /* ---------- Filter interactions (chips + category cards) ---------- */
  function setActiveFilter(filterId) {
    filterBar.querySelectorAll('.filter-chip').forEach(chip => {
      chip.classList.toggle('active', chip.dataset.filter === filterId);
    });
    categoriesScroll.querySelectorAll('.category-chip').forEach(chip => {
      const isActive = chip.dataset.cat === filterId;
      chip.classList.toggle('active', isActive);
      chip.setAttribute('aria-pressed', String(isActive));
    });
    renderProducts(filterId);
  }

  filterBar.addEventListener('click', (e) => {
    const chip = e.target.closest('.filter-chip');
    if (!chip) return;
    setActiveFilter(chip.dataset.filter);
  });

  categoriesScroll.addEventListener('click', (e) => {
    const chip = e.target.closest('.category-chip');
    if (!chip) return;
    const alreadyActive = chip.classList.contains('active');
    setActiveFilter(alreadyActive ? 'all' : chip.dataset.cat);
    document.getElementById('products').scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  /* ---------- Render Gallery ---------- */
  const galleryGrid = document.getElementById('galleryGrid');
  galleryGrid.innerHTML = STORE_DATA.gallery.map(g => {
    const media = g.image
      ? `<img src="${g.image}" alt="${escapeHtml(g.label)}" loading="lazy">`
      : `<span style="font-size:2.4rem;">${g.icon || '🏪'}</span>`;
    return `
      <figure class="gallery-item ${g.size} stagger-item" aria-label="${escapeHtml(g.label)}">
        ${media}
        <figcaption class="gallery-caption">${escapeHtml(g.label)}</figcaption>
      </figure>
    `;
  }).join('');

  /* ---------- Render Reviews ---------- */
  const reviewsTrack = document.getElementById('reviewsTrack');
  reviewsTrack.innerHTML = STORE_DATA.reviews.map(r => `
    <article class="review-card stagger-item">
      <div class="review-stars" aria-label="${r.stars} out of 5 stars">${'★'.repeat(r.stars)}${'☆'.repeat(5 - r.stars)}</div>
      <p class="review-text">${escapeHtml(r.text)}</p>
      <p class="review-author">${escapeHtml(r.name)}</p>
    </article>
  `).join('');

  // Initial stagger reveal for categories/gallery/reviews handled by animations.js ScrollTrigger
});
