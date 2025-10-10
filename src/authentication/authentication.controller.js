"use strict";
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthenticationController = void 0;
var common_1 = require("@nestjs/common");
var swagger_1 = require("@nestjs/swagger");
var handle_errors_1 = require("../utils/handle-errors");
var user_entity_1 = require("../user/entities/user.entity");
var ApiResponse_1 = require("../responses/ApiResponse");
var InvalidCredentials_1 = require("../errors/InvalidCredentials");
var sign_up_dto_1 = require("./dto/sign-up.dto");
var sign_in_dto_1 = require("./dto/sign-in-dto");
var authentication_guard_1 = require("./authentication.guard");
var AuthenticationController = function () {
    var _classDecorators = [(0, swagger_1.ApiTags)('Auth'), (0, common_1.Controller)('authentication')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _signUp_decorators;
    var _signIn_decorators;
    var _refreshToken_decorators;
    var _revokeToken_decorators;
    var AuthenticationController = _classThis = /** @class */ (function () {
        function AuthenticationController_1(authService, prisma) {
            this.authService = (__runInitializers(this, _instanceExtraInitializers), authService);
            this.prisma = prisma;
        }
        AuthenticationController_1.prototype.signUp = function (body, res) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, user, tokens, err_1;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, this.authService.signUp(body)];
                        case 1:
                            _a = _b.sent(), user = _a.user, tokens = _a.tokens;
                            res
                                .cookie('refreshToken', tokens.refreshToken, {
                                httpOnly: true,
                                secure: true,
                                path: '/authentication/refresh-token',
                                sameSite: 'none'
                            })
                                .cookie('jwt', tokens.accessToken, {
                                httpOnly: true,
                                secure: true,
                                path: '/',
                                sameSite: 'none'
                            });
                            return [2 /*return*/, new user_entity_1.UserEntity(user)];
                        case 2:
                            err_1 = _b.sent();
                            (0, handle_errors_1.handleErrors)(err_1);
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        AuthenticationController_1.prototype.signIn = function (body, res) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, user, tokens, err_2;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, this.authService.signIn(body)];
                        case 1:
                            _a = _b.sent(), user = _a.user, tokens = _a.tokens;
                            res
                                .cookie('refreshToken', tokens.refreshToken, {
                                httpOnly: true,
                                secure: true,
                                path: '/authentication/refresh-token',
                                sameSite: 'none'
                            })
                                .cookie('jwt', tokens.accessToken, {
                                httpOnly: true,
                                secure: true,
                                path: '/',
                                sameSite: 'none'
                            });
                            return [2 /*return*/, new user_entity_1.UserEntity(user)];
                        case 2:
                            err_2 = _b.sent();
                            (0, handle_errors_1.handleErrors)(err_2);
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        AuthenticationController_1.prototype.refreshToken = function (req, res) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, _b, _c, err_3;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            _d.trys.push([0, 2, , 3]);
                            if (!req.cookies['refreshToken'])
                                throw new InvalidCredentials_1.InvalidCredentials();
                            _b = (_a = res).cookie;
                            _c = ['jwt'];
                            return [4 /*yield*/, this.authService.refreshTokens(req.cookies['refreshToken'])];
                        case 1:
                            _b.apply(_a, _c.concat([(_d.sent())
                                    .accessToken,
                                {
                                    httpOnly: true,
                                    secure: true,
                                    path: '/',
                                    sameSite: 'none',
                                }]));
                            return [2 /*return*/];
                        case 2:
                            err_3 = _d.sent();
                            if (err_3 instanceof InvalidCredentials_1.InvalidCredentials) {
                                res.clearCookie('jwt');
                                res.clearCookie('refreshToken', {
                                    path: '/authentication/refresh-token',
                                });
                            }
                            (0, handle_errors_1.handleErrors)(err_3);
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        AuthenticationController_1.prototype.revokeToken = function (user, res) {
            return __awaiter(this, void 0, void 0, function () {
                var results, revokedJti, err_4, revokedRefreshJti, _a, err_5;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            results = [];
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, this.authService.revokeToken(user.jti)];
                        case 2:
                            revokedJti = _b.sent();
                            results.push(revokedJti);
                            return [3 /*break*/, 4];
                        case 3:
                            err_4 = _b.sent();
                            console.error('Failed to revoke access token (jti):', err_4.message);
                            results.push(null); // Push null to indicate failure
                            return [3 /*break*/, 4];
                        case 4:
                            _b.trys.push([4, 8, , 9]);
                            if (!user.refreshJti) return [3 /*break*/, 6];
                            return [4 /*yield*/, this.authService.revokeToken(user.refreshJti)];
                        case 5:
                            _a = _b.sent();
                            return [3 /*break*/, 7];
                        case 6:
                            _a = null;
                            _b.label = 7;
                        case 7:
                            revokedRefreshJti = _a;
                            results.push(revokedRefreshJti);
                            return [3 /*break*/, 9];
                        case 8:
                            err_5 = _b.sent();
                            results.push(null);
                            return [3 /*break*/, 9];
                        case 9:
                            // Always clear the cookies, regardless of errors
                            res.clearCookie('jwt');
                            res.clearCookie('refreshToken', { path: '/authentication/refresh-token' });
                            return [2 /*return*/, results]; // Return the results array
                    }
                });
            });
        };
        return AuthenticationController_1;
    }());
    __setFunctionName(_classThis, "AuthenticationController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _signUp_decorators = [(0, common_1.Post)('sign-up'), (0, swagger_1.ApiOperation)({ summary: 'Sign Up', description: 'Allows a user to register with his email, password, username' }), (0, swagger_1.ApiBody)({ type: sign_up_dto_1.SignUpDto }), (0, swagger_1.ApiResponse)({ status: 201, description: 'Sign Up succesful, jwt and refresh-token sent as cookies', type: user_entity_1.UserEntity }), (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad Request' }), (0, swagger_1.ApiResponse)({ status: 409, description: 'Conflict' }), (0, swagger_1.ApiResponse)({ status: 500, description: 'Internal Server Error' })];
        _signIn_decorators = [(0, common_1.Post)('sign-in'), (0, swagger_1.ApiOperation)({ summary: 'Sign In', description: 'Allows a user to login with his email or username and his password' }), (0, swagger_1.ApiBody)({ type: sign_in_dto_1.SignInDto }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Sign In succesful, jwt and refresh-token sent as cookies', type: user_entity_1.UserEntity }), (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad Request' }), (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized', type: ApiResponse_1.ApiResponseBody }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Not Found' }), (0, swagger_1.ApiResponse)({ status: 500, description: 'Internal Server Error' }), (0, common_1.HttpCode)(200)];
        _refreshToken_decorators = [(0, common_1.Post)('refresh-token'), (0, swagger_1.ApiCookieAuth)()];
        _revokeToken_decorators = [(0, swagger_1.ApiCookieAuth)(), (0, common_1.UseGuards)(authentication_guard_1.AuthGuard), (0, common_1.Delete)('revoke-token')];
        __esDecorate(_classThis, null, _signUp_decorators, { kind: "method", name: "signUp", static: false, private: false, access: { has: function (obj) { return "signUp" in obj; }, get: function (obj) { return obj.signUp; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _signIn_decorators, { kind: "method", name: "signIn", static: false, private: false, access: { has: function (obj) { return "signIn" in obj; }, get: function (obj) { return obj.signIn; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _refreshToken_decorators, { kind: "method", name: "refreshToken", static: false, private: false, access: { has: function (obj) { return "refreshToken" in obj; }, get: function (obj) { return obj.refreshToken; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _revokeToken_decorators, { kind: "method", name: "revokeToken", static: false, private: false, access: { has: function (obj) { return "revokeToken" in obj; }, get: function (obj) { return obj.revokeToken; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AuthenticationController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AuthenticationController = _classThis;
}();
exports.AuthenticationController = AuthenticationController;
