import './index.css';

import App from './scripts/App';

window.app = new App();

window.addEventListener('keydown', function(e){
    if(e.keyCode === 38){
        app.startMove();
    }
});

window.addEventListener('keyup', function(e){
    if(e.keyCode === 38){
        app.stopMove();
    }
});