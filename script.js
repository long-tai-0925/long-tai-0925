/**
 * MAIN JAVASCRIPT - Handles all functionality
 * This file loads content from config.js dynamically
 */

// ==================================
// STATE MANAGEMENT
// ==================================

let currentSlide = 0;
let totalSlides = 0;
let isScrolling = false;
const SCROLL_DELAY = 900;

// ==================================
// INITIALIZATION
// ==================================

document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 Initializing personal website...');
  initializeTheme();
  buildSlides();
  setupNavigation();
  setupEventListeners();
  console.log('✨ Website loaded successfully!');
});

// ==================================
// THEME MANAGEMENT
// ==================================

function initializeTheme() {
  const savedTheme = localStorage.getItem('theme') || 'dark';
  const themeToggle = document.querySelector('.theme-toggle');
  
  if (savedTheme === 'light') {
    document.body.classList.add('light-theme');
    themeToggle.textContent = '☀️';
  } else {
    themeToggle.textContent = '🌙';
  }

  themeToggle.addEventListener('click', toggleTheme);
}

function toggleTheme() {
  const body = document.body;
  const themeToggle = document.querySelector('.theme-toggle');
  
  body.classList.toggle('light-theme');
  
  const isLight = body.classList.contains('light-theme');
  localStorage.setItem('theme', isLight ? 'light' : 'dark');
  themeToggle.textContent = isLight ? '☀️' : '🌙';
}

// ==================================
// SLIDE BUILDER
// ==================================

function buildSlides() {
  if (typeof config === 'undefined') {
    console.error('❌ config.js not loaded!');
    return;
  }

  const container = document.getElementById('slidesContainer');
  totalSlides = config.slides.length;

  config.slides.forEach((slideConfig, index) => {
    const slide = createSlide(slideConfig, index);
    container.appendChild(slide);
  });

  activateSlide(0);
  console.log(`📄 Built ${totalSlides} slides`);
}

function createSlide(slideConfig, index) {
  const slide = document.createElement('div');
  slide.className = `slide ${index === 0 ? 'active' : ''}`;
  slide.dataset.slide = index;

  const content = document.createElement('div');
  content.className = 'slide-content';

  // Add icon if exists
  if (slideConfig.icon) {
    const icon = document.createElement('div');
    icon.className = 'slide-icon';
    icon.textContent = slideConfig.icon;
    content.appendChild(icon);
  }

  // Add title
  const title = document.createElement('h1');
  title.className = 'slide-title';
  title.textContent = slideConfig.title;
  content.appendChild(title);

  // Build content based on type
  switch (slideConfig.type) {
    case 'card':
      buildCardContent(content, slideConfig.content);
      break;
    case 'list':
      buildListContent(content, slideConfig.items);
      break;
    case 'timeline':
      buildTimelineContent(content, slideConfig.items);
      break;
    case 'grid':
      buildGridContent(content, slideConfig.items);
      break;
    case 'social':
      buildSocialContent(content, slideConfig.socials);
      break;
  }

  slide.appendChild(content);
  return slide;
}

function buildCardContent(container, data) {
  const card = document.createElement('div');
  card.className = 'card';

  if (data.image) {
    const img = document.createElement('img');
    img.src = data.image;
    img.alt = data.name;
    card.appendChild(img);
  }

  const name = document.createElement('h2');
  name.textContent = data.name;
  card.appendChild(name);

  if (data.description) {
    const desc = document.createElement('div');
    desc.className = 'subtitle';
    desc.textContent = data.description;
    card.appendChild(desc);
  }

  if (data.bio) {
    const bio = document.createElement('p');
    bio.textContent = data.bio;
    card.appendChild(bio);
  }

  container.appendChild(card);
}

function buildListContent(container, items) {
  const listContainer = document.createElement('div');
  listContainer.className = 'list-items';

  items.forEach(item => {
    const listItem = document.createElement('div');
    listItem.className = 'list-item';
    listItem.innerHTML = `
      <strong>${item.label}</strong>
      <span>${item.value}</span>
    `;
    listContainer.appendChild(listItem);
  });

  container.appendChild(listContainer);
}

function buildTimelineContent(container, items) {
  const timeline = document.createElement('div');
  timeline.className = 'timeline';

  items.forEach((item, index) => {
    const timelineItem = document.createElement('div');
    timelineItem.className = 'timeline-item';
    timelineItem.innerHTML = `
      <div class="timeline-dot"></div>
      <div class="timeline-content">
        <h3>${item.company}</h3>
        <strong>${item.position}</strong>
        <div class="period">${item.period}</div>
        <p>${item.description}</p>
      </div>
    `;
    timeline.appendChild(timelineItem);
  });

  container.appendChild(timeline);
}

function buildGridContent(container, items) {
  const grid = document.createElement('div');
  grid.className = 'project-grid';

  items.forEach(item => {
    const card = document.createElement('div');
    card.className = 'project-card';
    
    let techHTML = '';
    if (item.tech && item.tech.length > 0) {
      techHTML = `
        <div class="tech-tags">
          ${item.tech.map(t => `<span class="tech-tag">${t}</span>`).join('')}
        </div>
      `;
    }

    card.innerHTML = `
      <h3>${item.name}</h3>
      <p>${item.description}</p>
      ${techHTML}
    `;

    if (item.link && item.link !== '#') {
      card.style.cursor = 'pointer';
      card.addEventListener('click', () => window.open(item.link, '_blank'));
    }

    grid.appendChild(card);
  });

  container.appendChild(grid);
}

function buildSocialContent(container, socials) {
  const buttons = document.createElement('div');
  buttons.className = 'social-buttons';

  socials.forEach(social => {
    const btn = document.createElement('a');
    btn.href = social.url;
    btn.className = 'social-btn';
    btn.style.backgroundColor = social.color;
    btn.target = '_blank';
    btn.rel = 'noopener noreferrer';
    btn.innerHTML = `
      <span>${social.icon}</span>
      <span>${social.name}</span>
    `;
    buttons.appendChild(btn);
  });

  container.appendChild(buttons);
}

// ==================================
// NAVIGATION
// ==================================

function setupNavigation() {
  const dotsContainer = document.querySelector('.dots-container');

  for (let i = 0; i < totalSlides; i++) {
    const dot = document.createElement('div');
    dot.className = `dot ${i === 0 ? 'active' : ''}`;
    dot.dataset.slide = i;
    dot.addEventListener('click', () => goToSlide(i));
    dotsContainer.appendChild(dot);
  }
}

function activateSlide(index) {
  if (index < 0 || index >= totalSlides) return;

  document.querySelectorAll('.slide').forEach(slide => {
    slide.classList.remove('active');
  });
  document.querySelector(`[data-slide="${index}"]`).classList.add('active');

  document.querySelectorAll('.dot').forEach(dot => {
    dot.classList.remove('active');
  });
  document.querySelector(`.dot[data-slide="${index}"]`).classList.add('active');

  currentSlide = index;
}

function goToSlide(index) {
  activateSlide(index);
}

function nextSlide() {
  if (currentSlide < totalSlides - 1) {
    goToSlide(currentSlide + 1);
  }
}

function prevSlide() {
  if (currentSlide > 0) {
    goToSlide(currentSlide - 1);
  }
}

// ==================================
// EVENT LISTENERS
// ==================================

function setupEventListeners() {
  document.addEventListener('keydown', handleKeyPress);
  document.addEventListener('wheel', handleWheel, { passive: false });

  let touchStart = 0;
  document.addEventListener('touchstart', (e) => {
    touchStart = e.touches[0].clientY;
  });

  document.addEventListener('touchend', (e) => {
    const touchEnd = e.changedTouches[0].clientY;
    const diff = touchStart - touchEnd;
    
    if (diff > 50) nextSlide();
    else if (diff < -50) prevSlide();
  });
}

function handleKeyPress(e) {
  const keys = {
    'ArrowDown': nextSlide,
    'ArrowUp': prevSlide,
    'ArrowRight': nextSlide,
    'ArrowLeft': prevSlide,
    's': nextSlide,
    'w': prevSlide,
    'd': nextSlide,
    'a': prevSlide
  };

  if (keys[e.key]) {
    e.preventDefault();
    keys[e.key]();
  }
}

function handleWheel(e) {
  if (isScrolling) return;

  e.preventDefault();
  isScrolling = true;

  if (e.deltaY > 0) {
    nextSlide();
  } else {
    prevSlide();
  }

  setTimeout(() => {
    isScrolling = false;
  }, SCROLL_DELAY);
}

console.log('✨ Personal Website Ready!');
console.log('📝 Edit config.js to update content');
console.log('🎨 Edit styles.css to customize appearance');
