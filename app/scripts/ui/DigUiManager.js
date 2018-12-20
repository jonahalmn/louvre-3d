let digHintElt = document.querySelector('#digHint');

export default class DigUiManager {

    constructor(){
        this.warnLength = 240;
        this.isWarning = false;
        this.barContainer = '';
        this.progressBar = '';
        this.update();
    }

    createElement(){
        this.barContainer = document.createElement('div');
    }

    warning(){
        this.isWarning = true;
        digHintElt.innerHTML = "Vous ne pouvez pas creuser ici...";
    }

    update(){
        if(this.isWarning && this.warnLength > 0){
            this.warnLength--;
        }

        if(this.warnLength == 0){
            this.isWarning = false;
            digHintElt.innerHTML = '';
            this.warnLength = 240;
        }

        requestAnimationFrame(this.update.bind(this));
    }

}