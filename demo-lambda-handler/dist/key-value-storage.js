"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
class KeyValueStorage {
    constructor(opts) {
        this.baseUrl = 'http://127.0.0.1:8888';
        this.opts = opts;
    }
    set(key, value) {
        return __awaiter(this, void 0, void 0, function* () {
            const start = Date.now();
            const data = this.wrapData(value);
            console.log(`[key-value-storage] set ${key}`);
            yield fetch(`${this.baseUrl}/set`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    key,
                    data
                })
            });
            console.log(`latency L5 (set): ${Date.now() - start}ms`);
        });
    }
    get(key) {
        return __awaiter(this, void 0, void 0, function* () {
            const start = Date.now();
            console.log(`[key-value-storage] get ${key}`);
            let response = yield fetch(`${this.baseUrl}/get/${key}`);
            let data = yield response.json();
            console.log(data);
            fetch(`${this.baseUrl}/unblock`);
            console.log(`latency L5 (get): ${Date.now() - start}ms`);
            return data;
        });
    }
    wrapData(data) {
        return this.opts.framework === 'next' ? JSON.stringify({
            lastModified: Date.now(),
            value: data,
        }) : data;
    }
}
exports.default = KeyValueStorage;
//# sourceMappingURL=key-value-storage.js.map