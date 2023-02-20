// import './js/func'
// Burger
const burger = document?.querySelector('[data-burger]');
const burgerClose = document?.querySelector('[data-burger-close]')
const nav = document?.querySelector('[data-nav]');
const navItems = nav?.querySelectorAll('.header__link');
const body = document.body;
const header = document?.querySelector('.header');
const headerHeight = header.offsetHeight;
console.log(headerHeight)
document.querySelector(':root').style.setProperty('--header-height', `${headerHeight}px`);

burger?.addEventListener('click', () => {
  body.classList.toggle('stop-scroll');
  burger?.classList.toggle('burger--active');
  nav?.classList.toggle('nav--visible');
  nav.style.transition = 'transform 0.6s ease-in-out';

});

nav.addEventListener('transitionend', function () {
  if (!nav.classList.contains("nav--visible")) {
    nav.removeAttribute('style');
  }
})

burgerClose?.addEventListener('click', () => {
  body.classList.remove('stop-scroll');
  burger?.classList.remove('burger--active');
  nav?.classList.remove('nav--visible');
});

navItems.forEach(el => {
  el.addEventListener('click', () => {
    body.classList.remove('stop-scroll');
    burger?.classList.remove('burger--active');
    burgerClose?.classList.remove('burger--active');
    nav?.classList.remove('nav--visible');
  });
});

// Search

const glass = document?.querySelector('[data-glass]');
const search = document?.querySelector('[data-search]');
const searchClose = document?.querySelector('[data-glass-close]');
const logoClose = document?.querySelector('[data-logo-close');

glass?.addEventListener('click', () => {
  glass?.classList.toggle('glass--activ');
  search?.classList.toggle('search--activ');
  searchClose?.classList.toggle('searchClose--activ');
  logoClose?.classList.toggle('logo--close');
  search.style.transition = 'transform 0.6s ease-in-out';
})

search.addEventListener('transitionend', function () {
  if (!search.classList.contains("search--activ")) {
    search.removeAttribute('style');
  }
})

searchClose?.addEventListener('click', () => {
  glass?.classList.remove('glass--activ');
  search?.classList.remove('search--activ');
  searchClose?.classList.remove('searchClose--activ');
  logoClose?.classList.remove('logo--close');
})

// Validate
const validationStudio = new JustValidate('#formStudio');

validationStudio
  .addField('#emailStudio', [
    {
      rule: 'required',
      errorMessage: 'Недопустимый формат',
    },
    {
      rule: 'email',
      errorMessage: 'Недопустимый формат',
    },
  ]);

const validationContacts = new JustValidate('#formContacts');

validationContacts
  .addField('#name', [
    {
      rule: 'minLength',
      value: 3,
      errorMessage: 'Недопустимый формат',
    },
    {
      rule: 'maxLength',
      value: 30,
      errorMessage: 'Недопустимый формат',
    },
    {
      rule: 'required',
      errorMessage: 'Недопустимый формат',
    },
    // {
    //   errorFieldStyle: {
    //     color: "#FF3030",
    //   },
    // },
    // {
    //   errorFieldCssClass: {
    //     border: "1px solid #FF3030",
    //   },
    // },
  ])
  .addField('#email', [
    {
      rule: 'required',
      errorMessage: 'Недопустимый формат',
    },
    {
      rule: 'email',
      errorMessage: 'Недопустимый формат',
    },
  ]);


// Карта Yandex
function init() {
  let map = new ymaps.Map('mapAddress', {
    center: [55.76260000428884, 37.619600000340604],
    zoom: 13.5
  });

  let placemark = new ymaps.Placemark([55.76951372428804, 37.639638778340604],
    {},
    {
      iconLayout: 'default#image',
      iconImageHref: '../img/sprite.svg#dot',
      iconImageSize: [12, 12],
      iconImageOffset: [0, 0]
    });

  map.controls.remove('geolocationControl'); // Удаление геолокации
  map.controls.remove('searchControl'); // Удаление поиска
  map.controls.remove('trafficControl'); // Удаление контроля трафика
  map.controls.remove('typeSelector'); // Удаление типа
  map.controls.remove('fullscreenControl'); // Удаление кнопки перехода в полноэкранный режим
  map.controls.remove('zoomControl'); // Удаление контроля зуммирования
  map.controls.remove('rulerControl'); // Удаление контроля правил
  // map.controls.disable(['scrollZoom']); // Удаление скролла карты (опционально)

  map.geoObjects.add(placemark);
  // placemark.balloon.open();
}

ymaps.ready(init);

const contactsBTN = document?.querySelector('[data-contacts-btn]');
const contactsClose = document?.querySelector('[data-contacts-close]');
const contactsOffice = document?.querySelector('[data-contacts-office]');

contactsBTN?.addEventListener('click', () => {
  contactsClose?.classList.toggle('contacts--close');
  contactsOffice?.classList.toggle('contacts--office');
})
