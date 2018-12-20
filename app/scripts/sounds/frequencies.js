import intro from '../../A7/intro.mp3';

export default class Frequencies {
	
	constructor(){
		this.button = document.querySelector(".launchsound")
		console.log("niquetamere")
		this.button.addEventListener("click", this.begin.bind(this))

	}	
	begin(){
		let audio = new Audio(intro)
		audio.play()
	}	
}
