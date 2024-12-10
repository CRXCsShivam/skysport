/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 2695:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  j: () => (/* binding */ Web3Provider)
});

;// CONCATENATED MODULE: ./node_modules/@ethersproject/logger/lib.esm/_version.js
const version = "logger/5.7.0";
//# sourceMappingURL=_version.js.map
;// CONCATENATED MODULE: ./node_modules/@ethersproject/logger/lib.esm/index.js

let _permanentCensorErrors = false;
let _censorErrors = false;
const LogLevels = { debug: 1, "default": 2, info: 2, warning: 3, error: 4, off: 5 };
let _logLevel = LogLevels["default"];

let _globalLogger = null;
function _checkNormalize() {
    try {
        const missing = [];
        // Make sure all forms of normalization are supported
        ["NFD", "NFC", "NFKD", "NFKC"].forEach((form) => {
            try {
                if ("test".normalize(form) !== "test") {
                    throw new Error("bad normalize");
                }
                ;
            }
            catch (error) {
                missing.push(form);
            }
        });
        if (missing.length) {
            throw new Error("missing " + missing.join(", "));
        }
        if (String.fromCharCode(0xe9).normalize("NFD") !== String.fromCharCode(0x65, 0x0301)) {
            throw new Error("broken implementation");
        }
    }
    catch (error) {
        return error.message;
    }
    return null;
}
const _normalizeError = _checkNormalize();
var LogLevel;
(function (LogLevel) {
    LogLevel["DEBUG"] = "DEBUG";
    LogLevel["INFO"] = "INFO";
    LogLevel["WARNING"] = "WARNING";
    LogLevel["ERROR"] = "ERROR";
    LogLevel["OFF"] = "OFF";
})(LogLevel || (LogLevel = {}));
var ErrorCode;
(function (ErrorCode) {
    ///////////////////
    // Generic Errors
    // Unknown Error
    ErrorCode["UNKNOWN_ERROR"] = "UNKNOWN_ERROR";
    // Not Implemented
    ErrorCode["NOT_IMPLEMENTED"] = "NOT_IMPLEMENTED";
    // Unsupported Operation
    //   - operation
    ErrorCode["UNSUPPORTED_OPERATION"] = "UNSUPPORTED_OPERATION";
    // Network Error (i.e. Ethereum Network, such as an invalid chain ID)
    //   - event ("noNetwork" is not re-thrown in provider.ready; otherwise thrown)
    ErrorCode["NETWORK_ERROR"] = "NETWORK_ERROR";
    // Some sort of bad response from the server
    ErrorCode["SERVER_ERROR"] = "SERVER_ERROR";
    // Timeout
    ErrorCode["TIMEOUT"] = "TIMEOUT";
    ///////////////////
    // Operational  Errors
    // Buffer Overrun
    ErrorCode["BUFFER_OVERRUN"] = "BUFFER_OVERRUN";
    // Numeric Fault
    //   - operation: the operation being executed
    //   - fault: the reason this faulted
    ErrorCode["NUMERIC_FAULT"] = "NUMERIC_FAULT";
    ///////////////////
    // Argument Errors
    // Missing new operator to an object
    //  - name: The name of the class
    ErrorCode["MISSING_NEW"] = "MISSING_NEW";
    // Invalid argument (e.g. value is incompatible with type) to a function:
    //   - argument: The argument name that was invalid
    //   - value: The value of the argument
    ErrorCode["INVALID_ARGUMENT"] = "INVALID_ARGUMENT";
    // Missing argument to a function:
    //   - count: The number of arguments received
    //   - expectedCount: The number of arguments expected
    ErrorCode["MISSING_ARGUMENT"] = "MISSING_ARGUMENT";
    // Too many arguments
    //   - count: The number of arguments received
    //   - expectedCount: The number of arguments expected
    ErrorCode["UNEXPECTED_ARGUMENT"] = "UNEXPECTED_ARGUMENT";
    ///////////////////
    // Blockchain Errors
    // Call exception
    //  - transaction: the transaction
    //  - address?: the contract address
    //  - args?: The arguments passed into the function
    //  - method?: The Solidity method signature
    //  - errorSignature?: The EIP848 error signature
    //  - errorArgs?: The EIP848 error parameters
    //  - reason: The reason (only for EIP848 "Error(string)")
    ErrorCode["CALL_EXCEPTION"] = "CALL_EXCEPTION";
    // Insufficient funds (< value + gasLimit * gasPrice)
    //   - transaction: the transaction attempted
    ErrorCode["INSUFFICIENT_FUNDS"] = "INSUFFICIENT_FUNDS";
    // Nonce has already been used
    //   - transaction: the transaction attempted
    ErrorCode["NONCE_EXPIRED"] = "NONCE_EXPIRED";
    // The replacement fee for the transaction is too low
    //   - transaction: the transaction attempted
    ErrorCode["REPLACEMENT_UNDERPRICED"] = "REPLACEMENT_UNDERPRICED";
    // The gas limit could not be estimated
    //   - transaction: the transaction passed to estimateGas
    ErrorCode["UNPREDICTABLE_GAS_LIMIT"] = "UNPREDICTABLE_GAS_LIMIT";
    // The transaction was replaced by one with a higher gas price
    //   - reason: "cancelled", "replaced" or "repriced"
    //   - cancelled: true if reason == "cancelled" or reason == "replaced")
    //   - hash: original transaction hash
    //   - replacement: the full TransactionsResponse for the replacement
    //   - receipt: the receipt of the replacement
    ErrorCode["TRANSACTION_REPLACED"] = "TRANSACTION_REPLACED";
    ///////////////////
    // Interaction Errors
    // The user rejected the action, such as signing a message or sending
    // a transaction
    ErrorCode["ACTION_REJECTED"] = "ACTION_REJECTED";
})(ErrorCode || (ErrorCode = {}));
;
const HEX = "0123456789abcdef";
class lib_esm_Logger {
    constructor(version) {
        Object.defineProperty(this, "version", {
            enumerable: true,
            value: version,
            writable: false
        });
    }
    _log(logLevel, args) {
        const level = logLevel.toLowerCase();
        if (LogLevels[level] == null) {
            this.throwArgumentError("invalid log level name", "logLevel", logLevel);
        }
        if (_logLevel > LogLevels[level]) {
            return;
        }
        console.log.apply(console, args);
    }
    debug(...args) {
        this._log(lib_esm_Logger.levels.DEBUG, args);
    }
    info(...args) {
        this._log(lib_esm_Logger.levels.INFO, args);
    }
    warn(...args) {
        this._log(lib_esm_Logger.levels.WARNING, args);
    }
    makeError(message, code, params) {
        // Errors are being censored
        if (_censorErrors) {
            return this.makeError("censored error", code, {});
        }
        if (!code) {
            code = lib_esm_Logger.errors.UNKNOWN_ERROR;
        }
        if (!params) {
            params = {};
        }
        const messageDetails = [];
        Object.keys(params).forEach((key) => {
            const value = params[key];
            try {
                if (value instanceof Uint8Array) {
                    let hex = "";
                    for (let i = 0; i < value.length; i++) {
                        hex += HEX[value[i] >> 4];
                        hex += HEX[value[i] & 0x0f];
                    }
                    messageDetails.push(key + "=Uint8Array(0x" + hex + ")");
                }
                else {
                    messageDetails.push(key + "=" + JSON.stringify(value));
                }
            }
            catch (error) {
                messageDetails.push(key + "=" + JSON.stringify(params[key].toString()));
            }
        });
        messageDetails.push(`code=${code}`);
        messageDetails.push(`version=${this.version}`);
        const reason = message;
        let url = "";
        switch (code) {
            case ErrorCode.NUMERIC_FAULT: {
                url = "NUMERIC_FAULT";
                const fault = message;
                switch (fault) {
                    case "overflow":
                    case "underflow":
                    case "division-by-zero":
                        url += "-" + fault;
                        break;
                    case "negative-power":
                    case "negative-width":
                        url += "-unsupported";
                        break;
                    case "unbound-bitwise-result":
                        url += "-unbound-result";
                        break;
                }
                break;
            }
            case ErrorCode.CALL_EXCEPTION:
            case ErrorCode.INSUFFICIENT_FUNDS:
            case ErrorCode.MISSING_NEW:
            case ErrorCode.NONCE_EXPIRED:
            case ErrorCode.REPLACEMENT_UNDERPRICED:
            case ErrorCode.TRANSACTION_REPLACED:
            case ErrorCode.UNPREDICTABLE_GAS_LIMIT:
                url = code;
                break;
        }
        if (url) {
            message += " [ See: https:/\/links.ethers.org/v5-errors-" + url + " ]";
        }
        if (messageDetails.length) {
            message += " (" + messageDetails.join(", ") + ")";
        }
        // @TODO: Any??
        const error = new Error(message);
        error.reason = reason;
        error.code = code;
        Object.keys(params).forEach(function (key) {
            error[key] = params[key];
        });
        return error;
    }
    throwError(message, code, params) {
        throw this.makeError(message, code, params);
    }
    throwArgumentError(message, name, value) {
        return this.throwError(message, lib_esm_Logger.errors.INVALID_ARGUMENT, {
            argument: name,
            value: value
        });
    }
    assert(condition, message, code, params) {
        if (!!condition) {
            return;
        }
        this.throwError(message, code, params);
    }
    assertArgument(condition, message, name, value) {
        if (!!condition) {
            return;
        }
        this.throwArgumentError(message, name, value);
    }
    checkNormalize(message) {
        if (message == null) {
            message = "platform missing String.prototype.normalize";
        }
        if (_normalizeError) {
            this.throwError("platform missing String.prototype.normalize", lib_esm_Logger.errors.UNSUPPORTED_OPERATION, {
                operation: "String.prototype.normalize", form: _normalizeError
            });
        }
    }
    checkSafeUint53(value, message) {
        if (typeof (value) !== "number") {
            return;
        }
        if (message == null) {
            message = "value not safe";
        }
        if (value < 0 || value >= 0x1fffffffffffff) {
            this.throwError(message, lib_esm_Logger.errors.NUMERIC_FAULT, {
                operation: "checkSafeInteger",
                fault: "out-of-safe-range",
                value: value
            });
        }
        if (value % 1) {
            this.throwError(message, lib_esm_Logger.errors.NUMERIC_FAULT, {
                operation: "checkSafeInteger",
                fault: "non-integer",
                value: value
            });
        }
    }
    checkArgumentCount(count, expectedCount, message) {
        if (message) {
            message = ": " + message;
        }
        else {
            message = "";
        }
        if (count < expectedCount) {
            this.throwError("missing argument" + message, lib_esm_Logger.errors.MISSING_ARGUMENT, {
                count: count,
                expectedCount: expectedCount
            });
        }
        if (count > expectedCount) {
            this.throwError("too many arguments" + message, lib_esm_Logger.errors.UNEXPECTED_ARGUMENT, {
                count: count,
                expectedCount: expectedCount
            });
        }
    }
    checkNew(target, kind) {
        if (target === Object || target == null) {
            this.throwError("missing new", lib_esm_Logger.errors.MISSING_NEW, { name: kind.name });
        }
    }
    checkAbstract(target, kind) {
        if (target === kind) {
            this.throwError("cannot instantiate abstract class " + JSON.stringify(kind.name) + " directly; use a sub-class", lib_esm_Logger.errors.UNSUPPORTED_OPERATION, { name: target.name, operation: "new" });
        }
        else if (target === Object || target == null) {
            this.throwError("missing new", lib_esm_Logger.errors.MISSING_NEW, { name: kind.name });
        }
    }
    static globalLogger() {
        if (!_globalLogger) {
            _globalLogger = new lib_esm_Logger(version);
        }
        return _globalLogger;
    }
    static setCensorship(censorship, permanent) {
        if (!censorship && permanent) {
            this.globalLogger().throwError("cannot permanently disable censorship", lib_esm_Logger.errors.UNSUPPORTED_OPERATION, {
                operation: "setCensorship"
            });
        }
        if (_permanentCensorErrors) {
            if (!censorship) {
                return;
            }
            this.globalLogger().throwError("error censorship permanent", lib_esm_Logger.errors.UNSUPPORTED_OPERATION, {
                operation: "setCensorship"
            });
        }
        _censorErrors = !!censorship;
        _permanentCensorErrors = !!permanent;
    }
    static setLogLevel(logLevel) {
        const level = LogLevels[logLevel.toLowerCase()];
        if (level == null) {
            lib_esm_Logger.globalLogger().warn("invalid log level - " + logLevel);
            return;
        }
        _logLevel = level;
    }
    static from(version) {
        return new lib_esm_Logger(version);
    }
}
lib_esm_Logger.errors = ErrorCode;
lib_esm_Logger.levels = LogLevel;
//# sourceMappingURL=index.js.map
;// CONCATENATED MODULE: ./node_modules/@ethersproject/properties/lib.esm/_version.js
const _version_version = "properties/5.7.0";
//# sourceMappingURL=_version.js.map
;// CONCATENATED MODULE: ./node_modules/@ethersproject/properties/lib.esm/index.js

var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};


const logger = new lib_esm_Logger(_version_version);
function defineReadOnly(object, name, value) {
    Object.defineProperty(object, name, {
        enumerable: true,
        value: value,
        writable: false,
    });
}
// Crawl up the constructor chain to find a static method
function getStatic(ctor, key) {
    for (let i = 0; i < 32; i++) {
        if (ctor[key]) {
            return ctor[key];
        }
        if (!ctor.prototype || typeof (ctor.prototype) !== "object") {
            break;
        }
        ctor = Object.getPrototypeOf(ctor.prototype).constructor;
    }
    return null;
}
function resolveProperties(object) {
    return __awaiter(this, void 0, void 0, function* () {
        const promises = Object.keys(object).map((key) => {
            const value = object[key];
            return Promise.resolve(value).then((v) => ({ key: key, value: v }));
        });
        const results = yield Promise.all(promises);
        return results.reduce((accum, result) => {
            accum[(result.key)] = result.value;
            return accum;
        }, {});
    });
}
function lib_esm_checkProperties(object, properties) {
    if (!object || typeof (object) !== "object") {
        logger.throwArgumentError("invalid object", "object", object);
    }
    Object.keys(object).forEach((key) => {
        if (!properties[key]) {
            logger.throwArgumentError("invalid object key - " + key, "transaction:" + key, object);
        }
    });
}
function shallowCopy(object) {
    const result = {};
    for (const key in object) {
        result[key] = object[key];
    }
    return result;
}
const opaque = { bigint: true, boolean: true, "function": true, number: true, string: true };
function _isFrozen(object) {
    // Opaque objects are not mutable, so safe to copy by assignment
    if (object === undefined || object === null || opaque[typeof (object)]) {
        return true;
    }
    if (Array.isArray(object) || typeof (object) === "object") {
        if (!Object.isFrozen(object)) {
            return false;
        }
        const keys = Object.keys(object);
        for (let i = 0; i < keys.length; i++) {
            let value = null;
            try {
                value = object[keys[i]];
            }
            catch (error) {
                // If accessing a value triggers an error, it is a getter
                // designed to do so (e.g. Result) and is therefore "frozen"
                continue;
            }
            if (!_isFrozen(value)) {
                return false;
            }
        }
        return true;
    }
    return logger.throwArgumentError(`Cannot deepCopy ${typeof (object)}`, "object", object);
}
// Returns a new copy of object, such that no properties may be replaced.
// New properties may be added only to objects.
function _deepCopy(object) {
    if (_isFrozen(object)) {
        return object;
    }
    // Arrays are mutable, so we need to create a copy
    if (Array.isArray(object)) {
        return Object.freeze(object.map((item) => deepCopy(item)));
    }
    if (typeof (object) === "object") {
        const result = {};
        for (const key in object) {
            const value = object[key];
            if (value === undefined) {
                continue;
            }
            defineReadOnly(result, key, deepCopy(value));
        }
        return result;
    }
    return logger.throwArgumentError(`Cannot deepCopy ${typeof (object)}`, "object", object);
}
function deepCopy(object) {
    return _deepCopy(object);
}
class Description {
    constructor(info) {
        for (const key in info) {
            this[key] = deepCopy(info[key]);
        }
    }
}
//# sourceMappingURL=index.js.map
;// CONCATENATED MODULE: ./node_modules/@ethersproject/providers/lib.esm/_version.js
const lib_esm_version_version = "providers/5.7.2";
//# sourceMappingURL=_version.js.map
;// CONCATENATED MODULE: ./node_modules/@ethersproject/abstract-signer/lib.esm/_version.js
const abstract_signer_lib_esm_version_version = "abstract-signer/5.7.0";
//# sourceMappingURL=_version.js.map
;// CONCATENATED MODULE: ./node_modules/@ethersproject/abstract-signer/lib.esm/index.js

var lib_esm_awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};



const lib_esm_logger = new lib_esm_Logger(abstract_signer_lib_esm_version_version);
const allowedTransactionKeys = [
    "accessList", "ccipReadEnabled", "chainId", "customData", "data", "from", "gasLimit", "gasPrice", "maxFeePerGas", "maxPriorityFeePerGas", "nonce", "to", "type", "value"
];
const forwardErrors = [
    lib_esm_Logger.errors.INSUFFICIENT_FUNDS,
    lib_esm_Logger.errors.NONCE_EXPIRED,
    lib_esm_Logger.errors.REPLACEMENT_UNDERPRICED,
];
;
;
class Signer {
    ///////////////////
    // Sub-classes MUST call super
    constructor() {
        lib_esm_logger.checkAbstract(new.target, Signer);
        defineReadOnly(this, "_isSigner", true);
    }
    ///////////////////
    // Sub-classes MAY override these
    getBalance(blockTag) {
        return lib_esm_awaiter(this, void 0, void 0, function* () {
            this._checkProvider("getBalance");
            return yield this.provider.getBalance(this.getAddress(), blockTag);
        });
    }
    getTransactionCount(blockTag) {
        return lib_esm_awaiter(this, void 0, void 0, function* () {
            this._checkProvider("getTransactionCount");
            return yield this.provider.getTransactionCount(this.getAddress(), blockTag);
        });
    }
    // Populates "from" if unspecified, and estimates the gas for the transaction
    estimateGas(transaction) {
        return lib_esm_awaiter(this, void 0, void 0, function* () {
            this._checkProvider("estimateGas");
            const tx = yield resolveProperties(this.checkTransaction(transaction));
            return yield this.provider.estimateGas(tx);
        });
    }
    // Populates "from" if unspecified, and calls with the transaction
    call(transaction, blockTag) {
        return lib_esm_awaiter(this, void 0, void 0, function* () {
            this._checkProvider("call");
            const tx = yield resolveProperties(this.checkTransaction(transaction));
            return yield this.provider.call(tx, blockTag);
        });
    }
    // Populates all fields in a transaction, signs it and sends it to the network
    sendTransaction(transaction) {
        return lib_esm_awaiter(this, void 0, void 0, function* () {
            this._checkProvider("sendTransaction");
            const tx = yield this.populateTransaction(transaction);
            const signedTx = yield this.signTransaction(tx);
            return yield this.provider.sendTransaction(signedTx);
        });
    }
    getChainId() {
        return lib_esm_awaiter(this, void 0, void 0, function* () {
            this._checkProvider("getChainId");
            const network = yield this.provider.getNetwork();
            return network.chainId;
        });
    }
    getGasPrice() {
        return lib_esm_awaiter(this, void 0, void 0, function* () {
            this._checkProvider("getGasPrice");
            return yield this.provider.getGasPrice();
        });
    }
    getFeeData() {
        return lib_esm_awaiter(this, void 0, void 0, function* () {
            this._checkProvider("getFeeData");
            return yield this.provider.getFeeData();
        });
    }
    resolveName(name) {
        return lib_esm_awaiter(this, void 0, void 0, function* () {
            this._checkProvider("resolveName");
            return yield this.provider.resolveName(name);
        });
    }
    // Checks a transaction does not contain invalid keys and if
    // no "from" is provided, populates it.
    // - does NOT require a provider
    // - adds "from" is not present
    // - returns a COPY (safe to mutate the result)
    // By default called from: (overriding these prevents it)
    //   - call
    //   - estimateGas
    //   - populateTransaction (and therefor sendTransaction)
    checkTransaction(transaction) {
        for (const key in transaction) {
            if (allowedTransactionKeys.indexOf(key) === -1) {
                lib_esm_logger.throwArgumentError("invalid transaction key: " + key, "transaction", transaction);
            }
        }
        const tx = shallowCopy(transaction);
        if (tx.from == null) {
            tx.from = this.getAddress();
        }
        else {
            // Make sure any provided address matches this signer
            tx.from = Promise.all([
                Promise.resolve(tx.from),
                this.getAddress()
            ]).then((result) => {
                if (result[0].toLowerCase() !== result[1].toLowerCase()) {
                    lib_esm_logger.throwArgumentError("from address mismatch", "transaction", transaction);
                }
                return result[0];
            });
        }
        return tx;
    }
    // Populates ALL keys for a transaction and checks that "from" matches
    // this Signer. Should be used by sendTransaction but NOT by signTransaction.
    // By default called from: (overriding these prevents it)
    //   - sendTransaction
    //
    // Notes:
    //  - We allow gasPrice for EIP-1559 as long as it matches maxFeePerGas
    populateTransaction(transaction) {
        return lib_esm_awaiter(this, void 0, void 0, function* () {
            const tx = yield resolveProperties(this.checkTransaction(transaction));
            if (tx.to != null) {
                tx.to = Promise.resolve(tx.to).then((to) => lib_esm_awaiter(this, void 0, void 0, function* () {
                    if (to == null) {
                        return null;
                    }
                    const address = yield this.resolveName(to);
                    if (address == null) {
                        lib_esm_logger.throwArgumentError("provided ENS name resolves to null", "tx.to", to);
                    }
                    return address;
                }));
                // Prevent this error from causing an UnhandledPromiseException
                tx.to.catch((error) => { });
            }
            // Do not allow mixing pre-eip-1559 and eip-1559 properties
            const hasEip1559 = (tx.maxFeePerGas != null || tx.maxPriorityFeePerGas != null);
            if (tx.gasPrice != null && (tx.type === 2 || hasEip1559)) {
                lib_esm_logger.throwArgumentError("eip-1559 transaction do not support gasPrice", "transaction", transaction);
            }
            else if ((tx.type === 0 || tx.type === 1) && hasEip1559) {
                lib_esm_logger.throwArgumentError("pre-eip-1559 transaction do not support maxFeePerGas/maxPriorityFeePerGas", "transaction", transaction);
            }
            if ((tx.type === 2 || tx.type == null) && (tx.maxFeePerGas != null && tx.maxPriorityFeePerGas != null)) {
                // Fully-formed EIP-1559 transaction (skip getFeeData)
                tx.type = 2;
            }
            else if (tx.type === 0 || tx.type === 1) {
                // Explicit Legacy or EIP-2930 transaction
                // Populate missing gasPrice
                if (tx.gasPrice == null) {
                    tx.gasPrice = this.getGasPrice();
                }
            }
            else {
                // We need to get fee data to determine things
                const feeData = yield this.getFeeData();
                if (tx.type == null) {
                    // We need to auto-detect the intended type of this transaction...
                    if (feeData.maxFeePerGas != null && feeData.maxPriorityFeePerGas != null) {
                        // The network supports EIP-1559!
                        // Upgrade transaction from null to eip-1559
                        tx.type = 2;
                        if (tx.gasPrice != null) {
                            // Using legacy gasPrice property on an eip-1559 network,
                            // so use gasPrice as both fee properties
                            const gasPrice = tx.gasPrice;
                            delete tx.gasPrice;
                            tx.maxFeePerGas = gasPrice;
                            tx.maxPriorityFeePerGas = gasPrice;
                        }
                        else {
                            // Populate missing fee data
                            if (tx.maxFeePerGas == null) {
                                tx.maxFeePerGas = feeData.maxFeePerGas;
                            }
                            if (tx.maxPriorityFeePerGas == null) {
                                tx.maxPriorityFeePerGas = feeData.maxPriorityFeePerGas;
                            }
                        }
                    }
                    else if (feeData.gasPrice != null) {
                        // Network doesn't support EIP-1559...
                        // ...but they are trying to use EIP-1559 properties
                        if (hasEip1559) {
                            lib_esm_logger.throwError("network does not support EIP-1559", lib_esm_Logger.errors.UNSUPPORTED_OPERATION, {
                                operation: "populateTransaction"
                            });
                        }
                        // Populate missing fee data
                        if (tx.gasPrice == null) {
                            tx.gasPrice = feeData.gasPrice;
                        }
                        // Explicitly set untyped transaction to legacy
                        tx.type = 0;
                    }
                    else {
                        // getFeeData has failed us.
                        lib_esm_logger.throwError("failed to get consistent fee data", lib_esm_Logger.errors.UNSUPPORTED_OPERATION, {
                            operation: "signer.getFeeData"
                        });
                    }
                }
                else if (tx.type === 2) {
                    // Explicitly using EIP-1559
                    // Populate missing fee data
                    if (tx.maxFeePerGas == null) {
                        tx.maxFeePerGas = feeData.maxFeePerGas;
                    }
                    if (tx.maxPriorityFeePerGas == null) {
                        tx.maxPriorityFeePerGas = feeData.maxPriorityFeePerGas;
                    }
                }
            }
            if (tx.nonce == null) {
                tx.nonce = this.getTransactionCount("pending");
            }
            if (tx.gasLimit == null) {
                tx.gasLimit = this.estimateGas(tx).catch((error) => {
                    if (forwardErrors.indexOf(error.code) >= 0) {
                        throw error;
                    }
                    return lib_esm_logger.throwError("cannot estimate gas; transaction may fail or may require manual gas limit", lib_esm_Logger.errors.UNPREDICTABLE_GAS_LIMIT, {
                        error: error,
                        tx: tx
                    });
                });
            }
            if (tx.chainId == null) {
                tx.chainId = this.getChainId();
            }
            else {
                tx.chainId = Promise.all([
                    Promise.resolve(tx.chainId),
                    this.getChainId()
                ]).then((results) => {
                    if (results[1] !== 0 && results[0] !== results[1]) {
                        lib_esm_logger.throwArgumentError("chainId address mismatch", "transaction", transaction);
                    }
                    return results[0];
                });
            }
            return yield resolveProperties(tx);
        });
    }
    ///////////////////
    // Sub-classes SHOULD leave these alone
    _checkProvider(operation) {
        if (!this.provider) {
            lib_esm_logger.throwError("missing provider", lib_esm_Logger.errors.UNSUPPORTED_OPERATION, {
                operation: (operation || "_checkProvider")
            });
        }
    }
    static isSigner(value) {
        return !!(value && value._isSigner);
    }
}
class VoidSigner extends Signer {
    constructor(address, provider) {
        super();
        defineReadOnly(this, "address", address);
        defineReadOnly(this, "provider", provider || null);
    }
    getAddress() {
        return Promise.resolve(this.address);
    }
    _fail(message, operation) {
        return Promise.resolve().then(() => {
            lib_esm_logger.throwError(message, lib_esm_Logger.errors.UNSUPPORTED_OPERATION, { operation: operation });
        });
    }
    signMessage(message) {
        return this._fail("VoidSigner cannot sign messages", "signMessage");
    }
    signTransaction(transaction) {
        return this._fail("VoidSigner cannot sign transactions", "signTransaction");
    }
    _signTypedData(domain, types, value) {
        return this._fail("VoidSigner cannot sign typed data", "signTypedData");
    }
    connect(provider) {
        return new VoidSigner(this.address, provider);
    }
}
//# sourceMappingURL=index.js.map
// EXTERNAL MODULE: ./node_modules/bn.js/lib/bn.js
var bn = __webpack_require__(9404);
var bn_default = /*#__PURE__*/__webpack_require__.n(bn);
;// CONCATENATED MODULE: ./node_modules/@ethersproject/bytes/lib.esm/_version.js
const bytes_lib_esm_version_version = "bytes/5.7.0";
//# sourceMappingURL=_version.js.map
;// CONCATENATED MODULE: ./node_modules/@ethersproject/bytes/lib.esm/index.js



const bytes_lib_esm_logger = new lib_esm_Logger(bytes_lib_esm_version_version);
///////////////////////////////
function isHexable(value) {
    return !!(value.toHexString);
}
function addSlice(array) {
    if (array.slice) {
        return array;
    }
    array.slice = function () {
        const args = Array.prototype.slice.call(arguments);
        return addSlice(new Uint8Array(Array.prototype.slice.apply(array, args)));
    };
    return array;
}
function lib_esm_isBytesLike(value) {
    return ((lib_esm_isHexString(value) && !(value.length % 2)) || lib_esm_isBytes(value));
}
function isInteger(value) {
    return (typeof (value) === "number" && value == value && (value % 1) === 0);
}
function lib_esm_isBytes(value) {
    if (value == null) {
        return false;
    }
    if (value.constructor === Uint8Array) {
        return true;
    }
    if (typeof (value) === "string") {
        return false;
    }
    if (!isInteger(value.length) || value.length < 0) {
        return false;
    }
    for (let i = 0; i < value.length; i++) {
        const v = value[i];
        if (!isInteger(v) || v < 0 || v >= 256) {
            return false;
        }
    }
    return true;
}
function lib_esm_arrayify(value, options) {
    if (!options) {
        options = {};
    }
    if (typeof (value) === "number") {
        bytes_lib_esm_logger.checkSafeUint53(value, "invalid arrayify value");
        const result = [];
        while (value) {
            result.unshift(value & 0xff);
            value = parseInt(String(value / 256));
        }
        if (result.length === 0) {
            result.push(0);
        }
        return addSlice(new Uint8Array(result));
    }
    if (options.allowMissingPrefix && typeof (value) === "string" && value.substring(0, 2) !== "0x") {
        value = "0x" + value;
    }
    if (isHexable(value)) {
        value = value.toHexString();
    }
    if (lib_esm_isHexString(value)) {
        let hex = value.substring(2);
        if (hex.length % 2) {
            if (options.hexPad === "left") {
                hex = "0" + hex;
            }
            else if (options.hexPad === "right") {
                hex += "0";
            }
            else {
                bytes_lib_esm_logger.throwArgumentError("hex data is odd-length", "value", value);
            }
        }
        const result = [];
        for (let i = 0; i < hex.length; i += 2) {
            result.push(parseInt(hex.substring(i, i + 2), 16));
        }
        return addSlice(new Uint8Array(result));
    }
    if (lib_esm_isBytes(value)) {
        return addSlice(new Uint8Array(value));
    }
    return bytes_lib_esm_logger.throwArgumentError("invalid arrayify value", "value", value);
}
function lib_esm_concat(items) {
    const objects = items.map(item => lib_esm_arrayify(item));
    const length = objects.reduce((accum, item) => (accum + item.length), 0);
    const result = new Uint8Array(length);
    objects.reduce((offset, object) => {
        result.set(object, offset);
        return offset + object.length;
    }, 0);
    return addSlice(result);
}
function lib_esm_stripZeros(value) {
    let result = lib_esm_arrayify(value);
    if (result.length === 0) {
        return result;
    }
    // Find the first non-zero entry
    let start = 0;
    while (start < result.length && result[start] === 0) {
        start++;
    }
    // If we started with zeros, strip them
    if (start) {
        result = result.slice(start);
    }
    return result;
}
function zeroPad(value, length) {
    value = lib_esm_arrayify(value);
    if (value.length > length) {
        bytes_lib_esm_logger.throwArgumentError("value out of range", "value", arguments[0]);
    }
    const result = new Uint8Array(length);
    result.set(value, length - value.length);
    return addSlice(result);
}
function lib_esm_isHexString(value, length) {
    if (typeof (value) !== "string" || !value.match(/^0x[0-9A-Fa-f]*$/)) {
        return false;
    }
    if (length && value.length !== 2 + 2 * length) {
        return false;
    }
    return true;
}
const HexCharacters = "0123456789abcdef";
function lib_esm_hexlify(value, options) {
    if (!options) {
        options = {};
    }
    if (typeof (value) === "number") {
        bytes_lib_esm_logger.checkSafeUint53(value, "invalid hexlify value");
        let hex = "";
        while (value) {
            hex = HexCharacters[value & 0xf] + hex;
            value = Math.floor(value / 16);
        }
        if (hex.length) {
            if (hex.length % 2) {
                hex = "0" + hex;
            }
            return "0x" + hex;
        }
        return "0x00";
    }
    if (typeof (value) === "bigint") {
        value = value.toString(16);
        if (value.length % 2) {
            return ("0x0" + value);
        }
        return "0x" + value;
    }
    if (options.allowMissingPrefix && typeof (value) === "string" && value.substring(0, 2) !== "0x") {
        value = "0x" + value;
    }
    if (isHexable(value)) {
        return value.toHexString();
    }
    if (lib_esm_isHexString(value)) {
        if (value.length % 2) {
            if (options.hexPad === "left") {
                value = "0x0" + value.substring(2);
            }
            else if (options.hexPad === "right") {
                value += "0";
            }
            else {
                bytes_lib_esm_logger.throwArgumentError("hex data is odd-length", "value", value);
            }
        }
        return value.toLowerCase();
    }
    if (lib_esm_isBytes(value)) {
        let result = "0x";
        for (let i = 0; i < value.length; i++) {
            let v = value[i];
            result += HexCharacters[(v & 0xf0) >> 4] + HexCharacters[v & 0x0f];
        }
        return result;
    }
    return bytes_lib_esm_logger.throwArgumentError("invalid hexlify value", "value", value);
}
/*
function unoddify(value: BytesLike | Hexable | number): BytesLike | Hexable | number {
    if (typeof(value) === "string" && value.length % 2 && value.substring(0, 2) === "0x") {
        return "0x0" + value.substring(2);
    }
    return value;
}
*/
function lib_esm_hexDataLength(data) {
    if (typeof (data) !== "string") {
        data = lib_esm_hexlify(data);
    }
    else if (!lib_esm_isHexString(data) || (data.length % 2)) {
        return null;
    }
    return (data.length - 2) / 2;
}
function lib_esm_hexDataSlice(data, offset, endOffset) {
    if (typeof (data) !== "string") {
        data = lib_esm_hexlify(data);
    }
    else if (!lib_esm_isHexString(data) || (data.length % 2)) {
        bytes_lib_esm_logger.throwArgumentError("invalid hexData", "value", data);
    }
    offset = 2 + 2 * offset;
    if (endOffset != null) {
        return "0x" + data.substring(offset, 2 + 2 * endOffset);
    }
    return "0x" + data.substring(offset);
}
function hexConcat(items) {
    let result = "0x";
    items.forEach((item) => {
        result += lib_esm_hexlify(item).substring(2);
    });
    return result;
}
function hexValue(value) {
    const trimmed = hexStripZeros(lib_esm_hexlify(value, { hexPad: "left" }));
    if (trimmed === "0x") {
        return "0x0";
    }
    return trimmed;
}
function hexStripZeros(value) {
    if (typeof (value) !== "string") {
        value = lib_esm_hexlify(value);
    }
    if (!lib_esm_isHexString(value)) {
        bytes_lib_esm_logger.throwArgumentError("invalid hex string", "value", value);
    }
    value = value.substring(2);
    let offset = 0;
    while (offset < value.length && value[offset] === "0") {
        offset++;
    }
    return "0x" + value.substring(offset);
}
function hexZeroPad(value, length) {
    if (typeof (value) !== "string") {
        value = lib_esm_hexlify(value);
    }
    else if (!lib_esm_isHexString(value)) {
        bytes_lib_esm_logger.throwArgumentError("invalid hex string", "value", value);
    }
    if (value.length > 2 * length + 2) {
        bytes_lib_esm_logger.throwArgumentError("value out of range", "value", arguments[1]);
    }
    while (value.length < 2 * length + 2) {
        value = "0x0" + value.substring(2);
    }
    return value;
}
function lib_esm_splitSignature(signature) {
    const result = {
        r: "0x",
        s: "0x",
        _vs: "0x",
        recoveryParam: 0,
        v: 0,
        yParityAndS: "0x",
        compact: "0x"
    };
    if (lib_esm_isBytesLike(signature)) {
        let bytes = lib_esm_arrayify(signature);
        // Get the r, s and v
        if (bytes.length === 64) {
            // EIP-2098; pull the v from the top bit of s and clear it
            result.v = 27 + (bytes[32] >> 7);
            bytes[32] &= 0x7f;
            result.r = lib_esm_hexlify(bytes.slice(0, 32));
            result.s = lib_esm_hexlify(bytes.slice(32, 64));
        }
        else if (bytes.length === 65) {
            result.r = lib_esm_hexlify(bytes.slice(0, 32));
            result.s = lib_esm_hexlify(bytes.slice(32, 64));
            result.v = bytes[64];
        }
        else {
            bytes_lib_esm_logger.throwArgumentError("invalid signature string", "signature", signature);
        }
        // Allow a recid to be used as the v
        if (result.v < 27) {
            if (result.v === 0 || result.v === 1) {
                result.v += 27;
            }
            else {
                bytes_lib_esm_logger.throwArgumentError("signature invalid v byte", "signature", signature);
            }
        }
        // Compute recoveryParam from v
        result.recoveryParam = 1 - (result.v % 2);
        // Compute _vs from recoveryParam and s
        if (result.recoveryParam) {
            bytes[32] |= 0x80;
        }
        result._vs = lib_esm_hexlify(bytes.slice(32, 64));
    }
    else {
        result.r = signature.r;
        result.s = signature.s;
        result.v = signature.v;
        result.recoveryParam = signature.recoveryParam;
        result._vs = signature._vs;
        // If the _vs is available, use it to populate missing s, v and recoveryParam
        // and verify non-missing s, v and recoveryParam
        if (result._vs != null) {
            const vs = zeroPad(lib_esm_arrayify(result._vs), 32);
            result._vs = lib_esm_hexlify(vs);
            // Set or check the recid
            const recoveryParam = ((vs[0] >= 128) ? 1 : 0);
            if (result.recoveryParam == null) {
                result.recoveryParam = recoveryParam;
            }
            else if (result.recoveryParam !== recoveryParam) {
                bytes_lib_esm_logger.throwArgumentError("signature recoveryParam mismatch _vs", "signature", signature);
            }
            // Set or check the s
            vs[0] &= 0x7f;
            const s = lib_esm_hexlify(vs);
            if (result.s == null) {
                result.s = s;
            }
            else if (result.s !== s) {
                bytes_lib_esm_logger.throwArgumentError("signature v mismatch _vs", "signature", signature);
            }
        }
        // Use recid and v to populate each other
        if (result.recoveryParam == null) {
            if (result.v == null) {
                bytes_lib_esm_logger.throwArgumentError("signature missing v and recoveryParam", "signature", signature);
            }
            else if (result.v === 0 || result.v === 1) {
                result.recoveryParam = result.v;
            }
            else {
                result.recoveryParam = 1 - (result.v % 2);
            }
        }
        else {
            if (result.v == null) {
                result.v = 27 + result.recoveryParam;
            }
            else {
                const recId = (result.v === 0 || result.v === 1) ? result.v : (1 - (result.v % 2));
                if (result.recoveryParam !== recId) {
                    bytes_lib_esm_logger.throwArgumentError("signature recoveryParam mismatch v", "signature", signature);
                }
            }
        }
        if (result.r == null || !lib_esm_isHexString(result.r)) {
            bytes_lib_esm_logger.throwArgumentError("signature missing or invalid r", "signature", signature);
        }
        else {
            result.r = hexZeroPad(result.r, 32);
        }
        if (result.s == null || !lib_esm_isHexString(result.s)) {
            bytes_lib_esm_logger.throwArgumentError("signature missing or invalid s", "signature", signature);
        }
        else {
            result.s = hexZeroPad(result.s, 32);
        }
        const vs = lib_esm_arrayify(result.s);
        if (vs[0] >= 128) {
            bytes_lib_esm_logger.throwArgumentError("signature s out of range", "signature", signature);
        }
        if (result.recoveryParam) {
            vs[0] |= 0x80;
        }
        const _vs = lib_esm_hexlify(vs);
        if (result._vs) {
            if (!lib_esm_isHexString(result._vs)) {
                bytes_lib_esm_logger.throwArgumentError("signature invalid _vs", "signature", signature);
            }
            result._vs = hexZeroPad(result._vs, 32);
        }
        // Set or check the _vs
        if (result._vs == null) {
            result._vs = _vs;
        }
        else if (result._vs !== _vs) {
            bytes_lib_esm_logger.throwArgumentError("signature _vs mismatch v and s", "signature", signature);
        }
    }
    result.yParityAndS = result._vs;
    result.compact = result.r + result.yParityAndS.substring(2);
    return result;
}
function joinSignature(signature) {
    signature = lib_esm_splitSignature(signature);
    return lib_esm_hexlify(lib_esm_concat([
        signature.r,
        signature.s,
        (signature.recoveryParam ? "0x1c" : "0x1b")
    ]));
}
//# sourceMappingURL=index.js.map
;// CONCATENATED MODULE: ./node_modules/@ethersproject/bignumber/lib.esm/_version.js
const bignumber_lib_esm_version_version = "bignumber/5.7.0";
//# sourceMappingURL=_version.js.map
;// CONCATENATED MODULE: ./node_modules/@ethersproject/bignumber/lib.esm/bignumber.js

/**
 *  BigNumber
 *
 *  A wrapper around the BN.js object. We use the BN.js library
 *  because it is used by elliptic, so it is required regardless.
 *
 */

var BN = (bn_default()).BN;



const bignumber_logger = new lib_esm_Logger(bignumber_lib_esm_version_version);
const _constructorGuard = {};
const MAX_SAFE = 0x1fffffffffffff;
function isBigNumberish(value) {
    return (value != null) && (bignumber_BigNumber.isBigNumber(value) ||
        (typeof (value) === "number" && (value % 1) === 0) ||
        (typeof (value) === "string" && !!value.match(/^-?[0-9]+$/)) ||
        isHexString(value) ||
        (typeof (value) === "bigint") ||
        isBytes(value));
}
// Only warn about passing 10 into radix once
let _warnedToStringRadix = false;
class bignumber_BigNumber {
    constructor(constructorGuard, hex) {
        if (constructorGuard !== _constructorGuard) {
            bignumber_logger.throwError("cannot call constructor directly; use BigNumber.from", lib_esm_Logger.errors.UNSUPPORTED_OPERATION, {
                operation: "new (BigNumber)"
            });
        }
        this._hex = hex;
        this._isBigNumber = true;
        Object.freeze(this);
    }
    fromTwos(value) {
        return toBigNumber(toBN(this).fromTwos(value));
    }
    toTwos(value) {
        return toBigNumber(toBN(this).toTwos(value));
    }
    abs() {
        if (this._hex[0] === "-") {
            return bignumber_BigNumber.from(this._hex.substring(1));
        }
        return this;
    }
    add(other) {
        return toBigNumber(toBN(this).add(toBN(other)));
    }
    sub(other) {
        return toBigNumber(toBN(this).sub(toBN(other)));
    }
    div(other) {
        const o = bignumber_BigNumber.from(other);
        if (o.isZero()) {
            throwFault("division-by-zero", "div");
        }
        return toBigNumber(toBN(this).div(toBN(other)));
    }
    mul(other) {
        return toBigNumber(toBN(this).mul(toBN(other)));
    }
    mod(other) {
        const value = toBN(other);
        if (value.isNeg()) {
            throwFault("division-by-zero", "mod");
        }
        return toBigNumber(toBN(this).umod(value));
    }
    pow(other) {
        const value = toBN(other);
        if (value.isNeg()) {
            throwFault("negative-power", "pow");
        }
        return toBigNumber(toBN(this).pow(value));
    }
    and(other) {
        const value = toBN(other);
        if (this.isNegative() || value.isNeg()) {
            throwFault("unbound-bitwise-result", "and");
        }
        return toBigNumber(toBN(this).and(value));
    }
    or(other) {
        const value = toBN(other);
        if (this.isNegative() || value.isNeg()) {
            throwFault("unbound-bitwise-result", "or");
        }
        return toBigNumber(toBN(this).or(value));
    }
    xor(other) {
        const value = toBN(other);
        if (this.isNegative() || value.isNeg()) {
            throwFault("unbound-bitwise-result", "xor");
        }
        return toBigNumber(toBN(this).xor(value));
    }
    mask(value) {
        if (this.isNegative() || value < 0) {
            throwFault("negative-width", "mask");
        }
        return toBigNumber(toBN(this).maskn(value));
    }
    shl(value) {
        if (this.isNegative() || value < 0) {
            throwFault("negative-width", "shl");
        }
        return toBigNumber(toBN(this).shln(value));
    }
    shr(value) {
        if (this.isNegative() || value < 0) {
            throwFault("negative-width", "shr");
        }
        return toBigNumber(toBN(this).shrn(value));
    }
    eq(other) {
        return toBN(this).eq(toBN(other));
    }
    lt(other) {
        return toBN(this).lt(toBN(other));
    }
    lte(other) {
        return toBN(this).lte(toBN(other));
    }
    gt(other) {
        return toBN(this).gt(toBN(other));
    }
    gte(other) {
        return toBN(this).gte(toBN(other));
    }
    isNegative() {
        return (this._hex[0] === "-");
    }
    isZero() {
        return toBN(this).isZero();
    }
    toNumber() {
        try {
            return toBN(this).toNumber();
        }
        catch (error) {
            throwFault("overflow", "toNumber", this.toString());
        }
        return null;
    }
    toBigInt() {
        try {
            return BigInt(this.toString());
        }
        catch (e) { }
        return bignumber_logger.throwError("this platform does not support BigInt", lib_esm_Logger.errors.UNSUPPORTED_OPERATION, {
            value: this.toString()
        });
    }
    toString() {
        // Lots of people expect this, which we do not support, so check (See: #889)
        if (arguments.length > 0) {
            if (arguments[0] === 10) {
                if (!_warnedToStringRadix) {
                    _warnedToStringRadix = true;
                    bignumber_logger.warn("BigNumber.toString does not accept any parameters; base-10 is assumed");
                }
            }
            else if (arguments[0] === 16) {
                bignumber_logger.throwError("BigNumber.toString does not accept any parameters; use bigNumber.toHexString()", lib_esm_Logger.errors.UNEXPECTED_ARGUMENT, {});
            }
            else {
                bignumber_logger.throwError("BigNumber.toString does not accept parameters", lib_esm_Logger.errors.UNEXPECTED_ARGUMENT, {});
            }
        }
        return toBN(this).toString(10);
    }
    toHexString() {
        return this._hex;
    }
    toJSON(key) {
        return { type: "BigNumber", hex: this.toHexString() };
    }
    static from(value) {
        if (value instanceof bignumber_BigNumber) {
            return value;
        }
        if (typeof (value) === "string") {
            if (value.match(/^-?0x[0-9a-f]+$/i)) {
                return new bignumber_BigNumber(_constructorGuard, toHex(value));
            }
            if (value.match(/^-?[0-9]+$/)) {
                return new bignumber_BigNumber(_constructorGuard, toHex(new BN(value)));
            }
            return bignumber_logger.throwArgumentError("invalid BigNumber string", "value", value);
        }
        if (typeof (value) === "number") {
            if (value % 1) {
                throwFault("underflow", "BigNumber.from", value);
            }
            if (value >= MAX_SAFE || value <= -MAX_SAFE) {
                throwFault("overflow", "BigNumber.from", value);
            }
            return bignumber_BigNumber.from(String(value));
        }
        const anyValue = value;
        if (typeof (anyValue) === "bigint") {
            return bignumber_BigNumber.from(anyValue.toString());
        }
        if (lib_esm_isBytes(anyValue)) {
            return bignumber_BigNumber.from(lib_esm_hexlify(anyValue));
        }
        if (anyValue) {
            // Hexable interface (takes priority)
            if (anyValue.toHexString) {
                const hex = anyValue.toHexString();
                if (typeof (hex) === "string") {
                    return bignumber_BigNumber.from(hex);
                }
            }
            else {
                // For now, handle legacy JSON-ified values (goes away in v6)
                let hex = anyValue._hex;
                // New-form JSON
                if (hex == null && anyValue.type === "BigNumber") {
                    hex = anyValue.hex;
                }
                if (typeof (hex) === "string") {
                    if (lib_esm_isHexString(hex) || (hex[0] === "-" && lib_esm_isHexString(hex.substring(1)))) {
                        return bignumber_BigNumber.from(hex);
                    }
                }
            }
        }
        return bignumber_logger.throwArgumentError("invalid BigNumber value", "value", value);
    }
    static isBigNumber(value) {
        return !!(value && value._isBigNumber);
    }
}
// Normalize the hex string
function toHex(value) {
    // For BN, call on the hex string
    if (typeof (value) !== "string") {
        return toHex(value.toString(16));
    }
    // If negative, prepend the negative sign to the normalized positive value
    if (value[0] === "-") {
        // Strip off the negative sign
        value = value.substring(1);
        // Cannot have multiple negative signs (e.g. "--0x04")
        if (value[0] === "-") {
            bignumber_logger.throwArgumentError("invalid hex", "value", value);
        }
        // Call toHex on the positive component
        value = toHex(value);
        // Do not allow "-0x00"
        if (value === "0x00") {
            return value;
        }
        // Negate the value
        return "-" + value;
    }
    // Add a "0x" prefix if missing
    if (value.substring(0, 2) !== "0x") {
        value = "0x" + value;
    }
    // Normalize zero
    if (value === "0x") {
        return "0x00";
    }
    // Make the string even length
    if (value.length % 2) {
        value = "0x0" + value.substring(2);
    }
    // Trim to smallest even-length string
    while (value.length > 4 && value.substring(0, 4) === "0x00") {
        value = "0x" + value.substring(4);
    }
    return value;
}
function toBigNumber(value) {
    return bignumber_BigNumber.from(toHex(value));
}
function toBN(value) {
    const hex = bignumber_BigNumber.from(value).toHexString();
    if (hex[0] === "-") {
        return (new BN("-" + hex.substring(3), 16));
    }
    return new BN(hex.substring(2), 16);
}
function throwFault(fault, operation, value) {
    const params = { fault: fault, operation: operation };
    if (value != null) {
        params.value = value;
    }
    return bignumber_logger.throwError(fault, lib_esm_Logger.errors.NUMERIC_FAULT, params);
}
// value should have no prefix
function _base36To16(value) {
    return (new BN(value, 36)).toString(16);
}
// value should have no prefix
function bignumber_base16To36(value) {
    return (new BN(value, 16)).toString(36);
}
//# sourceMappingURL=bignumber.js.map
// EXTERNAL MODULE: ./node_modules/js-sha3/src/sha3.js
var sha3 = __webpack_require__(1176);
var sha3_default = /*#__PURE__*/__webpack_require__.n(sha3);
;// CONCATENATED MODULE: ./node_modules/@ethersproject/keccak256/lib.esm/index.js



function lib_esm_keccak256(data) {
    return '0x' + sha3_default().keccak_256(lib_esm_arrayify(data));
}
//# sourceMappingURL=index.js.map
;// CONCATENATED MODULE: ./node_modules/@ethersproject/rlp/lib.esm/_version.js
const rlp_lib_esm_version_version = "rlp/5.7.0";
//# sourceMappingURL=_version.js.map
;// CONCATENATED MODULE: ./node_modules/@ethersproject/rlp/lib.esm/index.js

//See: https://github.com/ethereum/wiki/wiki/RLP



const rlp_lib_esm_logger = new lib_esm_Logger(rlp_lib_esm_version_version);
function arrayifyInteger(value) {
    const result = [];
    while (value) {
        result.unshift(value & 0xff);
        value >>= 8;
    }
    return result;
}
function unarrayifyInteger(data, offset, length) {
    let result = 0;
    for (let i = 0; i < length; i++) {
        result = (result * 256) + data[offset + i];
    }
    return result;
}
function _encode(object) {
    if (Array.isArray(object)) {
        let payload = [];
        object.forEach(function (child) {
            payload = payload.concat(_encode(child));
        });
        if (payload.length <= 55) {
            payload.unshift(0xc0 + payload.length);
            return payload;
        }
        const length = arrayifyInteger(payload.length);
        length.unshift(0xf7 + length.length);
        return length.concat(payload);
    }
    if (!lib_esm_isBytesLike(object)) {
        rlp_lib_esm_logger.throwArgumentError("RLP object must be BytesLike", "object", object);
    }
    const data = Array.prototype.slice.call(lib_esm_arrayify(object));
    if (data.length === 1 && data[0] <= 0x7f) {
        return data;
    }
    else if (data.length <= 55) {
        data.unshift(0x80 + data.length);
        return data;
    }
    const length = arrayifyInteger(data.length);
    length.unshift(0xb7 + length.length);
    return length.concat(data);
}
function encode(object) {
    return lib_esm_hexlify(_encode(object));
}
function _decodeChildren(data, offset, childOffset, length) {
    const result = [];
    while (childOffset < offset + 1 + length) {
        const decoded = _decode(data, childOffset);
        result.push(decoded.result);
        childOffset += decoded.consumed;
        if (childOffset > offset + 1 + length) {
            rlp_lib_esm_logger.throwError("child data too short", lib_esm_Logger.errors.BUFFER_OVERRUN, {});
        }
    }
    return { consumed: (1 + length), result: result };
}
// returns { consumed: number, result: Object }
function _decode(data, offset) {
    if (data.length === 0) {
        rlp_lib_esm_logger.throwError("data too short", lib_esm_Logger.errors.BUFFER_OVERRUN, {});
    }
    // Array with extra length prefix
    if (data[offset] >= 0xf8) {
        const lengthLength = data[offset] - 0xf7;
        if (offset + 1 + lengthLength > data.length) {
            rlp_lib_esm_logger.throwError("data short segment too short", lib_esm_Logger.errors.BUFFER_OVERRUN, {});
        }
        const length = unarrayifyInteger(data, offset + 1, lengthLength);
        if (offset + 1 + lengthLength + length > data.length) {
            rlp_lib_esm_logger.throwError("data long segment too short", lib_esm_Logger.errors.BUFFER_OVERRUN, {});
        }
        return _decodeChildren(data, offset, offset + 1 + lengthLength, lengthLength + length);
    }
    else if (data[offset] >= 0xc0) {
        const length = data[offset] - 0xc0;
        if (offset + 1 + length > data.length) {
            rlp_lib_esm_logger.throwError("data array too short", lib_esm_Logger.errors.BUFFER_OVERRUN, {});
        }
        return _decodeChildren(data, offset, offset + 1, length);
    }
    else if (data[offset] >= 0xb8) {
        const lengthLength = data[offset] - 0xb7;
        if (offset + 1 + lengthLength > data.length) {
            rlp_lib_esm_logger.throwError("data array too short", lib_esm_Logger.errors.BUFFER_OVERRUN, {});
        }
        const length = unarrayifyInteger(data, offset + 1, lengthLength);
        if (offset + 1 + lengthLength + length > data.length) {
            rlp_lib_esm_logger.throwError("data array too short", lib_esm_Logger.errors.BUFFER_OVERRUN, {});
        }
        const result = lib_esm_hexlify(data.slice(offset + 1 + lengthLength, offset + 1 + lengthLength + length));
        return { consumed: (1 + lengthLength + length), result: result };
    }
    else if (data[offset] >= 0x80) {
        const length = data[offset] - 0x80;
        if (offset + 1 + length > data.length) {
            rlp_lib_esm_logger.throwError("data too short", lib_esm_Logger.errors.BUFFER_OVERRUN, {});
        }
        const result = lib_esm_hexlify(data.slice(offset + 1, offset + 1 + length));
        return { consumed: (1 + length), result: result };
    }
    return { consumed: 1, result: lib_esm_hexlify(data[offset]) };
}
function decode(data) {
    const bytes = lib_esm_arrayify(data);
    const decoded = _decode(bytes, 0);
    if (decoded.consumed !== bytes.length) {
        rlp_lib_esm_logger.throwArgumentError("invalid rlp data", "data", data);
    }
    return decoded.result;
}
//# sourceMappingURL=index.js.map
;// CONCATENATED MODULE: ./node_modules/@ethersproject/address/lib.esm/_version.js
const address_lib_esm_version_version = "address/5.7.0";
//# sourceMappingURL=_version.js.map
;// CONCATENATED MODULE: ./node_modules/@ethersproject/address/lib.esm/index.js







const address_lib_esm_logger = new lib_esm_Logger(address_lib_esm_version_version);
function getChecksumAddress(address) {
    if (!lib_esm_isHexString(address, 20)) {
        address_lib_esm_logger.throwArgumentError("invalid address", "address", address);
    }
    address = address.toLowerCase();
    const chars = address.substring(2).split("");
    const expanded = new Uint8Array(40);
    for (let i = 0; i < 40; i++) {
        expanded[i] = chars[i].charCodeAt(0);
    }
    const hashed = lib_esm_arrayify(lib_esm_keccak256(expanded));
    for (let i = 0; i < 40; i += 2) {
        if ((hashed[i >> 1] >> 4) >= 8) {
            chars[i] = chars[i].toUpperCase();
        }
        if ((hashed[i >> 1] & 0x0f) >= 8) {
            chars[i + 1] = chars[i + 1].toUpperCase();
        }
    }
    return "0x" + chars.join("");
}
// Shims for environments that are missing some required constants and functions
const MAX_SAFE_INTEGER = 0x1fffffffffffff;
function log10(x) {
    if (Math.log10) {
        return Math.log10(x);
    }
    return Math.log(x) / Math.LN10;
}
// See: https://en.wikipedia.org/wiki/International_Bank_Account_Number
// Create lookup table
const ibanLookup = {};
for (let i = 0; i < 10; i++) {
    ibanLookup[String(i)] = String(i);
}
for (let i = 0; i < 26; i++) {
    ibanLookup[String.fromCharCode(65 + i)] = String(10 + i);
}
// How many decimal digits can we process? (for 64-bit float, this is 15)
const safeDigits = Math.floor(log10(MAX_SAFE_INTEGER));
function ibanChecksum(address) {
    address = address.toUpperCase();
    address = address.substring(4) + address.substring(0, 2) + "00";
    let expanded = address.split("").map((c) => { return ibanLookup[c]; }).join("");
    // Javascript can handle integers safely up to 15 (decimal) digits
    while (expanded.length >= safeDigits) {
        let block = expanded.substring(0, safeDigits);
        expanded = parseInt(block, 10) % 97 + expanded.substring(block.length);
    }
    let checksum = String(98 - (parseInt(expanded, 10) % 97));
    while (checksum.length < 2) {
        checksum = "0" + checksum;
    }
    return checksum;
}
;
function getAddress(address) {
    let result = null;
    if (typeof (address) !== "string") {
        address_lib_esm_logger.throwArgumentError("invalid address", "address", address);
    }
    if (address.match(/^(0x)?[0-9a-fA-F]{40}$/)) {
        // Missing the 0x prefix
        if (address.substring(0, 2) !== "0x") {
            address = "0x" + address;
        }
        result = getChecksumAddress(address);
        // It is a checksummed address with a bad checksum
        if (address.match(/([A-F].*[a-f])|([a-f].*[A-F])/) && result !== address) {
            address_lib_esm_logger.throwArgumentError("bad address checksum", "address", address);
        }
        // Maybe ICAP? (we only support direct mode)
    }
    else if (address.match(/^XE[0-9]{2}[0-9A-Za-z]{30,31}$/)) {
        // It is an ICAP address with a bad checksum
        if (address.substring(2, 4) !== ibanChecksum(address)) {
            address_lib_esm_logger.throwArgumentError("bad icap checksum", "address", address);
        }
        result = _base36To16(address.substring(4));
        while (result.length < 40) {
            result = "0" + result;
        }
        result = getChecksumAddress("0x" + result);
    }
    else {
        address_lib_esm_logger.throwArgumentError("invalid address", "address", address);
    }
    return result;
}
function isAddress(address) {
    try {
        getAddress(address);
        return true;
    }
    catch (error) { }
    return false;
}
function getIcapAddress(address) {
    let base36 = _base16To36(getAddress(address).substring(2)).toUpperCase();
    while (base36.length < 30) {
        base36 = "0" + base36;
    }
    return "XE" + ibanChecksum("XE00" + base36) + base36;
}
// http://ethereum.stackexchange.com/questions/760/how-is-the-address-of-an-ethereum-contract-computed
function getContractAddress(transaction) {
    let from = null;
    try {
        from = getAddress(transaction.from);
    }
    catch (error) {
        address_lib_esm_logger.throwArgumentError("missing from address", "transaction", transaction);
    }
    const nonce = lib_esm_stripZeros(lib_esm_arrayify(bignumber_BigNumber.from(transaction.nonce).toHexString()));
    return getAddress(lib_esm_hexDataSlice(lib_esm_keccak256(encode([from, nonce])), 12));
}
function getCreate2Address(from, salt, initCodeHash) {
    if (hexDataLength(salt) !== 32) {
        address_lib_esm_logger.throwArgumentError("salt must be 32 bytes", "salt", salt);
    }
    if (hexDataLength(initCodeHash) !== 32) {
        address_lib_esm_logger.throwArgumentError("initCodeHash must be 32 bytes", "initCodeHash", initCodeHash);
    }
    return getAddress(hexDataSlice(keccak256(concat(["0xff", getAddress(from), salt, initCodeHash])), 12));
}
//# sourceMappingURL=index.js.map
;// CONCATENATED MODULE: ./node_modules/@ethersproject/hash/lib.esm/_version.js
const hash_lib_esm_version_version = "hash/5.7.0";
//# sourceMappingURL=_version.js.map
;// CONCATENATED MODULE: ./node_modules/@ethersproject/strings/lib.esm/_version.js
const strings_lib_esm_version_version = "strings/5.7.0";
//# sourceMappingURL=_version.js.map
;// CONCATENATED MODULE: ./node_modules/@ethersproject/strings/lib.esm/utf8.js




const utf8_logger = new lib_esm_Logger(strings_lib_esm_version_version);
///////////////////////////////
var UnicodeNormalizationForm;
(function (UnicodeNormalizationForm) {
    UnicodeNormalizationForm["current"] = "";
    UnicodeNormalizationForm["NFC"] = "NFC";
    UnicodeNormalizationForm["NFD"] = "NFD";
    UnicodeNormalizationForm["NFKC"] = "NFKC";
    UnicodeNormalizationForm["NFKD"] = "NFKD";
})(UnicodeNormalizationForm || (UnicodeNormalizationForm = {}));
;
var Utf8ErrorReason;
(function (Utf8ErrorReason) {
    // A continuation byte was present where there was nothing to continue
    // - offset = the index the codepoint began in
    Utf8ErrorReason["UNEXPECTED_CONTINUE"] = "unexpected continuation byte";
    // An invalid (non-continuation) byte to start a UTF-8 codepoint was found
    // - offset = the index the codepoint began in
    Utf8ErrorReason["BAD_PREFIX"] = "bad codepoint prefix";
    // The string is too short to process the expected codepoint
    // - offset = the index the codepoint began in
    Utf8ErrorReason["OVERRUN"] = "string overrun";
    // A missing continuation byte was expected but not found
    // - offset = the index the continuation byte was expected at
    Utf8ErrorReason["MISSING_CONTINUE"] = "missing continuation byte";
    // The computed code point is outside the range for UTF-8
    // - offset       = start of this codepoint
    // - badCodepoint = the computed codepoint; outside the UTF-8 range
    Utf8ErrorReason["OUT_OF_RANGE"] = "out of UTF-8 range";
    // UTF-8 strings may not contain UTF-16 surrogate pairs
    // - offset       = start of this codepoint
    // - badCodepoint = the computed codepoint; inside the UTF-16 surrogate range
    Utf8ErrorReason["UTF16_SURROGATE"] = "UTF-16 surrogate";
    // The string is an overlong representation
    // - offset       = start of this codepoint
    // - badCodepoint = the computed codepoint; already bounds checked
    Utf8ErrorReason["OVERLONG"] = "overlong representation";
})(Utf8ErrorReason || (Utf8ErrorReason = {}));
;
function errorFunc(reason, offset, bytes, output, badCodepoint) {
    return utf8_logger.throwArgumentError(`invalid codepoint at offset ${offset}; ${reason}`, "bytes", bytes);
}
function ignoreFunc(reason, offset, bytes, output, badCodepoint) {
    // If there is an invalid prefix (including stray continuation), skip any additional continuation bytes
    if (reason === Utf8ErrorReason.BAD_PREFIX || reason === Utf8ErrorReason.UNEXPECTED_CONTINUE) {
        let i = 0;
        for (let o = offset + 1; o < bytes.length; o++) {
            if (bytes[o] >> 6 !== 0x02) {
                break;
            }
            i++;
        }
        return i;
    }
    // This byte runs us past the end of the string, so just jump to the end
    // (but the first byte was read already read and therefore skipped)
    if (reason === Utf8ErrorReason.OVERRUN) {
        return bytes.length - offset - 1;
    }
    // Nothing to skip
    return 0;
}
function replaceFunc(reason, offset, bytes, output, badCodepoint) {
    // Overlong representations are otherwise "valid" code points; just non-deistingtished
    if (reason === Utf8ErrorReason.OVERLONG) {
        output.push(badCodepoint);
        return 0;
    }
    // Put the replacement character into the output
    output.push(0xfffd);
    // Otherwise, process as if ignoring errors
    return ignoreFunc(reason, offset, bytes, output, badCodepoint);
}
// Common error handing strategies
const Utf8ErrorFuncs = Object.freeze({
    error: errorFunc,
    ignore: ignoreFunc,
    replace: replaceFunc
});
// http://stackoverflow.com/questions/13356493/decode-utf-8-with-javascript#13691499
function getUtf8CodePoints(bytes, onError) {
    if (onError == null) {
        onError = Utf8ErrorFuncs.error;
    }
    bytes = lib_esm_arrayify(bytes);
    const result = [];
    let i = 0;
    // Invalid bytes are ignored
    while (i < bytes.length) {
        const c = bytes[i++];
        // 0xxx xxxx
        if (c >> 7 === 0) {
            result.push(c);
            continue;
        }
        // Multibyte; how many bytes left for this character?
        let extraLength = null;
        let overlongMask = null;
        // 110x xxxx 10xx xxxx
        if ((c & 0xe0) === 0xc0) {
            extraLength = 1;
            overlongMask = 0x7f;
            // 1110 xxxx 10xx xxxx 10xx xxxx
        }
        else if ((c & 0xf0) === 0xe0) {
            extraLength = 2;
            overlongMask = 0x7ff;
            // 1111 0xxx 10xx xxxx 10xx xxxx 10xx xxxx
        }
        else if ((c & 0xf8) === 0xf0) {
            extraLength = 3;
            overlongMask = 0xffff;
        }
        else {
            if ((c & 0xc0) === 0x80) {
                i += onError(Utf8ErrorReason.UNEXPECTED_CONTINUE, i - 1, bytes, result);
            }
            else {
                i += onError(Utf8ErrorReason.BAD_PREFIX, i - 1, bytes, result);
            }
            continue;
        }
        // Do we have enough bytes in our data?
        if (i - 1 + extraLength >= bytes.length) {
            i += onError(Utf8ErrorReason.OVERRUN, i - 1, bytes, result);
            continue;
        }
        // Remove the length prefix from the char
        let res = c & ((1 << (8 - extraLength - 1)) - 1);
        for (let j = 0; j < extraLength; j++) {
            let nextChar = bytes[i];
            // Invalid continuation byte
            if ((nextChar & 0xc0) != 0x80) {
                i += onError(Utf8ErrorReason.MISSING_CONTINUE, i, bytes, result);
                res = null;
                break;
            }
            ;
            res = (res << 6) | (nextChar & 0x3f);
            i++;
        }
        // See above loop for invalid continuation byte
        if (res === null) {
            continue;
        }
        // Maximum code point
        if (res > 0x10ffff) {
            i += onError(Utf8ErrorReason.OUT_OF_RANGE, i - 1 - extraLength, bytes, result, res);
            continue;
        }
        // Reserved for UTF-16 surrogate halves
        if (res >= 0xd800 && res <= 0xdfff) {
            i += onError(Utf8ErrorReason.UTF16_SURROGATE, i - 1 - extraLength, bytes, result, res);
            continue;
        }
        // Check for overlong sequences (more bytes than needed)
        if (res <= overlongMask) {
            i += onError(Utf8ErrorReason.OVERLONG, i - 1 - extraLength, bytes, result, res);
            continue;
        }
        result.push(res);
    }
    return result;
}
// http://stackoverflow.com/questions/18729405/how-to-convert-utf8-string-to-byte-array
function toUtf8Bytes(str, form = UnicodeNormalizationForm.current) {
    if (form != UnicodeNormalizationForm.current) {
        utf8_logger.checkNormalize();
        str = str.normalize(form);
    }
    let result = [];
    for (let i = 0; i < str.length; i++) {
        const c = str.charCodeAt(i);
        if (c < 0x80) {
            result.push(c);
        }
        else if (c < 0x800) {
            result.push((c >> 6) | 0xc0);
            result.push((c & 0x3f) | 0x80);
        }
        else if ((c & 0xfc00) == 0xd800) {
            i++;
            const c2 = str.charCodeAt(i);
            if (i >= str.length || (c2 & 0xfc00) !== 0xdc00) {
                throw new Error("invalid utf-8 string");
            }
            // Surrogate Pair
            const pair = 0x10000 + ((c & 0x03ff) << 10) + (c2 & 0x03ff);
            result.push((pair >> 18) | 0xf0);
            result.push(((pair >> 12) & 0x3f) | 0x80);
            result.push(((pair >> 6) & 0x3f) | 0x80);
            result.push((pair & 0x3f) | 0x80);
        }
        else {
            result.push((c >> 12) | 0xe0);
            result.push(((c >> 6) & 0x3f) | 0x80);
            result.push((c & 0x3f) | 0x80);
        }
    }
    return lib_esm_arrayify(result);
}
;
function escapeChar(value) {
    const hex = ("0000" + value.toString(16));
    return "\\u" + hex.substring(hex.length - 4);
}
function _toEscapedUtf8String(bytes, onError) {
    return '"' + getUtf8CodePoints(bytes, onError).map((codePoint) => {
        if (codePoint < 256) {
            switch (codePoint) {
                case 8: return "\\b";
                case 9: return "\\t";
                case 10: return "\\n";
                case 13: return "\\r";
                case 34: return "\\\"";
                case 92: return "\\\\";
            }
            if (codePoint >= 32 && codePoint < 127) {
                return String.fromCharCode(codePoint);
            }
        }
        if (codePoint <= 0xffff) {
            return escapeChar(codePoint);
        }
        codePoint -= 0x10000;
        return escapeChar(((codePoint >> 10) & 0x3ff) + 0xd800) + escapeChar((codePoint & 0x3ff) + 0xdc00);
    }).join("") + '"';
}
function _toUtf8String(codePoints) {
    return codePoints.map((codePoint) => {
        if (codePoint <= 0xffff) {
            return String.fromCharCode(codePoint);
        }
        codePoint -= 0x10000;
        return String.fromCharCode((((codePoint >> 10) & 0x3ff) + 0xd800), ((codePoint & 0x3ff) + 0xdc00));
    }).join("");
}
function utf8_toUtf8String(bytes, onError) {
    return _toUtf8String(getUtf8CodePoints(bytes, onError));
}
function toUtf8CodePoints(str, form = UnicodeNormalizationForm.current) {
    return getUtf8CodePoints(toUtf8Bytes(str, form));
}
//# sourceMappingURL=utf8.js.map
;// CONCATENATED MODULE: ./node_modules/@ethersproject/hash/lib.esm/id.js


function id(text) {
    return lib_esm_keccak256(toUtf8Bytes(text));
}
//# sourceMappingURL=id.js.map
;// CONCATENATED MODULE: ./node_modules/@ethersproject/hash/lib.esm/typed-data.js
var typed_data_awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};







const typed_data_logger = new lib_esm_Logger(hash_lib_esm_version_version);

const padding = new Uint8Array(32);
padding.fill(0);
const NegativeOne = bignumber_BigNumber.from(-1);
const Zero = bignumber_BigNumber.from(0);
const One = bignumber_BigNumber.from(1);
const MaxUint256 = bignumber_BigNumber.from("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff");
function hexPadRight(value) {
    const bytes = lib_esm_arrayify(value);
    const padOffset = bytes.length % 32;
    if (padOffset) {
        return hexConcat([bytes, padding.slice(padOffset)]);
    }
    return lib_esm_hexlify(bytes);
}
const hexTrue = hexZeroPad(One.toHexString(), 32);
const hexFalse = hexZeroPad(Zero.toHexString(), 32);
const domainFieldTypes = {
    name: "string",
    version: "string",
    chainId: "uint256",
    verifyingContract: "address",
    salt: "bytes32"
};
const domainFieldNames = [
    "name", "version", "chainId", "verifyingContract", "salt"
];
function checkString(key) {
    return function (value) {
        if (typeof (value) !== "string") {
            typed_data_logger.throwArgumentError(`invalid domain value for ${JSON.stringify(key)}`, `domain.${key}`, value);
        }
        return value;
    };
}
const domainChecks = {
    name: checkString("name"),
    version: checkString("version"),
    chainId: function (value) {
        try {
            return bignumber_BigNumber.from(value).toString();
        }
        catch (error) { }
        return typed_data_logger.throwArgumentError(`invalid domain value for "chainId"`, "domain.chainId", value);
    },
    verifyingContract: function (value) {
        try {
            return getAddress(value).toLowerCase();
        }
        catch (error) { }
        return typed_data_logger.throwArgumentError(`invalid domain value "verifyingContract"`, "domain.verifyingContract", value);
    },
    salt: function (value) {
        try {
            const bytes = lib_esm_arrayify(value);
            if (bytes.length !== 32) {
                throw new Error("bad length");
            }
            return lib_esm_hexlify(bytes);
        }
        catch (error) { }
        return typed_data_logger.throwArgumentError(`invalid domain value "salt"`, "domain.salt", value);
    }
};
function getBaseEncoder(type) {
    // intXX and uintXX
    {
        const match = type.match(/^(u?)int(\d*)$/);
        if (match) {
            const signed = (match[1] === "");
            const width = parseInt(match[2] || "256");
            if (width % 8 !== 0 || width > 256 || (match[2] && match[2] !== String(width))) {
                typed_data_logger.throwArgumentError("invalid numeric width", "type", type);
            }
            const boundsUpper = MaxUint256.mask(signed ? (width - 1) : width);
            const boundsLower = signed ? boundsUpper.add(One).mul(NegativeOne) : Zero;
            return function (value) {
                const v = bignumber_BigNumber.from(value);
                if (v.lt(boundsLower) || v.gt(boundsUpper)) {
                    typed_data_logger.throwArgumentError(`value out-of-bounds for ${type}`, "value", value);
                }
                return hexZeroPad(v.toTwos(256).toHexString(), 32);
            };
        }
    }
    // bytesXX
    {
        const match = type.match(/^bytes(\d+)$/);
        if (match) {
            const width = parseInt(match[1]);
            if (width === 0 || width > 32 || match[1] !== String(width)) {
                typed_data_logger.throwArgumentError("invalid bytes width", "type", type);
            }
            return function (value) {
                const bytes = lib_esm_arrayify(value);
                if (bytes.length !== width) {
                    typed_data_logger.throwArgumentError(`invalid length for ${type}`, "value", value);
                }
                return hexPadRight(value);
            };
        }
    }
    switch (type) {
        case "address": return function (value) {
            return hexZeroPad(getAddress(value), 32);
        };
        case "bool": return function (value) {
            return ((!value) ? hexFalse : hexTrue);
        };
        case "bytes": return function (value) {
            return lib_esm_keccak256(value);
        };
        case "string": return function (value) {
            return id(value);
        };
    }
    return null;
}
function encodeType(name, fields) {
    return `${name}(${fields.map(({ name, type }) => (type + " " + name)).join(",")})`;
}
class TypedDataEncoder {
    constructor(types) {
        defineReadOnly(this, "types", Object.freeze(deepCopy(types)));
        defineReadOnly(this, "_encoderCache", {});
        defineReadOnly(this, "_types", {});
        // Link struct types to their direct child structs
        const links = {};
        // Link structs to structs which contain them as a child
        const parents = {};
        // Link all subtypes within a given struct
        const subtypes = {};
        Object.keys(types).forEach((type) => {
            links[type] = {};
            parents[type] = [];
            subtypes[type] = {};
        });
        for (const name in types) {
            const uniqueNames = {};
            types[name].forEach((field) => {
                // Check each field has a unique name
                if (uniqueNames[field.name]) {
                    typed_data_logger.throwArgumentError(`duplicate variable name ${JSON.stringify(field.name)} in ${JSON.stringify(name)}`, "types", types);
                }
                uniqueNames[field.name] = true;
                // Get the base type (drop any array specifiers)
                const baseType = field.type.match(/^([^\x5b]*)(\x5b|$)/)[1];
                if (baseType === name) {
                    typed_data_logger.throwArgumentError(`circular type reference to ${JSON.stringify(baseType)}`, "types", types);
                }
                // Is this a base encoding type?
                const encoder = getBaseEncoder(baseType);
                if (encoder) {
                    return;
                }
                if (!parents[baseType]) {
                    typed_data_logger.throwArgumentError(`unknown type ${JSON.stringify(baseType)}`, "types", types);
                }
                // Add linkage
                parents[baseType].push(name);
                links[name][baseType] = true;
            });
        }
        // Deduce the primary type
        const primaryTypes = Object.keys(parents).filter((n) => (parents[n].length === 0));
        if (primaryTypes.length === 0) {
            typed_data_logger.throwArgumentError("missing primary type", "types", types);
        }
        else if (primaryTypes.length > 1) {
            typed_data_logger.throwArgumentError(`ambiguous primary types or unused types: ${primaryTypes.map((t) => (JSON.stringify(t))).join(", ")}`, "types", types);
        }
        defineReadOnly(this, "primaryType", primaryTypes[0]);
        // Check for circular type references
        function checkCircular(type, found) {
            if (found[type]) {
                typed_data_logger.throwArgumentError(`circular type reference to ${JSON.stringify(type)}`, "types", types);
            }
            found[type] = true;
            Object.keys(links[type]).forEach((child) => {
                if (!parents[child]) {
                    return;
                }
                // Recursively check children
                checkCircular(child, found);
                // Mark all ancestors as having this decendant
                Object.keys(found).forEach((subtype) => {
                    subtypes[subtype][child] = true;
                });
            });
            delete found[type];
        }
        checkCircular(this.primaryType, {});
        // Compute each fully describe type
        for (const name in subtypes) {
            const st = Object.keys(subtypes[name]);
            st.sort();
            this._types[name] = encodeType(name, types[name]) + st.map((t) => encodeType(t, types[t])).join("");
        }
    }
    getEncoder(type) {
        let encoder = this._encoderCache[type];
        if (!encoder) {
            encoder = this._encoderCache[type] = this._getEncoder(type);
        }
        return encoder;
    }
    _getEncoder(type) {
        // Basic encoder type (address, bool, uint256, etc)
        {
            const encoder = getBaseEncoder(type);
            if (encoder) {
                return encoder;
            }
        }
        // Array
        const match = type.match(/^(.*)(\x5b(\d*)\x5d)$/);
        if (match) {
            const subtype = match[1];
            const subEncoder = this.getEncoder(subtype);
            const length = parseInt(match[3]);
            return (value) => {
                if (length >= 0 && value.length !== length) {
                    typed_data_logger.throwArgumentError("array length mismatch; expected length ${ arrayLength }", "value", value);
                }
                let result = value.map(subEncoder);
                if (this._types[subtype]) {
                    result = result.map(lib_esm_keccak256);
                }
                return lib_esm_keccak256(hexConcat(result));
            };
        }
        // Struct
        const fields = this.types[type];
        if (fields) {
            const encodedType = id(this._types[type]);
            return (value) => {
                const values = fields.map(({ name, type }) => {
                    const result = this.getEncoder(type)(value[name]);
                    if (this._types[type]) {
                        return lib_esm_keccak256(result);
                    }
                    return result;
                });
                values.unshift(encodedType);
                return hexConcat(values);
            };
        }
        return typed_data_logger.throwArgumentError(`unknown type: ${type}`, "type", type);
    }
    encodeType(name) {
        const result = this._types[name];
        if (!result) {
            typed_data_logger.throwArgumentError(`unknown type: ${JSON.stringify(name)}`, "name", name);
        }
        return result;
    }
    encodeData(type, value) {
        return this.getEncoder(type)(value);
    }
    hashStruct(name, value) {
        return lib_esm_keccak256(this.encodeData(name, value));
    }
    encode(value) {
        return this.encodeData(this.primaryType, value);
    }
    hash(value) {
        return this.hashStruct(this.primaryType, value);
    }
    _visit(type, value, callback) {
        // Basic encoder type (address, bool, uint256, etc)
        {
            const encoder = getBaseEncoder(type);
            if (encoder) {
                return callback(type, value);
            }
        }
        // Array
        const match = type.match(/^(.*)(\x5b(\d*)\x5d)$/);
        if (match) {
            const subtype = match[1];
            const length = parseInt(match[3]);
            if (length >= 0 && value.length !== length) {
                typed_data_logger.throwArgumentError("array length mismatch; expected length ${ arrayLength }", "value", value);
            }
            return value.map((v) => this._visit(subtype, v, callback));
        }
        // Struct
        const fields = this.types[type];
        if (fields) {
            return fields.reduce((accum, { name, type }) => {
                accum[name] = this._visit(type, value[name], callback);
                return accum;
            }, {});
        }
        return typed_data_logger.throwArgumentError(`unknown type: ${type}`, "type", type);
    }
    visit(value, callback) {
        return this._visit(this.primaryType, value, callback);
    }
    static from(types) {
        return new TypedDataEncoder(types);
    }
    static getPrimaryType(types) {
        return TypedDataEncoder.from(types).primaryType;
    }
    static hashStruct(name, types, value) {
        return TypedDataEncoder.from(types).hashStruct(name, value);
    }
    static hashDomain(domain) {
        const domainFields = [];
        for (const name in domain) {
            const type = domainFieldTypes[name];
            if (!type) {
                typed_data_logger.throwArgumentError(`invalid typed-data domain key: ${JSON.stringify(name)}`, "domain", domain);
            }
            domainFields.push({ name, type });
        }
        domainFields.sort((a, b) => {
            return domainFieldNames.indexOf(a.name) - domainFieldNames.indexOf(b.name);
        });
        return TypedDataEncoder.hashStruct("EIP712Domain", { EIP712Domain: domainFields }, domain);
    }
    static encode(domain, types, value) {
        return hexConcat([
            "0x1901",
            TypedDataEncoder.hashDomain(domain),
            TypedDataEncoder.from(types).hash(value)
        ]);
    }
    static hash(domain, types, value) {
        return lib_esm_keccak256(TypedDataEncoder.encode(domain, types, value));
    }
    // Replaces all address types with ENS names with their looked up address
    static resolveNames(domain, types, value, resolveName) {
        return typed_data_awaiter(this, void 0, void 0, function* () {
            // Make a copy to isolate it from the object passed in
            domain = shallowCopy(domain);
            // Look up all ENS names
            const ensCache = {};
            // Do we need to look up the domain's verifyingContract?
            if (domain.verifyingContract && !lib_esm_isHexString(domain.verifyingContract, 20)) {
                ensCache[domain.verifyingContract] = "0x";
            }
            // We are going to use the encoder to visit all the base values
            const encoder = TypedDataEncoder.from(types);
            // Get a list of all the addresses
            encoder.visit(value, (type, value) => {
                if (type === "address" && !lib_esm_isHexString(value, 20)) {
                    ensCache[value] = "0x";
                }
                return value;
            });
            // Lookup each name
            for (const name in ensCache) {
                ensCache[name] = yield resolveName(name);
            }
            // Replace the domain verifyingContract if needed
            if (domain.verifyingContract && ensCache[domain.verifyingContract]) {
                domain.verifyingContract = ensCache[domain.verifyingContract];
            }
            // Replace all ENS names with their address
            value = encoder.visit(value, (type, value) => {
                if (type === "address" && ensCache[value]) {
                    return ensCache[value];
                }
                return value;
            });
            return { domain, value };
        });
    }
    static getPayload(domain, types, value) {
        // Validate the domain fields
        TypedDataEncoder.hashDomain(domain);
        // Derive the EIP712Domain Struct reference type
        const domainValues = {};
        const domainTypes = [];
        domainFieldNames.forEach((name) => {
            const value = domain[name];
            if (value == null) {
                return;
            }
            domainValues[name] = domainChecks[name](value);
            domainTypes.push({ name, type: domainFieldTypes[name] });
        });
        const encoder = TypedDataEncoder.from(types);
        const typesWithDomain = shallowCopy(types);
        if (typesWithDomain.EIP712Domain) {
            typed_data_logger.throwArgumentError("types must not contain EIP712Domain type", "types.EIP712Domain", types);
        }
        else {
            typesWithDomain.EIP712Domain = domainTypes;
        }
        // Validate the data structures and types
        encoder.encode(value);
        return {
            types: typesWithDomain,
            domain: domainValues,
            primaryType: encoder.primaryType,
            message: encoder.visit(value, (type, value) => {
                // bytes
                if (type.match(/^bytes(\d*)/)) {
                    return lib_esm_hexlify(lib_esm_arrayify(value));
                }
                // uint or int
                if (type.match(/^u?int/)) {
                    return bignumber_BigNumber.from(value).toString();
                }
                switch (type) {
                    case "address":
                        return value.toLowerCase();
                    case "bool":
                        return !!value;
                    case "string":
                        if (typeof (value) !== "string") {
                            typed_data_logger.throwArgumentError(`invalid string`, "value", value);
                        }
                        return value;
                }
                return typed_data_logger.throwArgumentError("unsupported type", "type", type);
            })
        };
    }
}
//# sourceMappingURL=typed-data.js.map
;// CONCATENATED MODULE: ./node_modules/@ethersproject/constants/lib.esm/bignumbers.js

const bignumbers_NegativeOne = ( /*#__PURE__*/(/* unused pure expression or super */ null && (BigNumber.from(-1))));
const bignumbers_Zero = ( /*#__PURE__*/bignumber_BigNumber.from(0));
const bignumbers_One = ( /*#__PURE__*/(/* unused pure expression or super */ null && (BigNumber.from(1))));
const Two = ( /*#__PURE__*/(/* unused pure expression or super */ null && (BigNumber.from(2))));
const WeiPerEther = ( /*#__PURE__*/(/* unused pure expression or super */ null && (BigNumber.from("1000000000000000000"))));
const bignumbers_MaxUint256 = ( /*#__PURE__*/(/* unused pure expression or super */ null && (BigNumber.from("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"))));
const MinInt256 = ( /*#__PURE__*/(/* unused pure expression or super */ null && (BigNumber.from("-0x8000000000000000000000000000000000000000000000000000000000000000"))));
const MaxInt256 = ( /*#__PURE__*/(/* unused pure expression or super */ null && (BigNumber.from("0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"))));

//# sourceMappingURL=bignumbers.js.map
// EXTERNAL MODULE: ./node_modules/hash.js/lib/hash.js
var lib_hash = __webpack_require__(7952);
var hash_default = /*#__PURE__*/__webpack_require__.n(lib_hash);
;// CONCATENATED MODULE: ./node_modules/@ethersproject/signing-key/lib.esm/elliptic.js



var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof __webpack_require__.g !== 'undefined' ? __webpack_require__.g : typeof self !== 'undefined' ? self : {};

function getDefaultExportFromCjs (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

function createCommonjsModule(fn, basedir, module) {
	return module = {
		path: basedir,
		exports: {},
		require: function (path, base) {
			return commonjsRequire(path, (base === undefined || base === null) ? module.path : base);
		}
	}, fn(module, module.exports), module.exports;
}

function getDefaultExportFromNamespaceIfPresent (n) {
	return n && Object.prototype.hasOwnProperty.call(n, 'default') ? n['default'] : n;
}

function getDefaultExportFromNamespaceIfNotNamed (n) {
	return n && Object.prototype.hasOwnProperty.call(n, 'default') && Object.keys(n).length === 1 ? n['default'] : n;
}

function getAugmentedNamespace(n) {
	if (n.__esModule) return n;
	var a = Object.defineProperty({}, '__esModule', {value: true});
	Object.keys(n).forEach(function (k) {
		var d = Object.getOwnPropertyDescriptor(n, k);
		Object.defineProperty(a, k, d.get ? d : {
			enumerable: true,
			get: function () {
				return n[k];
			}
		});
	});
	return a;
}

function commonjsRequire () {
	throw new Error('Dynamic requires are not currently supported by @rollup/plugin-commonjs');
}

var minimalisticAssert = assert;

function assert(val, msg) {
  if (!val)
    throw new Error(msg || 'Assertion failed');
}

assert.equal = function assertEqual(l, r, msg) {
  if (l != r)
    throw new Error(msg || ('Assertion failed: ' + l + ' != ' + r));
};

var utils_1 = createCommonjsModule(function (module, exports) {
'use strict';

var utils = exports;

function toArray(msg, enc) {
  if (Array.isArray(msg))
    return msg.slice();
  if (!msg)
    return [];
  var res = [];
  if (typeof msg !== 'string') {
    for (var i = 0; i < msg.length; i++)
      res[i] = msg[i] | 0;
    return res;
  }
  if (enc === 'hex') {
    msg = msg.replace(/[^a-z0-9]+/ig, '');
    if (msg.length % 2 !== 0)
      msg = '0' + msg;
    for (var i = 0; i < msg.length; i += 2)
      res.push(parseInt(msg[i] + msg[i + 1], 16));
  } else {
    for (var i = 0; i < msg.length; i++) {
      var c = msg.charCodeAt(i);
      var hi = c >> 8;
      var lo = c & 0xff;
      if (hi)
        res.push(hi, lo);
      else
        res.push(lo);
    }
  }
  return res;
}
utils.toArray = toArray;

function zero2(word) {
  if (word.length === 1)
    return '0' + word;
  else
    return word;
}
utils.zero2 = zero2;

function toHex(msg) {
  var res = '';
  for (var i = 0; i < msg.length; i++)
    res += zero2(msg[i].toString(16));
  return res;
}
utils.toHex = toHex;

utils.encode = function encode(arr, enc) {
  if (enc === 'hex')
    return toHex(arr);
  else
    return arr;
};
});

var utils_1$1 = createCommonjsModule(function (module, exports) {
'use strict';

var utils = exports;




utils.assert = minimalisticAssert;
utils.toArray = utils_1.toArray;
utils.zero2 = utils_1.zero2;
utils.toHex = utils_1.toHex;
utils.encode = utils_1.encode;

// Represent num in a w-NAF form
function getNAF(num, w, bits) {
  var naf = new Array(Math.max(num.bitLength(), bits) + 1);
  naf.fill(0);

  var ws = 1 << (w + 1);
  var k = num.clone();

  for (var i = 0; i < naf.length; i++) {
    var z;
    var mod = k.andln(ws - 1);
    if (k.isOdd()) {
      if (mod > (ws >> 1) - 1)
        z = (ws >> 1) - mod;
      else
        z = mod;
      k.isubn(z);
    } else {
      z = 0;
    }

    naf[i] = z;
    k.iushrn(1);
  }

  return naf;
}
utils.getNAF = getNAF;

// Represent k1, k2 in a Joint Sparse Form
function getJSF(k1, k2) {
  var jsf = [
    [],
    [],
  ];

  k1 = k1.clone();
  k2 = k2.clone();
  var d1 = 0;
  var d2 = 0;
  var m8;
  while (k1.cmpn(-d1) > 0 || k2.cmpn(-d2) > 0) {
    // First phase
    var m14 = (k1.andln(3) + d1) & 3;
    var m24 = (k2.andln(3) + d2) & 3;
    if (m14 === 3)
      m14 = -1;
    if (m24 === 3)
      m24 = -1;
    var u1;
    if ((m14 & 1) === 0) {
      u1 = 0;
    } else {
      m8 = (k1.andln(7) + d1) & 7;
      if ((m8 === 3 || m8 === 5) && m24 === 2)
        u1 = -m14;
      else
        u1 = m14;
    }
    jsf[0].push(u1);

    var u2;
    if ((m24 & 1) === 0) {
      u2 = 0;
    } else {
      m8 = (k2.andln(7) + d2) & 7;
      if ((m8 === 3 || m8 === 5) && m14 === 2)
        u2 = -m24;
      else
        u2 = m24;
    }
    jsf[1].push(u2);

    // Second phase
    if (2 * d1 === u1 + 1)
      d1 = 1 - d1;
    if (2 * d2 === u2 + 1)
      d2 = 1 - d2;
    k1.iushrn(1);
    k2.iushrn(1);
  }

  return jsf;
}
utils.getJSF = getJSF;

function cachedProperty(obj, name, computer) {
  var key = '_' + name;
  obj.prototype[name] = function cachedProperty() {
    return this[key] !== undefined ? this[key] :
      this[key] = computer.call(this);
  };
}
utils.cachedProperty = cachedProperty;

function parseBytes(bytes) {
  return typeof bytes === 'string' ? utils.toArray(bytes, 'hex') :
    bytes;
}
utils.parseBytes = parseBytes;

function intFromLE(bytes) {
  return new (bn_default())(bytes, 'hex', 'le');
}
utils.intFromLE = intFromLE;
});

'use strict';



var getNAF = utils_1$1.getNAF;
var getJSF = utils_1$1.getJSF;
var assert$1 = utils_1$1.assert;

function BaseCurve(type, conf) {
  this.type = type;
  this.p = new (bn_default())(conf.p, 16);

  // Use Montgomery, when there is no fast reduction for the prime
  this.red = conf.prime ? bn_default().red(conf.prime) : bn_default().mont(this.p);

  // Useful for many curves
  this.zero = new (bn_default())(0).toRed(this.red);
  this.one = new (bn_default())(1).toRed(this.red);
  this.two = new (bn_default())(2).toRed(this.red);

  // Curve configuration, optional
  this.n = conf.n && new (bn_default())(conf.n, 16);
  this.g = conf.g && this.pointFromJSON(conf.g, conf.gRed);

  // Temporary arrays
  this._wnafT1 = new Array(4);
  this._wnafT2 = new Array(4);
  this._wnafT3 = new Array(4);
  this._wnafT4 = new Array(4);

  this._bitLength = this.n ? this.n.bitLength() : 0;

  // Generalized Greg Maxwell's trick
  var adjustCount = this.n && this.p.div(this.n);
  if (!adjustCount || adjustCount.cmpn(100) > 0) {
    this.redN = null;
  } else {
    this._maxwellTrick = true;
    this.redN = this.n.toRed(this.red);
  }
}
var base = BaseCurve;

BaseCurve.prototype.point = function point() {
  throw new Error('Not implemented');
};

BaseCurve.prototype.validate = function validate() {
  throw new Error('Not implemented');
};

BaseCurve.prototype._fixedNafMul = function _fixedNafMul(p, k) {
  assert$1(p.precomputed);
  var doubles = p._getDoubles();

  var naf = getNAF(k, 1, this._bitLength);
  var I = (1 << (doubles.step + 1)) - (doubles.step % 2 === 0 ? 2 : 1);
  I /= 3;

  // Translate into more windowed form
  var repr = [];
  var j;
  var nafW;
  for (j = 0; j < naf.length; j += doubles.step) {
    nafW = 0;
    for (var l = j + doubles.step - 1; l >= j; l--)
      nafW = (nafW << 1) + naf[l];
    repr.push(nafW);
  }

  var a = this.jpoint(null, null, null);
  var b = this.jpoint(null, null, null);
  for (var i = I; i > 0; i--) {
    for (j = 0; j < repr.length; j++) {
      nafW = repr[j];
      if (nafW === i)
        b = b.mixedAdd(doubles.points[j]);
      else if (nafW === -i)
        b = b.mixedAdd(doubles.points[j].neg());
    }
    a = a.add(b);
  }
  return a.toP();
};

BaseCurve.prototype._wnafMul = function _wnafMul(p, k) {
  var w = 4;

  // Precompute window
  var nafPoints = p._getNAFPoints(w);
  w = nafPoints.wnd;
  var wnd = nafPoints.points;

  // Get NAF form
  var naf = getNAF(k, w, this._bitLength);

  // Add `this`*(N+1) for every w-NAF index
  var acc = this.jpoint(null, null, null);
  for (var i = naf.length - 1; i >= 0; i--) {
    // Count zeroes
    for (var l = 0; i >= 0 && naf[i] === 0; i--)
      l++;
    if (i >= 0)
      l++;
    acc = acc.dblp(l);

    if (i < 0)
      break;
    var z = naf[i];
    assert$1(z !== 0);
    if (p.type === 'affine') {
      // J +- P
      if (z > 0)
        acc = acc.mixedAdd(wnd[(z - 1) >> 1]);
      else
        acc = acc.mixedAdd(wnd[(-z - 1) >> 1].neg());
    } else {
      // J +- J
      if (z > 0)
        acc = acc.add(wnd[(z - 1) >> 1]);
      else
        acc = acc.add(wnd[(-z - 1) >> 1].neg());
    }
  }
  return p.type === 'affine' ? acc.toP() : acc;
};

BaseCurve.prototype._wnafMulAdd = function _wnafMulAdd(defW,
  points,
  coeffs,
  len,
  jacobianResult) {
  var wndWidth = this._wnafT1;
  var wnd = this._wnafT2;
  var naf = this._wnafT3;

  // Fill all arrays
  var max = 0;
  var i;
  var j;
  var p;
  for (i = 0; i < len; i++) {
    p = points[i];
    var nafPoints = p._getNAFPoints(defW);
    wndWidth[i] = nafPoints.wnd;
    wnd[i] = nafPoints.points;
  }

  // Comb small window NAFs
  for (i = len - 1; i >= 1; i -= 2) {
    var a = i - 1;
    var b = i;
    if (wndWidth[a] !== 1 || wndWidth[b] !== 1) {
      naf[a] = getNAF(coeffs[a], wndWidth[a], this._bitLength);
      naf[b] = getNAF(coeffs[b], wndWidth[b], this._bitLength);
      max = Math.max(naf[a].length, max);
      max = Math.max(naf[b].length, max);
      continue;
    }

    var comb = [
      points[a], /* 1 */
      null, /* 3 */
      null, /* 5 */
      points[b], /* 7 */
    ];

    // Try to avoid Projective points, if possible
    if (points[a].y.cmp(points[b].y) === 0) {
      comb[1] = points[a].add(points[b]);
      comb[2] = points[a].toJ().mixedAdd(points[b].neg());
    } else if (points[a].y.cmp(points[b].y.redNeg()) === 0) {
      comb[1] = points[a].toJ().mixedAdd(points[b]);
      comb[2] = points[a].add(points[b].neg());
    } else {
      comb[1] = points[a].toJ().mixedAdd(points[b]);
      comb[2] = points[a].toJ().mixedAdd(points[b].neg());
    }

    var index = [
      -3, /* -1 -1 */
      -1, /* -1 0 */
      -5, /* -1 1 */
      -7, /* 0 -1 */
      0, /* 0 0 */
      7, /* 0 1 */
      5, /* 1 -1 */
      1, /* 1 0 */
      3,  /* 1 1 */
    ];

    var jsf = getJSF(coeffs[a], coeffs[b]);
    max = Math.max(jsf[0].length, max);
    naf[a] = new Array(max);
    naf[b] = new Array(max);
    for (j = 0; j < max; j++) {
      var ja = jsf[0][j] | 0;
      var jb = jsf[1][j] | 0;

      naf[a][j] = index[(ja + 1) * 3 + (jb + 1)];
      naf[b][j] = 0;
      wnd[a] = comb;
    }
  }

  var acc = this.jpoint(null, null, null);
  var tmp = this._wnafT4;
  for (i = max; i >= 0; i--) {
    var k = 0;

    while (i >= 0) {
      var zero = true;
      for (j = 0; j < len; j++) {
        tmp[j] = naf[j][i] | 0;
        if (tmp[j] !== 0)
          zero = false;
      }
      if (!zero)
        break;
      k++;
      i--;
    }
    if (i >= 0)
      k++;
    acc = acc.dblp(k);
    if (i < 0)
      break;

    for (j = 0; j < len; j++) {
      var z = tmp[j];
      p;
      if (z === 0)
        continue;
      else if (z > 0)
        p = wnd[j][(z - 1) >> 1];
      else if (z < 0)
        p = wnd[j][(-z - 1) >> 1].neg();

      if (p.type === 'affine')
        acc = acc.mixedAdd(p);
      else
        acc = acc.add(p);
    }
  }
  // Zeroify references
  for (i = 0; i < len; i++)
    wnd[i] = null;

  if (jacobianResult)
    return acc;
  else
    return acc.toP();
};

function BasePoint(curve, type) {
  this.curve = curve;
  this.type = type;
  this.precomputed = null;
}
BaseCurve.BasePoint = BasePoint;

BasePoint.prototype.eq = function eq(/*other*/) {
  throw new Error('Not implemented');
};

BasePoint.prototype.validate = function validate() {
  return this.curve.validate(this);
};

BaseCurve.prototype.decodePoint = function decodePoint(bytes, enc) {
  bytes = utils_1$1.toArray(bytes, enc);

  var len = this.p.byteLength();

  // uncompressed, hybrid-odd, hybrid-even
  if ((bytes[0] === 0x04 || bytes[0] === 0x06 || bytes[0] === 0x07) &&
      bytes.length - 1 === 2 * len) {
    if (bytes[0] === 0x06)
      assert$1(bytes[bytes.length - 1] % 2 === 0);
    else if (bytes[0] === 0x07)
      assert$1(bytes[bytes.length - 1] % 2 === 1);

    var res =  this.point(bytes.slice(1, 1 + len),
      bytes.slice(1 + len, 1 + 2 * len));

    return res;
  } else if ((bytes[0] === 0x02 || bytes[0] === 0x03) &&
              bytes.length - 1 === len) {
    return this.pointFromX(bytes.slice(1, 1 + len), bytes[0] === 0x03);
  }
  throw new Error('Unknown point format');
};

BasePoint.prototype.encodeCompressed = function encodeCompressed(enc) {
  return this.encode(enc, true);
};

BasePoint.prototype._encode = function _encode(compact) {
  var len = this.curve.p.byteLength();
  var x = this.getX().toArray('be', len);

  if (compact)
    return [ this.getY().isEven() ? 0x02 : 0x03 ].concat(x);

  return [ 0x04 ].concat(x, this.getY().toArray('be', len));
};

BasePoint.prototype.encode = function encode(enc, compact) {
  return utils_1$1.encode(this._encode(compact), enc);
};

BasePoint.prototype.precompute = function precompute(power) {
  if (this.precomputed)
    return this;

  var precomputed = {
    doubles: null,
    naf: null,
    beta: null,
  };
  precomputed.naf = this._getNAFPoints(8);
  precomputed.doubles = this._getDoubles(4, power);
  precomputed.beta = this._getBeta();
  this.precomputed = precomputed;

  return this;
};

BasePoint.prototype._hasDoubles = function _hasDoubles(k) {
  if (!this.precomputed)
    return false;

  var doubles = this.precomputed.doubles;
  if (!doubles)
    return false;

  return doubles.points.length >= Math.ceil((k.bitLength() + 1) / doubles.step);
};

BasePoint.prototype._getDoubles = function _getDoubles(step, power) {
  if (this.precomputed && this.precomputed.doubles)
    return this.precomputed.doubles;

  var doubles = [ this ];
  var acc = this;
  for (var i = 0; i < power; i += step) {
    for (var j = 0; j < step; j++)
      acc = acc.dbl();
    doubles.push(acc);
  }
  return {
    step: step,
    points: doubles,
  };
};

BasePoint.prototype._getNAFPoints = function _getNAFPoints(wnd) {
  if (this.precomputed && this.precomputed.naf)
    return this.precomputed.naf;

  var res = [ this ];
  var max = (1 << wnd) - 1;
  var dbl = max === 1 ? null : this.dbl();
  for (var i = 1; i < max; i++)
    res[i] = res[i - 1].add(dbl);
  return {
    wnd: wnd,
    points: res,
  };
};

BasePoint.prototype._getBeta = function _getBeta() {
  return null;
};

BasePoint.prototype.dblp = function dblp(k) {
  var r = this;
  for (var i = 0; i < k; i++)
    r = r.dbl();
  return r;
};

var inherits_browser = createCommonjsModule(function (module) {
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    if (superCtor) {
      ctor.super_ = superCtor;
      ctor.prototype = Object.create(superCtor.prototype, {
        constructor: {
          value: ctor,
          enumerable: false,
          writable: true,
          configurable: true
        }
      });
    }
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    if (superCtor) {
      ctor.super_ = superCtor;
      var TempCtor = function () {};
      TempCtor.prototype = superCtor.prototype;
      ctor.prototype = new TempCtor();
      ctor.prototype.constructor = ctor;
    }
  };
}
});

'use strict';






var assert$2 = utils_1$1.assert;

function ShortCurve(conf) {
  base.call(this, 'short', conf);

  this.a = new (bn_default())(conf.a, 16).toRed(this.red);
  this.b = new (bn_default())(conf.b, 16).toRed(this.red);
  this.tinv = this.two.redInvm();

  this.zeroA = this.a.fromRed().cmpn(0) === 0;
  this.threeA = this.a.fromRed().sub(this.p).cmpn(-3) === 0;

  // If the curve is endomorphic, precalculate beta and lambda
  this.endo = this._getEndomorphism(conf);
  this._endoWnafT1 = new Array(4);
  this._endoWnafT2 = new Array(4);
}
inherits_browser(ShortCurve, base);
var short_1 = ShortCurve;

ShortCurve.prototype._getEndomorphism = function _getEndomorphism(conf) {
  // No efficient endomorphism
  if (!this.zeroA || !this.g || !this.n || this.p.modn(3) !== 1)
    return;

  // Compute beta and lambda, that lambda * P = (beta * Px; Py)
  var beta;
  var lambda;
  if (conf.beta) {
    beta = new (bn_default())(conf.beta, 16).toRed(this.red);
  } else {
    var betas = this._getEndoRoots(this.p);
    // Choose the smallest beta
    beta = betas[0].cmp(betas[1]) < 0 ? betas[0] : betas[1];
    beta = beta.toRed(this.red);
  }
  if (conf.lambda) {
    lambda = new (bn_default())(conf.lambda, 16);
  } else {
    // Choose the lambda that is matching selected beta
    var lambdas = this._getEndoRoots(this.n);
    if (this.g.mul(lambdas[0]).x.cmp(this.g.x.redMul(beta)) === 0) {
      lambda = lambdas[0];
    } else {
      lambda = lambdas[1];
      assert$2(this.g.mul(lambda).x.cmp(this.g.x.redMul(beta)) === 0);
    }
  }

  // Get basis vectors, used for balanced length-two representation
  var basis;
  if (conf.basis) {
    basis = conf.basis.map(function(vec) {
      return {
        a: new (bn_default())(vec.a, 16),
        b: new (bn_default())(vec.b, 16),
      };
    });
  } else {
    basis = this._getEndoBasis(lambda);
  }

  return {
    beta: beta,
    lambda: lambda,
    basis: basis,
  };
};

ShortCurve.prototype._getEndoRoots = function _getEndoRoots(num) {
  // Find roots of for x^2 + x + 1 in F
  // Root = (-1 +- Sqrt(-3)) / 2
  //
  var red = num === this.p ? this.red : bn_default().mont(num);
  var tinv = new (bn_default())(2).toRed(red).redInvm();
  var ntinv = tinv.redNeg();

  var s = new (bn_default())(3).toRed(red).redNeg().redSqrt().redMul(tinv);

  var l1 = ntinv.redAdd(s).fromRed();
  var l2 = ntinv.redSub(s).fromRed();
  return [ l1, l2 ];
};

ShortCurve.prototype._getEndoBasis = function _getEndoBasis(lambda) {
  // aprxSqrt >= sqrt(this.n)
  var aprxSqrt = this.n.ushrn(Math.floor(this.n.bitLength() / 2));

  // 3.74
  // Run EGCD, until r(L + 1) < aprxSqrt
  var u = lambda;
  var v = this.n.clone();
  var x1 = new (bn_default())(1);
  var y1 = new (bn_default())(0);
  var x2 = new (bn_default())(0);
  var y2 = new (bn_default())(1);

  // NOTE: all vectors are roots of: a + b * lambda = 0 (mod n)
  var a0;
  var b0;
  // First vector
  var a1;
  var b1;
  // Second vector
  var a2;
  var b2;

  var prevR;
  var i = 0;
  var r;
  var x;
  while (u.cmpn(0) !== 0) {
    var q = v.div(u);
    r = v.sub(q.mul(u));
    x = x2.sub(q.mul(x1));
    var y = y2.sub(q.mul(y1));

    if (!a1 && r.cmp(aprxSqrt) < 0) {
      a0 = prevR.neg();
      b0 = x1;
      a1 = r.neg();
      b1 = x;
    } else if (a1 && ++i === 2) {
      break;
    }
    prevR = r;

    v = u;
    u = r;
    x2 = x1;
    x1 = x;
    y2 = y1;
    y1 = y;
  }
  a2 = r.neg();
  b2 = x;

  var len1 = a1.sqr().add(b1.sqr());
  var len2 = a2.sqr().add(b2.sqr());
  if (len2.cmp(len1) >= 0) {
    a2 = a0;
    b2 = b0;
  }

  // Normalize signs
  if (a1.negative) {
    a1 = a1.neg();
    b1 = b1.neg();
  }
  if (a2.negative) {
    a2 = a2.neg();
    b2 = b2.neg();
  }

  return [
    { a: a1, b: b1 },
    { a: a2, b: b2 },
  ];
};

ShortCurve.prototype._endoSplit = function _endoSplit(k) {
  var basis = this.endo.basis;
  var v1 = basis[0];
  var v2 = basis[1];

  var c1 = v2.b.mul(k).divRound(this.n);
  var c2 = v1.b.neg().mul(k).divRound(this.n);

  var p1 = c1.mul(v1.a);
  var p2 = c2.mul(v2.a);
  var q1 = c1.mul(v1.b);
  var q2 = c2.mul(v2.b);

  // Calculate answer
  var k1 = k.sub(p1).sub(p2);
  var k2 = q1.add(q2).neg();
  return { k1: k1, k2: k2 };
};

ShortCurve.prototype.pointFromX = function pointFromX(x, odd) {
  x = new (bn_default())(x, 16);
  if (!x.red)
    x = x.toRed(this.red);

  var y2 = x.redSqr().redMul(x).redIAdd(x.redMul(this.a)).redIAdd(this.b);
  var y = y2.redSqrt();
  if (y.redSqr().redSub(y2).cmp(this.zero) !== 0)
    throw new Error('invalid point');

  // XXX Is there any way to tell if the number is odd without converting it
  // to non-red form?
  var isOdd = y.fromRed().isOdd();
  if (odd && !isOdd || !odd && isOdd)
    y = y.redNeg();

  return this.point(x, y);
};

ShortCurve.prototype.validate = function validate(point) {
  if (point.inf)
    return true;

  var x = point.x;
  var y = point.y;

  var ax = this.a.redMul(x);
  var rhs = x.redSqr().redMul(x).redIAdd(ax).redIAdd(this.b);
  return y.redSqr().redISub(rhs).cmpn(0) === 0;
};

ShortCurve.prototype._endoWnafMulAdd =
    function _endoWnafMulAdd(points, coeffs, jacobianResult) {
      var npoints = this._endoWnafT1;
      var ncoeffs = this._endoWnafT2;
      for (var i = 0; i < points.length; i++) {
        var split = this._endoSplit(coeffs[i]);
        var p = points[i];
        var beta = p._getBeta();

        if (split.k1.negative) {
          split.k1.ineg();
          p = p.neg(true);
        }
        if (split.k2.negative) {
          split.k2.ineg();
          beta = beta.neg(true);
        }

        npoints[i * 2] = p;
        npoints[i * 2 + 1] = beta;
        ncoeffs[i * 2] = split.k1;
        ncoeffs[i * 2 + 1] = split.k2;
      }
      var res = this._wnafMulAdd(1, npoints, ncoeffs, i * 2, jacobianResult);

      // Clean-up references to points and coefficients
      for (var j = 0; j < i * 2; j++) {
        npoints[j] = null;
        ncoeffs[j] = null;
      }
      return res;
    };

function Point(curve, x, y, isRed) {
  base.BasePoint.call(this, curve, 'affine');
  if (x === null && y === null) {
    this.x = null;
    this.y = null;
    this.inf = true;
  } else {
    this.x = new (bn_default())(x, 16);
    this.y = new (bn_default())(y, 16);
    // Force redgomery representation when loading from JSON
    if (isRed) {
      this.x.forceRed(this.curve.red);
      this.y.forceRed(this.curve.red);
    }
    if (!this.x.red)
      this.x = this.x.toRed(this.curve.red);
    if (!this.y.red)
      this.y = this.y.toRed(this.curve.red);
    this.inf = false;
  }
}
inherits_browser(Point, base.BasePoint);

ShortCurve.prototype.point = function point(x, y, isRed) {
  return new Point(this, x, y, isRed);
};

ShortCurve.prototype.pointFromJSON = function pointFromJSON(obj, red) {
  return Point.fromJSON(this, obj, red);
};

Point.prototype._getBeta = function _getBeta() {
  if (!this.curve.endo)
    return;

  var pre = this.precomputed;
  if (pre && pre.beta)
    return pre.beta;

  var beta = this.curve.point(this.x.redMul(this.curve.endo.beta), this.y);
  if (pre) {
    var curve = this.curve;
    var endoMul = function(p) {
      return curve.point(p.x.redMul(curve.endo.beta), p.y);
    };
    pre.beta = beta;
    beta.precomputed = {
      beta: null,
      naf: pre.naf && {
        wnd: pre.naf.wnd,
        points: pre.naf.points.map(endoMul),
      },
      doubles: pre.doubles && {
        step: pre.doubles.step,
        points: pre.doubles.points.map(endoMul),
      },
    };
  }
  return beta;
};

Point.prototype.toJSON = function toJSON() {
  if (!this.precomputed)
    return [ this.x, this.y ];

  return [ this.x, this.y, this.precomputed && {
    doubles: this.precomputed.doubles && {
      step: this.precomputed.doubles.step,
      points: this.precomputed.doubles.points.slice(1),
    },
    naf: this.precomputed.naf && {
      wnd: this.precomputed.naf.wnd,
      points: this.precomputed.naf.points.slice(1),
    },
  } ];
};

Point.fromJSON = function fromJSON(curve, obj, red) {
  if (typeof obj === 'string')
    obj = JSON.parse(obj);
  var res = curve.point(obj[0], obj[1], red);
  if (!obj[2])
    return res;

  function obj2point(obj) {
    return curve.point(obj[0], obj[1], red);
  }

  var pre = obj[2];
  res.precomputed = {
    beta: null,
    doubles: pre.doubles && {
      step: pre.doubles.step,
      points: [ res ].concat(pre.doubles.points.map(obj2point)),
    },
    naf: pre.naf && {
      wnd: pre.naf.wnd,
      points: [ res ].concat(pre.naf.points.map(obj2point)),
    },
  };
  return res;
};

Point.prototype.inspect = function inspect() {
  if (this.isInfinity())
    return '<EC Point Infinity>';
  return '<EC Point x: ' + this.x.fromRed().toString(16, 2) +
      ' y: ' + this.y.fromRed().toString(16, 2) + '>';
};

Point.prototype.isInfinity = function isInfinity() {
  return this.inf;
};

Point.prototype.add = function add(p) {
  // O + P = P
  if (this.inf)
    return p;

  // P + O = P
  if (p.inf)
    return this;

  // P + P = 2P
  if (this.eq(p))
    return this.dbl();

  // P + (-P) = O
  if (this.neg().eq(p))
    return this.curve.point(null, null);

  // P + Q = O
  if (this.x.cmp(p.x) === 0)
    return this.curve.point(null, null);

  var c = this.y.redSub(p.y);
  if (c.cmpn(0) !== 0)
    c = c.redMul(this.x.redSub(p.x).redInvm());
  var nx = c.redSqr().redISub(this.x).redISub(p.x);
  var ny = c.redMul(this.x.redSub(nx)).redISub(this.y);
  return this.curve.point(nx, ny);
};

Point.prototype.dbl = function dbl() {
  if (this.inf)
    return this;

  // 2P = O
  var ys1 = this.y.redAdd(this.y);
  if (ys1.cmpn(0) === 0)
    return this.curve.point(null, null);

  var a = this.curve.a;

  var x2 = this.x.redSqr();
  var dyinv = ys1.redInvm();
  var c = x2.redAdd(x2).redIAdd(x2).redIAdd(a).redMul(dyinv);

  var nx = c.redSqr().redISub(this.x.redAdd(this.x));
  var ny = c.redMul(this.x.redSub(nx)).redISub(this.y);
  return this.curve.point(nx, ny);
};

Point.prototype.getX = function getX() {
  return this.x.fromRed();
};

Point.prototype.getY = function getY() {
  return this.y.fromRed();
};

Point.prototype.mul = function mul(k) {
  k = new (bn_default())(k, 16);
  if (this.isInfinity())
    return this;
  else if (this._hasDoubles(k))
    return this.curve._fixedNafMul(this, k);
  else if (this.curve.endo)
    return this.curve._endoWnafMulAdd([ this ], [ k ]);
  else
    return this.curve._wnafMul(this, k);
};

Point.prototype.mulAdd = function mulAdd(k1, p2, k2) {
  var points = [ this, p2 ];
  var coeffs = [ k1, k2 ];
  if (this.curve.endo)
    return this.curve._endoWnafMulAdd(points, coeffs);
  else
    return this.curve._wnafMulAdd(1, points, coeffs, 2);
};

Point.prototype.jmulAdd = function jmulAdd(k1, p2, k2) {
  var points = [ this, p2 ];
  var coeffs = [ k1, k2 ];
  if (this.curve.endo)
    return this.curve._endoWnafMulAdd(points, coeffs, true);
  else
    return this.curve._wnafMulAdd(1, points, coeffs, 2, true);
};

Point.prototype.eq = function eq(p) {
  return this === p ||
         this.inf === p.inf &&
             (this.inf || this.x.cmp(p.x) === 0 && this.y.cmp(p.y) === 0);
};

Point.prototype.neg = function neg(_precompute) {
  if (this.inf)
    return this;

  var res = this.curve.point(this.x, this.y.redNeg());
  if (_precompute && this.precomputed) {
    var pre = this.precomputed;
    var negate = function(p) {
      return p.neg();
    };
    res.precomputed = {
      naf: pre.naf && {
        wnd: pre.naf.wnd,
        points: pre.naf.points.map(negate),
      },
      doubles: pre.doubles && {
        step: pre.doubles.step,
        points: pre.doubles.points.map(negate),
      },
    };
  }
  return res;
};

Point.prototype.toJ = function toJ() {
  if (this.inf)
    return this.curve.jpoint(null, null, null);

  var res = this.curve.jpoint(this.x, this.y, this.curve.one);
  return res;
};

function JPoint(curve, x, y, z) {
  base.BasePoint.call(this, curve, 'jacobian');
  if (x === null && y === null && z === null) {
    this.x = this.curve.one;
    this.y = this.curve.one;
    this.z = new (bn_default())(0);
  } else {
    this.x = new (bn_default())(x, 16);
    this.y = new (bn_default())(y, 16);
    this.z = new (bn_default())(z, 16);
  }
  if (!this.x.red)
    this.x = this.x.toRed(this.curve.red);
  if (!this.y.red)
    this.y = this.y.toRed(this.curve.red);
  if (!this.z.red)
    this.z = this.z.toRed(this.curve.red);

  this.zOne = this.z === this.curve.one;
}
inherits_browser(JPoint, base.BasePoint);

ShortCurve.prototype.jpoint = function jpoint(x, y, z) {
  return new JPoint(this, x, y, z);
};

JPoint.prototype.toP = function toP() {
  if (this.isInfinity())
    return this.curve.point(null, null);

  var zinv = this.z.redInvm();
  var zinv2 = zinv.redSqr();
  var ax = this.x.redMul(zinv2);
  var ay = this.y.redMul(zinv2).redMul(zinv);

  return this.curve.point(ax, ay);
};

JPoint.prototype.neg = function neg() {
  return this.curve.jpoint(this.x, this.y.redNeg(), this.z);
};

JPoint.prototype.add = function add(p) {
  // O + P = P
  if (this.isInfinity())
    return p;

  // P + O = P
  if (p.isInfinity())
    return this;

  // 12M + 4S + 7A
  var pz2 = p.z.redSqr();
  var z2 = this.z.redSqr();
  var u1 = this.x.redMul(pz2);
  var u2 = p.x.redMul(z2);
  var s1 = this.y.redMul(pz2.redMul(p.z));
  var s2 = p.y.redMul(z2.redMul(this.z));

  var h = u1.redSub(u2);
  var r = s1.redSub(s2);
  if (h.cmpn(0) === 0) {
    if (r.cmpn(0) !== 0)
      return this.curve.jpoint(null, null, null);
    else
      return this.dbl();
  }

  var h2 = h.redSqr();
  var h3 = h2.redMul(h);
  var v = u1.redMul(h2);

  var nx = r.redSqr().redIAdd(h3).redISub(v).redISub(v);
  var ny = r.redMul(v.redISub(nx)).redISub(s1.redMul(h3));
  var nz = this.z.redMul(p.z).redMul(h);

  return this.curve.jpoint(nx, ny, nz);
};

JPoint.prototype.mixedAdd = function mixedAdd(p) {
  // O + P = P
  if (this.isInfinity())
    return p.toJ();

  // P + O = P
  if (p.isInfinity())
    return this;

  // 8M + 3S + 7A
  var z2 = this.z.redSqr();
  var u1 = this.x;
  var u2 = p.x.redMul(z2);
  var s1 = this.y;
  var s2 = p.y.redMul(z2).redMul(this.z);

  var h = u1.redSub(u2);
  var r = s1.redSub(s2);
  if (h.cmpn(0) === 0) {
    if (r.cmpn(0) !== 0)
      return this.curve.jpoint(null, null, null);
    else
      return this.dbl();
  }

  var h2 = h.redSqr();
  var h3 = h2.redMul(h);
  var v = u1.redMul(h2);

  var nx = r.redSqr().redIAdd(h3).redISub(v).redISub(v);
  var ny = r.redMul(v.redISub(nx)).redISub(s1.redMul(h3));
  var nz = this.z.redMul(h);

  return this.curve.jpoint(nx, ny, nz);
};

JPoint.prototype.dblp = function dblp(pow) {
  if (pow === 0)
    return this;
  if (this.isInfinity())
    return this;
  if (!pow)
    return this.dbl();

  var i;
  if (this.curve.zeroA || this.curve.threeA) {
    var r = this;
    for (i = 0; i < pow; i++)
      r = r.dbl();
    return r;
  }

  // 1M + 2S + 1A + N * (4S + 5M + 8A)
  // N = 1 => 6M + 6S + 9A
  var a = this.curve.a;
  var tinv = this.curve.tinv;

  var jx = this.x;
  var jy = this.y;
  var jz = this.z;
  var jz4 = jz.redSqr().redSqr();

  // Reuse results
  var jyd = jy.redAdd(jy);
  for (i = 0; i < pow; i++) {
    var jx2 = jx.redSqr();
    var jyd2 = jyd.redSqr();
    var jyd4 = jyd2.redSqr();
    var c = jx2.redAdd(jx2).redIAdd(jx2).redIAdd(a.redMul(jz4));

    var t1 = jx.redMul(jyd2);
    var nx = c.redSqr().redISub(t1.redAdd(t1));
    var t2 = t1.redISub(nx);
    var dny = c.redMul(t2);
    dny = dny.redIAdd(dny).redISub(jyd4);
    var nz = jyd.redMul(jz);
    if (i + 1 < pow)
      jz4 = jz4.redMul(jyd4);

    jx = nx;
    jz = nz;
    jyd = dny;
  }

  return this.curve.jpoint(jx, jyd.redMul(tinv), jz);
};

JPoint.prototype.dbl = function dbl() {
  if (this.isInfinity())
    return this;

  if (this.curve.zeroA)
    return this._zeroDbl();
  else if (this.curve.threeA)
    return this._threeDbl();
  else
    return this._dbl();
};

JPoint.prototype._zeroDbl = function _zeroDbl() {
  var nx;
  var ny;
  var nz;
  // Z = 1
  if (this.zOne) {
    // hyperelliptic.org/EFD/g1p/auto-shortw-jacobian-0.html
    //     #doubling-mdbl-2007-bl
    // 1M + 5S + 14A

    // XX = X1^2
    var xx = this.x.redSqr();
    // YY = Y1^2
    var yy = this.y.redSqr();
    // YYYY = YY^2
    var yyyy = yy.redSqr();
    // S = 2 * ((X1 + YY)^2 - XX - YYYY)
    var s = this.x.redAdd(yy).redSqr().redISub(xx).redISub(yyyy);
    s = s.redIAdd(s);
    // M = 3 * XX + a; a = 0
    var m = xx.redAdd(xx).redIAdd(xx);
    // T = M ^ 2 - 2*S
    var t = m.redSqr().redISub(s).redISub(s);

    // 8 * YYYY
    var yyyy8 = yyyy.redIAdd(yyyy);
    yyyy8 = yyyy8.redIAdd(yyyy8);
    yyyy8 = yyyy8.redIAdd(yyyy8);

    // X3 = T
    nx = t;
    // Y3 = M * (S - T) - 8 * YYYY
    ny = m.redMul(s.redISub(t)).redISub(yyyy8);
    // Z3 = 2*Y1
    nz = this.y.redAdd(this.y);
  } else {
    // hyperelliptic.org/EFD/g1p/auto-shortw-jacobian-0.html
    //     #doubling-dbl-2009-l
    // 2M + 5S + 13A

    // A = X1^2
    var a = this.x.redSqr();
    // B = Y1^2
    var b = this.y.redSqr();
    // C = B^2
    var c = b.redSqr();
    // D = 2 * ((X1 + B)^2 - A - C)
    var d = this.x.redAdd(b).redSqr().redISub(a).redISub(c);
    d = d.redIAdd(d);
    // E = 3 * A
    var e = a.redAdd(a).redIAdd(a);
    // F = E^2
    var f = e.redSqr();

    // 8 * C
    var c8 = c.redIAdd(c);
    c8 = c8.redIAdd(c8);
    c8 = c8.redIAdd(c8);

    // X3 = F - 2 * D
    nx = f.redISub(d).redISub(d);
    // Y3 = E * (D - X3) - 8 * C
    ny = e.redMul(d.redISub(nx)).redISub(c8);
    // Z3 = 2 * Y1 * Z1
    nz = this.y.redMul(this.z);
    nz = nz.redIAdd(nz);
  }

  return this.curve.jpoint(nx, ny, nz);
};

JPoint.prototype._threeDbl = function _threeDbl() {
  var nx;
  var ny;
  var nz;
  // Z = 1
  if (this.zOne) {
    // hyperelliptic.org/EFD/g1p/auto-shortw-jacobian-3.html
    //     #doubling-mdbl-2007-bl
    // 1M + 5S + 15A

    // XX = X1^2
    var xx = this.x.redSqr();
    // YY = Y1^2
    var yy = this.y.redSqr();
    // YYYY = YY^2
    var yyyy = yy.redSqr();
    // S = 2 * ((X1 + YY)^2 - XX - YYYY)
    var s = this.x.redAdd(yy).redSqr().redISub(xx).redISub(yyyy);
    s = s.redIAdd(s);
    // M = 3 * XX + a
    var m = xx.redAdd(xx).redIAdd(xx).redIAdd(this.curve.a);
    // T = M^2 - 2 * S
    var t = m.redSqr().redISub(s).redISub(s);
    // X3 = T
    nx = t;
    // Y3 = M * (S - T) - 8 * YYYY
    var yyyy8 = yyyy.redIAdd(yyyy);
    yyyy8 = yyyy8.redIAdd(yyyy8);
    yyyy8 = yyyy8.redIAdd(yyyy8);
    ny = m.redMul(s.redISub(t)).redISub(yyyy8);
    // Z3 = 2 * Y1
    nz = this.y.redAdd(this.y);
  } else {
    // hyperelliptic.org/EFD/g1p/auto-shortw-jacobian-3.html#doubling-dbl-2001-b
    // 3M + 5S

    // delta = Z1^2
    var delta = this.z.redSqr();
    // gamma = Y1^2
    var gamma = this.y.redSqr();
    // beta = X1 * gamma
    var beta = this.x.redMul(gamma);
    // alpha = 3 * (X1 - delta) * (X1 + delta)
    var alpha = this.x.redSub(delta).redMul(this.x.redAdd(delta));
    alpha = alpha.redAdd(alpha).redIAdd(alpha);
    // X3 = alpha^2 - 8 * beta
    var beta4 = beta.redIAdd(beta);
    beta4 = beta4.redIAdd(beta4);
    var beta8 = beta4.redAdd(beta4);
    nx = alpha.redSqr().redISub(beta8);
    // Z3 = (Y1 + Z1)^2 - gamma - delta
    nz = this.y.redAdd(this.z).redSqr().redISub(gamma).redISub(delta);
    // Y3 = alpha * (4 * beta - X3) - 8 * gamma^2
    var ggamma8 = gamma.redSqr();
    ggamma8 = ggamma8.redIAdd(ggamma8);
    ggamma8 = ggamma8.redIAdd(ggamma8);
    ggamma8 = ggamma8.redIAdd(ggamma8);
    ny = alpha.redMul(beta4.redISub(nx)).redISub(ggamma8);
  }

  return this.curve.jpoint(nx, ny, nz);
};

JPoint.prototype._dbl = function _dbl() {
  var a = this.curve.a;

  // 4M + 6S + 10A
  var jx = this.x;
  var jy = this.y;
  var jz = this.z;
  var jz4 = jz.redSqr().redSqr();

  var jx2 = jx.redSqr();
  var jy2 = jy.redSqr();

  var c = jx2.redAdd(jx2).redIAdd(jx2).redIAdd(a.redMul(jz4));

  var jxd4 = jx.redAdd(jx);
  jxd4 = jxd4.redIAdd(jxd4);
  var t1 = jxd4.redMul(jy2);
  var nx = c.redSqr().redISub(t1.redAdd(t1));
  var t2 = t1.redISub(nx);

  var jyd8 = jy2.redSqr();
  jyd8 = jyd8.redIAdd(jyd8);
  jyd8 = jyd8.redIAdd(jyd8);
  jyd8 = jyd8.redIAdd(jyd8);
  var ny = c.redMul(t2).redISub(jyd8);
  var nz = jy.redAdd(jy).redMul(jz);

  return this.curve.jpoint(nx, ny, nz);
};

JPoint.prototype.trpl = function trpl() {
  if (!this.curve.zeroA)
    return this.dbl().add(this);

  // hyperelliptic.org/EFD/g1p/auto-shortw-jacobian-0.html#tripling-tpl-2007-bl
  // 5M + 10S + ...

  // XX = X1^2
  var xx = this.x.redSqr();
  // YY = Y1^2
  var yy = this.y.redSqr();
  // ZZ = Z1^2
  var zz = this.z.redSqr();
  // YYYY = YY^2
  var yyyy = yy.redSqr();
  // M = 3 * XX + a * ZZ2; a = 0
  var m = xx.redAdd(xx).redIAdd(xx);
  // MM = M^2
  var mm = m.redSqr();
  // E = 6 * ((X1 + YY)^2 - XX - YYYY) - MM
  var e = this.x.redAdd(yy).redSqr().redISub(xx).redISub(yyyy);
  e = e.redIAdd(e);
  e = e.redAdd(e).redIAdd(e);
  e = e.redISub(mm);
  // EE = E^2
  var ee = e.redSqr();
  // T = 16*YYYY
  var t = yyyy.redIAdd(yyyy);
  t = t.redIAdd(t);
  t = t.redIAdd(t);
  t = t.redIAdd(t);
  // U = (M + E)^2 - MM - EE - T
  var u = m.redIAdd(e).redSqr().redISub(mm).redISub(ee).redISub(t);
  // X3 = 4 * (X1 * EE - 4 * YY * U)
  var yyu4 = yy.redMul(u);
  yyu4 = yyu4.redIAdd(yyu4);
  yyu4 = yyu4.redIAdd(yyu4);
  var nx = this.x.redMul(ee).redISub(yyu4);
  nx = nx.redIAdd(nx);
  nx = nx.redIAdd(nx);
  // Y3 = 8 * Y1 * (U * (T - U) - E * EE)
  var ny = this.y.redMul(u.redMul(t.redISub(u)).redISub(e.redMul(ee)));
  ny = ny.redIAdd(ny);
  ny = ny.redIAdd(ny);
  ny = ny.redIAdd(ny);
  // Z3 = (Z1 + E)^2 - ZZ - EE
  var nz = this.z.redAdd(e).redSqr().redISub(zz).redISub(ee);

  return this.curve.jpoint(nx, ny, nz);
};

JPoint.prototype.mul = function mul(k, kbase) {
  k = new (bn_default())(k, kbase);

  return this.curve._wnafMul(this, k);
};

JPoint.prototype.eq = function eq(p) {
  if (p.type === 'affine')
    return this.eq(p.toJ());

  if (this === p)
    return true;

  // x1 * z2^2 == x2 * z1^2
  var z2 = this.z.redSqr();
  var pz2 = p.z.redSqr();
  if (this.x.redMul(pz2).redISub(p.x.redMul(z2)).cmpn(0) !== 0)
    return false;

  // y1 * z2^3 == y2 * z1^3
  var z3 = z2.redMul(this.z);
  var pz3 = pz2.redMul(p.z);
  return this.y.redMul(pz3).redISub(p.y.redMul(z3)).cmpn(0) === 0;
};

JPoint.prototype.eqXToP = function eqXToP(x) {
  var zs = this.z.redSqr();
  var rx = x.toRed(this.curve.red).redMul(zs);
  if (this.x.cmp(rx) === 0)
    return true;

  var xc = x.clone();
  var t = this.curve.redN.redMul(zs);
  for (;;) {
    xc.iadd(this.curve.n);
    if (xc.cmp(this.curve.p) >= 0)
      return false;

    rx.redIAdd(t);
    if (this.x.cmp(rx) === 0)
      return true;
  }
};

JPoint.prototype.inspect = function inspect() {
  if (this.isInfinity())
    return '<EC JPoint Infinity>';
  return '<EC JPoint x: ' + this.x.toString(16, 2) +
      ' y: ' + this.y.toString(16, 2) +
      ' z: ' + this.z.toString(16, 2) + '>';
};

JPoint.prototype.isInfinity = function isInfinity() {
  // XXX This code assumes that zero is always zero in red
  return this.z.cmpn(0) === 0;
};

var curve_1 = createCommonjsModule(function (module, exports) {
'use strict';

var curve = exports;

curve.base = base;
curve.short = short_1;
curve.mont = /*RicMoo:ethers:require(./mont)*/(null);
curve.edwards = /*RicMoo:ethers:require(./edwards)*/(null);
});

var curves_1 = createCommonjsModule(function (module, exports) {
'use strict';

var curves = exports;





var assert = utils_1$1.assert;

function PresetCurve(options) {
  if (options.type === 'short')
    this.curve = new curve_1.short(options);
  else if (options.type === 'edwards')
    this.curve = new curve_1.edwards(options);
  else
    this.curve = new curve_1.mont(options);
  this.g = this.curve.g;
  this.n = this.curve.n;
  this.hash = options.hash;

  assert(this.g.validate(), 'Invalid curve');
  assert(this.g.mul(this.n).isInfinity(), 'Invalid curve, G*N != O');
}
curves.PresetCurve = PresetCurve;

function defineCurve(name, options) {
  Object.defineProperty(curves, name, {
    configurable: true,
    enumerable: true,
    get: function() {
      var curve = new PresetCurve(options);
      Object.defineProperty(curves, name, {
        configurable: true,
        enumerable: true,
        value: curve,
      });
      return curve;
    },
  });
}

defineCurve('p192', {
  type: 'short',
  prime: 'p192',
  p: 'ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff',
  a: 'ffffffff ffffffff ffffffff fffffffe ffffffff fffffffc',
  b: '64210519 e59c80e7 0fa7e9ab 72243049 feb8deec c146b9b1',
  n: 'ffffffff ffffffff ffffffff 99def836 146bc9b1 b4d22831',
  hash: (hash_default()).sha256,
  gRed: false,
  g: [
    '188da80e b03090f6 7cbf20eb 43a18800 f4ff0afd 82ff1012',
    '07192b95 ffc8da78 631011ed 6b24cdd5 73f977a1 1e794811',
  ],
});

defineCurve('p224', {
  type: 'short',
  prime: 'p224',
  p: 'ffffffff ffffffff ffffffff ffffffff 00000000 00000000 00000001',
  a: 'ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff fffffffe',
  b: 'b4050a85 0c04b3ab f5413256 5044b0b7 d7bfd8ba 270b3943 2355ffb4',
  n: 'ffffffff ffffffff ffffffff ffff16a2 e0b8f03e 13dd2945 5c5c2a3d',
  hash: (hash_default()).sha256,
  gRed: false,
  g: [
    'b70e0cbd 6bb4bf7f 321390b9 4a03c1d3 56c21122 343280d6 115c1d21',
    'bd376388 b5f723fb 4c22dfe6 cd4375a0 5a074764 44d58199 85007e34',
  ],
});

defineCurve('p256', {
  type: 'short',
  prime: null,
  p: 'ffffffff 00000001 00000000 00000000 00000000 ffffffff ffffffff ffffffff',
  a: 'ffffffff 00000001 00000000 00000000 00000000 ffffffff ffffffff fffffffc',
  b: '5ac635d8 aa3a93e7 b3ebbd55 769886bc 651d06b0 cc53b0f6 3bce3c3e 27d2604b',
  n: 'ffffffff 00000000 ffffffff ffffffff bce6faad a7179e84 f3b9cac2 fc632551',
  hash: (hash_default()).sha256,
  gRed: false,
  g: [
    '6b17d1f2 e12c4247 f8bce6e5 63a440f2 77037d81 2deb33a0 f4a13945 d898c296',
    '4fe342e2 fe1a7f9b 8ee7eb4a 7c0f9e16 2bce3357 6b315ece cbb64068 37bf51f5',
  ],
});

defineCurve('p384', {
  type: 'short',
  prime: null,
  p: 'ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ' +
     'fffffffe ffffffff 00000000 00000000 ffffffff',
  a: 'ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ' +
     'fffffffe ffffffff 00000000 00000000 fffffffc',
  b: 'b3312fa7 e23ee7e4 988e056b e3f82d19 181d9c6e fe814112 0314088f ' +
     '5013875a c656398d 8a2ed19d 2a85c8ed d3ec2aef',
  n: 'ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff c7634d81 ' +
     'f4372ddf 581a0db2 48b0a77a ecec196a ccc52973',
  hash: (hash_default()).sha384,
  gRed: false,
  g: [
    'aa87ca22 be8b0537 8eb1c71e f320ad74 6e1d3b62 8ba79b98 59f741e0 82542a38 ' +
    '5502f25d bf55296c 3a545e38 72760ab7',
    '3617de4a 96262c6f 5d9e98bf 9292dc29 f8f41dbd 289a147c e9da3113 b5f0b8c0 ' +
    '0a60b1ce 1d7e819d 7a431d7c 90ea0e5f',
  ],
});

defineCurve('p521', {
  type: 'short',
  prime: null,
  p: '000001ff ffffffff ffffffff ffffffff ffffffff ffffffff ' +
     'ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ' +
     'ffffffff ffffffff ffffffff ffffffff ffffffff',
  a: '000001ff ffffffff ffffffff ffffffff ffffffff ffffffff ' +
     'ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ' +
     'ffffffff ffffffff ffffffff ffffffff fffffffc',
  b: '00000051 953eb961 8e1c9a1f 929a21a0 b68540ee a2da725b ' +
     '99b315f3 b8b48991 8ef109e1 56193951 ec7e937b 1652c0bd ' +
     '3bb1bf07 3573df88 3d2c34f1 ef451fd4 6b503f00',
  n: '000001ff ffffffff ffffffff ffffffff ffffffff ffffffff ' +
     'ffffffff ffffffff fffffffa 51868783 bf2f966b 7fcc0148 ' +
     'f709a5d0 3bb5c9b8 899c47ae bb6fb71e 91386409',
  hash: (hash_default()).sha512,
  gRed: false,
  g: [
    '000000c6 858e06b7 0404e9cd 9e3ecb66 2395b442 9c648139 ' +
    '053fb521 f828af60 6b4d3dba a14b5e77 efe75928 fe1dc127 ' +
    'a2ffa8de 3348b3c1 856a429b f97e7e31 c2e5bd66',
    '00000118 39296a78 9a3bc004 5c8a5fb4 2c7d1bd9 98f54449 ' +
    '579b4468 17afbd17 273e662c 97ee7299 5ef42640 c550b901 ' +
    '3fad0761 353c7086 a272c240 88be9476 9fd16650',
  ],
});

defineCurve('curve25519', {
  type: 'mont',
  prime: 'p25519',
  p: '7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed',
  a: '76d06',
  b: '1',
  n: '1000000000000000 0000000000000000 14def9dea2f79cd6 5812631a5cf5d3ed',
  hash: (hash_default()).sha256,
  gRed: false,
  g: [
    '9',
  ],
});

defineCurve('ed25519', {
  type: 'edwards',
  prime: 'p25519',
  p: '7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed',
  a: '-1',
  c: '1',
  // -121665 * (121666^(-1)) (mod P)
  d: '52036cee2b6ffe73 8cc740797779e898 00700a4d4141d8ab 75eb4dca135978a3',
  n: '1000000000000000 0000000000000000 14def9dea2f79cd6 5812631a5cf5d3ed',
  hash: (hash_default()).sha256,
  gRed: false,
  g: [
    '216936d3cd6e53fec0a4e231fdd6dc5c692cc7609525a7b2c9562d608f25d51a',

    // 4/5
    '6666666666666666666666666666666666666666666666666666666666666658',
  ],
});

var pre;
try {
  pre = /*RicMoo:ethers:require(./precomputed/secp256k1)*/(null).crash();
} catch (e) {
  pre = undefined;
}

defineCurve('secp256k1', {
  type: 'short',
  prime: 'k256',
  p: 'ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe fffffc2f',
  a: '0',
  b: '7',
  n: 'ffffffff ffffffff ffffffff fffffffe baaedce6 af48a03b bfd25e8c d0364141',
  h: '1',
  hash: (hash_default()).sha256,

  // Precomputed endomorphism
  beta: '7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee',
  lambda: '5363ad4cc05c30e0a5261c028812645a122e22ea20816678df02967c1b23bd72',
  basis: [
    {
      a: '3086d221a7d46bcde86c90e49284eb15',
      b: '-e4437ed6010e88286f547fa90abfe4c3',
    },
    {
      a: '114ca50f7a8e2f3f657c1108d9d44cfd8',
      b: '3086d221a7d46bcde86c90e49284eb15',
    },
  ],

  gRed: false,
  g: [
    '79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798',
    '483ada7726a3c4655da4fbfc0e1108a8fd17b448a68554199c47d08ffb10d4b8',
    pre,
  ],
});
});

'use strict';





function HmacDRBG(options) {
  if (!(this instanceof HmacDRBG))
    return new HmacDRBG(options);
  this.hash = options.hash;
  this.predResist = !!options.predResist;

  this.outLen = this.hash.outSize;
  this.minEntropy = options.minEntropy || this.hash.hmacStrength;

  this._reseed = null;
  this.reseedInterval = null;
  this.K = null;
  this.V = null;

  var entropy = utils_1.toArray(options.entropy, options.entropyEnc || 'hex');
  var nonce = utils_1.toArray(options.nonce, options.nonceEnc || 'hex');
  var pers = utils_1.toArray(options.pers, options.persEnc || 'hex');
  minimalisticAssert(entropy.length >= (this.minEntropy / 8),
         'Not enough entropy. Minimum is: ' + this.minEntropy + ' bits');
  this._init(entropy, nonce, pers);
}
var hmacDrbg = HmacDRBG;

HmacDRBG.prototype._init = function init(entropy, nonce, pers) {
  var seed = entropy.concat(nonce).concat(pers);

  this.K = new Array(this.outLen / 8);
  this.V = new Array(this.outLen / 8);
  for (var i = 0; i < this.V.length; i++) {
    this.K[i] = 0x00;
    this.V[i] = 0x01;
  }

  this._update(seed);
  this._reseed = 1;
  this.reseedInterval = 0x1000000000000;  // 2^48
};

HmacDRBG.prototype._hmac = function hmac() {
  return new (hash_default()).hmac(this.hash, this.K);
};

HmacDRBG.prototype._update = function update(seed) {
  var kmac = this._hmac()
                 .update(this.V)
                 .update([ 0x00 ]);
  if (seed)
    kmac = kmac.update(seed);
  this.K = kmac.digest();
  this.V = this._hmac().update(this.V).digest();
  if (!seed)
    return;

  this.K = this._hmac()
               .update(this.V)
               .update([ 0x01 ])
               .update(seed)
               .digest();
  this.V = this._hmac().update(this.V).digest();
};

HmacDRBG.prototype.reseed = function reseed(entropy, entropyEnc, add, addEnc) {
  // Optional entropy enc
  if (typeof entropyEnc !== 'string') {
    addEnc = add;
    add = entropyEnc;
    entropyEnc = null;
  }

  entropy = utils_1.toArray(entropy, entropyEnc);
  add = utils_1.toArray(add, addEnc);

  minimalisticAssert(entropy.length >= (this.minEntropy / 8),
         'Not enough entropy. Minimum is: ' + this.minEntropy + ' bits');

  this._update(entropy.concat(add || []));
  this._reseed = 1;
};

HmacDRBG.prototype.generate = function generate(len, enc, add, addEnc) {
  if (this._reseed > this.reseedInterval)
    throw new Error('Reseed is required');

  // Optional encoding
  if (typeof enc !== 'string') {
    addEnc = add;
    add = enc;
    enc = null;
  }

  // Optional additional data
  if (add) {
    add = utils_1.toArray(add, addEnc || 'hex');
    this._update(add);
  }

  var temp = [];
  while (temp.length < len) {
    this.V = this._hmac().update(this.V).digest();
    temp = temp.concat(this.V);
  }

  var res = temp.slice(0, len);
  this._update(add);
  this._reseed++;
  return utils_1.encode(res, enc);
};

'use strict';



var assert$3 = utils_1$1.assert;

function KeyPair(ec, options) {
  this.ec = ec;
  this.priv = null;
  this.pub = null;

  // KeyPair(ec, { priv: ..., pub: ... })
  if (options.priv)
    this._importPrivate(options.priv, options.privEnc);
  if (options.pub)
    this._importPublic(options.pub, options.pubEnc);
}
var key = KeyPair;

KeyPair.fromPublic = function fromPublic(ec, pub, enc) {
  if (pub instanceof KeyPair)
    return pub;

  return new KeyPair(ec, {
    pub: pub,
    pubEnc: enc,
  });
};

KeyPair.fromPrivate = function fromPrivate(ec, priv, enc) {
  if (priv instanceof KeyPair)
    return priv;

  return new KeyPair(ec, {
    priv: priv,
    privEnc: enc,
  });
};

KeyPair.prototype.validate = function validate() {
  var pub = this.getPublic();

  if (pub.isInfinity())
    return { result: false, reason: 'Invalid public key' };
  if (!pub.validate())
    return { result: false, reason: 'Public key is not a point' };
  if (!pub.mul(this.ec.curve.n).isInfinity())
    return { result: false, reason: 'Public key * N != O' };

  return { result: true, reason: null };
};

KeyPair.prototype.getPublic = function getPublic(compact, enc) {
  // compact is optional argument
  if (typeof compact === 'string') {
    enc = compact;
    compact = null;
  }

  if (!this.pub)
    this.pub = this.ec.g.mul(this.priv);

  if (!enc)
    return this.pub;

  return this.pub.encode(enc, compact);
};

KeyPair.prototype.getPrivate = function getPrivate(enc) {
  if (enc === 'hex')
    return this.priv.toString(16, 2);
  else
    return this.priv;
};

KeyPair.prototype._importPrivate = function _importPrivate(key, enc) {
  this.priv = new (bn_default())(key, enc || 16);

  // Ensure that the priv won't be bigger than n, otherwise we may fail
  // in fixed multiplication method
  this.priv = this.priv.umod(this.ec.curve.n);
};

KeyPair.prototype._importPublic = function _importPublic(key, enc) {
  if (key.x || key.y) {
    // Montgomery points only have an `x` coordinate.
    // Weierstrass/Edwards points on the other hand have both `x` and
    // `y` coordinates.
    if (this.ec.curve.type === 'mont') {
      assert$3(key.x, 'Need x coordinate');
    } else if (this.ec.curve.type === 'short' ||
               this.ec.curve.type === 'edwards') {
      assert$3(key.x && key.y, 'Need both x and y coordinate');
    }
    this.pub = this.ec.curve.point(key.x, key.y);
    return;
  }
  this.pub = this.ec.curve.decodePoint(key, enc);
};

// ECDH
KeyPair.prototype.derive = function derive(pub) {
  if(!pub.validate()) {
    assert$3(pub.validate(), 'public point not validated');
  }
  return pub.mul(this.priv).getX();
};

// ECDSA
KeyPair.prototype.sign = function sign(msg, enc, options) {
  return this.ec.sign(msg, this, enc, options);
};

KeyPair.prototype.verify = function verify(msg, signature) {
  return this.ec.verify(msg, signature, this);
};

KeyPair.prototype.inspect = function inspect() {
  return '<Key priv: ' + (this.priv && this.priv.toString(16, 2)) +
         ' pub: ' + (this.pub && this.pub.inspect()) + ' >';
};

'use strict';




var assert$4 = utils_1$1.assert;

function Signature(options, enc) {
  if (options instanceof Signature)
    return options;

  if (this._importDER(options, enc))
    return;

  assert$4(options.r && options.s, 'Signature without r or s');
  this.r = new (bn_default())(options.r, 16);
  this.s = new (bn_default())(options.s, 16);
  if (options.recoveryParam === undefined)
    this.recoveryParam = null;
  else
    this.recoveryParam = options.recoveryParam;
}
var signature = Signature;

function Position() {
  this.place = 0;
}

function getLength(buf, p) {
  var initial = buf[p.place++];
  if (!(initial & 0x80)) {
    return initial;
  }
  var octetLen = initial & 0xf;

  // Indefinite length or overflow
  if (octetLen === 0 || octetLen > 4) {
    return false;
  }

  var val = 0;
  for (var i = 0, off = p.place; i < octetLen; i++, off++) {
    val <<= 8;
    val |= buf[off];
    val >>>= 0;
  }

  // Leading zeroes
  if (val <= 0x7f) {
    return false;
  }

  p.place = off;
  return val;
}

function rmPadding(buf) {
  var i = 0;
  var len = buf.length - 1;
  while (!buf[i] && !(buf[i + 1] & 0x80) && i < len) {
    i++;
  }
  if (i === 0) {
    return buf;
  }
  return buf.slice(i);
}

Signature.prototype._importDER = function _importDER(data, enc) {
  data = utils_1$1.toArray(data, enc);
  var p = new Position();
  if (data[p.place++] !== 0x30) {
    return false;
  }
  var len = getLength(data, p);
  if (len === false) {
    return false;
  }
  if ((len + p.place) !== data.length) {
    return false;
  }
  if (data[p.place++] !== 0x02) {
    return false;
  }
  var rlen = getLength(data, p);
  if (rlen === false) {
    return false;
  }
  var r = data.slice(p.place, rlen + p.place);
  p.place += rlen;
  if (data[p.place++] !== 0x02) {
    return false;
  }
  var slen = getLength(data, p);
  if (slen === false) {
    return false;
  }
  if (data.length !== slen + p.place) {
    return false;
  }
  var s = data.slice(p.place, slen + p.place);
  if (r[0] === 0) {
    if (r[1] & 0x80) {
      r = r.slice(1);
    } else {
      // Leading zeroes
      return false;
    }
  }
  if (s[0] === 0) {
    if (s[1] & 0x80) {
      s = s.slice(1);
    } else {
      // Leading zeroes
      return false;
    }
  }

  this.r = new (bn_default())(r);
  this.s = new (bn_default())(s);
  this.recoveryParam = null;

  return true;
};

function constructLength(arr, len) {
  if (len < 0x80) {
    arr.push(len);
    return;
  }
  var octets = 1 + (Math.log(len) / Math.LN2 >>> 3);
  arr.push(octets | 0x80);
  while (--octets) {
    arr.push((len >>> (octets << 3)) & 0xff);
  }
  arr.push(len);
}

Signature.prototype.toDER = function toDER(enc) {
  var r = this.r.toArray();
  var s = this.s.toArray();

  // Pad values
  if (r[0] & 0x80)
    r = [ 0 ].concat(r);
  // Pad values
  if (s[0] & 0x80)
    s = [ 0 ].concat(s);

  r = rmPadding(r);
  s = rmPadding(s);

  while (!s[0] && !(s[1] & 0x80)) {
    s = s.slice(1);
  }
  var arr = [ 0x02 ];
  constructLength(arr, r.length);
  arr = arr.concat(r);
  arr.push(0x02);
  constructLength(arr, s.length);
  var backHalf = arr.concat(s);
  var res = [ 0x30 ];
  constructLength(res, backHalf.length);
  res = res.concat(backHalf);
  return utils_1$1.encode(res, enc);
};

'use strict';





var rand = /*RicMoo:ethers:require(brorand)*/(function() { throw new Error('unsupported'); });
var assert$5 = utils_1$1.assert;




function EC(options) {
  if (!(this instanceof EC))
    return new EC(options);

  // Shortcut `elliptic.ec(curve-name)`
  if (typeof options === 'string') {
    assert$5(Object.prototype.hasOwnProperty.call(curves_1, options),
      'Unknown curve ' + options);

    options = curves_1[options];
  }

  // Shortcut for `elliptic.ec(elliptic.curves.curveName)`
  if (options instanceof curves_1.PresetCurve)
    options = { curve: options };

  this.curve = options.curve.curve;
  this.n = this.curve.n;
  this.nh = this.n.ushrn(1);
  this.g = this.curve.g;

  // Point on curve
  this.g = options.curve.g;
  this.g.precompute(options.curve.n.bitLength() + 1);

  // Hash for function for DRBG
  this.hash = options.hash || options.curve.hash;
}
var ec = EC;

EC.prototype.keyPair = function keyPair(options) {
  return new key(this, options);
};

EC.prototype.keyFromPrivate = function keyFromPrivate(priv, enc) {
  return key.fromPrivate(this, priv, enc);
};

EC.prototype.keyFromPublic = function keyFromPublic(pub, enc) {
  return key.fromPublic(this, pub, enc);
};

EC.prototype.genKeyPair = function genKeyPair(options) {
  if (!options)
    options = {};

  // Instantiate Hmac_DRBG
  var drbg = new hmacDrbg({
    hash: this.hash,
    pers: options.pers,
    persEnc: options.persEnc || 'utf8',
    entropy: options.entropy || rand(this.hash.hmacStrength),
    entropyEnc: options.entropy && options.entropyEnc || 'utf8',
    nonce: this.n.toArray(),
  });

  var bytes = this.n.byteLength();
  var ns2 = this.n.sub(new (bn_default())(2));
  for (;;) {
    var priv = new (bn_default())(drbg.generate(bytes));
    if (priv.cmp(ns2) > 0)
      continue;

    priv.iaddn(1);
    return this.keyFromPrivate(priv);
  }
};

EC.prototype._truncateToN = function _truncateToN(msg, truncOnly) {
  var delta = msg.byteLength() * 8 - this.n.bitLength();
  if (delta > 0)
    msg = msg.ushrn(delta);
  if (!truncOnly && msg.cmp(this.n) >= 0)
    return msg.sub(this.n);
  else
    return msg;
};

EC.prototype.sign = function sign(msg, key, enc, options) {
  if (typeof enc === 'object') {
    options = enc;
    enc = null;
  }
  if (!options)
    options = {};

  key = this.keyFromPrivate(key, enc);
  msg = this._truncateToN(new (bn_default())(msg, 16));

  // Zero-extend key to provide enough entropy
  var bytes = this.n.byteLength();
  var bkey = key.getPrivate().toArray('be', bytes);

  // Zero-extend nonce to have the same byte size as N
  var nonce = msg.toArray('be', bytes);

  // Instantiate Hmac_DRBG
  var drbg = new hmacDrbg({
    hash: this.hash,
    entropy: bkey,
    nonce: nonce,
    pers: options.pers,
    persEnc: options.persEnc || 'utf8',
  });

  // Number of bytes to generate
  var ns1 = this.n.sub(new (bn_default())(1));

  for (var iter = 0; ; iter++) {
    var k = options.k ?
      options.k(iter) :
      new (bn_default())(drbg.generate(this.n.byteLength()));
    k = this._truncateToN(k, true);
    if (k.cmpn(1) <= 0 || k.cmp(ns1) >= 0)
      continue;

    var kp = this.g.mul(k);
    if (kp.isInfinity())
      continue;

    var kpX = kp.getX();
    var r = kpX.umod(this.n);
    if (r.cmpn(0) === 0)
      continue;

    var s = k.invm(this.n).mul(r.mul(key.getPrivate()).iadd(msg));
    s = s.umod(this.n);
    if (s.cmpn(0) === 0)
      continue;

    var recoveryParam = (kp.getY().isOdd() ? 1 : 0) |
                        (kpX.cmp(r) !== 0 ? 2 : 0);

    // Use complement of `s`, if it is > `n / 2`
    if (options.canonical && s.cmp(this.nh) > 0) {
      s = this.n.sub(s);
      recoveryParam ^= 1;
    }

    return new signature({ r: r, s: s, recoveryParam: recoveryParam });
  }
};

EC.prototype.verify = function verify(msg, signature$1, key, enc) {
  msg = this._truncateToN(new (bn_default())(msg, 16));
  key = this.keyFromPublic(key, enc);
  signature$1 = new signature(signature$1, 'hex');

  // Perform primitive values validation
  var r = signature$1.r;
  var s = signature$1.s;
  if (r.cmpn(1) < 0 || r.cmp(this.n) >= 0)
    return false;
  if (s.cmpn(1) < 0 || s.cmp(this.n) >= 0)
    return false;

  // Validate signature
  var sinv = s.invm(this.n);
  var u1 = sinv.mul(msg).umod(this.n);
  var u2 = sinv.mul(r).umod(this.n);
  var p;

  if (!this.curve._maxwellTrick) {
    p = this.g.mulAdd(u1, key.getPublic(), u2);
    if (p.isInfinity())
      return false;

    return p.getX().umod(this.n).cmp(r) === 0;
  }

  // NOTE: Greg Maxwell's trick, inspired by:
  // https://git.io/vad3K

  p = this.g.jmulAdd(u1, key.getPublic(), u2);
  if (p.isInfinity())
    return false;

  // Compare `p.x` of Jacobian point with `r`,
  // this will do `p.x == r * p.z^2` instead of multiplying `p.x` by the
  // inverse of `p.z^2`
  return p.eqXToP(r);
};

EC.prototype.recoverPubKey = function(msg, signature$1, j, enc) {
  assert$5((3 & j) === j, 'The recovery param is more than two bits');
  signature$1 = new signature(signature$1, enc);

  var n = this.n;
  var e = new (bn_default())(msg);
  var r = signature$1.r;
  var s = signature$1.s;

  // A set LSB signifies that the y-coordinate is odd
  var isYOdd = j & 1;
  var isSecondKey = j >> 1;
  if (r.cmp(this.curve.p.umod(this.curve.n)) >= 0 && isSecondKey)
    throw new Error('Unable to find sencond key candinate');

  // 1.1. Let x = r + jn.
  if (isSecondKey)
    r = this.curve.pointFromX(r.add(this.curve.n), isYOdd);
  else
    r = this.curve.pointFromX(r, isYOdd);

  var rInv = signature$1.r.invm(n);
  var s1 = n.sub(e).mul(rInv).umod(n);
  var s2 = s.mul(rInv).umod(n);

  // 1.6.1 Compute Q = r^-1 (sR -  eG)
  //               Q = r^-1 (sR + -eG)
  return this.g.mulAdd(s1, r, s2);
};

EC.prototype.getKeyRecoveryParam = function(e, signature$1, Q, enc) {
  signature$1 = new signature(signature$1, enc);
  if (signature$1.recoveryParam !== null)
    return signature$1.recoveryParam;

  for (var i = 0; i < 4; i++) {
    var Qprime;
    try {
      Qprime = this.recoverPubKey(e, signature$1, i);
    } catch (e) {
      continue;
    }

    if (Qprime.eq(Q))
      return i;
  }
  throw new Error('Unable to find valid recovery factor');
};

var elliptic_1 = createCommonjsModule(function (module, exports) {
'use strict';

var elliptic = exports;

elliptic.version = /*RicMoo:ethers*/{ version: "6.5.4" }.version;
elliptic.utils = utils_1$1;
elliptic.rand = /*RicMoo:ethers:require(brorand)*/(function() { throw new Error('unsupported'); });
elliptic.curve = curve_1;
elliptic.curves = curves_1;

// Protocols
elliptic.ec = ec;
elliptic.eddsa = /*RicMoo:ethers:require(./elliptic/eddsa)*/(null);
});

var EC$1 = elliptic_1.ec;


//# sourceMappingURL=elliptic.js.map

;// CONCATENATED MODULE: ./node_modules/@ethersproject/signing-key/lib.esm/_version.js
const signing_key_lib_esm_version_version = "signing-key/5.7.0";
//# sourceMappingURL=_version.js.map
;// CONCATENATED MODULE: ./node_modules/@ethersproject/signing-key/lib.esm/index.js






const signing_key_lib_esm_logger = new lib_esm_Logger(signing_key_lib_esm_version_version);
let _curve = null;
function getCurve() {
    if (!_curve) {
        _curve = new EC$1("secp256k1");
    }
    return _curve;
}
class SigningKey {
    constructor(privateKey) {
        defineReadOnly(this, "curve", "secp256k1");
        defineReadOnly(this, "privateKey", lib_esm_hexlify(privateKey));
        if (lib_esm_hexDataLength(this.privateKey) !== 32) {
            signing_key_lib_esm_logger.throwArgumentError("invalid private key", "privateKey", "[[ REDACTED ]]");
        }
        const keyPair = getCurve().keyFromPrivate(lib_esm_arrayify(this.privateKey));
        defineReadOnly(this, "publicKey", "0x" + keyPair.getPublic(false, "hex"));
        defineReadOnly(this, "compressedPublicKey", "0x" + keyPair.getPublic(true, "hex"));
        defineReadOnly(this, "_isSigningKey", true);
    }
    _addPoint(other) {
        const p0 = getCurve().keyFromPublic(lib_esm_arrayify(this.publicKey));
        const p1 = getCurve().keyFromPublic(lib_esm_arrayify(other));
        return "0x" + p0.pub.add(p1.pub).encodeCompressed("hex");
    }
    signDigest(digest) {
        const keyPair = getCurve().keyFromPrivate(lib_esm_arrayify(this.privateKey));
        const digestBytes = lib_esm_arrayify(digest);
        if (digestBytes.length !== 32) {
            signing_key_lib_esm_logger.throwArgumentError("bad digest length", "digest", digest);
        }
        const signature = keyPair.sign(digestBytes, { canonical: true });
        return lib_esm_splitSignature({
            recoveryParam: signature.recoveryParam,
            r: hexZeroPad("0x" + signature.r.toString(16), 32),
            s: hexZeroPad("0x" + signature.s.toString(16), 32),
        });
    }
    computeSharedSecret(otherKey) {
        const keyPair = getCurve().keyFromPrivate(lib_esm_arrayify(this.privateKey));
        const otherKeyPair = getCurve().keyFromPublic(lib_esm_arrayify(computePublicKey(otherKey)));
        return hexZeroPad("0x" + keyPair.derive(otherKeyPair.getPublic()).toString(16), 32);
    }
    static isSigningKey(value) {
        return !!(value && value._isSigningKey);
    }
}
function recoverPublicKey(digest, signature) {
    const sig = lib_esm_splitSignature(signature);
    const rs = { r: lib_esm_arrayify(sig.r), s: lib_esm_arrayify(sig.s) };
    return "0x" + getCurve().recoverPubKey(lib_esm_arrayify(digest), rs, sig.recoveryParam).encode("hex", false);
}
function computePublicKey(key, compressed) {
    const bytes = lib_esm_arrayify(key);
    if (bytes.length === 32) {
        const signingKey = new SigningKey(bytes);
        if (compressed) {
            return "0x" + getCurve().keyFromPrivate(bytes).getPublic(true, "hex");
        }
        return signingKey.publicKey;
    }
    else if (bytes.length === 33) {
        if (compressed) {
            return lib_esm_hexlify(bytes);
        }
        return "0x" + getCurve().keyFromPublic(bytes).getPublic(false, "hex");
    }
    else if (bytes.length === 65) {
        if (!compressed) {
            return lib_esm_hexlify(bytes);
        }
        return "0x" + getCurve().keyFromPublic(bytes).getPublic(true, "hex");
    }
    return signing_key_lib_esm_logger.throwArgumentError("invalid public or private key", "key", "[REDACTED]");
}
//# sourceMappingURL=index.js.map
;// CONCATENATED MODULE: ./node_modules/@ethersproject/transactions/lib.esm/_version.js
const transactions_lib_esm_version_version = "transactions/5.7.0";
//# sourceMappingURL=_version.js.map
;// CONCATENATED MODULE: ./node_modules/@ethersproject/transactions/lib.esm/index.js











const transactions_lib_esm_logger = new lib_esm_Logger(transactions_lib_esm_version_version);
var TransactionTypes;
(function (TransactionTypes) {
    TransactionTypes[TransactionTypes["legacy"] = 0] = "legacy";
    TransactionTypes[TransactionTypes["eip2930"] = 1] = "eip2930";
    TransactionTypes[TransactionTypes["eip1559"] = 2] = "eip1559";
})(TransactionTypes || (TransactionTypes = {}));
;
///////////////////////////////
function handleAddress(value) {
    if (value === "0x") {
        return null;
    }
    return getAddress(value);
}
function handleNumber(value) {
    if (value === "0x") {
        return bignumbers_Zero;
    }
    return bignumber_BigNumber.from(value);
}
// Legacy Transaction Fields
const transactionFields = [
    { name: "nonce", maxLength: 32, numeric: true },
    { name: "gasPrice", maxLength: 32, numeric: true },
    { name: "gasLimit", maxLength: 32, numeric: true },
    { name: "to", length: 20 },
    { name: "value", maxLength: 32, numeric: true },
    { name: "data" },
];
const lib_esm_allowedTransactionKeys = {
    chainId: true, data: true, gasLimit: true, gasPrice: true, nonce: true, to: true, type: true, value: true
};
function computeAddress(key) {
    const publicKey = computePublicKey(key);
    return getAddress(lib_esm_hexDataSlice(lib_esm_keccak256(lib_esm_hexDataSlice(publicKey, 1)), 12));
}
function recoverAddress(digest, signature) {
    return computeAddress(recoverPublicKey(lib_esm_arrayify(digest), signature));
}
function formatNumber(value, name) {
    const result = lib_esm_stripZeros(bignumber_BigNumber.from(value).toHexString());
    if (result.length > 32) {
        transactions_lib_esm_logger.throwArgumentError("invalid length for " + name, ("transaction:" + name), value);
    }
    return result;
}
function accessSetify(addr, storageKeys) {
    return {
        address: getAddress(addr),
        storageKeys: (storageKeys || []).map((storageKey, index) => {
            if (lib_esm_hexDataLength(storageKey) !== 32) {
                transactions_lib_esm_logger.throwArgumentError("invalid access list storageKey", `accessList[${addr}:${index}]`, storageKey);
            }
            return storageKey.toLowerCase();
        })
    };
}
function accessListify(value) {
    if (Array.isArray(value)) {
        return value.map((set, index) => {
            if (Array.isArray(set)) {
                if (set.length > 2) {
                    transactions_lib_esm_logger.throwArgumentError("access list expected to be [ address, storageKeys[] ]", `value[${index}]`, set);
                }
                return accessSetify(set[0], set[1]);
            }
            return accessSetify(set.address, set.storageKeys);
        });
    }
    const result = Object.keys(value).map((addr) => {
        const storageKeys = value[addr].reduce((accum, storageKey) => {
            accum[storageKey] = true;
            return accum;
        }, {});
        return accessSetify(addr, Object.keys(storageKeys).sort());
    });
    result.sort((a, b) => (a.address.localeCompare(b.address)));
    return result;
}
function formatAccessList(value) {
    return accessListify(value).map((set) => [set.address, set.storageKeys]);
}
function _serializeEip1559(transaction, signature) {
    // If there is an explicit gasPrice, make sure it matches the
    // EIP-1559 fees; otherwise they may not understand what they
    // think they are setting in terms of fee.
    if (transaction.gasPrice != null) {
        const gasPrice = bignumber_BigNumber.from(transaction.gasPrice);
        const maxFeePerGas = bignumber_BigNumber.from(transaction.maxFeePerGas || 0);
        if (!gasPrice.eq(maxFeePerGas)) {
            transactions_lib_esm_logger.throwArgumentError("mismatch EIP-1559 gasPrice != maxFeePerGas", "tx", {
                gasPrice, maxFeePerGas
            });
        }
    }
    const fields = [
        formatNumber(transaction.chainId || 0, "chainId"),
        formatNumber(transaction.nonce || 0, "nonce"),
        formatNumber(transaction.maxPriorityFeePerGas || 0, "maxPriorityFeePerGas"),
        formatNumber(transaction.maxFeePerGas || 0, "maxFeePerGas"),
        formatNumber(transaction.gasLimit || 0, "gasLimit"),
        ((transaction.to != null) ? getAddress(transaction.to) : "0x"),
        formatNumber(transaction.value || 0, "value"),
        (transaction.data || "0x"),
        (formatAccessList(transaction.accessList || []))
    ];
    if (signature) {
        const sig = lib_esm_splitSignature(signature);
        fields.push(formatNumber(sig.recoveryParam, "recoveryParam"));
        fields.push(lib_esm_stripZeros(sig.r));
        fields.push(lib_esm_stripZeros(sig.s));
    }
    return hexConcat(["0x02", encode(fields)]);
}
function _serializeEip2930(transaction, signature) {
    const fields = [
        formatNumber(transaction.chainId || 0, "chainId"),
        formatNumber(transaction.nonce || 0, "nonce"),
        formatNumber(transaction.gasPrice || 0, "gasPrice"),
        formatNumber(transaction.gasLimit || 0, "gasLimit"),
        ((transaction.to != null) ? getAddress(transaction.to) : "0x"),
        formatNumber(transaction.value || 0, "value"),
        (transaction.data || "0x"),
        (formatAccessList(transaction.accessList || []))
    ];
    if (signature) {
        const sig = lib_esm_splitSignature(signature);
        fields.push(formatNumber(sig.recoveryParam, "recoveryParam"));
        fields.push(lib_esm_stripZeros(sig.r));
        fields.push(lib_esm_stripZeros(sig.s));
    }
    return hexConcat(["0x01", encode(fields)]);
}
// Legacy Transactions and EIP-155
function _serialize(transaction, signature) {
    checkProperties(transaction, lib_esm_allowedTransactionKeys);
    const raw = [];
    transactionFields.forEach(function (fieldInfo) {
        let value = transaction[fieldInfo.name] || ([]);
        const options = {};
        if (fieldInfo.numeric) {
            options.hexPad = "left";
        }
        value = arrayify(hexlify(value, options));
        // Fixed-width field
        if (fieldInfo.length && value.length !== fieldInfo.length && value.length > 0) {
            transactions_lib_esm_logger.throwArgumentError("invalid length for " + fieldInfo.name, ("transaction:" + fieldInfo.name), value);
        }
        // Variable-width (with a maximum)
        if (fieldInfo.maxLength) {
            value = stripZeros(value);
            if (value.length > fieldInfo.maxLength) {
                transactions_lib_esm_logger.throwArgumentError("invalid length for " + fieldInfo.name, ("transaction:" + fieldInfo.name), value);
            }
        }
        raw.push(hexlify(value));
    });
    let chainId = 0;
    if (transaction.chainId != null) {
        // A chainId was provided; if non-zero we'll use EIP-155
        chainId = transaction.chainId;
        if (typeof (chainId) !== "number") {
            transactions_lib_esm_logger.throwArgumentError("invalid transaction.chainId", "transaction", transaction);
        }
    }
    else if (signature && !isBytesLike(signature) && signature.v > 28) {
        // No chainId provided, but the signature is signing with EIP-155; derive chainId
        chainId = Math.floor((signature.v - 35) / 2);
    }
    // We have an EIP-155 transaction (chainId was specified and non-zero)
    if (chainId !== 0) {
        raw.push(hexlify(chainId)); // @TODO: hexValue?
        raw.push("0x");
        raw.push("0x");
    }
    // Requesting an unsigned transaction
    if (!signature) {
        return RLP.encode(raw);
    }
    // The splitSignature will ensure the transaction has a recoveryParam in the
    // case that the signTransaction function only adds a v.
    const sig = splitSignature(signature);
    // We pushed a chainId and null r, s on for hashing only; remove those
    let v = 27 + sig.recoveryParam;
    if (chainId !== 0) {
        raw.pop();
        raw.pop();
        raw.pop();
        v += chainId * 2 + 8;
        // If an EIP-155 v (directly or indirectly; maybe _vs) was provided, check it!
        if (sig.v > 28 && sig.v !== v) {
            transactions_lib_esm_logger.throwArgumentError("transaction.chainId/signature.v mismatch", "signature", signature);
        }
    }
    else if (sig.v !== v) {
        transactions_lib_esm_logger.throwArgumentError("transaction.chainId/signature.v mismatch", "signature", signature);
    }
    raw.push(hexlify(v));
    raw.push(stripZeros(arrayify(sig.r)));
    raw.push(stripZeros(arrayify(sig.s)));
    return RLP.encode(raw);
}
function serialize(transaction, signature) {
    // Legacy and EIP-155 Transactions
    if (transaction.type == null || transaction.type === 0) {
        if (transaction.accessList != null) {
            transactions_lib_esm_logger.throwArgumentError("untyped transactions do not support accessList; include type: 1", "transaction", transaction);
        }
        return _serialize(transaction, signature);
    }
    // Typed Transactions (EIP-2718)
    switch (transaction.type) {
        case 1:
            return _serializeEip2930(transaction, signature);
        case 2:
            return _serializeEip1559(transaction, signature);
        default:
            break;
    }
    return transactions_lib_esm_logger.throwError(`unsupported transaction type: ${transaction.type}`, Logger.errors.UNSUPPORTED_OPERATION, {
        operation: "serializeTransaction",
        transactionType: transaction.type
    });
}
function _parseEipSignature(tx, fields, serialize) {
    try {
        const recid = handleNumber(fields[0]).toNumber();
        if (recid !== 0 && recid !== 1) {
            throw new Error("bad recid");
        }
        tx.v = recid;
    }
    catch (error) {
        transactions_lib_esm_logger.throwArgumentError("invalid v for transaction type: 1", "v", fields[0]);
    }
    tx.r = hexZeroPad(fields[1], 32);
    tx.s = hexZeroPad(fields[2], 32);
    try {
        const digest = lib_esm_keccak256(serialize(tx));
        tx.from = recoverAddress(digest, { r: tx.r, s: tx.s, recoveryParam: tx.v });
    }
    catch (error) { }
}
function _parseEip1559(payload) {
    const transaction = decode(payload.slice(1));
    if (transaction.length !== 9 && transaction.length !== 12) {
        transactions_lib_esm_logger.throwArgumentError("invalid component count for transaction type: 2", "payload", lib_esm_hexlify(payload));
    }
    const maxPriorityFeePerGas = handleNumber(transaction[2]);
    const maxFeePerGas = handleNumber(transaction[3]);
    const tx = {
        type: 2,
        chainId: handleNumber(transaction[0]).toNumber(),
        nonce: handleNumber(transaction[1]).toNumber(),
        maxPriorityFeePerGas: maxPriorityFeePerGas,
        maxFeePerGas: maxFeePerGas,
        gasPrice: null,
        gasLimit: handleNumber(transaction[4]),
        to: handleAddress(transaction[5]),
        value: handleNumber(transaction[6]),
        data: transaction[7],
        accessList: accessListify(transaction[8]),
    };
    // Unsigned EIP-1559 Transaction
    if (transaction.length === 9) {
        return tx;
    }
    tx.hash = lib_esm_keccak256(payload);
    _parseEipSignature(tx, transaction.slice(9), _serializeEip1559);
    return tx;
}
function _parseEip2930(payload) {
    const transaction = decode(payload.slice(1));
    if (transaction.length !== 8 && transaction.length !== 11) {
        transactions_lib_esm_logger.throwArgumentError("invalid component count for transaction type: 1", "payload", lib_esm_hexlify(payload));
    }
    const tx = {
        type: 1,
        chainId: handleNumber(transaction[0]).toNumber(),
        nonce: handleNumber(transaction[1]).toNumber(),
        gasPrice: handleNumber(transaction[2]),
        gasLimit: handleNumber(transaction[3]),
        to: handleAddress(transaction[4]),
        value: handleNumber(transaction[5]),
        data: transaction[6],
        accessList: accessListify(transaction[7])
    };
    // Unsigned EIP-2930 Transaction
    if (transaction.length === 8) {
        return tx;
    }
    tx.hash = lib_esm_keccak256(payload);
    _parseEipSignature(tx, transaction.slice(8), _serializeEip2930);
    return tx;
}
// Legacy Transactions and EIP-155
function _parse(rawTransaction) {
    const transaction = decode(rawTransaction);
    if (transaction.length !== 9 && transaction.length !== 6) {
        transactions_lib_esm_logger.throwArgumentError("invalid raw transaction", "rawTransaction", rawTransaction);
    }
    const tx = {
        nonce: handleNumber(transaction[0]).toNumber(),
        gasPrice: handleNumber(transaction[1]),
        gasLimit: handleNumber(transaction[2]),
        to: handleAddress(transaction[3]),
        value: handleNumber(transaction[4]),
        data: transaction[5],
        chainId: 0
    };
    // Legacy unsigned transaction
    if (transaction.length === 6) {
        return tx;
    }
    try {
        tx.v = bignumber_BigNumber.from(transaction[6]).toNumber();
    }
    catch (error) {
        // @TODO: What makes snese to do? The v is too big
        return tx;
    }
    tx.r = hexZeroPad(transaction[7], 32);
    tx.s = hexZeroPad(transaction[8], 32);
    if (bignumber_BigNumber.from(tx.r).isZero() && bignumber_BigNumber.from(tx.s).isZero()) {
        // EIP-155 unsigned transaction
        tx.chainId = tx.v;
        tx.v = 0;
    }
    else {
        // Signed Transaction
        tx.chainId = Math.floor((tx.v - 35) / 2);
        if (tx.chainId < 0) {
            tx.chainId = 0;
        }
        let recoveryParam = tx.v - 27;
        const raw = transaction.slice(0, 6);
        if (tx.chainId !== 0) {
            raw.push(lib_esm_hexlify(tx.chainId));
            raw.push("0x");
            raw.push("0x");
            recoveryParam -= tx.chainId * 2 + 8;
        }
        const digest = lib_esm_keccak256(encode(raw));
        try {
            tx.from = recoverAddress(digest, { r: lib_esm_hexlify(tx.r), s: lib_esm_hexlify(tx.s), recoveryParam: recoveryParam });
        }
        catch (error) { }
        tx.hash = lib_esm_keccak256(rawTransaction);
    }
    tx.type = null;
    return tx;
}
function parse(rawTransaction) {
    const payload = lib_esm_arrayify(rawTransaction);
    // Legacy and EIP-155 Transactions
    if (payload[0] > 0x7f) {
        return _parse(payload);
    }
    // Typed Transaction (EIP-2718)
    switch (payload[0]) {
        case 1:
            return _parseEip2930(payload);
        case 2:
            return _parseEip1559(payload);
        default:
            break;
    }
    return transactions_lib_esm_logger.throwError(`unsupported transaction type: ${payload[0]}`, lib_esm_Logger.errors.UNSUPPORTED_OPERATION, {
        operation: "parseTransaction",
        transactionType: payload[0]
    });
}
//# sourceMappingURL=index.js.map
;// CONCATENATED MODULE: ./node_modules/@ethersproject/base64/lib.esm/base64.js


function base64_decode(textData) {
    textData = atob(textData);
    const data = [];
    for (let i = 0; i < textData.length; i++) {
        data.push(textData.charCodeAt(i));
    }
    return lib_esm_arrayify(data);
}
function base64_encode(data) {
    data = lib_esm_arrayify(data);
    let textData = "";
    for (let i = 0; i < data.length; i++) {
        textData += String.fromCharCode(data[i]);
    }
    return btoa(textData);
}
//# sourceMappingURL=base64.js.map
;// CONCATENATED MODULE: ./node_modules/@ethersproject/web/lib.esm/_version.js
const web_lib_esm_version_version = "web/5.7.1";
//# sourceMappingURL=_version.js.map
;// CONCATENATED MODULE: ./node_modules/@ethersproject/web/lib.esm/geturl.js

var geturl_awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};

function getUrl(href, options) {
    return geturl_awaiter(this, void 0, void 0, function* () {
        if (options == null) {
            options = {};
        }
        const request = {
            method: (options.method || "GET"),
            headers: (options.headers || {}),
            body: (options.body || undefined),
        };
        if (options.skipFetchSetup !== true) {
            request.mode = "cors"; // no-cors, cors, *same-origin
            request.cache = "no-cache"; // *default, no-cache, reload, force-cache, only-if-cached
            request.credentials = "same-origin"; // include, *same-origin, omit
            request.redirect = "follow"; // manual, *follow, error
            request.referrer = "client"; // no-referrer, *client
        }
        ;
        if (options.fetchOptions != null) {
            const opts = options.fetchOptions;
            if (opts.mode) {
                request.mode = (opts.mode);
            }
            if (opts.cache) {
                request.cache = (opts.cache);
            }
            if (opts.credentials) {
                request.credentials = (opts.credentials);
            }
            if (opts.redirect) {
                request.redirect = (opts.redirect);
            }
            if (opts.referrer) {
                request.referrer = opts.referrer;
            }
        }
        const response = yield fetch(href, request);
        const body = yield response.arrayBuffer();
        const headers = {};
        if (response.headers.forEach) {
            response.headers.forEach((value, key) => {
                headers[key.toLowerCase()] = value;
            });
        }
        else {
            ((response.headers).keys)().forEach((key) => {
                headers[key.toLowerCase()] = response.headers.get(key);
            });
        }
        return {
            headers: headers,
            statusCode: response.status,
            statusMessage: response.statusText,
            body: lib_esm_arrayify(new Uint8Array(body)),
        };
    });
}
//# sourceMappingURL=geturl.js.map
;// CONCATENATED MODULE: ./node_modules/@ethersproject/web/lib.esm/index.js

var web_lib_esm_awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};






const web_lib_esm_logger = new lib_esm_Logger(web_lib_esm_version_version);

function staller(duration) {
    return new Promise((resolve) => {
        setTimeout(resolve, duration);
    });
}
function bodyify(value, type) {
    if (value == null) {
        return null;
    }
    if (typeof (value) === "string") {
        return value;
    }
    if (lib_esm_isBytesLike(value)) {
        if (type && (type.split("/")[0] === "text" || type.split(";")[0].trim() === "application/json")) {
            try {
                return utf8_toUtf8String(value);
            }
            catch (error) { }
            ;
        }
        return lib_esm_hexlify(value);
    }
    return value;
}
function unpercent(value) {
    return toUtf8Bytes(value.replace(/%([0-9a-f][0-9a-f])/gi, (all, code) => {
        return String.fromCharCode(parseInt(code, 16));
    }));
}
// This API is still a work in progress; the future changes will likely be:
// - ConnectionInfo => FetchDataRequest<T = any>
// - FetchDataRequest.body? = string | Uint8Array | { contentType: string, data: string | Uint8Array }
//   - If string => text/plain, Uint8Array => application/octet-stream (if content-type unspecified)
// - FetchDataRequest.processFunc = (body: Uint8Array, response: FetchDataResponse) => T
// For this reason, it should be considered internal until the API is finalized
function _fetchData(connection, body, processFunc) {
    // How many times to retry in the event of a throttle
    const attemptLimit = (typeof (connection) === "object" && connection.throttleLimit != null) ? connection.throttleLimit : 12;
    web_lib_esm_logger.assertArgument((attemptLimit > 0 && (attemptLimit % 1) === 0), "invalid connection throttle limit", "connection.throttleLimit", attemptLimit);
    const throttleCallback = ((typeof (connection) === "object") ? connection.throttleCallback : null);
    const throttleSlotInterval = ((typeof (connection) === "object" && typeof (connection.throttleSlotInterval) === "number") ? connection.throttleSlotInterval : 100);
    web_lib_esm_logger.assertArgument((throttleSlotInterval > 0 && (throttleSlotInterval % 1) === 0), "invalid connection throttle slot interval", "connection.throttleSlotInterval", throttleSlotInterval);
    const errorPassThrough = ((typeof (connection) === "object") ? !!(connection.errorPassThrough) : false);
    const headers = {};
    let url = null;
    // @TODO: Allow ConnectionInfo to override some of these values
    const options = {
        method: "GET",
    };
    let allow304 = false;
    let timeout = 2 * 60 * 1000;
    if (typeof (connection) === "string") {
        url = connection;
    }
    else if (typeof (connection) === "object") {
        if (connection == null || connection.url == null) {
            web_lib_esm_logger.throwArgumentError("missing URL", "connection.url", connection);
        }
        url = connection.url;
        if (typeof (connection.timeout) === "number" && connection.timeout > 0) {
            timeout = connection.timeout;
        }
        if (connection.headers) {
            for (const key in connection.headers) {
                headers[key.toLowerCase()] = { key: key, value: String(connection.headers[key]) };
                if (["if-none-match", "if-modified-since"].indexOf(key.toLowerCase()) >= 0) {
                    allow304 = true;
                }
            }
        }
        options.allowGzip = !!connection.allowGzip;
        if (connection.user != null && connection.password != null) {
            if (url.substring(0, 6) !== "https:" && connection.allowInsecureAuthentication !== true) {
                web_lib_esm_logger.throwError("basic authentication requires a secure https url", lib_esm_Logger.errors.INVALID_ARGUMENT, { argument: "url", url: url, user: connection.user, password: "[REDACTED]" });
            }
            const authorization = connection.user + ":" + connection.password;
            headers["authorization"] = {
                key: "Authorization",
                value: "Basic " + base64_encode(toUtf8Bytes(authorization))
            };
        }
        if (connection.skipFetchSetup != null) {
            options.skipFetchSetup = !!connection.skipFetchSetup;
        }
        if (connection.fetchOptions != null) {
            options.fetchOptions = shallowCopy(connection.fetchOptions);
        }
    }
    const reData = new RegExp("^data:([^;:]*)?(;base64)?,(.*)$", "i");
    const dataMatch = ((url) ? url.match(reData) : null);
    if (dataMatch) {
        try {
            const response = {
                statusCode: 200,
                statusMessage: "OK",
                headers: { "content-type": (dataMatch[1] || "text/plain") },
                body: (dataMatch[2] ? base64_decode(dataMatch[3]) : unpercent(dataMatch[3]))
            };
            let result = response.body;
            if (processFunc) {
                result = processFunc(response.body, response);
            }
            return Promise.resolve(result);
        }
        catch (error) {
            web_lib_esm_logger.throwError("processing response error", lib_esm_Logger.errors.SERVER_ERROR, {
                body: bodyify(dataMatch[1], dataMatch[2]),
                error: error,
                requestBody: null,
                requestMethod: "GET",
                url: url
            });
        }
    }
    if (body) {
        options.method = "POST";
        options.body = body;
        if (headers["content-type"] == null) {
            headers["content-type"] = { key: "Content-Type", value: "application/octet-stream" };
        }
        if (headers["content-length"] == null) {
            headers["content-length"] = { key: "Content-Length", value: String(body.length) };
        }
    }
    const flatHeaders = {};
    Object.keys(headers).forEach((key) => {
        const header = headers[key];
        flatHeaders[header.key] = header.value;
    });
    options.headers = flatHeaders;
    const runningTimeout = (function () {
        let timer = null;
        const promise = new Promise(function (resolve, reject) {
            if (timeout) {
                timer = setTimeout(() => {
                    if (timer == null) {
                        return;
                    }
                    timer = null;
                    reject(web_lib_esm_logger.makeError("timeout", lib_esm_Logger.errors.TIMEOUT, {
                        requestBody: bodyify(options.body, flatHeaders["content-type"]),
                        requestMethod: options.method,
                        timeout: timeout,
                        url: url
                    }));
                }, timeout);
            }
        });
        const cancel = function () {
            if (timer == null) {
                return;
            }
            clearTimeout(timer);
            timer = null;
        };
        return { promise, cancel };
    })();
    const runningFetch = (function () {
        return web_lib_esm_awaiter(this, void 0, void 0, function* () {
            for (let attempt = 0; attempt < attemptLimit; attempt++) {
                let response = null;
                try {
                    response = yield getUrl(url, options);
                    if (attempt < attemptLimit) {
                        if (response.statusCode === 301 || response.statusCode === 302) {
                            // Redirection; for now we only support absolute locataions
                            const location = response.headers.location || "";
                            if (options.method === "GET" && location.match(/^https:/)) {
                                url = response.headers.location;
                                continue;
                            }
                        }
                        else if (response.statusCode === 429) {
                            // Exponential back-off throttling
                            let tryAgain = true;
                            if (throttleCallback) {
                                tryAgain = yield throttleCallback(attempt, url);
                            }
                            if (tryAgain) {
                                let stall = 0;
                                const retryAfter = response.headers["retry-after"];
                                if (typeof (retryAfter) === "string" && retryAfter.match(/^[1-9][0-9]*$/)) {
                                    stall = parseInt(retryAfter) * 1000;
                                }
                                else {
                                    stall = throttleSlotInterval * parseInt(String(Math.random() * Math.pow(2, attempt)));
                                }
                                //console.log("Stalling 429");
                                yield staller(stall);
                                continue;
                            }
                        }
                    }
                }
                catch (error) {
                    response = error.response;
                    if (response == null) {
                        runningTimeout.cancel();
                        web_lib_esm_logger.throwError("missing response", lib_esm_Logger.errors.SERVER_ERROR, {
                            requestBody: bodyify(options.body, flatHeaders["content-type"]),
                            requestMethod: options.method,
                            serverError: error,
                            url: url
                        });
                    }
                }
                let body = response.body;
                if (allow304 && response.statusCode === 304) {
                    body = null;
                }
                else if (!errorPassThrough && (response.statusCode < 200 || response.statusCode >= 300)) {
                    runningTimeout.cancel();
                    web_lib_esm_logger.throwError("bad response", lib_esm_Logger.errors.SERVER_ERROR, {
                        status: response.statusCode,
                        headers: response.headers,
                        body: bodyify(body, ((response.headers) ? response.headers["content-type"] : null)),
                        requestBody: bodyify(options.body, flatHeaders["content-type"]),
                        requestMethod: options.method,
                        url: url
                    });
                }
                if (processFunc) {
                    try {
                        const result = yield processFunc(body, response);
                        runningTimeout.cancel();
                        return result;
                    }
                    catch (error) {
                        // Allow the processFunc to trigger a throttle
                        if (error.throttleRetry && attempt < attemptLimit) {
                            let tryAgain = true;
                            if (throttleCallback) {
                                tryAgain = yield throttleCallback(attempt, url);
                            }
                            if (tryAgain) {
                                const timeout = throttleSlotInterval * parseInt(String(Math.random() * Math.pow(2, attempt)));
                                //console.log("Stalling callback");
                                yield staller(timeout);
                                continue;
                            }
                        }
                        runningTimeout.cancel();
                        web_lib_esm_logger.throwError("processing response error", lib_esm_Logger.errors.SERVER_ERROR, {
                            body: bodyify(body, ((response.headers) ? response.headers["content-type"] : null)),
                            error: error,
                            requestBody: bodyify(options.body, flatHeaders["content-type"]),
                            requestMethod: options.method,
                            url: url
                        });
                    }
                }
                runningTimeout.cancel();
                // If we had a processFunc, it either returned a T or threw above.
                // The "body" is now a Uint8Array.
                return body;
            }
            return web_lib_esm_logger.throwError("failed response", lib_esm_Logger.errors.SERVER_ERROR, {
                requestBody: bodyify(options.body, flatHeaders["content-type"]),
                requestMethod: options.method,
                url: url
            });
        });
    })();
    return Promise.race([runningTimeout.promise, runningFetch]);
}
function fetchJson(connection, json, processFunc) {
    let processJsonFunc = (value, response) => {
        let result = null;
        if (value != null) {
            try {
                result = JSON.parse(utf8_toUtf8String(value));
            }
            catch (error) {
                web_lib_esm_logger.throwError("invalid JSON", lib_esm_Logger.errors.SERVER_ERROR, {
                    body: value,
                    error: error
                });
            }
        }
        if (processFunc) {
            result = processFunc(result, response);
        }
        return result;
    };
    // If we have json to send, we must
    // - add content-type of application/json (unless already overridden)
    // - convert the json to bytes
    let body = null;
    if (json != null) {
        body = toUtf8Bytes(json);
        // Create a connection with the content-type set for JSON
        const updated = (typeof (connection) === "string") ? ({ url: connection }) : shallowCopy(connection);
        if (updated.headers) {
            const hasContentType = (Object.keys(updated.headers).filter((k) => (k.toLowerCase() === "content-type")).length) !== 0;
            if (!hasContentType) {
                updated.headers = shallowCopy(updated.headers);
                updated.headers["content-type"] = "application/json";
            }
        }
        else {
            updated.headers = { "content-type": "application/json" };
        }
        connection = updated;
    }
    return _fetchData(connection, body, processJsonFunc);
}
function poll(func, options) {
    if (!options) {
        options = {};
    }
    options = shallowCopy(options);
    if (options.floor == null) {
        options.floor = 0;
    }
    if (options.ceiling == null) {
        options.ceiling = 10000;
    }
    if (options.interval == null) {
        options.interval = 250;
    }
    return new Promise(function (resolve, reject) {
        let timer = null;
        let done = false;
        // Returns true if cancel was successful. Unsuccessful cancel means we're already done.
        const cancel = () => {
            if (done) {
                return false;
            }
            done = true;
            if (timer) {
                clearTimeout(timer);
            }
            return true;
        };
        if (options.timeout) {
            timer = setTimeout(() => {
                if (cancel()) {
                    reject(new Error("timeout"));
                }
            }, options.timeout);
        }
        const retryLimit = options.retryLimit;
        let attempt = 0;
        function check() {
            return func().then(function (result) {
                // If we have a result, or are allowed null then we're done
                if (result !== undefined) {
                    if (cancel()) {
                        resolve(result);
                    }
                }
                else if (options.oncePoll) {
                    options.oncePoll.once("poll", check);
                }
                else if (options.onceBlock) {
                    options.onceBlock.once("block", check);
                    // Otherwise, exponential back-off (up to 10s) our next request
                }
                else if (!done) {
                    attempt++;
                    if (attempt > retryLimit) {
                        if (cancel()) {
                            reject(new Error("retry limit reached"));
                        }
                        return;
                    }
                    let timeout = options.interval * parseInt(String(Math.random() * Math.pow(2, attempt)));
                    if (timeout < options.floor) {
                        timeout = options.floor;
                    }
                    if (timeout > options.ceiling) {
                        timeout = options.ceiling;
                    }
                    setTimeout(check, timeout);
                }
                return null;
            }, function (error) {
                if (cancel()) {
                    reject(error);
                }
            });
        }
        check();
    });
}
//# sourceMappingURL=index.js.map
;// CONCATENATED MODULE: ./node_modules/@ethersproject/abstract-provider/lib.esm/_version.js
const abstract_provider_lib_esm_version_version = "abstract-provider/5.7.0";
//# sourceMappingURL=_version.js.map
;// CONCATENATED MODULE: ./node_modules/@ethersproject/abstract-provider/lib.esm/index.js

var abstract_provider_lib_esm_awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};





const abstract_provider_lib_esm_logger = new lib_esm_Logger(abstract_provider_lib_esm_version_version);
;
;
//export type CallTransactionable = {
//    call(transaction: TransactionRequest): Promise<TransactionResponse>;
//};
class ForkEvent extends Description {
    static isForkEvent(value) {
        return !!(value && value._isForkEvent);
    }
}
class BlockForkEvent extends ForkEvent {
    constructor(blockHash, expiry) {
        if (!lib_esm_isHexString(blockHash, 32)) {
            abstract_provider_lib_esm_logger.throwArgumentError("invalid blockHash", "blockHash", blockHash);
        }
        super({
            _isForkEvent: true,
            _isBlockForkEvent: true,
            expiry: (expiry || 0),
            blockHash: blockHash
        });
    }
}
class TransactionForkEvent extends ForkEvent {
    constructor(hash, expiry) {
        if (!lib_esm_isHexString(hash, 32)) {
            abstract_provider_lib_esm_logger.throwArgumentError("invalid transaction hash", "hash", hash);
        }
        super({
            _isForkEvent: true,
            _isTransactionForkEvent: true,
            expiry: (expiry || 0),
            hash: hash
        });
    }
}
class TransactionOrderForkEvent extends ForkEvent {
    constructor(beforeHash, afterHash, expiry) {
        if (!lib_esm_isHexString(beforeHash, 32)) {
            abstract_provider_lib_esm_logger.throwArgumentError("invalid transaction hash", "beforeHash", beforeHash);
        }
        if (!lib_esm_isHexString(afterHash, 32)) {
            abstract_provider_lib_esm_logger.throwArgumentError("invalid transaction hash", "afterHash", afterHash);
        }
        super({
            _isForkEvent: true,
            _isTransactionOrderForkEvent: true,
            expiry: (expiry || 0),
            beforeHash: beforeHash,
            afterHash: afterHash
        });
    }
}
///////////////////////////////
// Exported Abstracts
class Provider {
    constructor() {
        abstract_provider_lib_esm_logger.checkAbstract(new.target, Provider);
        defineReadOnly(this, "_isProvider", true);
    }
    getFeeData() {
        return abstract_provider_lib_esm_awaiter(this, void 0, void 0, function* () {
            const { block, gasPrice } = yield resolveProperties({
                block: this.getBlock("latest"),
                gasPrice: this.getGasPrice().catch((error) => {
                    // @TODO: Why is this now failing on Calaveras?
                    //console.log(error);
                    return null;
                })
            });
            let lastBaseFeePerGas = null, maxFeePerGas = null, maxPriorityFeePerGas = null;
            if (block && block.baseFeePerGas) {
                // We may want to compute this more accurately in the future,
                // using the formula "check if the base fee is correct".
                // See: https://eips.ethereum.org/EIPS/eip-1559
                lastBaseFeePerGas = block.baseFeePerGas;
                maxPriorityFeePerGas = bignumber_BigNumber.from("1500000000");
                maxFeePerGas = block.baseFeePerGas.mul(2).add(maxPriorityFeePerGas);
            }
            return { lastBaseFeePerGas, maxFeePerGas, maxPriorityFeePerGas, gasPrice };
        });
    }
    // Alias for "on"
    addListener(eventName, listener) {
        return this.on(eventName, listener);
    }
    // Alias for "off"
    removeListener(eventName, listener) {
        return this.off(eventName, listener);
    }
    static isProvider(value) {
        return !!(value && value._isProvider);
    }
}
//# sourceMappingURL=index.js.map
;// CONCATENATED MODULE: ./node_modules/@ethersproject/basex/lib.esm/index.js
/**
 * var basex = require("base-x");
 *
 * This implementation is heavily based on base-x. The main reason to
 * deviate was to prevent the dependency of Buffer.
 *
 * Contributors:
 *
 * base-x encoding
 * Forked from https://github.com/cryptocoinjs/bs58
 * Originally written by Mike Hearn for BitcoinJ
 * Copyright (c) 2011 Google Inc
 * Ported to JavaScript by Stefan Thomas
 * Merged Buffer refactorings from base58-native by Stephen Pair
 * Copyright (c) 2013 BitPay Inc
 *
 * The MIT License (MIT)
 *
 * Copyright base-x contributors (c) 2016
 *
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.

 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 * IN THE SOFTWARE.
 *
 */


class BaseX {
    constructor(alphabet) {
        defineReadOnly(this, "alphabet", alphabet);
        defineReadOnly(this, "base", alphabet.length);
        defineReadOnly(this, "_alphabetMap", {});
        defineReadOnly(this, "_leader", alphabet.charAt(0));
        // pre-compute lookup table
        for (let i = 0; i < alphabet.length; i++) {
            this._alphabetMap[alphabet.charAt(i)] = i;
        }
    }
    encode(value) {
        let source = lib_esm_arrayify(value);
        if (source.length === 0) {
            return "";
        }
        let digits = [0];
        for (let i = 0; i < source.length; ++i) {
            let carry = source[i];
            for (let j = 0; j < digits.length; ++j) {
                carry += digits[j] << 8;
                digits[j] = carry % this.base;
                carry = (carry / this.base) | 0;
            }
            while (carry > 0) {
                digits.push(carry % this.base);
                carry = (carry / this.base) | 0;
            }
        }
        let string = "";
        // deal with leading zeros
        for (let k = 0; source[k] === 0 && k < source.length - 1; ++k) {
            string += this._leader;
        }
        // convert digits to a string
        for (let q = digits.length - 1; q >= 0; --q) {
            string += this.alphabet[digits[q]];
        }
        return string;
    }
    decode(value) {
        if (typeof (value) !== "string") {
            throw new TypeError("Expected String");
        }
        let bytes = [];
        if (value.length === 0) {
            return new Uint8Array(bytes);
        }
        bytes.push(0);
        for (let i = 0; i < value.length; i++) {
            let byte = this._alphabetMap[value[i]];
            if (byte === undefined) {
                throw new Error("Non-base" + this.base + " character");
            }
            let carry = byte;
            for (let j = 0; j < bytes.length; ++j) {
                carry += bytes[j] * this.base;
                bytes[j] = carry & 0xff;
                carry >>= 8;
            }
            while (carry > 0) {
                bytes.push(carry & 0xff);
                carry >>= 8;
            }
        }
        // deal with leading zeros
        for (let k = 0; value[k] === this._leader && k < value.length - 1; ++k) {
            bytes.push(0);
        }
        return lib_esm_arrayify(new Uint8Array(bytes.reverse()));
    }
}
const Base32 = new BaseX("abcdefghijklmnopqrstuvwxyz234567");
const Base58 = new BaseX("123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz");

//console.log(Base58.decode("Qmd2V777o5XvJbYMeMb8k2nU5f8d3ciUQ5YpYuWhzv8iDj"))
//console.log(Base58.encode(Base58.decode("Qmd2V777o5XvJbYMeMb8k2nU5f8d3ciUQ5YpYuWhzv8iDj")))
//# sourceMappingURL=index.js.map
;// CONCATENATED MODULE: ./node_modules/@ethersproject/constants/lib.esm/hashes.js
const HashZero = "0x0000000000000000000000000000000000000000000000000000000000000000";
//# sourceMappingURL=hashes.js.map
;// CONCATENATED MODULE: ./node_modules/@ethersproject/hash/lib.esm/ens-normalize/decoder.js
/**
 * MIT License
 *
 * Copyright (c) 2021 Andrew Raffensperger
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 * This is a near carbon-copy of the original source (link below) with the
 * TypeScript typings added and a few tweaks to make it ES3-compatible.
 *
 * See: https://github.com/adraffy/ens-normalize.js
 */
// https://github.com/behnammodi/polyfill/blob/master/array.polyfill.js
function flat(array, depth) {
    if (depth == null) {
        depth = 1;
    }
    const result = [];
    const forEach = result.forEach;
    const flatDeep = function (arr, depth) {
        forEach.call(arr, function (val) {
            if (depth > 0 && Array.isArray(val)) {
                flatDeep(val, depth - 1);
            }
            else {
                result.push(val);
            }
        });
    };
    flatDeep(array, depth);
    return result;
}
function fromEntries(array) {
    const result = {};
    for (let i = 0; i < array.length; i++) {
        const value = array[i];
        result[value[0]] = value[1];
    }
    return result;
}
function decode_arithmetic(bytes) {
    let pos = 0;
    function u16() { return (bytes[pos++] << 8) | bytes[pos++]; }
    // decode the frequency table
    let symbol_count = u16();
    let total = 1;
    let acc = [0, 1]; // first symbol has frequency 1
    for (let i = 1; i < symbol_count; i++) {
        acc.push(total += u16());
    }
    // skip the sized-payload that the last 3 symbols index into
    let skip = u16();
    let pos_payload = pos;
    pos += skip;
    let read_width = 0;
    let read_buffer = 0;
    function read_bit() {
        if (read_width == 0) {
            // this will read beyond end of buffer
            // but (undefined|0) => zero pad
            read_buffer = (read_buffer << 8) | bytes[pos++];
            read_width = 8;
        }
        return (read_buffer >> --read_width) & 1;
    }
    const N = 31;
    const FULL = Math.pow(2, N);
    const HALF = FULL >>> 1;
    const QRTR = HALF >> 1;
    const MASK = FULL - 1;
    // fill register
    let register = 0;
    for (let i = 0; i < N; i++)
        register = (register << 1) | read_bit();
    let symbols = [];
    let low = 0;
    let range = FULL; // treat like a float
    while (true) {
        let value = Math.floor((((register - low + 1) * total) - 1) / range);
        let start = 0;
        let end = symbol_count;
        while (end - start > 1) { // binary search
            let mid = (start + end) >>> 1;
            if (value < acc[mid]) {
                end = mid;
            }
            else {
                start = mid;
            }
        }
        if (start == 0)
            break; // first symbol is end mark
        symbols.push(start);
        let a = low + Math.floor(range * acc[start] / total);
        let b = low + Math.floor(range * acc[start + 1] / total) - 1;
        while (((a ^ b) & HALF) == 0) {
            register = (register << 1) & MASK | read_bit();
            a = (a << 1) & MASK;
            b = (b << 1) & MASK | 1;
        }
        while (a & ~b & QRTR) {
            register = (register & HALF) | ((register << 1) & (MASK >>> 1)) | read_bit();
            a = (a << 1) ^ HALF;
            b = ((b ^ HALF) << 1) | HALF | 1;
        }
        low = a;
        range = 1 + b - a;
    }
    let offset = symbol_count - 4;
    return symbols.map(x => {
        switch (x - offset) {
            case 3: return offset + 0x10100 + ((bytes[pos_payload++] << 16) | (bytes[pos_payload++] << 8) | bytes[pos_payload++]);
            case 2: return offset + 0x100 + ((bytes[pos_payload++] << 8) | bytes[pos_payload++]);
            case 1: return offset + bytes[pos_payload++];
            default: return x - 1;
        }
    });
}
// returns an iterator which returns the next symbol
function read_payload(v) {
    let pos = 0;
    return () => v[pos++];
}
function read_compressed_payload(bytes) {
    return read_payload(decode_arithmetic(bytes));
}
// eg. [0,1,2,3...] => [0,-1,1,-2,...]
function signed(i) {
    return (i & 1) ? (~i >> 1) : (i >> 1);
}
function read_counts(n, next) {
    let v = Array(n);
    for (let i = 0; i < n; i++)
        v[i] = 1 + next();
    return v;
}
function read_ascending(n, next) {
    let v = Array(n);
    for (let i = 0, x = -1; i < n; i++)
        v[i] = x += 1 + next();
    return v;
}
function read_deltas(n, next) {
    let v = Array(n);
    for (let i = 0, x = 0; i < n; i++)
        v[i] = x += signed(next());
    return v;
}
function read_member_array(next, lookup) {
    let v = read_ascending(next(), next);
    let n = next();
    let vX = read_ascending(n, next);
    let vN = read_counts(n, next);
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < vN[i]; j++) {
            v.push(vX[i] + j);
        }
    }
    return lookup ? v.map(x => lookup[x]) : v;
}
// returns array of 
// [x, ys] => single replacement rule
// [x, ys, n, dx, dx] => linear map
function read_mapped_map(next) {
    let ret = [];
    while (true) {
        let w = next();
        if (w == 0)
            break;
        ret.push(read_linear_table(w, next));
    }
    while (true) {
        let w = next() - 1;
        if (w < 0)
            break;
        ret.push(read_replacement_table(w, next));
    }
    return fromEntries(flat(ret));
}
function read_zero_terminated_array(next) {
    let v = [];
    while (true) {
        let i = next();
        if (i == 0)
            break;
        v.push(i);
    }
    return v;
}
function read_transposed(n, w, next) {
    let m = Array(n).fill(undefined).map(() => []);
    for (let i = 0; i < w; i++) {
        read_deltas(n, next).forEach((x, j) => m[j].push(x));
    }
    return m;
}
function read_linear_table(w, next) {
    let dx = 1 + next();
    let dy = next();
    let vN = read_zero_terminated_array(next);
    let m = read_transposed(vN.length, 1 + w, next);
    return flat(m.map((v, i) => {
        const x = v[0], ys = v.slice(1);
        //let [x, ...ys] = v;
        //return Array(vN[i]).fill().map((_, j) => {
        return Array(vN[i]).fill(undefined).map((_, j) => {
            let j_dy = j * dy;
            return [x + j * dx, ys.map(y => y + j_dy)];
        });
    }));
}
function read_replacement_table(w, next) {
    let n = 1 + next();
    let m = read_transposed(n, 1 + w, next);
    return m.map(v => [v[0], v.slice(1)]);
}
function read_emoji_trie(next) {
    let sorted = read_member_array(next).sort((a, b) => a - b);
    return read();
    function read() {
        let branches = [];
        while (true) {
            let keys = read_member_array(next, sorted);
            if (keys.length == 0)
                break;
            branches.push({ set: new Set(keys), node: read() });
        }
        branches.sort((a, b) => b.set.size - a.set.size); // sort by likelihood
        let temp = next();
        let valid = temp % 3;
        temp = (temp / 3) | 0;
        let fe0f = !!(temp & 1);
        temp >>= 1;
        let save = temp == 1;
        let check = temp == 2;
        return { branches, valid, fe0f, save, check };
    }
}
//# sourceMappingURL=decoder.js.map
;// CONCATENATED MODULE: ./node_modules/@ethersproject/hash/lib.esm/ens-normalize/include.js
/**
 * MIT License
 *
 * Copyright (c) 2021 Andrew Raffensperger
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 * This is a near carbon-copy of the original source (link below) with the
 * TypeScript typings added and a few tweaks to make it ES3-compatible.
 *
 * See: https://github.com/adraffy/ens-normalize.js
 */


function getData() {
    return read_compressed_payload(base64_decode('AEQF2AO2DEsA2wIrAGsBRABxAN8AZwCcAEwAqgA0AGwAUgByADcATAAVAFYAIQAyACEAKAAYAFgAGwAjABQAMAAmADIAFAAfABQAKwATACoADgAbAA8AHQAYABoAGQAxADgALAAoADwAEwA9ABMAGgARAA4ADwAWABMAFgAIAA8AHgQXBYMA5BHJAS8JtAYoAe4AExozi0UAH21tAaMnBT8CrnIyhrMDhRgDygIBUAEHcoFHUPe8AXBjAewCjgDQR8IICIcEcQLwATXCDgzvHwBmBoHNAqsBdBcUAykgDhAMShskMgo8AY8jqAQfAUAfHw8BDw87MioGlCIPBwZCa4ELatMAAMspJVgsDl8AIhckSg8XAHdvTwBcIQEiDT4OPhUqbyECAEoAS34Aej8Ybx83JgT/Xw8gHxZ/7w8RICxPHA9vBw+Pfw8PHwAPFv+fAsAvCc8vEr8ivwD/EQ8Bol8OEBa/A78hrwAPCU8vESNvvwWfHwNfAVoDHr+ZAAED34YaAdJPAK7PLwSEgDLHAGo1Pz8Pvx9fUwMrpb8O/58VTzAPIBoXIyQJNF8hpwIVAT8YGAUADDNBaX3RAMomJCg9EhUeA29MABsZBTMNJipjOhc19gcIDR8bBwQHEggCWi6DIgLuAQYA+BAFCha3A5XiAEsqM7UFFgFLhAMjFTMYE1Klnw74nRVBG/ASCm0BYRN/BrsU3VoWy+S0vV8LQx+vN8gF2AC2AK5EAWwApgYDKmAAroQ0NDQ0AT+OCg7wAAIHRAbpNgVcBV0APTA5BfbPFgMLzcYL/QqqA82eBALKCjQCjqYCht0/k2+OAsXQAoP3ASTKDgDw6ACKAUYCMpIKJpRaAE4A5womABzZvs0REEKiACIQAd5QdAECAj4Ywg/wGqY2AVgAYADYvAoCGAEubA0gvAY2ALAAbpbvqpyEAGAEpgQAJgAG7gAgAEACmghUFwCqAMpAINQIwC4DthRAAPcycKgApoIdABwBfCisABoATwBqASIAvhnSBP8aH/ECeAKXAq40NjgDBTwFYQU6AXs3oABgAD4XNgmcCY1eCl5tIFZeUqGgyoNHABgAEQAaABNwWQAmABMATPMa3T34ADldyprmM1M2XociUQgLzvwAXT3xABgAEQAaABNwIGFAnADD8AAgAD4BBJWzaCcIAIEBFMAWwKoAAdq9BWAF5wLQpALEtQAKUSGkahR4GnJM+gsAwCgeFAiUAECQ0BQuL8AAIAAAADKeIheclvFqQAAETr4iAMxIARMgAMIoHhQIAn0E0pDQFC4HhznoAAAAIAI2C0/4lvFqQAAETgBJJwYCAy4ABgYAFAA8MBKYEH4eRhTkAjYeFcgACAYAeABsOqyQ5gRwDayqugEgaIIAtgoACgDmEABmBAWGme5OBJJA2m4cDeoAmITWAXwrMgOgAGwBCh6CBXYF1Tzg1wKAAFdiuABRAFwAXQBsAG8AdgBrAHYAbwCEAHEwfxQBVE5TEQADVFhTBwBDANILAqcCzgLTApQCrQL6vAAMAL8APLhNBKkE6glGKTAU4Dr4N2EYEwBCkABKk8rHAbYBmwIoAiU4Ajf/Aq4CowCAANIChzgaNBsCsTgeODcFXrgClQKdAqQBiQGYAqsCsjTsNHsfNPA0ixsAWTWiOAMFPDQSNCk2BDZHNow2TTZUNhk28Jk9VzI3QkEoAoICoQKwAqcAQAAxBV4FXbS9BW47YkIXP1ciUqs05DS/FwABUwJW11e6nHuYZmSh/RAYA8oMKvZ8KASoUAJYWAJ6ILAsAZSoqjpgA0ocBIhmDgDWAAawRDQoAAcuAj5iAHABZiR2AIgiHgCaAU68ACxuHAG0ygM8MiZIAlgBdF4GagJqAPZOHAMuBgoATkYAsABiAHgAMLoGDPj0HpKEBAAOJgAuALggTAHWAeAMEDbd20Uege0ADwAWADkAQgA9OHd+2MUQZBBhBgNNDkxxPxUQArEPqwvqERoM1irQ090ANK4H8ANYB/ADWANYB/AH8ANYB/ADWANYA1gDWBwP8B/YxRBkD00EcgWTBZAE2wiIJk4RhgctCNdUEnQjHEwDSgEBIypJITuYMxAlR0wRTQgIATZHbKx9PQNMMbBU+pCnA9AyVDlxBgMedhKlAC8PeCE1uk6DekxxpQpQT7NX9wBFBgASqwAS5gBJDSgAUCwGPQBI4zTYABNGAE2bAE3KAExdGABKaAbgAFBXAFCOAFBJABI2SWdObALDOq0//QomCZhvwHdTBkIQHCemEPgMNAG2ATwN7kvZBPIGPATKH34ZGg/OlZ0Ipi3eDO4m5C6igFsj9iqEBe5L9TzeC05RaQ9aC2YJ5DpkgU8DIgEOIowK3g06CG4Q9ArKbA3mEUYHOgPWSZsApgcCCxIdNhW2JhFirQsKOXgG/Br3C5AmsBMqev0F1BoiBk4BKhsAANAu6IWxWjJcHU9gBgQLJiPIFKlQIQ0mQLh4SRocBxYlqgKSQ3FKiFE3HpQh9zw+DWcuFFF9B/Y8BhlQC4I8n0asRQ8R0z6OPUkiSkwtBDaALDAnjAnQD4YMunxzAVoJIgmyDHITMhEYN8YIOgcaLpclJxYIIkaWYJsE+KAD9BPSAwwFQAlCBxQDthwuEy8VKgUOgSXYAvQ21i60ApBWgQEYBcwPJh/gEFFH4Q7qCJwCZgOEJewALhUiABginAhEZABgj9lTBi7MCMhqbSN1A2gU6GIRdAeSDlgHqBw0FcAc4nDJXgyGCSiksAlcAXYJmgFgBOQICjVcjKEgQmdUi1kYnCBiQUBd/QIyDGYVoES+h3kCjA9sEhwBNgF0BzoNAgJ4Ee4RbBCWCOyGBTW2M/k6JgRQIYQgEgooA1BszwsoJvoM+WoBpBJjAw00PnfvZ6xgtyUX/gcaMsZBYSHyC5NPzgydGsIYQ1QvGeUHwAP0GvQn60FYBgADpAQUOk4z7wS+C2oIjAlAAEoOpBgH2BhrCnKM0QEyjAG4mgNYkoQCcJAGOAcMAGgMiAV65gAeAqgIpAAGANADWAA6Aq4HngAaAIZCAT4DKDABIuYCkAOUCDLMAZYwAfQqBBzEDBYA+DhuSwLDsgKAa2ajBd5ZAo8CSjYBTiYEBk9IUgOwcuIA3ABMBhTgSAEWrEvMG+REAeBwLADIAPwABjYHBkIBzgH0bgC4AWALMgmjtLYBTuoqAIQAFmwB2AKKAN4ANgCA8gFUAE4FWvoF1AJQSgESMhksWGIBvAMgATQBDgB6BsyOpsoIIARuB9QCEBwV4gLvLwe2AgMi4BPOQsYCvd9WADIXUu5eZwqoCqdeaAC0YTQHMnM9UQAPH6k+yAdy/BZIiQImSwBQ5gBQQzSaNTFWSTYBpwGqKQK38AFtqwBI/wK37gK3rQK3sAK6280C0gK33AK3zxAAUEIAUD9SklKDArekArw5AEQAzAHCO147WTteO1k7XjtZO147WTteO1kDmChYI03AVU0oJqkKbV9GYewMpw3VRMk6ShPcYFJgMxPJLbgUwhXPJVcZPhq9JwYl5VUKDwUt1GYxCC00dhe9AEApaYNCY4ceMQpMHOhTklT5LRwAskujM7ANrRsWREEFSHXuYisWDwojAmSCAmJDXE6wXDchAqH4AmiZAmYKAp+FOBwMAmY8AmYnBG8EgAN/FAN+kzkHOXgYOYM6JCQCbB4CMjc4CwJtyAJtr/CLADRoRiwBaADfAOIASwYHmQyOAP8MwwAOtgJ3MAJ2o0ACeUxEAni7Hl3cRa9G9AJ8QAJ6yQJ9CgJ88UgBSH5kJQAsFklZSlwWGErNAtECAtDNSygDiFADh+dExpEzAvKiXQQDA69Lz0wuJgTQTU1NsAKLQAKK2cIcCB5EaAa4Ao44Ao5dQZiCAo7aAo5deVG1UzYLUtVUhgKT/AKTDQDqAB1VH1WwVdEHLBwplocy4nhnRTw6ApegAu+zWCKpAFomApaQApZ9nQCqWa1aCoJOADwClrYClk9cRVzSApnMApllXMtdCBoCnJw5wzqeApwXAp+cAp65iwAeEDIrEAKd8gKekwC2PmE1YfACntQCoG8BqgKeoCACnk+mY8lkKCYsAiewAiZ/AqD8AqBN2AKmMAKlzwKoAAB+AqfzaH1osgAESmodatICrOQCrK8CrWgCrQMCVx4CVd0CseLYAx9PbJgCsr4OArLpGGzhbWRtSWADJc4Ctl08QG6RAylGArhfArlIFgK5K3hwN3DiAr0aAy2zAzISAr6JcgMDM3ICvhtzI3NQAsPMAsMFc4N0TDZGdOEDPKgDPJsDPcACxX0CxkgCxhGKAshqUgLIRQLJUALJLwJkngLd03h6YniveSZL0QMYpGcDAmH1GfSVJXsMXpNevBICz2wCz20wTFTT9BSgAMeuAs90ASrrA04TfkwGAtwoAtuLAtJQA1JdA1NgAQIDVY2AikABzBfuYUZ2AILPg44C2sgC2d+EEYRKpz0DhqYAMANkD4ZyWvoAVgLfZgLeuXR4AuIw7RUB8zEoAfScAfLTiALr9ALpcXoAAur6AurlAPpIAboC7ooC652Wq5cEAu5AA4XhmHpw4XGiAvMEAGoDjheZlAL3FAORbwOSiAL3mQL52gL4Z5odmqy8OJsfA52EAv77ARwAOp8dn7QDBY4DpmsDptoA0sYDBmuhiaIGCgMMSgFgASACtgNGAJwEgLpoBgC8BGzAEowcggCEDC6kdjoAJAM0C5IKRoABZCgiAIzw3AYBLACkfng9ogigkgNmWAN6AEQCvrkEVqTGAwCsBRbAA+4iQkMCHR072jI2PTbUNsk2RjY5NvA23TZKNiU3EDcZN5I+RTxDRTBCJkK5VBYKFhZfwQCWygU3AJBRHpu+OytgNxa61A40GMsYjsn7BVwFXQVcBV0FaAVdBVwFXQVcBV0FXAVdBVwFXUsaCNyKAK4AAQUHBwKU7oICoW1e7jAEzgPxA+YDwgCkBFDAwADABKzAAOxFLhitA1UFTDeyPkM+bj51QkRCuwTQWWQ8X+0AWBYzsACNA8xwzAGm7EZ/QisoCTAbLDs6fnLfb8H2GccsbgFw13M1HAVkBW/Jxsm9CNRO8E8FDD0FBQw9FkcClOYCoMFegpDfADgcMiA2AJQACB8AsigKAIzIEAJKeBIApY5yPZQIAKQiHb4fvj5BKSRPQrZCOz0oXyxgOywfKAnGbgMClQaCAkILXgdeCD9IIGUgQj5fPoY+dT52Ao5CM0dAX9BTVG9SDzFwWTQAbxBzJF/lOEIQQglCCkKJIAls5AcClQICoKPMODEFxhi6KSAbiyfIRrMjtCgdWCAkPlFBIitCsEJRzAbMAV/OEyQzDg0OAQQEJ36i328/Mk9AybDJsQlq3tDRApUKAkFzXf1d/j9uALYP6hCoFgCTGD8kPsFKQiobrm0+zj0KSD8kPnVCRBwMDyJRTHFgMTJa5rwXQiQ2YfI/JD7BMEJEHGINTw4TOFlIRzwJO0icMQpyPyQ+wzJCRBv6DVgnKB01NgUKj2bwYzMqCoBkznBgEF+zYDIocwRIX+NgHj4HICNfh2C4CwdwFWpTG/lgUhYGAwRfv2Ts8mAaXzVgml/XYIJfuWC4HI1gUF9pYJZgMR6ilQHMAOwLAlDRefC0in4AXAEJA6PjCwc0IamOANMMCAECRQDFNRTZBgd+CwQlRA+r6+gLBDEFBnwUBXgKATIArwAGRAAHA3cDdAN2A3kDdwN9A3oDdQN7A30DfAN4A3oDfQAYEAAlAtYASwMAUAFsAHcKAHcAmgB3AHUAdQB2AHVu8UgAygDAAHcAdQB1AHYAdQALCgB3AAsAmgB3AAsCOwB3AAtu8UgAygDAAHgKAJoAdwB3AHUAdQB2AHUAeAB1AHUAdgB1bvFIAMoAwAALCgCaAHcACwB3AAsCOwB3AAtu8UgAygDAAH4ACwGgALcBpwC6AahdAu0COwLtbvFIAMoAwAALCgCaAu0ACwLtAAsCOwLtAAtu8UgAygDAA24ACwNvAAu0VsQAAzsAABCkjUIpAAsAUIusOggWcgMeBxVsGwL67U/2HlzmWOEeOgALASvuAAseAfpKUpnpGgYJDCIZM6YyARUE9ThqAD5iXQgnAJYJPnOzw0ZAEZxEKsIAkA4DhAHnTAIDxxUDK0lxCQlPYgIvIQVYJQBVqE1GakUAKGYiDToSBA1EtAYAXQJYAIF8GgMHRyAAIAjOe9YncekRAA0KACUrjwE7Ayc6AAYWAqaiKG4McEcqANoN3+Mg9TwCBhIkuCny+JwUQ29L008JluRxu3K+oAdqiHOqFH0AG5SUIfUJ5SxCGfxdipRzqTmT4V5Zb+r1Uo4Vm+NqSSEl2mNvR2JhIa8SpYO6ntdwFXHCWTCK8f2+Hxo7uiG3drDycAuKIMP5bhi06ACnqArH1rz4Rqg//lm6SgJGEVbF9xJHISaR6HxqxSnkw6shDnelHKNEfGUXSJRJ1GcsmtJw25xrZMDK9gXSm1/YMkdX4/6NKYOdtk/NQ3/NnDASjTc3fPjIjW/5sVfVObX2oTDWkr1dF9f3kxBsD3/3aQO8hPfRz+e0uEiJqt1161griu7gz8hDDwtpy+F+BWtefnKHZPAxcZoWbnznhJpy0e842j36bcNzGnIEusgGX0a8ZxsnjcSsPDZ09yZ36fCQbriHeQ72JRMILNl6ePPf2HWoVwgWAm1fb3V2sAY0+B6rAXqSwPBgseVmoqsBTSrm91+XasMYYySI8eeRxH3ZvHkMz3BQ5aJ3iUVbYPNM3/7emRtjlsMgv/9VyTsyt/mK+8fgWeT6SoFaclXqn42dAIsvAarF5vNNWHzKSkKQ/8Hfk5ZWK7r9yliOsooyBjRhfkHP4Q2DkWXQi6FG/9r/IwbmkV5T7JSopHKn1pJwm9tb5Ot0oyN1Z2mPpKXHTxx2nlK08fKk1hEYA8WgVVWL5lgx0iTv+KdojJeU23ZDjmiubXOxVXJKKi2Wjuh2HLZOFLiSC7Tls5SMh4f+Pj6xUSrNjFqLGehRNB8lC0QSLNmkJJx/wSG3MnjE9T1CkPwJI0wH2lfzwETIiVqUxg0dfu5q39Gt+hwdcxkhhNvQ4TyrBceof3Mhs/IxFci1HmHr4FMZgXEEczPiGCx0HRwzAqDq2j9AVm1kwN0mRVLWLylgtoPNapF5cY4Y1wJh/e0BBwZj44YgZrDNqvD/9Hv7GFYdUQeDJuQ3EWI4HaKqavU1XjC/n41kT4L79kqGq0kLhdTZvgP3TA3fS0ozVz+5piZsoOtIvBUFoMKbNcmBL6YxxaUAusHB38XrS8dQMnQwJfUUkpRoGr5AUeWicvBTzyK9g77+yCkf5PAysL7r/JjcZgrbvRpMW9iyaxZvKO6ceZN2EwIxKwVFPuvFuiEPGCoagbMo+SpydLrXqBzNCDGFCrO/rkcwa2xhokQZ5CdZ0AsU3JfSqJ6n5I14YA+P/uAgfhPU84Tlw7cEFfp7AEE8ey4sP12PTt4Cods1GRgDOB5xvyiR5m+Bx8O5nBCNctU8BevfV5A08x6RHd5jcwPTMDSZJOedIZ1cGQ704lxbAzqZOP05ZxaOghzSdvFBHYqomATARyAADK4elP8Ly3IrUZKfWh23Xy20uBUmLS4Pfagu9+oyVa2iPgqRP3F2CTUsvJ7+RYnN8fFZbU/HVvxvcFFDKkiTqV5UBZ3Gz54JAKByi9hkKMZJvuGgcSYXFmw08UyoQyVdfTD1/dMkCHXcTGAKeROgArsvmRrQTLUOXioOHGK2QkjHuoYFgXciZoTJd6Fs5q1QX1G+p/e26hYsEf7QZD1nnIyl/SFkNtYYmmBhpBrxl9WbY0YpHWRuw2Ll/tj9mD8P4snVzJl4F9J+1arVeTb9E5r2ILH04qStjxQNwn3m4YNqxmaNbLAqW2TN6LidwuJRqS+NXbtqxoeDXpxeGWmxzSkWxjkyCkX4NQRme6q5SAcC+M7+9ETfA/EwrzQajKakCwYyeunP6ZFlxU2oMEn1Pz31zeStW74G406ZJFCl1wAXIoUKkWotYEpOuXB1uVNxJ63dpJEqfxBeptwIHNrPz8BllZoIcBoXwgfJ+8VAUnVPvRvexnw0Ma/WiGYuJO5y8QTvEYBigFmhUxY5RqzE8OcywN/8m4UYrlaniJO75XQ6KSo9+tWHlu+hMi0UVdiKQp7NelnoZUzNaIyBPVeOwK6GNp+FfHuPOoyhaWuNvTYFkvxscMQWDh+zeFCFkgwbXftiV23ywJ4+uwRqmg9k3KzwIQpzppt8DBBOMbrqwQM5Gb05sEwdKzMiAqOloaA/lr0KA+1pr0/+HiWoiIjHA/wir2nIuS3PeU/ji3O6ZwoxcR1SZ9FhtLC5S0FIzFhbBWcGVP/KpxOPSiUoAdWUpqKH++6Scz507iCcxYI6rdMBICPJZea7OcmeFw5mObJSiqpjg2UoWNIs+cFhyDSt6geV5qgi3FunmwwDoGSMgerFOZGX1m0dMCYo5XOruxO063dwENK9DbnVM9wYFREzh4vyU1WYYJ/LRRp6oxgjqP/X5a8/4Af6p6NWkQferzBmXme0zY/4nwMJm/wd1tIqSwGz+E3xPEAOoZlJit3XddD7/BT1pllzOx+8bmQtANQ/S6fZexc6qi3W+Q2xcmXTUhuS5mpHQRvcxZUN0S5+PL9lXWUAaRZhEH8hTdAcuNMMCuVNKTEGtSUKNi3O6KhSaTzck8csZ2vWRZ+d7mW8c4IKwXIYd25S/zIftPkwPzufjEvOHWVD1m+FjpDVUTV0DGDuHj6QnaEwLu/dEgdLQOg9E1Sro9XHJ8ykLAwtPu+pxqKDuFexqON1sKQm7rwbE1E68UCfA/erovrTCG+DBSNg0l4goDQvZN6uNlbyLpcZAwj2UclycvLpIZMgv4yRlpb3YuMftozorbcGVHt/VeDV3+Fdf1TP0iuaCsPi2G4XeGhsyF1ubVDxkoJhmniQ0/jSg/eYML9KLfnCFgISWkp91eauR3IQvED0nAPXK+6hPCYs+n3+hCZbiskmVMG2da+0EsZPonUeIY8EbfusQXjsK/eFDaosbPjEfQS0RKG7yj5GG69M7MeO1HmiUYocgygJHL6M1qzUDDwUSmr99V7Sdr2F3JjQAJY+F0yH33Iv3+C9M38eML7gTgmNu/r2bUMiPvpYbZ6v1/IaESirBHNa7mPKn4dEmYg7v/+HQgPN1G79jBQ1+soydfDC2r+h2Bl/KIc5KjMK7OH6nb1jLsNf0EHVe2KBiE51ox636uyG6Lho0t3J34L5QY/ilE3mikaF4HKXG1mG1rCevT1Vv6GavltxoQe/bMrpZvRggnBxSEPEeEzkEdOxTnPXHVjUYdw8JYvjB/o7Eegc3Ma+NUxLLnsK0kJlinPmUHzHGtrk5+CAbVzFOBqpyy3QVUnzTDfC/0XD94/okH+OB+i7g9lolhWIjSnfIb+Eq43ZXOWmwvjyV/qqD+t0e+7mTEM74qP/Ozt8nmC7mRpyu63OB4KnUzFc074SqoyPUAgM+/TJGFo6T44EHnQU4X4z6qannVqgw/U7zCpwcmXV1AubIrvOmkKHazJAR55ePjp5tLBsN8vAqs3NAHdcEHOR2xQ0lsNAFzSUuxFQCFYvXLZJdOj9p4fNq6p0HBGUik2YzaI4xySy91KzhQ0+q1hjxvImRwPRf76tChlRkhRCi74NXZ9qUNeIwP+s5p+3m5nwPdNOHgSLD79n7O9m1n1uDHiMntq4nkYwV5OZ1ENbXxFd4PgrlvavZsyUO4MqYlqqn1O8W/I1dEZq5dXhrbETLaZIbC2Kj/Aa/QM+fqUOHdf0tXAQ1huZ3cmWECWSXy/43j35+Mvq9xws7JKseriZ1pEWKc8qlzNrGPUGcVgOa9cPJYIJsGnJTAUsEcDOEVULO5x0rXBijc1lgXEzQQKhROf8zIV82w8eswc78YX11KYLWQRcgHNJElBxfXr72lS2RBSl07qTKorO2uUDZr3sFhYsvnhLZn0A94KRzJ/7DEGIAhW5ZWFpL8gEwu1aLA9MuWZzNwl8Oze9Y+bX+v9gywRVnoB5I/8kXTXU3141yRLYrIOOz6SOnyHNy4SieqzkBXharjfjqq1q6tklaEbA8Qfm2DaIPs7OTq/nvJBjKfO2H9bH2cCMh1+5gspfycu8f/cuuRmtDjyqZ7uCIMyjdV3a+p3fqmXsRx4C8lujezIFHnQiVTXLXuI1XrwN3+siYYj2HHTvESUx8DlOTXpak9qFRK+L3mgJ1WsD7F4cu1aJoFoYQnu+wGDMOjJM3kiBQWHCcvhJ/HRdxodOQp45YZaOTA22Nb4XKCVxqkbwMYFhzYQYIAnCW8FW14uf98jhUG2zrKhQQ0q0CEq0t5nXyvUyvR8DvD69LU+g3i+HFWQMQ8PqZuHD+sNKAV0+M6EJC0szq7rEr7B5bQ8BcNHzvDMc9eqB5ZCQdTf80Obn4uzjwpYU7SISdtV0QGa9D3Wrh2BDQtpBKxaNFV+/Cy2P/Sv+8s7Ud0Fd74X4+o/TNztWgETUapy+majNQ68Lq3ee0ZO48VEbTZYiH1Co4OlfWef82RWeyUXo7woM03PyapGfikTnQinoNq5z5veLpeMV3HCAMTaZmA1oGLAn7XS3XYsz+XK7VMQsc4XKrmDXOLU/pSXVNUq8dIqTba///3x6LiLS6xs1xuCAYSfcQ3+rQgmu7uvf3THKt5Ooo97TqcbRqxx7EASizaQCBQllG/rYxVapMLgtLbZS64w1MDBMXX+PQpBKNwqUKOf2DDRDUXQf9EhOS0Qj4nTmlA8dzSLz/G1d+Ud8MTy/6ghhdiLpeerGY/UlDOfiuqFsMUU5/UYlP+BAmgRLuNpvrUaLlVkrqDievNVEAwF+4CoM1MZTmjxjJMsKJq+u8Zd7tNCUFy6LiyYXRJQ4VyvEQFFaCGKsxIwQkk7EzZ6LTJq2hUuPhvAW+gQnSG6J+MszC+7QCRHcnqDdyNRJ6T9xyS87A6MDutbzKGvGktpbXqtzWtXb9HsfK2cBMomjN9a4y+TaJLnXxAeX/HWzmf4cR4vALt/P4w4qgKY04ml4ZdLOinFYS6cup3G/1ie4+t1eOnpBNlqGqs75ilzkT4+DsZQxNvaSKJ//6zIbbk/M7LOhFmRc/1R+kBtz7JFGdZm/COotIdvQoXpTqP/1uqEUmCb/QWoGLMwO5ANcHzxdY48IGP5+J+zKOTBFZ4Pid+GTM+Wq12MV/H86xEJptBa6T+p3kgpwLedManBHC2GgNrFpoN2xnrMz9WFWX/8/ygSBkavq2Uv7FdCsLEYLu9LLIvAU0bNRDtzYl+/vXmjpIvuJFYjmI0im6QEYqnIeMsNjXG4vIutIGHijeAG/9EDBozKV5cldkHbLxHh25vT+ZEzbhXlqvpzKJwcEgfNwLAKFeo0/pvEE10XDB+EXRTXtSzJozQKFFAJhMxYkVaCW+E9AL7tMeU8acxidHqzb6lX4691UsDpy/LLRmT+epgW56+5Cw8tB4kMUv6s9lh3eRKbyGs+H/4mQMaYzPTf2OOdokEn+zzgvoD3FqNKk8QqGAXVsqcGdXrT62fSPkR2vROFi68A6se86UxRUk4cajfPyCC4G5wDhD+zNq4jodQ4u4n/m37Lr36n4LIAAsVr02dFi9AiwA81MYs2rm4eDlDNmdMRvEKRHfBwW5DdMNp0jPFZMeARqF/wL4XBfd+EMLBfMzpH5GH6NaW+1vrvMdg+VxDzatk3MXgO3ro3P/DpcC6+Mo4MySJhKJhSR01SGGGp5hPWmrrUgrv3lDnP+HhcI3nt3YqBoVAVTBAQT5iuhTg8nvPtd8ZeYj6w1x6RqGUBrSku7+N1+BaasZvjTk64RoIDlL8brpEcJx3OmY7jLoZsswdtmhfC/G21llXhITOwmvRDDeTTPbyASOa16cF5/A1fZAidJpqju3wYAy9avPR1ya6eNp9K8XYrrtuxlqi+bDKwlfrYdR0RRiKRVTLOH85+ZY7XSmzRpfZBJjaTa81VDcJHpZnZnSQLASGYW9l51ZV/h7eVzTi3Hv6hUsgc/51AqJRTkpbFVLXXszoBL8nBX0u/0jBLT8nH+fJePbrwURT58OY+UieRjd1vs04w0VG5VN2U6MoGZkQzKN/ptz0Q366dxoTGmj7i1NQGHi9GgnquXFYdrCfZBmeb7s0T6yrdlZH5cZuwHFyIJ/kAtGsTg0xH5taAAq44BAk1CPk9KVVbqQzrCUiFdF/6gtlPQ8bHHc1G1W92MXGZ5HEHftyLYs8mbD/9xYRUWkHmlM0zC2ilJlnNgV4bfALpQghxOUoZL7VTqtCHIaQSXm+YUMnpkXybnV+A6xlm2CVy8fn0Xlm2XRa0+zzOa21JWWmixfiPMSCZ7qA4rS93VN3pkpF1s5TonQjisHf7iU9ZGvUPOAKZcR1pbeVf/Ul7OhepGCaId9wOtqo7pJ7yLcBZ0pFkOF28y4zEI/kcUNmutBHaQpBdNM8vjCS6HZRokkeo88TBAjGyG7SR+6vUgTcyK9Imalj0kuxz0wmK+byQU11AiJFk/ya5dNduRClcnU64yGu/ieWSeOos1t3ep+RPIWQ2pyTYVbZltTbsb7NiwSi3AV+8KLWk7LxCnfZUetEM8ThnsSoGH38/nyAwFguJp8FjvlHtcWZuU4hPva0rHfr0UhOOJ/F6vS62FW7KzkmRll2HEc7oUq4fyi5T70Vl7YVIfsPHUCdHesf9Lk7WNVWO75JDkYbMI8TOW8JKVtLY9d6UJRITO8oKo0xS+o99Yy04iniGHAaGj88kEWgwv0OrHdY/nr76DOGNS59hXCGXzTKUvDl9iKpLSWYN1lxIeyywdNpTkhay74w2jFT6NS8qkjo5CxA1yfSYwp6AJIZNKIeEK5PJAW7ORgWgwp0VgzYpqovMrWxbu+DGZ6Lhie1RAqpzm8VUzKJOH3mCzWuTOLsN3VT/dv2eeYe9UjbR8YTBsLz7q60VN1sU51k+um1f8JxD5pPhbhSC8rRaB454tmh6YUWrJI3+GWY0qeWioj/tbkYITOkJaeuGt4JrJvHA+l0Gu7kY7XOaa05alMnRWVCXqFgLIwSY4uF59Ue5SU4QKuc/HamDxbr0x6csCetXGoP7Qn1Bk/J9DsynO/UD6iZ1Hyrz+jit0hDCwi/E9OjgKTbB3ZQKQ/0ZOvevfNHG0NK4Aj3Cp7NpRk07RT1i/S0EL93Ag8GRgKI9CfpajKyK6+Jj/PI1KO5/85VAwz2AwzP8FTBb075IxCXv6T9RVvWT2tUaqxDS92zrGUbWzUYk9mSs82pECH+fkqsDt93VW++4YsR/dHCYcQSYTO/KaBMDj9LSD/J/+z20Kq8XvZUAIHtm9hRPP3ItbuAu2Hm5lkPs92pd7kCxgRs0xOVBnZ13ccdA0aunrwv9SdqElJRC3g+oCu+nXyCgmXUs9yMjTMAIHfxZV+aPKcZeUBWt057Xo85Ks1Ir5gzEHCWqZEhrLZMuF11ziGtFQUds/EESajhagzcKsxamcSZxGth4UII+adPhQkUnx2WyN+4YWR+r3f8MnkyGFuR4zjzxJS8WsQYR5PTyRaD9ixa6Mh741nBHbzfjXHskGDq179xaRNrCIB1z1xRfWfjqw2pHc1zk9xlPpL8sQWAIuETZZhbnmL54rceXVNRvUiKrrqIkeogsl0XXb17ylNb0f4GA9Wd44vffEG8FSZGHEL2fbaTGRcSiCeA8PmA/f6Hz8HCS76fXUHwgwkzSwlI71ekZ7Fapmlk/KC+Hs8hUcw3N2LN5LhkVYyizYFl/uPeVP5lsoJHhhfWvvSWruCUW1ZcJOeuTbrDgywJ/qG07gZJplnTvLcYdNaH0KMYOYMGX+rB4NGPFmQsNaIwlWrfCezxre8zXBrsMT+edVLbLqN1BqB76JH4BvZTqUIMfGwPGEn+EnmTV86fPBaYbFL3DFEhjB45CewkXEAtJxk4/Ms2pPXnaRqdky0HOYdcUcE2zcXq4vaIvW2/v0nHFJH2XXe22ueDmq/18XGtELSq85j9X8q0tcNSSKJIX8FTuJF/Pf8j5PhqG2u+osvsLxYrvvfeVJL+4tkcXcr9JV7v0ERmj/X6fM3NC4j6dS1+9Umr2oPavqiAydTZPLMNRGY23LO9zAVDly7jD+70G5TPPLdhRIl4WxcYjLnM+SNcJ26FOrkrISUtPObIz5Zb3AG612krnpy15RMW+1cQjlnWFI6538qky9axd2oJmHIHP08KyP0ubGO+TQNOYuv2uh17yCIvR8VcStw7o1g0NM60sk+8Tq7YfIBJrtp53GkvzXH7OA0p8/n/u1satf/VJhtR1l8Wa6Gmaug7haSpaCaYQax6ta0mkutlb+eAOSG1aobM81D9A4iS1RRlzBBoVX6tU1S6WE2N9ORY6DfeLRC4l9Rvr5h95XDWB2mR1d4WFudpsgVYwiTwT31ljskD8ZyDOlm5DkGh9N/UB/0AI5Xvb8ZBmai2hQ4BWMqFwYnzxwB26YHSOv9WgY3JXnvoN+2R4rqGVh/LLDMtpFP+SpMGJNWvbIl5SOodbCczW2RKleksPoUeGEzrjtKHVdtZA+kfqO+rVx/iclCqwoopepvJpSTDjT+b9GWylGRF8EDbGlw6eUzmJM95Ovoz+kwLX3c2fTjFeYEsE7vUZm3mqdGJuKh2w9/QGSaqRHs99aScGOdDqkFcACoqdbBoQqqjamhH6Q9ng39JCg3lrGJwd50Qk9ovnqBTr8MME7Ps2wiVfygUmPoUBJJfJWX5Nda0nuncbFkA=='));
}
//# sourceMappingURL=include.js.map
;// CONCATENATED MODULE: ./node_modules/@ethersproject/hash/lib.esm/ens-normalize/lib.js
/**
 * MIT License
 *
 * Copyright (c) 2021 Andrew Raffensperger
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 * This is a near carbon-copy of the original source (link below) with the
 * TypeScript typings added and a few tweaks to make it ES3-compatible.
 *
 * See: https://github.com/adraffy/ens-normalize.js
 */


const r = getData();

// @TODO: This should be lazily loaded
const VALID = new Set(read_member_array(r));
const IGNORED = new Set(read_member_array(r));
const MAPPED = read_mapped_map(r);
const EMOJI_ROOT = read_emoji_trie(r);
//const NFC_CHECK = new Set(read_member_array(r, Array.from(VALID.values()).sort((a, b) => a - b)));
//const STOP = 0x2E;
const HYPHEN = 0x2D;
const UNDERSCORE = 0x5F;
function explode_cp(name) {
    return toUtf8CodePoints(name);
}
function filter_fe0f(cps) {
    return cps.filter(cp => cp != 0xFE0F);
}
function ens_normalize_post_check(name) {
    for (let label of name.split('.')) {
        let cps = explode_cp(label);
        try {
            for (let i = cps.lastIndexOf(UNDERSCORE) - 1; i >= 0; i--) {
                if (cps[i] !== UNDERSCORE) {
                    throw new Error(`underscore only allowed at start`);
                }
            }
            if (cps.length >= 4 && cps.every(cp => cp < 0x80) && cps[2] === HYPHEN && cps[3] === HYPHEN) {
                throw new Error(`invalid label extension`);
            }
        }
        catch (err) {
            throw new Error(`Invalid label "${label}": ${err.message}`);
        }
    }
    return name;
}
function ens_normalize(name) {
    return ens_normalize_post_check(normalize(name, filter_fe0f));
}
function normalize(name, emoji_filter) {
    let input = explode_cp(name).reverse(); // flip for pop
    let output = [];
    while (input.length) {
        let emoji = consume_emoji_reversed(input);
        if (emoji) {
            output.push(...emoji_filter(emoji));
            continue;
        }
        let cp = input.pop();
        if (VALID.has(cp)) {
            output.push(cp);
            continue;
        }
        if (IGNORED.has(cp)) {
            continue;
        }
        let cps = MAPPED[cp];
        if (cps) {
            output.push(...cps);
            continue;
        }
        throw new Error(`Disallowed codepoint: 0x${cp.toString(16).toUpperCase()}`);
    }
    return ens_normalize_post_check(nfc(String.fromCodePoint(...output)));
}
function nfc(s) {
    return s.normalize('NFC');
}
function consume_emoji_reversed(cps, eaten) {
    var _a;
    let node = EMOJI_ROOT;
    let emoji;
    let saved;
    let stack = [];
    let pos = cps.length;
    if (eaten)
        eaten.length = 0; // clear input buffer (if needed)
    while (pos) {
        let cp = cps[--pos];
        node = (_a = node.branches.find(x => x.set.has(cp))) === null || _a === void 0 ? void 0 : _a.node;
        if (!node)
            break;
        if (node.save) { // remember
            saved = cp;
        }
        else if (node.check) { // check exclusion
            if (cp === saved)
                break;
        }
        stack.push(cp);
        if (node.fe0f) {
            stack.push(0xFE0F);
            if (pos > 0 && cps[pos - 1] == 0xFE0F)
                pos--; // consume optional FE0F
        }
        if (node.valid) { // this is a valid emoji (so far)
            emoji = stack.slice(); // copy stack
            if (node.valid == 2)
                emoji.splice(1, 1); // delete FE0F at position 1 (RGI ZWJ don't follow spec!)
            if (eaten)
                eaten.push(...cps.slice(pos).reverse()); // copy input (if needed)
            cps.length = pos; // truncate
        }
    }
    return emoji;
}
//# sourceMappingURL=lib.js.map
;// CONCATENATED MODULE: ./node_modules/@ethersproject/hash/lib.esm/namehash.js





const namehash_logger = new lib_esm_Logger(hash_lib_esm_version_version);

const Zeros = new Uint8Array(32);
Zeros.fill(0);
function checkComponent(comp) {
    if (comp.length === 0) {
        throw new Error("invalid ENS name; empty component");
    }
    return comp;
}
function ensNameSplit(name) {
    const bytes = toUtf8Bytes(ens_normalize(name));
    const comps = [];
    if (name.length === 0) {
        return comps;
    }
    let last = 0;
    for (let i = 0; i < bytes.length; i++) {
        const d = bytes[i];
        // A separator (i.e. "."); copy this component
        if (d === 0x2e) {
            comps.push(checkComponent(bytes.slice(last, i)));
            last = i + 1;
        }
    }
    // There was a stray separator at the end of the name
    if (last >= bytes.length) {
        throw new Error("invalid ENS name; empty component");
    }
    comps.push(checkComponent(bytes.slice(last)));
    return comps;
}
function ensNormalize(name) {
    return ensNameSplit(name).map((comp) => toUtf8String(comp)).join(".");
}
function isValidName(name) {
    try {
        return (ensNameSplit(name).length !== 0);
    }
    catch (error) { }
    return false;
}
function namehash(name) {
    /* istanbul ignore if */
    if (typeof (name) !== "string") {
        namehash_logger.throwArgumentError("invalid ENS name; not a string", "name", name);
    }
    let result = Zeros;
    const comps = ensNameSplit(name);
    while (comps.length) {
        result = lib_esm_keccak256(lib_esm_concat([result, lib_esm_keccak256(comps.pop())]));
    }
    return lib_esm_hexlify(result);
}
function dnsEncode(name) {
    return lib_esm_hexlify(lib_esm_concat(ensNameSplit(name).map((comp) => {
        // DNS does not allow components over 63 bytes in length
        if (comp.length > 63) {
            throw new Error("invalid DNS encoded entry; length exceeds 63 bytes");
        }
        const bytes = new Uint8Array(comp.length + 1);
        bytes.set(comp, 1);
        bytes[0] = bytes.length - 1;
        return bytes;
    }))) + "00";
}
//# sourceMappingURL=namehash.js.map
;// CONCATENATED MODULE: ./node_modules/@ethersproject/networks/lib.esm/_version.js
const networks_lib_esm_version_version = "networks/5.7.1";
//# sourceMappingURL=_version.js.map
;// CONCATENATED MODULE: ./node_modules/@ethersproject/networks/lib.esm/index.js



const networks_lib_esm_logger = new lib_esm_Logger(networks_lib_esm_version_version);
;
function isRenetworkable(value) {
    return (value && typeof (value.renetwork) === "function");
}
function ethDefaultProvider(network) {
    const func = function (providers, options) {
        if (options == null) {
            options = {};
        }
        const providerList = [];
        if (providers.InfuraProvider && options.infura !== "-") {
            try {
                providerList.push(new providers.InfuraProvider(network, options.infura));
            }
            catch (error) { }
        }
        if (providers.EtherscanProvider && options.etherscan !== "-") {
            try {
                providerList.push(new providers.EtherscanProvider(network, options.etherscan));
            }
            catch (error) { }
        }
        if (providers.AlchemyProvider && options.alchemy !== "-") {
            try {
                providerList.push(new providers.AlchemyProvider(network, options.alchemy));
            }
            catch (error) { }
        }
        if (providers.PocketProvider && options.pocket !== "-") {
            // These networks are currently faulty on Pocket as their
            // network does not handle the Berlin hardfork, which is
            // live on these ones.
            // @TODO: This goes away once Pocket has upgraded their nodes
            const skip = ["goerli", "ropsten", "rinkeby", "sepolia"];
            try {
                const provider = new providers.PocketProvider(network, options.pocket);
                if (provider.network && skip.indexOf(provider.network.name) === -1) {
                    providerList.push(provider);
                }
            }
            catch (error) { }
        }
        if (providers.CloudflareProvider && options.cloudflare !== "-") {
            try {
                providerList.push(new providers.CloudflareProvider(network));
            }
            catch (error) { }
        }
        if (providers.AnkrProvider && options.ankr !== "-") {
            try {
                const skip = ["ropsten"];
                const provider = new providers.AnkrProvider(network, options.ankr);
                if (provider.network && skip.indexOf(provider.network.name) === -1) {
                    providerList.push(provider);
                }
            }
            catch (error) { }
        }
        if (providerList.length === 0) {
            return null;
        }
        if (providers.FallbackProvider) {
            let quorum = 1;
            if (options.quorum != null) {
                quorum = options.quorum;
            }
            else if (network === "homestead") {
                quorum = 2;
            }
            return new providers.FallbackProvider(providerList, quorum);
        }
        return providerList[0];
    };
    func.renetwork = function (network) {
        return ethDefaultProvider(network);
    };
    return func;
}
function etcDefaultProvider(url, network) {
    const func = function (providers, options) {
        if (providers.JsonRpcProvider) {
            return new providers.JsonRpcProvider(url, network);
        }
        return null;
    };
    func.renetwork = function (network) {
        return etcDefaultProvider(url, network);
    };
    return func;
}
const homestead = {
    chainId: 1,
    ensAddress: "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e",
    name: "homestead",
    _defaultProvider: ethDefaultProvider("homestead")
};
const ropsten = {
    chainId: 3,
    ensAddress: "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e",
    name: "ropsten",
    _defaultProvider: ethDefaultProvider("ropsten")
};
const classicMordor = {
    chainId: 63,
    name: "classicMordor",
    _defaultProvider: etcDefaultProvider("https://www.ethercluster.com/mordor", "classicMordor")
};
// See: https://chainlist.org
const networks = {
    unspecified: { chainId: 0, name: "unspecified" },
    homestead: homestead,
    mainnet: homestead,
    morden: { chainId: 2, name: "morden" },
    ropsten: ropsten,
    testnet: ropsten,
    rinkeby: {
        chainId: 4,
        ensAddress: "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e",
        name: "rinkeby",
        _defaultProvider: ethDefaultProvider("rinkeby")
    },
    kovan: {
        chainId: 42,
        name: "kovan",
        _defaultProvider: ethDefaultProvider("kovan")
    },
    goerli: {
        chainId: 5,
        ensAddress: "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e",
        name: "goerli",
        _defaultProvider: ethDefaultProvider("goerli")
    },
    kintsugi: { chainId: 1337702, name: "kintsugi" },
    sepolia: {
        chainId: 11155111,
        name: "sepolia",
        _defaultProvider: ethDefaultProvider("sepolia")
    },
    // ETC (See: #351)
    classic: {
        chainId: 61,
        name: "classic",
        _defaultProvider: etcDefaultProvider("https:/\/www.ethercluster.com/etc", "classic")
    },
    classicMorden: { chainId: 62, name: "classicMorden" },
    classicMordor: classicMordor,
    classicTestnet: classicMordor,
    classicKotti: {
        chainId: 6,
        name: "classicKotti",
        _defaultProvider: etcDefaultProvider("https:/\/www.ethercluster.com/kotti", "classicKotti")
    },
    xdai: { chainId: 100, name: "xdai" },
    matic: {
        chainId: 137,
        name: "matic",
        _defaultProvider: ethDefaultProvider("matic")
    },
    maticmum: { chainId: 80001, name: "maticmum" },
    optimism: {
        chainId: 10,
        name: "optimism",
        _defaultProvider: ethDefaultProvider("optimism")
    },
    "optimism-kovan": { chainId: 69, name: "optimism-kovan" },
    "optimism-goerli": { chainId: 420, name: "optimism-goerli" },
    arbitrum: { chainId: 42161, name: "arbitrum" },
    "arbitrum-rinkeby": { chainId: 421611, name: "arbitrum-rinkeby" },
    "arbitrum-goerli": { chainId: 421613, name: "arbitrum-goerli" },
    bnb: { chainId: 56, name: "bnb" },
    bnbt: { chainId: 97, name: "bnbt" },
};
/**
 *  getNetwork
 *
 *  Converts a named common networks or chain ID (network ID) to a Network
 *  and verifies a network is a valid Network..
 */
function getNetwork(network) {
    // No network (null)
    if (network == null) {
        return null;
    }
    if (typeof (network) === "number") {
        for (const name in networks) {
            const standard = networks[name];
            if (standard.chainId === network) {
                return {
                    name: standard.name,
                    chainId: standard.chainId,
                    ensAddress: (standard.ensAddress || null),
                    _defaultProvider: (standard._defaultProvider || null)
                };
            }
        }
        return {
            chainId: network,
            name: "unknown"
        };
    }
    if (typeof (network) === "string") {
        const standard = networks[network];
        if (standard == null) {
            return null;
        }
        return {
            name: standard.name,
            chainId: standard.chainId,
            ensAddress: standard.ensAddress,
            _defaultProvider: (standard._defaultProvider || null)
        };
    }
    const standard = networks[network.name];
    // Not a standard network; check that it is a valid network in general
    if (!standard) {
        if (typeof (network.chainId) !== "number") {
            networks_lib_esm_logger.throwArgumentError("invalid network chainId", "network", network);
        }
        return network;
    }
    // Make sure the chainId matches the expected network chainId (or is 0; disable EIP-155)
    if (network.chainId !== 0 && network.chainId !== standard.chainId) {
        networks_lib_esm_logger.throwArgumentError("network chainId mismatch", "network", network);
    }
    // @TODO: In the next major version add an attach function to a defaultProvider
    // class and move the _defaultProvider internal to this file (extend Network)
    let defaultProvider = network._defaultProvider || null;
    if (defaultProvider == null && standard._defaultProvider) {
        if (isRenetworkable(standard._defaultProvider)) {
            defaultProvider = standard._defaultProvider.renetwork(network);
        }
        else {
            defaultProvider = standard._defaultProvider;
        }
    }
    // Standard Network (allow overriding the ENS address)
    return {
        name: network.name,
        chainId: standard.chainId,
        ensAddress: (network.ensAddress || standard.ensAddress || null),
        _defaultProvider: defaultProvider
    };
}
//# sourceMappingURL=index.js.map
;// CONCATENATED MODULE: ./node_modules/@ethersproject/sha2/lib.esm/_version.js
const sha2_lib_esm_version_version = "sha2/5.7.0";
//# sourceMappingURL=_version.js.map
;// CONCATENATED MODULE: ./node_modules/@ethersproject/sha2/lib.esm/sha2.js


//const _ripemd160 = _hash.ripemd160;




const sha2_logger = new lib_esm_Logger(sha2_lib_esm_version_version);
function ripemd160(data) {
    return "0x" + (hash.ripemd160().update(arrayify(data)).digest("hex"));
}
function sha256(data) {
    return "0x" + (hash_default().sha256().update(lib_esm_arrayify(data)).digest("hex"));
}
function sha512(data) {
    return "0x" + (hash.sha512().update(arrayify(data)).digest("hex"));
}
function computeHmac(algorithm, key, data) {
    if (!SupportedAlgorithm[algorithm]) {
        sha2_logger.throwError("unsupported algorithm " + algorithm, Logger.errors.UNSUPPORTED_OPERATION, {
            operation: "hmac",
            algorithm: algorithm
        });
    }
    return "0x" + hash.hmac(hash[algorithm], arrayify(key)).update(arrayify(data)).digest("hex");
}
//# sourceMappingURL=sha2.js.map
// EXTERNAL MODULE: ./node_modules/bech32/index.js
var bech32 = __webpack_require__(9674);
var bech32_default = /*#__PURE__*/__webpack_require__.n(bech32);
;// CONCATENATED MODULE: ./node_modules/@ethersproject/constants/lib.esm/addresses.js
const AddressZero = "0x0000000000000000000000000000000000000000";
//# sourceMappingURL=addresses.js.map
;// CONCATENATED MODULE: ./node_modules/@ethersproject/providers/lib.esm/formatter.js









const formatter_logger = new lib_esm_Logger(lib_esm_version_version);
class Formatter {
    constructor() {
        this.formats = this.getDefaultFormats();
    }
    getDefaultFormats() {
        const formats = ({});
        const address = this.address.bind(this);
        const bigNumber = this.bigNumber.bind(this);
        const blockTag = this.blockTag.bind(this);
        const data = this.data.bind(this);
        const hash = this.hash.bind(this);
        const hex = this.hex.bind(this);
        const number = this.number.bind(this);
        const type = this.type.bind(this);
        const strictData = (v) => { return this.data(v, true); };
        formats.transaction = {
            hash: hash,
            type: type,
            accessList: Formatter.allowNull(this.accessList.bind(this), null),
            blockHash: Formatter.allowNull(hash, null),
            blockNumber: Formatter.allowNull(number, null),
            transactionIndex: Formatter.allowNull(number, null),
            confirmations: Formatter.allowNull(number, null),
            from: address,
            // either (gasPrice) or (maxPriorityFeePerGas + maxFeePerGas)
            // must be set
            gasPrice: Formatter.allowNull(bigNumber),
            maxPriorityFeePerGas: Formatter.allowNull(bigNumber),
            maxFeePerGas: Formatter.allowNull(bigNumber),
            gasLimit: bigNumber,
            to: Formatter.allowNull(address, null),
            value: bigNumber,
            nonce: number,
            data: data,
            r: Formatter.allowNull(this.uint256),
            s: Formatter.allowNull(this.uint256),
            v: Formatter.allowNull(number),
            creates: Formatter.allowNull(address, null),
            raw: Formatter.allowNull(data),
        };
        formats.transactionRequest = {
            from: Formatter.allowNull(address),
            nonce: Formatter.allowNull(number),
            gasLimit: Formatter.allowNull(bigNumber),
            gasPrice: Formatter.allowNull(bigNumber),
            maxPriorityFeePerGas: Formatter.allowNull(bigNumber),
            maxFeePerGas: Formatter.allowNull(bigNumber),
            to: Formatter.allowNull(address),
            value: Formatter.allowNull(bigNumber),
            data: Formatter.allowNull(strictData),
            type: Formatter.allowNull(number),
            accessList: Formatter.allowNull(this.accessList.bind(this), null),
        };
        formats.receiptLog = {
            transactionIndex: number,
            blockNumber: number,
            transactionHash: hash,
            address: address,
            topics: Formatter.arrayOf(hash),
            data: data,
            logIndex: number,
            blockHash: hash,
        };
        formats.receipt = {
            to: Formatter.allowNull(this.address, null),
            from: Formatter.allowNull(this.address, null),
            contractAddress: Formatter.allowNull(address, null),
            transactionIndex: number,
            // should be allowNull(hash), but broken-EIP-658 support is handled in receipt
            root: Formatter.allowNull(hex),
            gasUsed: bigNumber,
            logsBloom: Formatter.allowNull(data),
            blockHash: hash,
            transactionHash: hash,
            logs: Formatter.arrayOf(this.receiptLog.bind(this)),
            blockNumber: number,
            confirmations: Formatter.allowNull(number, null),
            cumulativeGasUsed: bigNumber,
            effectiveGasPrice: Formatter.allowNull(bigNumber),
            status: Formatter.allowNull(number),
            type: type
        };
        formats.block = {
            hash: Formatter.allowNull(hash),
            parentHash: hash,
            number: number,
            timestamp: number,
            nonce: Formatter.allowNull(hex),
            difficulty: this.difficulty.bind(this),
            gasLimit: bigNumber,
            gasUsed: bigNumber,
            miner: Formatter.allowNull(address),
            extraData: data,
            transactions: Formatter.allowNull(Formatter.arrayOf(hash)),
            baseFeePerGas: Formatter.allowNull(bigNumber)
        };
        formats.blockWithTransactions = shallowCopy(formats.block);
        formats.blockWithTransactions.transactions = Formatter.allowNull(Formatter.arrayOf(this.transactionResponse.bind(this)));
        formats.filter = {
            fromBlock: Formatter.allowNull(blockTag, undefined),
            toBlock: Formatter.allowNull(blockTag, undefined),
            blockHash: Formatter.allowNull(hash, undefined),
            address: Formatter.allowNull(address, undefined),
            topics: Formatter.allowNull(this.topics.bind(this), undefined),
        };
        formats.filterLog = {
            blockNumber: Formatter.allowNull(number),
            blockHash: Formatter.allowNull(hash),
            transactionIndex: number,
            removed: Formatter.allowNull(this.boolean.bind(this)),
            address: address,
            data: Formatter.allowFalsish(data, "0x"),
            topics: Formatter.arrayOf(hash),
            transactionHash: hash,
            logIndex: number,
        };
        return formats;
    }
    accessList(accessList) {
        return accessListify(accessList || []);
    }
    // Requires a BigNumberish that is within the IEEE754 safe integer range; returns a number
    // Strict! Used on input.
    number(number) {
        if (number === "0x") {
            return 0;
        }
        return bignumber_BigNumber.from(number).toNumber();
    }
    type(number) {
        if (number === "0x" || number == null) {
            return 0;
        }
        return bignumber_BigNumber.from(number).toNumber();
    }
    // Strict! Used on input.
    bigNumber(value) {
        return bignumber_BigNumber.from(value);
    }
    // Requires a boolean, "true" or  "false"; returns a boolean
    boolean(value) {
        if (typeof (value) === "boolean") {
            return value;
        }
        if (typeof (value) === "string") {
            value = value.toLowerCase();
            if (value === "true") {
                return true;
            }
            if (value === "false") {
                return false;
            }
        }
        throw new Error("invalid boolean - " + value);
    }
    hex(value, strict) {
        if (typeof (value) === "string") {
            if (!strict && value.substring(0, 2) !== "0x") {
                value = "0x" + value;
            }
            if (lib_esm_isHexString(value)) {
                return value.toLowerCase();
            }
        }
        return formatter_logger.throwArgumentError("invalid hash", "value", value);
    }
    data(value, strict) {
        const result = this.hex(value, strict);
        if ((result.length % 2) !== 0) {
            throw new Error("invalid data; odd-length - " + value);
        }
        return result;
    }
    // Requires an address
    // Strict! Used on input.
    address(value) {
        return getAddress(value);
    }
    callAddress(value) {
        if (!lib_esm_isHexString(value, 32)) {
            return null;
        }
        const address = getAddress(lib_esm_hexDataSlice(value, 12));
        return (address === AddressZero) ? null : address;
    }
    contractAddress(value) {
        return getContractAddress(value);
    }
    // Strict! Used on input.
    blockTag(blockTag) {
        if (blockTag == null) {
            return "latest";
        }
        if (blockTag === "earliest") {
            return "0x0";
        }
        switch (blockTag) {
            case "earliest": return "0x0";
            case "latest":
            case "pending":
            case "safe":
            case "finalized":
                return blockTag;
        }
        if (typeof (blockTag) === "number" || lib_esm_isHexString(blockTag)) {
            return hexValue(blockTag);
        }
        throw new Error("invalid blockTag");
    }
    // Requires a hash, optionally requires 0x prefix; returns prefixed lowercase hash.
    hash(value, strict) {
        const result = this.hex(value, strict);
        if (lib_esm_hexDataLength(result) !== 32) {
            return formatter_logger.throwArgumentError("invalid hash", "value", value);
        }
        return result;
    }
    // Returns the difficulty as a number, or if too large (i.e. PoA network) null
    difficulty(value) {
        if (value == null) {
            return null;
        }
        const v = bignumber_BigNumber.from(value);
        try {
            return v.toNumber();
        }
        catch (error) { }
        return null;
    }
    uint256(value) {
        if (!lib_esm_isHexString(value)) {
            throw new Error("invalid uint256");
        }
        return hexZeroPad(value, 32);
    }
    _block(value, format) {
        if (value.author != null && value.miner == null) {
            value.miner = value.author;
        }
        // The difficulty may need to come from _difficulty in recursed blocks
        const difficulty = (value._difficulty != null) ? value._difficulty : value.difficulty;
        const result = Formatter.check(format, value);
        result._difficulty = ((difficulty == null) ? null : bignumber_BigNumber.from(difficulty));
        return result;
    }
    block(value) {
        return this._block(value, this.formats.block);
    }
    blockWithTransactions(value) {
        return this._block(value, this.formats.blockWithTransactions);
    }
    // Strict! Used on input.
    transactionRequest(value) {
        return Formatter.check(this.formats.transactionRequest, value);
    }
    transactionResponse(transaction) {
        // Rename gas to gasLimit
        if (transaction.gas != null && transaction.gasLimit == null) {
            transaction.gasLimit = transaction.gas;
        }
        // Some clients (TestRPC) do strange things like return 0x0 for the
        // 0 address; correct this to be a real address
        if (transaction.to && bignumber_BigNumber.from(transaction.to).isZero()) {
            transaction.to = "0x0000000000000000000000000000000000000000";
        }
        // Rename input to data
        if (transaction.input != null && transaction.data == null) {
            transaction.data = transaction.input;
        }
        // If to and creates are empty, populate the creates from the transaction
        if (transaction.to == null && transaction.creates == null) {
            transaction.creates = this.contractAddress(transaction);
        }
        if ((transaction.type === 1 || transaction.type === 2) && transaction.accessList == null) {
            transaction.accessList = [];
        }
        const result = Formatter.check(this.formats.transaction, transaction);
        if (transaction.chainId != null) {
            let chainId = transaction.chainId;
            if (lib_esm_isHexString(chainId)) {
                chainId = bignumber_BigNumber.from(chainId).toNumber();
            }
            result.chainId = chainId;
        }
        else {
            let chainId = transaction.networkId;
            // geth-etc returns chainId
            if (chainId == null && result.v == null) {
                chainId = transaction.chainId;
            }
            if (lib_esm_isHexString(chainId)) {
                chainId = bignumber_BigNumber.from(chainId).toNumber();
            }
            if (typeof (chainId) !== "number" && result.v != null) {
                chainId = (result.v - 35) / 2;
                if (chainId < 0) {
                    chainId = 0;
                }
                chainId = parseInt(chainId);
            }
            if (typeof (chainId) !== "number") {
                chainId = 0;
            }
            result.chainId = chainId;
        }
        // 0x0000... should actually be null
        if (result.blockHash && result.blockHash.replace(/0/g, "") === "x") {
            result.blockHash = null;
        }
        return result;
    }
    transaction(value) {
        return parse(value);
    }
    receiptLog(value) {
        return Formatter.check(this.formats.receiptLog, value);
    }
    receipt(value) {
        const result = Formatter.check(this.formats.receipt, value);
        // RSK incorrectly implemented EIP-658, so we munge things a bit here for it
        if (result.root != null) {
            if (result.root.length <= 4) {
                // Could be 0x00, 0x0, 0x01 or 0x1
                const value = bignumber_BigNumber.from(result.root).toNumber();
                if (value === 0 || value === 1) {
                    // Make sure if both are specified, they match
                    if (result.status != null && (result.status !== value)) {
                        formatter_logger.throwArgumentError("alt-root-status/status mismatch", "value", { root: result.root, status: result.status });
                    }
                    result.status = value;
                    delete result.root;
                }
                else {
                    formatter_logger.throwArgumentError("invalid alt-root-status", "value.root", result.root);
                }
            }
            else if (result.root.length !== 66) {
                // Must be a valid bytes32
                formatter_logger.throwArgumentError("invalid root hash", "value.root", result.root);
            }
        }
        if (result.status != null) {
            result.byzantium = true;
        }
        return result;
    }
    topics(value) {
        if (Array.isArray(value)) {
            return value.map((v) => this.topics(v));
        }
        else if (value != null) {
            return this.hash(value, true);
        }
        return null;
    }
    filter(value) {
        return Formatter.check(this.formats.filter, value);
    }
    filterLog(value) {
        return Formatter.check(this.formats.filterLog, value);
    }
    static check(format, object) {
        const result = {};
        for (const key in format) {
            try {
                const value = format[key](object[key]);
                if (value !== undefined) {
                    result[key] = value;
                }
            }
            catch (error) {
                error.checkKey = key;
                error.checkValue = object[key];
                throw error;
            }
        }
        return result;
    }
    // if value is null-ish, nullValue is returned
    static allowNull(format, nullValue) {
        return (function (value) {
            if (value == null) {
                return nullValue;
            }
            return format(value);
        });
    }
    // If value is false-ish, replaceValue is returned
    static allowFalsish(format, replaceValue) {
        return (function (value) {
            if (!value) {
                return replaceValue;
            }
            return format(value);
        });
    }
    // Requires an Array satisfying check
    static arrayOf(format) {
        return (function (array) {
            if (!Array.isArray(array)) {
                throw new Error("not an array");
            }
            const result = [];
            array.forEach(function (value) {
                result.push(format(value));
            });
            return result;
        });
    }
}
function isCommunityResourcable(value) {
    return (value && typeof (value.isCommunityResource) === "function");
}
function isCommunityResource(value) {
    return (isCommunityResourcable(value) && value.isCommunityResource());
}
// Show the throttle message only once
let throttleMessage = false;
function showThrottleMessage() {
    if (throttleMessage) {
        return;
    }
    throttleMessage = true;
    console.log("========= NOTICE =========");
    console.log("Request-Rate Exceeded  (this message will not be repeated)");
    console.log("");
    console.log("The default API keys for each service are provided as a highly-throttled,");
    console.log("community resource for low-traffic projects and early prototyping.");
    console.log("");
    console.log("While your application will continue to function, we highly recommended");
    console.log("signing up for your own API keys to improve performance, increase your");
    console.log("request rate/limit and enable other perks, such as metrics and advanced APIs.");
    console.log("");
    console.log("For more details: https:/\/docs.ethers.io/api-keys/");
    console.log("==========================");
}
//# sourceMappingURL=formatter.js.map
;// CONCATENATED MODULE: ./node_modules/@ethersproject/providers/lib.esm/base-provider.js

var base_provider_awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};















const base_provider_logger = new lib_esm_Logger(lib_esm_version_version);

const MAX_CCIP_REDIRECTS = 10;
//////////////////////////////
// Event Serializeing
function checkTopic(topic) {
    if (topic == null) {
        return "null";
    }
    if (lib_esm_hexDataLength(topic) !== 32) {
        base_provider_logger.throwArgumentError("invalid topic", "topic", topic);
    }
    return topic.toLowerCase();
}
function serializeTopics(topics) {
    // Remove trailing null AND-topics; they are redundant
    topics = topics.slice();
    while (topics.length > 0 && topics[topics.length - 1] == null) {
        topics.pop();
    }
    return topics.map((topic) => {
        if (Array.isArray(topic)) {
            // Only track unique OR-topics
            const unique = {};
            topic.forEach((topic) => {
                unique[checkTopic(topic)] = true;
            });
            // The order of OR-topics does not matter
            const sorted = Object.keys(unique);
            sorted.sort();
            return sorted.join("|");
        }
        else {
            return checkTopic(topic);
        }
    }).join("&");
}
function deserializeTopics(data) {
    if (data === "") {
        return [];
    }
    return data.split(/&/g).map((topic) => {
        if (topic === "") {
            return [];
        }
        const comps = topic.split("|").map((topic) => {
            return ((topic === "null") ? null : topic);
        });
        return ((comps.length === 1) ? comps[0] : comps);
    });
}
function getEventTag(eventName) {
    if (typeof (eventName) === "string") {
        eventName = eventName.toLowerCase();
        if (lib_esm_hexDataLength(eventName) === 32) {
            return "tx:" + eventName;
        }
        if (eventName.indexOf(":") === -1) {
            return eventName;
        }
    }
    else if (Array.isArray(eventName)) {
        return "filter:*:" + serializeTopics(eventName);
    }
    else if (ForkEvent.isForkEvent(eventName)) {
        base_provider_logger.warn("not implemented");
        throw new Error("not implemented");
    }
    else if (eventName && typeof (eventName) === "object") {
        return "filter:" + (eventName.address || "*") + ":" + serializeTopics(eventName.topics || []);
    }
    throw new Error("invalid event - " + eventName);
}
//////////////////////////////
// Helper Object
function getTime() {
    return (new Date()).getTime();
}
function stall(duration) {
    return new Promise((resolve) => {
        setTimeout(resolve, duration);
    });
}
//////////////////////////////
// Provider Object
/**
 *  EventType
 *   - "block"
 *   - "poll"
 *   - "didPoll"
 *   - "pending"
 *   - "error"
 *   - "network"
 *   - filter
 *   - topics array
 *   - transaction hash
 */
const PollableEvents = ["block", "network", "pending", "poll"];
class Event {
    constructor(tag, listener, once) {
        defineReadOnly(this, "tag", tag);
        defineReadOnly(this, "listener", listener);
        defineReadOnly(this, "once", once);
        this._lastBlockNumber = -2;
        this._inflight = false;
    }
    get event() {
        switch (this.type) {
            case "tx":
                return this.hash;
            case "filter":
                return this.filter;
        }
        return this.tag;
    }
    get type() {
        return this.tag.split(":")[0];
    }
    get hash() {
        const comps = this.tag.split(":");
        if (comps[0] !== "tx") {
            return null;
        }
        return comps[1];
    }
    get filter() {
        const comps = this.tag.split(":");
        if (comps[0] !== "filter") {
            return null;
        }
        const address = comps[1];
        const topics = deserializeTopics(comps[2]);
        const filter = {};
        if (topics.length > 0) {
            filter.topics = topics;
        }
        if (address && address !== "*") {
            filter.address = address;
        }
        return filter;
    }
    pollable() {
        return (this.tag.indexOf(":") >= 0 || PollableEvents.indexOf(this.tag) >= 0);
    }
}
;
// https://github.com/satoshilabs/slips/blob/master/slip-0044.md
const coinInfos = {
    "0": { symbol: "btc", p2pkh: 0x00, p2sh: 0x05, prefix: "bc" },
    "2": { symbol: "ltc", p2pkh: 0x30, p2sh: 0x32, prefix: "ltc" },
    "3": { symbol: "doge", p2pkh: 0x1e, p2sh: 0x16 },
    "60": { symbol: "eth", ilk: "eth" },
    "61": { symbol: "etc", ilk: "eth" },
    "700": { symbol: "xdai", ilk: "eth" },
};
function bytes32ify(value) {
    return hexZeroPad(bignumber_BigNumber.from(value).toHexString(), 32);
}
// Compute the Base58Check encoded data (checksum is first 4 bytes of sha256d)
function base58Encode(data) {
    return Base58.encode(lib_esm_concat([data, lib_esm_hexDataSlice(sha256(sha256(data)), 0, 4)]));
}
const matcherIpfs = new RegExp("^(ipfs):/\/(.*)$", "i");
const matchers = [
    new RegExp("^(https):/\/(.*)$", "i"),
    new RegExp("^(data):(.*)$", "i"),
    matcherIpfs,
    new RegExp("^eip155:[0-9]+/(erc[0-9]+):(.*)$", "i"),
];
function _parseString(result, start) {
    try {
        return utf8_toUtf8String(_parseBytes(result, start));
    }
    catch (error) { }
    return null;
}
function _parseBytes(result, start) {
    if (result === "0x") {
        return null;
    }
    const offset = bignumber_BigNumber.from(lib_esm_hexDataSlice(result, start, start + 32)).toNumber();
    const length = bignumber_BigNumber.from(lib_esm_hexDataSlice(result, offset, offset + 32)).toNumber();
    return lib_esm_hexDataSlice(result, offset + 32, offset + 32 + length);
}
// Trim off the ipfs:// prefix and return the default gateway URL
function getIpfsLink(link) {
    if (link.match(/^ipfs:\/\/ipfs\//i)) {
        link = link.substring(12);
    }
    else if (link.match(/^ipfs:\/\//i)) {
        link = link.substring(7);
    }
    else {
        base_provider_logger.throwArgumentError("unsupported IPFS format", "link", link);
    }
    return `https:/\/gateway.ipfs.io/ipfs/${link}`;
}
function numPad(value) {
    const result = lib_esm_arrayify(value);
    if (result.length > 32) {
        throw new Error("internal; should not happen");
    }
    const padded = new Uint8Array(32);
    padded.set(result, 32 - result.length);
    return padded;
}
function bytesPad(value) {
    if ((value.length % 32) === 0) {
        return value;
    }
    const result = new Uint8Array(Math.ceil(value.length / 32) * 32);
    result.set(value);
    return result;
}
// ABI Encodes a series of (bytes, bytes, ...)
function encodeBytes(datas) {
    const result = [];
    let byteCount = 0;
    // Add place-holders for pointers as we add items
    for (let i = 0; i < datas.length; i++) {
        result.push(null);
        byteCount += 32;
    }
    for (let i = 0; i < datas.length; i++) {
        const data = lib_esm_arrayify(datas[i]);
        // Update the bytes offset
        result[i] = numPad(byteCount);
        // The length and padded value of data
        result.push(numPad(data.length));
        result.push(bytesPad(data));
        byteCount += 32 + Math.ceil(data.length / 32) * 32;
    }
    return hexConcat(result);
}
class Resolver {
    // The resolvedAddress is only for creating a ReverseLookup resolver
    constructor(provider, address, name, resolvedAddress) {
        defineReadOnly(this, "provider", provider);
        defineReadOnly(this, "name", name);
        defineReadOnly(this, "address", provider.formatter.address(address));
        defineReadOnly(this, "_resolvedAddress", resolvedAddress);
    }
    supportsWildcard() {
        if (!this._supportsEip2544) {
            // supportsInterface(bytes4 = selector("resolve(bytes,bytes)"))
            this._supportsEip2544 = this.provider.call({
                to: this.address,
                data: "0x01ffc9a79061b92300000000000000000000000000000000000000000000000000000000"
            }).then((result) => {
                return bignumber_BigNumber.from(result).eq(1);
            }).catch((error) => {
                if (error.code === lib_esm_Logger.errors.CALL_EXCEPTION) {
                    return false;
                }
                // Rethrow the error: link is down, etc. Let future attempts retry.
                this._supportsEip2544 = null;
                throw error;
            });
        }
        return this._supportsEip2544;
    }
    _fetch(selector, parameters) {
        return base_provider_awaiter(this, void 0, void 0, function* () {
            // e.g. keccak256("addr(bytes32,uint256)")
            const tx = {
                to: this.address,
                ccipReadEnabled: true,
                data: hexConcat([selector, namehash(this.name), (parameters || "0x")])
            };
            // Wildcard support; use EIP-2544 to resolve the request
            let parseBytes = false;
            if (yield this.supportsWildcard()) {
                parseBytes = true;
                // selector("resolve(bytes,bytes)")
                tx.data = hexConcat(["0x9061b923", encodeBytes([dnsEncode(this.name), tx.data])]);
            }
            try {
                let result = yield this.provider.call(tx);
                if ((lib_esm_arrayify(result).length % 32) === 4) {
                    base_provider_logger.throwError("resolver threw error", lib_esm_Logger.errors.CALL_EXCEPTION, {
                        transaction: tx, data: result
                    });
                }
                if (parseBytes) {
                    result = _parseBytes(result, 0);
                }
                return result;
            }
            catch (error) {
                if (error.code === lib_esm_Logger.errors.CALL_EXCEPTION) {
                    return null;
                }
                throw error;
            }
        });
    }
    _fetchBytes(selector, parameters) {
        return base_provider_awaiter(this, void 0, void 0, function* () {
            const result = yield this._fetch(selector, parameters);
            if (result != null) {
                return _parseBytes(result, 0);
            }
            return null;
        });
    }
    _getAddress(coinType, hexBytes) {
        const coinInfo = coinInfos[String(coinType)];
        if (coinInfo == null) {
            base_provider_logger.throwError(`unsupported coin type: ${coinType}`, lib_esm_Logger.errors.UNSUPPORTED_OPERATION, {
                operation: `getAddress(${coinType})`
            });
        }
        if (coinInfo.ilk === "eth") {
            return this.provider.formatter.address(hexBytes);
        }
        const bytes = lib_esm_arrayify(hexBytes);
        // P2PKH: OP_DUP OP_HASH160 <pubKeyHash> OP_EQUALVERIFY OP_CHECKSIG
        if (coinInfo.p2pkh != null) {
            const p2pkh = hexBytes.match(/^0x76a9([0-9a-f][0-9a-f])([0-9a-f]*)88ac$/);
            if (p2pkh) {
                const length = parseInt(p2pkh[1], 16);
                if (p2pkh[2].length === length * 2 && length >= 1 && length <= 75) {
                    return base58Encode(lib_esm_concat([[coinInfo.p2pkh], ("0x" + p2pkh[2])]));
                }
            }
        }
        // P2SH: OP_HASH160 <scriptHash> OP_EQUAL
        if (coinInfo.p2sh != null) {
            const p2sh = hexBytes.match(/^0xa9([0-9a-f][0-9a-f])([0-9a-f]*)87$/);
            if (p2sh) {
                const length = parseInt(p2sh[1], 16);
                if (p2sh[2].length === length * 2 && length >= 1 && length <= 75) {
                    return base58Encode(lib_esm_concat([[coinInfo.p2sh], ("0x" + p2sh[2])]));
                }
            }
        }
        // Bech32
        if (coinInfo.prefix != null) {
            const length = bytes[1];
            // https://github.com/bitcoin/bips/blob/master/bip-0141.mediawiki#witness-program
            let version = bytes[0];
            if (version === 0x00) {
                if (length !== 20 && length !== 32) {
                    version = -1;
                }
            }
            else {
                version = -1;
            }
            if (version >= 0 && bytes.length === 2 + length && length >= 1 && length <= 75) {
                const words = bech32_default().toWords(bytes.slice(2));
                words.unshift(version);
                return bech32_default().encode(coinInfo.prefix, words);
            }
        }
        return null;
    }
    getAddress(coinType) {
        return base_provider_awaiter(this, void 0, void 0, function* () {
            if (coinType == null) {
                coinType = 60;
            }
            // If Ethereum, use the standard `addr(bytes32)`
            if (coinType === 60) {
                try {
                    // keccak256("addr(bytes32)")
                    const result = yield this._fetch("0x3b3b57de");
                    // No address
                    if (result === "0x" || result === HashZero) {
                        return null;
                    }
                    return this.provider.formatter.callAddress(result);
                }
                catch (error) {
                    if (error.code === lib_esm_Logger.errors.CALL_EXCEPTION) {
                        return null;
                    }
                    throw error;
                }
            }
            // keccak256("addr(bytes32,uint256")
            const hexBytes = yield this._fetchBytes("0xf1cb7e06", bytes32ify(coinType));
            // No address
            if (hexBytes == null || hexBytes === "0x") {
                return null;
            }
            // Compute the address
            const address = this._getAddress(coinType, hexBytes);
            if (address == null) {
                base_provider_logger.throwError(`invalid or unsupported coin data`, lib_esm_Logger.errors.UNSUPPORTED_OPERATION, {
                    operation: `getAddress(${coinType})`,
                    coinType: coinType,
                    data: hexBytes
                });
            }
            return address;
        });
    }
    getAvatar() {
        return base_provider_awaiter(this, void 0, void 0, function* () {
            const linkage = [{ type: "name", content: this.name }];
            try {
                // test data for ricmoo.eth
                //const avatar = "eip155:1/erc721:0x265385c7f4132228A0d54EB1A9e7460b91c0cC68/29233";
                const avatar = yield this.getText("avatar");
                if (avatar == null) {
                    return null;
                }
                for (let i = 0; i < matchers.length; i++) {
                    const match = avatar.match(matchers[i]);
                    if (match == null) {
                        continue;
                    }
                    const scheme = match[1].toLowerCase();
                    switch (scheme) {
                        case "https":
                            linkage.push({ type: "url", content: avatar });
                            return { linkage, url: avatar };
                        case "data":
                            linkage.push({ type: "data", content: avatar });
                            return { linkage, url: avatar };
                        case "ipfs":
                            linkage.push({ type: "ipfs", content: avatar });
                            return { linkage, url: getIpfsLink(avatar) };
                        case "erc721":
                        case "erc1155": {
                            // Depending on the ERC type, use tokenURI(uint256) or url(uint256)
                            const selector = (scheme === "erc721") ? "0xc87b56dd" : "0x0e89341c";
                            linkage.push({ type: scheme, content: avatar });
                            // The owner of this name
                            const owner = (this._resolvedAddress || (yield this.getAddress()));
                            const comps = (match[2] || "").split("/");
                            if (comps.length !== 2) {
                                return null;
                            }
                            const addr = yield this.provider.formatter.address(comps[0]);
                            const tokenId = hexZeroPad(bignumber_BigNumber.from(comps[1]).toHexString(), 32);
                            // Check that this account owns the token
                            if (scheme === "erc721") {
                                // ownerOf(uint256 tokenId)
                                const tokenOwner = this.provider.formatter.callAddress(yield this.provider.call({
                                    to: addr, data: hexConcat(["0x6352211e", tokenId])
                                }));
                                if (owner !== tokenOwner) {
                                    return null;
                                }
                                linkage.push({ type: "owner", content: tokenOwner });
                            }
                            else if (scheme === "erc1155") {
                                // balanceOf(address owner, uint256 tokenId)
                                const balance = bignumber_BigNumber.from(yield this.provider.call({
                                    to: addr, data: hexConcat(["0x00fdd58e", hexZeroPad(owner, 32), tokenId])
                                }));
                                if (balance.isZero()) {
                                    return null;
                                }
                                linkage.push({ type: "balance", content: balance.toString() });
                            }
                            // Call the token contract for the metadata URL
                            const tx = {
                                to: this.provider.formatter.address(comps[0]),
                                data: hexConcat([selector, tokenId])
                            };
                            let metadataUrl = _parseString(yield this.provider.call(tx), 0);
                            if (metadataUrl == null) {
                                return null;
                            }
                            linkage.push({ type: "metadata-url-base", content: metadataUrl });
                            // ERC-1155 allows a generic {id} in the URL
                            if (scheme === "erc1155") {
                                metadataUrl = metadataUrl.replace("{id}", tokenId.substring(2));
                                linkage.push({ type: "metadata-url-expanded", content: metadataUrl });
                            }
                            // Transform IPFS metadata links
                            if (metadataUrl.match(/^ipfs:/i)) {
                                metadataUrl = getIpfsLink(metadataUrl);
                            }
                            linkage.push({ type: "metadata-url", content: metadataUrl });
                            // Get the token metadata
                            const metadata = yield fetchJson(metadataUrl);
                            if (!metadata) {
                                return null;
                            }
                            linkage.push({ type: "metadata", content: JSON.stringify(metadata) });
                            // Pull the image URL out
                            let imageUrl = metadata.image;
                            if (typeof (imageUrl) !== "string") {
                                return null;
                            }
                            if (imageUrl.match(/^(https:\/\/|data:)/i)) {
                                // Allow
                            }
                            else {
                                // Transform IPFS link to gateway
                                const ipfs = imageUrl.match(matcherIpfs);
                                if (ipfs == null) {
                                    return null;
                                }
                                linkage.push({ type: "url-ipfs", content: imageUrl });
                                imageUrl = getIpfsLink(imageUrl);
                            }
                            linkage.push({ type: "url", content: imageUrl });
                            return { linkage, url: imageUrl };
                        }
                    }
                }
            }
            catch (error) { }
            return null;
        });
    }
    getContentHash() {
        return base_provider_awaiter(this, void 0, void 0, function* () {
            // keccak256("contenthash()")
            const hexBytes = yield this._fetchBytes("0xbc1c58d1");
            // No contenthash
            if (hexBytes == null || hexBytes === "0x") {
                return null;
            }
            // IPFS (CID: 1, Type: DAG-PB)
            const ipfs = hexBytes.match(/^0xe3010170(([0-9a-f][0-9a-f])([0-9a-f][0-9a-f])([0-9a-f]*))$/);
            if (ipfs) {
                const length = parseInt(ipfs[3], 16);
                if (ipfs[4].length === length * 2) {
                    return "ipfs:/\/" + Base58.encode("0x" + ipfs[1]);
                }
            }
            // IPNS (CID: 1, Type: libp2p-key)
            const ipns = hexBytes.match(/^0xe5010172(([0-9a-f][0-9a-f])([0-9a-f][0-9a-f])([0-9a-f]*))$/);
            if (ipns) {
                const length = parseInt(ipns[3], 16);
                if (ipns[4].length === length * 2) {
                    return "ipns:/\/" + Base58.encode("0x" + ipns[1]);
                }
            }
            // Swarm (CID: 1, Type: swarm-manifest; hash/length hard-coded to keccak256/32)
            const swarm = hexBytes.match(/^0xe40101fa011b20([0-9a-f]*)$/);
            if (swarm) {
                if (swarm[1].length === (32 * 2)) {
                    return "bzz:/\/" + swarm[1];
                }
            }
            const skynet = hexBytes.match(/^0x90b2c605([0-9a-f]*)$/);
            if (skynet) {
                if (skynet[1].length === (34 * 2)) {
                    // URL Safe base64; https://datatracker.ietf.org/doc/html/rfc4648#section-5
                    const urlSafe = { "=": "", "+": "-", "/": "_" };
                    const hash = base64_encode("0x" + skynet[1]).replace(/[=+\/]/g, (a) => (urlSafe[a]));
                    return "sia:/\/" + hash;
                }
            }
            return base_provider_logger.throwError(`invalid or unsupported content hash data`, lib_esm_Logger.errors.UNSUPPORTED_OPERATION, {
                operation: "getContentHash()",
                data: hexBytes
            });
        });
    }
    getText(key) {
        return base_provider_awaiter(this, void 0, void 0, function* () {
            // The key encoded as parameter to fetchBytes
            let keyBytes = toUtf8Bytes(key);
            // The nodehash consumes the first slot, so the string pointer targets
            // offset 64, with the length at offset 64 and data starting at offset 96
            keyBytes = lib_esm_concat([bytes32ify(64), bytes32ify(keyBytes.length), keyBytes]);
            // Pad to word-size (32 bytes)
            if ((keyBytes.length % 32) !== 0) {
                keyBytes = lib_esm_concat([keyBytes, hexZeroPad("0x", 32 - (key.length % 32))]);
            }
            const hexBytes = yield this._fetchBytes("0x59d1d43c", lib_esm_hexlify(keyBytes));
            if (hexBytes == null || hexBytes === "0x") {
                return null;
            }
            return utf8_toUtf8String(hexBytes);
        });
    }
}
let defaultFormatter = null;
let nextPollId = 1;
class BaseProvider extends Provider {
    /**
     *  ready
     *
     *  A Promise<Network> that resolves only once the provider is ready.
     *
     *  Sub-classes that call the super with a network without a chainId
     *  MUST set this. Standard named networks have a known chainId.
     *
     */
    constructor(network) {
        super();
        // Events being listened to
        this._events = [];
        this._emitted = { block: -2 };
        this.disableCcipRead = false;
        this.formatter = new.target.getFormatter();
        // If network is any, this Provider allows the underlying
        // network to change dynamically, and we auto-detect the
        // current network
        defineReadOnly(this, "anyNetwork", (network === "any"));
        if (this.anyNetwork) {
            network = this.detectNetwork();
        }
        if (network instanceof Promise) {
            this._networkPromise = network;
            // Squash any "unhandled promise" errors; that do not need to be handled
            network.catch((error) => { });
            // Trigger initial network setting (async)
            this._ready().catch((error) => { });
        }
        else {
            const knownNetwork = getStatic(new.target, "getNetwork")(network);
            if (knownNetwork) {
                defineReadOnly(this, "_network", knownNetwork);
                this.emit("network", knownNetwork, null);
            }
            else {
                base_provider_logger.throwArgumentError("invalid network", "network", network);
            }
        }
        this._maxInternalBlockNumber = -1024;
        this._lastBlockNumber = -2;
        this._maxFilterBlockRange = 10;
        this._pollingInterval = 4000;
        this._fastQueryDate = 0;
    }
    _ready() {
        return base_provider_awaiter(this, void 0, void 0, function* () {
            if (this._network == null) {
                let network = null;
                if (this._networkPromise) {
                    try {
                        network = yield this._networkPromise;
                    }
                    catch (error) { }
                }
                // Try the Provider's network detection (this MUST throw if it cannot)
                if (network == null) {
                    network = yield this.detectNetwork();
                }
                // This should never happen; every Provider sub-class should have
                // suggested a network by here (or have thrown).
                if (!network) {
                    base_provider_logger.throwError("no network detected", lib_esm_Logger.errors.UNKNOWN_ERROR, {});
                }
                // Possible this call stacked so do not call defineReadOnly again
                if (this._network == null) {
                    if (this.anyNetwork) {
                        this._network = network;
                    }
                    else {
                        defineReadOnly(this, "_network", network);
                    }
                    this.emit("network", network, null);
                }
            }
            return this._network;
        });
    }
    // This will always return the most recently established network.
    // For "any", this can change (a "network" event is emitted before
    // any change is reflected); otherwise this cannot change
    get ready() {
        return poll(() => {
            return this._ready().then((network) => {
                return network;
            }, (error) => {
                // If the network isn't running yet, we will wait
                if (error.code === lib_esm_Logger.errors.NETWORK_ERROR && error.event === "noNetwork") {
                    return undefined;
                }
                throw error;
            });
        });
    }
    // @TODO: Remove this and just create a singleton formatter
    static getFormatter() {
        if (defaultFormatter == null) {
            defaultFormatter = new Formatter();
        }
        return defaultFormatter;
    }
    // @TODO: Remove this and just use getNetwork
    static getNetwork(network) {
        return getNetwork((network == null) ? "homestead" : network);
    }
    ccipReadFetch(tx, calldata, urls) {
        return base_provider_awaiter(this, void 0, void 0, function* () {
            if (this.disableCcipRead || urls.length === 0) {
                return null;
            }
            const sender = tx.to.toLowerCase();
            const data = calldata.toLowerCase();
            const errorMessages = [];
            for (let i = 0; i < urls.length; i++) {
                const url = urls[i];
                // URL expansion
                const href = url.replace("{sender}", sender).replace("{data}", data);
                // If no {data} is present, use POST; otherwise GET
                const json = (url.indexOf("{data}") >= 0) ? null : JSON.stringify({ data, sender });
                const result = yield fetchJson({ url: href, errorPassThrough: true }, json, (value, response) => {
                    value.status = response.statusCode;
                    return value;
                });
                if (result.data) {
                    return result.data;
                }
                const errorMessage = (result.message || "unknown error");
                // 4xx indicates the result is not present; stop
                if (result.status >= 400 && result.status < 500) {
                    return base_provider_logger.throwError(`response not found during CCIP fetch: ${errorMessage}`, lib_esm_Logger.errors.SERVER_ERROR, { url, errorMessage });
                }
                // 5xx indicates server issue; try the next url
                errorMessages.push(errorMessage);
            }
            return base_provider_logger.throwError(`error encountered during CCIP fetch: ${errorMessages.map((m) => JSON.stringify(m)).join(", ")}`, lib_esm_Logger.errors.SERVER_ERROR, {
                urls, errorMessages
            });
        });
    }
    // Fetches the blockNumber, but will reuse any result that is less
    // than maxAge old or has been requested since the last request
    _getInternalBlockNumber(maxAge) {
        return base_provider_awaiter(this, void 0, void 0, function* () {
            yield this._ready();
            // Allowing stale data up to maxAge old
            if (maxAge > 0) {
                // While there are pending internal block requests...
                while (this._internalBlockNumber) {
                    // ..."remember" which fetch we started with
                    const internalBlockNumber = this._internalBlockNumber;
                    try {
                        // Check the result is not too stale
                        const result = yield internalBlockNumber;
                        if ((getTime() - result.respTime) <= maxAge) {
                            return result.blockNumber;
                        }
                        // Too old; fetch a new value
                        break;
                    }
                    catch (error) {
                        // The fetch rejected; if we are the first to get the
                        // rejection, drop through so we replace it with a new
                        // fetch; all others blocked will then get that fetch
                        // which won't match the one they "remembered" and loop
                        if (this._internalBlockNumber === internalBlockNumber) {
                            break;
                        }
                    }
                }
            }
            const reqTime = getTime();
            const checkInternalBlockNumber = resolveProperties({
                blockNumber: this.perform("getBlockNumber", {}),
                networkError: this.getNetwork().then((network) => (null), (error) => (error))
            }).then(({ blockNumber, networkError }) => {
                if (networkError) {
                    // Unremember this bad internal block number
                    if (this._internalBlockNumber === checkInternalBlockNumber) {
                        this._internalBlockNumber = null;
                    }
                    throw networkError;
                }
                const respTime = getTime();
                blockNumber = bignumber_BigNumber.from(blockNumber).toNumber();
                if (blockNumber < this._maxInternalBlockNumber) {
                    blockNumber = this._maxInternalBlockNumber;
                }
                this._maxInternalBlockNumber = blockNumber;
                this._setFastBlockNumber(blockNumber); // @TODO: Still need this?
                return { blockNumber, reqTime, respTime };
            });
            this._internalBlockNumber = checkInternalBlockNumber;
            // Swallow unhandled exceptions; if needed they are handled else where
            checkInternalBlockNumber.catch((error) => {
                // Don't null the dead (rejected) fetch, if it has already been updated
                if (this._internalBlockNumber === checkInternalBlockNumber) {
                    this._internalBlockNumber = null;
                }
            });
            return (yield checkInternalBlockNumber).blockNumber;
        });
    }
    poll() {
        return base_provider_awaiter(this, void 0, void 0, function* () {
            const pollId = nextPollId++;
            // Track all running promises, so we can trigger a post-poll once they are complete
            const runners = [];
            let blockNumber = null;
            try {
                blockNumber = yield this._getInternalBlockNumber(100 + this.pollingInterval / 2);
            }
            catch (error) {
                this.emit("error", error);
                return;
            }
            this._setFastBlockNumber(blockNumber);
            // Emit a poll event after we have the latest (fast) block number
            this.emit("poll", pollId, blockNumber);
            // If the block has not changed, meh.
            if (blockNumber === this._lastBlockNumber) {
                this.emit("didPoll", pollId);
                return;
            }
            // First polling cycle, trigger a "block" events
            if (this._emitted.block === -2) {
                this._emitted.block = blockNumber - 1;
            }
            if (Math.abs((this._emitted.block) - blockNumber) > 1000) {
                base_provider_logger.warn(`network block skew detected; skipping block events (emitted=${this._emitted.block} blockNumber${blockNumber})`);
                this.emit("error", base_provider_logger.makeError("network block skew detected", lib_esm_Logger.errors.NETWORK_ERROR, {
                    blockNumber: blockNumber,
                    event: "blockSkew",
                    previousBlockNumber: this._emitted.block
                }));
                this.emit("block", blockNumber);
            }
            else {
                // Notify all listener for each block that has passed
                for (let i = this._emitted.block + 1; i <= blockNumber; i++) {
                    this.emit("block", i);
                }
            }
            // The emitted block was updated, check for obsolete events
            if (this._emitted.block !== blockNumber) {
                this._emitted.block = blockNumber;
                Object.keys(this._emitted).forEach((key) => {
                    // The block event does not expire
                    if (key === "block") {
                        return;
                    }
                    // The block we were at when we emitted this event
                    const eventBlockNumber = this._emitted[key];
                    // We cannot garbage collect pending transactions or blocks here
                    // They should be garbage collected by the Provider when setting
                    // "pending" events
                    if (eventBlockNumber === "pending") {
                        return;
                    }
                    // Evict any transaction hashes or block hashes over 12 blocks
                    // old, since they should not return null anyways
                    if (blockNumber - eventBlockNumber > 12) {
                        delete this._emitted[key];
                    }
                });
            }
            // First polling cycle
            if (this._lastBlockNumber === -2) {
                this._lastBlockNumber = blockNumber - 1;
            }
            // Find all transaction hashes we are waiting on
            this._events.forEach((event) => {
                switch (event.type) {
                    case "tx": {
                        const hash = event.hash;
                        let runner = this.getTransactionReceipt(hash).then((receipt) => {
                            if (!receipt || receipt.blockNumber == null) {
                                return null;
                            }
                            this._emitted["t:" + hash] = receipt.blockNumber;
                            this.emit(hash, receipt);
                            return null;
                        }).catch((error) => { this.emit("error", error); });
                        runners.push(runner);
                        break;
                    }
                    case "filter": {
                        // We only allow a single getLogs to be in-flight at a time
                        if (!event._inflight) {
                            event._inflight = true;
                            // This is the first filter for this event, so we want to
                            // restrict events to events that happened no earlier than now
                            if (event._lastBlockNumber === -2) {
                                event._lastBlockNumber = blockNumber - 1;
                            }
                            // Filter from the last *known* event; due to load-balancing
                            // and some nodes returning updated block numbers before
                            // indexing events, a logs result with 0 entries cannot be
                            // trusted and we must retry a range which includes it again
                            const filter = event.filter;
                            filter.fromBlock = event._lastBlockNumber + 1;
                            filter.toBlock = blockNumber;
                            // Prevent fitler ranges from growing too wild, since it is quite
                            // likely there just haven't been any events to move the lastBlockNumber.
                            const minFromBlock = filter.toBlock - this._maxFilterBlockRange;
                            if (minFromBlock > filter.fromBlock) {
                                filter.fromBlock = minFromBlock;
                            }
                            if (filter.fromBlock < 0) {
                                filter.fromBlock = 0;
                            }
                            const runner = this.getLogs(filter).then((logs) => {
                                // Allow the next getLogs
                                event._inflight = false;
                                if (logs.length === 0) {
                                    return;
                                }
                                logs.forEach((log) => {
                                    // Only when we get an event for a given block number
                                    // can we trust the events are indexed
                                    if (log.blockNumber > event._lastBlockNumber) {
                                        event._lastBlockNumber = log.blockNumber;
                                    }
                                    // Make sure we stall requests to fetch blocks and txs
                                    this._emitted["b:" + log.blockHash] = log.blockNumber;
                                    this._emitted["t:" + log.transactionHash] = log.blockNumber;
                                    this.emit(filter, log);
                                });
                            }).catch((error) => {
                                this.emit("error", error);
                                // Allow another getLogs (the range was not updated)
                                event._inflight = false;
                            });
                            runners.push(runner);
                        }
                        break;
                    }
                }
            });
            this._lastBlockNumber = blockNumber;
            // Once all events for this loop have been processed, emit "didPoll"
            Promise.all(runners).then(() => {
                this.emit("didPoll", pollId);
            }).catch((error) => { this.emit("error", error); });
            return;
        });
    }
    // Deprecated; do not use this
    resetEventsBlock(blockNumber) {
        this._lastBlockNumber = blockNumber - 1;
        if (this.polling) {
            this.poll();
        }
    }
    get network() {
        return this._network;
    }
    // This method should query the network if the underlying network
    // can change, such as when connected to a JSON-RPC backend
    detectNetwork() {
        return base_provider_awaiter(this, void 0, void 0, function* () {
            return base_provider_logger.throwError("provider does not support network detection", lib_esm_Logger.errors.UNSUPPORTED_OPERATION, {
                operation: "provider.detectNetwork"
            });
        });
    }
    getNetwork() {
        return base_provider_awaiter(this, void 0, void 0, function* () {
            const network = yield this._ready();
            // Make sure we are still connected to the same network; this is
            // only an external call for backends which can have the underlying
            // network change spontaneously
            const currentNetwork = yield this.detectNetwork();
            if (network.chainId !== currentNetwork.chainId) {
                // We are allowing network changes, things can get complex fast;
                // make sure you know what you are doing if you use "any"
                if (this.anyNetwork) {
                    this._network = currentNetwork;
                    // Reset all internal block number guards and caches
                    this._lastBlockNumber = -2;
                    this._fastBlockNumber = null;
                    this._fastBlockNumberPromise = null;
                    this._fastQueryDate = 0;
                    this._emitted.block = -2;
                    this._maxInternalBlockNumber = -1024;
                    this._internalBlockNumber = null;
                    // The "network" event MUST happen before this method resolves
                    // so any events have a chance to unregister, so we stall an
                    // additional event loop before returning from /this/ call
                    this.emit("network", currentNetwork, network);
                    yield stall(0);
                    return this._network;
                }
                const error = base_provider_logger.makeError("underlying network changed", lib_esm_Logger.errors.NETWORK_ERROR, {
                    event: "changed",
                    network: network,
                    detectedNetwork: currentNetwork
                });
                this.emit("error", error);
                throw error;
            }
            return network;
        });
    }
    get blockNumber() {
        this._getInternalBlockNumber(100 + this.pollingInterval / 2).then((blockNumber) => {
            this._setFastBlockNumber(blockNumber);
        }, (error) => { });
        return (this._fastBlockNumber != null) ? this._fastBlockNumber : -1;
    }
    get polling() {
        return (this._poller != null);
    }
    set polling(value) {
        if (value && !this._poller) {
            this._poller = setInterval(() => { this.poll(); }, this.pollingInterval);
            if (!this._bootstrapPoll) {
                this._bootstrapPoll = setTimeout(() => {
                    this.poll();
                    // We block additional polls until the polling interval
                    // is done, to prevent overwhelming the poll function
                    this._bootstrapPoll = setTimeout(() => {
                        // If polling was disabled, something may require a poke
                        // since starting the bootstrap poll and it was disabled
                        if (!this._poller) {
                            this.poll();
                        }
                        // Clear out the bootstrap so we can do another
                        this._bootstrapPoll = null;
                    }, this.pollingInterval);
                }, 0);
            }
        }
        else if (!value && this._poller) {
            clearInterval(this._poller);
            this._poller = null;
        }
    }
    get pollingInterval() {
        return this._pollingInterval;
    }
    set pollingInterval(value) {
        if (typeof (value) !== "number" || value <= 0 || parseInt(String(value)) != value) {
            throw new Error("invalid polling interval");
        }
        this._pollingInterval = value;
        if (this._poller) {
            clearInterval(this._poller);
            this._poller = setInterval(() => { this.poll(); }, this._pollingInterval);
        }
    }
    _getFastBlockNumber() {
        const now = getTime();
        // Stale block number, request a newer value
        if ((now - this._fastQueryDate) > 2 * this._pollingInterval) {
            this._fastQueryDate = now;
            this._fastBlockNumberPromise = this.getBlockNumber().then((blockNumber) => {
                if (this._fastBlockNumber == null || blockNumber > this._fastBlockNumber) {
                    this._fastBlockNumber = blockNumber;
                }
                return this._fastBlockNumber;
            });
        }
        return this._fastBlockNumberPromise;
    }
    _setFastBlockNumber(blockNumber) {
        // Older block, maybe a stale request
        if (this._fastBlockNumber != null && blockNumber < this._fastBlockNumber) {
            return;
        }
        // Update the time we updated the blocknumber
        this._fastQueryDate = getTime();
        // Newer block number, use  it
        if (this._fastBlockNumber == null || blockNumber > this._fastBlockNumber) {
            this._fastBlockNumber = blockNumber;
            this._fastBlockNumberPromise = Promise.resolve(blockNumber);
        }
    }
    waitForTransaction(transactionHash, confirmations, timeout) {
        return base_provider_awaiter(this, void 0, void 0, function* () {
            return this._waitForTransaction(transactionHash, (confirmations == null) ? 1 : confirmations, timeout || 0, null);
        });
    }
    _waitForTransaction(transactionHash, confirmations, timeout, replaceable) {
        return base_provider_awaiter(this, void 0, void 0, function* () {
            const receipt = yield this.getTransactionReceipt(transactionHash);
            // Receipt is already good
            if ((receipt ? receipt.confirmations : 0) >= confirmations) {
                return receipt;
            }
            // Poll until the receipt is good...
            return new Promise((resolve, reject) => {
                const cancelFuncs = [];
                let done = false;
                const alreadyDone = function () {
                    if (done) {
                        return true;
                    }
                    done = true;
                    cancelFuncs.forEach((func) => { func(); });
                    return false;
                };
                const minedHandler = (receipt) => {
                    if (receipt.confirmations < confirmations) {
                        return;
                    }
                    if (alreadyDone()) {
                        return;
                    }
                    resolve(receipt);
                };
                this.on(transactionHash, minedHandler);
                cancelFuncs.push(() => { this.removeListener(transactionHash, minedHandler); });
                if (replaceable) {
                    let lastBlockNumber = replaceable.startBlock;
                    let scannedBlock = null;
                    const replaceHandler = (blockNumber) => base_provider_awaiter(this, void 0, void 0, function* () {
                        if (done) {
                            return;
                        }
                        // Wait 1 second; this is only used in the case of a fault, so
                        // we will trade off a little bit of latency for more consistent
                        // results and fewer JSON-RPC calls
                        yield stall(1000);
                        this.getTransactionCount(replaceable.from).then((nonce) => base_provider_awaiter(this, void 0, void 0, function* () {
                            if (done) {
                                return;
                            }
                            if (nonce <= replaceable.nonce) {
                                lastBlockNumber = blockNumber;
                            }
                            else {
                                // First check if the transaction was mined
                                {
                                    const mined = yield this.getTransaction(transactionHash);
                                    if (mined && mined.blockNumber != null) {
                                        return;
                                    }
                                }
                                // First time scanning. We start a little earlier for some
                                // wiggle room here to handle the eventually consistent nature
                                // of blockchain (e.g. the getTransactionCount was for a
                                // different block)
                                if (scannedBlock == null) {
                                    scannedBlock = lastBlockNumber - 3;
                                    if (scannedBlock < replaceable.startBlock) {
                                        scannedBlock = replaceable.startBlock;
                                    }
                                }
                                while (scannedBlock <= blockNumber) {
                                    if (done) {
                                        return;
                                    }
                                    const block = yield this.getBlockWithTransactions(scannedBlock);
                                    for (let ti = 0; ti < block.transactions.length; ti++) {
                                        const tx = block.transactions[ti];
                                        // Successfully mined!
                                        if (tx.hash === transactionHash) {
                                            return;
                                        }
                                        // Matches our transaction from and nonce; its a replacement
                                        if (tx.from === replaceable.from && tx.nonce === replaceable.nonce) {
                                            if (done) {
                                                return;
                                            }
                                            // Get the receipt of the replacement
                                            const receipt = yield this.waitForTransaction(tx.hash, confirmations);
                                            // Already resolved or rejected (prolly a timeout)
                                            if (alreadyDone()) {
                                                return;
                                            }
                                            // The reason we were replaced
                                            let reason = "replaced";
                                            if (tx.data === replaceable.data && tx.to === replaceable.to && tx.value.eq(replaceable.value)) {
                                                reason = "repriced";
                                            }
                                            else if (tx.data === "0x" && tx.from === tx.to && tx.value.isZero()) {
                                                reason = "cancelled";
                                            }
                                            // Explain why we were replaced
                                            reject(base_provider_logger.makeError("transaction was replaced", lib_esm_Logger.errors.TRANSACTION_REPLACED, {
                                                cancelled: (reason === "replaced" || reason === "cancelled"),
                                                reason,
                                                replacement: this._wrapTransaction(tx),
                                                hash: transactionHash,
                                                receipt
                                            }));
                                            return;
                                        }
                                    }
                                    scannedBlock++;
                                }
                            }
                            if (done) {
                                return;
                            }
                            this.once("block", replaceHandler);
                        }), (error) => {
                            if (done) {
                                return;
                            }
                            this.once("block", replaceHandler);
                        });
                    });
                    if (done) {
                        return;
                    }
                    this.once("block", replaceHandler);
                    cancelFuncs.push(() => {
                        this.removeListener("block", replaceHandler);
                    });
                }
                if (typeof (timeout) === "number" && timeout > 0) {
                    const timer = setTimeout(() => {
                        if (alreadyDone()) {
                            return;
                        }
                        reject(base_provider_logger.makeError("timeout exceeded", lib_esm_Logger.errors.TIMEOUT, { timeout: timeout }));
                    }, timeout);
                    if (timer.unref) {
                        timer.unref();
                    }
                    cancelFuncs.push(() => { clearTimeout(timer); });
                }
            });
        });
    }
    getBlockNumber() {
        return base_provider_awaiter(this, void 0, void 0, function* () {
            return this._getInternalBlockNumber(0);
        });
    }
    getGasPrice() {
        return base_provider_awaiter(this, void 0, void 0, function* () {
            yield this.getNetwork();
            const result = yield this.perform("getGasPrice", {});
            try {
                return bignumber_BigNumber.from(result);
            }
            catch (error) {
                return base_provider_logger.throwError("bad result from backend", lib_esm_Logger.errors.SERVER_ERROR, {
                    method: "getGasPrice",
                    result, error
                });
            }
        });
    }
    getBalance(addressOrName, blockTag) {
        return base_provider_awaiter(this, void 0, void 0, function* () {
            yield this.getNetwork();
            const params = yield resolveProperties({
                address: this._getAddress(addressOrName),
                blockTag: this._getBlockTag(blockTag)
            });
            const result = yield this.perform("getBalance", params);
            try {
                return bignumber_BigNumber.from(result);
            }
            catch (error) {
                return base_provider_logger.throwError("bad result from backend", lib_esm_Logger.errors.SERVER_ERROR, {
                    method: "getBalance",
                    params, result, error
                });
            }
        });
    }
    getTransactionCount(addressOrName, blockTag) {
        return base_provider_awaiter(this, void 0, void 0, function* () {
            yield this.getNetwork();
            const params = yield resolveProperties({
                address: this._getAddress(addressOrName),
                blockTag: this._getBlockTag(blockTag)
            });
            const result = yield this.perform("getTransactionCount", params);
            try {
                return bignumber_BigNumber.from(result).toNumber();
            }
            catch (error) {
                return base_provider_logger.throwError("bad result from backend", lib_esm_Logger.errors.SERVER_ERROR, {
                    method: "getTransactionCount",
                    params, result, error
                });
            }
        });
    }
    getCode(addressOrName, blockTag) {
        return base_provider_awaiter(this, void 0, void 0, function* () {
            yield this.getNetwork();
            const params = yield resolveProperties({
                address: this._getAddress(addressOrName),
                blockTag: this._getBlockTag(blockTag)
            });
            const result = yield this.perform("getCode", params);
            try {
                return lib_esm_hexlify(result);
            }
            catch (error) {
                return base_provider_logger.throwError("bad result from backend", lib_esm_Logger.errors.SERVER_ERROR, {
                    method: "getCode",
                    params, result, error
                });
            }
        });
    }
    getStorageAt(addressOrName, position, blockTag) {
        return base_provider_awaiter(this, void 0, void 0, function* () {
            yield this.getNetwork();
            const params = yield resolveProperties({
                address: this._getAddress(addressOrName),
                blockTag: this._getBlockTag(blockTag),
                position: Promise.resolve(position).then((p) => hexValue(p))
            });
            const result = yield this.perform("getStorageAt", params);
            try {
                return lib_esm_hexlify(result);
            }
            catch (error) {
                return base_provider_logger.throwError("bad result from backend", lib_esm_Logger.errors.SERVER_ERROR, {
                    method: "getStorageAt",
                    params, result, error
                });
            }
        });
    }
    // This should be called by any subclass wrapping a TransactionResponse
    _wrapTransaction(tx, hash, startBlock) {
        if (hash != null && lib_esm_hexDataLength(hash) !== 32) {
            throw new Error("invalid response - sendTransaction");
        }
        const result = tx;
        // Check the hash we expect is the same as the hash the server reported
        if (hash != null && tx.hash !== hash) {
            base_provider_logger.throwError("Transaction hash mismatch from Provider.sendTransaction.", lib_esm_Logger.errors.UNKNOWN_ERROR, { expectedHash: tx.hash, returnedHash: hash });
        }
        result.wait = (confirms, timeout) => base_provider_awaiter(this, void 0, void 0, function* () {
            if (confirms == null) {
                confirms = 1;
            }
            if (timeout == null) {
                timeout = 0;
            }
            // Get the details to detect replacement
            let replacement = undefined;
            if (confirms !== 0 && startBlock != null) {
                replacement = {
                    data: tx.data,
                    from: tx.from,
                    nonce: tx.nonce,
                    to: tx.to,
                    value: tx.value,
                    startBlock
                };
            }
            const receipt = yield this._waitForTransaction(tx.hash, confirms, timeout, replacement);
            if (receipt == null && confirms === 0) {
                return null;
            }
            // No longer pending, allow the polling loop to garbage collect this
            this._emitted["t:" + tx.hash] = receipt.blockNumber;
            if (receipt.status === 0) {
                base_provider_logger.throwError("transaction failed", lib_esm_Logger.errors.CALL_EXCEPTION, {
                    transactionHash: tx.hash,
                    transaction: tx,
                    receipt: receipt
                });
            }
            return receipt;
        });
        return result;
    }
    sendTransaction(signedTransaction) {
        return base_provider_awaiter(this, void 0, void 0, function* () {
            yield this.getNetwork();
            const hexTx = yield Promise.resolve(signedTransaction).then(t => lib_esm_hexlify(t));
            const tx = this.formatter.transaction(signedTransaction);
            if (tx.confirmations == null) {
                tx.confirmations = 0;
            }
            const blockNumber = yield this._getInternalBlockNumber(100 + 2 * this.pollingInterval);
            try {
                const hash = yield this.perform("sendTransaction", { signedTransaction: hexTx });
                return this._wrapTransaction(tx, hash, blockNumber);
            }
            catch (error) {
                error.transaction = tx;
                error.transactionHash = tx.hash;
                throw error;
            }
        });
    }
    _getTransactionRequest(transaction) {
        return base_provider_awaiter(this, void 0, void 0, function* () {
            const values = yield transaction;
            const tx = {};
            ["from", "to"].forEach((key) => {
                if (values[key] == null) {
                    return;
                }
                tx[key] = Promise.resolve(values[key]).then((v) => (v ? this._getAddress(v) : null));
            });
            ["gasLimit", "gasPrice", "maxFeePerGas", "maxPriorityFeePerGas", "value"].forEach((key) => {
                if (values[key] == null) {
                    return;
                }
                tx[key] = Promise.resolve(values[key]).then((v) => (v ? bignumber_BigNumber.from(v) : null));
            });
            ["type"].forEach((key) => {
                if (values[key] == null) {
                    return;
                }
                tx[key] = Promise.resolve(values[key]).then((v) => ((v != null) ? v : null));
            });
            if (values.accessList) {
                tx.accessList = this.formatter.accessList(values.accessList);
            }
            ["data"].forEach((key) => {
                if (values[key] == null) {
                    return;
                }
                tx[key] = Promise.resolve(values[key]).then((v) => (v ? lib_esm_hexlify(v) : null));
            });
            return this.formatter.transactionRequest(yield resolveProperties(tx));
        });
    }
    _getFilter(filter) {
        return base_provider_awaiter(this, void 0, void 0, function* () {
            filter = yield filter;
            const result = {};
            if (filter.address != null) {
                result.address = this._getAddress(filter.address);
            }
            ["blockHash", "topics"].forEach((key) => {
                if (filter[key] == null) {
                    return;
                }
                result[key] = filter[key];
            });
            ["fromBlock", "toBlock"].forEach((key) => {
                if (filter[key] == null) {
                    return;
                }
                result[key] = this._getBlockTag(filter[key]);
            });
            return this.formatter.filter(yield resolveProperties(result));
        });
    }
    _call(transaction, blockTag, attempt) {
        return base_provider_awaiter(this, void 0, void 0, function* () {
            if (attempt >= MAX_CCIP_REDIRECTS) {
                base_provider_logger.throwError("CCIP read exceeded maximum redirections", lib_esm_Logger.errors.SERVER_ERROR, {
                    redirects: attempt, transaction
                });
            }
            const txSender = transaction.to;
            const result = yield this.perform("call", { transaction, blockTag });
            // CCIP Read request via OffchainLookup(address,string[],bytes,bytes4,bytes)
            if (attempt >= 0 && blockTag === "latest" && txSender != null && result.substring(0, 10) === "0x556f1830" && (lib_esm_hexDataLength(result) % 32 === 4)) {
                try {
                    const data = lib_esm_hexDataSlice(result, 4);
                    // Check the sender of the OffchainLookup matches the transaction
                    const sender = lib_esm_hexDataSlice(data, 0, 32);
                    if (!bignumber_BigNumber.from(sender).eq(txSender)) {
                        base_provider_logger.throwError("CCIP Read sender did not match", lib_esm_Logger.errors.CALL_EXCEPTION, {
                            name: "OffchainLookup",
                            signature: "OffchainLookup(address,string[],bytes,bytes4,bytes)",
                            transaction, data: result
                        });
                    }
                    // Read the URLs from the response
                    const urls = [];
                    const urlsOffset = bignumber_BigNumber.from(lib_esm_hexDataSlice(data, 32, 64)).toNumber();
                    const urlsLength = bignumber_BigNumber.from(lib_esm_hexDataSlice(data, urlsOffset, urlsOffset + 32)).toNumber();
                    const urlsData = lib_esm_hexDataSlice(data, urlsOffset + 32);
                    for (let u = 0; u < urlsLength; u++) {
                        const url = _parseString(urlsData, u * 32);
                        if (url == null) {
                            base_provider_logger.throwError("CCIP Read contained corrupt URL string", lib_esm_Logger.errors.CALL_EXCEPTION, {
                                name: "OffchainLookup",
                                signature: "OffchainLookup(address,string[],bytes,bytes4,bytes)",
                                transaction, data: result
                            });
                        }
                        urls.push(url);
                    }
                    // Get the CCIP calldata to forward
                    const calldata = _parseBytes(data, 64);
                    // Get the callbackSelector (bytes4)
                    if (!bignumber_BigNumber.from(lib_esm_hexDataSlice(data, 100, 128)).isZero()) {
                        base_provider_logger.throwError("CCIP Read callback selector included junk", lib_esm_Logger.errors.CALL_EXCEPTION, {
                            name: "OffchainLookup",
                            signature: "OffchainLookup(address,string[],bytes,bytes4,bytes)",
                            transaction, data: result
                        });
                    }
                    const callbackSelector = lib_esm_hexDataSlice(data, 96, 100);
                    // Get the extra data to send back to the contract as context
                    const extraData = _parseBytes(data, 128);
                    const ccipResult = yield this.ccipReadFetch(transaction, calldata, urls);
                    if (ccipResult == null) {
                        base_provider_logger.throwError("CCIP Read disabled or provided no URLs", lib_esm_Logger.errors.CALL_EXCEPTION, {
                            name: "OffchainLookup",
                            signature: "OffchainLookup(address,string[],bytes,bytes4,bytes)",
                            transaction, data: result
                        });
                    }
                    const tx = {
                        to: txSender,
                        data: hexConcat([callbackSelector, encodeBytes([ccipResult, extraData])])
                    };
                    return this._call(tx, blockTag, attempt + 1);
                }
                catch (error) {
                    if (error.code === lib_esm_Logger.errors.SERVER_ERROR) {
                        throw error;
                    }
                }
            }
            try {
                return lib_esm_hexlify(result);
            }
            catch (error) {
                return base_provider_logger.throwError("bad result from backend", lib_esm_Logger.errors.SERVER_ERROR, {
                    method: "call",
                    params: { transaction, blockTag }, result, error
                });
            }
        });
    }
    call(transaction, blockTag) {
        return base_provider_awaiter(this, void 0, void 0, function* () {
            yield this.getNetwork();
            const resolved = yield resolveProperties({
                transaction: this._getTransactionRequest(transaction),
                blockTag: this._getBlockTag(blockTag),
                ccipReadEnabled: Promise.resolve(transaction.ccipReadEnabled)
            });
            return this._call(resolved.transaction, resolved.blockTag, resolved.ccipReadEnabled ? 0 : -1);
        });
    }
    estimateGas(transaction) {
        return base_provider_awaiter(this, void 0, void 0, function* () {
            yield this.getNetwork();
            const params = yield resolveProperties({
                transaction: this._getTransactionRequest(transaction)
            });
            const result = yield this.perform("estimateGas", params);
            try {
                return bignumber_BigNumber.from(result);
            }
            catch (error) {
                return base_provider_logger.throwError("bad result from backend", lib_esm_Logger.errors.SERVER_ERROR, {
                    method: "estimateGas",
                    params, result, error
                });
            }
        });
    }
    _getAddress(addressOrName) {
        return base_provider_awaiter(this, void 0, void 0, function* () {
            addressOrName = yield addressOrName;
            if (typeof (addressOrName) !== "string") {
                base_provider_logger.throwArgumentError("invalid address or ENS name", "name", addressOrName);
            }
            const address = yield this.resolveName(addressOrName);
            if (address == null) {
                base_provider_logger.throwError("ENS name not configured", lib_esm_Logger.errors.UNSUPPORTED_OPERATION, {
                    operation: `resolveName(${JSON.stringify(addressOrName)})`
                });
            }
            return address;
        });
    }
    _getBlock(blockHashOrBlockTag, includeTransactions) {
        return base_provider_awaiter(this, void 0, void 0, function* () {
            yield this.getNetwork();
            blockHashOrBlockTag = yield blockHashOrBlockTag;
            // If blockTag is a number (not "latest", etc), this is the block number
            let blockNumber = -128;
            const params = {
                includeTransactions: !!includeTransactions
            };
            if (lib_esm_isHexString(blockHashOrBlockTag, 32)) {
                params.blockHash = blockHashOrBlockTag;
            }
            else {
                try {
                    params.blockTag = yield this._getBlockTag(blockHashOrBlockTag);
                    if (lib_esm_isHexString(params.blockTag)) {
                        blockNumber = parseInt(params.blockTag.substring(2), 16);
                    }
                }
                catch (error) {
                    base_provider_logger.throwArgumentError("invalid block hash or block tag", "blockHashOrBlockTag", blockHashOrBlockTag);
                }
            }
            return poll(() => base_provider_awaiter(this, void 0, void 0, function* () {
                const block = yield this.perform("getBlock", params);
                // Block was not found
                if (block == null) {
                    // For blockhashes, if we didn't say it existed, that blockhash may
                    // not exist. If we did see it though, perhaps from a log, we know
                    // it exists, and this node is just not caught up yet.
                    if (params.blockHash != null) {
                        if (this._emitted["b:" + params.blockHash] == null) {
                            return null;
                        }
                    }
                    // For block tags, if we are asking for a future block, we return null
                    if (params.blockTag != null) {
                        if (blockNumber > this._emitted.block) {
                            return null;
                        }
                    }
                    // Retry on the next block
                    return undefined;
                }
                // Add transactions
                if (includeTransactions) {
                    let blockNumber = null;
                    for (let i = 0; i < block.transactions.length; i++) {
                        const tx = block.transactions[i];
                        if (tx.blockNumber == null) {
                            tx.confirmations = 0;
                        }
                        else if (tx.confirmations == null) {
                            if (blockNumber == null) {
                                blockNumber = yield this._getInternalBlockNumber(100 + 2 * this.pollingInterval);
                            }
                            // Add the confirmations using the fast block number (pessimistic)
                            let confirmations = (blockNumber - tx.blockNumber) + 1;
                            if (confirmations <= 0) {
                                confirmations = 1;
                            }
                            tx.confirmations = confirmations;
                        }
                    }
                    const blockWithTxs = this.formatter.blockWithTransactions(block);
                    blockWithTxs.transactions = blockWithTxs.transactions.map((tx) => this._wrapTransaction(tx));
                    return blockWithTxs;
                }
                return this.formatter.block(block);
            }), { oncePoll: this });
        });
    }
    getBlock(blockHashOrBlockTag) {
        return (this._getBlock(blockHashOrBlockTag, false));
    }
    getBlockWithTransactions(blockHashOrBlockTag) {
        return (this._getBlock(blockHashOrBlockTag, true));
    }
    getTransaction(transactionHash) {
        return base_provider_awaiter(this, void 0, void 0, function* () {
            yield this.getNetwork();
            transactionHash = yield transactionHash;
            const params = { transactionHash: this.formatter.hash(transactionHash, true) };
            return poll(() => base_provider_awaiter(this, void 0, void 0, function* () {
                const result = yield this.perform("getTransaction", params);
                if (result == null) {
                    if (this._emitted["t:" + transactionHash] == null) {
                        return null;
                    }
                    return undefined;
                }
                const tx = this.formatter.transactionResponse(result);
                if (tx.blockNumber == null) {
                    tx.confirmations = 0;
                }
                else if (tx.confirmations == null) {
                    const blockNumber = yield this._getInternalBlockNumber(100 + 2 * this.pollingInterval);
                    // Add the confirmations using the fast block number (pessimistic)
                    let confirmations = (blockNumber - tx.blockNumber) + 1;
                    if (confirmations <= 0) {
                        confirmations = 1;
                    }
                    tx.confirmations = confirmations;
                }
                return this._wrapTransaction(tx);
            }), { oncePoll: this });
        });
    }
    getTransactionReceipt(transactionHash) {
        return base_provider_awaiter(this, void 0, void 0, function* () {
            yield this.getNetwork();
            transactionHash = yield transactionHash;
            const params = { transactionHash: this.formatter.hash(transactionHash, true) };
            return poll(() => base_provider_awaiter(this, void 0, void 0, function* () {
                const result = yield this.perform("getTransactionReceipt", params);
                if (result == null) {
                    if (this._emitted["t:" + transactionHash] == null) {
                        return null;
                    }
                    return undefined;
                }
                // "geth-etc" returns receipts before they are ready
                if (result.blockHash == null) {
                    return undefined;
                }
                const receipt = this.formatter.receipt(result);
                if (receipt.blockNumber == null) {
                    receipt.confirmations = 0;
                }
                else if (receipt.confirmations == null) {
                    const blockNumber = yield this._getInternalBlockNumber(100 + 2 * this.pollingInterval);
                    // Add the confirmations using the fast block number (pessimistic)
                    let confirmations = (blockNumber - receipt.blockNumber) + 1;
                    if (confirmations <= 0) {
                        confirmations = 1;
                    }
                    receipt.confirmations = confirmations;
                }
                return receipt;
            }), { oncePoll: this });
        });
    }
    getLogs(filter) {
        return base_provider_awaiter(this, void 0, void 0, function* () {
            yield this.getNetwork();
            const params = yield resolveProperties({ filter: this._getFilter(filter) });
            const logs = yield this.perform("getLogs", params);
            logs.forEach((log) => {
                if (log.removed == null) {
                    log.removed = false;
                }
            });
            return Formatter.arrayOf(this.formatter.filterLog.bind(this.formatter))(logs);
        });
    }
    getEtherPrice() {
        return base_provider_awaiter(this, void 0, void 0, function* () {
            yield this.getNetwork();
            return this.perform("getEtherPrice", {});
        });
    }
    _getBlockTag(blockTag) {
        return base_provider_awaiter(this, void 0, void 0, function* () {
            blockTag = yield blockTag;
            if (typeof (blockTag) === "number" && blockTag < 0) {
                if (blockTag % 1) {
                    base_provider_logger.throwArgumentError("invalid BlockTag", "blockTag", blockTag);
                }
                let blockNumber = yield this._getInternalBlockNumber(100 + 2 * this.pollingInterval);
                blockNumber += blockTag;
                if (blockNumber < 0) {
                    blockNumber = 0;
                }
                return this.formatter.blockTag(blockNumber);
            }
            return this.formatter.blockTag(blockTag);
        });
    }
    getResolver(name) {
        return base_provider_awaiter(this, void 0, void 0, function* () {
            let currentName = name;
            while (true) {
                if (currentName === "" || currentName === ".") {
                    return null;
                }
                // Optimization since the eth node cannot change and does
                // not have a wildcard resolver
                if (name !== "eth" && currentName === "eth") {
                    return null;
                }
                // Check the current node for a resolver
                const addr = yield this._getResolver(currentName, "getResolver");
                // Found a resolver!
                if (addr != null) {
                    const resolver = new Resolver(this, addr, name);
                    // Legacy resolver found, using EIP-2544 so it isn't safe to use
                    if (currentName !== name && !(yield resolver.supportsWildcard())) {
                        return null;
                    }
                    return resolver;
                }
                // Get the parent node
                currentName = currentName.split(".").slice(1).join(".");
            }
        });
    }
    _getResolver(name, operation) {
        return base_provider_awaiter(this, void 0, void 0, function* () {
            if (operation == null) {
                operation = "ENS";
            }
            const network = yield this.getNetwork();
            // No ENS...
            if (!network.ensAddress) {
                base_provider_logger.throwError("network does not support ENS", lib_esm_Logger.errors.UNSUPPORTED_OPERATION, { operation, network: network.name });
            }
            try {
                // keccak256("resolver(bytes32)")
                const addrData = yield this.call({
                    to: network.ensAddress,
                    data: ("0x0178b8bf" + namehash(name).substring(2))
                });
                return this.formatter.callAddress(addrData);
            }
            catch (error) {
                // ENS registry cannot throw errors on resolver(bytes32)
            }
            return null;
        });
    }
    resolveName(name) {
        return base_provider_awaiter(this, void 0, void 0, function* () {
            name = yield name;
            // If it is already an address, nothing to resolve
            try {
                return Promise.resolve(this.formatter.address(name));
            }
            catch (error) {
                // If is is a hexstring, the address is bad (See #694)
                if (lib_esm_isHexString(name)) {
                    throw error;
                }
            }
            if (typeof (name) !== "string") {
                base_provider_logger.throwArgumentError("invalid ENS name", "name", name);
            }
            // Get the addr from the resolver
            const resolver = yield this.getResolver(name);
            if (!resolver) {
                return null;
            }
            return yield resolver.getAddress();
        });
    }
    lookupAddress(address) {
        return base_provider_awaiter(this, void 0, void 0, function* () {
            address = yield address;
            address = this.formatter.address(address);
            const node = address.substring(2).toLowerCase() + ".addr.reverse";
            const resolverAddr = yield this._getResolver(node, "lookupAddress");
            if (resolverAddr == null) {
                return null;
            }
            // keccak("name(bytes32)")
            const name = _parseString(yield this.call({
                to: resolverAddr,
                data: ("0x691f3431" + namehash(node).substring(2))
            }), 0);
            const addr = yield this.resolveName(name);
            if (addr != address) {
                return null;
            }
            return name;
        });
    }
    getAvatar(nameOrAddress) {
        return base_provider_awaiter(this, void 0, void 0, function* () {
            let resolver = null;
            if (lib_esm_isHexString(nameOrAddress)) {
                // Address; reverse lookup
                const address = this.formatter.address(nameOrAddress);
                const node = address.substring(2).toLowerCase() + ".addr.reverse";
                const resolverAddress = yield this._getResolver(node, "getAvatar");
                if (!resolverAddress) {
                    return null;
                }
                // Try resolving the avatar against the addr.reverse resolver
                resolver = new Resolver(this, resolverAddress, node);
                try {
                    const avatar = yield resolver.getAvatar();
                    if (avatar) {
                        return avatar.url;
                    }
                }
                catch (error) {
                    if (error.code !== lib_esm_Logger.errors.CALL_EXCEPTION) {
                        throw error;
                    }
                }
                // Try getting the name and performing forward lookup; allowing wildcards
                try {
                    // keccak("name(bytes32)")
                    const name = _parseString(yield this.call({
                        to: resolverAddress,
                        data: ("0x691f3431" + namehash(node).substring(2))
                    }), 0);
                    resolver = yield this.getResolver(name);
                }
                catch (error) {
                    if (error.code !== lib_esm_Logger.errors.CALL_EXCEPTION) {
                        throw error;
                    }
                    return null;
                }
            }
            else {
                // ENS name; forward lookup with wildcard
                resolver = yield this.getResolver(nameOrAddress);
                if (!resolver) {
                    return null;
                }
            }
            const avatar = yield resolver.getAvatar();
            if (avatar == null) {
                return null;
            }
            return avatar.url;
        });
    }
    perform(method, params) {
        return base_provider_logger.throwError(method + " not implemented", lib_esm_Logger.errors.NOT_IMPLEMENTED, { operation: method });
    }
    _startEvent(event) {
        this.polling = (this._events.filter((e) => e.pollable()).length > 0);
    }
    _stopEvent(event) {
        this.polling = (this._events.filter((e) => e.pollable()).length > 0);
    }
    _addEventListener(eventName, listener, once) {
        const event = new Event(getEventTag(eventName), listener, once);
        this._events.push(event);
        this._startEvent(event);
        return this;
    }
    on(eventName, listener) {
        return this._addEventListener(eventName, listener, false);
    }
    once(eventName, listener) {
        return this._addEventListener(eventName, listener, true);
    }
    emit(eventName, ...args) {
        let result = false;
        let stopped = [];
        let eventTag = getEventTag(eventName);
        this._events = this._events.filter((event) => {
            if (event.tag !== eventTag) {
                return true;
            }
            setTimeout(() => {
                event.listener.apply(this, args);
            }, 0);
            result = true;
            if (event.once) {
                stopped.push(event);
                return false;
            }
            return true;
        });
        stopped.forEach((event) => { this._stopEvent(event); });
        return result;
    }
    listenerCount(eventName) {
        if (!eventName) {
            return this._events.length;
        }
        let eventTag = getEventTag(eventName);
        return this._events.filter((event) => {
            return (event.tag === eventTag);
        }).length;
    }
    listeners(eventName) {
        if (eventName == null) {
            return this._events.map((event) => event.listener);
        }
        let eventTag = getEventTag(eventName);
        return this._events
            .filter((event) => (event.tag === eventTag))
            .map((event) => event.listener);
    }
    off(eventName, listener) {
        if (listener == null) {
            return this.removeAllListeners(eventName);
        }
        const stopped = [];
        let found = false;
        let eventTag = getEventTag(eventName);
        this._events = this._events.filter((event) => {
            if (event.tag !== eventTag || event.listener != listener) {
                return true;
            }
            if (found) {
                return true;
            }
            found = true;
            stopped.push(event);
            return false;
        });
        stopped.forEach((event) => { this._stopEvent(event); });
        return this;
    }
    removeAllListeners(eventName) {
        let stopped = [];
        if (eventName == null) {
            stopped = this._events;
            this._events = [];
        }
        else {
            const eventTag = getEventTag(eventName);
            this._events = this._events.filter((event) => {
                if (event.tag !== eventTag) {
                    return true;
                }
                stopped.push(event);
                return false;
            });
        }
        stopped.forEach((event) => { this._stopEvent(event); });
        return this;
    }
}
//# sourceMappingURL=base-provider.js.map
;// CONCATENATED MODULE: ./node_modules/@ethersproject/providers/lib.esm/json-rpc-provider.js

var json_rpc_provider_awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};










const json_rpc_provider_logger = new lib_esm_Logger(lib_esm_version_version);

const errorGas = ["call", "estimateGas"];
function spelunk(value, requireData) {
    if (value == null) {
        return null;
    }
    // These *are* the droids we're looking for.
    if (typeof (value.message) === "string" && value.message.match("reverted")) {
        const data = lib_esm_isHexString(value.data) ? value.data : null;
        if (!requireData || data) {
            return { message: value.message, data };
        }
    }
    // Spelunk further...
    if (typeof (value) === "object") {
        for (const key in value) {
            const result = spelunk(value[key], requireData);
            if (result) {
                return result;
            }
        }
        return null;
    }
    // Might be a JSON string we can further descend...
    if (typeof (value) === "string") {
        try {
            return spelunk(JSON.parse(value), requireData);
        }
        catch (error) { }
    }
    return null;
}
function checkError(method, error, params) {
    const transaction = params.transaction || params.signedTransaction;
    // Undo the "convenience" some nodes are attempting to prevent backwards
    // incompatibility; maybe for v6 consider forwarding reverts as errors
    if (method === "call") {
        const result = spelunk(error, true);
        if (result) {
            return result.data;
        }
        // Nothing descriptive..
        json_rpc_provider_logger.throwError("missing revert data in call exception; Transaction reverted without a reason string", lib_esm_Logger.errors.CALL_EXCEPTION, {
            data: "0x", transaction, error
        });
    }
    if (method === "estimateGas") {
        // Try to find something, with a preference on SERVER_ERROR body
        let result = spelunk(error.body, false);
        if (result == null) {
            result = spelunk(error, false);
        }
        // Found "reverted", this is a CALL_EXCEPTION
        if (result) {
            json_rpc_provider_logger.throwError("cannot estimate gas; transaction may fail or may require manual gas limit", lib_esm_Logger.errors.UNPREDICTABLE_GAS_LIMIT, {
                reason: result.message, method, transaction, error
            });
        }
    }
    // @TODO: Should we spelunk for message too?
    let message = error.message;
    if (error.code === lib_esm_Logger.errors.SERVER_ERROR && error.error && typeof (error.error.message) === "string") {
        message = error.error.message;
    }
    else if (typeof (error.body) === "string") {
        message = error.body;
    }
    else if (typeof (error.responseText) === "string") {
        message = error.responseText;
    }
    message = (message || "").toLowerCase();
    // "insufficient funds for gas * price + value + cost(data)"
    if (message.match(/insufficient funds|base fee exceeds gas limit|InsufficientFunds/i)) {
        json_rpc_provider_logger.throwError("insufficient funds for intrinsic transaction cost", lib_esm_Logger.errors.INSUFFICIENT_FUNDS, {
            error, method, transaction
        });
    }
    // "nonce too low"
    if (message.match(/nonce (is )?too low/i)) {
        json_rpc_provider_logger.throwError("nonce has already been used", lib_esm_Logger.errors.NONCE_EXPIRED, {
            error, method, transaction
        });
    }
    // "replacement transaction underpriced"
    if (message.match(/replacement transaction underpriced|transaction gas price.*too low/i)) {
        json_rpc_provider_logger.throwError("replacement fee too low", lib_esm_Logger.errors.REPLACEMENT_UNDERPRICED, {
            error, method, transaction
        });
    }
    // "replacement transaction underpriced"
    if (message.match(/only replay-protected/i)) {
        json_rpc_provider_logger.throwError("legacy pre-eip-155 transactions not supported", lib_esm_Logger.errors.UNSUPPORTED_OPERATION, {
            error, method, transaction
        });
    }
    if (errorGas.indexOf(method) >= 0 && message.match(/gas required exceeds allowance|always failing transaction|execution reverted|revert/)) {
        json_rpc_provider_logger.throwError("cannot estimate gas; transaction may fail or may require manual gas limit", lib_esm_Logger.errors.UNPREDICTABLE_GAS_LIMIT, {
            error, method, transaction
        });
    }
    throw error;
}
function timer(timeout) {
    return new Promise(function (resolve) {
        setTimeout(resolve, timeout);
    });
}
function getResult(payload) {
    if (payload.error) {
        // @TODO: not any
        const error = new Error(payload.error.message);
        error.code = payload.error.code;
        error.data = payload.error.data;
        throw error;
    }
    return payload.result;
}
function getLowerCase(value) {
    if (value) {
        return value.toLowerCase();
    }
    return value;
}
const json_rpc_provider_constructorGuard = {};
class JsonRpcSigner extends Signer {
    constructor(constructorGuard, provider, addressOrIndex) {
        super();
        if (constructorGuard !== json_rpc_provider_constructorGuard) {
            throw new Error("do not call the JsonRpcSigner constructor directly; use provider.getSigner");
        }
        defineReadOnly(this, "provider", provider);
        if (addressOrIndex == null) {
            addressOrIndex = 0;
        }
        if (typeof (addressOrIndex) === "string") {
            defineReadOnly(this, "_address", this.provider.formatter.address(addressOrIndex));
            defineReadOnly(this, "_index", null);
        }
        else if (typeof (addressOrIndex) === "number") {
            defineReadOnly(this, "_index", addressOrIndex);
            defineReadOnly(this, "_address", null);
        }
        else {
            json_rpc_provider_logger.throwArgumentError("invalid address or index", "addressOrIndex", addressOrIndex);
        }
    }
    connect(provider) {
        return json_rpc_provider_logger.throwError("cannot alter JSON-RPC Signer connection", lib_esm_Logger.errors.UNSUPPORTED_OPERATION, {
            operation: "connect"
        });
    }
    connectUnchecked() {
        return new UncheckedJsonRpcSigner(json_rpc_provider_constructorGuard, this.provider, this._address || this._index);
    }
    getAddress() {
        if (this._address) {
            return Promise.resolve(this._address);
        }
        return this.provider.send("eth_accounts", []).then((accounts) => {
            if (accounts.length <= this._index) {
                json_rpc_provider_logger.throwError("unknown account #" + this._index, lib_esm_Logger.errors.UNSUPPORTED_OPERATION, {
                    operation: "getAddress"
                });
            }
            return this.provider.formatter.address(accounts[this._index]);
        });
    }
    sendUncheckedTransaction(transaction) {
        transaction = shallowCopy(transaction);
        const fromAddress = this.getAddress().then((address) => {
            if (address) {
                address = address.toLowerCase();
            }
            return address;
        });
        // The JSON-RPC for eth_sendTransaction uses 90000 gas; if the user
        // wishes to use this, it is easy to specify explicitly, otherwise
        // we look it up for them.
        if (transaction.gasLimit == null) {
            const estimate = shallowCopy(transaction);
            estimate.from = fromAddress;
            transaction.gasLimit = this.provider.estimateGas(estimate);
        }
        if (transaction.to != null) {
            transaction.to = Promise.resolve(transaction.to).then((to) => json_rpc_provider_awaiter(this, void 0, void 0, function* () {
                if (to == null) {
                    return null;
                }
                const address = yield this.provider.resolveName(to);
                if (address == null) {
                    json_rpc_provider_logger.throwArgumentError("provided ENS name resolves to null", "tx.to", to);
                }
                return address;
            }));
        }
        return resolveProperties({
            tx: resolveProperties(transaction),
            sender: fromAddress
        }).then(({ tx, sender }) => {
            if (tx.from != null) {
                if (tx.from.toLowerCase() !== sender) {
                    json_rpc_provider_logger.throwArgumentError("from address mismatch", "transaction", transaction);
                }
            }
            else {
                tx.from = sender;
            }
            const hexTx = this.provider.constructor.hexlifyTransaction(tx, { from: true });
            return this.provider.send("eth_sendTransaction", [hexTx]).then((hash) => {
                return hash;
            }, (error) => {
                if (typeof (error.message) === "string" && error.message.match(/user denied/i)) {
                    json_rpc_provider_logger.throwError("user rejected transaction", lib_esm_Logger.errors.ACTION_REJECTED, {
                        action: "sendTransaction",
                        transaction: tx
                    });
                }
                return checkError("sendTransaction", error, hexTx);
            });
        });
    }
    signTransaction(transaction) {
        return json_rpc_provider_logger.throwError("signing transactions is unsupported", lib_esm_Logger.errors.UNSUPPORTED_OPERATION, {
            operation: "signTransaction"
        });
    }
    sendTransaction(transaction) {
        return json_rpc_provider_awaiter(this, void 0, void 0, function* () {
            // This cannot be mined any earlier than any recent block
            const blockNumber = yield this.provider._getInternalBlockNumber(100 + 2 * this.provider.pollingInterval);
            // Send the transaction
            const hash = yield this.sendUncheckedTransaction(transaction);
            try {
                // Unfortunately, JSON-RPC only provides and opaque transaction hash
                // for a response, and we need the actual transaction, so we poll
                // for it; it should show up very quickly
                return yield poll(() => json_rpc_provider_awaiter(this, void 0, void 0, function* () {
                    const tx = yield this.provider.getTransaction(hash);
                    if (tx === null) {
                        return undefined;
                    }
                    return this.provider._wrapTransaction(tx, hash, blockNumber);
                }), { oncePoll: this.provider });
            }
            catch (error) {
                error.transactionHash = hash;
                throw error;
            }
        });
    }
    signMessage(message) {
        return json_rpc_provider_awaiter(this, void 0, void 0, function* () {
            const data = ((typeof (message) === "string") ? toUtf8Bytes(message) : message);
            const address = yield this.getAddress();
            try {
                return yield this.provider.send("personal_sign", [lib_esm_hexlify(data), address.toLowerCase()]);
            }
            catch (error) {
                if (typeof (error.message) === "string" && error.message.match(/user denied/i)) {
                    json_rpc_provider_logger.throwError("user rejected signing", lib_esm_Logger.errors.ACTION_REJECTED, {
                        action: "signMessage",
                        from: address,
                        messageData: message
                    });
                }
                throw error;
            }
        });
    }
    _legacySignMessage(message) {
        return json_rpc_provider_awaiter(this, void 0, void 0, function* () {
            const data = ((typeof (message) === "string") ? toUtf8Bytes(message) : message);
            const address = yield this.getAddress();
            try {
                // https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_sign
                return yield this.provider.send("eth_sign", [address.toLowerCase(), lib_esm_hexlify(data)]);
            }
            catch (error) {
                if (typeof (error.message) === "string" && error.message.match(/user denied/i)) {
                    json_rpc_provider_logger.throwError("user rejected signing", lib_esm_Logger.errors.ACTION_REJECTED, {
                        action: "_legacySignMessage",
                        from: address,
                        messageData: message
                    });
                }
                throw error;
            }
        });
    }
    _signTypedData(domain, types, value) {
        return json_rpc_provider_awaiter(this, void 0, void 0, function* () {
            // Populate any ENS names (in-place)
            const populated = yield TypedDataEncoder.resolveNames(domain, types, value, (name) => {
                return this.provider.resolveName(name);
            });
            const address = yield this.getAddress();
            try {
                return yield this.provider.send("eth_signTypedData_v4", [
                    address.toLowerCase(),
                    JSON.stringify(TypedDataEncoder.getPayload(populated.domain, types, populated.value))
                ]);
            }
            catch (error) {
                if (typeof (error.message) === "string" && error.message.match(/user denied/i)) {
                    json_rpc_provider_logger.throwError("user rejected signing", lib_esm_Logger.errors.ACTION_REJECTED, {
                        action: "_signTypedData",
                        from: address,
                        messageData: { domain: populated.domain, types, value: populated.value }
                    });
                }
                throw error;
            }
        });
    }
    unlock(password) {
        return json_rpc_provider_awaiter(this, void 0, void 0, function* () {
            const provider = this.provider;
            const address = yield this.getAddress();
            return provider.send("personal_unlockAccount", [address.toLowerCase(), password, null]);
        });
    }
}
class UncheckedJsonRpcSigner extends JsonRpcSigner {
    sendTransaction(transaction) {
        return this.sendUncheckedTransaction(transaction).then((hash) => {
            return {
                hash: hash,
                nonce: null,
                gasLimit: null,
                gasPrice: null,
                data: null,
                value: null,
                chainId: null,
                confirmations: 0,
                from: null,
                wait: (confirmations) => { return this.provider.waitForTransaction(hash, confirmations); }
            };
        });
    }
}
const json_rpc_provider_allowedTransactionKeys = {
    chainId: true, data: true, gasLimit: true, gasPrice: true, nonce: true, to: true, value: true,
    type: true, accessList: true,
    maxFeePerGas: true, maxPriorityFeePerGas: true
};
class JsonRpcProvider extends BaseProvider {
    constructor(url, network) {
        let networkOrReady = network;
        // The network is unknown, query the JSON-RPC for it
        if (networkOrReady == null) {
            networkOrReady = new Promise((resolve, reject) => {
                setTimeout(() => {
                    this.detectNetwork().then((network) => {
                        resolve(network);
                    }, (error) => {
                        reject(error);
                    });
                }, 0);
            });
        }
        super(networkOrReady);
        // Default URL
        if (!url) {
            url = getStatic(this.constructor, "defaultUrl")();
        }
        if (typeof (url) === "string") {
            defineReadOnly(this, "connection", Object.freeze({
                url: url
            }));
        }
        else {
            defineReadOnly(this, "connection", Object.freeze(shallowCopy(url)));
        }
        this._nextId = 42;
    }
    get _cache() {
        if (this._eventLoopCache == null) {
            this._eventLoopCache = {};
        }
        return this._eventLoopCache;
    }
    static defaultUrl() {
        return "http:/\/localhost:8545";
    }
    detectNetwork() {
        if (!this._cache["detectNetwork"]) {
            this._cache["detectNetwork"] = this._uncachedDetectNetwork();
            // Clear this cache at the beginning of the next event loop
            setTimeout(() => {
                this._cache["detectNetwork"] = null;
            }, 0);
        }
        return this._cache["detectNetwork"];
    }
    _uncachedDetectNetwork() {
        return json_rpc_provider_awaiter(this, void 0, void 0, function* () {
            yield timer(0);
            let chainId = null;
            try {
                chainId = yield this.send("eth_chainId", []);
            }
            catch (error) {
                try {
                    chainId = yield this.send("net_version", []);
                }
                catch (error) { }
            }
            if (chainId != null) {
                const getNetwork = getStatic(this.constructor, "getNetwork");
                try {
                    return getNetwork(bignumber_BigNumber.from(chainId).toNumber());
                }
                catch (error) {
                    return json_rpc_provider_logger.throwError("could not detect network", lib_esm_Logger.errors.NETWORK_ERROR, {
                        chainId: chainId,
                        event: "invalidNetwork",
                        serverError: error
                    });
                }
            }
            return json_rpc_provider_logger.throwError("could not detect network", lib_esm_Logger.errors.NETWORK_ERROR, {
                event: "noNetwork"
            });
        });
    }
    getSigner(addressOrIndex) {
        return new JsonRpcSigner(json_rpc_provider_constructorGuard, this, addressOrIndex);
    }
    getUncheckedSigner(addressOrIndex) {
        return this.getSigner(addressOrIndex).connectUnchecked();
    }
    listAccounts() {
        return this.send("eth_accounts", []).then((accounts) => {
            return accounts.map((a) => this.formatter.address(a));
        });
    }
    send(method, params) {
        const request = {
            method: method,
            params: params,
            id: (this._nextId++),
            jsonrpc: "2.0"
        };
        this.emit("debug", {
            action: "request",
            request: deepCopy(request),
            provider: this
        });
        // We can expand this in the future to any call, but for now these
        // are the biggest wins and do not require any serializing parameters.
        const cache = (["eth_chainId", "eth_blockNumber"].indexOf(method) >= 0);
        if (cache && this._cache[method]) {
            return this._cache[method];
        }
        const result = fetchJson(this.connection, JSON.stringify(request), getResult).then((result) => {
            this.emit("debug", {
                action: "response",
                request: request,
                response: result,
                provider: this
            });
            return result;
        }, (error) => {
            this.emit("debug", {
                action: "response",
                error: error,
                request: request,
                provider: this
            });
            throw error;
        });
        // Cache the fetch, but clear it on the next event loop
        if (cache) {
            this._cache[method] = result;
            setTimeout(() => {
                this._cache[method] = null;
            }, 0);
        }
        return result;
    }
    prepareRequest(method, params) {
        switch (method) {
            case "getBlockNumber":
                return ["eth_blockNumber", []];
            case "getGasPrice":
                return ["eth_gasPrice", []];
            case "getBalance":
                return ["eth_getBalance", [getLowerCase(params.address), params.blockTag]];
            case "getTransactionCount":
                return ["eth_getTransactionCount", [getLowerCase(params.address), params.blockTag]];
            case "getCode":
                return ["eth_getCode", [getLowerCase(params.address), params.blockTag]];
            case "getStorageAt":
                return ["eth_getStorageAt", [getLowerCase(params.address), hexZeroPad(params.position, 32), params.blockTag]];
            case "sendTransaction":
                return ["eth_sendRawTransaction", [params.signedTransaction]];
            case "getBlock":
                if (params.blockTag) {
                    return ["eth_getBlockByNumber", [params.blockTag, !!params.includeTransactions]];
                }
                else if (params.blockHash) {
                    return ["eth_getBlockByHash", [params.blockHash, !!params.includeTransactions]];
                }
                return null;
            case "getTransaction":
                return ["eth_getTransactionByHash", [params.transactionHash]];
            case "getTransactionReceipt":
                return ["eth_getTransactionReceipt", [params.transactionHash]];
            case "call": {
                const hexlifyTransaction = getStatic(this.constructor, "hexlifyTransaction");
                return ["eth_call", [hexlifyTransaction(params.transaction, { from: true }), params.blockTag]];
            }
            case "estimateGas": {
                const hexlifyTransaction = getStatic(this.constructor, "hexlifyTransaction");
                return ["eth_estimateGas", [hexlifyTransaction(params.transaction, { from: true })]];
            }
            case "getLogs":
                if (params.filter && params.filter.address != null) {
                    params.filter.address = getLowerCase(params.filter.address);
                }
                return ["eth_getLogs", [params.filter]];
            default:
                break;
        }
        return null;
    }
    perform(method, params) {
        return json_rpc_provider_awaiter(this, void 0, void 0, function* () {
            // Legacy networks do not like the type field being passed along (which
            // is fair), so we delete type if it is 0 and a non-EIP-1559 network
            if (method === "call" || method === "estimateGas") {
                const tx = params.transaction;
                if (tx && tx.type != null && bignumber_BigNumber.from(tx.type).isZero()) {
                    // If there are no EIP-1559 properties, it might be non-EIP-1559
                    if (tx.maxFeePerGas == null && tx.maxPriorityFeePerGas == null) {
                        const feeData = yield this.getFeeData();
                        if (feeData.maxFeePerGas == null && feeData.maxPriorityFeePerGas == null) {
                            // Network doesn't know about EIP-1559 (and hence type)
                            params = shallowCopy(params);
                            params.transaction = shallowCopy(tx);
                            delete params.transaction.type;
                        }
                    }
                }
            }
            const args = this.prepareRequest(method, params);
            if (args == null) {
                json_rpc_provider_logger.throwError(method + " not implemented", lib_esm_Logger.errors.NOT_IMPLEMENTED, { operation: method });
            }
            try {
                return yield this.send(args[0], args[1]);
            }
            catch (error) {
                return checkError(method, error, params);
            }
        });
    }
    _startEvent(event) {
        if (event.tag === "pending") {
            this._startPending();
        }
        super._startEvent(event);
    }
    _startPending() {
        if (this._pendingFilter != null) {
            return;
        }
        const self = this;
        const pendingFilter = this.send("eth_newPendingTransactionFilter", []);
        this._pendingFilter = pendingFilter;
        pendingFilter.then(function (filterId) {
            function poll() {
                self.send("eth_getFilterChanges", [filterId]).then(function (hashes) {
                    if (self._pendingFilter != pendingFilter) {
                        return null;
                    }
                    let seq = Promise.resolve();
                    hashes.forEach(function (hash) {
                        // @TODO: This should be garbage collected at some point... How? When?
                        self._emitted["t:" + hash.toLowerCase()] = "pending";
                        seq = seq.then(function () {
                            return self.getTransaction(hash).then(function (tx) {
                                self.emit("pending", tx);
                                return null;
                            });
                        });
                    });
                    return seq.then(function () {
                        return timer(1000);
                    });
                }).then(function () {
                    if (self._pendingFilter != pendingFilter) {
                        self.send("eth_uninstallFilter", [filterId]);
                        return;
                    }
                    setTimeout(function () { poll(); }, 0);
                    return null;
                }).catch((error) => { });
            }
            poll();
            return filterId;
        }).catch((error) => { });
    }
    _stopEvent(event) {
        if (event.tag === "pending" && this.listenerCount("pending") === 0) {
            this._pendingFilter = null;
        }
        super._stopEvent(event);
    }
    // Convert an ethers.js transaction into a JSON-RPC transaction
    //  - gasLimit => gas
    //  - All values hexlified
    //  - All numeric values zero-striped
    //  - All addresses are lowercased
    // NOTE: This allows a TransactionRequest, but all values should be resolved
    //       before this is called
    // @TODO: This will likely be removed in future versions and prepareRequest
    //        will be the preferred method for this.
    static hexlifyTransaction(transaction, allowExtra) {
        // Check only allowed properties are given
        const allowed = shallowCopy(json_rpc_provider_allowedTransactionKeys);
        if (allowExtra) {
            for (const key in allowExtra) {
                if (allowExtra[key]) {
                    allowed[key] = true;
                }
            }
        }
        lib_esm_checkProperties(transaction, allowed);
        const result = {};
        // JSON-RPC now requires numeric values to be "quantity" values
        ["chainId", "gasLimit", "gasPrice", "type", "maxFeePerGas", "maxPriorityFeePerGas", "nonce", "value"].forEach(function (key) {
            if (transaction[key] == null) {
                return;
            }
            const value = hexValue(bignumber_BigNumber.from(transaction[key]));
            if (key === "gasLimit") {
                key = "gas";
            }
            result[key] = value;
        });
        ["from", "to", "data"].forEach(function (key) {
            if (transaction[key] == null) {
                return;
            }
            result[key] = lib_esm_hexlify(transaction[key]);
        });
        if (transaction.accessList) {
            result["accessList"] = accessListify(transaction.accessList);
        }
        return result;
    }
}
//# sourceMappingURL=json-rpc-provider.js.map
;// CONCATENATED MODULE: ./node_modules/@ethersproject/providers/lib.esm/web3-provider.js




const web3_provider_logger = new lib_esm_Logger(lib_esm_version_version);

let _nextId = 1;
function buildWeb3LegacyFetcher(provider, sendFunc) {
    const fetcher = "Web3LegacyFetcher";
    return function (method, params) {
        const request = {
            method: method,
            params: params,
            id: (_nextId++),
            jsonrpc: "2.0"
        };
        return new Promise((resolve, reject) => {
            this.emit("debug", {
                action: "request",
                fetcher,
                request: deepCopy(request),
                provider: this
            });
            sendFunc(request, (error, response) => {
                if (error) {
                    this.emit("debug", {
                        action: "response",
                        fetcher,
                        error,
                        request,
                        provider: this
                    });
                    return reject(error);
                }
                this.emit("debug", {
                    action: "response",
                    fetcher,
                    request,
                    response,
                    provider: this
                });
                if (response.error) {
                    const error = new Error(response.error.message);
                    error.code = response.error.code;
                    error.data = response.error.data;
                    return reject(error);
                }
                resolve(response.result);
            });
        });
    };
}
function buildEip1193Fetcher(provider) {
    return function (method, params) {
        if (params == null) {
            params = [];
        }
        const request = { method, params };
        this.emit("debug", {
            action: "request",
            fetcher: "Eip1193Fetcher",
            request: deepCopy(request),
            provider: this
        });
        return provider.request(request).then((response) => {
            this.emit("debug", {
                action: "response",
                fetcher: "Eip1193Fetcher",
                request,
                response,
                provider: this
            });
            return response;
        }, (error) => {
            this.emit("debug", {
                action: "response",
                fetcher: "Eip1193Fetcher",
                request,
                error,
                provider: this
            });
            throw error;
        });
    };
}
class Web3Provider extends JsonRpcProvider {
    constructor(provider, network) {
        if (provider == null) {
            web3_provider_logger.throwArgumentError("missing provider", "provider", provider);
        }
        let path = null;
        let jsonRpcFetchFunc = null;
        let subprovider = null;
        if (typeof (provider) === "function") {
            path = "unknown:";
            jsonRpcFetchFunc = provider;
        }
        else {
            path = provider.host || provider.path || "";
            if (!path && provider.isMetaMask) {
                path = "metamask";
            }
            subprovider = provider;
            if (provider.request) {
                if (path === "") {
                    path = "eip-1193:";
                }
                jsonRpcFetchFunc = buildEip1193Fetcher(provider);
            }
            else if (provider.sendAsync) {
                jsonRpcFetchFunc = buildWeb3LegacyFetcher(provider, provider.sendAsync.bind(provider));
            }
            else if (provider.send) {
                jsonRpcFetchFunc = buildWeb3LegacyFetcher(provider, provider.send.bind(provider));
            }
            else {
                web3_provider_logger.throwArgumentError("unsupported provider", "provider", provider);
            }
            if (!path) {
                path = "unknown:";
            }
        }
        super(path, network);
        defineReadOnly(this, "jsonRpcFetchFunc", jsonRpcFetchFunc);
        defineReadOnly(this, "provider", subprovider);
    }
    send(method, params) {
        return this.jsonRpcFetchFunc(method, params);
    }
}
//# sourceMappingURL=web3-provider.js.map

/***/ }),

/***/ 9674:
/***/ ((module) => {

"use strict";

var ALPHABET = 'qpzry9x8gf2tvdw0s3jn54khce6mua7l'

// pre-compute lookup table
var ALPHABET_MAP = {}
for (var z = 0; z < ALPHABET.length; z++) {
  var x = ALPHABET.charAt(z)

  if (ALPHABET_MAP[x] !== undefined) throw new TypeError(x + ' is ambiguous')
  ALPHABET_MAP[x] = z
}

function polymodStep (pre) {
  var b = pre >> 25
  return ((pre & 0x1FFFFFF) << 5) ^
    (-((b >> 0) & 1) & 0x3b6a57b2) ^
    (-((b >> 1) & 1) & 0x26508e6d) ^
    (-((b >> 2) & 1) & 0x1ea119fa) ^
    (-((b >> 3) & 1) & 0x3d4233dd) ^
    (-((b >> 4) & 1) & 0x2a1462b3)
}

function prefixChk (prefix) {
  var chk = 1
  for (var i = 0; i < prefix.length; ++i) {
    var c = prefix.charCodeAt(i)
    if (c < 33 || c > 126) return 'Invalid prefix (' + prefix + ')'

    chk = polymodStep(chk) ^ (c >> 5)
  }
  chk = polymodStep(chk)

  for (i = 0; i < prefix.length; ++i) {
    var v = prefix.charCodeAt(i)
    chk = polymodStep(chk) ^ (v & 0x1f)
  }
  return chk
}

function encode (prefix, words, LIMIT) {
  LIMIT = LIMIT || 90
  if ((prefix.length + 7 + words.length) > LIMIT) throw new TypeError('Exceeds length limit')

  prefix = prefix.toLowerCase()

  // determine chk mod
  var chk = prefixChk(prefix)
  if (typeof chk === 'string') throw new Error(chk)

  var result = prefix + '1'
  for (var i = 0; i < words.length; ++i) {
    var x = words[i]
    if ((x >> 5) !== 0) throw new Error('Non 5-bit word')

    chk = polymodStep(chk) ^ x
    result += ALPHABET.charAt(x)
  }

  for (i = 0; i < 6; ++i) {
    chk = polymodStep(chk)
  }
  chk ^= 1

  for (i = 0; i < 6; ++i) {
    var v = (chk >> ((5 - i) * 5)) & 0x1f
    result += ALPHABET.charAt(v)
  }

  return result
}

function __decode (str, LIMIT) {
  LIMIT = LIMIT || 90
  if (str.length < 8) return str + ' too short'
  if (str.length > LIMIT) return 'Exceeds length limit'

  // don't allow mixed case
  var lowered = str.toLowerCase()
  var uppered = str.toUpperCase()
  if (str !== lowered && str !== uppered) return 'Mixed-case string ' + str
  str = lowered

  var split = str.lastIndexOf('1')
  if (split === -1) return 'No separator character for ' + str
  if (split === 0) return 'Missing prefix for ' + str

  var prefix = str.slice(0, split)
  var wordChars = str.slice(split + 1)
  if (wordChars.length < 6) return 'Data too short'

  var chk = prefixChk(prefix)
  if (typeof chk === 'string') return chk

  var words = []
  for (var i = 0; i < wordChars.length; ++i) {
    var c = wordChars.charAt(i)
    var v = ALPHABET_MAP[c]
    if (v === undefined) return 'Unknown character ' + c
    chk = polymodStep(chk) ^ v

    // not in the checksum?
    if (i + 6 >= wordChars.length) continue
    words.push(v)
  }

  if (chk !== 1) return 'Invalid checksum for ' + str
  return { prefix: prefix, words: words }
}

function decodeUnsafe () {
  var res = __decode.apply(null, arguments)
  if (typeof res === 'object') return res
}

function decode (str) {
  var res = __decode.apply(null, arguments)
  if (typeof res === 'object') return res

  throw new Error(res)
}

function convert (data, inBits, outBits, pad) {
  var value = 0
  var bits = 0
  var maxV = (1 << outBits) - 1

  var result = []
  for (var i = 0; i < data.length; ++i) {
    value = (value << inBits) | data[i]
    bits += inBits

    while (bits >= outBits) {
      bits -= outBits
      result.push((value >> bits) & maxV)
    }
  }

  if (pad) {
    if (bits > 0) {
      result.push((value << (outBits - bits)) & maxV)
    }
  } else {
    if (bits >= inBits) return 'Excess padding'
    if ((value << (outBits - bits)) & maxV) return 'Non-zero padding'
  }

  return result
}

function toWordsUnsafe (bytes) {
  var res = convert(bytes, 8, 5, true)
  if (Array.isArray(res)) return res
}

function toWords (bytes) {
  var res = convert(bytes, 8, 5, true)
  if (Array.isArray(res)) return res

  throw new Error(res)
}

function fromWordsUnsafe (words) {
  var res = convert(words, 5, 8, false)
  if (Array.isArray(res)) return res
}

function fromWords (words) {
  var res = convert(words, 5, 8, false)
  if (Array.isArray(res)) return res

  throw new Error(res)
}

module.exports = {
  decodeUnsafe: decodeUnsafe,
  decode: decode,
  encode: encode,
  toWordsUnsafe: toWordsUnsafe,
  toWords: toWords,
  fromWordsUnsafe: fromWordsUnsafe,
  fromWords: fromWords
}


/***/ }),

/***/ 9404:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

/* module decorator */ module = __webpack_require__.nmd(module);
(function (module, exports) {
  'use strict';

  // Utils
  function assert (val, msg) {
    if (!val) throw new Error(msg || 'Assertion failed');
  }

  // Could use `inherits` module, but don't want to move from single file
  // architecture yet.
  function inherits (ctor, superCtor) {
    ctor.super_ = superCtor;
    var TempCtor = function () {};
    TempCtor.prototype = superCtor.prototype;
    ctor.prototype = new TempCtor();
    ctor.prototype.constructor = ctor;
  }

  // BN

  function BN (number, base, endian) {
    if (BN.isBN(number)) {
      return number;
    }

    this.negative = 0;
    this.words = null;
    this.length = 0;

    // Reduction context
    this.red = null;

    if (number !== null) {
      if (base === 'le' || base === 'be') {
        endian = base;
        base = 10;
      }

      this._init(number || 0, base || 10, endian || 'be');
    }
  }
  if (typeof module === 'object') {
    module.exports = BN;
  } else {
    exports.BN = BN;
  }

  BN.BN = BN;
  BN.wordSize = 26;

  var Buffer;
  try {
    if (typeof window !== 'undefined' && typeof window.Buffer !== 'undefined') {
      Buffer = window.Buffer;
    } else {
      Buffer = (__webpack_require__(7790).Buffer);
    }
  } catch (e) {
  }

  BN.isBN = function isBN (num) {
    if (num instanceof BN) {
      return true;
    }

    return num !== null && typeof num === 'object' &&
      num.constructor.wordSize === BN.wordSize && Array.isArray(num.words);
  };

  BN.max = function max (left, right) {
    if (left.cmp(right) > 0) return left;
    return right;
  };

  BN.min = function min (left, right) {
    if (left.cmp(right) < 0) return left;
    return right;
  };

  BN.prototype._init = function init (number, base, endian) {
    if (typeof number === 'number') {
      return this._initNumber(number, base, endian);
    }

    if (typeof number === 'object') {
      return this._initArray(number, base, endian);
    }

    if (base === 'hex') {
      base = 16;
    }
    assert(base === (base | 0) && base >= 2 && base <= 36);

    number = number.toString().replace(/\s+/g, '');
    var start = 0;
    if (number[0] === '-') {
      start++;
      this.negative = 1;
    }

    if (start < number.length) {
      if (base === 16) {
        this._parseHex(number, start, endian);
      } else {
        this._parseBase(number, base, start);
        if (endian === 'le') {
          this._initArray(this.toArray(), base, endian);
        }
      }
    }
  };

  BN.prototype._initNumber = function _initNumber (number, base, endian) {
    if (number < 0) {
      this.negative = 1;
      number = -number;
    }
    if (number < 0x4000000) {
      this.words = [number & 0x3ffffff];
      this.length = 1;
    } else if (number < 0x10000000000000) {
      this.words = [
        number & 0x3ffffff,
        (number / 0x4000000) & 0x3ffffff
      ];
      this.length = 2;
    } else {
      assert(number < 0x20000000000000); // 2 ^ 53 (unsafe)
      this.words = [
        number & 0x3ffffff,
        (number / 0x4000000) & 0x3ffffff,
        1
      ];
      this.length = 3;
    }

    if (endian !== 'le') return;

    // Reverse the bytes
    this._initArray(this.toArray(), base, endian);
  };

  BN.prototype._initArray = function _initArray (number, base, endian) {
    // Perhaps a Uint8Array
    assert(typeof number.length === 'number');
    if (number.length <= 0) {
      this.words = [0];
      this.length = 1;
      return this;
    }

    this.length = Math.ceil(number.length / 3);
    this.words = new Array(this.length);
    for (var i = 0; i < this.length; i++) {
      this.words[i] = 0;
    }

    var j, w;
    var off = 0;
    if (endian === 'be') {
      for (i = number.length - 1, j = 0; i >= 0; i -= 3) {
        w = number[i] | (number[i - 1] << 8) | (number[i - 2] << 16);
        this.words[j] |= (w << off) & 0x3ffffff;
        this.words[j + 1] = (w >>> (26 - off)) & 0x3ffffff;
        off += 24;
        if (off >= 26) {
          off -= 26;
          j++;
        }
      }
    } else if (endian === 'le') {
      for (i = 0, j = 0; i < number.length; i += 3) {
        w = number[i] | (number[i + 1] << 8) | (number[i + 2] << 16);
        this.words[j] |= (w << off) & 0x3ffffff;
        this.words[j + 1] = (w >>> (26 - off)) & 0x3ffffff;
        off += 24;
        if (off >= 26) {
          off -= 26;
          j++;
        }
      }
    }
    return this._strip();
  };

  function parseHex4Bits (string, index) {
    var c = string.charCodeAt(index);
    // '0' - '9'
    if (c >= 48 && c <= 57) {
      return c - 48;
    // 'A' - 'F'
    } else if (c >= 65 && c <= 70) {
      return c - 55;
    // 'a' - 'f'
    } else if (c >= 97 && c <= 102) {
      return c - 87;
    } else {
      assert(false, 'Invalid character in ' + string);
    }
  }

  function parseHexByte (string, lowerBound, index) {
    var r = parseHex4Bits(string, index);
    if (index - 1 >= lowerBound) {
      r |= parseHex4Bits(string, index - 1) << 4;
    }
    return r;
  }

  BN.prototype._parseHex = function _parseHex (number, start, endian) {
    // Create possibly bigger array to ensure that it fits the number
    this.length = Math.ceil((number.length - start) / 6);
    this.words = new Array(this.length);
    for (var i = 0; i < this.length; i++) {
      this.words[i] = 0;
    }

    // 24-bits chunks
    var off = 0;
    var j = 0;

    var w;
    if (endian === 'be') {
      for (i = number.length - 1; i >= start; i -= 2) {
        w = parseHexByte(number, start, i) << off;
        this.words[j] |= w & 0x3ffffff;
        if (off >= 18) {
          off -= 18;
          j += 1;
          this.words[j] |= w >>> 26;
        } else {
          off += 8;
        }
      }
    } else {
      var parseLength = number.length - start;
      for (i = parseLength % 2 === 0 ? start + 1 : start; i < number.length; i += 2) {
        w = parseHexByte(number, start, i) << off;
        this.words[j] |= w & 0x3ffffff;
        if (off >= 18) {
          off -= 18;
          j += 1;
          this.words[j] |= w >>> 26;
        } else {
          off += 8;
        }
      }
    }

    this._strip();
  };

  function parseBase (str, start, end, mul) {
    var r = 0;
    var b = 0;
    var len = Math.min(str.length, end);
    for (var i = start; i < len; i++) {
      var c = str.charCodeAt(i) - 48;

      r *= mul;

      // 'a'
      if (c >= 49) {
        b = c - 49 + 0xa;

      // 'A'
      } else if (c >= 17) {
        b = c - 17 + 0xa;

      // '0' - '9'
      } else {
        b = c;
      }
      assert(c >= 0 && b < mul, 'Invalid character');
      r += b;
    }
    return r;
  }

  BN.prototype._parseBase = function _parseBase (number, base, start) {
    // Initialize as zero
    this.words = [0];
    this.length = 1;

    // Find length of limb in base
    for (var limbLen = 0, limbPow = 1; limbPow <= 0x3ffffff; limbPow *= base) {
      limbLen++;
    }
    limbLen--;
    limbPow = (limbPow / base) | 0;

    var total = number.length - start;
    var mod = total % limbLen;
    var end = Math.min(total, total - mod) + start;

    var word = 0;
    for (var i = start; i < end; i += limbLen) {
      word = parseBase(number, i, i + limbLen, base);

      this.imuln(limbPow);
      if (this.words[0] + word < 0x4000000) {
        this.words[0] += word;
      } else {
        this._iaddn(word);
      }
    }

    if (mod !== 0) {
      var pow = 1;
      word = parseBase(number, i, number.length, base);

      for (i = 0; i < mod; i++) {
        pow *= base;
      }

      this.imuln(pow);
      if (this.words[0] + word < 0x4000000) {
        this.words[0] += word;
      } else {
        this._iaddn(word);
      }
    }

    this._strip();
  };

  BN.prototype.copy = function copy (dest) {
    dest.words = new Array(this.length);
    for (var i = 0; i < this.length; i++) {
      dest.words[i] = this.words[i];
    }
    dest.length = this.length;
    dest.negative = this.negative;
    dest.red = this.red;
  };

  function move (dest, src) {
    dest.words = src.words;
    dest.length = src.length;
    dest.negative = src.negative;
    dest.red = src.red;
  }

  BN.prototype._move = function _move (dest) {
    move(dest, this);
  };

  BN.prototype.clone = function clone () {
    var r = new BN(null);
    this.copy(r);
    return r;
  };

  BN.prototype._expand = function _expand (size) {
    while (this.length < size) {
      this.words[this.length++] = 0;
    }
    return this;
  };

  // Remove leading `0` from `this`
  BN.prototype._strip = function strip () {
    while (this.length > 1 && this.words[this.length - 1] === 0) {
      this.length--;
    }
    return this._normSign();
  };

  BN.prototype._normSign = function _normSign () {
    // -0 = 0
    if (this.length === 1 && this.words[0] === 0) {
      this.negative = 0;
    }
    return this;
  };

  // Check Symbol.for because not everywhere where Symbol defined
  // See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol#Browser_compatibility
  if (typeof Symbol !== 'undefined' && typeof Symbol.for === 'function') {
    try {
      BN.prototype[Symbol.for('nodejs.util.inspect.custom')] = inspect;
    } catch (e) {
      BN.prototype.inspect = inspect;
    }
  } else {
    BN.prototype.inspect = inspect;
  }

  function inspect () {
    return (this.red ? '<BN-R: ' : '<BN: ') + this.toString(16) + '>';
  }

  /*

  var zeros = [];
  var groupSizes = [];
  var groupBases = [];

  var s = '';
  var i = -1;
  while (++i < BN.wordSize) {
    zeros[i] = s;
    s += '0';
  }
  groupSizes[0] = 0;
  groupSizes[1] = 0;
  groupBases[0] = 0;
  groupBases[1] = 0;
  var base = 2 - 1;
  while (++base < 36 + 1) {
    var groupSize = 0;
    var groupBase = 1;
    while (groupBase < (1 << BN.wordSize) / base) {
      groupBase *= base;
      groupSize += 1;
    }
    groupSizes[base] = groupSize;
    groupBases[base] = groupBase;
  }

  */

  var zeros = [
    '',
    '0',
    '00',
    '000',
    '0000',
    '00000',
    '000000',
    '0000000',
    '00000000',
    '000000000',
    '0000000000',
    '00000000000',
    '000000000000',
    '0000000000000',
    '00000000000000',
    '000000000000000',
    '0000000000000000',
    '00000000000000000',
    '000000000000000000',
    '0000000000000000000',
    '00000000000000000000',
    '000000000000000000000',
    '0000000000000000000000',
    '00000000000000000000000',
    '000000000000000000000000',
    '0000000000000000000000000'
  ];

  var groupSizes = [
    0, 0,
    25, 16, 12, 11, 10, 9, 8,
    8, 7, 7, 7, 7, 6, 6,
    6, 6, 6, 6, 6, 5, 5,
    5, 5, 5, 5, 5, 5, 5,
    5, 5, 5, 5, 5, 5, 5
  ];

  var groupBases = [
    0, 0,
    33554432, 43046721, 16777216, 48828125, 60466176, 40353607, 16777216,
    43046721, 10000000, 19487171, 35831808, 62748517, 7529536, 11390625,
    16777216, 24137569, 34012224, 47045881, 64000000, 4084101, 5153632,
    6436343, 7962624, 9765625, 11881376, 14348907, 17210368, 20511149,
    24300000, 28629151, 33554432, 39135393, 45435424, 52521875, 60466176
  ];

  BN.prototype.toString = function toString (base, padding) {
    base = base || 10;
    padding = padding | 0 || 1;

    var out;
    if (base === 16 || base === 'hex') {
      out = '';
      var off = 0;
      var carry = 0;
      for (var i = 0; i < this.length; i++) {
        var w = this.words[i];
        var word = (((w << off) | carry) & 0xffffff).toString(16);
        carry = (w >>> (24 - off)) & 0xffffff;
        off += 2;
        if (off >= 26) {
          off -= 26;
          i--;
        }
        if (carry !== 0 || i !== this.length - 1) {
          out = zeros[6 - word.length] + word + out;
        } else {
          out = word + out;
        }
      }
      if (carry !== 0) {
        out = carry.toString(16) + out;
      }
      while (out.length % padding !== 0) {
        out = '0' + out;
      }
      if (this.negative !== 0) {
        out = '-' + out;
      }
      return out;
    }

    if (base === (base | 0) && base >= 2 && base <= 36) {
      // var groupSize = Math.floor(BN.wordSize * Math.LN2 / Math.log(base));
      var groupSize = groupSizes[base];
      // var groupBase = Math.pow(base, groupSize);
      var groupBase = groupBases[base];
      out = '';
      var c = this.clone();
      c.negative = 0;
      while (!c.isZero()) {
        var r = c.modrn(groupBase).toString(base);
        c = c.idivn(groupBase);

        if (!c.isZero()) {
          out = zeros[groupSize - r.length] + r + out;
        } else {
          out = r + out;
        }
      }
      if (this.isZero()) {
        out = '0' + out;
      }
      while (out.length % padding !== 0) {
        out = '0' + out;
      }
      if (this.negative !== 0) {
        out = '-' + out;
      }
      return out;
    }

    assert(false, 'Base should be between 2 and 36');
  };

  BN.prototype.toNumber = function toNumber () {
    var ret = this.words[0];
    if (this.length === 2) {
      ret += this.words[1] * 0x4000000;
    } else if (this.length === 3 && this.words[2] === 0x01) {
      // NOTE: at this stage it is known that the top bit is set
      ret += 0x10000000000000 + (this.words[1] * 0x4000000);
    } else if (this.length > 2) {
      assert(false, 'Number can only safely store up to 53 bits');
    }
    return (this.negative !== 0) ? -ret : ret;
  };

  BN.prototype.toJSON = function toJSON () {
    return this.toString(16, 2);
  };

  if (Buffer) {
    BN.prototype.toBuffer = function toBuffer (endian, length) {
      return this.toArrayLike(Buffer, endian, length);
    };
  }

  BN.prototype.toArray = function toArray (endian, length) {
    return this.toArrayLike(Array, endian, length);
  };

  var allocate = function allocate (ArrayType, size) {
    if (ArrayType.allocUnsafe) {
      return ArrayType.allocUnsafe(size);
    }
    return new ArrayType(size);
  };

  BN.prototype.toArrayLike = function toArrayLike (ArrayType, endian, length) {
    this._strip();

    var byteLength = this.byteLength();
    var reqLength = length || Math.max(1, byteLength);
    assert(byteLength <= reqLength, 'byte array longer than desired length');
    assert(reqLength > 0, 'Requested array length <= 0');

    var res = allocate(ArrayType, reqLength);
    var postfix = endian === 'le' ? 'LE' : 'BE';
    this['_toArrayLike' + postfix](res, byteLength);
    return res;
  };

  BN.prototype._toArrayLikeLE = function _toArrayLikeLE (res, byteLength) {
    var position = 0;
    var carry = 0;

    for (var i = 0, shift = 0; i < this.length; i++) {
      var word = (this.words[i] << shift) | carry;

      res[position++] = word & 0xff;
      if (position < res.length) {
        res[position++] = (word >> 8) & 0xff;
      }
      if (position < res.length) {
        res[position++] = (word >> 16) & 0xff;
      }

      if (shift === 6) {
        if (position < res.length) {
          res[position++] = (word >> 24) & 0xff;
        }
        carry = 0;
        shift = 0;
      } else {
        carry = word >>> 24;
        shift += 2;
      }
    }

    if (position < res.length) {
      res[position++] = carry;

      while (position < res.length) {
        res[position++] = 0;
      }
    }
  };

  BN.prototype._toArrayLikeBE = function _toArrayLikeBE (res, byteLength) {
    var position = res.length - 1;
    var carry = 0;

    for (var i = 0, shift = 0; i < this.length; i++) {
      var word = (this.words[i] << shift) | carry;

      res[position--] = word & 0xff;
      if (position >= 0) {
        res[position--] = (word >> 8) & 0xff;
      }
      if (position >= 0) {
        res[position--] = (word >> 16) & 0xff;
      }

      if (shift === 6) {
        if (position >= 0) {
          res[position--] = (word >> 24) & 0xff;
        }
        carry = 0;
        shift = 0;
      } else {
        carry = word >>> 24;
        shift += 2;
      }
    }

    if (position >= 0) {
      res[position--] = carry;

      while (position >= 0) {
        res[position--] = 0;
      }
    }
  };

  if (Math.clz32) {
    BN.prototype._countBits = function _countBits (w) {
      return 32 - Math.clz32(w);
    };
  } else {
    BN.prototype._countBits = function _countBits (w) {
      var t = w;
      var r = 0;
      if (t >= 0x1000) {
        r += 13;
        t >>>= 13;
      }
      if (t >= 0x40) {
        r += 7;
        t >>>= 7;
      }
      if (t >= 0x8) {
        r += 4;
        t >>>= 4;
      }
      if (t >= 0x02) {
        r += 2;
        t >>>= 2;
      }
      return r + t;
    };
  }

  BN.prototype._zeroBits = function _zeroBits (w) {
    // Short-cut
    if (w === 0) return 26;

    var t = w;
    var r = 0;
    if ((t & 0x1fff) === 0) {
      r += 13;
      t >>>= 13;
    }
    if ((t & 0x7f) === 0) {
      r += 7;
      t >>>= 7;
    }
    if ((t & 0xf) === 0) {
      r += 4;
      t >>>= 4;
    }
    if ((t & 0x3) === 0) {
      r += 2;
      t >>>= 2;
    }
    if ((t & 0x1) === 0) {
      r++;
    }
    return r;
  };

  // Return number of used bits in a BN
  BN.prototype.bitLength = function bitLength () {
    var w = this.words[this.length - 1];
    var hi = this._countBits(w);
    return (this.length - 1) * 26 + hi;
  };

  function toBitArray (num) {
    var w = new Array(num.bitLength());

    for (var bit = 0; bit < w.length; bit++) {
      var off = (bit / 26) | 0;
      var wbit = bit % 26;

      w[bit] = (num.words[off] >>> wbit) & 0x01;
    }

    return w;
  }

  // Number of trailing zero bits
  BN.prototype.zeroBits = function zeroBits () {
    if (this.isZero()) return 0;

    var r = 0;
    for (var i = 0; i < this.length; i++) {
      var b = this._zeroBits(this.words[i]);
      r += b;
      if (b !== 26) break;
    }
    return r;
  };

  BN.prototype.byteLength = function byteLength () {
    return Math.ceil(this.bitLength() / 8);
  };

  BN.prototype.toTwos = function toTwos (width) {
    if (this.negative !== 0) {
      return this.abs().inotn(width).iaddn(1);
    }
    return this.clone();
  };

  BN.prototype.fromTwos = function fromTwos (width) {
    if (this.testn(width - 1)) {
      return this.notn(width).iaddn(1).ineg();
    }
    return this.clone();
  };

  BN.prototype.isNeg = function isNeg () {
    return this.negative !== 0;
  };

  // Return negative clone of `this`
  BN.prototype.neg = function neg () {
    return this.clone().ineg();
  };

  BN.prototype.ineg = function ineg () {
    if (!this.isZero()) {
      this.negative ^= 1;
    }

    return this;
  };

  // Or `num` with `this` in-place
  BN.prototype.iuor = function iuor (num) {
    while (this.length < num.length) {
      this.words[this.length++] = 0;
    }

    for (var i = 0; i < num.length; i++) {
      this.words[i] = this.words[i] | num.words[i];
    }

    return this._strip();
  };

  BN.prototype.ior = function ior (num) {
    assert((this.negative | num.negative) === 0);
    return this.iuor(num);
  };

  // Or `num` with `this`
  BN.prototype.or = function or (num) {
    if (this.length > num.length) return this.clone().ior(num);
    return num.clone().ior(this);
  };

  BN.prototype.uor = function uor (num) {
    if (this.length > num.length) return this.clone().iuor(num);
    return num.clone().iuor(this);
  };

  // And `num` with `this` in-place
  BN.prototype.iuand = function iuand (num) {
    // b = min-length(num, this)
    var b;
    if (this.length > num.length) {
      b = num;
    } else {
      b = this;
    }

    for (var i = 0; i < b.length; i++) {
      this.words[i] = this.words[i] & num.words[i];
    }

    this.length = b.length;

    return this._strip();
  };

  BN.prototype.iand = function iand (num) {
    assert((this.negative | num.negative) === 0);
    return this.iuand(num);
  };

  // And `num` with `this`
  BN.prototype.and = function and (num) {
    if (this.length > num.length) return this.clone().iand(num);
    return num.clone().iand(this);
  };

  BN.prototype.uand = function uand (num) {
    if (this.length > num.length) return this.clone().iuand(num);
    return num.clone().iuand(this);
  };

  // Xor `num` with `this` in-place
  BN.prototype.iuxor = function iuxor (num) {
    // a.length > b.length
    var a;
    var b;
    if (this.length > num.length) {
      a = this;
      b = num;
    } else {
      a = num;
      b = this;
    }

    for (var i = 0; i < b.length; i++) {
      this.words[i] = a.words[i] ^ b.words[i];
    }

    if (this !== a) {
      for (; i < a.length; i++) {
        this.words[i] = a.words[i];
      }
    }

    this.length = a.length;

    return this._strip();
  };

  BN.prototype.ixor = function ixor (num) {
    assert((this.negative | num.negative) === 0);
    return this.iuxor(num);
  };

  // Xor `num` with `this`
  BN.prototype.xor = function xor (num) {
    if (this.length > num.length) return this.clone().ixor(num);
    return num.clone().ixor(this);
  };

  BN.prototype.uxor = function uxor (num) {
    if (this.length > num.length) return this.clone().iuxor(num);
    return num.clone().iuxor(this);
  };

  // Not ``this`` with ``width`` bitwidth
  BN.prototype.inotn = function inotn (width) {
    assert(typeof width === 'number' && width >= 0);

    var bytesNeeded = Math.ceil(width / 26) | 0;
    var bitsLeft = width % 26;

    // Extend the buffer with leading zeroes
    this._expand(bytesNeeded);

    if (bitsLeft > 0) {
      bytesNeeded--;
    }

    // Handle complete words
    for (var i = 0; i < bytesNeeded; i++) {
      this.words[i] = ~this.words[i] & 0x3ffffff;
    }

    // Handle the residue
    if (bitsLeft > 0) {
      this.words[i] = ~this.words[i] & (0x3ffffff >> (26 - bitsLeft));
    }

    // And remove leading zeroes
    return this._strip();
  };

  BN.prototype.notn = function notn (width) {
    return this.clone().inotn(width);
  };

  // Set `bit` of `this`
  BN.prototype.setn = function setn (bit, val) {
    assert(typeof bit === 'number' && bit >= 0);

    var off = (bit / 26) | 0;
    var wbit = bit % 26;

    this._expand(off + 1);

    if (val) {
      this.words[off] = this.words[off] | (1 << wbit);
    } else {
      this.words[off] = this.words[off] & ~(1 << wbit);
    }

    return this._strip();
  };

  // Add `num` to `this` in-place
  BN.prototype.iadd = function iadd (num) {
    var r;

    // negative + positive
    if (this.negative !== 0 && num.negative === 0) {
      this.negative = 0;
      r = this.isub(num);
      this.negative ^= 1;
      return this._normSign();

    // positive + negative
    } else if (this.negative === 0 && num.negative !== 0) {
      num.negative = 0;
      r = this.isub(num);
      num.negative = 1;
      return r._normSign();
    }

    // a.length > b.length
    var a, b;
    if (this.length > num.length) {
      a = this;
      b = num;
    } else {
      a = num;
      b = this;
    }

    var carry = 0;
    for (var i = 0; i < b.length; i++) {
      r = (a.words[i] | 0) + (b.words[i] | 0) + carry;
      this.words[i] = r & 0x3ffffff;
      carry = r >>> 26;
    }
    for (; carry !== 0 && i < a.length; i++) {
      r = (a.words[i] | 0) + carry;
      this.words[i] = r & 0x3ffffff;
      carry = r >>> 26;
    }

    this.length = a.length;
    if (carry !== 0) {
      this.words[this.length] = carry;
      this.length++;
    // Copy the rest of the words
    } else if (a !== this) {
      for (; i < a.length; i++) {
        this.words[i] = a.words[i];
      }
    }

    return this;
  };

  // Add `num` to `this`
  BN.prototype.add = function add (num) {
    var res;
    if (num.negative !== 0 && this.negative === 0) {
      num.negative = 0;
      res = this.sub(num);
      num.negative ^= 1;
      return res;
    } else if (num.negative === 0 && this.negative !== 0) {
      this.negative = 0;
      res = num.sub(this);
      this.negative = 1;
      return res;
    }

    if (this.length > num.length) return this.clone().iadd(num);

    return num.clone().iadd(this);
  };

  // Subtract `num` from `this` in-place
  BN.prototype.isub = function isub (num) {
    // this - (-num) = this + num
    if (num.negative !== 0) {
      num.negative = 0;
      var r = this.iadd(num);
      num.negative = 1;
      return r._normSign();

    // -this - num = -(this + num)
    } else if (this.negative !== 0) {
      this.negative = 0;
      this.iadd(num);
      this.negative = 1;
      return this._normSign();
    }

    // At this point both numbers are positive
    var cmp = this.cmp(num);

    // Optimization - zeroify
    if (cmp === 0) {
      this.negative = 0;
      this.length = 1;
      this.words[0] = 0;
      return this;
    }

    // a > b
    var a, b;
    if (cmp > 0) {
      a = this;
      b = num;
    } else {
      a = num;
      b = this;
    }

    var carry = 0;
    for (var i = 0; i < b.length; i++) {
      r = (a.words[i] | 0) - (b.words[i] | 0) + carry;
      carry = r >> 26;
      this.words[i] = r & 0x3ffffff;
    }
    for (; carry !== 0 && i < a.length; i++) {
      r = (a.words[i] | 0) + carry;
      carry = r >> 26;
      this.words[i] = r & 0x3ffffff;
    }

    // Copy rest of the words
    if (carry === 0 && i < a.length && a !== this) {
      for (; i < a.length; i++) {
        this.words[i] = a.words[i];
      }
    }

    this.length = Math.max(this.length, i);

    if (a !== this) {
      this.negative = 1;
    }

    return this._strip();
  };

  // Subtract `num` from `this`
  BN.prototype.sub = function sub (num) {
    return this.clone().isub(num);
  };

  function smallMulTo (self, num, out) {
    out.negative = num.negative ^ self.negative;
    var len = (self.length + num.length) | 0;
    out.length = len;
    len = (len - 1) | 0;

    // Peel one iteration (compiler can't do it, because of code complexity)
    var a = self.words[0] | 0;
    var b = num.words[0] | 0;
    var r = a * b;

    var lo = r & 0x3ffffff;
    var carry = (r / 0x4000000) | 0;
    out.words[0] = lo;

    for (var k = 1; k < len; k++) {
      // Sum all words with the same `i + j = k` and accumulate `ncarry`,
      // note that ncarry could be >= 0x3ffffff
      var ncarry = carry >>> 26;
      var rword = carry & 0x3ffffff;
      var maxJ = Math.min(k, num.length - 1);
      for (var j = Math.max(0, k - self.length + 1); j <= maxJ; j++) {
        var i = (k - j) | 0;
        a = self.words[i] | 0;
        b = num.words[j] | 0;
        r = a * b + rword;
        ncarry += (r / 0x4000000) | 0;
        rword = r & 0x3ffffff;
      }
      out.words[k] = rword | 0;
      carry = ncarry | 0;
    }
    if (carry !== 0) {
      out.words[k] = carry | 0;
    } else {
      out.length--;
    }

    return out._strip();
  }

  // TODO(indutny): it may be reasonable to omit it for users who don't need
  // to work with 256-bit numbers, otherwise it gives 20% improvement for 256-bit
  // multiplication (like elliptic secp256k1).
  var comb10MulTo = function comb10MulTo (self, num, out) {
    var a = self.words;
    var b = num.words;
    var o = out.words;
    var c = 0;
    var lo;
    var mid;
    var hi;
    var a0 = a[0] | 0;
    var al0 = a0 & 0x1fff;
    var ah0 = a0 >>> 13;
    var a1 = a[1] | 0;
    var al1 = a1 & 0x1fff;
    var ah1 = a1 >>> 13;
    var a2 = a[2] | 0;
    var al2 = a2 & 0x1fff;
    var ah2 = a2 >>> 13;
    var a3 = a[3] | 0;
    var al3 = a3 & 0x1fff;
    var ah3 = a3 >>> 13;
    var a4 = a[4] | 0;
    var al4 = a4 & 0x1fff;
    var ah4 = a4 >>> 13;
    var a5 = a[5] | 0;
    var al5 = a5 & 0x1fff;
    var ah5 = a5 >>> 13;
    var a6 = a[6] | 0;
    var al6 = a6 & 0x1fff;
    var ah6 = a6 >>> 13;
    var a7 = a[7] | 0;
    var al7 = a7 & 0x1fff;
    var ah7 = a7 >>> 13;
    var a8 = a[8] | 0;
    var al8 = a8 & 0x1fff;
    var ah8 = a8 >>> 13;
    var a9 = a[9] | 0;
    var al9 = a9 & 0x1fff;
    var ah9 = a9 >>> 13;
    var b0 = b[0] | 0;
    var bl0 = b0 & 0x1fff;
    var bh0 = b0 >>> 13;
    var b1 = b[1] | 0;
    var bl1 = b1 & 0x1fff;
    var bh1 = b1 >>> 13;
    var b2 = b[2] | 0;
    var bl2 = b2 & 0x1fff;
    var bh2 = b2 >>> 13;
    var b3 = b[3] | 0;
    var bl3 = b3 & 0x1fff;
    var bh3 = b3 >>> 13;
    var b4 = b[4] | 0;
    var bl4 = b4 & 0x1fff;
    var bh4 = b4 >>> 13;
    var b5 = b[5] | 0;
    var bl5 = b5 & 0x1fff;
    var bh5 = b5 >>> 13;
    var b6 = b[6] | 0;
    var bl6 = b6 & 0x1fff;
    var bh6 = b6 >>> 13;
    var b7 = b[7] | 0;
    var bl7 = b7 & 0x1fff;
    var bh7 = b7 >>> 13;
    var b8 = b[8] | 0;
    var bl8 = b8 & 0x1fff;
    var bh8 = b8 >>> 13;
    var b9 = b[9] | 0;
    var bl9 = b9 & 0x1fff;
    var bh9 = b9 >>> 13;

    out.negative = self.negative ^ num.negative;
    out.length = 19;
    /* k = 0 */
    lo = Math.imul(al0, bl0);
    mid = Math.imul(al0, bh0);
    mid = (mid + Math.imul(ah0, bl0)) | 0;
    hi = Math.imul(ah0, bh0);
    var w0 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
    c = (((hi + (mid >>> 13)) | 0) + (w0 >>> 26)) | 0;
    w0 &= 0x3ffffff;
    /* k = 1 */
    lo = Math.imul(al1, bl0);
    mid = Math.imul(al1, bh0);
    mid = (mid + Math.imul(ah1, bl0)) | 0;
    hi = Math.imul(ah1, bh0);
    lo = (lo + Math.imul(al0, bl1)) | 0;
    mid = (mid + Math.imul(al0, bh1)) | 0;
    mid = (mid + Math.imul(ah0, bl1)) | 0;
    hi = (hi + Math.imul(ah0, bh1)) | 0;
    var w1 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
    c = (((hi + (mid >>> 13)) | 0) + (w1 >>> 26)) | 0;
    w1 &= 0x3ffffff;
    /* k = 2 */
    lo = Math.imul(al2, bl0);
    mid = Math.imul(al2, bh0);
    mid = (mid + Math.imul(ah2, bl0)) | 0;
    hi = Math.imul(ah2, bh0);
    lo = (lo + Math.imul(al1, bl1)) | 0;
    mid = (mid + Math.imul(al1, bh1)) | 0;
    mid = (mid + Math.imul(ah1, bl1)) | 0;
    hi = (hi + Math.imul(ah1, bh1)) | 0;
    lo = (lo + Math.imul(al0, bl2)) | 0;
    mid = (mid + Math.imul(al0, bh2)) | 0;
    mid = (mid + Math.imul(ah0, bl2)) | 0;
    hi = (hi + Math.imul(ah0, bh2)) | 0;
    var w2 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
    c = (((hi + (mid >>> 13)) | 0) + (w2 >>> 26)) | 0;
    w2 &= 0x3ffffff;
    /* k = 3 */
    lo = Math.imul(al3, bl0);
    mid = Math.imul(al3, bh0);
    mid = (mid + Math.imul(ah3, bl0)) | 0;
    hi = Math.imul(ah3, bh0);
    lo = (lo + Math.imul(al2, bl1)) | 0;
    mid = (mid + Math.imul(al2, bh1)) | 0;
    mid = (mid + Math.imul(ah2, bl1)) | 0;
    hi = (hi + Math.imul(ah2, bh1)) | 0;
    lo = (lo + Math.imul(al1, bl2)) | 0;
    mid = (mid + Math.imul(al1, bh2)) | 0;
    mid = (mid + Math.imul(ah1, bl2)) | 0;
    hi = (hi + Math.imul(ah1, bh2)) | 0;
    lo = (lo + Math.imul(al0, bl3)) | 0;
    mid = (mid + Math.imul(al0, bh3)) | 0;
    mid = (mid + Math.imul(ah0, bl3)) | 0;
    hi = (hi + Math.imul(ah0, bh3)) | 0;
    var w3 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
    c = (((hi + (mid >>> 13)) | 0) + (w3 >>> 26)) | 0;
    w3 &= 0x3ffffff;
    /* k = 4 */
    lo = Math.imul(al4, bl0);
    mid = Math.imul(al4, bh0);
    mid = (mid + Math.imul(ah4, bl0)) | 0;
    hi = Math.imul(ah4, bh0);
    lo = (lo + Math.imul(al3, bl1)) | 0;
    mid = (mid + Math.imul(al3, bh1)) | 0;
    mid = (mid + Math.imul(ah3, bl1)) | 0;
    hi = (hi + Math.imul(ah3, bh1)) | 0;
    lo = (lo + Math.imul(al2, bl2)) | 0;
    mid = (mid + Math.imul(al2, bh2)) | 0;
    mid = (mid + Math.imul(ah2, bl2)) | 0;
    hi = (hi + Math.imul(ah2, bh2)) | 0;
    lo = (lo + Math.imul(al1, bl3)) | 0;
    mid = (mid + Math.imul(al1, bh3)) | 0;
    mid = (mid + Math.imul(ah1, bl3)) | 0;
    hi = (hi + Math.imul(ah1, bh3)) | 0;
    lo = (lo + Math.imul(al0, bl4)) | 0;
    mid = (mid + Math.imul(al0, bh4)) | 0;
    mid = (mid + Math.imul(ah0, bl4)) | 0;
    hi = (hi + Math.imul(ah0, bh4)) | 0;
    var w4 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
    c = (((hi + (mid >>> 13)) | 0) + (w4 >>> 26)) | 0;
    w4 &= 0x3ffffff;
    /* k = 5 */
    lo = Math.imul(al5, bl0);
    mid = Math.imul(al5, bh0);
    mid = (mid + Math.imul(ah5, bl0)) | 0;
    hi = Math.imul(ah5, bh0);
    lo = (lo + Math.imul(al4, bl1)) | 0;
    mid = (mid + Math.imul(al4, bh1)) | 0;
    mid = (mid + Math.imul(ah4, bl1)) | 0;
    hi = (hi + Math.imul(ah4, bh1)) | 0;
    lo = (lo + Math.imul(al3, bl2)) | 0;
    mid = (mid + Math.imul(al3, bh2)) | 0;
    mid = (mid + Math.imul(ah3, bl2)) | 0;
    hi = (hi + Math.imul(ah3, bh2)) | 0;
    lo = (lo + Math.imul(al2, bl3)) | 0;
    mid = (mid + Math.imul(al2, bh3)) | 0;
    mid = (mid + Math.imul(ah2, bl3)) | 0;
    hi = (hi + Math.imul(ah2, bh3)) | 0;
    lo = (lo + Math.imul(al1, bl4)) | 0;
    mid = (mid + Math.imul(al1, bh4)) | 0;
    mid = (mid + Math.imul(ah1, bl4)) | 0;
    hi = (hi + Math.imul(ah1, bh4)) | 0;
    lo = (lo + Math.imul(al0, bl5)) | 0;
    mid = (mid + Math.imul(al0, bh5)) | 0;
    mid = (mid + Math.imul(ah0, bl5)) | 0;
    hi = (hi + Math.imul(ah0, bh5)) | 0;
    var w5 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
    c = (((hi + (mid >>> 13)) | 0) + (w5 >>> 26)) | 0;
    w5 &= 0x3ffffff;
    /* k = 6 */
    lo = Math.imul(al6, bl0);
    mid = Math.imul(al6, bh0);
    mid = (mid + Math.imul(ah6, bl0)) | 0;
    hi = Math.imul(ah6, bh0);
    lo = (lo + Math.imul(al5, bl1)) | 0;
    mid = (mid + Math.imul(al5, bh1)) | 0;
    mid = (mid + Math.imul(ah5, bl1)) | 0;
    hi = (hi + Math.imul(ah5, bh1)) | 0;
    lo = (lo + Math.imul(al4, bl2)) | 0;
    mid = (mid + Math.imul(al4, bh2)) | 0;
    mid = (mid + Math.imul(ah4, bl2)) | 0;
    hi = (hi + Math.imul(ah4, bh2)) | 0;
    lo = (lo + Math.imul(al3, bl3)) | 0;
    mid = (mid + Math.imul(al3, bh3)) | 0;
    mid = (mid + Math.imul(ah3, bl3)) | 0;
    hi = (hi + Math.imul(ah3, bh3)) | 0;
    lo = (lo + Math.imul(al2, bl4)) | 0;
    mid = (mid + Math.imul(al2, bh4)) | 0;
    mid = (mid + Math.imul(ah2, bl4)) | 0;
    hi = (hi + Math.imul(ah2, bh4)) | 0;
    lo = (lo + Math.imul(al1, bl5)) | 0;
    mid = (mid + Math.imul(al1, bh5)) | 0;
    mid = (mid + Math.imul(ah1, bl5)) | 0;
    hi = (hi + Math.imul(ah1, bh5)) | 0;
    lo = (lo + Math.imul(al0, bl6)) | 0;
    mid = (mid + Math.imul(al0, bh6)) | 0;
    mid = (mid + Math.imul(ah0, bl6)) | 0;
    hi = (hi + Math.imul(ah0, bh6)) | 0;
    var w6 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
    c = (((hi + (mid >>> 13)) | 0) + (w6 >>> 26)) | 0;
    w6 &= 0x3ffffff;
    /* k = 7 */
    lo = Math.imul(al7, bl0);
    mid = Math.imul(al7, bh0);
    mid = (mid + Math.imul(ah7, bl0)) | 0;
    hi = Math.imul(ah7, bh0);
    lo = (lo + Math.imul(al6, bl1)) | 0;
    mid = (mid + Math.imul(al6, bh1)) | 0;
    mid = (mid + Math.imul(ah6, bl1)) | 0;
    hi = (hi + Math.imul(ah6, bh1)) | 0;
    lo = (lo + Math.imul(al5, bl2)) | 0;
    mid = (mid + Math.imul(al5, bh2)) | 0;
    mid = (mid + Math.imul(ah5, bl2)) | 0;
    hi = (hi + Math.imul(ah5, bh2)) | 0;
    lo = (lo + Math.imul(al4, bl3)) | 0;
    mid = (mid + Math.imul(al4, bh3)) | 0;
    mid = (mid + Math.imul(ah4, bl3)) | 0;
    hi = (hi + Math.imul(ah4, bh3)) | 0;
    lo = (lo + Math.imul(al3, bl4)) | 0;
    mid = (mid + Math.imul(al3, bh4)) | 0;
    mid = (mid + Math.imul(ah3, bl4)) | 0;
    hi = (hi + Math.imul(ah3, bh4)) | 0;
    lo = (lo + Math.imul(al2, bl5)) | 0;
    mid = (mid + Math.imul(al2, bh5)) | 0;
    mid = (mid + Math.imul(ah2, bl5)) | 0;
    hi = (hi + Math.imul(ah2, bh5)) | 0;
    lo = (lo + Math.imul(al1, bl6)) | 0;
    mid = (mid + Math.imul(al1, bh6)) | 0;
    mid = (mid + Math.imul(ah1, bl6)) | 0;
    hi = (hi + Math.imul(ah1, bh6)) | 0;
    lo = (lo + Math.imul(al0, bl7)) | 0;
    mid = (mid + Math.imul(al0, bh7)) | 0;
    mid = (mid + Math.imul(ah0, bl7)) | 0;
    hi = (hi + Math.imul(ah0, bh7)) | 0;
    var w7 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
    c = (((hi + (mid >>> 13)) | 0) + (w7 >>> 26)) | 0;
    w7 &= 0x3ffffff;
    /* k = 8 */
    lo = Math.imul(al8, bl0);
    mid = Math.imul(al8, bh0);
    mid = (mid + Math.imul(ah8, bl0)) | 0;
    hi = Math.imul(ah8, bh0);
    lo = (lo + Math.imul(al7, bl1)) | 0;
    mid = (mid + Math.imul(al7, bh1)) | 0;
    mid = (mid + Math.imul(ah7, bl1)) | 0;
    hi = (hi + Math.imul(ah7, bh1)) | 0;
    lo = (lo + Math.imul(al6, bl2)) | 0;
    mid = (mid + Math.imul(al6, bh2)) | 0;
    mid = (mid + Math.imul(ah6, bl2)) | 0;
    hi = (hi + Math.imul(ah6, bh2)) | 0;
    lo = (lo + Math.imul(al5, bl3)) | 0;
    mid = (mid + Math.imul(al5, bh3)) | 0;
    mid = (mid + Math.imul(ah5, bl3)) | 0;
    hi = (hi + Math.imul(ah5, bh3)) | 0;
    lo = (lo + Math.imul(al4, bl4)) | 0;
    mid = (mid + Math.imul(al4, bh4)) | 0;
    mid = (mid + Math.imul(ah4, bl4)) | 0;
    hi = (hi + Math.imul(ah4, bh4)) | 0;
    lo = (lo + Math.imul(al3, bl5)) | 0;
    mid = (mid + Math.imul(al3, bh5)) | 0;
    mid = (mid + Math.imul(ah3, bl5)) | 0;
    hi = (hi + Math.imul(ah3, bh5)) | 0;
    lo = (lo + Math.imul(al2, bl6)) | 0;
    mid = (mid + Math.imul(al2, bh6)) | 0;
    mid = (mid + Math.imul(ah2, bl6)) | 0;
    hi = (hi + Math.imul(ah2, bh6)) | 0;
    lo = (lo + Math.imul(al1, bl7)) | 0;
    mid = (mid + Math.imul(al1, bh7)) | 0;
    mid = (mid + Math.imul(ah1, bl7)) | 0;
    hi = (hi + Math.imul(ah1, bh7)) | 0;
    lo = (lo + Math.imul(al0, bl8)) | 0;
    mid = (mid + Math.imul(al0, bh8)) | 0;
    mid = (mid + Math.imul(ah0, bl8)) | 0;
    hi = (hi + Math.imul(ah0, bh8)) | 0;
    var w8 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
    c = (((hi + (mid >>> 13)) | 0) + (w8 >>> 26)) | 0;
    w8 &= 0x3ffffff;
    /* k = 9 */
    lo = Math.imul(al9, bl0);
    mid = Math.imul(al9, bh0);
    mid = (mid + Math.imul(ah9, bl0)) | 0;
    hi = Math.imul(ah9, bh0);
    lo = (lo + Math.imul(al8, bl1)) | 0;
    mid = (mid + Math.imul(al8, bh1)) | 0;
    mid = (mid + Math.imul(ah8, bl1)) | 0;
    hi = (hi + Math.imul(ah8, bh1)) | 0;
    lo = (lo + Math.imul(al7, bl2)) | 0;
    mid = (mid + Math.imul(al7, bh2)) | 0;
    mid = (mid + Math.imul(ah7, bl2)) | 0;
    hi = (hi + Math.imul(ah7, bh2)) | 0;
    lo = (lo + Math.imul(al6, bl3)) | 0;
    mid = (mid + Math.imul(al6, bh3)) | 0;
    mid = (mid + Math.imul(ah6, bl3)) | 0;
    hi = (hi + Math.imul(ah6, bh3)) | 0;
    lo = (lo + Math.imul(al5, bl4)) | 0;
    mid = (mid + Math.imul(al5, bh4)) | 0;
    mid = (mid + Math.imul(ah5, bl4)) | 0;
    hi = (hi + Math.imul(ah5, bh4)) | 0;
    lo = (lo + Math.imul(al4, bl5)) | 0;
    mid = (mid + Math.imul(al4, bh5)) | 0;
    mid = (mid + Math.imul(ah4, bl5)) | 0;
    hi = (hi + Math.imul(ah4, bh5)) | 0;
    lo = (lo + Math.imul(al3, bl6)) | 0;
    mid = (mid + Math.imul(al3, bh6)) | 0;
    mid = (mid + Math.imul(ah3, bl6)) | 0;
    hi = (hi + Math.imul(ah3, bh6)) | 0;
    lo = (lo + Math.imul(al2, bl7)) | 0;
    mid = (mid + Math.imul(al2, bh7)) | 0;
    mid = (mid + Math.imul(ah2, bl7)) | 0;
    hi = (hi + Math.imul(ah2, bh7)) | 0;
    lo = (lo + Math.imul(al1, bl8)) | 0;
    mid = (mid + Math.imul(al1, bh8)) | 0;
    mid = (mid + Math.imul(ah1, bl8)) | 0;
    hi = (hi + Math.imul(ah1, bh8)) | 0;
    lo = (lo + Math.imul(al0, bl9)) | 0;
    mid = (mid + Math.imul(al0, bh9)) | 0;
    mid = (mid + Math.imul(ah0, bl9)) | 0;
    hi = (hi + Math.imul(ah0, bh9)) | 0;
    var w9 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
    c = (((hi + (mid >>> 13)) | 0) + (w9 >>> 26)) | 0;
    w9 &= 0x3ffffff;
    /* k = 10 */
    lo = Math.imul(al9, bl1);
    mid = Math.imul(al9, bh1);
    mid = (mid + Math.imul(ah9, bl1)) | 0;
    hi = Math.imul(ah9, bh1);
    lo = (lo + Math.imul(al8, bl2)) | 0;
    mid = (mid + Math.imul(al8, bh2)) | 0;
    mid = (mid + Math.imul(ah8, bl2)) | 0;
    hi = (hi + Math.imul(ah8, bh2)) | 0;
    lo = (lo + Math.imul(al7, bl3)) | 0;
    mid = (mid + Math.imul(al7, bh3)) | 0;
    mid = (mid + Math.imul(ah7, bl3)) | 0;
    hi = (hi + Math.imul(ah7, bh3)) | 0;
    lo = (lo + Math.imul(al6, bl4)) | 0;
    mid = (mid + Math.imul(al6, bh4)) | 0;
    mid = (mid + Math.imul(ah6, bl4)) | 0;
    hi = (hi + Math.imul(ah6, bh4)) | 0;
    lo = (lo + Math.imul(al5, bl5)) | 0;
    mid = (mid + Math.imul(al5, bh5)) | 0;
    mid = (mid + Math.imul(ah5, bl5)) | 0;
    hi = (hi + Math.imul(ah5, bh5)) | 0;
    lo = (lo + Math.imul(al4, bl6)) | 0;
    mid = (mid + Math.imul(al4, bh6)) | 0;
    mid = (mid + Math.imul(ah4, bl6)) | 0;
    hi = (hi + Math.imul(ah4, bh6)) | 0;
    lo = (lo + Math.imul(al3, bl7)) | 0;
    mid = (mid + Math.imul(al3, bh7)) | 0;
    mid = (mid + Math.imul(ah3, bl7)) | 0;
    hi = (hi + Math.imul(ah3, bh7)) | 0;
    lo = (lo + Math.imul(al2, bl8)) | 0;
    mid = (mid + Math.imul(al2, bh8)) | 0;
    mid = (mid + Math.imul(ah2, bl8)) | 0;
    hi = (hi + Math.imul(ah2, bh8)) | 0;
    lo = (lo + Math.imul(al1, bl9)) | 0;
    mid = (mid + Math.imul(al1, bh9)) | 0;
    mid = (mid + Math.imul(ah1, bl9)) | 0;
    hi = (hi + Math.imul(ah1, bh9)) | 0;
    var w10 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
    c = (((hi + (mid >>> 13)) | 0) + (w10 >>> 26)) | 0;
    w10 &= 0x3ffffff;
    /* k = 11 */
    lo = Math.imul(al9, bl2);
    mid = Math.imul(al9, bh2);
    mid = (mid + Math.imul(ah9, bl2)) | 0;
    hi = Math.imul(ah9, bh2);
    lo = (lo + Math.imul(al8, bl3)) | 0;
    mid = (mid + Math.imul(al8, bh3)) | 0;
    mid = (mid + Math.imul(ah8, bl3)) | 0;
    hi = (hi + Math.imul(ah8, bh3)) | 0;
    lo = (lo + Math.imul(al7, bl4)) | 0;
    mid = (mid + Math.imul(al7, bh4)) | 0;
    mid = (mid + Math.imul(ah7, bl4)) | 0;
    hi = (hi + Math.imul(ah7, bh4)) | 0;
    lo = (lo + Math.imul(al6, bl5)) | 0;
    mid = (mid + Math.imul(al6, bh5)) | 0;
    mid = (mid + Math.imul(ah6, bl5)) | 0;
    hi = (hi + Math.imul(ah6, bh5)) | 0;
    lo = (lo + Math.imul(al5, bl6)) | 0;
    mid = (mid + Math.imul(al5, bh6)) | 0;
    mid = (mid + Math.imul(ah5, bl6)) | 0;
    hi = (hi + Math.imul(ah5, bh6)) | 0;
    lo = (lo + Math.imul(al4, bl7)) | 0;
    mid = (mid + Math.imul(al4, bh7)) | 0;
    mid = (mid + Math.imul(ah4, bl7)) | 0;
    hi = (hi + Math.imul(ah4, bh7)) | 0;
    lo = (lo + Math.imul(al3, bl8)) | 0;
    mid = (mid + Math.imul(al3, bh8)) | 0;
    mid = (mid + Math.imul(ah3, bl8)) | 0;
    hi = (hi + Math.imul(ah3, bh8)) | 0;
    lo = (lo + Math.imul(al2, bl9)) | 0;
    mid = (mid + Math.imul(al2, bh9)) | 0;
    mid = (mid + Math.imul(ah2, bl9)) | 0;
    hi = (hi + Math.imul(ah2, bh9)) | 0;
    var w11 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
    c = (((hi + (mid >>> 13)) | 0) + (w11 >>> 26)) | 0;
    w11 &= 0x3ffffff;
    /* k = 12 */
    lo = Math.imul(al9, bl3);
    mid = Math.imul(al9, bh3);
    mid = (mid + Math.imul(ah9, bl3)) | 0;
    hi = Math.imul(ah9, bh3);
    lo = (lo + Math.imul(al8, bl4)) | 0;
    mid = (mid + Math.imul(al8, bh4)) | 0;
    mid = (mid + Math.imul(ah8, bl4)) | 0;
    hi = (hi + Math.imul(ah8, bh4)) | 0;
    lo = (lo + Math.imul(al7, bl5)) | 0;
    mid = (mid + Math.imul(al7, bh5)) | 0;
    mid = (mid + Math.imul(ah7, bl5)) | 0;
    hi = (hi + Math.imul(ah7, bh5)) | 0;
    lo = (lo + Math.imul(al6, bl6)) | 0;
    mid = (mid + Math.imul(al6, bh6)) | 0;
    mid = (mid + Math.imul(ah6, bl6)) | 0;
    hi = (hi + Math.imul(ah6, bh6)) | 0;
    lo = (lo + Math.imul(al5, bl7)) | 0;
    mid = (mid + Math.imul(al5, bh7)) | 0;
    mid = (mid + Math.imul(ah5, bl7)) | 0;
    hi = (hi + Math.imul(ah5, bh7)) | 0;
    lo = (lo + Math.imul(al4, bl8)) | 0;
    mid = (mid + Math.imul(al4, bh8)) | 0;
    mid = (mid + Math.imul(ah4, bl8)) | 0;
    hi = (hi + Math.imul(ah4, bh8)) | 0;
    lo = (lo + Math.imul(al3, bl9)) | 0;
    mid = (mid + Math.imul(al3, bh9)) | 0;
    mid = (mid + Math.imul(ah3, bl9)) | 0;
    hi = (hi + Math.imul(ah3, bh9)) | 0;
    var w12 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
    c = (((hi + (mid >>> 13)) | 0) + (w12 >>> 26)) | 0;
    w12 &= 0x3ffffff;
    /* k = 13 */
    lo = Math.imul(al9, bl4);
    mid = Math.imul(al9, bh4);
    mid = (mid + Math.imul(ah9, bl4)) | 0;
    hi = Math.imul(ah9, bh4);
    lo = (lo + Math.imul(al8, bl5)) | 0;
    mid = (mid + Math.imul(al8, bh5)) | 0;
    mid = (mid + Math.imul(ah8, bl5)) | 0;
    hi = (hi + Math.imul(ah8, bh5)) | 0;
    lo = (lo + Math.imul(al7, bl6)) | 0;
    mid = (mid + Math.imul(al7, bh6)) | 0;
    mid = (mid + Math.imul(ah7, bl6)) | 0;
    hi = (hi + Math.imul(ah7, bh6)) | 0;
    lo = (lo + Math.imul(al6, bl7)) | 0;
    mid = (mid + Math.imul(al6, bh7)) | 0;
    mid = (mid + Math.imul(ah6, bl7)) | 0;
    hi = (hi + Math.imul(ah6, bh7)) | 0;
    lo = (lo + Math.imul(al5, bl8)) | 0;
    mid = (mid + Math.imul(al5, bh8)) | 0;
    mid = (mid + Math.imul(ah5, bl8)) | 0;
    hi = (hi + Math.imul(ah5, bh8)) | 0;
    lo = (lo + Math.imul(al4, bl9)) | 0;
    mid = (mid + Math.imul(al4, bh9)) | 0;
    mid = (mid + Math.imul(ah4, bl9)) | 0;
    hi = (hi + Math.imul(ah4, bh9)) | 0;
    var w13 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
    c = (((hi + (mid >>> 13)) | 0) + (w13 >>> 26)) | 0;
    w13 &= 0x3ffffff;
    /* k = 14 */
    lo = Math.imul(al9, bl5);
    mid = Math.imul(al9, bh5);
    mid = (mid + Math.imul(ah9, bl5)) | 0;
    hi = Math.imul(ah9, bh5);
    lo = (lo + Math.imul(al8, bl6)) | 0;
    mid = (mid + Math.imul(al8, bh6)) | 0;
    mid = (mid + Math.imul(ah8, bl6)) | 0;
    hi = (hi + Math.imul(ah8, bh6)) | 0;
    lo = (lo + Math.imul(al7, bl7)) | 0;
    mid = (mid + Math.imul(al7, bh7)) | 0;
    mid = (mid + Math.imul(ah7, bl7)) | 0;
    hi = (hi + Math.imul(ah7, bh7)) | 0;
    lo = (lo + Math.imul(al6, bl8)) | 0;
    mid = (mid + Math.imul(al6, bh8)) | 0;
    mid = (mid + Math.imul(ah6, bl8)) | 0;
    hi = (hi + Math.imul(ah6, bh8)) | 0;
    lo = (lo + Math.imul(al5, bl9)) | 0;
    mid = (mid + Math.imul(al5, bh9)) | 0;
    mid = (mid + Math.imul(ah5, bl9)) | 0;
    hi = (hi + Math.imul(ah5, bh9)) | 0;
    var w14 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
    c = (((hi + (mid >>> 13)) | 0) + (w14 >>> 26)) | 0;
    w14 &= 0x3ffffff;
    /* k = 15 */
    lo = Math.imul(al9, bl6);
    mid = Math.imul(al9, bh6);
    mid = (mid + Math.imul(ah9, bl6)) | 0;
    hi = Math.imul(ah9, bh6);
    lo = (lo + Math.imul(al8, bl7)) | 0;
    mid = (mid + Math.imul(al8, bh7)) | 0;
    mid = (mid + Math.imul(ah8, bl7)) | 0;
    hi = (hi + Math.imul(ah8, bh7)) | 0;
    lo = (lo + Math.imul(al7, bl8)) | 0;
    mid = (mid + Math.imul(al7, bh8)) | 0;
    mid = (mid + Math.imul(ah7, bl8)) | 0;
    hi = (hi + Math.imul(ah7, bh8)) | 0;
    lo = (lo + Math.imul(al6, bl9)) | 0;
    mid = (mid + Math.imul(al6, bh9)) | 0;
    mid = (mid + Math.imul(ah6, bl9)) | 0;
    hi = (hi + Math.imul(ah6, bh9)) | 0;
    var w15 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
    c = (((hi + (mid >>> 13)) | 0) + (w15 >>> 26)) | 0;
    w15 &= 0x3ffffff;
    /* k = 16 */
    lo = Math.imul(al9, bl7);
    mid = Math.imul(al9, bh7);
    mid = (mid + Math.imul(ah9, bl7)) | 0;
    hi = Math.imul(ah9, bh7);
    lo = (lo + Math.imul(al8, bl8)) | 0;
    mid = (mid + Math.imul(al8, bh8)) | 0;
    mid = (mid + Math.imul(ah8, bl8)) | 0;
    hi = (hi + Math.imul(ah8, bh8)) | 0;
    lo = (lo + Math.imul(al7, bl9)) | 0;
    mid = (mid + Math.imul(al7, bh9)) | 0;
    mid = (mid + Math.imul(ah7, bl9)) | 0;
    hi = (hi + Math.imul(ah7, bh9)) | 0;
    var w16 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
    c = (((hi + (mid >>> 13)) | 0) + (w16 >>> 26)) | 0;
    w16 &= 0x3ffffff;
    /* k = 17 */
    lo = Math.imul(al9, bl8);
    mid = Math.imul(al9, bh8);
    mid = (mid + Math.imul(ah9, bl8)) | 0;
    hi = Math.imul(ah9, bh8);
    lo = (lo + Math.imul(al8, bl9)) | 0;
    mid = (mid + Math.imul(al8, bh9)) | 0;
    mid = (mid + Math.imul(ah8, bl9)) | 0;
    hi = (hi + Math.imul(ah8, bh9)) | 0;
    var w17 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
    c = (((hi + (mid >>> 13)) | 0) + (w17 >>> 26)) | 0;
    w17 &= 0x3ffffff;
    /* k = 18 */
    lo = Math.imul(al9, bl9);
    mid = Math.imul(al9, bh9);
    mid = (mid + Math.imul(ah9, bl9)) | 0;
    hi = Math.imul(ah9, bh9);
    var w18 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
    c = (((hi + (mid >>> 13)) | 0) + (w18 >>> 26)) | 0;
    w18 &= 0x3ffffff;
    o[0] = w0;
    o[1] = w1;
    o[2] = w2;
    o[3] = w3;
    o[4] = w4;
    o[5] = w5;
    o[6] = w6;
    o[7] = w7;
    o[8] = w8;
    o[9] = w9;
    o[10] = w10;
    o[11] = w11;
    o[12] = w12;
    o[13] = w13;
    o[14] = w14;
    o[15] = w15;
    o[16] = w16;
    o[17] = w17;
    o[18] = w18;
    if (c !== 0) {
      o[19] = c;
      out.length++;
    }
    return out;
  };

  // Polyfill comb
  if (!Math.imul) {
    comb10MulTo = smallMulTo;
  }

  function bigMulTo (self, num, out) {
    out.negative = num.negative ^ self.negative;
    out.length = self.length + num.length;

    var carry = 0;
    var hncarry = 0;
    for (var k = 0; k < out.length - 1; k++) {
      // Sum all words with the same `i + j = k` and accumulate `ncarry`,
      // note that ncarry could be >= 0x3ffffff
      var ncarry = hncarry;
      hncarry = 0;
      var rword = carry & 0x3ffffff;
      var maxJ = Math.min(k, num.length - 1);
      for (var j = Math.max(0, k - self.length + 1); j <= maxJ; j++) {
        var i = k - j;
        var a = self.words[i] | 0;
        var b = num.words[j] | 0;
        var r = a * b;

        var lo = r & 0x3ffffff;
        ncarry = (ncarry + ((r / 0x4000000) | 0)) | 0;
        lo = (lo + rword) | 0;
        rword = lo & 0x3ffffff;
        ncarry = (ncarry + (lo >>> 26)) | 0;

        hncarry += ncarry >>> 26;
        ncarry &= 0x3ffffff;
      }
      out.words[k] = rword;
      carry = ncarry;
      ncarry = hncarry;
    }
    if (carry !== 0) {
      out.words[k] = carry;
    } else {
      out.length--;
    }

    return out._strip();
  }

  function jumboMulTo (self, num, out) {
    // Temporary disable, see https://github.com/indutny/bn.js/issues/211
    // var fftm = new FFTM();
    // return fftm.mulp(self, num, out);
    return bigMulTo(self, num, out);
  }

  BN.prototype.mulTo = function mulTo (num, out) {
    var res;
    var len = this.length + num.length;
    if (this.length === 10 && num.length === 10) {
      res = comb10MulTo(this, num, out);
    } else if (len < 63) {
      res = smallMulTo(this, num, out);
    } else if (len < 1024) {
      res = bigMulTo(this, num, out);
    } else {
      res = jumboMulTo(this, num, out);
    }

    return res;
  };

  // Cooley-Tukey algorithm for FFT
  // slightly revisited to rely on looping instead of recursion

  function FFTM (x, y) {
    this.x = x;
    this.y = y;
  }

  FFTM.prototype.makeRBT = function makeRBT (N) {
    var t = new Array(N);
    var l = BN.prototype._countBits(N) - 1;
    for (var i = 0; i < N; i++) {
      t[i] = this.revBin(i, l, N);
    }

    return t;
  };

  // Returns binary-reversed representation of `x`
  FFTM.prototype.revBin = function revBin (x, l, N) {
    if (x === 0 || x === N - 1) return x;

    var rb = 0;
    for (var i = 0; i < l; i++) {
      rb |= (x & 1) << (l - i - 1);
      x >>= 1;
    }

    return rb;
  };

  // Performs "tweedling" phase, therefore 'emulating'
  // behaviour of the recursive algorithm
  FFTM.prototype.permute = function permute (rbt, rws, iws, rtws, itws, N) {
    for (var i = 0; i < N; i++) {
      rtws[i] = rws[rbt[i]];
      itws[i] = iws[rbt[i]];
    }
  };

  FFTM.prototype.transform = function transform (rws, iws, rtws, itws, N, rbt) {
    this.permute(rbt, rws, iws, rtws, itws, N);

    for (var s = 1; s < N; s <<= 1) {
      var l = s << 1;

      var rtwdf = Math.cos(2 * Math.PI / l);
      var itwdf = Math.sin(2 * Math.PI / l);

      for (var p = 0; p < N; p += l) {
        var rtwdf_ = rtwdf;
        var itwdf_ = itwdf;

        for (var j = 0; j < s; j++) {
          var re = rtws[p + j];
          var ie = itws[p + j];

          var ro = rtws[p + j + s];
          var io = itws[p + j + s];

          var rx = rtwdf_ * ro - itwdf_ * io;

          io = rtwdf_ * io + itwdf_ * ro;
          ro = rx;

          rtws[p + j] = re + ro;
          itws[p + j] = ie + io;

          rtws[p + j + s] = re - ro;
          itws[p + j + s] = ie - io;

          /* jshint maxdepth : false */
          if (j !== l) {
            rx = rtwdf * rtwdf_ - itwdf * itwdf_;

            itwdf_ = rtwdf * itwdf_ + itwdf * rtwdf_;
            rtwdf_ = rx;
          }
        }
      }
    }
  };

  FFTM.prototype.guessLen13b = function guessLen13b (n, m) {
    var N = Math.max(m, n) | 1;
    var odd = N & 1;
    var i = 0;
    for (N = N / 2 | 0; N; N = N >>> 1) {
      i++;
    }

    return 1 << i + 1 + odd;
  };

  FFTM.prototype.conjugate = function conjugate (rws, iws, N) {
    if (N <= 1) return;

    for (var i = 0; i < N / 2; i++) {
      var t = rws[i];

      rws[i] = rws[N - i - 1];
      rws[N - i - 1] = t;

      t = iws[i];

      iws[i] = -iws[N - i - 1];
      iws[N - i - 1] = -t;
    }
  };

  FFTM.prototype.normalize13b = function normalize13b (ws, N) {
    var carry = 0;
    for (var i = 0; i < N / 2; i++) {
      var w = Math.round(ws[2 * i + 1] / N) * 0x2000 +
        Math.round(ws[2 * i] / N) +
        carry;

      ws[i] = w & 0x3ffffff;

      if (w < 0x4000000) {
        carry = 0;
      } else {
        carry = w / 0x4000000 | 0;
      }
    }

    return ws;
  };

  FFTM.prototype.convert13b = function convert13b (ws, len, rws, N) {
    var carry = 0;
    for (var i = 0; i < len; i++) {
      carry = carry + (ws[i] | 0);

      rws[2 * i] = carry & 0x1fff; carry = carry >>> 13;
      rws[2 * i + 1] = carry & 0x1fff; carry = carry >>> 13;
    }

    // Pad with zeroes
    for (i = 2 * len; i < N; ++i) {
      rws[i] = 0;
    }

    assert(carry === 0);
    assert((carry & ~0x1fff) === 0);
  };

  FFTM.prototype.stub = function stub (N) {
    var ph = new Array(N);
    for (var i = 0; i < N; i++) {
      ph[i] = 0;
    }

    return ph;
  };

  FFTM.prototype.mulp = function mulp (x, y, out) {
    var N = 2 * this.guessLen13b(x.length, y.length);

    var rbt = this.makeRBT(N);

    var _ = this.stub(N);

    var rws = new Array(N);
    var rwst = new Array(N);
    var iwst = new Array(N);

    var nrws = new Array(N);
    var nrwst = new Array(N);
    var niwst = new Array(N);

    var rmws = out.words;
    rmws.length = N;

    this.convert13b(x.words, x.length, rws, N);
    this.convert13b(y.words, y.length, nrws, N);

    this.transform(rws, _, rwst, iwst, N, rbt);
    this.transform(nrws, _, nrwst, niwst, N, rbt);

    for (var i = 0; i < N; i++) {
      var rx = rwst[i] * nrwst[i] - iwst[i] * niwst[i];
      iwst[i] = rwst[i] * niwst[i] + iwst[i] * nrwst[i];
      rwst[i] = rx;
    }

    this.conjugate(rwst, iwst, N);
    this.transform(rwst, iwst, rmws, _, N, rbt);
    this.conjugate(rmws, _, N);
    this.normalize13b(rmws, N);

    out.negative = x.negative ^ y.negative;
    out.length = x.length + y.length;
    return out._strip();
  };

  // Multiply `this` by `num`
  BN.prototype.mul = function mul (num) {
    var out = new BN(null);
    out.words = new Array(this.length + num.length);
    return this.mulTo(num, out);
  };

  // Multiply employing FFT
  BN.prototype.mulf = function mulf (num) {
    var out = new BN(null);
    out.words = new Array(this.length + num.length);
    return jumboMulTo(this, num, out);
  };

  // In-place Multiplication
  BN.prototype.imul = function imul (num) {
    return this.clone().mulTo(num, this);
  };

  BN.prototype.imuln = function imuln (num) {
    var isNegNum = num < 0;
    if (isNegNum) num = -num;

    assert(typeof num === 'number');
    assert(num < 0x4000000);

    // Carry
    var carry = 0;
    for (var i = 0; i < this.length; i++) {
      var w = (this.words[i] | 0) * num;
      var lo = (w & 0x3ffffff) + (carry & 0x3ffffff);
      carry >>= 26;
      carry += (w / 0x4000000) | 0;
      // NOTE: lo is 27bit maximum
      carry += lo >>> 26;
      this.words[i] = lo & 0x3ffffff;
    }

    if (carry !== 0) {
      this.words[i] = carry;
      this.length++;
    }

    return isNegNum ? this.ineg() : this;
  };

  BN.prototype.muln = function muln (num) {
    return this.clone().imuln(num);
  };

  // `this` * `this`
  BN.prototype.sqr = function sqr () {
    return this.mul(this);
  };

  // `this` * `this` in-place
  BN.prototype.isqr = function isqr () {
    return this.imul(this.clone());
  };

  // Math.pow(`this`, `num`)
  BN.prototype.pow = function pow (num) {
    var w = toBitArray(num);
    if (w.length === 0) return new BN(1);

    // Skip leading zeroes
    var res = this;
    for (var i = 0; i < w.length; i++, res = res.sqr()) {
      if (w[i] !== 0) break;
    }

    if (++i < w.length) {
      for (var q = res.sqr(); i < w.length; i++, q = q.sqr()) {
        if (w[i] === 0) continue;

        res = res.mul(q);
      }
    }

    return res;
  };

  // Shift-left in-place
  BN.prototype.iushln = function iushln (bits) {
    assert(typeof bits === 'number' && bits >= 0);
    var r = bits % 26;
    var s = (bits - r) / 26;
    var carryMask = (0x3ffffff >>> (26 - r)) << (26 - r);
    var i;

    if (r !== 0) {
      var carry = 0;

      for (i = 0; i < this.length; i++) {
        var newCarry = this.words[i] & carryMask;
        var c = ((this.words[i] | 0) - newCarry) << r;
        this.words[i] = c | carry;
        carry = newCarry >>> (26 - r);
      }

      if (carry) {
        this.words[i] = carry;
        this.length++;
      }
    }

    if (s !== 0) {
      for (i = this.length - 1; i >= 0; i--) {
        this.words[i + s] = this.words[i];
      }

      for (i = 0; i < s; i++) {
        this.words[i] = 0;
      }

      this.length += s;
    }

    return this._strip();
  };

  BN.prototype.ishln = function ishln (bits) {
    // TODO(indutny): implement me
    assert(this.negative === 0);
    return this.iushln(bits);
  };

  // Shift-right in-place
  // NOTE: `hint` is a lowest bit before trailing zeroes
  // NOTE: if `extended` is present - it will be filled with destroyed bits
  BN.prototype.iushrn = function iushrn (bits, hint, extended) {
    assert(typeof bits === 'number' && bits >= 0);
    var h;
    if (hint) {
      h = (hint - (hint % 26)) / 26;
    } else {
      h = 0;
    }

    var r = bits % 26;
    var s = Math.min((bits - r) / 26, this.length);
    var mask = 0x3ffffff ^ ((0x3ffffff >>> r) << r);
    var maskedWords = extended;

    h -= s;
    h = Math.max(0, h);

    // Extended mode, copy masked part
    if (maskedWords) {
      for (var i = 0; i < s; i++) {
        maskedWords.words[i] = this.words[i];
      }
      maskedWords.length = s;
    }

    if (s === 0) {
      // No-op, we should not move anything at all
    } else if (this.length > s) {
      this.length -= s;
      for (i = 0; i < this.length; i++) {
        this.words[i] = this.words[i + s];
      }
    } else {
      this.words[0] = 0;
      this.length = 1;
    }

    var carry = 0;
    for (i = this.length - 1; i >= 0 && (carry !== 0 || i >= h); i--) {
      var word = this.words[i] | 0;
      this.words[i] = (carry << (26 - r)) | (word >>> r);
      carry = word & mask;
    }

    // Push carried bits as a mask
    if (maskedWords && carry !== 0) {
      maskedWords.words[maskedWords.length++] = carry;
    }

    if (this.length === 0) {
      this.words[0] = 0;
      this.length = 1;
    }

    return this._strip();
  };

  BN.prototype.ishrn = function ishrn (bits, hint, extended) {
    // TODO(indutny): implement me
    assert(this.negative === 0);
    return this.iushrn(bits, hint, extended);
  };

  // Shift-left
  BN.prototype.shln = function shln (bits) {
    return this.clone().ishln(bits);
  };

  BN.prototype.ushln = function ushln (bits) {
    return this.clone().iushln(bits);
  };

  // Shift-right
  BN.prototype.shrn = function shrn (bits) {
    return this.clone().ishrn(bits);
  };

  BN.prototype.ushrn = function ushrn (bits) {
    return this.clone().iushrn(bits);
  };

  // Test if n bit is set
  BN.prototype.testn = function testn (bit) {
    assert(typeof bit === 'number' && bit >= 0);
    var r = bit % 26;
    var s = (bit - r) / 26;
    var q = 1 << r;

    // Fast case: bit is much higher than all existing words
    if (this.length <= s) return false;

    // Check bit and return
    var w = this.words[s];

    return !!(w & q);
  };

  // Return only lowers bits of number (in-place)
  BN.prototype.imaskn = function imaskn (bits) {
    assert(typeof bits === 'number' && bits >= 0);
    var r = bits % 26;
    var s = (bits - r) / 26;

    assert(this.negative === 0, 'imaskn works only with positive numbers');

    if (this.length <= s) {
      return this;
    }

    if (r !== 0) {
      s++;
    }
    this.length = Math.min(s, this.length);

    if (r !== 0) {
      var mask = 0x3ffffff ^ ((0x3ffffff >>> r) << r);
      this.words[this.length - 1] &= mask;
    }

    return this._strip();
  };

  // Return only lowers bits of number
  BN.prototype.maskn = function maskn (bits) {
    return this.clone().imaskn(bits);
  };

  // Add plain number `num` to `this`
  BN.prototype.iaddn = function iaddn (num) {
    assert(typeof num === 'number');
    assert(num < 0x4000000);
    if (num < 0) return this.isubn(-num);

    // Possible sign change
    if (this.negative !== 0) {
      if (this.length === 1 && (this.words[0] | 0) <= num) {
        this.words[0] = num - (this.words[0] | 0);
        this.negative = 0;
        return this;
      }

      this.negative = 0;
      this.isubn(num);
      this.negative = 1;
      return this;
    }

    // Add without checks
    return this._iaddn(num);
  };

  BN.prototype._iaddn = function _iaddn (num) {
    this.words[0] += num;

    // Carry
    for (var i = 0; i < this.length && this.words[i] >= 0x4000000; i++) {
      this.words[i] -= 0x4000000;
      if (i === this.length - 1) {
        this.words[i + 1] = 1;
      } else {
        this.words[i + 1]++;
      }
    }
    this.length = Math.max(this.length, i + 1);

    return this;
  };

  // Subtract plain number `num` from `this`
  BN.prototype.isubn = function isubn (num) {
    assert(typeof num === 'number');
    assert(num < 0x4000000);
    if (num < 0) return this.iaddn(-num);

    if (this.negative !== 0) {
      this.negative = 0;
      this.iaddn(num);
      this.negative = 1;
      return this;
    }

    this.words[0] -= num;

    if (this.length === 1 && this.words[0] < 0) {
      this.words[0] = -this.words[0];
      this.negative = 1;
    } else {
      // Carry
      for (var i = 0; i < this.length && this.words[i] < 0; i++) {
        this.words[i] += 0x4000000;
        this.words[i + 1] -= 1;
      }
    }

    return this._strip();
  };

  BN.prototype.addn = function addn (num) {
    return this.clone().iaddn(num);
  };

  BN.prototype.subn = function subn (num) {
    return this.clone().isubn(num);
  };

  BN.prototype.iabs = function iabs () {
    this.negative = 0;

    return this;
  };

  BN.prototype.abs = function abs () {
    return this.clone().iabs();
  };

  BN.prototype._ishlnsubmul = function _ishlnsubmul (num, mul, shift) {
    var len = num.length + shift;
    var i;

    this._expand(len);

    var w;
    var carry = 0;
    for (i = 0; i < num.length; i++) {
      w = (this.words[i + shift] | 0) + carry;
      var right = (num.words[i] | 0) * mul;
      w -= right & 0x3ffffff;
      carry = (w >> 26) - ((right / 0x4000000) | 0);
      this.words[i + shift] = w & 0x3ffffff;
    }
    for (; i < this.length - shift; i++) {
      w = (this.words[i + shift] | 0) + carry;
      carry = w >> 26;
      this.words[i + shift] = w & 0x3ffffff;
    }

    if (carry === 0) return this._strip();

    // Subtraction overflow
    assert(carry === -1);
    carry = 0;
    for (i = 0; i < this.length; i++) {
      w = -(this.words[i] | 0) + carry;
      carry = w >> 26;
      this.words[i] = w & 0x3ffffff;
    }
    this.negative = 1;

    return this._strip();
  };

  BN.prototype._wordDiv = function _wordDiv (num, mode) {
    var shift = this.length - num.length;

    var a = this.clone();
    var b = num;

    // Normalize
    var bhi = b.words[b.length - 1] | 0;
    var bhiBits = this._countBits(bhi);
    shift = 26 - bhiBits;
    if (shift !== 0) {
      b = b.ushln(shift);
      a.iushln(shift);
      bhi = b.words[b.length - 1] | 0;
    }

    // Initialize quotient
    var m = a.length - b.length;
    var q;

    if (mode !== 'mod') {
      q = new BN(null);
      q.length = m + 1;
      q.words = new Array(q.length);
      for (var i = 0; i < q.length; i++) {
        q.words[i] = 0;
      }
    }

    var diff = a.clone()._ishlnsubmul(b, 1, m);
    if (diff.negative === 0) {
      a = diff;
      if (q) {
        q.words[m] = 1;
      }
    }

    for (var j = m - 1; j >= 0; j--) {
      var qj = (a.words[b.length + j] | 0) * 0x4000000 +
        (a.words[b.length + j - 1] | 0);

      // NOTE: (qj / bhi) is (0x3ffffff * 0x4000000 + 0x3ffffff) / 0x2000000 max
      // (0x7ffffff)
      qj = Math.min((qj / bhi) | 0, 0x3ffffff);

      a._ishlnsubmul(b, qj, j);
      while (a.negative !== 0) {
        qj--;
        a.negative = 0;
        a._ishlnsubmul(b, 1, j);
        if (!a.isZero()) {
          a.negative ^= 1;
        }
      }
      if (q) {
        q.words[j] = qj;
      }
    }
    if (q) {
      q._strip();
    }
    a._strip();

    // Denormalize
    if (mode !== 'div' && shift !== 0) {
      a.iushrn(shift);
    }

    return {
      div: q || null,
      mod: a
    };
  };

  // NOTE: 1) `mode` can be set to `mod` to request mod only,
  //       to `div` to request div only, or be absent to
  //       request both div & mod
  //       2) `positive` is true if unsigned mod is requested
  BN.prototype.divmod = function divmod (num, mode, positive) {
    assert(!num.isZero());

    if (this.isZero()) {
      return {
        div: new BN(0),
        mod: new BN(0)
      };
    }

    var div, mod, res;
    if (this.negative !== 0 && num.negative === 0) {
      res = this.neg().divmod(num, mode);

      if (mode !== 'mod') {
        div = res.div.neg();
      }

      if (mode !== 'div') {
        mod = res.mod.neg();
        if (positive && mod.negative !== 0) {
          mod.iadd(num);
        }
      }

      return {
        div: div,
        mod: mod
      };
    }

    if (this.negative === 0 && num.negative !== 0) {
      res = this.divmod(num.neg(), mode);

      if (mode !== 'mod') {
        div = res.div.neg();
      }

      return {
        div: div,
        mod: res.mod
      };
    }

    if ((this.negative & num.negative) !== 0) {
      res = this.neg().divmod(num.neg(), mode);

      if (mode !== 'div') {
        mod = res.mod.neg();
        if (positive && mod.negative !== 0) {
          mod.isub(num);
        }
      }

      return {
        div: res.div,
        mod: mod
      };
    }

    // Both numbers are positive at this point

    // Strip both numbers to approximate shift value
    if (num.length > this.length || this.cmp(num) < 0) {
      return {
        div: new BN(0),
        mod: this
      };
    }

    // Very short reduction
    if (num.length === 1) {
      if (mode === 'div') {
        return {
          div: this.divn(num.words[0]),
          mod: null
        };
      }

      if (mode === 'mod') {
        return {
          div: null,
          mod: new BN(this.modrn(num.words[0]))
        };
      }

      return {
        div: this.divn(num.words[0]),
        mod: new BN(this.modrn(num.words[0]))
      };
    }

    return this._wordDiv(num, mode);
  };

  // Find `this` / `num`
  BN.prototype.div = function div (num) {
    return this.divmod(num, 'div', false).div;
  };

  // Find `this` % `num`
  BN.prototype.mod = function mod (num) {
    return this.divmod(num, 'mod', false).mod;
  };

  BN.prototype.umod = function umod (num) {
    return this.divmod(num, 'mod', true).mod;
  };

  // Find Round(`this` / `num`)
  BN.prototype.divRound = function divRound (num) {
    var dm = this.divmod(num);

    // Fast case - exact division
    if (dm.mod.isZero()) return dm.div;

    var mod = dm.div.negative !== 0 ? dm.mod.isub(num) : dm.mod;

    var half = num.ushrn(1);
    var r2 = num.andln(1);
    var cmp = mod.cmp(half);

    // Round down
    if (cmp < 0 || (r2 === 1 && cmp === 0)) return dm.div;

    // Round up
    return dm.div.negative !== 0 ? dm.div.isubn(1) : dm.div.iaddn(1);
  };

  BN.prototype.modrn = function modrn (num) {
    var isNegNum = num < 0;
    if (isNegNum) num = -num;

    assert(num <= 0x3ffffff);
    var p = (1 << 26) % num;

    var acc = 0;
    for (var i = this.length - 1; i >= 0; i--) {
      acc = (p * acc + (this.words[i] | 0)) % num;
    }

    return isNegNum ? -acc : acc;
  };

  // WARNING: DEPRECATED
  BN.prototype.modn = function modn (num) {
    return this.modrn(num);
  };

  // In-place division by number
  BN.prototype.idivn = function idivn (num) {
    var isNegNum = num < 0;
    if (isNegNum) num = -num;

    assert(num <= 0x3ffffff);

    var carry = 0;
    for (var i = this.length - 1; i >= 0; i--) {
      var w = (this.words[i] | 0) + carry * 0x4000000;
      this.words[i] = (w / num) | 0;
      carry = w % num;
    }

    this._strip();
    return isNegNum ? this.ineg() : this;
  };

  BN.prototype.divn = function divn (num) {
    return this.clone().idivn(num);
  };

  BN.prototype.egcd = function egcd (p) {
    assert(p.negative === 0);
    assert(!p.isZero());

    var x = this;
    var y = p.clone();

    if (x.negative !== 0) {
      x = x.umod(p);
    } else {
      x = x.clone();
    }

    // A * x + B * y = x
    var A = new BN(1);
    var B = new BN(0);

    // C * x + D * y = y
    var C = new BN(0);
    var D = new BN(1);

    var g = 0;

    while (x.isEven() && y.isEven()) {
      x.iushrn(1);
      y.iushrn(1);
      ++g;
    }

    var yp = y.clone();
    var xp = x.clone();

    while (!x.isZero()) {
      for (var i = 0, im = 1; (x.words[0] & im) === 0 && i < 26; ++i, im <<= 1);
      if (i > 0) {
        x.iushrn(i);
        while (i-- > 0) {
          if (A.isOdd() || B.isOdd()) {
            A.iadd(yp);
            B.isub(xp);
          }

          A.iushrn(1);
          B.iushrn(1);
        }
      }

      for (var j = 0, jm = 1; (y.words[0] & jm) === 0 && j < 26; ++j, jm <<= 1);
      if (j > 0) {
        y.iushrn(j);
        while (j-- > 0) {
          if (C.isOdd() || D.isOdd()) {
            C.iadd(yp);
            D.isub(xp);
          }

          C.iushrn(1);
          D.iushrn(1);
        }
      }

      if (x.cmp(y) >= 0) {
        x.isub(y);
        A.isub(C);
        B.isub(D);
      } else {
        y.isub(x);
        C.isub(A);
        D.isub(B);
      }
    }

    return {
      a: C,
      b: D,
      gcd: y.iushln(g)
    };
  };

  // This is reduced incarnation of the binary EEA
  // above, designated to invert members of the
  // _prime_ fields F(p) at a maximal speed
  BN.prototype._invmp = function _invmp (p) {
    assert(p.negative === 0);
    assert(!p.isZero());

    var a = this;
    var b = p.clone();

    if (a.negative !== 0) {
      a = a.umod(p);
    } else {
      a = a.clone();
    }

    var x1 = new BN(1);
    var x2 = new BN(0);

    var delta = b.clone();

    while (a.cmpn(1) > 0 && b.cmpn(1) > 0) {
      for (var i = 0, im = 1; (a.words[0] & im) === 0 && i < 26; ++i, im <<= 1);
      if (i > 0) {
        a.iushrn(i);
        while (i-- > 0) {
          if (x1.isOdd()) {
            x1.iadd(delta);
          }

          x1.iushrn(1);
        }
      }

      for (var j = 0, jm = 1; (b.words[0] & jm) === 0 && j < 26; ++j, jm <<= 1);
      if (j > 0) {
        b.iushrn(j);
        while (j-- > 0) {
          if (x2.isOdd()) {
            x2.iadd(delta);
          }

          x2.iushrn(1);
        }
      }

      if (a.cmp(b) >= 0) {
        a.isub(b);
        x1.isub(x2);
      } else {
        b.isub(a);
        x2.isub(x1);
      }
    }

    var res;
    if (a.cmpn(1) === 0) {
      res = x1;
    } else {
      res = x2;
    }

    if (res.cmpn(0) < 0) {
      res.iadd(p);
    }

    return res;
  };

  BN.prototype.gcd = function gcd (num) {
    if (this.isZero()) return num.abs();
    if (num.isZero()) return this.abs();

    var a = this.clone();
    var b = num.clone();
    a.negative = 0;
    b.negative = 0;

    // Remove common factor of two
    for (var shift = 0; a.isEven() && b.isEven(); shift++) {
      a.iushrn(1);
      b.iushrn(1);
    }

    do {
      while (a.isEven()) {
        a.iushrn(1);
      }
      while (b.isEven()) {
        b.iushrn(1);
      }

      var r = a.cmp(b);
      if (r < 0) {
        // Swap `a` and `b` to make `a` always bigger than `b`
        var t = a;
        a = b;
        b = t;
      } else if (r === 0 || b.cmpn(1) === 0) {
        break;
      }

      a.isub(b);
    } while (true);

    return b.iushln(shift);
  };

  // Invert number in the field F(num)
  BN.prototype.invm = function invm (num) {
    return this.egcd(num).a.umod(num);
  };

  BN.prototype.isEven = function isEven () {
    return (this.words[0] & 1) === 0;
  };

  BN.prototype.isOdd = function isOdd () {
    return (this.words[0] & 1) === 1;
  };

  // And first word and num
  BN.prototype.andln = function andln (num) {
    return this.words[0] & num;
  };

  // Increment at the bit position in-line
  BN.prototype.bincn = function bincn (bit) {
    assert(typeof bit === 'number');
    var r = bit % 26;
    var s = (bit - r) / 26;
    var q = 1 << r;

    // Fast case: bit is much higher than all existing words
    if (this.length <= s) {
      this._expand(s + 1);
      this.words[s] |= q;
      return this;
    }

    // Add bit and propagate, if needed
    var carry = q;
    for (var i = s; carry !== 0 && i < this.length; i++) {
      var w = this.words[i] | 0;
      w += carry;
      carry = w >>> 26;
      w &= 0x3ffffff;
      this.words[i] = w;
    }
    if (carry !== 0) {
      this.words[i] = carry;
      this.length++;
    }
    return this;
  };

  BN.prototype.isZero = function isZero () {
    return this.length === 1 && this.words[0] === 0;
  };

  BN.prototype.cmpn = function cmpn (num) {
    var negative = num < 0;

    if (this.negative !== 0 && !negative) return -1;
    if (this.negative === 0 && negative) return 1;

    this._strip();

    var res;
    if (this.length > 1) {
      res = 1;
    } else {
      if (negative) {
        num = -num;
      }

      assert(num <= 0x3ffffff, 'Number is too big');

      var w = this.words[0] | 0;
      res = w === num ? 0 : w < num ? -1 : 1;
    }
    if (this.negative !== 0) return -res | 0;
    return res;
  };

  // Compare two numbers and return:
  // 1 - if `this` > `num`
  // 0 - if `this` == `num`
  // -1 - if `this` < `num`
  BN.prototype.cmp = function cmp (num) {
    if (this.negative !== 0 && num.negative === 0) return -1;
    if (this.negative === 0 && num.negative !== 0) return 1;

    var res = this.ucmp(num);
    if (this.negative !== 0) return -res | 0;
    return res;
  };

  // Unsigned comparison
  BN.prototype.ucmp = function ucmp (num) {
    // At this point both numbers have the same sign
    if (this.length > num.length) return 1;
    if (this.length < num.length) return -1;

    var res = 0;
    for (var i = this.length - 1; i >= 0; i--) {
      var a = this.words[i] | 0;
      var b = num.words[i] | 0;

      if (a === b) continue;
      if (a < b) {
        res = -1;
      } else if (a > b) {
        res = 1;
      }
      break;
    }
    return res;
  };

  BN.prototype.gtn = function gtn (num) {
    return this.cmpn(num) === 1;
  };

  BN.prototype.gt = function gt (num) {
    return this.cmp(num) === 1;
  };

  BN.prototype.gten = function gten (num) {
    return this.cmpn(num) >= 0;
  };

  BN.prototype.gte = function gte (num) {
    return this.cmp(num) >= 0;
  };

  BN.prototype.ltn = function ltn (num) {
    return this.cmpn(num) === -1;
  };

  BN.prototype.lt = function lt (num) {
    return this.cmp(num) === -1;
  };

  BN.prototype.lten = function lten (num) {
    return this.cmpn(num) <= 0;
  };

  BN.prototype.lte = function lte (num) {
    return this.cmp(num) <= 0;
  };

  BN.prototype.eqn = function eqn (num) {
    return this.cmpn(num) === 0;
  };

  BN.prototype.eq = function eq (num) {
    return this.cmp(num) === 0;
  };

  //
  // A reduce context, could be using montgomery or something better, depending
  // on the `m` itself.
  //
  BN.red = function red (num) {
    return new Red(num);
  };

  BN.prototype.toRed = function toRed (ctx) {
    assert(!this.red, 'Already a number in reduction context');
    assert(this.negative === 0, 'red works only with positives');
    return ctx.convertTo(this)._forceRed(ctx);
  };

  BN.prototype.fromRed = function fromRed () {
    assert(this.red, 'fromRed works only with numbers in reduction context');
    return this.red.convertFrom(this);
  };

  BN.prototype._forceRed = function _forceRed (ctx) {
    this.red = ctx;
    return this;
  };

  BN.prototype.forceRed = function forceRed (ctx) {
    assert(!this.red, 'Already a number in reduction context');
    return this._forceRed(ctx);
  };

  BN.prototype.redAdd = function redAdd (num) {
    assert(this.red, 'redAdd works only with red numbers');
    return this.red.add(this, num);
  };

  BN.prototype.redIAdd = function redIAdd (num) {
    assert(this.red, 'redIAdd works only with red numbers');
    return this.red.iadd(this, num);
  };

  BN.prototype.redSub = function redSub (num) {
    assert(this.red, 'redSub works only with red numbers');
    return this.red.sub(this, num);
  };

  BN.prototype.redISub = function redISub (num) {
    assert(this.red, 'redISub works only with red numbers');
    return this.red.isub(this, num);
  };

  BN.prototype.redShl = function redShl (num) {
    assert(this.red, 'redShl works only with red numbers');
    return this.red.shl(this, num);
  };

  BN.prototype.redMul = function redMul (num) {
    assert(this.red, 'redMul works only with red numbers');
    this.red._verify2(this, num);
    return this.red.mul(this, num);
  };

  BN.prototype.redIMul = function redIMul (num) {
    assert(this.red, 'redMul works only with red numbers');
    this.red._verify2(this, num);
    return this.red.imul(this, num);
  };

  BN.prototype.redSqr = function redSqr () {
    assert(this.red, 'redSqr works only with red numbers');
    this.red._verify1(this);
    return this.red.sqr(this);
  };

  BN.prototype.redISqr = function redISqr () {
    assert(this.red, 'redISqr works only with red numbers');
    this.red._verify1(this);
    return this.red.isqr(this);
  };

  // Square root over p
  BN.prototype.redSqrt = function redSqrt () {
    assert(this.red, 'redSqrt works only with red numbers');
    this.red._verify1(this);
    return this.red.sqrt(this);
  };

  BN.prototype.redInvm = function redInvm () {
    assert(this.red, 'redInvm works only with red numbers');
    this.red._verify1(this);
    return this.red.invm(this);
  };

  // Return negative clone of `this` % `red modulo`
  BN.prototype.redNeg = function redNeg () {
    assert(this.red, 'redNeg works only with red numbers');
    this.red._verify1(this);
    return this.red.neg(this);
  };

  BN.prototype.redPow = function redPow (num) {
    assert(this.red && !num.red, 'redPow(normalNum)');
    this.red._verify1(this);
    return this.red.pow(this, num);
  };

  // Prime numbers with efficient reduction
  var primes = {
    k256: null,
    p224: null,
    p192: null,
    p25519: null
  };

  // Pseudo-Mersenne prime
  function MPrime (name, p) {
    // P = 2 ^ N - K
    this.name = name;
    this.p = new BN(p, 16);
    this.n = this.p.bitLength();
    this.k = new BN(1).iushln(this.n).isub(this.p);

    this.tmp = this._tmp();
  }

  MPrime.prototype._tmp = function _tmp () {
    var tmp = new BN(null);
    tmp.words = new Array(Math.ceil(this.n / 13));
    return tmp;
  };

  MPrime.prototype.ireduce = function ireduce (num) {
    // Assumes that `num` is less than `P^2`
    // num = HI * (2 ^ N - K) + HI * K + LO = HI * K + LO (mod P)
    var r = num;
    var rlen;

    do {
      this.split(r, this.tmp);
      r = this.imulK(r);
      r = r.iadd(this.tmp);
      rlen = r.bitLength();
    } while (rlen > this.n);

    var cmp = rlen < this.n ? -1 : r.ucmp(this.p);
    if (cmp === 0) {
      r.words[0] = 0;
      r.length = 1;
    } else if (cmp > 0) {
      r.isub(this.p);
    } else {
      if (r.strip !== undefined) {
        // r is a BN v4 instance
        r.strip();
      } else {
        // r is a BN v5 instance
        r._strip();
      }
    }

    return r;
  };

  MPrime.prototype.split = function split (input, out) {
    input.iushrn(this.n, 0, out);
  };

  MPrime.prototype.imulK = function imulK (num) {
    return num.imul(this.k);
  };

  function K256 () {
    MPrime.call(
      this,
      'k256',
      'ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe fffffc2f');
  }
  inherits(K256, MPrime);

  K256.prototype.split = function split (input, output) {
    // 256 = 9 * 26 + 22
    var mask = 0x3fffff;

    var outLen = Math.min(input.length, 9);
    for (var i = 0; i < outLen; i++) {
      output.words[i] = input.words[i];
    }
    output.length = outLen;

    if (input.length <= 9) {
      input.words[0] = 0;
      input.length = 1;
      return;
    }

    // Shift by 9 limbs
    var prev = input.words[9];
    output.words[output.length++] = prev & mask;

    for (i = 10; i < input.length; i++) {
      var next = input.words[i] | 0;
      input.words[i - 10] = ((next & mask) << 4) | (prev >>> 22);
      prev = next;
    }
    prev >>>= 22;
    input.words[i - 10] = prev;
    if (prev === 0 && input.length > 10) {
      input.length -= 10;
    } else {
      input.length -= 9;
    }
  };

  K256.prototype.imulK = function imulK (num) {
    // K = 0x1000003d1 = [ 0x40, 0x3d1 ]
    num.words[num.length] = 0;
    num.words[num.length + 1] = 0;
    num.length += 2;

    // bounded at: 0x40 * 0x3ffffff + 0x3d0 = 0x100000390
    var lo = 0;
    for (var i = 0; i < num.length; i++) {
      var w = num.words[i] | 0;
      lo += w * 0x3d1;
      num.words[i] = lo & 0x3ffffff;
      lo = w * 0x40 + ((lo / 0x4000000) | 0);
    }

    // Fast length reduction
    if (num.words[num.length - 1] === 0) {
      num.length--;
      if (num.words[num.length - 1] === 0) {
        num.length--;
      }
    }
    return num;
  };

  function P224 () {
    MPrime.call(
      this,
      'p224',
      'ffffffff ffffffff ffffffff ffffffff 00000000 00000000 00000001');
  }
  inherits(P224, MPrime);

  function P192 () {
    MPrime.call(
      this,
      'p192',
      'ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff');
  }
  inherits(P192, MPrime);

  function P25519 () {
    // 2 ^ 255 - 19
    MPrime.call(
      this,
      '25519',
      '7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed');
  }
  inherits(P25519, MPrime);

  P25519.prototype.imulK = function imulK (num) {
    // K = 0x13
    var carry = 0;
    for (var i = 0; i < num.length; i++) {
      var hi = (num.words[i] | 0) * 0x13 + carry;
      var lo = hi & 0x3ffffff;
      hi >>>= 26;

      num.words[i] = lo;
      carry = hi;
    }
    if (carry !== 0) {
      num.words[num.length++] = carry;
    }
    return num;
  };

  // Exported mostly for testing purposes, use plain name instead
  BN._prime = function prime (name) {
    // Cached version of prime
    if (primes[name]) return primes[name];

    var prime;
    if (name === 'k256') {
      prime = new K256();
    } else if (name === 'p224') {
      prime = new P224();
    } else if (name === 'p192') {
      prime = new P192();
    } else if (name === 'p25519') {
      prime = new P25519();
    } else {
      throw new Error('Unknown prime ' + name);
    }
    primes[name] = prime;

    return prime;
  };

  //
  // Base reduction engine
  //
  function Red (m) {
    if (typeof m === 'string') {
      var prime = BN._prime(m);
      this.m = prime.p;
      this.prime = prime;
    } else {
      assert(m.gtn(1), 'modulus must be greater than 1');
      this.m = m;
      this.prime = null;
    }
  }

  Red.prototype._verify1 = function _verify1 (a) {
    assert(a.negative === 0, 'red works only with positives');
    assert(a.red, 'red works only with red numbers');
  };

  Red.prototype._verify2 = function _verify2 (a, b) {
    assert((a.negative | b.negative) === 0, 'red works only with positives');
    assert(a.red && a.red === b.red,
      'red works only with red numbers');
  };

  Red.prototype.imod = function imod (a) {
    if (this.prime) return this.prime.ireduce(a)._forceRed(this);

    move(a, a.umod(this.m)._forceRed(this));
    return a;
  };

  Red.prototype.neg = function neg (a) {
    if (a.isZero()) {
      return a.clone();
    }

    return this.m.sub(a)._forceRed(this);
  };

  Red.prototype.add = function add (a, b) {
    this._verify2(a, b);

    var res = a.add(b);
    if (res.cmp(this.m) >= 0) {
      res.isub(this.m);
    }
    return res._forceRed(this);
  };

  Red.prototype.iadd = function iadd (a, b) {
    this._verify2(a, b);

    var res = a.iadd(b);
    if (res.cmp(this.m) >= 0) {
      res.isub(this.m);
    }
    return res;
  };

  Red.prototype.sub = function sub (a, b) {
    this._verify2(a, b);

    var res = a.sub(b);
    if (res.cmpn(0) < 0) {
      res.iadd(this.m);
    }
    return res._forceRed(this);
  };

  Red.prototype.isub = function isub (a, b) {
    this._verify2(a, b);

    var res = a.isub(b);
    if (res.cmpn(0) < 0) {
      res.iadd(this.m);
    }
    return res;
  };

  Red.prototype.shl = function shl (a, num) {
    this._verify1(a);
    return this.imod(a.ushln(num));
  };

  Red.prototype.imul = function imul (a, b) {
    this._verify2(a, b);
    return this.imod(a.imul(b));
  };

  Red.prototype.mul = function mul (a, b) {
    this._verify2(a, b);
    return this.imod(a.mul(b));
  };

  Red.prototype.isqr = function isqr (a) {
    return this.imul(a, a.clone());
  };

  Red.prototype.sqr = function sqr (a) {
    return this.mul(a, a);
  };

  Red.prototype.sqrt = function sqrt (a) {
    if (a.isZero()) return a.clone();

    var mod3 = this.m.andln(3);
    assert(mod3 % 2 === 1);

    // Fast case
    if (mod3 === 3) {
      var pow = this.m.add(new BN(1)).iushrn(2);
      return this.pow(a, pow);
    }

    // Tonelli-Shanks algorithm (Totally unoptimized and slow)
    //
    // Find Q and S, that Q * 2 ^ S = (P - 1)
    var q = this.m.subn(1);
    var s = 0;
    while (!q.isZero() && q.andln(1) === 0) {
      s++;
      q.iushrn(1);
    }
    assert(!q.isZero());

    var one = new BN(1).toRed(this);
    var nOne = one.redNeg();

    // Find quadratic non-residue
    // NOTE: Max is such because of generalized Riemann hypothesis.
    var lpow = this.m.subn(1).iushrn(1);
    var z = this.m.bitLength();
    z = new BN(2 * z * z).toRed(this);

    while (this.pow(z, lpow).cmp(nOne) !== 0) {
      z.redIAdd(nOne);
    }

    var c = this.pow(z, q);
    var r = this.pow(a, q.addn(1).iushrn(1));
    var t = this.pow(a, q);
    var m = s;
    while (t.cmp(one) !== 0) {
      var tmp = t;
      for (var i = 0; tmp.cmp(one) !== 0; i++) {
        tmp = tmp.redSqr();
      }
      assert(i < m);
      var b = this.pow(c, new BN(1).iushln(m - i - 1));

      r = r.redMul(b);
      c = b.redSqr();
      t = t.redMul(c);
      m = i;
    }

    return r;
  };

  Red.prototype.invm = function invm (a) {
    var inv = a._invmp(this.m);
    if (inv.negative !== 0) {
      inv.negative = 0;
      return this.imod(inv).redNeg();
    } else {
      return this.imod(inv);
    }
  };

  Red.prototype.pow = function pow (a, num) {
    if (num.isZero()) return new BN(1).toRed(this);
    if (num.cmpn(1) === 0) return a.clone();

    var windowSize = 4;
    var wnd = new Array(1 << windowSize);
    wnd[0] = new BN(1).toRed(this);
    wnd[1] = a;
    for (var i = 2; i < wnd.length; i++) {
      wnd[i] = this.mul(wnd[i - 1], a);
    }

    var res = wnd[0];
    var current = 0;
    var currentLen = 0;
    var start = num.bitLength() % 26;
    if (start === 0) {
      start = 26;
    }

    for (i = num.length - 1; i >= 0; i--) {
      var word = num.words[i];
      for (var j = start - 1; j >= 0; j--) {
        var bit = (word >> j) & 1;
        if (res !== wnd[0]) {
          res = this.sqr(res);
        }

        if (bit === 0 && current === 0) {
          currentLen = 0;
          continue;
        }

        current <<= 1;
        current |= bit;
        currentLen++;
        if (currentLen !== windowSize && (i !== 0 || j !== 0)) continue;

        res = this.mul(res, wnd[current]);
        currentLen = 0;
        current = 0;
      }
      start = 26;
    }

    return res;
  };

  Red.prototype.convertTo = function convertTo (num) {
    var r = num.umod(this.m);

    return r === num ? r.clone() : r;
  };

  Red.prototype.convertFrom = function convertFrom (num) {
    var res = num.clone();
    res.red = null;
    return res;
  };

  //
  // Montgomery method engine
  //

  BN.mont = function mont (num) {
    return new Mont(num);
  };

  function Mont (m) {
    Red.call(this, m);

    this.shift = this.m.bitLength();
    if (this.shift % 26 !== 0) {
      this.shift += 26 - (this.shift % 26);
    }

    this.r = new BN(1).iushln(this.shift);
    this.r2 = this.imod(this.r.sqr());
    this.rinv = this.r._invmp(this.m);

    this.minv = this.rinv.mul(this.r).isubn(1).div(this.m);
    this.minv = this.minv.umod(this.r);
    this.minv = this.r.sub(this.minv);
  }
  inherits(Mont, Red);

  Mont.prototype.convertTo = function convertTo (num) {
    return this.imod(num.ushln(this.shift));
  };

  Mont.prototype.convertFrom = function convertFrom (num) {
    var r = this.imod(num.mul(this.rinv));
    r.red = null;
    return r;
  };

  Mont.prototype.imul = function imul (a, b) {
    if (a.isZero() || b.isZero()) {
      a.words[0] = 0;
      a.length = 1;
      return a;
    }

    var t = a.imul(b);
    var c = t.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m);
    var u = t.isub(c).iushrn(this.shift);
    var res = u;

    if (u.cmp(this.m) >= 0) {
      res = u.isub(this.m);
    } else if (u.cmpn(0) < 0) {
      res = u.iadd(this.m);
    }

    return res._forceRed(this);
  };

  Mont.prototype.mul = function mul (a, b) {
    if (a.isZero() || b.isZero()) return new BN(0)._forceRed(this);

    var t = a.mul(b);
    var c = t.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m);
    var u = t.isub(c).iushrn(this.shift);
    var res = u;
    if (u.cmp(this.m) >= 0) {
      res = u.isub(this.m);
    } else if (u.cmpn(0) < 0) {
      res = u.iadd(this.m);
    }

    return res._forceRed(this);
  };

  Mont.prototype.invm = function invm (a) {
    // (AR)^-1 * R^2 = (A^-1 * R^-1) * R^2 = A^-1 * R
    var res = this.imod(a._invmp(this.m).mul(this.r2));
    return res._forceRed(this);
  };
})( false || module, this);


/***/ }),

/***/ 7952:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

var hash = exports;

hash.utils = __webpack_require__(7426);
hash.common = __webpack_require__(6166);
hash.sha = __webpack_require__(6229);
hash.ripemd = __webpack_require__(6784);
hash.hmac = __webpack_require__(8948);

// Proxy hash functions to the main object
hash.sha1 = hash.sha.sha1;
hash.sha256 = hash.sha.sha256;
hash.sha224 = hash.sha.sha224;
hash.sha384 = hash.sha.sha384;
hash.sha512 = hash.sha.sha512;
hash.ripemd160 = hash.ripemd.ripemd160;


/***/ }),

/***/ 6166:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(7426);
var assert = __webpack_require__(3349);

function BlockHash() {
  this.pending = null;
  this.pendingTotal = 0;
  this.blockSize = this.constructor.blockSize;
  this.outSize = this.constructor.outSize;
  this.hmacStrength = this.constructor.hmacStrength;
  this.padLength = this.constructor.padLength / 8;
  this.endian = 'big';

  this._delta8 = this.blockSize / 8;
  this._delta32 = this.blockSize / 32;
}
exports.BlockHash = BlockHash;

BlockHash.prototype.update = function update(msg, enc) {
  // Convert message to array, pad it, and join into 32bit blocks
  msg = utils.toArray(msg, enc);
  if (!this.pending)
    this.pending = msg;
  else
    this.pending = this.pending.concat(msg);
  this.pendingTotal += msg.length;

  // Enough data, try updating
  if (this.pending.length >= this._delta8) {
    msg = this.pending;

    // Process pending data in blocks
    var r = msg.length % this._delta8;
    this.pending = msg.slice(msg.length - r, msg.length);
    if (this.pending.length === 0)
      this.pending = null;

    msg = utils.join32(msg, 0, msg.length - r, this.endian);
    for (var i = 0; i < msg.length; i += this._delta32)
      this._update(msg, i, i + this._delta32);
  }

  return this;
};

BlockHash.prototype.digest = function digest(enc) {
  this.update(this._pad());
  assert(this.pending === null);

  return this._digest(enc);
};

BlockHash.prototype._pad = function pad() {
  var len = this.pendingTotal;
  var bytes = this._delta8;
  var k = bytes - ((len + this.padLength) % bytes);
  var res = new Array(k + this.padLength);
  res[0] = 0x80;
  for (var i = 1; i < k; i++)
    res[i] = 0;

  // Append length
  len <<= 3;
  if (this.endian === 'big') {
    for (var t = 8; t < this.padLength; t++)
      res[i++] = 0;

    res[i++] = 0;
    res[i++] = 0;
    res[i++] = 0;
    res[i++] = 0;
    res[i++] = (len >>> 24) & 0xff;
    res[i++] = (len >>> 16) & 0xff;
    res[i++] = (len >>> 8) & 0xff;
    res[i++] = len & 0xff;
  } else {
    res[i++] = len & 0xff;
    res[i++] = (len >>> 8) & 0xff;
    res[i++] = (len >>> 16) & 0xff;
    res[i++] = (len >>> 24) & 0xff;
    res[i++] = 0;
    res[i++] = 0;
    res[i++] = 0;
    res[i++] = 0;

    for (t = 8; t < this.padLength; t++)
      res[i++] = 0;
  }

  return res;
};


/***/ }),

/***/ 8948:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(7426);
var assert = __webpack_require__(3349);

function Hmac(hash, key, enc) {
  if (!(this instanceof Hmac))
    return new Hmac(hash, key, enc);
  this.Hash = hash;
  this.blockSize = hash.blockSize / 8;
  this.outSize = hash.outSize / 8;
  this.inner = null;
  this.outer = null;

  this._init(utils.toArray(key, enc));
}
module.exports = Hmac;

Hmac.prototype._init = function init(key) {
  // Shorten key, if needed
  if (key.length > this.blockSize)
    key = new this.Hash().update(key).digest();
  assert(key.length <= this.blockSize);

  // Add padding to key
  for (var i = key.length; i < this.blockSize; i++)
    key.push(0);

  for (i = 0; i < key.length; i++)
    key[i] ^= 0x36;
  this.inner = new this.Hash().update(key);

  // 0x36 ^ 0x5c = 0x6a
  for (i = 0; i < key.length; i++)
    key[i] ^= 0x6a;
  this.outer = new this.Hash().update(key);
};

Hmac.prototype.update = function update(msg, enc) {
  this.inner.update(msg, enc);
  return this;
};

Hmac.prototype.digest = function digest(enc) {
  this.outer.update(this.inner.digest());
  return this.outer.digest(enc);
};


/***/ }),

/***/ 6784:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(7426);
var common = __webpack_require__(6166);

var rotl32 = utils.rotl32;
var sum32 = utils.sum32;
var sum32_3 = utils.sum32_3;
var sum32_4 = utils.sum32_4;
var BlockHash = common.BlockHash;

function RIPEMD160() {
  if (!(this instanceof RIPEMD160))
    return new RIPEMD160();

  BlockHash.call(this);

  this.h = [ 0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476, 0xc3d2e1f0 ];
  this.endian = 'little';
}
utils.inherits(RIPEMD160, BlockHash);
exports.ripemd160 = RIPEMD160;

RIPEMD160.blockSize = 512;
RIPEMD160.outSize = 160;
RIPEMD160.hmacStrength = 192;
RIPEMD160.padLength = 64;

RIPEMD160.prototype._update = function update(msg, start) {
  var A = this.h[0];
  var B = this.h[1];
  var C = this.h[2];
  var D = this.h[3];
  var E = this.h[4];
  var Ah = A;
  var Bh = B;
  var Ch = C;
  var Dh = D;
  var Eh = E;
  for (var j = 0; j < 80; j++) {
    var T = sum32(
      rotl32(
        sum32_4(A, f(j, B, C, D), msg[r[j] + start], K(j)),
        s[j]),
      E);
    A = E;
    E = D;
    D = rotl32(C, 10);
    C = B;
    B = T;
    T = sum32(
      rotl32(
        sum32_4(Ah, f(79 - j, Bh, Ch, Dh), msg[rh[j] + start], Kh(j)),
        sh[j]),
      Eh);
    Ah = Eh;
    Eh = Dh;
    Dh = rotl32(Ch, 10);
    Ch = Bh;
    Bh = T;
  }
  T = sum32_3(this.h[1], C, Dh);
  this.h[1] = sum32_3(this.h[2], D, Eh);
  this.h[2] = sum32_3(this.h[3], E, Ah);
  this.h[3] = sum32_3(this.h[4], A, Bh);
  this.h[4] = sum32_3(this.h[0], B, Ch);
  this.h[0] = T;
};

RIPEMD160.prototype._digest = function digest(enc) {
  if (enc === 'hex')
    return utils.toHex32(this.h, 'little');
  else
    return utils.split32(this.h, 'little');
};

function f(j, x, y, z) {
  if (j <= 15)
    return x ^ y ^ z;
  else if (j <= 31)
    return (x & y) | ((~x) & z);
  else if (j <= 47)
    return (x | (~y)) ^ z;
  else if (j <= 63)
    return (x & z) | (y & (~z));
  else
    return x ^ (y | (~z));
}

function K(j) {
  if (j <= 15)
    return 0x00000000;
  else if (j <= 31)
    return 0x5a827999;
  else if (j <= 47)
    return 0x6ed9eba1;
  else if (j <= 63)
    return 0x8f1bbcdc;
  else
    return 0xa953fd4e;
}

function Kh(j) {
  if (j <= 15)
    return 0x50a28be6;
  else if (j <= 31)
    return 0x5c4dd124;
  else if (j <= 47)
    return 0x6d703ef3;
  else if (j <= 63)
    return 0x7a6d76e9;
  else
    return 0x00000000;
}

var r = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
  7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8,
  3, 10, 14, 4, 9, 15, 8, 1, 2, 7, 0, 6, 13, 11, 5, 12,
  1, 9, 11, 10, 0, 8, 12, 4, 13, 3, 7, 15, 14, 5, 6, 2,
  4, 0, 5, 9, 7, 12, 2, 10, 14, 1, 3, 8, 11, 6, 15, 13
];

var rh = [
  5, 14, 7, 0, 9, 2, 11, 4, 13, 6, 15, 8, 1, 10, 3, 12,
  6, 11, 3, 7, 0, 13, 5, 10, 14, 15, 8, 12, 4, 9, 1, 2,
  15, 5, 1, 3, 7, 14, 6, 9, 11, 8, 12, 2, 10, 0, 4, 13,
  8, 6, 4, 1, 3, 11, 15, 0, 5, 12, 2, 13, 9, 7, 10, 14,
  12, 15, 10, 4, 1, 5, 8, 7, 6, 2, 13, 14, 0, 3, 9, 11
];

var s = [
  11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8,
  7, 6, 8, 13, 11, 9, 7, 15, 7, 12, 15, 9, 11, 7, 13, 12,
  11, 13, 6, 7, 14, 9, 13, 15, 14, 8, 13, 6, 5, 12, 7, 5,
  11, 12, 14, 15, 14, 15, 9, 8, 9, 14, 5, 6, 8, 6, 5, 12,
  9, 15, 5, 11, 6, 8, 13, 12, 5, 12, 13, 14, 11, 8, 5, 6
];

var sh = [
  8, 9, 9, 11, 13, 15, 15, 5, 7, 7, 8, 11, 14, 14, 12, 6,
  9, 13, 15, 7, 12, 8, 9, 11, 7, 7, 12, 7, 6, 15, 13, 11,
  9, 7, 15, 11, 8, 6, 6, 14, 12, 13, 5, 14, 13, 13, 7, 5,
  15, 5, 8, 11, 14, 14, 6, 14, 6, 9, 12, 9, 12, 5, 15, 8,
  8, 5, 12, 9, 12, 5, 14, 6, 8, 13, 6, 5, 15, 13, 11, 11
];


/***/ }),

/***/ 6229:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


exports.sha1 = __webpack_require__(3917);
exports.sha224 = __webpack_require__(7714);
exports.sha256 = __webpack_require__(2287);
exports.sha384 = __webpack_require__(1911);
exports.sha512 = __webpack_require__(7766);


/***/ }),

/***/ 3917:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(7426);
var common = __webpack_require__(6166);
var shaCommon = __webpack_require__(6225);

var rotl32 = utils.rotl32;
var sum32 = utils.sum32;
var sum32_5 = utils.sum32_5;
var ft_1 = shaCommon.ft_1;
var BlockHash = common.BlockHash;

var sha1_K = [
  0x5A827999, 0x6ED9EBA1,
  0x8F1BBCDC, 0xCA62C1D6
];

function SHA1() {
  if (!(this instanceof SHA1))
    return new SHA1();

  BlockHash.call(this);
  this.h = [
    0x67452301, 0xefcdab89, 0x98badcfe,
    0x10325476, 0xc3d2e1f0 ];
  this.W = new Array(80);
}

utils.inherits(SHA1, BlockHash);
module.exports = SHA1;

SHA1.blockSize = 512;
SHA1.outSize = 160;
SHA1.hmacStrength = 80;
SHA1.padLength = 64;

SHA1.prototype._update = function _update(msg, start) {
  var W = this.W;

  for (var i = 0; i < 16; i++)
    W[i] = msg[start + i];

  for(; i < W.length; i++)
    W[i] = rotl32(W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16], 1);

  var a = this.h[0];
  var b = this.h[1];
  var c = this.h[2];
  var d = this.h[3];
  var e = this.h[4];

  for (i = 0; i < W.length; i++) {
    var s = ~~(i / 20);
    var t = sum32_5(rotl32(a, 5), ft_1(s, b, c, d), e, W[i], sha1_K[s]);
    e = d;
    d = c;
    c = rotl32(b, 30);
    b = a;
    a = t;
  }

  this.h[0] = sum32(this.h[0], a);
  this.h[1] = sum32(this.h[1], b);
  this.h[2] = sum32(this.h[2], c);
  this.h[3] = sum32(this.h[3], d);
  this.h[4] = sum32(this.h[4], e);
};

SHA1.prototype._digest = function digest(enc) {
  if (enc === 'hex')
    return utils.toHex32(this.h, 'big');
  else
    return utils.split32(this.h, 'big');
};


/***/ }),

/***/ 7714:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(7426);
var SHA256 = __webpack_require__(2287);

function SHA224() {
  if (!(this instanceof SHA224))
    return new SHA224();

  SHA256.call(this);
  this.h = [
    0xc1059ed8, 0x367cd507, 0x3070dd17, 0xf70e5939,
    0xffc00b31, 0x68581511, 0x64f98fa7, 0xbefa4fa4 ];
}
utils.inherits(SHA224, SHA256);
module.exports = SHA224;

SHA224.blockSize = 512;
SHA224.outSize = 224;
SHA224.hmacStrength = 192;
SHA224.padLength = 64;

SHA224.prototype._digest = function digest(enc) {
  // Just truncate output
  if (enc === 'hex')
    return utils.toHex32(this.h.slice(0, 7), 'big');
  else
    return utils.split32(this.h.slice(0, 7), 'big');
};



/***/ }),

/***/ 2287:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(7426);
var common = __webpack_require__(6166);
var shaCommon = __webpack_require__(6225);
var assert = __webpack_require__(3349);

var sum32 = utils.sum32;
var sum32_4 = utils.sum32_4;
var sum32_5 = utils.sum32_5;
var ch32 = shaCommon.ch32;
var maj32 = shaCommon.maj32;
var s0_256 = shaCommon.s0_256;
var s1_256 = shaCommon.s1_256;
var g0_256 = shaCommon.g0_256;
var g1_256 = shaCommon.g1_256;

var BlockHash = common.BlockHash;

var sha256_K = [
  0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5,
  0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
  0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3,
  0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
  0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc,
  0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
  0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7,
  0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
  0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13,
  0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
  0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3,
  0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
  0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5,
  0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
  0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208,
  0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
];

function SHA256() {
  if (!(this instanceof SHA256))
    return new SHA256();

  BlockHash.call(this);
  this.h = [
    0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
    0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19
  ];
  this.k = sha256_K;
  this.W = new Array(64);
}
utils.inherits(SHA256, BlockHash);
module.exports = SHA256;

SHA256.blockSize = 512;
SHA256.outSize = 256;
SHA256.hmacStrength = 192;
SHA256.padLength = 64;

SHA256.prototype._update = function _update(msg, start) {
  var W = this.W;

  for (var i = 0; i < 16; i++)
    W[i] = msg[start + i];
  for (; i < W.length; i++)
    W[i] = sum32_4(g1_256(W[i - 2]), W[i - 7], g0_256(W[i - 15]), W[i - 16]);

  var a = this.h[0];
  var b = this.h[1];
  var c = this.h[2];
  var d = this.h[3];
  var e = this.h[4];
  var f = this.h[5];
  var g = this.h[6];
  var h = this.h[7];

  assert(this.k.length === W.length);
  for (i = 0; i < W.length; i++) {
    var T1 = sum32_5(h, s1_256(e), ch32(e, f, g), this.k[i], W[i]);
    var T2 = sum32(s0_256(a), maj32(a, b, c));
    h = g;
    g = f;
    f = e;
    e = sum32(d, T1);
    d = c;
    c = b;
    b = a;
    a = sum32(T1, T2);
  }

  this.h[0] = sum32(this.h[0], a);
  this.h[1] = sum32(this.h[1], b);
  this.h[2] = sum32(this.h[2], c);
  this.h[3] = sum32(this.h[3], d);
  this.h[4] = sum32(this.h[4], e);
  this.h[5] = sum32(this.h[5], f);
  this.h[6] = sum32(this.h[6], g);
  this.h[7] = sum32(this.h[7], h);
};

SHA256.prototype._digest = function digest(enc) {
  if (enc === 'hex')
    return utils.toHex32(this.h, 'big');
  else
    return utils.split32(this.h, 'big');
};


/***/ }),

/***/ 1911:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(7426);

var SHA512 = __webpack_require__(7766);

function SHA384() {
  if (!(this instanceof SHA384))
    return new SHA384();

  SHA512.call(this);
  this.h = [
    0xcbbb9d5d, 0xc1059ed8,
    0x629a292a, 0x367cd507,
    0x9159015a, 0x3070dd17,
    0x152fecd8, 0xf70e5939,
    0x67332667, 0xffc00b31,
    0x8eb44a87, 0x68581511,
    0xdb0c2e0d, 0x64f98fa7,
    0x47b5481d, 0xbefa4fa4 ];
}
utils.inherits(SHA384, SHA512);
module.exports = SHA384;

SHA384.blockSize = 1024;
SHA384.outSize = 384;
SHA384.hmacStrength = 192;
SHA384.padLength = 128;

SHA384.prototype._digest = function digest(enc) {
  if (enc === 'hex')
    return utils.toHex32(this.h.slice(0, 12), 'big');
  else
    return utils.split32(this.h.slice(0, 12), 'big');
};


/***/ }),

/***/ 7766:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(7426);
var common = __webpack_require__(6166);
var assert = __webpack_require__(3349);

var rotr64_hi = utils.rotr64_hi;
var rotr64_lo = utils.rotr64_lo;
var shr64_hi = utils.shr64_hi;
var shr64_lo = utils.shr64_lo;
var sum64 = utils.sum64;
var sum64_hi = utils.sum64_hi;
var sum64_lo = utils.sum64_lo;
var sum64_4_hi = utils.sum64_4_hi;
var sum64_4_lo = utils.sum64_4_lo;
var sum64_5_hi = utils.sum64_5_hi;
var sum64_5_lo = utils.sum64_5_lo;

var BlockHash = common.BlockHash;

var sha512_K = [
  0x428a2f98, 0xd728ae22, 0x71374491, 0x23ef65cd,
  0xb5c0fbcf, 0xec4d3b2f, 0xe9b5dba5, 0x8189dbbc,
  0x3956c25b, 0xf348b538, 0x59f111f1, 0xb605d019,
  0x923f82a4, 0xaf194f9b, 0xab1c5ed5, 0xda6d8118,
  0xd807aa98, 0xa3030242, 0x12835b01, 0x45706fbe,
  0x243185be, 0x4ee4b28c, 0x550c7dc3, 0xd5ffb4e2,
  0x72be5d74, 0xf27b896f, 0x80deb1fe, 0x3b1696b1,
  0x9bdc06a7, 0x25c71235, 0xc19bf174, 0xcf692694,
  0xe49b69c1, 0x9ef14ad2, 0xefbe4786, 0x384f25e3,
  0x0fc19dc6, 0x8b8cd5b5, 0x240ca1cc, 0x77ac9c65,
  0x2de92c6f, 0x592b0275, 0x4a7484aa, 0x6ea6e483,
  0x5cb0a9dc, 0xbd41fbd4, 0x76f988da, 0x831153b5,
  0x983e5152, 0xee66dfab, 0xa831c66d, 0x2db43210,
  0xb00327c8, 0x98fb213f, 0xbf597fc7, 0xbeef0ee4,
  0xc6e00bf3, 0x3da88fc2, 0xd5a79147, 0x930aa725,
  0x06ca6351, 0xe003826f, 0x14292967, 0x0a0e6e70,
  0x27b70a85, 0x46d22ffc, 0x2e1b2138, 0x5c26c926,
  0x4d2c6dfc, 0x5ac42aed, 0x53380d13, 0x9d95b3df,
  0x650a7354, 0x8baf63de, 0x766a0abb, 0x3c77b2a8,
  0x81c2c92e, 0x47edaee6, 0x92722c85, 0x1482353b,
  0xa2bfe8a1, 0x4cf10364, 0xa81a664b, 0xbc423001,
  0xc24b8b70, 0xd0f89791, 0xc76c51a3, 0x0654be30,
  0xd192e819, 0xd6ef5218, 0xd6990624, 0x5565a910,
  0xf40e3585, 0x5771202a, 0x106aa070, 0x32bbd1b8,
  0x19a4c116, 0xb8d2d0c8, 0x1e376c08, 0x5141ab53,
  0x2748774c, 0xdf8eeb99, 0x34b0bcb5, 0xe19b48a8,
  0x391c0cb3, 0xc5c95a63, 0x4ed8aa4a, 0xe3418acb,
  0x5b9cca4f, 0x7763e373, 0x682e6ff3, 0xd6b2b8a3,
  0x748f82ee, 0x5defb2fc, 0x78a5636f, 0x43172f60,
  0x84c87814, 0xa1f0ab72, 0x8cc70208, 0x1a6439ec,
  0x90befffa, 0x23631e28, 0xa4506ceb, 0xde82bde9,
  0xbef9a3f7, 0xb2c67915, 0xc67178f2, 0xe372532b,
  0xca273ece, 0xea26619c, 0xd186b8c7, 0x21c0c207,
  0xeada7dd6, 0xcde0eb1e, 0xf57d4f7f, 0xee6ed178,
  0x06f067aa, 0x72176fba, 0x0a637dc5, 0xa2c898a6,
  0x113f9804, 0xbef90dae, 0x1b710b35, 0x131c471b,
  0x28db77f5, 0x23047d84, 0x32caab7b, 0x40c72493,
  0x3c9ebe0a, 0x15c9bebc, 0x431d67c4, 0x9c100d4c,
  0x4cc5d4be, 0xcb3e42b6, 0x597f299c, 0xfc657e2a,
  0x5fcb6fab, 0x3ad6faec, 0x6c44198c, 0x4a475817
];

function SHA512() {
  if (!(this instanceof SHA512))
    return new SHA512();

  BlockHash.call(this);
  this.h = [
    0x6a09e667, 0xf3bcc908,
    0xbb67ae85, 0x84caa73b,
    0x3c6ef372, 0xfe94f82b,
    0xa54ff53a, 0x5f1d36f1,
    0x510e527f, 0xade682d1,
    0x9b05688c, 0x2b3e6c1f,
    0x1f83d9ab, 0xfb41bd6b,
    0x5be0cd19, 0x137e2179 ];
  this.k = sha512_K;
  this.W = new Array(160);
}
utils.inherits(SHA512, BlockHash);
module.exports = SHA512;

SHA512.blockSize = 1024;
SHA512.outSize = 512;
SHA512.hmacStrength = 192;
SHA512.padLength = 128;

SHA512.prototype._prepareBlock = function _prepareBlock(msg, start) {
  var W = this.W;

  // 32 x 32bit words
  for (var i = 0; i < 32; i++)
    W[i] = msg[start + i];
  for (; i < W.length; i += 2) {
    var c0_hi = g1_512_hi(W[i - 4], W[i - 3]);  // i - 2
    var c0_lo = g1_512_lo(W[i - 4], W[i - 3]);
    var c1_hi = W[i - 14];  // i - 7
    var c1_lo = W[i - 13];
    var c2_hi = g0_512_hi(W[i - 30], W[i - 29]);  // i - 15
    var c2_lo = g0_512_lo(W[i - 30], W[i - 29]);
    var c3_hi = W[i - 32];  // i - 16
    var c3_lo = W[i - 31];

    W[i] = sum64_4_hi(
      c0_hi, c0_lo,
      c1_hi, c1_lo,
      c2_hi, c2_lo,
      c3_hi, c3_lo);
    W[i + 1] = sum64_4_lo(
      c0_hi, c0_lo,
      c1_hi, c1_lo,
      c2_hi, c2_lo,
      c3_hi, c3_lo);
  }
};

SHA512.prototype._update = function _update(msg, start) {
  this._prepareBlock(msg, start);

  var W = this.W;

  var ah = this.h[0];
  var al = this.h[1];
  var bh = this.h[2];
  var bl = this.h[3];
  var ch = this.h[4];
  var cl = this.h[5];
  var dh = this.h[6];
  var dl = this.h[7];
  var eh = this.h[8];
  var el = this.h[9];
  var fh = this.h[10];
  var fl = this.h[11];
  var gh = this.h[12];
  var gl = this.h[13];
  var hh = this.h[14];
  var hl = this.h[15];

  assert(this.k.length === W.length);
  for (var i = 0; i < W.length; i += 2) {
    var c0_hi = hh;
    var c0_lo = hl;
    var c1_hi = s1_512_hi(eh, el);
    var c1_lo = s1_512_lo(eh, el);
    var c2_hi = ch64_hi(eh, el, fh, fl, gh, gl);
    var c2_lo = ch64_lo(eh, el, fh, fl, gh, gl);
    var c3_hi = this.k[i];
    var c3_lo = this.k[i + 1];
    var c4_hi = W[i];
    var c4_lo = W[i + 1];

    var T1_hi = sum64_5_hi(
      c0_hi, c0_lo,
      c1_hi, c1_lo,
      c2_hi, c2_lo,
      c3_hi, c3_lo,
      c4_hi, c4_lo);
    var T1_lo = sum64_5_lo(
      c0_hi, c0_lo,
      c1_hi, c1_lo,
      c2_hi, c2_lo,
      c3_hi, c3_lo,
      c4_hi, c4_lo);

    c0_hi = s0_512_hi(ah, al);
    c0_lo = s0_512_lo(ah, al);
    c1_hi = maj64_hi(ah, al, bh, bl, ch, cl);
    c1_lo = maj64_lo(ah, al, bh, bl, ch, cl);

    var T2_hi = sum64_hi(c0_hi, c0_lo, c1_hi, c1_lo);
    var T2_lo = sum64_lo(c0_hi, c0_lo, c1_hi, c1_lo);

    hh = gh;
    hl = gl;

    gh = fh;
    gl = fl;

    fh = eh;
    fl = el;

    eh = sum64_hi(dh, dl, T1_hi, T1_lo);
    el = sum64_lo(dl, dl, T1_hi, T1_lo);

    dh = ch;
    dl = cl;

    ch = bh;
    cl = bl;

    bh = ah;
    bl = al;

    ah = sum64_hi(T1_hi, T1_lo, T2_hi, T2_lo);
    al = sum64_lo(T1_hi, T1_lo, T2_hi, T2_lo);
  }

  sum64(this.h, 0, ah, al);
  sum64(this.h, 2, bh, bl);
  sum64(this.h, 4, ch, cl);
  sum64(this.h, 6, dh, dl);
  sum64(this.h, 8, eh, el);
  sum64(this.h, 10, fh, fl);
  sum64(this.h, 12, gh, gl);
  sum64(this.h, 14, hh, hl);
};

SHA512.prototype._digest = function digest(enc) {
  if (enc === 'hex')
    return utils.toHex32(this.h, 'big');
  else
    return utils.split32(this.h, 'big');
};

function ch64_hi(xh, xl, yh, yl, zh) {
  var r = (xh & yh) ^ ((~xh) & zh);
  if (r < 0)
    r += 0x100000000;
  return r;
}

function ch64_lo(xh, xl, yh, yl, zh, zl) {
  var r = (xl & yl) ^ ((~xl) & zl);
  if (r < 0)
    r += 0x100000000;
  return r;
}

function maj64_hi(xh, xl, yh, yl, zh) {
  var r = (xh & yh) ^ (xh & zh) ^ (yh & zh);
  if (r < 0)
    r += 0x100000000;
  return r;
}

function maj64_lo(xh, xl, yh, yl, zh, zl) {
  var r = (xl & yl) ^ (xl & zl) ^ (yl & zl);
  if (r < 0)
    r += 0x100000000;
  return r;
}

function s0_512_hi(xh, xl) {
  var c0_hi = rotr64_hi(xh, xl, 28);
  var c1_hi = rotr64_hi(xl, xh, 2);  // 34
  var c2_hi = rotr64_hi(xl, xh, 7);  // 39

  var r = c0_hi ^ c1_hi ^ c2_hi;
  if (r < 0)
    r += 0x100000000;
  return r;
}

function s0_512_lo(xh, xl) {
  var c0_lo = rotr64_lo(xh, xl, 28);
  var c1_lo = rotr64_lo(xl, xh, 2);  // 34
  var c2_lo = rotr64_lo(xl, xh, 7);  // 39

  var r = c0_lo ^ c1_lo ^ c2_lo;
  if (r < 0)
    r += 0x100000000;
  return r;
}

function s1_512_hi(xh, xl) {
  var c0_hi = rotr64_hi(xh, xl, 14);
  var c1_hi = rotr64_hi(xh, xl, 18);
  var c2_hi = rotr64_hi(xl, xh, 9);  // 41

  var r = c0_hi ^ c1_hi ^ c2_hi;
  if (r < 0)
    r += 0x100000000;
  return r;
}

function s1_512_lo(xh, xl) {
  var c0_lo = rotr64_lo(xh, xl, 14);
  var c1_lo = rotr64_lo(xh, xl, 18);
  var c2_lo = rotr64_lo(xl, xh, 9);  // 41

  var r = c0_lo ^ c1_lo ^ c2_lo;
  if (r < 0)
    r += 0x100000000;
  return r;
}

function g0_512_hi(xh, xl) {
  var c0_hi = rotr64_hi(xh, xl, 1);
  var c1_hi = rotr64_hi(xh, xl, 8);
  var c2_hi = shr64_hi(xh, xl, 7);

  var r = c0_hi ^ c1_hi ^ c2_hi;
  if (r < 0)
    r += 0x100000000;
  return r;
}

function g0_512_lo(xh, xl) {
  var c0_lo = rotr64_lo(xh, xl, 1);
  var c1_lo = rotr64_lo(xh, xl, 8);
  var c2_lo = shr64_lo(xh, xl, 7);

  var r = c0_lo ^ c1_lo ^ c2_lo;
  if (r < 0)
    r += 0x100000000;
  return r;
}

function g1_512_hi(xh, xl) {
  var c0_hi = rotr64_hi(xh, xl, 19);
  var c1_hi = rotr64_hi(xl, xh, 29);  // 61
  var c2_hi = shr64_hi(xh, xl, 6);

  var r = c0_hi ^ c1_hi ^ c2_hi;
  if (r < 0)
    r += 0x100000000;
  return r;
}

function g1_512_lo(xh, xl) {
  var c0_lo = rotr64_lo(xh, xl, 19);
  var c1_lo = rotr64_lo(xl, xh, 29);  // 61
  var c2_lo = shr64_lo(xh, xl, 6);

  var r = c0_lo ^ c1_lo ^ c2_lo;
  if (r < 0)
    r += 0x100000000;
  return r;
}


/***/ }),

/***/ 6225:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(7426);
var rotr32 = utils.rotr32;

function ft_1(s, x, y, z) {
  if (s === 0)
    return ch32(x, y, z);
  if (s === 1 || s === 3)
    return p32(x, y, z);
  if (s === 2)
    return maj32(x, y, z);
}
exports.ft_1 = ft_1;

function ch32(x, y, z) {
  return (x & y) ^ ((~x) & z);
}
exports.ch32 = ch32;

function maj32(x, y, z) {
  return (x & y) ^ (x & z) ^ (y & z);
}
exports.maj32 = maj32;

function p32(x, y, z) {
  return x ^ y ^ z;
}
exports.p32 = p32;

function s0_256(x) {
  return rotr32(x, 2) ^ rotr32(x, 13) ^ rotr32(x, 22);
}
exports.s0_256 = s0_256;

function s1_256(x) {
  return rotr32(x, 6) ^ rotr32(x, 11) ^ rotr32(x, 25);
}
exports.s1_256 = s1_256;

function g0_256(x) {
  return rotr32(x, 7) ^ rotr32(x, 18) ^ (x >>> 3);
}
exports.g0_256 = g0_256;

function g1_256(x) {
  return rotr32(x, 17) ^ rotr32(x, 19) ^ (x >>> 10);
}
exports.g1_256 = g1_256;


/***/ }),

/***/ 7426:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var assert = __webpack_require__(3349);
var inherits = __webpack_require__(6698);

exports.inherits = inherits;

function isSurrogatePair(msg, i) {
  if ((msg.charCodeAt(i) & 0xFC00) !== 0xD800) {
    return false;
  }
  if (i < 0 || i + 1 >= msg.length) {
    return false;
  }
  return (msg.charCodeAt(i + 1) & 0xFC00) === 0xDC00;
}

function toArray(msg, enc) {
  if (Array.isArray(msg))
    return msg.slice();
  if (!msg)
    return [];
  var res = [];
  if (typeof msg === 'string') {
    if (!enc) {
      // Inspired by stringToUtf8ByteArray() in closure-library by Google
      // https://github.com/google/closure-library/blob/8598d87242af59aac233270742c8984e2b2bdbe0/closure/goog/crypt/crypt.js#L117-L143
      // Apache License 2.0
      // https://github.com/google/closure-library/blob/master/LICENSE
      var p = 0;
      for (var i = 0; i < msg.length; i++) {
        var c = msg.charCodeAt(i);
        if (c < 128) {
          res[p++] = c;
        } else if (c < 2048) {
          res[p++] = (c >> 6) | 192;
          res[p++] = (c & 63) | 128;
        } else if (isSurrogatePair(msg, i)) {
          c = 0x10000 + ((c & 0x03FF) << 10) + (msg.charCodeAt(++i) & 0x03FF);
          res[p++] = (c >> 18) | 240;
          res[p++] = ((c >> 12) & 63) | 128;
          res[p++] = ((c >> 6) & 63) | 128;
          res[p++] = (c & 63) | 128;
        } else {
          res[p++] = (c >> 12) | 224;
          res[p++] = ((c >> 6) & 63) | 128;
          res[p++] = (c & 63) | 128;
        }
      }
    } else if (enc === 'hex') {
      msg = msg.replace(/[^a-z0-9]+/ig, '');
      if (msg.length % 2 !== 0)
        msg = '0' + msg;
      for (i = 0; i < msg.length; i += 2)
        res.push(parseInt(msg[i] + msg[i + 1], 16));
    }
  } else {
    for (i = 0; i < msg.length; i++)
      res[i] = msg[i] | 0;
  }
  return res;
}
exports.toArray = toArray;

function toHex(msg) {
  var res = '';
  for (var i = 0; i < msg.length; i++)
    res += zero2(msg[i].toString(16));
  return res;
}
exports.toHex = toHex;

function htonl(w) {
  var res = (w >>> 24) |
            ((w >>> 8) & 0xff00) |
            ((w << 8) & 0xff0000) |
            ((w & 0xff) << 24);
  return res >>> 0;
}
exports.htonl = htonl;

function toHex32(msg, endian) {
  var res = '';
  for (var i = 0; i < msg.length; i++) {
    var w = msg[i];
    if (endian === 'little')
      w = htonl(w);
    res += zero8(w.toString(16));
  }
  return res;
}
exports.toHex32 = toHex32;

function zero2(word) {
  if (word.length === 1)
    return '0' + word;
  else
    return word;
}
exports.zero2 = zero2;

function zero8(word) {
  if (word.length === 7)
    return '0' + word;
  else if (word.length === 6)
    return '00' + word;
  else if (word.length === 5)
    return '000' + word;
  else if (word.length === 4)
    return '0000' + word;
  else if (word.length === 3)
    return '00000' + word;
  else if (word.length === 2)
    return '000000' + word;
  else if (word.length === 1)
    return '0000000' + word;
  else
    return word;
}
exports.zero8 = zero8;

function join32(msg, start, end, endian) {
  var len = end - start;
  assert(len % 4 === 0);
  var res = new Array(len / 4);
  for (var i = 0, k = start; i < res.length; i++, k += 4) {
    var w;
    if (endian === 'big')
      w = (msg[k] << 24) | (msg[k + 1] << 16) | (msg[k + 2] << 8) | msg[k + 3];
    else
      w = (msg[k + 3] << 24) | (msg[k + 2] << 16) | (msg[k + 1] << 8) | msg[k];
    res[i] = w >>> 0;
  }
  return res;
}
exports.join32 = join32;

function split32(msg, endian) {
  var res = new Array(msg.length * 4);
  for (var i = 0, k = 0; i < msg.length; i++, k += 4) {
    var m = msg[i];
    if (endian === 'big') {
      res[k] = m >>> 24;
      res[k + 1] = (m >>> 16) & 0xff;
      res[k + 2] = (m >>> 8) & 0xff;
      res[k + 3] = m & 0xff;
    } else {
      res[k + 3] = m >>> 24;
      res[k + 2] = (m >>> 16) & 0xff;
      res[k + 1] = (m >>> 8) & 0xff;
      res[k] = m & 0xff;
    }
  }
  return res;
}
exports.split32 = split32;

function rotr32(w, b) {
  return (w >>> b) | (w << (32 - b));
}
exports.rotr32 = rotr32;

function rotl32(w, b) {
  return (w << b) | (w >>> (32 - b));
}
exports.rotl32 = rotl32;

function sum32(a, b) {
  return (a + b) >>> 0;
}
exports.sum32 = sum32;

function sum32_3(a, b, c) {
  return (a + b + c) >>> 0;
}
exports.sum32_3 = sum32_3;

function sum32_4(a, b, c, d) {
  return (a + b + c + d) >>> 0;
}
exports.sum32_4 = sum32_4;

function sum32_5(a, b, c, d, e) {
  return (a + b + c + d + e) >>> 0;
}
exports.sum32_5 = sum32_5;

function sum64(buf, pos, ah, al) {
  var bh = buf[pos];
  var bl = buf[pos + 1];

  var lo = (al + bl) >>> 0;
  var hi = (lo < al ? 1 : 0) + ah + bh;
  buf[pos] = hi >>> 0;
  buf[pos + 1] = lo;
}
exports.sum64 = sum64;

function sum64_hi(ah, al, bh, bl) {
  var lo = (al + bl) >>> 0;
  var hi = (lo < al ? 1 : 0) + ah + bh;
  return hi >>> 0;
}
exports.sum64_hi = sum64_hi;

function sum64_lo(ah, al, bh, bl) {
  var lo = al + bl;
  return lo >>> 0;
}
exports.sum64_lo = sum64_lo;

function sum64_4_hi(ah, al, bh, bl, ch, cl, dh, dl) {
  var carry = 0;
  var lo = al;
  lo = (lo + bl) >>> 0;
  carry += lo < al ? 1 : 0;
  lo = (lo + cl) >>> 0;
  carry += lo < cl ? 1 : 0;
  lo = (lo + dl) >>> 0;
  carry += lo < dl ? 1 : 0;

  var hi = ah + bh + ch + dh + carry;
  return hi >>> 0;
}
exports.sum64_4_hi = sum64_4_hi;

function sum64_4_lo(ah, al, bh, bl, ch, cl, dh, dl) {
  var lo = al + bl + cl + dl;
  return lo >>> 0;
}
exports.sum64_4_lo = sum64_4_lo;

function sum64_5_hi(ah, al, bh, bl, ch, cl, dh, dl, eh, el) {
  var carry = 0;
  var lo = al;
  lo = (lo + bl) >>> 0;
  carry += lo < al ? 1 : 0;
  lo = (lo + cl) >>> 0;
  carry += lo < cl ? 1 : 0;
  lo = (lo + dl) >>> 0;
  carry += lo < dl ? 1 : 0;
  lo = (lo + el) >>> 0;
  carry += lo < el ? 1 : 0;

  var hi = ah + bh + ch + dh + eh + carry;
  return hi >>> 0;
}
exports.sum64_5_hi = sum64_5_hi;

function sum64_5_lo(ah, al, bh, bl, ch, cl, dh, dl, eh, el) {
  var lo = al + bl + cl + dl + el;

  return lo >>> 0;
}
exports.sum64_5_lo = sum64_5_lo;

function rotr64_hi(ah, al, num) {
  var r = (al << (32 - num)) | (ah >>> num);
  return r >>> 0;
}
exports.rotr64_hi = rotr64_hi;

function rotr64_lo(ah, al, num) {
  var r = (ah << (32 - num)) | (al >>> num);
  return r >>> 0;
}
exports.rotr64_lo = rotr64_lo;

function shr64_hi(ah, al, num) {
  return ah >>> num;
}
exports.shr64_hi = shr64_hi;

function shr64_lo(ah, al, num) {
  var r = (ah << (32 - num)) | (al >>> num);
  return r >>> 0;
}
exports.shr64_lo = shr64_lo;


/***/ }),

/***/ 6698:
/***/ ((module) => {

if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    if (superCtor) {
      ctor.super_ = superCtor
      ctor.prototype = Object.create(superCtor.prototype, {
        constructor: {
          value: ctor,
          enumerable: false,
          writable: true,
          configurable: true
        }
      })
    }
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    if (superCtor) {
      ctor.super_ = superCtor
      var TempCtor = function () {}
      TempCtor.prototype = superCtor.prototype
      ctor.prototype = new TempCtor()
      ctor.prototype.constructor = ctor
    }
  }
}


/***/ }),

/***/ 1176:
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_RESULT__;/**
 * [js-sha3]{@link https://github.com/emn178/js-sha3}
 *
 * @version 0.8.0
 * @author Chen, Yi-Cyuan [emn178@gmail.com]
 * @copyright Chen, Yi-Cyuan 2015-2018
 * @license MIT
 */
/*jslint bitwise: true */
(function () {
  'use strict';

  var INPUT_ERROR = 'input is invalid type';
  var FINALIZE_ERROR = 'finalize already called';
  var WINDOW = typeof window === 'object';
  var root = WINDOW ? window : {};
  if (root.JS_SHA3_NO_WINDOW) {
    WINDOW = false;
  }
  var WEB_WORKER = !WINDOW && typeof self === 'object';
  var NODE_JS = !root.JS_SHA3_NO_NODE_JS && typeof process === 'object' && process.versions && process.versions.node;
  if (NODE_JS) {
    root = __webpack_require__.g;
  } else if (WEB_WORKER) {
    root = self;
  }
  var COMMON_JS = !root.JS_SHA3_NO_COMMON_JS && "object" === 'object' && module.exports;
  var AMD =  true && __webpack_require__.amdO;
  var ARRAY_BUFFER = !root.JS_SHA3_NO_ARRAY_BUFFER && typeof ArrayBuffer !== 'undefined';
  var HEX_CHARS = '0123456789abcdef'.split('');
  var SHAKE_PADDING = [31, 7936, 2031616, 520093696];
  var CSHAKE_PADDING = [4, 1024, 262144, 67108864];
  var KECCAK_PADDING = [1, 256, 65536, 16777216];
  var PADDING = [6, 1536, 393216, 100663296];
  var SHIFT = [0, 8, 16, 24];
  var RC = [1, 0, 32898, 0, 32906, 2147483648, 2147516416, 2147483648, 32907, 0, 2147483649,
    0, 2147516545, 2147483648, 32777, 2147483648, 138, 0, 136, 0, 2147516425, 0,
    2147483658, 0, 2147516555, 0, 139, 2147483648, 32905, 2147483648, 32771,
    2147483648, 32770, 2147483648, 128, 2147483648, 32778, 0, 2147483658, 2147483648,
    2147516545, 2147483648, 32896, 2147483648, 2147483649, 0, 2147516424, 2147483648];
  var BITS = [224, 256, 384, 512];
  var SHAKE_BITS = [128, 256];
  var OUTPUT_TYPES = ['hex', 'buffer', 'arrayBuffer', 'array', 'digest'];
  var CSHAKE_BYTEPAD = {
    '128': 168,
    '256': 136
  };

  if (root.JS_SHA3_NO_NODE_JS || !Array.isArray) {
    Array.isArray = function (obj) {
      return Object.prototype.toString.call(obj) === '[object Array]';
    };
  }

  if (ARRAY_BUFFER && (root.JS_SHA3_NO_ARRAY_BUFFER_IS_VIEW || !ArrayBuffer.isView)) {
    ArrayBuffer.isView = function (obj) {
      return typeof obj === 'object' && obj.buffer && obj.buffer.constructor === ArrayBuffer;
    };
  }

  var createOutputMethod = function (bits, padding, outputType) {
    return function (message) {
      return new Keccak(bits, padding, bits).update(message)[outputType]();
    };
  };

  var createShakeOutputMethod = function (bits, padding, outputType) {
    return function (message, outputBits) {
      return new Keccak(bits, padding, outputBits).update(message)[outputType]();
    };
  };

  var createCshakeOutputMethod = function (bits, padding, outputType) {
    return function (message, outputBits, n, s) {
      return methods['cshake' + bits].update(message, outputBits, n, s)[outputType]();
    };
  };

  var createKmacOutputMethod = function (bits, padding, outputType) {
    return function (key, message, outputBits, s) {
      return methods['kmac' + bits].update(key, message, outputBits, s)[outputType]();
    };
  };

  var createOutputMethods = function (method, createMethod, bits, padding) {
    for (var i = 0; i < OUTPUT_TYPES.length; ++i) {
      var type = OUTPUT_TYPES[i];
      method[type] = createMethod(bits, padding, type);
    }
    return method;
  };

  var createMethod = function (bits, padding) {
    var method = createOutputMethod(bits, padding, 'hex');
    method.create = function () {
      return new Keccak(bits, padding, bits);
    };
    method.update = function (message) {
      return method.create().update(message);
    };
    return createOutputMethods(method, createOutputMethod, bits, padding);
  };

  var createShakeMethod = function (bits, padding) {
    var method = createShakeOutputMethod(bits, padding, 'hex');
    method.create = function (outputBits) {
      return new Keccak(bits, padding, outputBits);
    };
    method.update = function (message, outputBits) {
      return method.create(outputBits).update(message);
    };
    return createOutputMethods(method, createShakeOutputMethod, bits, padding);
  };

  var createCshakeMethod = function (bits, padding) {
    var w = CSHAKE_BYTEPAD[bits];
    var method = createCshakeOutputMethod(bits, padding, 'hex');
    method.create = function (outputBits, n, s) {
      if (!n && !s) {
        return methods['shake' + bits].create(outputBits);
      } else {
        return new Keccak(bits, padding, outputBits).bytepad([n, s], w);
      }
    };
    method.update = function (message, outputBits, n, s) {
      return method.create(outputBits, n, s).update(message);
    };
    return createOutputMethods(method, createCshakeOutputMethod, bits, padding);
  };

  var createKmacMethod = function (bits, padding) {
    var w = CSHAKE_BYTEPAD[bits];
    var method = createKmacOutputMethod(bits, padding, 'hex');
    method.create = function (key, outputBits, s) {
      return new Kmac(bits, padding, outputBits).bytepad(['KMAC', s], w).bytepad([key], w);
    };
    method.update = function (key, message, outputBits, s) {
      return method.create(key, outputBits, s).update(message);
    };
    return createOutputMethods(method, createKmacOutputMethod, bits, padding);
  };

  var algorithms = [
    { name: 'keccak', padding: KECCAK_PADDING, bits: BITS, createMethod: createMethod },
    { name: 'sha3', padding: PADDING, bits: BITS, createMethod: createMethod },
    { name: 'shake', padding: SHAKE_PADDING, bits: SHAKE_BITS, createMethod: createShakeMethod },
    { name: 'cshake', padding: CSHAKE_PADDING, bits: SHAKE_BITS, createMethod: createCshakeMethod },
    { name: 'kmac', padding: CSHAKE_PADDING, bits: SHAKE_BITS, createMethod: createKmacMethod }
  ];

  var methods = {}, methodNames = [];

  for (var i = 0; i < algorithms.length; ++i) {
    var algorithm = algorithms[i];
    var bits = algorithm.bits;
    for (var j = 0; j < bits.length; ++j) {
      var methodName = algorithm.name + '_' + bits[j];
      methodNames.push(methodName);
      methods[methodName] = algorithm.createMethod(bits[j], algorithm.padding);
      if (algorithm.name !== 'sha3') {
        var newMethodName = algorithm.name + bits[j];
        methodNames.push(newMethodName);
        methods[newMethodName] = methods[methodName];
      }
    }
  }

  function Keccak(bits, padding, outputBits) {
    this.blocks = [];
    this.s = [];
    this.padding = padding;
    this.outputBits = outputBits;
    this.reset = true;
    this.finalized = false;
    this.block = 0;
    this.start = 0;
    this.blockCount = (1600 - (bits << 1)) >> 5;
    this.byteCount = this.blockCount << 2;
    this.outputBlocks = outputBits >> 5;
    this.extraBytes = (outputBits & 31) >> 3;

    for (var i = 0; i < 50; ++i) {
      this.s[i] = 0;
    }
  }

  Keccak.prototype.update = function (message) {
    if (this.finalized) {
      throw new Error(FINALIZE_ERROR);
    }
    var notString, type = typeof message;
    if (type !== 'string') {
      if (type === 'object') {
        if (message === null) {
          throw new Error(INPUT_ERROR);
        } else if (ARRAY_BUFFER && message.constructor === ArrayBuffer) {
          message = new Uint8Array(message);
        } else if (!Array.isArray(message)) {
          if (!ARRAY_BUFFER || !ArrayBuffer.isView(message)) {
            throw new Error(INPUT_ERROR);
          }
        }
      } else {
        throw new Error(INPUT_ERROR);
      }
      notString = true;
    }
    var blocks = this.blocks, byteCount = this.byteCount, length = message.length,
      blockCount = this.blockCount, index = 0, s = this.s, i, code;

    while (index < length) {
      if (this.reset) {
        this.reset = false;
        blocks[0] = this.block;
        for (i = 1; i < blockCount + 1; ++i) {
          blocks[i] = 0;
        }
      }
      if (notString) {
        for (i = this.start; index < length && i < byteCount; ++index) {
          blocks[i >> 2] |= message[index] << SHIFT[i++ & 3];
        }
      } else {
        for (i = this.start; index < length && i < byteCount; ++index) {
          code = message.charCodeAt(index);
          if (code < 0x80) {
            blocks[i >> 2] |= code << SHIFT[i++ & 3];
          } else if (code < 0x800) {
            blocks[i >> 2] |= (0xc0 | (code >> 6)) << SHIFT[i++ & 3];
            blocks[i >> 2] |= (0x80 | (code & 0x3f)) << SHIFT[i++ & 3];
          } else if (code < 0xd800 || code >= 0xe000) {
            blocks[i >> 2] |= (0xe0 | (code >> 12)) << SHIFT[i++ & 3];
            blocks[i >> 2] |= (0x80 | ((code >> 6) & 0x3f)) << SHIFT[i++ & 3];
            blocks[i >> 2] |= (0x80 | (code & 0x3f)) << SHIFT[i++ & 3];
          } else {
            code = 0x10000 + (((code & 0x3ff) << 10) | (message.charCodeAt(++index) & 0x3ff));
            blocks[i >> 2] |= (0xf0 | (code >> 18)) << SHIFT[i++ & 3];
            blocks[i >> 2] |= (0x80 | ((code >> 12) & 0x3f)) << SHIFT[i++ & 3];
            blocks[i >> 2] |= (0x80 | ((code >> 6) & 0x3f)) << SHIFT[i++ & 3];
            blocks[i >> 2] |= (0x80 | (code & 0x3f)) << SHIFT[i++ & 3];
          }
        }
      }
      this.lastByteIndex = i;
      if (i >= byteCount) {
        this.start = i - byteCount;
        this.block = blocks[blockCount];
        for (i = 0; i < blockCount; ++i) {
          s[i] ^= blocks[i];
        }
        f(s);
        this.reset = true;
      } else {
        this.start = i;
      }
    }
    return this;
  };

  Keccak.prototype.encode = function (x, right) {
    var o = x & 255, n = 1;
    var bytes = [o];
    x = x >> 8;
    o = x & 255;
    while (o > 0) {
      bytes.unshift(o);
      x = x >> 8;
      o = x & 255;
      ++n;
    }
    if (right) {
      bytes.push(n);
    } else {
      bytes.unshift(n);
    }
    this.update(bytes);
    return bytes.length;
  };

  Keccak.prototype.encodeString = function (str) {
    var notString, type = typeof str;
    if (type !== 'string') {
      if (type === 'object') {
        if (str === null) {
          throw new Error(INPUT_ERROR);
        } else if (ARRAY_BUFFER && str.constructor === ArrayBuffer) {
          str = new Uint8Array(str);
        } else if (!Array.isArray(str)) {
          if (!ARRAY_BUFFER || !ArrayBuffer.isView(str)) {
            throw new Error(INPUT_ERROR);
          }
        }
      } else {
        throw new Error(INPUT_ERROR);
      }
      notString = true;
    }
    var bytes = 0, length = str.length;
    if (notString) {
      bytes = length;
    } else {
      for (var i = 0; i < str.length; ++i) {
        var code = str.charCodeAt(i);
        if (code < 0x80) {
          bytes += 1;
        } else if (code < 0x800) {
          bytes += 2;
        } else if (code < 0xd800 || code >= 0xe000) {
          bytes += 3;
        } else {
          code = 0x10000 + (((code & 0x3ff) << 10) | (str.charCodeAt(++i) & 0x3ff));
          bytes += 4;
        }
      }
    }
    bytes += this.encode(bytes * 8);
    this.update(str);
    return bytes;
  };

  Keccak.prototype.bytepad = function (strs, w) {
    var bytes = this.encode(w);
    for (var i = 0; i < strs.length; ++i) {
      bytes += this.encodeString(strs[i]);
    }
    var paddingBytes = w - bytes % w;
    var zeros = [];
    zeros.length = paddingBytes;
    this.update(zeros);
    return this;
  };

  Keccak.prototype.finalize = function () {
    if (this.finalized) {
      return;
    }
    this.finalized = true;
    var blocks = this.blocks, i = this.lastByteIndex, blockCount = this.blockCount, s = this.s;
    blocks[i >> 2] |= this.padding[i & 3];
    if (this.lastByteIndex === this.byteCount) {
      blocks[0] = blocks[blockCount];
      for (i = 1; i < blockCount + 1; ++i) {
        blocks[i] = 0;
      }
    }
    blocks[blockCount - 1] |= 0x80000000;
    for (i = 0; i < blockCount; ++i) {
      s[i] ^= blocks[i];
    }
    f(s);
  };

  Keccak.prototype.toString = Keccak.prototype.hex = function () {
    this.finalize();

    var blockCount = this.blockCount, s = this.s, outputBlocks = this.outputBlocks,
      extraBytes = this.extraBytes, i = 0, j = 0;
    var hex = '', block;
    while (j < outputBlocks) {
      for (i = 0; i < blockCount && j < outputBlocks; ++i, ++j) {
        block = s[i];
        hex += HEX_CHARS[(block >> 4) & 0x0F] + HEX_CHARS[block & 0x0F] +
          HEX_CHARS[(block >> 12) & 0x0F] + HEX_CHARS[(block >> 8) & 0x0F] +
          HEX_CHARS[(block >> 20) & 0x0F] + HEX_CHARS[(block >> 16) & 0x0F] +
          HEX_CHARS[(block >> 28) & 0x0F] + HEX_CHARS[(block >> 24) & 0x0F];
      }
      if (j % blockCount === 0) {
        f(s);
        i = 0;
      }
    }
    if (extraBytes) {
      block = s[i];
      hex += HEX_CHARS[(block >> 4) & 0x0F] + HEX_CHARS[block & 0x0F];
      if (extraBytes > 1) {
        hex += HEX_CHARS[(block >> 12) & 0x0F] + HEX_CHARS[(block >> 8) & 0x0F];
      }
      if (extraBytes > 2) {
        hex += HEX_CHARS[(block >> 20) & 0x0F] + HEX_CHARS[(block >> 16) & 0x0F];
      }
    }
    return hex;
  };

  Keccak.prototype.arrayBuffer = function () {
    this.finalize();

    var blockCount = this.blockCount, s = this.s, outputBlocks = this.outputBlocks,
      extraBytes = this.extraBytes, i = 0, j = 0;
    var bytes = this.outputBits >> 3;
    var buffer;
    if (extraBytes) {
      buffer = new ArrayBuffer((outputBlocks + 1) << 2);
    } else {
      buffer = new ArrayBuffer(bytes);
    }
    var array = new Uint32Array(buffer);
    while (j < outputBlocks) {
      for (i = 0; i < blockCount && j < outputBlocks; ++i, ++j) {
        array[j] = s[i];
      }
      if (j % blockCount === 0) {
        f(s);
      }
    }
    if (extraBytes) {
      array[i] = s[i];
      buffer = buffer.slice(0, bytes);
    }
    return buffer;
  };

  Keccak.prototype.buffer = Keccak.prototype.arrayBuffer;

  Keccak.prototype.digest = Keccak.prototype.array = function () {
    this.finalize();

    var blockCount = this.blockCount, s = this.s, outputBlocks = this.outputBlocks,
      extraBytes = this.extraBytes, i = 0, j = 0;
    var array = [], offset, block;
    while (j < outputBlocks) {
      for (i = 0; i < blockCount && j < outputBlocks; ++i, ++j) {
        offset = j << 2;
        block = s[i];
        array[offset] = block & 0xFF;
        array[offset + 1] = (block >> 8) & 0xFF;
        array[offset + 2] = (block >> 16) & 0xFF;
        array[offset + 3] = (block >> 24) & 0xFF;
      }
      if (j % blockCount === 0) {
        f(s);
      }
    }
    if (extraBytes) {
      offset = j << 2;
      block = s[i];
      array[offset] = block & 0xFF;
      if (extraBytes > 1) {
        array[offset + 1] = (block >> 8) & 0xFF;
      }
      if (extraBytes > 2) {
        array[offset + 2] = (block >> 16) & 0xFF;
      }
    }
    return array;
  };

  function Kmac(bits, padding, outputBits) {
    Keccak.call(this, bits, padding, outputBits);
  }

  Kmac.prototype = new Keccak();

  Kmac.prototype.finalize = function () {
    this.encode(this.outputBits, true);
    return Keccak.prototype.finalize.call(this);
  };

  var f = function (s) {
    var h, l, n, c0, c1, c2, c3, c4, c5, c6, c7, c8, c9,
      b0, b1, b2, b3, b4, b5, b6, b7, b8, b9, b10, b11, b12, b13, b14, b15, b16, b17,
      b18, b19, b20, b21, b22, b23, b24, b25, b26, b27, b28, b29, b30, b31, b32, b33,
      b34, b35, b36, b37, b38, b39, b40, b41, b42, b43, b44, b45, b46, b47, b48, b49;
    for (n = 0; n < 48; n += 2) {
      c0 = s[0] ^ s[10] ^ s[20] ^ s[30] ^ s[40];
      c1 = s[1] ^ s[11] ^ s[21] ^ s[31] ^ s[41];
      c2 = s[2] ^ s[12] ^ s[22] ^ s[32] ^ s[42];
      c3 = s[3] ^ s[13] ^ s[23] ^ s[33] ^ s[43];
      c4 = s[4] ^ s[14] ^ s[24] ^ s[34] ^ s[44];
      c5 = s[5] ^ s[15] ^ s[25] ^ s[35] ^ s[45];
      c6 = s[6] ^ s[16] ^ s[26] ^ s[36] ^ s[46];
      c7 = s[7] ^ s[17] ^ s[27] ^ s[37] ^ s[47];
      c8 = s[8] ^ s[18] ^ s[28] ^ s[38] ^ s[48];
      c9 = s[9] ^ s[19] ^ s[29] ^ s[39] ^ s[49];

      h = c8 ^ ((c2 << 1) | (c3 >>> 31));
      l = c9 ^ ((c3 << 1) | (c2 >>> 31));
      s[0] ^= h;
      s[1] ^= l;
      s[10] ^= h;
      s[11] ^= l;
      s[20] ^= h;
      s[21] ^= l;
      s[30] ^= h;
      s[31] ^= l;
      s[40] ^= h;
      s[41] ^= l;
      h = c0 ^ ((c4 << 1) | (c5 >>> 31));
      l = c1 ^ ((c5 << 1) | (c4 >>> 31));
      s[2] ^= h;
      s[3] ^= l;
      s[12] ^= h;
      s[13] ^= l;
      s[22] ^= h;
      s[23] ^= l;
      s[32] ^= h;
      s[33] ^= l;
      s[42] ^= h;
      s[43] ^= l;
      h = c2 ^ ((c6 << 1) | (c7 >>> 31));
      l = c3 ^ ((c7 << 1) | (c6 >>> 31));
      s[4] ^= h;
      s[5] ^= l;
      s[14] ^= h;
      s[15] ^= l;
      s[24] ^= h;
      s[25] ^= l;
      s[34] ^= h;
      s[35] ^= l;
      s[44] ^= h;
      s[45] ^= l;
      h = c4 ^ ((c8 << 1) | (c9 >>> 31));
      l = c5 ^ ((c9 << 1) | (c8 >>> 31));
      s[6] ^= h;
      s[7] ^= l;
      s[16] ^= h;
      s[17] ^= l;
      s[26] ^= h;
      s[27] ^= l;
      s[36] ^= h;
      s[37] ^= l;
      s[46] ^= h;
      s[47] ^= l;
      h = c6 ^ ((c0 << 1) | (c1 >>> 31));
      l = c7 ^ ((c1 << 1) | (c0 >>> 31));
      s[8] ^= h;
      s[9] ^= l;
      s[18] ^= h;
      s[19] ^= l;
      s[28] ^= h;
      s[29] ^= l;
      s[38] ^= h;
      s[39] ^= l;
      s[48] ^= h;
      s[49] ^= l;

      b0 = s[0];
      b1 = s[1];
      b32 = (s[11] << 4) | (s[10] >>> 28);
      b33 = (s[10] << 4) | (s[11] >>> 28);
      b14 = (s[20] << 3) | (s[21] >>> 29);
      b15 = (s[21] << 3) | (s[20] >>> 29);
      b46 = (s[31] << 9) | (s[30] >>> 23);
      b47 = (s[30] << 9) | (s[31] >>> 23);
      b28 = (s[40] << 18) | (s[41] >>> 14);
      b29 = (s[41] << 18) | (s[40] >>> 14);
      b20 = (s[2] << 1) | (s[3] >>> 31);
      b21 = (s[3] << 1) | (s[2] >>> 31);
      b2 = (s[13] << 12) | (s[12] >>> 20);
      b3 = (s[12] << 12) | (s[13] >>> 20);
      b34 = (s[22] << 10) | (s[23] >>> 22);
      b35 = (s[23] << 10) | (s[22] >>> 22);
      b16 = (s[33] << 13) | (s[32] >>> 19);
      b17 = (s[32] << 13) | (s[33] >>> 19);
      b48 = (s[42] << 2) | (s[43] >>> 30);
      b49 = (s[43] << 2) | (s[42] >>> 30);
      b40 = (s[5] << 30) | (s[4] >>> 2);
      b41 = (s[4] << 30) | (s[5] >>> 2);
      b22 = (s[14] << 6) | (s[15] >>> 26);
      b23 = (s[15] << 6) | (s[14] >>> 26);
      b4 = (s[25] << 11) | (s[24] >>> 21);
      b5 = (s[24] << 11) | (s[25] >>> 21);
      b36 = (s[34] << 15) | (s[35] >>> 17);
      b37 = (s[35] << 15) | (s[34] >>> 17);
      b18 = (s[45] << 29) | (s[44] >>> 3);
      b19 = (s[44] << 29) | (s[45] >>> 3);
      b10 = (s[6] << 28) | (s[7] >>> 4);
      b11 = (s[7] << 28) | (s[6] >>> 4);
      b42 = (s[17] << 23) | (s[16] >>> 9);
      b43 = (s[16] << 23) | (s[17] >>> 9);
      b24 = (s[26] << 25) | (s[27] >>> 7);
      b25 = (s[27] << 25) | (s[26] >>> 7);
      b6 = (s[36] << 21) | (s[37] >>> 11);
      b7 = (s[37] << 21) | (s[36] >>> 11);
      b38 = (s[47] << 24) | (s[46] >>> 8);
      b39 = (s[46] << 24) | (s[47] >>> 8);
      b30 = (s[8] << 27) | (s[9] >>> 5);
      b31 = (s[9] << 27) | (s[8] >>> 5);
      b12 = (s[18] << 20) | (s[19] >>> 12);
      b13 = (s[19] << 20) | (s[18] >>> 12);
      b44 = (s[29] << 7) | (s[28] >>> 25);
      b45 = (s[28] << 7) | (s[29] >>> 25);
      b26 = (s[38] << 8) | (s[39] >>> 24);
      b27 = (s[39] << 8) | (s[38] >>> 24);
      b8 = (s[48] << 14) | (s[49] >>> 18);
      b9 = (s[49] << 14) | (s[48] >>> 18);

      s[0] = b0 ^ (~b2 & b4);
      s[1] = b1 ^ (~b3 & b5);
      s[10] = b10 ^ (~b12 & b14);
      s[11] = b11 ^ (~b13 & b15);
      s[20] = b20 ^ (~b22 & b24);
      s[21] = b21 ^ (~b23 & b25);
      s[30] = b30 ^ (~b32 & b34);
      s[31] = b31 ^ (~b33 & b35);
      s[40] = b40 ^ (~b42 & b44);
      s[41] = b41 ^ (~b43 & b45);
      s[2] = b2 ^ (~b4 & b6);
      s[3] = b3 ^ (~b5 & b7);
      s[12] = b12 ^ (~b14 & b16);
      s[13] = b13 ^ (~b15 & b17);
      s[22] = b22 ^ (~b24 & b26);
      s[23] = b23 ^ (~b25 & b27);
      s[32] = b32 ^ (~b34 & b36);
      s[33] = b33 ^ (~b35 & b37);
      s[42] = b42 ^ (~b44 & b46);
      s[43] = b43 ^ (~b45 & b47);
      s[4] = b4 ^ (~b6 & b8);
      s[5] = b5 ^ (~b7 & b9);
      s[14] = b14 ^ (~b16 & b18);
      s[15] = b15 ^ (~b17 & b19);
      s[24] = b24 ^ (~b26 & b28);
      s[25] = b25 ^ (~b27 & b29);
      s[34] = b34 ^ (~b36 & b38);
      s[35] = b35 ^ (~b37 & b39);
      s[44] = b44 ^ (~b46 & b48);
      s[45] = b45 ^ (~b47 & b49);
      s[6] = b6 ^ (~b8 & b0);
      s[7] = b7 ^ (~b9 & b1);
      s[16] = b16 ^ (~b18 & b10);
      s[17] = b17 ^ (~b19 & b11);
      s[26] = b26 ^ (~b28 & b20);
      s[27] = b27 ^ (~b29 & b21);
      s[36] = b36 ^ (~b38 & b30);
      s[37] = b37 ^ (~b39 & b31);
      s[46] = b46 ^ (~b48 & b40);
      s[47] = b47 ^ (~b49 & b41);
      s[8] = b8 ^ (~b0 & b2);
      s[9] = b9 ^ (~b1 & b3);
      s[18] = b18 ^ (~b10 & b12);
      s[19] = b19 ^ (~b11 & b13);
      s[28] = b28 ^ (~b20 & b22);
      s[29] = b29 ^ (~b21 & b23);
      s[38] = b38 ^ (~b30 & b32);
      s[39] = b39 ^ (~b31 & b33);
      s[48] = b48 ^ (~b40 & b42);
      s[49] = b49 ^ (~b41 & b43);

      s[0] ^= RC[n];
      s[1] ^= RC[n + 1];
    }
  };

  if (COMMON_JS) {
    module.exports = methods;
  } else {
    for (i = 0; i < methodNames.length; ++i) {
      root[methodNames[i]] = methods[methodNames[i]];
    }
    if (AMD) {
      !(__WEBPACK_AMD_DEFINE_RESULT__ = (function () {
        return methods;
      }).call(exports, __webpack_require__, exports, module),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
    }
  }
})();


/***/ }),

/***/ 3790:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/*!
    localForage -- Offline Storage, Improved
    Version 1.10.0
    https://localforage.github.io/localForage
    (c) 2013-2017 Mozilla, Apache License 2.0
*/
(function(f){if(true){module.exports=f()}else { var g; }})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=undefined;if(!u&&a)return require(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw (f.code="MODULE_NOT_FOUND", f)}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=undefined;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
(function (global){
'use strict';
var Mutation = global.MutationObserver || global.WebKitMutationObserver;

var scheduleDrain;

{
  if (Mutation) {
    var called = 0;
    var observer = new Mutation(nextTick);
    var element = global.document.createTextNode('');
    observer.observe(element, {
      characterData: true
    });
    scheduleDrain = function () {
      element.data = (called = ++called % 2);
    };
  } else if (!global.setImmediate && typeof global.MessageChannel !== 'undefined') {
    var channel = new global.MessageChannel();
    channel.port1.onmessage = nextTick;
    scheduleDrain = function () {
      channel.port2.postMessage(0);
    };
  } else if ('document' in global && 'onreadystatechange' in global.document.createElement('script')) {
    scheduleDrain = function () {

      // Create a <script> element; its readystatechange event will be fired asynchronously once it is inserted
      // into the document. Do so, thus queuing up the task. Remember to clean up once it's been called.
      var scriptEl = global.document.createElement('script');
      scriptEl.onreadystatechange = function () {
        nextTick();

        scriptEl.onreadystatechange = null;
        scriptEl.parentNode.removeChild(scriptEl);
        scriptEl = null;
      };
      global.document.documentElement.appendChild(scriptEl);
    };
  } else {
    scheduleDrain = function () {
      setTimeout(nextTick, 0);
    };
  }
}

var draining;
var queue = [];
//named nextTick for less confusing stack traces
function nextTick() {
  draining = true;
  var i, oldQueue;
  var len = queue.length;
  while (len) {
    oldQueue = queue;
    queue = [];
    i = -1;
    while (++i < len) {
      oldQueue[i]();
    }
    len = queue.length;
  }
  draining = false;
}

module.exports = immediate;
function immediate(task) {
  if (queue.push(task) === 1 && !draining) {
    scheduleDrain();
  }
}

}).call(this,typeof __webpack_require__.g !== "undefined" ? __webpack_require__.g : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],2:[function(_dereq_,module,exports){
'use strict';
var immediate = _dereq_(1);

/* istanbul ignore next */
function INTERNAL() {}

var handlers = {};

var REJECTED = ['REJECTED'];
var FULFILLED = ['FULFILLED'];
var PENDING = ['PENDING'];

module.exports = Promise;

function Promise(resolver) {
  if (typeof resolver !== 'function') {
    throw new TypeError('resolver must be a function');
  }
  this.state = PENDING;
  this.queue = [];
  this.outcome = void 0;
  if (resolver !== INTERNAL) {
    safelyResolveThenable(this, resolver);
  }
}

Promise.prototype["catch"] = function (onRejected) {
  return this.then(null, onRejected);
};
Promise.prototype.then = function (onFulfilled, onRejected) {
  if (typeof onFulfilled !== 'function' && this.state === FULFILLED ||
    typeof onRejected !== 'function' && this.state === REJECTED) {
    return this;
  }
  var promise = new this.constructor(INTERNAL);
  if (this.state !== PENDING) {
    var resolver = this.state === FULFILLED ? onFulfilled : onRejected;
    unwrap(promise, resolver, this.outcome);
  } else {
    this.queue.push(new QueueItem(promise, onFulfilled, onRejected));
  }

  return promise;
};
function QueueItem(promise, onFulfilled, onRejected) {
  this.promise = promise;
  if (typeof onFulfilled === 'function') {
    this.onFulfilled = onFulfilled;
    this.callFulfilled = this.otherCallFulfilled;
  }
  if (typeof onRejected === 'function') {
    this.onRejected = onRejected;
    this.callRejected = this.otherCallRejected;
  }
}
QueueItem.prototype.callFulfilled = function (value) {
  handlers.resolve(this.promise, value);
};
QueueItem.prototype.otherCallFulfilled = function (value) {
  unwrap(this.promise, this.onFulfilled, value);
};
QueueItem.prototype.callRejected = function (value) {
  handlers.reject(this.promise, value);
};
QueueItem.prototype.otherCallRejected = function (value) {
  unwrap(this.promise, this.onRejected, value);
};

function unwrap(promise, func, value) {
  immediate(function () {
    var returnValue;
    try {
      returnValue = func(value);
    } catch (e) {
      return handlers.reject(promise, e);
    }
    if (returnValue === promise) {
      handlers.reject(promise, new TypeError('Cannot resolve promise with itself'));
    } else {
      handlers.resolve(promise, returnValue);
    }
  });
}

handlers.resolve = function (self, value) {
  var result = tryCatch(getThen, value);
  if (result.status === 'error') {
    return handlers.reject(self, result.value);
  }
  var thenable = result.value;

  if (thenable) {
    safelyResolveThenable(self, thenable);
  } else {
    self.state = FULFILLED;
    self.outcome = value;
    var i = -1;
    var len = self.queue.length;
    while (++i < len) {
      self.queue[i].callFulfilled(value);
    }
  }
  return self;
};
handlers.reject = function (self, error) {
  self.state = REJECTED;
  self.outcome = error;
  var i = -1;
  var len = self.queue.length;
  while (++i < len) {
    self.queue[i].callRejected(error);
  }
  return self;
};

function getThen(obj) {
  // Make sure we only access the accessor once as required by the spec
  var then = obj && obj.then;
  if (obj && (typeof obj === 'object' || typeof obj === 'function') && typeof then === 'function') {
    return function appyThen() {
      then.apply(obj, arguments);
    };
  }
}

function safelyResolveThenable(self, thenable) {
  // Either fulfill, reject or reject with error
  var called = false;
  function onError(value) {
    if (called) {
      return;
    }
    called = true;
    handlers.reject(self, value);
  }

  function onSuccess(value) {
    if (called) {
      return;
    }
    called = true;
    handlers.resolve(self, value);
  }

  function tryToUnwrap() {
    thenable(onSuccess, onError);
  }

  var result = tryCatch(tryToUnwrap);
  if (result.status === 'error') {
    onError(result.value);
  }
}

function tryCatch(func, value) {
  var out = {};
  try {
    out.value = func(value);
    out.status = 'success';
  } catch (e) {
    out.status = 'error';
    out.value = e;
  }
  return out;
}

Promise.resolve = resolve;
function resolve(value) {
  if (value instanceof this) {
    return value;
  }
  return handlers.resolve(new this(INTERNAL), value);
}

Promise.reject = reject;
function reject(reason) {
  var promise = new this(INTERNAL);
  return handlers.reject(promise, reason);
}

Promise.all = all;
function all(iterable) {
  var self = this;
  if (Object.prototype.toString.call(iterable) !== '[object Array]') {
    return this.reject(new TypeError('must be an array'));
  }

  var len = iterable.length;
  var called = false;
  if (!len) {
    return this.resolve([]);
  }

  var values = new Array(len);
  var resolved = 0;
  var i = -1;
  var promise = new this(INTERNAL);

  while (++i < len) {
    allResolver(iterable[i], i);
  }
  return promise;
  function allResolver(value, i) {
    self.resolve(value).then(resolveFromAll, function (error) {
      if (!called) {
        called = true;
        handlers.reject(promise, error);
      }
    });
    function resolveFromAll(outValue) {
      values[i] = outValue;
      if (++resolved === len && !called) {
        called = true;
        handlers.resolve(promise, values);
      }
    }
  }
}

Promise.race = race;
function race(iterable) {
  var self = this;
  if (Object.prototype.toString.call(iterable) !== '[object Array]') {
    return this.reject(new TypeError('must be an array'));
  }

  var len = iterable.length;
  var called = false;
  if (!len) {
    return this.resolve([]);
  }

  var i = -1;
  var promise = new this(INTERNAL);

  while (++i < len) {
    resolver(iterable[i]);
  }
  return promise;
  function resolver(value) {
    self.resolve(value).then(function (response) {
      if (!called) {
        called = true;
        handlers.resolve(promise, response);
      }
    }, function (error) {
      if (!called) {
        called = true;
        handlers.reject(promise, error);
      }
    });
  }
}

},{"1":1}],3:[function(_dereq_,module,exports){
(function (global){
'use strict';
if (typeof global.Promise !== 'function') {
  global.Promise = _dereq_(2);
}

}).call(this,typeof __webpack_require__.g !== "undefined" ? __webpack_require__.g : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"2":2}],4:[function(_dereq_,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function getIDB() {
    /* global indexedDB,webkitIndexedDB,mozIndexedDB,OIndexedDB,msIndexedDB */
    try {
        if (typeof indexedDB !== 'undefined') {
            return indexedDB;
        }
        if (typeof webkitIndexedDB !== 'undefined') {
            return webkitIndexedDB;
        }
        if (typeof mozIndexedDB !== 'undefined') {
            return mozIndexedDB;
        }
        if (typeof OIndexedDB !== 'undefined') {
            return OIndexedDB;
        }
        if (typeof msIndexedDB !== 'undefined') {
            return msIndexedDB;
        }
    } catch (e) {
        return;
    }
}

var idb = getIDB();

function isIndexedDBValid() {
    try {
        // Initialize IndexedDB; fall back to vendor-prefixed versions
        // if needed.
        if (!idb || !idb.open) {
            return false;
        }
        // We mimic PouchDB here;
        //
        // We test for openDatabase because IE Mobile identifies itself
        // as Safari. Oh the lulz...
        var isSafari = typeof openDatabase !== 'undefined' && /(Safari|iPhone|iPad|iPod)/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent) && !/BlackBerry/.test(navigator.platform);

        var hasFetch = typeof fetch === 'function' && fetch.toString().indexOf('[native code') !== -1;

        // Safari <10.1 does not meet our requirements for IDB support
        // (see: https://github.com/pouchdb/pouchdb/issues/5572).
        // Safari 10.1 shipped with fetch, we can use that to detect it.
        // Note: this creates issues with `window.fetch` polyfills and
        // overrides; see:
        // https://github.com/localForage/localForage/issues/856
        return (!isSafari || hasFetch) && typeof indexedDB !== 'undefined' &&
        // some outdated implementations of IDB that appear on Samsung
        // and HTC Android devices <4.4 are missing IDBKeyRange
        // See: https://github.com/mozilla/localForage/issues/128
        // See: https://github.com/mozilla/localForage/issues/272
        typeof IDBKeyRange !== 'undefined';
    } catch (e) {
        return false;
    }
}

// Abstracts constructing a Blob object, so it also works in older
// browsers that don't support the native Blob constructor. (i.e.
// old QtWebKit versions, at least).
// Abstracts constructing a Blob object, so it also works in older
// browsers that don't support the native Blob constructor. (i.e.
// old QtWebKit versions, at least).
function createBlob(parts, properties) {
    /* global BlobBuilder,MSBlobBuilder,MozBlobBuilder,WebKitBlobBuilder */
    parts = parts || [];
    properties = properties || {};
    try {
        return new Blob(parts, properties);
    } catch (e) {
        if (e.name !== 'TypeError') {
            throw e;
        }
        var Builder = typeof BlobBuilder !== 'undefined' ? BlobBuilder : typeof MSBlobBuilder !== 'undefined' ? MSBlobBuilder : typeof MozBlobBuilder !== 'undefined' ? MozBlobBuilder : WebKitBlobBuilder;
        var builder = new Builder();
        for (var i = 0; i < parts.length; i += 1) {
            builder.append(parts[i]);
        }
        return builder.getBlob(properties.type);
    }
}

// This is CommonJS because lie is an external dependency, so Rollup
// can just ignore it.
if (typeof Promise === 'undefined') {
    // In the "nopromises" build this will just throw if you don't have
    // a global promise object, but it would throw anyway later.
    _dereq_(3);
}
var Promise$1 = Promise;

function executeCallback(promise, callback) {
    if (callback) {
        promise.then(function (result) {
            callback(null, result);
        }, function (error) {
            callback(error);
        });
    }
}

function executeTwoCallbacks(promise, callback, errorCallback) {
    if (typeof callback === 'function') {
        promise.then(callback);
    }

    if (typeof errorCallback === 'function') {
        promise["catch"](errorCallback);
    }
}

function normalizeKey(key) {
    // Cast the key to a string, as that's all we can set as a key.
    if (typeof key !== 'string') {
        console.warn(key + ' used as a key, but it is not a string.');
        key = String(key);
    }

    return key;
}

function getCallback() {
    if (arguments.length && typeof arguments[arguments.length - 1] === 'function') {
        return arguments[arguments.length - 1];
    }
}

// Some code originally from async_storage.js in
// [Gaia](https://github.com/mozilla-b2g/gaia).

var DETECT_BLOB_SUPPORT_STORE = 'local-forage-detect-blob-support';
var supportsBlobs = void 0;
var dbContexts = {};
var toString = Object.prototype.toString;

// Transaction Modes
var READ_ONLY = 'readonly';
var READ_WRITE = 'readwrite';

// Transform a binary string to an array buffer, because otherwise
// weird stuff happens when you try to work with the binary string directly.
// It is known.
// From http://stackoverflow.com/questions/14967647/ (continues on next line)
// encode-decode-image-with-base64-breaks-image (2013-04-21)
function _binStringToArrayBuffer(bin) {
    var length = bin.length;
    var buf = new ArrayBuffer(length);
    var arr = new Uint8Array(buf);
    for (var i = 0; i < length; i++) {
        arr[i] = bin.charCodeAt(i);
    }
    return buf;
}

//
// Blobs are not supported in all versions of IndexedDB, notably
// Chrome <37 and Android <5. In those versions, storing a blob will throw.
//
// Various other blob bugs exist in Chrome v37-42 (inclusive).
// Detecting them is expensive and confusing to users, and Chrome 37-42
// is at very low usage worldwide, so we do a hacky userAgent check instead.
//
// content-type bug: https://code.google.com/p/chromium/issues/detail?id=408120
// 404 bug: https://code.google.com/p/chromium/issues/detail?id=447916
// FileReader bug: https://code.google.com/p/chromium/issues/detail?id=447836
//
// Code borrowed from PouchDB. See:
// https://github.com/pouchdb/pouchdb/blob/master/packages/node_modules/pouchdb-adapter-idb/src/blobSupport.js
//
function _checkBlobSupportWithoutCaching(idb) {
    return new Promise$1(function (resolve) {
        var txn = idb.transaction(DETECT_BLOB_SUPPORT_STORE, READ_WRITE);
        var blob = createBlob(['']);
        txn.objectStore(DETECT_BLOB_SUPPORT_STORE).put(blob, 'key');

        txn.onabort = function (e) {
            // If the transaction aborts now its due to not being able to
            // write to the database, likely due to the disk being full
            e.preventDefault();
            e.stopPropagation();
            resolve(false);
        };

        txn.oncomplete = function () {
            var matchedChrome = navigator.userAgent.match(/Chrome\/(\d+)/);
            var matchedEdge = navigator.userAgent.match(/Edge\//);
            // MS Edge pretends to be Chrome 42:
            // https://msdn.microsoft.com/en-us/library/hh869301%28v=vs.85%29.aspx
            resolve(matchedEdge || !matchedChrome || parseInt(matchedChrome[1], 10) >= 43);
        };
    })["catch"](function () {
        return false; // error, so assume unsupported
    });
}

function _checkBlobSupport(idb) {
    if (typeof supportsBlobs === 'boolean') {
        return Promise$1.resolve(supportsBlobs);
    }
    return _checkBlobSupportWithoutCaching(idb).then(function (value) {
        supportsBlobs = value;
        return supportsBlobs;
    });
}

function _deferReadiness(dbInfo) {
    var dbContext = dbContexts[dbInfo.name];

    // Create a deferred object representing the current database operation.
    var deferredOperation = {};

    deferredOperation.promise = new Promise$1(function (resolve, reject) {
        deferredOperation.resolve = resolve;
        deferredOperation.reject = reject;
    });

    // Enqueue the deferred operation.
    dbContext.deferredOperations.push(deferredOperation);

    // Chain its promise to the database readiness.
    if (!dbContext.dbReady) {
        dbContext.dbReady = deferredOperation.promise;
    } else {
        dbContext.dbReady = dbContext.dbReady.then(function () {
            return deferredOperation.promise;
        });
    }
}

function _advanceReadiness(dbInfo) {
    var dbContext = dbContexts[dbInfo.name];

    // Dequeue a deferred operation.
    var deferredOperation = dbContext.deferredOperations.pop();

    // Resolve its promise (which is part of the database readiness
    // chain of promises).
    if (deferredOperation) {
        deferredOperation.resolve();
        return deferredOperation.promise;
    }
}

function _rejectReadiness(dbInfo, err) {
    var dbContext = dbContexts[dbInfo.name];

    // Dequeue a deferred operation.
    var deferredOperation = dbContext.deferredOperations.pop();

    // Reject its promise (which is part of the database readiness
    // chain of promises).
    if (deferredOperation) {
        deferredOperation.reject(err);
        return deferredOperation.promise;
    }
}

function _getConnection(dbInfo, upgradeNeeded) {
    return new Promise$1(function (resolve, reject) {
        dbContexts[dbInfo.name] = dbContexts[dbInfo.name] || createDbContext();

        if (dbInfo.db) {
            if (upgradeNeeded) {
                _deferReadiness(dbInfo);
                dbInfo.db.close();
            } else {
                return resolve(dbInfo.db);
            }
        }

        var dbArgs = [dbInfo.name];

        if (upgradeNeeded) {
            dbArgs.push(dbInfo.version);
        }

        var openreq = idb.open.apply(idb, dbArgs);

        if (upgradeNeeded) {
            openreq.onupgradeneeded = function (e) {
                var db = openreq.result;
                try {
                    db.createObjectStore(dbInfo.storeName);
                    if (e.oldVersion <= 1) {
                        // Added when support for blob shims was added
                        db.createObjectStore(DETECT_BLOB_SUPPORT_STORE);
                    }
                } catch (ex) {
                    if (ex.name === 'ConstraintError') {
                        console.warn('The database "' + dbInfo.name + '"' + ' has been upgraded from version ' + e.oldVersion + ' to version ' + e.newVersion + ', but the storage "' + dbInfo.storeName + '" already exists.');
                    } else {
                        throw ex;
                    }
                }
            };
        }

        openreq.onerror = function (e) {
            e.preventDefault();
            reject(openreq.error);
        };

        openreq.onsuccess = function () {
            var db = openreq.result;
            db.onversionchange = function (e) {
                // Triggered when the database is modified (e.g. adding an objectStore) or
                // deleted (even when initiated by other sessions in different tabs).
                // Closing the connection here prevents those operations from being blocked.
                // If the database is accessed again later by this instance, the connection
                // will be reopened or the database recreated as needed.
                e.target.close();
            };
            resolve(db);
            _advanceReadiness(dbInfo);
        };
    });
}

function _getOriginalConnection(dbInfo) {
    return _getConnection(dbInfo, false);
}

function _getUpgradedConnection(dbInfo) {
    return _getConnection(dbInfo, true);
}

function _isUpgradeNeeded(dbInfo, defaultVersion) {
    if (!dbInfo.db) {
        return true;
    }

    var isNewStore = !dbInfo.db.objectStoreNames.contains(dbInfo.storeName);
    var isDowngrade = dbInfo.version < dbInfo.db.version;
    var isUpgrade = dbInfo.version > dbInfo.db.version;

    if (isDowngrade) {
        // If the version is not the default one
        // then warn for impossible downgrade.
        if (dbInfo.version !== defaultVersion) {
            console.warn('The database "' + dbInfo.name + '"' + " can't be downgraded from version " + dbInfo.db.version + ' to version ' + dbInfo.version + '.');
        }
        // Align the versions to prevent errors.
        dbInfo.version = dbInfo.db.version;
    }

    if (isUpgrade || isNewStore) {
        // If the store is new then increment the version (if needed).
        // This will trigger an "upgradeneeded" event which is required
        // for creating a store.
        if (isNewStore) {
            var incVersion = dbInfo.db.version + 1;
            if (incVersion > dbInfo.version) {
                dbInfo.version = incVersion;
            }
        }

        return true;
    }

    return false;
}

// encode a blob for indexeddb engines that don't support blobs
function _encodeBlob(blob) {
    return new Promise$1(function (resolve, reject) {
        var reader = new FileReader();
        reader.onerror = reject;
        reader.onloadend = function (e) {
            var base64 = btoa(e.target.result || '');
            resolve({
                __local_forage_encoded_blob: true,
                data: base64,
                type: blob.type
            });
        };
        reader.readAsBinaryString(blob);
    });
}

// decode an encoded blob
function _decodeBlob(encodedBlob) {
    var arrayBuff = _binStringToArrayBuffer(atob(encodedBlob.data));
    return createBlob([arrayBuff], { type: encodedBlob.type });
}

// is this one of our fancy encoded blobs?
function _isEncodedBlob(value) {
    return value && value.__local_forage_encoded_blob;
}

// Specialize the default `ready()` function by making it dependent
// on the current database operations. Thus, the driver will be actually
// ready when it's been initialized (default) *and* there are no pending
// operations on the database (initiated by some other instances).
function _fullyReady(callback) {
    var self = this;

    var promise = self._initReady().then(function () {
        var dbContext = dbContexts[self._dbInfo.name];

        if (dbContext && dbContext.dbReady) {
            return dbContext.dbReady;
        }
    });

    executeTwoCallbacks(promise, callback, callback);
    return promise;
}

// Try to establish a new db connection to replace the
// current one which is broken (i.e. experiencing
// InvalidStateError while creating a transaction).
function _tryReconnect(dbInfo) {
    _deferReadiness(dbInfo);

    var dbContext = dbContexts[dbInfo.name];
    var forages = dbContext.forages;

    for (var i = 0; i < forages.length; i++) {
        var forage = forages[i];
        if (forage._dbInfo.db) {
            forage._dbInfo.db.close();
            forage._dbInfo.db = null;
        }
    }
    dbInfo.db = null;

    return _getOriginalConnection(dbInfo).then(function (db) {
        dbInfo.db = db;
        if (_isUpgradeNeeded(dbInfo)) {
            // Reopen the database for upgrading.
            return _getUpgradedConnection(dbInfo);
        }
        return db;
    }).then(function (db) {
        // store the latest db reference
        // in case the db was upgraded
        dbInfo.db = dbContext.db = db;
        for (var i = 0; i < forages.length; i++) {
            forages[i]._dbInfo.db = db;
        }
    })["catch"](function (err) {
        _rejectReadiness(dbInfo, err);
        throw err;
    });
}

// FF doesn't like Promises (micro-tasks) and IDDB store operations,
// so we have to do it with callbacks
function createTransaction(dbInfo, mode, callback, retries) {
    if (retries === undefined) {
        retries = 1;
    }

    try {
        var tx = dbInfo.db.transaction(dbInfo.storeName, mode);
        callback(null, tx);
    } catch (err) {
        if (retries > 0 && (!dbInfo.db || err.name === 'InvalidStateError' || err.name === 'NotFoundError')) {
            return Promise$1.resolve().then(function () {
                if (!dbInfo.db || err.name === 'NotFoundError' && !dbInfo.db.objectStoreNames.contains(dbInfo.storeName) && dbInfo.version <= dbInfo.db.version) {
                    // increase the db version, to create the new ObjectStore
                    if (dbInfo.db) {
                        dbInfo.version = dbInfo.db.version + 1;
                    }
                    // Reopen the database for upgrading.
                    return _getUpgradedConnection(dbInfo);
                }
            }).then(function () {
                return _tryReconnect(dbInfo).then(function () {
                    createTransaction(dbInfo, mode, callback, retries - 1);
                });
            })["catch"](callback);
        }

        callback(err);
    }
}

function createDbContext() {
    return {
        // Running localForages sharing a database.
        forages: [],
        // Shared database.
        db: null,
        // Database readiness (promise).
        dbReady: null,
        // Deferred operations on the database.
        deferredOperations: []
    };
}

// Open the IndexedDB database (automatically creates one if one didn't
// previously exist), using any options set in the config.
function _initStorage(options) {
    var self = this;
    var dbInfo = {
        db: null
    };

    if (options) {
        for (var i in options) {
            dbInfo[i] = options[i];
        }
    }

    // Get the current context of the database;
    var dbContext = dbContexts[dbInfo.name];

    // ...or create a new context.
    if (!dbContext) {
        dbContext = createDbContext();
        // Register the new context in the global container.
        dbContexts[dbInfo.name] = dbContext;
    }

    // Register itself as a running localForage in the current context.
    dbContext.forages.push(self);

    // Replace the default `ready()` function with the specialized one.
    if (!self._initReady) {
        self._initReady = self.ready;
        self.ready = _fullyReady;
    }

    // Create an array of initialization states of the related localForages.
    var initPromises = [];

    function ignoreErrors() {
        // Don't handle errors here,
        // just makes sure related localForages aren't pending.
        return Promise$1.resolve();
    }

    for (var j = 0; j < dbContext.forages.length; j++) {
        var forage = dbContext.forages[j];
        if (forage !== self) {
            // Don't wait for itself...
            initPromises.push(forage._initReady()["catch"](ignoreErrors));
        }
    }

    // Take a snapshot of the related localForages.
    var forages = dbContext.forages.slice(0);

    // Initialize the connection process only when
    // all the related localForages aren't pending.
    return Promise$1.all(initPromises).then(function () {
        dbInfo.db = dbContext.db;
        // Get the connection or open a new one without upgrade.
        return _getOriginalConnection(dbInfo);
    }).then(function (db) {
        dbInfo.db = db;
        if (_isUpgradeNeeded(dbInfo, self._defaultConfig.version)) {
            // Reopen the database for upgrading.
            return _getUpgradedConnection(dbInfo);
        }
        return db;
    }).then(function (db) {
        dbInfo.db = dbContext.db = db;
        self._dbInfo = dbInfo;
        // Share the final connection amongst related localForages.
        for (var k = 0; k < forages.length; k++) {
            var forage = forages[k];
            if (forage !== self) {
                // Self is already up-to-date.
                forage._dbInfo.db = dbInfo.db;
                forage._dbInfo.version = dbInfo.version;
            }
        }
    });
}

function getItem(key, callback) {
    var self = this;

    key = normalizeKey(key);

    var promise = new Promise$1(function (resolve, reject) {
        self.ready().then(function () {
            createTransaction(self._dbInfo, READ_ONLY, function (err, transaction) {
                if (err) {
                    return reject(err);
                }

                try {
                    var store = transaction.objectStore(self._dbInfo.storeName);
                    var req = store.get(key);

                    req.onsuccess = function () {
                        var value = req.result;
                        if (value === undefined) {
                            value = null;
                        }
                        if (_isEncodedBlob(value)) {
                            value = _decodeBlob(value);
                        }
                        resolve(value);
                    };

                    req.onerror = function () {
                        reject(req.error);
                    };
                } catch (e) {
                    reject(e);
                }
            });
        })["catch"](reject);
    });

    executeCallback(promise, callback);
    return promise;
}

// Iterate over all items stored in database.
function iterate(iterator, callback) {
    var self = this;

    var promise = new Promise$1(function (resolve, reject) {
        self.ready().then(function () {
            createTransaction(self._dbInfo, READ_ONLY, function (err, transaction) {
                if (err) {
                    return reject(err);
                }

                try {
                    var store = transaction.objectStore(self._dbInfo.storeName);
                    var req = store.openCursor();
                    var iterationNumber = 1;

                    req.onsuccess = function () {
                        var cursor = req.result;

                        if (cursor) {
                            var value = cursor.value;
                            if (_isEncodedBlob(value)) {
                                value = _decodeBlob(value);
                            }
                            var result = iterator(value, cursor.key, iterationNumber++);

                            // when the iterator callback returns any
                            // (non-`undefined`) value, then we stop
                            // the iteration immediately
                            if (result !== void 0) {
                                resolve(result);
                            } else {
                                cursor["continue"]();
                            }
                        } else {
                            resolve();
                        }
                    };

                    req.onerror = function () {
                        reject(req.error);
                    };
                } catch (e) {
                    reject(e);
                }
            });
        })["catch"](reject);
    });

    executeCallback(promise, callback);

    return promise;
}

function setItem(key, value, callback) {
    var self = this;

    key = normalizeKey(key);

    var promise = new Promise$1(function (resolve, reject) {
        var dbInfo;
        self.ready().then(function () {
            dbInfo = self._dbInfo;
            if (toString.call(value) === '[object Blob]') {
                return _checkBlobSupport(dbInfo.db).then(function (blobSupport) {
                    if (blobSupport) {
                        return value;
                    }
                    return _encodeBlob(value);
                });
            }
            return value;
        }).then(function (value) {
            createTransaction(self._dbInfo, READ_WRITE, function (err, transaction) {
                if (err) {
                    return reject(err);
                }

                try {
                    var store = transaction.objectStore(self._dbInfo.storeName);

                    // The reason we don't _save_ null is because IE 10 does
                    // not support saving the `null` type in IndexedDB. How
                    // ironic, given the bug below!
                    // See: https://github.com/mozilla/localForage/issues/161
                    if (value === null) {
                        value = undefined;
                    }

                    var req = store.put(value, key);

                    transaction.oncomplete = function () {
                        // Cast to undefined so the value passed to
                        // callback/promise is the same as what one would get out
                        // of `getItem()` later. This leads to some weirdness
                        // (setItem('foo', undefined) will return `null`), but
                        // it's not my fault localStorage is our baseline and that
                        // it's weird.
                        if (value === undefined) {
                            value = null;
                        }

                        resolve(value);
                    };
                    transaction.onabort = transaction.onerror = function () {
                        var err = req.error ? req.error : req.transaction.error;
                        reject(err);
                    };
                } catch (e) {
                    reject(e);
                }
            });
        })["catch"](reject);
    });

    executeCallback(promise, callback);
    return promise;
}

function removeItem(key, callback) {
    var self = this;

    key = normalizeKey(key);

    var promise = new Promise$1(function (resolve, reject) {
        self.ready().then(function () {
            createTransaction(self._dbInfo, READ_WRITE, function (err, transaction) {
                if (err) {
                    return reject(err);
                }

                try {
                    var store = transaction.objectStore(self._dbInfo.storeName);
                    // We use a Grunt task to make this safe for IE and some
                    // versions of Android (including those used by Cordova).
                    // Normally IE won't like `.delete()` and will insist on
                    // using `['delete']()`, but we have a build step that
                    // fixes this for us now.
                    var req = store["delete"](key);
                    transaction.oncomplete = function () {
                        resolve();
                    };

                    transaction.onerror = function () {
                        reject(req.error);
                    };

                    // The request will be also be aborted if we've exceeded our storage
                    // space.
                    transaction.onabort = function () {
                        var err = req.error ? req.error : req.transaction.error;
                        reject(err);
                    };
                } catch (e) {
                    reject(e);
                }
            });
        })["catch"](reject);
    });

    executeCallback(promise, callback);
    return promise;
}

function clear(callback) {
    var self = this;

    var promise = new Promise$1(function (resolve, reject) {
        self.ready().then(function () {
            createTransaction(self._dbInfo, READ_WRITE, function (err, transaction) {
                if (err) {
                    return reject(err);
                }

                try {
                    var store = transaction.objectStore(self._dbInfo.storeName);
                    var req = store.clear();

                    transaction.oncomplete = function () {
                        resolve();
                    };

                    transaction.onabort = transaction.onerror = function () {
                        var err = req.error ? req.error : req.transaction.error;
                        reject(err);
                    };
                } catch (e) {
                    reject(e);
                }
            });
        })["catch"](reject);
    });

    executeCallback(promise, callback);
    return promise;
}

function length(callback) {
    var self = this;

    var promise = new Promise$1(function (resolve, reject) {
        self.ready().then(function () {
            createTransaction(self._dbInfo, READ_ONLY, function (err, transaction) {
                if (err) {
                    return reject(err);
                }

                try {
                    var store = transaction.objectStore(self._dbInfo.storeName);
                    var req = store.count();

                    req.onsuccess = function () {
                        resolve(req.result);
                    };

                    req.onerror = function () {
                        reject(req.error);
                    };
                } catch (e) {
                    reject(e);
                }
            });
        })["catch"](reject);
    });

    executeCallback(promise, callback);
    return promise;
}

function key(n, callback) {
    var self = this;

    var promise = new Promise$1(function (resolve, reject) {
        if (n < 0) {
            resolve(null);

            return;
        }

        self.ready().then(function () {
            createTransaction(self._dbInfo, READ_ONLY, function (err, transaction) {
                if (err) {
                    return reject(err);
                }

                try {
                    var store = transaction.objectStore(self._dbInfo.storeName);
                    var advanced = false;
                    var req = store.openKeyCursor();

                    req.onsuccess = function () {
                        var cursor = req.result;
                        if (!cursor) {
                            // this means there weren't enough keys
                            resolve(null);

                            return;
                        }

                        if (n === 0) {
                            // We have the first key, return it if that's what they
                            // wanted.
                            resolve(cursor.key);
                        } else {
                            if (!advanced) {
                                // Otherwise, ask the cursor to skip ahead n
                                // records.
                                advanced = true;
                                cursor.advance(n);
                            } else {
                                // When we get here, we've got the nth key.
                                resolve(cursor.key);
                            }
                        }
                    };

                    req.onerror = function () {
                        reject(req.error);
                    };
                } catch (e) {
                    reject(e);
                }
            });
        })["catch"](reject);
    });

    executeCallback(promise, callback);
    return promise;
}

function keys(callback) {
    var self = this;

    var promise = new Promise$1(function (resolve, reject) {
        self.ready().then(function () {
            createTransaction(self._dbInfo, READ_ONLY, function (err, transaction) {
                if (err) {
                    return reject(err);
                }

                try {
                    var store = transaction.objectStore(self._dbInfo.storeName);
                    var req = store.openKeyCursor();
                    var keys = [];

                    req.onsuccess = function () {
                        var cursor = req.result;

                        if (!cursor) {
                            resolve(keys);
                            return;
                        }

                        keys.push(cursor.key);
                        cursor["continue"]();
                    };

                    req.onerror = function () {
                        reject(req.error);
                    };
                } catch (e) {
                    reject(e);
                }
            });
        })["catch"](reject);
    });

    executeCallback(promise, callback);
    return promise;
}

function dropInstance(options, callback) {
    callback = getCallback.apply(this, arguments);

    var currentConfig = this.config();
    options = typeof options !== 'function' && options || {};
    if (!options.name) {
        options.name = options.name || currentConfig.name;
        options.storeName = options.storeName || currentConfig.storeName;
    }

    var self = this;
    var promise;
    if (!options.name) {
        promise = Promise$1.reject('Invalid arguments');
    } else {
        var isCurrentDb = options.name === currentConfig.name && self._dbInfo.db;

        var dbPromise = isCurrentDb ? Promise$1.resolve(self._dbInfo.db) : _getOriginalConnection(options).then(function (db) {
            var dbContext = dbContexts[options.name];
            var forages = dbContext.forages;
            dbContext.db = db;
            for (var i = 0; i < forages.length; i++) {
                forages[i]._dbInfo.db = db;
            }
            return db;
        });

        if (!options.storeName) {
            promise = dbPromise.then(function (db) {
                _deferReadiness(options);

                var dbContext = dbContexts[options.name];
                var forages = dbContext.forages;

                db.close();
                for (var i = 0; i < forages.length; i++) {
                    var forage = forages[i];
                    forage._dbInfo.db = null;
                }

                var dropDBPromise = new Promise$1(function (resolve, reject) {
                    var req = idb.deleteDatabase(options.name);

                    req.onerror = function () {
                        var db = req.result;
                        if (db) {
                            db.close();
                        }
                        reject(req.error);
                    };

                    req.onblocked = function () {
                        // Closing all open connections in onversionchange handler should prevent this situation, but if
                        // we do get here, it just means the request remains pending - eventually it will succeed or error
                        console.warn('dropInstance blocked for database "' + options.name + '" until all open connections are closed');
                    };

                    req.onsuccess = function () {
                        var db = req.result;
                        if (db) {
                            db.close();
                        }
                        resolve(db);
                    };
                });

                return dropDBPromise.then(function (db) {
                    dbContext.db = db;
                    for (var i = 0; i < forages.length; i++) {
                        var _forage = forages[i];
                        _advanceReadiness(_forage._dbInfo);
                    }
                })["catch"](function (err) {
                    (_rejectReadiness(options, err) || Promise$1.resolve())["catch"](function () {});
                    throw err;
                });
            });
        } else {
            promise = dbPromise.then(function (db) {
                if (!db.objectStoreNames.contains(options.storeName)) {
                    return;
                }

                var newVersion = db.version + 1;

                _deferReadiness(options);

                var dbContext = dbContexts[options.name];
                var forages = dbContext.forages;

                db.close();
                for (var i = 0; i < forages.length; i++) {
                    var forage = forages[i];
                    forage._dbInfo.db = null;
                    forage._dbInfo.version = newVersion;
                }

                var dropObjectPromise = new Promise$1(function (resolve, reject) {
                    var req = idb.open(options.name, newVersion);

                    req.onerror = function (err) {
                        var db = req.result;
                        db.close();
                        reject(err);
                    };

                    req.onupgradeneeded = function () {
                        var db = req.result;
                        db.deleteObjectStore(options.storeName);
                    };

                    req.onsuccess = function () {
                        var db = req.result;
                        db.close();
                        resolve(db);
                    };
                });

                return dropObjectPromise.then(function (db) {
                    dbContext.db = db;
                    for (var j = 0; j < forages.length; j++) {
                        var _forage2 = forages[j];
                        _forage2._dbInfo.db = db;
                        _advanceReadiness(_forage2._dbInfo);
                    }
                })["catch"](function (err) {
                    (_rejectReadiness(options, err) || Promise$1.resolve())["catch"](function () {});
                    throw err;
                });
            });
        }
    }

    executeCallback(promise, callback);
    return promise;
}

var asyncStorage = {
    _driver: 'asyncStorage',
    _initStorage: _initStorage,
    _support: isIndexedDBValid(),
    iterate: iterate,
    getItem: getItem,
    setItem: setItem,
    removeItem: removeItem,
    clear: clear,
    length: length,
    key: key,
    keys: keys,
    dropInstance: dropInstance
};

function isWebSQLValid() {
    return typeof openDatabase === 'function';
}

// Sadly, the best way to save binary data in WebSQL/localStorage is serializing
// it to Base64, so this is how we store it to prevent very strange errors with less
// verbose ways of binary <-> string data storage.
var BASE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

var BLOB_TYPE_PREFIX = '~~local_forage_type~';
var BLOB_TYPE_PREFIX_REGEX = /^~~local_forage_type~([^~]+)~/;

var SERIALIZED_MARKER = '__lfsc__:';
var SERIALIZED_MARKER_LENGTH = SERIALIZED_MARKER.length;

// OMG the serializations!
var TYPE_ARRAYBUFFER = 'arbf';
var TYPE_BLOB = 'blob';
var TYPE_INT8ARRAY = 'si08';
var TYPE_UINT8ARRAY = 'ui08';
var TYPE_UINT8CLAMPEDARRAY = 'uic8';
var TYPE_INT16ARRAY = 'si16';
var TYPE_INT32ARRAY = 'si32';
var TYPE_UINT16ARRAY = 'ur16';
var TYPE_UINT32ARRAY = 'ui32';
var TYPE_FLOAT32ARRAY = 'fl32';
var TYPE_FLOAT64ARRAY = 'fl64';
var TYPE_SERIALIZED_MARKER_LENGTH = SERIALIZED_MARKER_LENGTH + TYPE_ARRAYBUFFER.length;

var toString$1 = Object.prototype.toString;

function stringToBuffer(serializedString) {
    // Fill the string into a ArrayBuffer.
    var bufferLength = serializedString.length * 0.75;
    var len = serializedString.length;
    var i;
    var p = 0;
    var encoded1, encoded2, encoded3, encoded4;

    if (serializedString[serializedString.length - 1] === '=') {
        bufferLength--;
        if (serializedString[serializedString.length - 2] === '=') {
            bufferLength--;
        }
    }

    var buffer = new ArrayBuffer(bufferLength);
    var bytes = new Uint8Array(buffer);

    for (i = 0; i < len; i += 4) {
        encoded1 = BASE_CHARS.indexOf(serializedString[i]);
        encoded2 = BASE_CHARS.indexOf(serializedString[i + 1]);
        encoded3 = BASE_CHARS.indexOf(serializedString[i + 2]);
        encoded4 = BASE_CHARS.indexOf(serializedString[i + 3]);

        /*jslint bitwise: true */
        bytes[p++] = encoded1 << 2 | encoded2 >> 4;
        bytes[p++] = (encoded2 & 15) << 4 | encoded3 >> 2;
        bytes[p++] = (encoded3 & 3) << 6 | encoded4 & 63;
    }
    return buffer;
}

// Converts a buffer to a string to store, serialized, in the backend
// storage library.
function bufferToString(buffer) {
    // base64-arraybuffer
    var bytes = new Uint8Array(buffer);
    var base64String = '';
    var i;

    for (i = 0; i < bytes.length; i += 3) {
        /*jslint bitwise: true */
        base64String += BASE_CHARS[bytes[i] >> 2];
        base64String += BASE_CHARS[(bytes[i] & 3) << 4 | bytes[i + 1] >> 4];
        base64String += BASE_CHARS[(bytes[i + 1] & 15) << 2 | bytes[i + 2] >> 6];
        base64String += BASE_CHARS[bytes[i + 2] & 63];
    }

    if (bytes.length % 3 === 2) {
        base64String = base64String.substring(0, base64String.length - 1) + '=';
    } else if (bytes.length % 3 === 1) {
        base64String = base64String.substring(0, base64String.length - 2) + '==';
    }

    return base64String;
}

// Serialize a value, afterwards executing a callback (which usually
// instructs the `setItem()` callback/promise to be executed). This is how
// we store binary data with localStorage.
function serialize(value, callback) {
    var valueType = '';
    if (value) {
        valueType = toString$1.call(value);
    }

    // Cannot use `value instanceof ArrayBuffer` or such here, as these
    // checks fail when running the tests using casper.js...
    //
    // TODO: See why those tests fail and use a better solution.
    if (value && (valueType === '[object ArrayBuffer]' || value.buffer && toString$1.call(value.buffer) === '[object ArrayBuffer]')) {
        // Convert binary arrays to a string and prefix the string with
        // a special marker.
        var buffer;
        var marker = SERIALIZED_MARKER;

        if (value instanceof ArrayBuffer) {
            buffer = value;
            marker += TYPE_ARRAYBUFFER;
        } else {
            buffer = value.buffer;

            if (valueType === '[object Int8Array]') {
                marker += TYPE_INT8ARRAY;
            } else if (valueType === '[object Uint8Array]') {
                marker += TYPE_UINT8ARRAY;
            } else if (valueType === '[object Uint8ClampedArray]') {
                marker += TYPE_UINT8CLAMPEDARRAY;
            } else if (valueType === '[object Int16Array]') {
                marker += TYPE_INT16ARRAY;
            } else if (valueType === '[object Uint16Array]') {
                marker += TYPE_UINT16ARRAY;
            } else if (valueType === '[object Int32Array]') {
                marker += TYPE_INT32ARRAY;
            } else if (valueType === '[object Uint32Array]') {
                marker += TYPE_UINT32ARRAY;
            } else if (valueType === '[object Float32Array]') {
                marker += TYPE_FLOAT32ARRAY;
            } else if (valueType === '[object Float64Array]') {
                marker += TYPE_FLOAT64ARRAY;
            } else {
                callback(new Error('Failed to get type for BinaryArray'));
            }
        }

        callback(marker + bufferToString(buffer));
    } else if (valueType === '[object Blob]') {
        // Conver the blob to a binaryArray and then to a string.
        var fileReader = new FileReader();

        fileReader.onload = function () {
            // Backwards-compatible prefix for the blob type.
            var str = BLOB_TYPE_PREFIX + value.type + '~' + bufferToString(this.result);

            callback(SERIALIZED_MARKER + TYPE_BLOB + str);
        };

        fileReader.readAsArrayBuffer(value);
    } else {
        try {
            callback(JSON.stringify(value));
        } catch (e) {
            console.error("Couldn't convert value into a JSON string: ", value);

            callback(null, e);
        }
    }
}

// Deserialize data we've inserted into a value column/field. We place
// special markers into our strings to mark them as encoded; this isn't
// as nice as a meta field, but it's the only sane thing we can do whilst
// keeping localStorage support intact.
//
// Oftentimes this will just deserialize JSON content, but if we have a
// special marker (SERIALIZED_MARKER, defined above), we will extract
// some kind of arraybuffer/binary data/typed array out of the string.
function deserialize(value) {
    // If we haven't marked this string as being specially serialized (i.e.
    // something other than serialized JSON), we can just return it and be
    // done with it.
    if (value.substring(0, SERIALIZED_MARKER_LENGTH) !== SERIALIZED_MARKER) {
        return JSON.parse(value);
    }

    // The following code deals with deserializing some kind of Blob or
    // TypedArray. First we separate out the type of data we're dealing
    // with from the data itself.
    var serializedString = value.substring(TYPE_SERIALIZED_MARKER_LENGTH);
    var type = value.substring(SERIALIZED_MARKER_LENGTH, TYPE_SERIALIZED_MARKER_LENGTH);

    var blobType;
    // Backwards-compatible blob type serialization strategy.
    // DBs created with older versions of localForage will simply not have the blob type.
    if (type === TYPE_BLOB && BLOB_TYPE_PREFIX_REGEX.test(serializedString)) {
        var matcher = serializedString.match(BLOB_TYPE_PREFIX_REGEX);
        blobType = matcher[1];
        serializedString = serializedString.substring(matcher[0].length);
    }
    var buffer = stringToBuffer(serializedString);

    // Return the right type based on the code/type set during
    // serialization.
    switch (type) {
        case TYPE_ARRAYBUFFER:
            return buffer;
        case TYPE_BLOB:
            return createBlob([buffer], { type: blobType });
        case TYPE_INT8ARRAY:
            return new Int8Array(buffer);
        case TYPE_UINT8ARRAY:
            return new Uint8Array(buffer);
        case TYPE_UINT8CLAMPEDARRAY:
            return new Uint8ClampedArray(buffer);
        case TYPE_INT16ARRAY:
            return new Int16Array(buffer);
        case TYPE_UINT16ARRAY:
            return new Uint16Array(buffer);
        case TYPE_INT32ARRAY:
            return new Int32Array(buffer);
        case TYPE_UINT32ARRAY:
            return new Uint32Array(buffer);
        case TYPE_FLOAT32ARRAY:
            return new Float32Array(buffer);
        case TYPE_FLOAT64ARRAY:
            return new Float64Array(buffer);
        default:
            throw new Error('Unkown type: ' + type);
    }
}

var localforageSerializer = {
    serialize: serialize,
    deserialize: deserialize,
    stringToBuffer: stringToBuffer,
    bufferToString: bufferToString
};

/*
 * Includes code from:
 *
 * base64-arraybuffer
 * https://github.com/niklasvh/base64-arraybuffer
 *
 * Copyright (c) 2012 Niklas von Hertzen
 * Licensed under the MIT license.
 */

function createDbTable(t, dbInfo, callback, errorCallback) {
    t.executeSql('CREATE TABLE IF NOT EXISTS ' + dbInfo.storeName + ' ' + '(id INTEGER PRIMARY KEY, key unique, value)', [], callback, errorCallback);
}

// Open the WebSQL database (automatically creates one if one didn't
// previously exist), using any options set in the config.
function _initStorage$1(options) {
    var self = this;
    var dbInfo = {
        db: null
    };

    if (options) {
        for (var i in options) {
            dbInfo[i] = typeof options[i] !== 'string' ? options[i].toString() : options[i];
        }
    }

    var dbInfoPromise = new Promise$1(function (resolve, reject) {
        // Open the database; the openDatabase API will automatically
        // create it for us if it doesn't exist.
        try {
            dbInfo.db = openDatabase(dbInfo.name, String(dbInfo.version), dbInfo.description, dbInfo.size);
        } catch (e) {
            return reject(e);
        }

        // Create our key/value table if it doesn't exist.
        dbInfo.db.transaction(function (t) {
            createDbTable(t, dbInfo, function () {
                self._dbInfo = dbInfo;
                resolve();
            }, function (t, error) {
                reject(error);
            });
        }, reject);
    });

    dbInfo.serializer = localforageSerializer;
    return dbInfoPromise;
}

function tryExecuteSql(t, dbInfo, sqlStatement, args, callback, errorCallback) {
    t.executeSql(sqlStatement, args, callback, function (t, error) {
        if (error.code === error.SYNTAX_ERR) {
            t.executeSql('SELECT name FROM sqlite_master ' + "WHERE type='table' AND name = ?", [dbInfo.storeName], function (t, results) {
                if (!results.rows.length) {
                    // if the table is missing (was deleted)
                    // re-create it table and retry
                    createDbTable(t, dbInfo, function () {
                        t.executeSql(sqlStatement, args, callback, errorCallback);
                    }, errorCallback);
                } else {
                    errorCallback(t, error);
                }
            }, errorCallback);
        } else {
            errorCallback(t, error);
        }
    }, errorCallback);
}

function getItem$1(key, callback) {
    var self = this;

    key = normalizeKey(key);

    var promise = new Promise$1(function (resolve, reject) {
        self.ready().then(function () {
            var dbInfo = self._dbInfo;
            dbInfo.db.transaction(function (t) {
                tryExecuteSql(t, dbInfo, 'SELECT * FROM ' + dbInfo.storeName + ' WHERE key = ? LIMIT 1', [key], function (t, results) {
                    var result = results.rows.length ? results.rows.item(0).value : null;

                    // Check to see if this is serialized content we need to
                    // unpack.
                    if (result) {
                        result = dbInfo.serializer.deserialize(result);
                    }

                    resolve(result);
                }, function (t, error) {
                    reject(error);
                });
            });
        })["catch"](reject);
    });

    executeCallback(promise, callback);
    return promise;
}

function iterate$1(iterator, callback) {
    var self = this;

    var promise = new Promise$1(function (resolve, reject) {
        self.ready().then(function () {
            var dbInfo = self._dbInfo;

            dbInfo.db.transaction(function (t) {
                tryExecuteSql(t, dbInfo, 'SELECT * FROM ' + dbInfo.storeName, [], function (t, results) {
                    var rows = results.rows;
                    var length = rows.length;

                    for (var i = 0; i < length; i++) {
                        var item = rows.item(i);
                        var result = item.value;

                        // Check to see if this is serialized content
                        // we need to unpack.
                        if (result) {
                            result = dbInfo.serializer.deserialize(result);
                        }

                        result = iterator(result, item.key, i + 1);

                        // void(0) prevents problems with redefinition
                        // of `undefined`.
                        if (result !== void 0) {
                            resolve(result);
                            return;
                        }
                    }

                    resolve();
                }, function (t, error) {
                    reject(error);
                });
            });
        })["catch"](reject);
    });

    executeCallback(promise, callback);
    return promise;
}

function _setItem(key, value, callback, retriesLeft) {
    var self = this;

    key = normalizeKey(key);

    var promise = new Promise$1(function (resolve, reject) {
        self.ready().then(function () {
            // The localStorage API doesn't return undefined values in an
            // "expected" way, so undefined is always cast to null in all
            // drivers. See: https://github.com/mozilla/localForage/pull/42
            if (value === undefined) {
                value = null;
            }

            // Save the original value to pass to the callback.
            var originalValue = value;

            var dbInfo = self._dbInfo;
            dbInfo.serializer.serialize(value, function (value, error) {
                if (error) {
                    reject(error);
                } else {
                    dbInfo.db.transaction(function (t) {
                        tryExecuteSql(t, dbInfo, 'INSERT OR REPLACE INTO ' + dbInfo.storeName + ' ' + '(key, value) VALUES (?, ?)', [key, value], function () {
                            resolve(originalValue);
                        }, function (t, error) {
                            reject(error);
                        });
                    }, function (sqlError) {
                        // The transaction failed; check
                        // to see if it's a quota error.
                        if (sqlError.code === sqlError.QUOTA_ERR) {
                            // We reject the callback outright for now, but
                            // it's worth trying to re-run the transaction.
                            // Even if the user accepts the prompt to use
                            // more storage on Safari, this error will
                            // be called.
                            //
                            // Try to re-run the transaction.
                            if (retriesLeft > 0) {
                                resolve(_setItem.apply(self, [key, originalValue, callback, retriesLeft - 1]));
                                return;
                            }
                            reject(sqlError);
                        }
                    });
                }
            });
        })["catch"](reject);
    });

    executeCallback(promise, callback);
    return promise;
}

function setItem$1(key, value, callback) {
    return _setItem.apply(this, [key, value, callback, 1]);
}

function removeItem$1(key, callback) {
    var self = this;

    key = normalizeKey(key);

    var promise = new Promise$1(function (resolve, reject) {
        self.ready().then(function () {
            var dbInfo = self._dbInfo;
            dbInfo.db.transaction(function (t) {
                tryExecuteSql(t, dbInfo, 'DELETE FROM ' + dbInfo.storeName + ' WHERE key = ?', [key], function () {
                    resolve();
                }, function (t, error) {
                    reject(error);
                });
            });
        })["catch"](reject);
    });

    executeCallback(promise, callback);
    return promise;
}

// Deletes every item in the table.
// TODO: Find out if this resets the AUTO_INCREMENT number.
function clear$1(callback) {
    var self = this;

    var promise = new Promise$1(function (resolve, reject) {
        self.ready().then(function () {
            var dbInfo = self._dbInfo;
            dbInfo.db.transaction(function (t) {
                tryExecuteSql(t, dbInfo, 'DELETE FROM ' + dbInfo.storeName, [], function () {
                    resolve();
                }, function (t, error) {
                    reject(error);
                });
            });
        })["catch"](reject);
    });

    executeCallback(promise, callback);
    return promise;
}

// Does a simple `COUNT(key)` to get the number of items stored in
// localForage.
function length$1(callback) {
    var self = this;

    var promise = new Promise$1(function (resolve, reject) {
        self.ready().then(function () {
            var dbInfo = self._dbInfo;
            dbInfo.db.transaction(function (t) {
                // Ahhh, SQL makes this one soooooo easy.
                tryExecuteSql(t, dbInfo, 'SELECT COUNT(key) as c FROM ' + dbInfo.storeName, [], function (t, results) {
                    var result = results.rows.item(0).c;
                    resolve(result);
                }, function (t, error) {
                    reject(error);
                });
            });
        })["catch"](reject);
    });

    executeCallback(promise, callback);
    return promise;
}

// Return the key located at key index X; essentially gets the key from a
// `WHERE id = ?`. This is the most efficient way I can think to implement
// this rarely-used (in my experience) part of the API, but it can seem
// inconsistent, because we do `INSERT OR REPLACE INTO` on `setItem()`, so
// the ID of each key will change every time it's updated. Perhaps a stored
// procedure for the `setItem()` SQL would solve this problem?
// TODO: Don't change ID on `setItem()`.
function key$1(n, callback) {
    var self = this;

    var promise = new Promise$1(function (resolve, reject) {
        self.ready().then(function () {
            var dbInfo = self._dbInfo;
            dbInfo.db.transaction(function (t) {
                tryExecuteSql(t, dbInfo, 'SELECT key FROM ' + dbInfo.storeName + ' WHERE id = ? LIMIT 1', [n + 1], function (t, results) {
                    var result = results.rows.length ? results.rows.item(0).key : null;
                    resolve(result);
                }, function (t, error) {
                    reject(error);
                });
            });
        })["catch"](reject);
    });

    executeCallback(promise, callback);
    return promise;
}

function keys$1(callback) {
    var self = this;

    var promise = new Promise$1(function (resolve, reject) {
        self.ready().then(function () {
            var dbInfo = self._dbInfo;
            dbInfo.db.transaction(function (t) {
                tryExecuteSql(t, dbInfo, 'SELECT key FROM ' + dbInfo.storeName, [], function (t, results) {
                    var keys = [];

                    for (var i = 0; i < results.rows.length; i++) {
                        keys.push(results.rows.item(i).key);
                    }

                    resolve(keys);
                }, function (t, error) {
                    reject(error);
                });
            });
        })["catch"](reject);
    });

    executeCallback(promise, callback);
    return promise;
}

// https://www.w3.org/TR/webdatabase/#databases
// > There is no way to enumerate or delete the databases available for an origin from this API.
function getAllStoreNames(db) {
    return new Promise$1(function (resolve, reject) {
        db.transaction(function (t) {
            t.executeSql('SELECT name FROM sqlite_master ' + "WHERE type='table' AND name <> '__WebKitDatabaseInfoTable__'", [], function (t, results) {
                var storeNames = [];

                for (var i = 0; i < results.rows.length; i++) {
                    storeNames.push(results.rows.item(i).name);
                }

                resolve({
                    db: db,
                    storeNames: storeNames
                });
            }, function (t, error) {
                reject(error);
            });
        }, function (sqlError) {
            reject(sqlError);
        });
    });
}

function dropInstance$1(options, callback) {
    callback = getCallback.apply(this, arguments);

    var currentConfig = this.config();
    options = typeof options !== 'function' && options || {};
    if (!options.name) {
        options.name = options.name || currentConfig.name;
        options.storeName = options.storeName || currentConfig.storeName;
    }

    var self = this;
    var promise;
    if (!options.name) {
        promise = Promise$1.reject('Invalid arguments');
    } else {
        promise = new Promise$1(function (resolve) {
            var db;
            if (options.name === currentConfig.name) {
                // use the db reference of the current instance
                db = self._dbInfo.db;
            } else {
                db = openDatabase(options.name, '', '', 0);
            }

            if (!options.storeName) {
                // drop all database tables
                resolve(getAllStoreNames(db));
            } else {
                resolve({
                    db: db,
                    storeNames: [options.storeName]
                });
            }
        }).then(function (operationInfo) {
            return new Promise$1(function (resolve, reject) {
                operationInfo.db.transaction(function (t) {
                    function dropTable(storeName) {
                        return new Promise$1(function (resolve, reject) {
                            t.executeSql('DROP TABLE IF EXISTS ' + storeName, [], function () {
                                resolve();
                            }, function (t, error) {
                                reject(error);
                            });
                        });
                    }

                    var operations = [];
                    for (var i = 0, len = operationInfo.storeNames.length; i < len; i++) {
                        operations.push(dropTable(operationInfo.storeNames[i]));
                    }

                    Promise$1.all(operations).then(function () {
                        resolve();
                    })["catch"](function (e) {
                        reject(e);
                    });
                }, function (sqlError) {
                    reject(sqlError);
                });
            });
        });
    }

    executeCallback(promise, callback);
    return promise;
}

var webSQLStorage = {
    _driver: 'webSQLStorage',
    _initStorage: _initStorage$1,
    _support: isWebSQLValid(),
    iterate: iterate$1,
    getItem: getItem$1,
    setItem: setItem$1,
    removeItem: removeItem$1,
    clear: clear$1,
    length: length$1,
    key: key$1,
    keys: keys$1,
    dropInstance: dropInstance$1
};

function isLocalStorageValid() {
    try {
        return typeof localStorage !== 'undefined' && 'setItem' in localStorage &&
        // in IE8 typeof localStorage.setItem === 'object'
        !!localStorage.setItem;
    } catch (e) {
        return false;
    }
}

function _getKeyPrefix(options, defaultConfig) {
    var keyPrefix = options.name + '/';

    if (options.storeName !== defaultConfig.storeName) {
        keyPrefix += options.storeName + '/';
    }
    return keyPrefix;
}

// Check if localStorage throws when saving an item
function checkIfLocalStorageThrows() {
    var localStorageTestKey = '_localforage_support_test';

    try {
        localStorage.setItem(localStorageTestKey, true);
        localStorage.removeItem(localStorageTestKey);

        return false;
    } catch (e) {
        return true;
    }
}

// Check if localStorage is usable and allows to save an item
// This method checks if localStorage is usable in Safari Private Browsing
// mode, or in any other case where the available quota for localStorage
// is 0 and there wasn't any saved items yet.
function _isLocalStorageUsable() {
    return !checkIfLocalStorageThrows() || localStorage.length > 0;
}

// Config the localStorage backend, using options set in the config.
function _initStorage$2(options) {
    var self = this;
    var dbInfo = {};
    if (options) {
        for (var i in options) {
            dbInfo[i] = options[i];
        }
    }

    dbInfo.keyPrefix = _getKeyPrefix(options, self._defaultConfig);

    if (!_isLocalStorageUsable()) {
        return Promise$1.reject();
    }

    self._dbInfo = dbInfo;
    dbInfo.serializer = localforageSerializer;

    return Promise$1.resolve();
}

// Remove all keys from the datastore, effectively destroying all data in
// the app's key/value store!
function clear$2(callback) {
    var self = this;
    var promise = self.ready().then(function () {
        var keyPrefix = self._dbInfo.keyPrefix;

        for (var i = localStorage.length - 1; i >= 0; i--) {
            var key = localStorage.key(i);

            if (key.indexOf(keyPrefix) === 0) {
                localStorage.removeItem(key);
            }
        }
    });

    executeCallback(promise, callback);
    return promise;
}

// Retrieve an item from the store. Unlike the original async_storage
// library in Gaia, we don't modify return values at all. If a key's value
// is `undefined`, we pass that value to the callback function.
function getItem$2(key, callback) {
    var self = this;

    key = normalizeKey(key);

    var promise = self.ready().then(function () {
        var dbInfo = self._dbInfo;
        var result = localStorage.getItem(dbInfo.keyPrefix + key);

        // If a result was found, parse it from the serialized
        // string into a JS object. If result isn't truthy, the key
        // is likely undefined and we'll pass it straight to the
        // callback.
        if (result) {
            result = dbInfo.serializer.deserialize(result);
        }

        return result;
    });

    executeCallback(promise, callback);
    return promise;
}

// Iterate over all items in the store.
function iterate$2(iterator, callback) {
    var self = this;

    var promise = self.ready().then(function () {
        var dbInfo = self._dbInfo;
        var keyPrefix = dbInfo.keyPrefix;
        var keyPrefixLength = keyPrefix.length;
        var length = localStorage.length;

        // We use a dedicated iterator instead of the `i` variable below
        // so other keys we fetch in localStorage aren't counted in
        // the `iterationNumber` argument passed to the `iterate()`
        // callback.
        //
        // See: github.com/mozilla/localForage/pull/435#discussion_r38061530
        var iterationNumber = 1;

        for (var i = 0; i < length; i++) {
            var key = localStorage.key(i);
            if (key.indexOf(keyPrefix) !== 0) {
                continue;
            }
            var value = localStorage.getItem(key);

            // If a result was found, parse it from the serialized
            // string into a JS object. If result isn't truthy, the
            // key is likely undefined and we'll pass it straight
            // to the iterator.
            if (value) {
                value = dbInfo.serializer.deserialize(value);
            }

            value = iterator(value, key.substring(keyPrefixLength), iterationNumber++);

            if (value !== void 0) {
                return value;
            }
        }
    });

    executeCallback(promise, callback);
    return promise;
}

// Same as localStorage's key() method, except takes a callback.
function key$2(n, callback) {
    var self = this;
    var promise = self.ready().then(function () {
        var dbInfo = self._dbInfo;
        var result;
        try {
            result = localStorage.key(n);
        } catch (error) {
            result = null;
        }

        // Remove the prefix from the key, if a key is found.
        if (result) {
            result = result.substring(dbInfo.keyPrefix.length);
        }

        return result;
    });

    executeCallback(promise, callback);
    return promise;
}

function keys$2(callback) {
    var self = this;
    var promise = self.ready().then(function () {
        var dbInfo = self._dbInfo;
        var length = localStorage.length;
        var keys = [];

        for (var i = 0; i < length; i++) {
            var itemKey = localStorage.key(i);
            if (itemKey.indexOf(dbInfo.keyPrefix) === 0) {
                keys.push(itemKey.substring(dbInfo.keyPrefix.length));
            }
        }

        return keys;
    });

    executeCallback(promise, callback);
    return promise;
}

// Supply the number of keys in the datastore to the callback function.
function length$2(callback) {
    var self = this;
    var promise = self.keys().then(function (keys) {
        return keys.length;
    });

    executeCallback(promise, callback);
    return promise;
}

// Remove an item from the store, nice and simple.
function removeItem$2(key, callback) {
    var self = this;

    key = normalizeKey(key);

    var promise = self.ready().then(function () {
        var dbInfo = self._dbInfo;
        localStorage.removeItem(dbInfo.keyPrefix + key);
    });

    executeCallback(promise, callback);
    return promise;
}

// Set a key's value and run an optional callback once the value is set.
// Unlike Gaia's implementation, the callback function is passed the value,
// in case you want to operate on that value only after you're sure it
// saved, or something like that.
function setItem$2(key, value, callback) {
    var self = this;

    key = normalizeKey(key);

    var promise = self.ready().then(function () {
        // Convert undefined values to null.
        // https://github.com/mozilla/localForage/pull/42
        if (value === undefined) {
            value = null;
        }

        // Save the original value to pass to the callback.
        var originalValue = value;

        return new Promise$1(function (resolve, reject) {
            var dbInfo = self._dbInfo;
            dbInfo.serializer.serialize(value, function (value, error) {
                if (error) {
                    reject(error);
                } else {
                    try {
                        localStorage.setItem(dbInfo.keyPrefix + key, value);
                        resolve(originalValue);
                    } catch (e) {
                        // localStorage capacity exceeded.
                        // TODO: Make this a specific error/event.
                        if (e.name === 'QuotaExceededError' || e.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
                            reject(e);
                        }
                        reject(e);
                    }
                }
            });
        });
    });

    executeCallback(promise, callback);
    return promise;
}

function dropInstance$2(options, callback) {
    callback = getCallback.apply(this, arguments);

    options = typeof options !== 'function' && options || {};
    if (!options.name) {
        var currentConfig = this.config();
        options.name = options.name || currentConfig.name;
        options.storeName = options.storeName || currentConfig.storeName;
    }

    var self = this;
    var promise;
    if (!options.name) {
        promise = Promise$1.reject('Invalid arguments');
    } else {
        promise = new Promise$1(function (resolve) {
            if (!options.storeName) {
                resolve(options.name + '/');
            } else {
                resolve(_getKeyPrefix(options, self._defaultConfig));
            }
        }).then(function (keyPrefix) {
            for (var i = localStorage.length - 1; i >= 0; i--) {
                var key = localStorage.key(i);

                if (key.indexOf(keyPrefix) === 0) {
                    localStorage.removeItem(key);
                }
            }
        });
    }

    executeCallback(promise, callback);
    return promise;
}

var localStorageWrapper = {
    _driver: 'localStorageWrapper',
    _initStorage: _initStorage$2,
    _support: isLocalStorageValid(),
    iterate: iterate$2,
    getItem: getItem$2,
    setItem: setItem$2,
    removeItem: removeItem$2,
    clear: clear$2,
    length: length$2,
    key: key$2,
    keys: keys$2,
    dropInstance: dropInstance$2
};

var sameValue = function sameValue(x, y) {
    return x === y || typeof x === 'number' && typeof y === 'number' && isNaN(x) && isNaN(y);
};

var includes = function includes(array, searchElement) {
    var len = array.length;
    var i = 0;
    while (i < len) {
        if (sameValue(array[i], searchElement)) {
            return true;
        }
        i++;
    }

    return false;
};

var isArray = Array.isArray || function (arg) {
    return Object.prototype.toString.call(arg) === '[object Array]';
};

// Drivers are stored here when `defineDriver()` is called.
// They are shared across all instances of localForage.
var DefinedDrivers = {};

var DriverSupport = {};

var DefaultDrivers = {
    INDEXEDDB: asyncStorage,
    WEBSQL: webSQLStorage,
    LOCALSTORAGE: localStorageWrapper
};

var DefaultDriverOrder = [DefaultDrivers.INDEXEDDB._driver, DefaultDrivers.WEBSQL._driver, DefaultDrivers.LOCALSTORAGE._driver];

var OptionalDriverMethods = ['dropInstance'];

var LibraryMethods = ['clear', 'getItem', 'iterate', 'key', 'keys', 'length', 'removeItem', 'setItem'].concat(OptionalDriverMethods);

var DefaultConfig = {
    description: '',
    driver: DefaultDriverOrder.slice(),
    name: 'localforage',
    // Default DB size is _JUST UNDER_ 5MB, as it's the highest size
    // we can use without a prompt.
    size: 4980736,
    storeName: 'keyvaluepairs',
    version: 1.0
};

function callWhenReady(localForageInstance, libraryMethod) {
    localForageInstance[libraryMethod] = function () {
        var _args = arguments;
        return localForageInstance.ready().then(function () {
            return localForageInstance[libraryMethod].apply(localForageInstance, _args);
        });
    };
}

function extend() {
    for (var i = 1; i < arguments.length; i++) {
        var arg = arguments[i];

        if (arg) {
            for (var _key in arg) {
                if (arg.hasOwnProperty(_key)) {
                    if (isArray(arg[_key])) {
                        arguments[0][_key] = arg[_key].slice();
                    } else {
                        arguments[0][_key] = arg[_key];
                    }
                }
            }
        }
    }

    return arguments[0];
}

var LocalForage = function () {
    function LocalForage(options) {
        _classCallCheck(this, LocalForage);

        for (var driverTypeKey in DefaultDrivers) {
            if (DefaultDrivers.hasOwnProperty(driverTypeKey)) {
                var driver = DefaultDrivers[driverTypeKey];
                var driverName = driver._driver;
                this[driverTypeKey] = driverName;

                if (!DefinedDrivers[driverName]) {
                    // we don't need to wait for the promise,
                    // since the default drivers can be defined
                    // in a blocking manner
                    this.defineDriver(driver);
                }
            }
        }

        this._defaultConfig = extend({}, DefaultConfig);
        this._config = extend({}, this._defaultConfig, options);
        this._driverSet = null;
        this._initDriver = null;
        this._ready = false;
        this._dbInfo = null;

        this._wrapLibraryMethodsWithReady();
        this.setDriver(this._config.driver)["catch"](function () {});
    }

    // Set any config values for localForage; can be called anytime before
    // the first API call (e.g. `getItem`, `setItem`).
    // We loop through options so we don't overwrite existing config
    // values.


    LocalForage.prototype.config = function config(options) {
        // If the options argument is an object, we use it to set values.
        // Otherwise, we return either a specified config value or all
        // config values.
        if ((typeof options === 'undefined' ? 'undefined' : _typeof(options)) === 'object') {
            // If localforage is ready and fully initialized, we can't set
            // any new configuration values. Instead, we return an error.
            if (this._ready) {
                return new Error("Can't call config() after localforage " + 'has been used.');
            }

            for (var i in options) {
                if (i === 'storeName') {
                    options[i] = options[i].replace(/\W/g, '_');
                }

                if (i === 'version' && typeof options[i] !== 'number') {
                    return new Error('Database version must be a number.');
                }

                this._config[i] = options[i];
            }

            // after all config options are set and
            // the driver option is used, try setting it
            if ('driver' in options && options.driver) {
                return this.setDriver(this._config.driver);
            }

            return true;
        } else if (typeof options === 'string') {
            return this._config[options];
        } else {
            return this._config;
        }
    };

    // Used to define a custom driver, shared across all instances of
    // localForage.


    LocalForage.prototype.defineDriver = function defineDriver(driverObject, callback, errorCallback) {
        var promise = new Promise$1(function (resolve, reject) {
            try {
                var driverName = driverObject._driver;
                var complianceError = new Error('Custom driver not compliant; see ' + 'https://mozilla.github.io/localForage/#definedriver');

                // A driver name should be defined and not overlap with the
                // library-defined, default drivers.
                if (!driverObject._driver) {
                    reject(complianceError);
                    return;
                }

                var driverMethods = LibraryMethods.concat('_initStorage');
                for (var i = 0, len = driverMethods.length; i < len; i++) {
                    var driverMethodName = driverMethods[i];

                    // when the property is there,
                    // it should be a method even when optional
                    var isRequired = !includes(OptionalDriverMethods, driverMethodName);
                    if ((isRequired || driverObject[driverMethodName]) && typeof driverObject[driverMethodName] !== 'function') {
                        reject(complianceError);
                        return;
                    }
                }

                var configureMissingMethods = function configureMissingMethods() {
                    var methodNotImplementedFactory = function methodNotImplementedFactory(methodName) {
                        return function () {
                            var error = new Error('Method ' + methodName + ' is not implemented by the current driver');
                            var promise = Promise$1.reject(error);
                            executeCallback(promise, arguments[arguments.length - 1]);
                            return promise;
                        };
                    };

                    for (var _i = 0, _len = OptionalDriverMethods.length; _i < _len; _i++) {
                        var optionalDriverMethod = OptionalDriverMethods[_i];
                        if (!driverObject[optionalDriverMethod]) {
                            driverObject[optionalDriverMethod] = methodNotImplementedFactory(optionalDriverMethod);
                        }
                    }
                };

                configureMissingMethods();

                var setDriverSupport = function setDriverSupport(support) {
                    if (DefinedDrivers[driverName]) {
                        console.info('Redefining LocalForage driver: ' + driverName);
                    }
                    DefinedDrivers[driverName] = driverObject;
                    DriverSupport[driverName] = support;
                    // don't use a then, so that we can define
                    // drivers that have simple _support methods
                    // in a blocking manner
                    resolve();
                };

                if ('_support' in driverObject) {
                    if (driverObject._support && typeof driverObject._support === 'function') {
                        driverObject._support().then(setDriverSupport, reject);
                    } else {
                        setDriverSupport(!!driverObject._support);
                    }
                } else {
                    setDriverSupport(true);
                }
            } catch (e) {
                reject(e);
            }
        });

        executeTwoCallbacks(promise, callback, errorCallback);
        return promise;
    };

    LocalForage.prototype.driver = function driver() {
        return this._driver || null;
    };

    LocalForage.prototype.getDriver = function getDriver(driverName, callback, errorCallback) {
        var getDriverPromise = DefinedDrivers[driverName] ? Promise$1.resolve(DefinedDrivers[driverName]) : Promise$1.reject(new Error('Driver not found.'));

        executeTwoCallbacks(getDriverPromise, callback, errorCallback);
        return getDriverPromise;
    };

    LocalForage.prototype.getSerializer = function getSerializer(callback) {
        var serializerPromise = Promise$1.resolve(localforageSerializer);
        executeTwoCallbacks(serializerPromise, callback);
        return serializerPromise;
    };

    LocalForage.prototype.ready = function ready(callback) {
        var self = this;

        var promise = self._driverSet.then(function () {
            if (self._ready === null) {
                self._ready = self._initDriver();
            }

            return self._ready;
        });

        executeTwoCallbacks(promise, callback, callback);
        return promise;
    };

    LocalForage.prototype.setDriver = function setDriver(drivers, callback, errorCallback) {
        var self = this;

        if (!isArray(drivers)) {
            drivers = [drivers];
        }

        var supportedDrivers = this._getSupportedDrivers(drivers);

        function setDriverToConfig() {
            self._config.driver = self.driver();
        }

        function extendSelfWithDriver(driver) {
            self._extend(driver);
            setDriverToConfig();

            self._ready = self._initStorage(self._config);
            return self._ready;
        }

        function initDriver(supportedDrivers) {
            return function () {
                var currentDriverIndex = 0;

                function driverPromiseLoop() {
                    while (currentDriverIndex < supportedDrivers.length) {
                        var driverName = supportedDrivers[currentDriverIndex];
                        currentDriverIndex++;

                        self._dbInfo = null;
                        self._ready = null;

                        return self.getDriver(driverName).then(extendSelfWithDriver)["catch"](driverPromiseLoop);
                    }

                    setDriverToConfig();
                    var error = new Error('No available storage method found.');
                    self._driverSet = Promise$1.reject(error);
                    return self._driverSet;
                }

                return driverPromiseLoop();
            };
        }

        // There might be a driver initialization in progress
        // so wait for it to finish in order to avoid a possible
        // race condition to set _dbInfo
        var oldDriverSetDone = this._driverSet !== null ? this._driverSet["catch"](function () {
            return Promise$1.resolve();
        }) : Promise$1.resolve();

        this._driverSet = oldDriverSetDone.then(function () {
            var driverName = supportedDrivers[0];
            self._dbInfo = null;
            self._ready = null;

            return self.getDriver(driverName).then(function (driver) {
                self._driver = driver._driver;
                setDriverToConfig();
                self._wrapLibraryMethodsWithReady();
                self._initDriver = initDriver(supportedDrivers);
            });
        })["catch"](function () {
            setDriverToConfig();
            var error = new Error('No available storage method found.');
            self._driverSet = Promise$1.reject(error);
            return self._driverSet;
        });

        executeTwoCallbacks(this._driverSet, callback, errorCallback);
        return this._driverSet;
    };

    LocalForage.prototype.supports = function supports(driverName) {
        return !!DriverSupport[driverName];
    };

    LocalForage.prototype._extend = function _extend(libraryMethodsAndProperties) {
        extend(this, libraryMethodsAndProperties);
    };

    LocalForage.prototype._getSupportedDrivers = function _getSupportedDrivers(drivers) {
        var supportedDrivers = [];
        for (var i = 0, len = drivers.length; i < len; i++) {
            var driverName = drivers[i];
            if (this.supports(driverName)) {
                supportedDrivers.push(driverName);
            }
        }
        return supportedDrivers;
    };

    LocalForage.prototype._wrapLibraryMethodsWithReady = function _wrapLibraryMethodsWithReady() {
        // Add a stub for each driver API method that delays the call to the
        // corresponding driver method until localForage is ready. These stubs
        // will be replaced by the driver methods as soon as the driver is
        // loaded, so there is no performance impact.
        for (var i = 0, len = LibraryMethods.length; i < len; i++) {
            callWhenReady(this, LibraryMethods[i]);
        }
    };

    LocalForage.prototype.createInstance = function createInstance(options) {
        return new LocalForage(options);
    };

    return LocalForage;
}();

// The actual localForage object that we expose as a module or via a
// global. It's extended by pulling in one of our other libraries.


var localforage_js = new LocalForage();

module.exports = localforage_js;

},{"3":3}]},{},[4])(4)
});


/***/ }),

/***/ 3349:
/***/ ((module) => {

module.exports = assert;

function assert(val, msg) {
  if (!val)
    throw new Error(msg || 'Assertion failed');
}

assert.equal = function assertEqual(l, r, msg) {
  if (l != r)
    throw new Error(msg || ('Assertion failed: ' + l + ' != ' + r));
};


/***/ }),

/***/ 7730:
/***/ ((module, __unused_webpack___webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony import */ var _shared_functions__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(7409);
/* harmony import */ var _shared_structs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5282);
/* harmony import */ var _shared_utils_storage_helpers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2295);
/* harmony import */ var _injectors_ui__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(4566);
/* harmony import */ var _shared_lib_security_clientSideCrypto__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(8182);
/* harmony import */ var _shared_lib_rpc_rpc__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(1747);
/* harmony import */ var _ethersproject_providers__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(2695);
/* harmony import */ var _watchDog_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(8289);





//import { v4 as uuidv4 } from 'uuid';


//new code



const KR_URL_PARAMS = new URLSearchParams(window?.location?.search);
const KR_DEBUG_PARAM = KR_URL_PARAMS.get('kr_debug');

sendLogToMain('injected.js loaded');

var KR_SETTINGS = {
  showInitLoader: null,
  simulate: false,
  notifications: null,
  licenseType: null,
};

var IS_BYPASS = false;
var IS_WEB3 = false;
var IS_WEB3_INIT = false;
var REJECT_TX = false;

var IS_SECURED_WEB3 = null;
var IS_SECURED_WEB3_INIT = null;

var PROCESSING = false;
var INIT_PROCESSING = false;

var POPUPISOPEN = false;
var BLOCK_REASON = false;

var DETECTED_CHAIN = null;
var SUSPICIOUS_FUNCTIONS = null;

var ActivatedProtection = false;
var completedSignatureScan = false;
var scanSignaturesTriggered = false;
var maliciousWeb3FunctionFound = false;
var detectDisabledRightClick_called = false;

var serveEtherIds = [];

var clientSideCrypto = {
  verify: async () => {
    return true;
  },
};

var VALUABLE_TX = false;
var initCalled = false; //remember if we already called initialScan

const REJECTION_MESSAGE = {
  message: 'Mint Defense rejected the interaction',
  code: 4001,
  data: [],
};

const DEFAULT_DOMAIN_CACHED_STATUS = {
  exists: null,
  reason: null,
  blocked: null,
  txWithFees: null,
};

var DOMAIN_CACHED_STATUS = DEFAULT_DOMAIN_CACHED_STATUS;
var DOMAIN_CACHED_STATUS_INIT = DEFAULT_DOMAIN_CACHED_STATUS;
var DISABLE_POSTMESSAGE_INTERCEPTION = false;

const HOSTNAME = window.location.hostname;

try {
  sessionStorage.setItem(
    'KR_DOMAIN_CACHED_STATUS',
    JSON.stringify({
      exists: null,
      blocked: null,
      blockReason: null,
      txWithFees: null,
    }),
  );
} catch (e) {
  sendLogToMain(e);
}

//sendLogToMain('checkWeb3SecurityStatus()')
// wait for 10 sec max (100 ms * 100 tries)
const excludedFromProtection = [
  'etherscan.io',
  'bscscan.com',
  'arbiscan.io',
  'polygonscan.com',
  'snowtrace.io',
  'ftmscan.com',
  'moonscan.io',
  'kerberus.com',
  'kerberus-web-new.pages.dev',
];

var excludedDomain;
try {
  excludedDomain = excludedFromProtection.some(
    (domain) => HOSTNAME === domain || HOSTNAME.endsWith('.' + domain),
  );
} catch (error) {
  console.log(error);
}

if (false) {}

const interceptedFunctions = [
  'eth_sendTransaction',
  'sendRawTransaction',
  'eth_sign',
  'eth_signTypedData',
  'eth_signTypedData_v1',
  'eth_signTypedData_v2',
  'eth_signTypedData_v3',
  'eth_signTypedData_v4',
];
const localInterceptedFunctions = [...interceptedFunctions].map((x) =>
  x.toLowerCase().trim(),
);

//Functions
async function getChainIdFromMetamask() {
  try {
    const provider = new _ethersproject_providers__WEBPACK_IMPORTED_MODULE_4__/* .Web3Provider */ .j(window.ethereum);
    const chainId = (await provider.getNetwork()).chainId;
    DETECTED_CHAIN = chainId;
    sendLogToMain('DETECTED CHAIN VIA WEB3', DETECTED_CHAIN);
    return chainId;
  } catch (error) {
    console.error(error);
    return DETECTED_CHAIN;
  }
}

async function interceptedPostMessage(
  thisTarget,
  thisArg,
  argumentsList,
  target,
  data,
) {
  if (!initCalled) {
    initialScan(3);
    initCalled = true;
  }
  //extract Metamask request from PostMessage
  let reqData = data.data;
  let dataArray = Array.isArray(reqData) ? reqData : [reqData];
  //let requestExecuted = false
  // Intercept necessary messages and remove them from dataArray
  for (let i = 0; i < dataArray.length; i++) {
    const MetamaskTx = dataArray[i];
    let { method = undefined, params = undefined } = MetamaskTx || {};

    //check if element even has a method, and if not, skip analysis
    if (!method) continue;

    //chainChanged
    if (target === 'metamask-inpage' && method?.includes('chainChanged')) {
      DETECTED_CHAIN = Number(params?.chainId ?? DETECTED_CHAIN);
      sendLogToMain('DETECTED CHAIN VIA POSTMESSAGE', DETECTED_CHAIN);
    }

    //prepare object to save in cached executed functions
    const localElementMethod = method.toLowerCase().trim();
    if (
      localElementMethod == 'personalsign' ||
      localInterceptedFunctions.includes(localElementMethod)
    ) {
      //sendLogToMain(`check: ${JSON.stringify(MetamaskTx)} in:`)
      //sendLogToMain(serveEtherIds)
      if (
        serveEtherIds.some(
          (obj) => obj.method === method && obj.params === params,
        )
      ) {
        dataArray = dataArray.filter((e) => e !== MetamaskTx);
        //sendLogToMain(`skipped: ${method}`)
        continue;
      } else {
        serveEtherIds.push({ method: method, params: params });
      }
    }

    //check if method should be scanned
    if (!localInterceptedFunctions.includes(localElementMethod)) continue;

    //in dev, log the found
    sendLogToMain('FOUND PostMessage Interaction!!!', MetamaskTx);

    if (DISABLE_POSTMESSAGE_INTERCEPTION) continue;

    //pre check status of site before even testing more
    if (IS_SECURED_WEB3 == false || checkRejectStatus())
      setWeb3SecurityStatus(false);

    //put into delay requests that comes until we finish analysis
    let maxTimeDelay = 0;
    while (!ActivatedProtection && maxTimeDelay < 5000) {
      await (0,_shared_functions__WEBPACK_IMPORTED_MODULE_5__/* .kr_delay */ .C)(100, 0);
      maxTimeDelay++;
    }

    //reject request if site is malicious
    if (await checkRejectStatusAsync())
      return await rejectUntilApproved(thisTarget, thisArg, argumentsList);

    if (
      (await scanTX([MetamaskTx], 'postMessage')) &&
      (await checkWeb3SecurityStatus(6))
    )
      continue;

    //couldn't approve, reject it
    return await rejectUntilApproved(thisTarget, thisArg, argumentsList);
  }

  /*
        if (dataArrayLength >= dataArray.length && !requestExecuted) {
          Reflect.apply(thisTarget, thisArg, argumentsList)
        }*/

  if (Array.isArray(reqData)) {
    // Update reqData
    argumentsList[0].data.data = dataArray;
  } else if (
    typeof argumentsList[0].data !== 'string' &&
    dataArray.length > 0
  ) {
    argumentsList[0].data.data = dataArray[0];
  }

  // Call the original function for not intercepted data
  if (dataArray.length > 0 || !Array.isArray(reqData)) {
    //alert(JSON.stringify(reqData.method))
    //sendLogToMain(serveEtherIds)
    passTransaction(thisTarget, thisArg, argumentsList);
    //Reflect.apply(thisTarget, thisArg, argumentsList)
  }
}

// Usage example, assuming 'window' is the object you want to proxy
// This should be tailored to where and how you're applying the proxy

function getCachedStatusFromSessionStorage(statusName) {
  const statusFromSessionStorage =
    sessionStorage.getItem(statusName) ||
    '{"exists":null,"blocked":null,"domain":null}';
  const parsedCachedStatus = JSON.parse(statusFromSessionStorage);
  //sendLogToMain(statusName)
  //sendLogToMain(statusFromSessionStorage)

  // If there isn't something to parse, or its an empty object, just return the default object that has the keys defined
  if (!parsedCachedStatus || !Object.keys(parsedCachedStatus)) {
    return DEFAULT_DOMAIN_CACHED_STATUS;
  }

  return parsedCachedStatus;
}

//check if contextMenuIsDisabled

function detectDisabledRightClick() {
  if (detectDisabledRightClick_called) return;
  detectDisabledRightClick_called = true;
  try {
    if (!window.oncontextmenu()) {
      maliciousWeb3FunctionFound = 'Disabled ContextMenu';
      BLOCK_REASON = 'Disabled ContextMenu';
      sendLogToMain(
        `Found a scam via a malicious signature ----> ${maliciousWeb3FunctionFound}`,
      );
      initScan('detectDisabledRightClick');
    }
    // eslint-disable-next-line no-empty
  } catch (e) {}
}

function isLegitFunction(func) {
  return _shared_structs__WEBPACK_IMPORTED_MODULE_0__/* .legitWindowFunctions */ .h3.includes(func) || _shared_structs__WEBPACK_IMPORTED_MODULE_0__/* .web3Functions */ .B5.includes(func);
}

async function scanForBadSignaturesInCode(signatures) {
  const allElementsIds = new Set();
  const allElementsClasses = new Set();
  const allPageFunctions = new Set(Object.keys(window));

  await Promise.all(
    Array.from(document.querySelectorAll('*[id]')).map(async (element) => {
      if (element.id !== '') {
        allElementsIds.add(element.id);
      }
      if (element.className !== '') {
        allElementsClasses.add(element.className);
      }
    }),
  );

  const suspiciousElementsToScan = new Set([
    ...allPageFunctions,
    ...allElementsIds,
    ...allElementsClasses,
  ]);

  const unknownFunctions = Array.from(suspiciousElementsToScan).filter(
    (func) => !isLegitFunction(func),
  );

  printAllSuspiciousFunctionsToConsole(unknownFunctions);

  if (signatures && signatures.db) {
    //console.log('signatures.db', signatures.db);

    await Promise.all(
      signatures.db.map(async (maliciousPattern) => {
        const matchingFunctionsCount = unknownFunctions.reduce(
          (count, functionName) =>
            count +
            (maliciousPattern.signatures.includes(functionName) ? 1 : 0),
          0,
        );

        if (matchingFunctionsCount >= maliciousPattern.minimumMatches) {
          maliciousWeb3FunctionFound = maliciousPattern.name;
          BLOCK_REASON = 'Malicious Signature Found';

          sendLogToMain(
            `Found a scam via a malicious signature ----> ${maliciousWeb3FunctionFound}`,
          );
          initScan('scanForBadSignaturesInCode');
          completedSignatureScan = true;
          return true;
        }
        completedSignatureScan = true;
        return false;
      }),
    );
  }
  completedSignatureScan = true;

  return maliciousWeb3FunctionFound;
}

function checkPU() {
  const descriptor = Object.getOwnPropertyDescriptor(window, 'ethereum');
  if (descriptor) {
    return !descriptor.configurable;
  }

  // If there's no descriptor, 'ethereum' is not defined on the window directly
  return false;
}

async function injectInterval() {
  //sendLogToMain('checkWeb3SecurityStatus()');
  if (excludedDomain) return;
  injectProtection();
  return;
}

var proxyInterval;
const swapDomain = ['app.uniswap.org', 'pancakeswap.finance'];
/* Inject protection by proxying window.ethereum object to custom function. */

/**
 * Clones window.ethereum using prototypal inheritance, excluding the 'send' method.
 */
function cloneEthereumWithPrototype(objectToClone) {
  try {
    const originalEthereum = objectToClone;

    // Create a clone that inherits from originalEthereum
    const clonedEthereum = Object.create(
      Object.getPrototypeOf(originalEthereum),
      Object.getOwnPropertyDescriptors(originalEthereum),
    );

    // Remove or override the 'send' property

    //delete clonedEthereum.send;
    //delete clonedEthereum.sendAsync;
    delete clonedEthereum.request;

    // Alternatively, set 'send' to undefined or provide a custom implementation
    /*
    try {
      Object.defineProperty(clonedEthereum, 'send', {
        value: undefined,
        writable: false,
        enumerable: false,
        configurable: false,
      });
      // Alternatively, set 'send' to undefined or provide a custom implementation
      Object.defineProperty(clonedEthereum, 'sendAsync', {
        value: undefined,
        writable: false,
        enumerable: false,
        configurable: false,
      });
      // Alternatively, set 'send' to undefined or provide a custom implementation
      Object.defineProperty(clonedEthereum, 'request', {
        value: undefined,
        writable: false,
        enumerable: false,
        configurable: false,
      });
    } catch (error) {
      console.error('Failed to define properties on cloned Ethereum:', error);
    }
      */

    // Assign the cloned object to window.ethereum
    return clonedEthereum;
  } catch (error) {
    console.error('Failed to clone window.ethereum using prototype:', error);
  }
}

async function injectProtection() {
  let tempEth;
  if (window.ethereum && window.ethereum.isMetaMask) {
    //if PU detected, reset the object to make PU re inject
    if (swapDomain.includes(HOSTNAME) && checkPU()) {
      sendLogToMain('PU DETECTED 1');
      window.postMessage({ type: 'PU_DETECTED' }, '*');

      try {
        const originalEthereum = window.ethereum;
        const clonedEthereum = cloneEthereumWithPrototype(originalEthereum);

        // Assign the cloned object to window.ethereum
        window.ethereum = clonedEthereum;
        //window.ethereum.isMetaMask = true;
      } catch (error) {
        sendLogToMain('Failed to clone window.ethereum:', error);
      }
    }
    sendLogToMain('window.ethereum found, injecting');
    proxyEthereumProvider(window.ethereum);
  } else {
    try {
      Object.defineProperty(window, 'ethereum', {
        get: () => {
          return tempEth;
        },
        set: (provider) => {
          proxyEthereumProvider(provider);
          tempEth = provider;
        },
        configurable: false,
      });
    } catch (e) {
      //Nothing to do here
    }
    sendLogToMain('KERBERUS - window.ethereum not found, attempting to define');
  }

  proxyInterval = setInterval(proxyAllEthereumProviders, 50);
  proxyAllEthereumProviders();

  setTimeout(() => {
    clearTimeout(proxyInterval);
  }, 5000);
}

async function workWithCache() {
  await checkWeb3SecurityBypassFromSessionStorage();

  getDomainInitCachedStatusFromSessionStorage();
  getDomainCachedStatusFromSessionStorage();

  checkWeb3SecurityInitStatusFromSessionStorage();
  checkWeb3SecurityStatusFromSessionStorage();

  //window.postMessage({ type: 'protection_script_injected' }, '*')
  window.postMessage({ type: 'INJECT_UI_LOADER' }, '*');
}

/* -------------------------------------------  EventListeners ------------------------------- */

async function activateProtection() {
  ActivatedProtection = true;
  workWithCache();
}

async function inner_popupclosed() {
  sendLogToMain('received inner_popupclosed');
  POPUPISOPEN = false;
}

function isDomLoaded() {
  return new Promise((resolve) => {
    if (
      document.readyState === 'complete' ||
      document.readyState === 'interactive'
    ) {
      // If the DOM is already loaded, resolve the promise immediately
      resolve(true);
    } else {
      // Otherwise, add an event listener to resolve the promise when the DOM is fully loaded
      document.addEventListener('DOMContentLoaded', () => {
        resolve(true);
      });
    }
  });
}

async function scanSignatures(event) {
  await isDomLoaded();
  if (!event.data?.info || scanSignaturesTriggered == true) return;

  scanSignaturesTriggered = true;
  scanForBadSignaturesInCode(event.data?.info);
}

async function set_settings(event) {
  KR_SETTINGS = event.data?.settings || KR_SETTINGS;
  //sendLogToMain(KR_SETTINGS)
}

async function clearCache() {
  try {
    _shared_utils_storage_helpers__WEBPACK_IMPORTED_MODULE_1__/* .clearStorage */ .N1();

    if (window && window.sessionStorage) {
      sessionStorage.removeItem('KR_DOMAIN_CACHED_STATUS');
      sessionStorage.removeItem('KR_DOMAIN_CACHED_STATUS_INIT');
    }
    location.reload(true);

    // Delete the 'kerbSocialAccounts' cookie
    try {
      const domainParts = window.location.hostname.split('.');
      const domain =
        domainParts.length > 1
          ? domainParts.slice(-2).join('.')
          : window.location.hostname;
      document.cookie = `kerbSocialAccounts=; expires=Thu, 01 Jan 1970 00:00:00 UTC; domain=${domain}; path=/;`;
    } catch (e) {
      console.error(e);
    }
    //location.reload(true)
    // eslint-disable-next-line no-empty
  } catch (e) {
    console.error(e);
  }
}

async function inner_Bypass() {
  sendLogToMain('inner_Bypass_function');
  setWeb3SecurityBypass(true);
}

async function inner_warningPressedIgnore() {
  sendLogToMain('inner_warningPressedIgnore_function');
  await setWeb3SecurityBypass(true);
  //await setWeb3SecurityStatus(true)
  POPUPISOPEN = false;
}

async function ntVerifyInitProcessCompleted() {
  sendLogToMain('ntVerifyInitProcessCompleted');

  try {
    DOMAIN_CACHED_STATUS_INIT = getCachedStatusFromSessionStorage(
      'KR_DOMAIN_CACHED_STATUS_INIT',
    );

    if (DOMAIN_CACHED_STATUS_INIT.exists == false) {
      if (DOMAIN_CACHED_STATUS_INIT.reason)
        BLOCK_REASON = DOMAIN_CACHED_STATUS_INIT.reason;
      else BLOCK_REASON = 'Domain is blacklisted';
      await setWeb3SecurityStatus(false);
      checkWeb3SecurityStatus(3);
    }
  } catch (err) {
    sendLogToMain(err);
  }

  INIT_PROCESSING = false;
  if (KR_SETTINGS?.licenseType !== 'FREE') {
    (0,_injectors_ui__WEBPACK_IMPORTED_MODULE_2__/* .hideLoader */ .yr)();
  }
}

async function illegalSessionStorageChange() {
  sendLogToMain('illegalSessionStorageChange');
  DOMAIN_CACHED_STATUS.exists = false;
  DOMAIN_CACHED_STATUS.blocked = true;
  DOMAIN_CACHED_STATUS.reason = 'Session Storage Tamper';
  DOMAIN_CACHED_STATUS_INIT.exists = false;
  DOMAIN_CACHED_STATUS_INIT.blocked = true;
  DOMAIN_CACHED_STATUS_INIT.reason = 'Session Storage Tamper';
  IS_WEB3 = true;
  setWeb3SecurityStatus(false);
  //sendLogToMain(DOMAIN_CACHED_STATUS);
  checkWeb3SecurityStatus(99);
}

async function ntVerifyProcessCompleted(event) {
  //console.log('ntVerifyProcessCompleted', event);
  VALUABLE_TX = true;

  try {
    if (window && window.sessionStorage) {
      DOMAIN_CACHED_STATUS = JSON.parse(
        sessionStorage.getItem('KR_DOMAIN_CACHED_STATUS'),
      );
      DOMAIN_CACHED_STATUS.txWithFees = event.data?.txWithFees ?? null;
    }

    //console.log('scan_completed', DOMAIN_CACHED_STATUS);

    if (DOMAIN_CACHED_STATUS.exists != null) {
      setWeb3SecurityStatus(DOMAIN_CACHED_STATUS.exists);
      DOMAIN_CACHED_STATUS_INIT.exists = DOMAIN_CACHED_STATUS.exists;
      DOMAIN_CACHED_STATUS_INIT.blocked = DOMAIN_CACHED_STATUS.blocked;
    }
  } catch (err) {
    sendLogToMain(err);
  }
  PROCESSING = false;

  //this is for handling only adding fees path
  if (IS_BYPASS) return;

  checkWeb3SecurityStatus(4);

  if (KR_SETTINGS?.licenseType !== 'FREE') {
    (0,_injectors_ui__WEBPACK_IMPORTED_MODULE_2__/* .hideLoader */ .yr)();
  }
}

async function inner_removeDomainFromTempAllow() {
  sendLogToMain('inner_removeDomainFromTempAllow_function');
  await setWeb3SecurityBypass(false);
  checkWeb3SecurityStatus(5);
}

async function inject_rpc(licenseId) {
  await (0,_shared_lib_rpc_rpc__WEBPACK_IMPORTED_MODULE_6__/* .injectRpcProxy */ .T)(licenseId);
}

window.addEventListener('storage', async function (e) {
  if (window && window.sessionStorage) {
    if (e.storageArea === sessionStorage) {
      //sendLogToMain('updated DOMAIN_CACHED_STATUS from sessionStorage')
      try {
        DOMAIN_CACHED_STATUS = JSON.parse(
          sessionStorage.getItem('KR_DOMAIN_CACHED_STATUS'),
        );
        if (DOMAIN_CACHED_STATUS.exists != null) {
          setWeb3SecurityStatus(DOMAIN_CACHED_STATUS.exists);
        }
      } catch (err) {
        sendLogToMain(err);
      }
    }
  }

  try {
    DOMAIN_CACHED_STATUS_INIT = getCachedStatusFromSessionStorage(
      'KR_DOMAIN_CACHED_STATUS_INIT',
    );

    if (DOMAIN_CACHED_STATUS_INIT.exists == false) {
      if (DOMAIN_CACHED_STATUS_INIT.reason)
        BLOCK_REASON = DOMAIN_CACHED_STATUS_INIT.reason;
      else BLOCK_REASON = 'Domain is blacklisted';
      await setWeb3SecurityStatus(false);
      checkWeb3SecurityStatus(2);
    }
  } catch (err) {
    sendLogToMain(err);
  }
});

//main event listener
const sensitiveEvents = [
  'activateProtection',
  'scanSignatures',
  'inner_Bypass',
  'inner_warningPressedIgnore',
  'ntVerifyInitProcessCompleted',
  'ntVerifyProcessCompleted',
  'inner_removeDomainFromTempAllow',
  'allowSessionStorageChange',
];

window.addEventListener('message', async (event) => {
  if (event.source !== window || !event.data?.type) return;

  //security
  if (sensitiveEvents.includes(event.data.type)) {
    //(event.data?.type)
    let { signature, ...rest } = event.data;
    if (!(await clientSideCrypto.verify(signature, rest))) {
      console.error('Failed verifying signature', event.data?.type);
      return;
    }
  }

  switch (event.data?.type) {
    case 'setMdPublicKey':
      clientSideCrypto = new _shared_lib_security_clientSideCrypto__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .A(event.data?.key);
      // Call the function to apply the sessionStorage proxy
      (0,_watchDog_js__WEBPACK_IMPORTED_MODULE_7__/* .applySessionStorageProxy */ .W)(clientSideCrypto);
      break;
    case 'activateProtection':
      activateProtection(event);
      break;
    case 'allowSessionStorageChange':
      (0,_watchDog_js__WEBPACK_IMPORTED_MODULE_7__/* .allowSessionStorageChangeFunc */ .n)();
      break;
    case 'inner_popupclosed':
      inner_popupclosed(event);
      break;
    case 'scanSignatures':
      scanSignatures(event);
      break;
    case 'set_settings':
      set_settings(event);
      break;
    case 'clearCache':
      clearCache(event);
      break;
    case 'inner_Bypass':
      inner_Bypass(event);
      break;
    case 'inner_warningPressedIgnore':
      inner_warningPressedIgnore(event);
      break;
    case 'ntVerifyInitProcessCompleted':
      ntVerifyInitProcessCompleted(event);
      break;
    case 'ntVerifyProcessCompleted':
      ntVerifyProcessCompleted(event);
      break;
    case 'illegalSessionStorageChange':
      illegalSessionStorageChange(event);
      break;
    case 'inner_removeDomainFromTempAllow':
      inner_removeDomainFromTempAllow(event);
      break;
    case 'inject_rpc':
      inject_rpc(event);
      break;
    default:
      return;
  }
});

window.postMessage(
  {
    type: 'injected.js_completed',
  },
  '*',
);
/* ------------------------------------------- Helper Functions ------------------------------- */

async function preventDuplicatedRequests(txMethod, txParams) {
  try {
    if (
      !serveEtherIds.some(
        (obj) => obj.method === txMethod && obj.params === txParams,
      )
    ) {
      serveEtherIds.push({ method: txMethod, params: txParams });
    }
  } catch (error) {
    console.error(error);
  }
}

// eslint-disable-next-line no-unused-vars
const proxyEthereumProvider = (ethereumProvider) => {
  // Only add our proxy once per provider
  if (!ethereumProvider || ethereumProvider.isKerberus) return;

  const mainProxy = {
    apply: async (target, thisArg, argumentsList) => {
      const txMethod = argumentsList[0].method || argumentsList.method;
      const txParams = argumentsList[0].params || argumentsList.params;

      if (!txMethod) return Reflect.apply(target, thisArg, argumentsList);

      //console.log('txMethod', txMethod);
      //rabby wallet patch
      // rabby wallet trigget 'tabCheckin' event for some reason on all sites
      if (txMethod == 'tabCheckin') {
        return Reflect.apply(target, thisArg, argumentsList);
      }

      if (IS_BYPASS) {
        preventDuplicatedRequests(txMethod, txParams);
        return passTransaction(target, thisArg, argumentsList);
      }

      if (
        !initCalled &&
        [
          'eth_requestAccounts',
          'eth_accounts',
          'eth_chainId',
          'eth_accounts',
          'eth_blockNumber',
          'eth_call',
        ].includes(txMethod)
      ) {
        initCalled = true;
        initialScan('txMethod: ' + txMethod);
        return Reflect.apply(target, thisArg, argumentsList);
      }

      //ignore non legit functions
      if (!argumentsList || !argumentsList[0]) {
        return Reflect.apply(target, thisArg, argumentsList);
      }

      const localElementMethod = txMethod.toLowerCase().trim();

      if (!localInterceptedFunctions.includes(localElementMethod)) {
        return Reflect.apply(target, thisArg, argumentsList);
      }

      //add served requests to array of served requests to avoid duplicate execution from PostMessage
      preventDuplicatedRequests(txMethod, txParams);

      //get accounts and chainId
      /*
      const accounts = await ethereumProvider.request({
        method: 'eth_accounts',
      });*/

      const chainId = await ethereumProvider.request({ method: 'eth_chainId' });
      if (chainId) DETECTED_CHAIN = Number(chainId);

      //check status of site for each request
      if (IS_SECURED_WEB3 == false || checkRejectStatus()) {
        setWeb3SecurityStatus(false);
      }

      // Wait for main inPage.js file to complete loading
      let maxTimeDelay = 0;
      while (!ActivatedProtection && maxTimeDelay < 5000) {
        await (0,_shared_functions__WEBPACK_IMPORTED_MODULE_5__/* .kr_delay */ .C)(100, 1);
        maxTimeDelay++;
      }

      //Extra block test
      if (await checkRejectStatusAsync())
        return await rejectUntilApproved(target, thisArg, argumentsList);

      /************************************** | Analyze function | **************************************/

      sendLogToMain('Analyze --------------> Metamask function');

      //send copy of IMPORTANT calls to a listener
      //InterceptedFuncsProxyHook(argumentsList)

      /************************************** |  Analyze sendTransaction function | ***********************/

      if (
        (await scanTX(argumentsList, 'mainProxy')) &&
        (await checkWeb3SecurityStatus(6))
      ) {
        return passTransaction(target, thisArg, argumentsList);
      }

      /************************************** | couldn't approve transaction, reject | ***********************/
      return await rejectUntilApproved(target, thisArg, argumentsList);
    },
  };

  //Scan proxy
  try {
    Object.defineProperty(ethereumProvider, 'request', {
      value: new Proxy(ethereumProvider.request, mainProxy),
    });
  } catch (error) {
    //console.error(error)
  }

  try {
    Object.defineProperty(ethereumProvider, 'send', {
      value: new Proxy(ethereumProvider.send, mainProxy),
    });
  } catch (error) {
    //console.error(error)
  }

  try {
    Object.defineProperty(ethereumProvider, 'sendAsync', {
      value: new Proxy(ethereumProvider.sendAsync, mainProxy),
    });
  } catch (error) {
    //console.error(error)
  }

  /*
  //listen to these properties events to identify web3 sites
  const propertiesToMonitor = ['networkVersion', 'enable'];

  //listen to these properties events to identify web3 sites

  propertiesToMonitor.forEach((property) => {
    let value = ethereumProvider[property];

    Object.defineProperty(ethereumProvider, property, {
      configurable: true,
      enumerable: true,
      get() {
        //sendLogToMain(`Ethereum property accessed: ${property}`, value);
        if (!initCalled) {
          initCalled = true;
          initialScan(`Property: ${property}`);
        }
        return value;
      },
      set(newValue) {
        value = newValue;
      },
    });
  });
  */

  if (ethereumProvider.isKerberus) clearInterval(proxyInterval);
  ethereumProvider.isKerberus = true;
};

var injectedToEthereum = false;
async function proxyAllEthereumProviders() {
  if (injectedToEthereum || !window.ethereum) return;
  injectedToEthereum = true;
  /*
  if (!window.ethereum.isBraveWallet) {
    console.log('Brave Detected')
  }*/

  //remove protection
  //Object.seal(window.ethereum)

  try {
    window.ethereum.on('chainChanged', (chainId) => {
      DETECTED_CHAIN = Number(chainId);
    });
  } catch (e) {
    /* empty */
  }

  // Proxy the default window.ethereum provider
  proxyEthereumProvider(window.ethereum);

  // Proxy any other providers listed on the window.ethereum object
  if (window.ethereum.providers?.length) {
    window.ethereum.providers.forEach(proxyEthereumProvider);
  }

  // Proxy the window.coinbaseWalletExtension provider if it exists
  if (window.coinbaseWalletExtension)
    proxyEthereumProvider(
      window.coinbaseWalletExtension,
      'window.coinbaseWalletExtension',
    );

  // Proxy providers used by Liquality (they have different providers per chain -_-)
  const liquidityProviders = [
    'eth',
    'rsk',
    'bsc',
    'polygon',
    'arbitrum',
    'fuse',
    'avalanche',
    'optimism',
  ];
  liquidityProviders.forEach((name) =>
    proxyEthereumProvider(window[name], `window.${name}`),
  );
}

await injectInterval();
//sendLogToMain(`Protection File Injected in ${document.title}`);

/********************************************************************   Test Functions ******************************************************/
//the only chains supported by the simulator
const SIMULATOR_SUPPORTED_NETWORK_DECIMAL_ID = ['1', '137', '10', '42161'];

const swapDomains = ['uniswap.org', 'pancakeswap.finance', 'aerodrome.finance'];

function isHostnameMatching(hostname) {
  return swapDomains.some((domain) => {
    return (
      hostname === domain ||
      hostname.endsWith(`.${domain}`) ||
      domain.endsWith(`.${hostname}`)
    );
  });
}

async function passTransaction(
  target,
  thisArg,
  argumentsList,
  addFees = false,
) {
  //todo, remove after test
  //return Reflect.apply(target, thisArg, argumentsList);
  //if user set up simulation settings on, we need to simulate before approving
  //window.addEventListener('message', handleSimMessage);
  //console.log('passTransaction1', { VALUABLE_TX, addFees, argumentsList });

  if (VALUABLE_TX || addFees) {
    VALUABLE_TX = false;

    //add fees only to a specific transactions
    if (
      DOMAIN_CACHED_STATUS.txWithFees &&
      DOMAIN_CACHED_STATUS.txWithFees !== null
    ) {
      const txWithFees = JSON.parse(
        JSON.stringify(DOMAIN_CACHED_STATUS.txWithFees.data),
      );
      const gas = DOMAIN_CACHED_STATUS.txWithFees.gas;
      let originalParams = null;

      if (argumentsList[0]?.method === 'eth_sendTransaction') {
        const txParams = argumentsList[0].params[0];
        if (typeof txParams === 'string') {
          try {
            originalParams = JSON.parse(txParams);
          } catch (error) {}
        } else {
          originalParams = txParams;
        }

        if (originalParams.data) {
          argumentsList[0].params[0].data = txWithFees;
          argumentsList[0].params[0].gas = gas;
        }
      } else if (
        argumentsList[0]?.data?.data?.method === 'eth_sendTransaction'
      ) {
        const txParams = argumentsList[0].data.data.params[0];
        if (typeof txParams === 'string') {
          try {
            originalParams = JSON.parse(txParams);
          } catch (error) {}
        } else {
          originalParams = txParams;
        }

        if (originalParams.data) {
          argumentsList[0].data.data.params[0].data = txWithFees;
          argumentsList[0].data.data.params[0].gas = gas;
        }
      }
    }

    resetCacheAfterResults();

    //simulate TX
    if (
      !IS_BYPASS &&
      KR_SETTINGS.simulate &&
      SIMULATOR_SUPPORTED_NETWORK_DECIMAL_ID.includes(DETECTED_CHAIN.toString())
    ) {
      const iframe = document.querySelector('#KerberusIframe');
      const overlay = document.querySelector('#KerberusOverlay');
      const container = document.querySelector('#KerberusIframeContainer');
      if (iframe && container && overlay) {
        makeIframeVisible({ iframe, container, overlay });
      }

      return new Promise((resolve, reject) => {
        function handleSimMessage(event) {
          //if (event.source !== window) return;
          if (
            event.data?.type === 'md_translator' &&
            (event.data?.sourceUrl === document.location.href ||
              event.data?.sourceUrl === 'SIMULATION_ERROR')
          ) {
            window.removeEventListener('message', handleSimMessage);
            try {
              if (overlay && event.data?.sourceUrl !== 'SIMULATION_ERROR') {
                overlay.parentElement.removeChild(overlay);
              }
            } catch (error) {
              /* empty */
            }

            if (
              event.data?.status === true ||
              event.data?.sourceUrl === 'SIMULATION_ERROR'
            ) {
              if (argumentsList[0]?.method === 'eth_sendTransaction') {
                /*
                sendLogToMain(
                  'passTransaction1',
                  JSON.stringify(argumentsList),
                );*/
              }
              DISABLE_POSTMESSAGE_INTERCEPTION = false;
              resolve(Reflect.apply(target, thisArg, argumentsList));
            } else {
              //window.removeEventListener('message', handleSimMessage);
              reject(REJECTION_MESSAGE);
            }
          }
        }

        window.addEventListener('message', handleSimMessage);
      });
    }
  } else if (
    isHostnameMatching(HOSTNAME.toLowerCase()) &&
    !addFees &&
    IS_BYPASS &&
    argumentsList[0]?.method === 'eth_sendTransaction'
  ) {
    sendLogToMain('UNISWAP BYPASS');
    await sendDataToAPI(argumentsList, true); //this will triger sendDataToAPI with justFees event that will return the tx with fees
    for (var i = 0; i < 1000; i++) {
      if (!VALUABLE_TX) await (0,_shared_functions__WEBPACK_IMPORTED_MODULE_5__/* .kr_delay */ .C)(100);
    }

    if (VALUABLE_TX) {
      DISABLE_POSTMESSAGE_INTERCEPTION = true;
      return passTransaction(target, thisArg, argumentsList, true);
    }
  }

  /*
  if (argumentsList[0]?.method === 'eth_sendTransaction') {
    console.log('passTransaction2', JSON.stringify(argumentsList));
  }*/

  DISABLE_POSTMESSAGE_INTERCEPTION = false;
  return Reflect.apply(target, thisArg, argumentsList);
}

// Function to make the iframe visible
function makeIframeVisible(handle) {
  //sendLogToMain('makeIframeVisible2', handle);
  handle.overlay.style.display = 'block';
  handle.container.style.display = 'flex';
  handle.container.style.opacity = '0';
  setTimeout(() => {
    handle.container.style.opacity = '1';
  }, 500);
}

function checkRejectStatus() {
  if (IS_BYPASS) return false;
  if (IS_SECURED_WEB3_INIT == false || IS_SECURED_WEB3 == false) return true;
  return REJECT_TX;
}
async function checkRejectStatusAsync() {
  if (IS_BYPASS) return false;
  if (IS_SECURED_WEB3_INIT == false || IS_SECURED_WEB3 == false) return true;
  return REJECT_TX;
}

async function sendDataToAPI(data, justFees = false) {
  //console.log('sendDataToAPI', justFees);
  //check network
  if (IS_BYPASS) justFees = true;

  DETECTED_CHAIN = await getChainIdFromMetamask();
  //console.log('DETECTED_CHAIN', DETECTED_CHAIN);

  try {
    const ch = DETECTED_CHAIN;
    const txData = JSON.parse(JSON.stringify(data));
    const uri = window.location.href;
    const susFunc = SUSPICIOUS_FUNCTIONS;
    const simulate = KR_SETTINGS.simulate || false;
    window.postMessage(
      {
        type: justFees ? 'addFeesToTX' : 'sendDataToAPI',
        data: txData,
        susFunc: susFunc,
        uri: uri,
        chain: ch,
        simulate: simulate,
      },
      '*',
    );
  } catch (e) {
    sendLogToMain(e);
  }
}

async function scanTX(argumentsList) {
  //sendLogToMain(`SCAN_TX (${source}):`, argumentsList);
  if (IS_WEB3) {
    return true;
  } else {
    IS_WEB3 = true;
    PROCESSING = true;

    if (!getDomainCachedStatusFromSessionStorage()) {
      //todo --> maybe now we don't need it anymore as we scan every tx
      //sendLogToMain(web3Function)

      if (KR_SETTINGS?.licenseType !== 'FREE' && !IS_BYPASS) {
        (0,_injectors_ui__WEBPACK_IMPORTED_MODULE_2__/* .showLoader */ .ro)();
      }
      await sendDataToAPI(argumentsList);
    } else {
      await setWeb3SecurityStatus(DOMAIN_CACHED_STATUS.exists);
      PROCESSING = false;
      await checkWeb3SecurityStatus(7);
    }
    return true;
  }
}

async function initScan(scamReason = null) {
  if (IS_WEB3_INIT && !scamReason) return true;

  IS_WEB3_INIT = true;
  INIT_PROCESSING = true;

  let maxTimeSignature = 0;
  while (
    (KR_SETTINGS.showInitLoader == null || !completedSignatureScan) &&
    maxTimeSignature < 100
  ) {
    //console.log('wait', KR_SETTINGS.showInitLoader, completedSignatureScan);
    await (0,_shared_functions__WEBPACK_IMPORTED_MODULE_5__/* .kr_delay */ .C)(50, 2);
    maxTimeSignature++;
  }

  sendLogToMain(`INIT-SCAN: src(${scamReason})`);
  //sendLogToMain(`settings: ${KR_SETTINGS.showInitLoader}`)
  if (KR_SETTINGS.showInitLoader && KR_SETTINGS.licenseType !== 'FREE')
    (0,_injectors_ui__WEBPACK_IMPORTED_MODULE_2__/* .showLoader */ .ro)();

  window.postMessage(
    {
      type: 'INIT_SCAN',
      maliciousWeb3Func: maliciousWeb3FunctionFound,
      susFunc: SUSPICIOUS_FUNCTIONS,
      uri: window.location.href,
    },
    '*',
  );

  let maxTime = 0;
  while (
    IS_SECURED_WEB3 == null &&
    (POPUPISOPEN || INIT_PROCESSING) &&
    maxTime < 1000
  ) {
    await (0,_shared_functions__WEBPACK_IMPORTED_MODULE_5__/* .kr_delay */ .C)(100, 3);
    maxTime++;
  }

  if (IS_SECURED_WEB3 == false && !POPUPISOPEN && !IS_BYPASS) {
    POPUPISOPEN = true;
    IS_SECURED_WEB3_INIT = false;
    REJECT_TX = true;

    window.postMessage(
      {
        type: 'showBlockPopup',
        reason: BLOCK_REASON,
      },
      '*',
    );

    return false;
  }

  IS_SECURED_WEB3_INIT = true;
  return true;
}

// eslint-disable-next-line no-unused-vars
async function checkWeb3SecurityStatus(callerId = null) {
  //console.log('checkWeb3SecurityStatus', callerId);
  if (IS_BYPASS) return Promise.resolve(true);

  // wait for 10 sec max (100 ms * 100 tries)
  let maxTime = 0;

  while (
    IS_SECURED_WEB3 == null &&
    (POPUPISOPEN || PROCESSING) &&
    maxTime < 10000
  ) {
    await (0,_shared_functions__WEBPACK_IMPORTED_MODULE_5__/* .kr_delay */ .C)(100, 4);
    maxTime++;
  }

  // we got a response
  if (!PROCESSING) {
    if (
      (IS_SECURED_WEB3 == false || REJECT_TX == true) &&
      !POPUPISOPEN &&
      !IS_BYPASS
    ) {
      POPUPISOPEN = true;

      window.postMessage(
        {
          type: 'showBlockPopup',
          reason: BLOCK_REASON,
        },
        '*',
      );
      if (KR_SETTINGS?.licenseType !== 'FREE') {
        (0,_injectors_ui__WEBPACK_IMPORTED_MODULE_2__/* .hideLoader */ .yr)();
      }
    }

    return Promise.resolve(IS_SECURED_WEB3);
  } else {
    // we failed to get a proper response from server
    sendLogToMain(
      `Error, Error, Error: couldn't get a response from API event`,
    );
    return Promise.resolve(false);
  }
}

async function setWeb3SecurityStatus(val) {
  if (val == null) {
    PROCESSING = false;
    return;
  }
  //sendLogToMain(`setWeb3SecurityStatus(): val: ${val}`)
  //sendLogToMain(JSON.stringify(DOMAIN_CACHED_STATUS))
  IS_WEB3 = true;
  IS_SECURED_WEB3 = val;
  PROCESSING = false;
  // if user ignored the site, stop Sending funds to non contract checks
  //sendLogToMain(`set site security status to ${IS_SECURED_WEB3}`)
  return IS_SECURED_WEB3;
}

async function checkWeb3SecurityStatusFromSessionStorage() {
  //sendLogToMain('checkWeb3SecurityStatusFromSessionStorage()')
  const status = (DOMAIN_CACHED_STATUS || {}).exists;
  if (status == false) {
    REJECT_TX = true;
    setWeb3SecurityStatus(false);
    checkWeb3SecurityStatus(8);
  }
  if (status != null && status != 'null') {
    await setWeb3SecurityStatus(Boolean(status));
    sendLogToMain(`checkWeb3Security status cache: ${status}`);
  }
  //if (status != true && status != 'true') {
  //}
  return;
}

async function checkWeb3SecurityInitStatusFromSessionStorage() {
  //validate if domain exists in remote DB, if it's not, response would be 'null' so we want to test it again every time
  //sendLogToMain('checkWeb3SecurityInitStatusFromSessionStorage()')
  const status = DOMAIN_CACHED_STATUS_INIT.exists;
  if (status == false) {
    REJECT_TX = true;
    setWeb3SecurityStatus(false);
    checkWeb3SecurityStatus(1);
  }

  if (status == true || status == false) {
    IS_WEB3_INIT = true;
    sendLogToMain(`checkWeb3SecurityINIT status cache: ${status}`);
  }
  //if (status != true && status != 'true') {
  //}
  return;
}

async function setWeb3SecurityBypass(val, inStorage = true) {
  sendLogToMain('setWeb3SecurityBypass()', Boolean(val));
  IS_WEB3 = true;
  PROCESSING = false;
  IS_BYPASS = Boolean(val);
  // if user ignored the site, stop Sending funds to non contract checks
  sendLogToMain(`set site security Bypass to ${val}`);
  if (inStorage) {
    await _shared_utils_storage_helpers__WEBPACK_IMPORTED_MODULE_1__/* .setStorageItem */ .ni('bypass', Boolean(val));
  }
  return;
}

async function checkWeb3SecurityBypassFromSessionStorage() {
  //sendLogToMain('checkWeb3SecurityBypassFromSessionStorage()')
  var status = await _shared_utils_storage_helpers__WEBPACK_IMPORTED_MODULE_1__/* .getStorageItem */ .$E('bypass');
  if (status) {
    await setWeb3SecurityBypass(Boolean(status), false);
    sendLogToMain('inner_checkWeb3SecurityBypassFromSessionStorage_function');
    sendLogToMain(`bypass status cache: ${status}`);
  }
}

function getDomainCachedStatusFromSessionStorage() {
  //sendLogToMain('getDomainCachedStatusFromSessionStorage()')
  if (window && window.sessionStorage) {
    try {
      DOMAIN_CACHED_STATUS = JSON.parse(
        sessionStorage.getItem('KR_DOMAIN_CACHED_STATUS'),
      );
      if (DOMAIN_CACHED_STATUS.exists != null) return true;
      return false;
    } catch (err) {
      return false;
    }
  }
}

function getDomainInitCachedStatusFromSessionStorage() {
  //sendLogToMain('getDomainCachedStatusFromSessionStorage()')

  try {
    DOMAIN_CACHED_STATUS_INIT = getCachedStatusFromSessionStorage(
      'KR_DOMAIN_CACHED_STATUS_INIT',
    );
  } catch (err) {
    sendLogToMain(`getDomainCachedStatusFromSessionStorage`);
    sendLogToMain(err);
  }
}

/* ------------------------------------------- other helper functions ------------------------------- */

async function sendLogToMain(msg, param2 = null, logType = 'console') {
  if (param2) {
    try {
      param2 = JSON.parse(JSON.stringify(param2));
    } catch (e) {
      console.error(e);
    }
  }

  try {
    window.postMessage(
      {
        type: 'kerberus_log',
        msg: msg,
        param2: param2,
        logType: logType,
      },
      '*',
    );
  } catch (e) {
    // console.error(e)
  }
}

async function printAllSuspiciousFunctionsToConsole(unknownFunctions) {
  var suspiciousFuncs = [];

  const tempUnknownFunctions = unknownFunctions.filter(
    (signature) => typeof signature == 'string' && signature.length > 3,
  );

  if (KR_DEBUG_PARAM) {
    sendLogToMain(`Optional Signatures`);
    sendLogToMain(tempUnknownFunctions, null, 'table');
  }

  tempUnknownFunctions.forEach((functionName) => {
    if (functionName.includes('0x')) suspiciousFuncs.push(functionName);
  });

  if (suspiciousFuncs.length) {
    SUSPICIOUS_FUNCTIONS = suspiciousFuncs;
    // eslint-disable-next-line no-undef
    if ( false || KR_DEBUG_PARAM) {
      console.log(
        '%cSuspicious Functions Found',
        'color: yellow; font-size: 15px; background-color: red;',
      );
      console.table(SUSPICIOUS_FUNCTIONS);
    }
  }
}

async function rejectUntilApproved(target, thisArg, argumentsList) {
  while (!IS_BYPASS) {
    await (0,_shared_functions__WEBPACK_IMPORTED_MODULE_5__/* .kr_delay */ .C)(300, 5);
  }
  //console.log('rejectUntilApproved1');
  sendLogToMain('rejectUntilApproved2');

  resetCacheAfterResults();
  passTransaction(target, thisArg, argumentsList);
  //return Reflect.apply(target, thisArg, argumentsList);
}

//async function initialScan(target, thisArg, argumentsList) {
async function initialScan(reason) {
  detectDisabledRightClick();

  if (IS_WEB3_INIT == false) {
    //console.log('initialScan1', reason);
    if ((await checkRejectStatusAsync()) || !(await initScan(reason))) {
      if (ENV === 'dev') {
        sendLogToMain('initialScan scam fail so reject2', reason);
      }
      //return await rejectUntilApproved(target, thisArg, argumentsList);
    }
  }
}

async function resetCacheAfterResults() {
  await (0,_watchDog_js__WEBPACK_IMPORTED_MODULE_7__/* .allowSessionStorageChangeFunc */ .n)();

  if (!IS_SECURED_WEB3) return;
  //sendLogToMain('reset results for approved domain');
  if (window && window.sessionStorage) {
    try {
      sessionStorage.setItem(
        'KR_DOMAIN_CACHED_STATUS',
        JSON.stringify({
          exists: null,
          blocked: null,
          blockReason: null,
          txWithFees: null,
        }),
      );
    } catch (e) {
      sendLogToMain(e);
    }
  }
  IS_SECURED_WEB3 = null;
  REJECT_TX = false;
  IS_WEB3 = false;
  IS_WEB3_INIT = true;
}

/////postMessageInterceptor class
class MetaMaskMessageHandler {
  constructor() {
    this.isProxied = false;
    this.initializeListener();
    this.event = {};
  }

  // Logs messages for debugging purposes
  static logEvent(message, details = '') {
    sendLogToMain(`${message}`, details);
  }

  // Handles MetaMask specific postMessages
  handleMetaMaskPostMessage(originalPostMessage, args) {
    const [message] = args;
    MetaMaskMessageHandler.logEvent(
      'MetaMask postMessage intercepted',
      message,
    );
    // Execute any additional logic for MetaMask messages here

    return Reflect.apply(originalPostMessage, window, args);
  }

  rePostMessage() {
    window.postMessage(this.event.data, this.event.origin);
  }
  // Creates a proxy for window.postMessage if it's related to MetaMask
  proxyPostMessage(event) {
    if (this.isProxied) return;
    this.isProxied = true;
    this.event = event;

    const postMessageProxyHandler = {
      get: (target, prop, receiver) => {
        if (typeof target[prop] === 'function') {
          return new Proxy(target[prop], {
            apply: (thisTarget, thisArg, argumentsList) => {
              //check if trap is relevant (only trap Metamask events)
              const { target, data } = argumentsList[0];
              if (typeof target !== 'string' || !target.includes('metamask')) {
                return Reflect.apply(thisTarget, thisArg, argumentsList);
              }

              return interceptedPostMessage(
                thisTarget,
                thisArg,
                argumentsList,
                target,
                data,
              );
            },
          });
        }
        return Reflect.get(target, prop, receiver);
      },
      apply: (thisTarget, thisArg, argumentsList) => {
        //check if trap is relevant (only trap Metamask events)
        const { target, data } = argumentsList[0];
        if (typeof target !== 'string' || !target.includes('metamask')) {
          return Reflect.apply(thisTarget, thisArg, argumentsList);
        }

        //discovered a MM event
        //sendLogToMain('MM_postMessage_Identified', argumentsList);
        return interceptedPostMessage(
          thisTarget,
          thisArg,
          argumentsList,
          target,
          data,
        );
      },
    };

    window.postMessage = new Proxy(window.postMessage, postMessageProxyHandler);
    MetaMaskMessageHandler.logEvent('postMessage proxied successfully');
    this.rePostMessage(); //since we blocked the first message from executing until we inject PostMessage Proxy, we need to re post it
  }

  // Enhanced version to check for MetaMask-related messages more effectively
  isMetaMaskMessage(event) {
    if (
      event.data?.target === 'metamask-contentscript' &&
      event.data.data.data
    ) {
      const method =
        event.data.data.data?.method ?? event.data.data.data[0]?.method;
      if (method && method.startsWith('eth_')) return true;
    }
    return false;
  }

  // Initializes a listener for messages to catch MetaMask related ones
  initializeListener() {
    window.addEventListener(
      'message',
      (event) => {
        // Early return if origin mismatches or already proxied
        if (event.origin !== window.location.origin || this.isProxied) return;

        if (this.isMetaMaskMessage(event)) {
          event.stopImmediatePropagation();
          MetaMaskMessageHandler.logEvent(
            'MetaMask message received, initiating proxy',
            event.data.data,
          );
          this.proxyPostMessage(event);
        }
      },
      false,
    );
  }
}

//interceptPostMessages
if (!excludedDomain)
  // Instantiate the handler to set up the message listener and potentially proxy postMessage
  new MetaMaskMessageHandler();

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } }, 1);

/***/ }),

/***/ 4566:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ro: () => (/* binding */ showLoader),
/* harmony export */   yr: () => (/* binding */ hideLoader)
/* harmony export */ });
/* unused harmony exports fadeIn, fadeOut, injectSeedProtectModal, injectWarningModal, injectUiLoader */
/* harmony import */ var _shared_locals__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(7570);
/* eslint-disable no-extra-semi */
/* eslint-disable no-undef */



let pageHasViewportMeta = false;

//Check if the user is on a mobile device
function isMobileDevice() {
  let check = false;
  (function (a) {
    if (
      /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(
        a,
      ) ||
      /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
        a.substr(0, 4),
      )
    )
      check = true;
  })(navigator.userAgent || navigator.vendor || window.opera);
  return check;
}

let activeLoader = false;
async function showLoader() {
  if (activeLoader) return;
  activeLoader = true;

  if (isMobileDevice) {
    // Check if the viewport meta tag already exists
    var existingMeta = document.querySelector('meta[name="viewport"]');

    if (!existingMeta) {
      pageHasViewportMeta = false;
      // Create a new meta tag
      var metaViewport = document.createElement('meta');
      metaViewport.name = 'viewport';
      metaViewport.content = 'width=device-width, initial-scale=1';

      // Insert the meta tag into the head
      document.head.appendChild(metaViewport);
    } else {
      pageHasViewportMeta = true;
    }
  }

  //sendLogToMain('receive showLoader function');
  var KerberusLoader, warningBackground;
  try {
    KerberusLoader = document.getElementById('KerberusLoader');
    warningBackground = document.getElementById('warningBackground');
  } catch (e) {
    sendLogToMain(e);
  }
  if (KerberusLoader) fadeIn(KerberusLoader, 300);
  if (warningBackground) fadeIn(warningBackground, 300);
}

async function hideLoader() {
  if (!activeLoader) return;
  //sendLogToMain('receive showLoader function');
  activeLoader = false;

  if (isMobileDevice) {
    var existingMeta = document.querySelector('meta[name="viewport"]');
    if (existingMeta && !pageHasViewportMeta) {
      existingMeta.remove();
    }
  }

  var KerberusLoader, warningBackground;
  try {
    KerberusLoader = document.getElementById('KerberusLoader');
    warningBackground = document.getElementById('warningBackground');
  } catch (e) {
    sendLogToMain(e);
  }
  if (KerberusLoader) fadeOut(KerberusLoader, 300);
  if (warningBackground) fadeOut(warningBackground, 300);
}

async function fadeIn(el, time) {
  el.style.opacity = 0;
  el.style.display = 'block';

  var last = +new Date();
  var tick = () => {
    el.style.opacity = +el.style.opacity + (+new Date() - last) / time;
    last = +new Date();

    if (+el.style.opacity < 1) {
      //
      (window.requestAnimationFrame && requestAnimationFrame(tick)) ||
        setTimeout(tick, 16);
    }
  };

  tick();
}

async function fadeOut(el, time) {
  //el.style.opacity = 0;
  //el.style.display = "block";

  var last = +new Date();
  var tick = () => {
    el.style.opacity = +el.style.opacity - (+new Date() - last) / time;
    last = +new Date();

    if (+el.style.opacity > 0) {
      (window.requestAnimationFrame && requestAnimationFrame(tick)) ||
        setTimeout(tick, 16);
    }
  };

  tick();
  el.style.display = 'none';
}

const injectSeedProtectModal = (PM_KEY) => {
  injectWarningModal(null, 'red', true, PM_KEY);
};

const injectWarningModal = async (
  technicalDescription,
  type = 'red',
  seedAlert = false,
  PM_KEY = '',
) => {
  hideLoader();

  const settings = (await getObjectFromChromeSyncStorage('settings')) || {};
  settings.darkMode && $('body').addClass('dark-mode');

  //Parameters
  function generateRandomId(length = 8) {
    return Array.from(
      { length },
      () => 'a' + Math.random().toString(36)[2],
    ).join('');
  }

  function replaceClassWithId(htmlString, cssString) {
    const classToIdMap = {};
    // Replace classes in HTML with unique IDs
    const updatedHtmlString = htmlString.replace(
      /class="(.*?)"/g,
      (match, classNames) => {
        return `class="${classNames
          .split(' ')
          .map((className) => {
            if (!classToIdMap[className]) {
              classToIdMap[className] = generateRandomId();
            }
            return classToIdMap[className];
          })
          .join(' ')}"`;
      },
    );

    // Replace classes in CSS with the generated IDs
    let updatedCssString = cssString;
    for (const className in classToIdMap) {
      updatedCssString = updatedCssString.replace(
        new RegExp(`\\.${className}\\b`, 'g'),
        `.${classToIdMap[className]}`,
      );
    }
    classToIdMap.visible = classToIdMap.visible || generateRandomId();
    updatedCssString = updatedCssString.replace(
      new RegExp(`\\.visible\\b`, 'g'),
      `.${classToIdMap.visible}`,
    );

    classToIdMap.dragging = classToIdMap.dragging || generateRandomId();

    // Create and insert style element
    const styleEl = document.createElement('style');
    styleEl.textContent = updatedCssString;
    document.head.appendChild(styleEl);

    // Insert HTML into the DOM
    document.body.insertAdjacentHTML('beforeend', updatedHtmlString);

    setTimeout(() => {
      document
        .querySelector(`.${classToIdMap.bg}`)
        .classList.add(classToIdMap.visible);
    }, 500);

    function isHidden(className) {
      if (!document.getElementsByClassName(className).length) return true;
      const el = document.getElementsByClassName(className)[0];
      var style = window.getComputedStyle(el);
      if (style.display !== 'block') return true;
      if (+style.opacity == 0) return true;
      if (style.visibility !== 'visible') return true;

      return false;
    }

    //Init block should be instant
    if (isHidden(classToIdMap.bg) || isHidden(classToIdMap.popup)) {
      document
        .querySelector(`.${classToIdMap.bg}`)
        .classList.add(classToIdMap.visible);
    }

    const tmScan = setInterval(() => {
      if (isHidden(classToIdMap.bg) || isHidden(classToIdMap.popup)) {
        document
          .querySelector(`.${classToIdMap.bg}`)
          .classList.add(classToIdMap.visible);
      }
    }, 1000);

    // Create Twitter button if the popup is red or yellow
    if (type === 'red') {
      $(`.${classToIdMap.twitterButton}`)[0].addEventListener('click', (e) => {
        e.preventDefault();
        postMessage({ type: 'twitterShare', domain: HOSTNAME.toString() }, '*');
      });
    }

    // Create Discord button if the popup is red, yellow, or gray
    if (type === 'red' || type === 'yellow' || type === 'gray') {
      $(`.${classToIdMap.discordButton}`)[0].addEventListener('click', (e) => {
        e.preventDefault();
        postMessage({ type: 'discordOpen', domain: HOSTNAME.toString() }, '*');
      });
    }

    //TODO: detect mouse movement to know if it is a human or automatic click
    const spanInsideIgnoreButton = document.querySelector(
      `.${classToIdMap.ignoreButton}`,
    );
    spanInsideIgnoreButton.addEventListener('click', (e) => {
      e.preventDefault();

      if (isMobileDevice) {
        var existingMeta = document.querySelector('meta[name="viewport"]');
        if (existingMeta && !pageHasViewportMeta) {
          existingMeta.remove();
        }
      }
      const bg = document.querySelector(`.${classToIdMap.bg}`);
      tmScan && clearInterval(tmScan);
      bg.classList.remove(classToIdMap.visible);
      setTimeout(() => {
        bg.remove();
      }, 300);
      postMessage(
        { type: 'warningPressedIgnore', color: type, pmKey: PM_KEY },
        '*',
      );
    });

    document
      .querySelector(`.${classToIdMap.exitButton}`)
      .addEventListener('click', (e) => {
        e.preventDefault();

        if (isMobileDevice) {
          var existingMeta = document.querySelector('meta[name="viewport"]');
          if (existingMeta && !pageHasViewportMeta) {
            existingMeta.remove();
          }
        }

        const bg = document.querySelector(`.${classToIdMap.bg}`);
        tmScan && clearInterval(tmScan);
        bg.classList.remove(classToIdMap.visible);
        //('closeTabReceived')
        postMessage({ type: 'goBackHistory' }, '*');
      });

    var object = document.querySelector(`.${classToIdMap.popup}`),
      initX,
      initY,
      firstX,
      firstY;

    object.addEventListener(
      'mousedown',
      function (e) {
        object.classList.add(classToIdMap.dragging);

        e.preventDefault();
        initX = this.offsetLeft;
        initY = this.offsetTop;
        firstX = e.pageX;
        firstY = e.pageY;

        this.addEventListener('mousemove', dragIt, false);

        window.addEventListener(
          'mouseup',
          () => {
            object.classList.remove(classToIdMap.dragging);
            object.removeEventListener('mousemove', dragIt, false);
          },
          false,
        );
      },
      false,
    );

    if (!isMobileDevice()) {
      object.addEventListener(
        'touchstart',
        function (e) {
          object.classList.add(classToIdMap.dragging);
          e.preventDefault();
          initX = this.offsetLeft;
          initY = this.offsetTop;
          var touch = e.touches;
          firstX = touch[0].pageX;
          firstY = touch[0].pageY;

          this.addEventListener('touchmove', swipeIt, { passive: true });

          window.addEventListener(
            'touchend',
            (e) => {
              object.classList.remove(classToIdMap.dragging);
              e.preventDefault();
              object.removeEventListener('touchmove', swipeIt, {
                passive: true,
              });
            },
            false,
          );
        },
        { passive: true },
      );
    }

    function dragIt(e) {
      const styles = window.getComputedStyle(this);
      const elemWidth = +styles.width.split('px')[0];
      const elemHeight = +styles.height.split('px')[0];

      const newLeft = initX + e.pageX - firstX;
      const realLeft = newLeft - elemWidth / 2;
      const newTop = initY + e.pageY - firstY;
      const realTop = newTop - elemHeight / 2;

      if (realLeft > window.innerWidth - 100)
        this.style.left = window.innerWidth - 100 + elemWidth / 2 + 'px';
      else if (realLeft < 100 - elemWidth)
        this.style.left = 100 - elemWidth + elemWidth / 2 + 'px';
      else this.style.left = newLeft + 'px';

      if (realTop > window.innerHeight - 100)
        this.style.top = window.innerHeight - 100 + elemHeight / 2 + 'px';
      else if (realTop < 100 - elemHeight)
        this.style.top = 100 - elemHeight + elemHeight / 2 + 'px';
      else this.style.top = newTop + 'px';
    }

    function swipeIt(e) {
      var contact = e.touches;
      const styles = window.getComputedStyle(this);
      const elemWidth = +styles.width.split('px')[0];
      const elemHeight = +styles.height.split('px')[0];

      const newLeft = initX + contact[0].pageX - firstX;
      const realLeft = newLeft - elemWidth / 2;
      const newTop = initY + contact[0].pageY - firstY;
      const realTop = newTop - elemHeight / 2;

      if (realLeft > window.innerWidth - 100)
        this.style.left = window.innerWidth - 100 + elemWidth / 2 + 'px';
      else if (realLeft < 100 - elemWidth)
        this.style.left = 100 - elemWidth + elemWidth / 2 + 'px';
      else this.style.left = newLeft + 'px';

      if (realTop > window.innerHeight - 100)
        this.style.top = window.innerHeight - 100 + elemHeight / 2 + 'px';
      else if (realTop < 100 - elemHeight)
        this.style.top = 100 - elemHeight + elemHeight / 2 + 'px';
      else this.style.top = newTop + 'px';
    }
  }

  var technicalContainer_display_mode = IS_PROD ? 'none' : 'block';

  let modalTitleColor;
  switch (type) {
    case 'red':
      modalTitleColor = '#F23131';
      break;
    case 'yellow':
      modalTitleColor = '#F2A531';
      break;
    case 'gray':
      modalTitleColor = '#ffffff';
      break;
    // Add more cases as needed
    default:
      modalTitleColor = '#F23131';
  }

  //const shareButtonColor = type == 'red' ? '#06BEE1' : '#5865F2';
  //const modalColor = type == 'red' ? 'red' : 'yellow';
  const modalTypeLogo = chrome.runtime.getURL(
    {
      red: 'logo_alert.svg',
      yellow: 'logo_warning.svg',
      gray: 'logo-sentinel3.svg',
    }[type],
  );

  let modalTag;
  switch (type) {
    case 'red':
      modalTag = 'Security Warning';
      break;
    case 'yellow':
      modalTag = 'Security Warning';
      break;
    case 'gray':
      modalTag = 'Notification';
      break;
    // Add more cases as needed
    default:
      modalTag = 'Security Warning';
  }

  let modalTitleHeadline;
  switch (type) {
    case 'red':
      modalTitleHeadline = 'Security Alert!';
      break;
    case 'yellow':
      modalTitleHeadline = 'Warning';
      break;
    case 'gray':
      modalTitleHeadline = 'Notification';
      break;
    // Add more cases as needed
    default:
      modalTitleHeadline = 'Warning';
  }

  let modalAlertIcon;
  switch (type) {
    case 'red':
      modalAlertIcon = `<svg width="32" height="34" viewBox="0 0 32 34" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="16" cy="16.9773" r="15.1469" fill="#FF4D4D" stroke="#F23131" stroke-width="1.70626"/>
  <path d="M17.9319 21.3071V24.9773H14.0136V21.3071H17.9319ZM18.2857 8.97729L18.0408 18.6924H13.9047L13.7142 8.97729H18.2857Z"/>
  </svg>`;
      break;
    case 'yellow':
      modalAlertIcon = `<svg width="32" height="34" viewBox="0 0 32 34" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="16" cy="16.9773" r="15.1469" fill="#F2A531" stroke="#F29931" stroke-width="1.70626"/>
  <path d="M17.932 21.3071V24.9773H14.0137V21.3071H17.932ZM18.2858 8.97729L18.0409 18.6924H13.9048L13.7144 8.97729H18.2858Z"/>
  </svg>`;
      break;
    case 'gray':
      modalAlertIcon = '';
      break;
    // Add more cases as needed
    default:
      modalAlertIcon = `<svg width="32" height="34" viewBox="0 0 32 34" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="16" cy="16.9773" r="15.1469" fill="#FF4D4D" stroke="#F23131" stroke-width="1.70626"/>
  <path d="M17.9319 21.3071V24.9773H14.0136V21.3071H17.9319ZM18.2857 8.97729L18.0408 18.6924H13.9047L13.7142 8.97729H18.2857Z"/>
  </svg>
  `;
  }

  let contentIcon;
  switch (type) {
    case 'red':
      contentIcon = `<svg width="40" height="41" viewBox="0 0 40 41" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="20" cy="20.1602" r="20" fill="#FF4E45" fill-opacity="0.05"/>
            <circle cx="20" cy="20.1602" r="19.4737" stroke="#F23131" stroke-opacity="0.12" stroke-width="1.05263"/>
            <path d="M24.7427 19.3065L25.6266 18.4226C26.7005 17.3487 26.7005 15.6075 25.6266 14.5335C24.5526 13.4596 22.8114 13.4596 21.7375 14.5335L19.2626 17.0084C18.1887 18.0824 18.1887 19.8236 19.2626 20.8975" stroke="#FF4D4D" stroke-width="1.57895" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M16.4342 19.8368L15.3736 20.8974C14.2996 21.9714 14.2996 23.7126 15.3736 24.7865C16.4475 25.8604 18.1887 25.8604 19.2627 24.7865L21.7375 22.3116C22.8115 21.2377 22.8115 19.4965 21.7375 18.4225" stroke="#FF4D4D" stroke-width="1.57895" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>`;
      break;
    case 'yellow':
      contentIcon = `<svg width="40" height="41" viewBox="0 0 40 41" fill="none" xmlns="http://www.w3.org/2000/svg">
<circle cx="20" cy="20.1602" r="20" fill="#FF4E45" fill-opacity="0.05"/>
<circle cx="20" cy="20.1602" r="19.4737" stroke="#CB6E00" stroke-opacity="0.12" stroke-width="1.05263"/>
<path d="M24.7426 19.3065L25.6265 18.4226C26.7004 17.3486 26.7004 15.6074 25.6265 14.5335C24.5525 13.4595 22.8113 13.4595 21.7374 14.5335L19.2625 17.0084C18.1885 18.0823 18.1885 19.8235 19.2625 20.8974" stroke="#CB6E00" stroke-width="1.57895" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M16.4345 19.8368L15.3738 20.8975C14.2999 21.9714 14.2999 23.7126 15.3738 24.7866C16.4478 25.8605 18.189 25.8605 19.2629 24.7866L21.7378 22.3117C22.8117 21.2378 22.8117 19.4965 21.7378 18.4226" stroke="#CB6E00" stroke-width="1.57895" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`;
      break;
    case 'gray':
      contentIcon = '';
      break;
    // Add more cases as needed
    default:
      contentIcon = `<svg width="40" height="41" viewBox="0 0 40 41" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="20" cy="20.1602" r="20" fill="#FF4E45" fill-opacity="0.05"/>
            <circle cx="20" cy="20.1602" r="19.4737" stroke="#F23131" stroke-opacity="0.12" stroke-width="1.05263"/>
            <path d="M24.7427 19.3065L25.6266 18.4226C26.7005 17.3487 26.7005 15.6075 25.6266 14.5335C24.5526 13.4596 22.8114 13.4596 21.7375 14.5335L19.2626 17.0084C18.1887 18.0824 18.1887 19.8236 19.2626 20.8975" stroke="#FF4D4D" stroke-width="1.57895" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M16.4342 19.8368L15.3736 20.8974C14.2996 21.9714 14.2996 23.7126 15.3736 24.7865C16.4475 25.8604 18.1887 25.8604 19.2627 24.7865L21.7375 22.3116C22.8115 21.2377 22.8115 19.4965 21.7375 18.4225" stroke="#FF4D4D" stroke-width="1.57895" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>`;
  }

  var modalSubTitleHeadline =
    type == 'red'
      ? `Kerberus detected suspicious Web3 activity`
      : `Inconclusive Site Safety Analysis`;

  var modalAlertTitle = 'This site is likely a scam site';
  var modalAlertMessage = `The URL ${HOSTNAME.toString()} appears to be a fraudulent site.`;

  var modalAlertBody =
    type == 'red'
      ? `Continue at your discretion and only after validating that the site is genuine. <a href="https://docs.kerberus.com/kerberus/sentinel3/alert-types" target="_blank" >Read More</a> `
      : `Current findings are insufficient to confirm its safety. This does not necessarily indicate a risk, but caution is advised.&nbsp; <a href="https://docs.kerberus.com/kerberus/sentinel3/alert-types" target="_blank" >Read More</a>`;

  var modalAlertBodyDisclaimer = `Sentinel3 is designed to detect scams on fully operational and live to the public Web3 sites. If this Web3 site is in development or operates with testnets, you may ignore this alert at your own risk.`; //change text for seedAlert

  if (type == 'gray') {
    technicalContainer_display_mode = 'none';
    modalSubTitleHeadline = 'Unverified Contract Interaction';
    modalAlertTitle = 'Summarized message title goes here.';
    modalAlertMessage = `Kerberus has an important statement or message to relay to users. This pop up has the flexibility to use whatever image as the banner. Click read more to expand the message.  Read More`;
    modalAlertBody = '';
  }

  //change text for seedAlert
  if (seedAlert) {
    technicalContainer_display_mode = 'none';
    modalSubTitleHeadline = 'Insecure User Activity Detected';
    modalAlertTitle = 'You are about to share a Secret Seed Phrase!';
    modalAlertBody =
      'You should NEVER share these words with anyone as they provide full access to ALL its associated wallets and will most likely result in the loss of all its crypto assets.';
  }

  // Sample usage
  const htmlString = `
        <link rel="stylesheet" href="${chrome.runtime.getURL('gbk4uga.css')}" />
        <div class="bg">
          <div class="popup">
              <div class="header ${type}">
                <div class="logo"></div>
              </div>
              <div class="bodyWrapper">
                <div class="contentWrapper">
                    <div class="contentMain">
                      <div class="titleContainer">
                          <div class="tag ${type}">${modalTag}</div>
                          <div>
                            <div class="title">${modalTitleHeadline}${modalAlertIcon}</div>
                            <div class="subtitle">${modalSubTitleHeadline}</div>
                          </div>
                      </div>
                      <div class="shareBtnsContainer">
                          <div class="shareContainer">
                            <a class="shareButton twitterButton">
                              <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M11.3464 15.3601L7.48288 10.1828L2.6462 15.3601H0.599976L6.57505 8.96595L0.599976 0.960144H5.85352L9.49488 5.83979L14.0573 0.960144H16.1035L10.4058 7.0582L16.6 15.3601H11.3464ZM13.6251 13.9005H12.2475L3.52986 2.41978H4.90765L8.39914 7.01676L9.00291 7.81446L13.6251 13.9005Z"/>
                              </svg>
                              <span>Share</span>
                            </a>
                          </div>
                          <div class="shareContainer">
                            <a class="shareButton discordButton">
                              <svg width="15" height="17" viewBox="0 0 15 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <g clip-path="url(#clip0_6635_37225)">
                              <path d="M6.61165 6.87189C6.15565 6.87189 5.79565 7.27189 5.79565 7.75989C5.79565 8.24789 6.16365 8.64789 6.61165 8.64789C7.06765 8.64789 7.42765 8.24789 7.42765 7.75989C7.43565 7.27189 7.06765 6.87189 6.61165 6.87189ZM9.53165 6.87189C9.07565 6.87189 8.71565 7.27189 8.71565 7.75989C8.71565 8.24789 9.08365 8.64789 9.53165 8.64789C9.98765 8.64789 10.3477 8.24789 10.3477 7.75989C10.3477 7.27189 9.98765 6.87189 9.53165 6.87189Z" />
                              <path d="M13.4197 0.160156H2.69969C1.79569 0.160156 1.05969 0.896156 1.05969 1.80816V12.6242C1.05969 13.5362 1.79569 14.2722 2.69969 14.2722H11.7717L11.3477 12.7922L12.3717 13.7442L13.3397 14.6402L15.0597 16.1602V1.80816C15.0597 0.896156 14.3237 0.160156 13.4197 0.160156ZM10.3317 10.6082C10.3317 10.6082 10.0437 10.2642 9.80369 9.96016C10.8517 9.66416 11.2517 9.00816 11.2517 9.00816C10.9237 9.22416 10.6117 9.37616 10.3317 9.48016C9.93169 9.64816 9.54769 9.76016 9.17169 9.82416C8.40369 9.96816 7.69969 9.92816 7.09969 9.81616C6.64369 9.72816 6.25169 9.60016 5.92369 9.47216C5.73969 9.40016 5.53969 9.31216 5.33969 9.20016C5.31569 9.18416 5.29169 9.17616 5.26769 9.16016C5.25169 9.15216 5.24369 9.14416 5.23569 9.13616C5.09169 9.05616 5.01169 9.00016 5.01169 9.00016C5.01169 9.00016 5.39569 9.64016 6.41169 9.94416C6.17169 10.2482 5.87569 10.6082 5.87569 10.6082C4.10769 10.5522 3.43569 9.39216 3.43569 9.39216C3.43569 6.81616 4.58769 4.72816 4.58769 4.72816C5.73969 3.86416 6.83569 3.88816 6.83569 3.88816L6.91569 3.98416C5.47569 4.40016 4.81169 5.03216 4.81169 5.03216C4.81169 5.03216 4.98769 4.93616 5.28369 4.80016C6.13969 4.42416 6.81969 4.32016 7.09969 4.29616C7.14769 4.28816 7.18769 4.28016 7.23569 4.28016C7.72369 4.21616 8.27569 4.20016 8.85169 4.26416C9.61169 4.35216 10.4277 4.57616 11.2597 5.03216C11.2597 5.03216 10.6277 4.43216 9.26769 4.01616L9.37969 3.88816C9.37969 3.88816 10.4757 3.86416 11.6277 4.72816C11.6277 4.72816 12.7797 6.81616 12.7797 9.39216C12.7797 9.39216 12.0997 10.5522 10.3317 10.6082Z"/>
                              </g>
                              <defs>
                              <clipPath id="clip0_6635_37225">
                              <rect width="14.4" height="16" fill="white" transform="translate(0.599976 0.160156)"/>
                              </clipPath>
                              </defs>
                              </svg>
                              <span>Discuss</span>
                            </a>
                          </div>
                      </div>
                    </div>
                    <div class="content ${type}">
                      ${contentIcon ? contentIcon : ''}
                      <div class="messageWrapper">
                        <div class="contentTitle">${modalAlertTitle}</div>
                        <p class="contentMessage">${modalAlertMessage}</p>
                      </div>
                    </div>
                    <p class="alertBody">${modalAlertBody}<span class="alertBodyDisclaimer">${modalAlertBodyDisclaimer}</span></p>
                    
                    <div class="technicalContainer">
                        <div class="technicalTitle">Technical Details:</div>
                        <div class="technicalMessage"></div>
                    </div>
                </div>
                <div class="footer">
                    <div class="buttonsContainer">
                      <div class="button ignoreButton">
                        Ignore & Proceed
                      </div>
                      <a class="button exitButton" href="#" target="_blank">Exit Site</a>
                    </div>
                </div>
              </div>
          </div>
        </div>
        `;

  const cssString = `
          .bg {
            *:where(:not(html, iframe, canvas, img, svg, video, audio):not(svg *, symbol *)) {all: unset;display: revert;}*, *::before, *::after {box-sizing: border-box;}html {-moz-text-size-adjust: none;-webkit-text-size-adjust: none;text-size-adjust: none;}a, button {cursor: revert;}ol, ul, menu, summary {list-style: none;}img {max-inline-size: 100%;max-block-size: 100%;}table {border-collapse: collapse;}input, textarea {-webkit-user-select: auto;}textarea {white-space: revert;}meter {-webkit-appearance: revert;appearance: revert;}:where(pre) {all: revert;box-sizing: border-box;}::placeholder {color: unset;}:where([hidden]) {display: none;}:where([contenteditable]:not([contenteditable="false"])) {-moz-user-modify: read-write;-webkit-user-modify: read-write;overflow-wrap: break-word;-webkit-line-break: after-white-space;-webkit-user-select: auto;}:where([draggable="true"]) {-webkit-user-drag: element;}:where(dialog:modal) {all: revert;box-sizing: border-box;}::-webkit-details-marker {display: none;}Copied
         }
            
          @keyframes moveBackground {
            0% {
              background-position: 0% 0%;
          }
          100% {
              background-position: 100% 0%;
          }
          }
          details {
            display: inline-block !important;
          }
          details summary {
            display: inline-block !important;
            text-decoration: underline !important;
          }
         details summary > * {
          display: inline;
        }

          }
          .popup svg {
            display: inline-block !important;
          }
            .bg{
              position: fixed;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              z-index: 9999999999;
              display: block;
              visibility: hidden;
              opacity: 0;
              text-shadow: none;
              text-align: left;
              color: #000;
              background: rgb(31 36 47 / 75%);
              -webkit-transition: all 0.3s ease;
              -moz-transition: all 0.3s ease;
              -ms-transition: all 0.3s ease;
              -o-transition: all 0.3s ease;
              transition: all 0.3s ease;
              pointer-events: none;
              backdrop-filter: blur(10px);
              -webkit-backdrop-filter: blur(10px);
            }
            .bg.visible{
              opacity: 1;
              visibility: visible;
            }
            .popup{
              text-transform: none;
              cursor: grab;
              position: absolute;
              pointer-events: all;
              line-height: 1.7!important;
              top: 60%;
              left: 50%;
              opacity: 0;
              visibility: hidden;
              width: 720px;
              max-width: 100%;
              transform: translate(-50%, -50%);
              overflow: hidden;
              display: block;
              font-family:"halyard-text"!important;
              -webkit-transition: all 0.3s ease;
              -moz-transition: all 0.3s ease;
              -ms-transition: all 0.3s ease;
              -o-transition: all 0.3s ease;
              transition: all 0.3s ease;
              border-radius:15px;
              border: 1px solid rgba(0, 0, 0, 0.3);
              -webkit-box-shadow: 0 3px 7px rgba(0, 0, 0, 0.3);
              -moz-box-shadow: 0 3px 7px rgba(0, 0, 0, 0.3);
              box-shadow: 0 3px 7px rgba(0, 0, 0, 0.3);
              -webkit-background-clip: padding-box;
              -moz-background-clip: padding-box;
              background-clip: padding-box;
            }
            .popup.dragging{
              -webkit-transition: none;
              -moz-transition: none;
              -ms-transition: none;
              -o-transition: none;
              transition: none;
            }
            .bg.visible .popup{
              top: 50%;
              opacity: 1;
              visibility: visible;
              display: flex;
              flex-direction: column;
            }
            .popup .header{
              direction: ltr;
              text-transform: none;
              padding: 14px 20px;
              background: ${modalTitleColor};
              position: relative;
              display: flex;
              border-radius: 15px 15px 0 0;
              box-shadow: 0px 4.58px 4.58px 0px #0000000A;
            }
            .dark-mode .popup .header.gray {
              background: #26293F;
            }
            .popup .logo{
              background-image: url('${modalTypeLogo}');
              background-size: cover;
              background-repeat: no-repeat;
              background-position: center;
              width: 144px;
              height: 37px;
              z-index: 10;
            }
            .dark-mode .popup .header.gray .logo {
              background-image: url('${chrome.runtime.getURL(
                'logo-sentinel3-d.svg',
              )}');
            }
            .popup .contentMain{
              display: flex;
              align-items: center;
              justify-content: space-between;
            }
            .popup .titleContainer{
              direction: ltr;
              flex: 1;
              color: #fff;
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: start;
              gap: 7px;
            }
            .popup .tag{
              padding: 5px 9px 3px 9px;
              border-radius: 114.5px;
              font-size: 11.45px!important;
              font-weight: 700!important;
              line-height: 13.86px!important;
              text-align: center;
            }
            .popup .tag.red{
              background: #F335350A;
              border: 1.15px solid #F3353559;
              color: #F33535;
            }
            .popup .tag.yellow{
              background: #F2A5310A;
              border: 1.15px solid #F2A53159;
              color: #CB6E00;
            }
            .popup .tag.gray{
              background: #F7F8FC;
              border: 1.15px solid #DFE0EC;
              color:  #565975;
            }
            .dark-mode .popup .tag.gray{
              background: #111325;
              border: 1.15px solid #12152D;
              color: #B8B9D0;
            }

            .popup .title{
              direction: ltr;
              color: #07091B;
              font-family:"halyard-text"!important;
              display: flex;
              align-items: center;
              gap: 12px;
              font-size: 42px!important;
              font-weight: 900!important;
              line-height: 48px!important;
              letter-spacing: -0.02em;
              text-align: left;

            }
            .dark-mode .popup .title{
              color: #F7F8FC;
            }
            .popup .title svg{
              fill: #ffffff;
            }
            .dark-mode .popup .title svg{
              fill: #1F2134;
            }
            .popup .subtitle{
              direction: ltr;
              text-transform: none;
              position: relative;
              margin: 10px 0 0px 0;
              color: #373A54;
              font-family:"halyard-text"!important;
              font-size: 16px!important;
              font-weight: 300!important;
              line-height: 28px!important;
              text-align: left;
            }
            .dark-mode .popup .subtitle{
              color: #B8B9D0;
            }
            .popup .subtitle::after{
              /* content: ''; */
              display: none;
              position: absolute;
              bottom: 0;
              left: 0;
              width: 75px;
              height: 1px;
              background-color: #fff;
            }
            .popup .bodyWrapper{
              direction: ltr;
              text-transform: none;
              background: #ffffff;
              border-radius: 0 0 15px 15px;
              width: 100%;
              max-width: 100%;
              box-sizing: border-box;
              border-top: 0;
            }
            .dark-mode .popup .bodyWrapper{
              background: #1F2134;
            }
            .popup .contentWrapper{
              direction: ltr;
              display: flex;
              flex-direction: column;
              flex-wrap: nowrap;
              justify-content: space-between;
              padding: 32px 32px 0px 32px;
              gap: 24px;
            }
            .popup .footer{
              padding: 32px;
            }
            .popup .content{
              padding: 12px;
              border-radius: 6px;
              display: flex;
              gap: 12px;
              align-items: center;
            }
            .popup .content.red{
              background: #FF4E4505;
              border: 1px solid #FF4E4559;
            }
            .popup .content.yellow{
              background: #FF4E4505;
              border: 1px solid #FF4E4559;
            }
            .popup .content.gray{
              background: #F7F8FC;
              border: 1px solid #DFE0EC;
            }
            
            .dark-mode .popup .content{
              background: #111325;
              border: 1px solid #12152D;
            }
            .popup .messageWrapper
            {

            }
            .popup .contentTitle{
              font-size: 16px!important;
              font-weight: 700!important;
              line-height: 28px!important;
              text-align: left;
              font-family:"halyard-text"!important;
            }
            .popup .red .contentTitle
            {
              color: #F23131;
            }
            .popup .yellow .contentTitle
            {
              color: #CB6E00;
            }
            .popup .gray .contentTitle
            {
              color: #373A54;
            }
            .popup .contentMessage{
              font-size: 14px!important;
              font-weight: 300!important;
              line-height: 24px!important;
              text-align: left;
              font-family:"halyard-text"!important;
            }
            .popup .red .contentMessage
            {
              color: #F23131;
            }
            .popup .yellow .contentMessage
            {
              color: #CB6E00;
            }
            .popup .gray .contentMessage
            {
              color: #373A54;
            }


            .dark-mode .popup .gray .contentTitle{
              color: #B8B9D0;
            }
            .dark-mode .popup .gray .contentMessage{
              color: #8789A6;
            }


            .popup .alertBody{
              font-size: 16px!important;
              font-weight: 300!important;
              line-height: 28px!important;
              text-align: left;
              color: #373A54;
            }
            .dark-mode .popup .alertBody{
              color: #B8B9D0;
            }
            .popup .alertBodyDisclaimer{
              display: block !important;
              width: 100% !important;
              margin-top: 8px !important; /* Optional: adjust spacing */
              font-size: 14px!important;
              font-weight: 300!important;
              line-height: 24px!important;
              text-align: left;
              font-style: italic;
              color: #373A54;
            }

            .dark-mode .popup .alertBodyDisclaimer{
              color: #B8B9D0;
            }
            .popup .technicalContainer{
              display: ${technicalContainer_display_mode};
              display: none !important; /* Delete this later!!! IAN */
              margin: 20px 0;
              background: #FFC6C6;
              border-radius: 7px;
              padding: 15px 40px;
              font-style: italic;
              font-size: 15px!important;
            }
            .popup .technicalContainer a{
              color: #0000EE;
            }
            .popup a:link, a:visited, a:hover, a:active, a:focus {
              color: inherit;
              text-decoration: underline;
          }
            .popup .technicalTitle{
              color: black;
              text-transform: none;
              font-weight: 700!important;
              font-family:"halyard-text"!important;
            }
            .popup .technicalMessage{
              text-transform: none;
              color: #333;
              font-family:"halyard-text"!important;
            }
            .popup .technicalMessage a{
              text-decoration: none;
              font-family:"halyard-text"!important;
            }
            .popup .shareContainer{
              text-transform: none;
              color: #f4f4f4;
              font-size: 13px!important;
            }
            .popup .shareButton{
              border: 1px solid #DFE0EC;
              padding: 2px 12px;
              display: flex;
              border-radius: 100px;
              font-family:"halyard-text"!important;
              font-size: 14px!important;
              font-weight: 400!important;
              line-height: 24px!important;
              text-align: center;
              text-decoration: none;
              align-items: center;
              justify-content: center;
              gap: 6px;
              color: #373A54!important;
            }
            .popup .shareButton span{
              margin-bottom: 2px;
            }
            .popup .twitterButton svg {
              text-transform: none;
              width: auto;
              -webkit-transition: all 0.3s ease;
              -moz-transition: all 0.3s ease;
              -ms-transition: all 0.3s ease;
              -o-transition: all 0.3s ease;
              transition: all 0.3s ease;
            }
            .popup .discordButton svg {
              text-transform: none;
              width: auto;
              -webkit-transition: all 0.3s ease;
              -moz-transition: all 0.3s ease;
              -ms-transition: all 0.3s ease;
              -o-transition: all 0.3s ease;
              transition: all 0.3s ease;
            }
            .popup .shareButton svg{
              fill: #373A54;
            }
            .dark-mode .popup .shareButton{
              border: 1px solid #12152D;
              color: #B8B9D0;
            }
            .dark-mode .popup .shareButton svg{
              fill: #B8B9D0;
            }
            .popup .shareButton:hover{
              cursor: pointer;
            }
            .popup .shareButton:hover svg{
            }
            .popup .shareMessage{
              text-transform: none;
              flex: 1;
              font-size: 13px!important;
              font-family:"halyard-text"!important;
              font-weight: 400!important;
              color: #000;
            }
            .popup .buttonsContainer{
              text-transform: none;
              width: 100%;
              display: flex;
              align-items: stretch;
              flex-direction: row;
              flex-wrap: nowrap;
              justify-content: space-between;
              gap: 12px;
            }
            .popup .shareBtnsContainer{
              text-transform: none;
              display: flex;
              align-items: stretch;
              flex-direction: row;
              flex-wrap: nowrap;
              justify-content: flex-start;
              gap: 12px;
            }
            .popup .button
            {
              display: flex;
              justify-content: center;
              align-items: center;
              text-transform: none;
              padding: 8px 12px;
              font-size: 16px!important;
              line-height: 28px!important;
              font-weight: 600!important;
              text-align: center;
              text-decoration: none!important;
              height: 44px;
              border-radius: 100px;
              font-family:"halyard-text"!important;
              cursor: pointer;
              flex: 1;
              -webkit-transition: all 0.3s ease;
              -moz-transition: all 0.3s ease;
              -ms-transition: all 0.3s ease;
              -o-transition: all 0.3s ease;
              transition: all 0.3s ease;
            }
            .popup a.exitButton{
              background: #111325;
              color: #ffffff;
            }
            .popup .ignoreButton {
              color: #111325;
              border: 1px solid #B8B9D0;
            }
            .dark-mode .popup a.exitButton{
              background: #F7F8FC;
              color: #07091B;
            }
            .dark-mode .popup .ignoreButton {
              background: #111325;
              color: #8789A6;
              border: 1px solid #12152D
            }
            

            .popup .exitButton:hover{
              cursor: pointer;
              background: #111325;
            }

            /* Mobile-specific styles */
      
  @media (pointer: coarse) {


    .bg {
        backdrop-filter: none !important;
        background-color: rgba(31, 36, 47, 0.9) !important;
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        width: 100vw !important;
        height: 100vh !important;
        overflow: hidden !important;
    }
    .popup {
        width: 100vw !important;
        max-width: 100vw !important;

        left: 0 !important;
        top: 50% !important;  
        transform: translateY(-50%) !important; /* Center vertically */

        border-radius: 0 !important;

        display: flex !important;
        flex-direction: column !important;

        overflow: hidden !important; /* Hide overflow to contain content */
    }
      .popup .content-wrapper {
          flex: 1 1 auto !important; 
          padding: 16px !important;
          overflow-y: auto !important; /* Enable vertical scrolling if content overflows */
    }
          .popup .footer {
          padding: 16px !important;
    }

  .popup .button {
    height: 50px !important;
        font-size: 18px !important;
    }

    .bg.visible .popup{
        top: 50% !important;
        left: 0 !important;
        transform: translateY(-50%) !important; /* Ensure transform is applied */
    }

          /* Disable dragging on mobile */
    .popup {
        touch-action: none !important;
    }



}
            
        `;

  if (isMobileDevice) {
    // Check if the viewport meta tag already exists
    var existingMeta = document.querySelector('meta[name="viewport"]');

    if (!existingMeta) {
      pageHasViewportMeta = false;
      // Create a new meta tag
      var metaViewport = document.createElement('meta');
      metaViewport.name = 'viewport';
      metaViewport.content = 'width=device-width, initial-scale=1';

      // Insert the meta tag into the head
      document.head.appendChild(metaViewport);
    } else {
      pageHasViewportMeta = true;
    }
  }

  replaceClassWithId(htmlString, cssString);

  //postMessage({ type: 'playMdSound' }, '*');
};

async function injectUiLoader() {
  if (document.getElementById('KerberusLoader')) return;

  //prepare html to bypass safe HTML error
  const escapeHTMLPolicy = window.trustedTypes.createPolicy('forceInner', {
    createHTML: (to_escape) => to_escape,
  });

  var loaderDiv = document.createElement('div');
  loaderDiv.setAttribute('id', 'KerberusLoader');
  loaderDiv.style.cssText = `z-index: 2147483642; position: fixed;display: none; top: 50%;left: 50%; transform: translate(-50%, -50%);width: 100%; height: 100%`;

  var html = `
    <head>
      <link href='${chrome.runtime.getURL(
        '/ui-loader.css',
      )}' rel='stylesheet' type='text/css'>
    </head>
    <div class='kr_loader_container'>
      <div class='kr_popup_area'>
        <div class='kr_loader_content_area'>
          <div class='kr_ring'>
            <img src='${chrome.runtime.getURL('/logo_loader.png')}' />
            <span></span>
          </div>
          <div class='kr_loader_title'>Scanning Website....</div>
          <p class='kr_loader_textup'> Running a security test for</p>
          <p class='kr_loader_textdown'>${HOSTNAME.toString()}</p>
        </div>
        <div class='kr_powered_by'>
          <span>powered by</span>
          <div class='kr_logo_footer'>
            <svg width="158" height="16" viewBox="0 0 158 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21.5518 0.216214L14.6234 7.07518L21.4903 15.7731H14.8691L10.975 10.6579L8.61636 12.9407V15.7836H3.05156V2.98517L0.766676 0.216214H8.61636V6.21913L14.5865 0.216214H21.5518Z"/>
              <path fill-rule="evenodd" clip-rule="evenodd" d="M0.307709 0H8.83287V5.69461L14.4964 0H22.0777L14.9131 7.09286L21.9367 15.9893H14.7617L10.9503 10.9828L8.83287 13.0323V15.9999H2.83505V3.06277L0.307709 0ZM1.22564 0.432428L3.26807 2.90756V15.5674H8.39985V12.8492L10.9996 10.333L14.9765 15.5569H21.0439L14.3337 7.0575L21.0258 0.432428H14.6767L8.39985 6.74365V0.432428H1.22564Z"/>
              <path d="M38.6871 3.7975H28.277V6.3359H38.0331V9.72745H28.277V12.2658H38.6871V15.7838H23.4885V0.279558H38.6871V3.7975Z"/>
              <path fill-rule="evenodd" clip-rule="evenodd" d="M23.272 0.063344H38.9036V4.01372H28.4935V6.11968H38.2497V9.94366H28.4935V12.0496H38.9036V16H23.272V0.063344ZM23.705 0.495772V15.5676H38.4706V12.4821H28.0604V9.51123H37.8166V6.55211H28.0604V3.58129H38.4706V0.495772H23.705Z"/>
              <path d="M56.7769 11.5391L59.7196 15.7838H54.5725L51.6088 11.5391H47.6958V15.7838H42.9179V0.279558H57.0933C57.5891 0.279558 58.0215 0.532345 58.3801 1.03792C58.7387 1.54349 58.918 2.14386 58.918 2.83902V8.96909C58.918 9.66425 58.7387 10.2752 58.3801 10.7702C58.0215 11.2758 57.5996 11.5286 57.0933 11.5286H56.7769V11.5391ZM53.9819 7.65249V4.16615H47.6958V7.65249H53.9819Z"/>
              <path fill-rule="evenodd" clip-rule="evenodd" d="M42.7013 0.063344H57.0933C57.6762 0.063344 58.1685 0.365479 58.5568 0.912942C58.9444 1.45944 59.1345 2.10478 59.1345 2.83902V8.96909C59.1345 9.70168 58.9452 10.3585 58.5561 10.8961C58.1878 11.415 57.7349 11.714 57.1813 11.7425L60.1328 16H54.4596L51.4958 11.7553H47.9123V16H42.7013V0.063344ZM43.1344 0.495772V15.5676H47.4792V11.3229H51.7218L54.6855 15.5676H59.3064L56.5604 11.6066V11.3123H57.0933C57.5117 11.3123 57.874 11.1097 58.2034 10.6452L58.2047 10.6435C58.5324 10.1911 58.7015 9.62644 58.7015 8.96909V2.83902C58.7015 2.18293 58.533 1.62754 58.2034 1.16289C57.8745 0.69921 57.5019 0.495772 57.0933 0.495772H43.1344ZM47.4792 3.94993H54.1984V7.86871H47.4792V3.94993ZM47.9123 4.38236V7.43628H53.7654V4.38236H47.9123Z"/>
              <path d="M99.3271 3.7975H88.917V6.3359H98.6732V9.72745H88.917V12.2658H99.3271V15.7838H84.1286V0.279558H99.3271V3.7975Z"/>
              <path fill-rule="evenodd" clip-rule="evenodd" d="M83.9121 0.063344H99.5436V4.01372H89.1335V6.11968H98.8897V9.94366H89.1335V12.0496H99.5436V16H83.9121V0.063344ZM84.3451 0.495772V15.5676H99.1106V12.4821H88.7005V9.51123H98.4567V6.55211H88.7005V3.58129H99.1106V0.495772H84.3451Z"/>
              <path d="M117.416 11.5391L120.359 15.7838H115.212L112.248 11.5391H108.335V15.7838H103.557V0.279558H117.733C118.228 0.279558 118.661 0.532345 119.019 1.03792C119.378 1.54349 119.557 2.14386 119.557 2.83902V8.96909C119.557 9.66425 119.378 10.2752 119.019 10.7702C118.661 11.2758 118.239 11.5286 117.733 11.5286H117.416V11.5391ZM114.621 7.65249V4.16615H108.335V7.65249H114.621Z"/>
              <path fill-rule="evenodd" clip-rule="evenodd" d="M103.341 0.063344H117.733C118.315 0.063344 118.808 0.365479 119.196 0.912942C119.584 1.45944 119.774 2.10478 119.774 2.83902V8.96909C119.774 9.70167 119.584 10.3585 119.195 10.8961C118.827 11.415 118.374 11.714 117.821 11.7425L120.772 16H115.099L112.135 11.7553H108.551V16H103.341V0.063344ZM103.774 0.495772V15.5676H108.118V11.3229H112.361L115.325 15.5676H119.946L117.2 11.6066V11.3123H117.733C118.151 11.3123 118.513 11.1097 118.843 10.6452L118.844 10.6435C119.172 10.1911 119.341 9.62644 119.341 8.96909V2.83902C119.341 2.18293 119.172 1.62754 118.843 1.16289C118.514 0.69921 118.141 0.495772 117.733 0.495772H103.774ZM108.118 3.94993H114.838V7.86871H108.118V3.94993ZM108.551 4.38236V7.43628H114.405V4.38236H108.551Z"/>
              <path d="M134.451 0.279558H139.229V13.2138C139.229 13.93 139.05 14.5409 138.702 15.036C138.354 15.531 137.921 15.7838 137.415 15.7838H125.855C125.349 15.7838 124.916 15.531 124.568 15.036C124.22 14.5409 124.041 13.93 124.041 13.2138V0.279558H128.819V11.8972H134.451V0.279558Z"/>
              <path fill-rule="evenodd" clip-rule="evenodd" d="M123.825 0.063344H129.035V11.681H134.235V0.063344H139.446V13.2138C139.446 13.967 139.257 14.6231 138.879 15.1602C138.5 15.6994 138.007 16 137.415 16H125.855C125.263 16 124.77 15.6994 124.391 15.1602C124.014 14.6231 123.825 13.967 123.825 13.2138V0.063344ZM124.258 0.495772V13.2138C124.258 13.893 124.427 14.4587 124.746 14.9117C125.063 15.3626 125.434 15.5676 125.855 15.5676H137.415C137.836 15.5676 138.208 15.3626 138.525 14.9117C138.843 14.4587 139.013 13.893 139.013 13.2138V0.495772H134.668V12.1134H128.602V0.495772H124.258Z"/>
              <path d="M153.837 7.11532C153.932 7.13639 154.101 7.15745 154.343 7.19958C154.596 7.24172 154.765 7.27331 154.871 7.28385C154.976 7.29438 155.134 7.33651 155.356 7.38917C155.577 7.44184 155.735 7.50503 155.841 7.56823C155.946 7.63143 156.094 7.71569 156.273 7.82102C156.463 7.92634 156.59 8.04221 156.685 8.17913C156.769 8.30553 156.875 8.47405 157.001 8.66364C157.128 8.85323 157.212 9.07442 157.265 9.2956C157.318 9.52732 157.37 9.80118 157.412 10.1172C157.455 10.4331 157.476 10.7807 157.476 11.1599V13.2138C157.476 13.93 157.296 14.5409 156.938 15.036C156.579 15.531 156.157 15.7838 155.651 15.7838H142.794V11.9077H152.687V10.4226C149.46 9.65372 147.287 9.17974 146.169 8.97962C146.085 8.95856 145.969 8.93749 145.821 8.90589C145.505 8.85323 145.273 8.82163 145.114 8.7795C144.956 8.7479 144.745 8.69524 144.471 8.61097C144.197 8.52671 143.986 8.43192 143.838 8.32659C143.691 8.22126 143.522 8.0738 143.332 7.89475C143.142 7.71569 142.994 7.51557 142.889 7.28385C142.783 7.05213 142.699 6.76774 142.625 6.43069C142.551 6.09364 142.52 5.70393 142.52 5.28262V2.83902C142.52 2.14386 142.699 1.53296 143.047 1.03792C143.395 0.532345 143.828 0.279558 144.334 0.279558H157.054V4.15562H147.298V5.64074C150.525 6.40963 152.687 6.89413 153.816 7.10479L153.837 7.11532Z"/>
              <path fill-rule="evenodd" clip-rule="evenodd" d="M144.334 0.495772C143.914 0.495772 143.543 0.700038 143.226 1.16041L143.224 1.16217C142.906 1.61569 142.736 2.18162 142.736 2.83902V5.28262C142.736 5.69434 142.767 6.06749 142.837 6.38449C142.909 6.71437 142.99 6.98224 143.086 7.19438C143.179 7.39838 143.309 7.57598 143.481 7.73756C143.668 7.91475 143.829 8.05407 143.964 8.15065C144.085 8.23697 144.271 8.3234 144.535 8.40432C144.804 8.48695 145.007 8.53762 145.157 8.56748L145.164 8.56882L145.17 8.57058C145.277 8.59906 145.421 8.62214 145.621 8.65429C145.692 8.66571 145.77 8.67827 145.857 8.69262L145.866 8.69425C145.917 8.70516 145.967 8.71556 146.015 8.72517C146.091 8.74068 146.16 8.75473 146.214 8.76805C147.341 8.97007 149.517 9.44497 152.738 10.2123L152.904 10.2519V12.1239H143.011V15.5676H155.651C156.07 15.5676 156.433 15.3642 156.762 14.9092C157.09 14.4574 157.259 13.893 157.259 13.2138V11.1599C157.259 10.7885 157.239 10.4507 157.198 10.1457C157.157 9.83749 157.105 9.57049 157.054 9.34461C157.005 9.14142 156.93 8.94612 156.821 8.78357C156.757 8.68733 156.698 8.59663 156.645 8.5149C156.64 8.5067 156.635 8.49861 156.63 8.49061C156.583 8.41904 156.542 8.35571 156.506 8.30073C156.432 8.19479 156.332 8.10077 156.168 8.01002L156.164 8.00744C156.088 7.96275 156.016 7.92093 155.95 7.88279C155.864 7.83309 155.789 7.78953 155.73 7.75363C155.649 7.70547 155.514 7.64899 155.306 7.59951C155.255 7.58746 155.209 7.57634 155.167 7.56624C155.014 7.52929 154.917 7.50576 154.849 7.49899C154.764 7.49053 154.643 7.46977 154.487 7.44318C154.431 7.43371 154.372 7.42351 154.308 7.41286C154.21 7.39596 154.118 7.38141 154.037 7.36884C153.933 7.35241 153.846 7.33892 153.79 7.32639L153.764 7.32062L153.746 7.31172C152.604 7.09705 150.446 6.6131 147.247 5.85105L147.081 5.81144V3.9394H156.837V0.495772H144.334ZM142.869 0.914546C143.248 0.36433 143.742 0.063344 144.334 0.063344H157.27V4.37183H147.514V5.47001C150.65 6.21606 152.753 6.68634 153.856 6.89226L153.886 6.89783L153.909 6.90943C153.953 6.91807 154.008 6.92666 154.08 6.93783C154.159 6.94991 154.256 6.965 154.38 6.98644C154.454 6.99886 154.52 7.0101 154.578 7.02005C154.725 7.04503 154.824 7.06185 154.892 7.06871C154.993 7.07874 155.131 7.11222 155.289 7.15064C155.327 7.15984 155.366 7.16933 155.406 7.17884C155.641 7.23469 155.822 7.3046 155.952 7.38283C156.011 7.4179 156.081 7.45861 156.163 7.50644C156.228 7.5441 156.301 7.58616 156.381 7.63335C156.595 7.75252 156.747 7.88937 156.863 8.05606L156.865 8.05918C156.904 8.1174 156.947 8.18415 156.993 8.25568L157.009 8.28047C157.062 8.362 157.119 8.45036 157.181 8.5437C157.326 8.76005 157.419 9.00673 157.475 9.24552L157.476 9.24768C157.53 9.48502 157.584 9.76536 157.627 10.0886C157.671 10.4156 157.692 10.7729 157.692 11.1599V13.2138C157.692 13.9671 157.503 14.6245 157.113 15.1627C156.726 15.6978 156.245 16 155.651 16H142.578V11.6915H152.471V10.5933C149.335 9.8478 147.223 9.38794 146.131 9.19244L146.124 9.19115L146.117 9.18938C146.069 9.1775 146.014 9.1663 145.944 9.15209C145.897 9.14257 145.843 9.13169 145.781 9.11836C145.709 9.10641 145.64 9.09536 145.574 9.08484C145.368 9.0518 145.195 9.02399 145.065 8.9902C144.899 8.95675 144.683 8.9024 144.407 8.81763C144.122 8.73002 143.887 8.62687 143.712 8.50253C143.552 8.38845 143.375 8.23285 143.183 8.05194C142.975 7.8554 142.81 7.63275 142.692 7.37332C142.577 7.12201 142.489 6.82111 142.414 6.4769C142.336 6.11979 142.303 5.71352 142.303 5.28262V2.83902C142.303 2.10649 142.493 1.45094 142.869 0.914546Z"/>
              <path d="M63.5076 0.216214H73.9599C78.1999 0.216214 79.7398 1.33269 79.7398 4.34506C79.7398 5.86178 79.4234 6.65173 78.5268 7.1889C77.8624 7.58915 77.3666 7.74714 76.5334 7.84194V7.91567C79.1913 8.10526 80.0562 8.99001 80.0562 11.6021C80.0562 14.7304 78.5585 15.7836 74.0759 15.7836H63.5076V0.216214ZM71.9454 6.45161C73.0985 6.43757 73.7735 6.3849 73.9704 6.29362C74.4345 6.12509 74.6349 5.68272 74.6349 4.96649C74.6349 3.91321 74.2868 3.66043 72.8419 3.66043H68.6863V6.46214H71.9454V6.45161ZM72.1141 12.35C74.3396 12.35 74.9197 12.0445 74.9197 10.907C74.9197 9.96955 74.7193 9.62197 74.1075 9.43238C73.9739 9.38323 73.4255 9.34461 72.4622 9.31652H68.6757V12.35H72.1141Z"/>
              <path fill-rule="evenodd" clip-rule="evenodd" d="M63.2911 0H73.9599C76.0866 0 77.592 0.277367 78.566 0.975331C79.5604 1.68791 79.9563 2.80291 79.9563 4.34506C79.9563 5.11474 79.8766 5.72496 79.6691 6.21808C79.4581 6.71929 79.1215 7.08469 78.6385 7.37414C78.288 7.58527 77.9803 7.73228 77.6507 7.8387C78.4287 7.9915 79.0228 8.25799 79.4478 8.70083C80.0566 9.33505 80.2727 10.2824 80.2727 11.6021C80.2727 13.1982 79.8895 14.3302 78.8713 15.043C77.8767 15.7393 76.3201 15.9999 74.0759 15.9999H63.2911V0ZM63.7241 0.432428V15.5674H74.0759C76.3143 15.5674 77.7478 15.3014 78.6227 14.6889C79.474 14.093 79.8397 13.1343 79.8397 11.6021C79.8397 10.3098 79.6234 9.50865 79.1352 9.00006C78.6454 8.48976 77.8358 8.22533 76.518 8.13133L76.3169 8.11699V7.64895L76.5089 7.62711C77.3151 7.53539 77.7803 7.38608 78.415 7.00376C78.8284 6.75606 79.0985 6.45768 79.2699 6.05054C79.4447 5.63521 79.5233 5.0921 79.5233 4.34506C79.5233 2.87484 79.1491 1.92541 78.3136 1.32666C77.4576 0.713298 76.0731 0.432428 73.9599 0.432428H63.7241ZM68.4698 3.44421H72.8419C73.2075 3.44421 73.5143 3.46005 73.768 3.50325C74.0214 3.54639 74.2367 3.6192 74.4078 3.74377C74.7664 4.00488 74.8514 4.43038 74.8514 4.96649C74.8514 5.3413 74.7995 5.66784 74.6713 5.93028C74.5405 6.19779 74.3346 6.38925 74.0524 6.4939C73.9763 6.52739 73.8767 6.55029 73.7684 6.56816C73.651 6.58754 73.5054 6.60371 73.3334 6.61714C73.0325 6.64061 72.6416 6.65636 72.1619 6.66467V6.67836H68.4698V3.44421ZM71.7288 6.24593V6.23802L71.9427 6.23541C72.5173 6.22841 72.969 6.21182 73.2996 6.18602C73.4651 6.17311 73.5972 6.15813 73.6978 6.14152C73.8031 6.12414 73.858 6.10738 73.8792 6.09751L73.8877 6.0936L73.8964 6.09042C74.0742 6.02589 74.1979 5.91297 74.2821 5.7406C74.3701 5.56068 74.4184 5.30791 74.4184 4.96649C74.4184 4.44933 74.3293 4.22179 74.1527 4.09319C74.0562 4.02291 73.9135 3.96668 73.6952 3.92952C73.4773 3.89241 73.1988 3.87664 72.8419 3.87664H68.9028V6.24593H71.7288ZM68.4592 9.10031H72.4685C72.9513 9.11439 73.3326 9.13126 73.6112 9.15087C73.7504 9.16067 73.8661 9.17133 73.9572 9.18305C74.0394 9.19362 74.118 9.20693 74.1762 9.22727C74.5113 9.33184 74.7701 9.49231 74.9323 9.78433C75.0871 10.0628 75.1362 10.4313 75.1362 10.907C75.1362 11.2068 75.0985 11.4753 74.9901 11.7046C74.8787 11.9402 74.7005 12.1182 74.4509 12.2471C74.2072 12.373 73.8976 12.4511 73.5185 12.499C73.138 12.547 72.6741 12.5662 72.1141 12.5662H68.4592V9.10031ZM68.8922 9.53274V12.1337H72.1141C72.6669 12.1337 73.11 12.1147 73.4642 12.07C73.8198 12.025 74.0725 11.9557 74.252 11.863C74.4256 11.7733 74.5315 11.6617 74.5985 11.52C74.6684 11.3722 74.7032 11.1759 74.7032 10.907C74.7032 10.4452 74.6521 10.1712 74.5537 9.99415C74.4636 9.83193 74.3178 9.72394 74.0434 9.63888L74.0326 9.63554C74.0326 9.63554 74.0296 9.6342 74.0235 9.63263C74.0169 9.63094 74.008 9.6289 73.9963 9.62661C73.9728 9.622 73.9416 9.61704 73.9019 9.61193C73.8225 9.60171 73.7159 9.59174 73.5808 9.58223C73.3115 9.56327 72.938 9.54673 72.459 9.53274H68.8922Z"/>
            </svg>
          </div>
        </div>
      </div>
    </div>
  `;

  loaderDiv.innerHTML = escapeHTMLPolicy.createHTML(html);
  if (document.body) {
    document.body.appendChild(loaderDiv);
  }
  /*
  var elemDiv = document.createElement('div');
  elemDiv.style.cssText =
    'position: fixed; z-index: 2147483641; display: none; width: 100%;height: 100%;top: 0;left: 0;right: 0;bottom: 0; background-color: rgba(0,0,0,0.8); cursor: pointer;';
  elemDiv.setAttribute('id', 'warningBackground');
  if (document.documentElement) {
    //elemDiv.appendChild (loaderDiv);
    document.documentElement.appendChild(elemDiv);
  }

  var darkBackground = document.createElement('div');
  darkBackground.style.cssText =
    'z-index: 2147483640; position: fixed; display: none; width: 100%;height: 100%;top: 0;left: 0;right: 0;bottom: 0; background-color: rgba(0,0,0,0.8); cursor: pointer;';
  darkBackground.setAttribute('id', 'darkBackground');
  if (document.documentElement) {
    document.documentElement.appendChild(darkBackground);
  }*/
  return;
}

async function sendLogToMain(msg) {
  try {
    window.postMessage(
      {
        type: 'kerberus_log',
        msg: msg,
      },
      '*',
    );
  } catch (err) {
    console.error(err);
  }
}


/***/ }),

/***/ 7409:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   C: () => (/* binding */ kr_delay)
/* harmony export */ });
/* unused harmony export jsonToBase64 */
// eslint-disable-next-line no-unused-vars
const kr_delay = (ms, id = null) => {
  //console.log(`kr_delay (${id})`);
  return new Promise((resolve) => setTimeout(resolve, ms));
};

function jsonToBase64(jsonData) {
  const jsonString = JSON.stringify(jsonData);
  const textEncoder = new TextEncoder();
  const encodedData = textEncoder.encode(jsonString);
  const base64Data = btoa(String.fromCharCode(...encodedData));
  return base64Data;
}


/***/ }),

/***/ 1747:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   T: () => (/* binding */ injectRpcProxy)
/* harmony export */ });
async function injectRpcProxy(licenseId) {
  console.log('User License ID', licenseId);
  if (!window?.ethereum) return;

  try {
    await window.ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [
        {
          blockExplorerUrls: ['https://etherscan.io'],
          iconUrls: [
            'https://content.kerberus.com/images/logo32.png',
            'https://content.kerberus.com/images/logo64.png',
          ],
          rpcUrls: ['https://rpc.kerberus.com/ethereum/' + licenseId], // Replace with your Infura Project ID or other provider
          chainId: '0x1', //1000 in hex
          chainName: 'Kerberus (Ethereum)',
          nativeCurrency: {
            name: 'Ether',
            symbol: 'ETH',
            decimals: 18,
          },
        },
      ],
    });
  } catch (error) {
    console.log('error', error);
  }
}


/***/ }),

/***/ 8182:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ ClientCryptoLib)
/* harmony export */ });
const CRYPTO_CONFIG = {
  name: 'ECDSA',
  namedCurve: 'P-256',
  hash: 'SHA-256',
}

class ClientCryptoLib {
  constructor(publicKeyJWK) {
    publicKeyJWK = JSON.parse(publicKeyJWK)
    //console.log('publicKeyJWK', publicKeyJWK)
    this.publicKeyJWK = publicKeyJWK
    this.publicKey = null
  }

  async importPublicKey() {
    try {
      this.publicKey = await crypto.subtle.importKey(
        'jwk',
        this.publicKeyJWK,
        CRYPTO_CONFIG,
        true,
        ['verify']
      )
    } catch (error) {
      console.log(111, { error, key: this.publicKeyJWK })
    }
  }

  async validateSignatureTime(originalData) {
    //verify time of sig
    if (!originalData?.signatureTime) return false

    let currentTime = Date.now()
    // Check the difference
    const signaturesTimestampDiff = Math.abs(
      currentTime - originalData?.signatureTime
    )
    if (signaturesTimestampDiff > 5000) return false

    return true
  }

  async verify(signature, originalData) {
    if (!(await this.validateSignatureTime(originalData))) return false

    originalData = JSON.stringify(originalData)
    //console.log('verify cryptic data', { signature, originalData })
    if (!this.publicKey) {
      await this.importPublicKey()
    }

    const encoded = new TextEncoder().encode(originalData)
    const decodedSignature = Uint8Array.from(atob(signature), (c) =>
      c.charCodeAt(0)
    ) // Decode from base64

    return crypto.subtle.verify(
      CRYPTO_CONFIG,
      this.publicKey,
      decodedSignature,
      encoded
    )
  }
}


/***/ }),

/***/ 7570:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* unused harmony exports ENV_TYPE, HOSTNAME, IS_PROD */
/* eslint-disable no-undef */
const ENV_TYPE = "prod";
const HOSTNAME = window.location.hostname;
const IS_PROD = ENV_TYPE == 'prod';


/***/ }),

/***/ 5282:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   B5: () => (/* binding */ web3Functions),
/* harmony export */   h3: () => (/* binding */ legitWindowFunctions)
/* harmony export */ });
/* unused harmony exports DOMAIN_CACHED_STATUS, set_DOMAIN_CACHED_STATUS, DOMAIN_CACHED_STATUS_INIT, set_DOMAIN_CACHED_STATUS_INIT, USER, set_USER, socialAccounts, setSocialAccounts, getSocialAccounts, SensitiveFunctions */
var DOMAIN_CACHED_STATUS = {};
function set_DOMAIN_CACHED_STATUS(value) {
  DOMAIN_CACHED_STATUS = value || {};
}

var DOMAIN_CACHED_STATUS_INIT = {};
function set_DOMAIN_CACHED_STATUS_INIT(value) {
  DOMAIN_CACHED_STATUS_INIT = value || {};
}

var USER = {
  id: null,
  accessToken: null,
};

function set_USER(value) {
  USER = value || {
    id: null,
    accessToken: null,
  };
}

/**
 * The `socialAccounts` object storing user's social accounts.
 *
 * @type {Object}
 */
var socialAccounts = {
  twitter: [],
  openSea: [],
};

/**
 * Sets the `socialAccounts` object.
 *
 * @param {Object} value - The new `socialAccounts` value.
 */
function setSocialAccounts(value) {
  socialAccounts = value || {
    twitter: [],
    openSea: [],
  };
}

/**
 * Gets the current `socialAccounts` object.
 *
 * @returns {Object} The current `socialAccounts` value.
 */
function getSocialAccounts() {
  return socialAccounts;
}

var SensitiveFunctions = [
  {
    name: 'safeTransferFrom',
    msg: "Untrusted site is trying to transfer your coins/NFT's from your wallet to another destination.",
  },
  {
    name: 'transferFrom',
    msg: "Untrusted site is trying to transfer your coins/NFT's from your wallet to another destination.",
  },
  {
    name: 'approve',
    msg: "Untrusted site is trying to get full access over your coins/NFT's.",
  },
  {
    name: 'setApprovalForAll',
    msg: "Untrusted site is trying to get full access over your coins/NFT's.",
  },
  {
    name: '_safeTransferFrom',
    msg: "Untrusted site is trying to transfer your coins/NFT's from your wallet to another destination.",
  },
  {
    name: '_transferFrom',
    msg: "Untrusted site is trying to transfer your coins/NFT's from your wallet to another destination.",
  },
  {
    name: 'authorizeOperator',
    msg: "Untrusted site is trying to get full access over your coins/NFT's.",
  },
  {
    name: 'operatorSend',
    msg: "Untrusted site is trying to transfer your coins/NFT's from your wallet to another destination.",
  },
  {
    name: 'transfer',
    msg: "Untrusted site is trying to transfer your coins/NFT's from your wallet to another destination.",
  },
  {
    name: 'multicall',
    msg: "Untrusted site is trying to transfer your coins/NFT's from your wallet to another destination.",
  },
];

const web3Functions = [
  '_ethers',
  'Moralis',
  'Web3',
  'ethereumjs',
  'ethers',
];

const legitWindowFunctions = [
  'window',
  'self',
  'document',
  'name',
  'location',
  'customElements',
  'history',
  'locationbar',
  'menubar',
  'personalbar',
  'scrollbars',
  'statusbar',
  'toolbar',
  'status',
  'closed',
  'frames',
  'length',
  'top',
  'opener',
  'parent',
  'frameElement',
  'navigator',
  'origin',
  'external',
  'screen',
  'innerWidth',
  'innerHeight',
  'scrollX',
  'pageXOffset',
  'scrollY',
  'pageYOffset',
  'visualViewport',
  'screenX',
  'screenY',
  'outerWidth',
  'outerHeight',
  'devicePixelRatio',
  'clientInformation',
  'screenLeft',
  'screenTop',
  'defaultStatus',
  'defaultstatus',
  'styleMedia',
  'onsearch',
  'isSecureContext',
  'trustedTypes',
  'performance',
  'onappinstalled',
  'onbeforeinstallprompt',
  'crypto',
  'indexedDB',
  'webkitStorageInfo',
  'sessionStorage',
  'localStorage',
  'onbeforexrselect',
  'onabort',
  'onbeforeinput',
  'onblur',
  'oncancel',
  'oncanplay',
  'oncanplaythrough',
  'onchange',
  'onclick',
  'onclose',
  'oncontextlost',
  'oncontextmenu',
  'oncontextrestored',
  'oncuechange',
  'ondblclick',
  'ondrag',
  'ondragend',
  'ondragenter',
  'ondragleave',
  'ondragover',
  'ondragstart',
  'ondrop',
  'ondurationchange',
  'onemptied',
  'onended',
  'onerror',
  'onfocus',
  'onformdata',
  'oninput',
  'oninvalid',
  'onkeydown',
  'onkeypress',
  'onkeyup',
  'onload',
  'onloadeddata',
  'onloadedmetadata',
  'onloadstart',
  'onmousedown',
  'onmouseenter',
  'onmouseleave',
  'onmousemove',
  'onmouseout',
  'onmouseover',
  'onmouseup',
  'onmousewheel',
  'onpause',
  'onplay',
  'onplaying',
  'onprogress',
  'onratechange',
  'onreset',
  'onresize',
  'onscroll',
  'onsecuritypolicyviolation',
  'onseeked',
  'onseeking',
  'onselect',
  'onslotchange',
  'onstalled',
  'onsubmit',
  'onsuspend',
  'ontimeupdate',
  'ontoggle',
  'onvolumechange',
  'onwaiting',
  'onwebkitanimationend',
  'onwebkitanimationiteration',
  'onwebkitanimationstart',
  'onwebkittransitionend',
  'onwheel',
  'onauxclick',
  'ongotpointercapture',
  'onlostpointercapture',
  'onpointerdown',
  'onpointermove',
  'onpointerrawupdate',
  'onpointerup',
  'onpointercancel',
  'onpointerover',
  'onpointerout',
  'onpointerenter',
  'onpointerleave',
  'onselectstart',
  'onselectionchange',
  'onanimationend',
  'onanimationiteration',
  'onanimationstart',
  'ontransitionrun',
  'ontransitionstart',
  'ontransitionend',
  'ontransitioncancel',
  'onafterprint',
  'onbeforeprint',
  'onbeforeunload',
  'onhashchange',
  'onlanguagechange',
  'onmessage',
  'onmessageerror',
  'onoffline',
  'ononline',
  'onpagehide',
  'onpageshow',
  'onpopstate',
  'onrejectionhandled',
  'onstorage',
  'onunhandledrejection',
  'onunload',
  'crossOriginIsolated',
  'scheduler',
  'alert',
  'atob',
  'blur',
  'btoa',
  'cancelAnimationFrame',
  'cancelIdleCallback',
  'captureEvents',
  'clearInterval',
  'clearTimeout',
  'close',
  'confirm',
  'createImageBitmap',
  'fetch',
  'find',
  'focus',
  'getComputedStyle',
  'getSelection',
  'matchMedia',
  'moveBy',
  'moveTo',
  'open',
  'postMessage',
  'print',
  'prompt',
  'queueMicrotask',
  'releaseEvents',
  'reportError',
  'requestAnimationFrame',
  'requestIdleCallback',
  'resizeBy',
  'resizeTo',
  'scroll',
  'scrollBy',
  'scrollTo',
  'setInterval',
  'setTimeout',
  'stop',
  'structuredClone',
  'webkitCancelAnimationFrame',
  'webkitRequestAnimationFrame',
  'chrome',
  'caches',
  'cookieStore',
  'ondevicemotion',
  'ondeviceorientation',
  'ondeviceorientationabsolute',
  'launchQueue',
  'onbeforematch',
  'getScreenDetails',
  'queryLocalFonts',
  'showDirectoryPicker',
  'showOpenFilePicker',
  'showSaveFilePicker',
  'originAgentCluster',
  'navigation',
  'speechSynthesis',
  'webkitRequestFileSystem',
  'webkitResolveLocalFileSystemURL',
  'define',
  'ethereum',
  '__wired__',
  '__sidecar_config__',
  '__toggles__',
  '__chains__',
  '__remote_address__',
  '__sessionId__',
  '_',
  'webpackChunk_N_E',
  'regeneratorRuntime',
  '__next_require__',
  'next',
  '__NEXT_DATA__',
  '__SSG_MANIFEST_CB',
  '__NEXT_P',
  '_N_E',
  'SENTRY_RELEASE',
  'SENTRY_RELEASES',
  '__SENTRY__',
  '__global__',
  '__SEGMENT_INSPECTOR__',
  '__NEXT_PRELOADREADY',
  'i18nConfig',
  '__MIDDLEWARE_MANIFEST',
  '_fs_debug',
  '_fs_host',
  '_fs_script',
  '_fs_org',
  '_fs_namespace',
  'FS',
  'dataLayer',
  'gtag',
  '__BUILD_MANIFEST',
  '__SSG_MANIFEST',
  '__cfBeacon',
  '$',
  'jQuery',
  'Base64',
  'timer',
];


/***/ }),

/***/ 2295:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   $E: () => (/* binding */ getStorageItem),
/* harmony export */   N1: () => (/* binding */ clearStorage),
/* harmony export */   ni: () => (/* binding */ setStorageItem)
/* harmony export */ });
/* unused harmony exports removeStorageItem, getObjectFromChromeSyncStorage, getChromeDeviceStorage, saveChromeDeviceStorage, saveObjectInChromeSyncStorage */
/* harmony import */ var localforage__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3790);
/* harmony import */ var localforage__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(localforage__WEBPACK_IMPORTED_MODULE_0__);
/* eslint-disable no-undef */


localforage__WEBPACK_IMPORTED_MODULE_0___default().config({
  name: 'Kerberus',
});

async function getStorageItem(key) {
  try {
    const serializedData = await localforage__WEBPACK_IMPORTED_MODULE_0___default().getItem(key);
    if (serializedData === null) {
      return undefined;
    }

    return JSON.parse(serializedData);
  } catch (err) {
    return undefined;
  }
}

async function setStorageItem(key, value) {
  try {
    const serializedData = JSON.stringify(value);
    await localforage__WEBPACK_IMPORTED_MODULE_0___default().setItem(key, serializedData);
  } catch (err) {
    console.warn(err);
  }
}

async function removeStorageItem(key) {
  try {
    await localforage.removeItem(key);
  } catch (err) {
    console.warn(err);
  }
}

async function clearStorage() {
  try {
    await Promise.all([
      localforage__WEBPACK_IMPORTED_MODULE_0___default().removeItem('socialAccounts'),
      // Add more items to remove as needed
    ]);
    // await localforage.clear();
  } catch (err) {
    console.warn(err);
  }
}

/**
 * Retrieve object from Chrome's Local StorageArea
 * @param {string} key
 */
async function getObjectFromChromeSyncStorage(key) {
  return new Promise((resolve, reject) => {
    try {
      // eslint-disable-next-line no-undef
      chrome.storage.sync.get(key, function (value) {
        resolve(value[key]);
      });
    } catch (ex) {
      reject(ex);
    }
  });
}

async function getChromeDeviceStorage(key) {
  // eslint-disable-next-line no-undef
  try {
    const result = await chrome.storage.local.get([key]);
    return result[key];
  } catch (error) {
    return false;
  }
}

async function saveChromeDeviceStorage(data) {
  await chrome.storage.local.set(data);
}

/**
 * Save Object in Chrome's Local StorageArea
 * @param {*} obj
 */
async function saveObjectInChromeSyncStorage(obj) {
  return new Promise((resolve, reject) => {
    try {
      chrome.storage.sync.set(obj, function () {
        resolve();
      });
    } catch (ex) {
      reject(ex);
    }
  });
}


/***/ }),

/***/ 8289:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   W: () => (/* binding */ applySessionStorageProxy),
/* harmony export */   n: () => (/* binding */ allowSessionStorageChangeFunc)
/* harmony export */ });
let allowSessionStorageChange = false;

async function allowSessionStorageChangeFunc() {
  allowSessionStorageChange = true;
}

function applySessionStorageProxy() {
  //console.log('applySessionStorageProxy');

  const sessionStorageProxyHandler = {
    get: function (target, key) {
      const originalMethod = target[key];

      if (typeof originalMethod === 'function') {
        return function (...args) {
          // Specifically intercept setItem calls for the keys of interest
          if (key === 'setItem') {
            const [itemKey, itemValue] = args;

            if (
              itemKey === 'KR_DOMAIN_CACHED_STATUS' ||
              itemKey === 'KR_DOMAIN_CACHED_STATUS_INIT'
            ) {
              if (!allowSessionStorageChange) {
                window.postMessage({
                  type: 'illegalSessionStorageChange',
                });
              } else {
                allowSessionStorageChange = false;
                return originalMethod.apply(target, [itemKey, itemValue]);
              }
              // Modify the value if necessary
              //const modifiedValue = `${itemValue}_modified`;
              //console.log(`Modified Value: ${modifiedValue}`);
              // Ensure the original method is called with the correct context
            }
          }
          // Ensure the original method is called with the correct context
          return originalMethod.apply(target, args);
        };
      }
      return originalMethod;
    },
  };

  // Creating a proxy around sessionStorage
  const proxiedSessionStorage = new Proxy(
    sessionStorage,
    sessionStorageProxyHandler,
  );

  // Overriding the global sessionStorage with the proxied version
  try {
    Object.defineProperty(window, 'sessionStorage', {
      value: proxiedSessionStorage,
      writable: false,
      configurable: false,
      enumerable: true,
    });
  } catch (error) {
    console.error(error);
  }
}


/***/ }),

/***/ 7790:
/***/ (() => {

/* (ignored) */

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			loaded: false,
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/amd options */
/******/ 	(() => {
/******/ 		__webpack_require__.amdO = {};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/async module */
/******/ 	(() => {
/******/ 		var webpackQueues = typeof Symbol === "function" ? Symbol("webpack queues") : "__webpack_queues__";
/******/ 		var webpackExports = typeof Symbol === "function" ? Symbol("webpack exports") : "__webpack_exports__";
/******/ 		var webpackError = typeof Symbol === "function" ? Symbol("webpack error") : "__webpack_error__";
/******/ 		var resolveQueue = (queue) => {
/******/ 			if(queue && queue.d < 1) {
/******/ 				queue.d = 1;
/******/ 				queue.forEach((fn) => (fn.r--));
/******/ 				queue.forEach((fn) => (fn.r-- ? fn.r++ : fn()));
/******/ 			}
/******/ 		}
/******/ 		var wrapDeps = (deps) => (deps.map((dep) => {
/******/ 			if(dep !== null && typeof dep === "object") {
/******/ 				if(dep[webpackQueues]) return dep;
/******/ 				if(dep.then) {
/******/ 					var queue = [];
/******/ 					queue.d = 0;
/******/ 					dep.then((r) => {
/******/ 						obj[webpackExports] = r;
/******/ 						resolveQueue(queue);
/******/ 					}, (e) => {
/******/ 						obj[webpackError] = e;
/******/ 						resolveQueue(queue);
/******/ 					});
/******/ 					var obj = {};
/******/ 					obj[webpackQueues] = (fn) => (fn(queue));
/******/ 					return obj;
/******/ 				}
/******/ 			}
/******/ 			var ret = {};
/******/ 			ret[webpackQueues] = x => {};
/******/ 			ret[webpackExports] = dep;
/******/ 			return ret;
/******/ 		}));
/******/ 		__webpack_require__.a = (module, body, hasAwait) => {
/******/ 			var queue;
/******/ 			hasAwait && ((queue = []).d = -1);
/******/ 			var depQueues = new Set();
/******/ 			var exports = module.exports;
/******/ 			var currentDeps;
/******/ 			var outerResolve;
/******/ 			var reject;
/******/ 			var promise = new Promise((resolve, rej) => {
/******/ 				reject = rej;
/******/ 				outerResolve = resolve;
/******/ 			});
/******/ 			promise[webpackExports] = exports;
/******/ 			promise[webpackQueues] = (fn) => (queue && fn(queue), depQueues.forEach(fn), promise["catch"](x => {}));
/******/ 			module.exports = promise;
/******/ 			body((deps) => {
/******/ 				currentDeps = wrapDeps(deps);
/******/ 				var fn;
/******/ 				var getResult = () => (currentDeps.map((d) => {
/******/ 					if(d[webpackError]) throw d[webpackError];
/******/ 					return d[webpackExports];
/******/ 				}))
/******/ 				var promise = new Promise((resolve) => {
/******/ 					fn = () => (resolve(getResult));
/******/ 					fn.r = 0;
/******/ 					var fnQueue = (q) => (q !== queue && !depQueues.has(q) && (depQueues.add(q), q && !q.d && (fn.r++, q.push(fn))));
/******/ 					currentDeps.map((dep) => (dep[webpackQueues](fnQueue)));
/******/ 				});
/******/ 				return fn.r ? promise : getResult();
/******/ 			}, (err) => ((err ? reject(promise[webpackError] = err) : outerResolve(exports)), resolveQueue(queue)));
/******/ 			queue && queue.d < 0 && (queue.d = 0);
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/node module decorator */
/******/ 	(() => {
/******/ 		__webpack_require__.nmd = (module) => {
/******/ 			module.paths = [];
/******/ 			if (!module.children) module.children = [];
/******/ 			return module;
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module used 'module' so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__(7730);
/******/ 	
/******/ })()
;
//# sourceMappingURL=injected.js.map
