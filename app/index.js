import './index.css';

import App from './scripts/App';
import BD from './scripts/ui/Bd';
import ContentManager from './scripts/ContentManager';

import Frequencies from './scripts/sounds/Frequencies'

import enter from './A7/ui/enter.svg';
import ambient from './A7/ambient.mp3';

import SubtitlesManager from './scripts/ui/SubtitlesManager';

window.app = new App();

let uiElt = document.querySelector('#ui');

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

window.addEventListener('keyup', function(e){
    if(e.keyCode === 37){
        app.stopTurn();
    }
});

window.addEventListener('keydown', function(e){
    if(e.keyCode === 37){
        app.startTurn(-1);
    }
});

window.addEventListener('keyup', function(e){
    if(e.keyCode === 39){
        app.stopTurn();
    }
});

window.addEventListener('keydown', function(e){
    if(e.keyCode === 39){
        app.startTurn(1);
    }
});


window.addEventListener('keyup', function(e){
    if(e.keyCode === 32){
        app.stopDig();
    }
});

window.addEventListener('keydown', function(e){
    if(e.keyCode === 32){
        app.startDig();
    }
});

document.addEventListener('displayTitle', function(){
    console.log('title');
    uiElt.innerHTML = ContentManager.title();
    uiElt.style.opacity = 1;
    document.querySelector('.home_show').addEventListener('click', function(){
        uiElt.style.transition = 'all 2s';
        uiElt.style.opacity = 0;
        displayBd();
    });
});


document.addEventListener('bdEnded', function(){
    app.map.canvas.style.opacity = 1;
    let audio = new Audio(ambient)
		audio.play()
    //console.log('map');
});

// document.addEventListener('displayButton', function(){
//     let img = document.createElement('img');
//     img.src = enter;
//     img.style.height = '200px';
//     let button = document.createElement('button');
//     button.addEventListener('click', function(){
//         uiElt.style.opacity = 0;
//         displayBd();
//     });
//     uiElt.appendChild(button);
//     button.appendChild(img);
//     uiElt.style.opacity = 1;
// });

function displayBd(){
    let bd = new BD();
    let subtitles = new SubtitlesManager(ContentManager.bdTextes());
}