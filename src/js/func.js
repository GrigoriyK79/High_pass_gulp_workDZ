export function asd() {
    console.log('asd')
}

// Подключение плавной прокрутки к якорям
import SmoothScroll from 'smooth-scroll';
const scroll = new SmoothScroll('a[href*="#"]');
