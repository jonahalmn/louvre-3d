import intro from '../../A7/intro.mp3';

export default class Frequencies {
	
	constructor(){
		this.button = document.querySelector(".launchsound")
		this.button.addEventListener("click", this.begin.bind(this))

		// this.enter = document.querySelector(".home_show")
		// this.enter = document.getElementsByClassName("click").style.display="none";

	}	
	begin(){
		let audio = new Audio(intro)
		audio.play()
	}	
}
