import {TComponents} from 'ecs/import';
import {System}      from 'ecs/import';
import {Html}        from 'html';
import {IStrategist} from 'istrategist';

import {DrawSystemStrategy} from './draw-system/draw-system-strategy';



type TStrategies = Record<string, DrawSystemStrategy>;



export class DrawSystem extends System implements IStrategist {
	private _html:           Html;
	private _strategies:     TStrategies = {};
	private _activeStrategy: DrawSystemStrategy;

	constructor (
		{html,       strategies}:
		{html: Html, strategies: TStrategies}
	) {
		super();
		this._html       = html;
		this._strategies = strategies;

		let strategyNamesList = Object.keys(strategies);
		this.setStrategy(strategyNamesList[0]);

		window.onresize = ()=>this.onViewResize();
	}



	run () {
		this._activeStrategy.run();
	}



	setStrategy (name: string) {
		this._activeStrategy = this._strategies[name];

		let size = this._html.activateCanvas(this._activeStrategy.canvas);
		this._activeStrategy.enable();
		this._activeStrategy.onViewResize(size.width, size.height);

		for (let s of Object.values(this._strategies)) {
			if (s != this._activeStrategy) {
				s.disable();
			}
		}
	}



	get vertical (): number { return this._activeStrategy.vertical }

	onViewResize () {
		let size = this._html.syncCanvasSize(this._activeStrategy.canvas);
		this._activeStrategy.onViewResize(size.width, size.height);
	}



	/*initComponents (components: TComponents): TComponents {
		for (let [name, initializersList] of Object.entries(this._componentInitializers)) {
			if (components[name]) {
				for (let initializer of initializersList) {
					components[name] = initializer({component: components[name]});
				}
			}
		}
		for (let strategy of Object.values(this._strategies)) {
			for (let [name, initializersList] of Object.entries(strategy.getComponentInitializers())) {
				if (components[name]) {
					for (let initer of initializersList) {
						components[name] = initer({component: components[name], ...strategy.getComponentInitParams()});
					}
				}
			}
		}
		return components;
	}*/



	/*updateFocusCoords () {
		this._activeStrategy.updateFocusCoords();
	}*/
}
