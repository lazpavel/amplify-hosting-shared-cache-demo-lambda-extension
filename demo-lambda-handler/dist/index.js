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
exports.handler = exports.simulateGenerateAndSetData = void 0;
const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
};
const simulateGenerateAndSetData = () => __awaiter(void 0, void 0, void 0, function* () {
    console.log('simulateGenerateAndSetData: sleeping for 10 seconds...');
    yield sleep(10000);
    const response = yield fetch('http://127.0.0.1:8888/set', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ data: 'Hello, World!' })
    });
    console.log(`set response completed`);
});
exports.simulateGenerateAndSetData = simulateGenerateAndSetData;
const handler = function (event) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('handler: fetching data...');
        const response = yield fetch('http://127.0.0.1:8888/get');
        (0, exports.simulateGenerateAndSetData)();
        console.log(`get response completed`);
        return null;
    });
};
exports.handler = handler;
//# sourceMappingURL=index.js.map