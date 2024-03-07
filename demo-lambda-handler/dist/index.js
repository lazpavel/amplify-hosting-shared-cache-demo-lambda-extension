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
exports.handler = void 0;
const key_value_storage_1 = __importDefault(require("./key-value-storage"));
const handler = function (event) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(`executing lambda handler: ${JSON.stringify(event)}`);
        const { operation, key, data } = event;
        const keyValueStorage = new key_value_storage_1.default({ framework: 'nuxt' });
        if (operation === 'get') {
            return yield keyValueStorage.get(key);
        }
        else if (operation === 'set') {
            yield keyValueStorage.set(key, data);
        }
        else {
            throw new Error(`Unknown operation: ${operation}`);
        }
    });
};
exports.handler = handler;
//# sourceMappingURL=index.js.map