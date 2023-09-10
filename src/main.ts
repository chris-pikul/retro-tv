import Renderer from './render';
import './styles/main.css';

(function () {
    const parent = document.getElementById('main');
    if (!parent) throw new Error('Could not find parent element to bind to!');

    const renderer = new Renderer(parent);
    renderer.start();
})();
