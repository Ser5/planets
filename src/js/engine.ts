import {IStrategist}     from 'istrategist';
import {IEngineStrategy} from 'iengine-strategy';
import {DrawSystem}      from 'system/draw-system';
import {Focus}           from 'focus';
import {StrategyHelper}  from 'strategy-helper';



export class Engine implements IStrategist {
	private _strategyHelper;

	private _drawSystem: DrawSystem;
	private _focus:      Focus;

	constructor (
		{drawSystem,             focus,        strategies}:
		{drawSystem: DrawSystem, focus: Focus, strategies: Record<string, IEngineStrategy>}
	) {
		this._strategyHelper = new StrategyHelper<IEngineStrategy>(strategies);
		this._drawSystem     = drawSystem;
		this._focus          = focus;
	}



	setStrategy (name: string) {
		this._strategyHelper.setActiveStrategy(name);

		let strats = this._strategyHelper.activeStrategy;

		this._drawSystem.setStrategy(strats.drawStrategy);
		this._focus.setStrategy(strats.focusStrategy);
	}
}
