import {ISize} from 'isize';



export class Html {
	private _html:            HTMLElement              = document.querySelector('html');
	private _canvasesBlock:   HTMLElement              = document.querySelector('.canvases-block');
	private _canvas2d:        HTMLCanvasElement        = document.querySelector('.canvas2d');
	private _canvas3d:        HTMLCanvasElement        = document.querySelector('.canvas3d');
	private _canvasesList:    HTMLCanvasElement[]      = [this._canvas2d, this._canvas3d];
	private _canvas2dContext: CanvasRenderingContext2D = this._canvas2d.getContext('2d');

	constructor () {}



	get html ()            { return this._html }
	get canvasesBlock ()   { return this._canvasesBlock }
	get canvas2d ()        { return this._canvas2d }
	get canvas3d ()        { return this._canvas3d }
	get canvasesList ()    { return this._canvasesList }
	get canvas2dContext () { return this._canvas2dContext }



	activateCanvas (canvas: HTMLCanvasElement): ISize {
		for (let c of this._canvasesList) {
			if (c == canvas) {
				c.style.display = 'block';
			} else {
				c.style.display = 'none';
			}
		}
		return this.syncCanvasSize(canvas);
	}



	syncCanvasSize (canvas: HTMLCanvasElement): ISize {
		this._canvasesBlock.style.height = `${window.innerHeight - 5}px`;

		canvas.width  = this._canvasesBlock.clientWidth;
		canvas.height = this._canvasesBlock.clientHeight;

		return {
			width:  canvas.width,
			height: canvas.height,
		};
	}
}
