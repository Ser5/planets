export class StrategyHelper<T> {
	private _strategies:     Record<string, T> = {};
	private _activeStrategy: T;

	constructor (strategies: Record<string, T>) {
		this._strategies = strategies;
		this.setActiveStrategy(Object.keys(strategies)[0]);
	}



	setActiveStrategy (name: string) {
		this._activeStrategy = this._strategies[name];
	}



	get activeStrategy () { return this._activeStrategy }
}
