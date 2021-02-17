import {getDistance}   from 'utils';
import {MouseInput}    from 'mouse-input';
import {InputMessages} from 'input-messages';
import {View}          from 'view';
import {Focus}         from 'focus';

let im = InputMessages;



enum State {Focused, MouseDown, Dragging};



export class Input {
	private _state: State = State.Focused;
	private _down:  MouseInput = null;
	private _up:    MouseInput = null;
	private _move:  MouseInput = null;

	private _canvasesBlock: HTMLElement;
	private _view:          View;
	private _focus:         Focus;

	constructor (
		{canvasesBlock,              view,       focus}:
		{canvasesBlock: HTMLElement, view: View, focus: Focus}
	) {
		canvasesBlock.onmousedown  = e=>this.notify(im.MouseDown,  e);
		canvasesBlock.onmouseup    = e=>this.notify(im.MouseUp,    e);
		canvasesBlock.onmousemove  = e=>this.notify(im.MouseMove,  e);
		canvasesBlock.onmouseleave = e=>this.notify(im.MouseLeave, e);
		canvasesBlock.onmouseenter = e=>this.notify(im.MouseEnter, e);
		window.onwheel             = e=>this.notify(im.Wheel,      e);

		this._canvasesBlock = canvasesBlock;
		this._view          = view;
		this._focus         = focus;
	}



	notify (m: InputMessages, e: MouseEvent|WheelEvent) {
		let state = this._state;
		if (m == im.MouseDown) {
			this._down = new MouseInput(e);
			if (state == State.Focused) {
				this._state = State.MouseDown;
			}
		}
		else if (m == im.MouseMove) {
			if (state == State.MouseDown) {
				this._move = new MouseInput(e);
				if (this._isMovedForDrag(this._move)) {
					this._canvasesBlock.style.cursor = 'grab';
					this._state                      = State.Dragging;
					this._drag();
				}
			}
			if (state == State.Dragging) {
				this._move = new MouseInput(e);
				this._drag();
			}
		}
		else if (m == im.MouseUp) {
			this._up = new MouseInput(e);
			this._canvasesBlock.style.cursor = null;
			if (state == State.MouseDown || state == State.Dragging) {
				if (state == State.Dragging) {
					this._state = State.Focused;
					this._view.stopDragging();
				}
				if (this._isTimedForFocus() && !this._isMovedForDrag(this._up)) {
					this._state = State.Focused;
					this._click();
				}
			}
		}
		else if (m == im.MouseLeave) {
			this._up = new MouseInput(e);
			this._canvasesBlock.style.cursor = null;
			if (state == State.MouseDown || state == State.Dragging) {
				if (state == State.Dragging) {
					this._state = State.Focused;
					this._view.stopDragging();
				}
			}
		}
		else if (m == im.MouseEnter) {
			if (e.buttons & 1) {
				this._down = new MouseInput(e);
				this._state = State.MouseDown;
			}
		}

		if (m == im.Wheel) {
			((e as WheelEvent).deltaY < 0) ? this._view.zoomIn() : this._view.zoomOut();
		}
	}



	_isTimedForFocus () {
		let timeDiff = this._up.time - this._down.time;
		return (timeDiff <= 500);
	}

	_isMovedForDrag (mouseInput) {
		let distance = getDistance(this._down.x, this._down.y, mouseInput.x, mouseInput.y);
		return (distance > 3);
	}



	_click () {
		let clickedObject = this._focus.getNearestSpaceObject(this._down.x, this._down.y);
		this._view.startMoving(clickedObject);
	}



	_drag () {
		//console.log(`${this._move.x} - ${this._down.x}`);
		this._view.drag({
			x: this._move.x - this._down.x,
			y: this._move.y - this._down.y
		});
	}
}
