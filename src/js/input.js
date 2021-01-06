import {canvas, getDistance} from 'init';
import objectsTree           from 'objects-tree';
import view                  from 'view';
import MouseInput            from 'mouse-input';



let input = new class {
	constructor () {
		this.state = 'std';
		this.down  = null;
		this.up    = null;
		this.move  = null;
	}


	/**
	 * Уведомление о вводе.
	 *
	 * m:
	 * - mousedown
	 * - mouseup
	 * - mousemove
	 * - mouseleave
	 * - mouseenter
	 * - wheel
	 *
	 * data:
	 * - e
	 *
	 * state:
	 * - std
	 * - mousedown
	 * -
	 *
	 * @param {String} m
	 * @param {Object} data
	 */
	notify (m, data) {
		let state = this.state;
		let e     = data.e;
		if (m == 'mousedown') {
			this.down = new MouseInput(e);
			if (state == 'std') {
				this.state = 'mousedown';
			}
		}
		else if (m == 'mousemove') {
			if (state == 'mousedown') {
				this.move = new MouseInput(e);
				if (this._isMovedForDrag(this.move)) {
					canvas.style.cursor = 'grab';
					this.state          = 'drag';
					this._drag();
				}
			}
			if (state == 'drag') {
				this.move = new MouseInput(e);
				this._drag();
			}
		}
		else if (m == 'mouseup') {
			this.up = new MouseInput(e);
			canvas.style.cursor = null;
			if (state == 'mousedown' || state == 'drag') {
				if (state == 'drag') {
					this.state = 'std';
					view.stopDragging();
				}
				if (this._isTimedForFocus() && !this._isMovedForDrag(this.up)) {
					this.state = 'std';
					this._click();
				}
			}
		}
		else if (m == 'mouseleave') {
			this.up = new MouseInput(e);
			canvas.style.cursor = null;
			if (state == 'mousedown' || state == 'drag') {
				if (state == 'drag') {
					this.state = 'std';
					view.stopDragging();
				}
			}
		}
		else if (m == 'mouseenter') {
			if (e.buttons & 1) {
				this.down = new MouseInput(e);
				this.state = 'mousedown';
			}
		}

		if (m == 'wheel') {
			(e.deltaY < 0) ? view.zoomIn() : view.zoomOut();
		}
	}


	_isTimedForFocus () {
		let timeDiff = this.up.time - this.down.time;
		return (timeDiff <= 500);
	}

	_isMovedForDrag (mouseInput) {
		let distance = getDistance(this.down.x, this.down.y, mouseInput.x, mouseInput.y);
		return (distance > 3);
	}


	_click () {
		let rect          = canvas.getBoundingClientRect();
		let distance      = 1000000;
		let clickedObject = null;
		objectsTree.process(so => {
			let clickedX = this.down.x - rect.left;
			let clickedY = this.down.y - rect.top;
			let d = getDistance(clickedX, clickedY, so.drawX, so.drawY);
			//console.log(`${clickedX}:${clickedY} <> ${so.color} ${so.drawX}:${so.drawY}`);
			if (d < distance) {
				distance      = d;
				clickedObject = so;
			}
		});
		//console.log(clickedObject);
		view.startMoving(clickedObject);
	}


	_drag () {
		//console.log(`${this.move.x} - ${this.down.x}`);
		view.drag({
			x: this.move.x - this.down.x,
			y: this.move.y - this.down.y
		});
	}
}();



export default input;
