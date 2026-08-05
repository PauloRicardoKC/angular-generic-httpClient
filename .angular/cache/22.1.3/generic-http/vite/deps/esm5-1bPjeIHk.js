import { $n as SafeSubscriber, $t as not, An as popNumber, Bn as AsyncAction, Cn as from, Dn as observeOn, En as subscribeOn, Jn as createOperatorSubscriber, Mn as popScheduler, Nn as isScheduler, On as innerFrom, Pn as EMPTY, Qt as filter, Rn as AsyncScheduler, Tn as scheduleIterable, Vn as AsyncSubject, Wn as Subject, Yn as Observable, Zn as identity, ar as isFunction, cr as __read, dn as mapOneOrManyArgs, jn as popResultSelector, kn as isArrayLike, ln as createObject, lr as __spreadArray, on as mergeAll, or as __extends, rr as Subscription, sn as mergeMap, sr as __generator, tr as noop, un as argsArgArrayOrObject, vn as EmptyError } from "./zipWith-DkrnN79P.js";
//#region node_modules/rxjs/dist/esm5/internal/scheduler/performanceTimestampProvider.js
var performanceTimestampProvider = {
	now: function() {
		return (performanceTimestampProvider.delegate || performance).now();
	},
	delegate: void 0
};
//#endregion
//#region node_modules/rxjs/dist/esm5/internal/scheduler/animationFrameProvider.js
var animationFrameProvider = {
	schedule: function(callback) {
		var request = requestAnimationFrame;
		var cancel = cancelAnimationFrame;
		var delegate = animationFrameProvider.delegate;
		if (delegate) {
			request = delegate.requestAnimationFrame;
			cancel = delegate.cancelAnimationFrame;
		}
		var handle = request(function(timestamp) {
			cancel = void 0;
			callback(timestamp);
		});
		return new Subscription(function() {
			return cancel === null || cancel === void 0 ? void 0 : cancel(handle);
		});
	},
	requestAnimationFrame: function() {
		var args = [];
		for (var _i = 0; _i < arguments.length; _i++) args[_i] = arguments[_i];
		var delegate = animationFrameProvider.delegate;
		return ((delegate === null || delegate === void 0 ? void 0 : delegate.requestAnimationFrame) || requestAnimationFrame).apply(void 0, __spreadArray([], __read(args)));
	},
	cancelAnimationFrame: function() {
		var args = [];
		for (var _i = 0; _i < arguments.length; _i++) args[_i] = arguments[_i];
		var delegate = animationFrameProvider.delegate;
		return ((delegate === null || delegate === void 0 ? void 0 : delegate.cancelAnimationFrame) || cancelAnimationFrame).apply(void 0, __spreadArray([], __read(args)));
	},
	delegate: void 0
};
//#endregion
//#region node_modules/rxjs/dist/esm5/internal/observable/dom/animationFrames.js
function animationFrames(timestampProvider) {
	return timestampProvider ? animationFramesFactory(timestampProvider) : DEFAULT_ANIMATION_FRAMES;
}
function animationFramesFactory(timestampProvider) {
	return new Observable(function(subscriber) {
		var provider = timestampProvider || performanceTimestampProvider;
		var start = provider.now();
		var id = 0;
		var run = function() {
			if (!subscriber.closed) id = animationFrameProvider.requestAnimationFrame(function(timestamp) {
				id = 0;
				var now = provider.now();
				subscriber.next({
					timestamp: timestampProvider ? now : timestamp,
					elapsed: now - start
				});
				run();
			});
		};
		run();
		return function() {
			if (id) animationFrameProvider.cancelAnimationFrame(id);
		};
	});
}
var DEFAULT_ANIMATION_FRAMES = animationFramesFactory();
//#endregion
//#region node_modules/rxjs/dist/esm5/internal/util/Immediate.js
var nextHandle = 1;
var resolved;
var activeHandles = {};
function findAndClearHandle(handle) {
	if (handle in activeHandles) {
		delete activeHandles[handle];
		return true;
	}
	return false;
}
var Immediate = {
	setImmediate: function(cb) {
		var handle = nextHandle++;
		activeHandles[handle] = true;
		if (!resolved) resolved = Promise.resolve();
		resolved.then(function() {
			return findAndClearHandle(handle) && cb();
		});
		return handle;
	},
	clearImmediate: function(handle) {
		findAndClearHandle(handle);
	}
};
//#endregion
//#region node_modules/rxjs/dist/esm5/internal/scheduler/immediateProvider.js
var setImmediate = Immediate.setImmediate;
var clearImmediate = Immediate.clearImmediate;
var immediateProvider = {
	setImmediate: function() {
		var args = [];
		for (var _i = 0; _i < arguments.length; _i++) args[_i] = arguments[_i];
		var delegate = immediateProvider.delegate;
		return ((delegate === null || delegate === void 0 ? void 0 : delegate.setImmediate) || setImmediate).apply(void 0, __spreadArray([], __read(args)));
	},
	clearImmediate: function(handle) {
		var delegate = immediateProvider.delegate;
		return ((delegate === null || delegate === void 0 ? void 0 : delegate.clearImmediate) || clearImmediate)(handle);
	},
	delegate: void 0
};
//#endregion
//#region node_modules/rxjs/dist/esm5/internal/scheduler/AsapAction.js
var AsapAction = function(_super) {
	__extends(AsapAction, _super);
	function AsapAction(scheduler, work) {
		var _this = _super.call(this, scheduler, work) || this;
		_this.scheduler = scheduler;
		_this.work = work;
		return _this;
	}
	AsapAction.prototype.requestAsyncId = function(scheduler, id, delay) {
		if (delay === void 0) delay = 0;
		if (delay !== null && delay > 0) return _super.prototype.requestAsyncId.call(this, scheduler, id, delay);
		scheduler.actions.push(this);
		return scheduler._scheduled || (scheduler._scheduled = immediateProvider.setImmediate(scheduler.flush.bind(scheduler, void 0)));
	};
	AsapAction.prototype.recycleAsyncId = function(scheduler, id, delay) {
		var _a;
		if (delay === void 0) delay = 0;
		if (delay != null ? delay > 0 : this.delay > 0) return _super.prototype.recycleAsyncId.call(this, scheduler, id, delay);
		var actions = scheduler.actions;
		if (id != null && ((_a = actions[actions.length - 1]) === null || _a === void 0 ? void 0 : _a.id) !== id) {
			immediateProvider.clearImmediate(id);
			if (scheduler._scheduled === id) scheduler._scheduled = void 0;
		}
	};
	return AsapAction;
}(AsyncAction);
//#endregion
//#region node_modules/rxjs/dist/esm5/internal/scheduler/asap.js
var asapScheduler = new (function(_super) {
	__extends(AsapScheduler, _super);
	function AsapScheduler() {
		return _super !== null && _super.apply(this, arguments) || this;
	}
	AsapScheduler.prototype.flush = function(action) {
		this._active = true;
		var flushId = this._scheduled;
		this._scheduled = void 0;
		var actions = this.actions;
		var error;
		action = action || actions.shift();
		do
			if (error = action.execute(action.state, action.delay)) break;
		while ((action = actions[0]) && action.id === flushId && actions.shift());
		this._active = false;
		if (error) {
			while ((action = actions[0]) && action.id === flushId && actions.shift()) action.unsubscribe();
			throw error;
		}
	};
	return AsapScheduler;
}(AsyncScheduler))(AsapAction);
var asap = asapScheduler;
//#endregion
//#region node_modules/rxjs/dist/esm5/internal/scheduler/QueueAction.js
var QueueAction = function(_super) {
	__extends(QueueAction, _super);
	function QueueAction(scheduler, work) {
		var _this = _super.call(this, scheduler, work) || this;
		_this.scheduler = scheduler;
		_this.work = work;
		return _this;
	}
	QueueAction.prototype.schedule = function(state, delay) {
		if (delay === void 0) delay = 0;
		if (delay > 0) return _super.prototype.schedule.call(this, state, delay);
		this.delay = delay;
		this.state = state;
		this.scheduler.flush(this);
		return this;
	};
	QueueAction.prototype.execute = function(state, delay) {
		return delay > 0 || this.closed ? _super.prototype.execute.call(this, state, delay) : this._execute(state, delay);
	};
	QueueAction.prototype.requestAsyncId = function(scheduler, id, delay) {
		if (delay === void 0) delay = 0;
		if (delay != null && delay > 0 || delay == null && this.delay > 0) return _super.prototype.requestAsyncId.call(this, scheduler, id, delay);
		scheduler.flush(this);
		return 0;
	};
	return QueueAction;
}(AsyncAction);
//#endregion
//#region node_modules/rxjs/dist/esm5/internal/scheduler/queue.js
var queueScheduler = new (function(_super) {
	__extends(QueueScheduler, _super);
	function QueueScheduler() {
		return _super !== null && _super.apply(this, arguments) || this;
	}
	return QueueScheduler;
}(AsyncScheduler))(QueueAction);
var queue = queueScheduler;
//#endregion
//#region node_modules/rxjs/dist/esm5/internal/scheduler/AnimationFrameAction.js
var AnimationFrameAction = function(_super) {
	__extends(AnimationFrameAction, _super);
	function AnimationFrameAction(scheduler, work) {
		var _this = _super.call(this, scheduler, work) || this;
		_this.scheduler = scheduler;
		_this.work = work;
		return _this;
	}
	AnimationFrameAction.prototype.requestAsyncId = function(scheduler, id, delay) {
		if (delay === void 0) delay = 0;
		if (delay !== null && delay > 0) return _super.prototype.requestAsyncId.call(this, scheduler, id, delay);
		scheduler.actions.push(this);
		return scheduler._scheduled || (scheduler._scheduled = animationFrameProvider.requestAnimationFrame(function() {
			return scheduler.flush(void 0);
		}));
	};
	AnimationFrameAction.prototype.recycleAsyncId = function(scheduler, id, delay) {
		var _a;
		if (delay === void 0) delay = 0;
		if (delay != null ? delay > 0 : this.delay > 0) return _super.prototype.recycleAsyncId.call(this, scheduler, id, delay);
		var actions = scheduler.actions;
		if (id != null && id === scheduler._scheduled && ((_a = actions[actions.length - 1]) === null || _a === void 0 ? void 0 : _a.id) !== id) {
			animationFrameProvider.cancelAnimationFrame(id);
			scheduler._scheduled = void 0;
		}
	};
	return AnimationFrameAction;
}(AsyncAction);
//#endregion
//#region node_modules/rxjs/dist/esm5/internal/scheduler/animationFrame.js
var animationFrameScheduler = new (function(_super) {
	__extends(AnimationFrameScheduler, _super);
	function AnimationFrameScheduler() {
		return _super !== null && _super.apply(this, arguments) || this;
	}
	AnimationFrameScheduler.prototype.flush = function(action) {
		this._active = true;
		var flushId;
		if (action) flushId = action.id;
		else {
			flushId = this._scheduled;
			this._scheduled = void 0;
		}
		var actions = this.actions;
		var error;
		action = action || actions.shift();
		do
			if (error = action.execute(action.state, action.delay)) break;
		while ((action = actions[0]) && action.id === flushId && actions.shift());
		this._active = false;
		if (error) {
			while ((action = actions[0]) && action.id === flushId && actions.shift()) action.unsubscribe();
			throw error;
		}
	};
	return AnimationFrameScheduler;
}(AsyncScheduler))(AnimationFrameAction);
var animationFrame = animationFrameScheduler;
//#endregion
//#region node_modules/rxjs/dist/esm5/internal/scheduler/VirtualTimeScheduler.js
var VirtualTimeScheduler = function(_super) {
	__extends(VirtualTimeScheduler, _super);
	function VirtualTimeScheduler(schedulerActionCtor, maxFrames) {
		if (schedulerActionCtor === void 0) schedulerActionCtor = VirtualAction;
		if (maxFrames === void 0) maxFrames = Infinity;
		var _this = _super.call(this, schedulerActionCtor, function() {
			return _this.frame;
		}) || this;
		_this.maxFrames = maxFrames;
		_this.frame = 0;
		_this.index = -1;
		return _this;
	}
	VirtualTimeScheduler.prototype.flush = function() {
		var _a = this, actions = _a.actions, maxFrames = _a.maxFrames;
		var error;
		var action;
		while ((action = actions[0]) && action.delay <= maxFrames) {
			actions.shift();
			this.frame = action.delay;
			if (error = action.execute(action.state, action.delay)) break;
		}
		if (error) {
			while (action = actions.shift()) action.unsubscribe();
			throw error;
		}
	};
	VirtualTimeScheduler.frameTimeFactor = 10;
	return VirtualTimeScheduler;
}(AsyncScheduler);
var VirtualAction = function(_super) {
	__extends(VirtualAction, _super);
	function VirtualAction(scheduler, work, index) {
		if (index === void 0) index = scheduler.index += 1;
		var _this = _super.call(this, scheduler, work) || this;
		_this.scheduler = scheduler;
		_this.work = work;
		_this.index = index;
		_this.active = true;
		_this.index = scheduler.index = index;
		return _this;
	}
	VirtualAction.prototype.schedule = function(state, delay) {
		if (delay === void 0) delay = 0;
		if (Number.isFinite(delay)) {
			if (!this.id) return _super.prototype.schedule.call(this, state, delay);
			this.active = false;
			var action = new VirtualAction(this.scheduler, this.work);
			this.add(action);
			return action.schedule(state, delay);
		} else return Subscription.EMPTY;
	};
	VirtualAction.prototype.requestAsyncId = function(scheduler, id, delay) {
		if (delay === void 0) delay = 0;
		this.delay = scheduler.frame + delay;
		var actions = scheduler.actions;
		actions.push(this);
		actions.sort(VirtualAction.sortActions);
		return 1;
	};
	VirtualAction.prototype.recycleAsyncId = function(scheduler, id, delay) {
		if (delay === void 0) delay = 0;
	};
	VirtualAction.prototype._execute = function(state, delay) {
		if (this.active === true) return _super.prototype._execute.call(this, state, delay);
	};
	VirtualAction.sortActions = function(a, b) {
		if (a.delay === b.delay) if (a.index === b.index) return 0;
		else if (a.index > b.index) return 1;
		else return -1;
		else if (a.delay > b.delay) return 1;
		else return -1;
	};
	return VirtualAction;
}(AsyncAction);
//#endregion
//#region node_modules/rxjs/dist/esm5/internal/util/isObservable.js
function isObservable(obj) {
	return !!obj && (obj instanceof Observable || isFunction(obj.lift) && isFunction(obj.subscribe));
}
//#endregion
//#region node_modules/rxjs/dist/esm5/internal/lastValueFrom.js
function lastValueFrom(source, config) {
	var hasConfig = typeof config === "object";
	return new Promise(function(resolve, reject) {
		var _hasValue = false;
		var _value;
		source.subscribe({
			next: function(value) {
				_value = value;
				_hasValue = true;
			},
			error: reject,
			complete: function() {
				if (_hasValue) resolve(_value);
				else if (hasConfig) resolve(config.defaultValue);
				else reject(new EmptyError());
			}
		});
	});
}
//#endregion
//#region node_modules/rxjs/dist/esm5/internal/firstValueFrom.js
function firstValueFrom(source, config) {
	var hasConfig = typeof config === "object";
	return new Promise(function(resolve, reject) {
		var subscriber = new SafeSubscriber({
			next: function(value) {
				resolve(value);
				subscriber.unsubscribe();
			},
			error: reject,
			complete: function() {
				if (hasConfig) resolve(config.defaultValue);
				else reject(new EmptyError());
			}
		});
		source.subscribe(subscriber);
	});
}
//#endregion
//#region node_modules/rxjs/dist/esm5/internal/observable/bindCallbackInternals.js
function bindCallbackInternals(isNodeStyle, callbackFunc, resultSelector, scheduler) {
	if (resultSelector) if (isScheduler(resultSelector)) scheduler = resultSelector;
	else return function() {
		var args = [];
		for (var _i = 0; _i < arguments.length; _i++) args[_i] = arguments[_i];
		return bindCallbackInternals(isNodeStyle, callbackFunc, scheduler).apply(this, args).pipe(mapOneOrManyArgs(resultSelector));
	};
	if (scheduler) return function() {
		var args = [];
		for (var _i = 0; _i < arguments.length; _i++) args[_i] = arguments[_i];
		return bindCallbackInternals(isNodeStyle, callbackFunc).apply(this, args).pipe(subscribeOn(scheduler), observeOn(scheduler));
	};
	return function() {
		var _this = this;
		var args = [];
		for (var _i = 0; _i < arguments.length; _i++) args[_i] = arguments[_i];
		var subject = new AsyncSubject();
		var uninitialized = true;
		return new Observable(function(subscriber) {
			var subs = subject.subscribe(subscriber);
			if (uninitialized) {
				uninitialized = false;
				var isAsync_1 = false;
				var isComplete_1 = false;
				callbackFunc.apply(_this, __spreadArray(__spreadArray([], __read(args)), [function() {
					var results = [];
					for (var _i = 0; _i < arguments.length; _i++) results[_i] = arguments[_i];
					if (isNodeStyle) {
						var err = results.shift();
						if (err != null) {
							subject.error(err);
							return;
						}
					}
					subject.next(1 < results.length ? results : results[0]);
					isComplete_1 = true;
					if (isAsync_1) subject.complete();
				}]));
				if (isComplete_1) subject.complete();
				isAsync_1 = true;
			}
			return subs;
		});
	};
}
//#endregion
//#region node_modules/rxjs/dist/esm5/internal/observable/bindCallback.js
function bindCallback(callbackFunc, resultSelector, scheduler) {
	return bindCallbackInternals(false, callbackFunc, resultSelector, scheduler);
}
//#endregion
//#region node_modules/rxjs/dist/esm5/internal/observable/bindNodeCallback.js
function bindNodeCallback(callbackFunc, resultSelector, scheduler) {
	return bindCallbackInternals(true, callbackFunc, resultSelector, scheduler);
}
//#endregion
//#region node_modules/rxjs/dist/esm5/internal/observable/defer.js
function defer(observableFactory) {
	return new Observable(function(subscriber) {
		innerFrom(observableFactory()).subscribe(subscriber);
	});
}
//#endregion
//#region node_modules/rxjs/dist/esm5/internal/observable/connectable.js
var DEFAULT_CONFIG = {
	connector: function() {
		return new Subject();
	},
	resetOnDisconnect: true
};
function connectable(source, config) {
	if (config === void 0) config = DEFAULT_CONFIG;
	var connection = null;
	var connector = config.connector, _a = config.resetOnDisconnect, resetOnDisconnect = _a === void 0 ? true : _a;
	var subject = connector();
	var result = new Observable(function(subscriber) {
		return subject.subscribe(subscriber);
	});
	result.connect = function() {
		if (!connection || connection.closed) {
			connection = defer(function() {
				return source;
			}).subscribe(subject);
			if (resetOnDisconnect) connection.add(function() {
				return subject = connector();
			});
		}
		return connection;
	};
	return result;
}
//#endregion
//#region node_modules/rxjs/dist/esm5/internal/observable/forkJoin.js
function forkJoin() {
	var args = [];
	for (var _i = 0; _i < arguments.length; _i++) args[_i] = arguments[_i];
	var resultSelector = popResultSelector(args);
	var _a = argsArgArrayOrObject(args), sources = _a.args, keys = _a.keys;
	var result = new Observable(function(subscriber) {
		var length = sources.length;
		if (!length) {
			subscriber.complete();
			return;
		}
		var values = new Array(length);
		var remainingCompletions = length;
		var remainingEmissions = length;
		var _loop_1 = function(sourceIndex) {
			var hasValue = false;
			innerFrom(sources[sourceIndex]).subscribe(createOperatorSubscriber(subscriber, function(value) {
				if (!hasValue) {
					hasValue = true;
					remainingEmissions--;
				}
				values[sourceIndex] = value;
			}, function() {
				return remainingCompletions--;
			}, void 0, function() {
				if (!remainingCompletions || !hasValue) {
					if (!remainingEmissions) subscriber.next(keys ? createObject(keys, values) : values);
					subscriber.complete();
				}
			}));
		};
		for (var sourceIndex = 0; sourceIndex < length; sourceIndex++) _loop_1(sourceIndex);
	});
	return resultSelector ? result.pipe(mapOneOrManyArgs(resultSelector)) : result;
}
//#endregion
//#region node_modules/rxjs/dist/esm5/internal/observable/fromEvent.js
var nodeEventEmitterMethods = ["addListener", "removeListener"];
var eventTargetMethods = ["addEventListener", "removeEventListener"];
var jqueryMethods = ["on", "off"];
function fromEvent(target, eventName, options, resultSelector) {
	if (isFunction(options)) {
		resultSelector = options;
		options = void 0;
	}
	if (resultSelector) return fromEvent(target, eventName, options).pipe(mapOneOrManyArgs(resultSelector));
	var _a = __read(isEventTarget(target) ? eventTargetMethods.map(function(methodName) {
		return function(handler) {
			return target[methodName](eventName, handler, options);
		};
	}) : isNodeStyleEventEmitter(target) ? nodeEventEmitterMethods.map(toCommonHandlerRegistry(target, eventName)) : isJQueryStyleEventEmitter(target) ? jqueryMethods.map(toCommonHandlerRegistry(target, eventName)) : [], 2), add = _a[0], remove = _a[1];
	if (!add) {
		if (isArrayLike(target)) return mergeMap(function(subTarget) {
			return fromEvent(subTarget, eventName, options);
		})(innerFrom(target));
	}
	if (!add) throw new TypeError("Invalid event target");
	return new Observable(function(subscriber) {
		var handler = function() {
			var args = [];
			for (var _i = 0; _i < arguments.length; _i++) args[_i] = arguments[_i];
			return subscriber.next(1 < args.length ? args : args[0]);
		};
		add(handler);
		return function() {
			return remove(handler);
		};
	});
}
function toCommonHandlerRegistry(target, eventName) {
	return function(methodName) {
		return function(handler) {
			return target[methodName](eventName, handler);
		};
	};
}
function isNodeStyleEventEmitter(target) {
	return isFunction(target.addListener) && isFunction(target.removeListener);
}
function isJQueryStyleEventEmitter(target) {
	return isFunction(target.on) && isFunction(target.off);
}
function isEventTarget(target) {
	return isFunction(target.addEventListener) && isFunction(target.removeEventListener);
}
//#endregion
//#region node_modules/rxjs/dist/esm5/internal/observable/fromEventPattern.js
function fromEventPattern(addHandler, removeHandler, resultSelector) {
	if (resultSelector) return fromEventPattern(addHandler, removeHandler).pipe(mapOneOrManyArgs(resultSelector));
	return new Observable(function(subscriber) {
		var handler = function() {
			var e = [];
			for (var _i = 0; _i < arguments.length; _i++) e[_i] = arguments[_i];
			return subscriber.next(e.length === 1 ? e[0] : e);
		};
		var retValue = addHandler(handler);
		return isFunction(removeHandler) ? function() {
			return removeHandler(handler, retValue);
		} : void 0;
	});
}
//#endregion
//#region node_modules/rxjs/dist/esm5/internal/observable/generate.js
function generate(initialStateOrOptions, condition, iterate, resultSelectorOrScheduler, scheduler) {
	var _a, _b;
	var resultSelector;
	var initialState;
	if (arguments.length === 1) _a = initialStateOrOptions, initialState = _a.initialState, condition = _a.condition, iterate = _a.iterate, _b = _a.resultSelector, resultSelector = _b === void 0 ? identity : _b, scheduler = _a.scheduler;
	else {
		initialState = initialStateOrOptions;
		if (!resultSelectorOrScheduler || isScheduler(resultSelectorOrScheduler)) {
			resultSelector = identity;
			scheduler = resultSelectorOrScheduler;
		} else resultSelector = resultSelectorOrScheduler;
	}
	function gen() {
		var state;
		return __generator(this, function(_a) {
			switch (_a.label) {
				case 0:
					state = initialState;
					_a.label = 1;
				case 1:
					if (!(!condition || condition(state))) return [3, 4];
					return [4, resultSelector(state)];
				case 2:
					_a.sent();
					_a.label = 3;
				case 3:
					state = iterate(state);
					return [3, 1];
				case 4: return [2];
			}
		});
	}
	return defer(scheduler ? function() {
		return scheduleIterable(gen(), scheduler);
	} : gen);
}
//#endregion
//#region node_modules/rxjs/dist/esm5/internal/observable/iif.js
function iif(condition, trueResult, falseResult) {
	return defer(function() {
		return condition() ? trueResult : falseResult;
	});
}
//#endregion
//#region node_modules/rxjs/dist/esm5/internal/observable/merge.js
function merge() {
	var args = [];
	for (var _i = 0; _i < arguments.length; _i++) args[_i] = arguments[_i];
	var scheduler = popScheduler(args);
	var concurrent = popNumber(args, Infinity);
	var sources = args;
	return !sources.length ? EMPTY : sources.length === 1 ? innerFrom(sources[0]) : mergeAll(concurrent)(from(sources, scheduler));
}
//#endregion
//#region node_modules/rxjs/dist/esm5/internal/observable/never.js
var NEVER = new Observable(noop);
function never() {
	return NEVER;
}
//#endregion
//#region node_modules/rxjs/dist/esm5/internal/observable/pairs.js
function pairs(obj, scheduler) {
	return from(Object.entries(obj), scheduler);
}
//#endregion
//#region node_modules/rxjs/dist/esm5/internal/observable/partition.js
function partition(source, predicate, thisArg) {
	return [filter(predicate, thisArg)(innerFrom(source)), filter(not(predicate, thisArg))(innerFrom(source))];
}
//#endregion
//#region node_modules/rxjs/dist/esm5/internal/observable/range.js
function range(start, count, scheduler) {
	if (count == null) {
		count = start;
		start = 0;
	}
	if (count <= 0) return EMPTY;
	var end = count + start;
	return new Observable(scheduler ? function(subscriber) {
		var n = start;
		return scheduler.schedule(function() {
			if (n < end) {
				subscriber.next(n++);
				this.schedule();
			} else subscriber.complete();
		});
	} : function(subscriber) {
		var n = start;
		while (n < end && !subscriber.closed) subscriber.next(n++);
		subscriber.complete();
	});
}
//#endregion
//#region node_modules/rxjs/dist/esm5/internal/observable/using.js
function using(resourceFactory, observableFactory) {
	return new Observable(function(subscriber) {
		var resource = resourceFactory();
		var result = observableFactory(resource);
		(result ? innerFrom(result) : EMPTY).subscribe(subscriber);
		return function() {
			if (resource) resource.unsubscribe();
		};
	});
}
//#endregion
export { animationFrameScheduler as C, asapScheduler as D, asap as E, animationFrames as O, animationFrame as S, queueScheduler as T, firstValueFrom as _, NEVER as a, VirtualAction as b, iif as c, fromEvent as d, forkJoin as f, bindCallback as g, bindNodeCallback as h, pairs as i, generate as l, defer as m, range as n, never as o, connectable as p, partition as r, merge as s, using as t, fromEventPattern as u, lastValueFrom as v, queue as w, VirtualTimeScheduler as x, isObservable as y };
