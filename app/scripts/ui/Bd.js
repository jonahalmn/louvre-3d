import img1 from '../../A7/ui/bd1.png';
import img2 from '../../A7/ui/bd2.png';
import img3 from '../../A7/ui/bd3.png';

import img1bkg from '../../A7/ui/bd1bkg.png';
import img2bkg from '../../A7/ui/bd2bkg.png';
import img3bkg from '../../A7/ui/bd3bkg.png';

let bdElt = document.querySelector('#bd');

let imgs = [img1, img2, img3];
let bkgs = [img1bkg, img2bkg, img3bkg];

export default class BD{

    constructor(){
        this.step = 0;
        this.time = 0;
        this.imgs = [];
        this.imgsbkg = [];
        this.progressBar = '';
        this.evt = new Event('bdEnded');
        this.createElements();
        this.updateUI();
        this.createProgressBarContainer();
        this.timePass();
    }

    createElements(){
        imgs.forEach((img) => {
            let imgElt = document.createElement('img');
            imgElt.src = img;
            imgElt.style.transition = 'all 2s';
            imgElt.style.position = 'absolute';
            imgElt.style.height = '100vh';
            imgElt.style.objectFit = 'contain';
            imgElt.style.width = '100vw';
            imgElt.style.zIndex = 2;
            imgElt.style.opacity = 0;
            bdElt.appendChild(imgElt);

            this.imgs.push(imgElt);
        });

        bkgs.forEach((bkg) => {
            let imgElt = document.createElement('img');
            imgElt.src = bkg;
            imgElt.style.transition = 'all 2s';
            imgElt.style.position = 'absolute';
            imgElt.style.height = '100vh';
            imgElt.style.objectFit = 'cover';
            imgElt.style.width = '100vw';
            imgElt.style.zIndex = 0;
            imgElt.style.opacity = 0;
            bdElt.appendChild(imgElt);
            this.imgsbkg.push(imgElt);
        });

        bdElt.style.opacity = 1;
    }

    createProgressBarContainer(){
        let container = document.createElement('div');
        container.classList = "progress-bar-container";
        bdElt.appendChild(container);

        this.progressBar = document.createElement('div');
        this.progressBar.classList = "progress-bar";
        container.appendChild(this.progressBar);

    }

    timePass(){
        this.time++;

        if(this.time > 600 && this.step < 2){
            this.time = 0;
            this.step++;
            this.updateUI();
        }else if(this.time > 600 && this.step >= 2 && (bdElt.querySelector('.black-cache') == undefined || bdElt.querySelector('.black-cache') == null)){
            let cache = document.createElement('div');
            cache.classList = 'black-cache';
            bdElt.appendChild(cache);
            setTimeout(() => {
                cache.style.opacity = 1;
            },100)
            setTimeout(() => {
                bdElt.style.opacity = 0;
                document.dispatchEvent(this.evt);
            }, 2000)
        }else{
            this.progressBar.style.transform = 'translateX(' + ((this.time / 600) * 100) + '%)';
        }


        requestAnimationFrame(this.timePass.bind(this));
    }

    updateUI(){
        this.imgsbkg[this.step].style.opacity = 1;
        this.imgs[this.step].style.opacity = 1;
    }

}