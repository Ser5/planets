export default class MouseInput {
	public x:    number;
	public y:    number;
	public time: number;

	constructor (e) {
		this.x    = e.clientX;
		this.y    = e.clientY;
		this.time = Date.now();
	}
}
