/////////////////////////////////////////////
// Modal Window
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnOpenModal = document.querySelectorAll('.btn--show-modal');
const btnCloseModal = document.querySelector('.btn--close-modal');

function openModal(e) {
  e.preventDefault(); // To stop page from jumping up when link is only a bit visible and clicked
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
}

function closeModal() {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
}

// Event Listeners
btnOpenModal.forEach(btn => btn.addEventListener('click', openModal));
btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

window.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

/////////////////////////////////////////////
// Selecting Elements
/*
const header = document.querySelector('.header');

// Creating and Inserting Elements
const message = document.createElement('div');
message.classList.add('cookie-message');
message.innerText = 'We use cookies for improved functionality and analytics.';
message.innerHTML = `
  We use cookies for improved functionality and analytics.
  <button class="btn btn--close-cookie">Got It!</button>
`;

header.append(message);
document
  .querySelector('.btn--close-cookie')
  .addEventListener('click', () => message.remove());

message.style.backgroundColor = '#37383d';
message.style.color = '#fff';
message.style.width = '120%';

message.style.height =
  Number.parseFloat(getComputedStyle(message).height) + 40 + 'px';
// document.documentElement.style.setProperty('--color-primary', 'violet');
*/

const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.getElementById('section--1');

btnScrollTo.addEventListener('click', function (e) {
  const s1Coords = section1.getBoundingClientRect();
  section1.scrollIntoView({behavior: 'smooth'}); // Modern CSS support smooth scrolling, add the following to your stylesheet => `html { scroll-behaviour: smooth; }`
});

//////////////////////////////////
// Event Propogarion : Bubbling and Capturing
const nav = document.querySelector('.nav');
const navLinkContainer = document.querySelector('.nav__links');
const navLinks = document.querySelectorAll('.nav__link');

// navLinks.forEach(navLink =>
//   navLink.addEventListener('click', function (e) {
//     e.preventDefault();
//     const sectionID = e.target.getAttribute('href');
//     const section = document.querySelector(sectionID);
//     section.scrollIntoView({behavior: 'smooth'});
//   }),
// );

navLinkContainer.addEventListener('click', function (e) {
  e.preventDefault();
  if (!e.target.classList.contains('nav__link')) return;
  const sectionID = e.target.getAttribute('href');
  if (sectionID === '#') return;
  const section = document.querySelector(sectionID);
  section.scrollIntoView({behavior: 'smooth'});
});

// Tabbed Component
const tabsContainer = document.querySelector('.operations__tab-container');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContent = document.querySelectorAll('.operations__content');

tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');
  if (!clicked) return;

  tabs.forEach(tab => tab.classList.remove('operations__tab--active'));
  tabsContent.forEach(tabContent =>
    tabContent.classList.remove('operations__content--active'),
  );

  const tabNumber = clicked.dataset.tab;
  const content = document.querySelector(`.operations__content--${tabNumber}`);

  clicked.classList.add('operations__tab--active');
  content.classList.add('operations__content--active');
});

// Passing arguments to Event Handlers

function handleMouseEvent(e, opacity = 1) {
  const link = e.target;
  if (!link.classList.contains('nav__link')) return;

  const siblingLinks = link.closest('.nav').querySelectorAll('.nav__link');
  const logo = link.closest('.nav').querySelector('img');

  siblingLinks.forEach(el => {
    if (el !== link) el.style.opacity = opacity;
  });
  logo.style.opacity = opacity;
}

// passing argument with an arrow callback function
nav.addEventListener('mouseover', e => handleMouseEvent(e, 0.5));
// Binding the argument because .bind() returns a new function and the value of `this` will be set to 1.
nav.addEventListener('mouseout', handleMouseEvent.bind(1));

// // * Using `scroll` event is bad for performance instead use `IntersectionObserver` API

// // Sticy Navbar using 'scroll' event
// const initialCoords = section1.getBoundingClientRect();
// window.addEventListener('scroll', e => {
//   if (this.scrollY > initialCoords.top) {
//     nav.classList.add('sticky');
//   } else {
//     nav.classList.remove('sticky');
//   }
// });

// // Sticy Navbar using 'IntersectionObserver' API
// function obsCallback(entries, observer) {
//   entries.forEach(entry => console.log(entry));
// }

// const obsOptions = {
//   root: null, // Root element that intersect the target element
//   threshold: [0, 0.2], // Percentage of intersection to which the callback fn will be called
// };

// const observer = new IntersectionObserver(obsCallback, obsOptions);
// observer.observe(section1);

const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;

function stickyNav(entries) {
  const [entry] = entries;
  if (!entry.isIntersecting) {
    nav.classList.add('sticky');
  } else {
    nav.classList.remove('sticky');
  }
}

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});
headerObserver.observe(header);

// Reveal section on page load scroll
const allSections = document.querySelectorAll('.section');
function revealSection(entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
}

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});
allSections.forEach(section => {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

// Lazy loading Images
const imageTargets = document.querySelectorAll('img[data-src]');
function loadImage(entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.src = entry.target.dataset.src;
  // When image is loaded then remove the blur
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });
  observer.unobserve(entry.target);
}

const imageObserver = new IntersectionObserver(loadImage, {
  root: null,
  threshold: 0,
  rootMargin: '-200px',
});
imageTargets.forEach(img => imageObserver.observe(img));

// Slider Component
const slider = document.querySelector('.slider');
const slides = document.querySelectorAll('.slide');
const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');
const dotContainer = document.querySelector('.dots');

// Create dots
function createDots() {
  slides.forEach((_, i) => {
    dotContainer.insertAdjacentHTML(
      'beforeend',
      `
      <button class="dots__dot" data-slide="${i}"></button>
    `,
    );
  });
}
createDots();

// Active dot
function activeDot(slide) {
  document
    .querySelectorAll('.dots__dot')
    .forEach(dot => dot.classList.remove('dots__dot--active'));

  document
    .querySelector(`.dots__dot[data-slide="${slide}"]`)
    .classList.add('dots__dot--active');
}

slides.forEach((slide, i) => {
  slide.style.transform = `translateX(${i * 100}%)`;
});

let currentSlide = 0;
const maxSlide = slides.length;
activeDot(currentSlide);

// Generic Slide
function goToSlide(slidePosition) {
  slides.forEach((slide, i) => {
    slide.style.transform = `translateX(${(i - slidePosition) * 100}%)`;
  });
}

// Next Slide
function goToNextSlide() {
  if (currentSlide === maxSlide - 1) {
    currentSlide = 0;
  } else {
    currentSlide += 1;
  }

  goToSlide(currentSlide);
  activeDot(currentSlide);
}

// Prev Slide
function goToPrevSlide() {
  if (currentSlide === 0) {
    currentSlide = maxSlide - 1;
  } else {
    currentSlide -= 1;
  }

  goToSlide(currentSlide);
  activeDot(currentSlide);
}

btnRight.addEventListener('click', goToNextSlide);
btnLeft.addEventListener('click', goToPrevSlide);
window.addEventListener('keydown', function (e) {
  if (e.key === 'ArrowLeft') goToPrevSlide();
  if (e.key === 'ArrowRight') goToNextSlide();
});
dotContainer.addEventListener('click', function (e) {
  if (!e.target.classList.contains('dots__dot')) return;
  const {slide} = e.target.dataset;
  currentSlide = +slide;
  goToSlide(slide);
  activeDot(slide);
});
