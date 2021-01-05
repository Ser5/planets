export default class MouseInput {
	constructor (e) {
		this.x    = e.clientX;
		this.y    = e.clientY;
		this.time = Date.now();
	}
}
