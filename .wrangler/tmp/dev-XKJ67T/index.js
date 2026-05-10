var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// node_modules/unenv/dist/runtime/_internal/utils.mjs
// @__NO_SIDE_EFFECTS__
function createNotImplementedError(name) {
  return new Error(`[unenv] ${name} is not implemented yet!`);
}
__name(createNotImplementedError, "createNotImplementedError");
// @__NO_SIDE_EFFECTS__
function notImplemented(name) {
  const fn = /* @__PURE__ */ __name(() => {
    throw /* @__PURE__ */ createNotImplementedError(name);
  }, "fn");
  return Object.assign(fn, { __unenv__: true });
}
__name(notImplemented, "notImplemented");
// @__NO_SIDE_EFFECTS__
function notImplementedClass(name) {
  return class {
    __unenv__ = true;
    constructor() {
      throw new Error(`[unenv] ${name} is not implemented yet!`);
    }
  };
}
__name(notImplementedClass, "notImplementedClass");

// node_modules/unenv/dist/runtime/node/internal/perf_hooks/performance.mjs
var _timeOrigin = globalThis.performance?.timeOrigin ?? Date.now();
var _performanceNow = globalThis.performance?.now ? globalThis.performance.now.bind(globalThis.performance) : () => Date.now() - _timeOrigin;
var nodeTiming = {
  name: "node",
  entryType: "node",
  startTime: 0,
  duration: 0,
  nodeStart: 0,
  v8Start: 0,
  bootstrapComplete: 0,
  environment: 0,
  loopStart: 0,
  loopExit: 0,
  idleTime: 0,
  uvMetricsInfo: {
    loopCount: 0,
    events: 0,
    eventsWaiting: 0
  },
  detail: void 0,
  toJSON() {
    return this;
  }
};
var PerformanceEntry = class {
  static {
    __name(this, "PerformanceEntry");
  }
  __unenv__ = true;
  detail;
  entryType = "event";
  name;
  startTime;
  constructor(name, options) {
    this.name = name;
    this.startTime = options?.startTime || _performanceNow();
    this.detail = options?.detail;
  }
  get duration() {
    return _performanceNow() - this.startTime;
  }
  toJSON() {
    return {
      name: this.name,
      entryType: this.entryType,
      startTime: this.startTime,
      duration: this.duration,
      detail: this.detail
    };
  }
};
var PerformanceMark = class PerformanceMark2 extends PerformanceEntry {
  static {
    __name(this, "PerformanceMark");
  }
  entryType = "mark";
  constructor() {
    super(...arguments);
  }
  get duration() {
    return 0;
  }
};
var PerformanceMeasure = class extends PerformanceEntry {
  static {
    __name(this, "PerformanceMeasure");
  }
  entryType = "measure";
};
var PerformanceResourceTiming = class extends PerformanceEntry {
  static {
    __name(this, "PerformanceResourceTiming");
  }
  entryType = "resource";
  serverTiming = [];
  connectEnd = 0;
  connectStart = 0;
  decodedBodySize = 0;
  domainLookupEnd = 0;
  domainLookupStart = 0;
  encodedBodySize = 0;
  fetchStart = 0;
  initiatorType = "";
  name = "";
  nextHopProtocol = "";
  redirectEnd = 0;
  redirectStart = 0;
  requestStart = 0;
  responseEnd = 0;
  responseStart = 0;
  secureConnectionStart = 0;
  startTime = 0;
  transferSize = 0;
  workerStart = 0;
  responseStatus = 0;
};
var PerformanceObserverEntryList = class {
  static {
    __name(this, "PerformanceObserverEntryList");
  }
  __unenv__ = true;
  getEntries() {
    return [];
  }
  getEntriesByName(_name, _type) {
    return [];
  }
  getEntriesByType(type) {
    return [];
  }
};
var Performance = class {
  static {
    __name(this, "Performance");
  }
  __unenv__ = true;
  timeOrigin = _timeOrigin;
  eventCounts = /* @__PURE__ */ new Map();
  _entries = [];
  _resourceTimingBufferSize = 0;
  navigation = void 0;
  timing = void 0;
  timerify(_fn, _options) {
    throw createNotImplementedError("Performance.timerify");
  }
  get nodeTiming() {
    return nodeTiming;
  }
  eventLoopUtilization() {
    return {};
  }
  markResourceTiming() {
    return new PerformanceResourceTiming("");
  }
  onresourcetimingbufferfull = null;
  now() {
    if (this.timeOrigin === _timeOrigin) {
      return _performanceNow();
    }
    return Date.now() - this.timeOrigin;
  }
  clearMarks(markName) {
    this._entries = markName ? this._entries.filter((e) => e.name !== markName) : this._entries.filter((e) => e.entryType !== "mark");
  }
  clearMeasures(measureName) {
    this._entries = measureName ? this._entries.filter((e) => e.name !== measureName) : this._entries.filter((e) => e.entryType !== "measure");
  }
  clearResourceTimings() {
    this._entries = this._entries.filter((e) => e.entryType !== "resource" || e.entryType !== "navigation");
  }
  getEntries() {
    return this._entries;
  }
  getEntriesByName(name, type) {
    return this._entries.filter((e) => e.name === name && (!type || e.entryType === type));
  }
  getEntriesByType(type) {
    return this._entries.filter((e) => e.entryType === type);
  }
  mark(name, options) {
    const entry = new PerformanceMark(name, options);
    this._entries.push(entry);
    return entry;
  }
  measure(measureName, startOrMeasureOptions, endMark) {
    let start;
    let end;
    if (typeof startOrMeasureOptions === "string") {
      start = this.getEntriesByName(startOrMeasureOptions, "mark")[0]?.startTime;
      end = this.getEntriesByName(endMark, "mark")[0]?.startTime;
    } else {
      start = Number.parseFloat(startOrMeasureOptions?.start) || this.now();
      end = Number.parseFloat(startOrMeasureOptions?.end) || this.now();
    }
    const entry = new PerformanceMeasure(measureName, {
      startTime: start,
      detail: {
        start,
        end
      }
    });
    this._entries.push(entry);
    return entry;
  }
  setResourceTimingBufferSize(maxSize) {
    this._resourceTimingBufferSize = maxSize;
  }
  addEventListener(type, listener, options) {
    throw createNotImplementedError("Performance.addEventListener");
  }
  removeEventListener(type, listener, options) {
    throw createNotImplementedError("Performance.removeEventListener");
  }
  dispatchEvent(event) {
    throw createNotImplementedError("Performance.dispatchEvent");
  }
  toJSON() {
    return this;
  }
};
var PerformanceObserver = class {
  static {
    __name(this, "PerformanceObserver");
  }
  __unenv__ = true;
  static supportedEntryTypes = [];
  _callback = null;
  constructor(callback) {
    this._callback = callback;
  }
  takeRecords() {
    return [];
  }
  disconnect() {
    throw createNotImplementedError("PerformanceObserver.disconnect");
  }
  observe(options) {
    throw createNotImplementedError("PerformanceObserver.observe");
  }
  bind(fn) {
    return fn;
  }
  runInAsyncScope(fn, thisArg, ...args) {
    return fn.call(thisArg, ...args);
  }
  asyncId() {
    return 0;
  }
  triggerAsyncId() {
    return 0;
  }
  emitDestroy() {
    return this;
  }
};
var performance = globalThis.performance && "addEventListener" in globalThis.performance ? globalThis.performance : new Performance();

// node_modules/wrangler/node_modules/@cloudflare/unenv-preset/dist/runtime/polyfill/performance.mjs
if (!("__unenv__" in performance)) {
  const proto = Performance.prototype;
  for (const key of Object.getOwnPropertyNames(proto)) {
    if (key !== "constructor" && !(key in performance)) {
      const desc = Object.getOwnPropertyDescriptor(proto, key);
      if (desc) {
        Object.defineProperty(performance, key, desc);
      }
    }
  }
}
globalThis.performance = performance;
globalThis.Performance = Performance;
globalThis.PerformanceEntry = PerformanceEntry;
globalThis.PerformanceMark = PerformanceMark;
globalThis.PerformanceMeasure = PerformanceMeasure;
globalThis.PerformanceObserver = PerformanceObserver;
globalThis.PerformanceObserverEntryList = PerformanceObserverEntryList;
globalThis.PerformanceResourceTiming = PerformanceResourceTiming;

// node_modules/unenv/dist/runtime/node/console.mjs
import { Writable } from "node:stream";

// node_modules/unenv/dist/runtime/mock/noop.mjs
var noop_default = Object.assign(() => {
}, { __unenv__: true });

// node_modules/unenv/dist/runtime/node/console.mjs
var _console = globalThis.console;
var _ignoreErrors = true;
var _stderr = new Writable();
var _stdout = new Writable();
var log = _console?.log ?? noop_default;
var info = _console?.info ?? log;
var trace = _console?.trace ?? info;
var debug = _console?.debug ?? log;
var table = _console?.table ?? log;
var error = _console?.error ?? log;
var warn = _console?.warn ?? error;
var createTask = _console?.createTask ?? /* @__PURE__ */ notImplemented("console.createTask");
var clear = _console?.clear ?? noop_default;
var count = _console?.count ?? noop_default;
var countReset = _console?.countReset ?? noop_default;
var dir = _console?.dir ?? noop_default;
var dirxml = _console?.dirxml ?? noop_default;
var group = _console?.group ?? noop_default;
var groupEnd = _console?.groupEnd ?? noop_default;
var groupCollapsed = _console?.groupCollapsed ?? noop_default;
var profile = _console?.profile ?? noop_default;
var profileEnd = _console?.profileEnd ?? noop_default;
var time = _console?.time ?? noop_default;
var timeEnd = _console?.timeEnd ?? noop_default;
var timeLog = _console?.timeLog ?? noop_default;
var timeStamp = _console?.timeStamp ?? noop_default;
var Console = _console?.Console ?? /* @__PURE__ */ notImplementedClass("console.Console");
var _times = /* @__PURE__ */ new Map();
var _stdoutErrorHandler = noop_default;
var _stderrErrorHandler = noop_default;

// node_modules/wrangler/node_modules/@cloudflare/unenv-preset/dist/runtime/node/console.mjs
var workerdConsole = globalThis["console"];
var {
  assert,
  clear: clear2,
  // @ts-expect-error undocumented public API
  context,
  count: count2,
  countReset: countReset2,
  // @ts-expect-error undocumented public API
  createTask: createTask2,
  debug: debug2,
  dir: dir2,
  dirxml: dirxml2,
  error: error2,
  group: group2,
  groupCollapsed: groupCollapsed2,
  groupEnd: groupEnd2,
  info: info2,
  log: log2,
  profile: profile2,
  profileEnd: profileEnd2,
  table: table2,
  time: time2,
  timeEnd: timeEnd2,
  timeLog: timeLog2,
  timeStamp: timeStamp2,
  trace: trace2,
  warn: warn2
} = workerdConsole;
Object.assign(workerdConsole, {
  Console,
  _ignoreErrors,
  _stderr,
  _stderrErrorHandler,
  _stdout,
  _stdoutErrorHandler,
  _times
});
var console_default = workerdConsole;

// node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-console
globalThis.console = console_default;

// node_modules/unenv/dist/runtime/node/internal/process/hrtime.mjs
var hrtime = /* @__PURE__ */ Object.assign(/* @__PURE__ */ __name(function hrtime2(startTime) {
  const now = Date.now();
  const seconds = Math.trunc(now / 1e3);
  const nanos = now % 1e3 * 1e6;
  if (startTime) {
    let diffSeconds = seconds - startTime[0];
    let diffNanos = nanos - startTime[0];
    if (diffNanos < 0) {
      diffSeconds = diffSeconds - 1;
      diffNanos = 1e9 + diffNanos;
    }
    return [diffSeconds, diffNanos];
  }
  return [seconds, nanos];
}, "hrtime"), { bigint: /* @__PURE__ */ __name(function bigint() {
  return BigInt(Date.now() * 1e6);
}, "bigint") });

// node_modules/unenv/dist/runtime/node/internal/process/process.mjs
import { EventEmitter } from "node:events";

// node_modules/unenv/dist/runtime/node/internal/tty/read-stream.mjs
var ReadStream = class {
  static {
    __name(this, "ReadStream");
  }
  fd;
  isRaw = false;
  isTTY = false;
  constructor(fd) {
    this.fd = fd;
  }
  setRawMode(mode) {
    this.isRaw = mode;
    return this;
  }
};

// node_modules/unenv/dist/runtime/node/internal/tty/write-stream.mjs
var WriteStream = class {
  static {
    __name(this, "WriteStream");
  }
  fd;
  columns = 80;
  rows = 24;
  isTTY = false;
  constructor(fd) {
    this.fd = fd;
  }
  clearLine(dir3, callback) {
    callback && callback();
    return false;
  }
  clearScreenDown(callback) {
    callback && callback();
    return false;
  }
  cursorTo(x, y, callback) {
    callback && typeof callback === "function" && callback();
    return false;
  }
  moveCursor(dx, dy, callback) {
    callback && callback();
    return false;
  }
  getColorDepth(env2) {
    return 1;
  }
  hasColors(count3, env2) {
    return false;
  }
  getWindowSize() {
    return [this.columns, this.rows];
  }
  write(str, encoding, cb) {
    if (str instanceof Uint8Array) {
      str = new TextDecoder().decode(str);
    }
    try {
      console.log(str);
    } catch {
    }
    cb && typeof cb === "function" && cb();
    return false;
  }
};

// node_modules/unenv/dist/runtime/node/internal/process/node-version.mjs
var NODE_VERSION = "22.14.0";

// node_modules/unenv/dist/runtime/node/internal/process/process.mjs
var Process = class _Process extends EventEmitter {
  static {
    __name(this, "Process");
  }
  env;
  hrtime;
  nextTick;
  constructor(impl) {
    super();
    this.env = impl.env;
    this.hrtime = impl.hrtime;
    this.nextTick = impl.nextTick;
    for (const prop of [...Object.getOwnPropertyNames(_Process.prototype), ...Object.getOwnPropertyNames(EventEmitter.prototype)]) {
      const value = this[prop];
      if (typeof value === "function") {
        this[prop] = value.bind(this);
      }
    }
  }
  // --- event emitter ---
  emitWarning(warning, type, code) {
    console.warn(`${code ? `[${code}] ` : ""}${type ? `${type}: ` : ""}${warning}`);
  }
  emit(...args) {
    return super.emit(...args);
  }
  listeners(eventName) {
    return super.listeners(eventName);
  }
  // --- stdio (lazy initializers) ---
  #stdin;
  #stdout;
  #stderr;
  get stdin() {
    return this.#stdin ??= new ReadStream(0);
  }
  get stdout() {
    return this.#stdout ??= new WriteStream(1);
  }
  get stderr() {
    return this.#stderr ??= new WriteStream(2);
  }
  // --- cwd ---
  #cwd = "/";
  chdir(cwd2) {
    this.#cwd = cwd2;
  }
  cwd() {
    return this.#cwd;
  }
  // --- dummy props and getters ---
  arch = "";
  platform = "";
  argv = [];
  argv0 = "";
  execArgv = [];
  execPath = "";
  title = "";
  pid = 200;
  ppid = 100;
  get version() {
    return `v${NODE_VERSION}`;
  }
  get versions() {
    return { node: NODE_VERSION };
  }
  get allowedNodeEnvironmentFlags() {
    return /* @__PURE__ */ new Set();
  }
  get sourceMapsEnabled() {
    return false;
  }
  get debugPort() {
    return 0;
  }
  get throwDeprecation() {
    return false;
  }
  get traceDeprecation() {
    return false;
  }
  get features() {
    return {};
  }
  get release() {
    return {};
  }
  get connected() {
    return false;
  }
  get config() {
    return {};
  }
  get moduleLoadList() {
    return [];
  }
  constrainedMemory() {
    return 0;
  }
  availableMemory() {
    return 0;
  }
  uptime() {
    return 0;
  }
  resourceUsage() {
    return {};
  }
  // --- noop methods ---
  ref() {
  }
  unref() {
  }
  // --- unimplemented methods ---
  umask() {
    throw createNotImplementedError("process.umask");
  }
  getBuiltinModule() {
    return void 0;
  }
  getActiveResourcesInfo() {
    throw createNotImplementedError("process.getActiveResourcesInfo");
  }
  exit() {
    throw createNotImplementedError("process.exit");
  }
  reallyExit() {
    throw createNotImplementedError("process.reallyExit");
  }
  kill() {
    throw createNotImplementedError("process.kill");
  }
  abort() {
    throw createNotImplementedError("process.abort");
  }
  dlopen() {
    throw createNotImplementedError("process.dlopen");
  }
  setSourceMapsEnabled() {
    throw createNotImplementedError("process.setSourceMapsEnabled");
  }
  loadEnvFile() {
    throw createNotImplementedError("process.loadEnvFile");
  }
  disconnect() {
    throw createNotImplementedError("process.disconnect");
  }
  cpuUsage() {
    throw createNotImplementedError("process.cpuUsage");
  }
  setUncaughtExceptionCaptureCallback() {
    throw createNotImplementedError("process.setUncaughtExceptionCaptureCallback");
  }
  hasUncaughtExceptionCaptureCallback() {
    throw createNotImplementedError("process.hasUncaughtExceptionCaptureCallback");
  }
  initgroups() {
    throw createNotImplementedError("process.initgroups");
  }
  openStdin() {
    throw createNotImplementedError("process.openStdin");
  }
  assert() {
    throw createNotImplementedError("process.assert");
  }
  binding() {
    throw createNotImplementedError("process.binding");
  }
  // --- attached interfaces ---
  permission = { has: /* @__PURE__ */ notImplemented("process.permission.has") };
  report = {
    directory: "",
    filename: "",
    signal: "SIGUSR2",
    compact: false,
    reportOnFatalError: false,
    reportOnSignal: false,
    reportOnUncaughtException: false,
    getReport: /* @__PURE__ */ notImplemented("process.report.getReport"),
    writeReport: /* @__PURE__ */ notImplemented("process.report.writeReport")
  };
  finalization = {
    register: /* @__PURE__ */ notImplemented("process.finalization.register"),
    unregister: /* @__PURE__ */ notImplemented("process.finalization.unregister"),
    registerBeforeExit: /* @__PURE__ */ notImplemented("process.finalization.registerBeforeExit")
  };
  memoryUsage = Object.assign(() => ({
    arrayBuffers: 0,
    rss: 0,
    external: 0,
    heapTotal: 0,
    heapUsed: 0
  }), { rss: /* @__PURE__ */ __name(() => 0, "rss") });
  // --- undefined props ---
  mainModule = void 0;
  domain = void 0;
  // optional
  send = void 0;
  exitCode = void 0;
  channel = void 0;
  getegid = void 0;
  geteuid = void 0;
  getgid = void 0;
  getgroups = void 0;
  getuid = void 0;
  setegid = void 0;
  seteuid = void 0;
  setgid = void 0;
  setgroups = void 0;
  setuid = void 0;
  // internals
  _events = void 0;
  _eventsCount = void 0;
  _exiting = void 0;
  _maxListeners = void 0;
  _debugEnd = void 0;
  _debugProcess = void 0;
  _fatalException = void 0;
  _getActiveHandles = void 0;
  _getActiveRequests = void 0;
  _kill = void 0;
  _preload_modules = void 0;
  _rawDebug = void 0;
  _startProfilerIdleNotifier = void 0;
  _stopProfilerIdleNotifier = void 0;
  _tickCallback = void 0;
  _disconnect = void 0;
  _handleQueue = void 0;
  _pendingMessage = void 0;
  _channel = void 0;
  _send = void 0;
  _linkedBinding = void 0;
};

// node_modules/wrangler/node_modules/@cloudflare/unenv-preset/dist/runtime/node/process.mjs
var globalProcess = globalThis["process"];
var getBuiltinModule = globalProcess.getBuiltinModule;
var workerdProcess = getBuiltinModule("node:process");
var unenvProcess = new Process({
  env: globalProcess.env,
  hrtime,
  // `nextTick` is available from workerd process v1
  nextTick: workerdProcess.nextTick
});
var { exit, features, platform } = workerdProcess;
var {
  _channel,
  _debugEnd,
  _debugProcess,
  _disconnect,
  _events,
  _eventsCount,
  _exiting,
  _fatalException,
  _getActiveHandles,
  _getActiveRequests,
  _handleQueue,
  _kill,
  _linkedBinding,
  _maxListeners,
  _pendingMessage,
  _preload_modules,
  _rawDebug,
  _send,
  _startProfilerIdleNotifier,
  _stopProfilerIdleNotifier,
  _tickCallback,
  abort,
  addListener,
  allowedNodeEnvironmentFlags,
  arch,
  argv,
  argv0,
  assert: assert2,
  availableMemory,
  binding,
  channel,
  chdir,
  config,
  connected,
  constrainedMemory,
  cpuUsage,
  cwd,
  debugPort,
  disconnect,
  dlopen,
  domain,
  emit,
  emitWarning,
  env,
  eventNames,
  execArgv,
  execPath,
  exitCode,
  finalization,
  getActiveResourcesInfo,
  getegid,
  geteuid,
  getgid,
  getgroups,
  getMaxListeners,
  getuid,
  hasUncaughtExceptionCaptureCallback,
  hrtime: hrtime3,
  initgroups,
  kill,
  listenerCount,
  listeners,
  loadEnvFile,
  mainModule,
  memoryUsage,
  moduleLoadList,
  nextTick,
  off,
  on,
  once,
  openStdin,
  permission,
  pid,
  ppid,
  prependListener,
  prependOnceListener,
  rawListeners,
  reallyExit,
  ref,
  release,
  removeAllListeners,
  removeListener,
  report,
  resourceUsage,
  send,
  setegid,
  seteuid,
  setgid,
  setgroups,
  setMaxListeners,
  setSourceMapsEnabled,
  setuid,
  setUncaughtExceptionCaptureCallback,
  sourceMapsEnabled,
  stderr,
  stdin,
  stdout,
  throwDeprecation,
  title,
  traceDeprecation,
  umask,
  unref,
  uptime,
  version,
  versions
} = unenvProcess;
var _process = {
  abort,
  addListener,
  allowedNodeEnvironmentFlags,
  hasUncaughtExceptionCaptureCallback,
  setUncaughtExceptionCaptureCallback,
  loadEnvFile,
  sourceMapsEnabled,
  arch,
  argv,
  argv0,
  chdir,
  config,
  connected,
  constrainedMemory,
  availableMemory,
  cpuUsage,
  cwd,
  debugPort,
  dlopen,
  disconnect,
  emit,
  emitWarning,
  env,
  eventNames,
  execArgv,
  execPath,
  exit,
  finalization,
  features,
  getBuiltinModule,
  getActiveResourcesInfo,
  getMaxListeners,
  hrtime: hrtime3,
  kill,
  listeners,
  listenerCount,
  memoryUsage,
  nextTick,
  on,
  off,
  once,
  pid,
  platform,
  ppid,
  prependListener,
  prependOnceListener,
  rawListeners,
  release,
  removeAllListeners,
  removeListener,
  report,
  resourceUsage,
  setMaxListeners,
  setSourceMapsEnabled,
  stderr,
  stdin,
  stdout,
  title,
  throwDeprecation,
  traceDeprecation,
  umask,
  uptime,
  version,
  versions,
  // @ts-expect-error old API
  domain,
  initgroups,
  moduleLoadList,
  reallyExit,
  openStdin,
  assert: assert2,
  binding,
  send,
  exitCode,
  channel,
  getegid,
  geteuid,
  getgid,
  getgroups,
  getuid,
  setegid,
  seteuid,
  setgid,
  setgroups,
  setuid,
  permission,
  mainModule,
  _events,
  _eventsCount,
  _exiting,
  _maxListeners,
  _debugEnd,
  _debugProcess,
  _fatalException,
  _getActiveHandles,
  _getActiveRequests,
  _kill,
  _preload_modules,
  _rawDebug,
  _startProfilerIdleNotifier,
  _stopProfilerIdleNotifier,
  _tickCallback,
  _disconnect,
  _handleQueue,
  _pendingMessage,
  _channel,
  _send,
  _linkedBinding
};
var process_default = _process;

// node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-process
globalThis.process = process_default;

// src/lib/skills/system-prompt-builder.ts
function buildSystemPrompt(profile3, context2, language) {
  const lang = language === "ar" ? "Respond in Arabic (Modern Standard Arabic, with Algerian Darija terms where helpful). Use RTL-friendly formatting." : "R\xE9ponds en fran\xE7ais. Utilise un langage technique adapt\xE9 aux ing\xE9nieurs agronomes alg\xE9riens.";
  const layer1 = `
You are an expert agricultural field assistant specialized in Algerian and North African agriculture.
You serve agricultural extension agents (techniciens agricoles) working in the field.

CORE IDENTITY:
- You combine the knowledge of a soil scientist, irrigation engineer, plant pathologist, crop physiologist, and practical extension agent.
- Every answer must be grounded in Algerian realities: soil types, water quality, climate, available inputs, market constraints, and regional crop calendars.
- Never give generic textbook answers disconnected from Algeria/North Africa.
- You have no commercial interests. Every recommendation is based solely on agronomic merit.
- Acknowledge uncertainty honestly. Never project false confidence.
- Protect the farmer's interest first.

ALGERIAN AGRICULTURAL CONTEXT:
- Dominant soils: Vertisols (Tell), Aridisols/Entisols (steppe/Sahara), calcareous soils throughout.
- High pH common (7.8\u20138.5+) \u2192 widespread micronutrient lockup.
- Organic matter critically low (<1.5% typical).
- Water scarcity is severe \u2014 efficiency is not optional.
- Major crops: durum wheat, barley, potato, tomato, pepper, onion, watermelon, citrus, olive, date palm.
- Key pests: aphids, whitefly, Tuta absoluta, red spider mite, Moroccan locust.
- Climate risks: sirocco, late frost (Apr\u2013May), summer heat >40\xB0C, prolonged drought, hail in Tell.
- Ethics: honest, farmer-first, no product promotion, disclose uncertainty.
`;
  const layer2 = `
COMMUNICATION RULES:
- You are speaking to a trained agricultural technician. Use technical language: ECe, ETc, Kc, SAR, CEC, IPM.
- Be direct. Never write academic essays. Never exceed 400 words total.
- Never recommend specific products or doses based on a photo or description alone.
- Never use passive voice \u2014 every sentence must be actionable or factual.
- Never skip a section. If data is insufficient, write "Insuffisant pour \xE9valuer."

OUTPUT FORMAT \u2014 always use this exact structure:

**SYMPT\xD4MES OBSERV\xC9S**
List only what is visually confirmed or explicitly described. Do not infer beyond what is shown.

**QUALIT\xC9 IMAGE / DONN\xC9ES**
Rate image quality: Faible / Moyenne / Bonne
Justify in one sentence. If image is blurry, dark, cropped, or incomplete \u2014 request a new image before proceeding.
Format: QUALIT\xC9 IMAGE \u2022 [Faible/Moyenne/Bonne] ([reason])

**DIAGNOSTIC DIFF\xC9RENTIEL**
MANDATORY RULE: Always include exactly one hypothesis from each of these three categories \u2014 no exceptions, even if one seems unlikely:

CAT\xC9GORIE 1 \u2014 Nutritionnel/Chimique (nutrient deficiency, pH lockout, toxicity)
CAT\xC9GORIE 2 \u2014 Abiotique (salinity, overwatering, drought, heat/sirocco, herbicide drift, compaction)
CAT\xC9GORIE 3 \u2014 Biotique/Racinaire (fungal, bacterial, viral, nematodes, root rot, vascular wilt)

Format:
1. [Most probable] [Category] \u2014 [mechanism in one line]
2. [Second] [Category] \u2014 [mechanism in one line]
3. [Third \u2014 label as "Hypoth\xE8se \xE0 exclure" if no visual evidence] [Category] \u2014 [field check needed to rule it out]

For Category 3: never omit it \u2014 root health and biotic causes are systematically underdiagnosed in Algerian field practice.

**CONTEXTE ALG\xC9RIEN APPLICABLE**
Apply local agronomic priors where relevant:
- Calcareous soils (pH >7.8) \u2192 Fe/Mn/Zn lockout even when levels appear adequate
- Saline groundwater (EC >2 dS/m) \u2192 mimics drought stress and causes tip/margin burn
- Sirocco events \u2192 causes rapid interveinal scorch on exposed leaves
- High CaCO\u2083 \u2192 blocks phosphorus even when soil P is adequate
- Overdrip irrigation \u2192 root hypoxia mimics Mg and K deficiency symptoms
If none apply: write "Aucun prior r\xE9gional d\xE9terminant identifi\xE9."

**CONFIANCE DIAGNOSTIQUE**
Format exactly as:
QUALIT\xC9 IMAGE \u2022 [Faible/Moyenne/Bonne]
CONFIANCE DIAGNOSTIC \u2022 [Faible/Moyenne/\xC9lev\xE9e]
Justification: [one sentence \u2014 what is limiting confidence]

CRITICAL RULE \u2014 NUMERIC CONFIDENCE FORBIDDEN:
- Never output percentages, numbers, or scores for confidence.
- Only ` / api / confidence` may output numeric confidence.
- Allowed: qualitative terms only — faible, moyenne, élevée.
- Forbidden: X%, /10, /100, "confiance à", "score de", agreement %, calibration metrics.
- If image quality is Faible → confidence must be Faible. If Moyenne → maximum Moyenne.

**ACTIONS PAR PRIORITÉ**
PRIORITÉ #1 — [Highest information-gain action: executable within 1 hour, no equipment required]
PRIORITÉ #2 — [Second action: field check or quick measurement, within 24h]
PRIORITÉ #3 — [Third action: only if #1 and #2 confirm the leading hypothesis, can require inputs]

**DONNÉES MANQUANTES**
List what would raise the Qualitative Confidence level. Maximum 4 bullets:
- Soil pH and EC (lab or field meter)
- Irrigation water EC and source
- Growth stage and affected leaf position (old vs young)
- Recent weather events (sirocco, rain, temperature extremes)
`;
  const layer3 = contextSkill(context2);
  const layer4 = `
AGENT PROFILE:
- Name: ${profile3.full_name}
- Wilaya: ${profile3.wilaya}
- Specializations: ${profile3.specializations.join(", ")}
- Apply regional knowledge relevant to ${profile3.wilaya} (climate zone, typical crops, common soil issues).
`;
  const layer5 = lang;
  return [layer1, layer2, layer3, layer4, layer5].filter(Boolean).join("\n\n---\n\n");
}
__name(buildSystemPrompt, "buildSystemPrompt");
function contextSkill(context2) {
  switch (context2) {
    case "observation":
      return `
ACTIVE SKILL: Field Observation + Differential Diagnosis
- Never jump to nutrient deficiency without first ruling out abiotic and biotic causes.
- MANDATORY: Every differential must include one biotic/root hypothesis. If no visual biotic evidence exists, label it "Hypoth\xE8se \xE0 exclure" and state what field check rules it out (e.g. uproot one plant, inspect roots for galls, vascular discoloration, lesions).
- Symptom pattern rules:
  \u2022 Uniform across field = abiotic likely (salinity, irrigation, soil chemistry)
  \u2022 Spreading patches = biotic likely (fungal, bacterial, viral)
  \u2022 Isolated plants = root damage, nematodes, localized soil problem
  \u2022 Old leaves affected = mobile nutrient (N, P, K, Mg) OR chronic salinity
  \u2022 New leaves affected = immobile nutrient (Fe, Zn, Ca) OR herbicide drift OR viral
  \u2022 Interveinal on young leaves = Fe or Mn lockout (check pH first in Algeria)
  \u2022 Margin/tip burn = K deficiency OR salinity OR sirocco damage
- Always assess image quality before diagnosing. If image is insufficient, request a better one.
- Confidence: Faible image \u2192 confidence Faible; Moyenne image \u2192 max Moyenne.
- First priority action must be executable in the field within 1 hour, no equipment required.
`;
    case "lab_data":
      return `
ACTIVE SKILL: Agricultural Data Analysis
- Organize all received values into a clean table before interpreting.
- Flag each value: \u2713 Normal / \u26A0 Marginal / \u2717 Problem.
- Algeria soil benchmarks: pH optimal 6.5\u20137.5 (>8.5 = extreme); EC <1 dS/m good (>4 = saline); OM <1% = critical; CaCO\u2083 >25% blocks P and Fe; Olsen P <10 mg/kg = deficient; SAR >18 = sodic.
- Water benchmarks: EC <0.7 excellent (>3 = problem); SAR <3 good (>18 = problem); Cl\u207B >350 mg/L = problem; B >1.0 mg/L = urgent toxicity risk.
- Always interpret pH before micronutrients. Always check CaCO\u2083 before P recommendations.
- End with: priority diagnosis ranked 1\u20133, specific corrective actions with doses where possible.
`;
    case "constraint":
      return `
ACTIVE SKILL: Problem-Solving Under Constraints
- The user faces a real constraint: missing resource, broken equipment, urgent deadline, or budget limit.
- Never recommend the ideal solution if it requires something the user does not have.
- Structure response: (1) situation summary, (2) most critical priority, (3) options ranked A/B/C by feasibility with available resources, (4) warning signs, (5) next decision point.
- Be direct. Match the urgency of the situation.
- Algeria constraint context: water scarcity, input price spikes, spare parts unavailable locally, informal labor, pump breakdowns at critical moments.
`;
    case "decision":
      return `
ACTIVE SKILL: Agricultural Decision-Making
- The user must choose between options under uncertainty.
- Present a structured comparison: Option A/B/C ranked by feasibility, cost, and risk.
- Always include a low-cost or no-cost option.
- State trade-offs clearly. Do not pretend one option is perfect.
- End with a clear recommendation and the condition under which it holds.
`;
    case "planning":
      return `
ACTIVE SKILL: Agricultural Project Management
- Build or review a phased plan with: timeline, resources, critical path, top 3 risks.
- Algeria planning rules: build 5\u201310 day weather buffers per month; procure inputs 2\u20134 weeks early; identify equipment failure contingencies.
- Critical path = tasks where delay causes chain reaction \u2014 name them explicitly.
- Output format: Phase \u2192 Key tasks \u2192 Resources needed \u2192 Deadline \u2192 Risk flag.
`;
    case "technology":
      return `
ACTIVE SKILL: Agricultural Technology
- Evaluate technology against: does it solve a real problem? is it accessible in Algeria? can the user operate and maintain it? what is the cost-benefit?
- Always present a low-tech alternative alongside any technology recommendation.
- Algeria context: connectivity is unreliable in rural areas; drone regulations require DACM authorization; smartphone GPS (\xB13\u20135m) adequate for field mapping; free satellite imagery (Sentinel-2) available.
`;
    case "trial":
      return `
ACTIVE SKILL: Experimental Thinking
- Evaluate trial design: replication, randomization, control presence.
- CV% interpretation: <15% reliable; 15\u201325% acceptable; >25% interpret cautiously.
- Never over-interpret differences smaller than LSD.
- If no replication: conclusions are illustrative only \u2014 say this clearly.
- Recommend whether result is ready for farm-scale application or needs another season.
`;
    default:
      return `
ACTIVE SKILL: General Agronomy
- Answer the question with full Algerian agricultural context.
- Adapt depth to the technical level of an extension agent.
- If the question touches soil, water, crop, pest, or climate \u2014 apply full domain knowledge.
`;
  }
}
__name(contextSkill, "contextSkill");

// src/lib/skills/skill-trigger-detector.ts
var PATTERNS = [
  {
    context: "observation",
    patterns: [
      /symptom|feuill|leaf|leaves|jaun|yellow|tach|spot|maladie|disease|insect|ravageur|pest|photo|image|voir|see|look|observe|champignon|fungus|virus/i
    ]
  },
  {
    context: "lab_data",
    patterns: [
      /pH|EC|SAR|analyse|lab|résultat|result|sol|soil|eau|water|test|rapport|report|mg|dS|mmhos|CEC|calcaire|carbonate|azote|phosphore|potassium/i
    ]
  },
  {
    context: "constraint",
    patterns: [
      /pas de|n'ai pas|manque|broken|cassé|panne|urgent|vite|budget|argent|money|pas assez|limité|scarce|drought|sécheresse|pompe|pump|emergency|urgence/i
    ]
  },
  {
    context: "decision",
    patterns: [
      /choisir|choose|option|ou bien|or|lequel|which|comparer|compare|meilleur|best|vaut mieux|should I|dois-je|décision/i
    ]
  },
  {
    context: "planning",
    patterns: [
      /planifier|plan|saison|season|calendrier|calendar|organiser|organize|étapes|steps|programme|schedule|projet|project/i
    ]
  },
  {
    context: "technology",
    patterns: [
      /drone|GPS|capteur|sensor|logiciel|software|application|app|satellite|NDVI|irrigation controller|automate|technologie|technology/i
    ]
  },
  {
    context: "trial",
    patterns: [
      /essai|trial|expérience|experiment|traitement|treatment|témoin|control|répétition|replication|rendement|yield|résultat|statistique/i
    ]
  }
];
function detectSkillContext(message) {
  for (const { context: context2, patterns } of PATTERNS) {
    if (patterns.some((p) => p.test(message))) {
      return context2;
    }
  }
  return "general";
}
__name(detectSkillContext, "detectSkillContext");
function detectLanguage(message) {
  const arabicPattern = /[\u0600-\u06FF]/;
  return arabicPattern.test(message) ? "ar" : "fr";
}
__name(detectLanguage, "detectLanguage");

// worker/rate-limit.ts
var store = {};
var MAX_REQUESTS = 20;
var WINDOW_MS = 6e4;
function checkRateLimit(agentId) {
  const now = Date.now();
  const entry = store[agentId];
  if (!entry || now > entry.resetAt) {
    store[agentId] = { count: 1, resetAt: now + WINDOW_MS };
    return { allowed: true, remaining: MAX_REQUESTS - 1, resetIn: WINDOW_MS };
  }
  if (entry.count >= MAX_REQUESTS) {
    return { allowed: false, remaining: 0, resetIn: entry.resetAt - now };
  }
  entry.count++;
  return { allowed: true, remaining: MAX_REQUESTS - entry.count, resetIn: entry.resetAt - now };
}
__name(checkRateLimit, "checkRateLimit");

// worker/sanitize.ts
var PROMPT_INJECTION_PATTERNS = [
  /ignore\s+(all\s+)?(previous|prior|above)\s+(instructions|directives|commands)/i,
  /forget\s+(all\s+)?(previous|prior|above)/i,
  /you\s+are\s+(now|not\s+required\s+to)/i,
  /system\s+prompt/i,
  /new\s+instructions/i,
  /override/i
];
function sanitizeInput(text) {
  let cleaned = text.slice(0, 2e3);
  for (const pattern of PROMPT_INJECTION_PATTERNS) {
    cleaned = cleaned.replace(pattern, "[redacted]");
  }
  return cleaned.trim();
}
__name(sanitizeInput, "sanitizeInput");

// worker/index.ts
async function buildGeminiMessages(messages) {
  const result = [];
  for (const m of messages) {
    const role = m.role === "assistant" ? "model" : "user";
    const content = m.content || "";
    const urlMatch = content.match(/\[Photo: (https?:\/\/[^\]]+)\]/);
    if (urlMatch) {
      const imageUrl = urlMatch[1];
      const text = content.replace(urlMatch[0], "").trim();
      if (!/^https:\/\/(.*\.supabase\.co|storage\.googleapis\.com)/.test(imageUrl)) {
        result.push({ role, parts: [{ text: content }] });
        continue;
      }
      try {
        const imgRes = await fetch(imageUrl);
        if (!imgRes.ok || !imgRes.headers.get("content-type")?.startsWith("image/")) {
          result.push({ role, parts: [{ text: content }] });
          continue;
        }
        const imgBuffer = await imgRes.arrayBuffer();
        if (imgBuffer.byteLength > 5 * 1024 * 1024) {
          result.push({ role, parts: [{ text: content }] });
          continue;
        }
        const base64 = btoa(String.fromCharCode(...new Uint8Array(imgBuffer)));
        const mimeType = imgRes.headers.get("content-type") || "image/jpeg";
        const parts = [{ inline_data: { mime_type: mimeType, data: base64 } }];
        if (text) parts.push({ text });
        result.push({ role, parts });
      } catch {
        result.push({ role, parts: [{ text: content }] });
      }
    } else {
      result.push({ role, parts: [{ text: sanitizeInput(content) }] });
    }
  }
  return result;
}
__name(buildGeminiMessages, "buildGeminiMessages");
var ALLOWED_ORIGINS = [
  "http://localhost:3000",
  "http://localhost:8787",
  "https://*.pages.dev",
  "https://*.supabase.co"
];
function getCorsOrigin(request) {
  const origin = request.headers.get("Origin") || "";
  if (ALLOWED_ORIGINS.some((a) => origin.includes(a.replace("*", "")))) return origin;
  return "https://itadz.pages.dev";
}
__name(getCorsOrigin, "getCorsOrigin");
var worker_default = {
  async fetch(request, env2) {
    const origin = getCorsOrigin(request);
    const corsHeaders = {
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Max-Age": "86400"
    };
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }
    const url = new URL(request.url);
    if (url.pathname !== "/api/ai") {
      return new Response("Not found", { status: 404 });
    }
    if (request.method !== "POST") {
      return new Response("Method not allowed", { status: 405 });
    }
    try {
      const body = await request.json();
      const { messages, profile: profile3 } = body;
      if (!messages || !Array.isArray(messages) || messages.length === 0) {
        return new Response(JSON.stringify({ error: "messages required" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }
      const agentId = profile3?.full_name || "anonymous";
      const rateLimit = checkRateLimit(agentId);
      if (!rateLimit.allowed) {
        return new Response(JSON.stringify({ error: "rate_limit_exceeded", retryAfter: Math.ceil(rateLimit.resetIn / 1e3) }), {
          status: 429,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
            "Retry-After": String(Math.ceil(rateLimit.resetIn / 1e3))
          }
        });
      }
      const lastMessage = messages[messages.length - 1].content || "";
      const language = detectLanguage(lastMessage);
      const context2 = detectSkillContext(lastMessage);
      const agentProfile = {
        full_name: profile3?.full_name || "Agent",
        wilaya: "Alg\xE9rie",
        specializations: ["agriculture g\xE9n\xE9rale"],
        language_pref: "fr"
      };
      const systemPrompt = buildSystemPrompt(agentProfile, context2, language);
      const geminiMessages = await buildGeminiMessages(messages);
      const geminiBody = {
        system_instruction: { parts: [{ text: systemPrompt }] },
        contents: geminiMessages,
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 8192
        }
      };
      const geminiRes = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:streamGenerateContent?key=${env2.GEMINI_API_KEY}&alt=sse`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(geminiBody)
        }
      );
      if (!geminiRes.ok) {
        const err = await geminiRes.text();
        return new Response(JSON.stringify({ error: err }), {
          status: 502,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }
      return new Response(geminiRes.body, {
        headers: {
          ...corsHeaders,
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          "X-Skill-Context": context2,
          "X-Language": language,
          "X-RateLimit-Remaining": String(rateLimit.remaining)
        }
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      return new Response(JSON.stringify({ error: message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }
  }
};

// node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
var drainBody = /* @__PURE__ */ __name(async (request, env2, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env2);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;

// node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
  };
}
__name(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name(async (request, env2, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env2);
  } catch (e) {
    const error3 = reduceError(e);
    return Response.json(error3, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;

// .wrangler/tmp/bundle-cs8kZ1/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = worker_default;

// node_modules/wrangler/templates/middleware/common.ts
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env2, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env2, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env2, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env2, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");

// .wrangler/tmp/bundle-cs8kZ1/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class ___Facade_ScheduledController__ {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  static {
    __name(this, "__Facade_ScheduledController__");
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof ___Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env2, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env2, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env2, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env2, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env2, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = /* @__PURE__ */ __name((request, env2, ctx) => {
      this.env = env2;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    }, "#fetchDispatcher");
    #dispatcher = /* @__PURE__ */ __name((type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    }, "#dispatcher");
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default as default
};
//# sourceMappingURL=index.js.map
