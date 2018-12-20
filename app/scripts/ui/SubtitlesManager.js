let subtitlesElt = document.querySelector('#subtitles');

export default class SubtitlesManager{

    constructor(textes){
        this.raf = "";
        this.textes = textes;
        this.step = 0;
        this.timer = 0;
        this.updateSubtitles();
        this.time();
    }

    updateSubtitles(){
        subtitlesElt.innerHTML = this.textes[this.step].texte;
    }

    time(){
        this.timer++;
        if(this.step < this.textes.length - 1 && this.timer > this.textes[this.step].time){
            this.step++;
            this.timer = 0;
            this.updateSubtitles();
        }else if(this.timer > this.textes[this.step].time && this.step === this.textes.length - 1 ){
            subtitlesElt.innerHTML = '';
            cancelAnimationFrame(this.raf);
        }

        this.raf = requestAnimationFrame(this.time.bind(this));
    }

}