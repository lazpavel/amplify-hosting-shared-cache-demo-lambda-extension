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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = exports.simulateGenerateAndSetData = void 0;
const axios_1 = __importDefault(require("axios"));
const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
};
const simulateGenerateAndSetData = () => __awaiter(void 0, void 0, void 0, function* () {
    yield sleep(10000);
    const setResponse = yield axios_1.default.post('http://localhost:3000/set', { data: 'Hello, World!' });
    console.log(`set response: ${JSON.stringify(setResponse)}`);
});
exports.simulateGenerateAndSetData = simulateGenerateAndSetData;
const handler = function (event) {
    return __awaiter(this, void 0, void 0, function* () {
        const getResponse = yield axios_1.default.get('http://localhost:3000/get');
        yield (0, exports.simulateGenerateAndSetData)();
        console.log(`get response: ${JSON.stringify(getResponse)}`);
    });
};
exports.handler = handler;
//# sourceMappingURL=index.js.map