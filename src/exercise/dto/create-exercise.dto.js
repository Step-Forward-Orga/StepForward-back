"use strict";
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
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateExerciseDto = void 0;
var swagger_1 = require("@nestjs/swagger");
var class_validator_1 = require("class-validator");
var CreateExerciseDto = function () {
    var _a;
    var _exerciseName_decorators;
    var _exerciseName_initializers = [];
    var _exerciseName_extraInitializers = [];
    var _exerciseId_decorators;
    var _exerciseId_initializers = [];
    var _exerciseId_extraInitializers = [];
    var _sets_decorators;
    var _sets_initializers = [];
    var _sets_extraInitializers = [];
    var _aimed_reps_decorators;
    var _aimed_reps_initializers = [];
    var _aimed_reps_extraInitializers = [];
    var _aimed_weight_decorators;
    var _aimed_weight_initializers = [];
    var _aimed_weight_extraInitializers = [];
    var _restTime_decorators;
    var _restTime_initializers = [];
    var _restTime_extraInitializers = [];
    var _completed_decorators;
    var _completed_initializers = [];
    var _completed_extraInitializers = [];
    var _completed_weight_decorators;
    var _completed_weight_initializers = [];
    var _completed_weight_extraInitializers = [];
    var _completed_reps_decorators;
    var _completed_reps_initializers = [];
    var _completed_reps_extraInitializers = [];
    var _completed_sets_decorators;
    var _completed_sets_initializers = [];
    var _completed_sets_extraInitializers = [];
    var _planId_decorators;
    var _planId_initializers = [];
    var _planId_extraInitializers = [];
    return _a = /** @class */ (function () {
            function CreateExerciseDto() {
                this.exerciseName = __runInitializers(this, _exerciseName_initializers, void 0);
                this.exerciseId = (__runInitializers(this, _exerciseName_extraInitializers), __runInitializers(this, _exerciseId_initializers, void 0));
                this.sets = (__runInitializers(this, _exerciseId_extraInitializers), __runInitializers(this, _sets_initializers, void 0));
                this.aimed_reps = (__runInitializers(this, _sets_extraInitializers), __runInitializers(this, _aimed_reps_initializers, void 0));
                this.aimed_weight = (__runInitializers(this, _aimed_reps_extraInitializers), __runInitializers(this, _aimed_weight_initializers, void 0));
                this.restTime = (__runInitializers(this, _aimed_weight_extraInitializers), __runInitializers(this, _restTime_initializers, void 0));
                this.completed = (__runInitializers(this, _restTime_extraInitializers), __runInitializers(this, _completed_initializers, void 0));
                this.completed_weight = (__runInitializers(this, _completed_extraInitializers), __runInitializers(this, _completed_weight_initializers, void 0));
                this.completed_reps = (__runInitializers(this, _completed_weight_extraInitializers), __runInitializers(this, _completed_reps_initializers, void 0));
                this.completed_sets = (__runInitializers(this, _completed_reps_extraInitializers), __runInitializers(this, _completed_sets_initializers, void 0));
                this.planId = (__runInitializers(this, _completed_sets_extraInitializers), __runInitializers(this, _planId_initializers, void 0));
                __runInitializers(this, _planId_extraInitializers);
            }
            return CreateExerciseDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _exerciseName_decorators = [(0, swagger_1.ApiProperty)({ example: 'Bench' }), (0, class_validator_1.IsString)()];
            _exerciseId_decorators = [(0, swagger_1.ApiProperty)({ example: 'FNEAOF' }), (0, class_validator_1.IsString)()];
            _sets_decorators = [(0, swagger_1.ApiProperty)({ example: 3 }), (0, class_validator_1.IsNumber)()];
            _aimed_reps_decorators = [(0, swagger_1.ApiProperty)({ example: 4 }), (0, class_validator_1.IsNumber)()];
            _aimed_weight_decorators = [(0, swagger_1.ApiProperty)({ example: 80 }), (0, class_validator_1.IsNumber)()];
            _restTime_decorators = [(0, swagger_1.ApiProperty)({ example: 'PTM3M' }), (0, class_validator_1.IsString)()];
            _completed_decorators = [(0, swagger_1.ApiProperty)({ example: false }), (0, class_validator_1.IsBoolean)()];
            _completed_weight_decorators = [(0, swagger_1.ApiProperty)({ example: 80 }), (0, class_validator_1.IsNumber)()];
            _completed_reps_decorators = [(0, swagger_1.ApiProperty)({ example: 4 }), (0, class_validator_1.IsNumber)()];
            _completed_sets_decorators = [(0, swagger_1.ApiProperty)({ example: 4 }), (0, class_validator_1.IsNumber)()];
            _planId_decorators = [(0, class_validator_1.IsNumber)()];
            __esDecorate(null, null, _exerciseName_decorators, { kind: "field", name: "exerciseName", static: false, private: false, access: { has: function (obj) { return "exerciseName" in obj; }, get: function (obj) { return obj.exerciseName; }, set: function (obj, value) { obj.exerciseName = value; } }, metadata: _metadata }, _exerciseName_initializers, _exerciseName_extraInitializers);
            __esDecorate(null, null, _exerciseId_decorators, { kind: "field", name: "exerciseId", static: false, private: false, access: { has: function (obj) { return "exerciseId" in obj; }, get: function (obj) { return obj.exerciseId; }, set: function (obj, value) { obj.exerciseId = value; } }, metadata: _metadata }, _exerciseId_initializers, _exerciseId_extraInitializers);
            __esDecorate(null, null, _sets_decorators, { kind: "field", name: "sets", static: false, private: false, access: { has: function (obj) { return "sets" in obj; }, get: function (obj) { return obj.sets; }, set: function (obj, value) { obj.sets = value; } }, metadata: _metadata }, _sets_initializers, _sets_extraInitializers);
            __esDecorate(null, null, _aimed_reps_decorators, { kind: "field", name: "aimed_reps", static: false, private: false, access: { has: function (obj) { return "aimed_reps" in obj; }, get: function (obj) { return obj.aimed_reps; }, set: function (obj, value) { obj.aimed_reps = value; } }, metadata: _metadata }, _aimed_reps_initializers, _aimed_reps_extraInitializers);
            __esDecorate(null, null, _aimed_weight_decorators, { kind: "field", name: "aimed_weight", static: false, private: false, access: { has: function (obj) { return "aimed_weight" in obj; }, get: function (obj) { return obj.aimed_weight; }, set: function (obj, value) { obj.aimed_weight = value; } }, metadata: _metadata }, _aimed_weight_initializers, _aimed_weight_extraInitializers);
            __esDecorate(null, null, _restTime_decorators, { kind: "field", name: "restTime", static: false, private: false, access: { has: function (obj) { return "restTime" in obj; }, get: function (obj) { return obj.restTime; }, set: function (obj, value) { obj.restTime = value; } }, metadata: _metadata }, _restTime_initializers, _restTime_extraInitializers);
            __esDecorate(null, null, _completed_decorators, { kind: "field", name: "completed", static: false, private: false, access: { has: function (obj) { return "completed" in obj; }, get: function (obj) { return obj.completed; }, set: function (obj, value) { obj.completed = value; } }, metadata: _metadata }, _completed_initializers, _completed_extraInitializers);
            __esDecorate(null, null, _completed_weight_decorators, { kind: "field", name: "completed_weight", static: false, private: false, access: { has: function (obj) { return "completed_weight" in obj; }, get: function (obj) { return obj.completed_weight; }, set: function (obj, value) { obj.completed_weight = value; } }, metadata: _metadata }, _completed_weight_initializers, _completed_weight_extraInitializers);
            __esDecorate(null, null, _completed_reps_decorators, { kind: "field", name: "completed_reps", static: false, private: false, access: { has: function (obj) { return "completed_reps" in obj; }, get: function (obj) { return obj.completed_reps; }, set: function (obj, value) { obj.completed_reps = value; } }, metadata: _metadata }, _completed_reps_initializers, _completed_reps_extraInitializers);
            __esDecorate(null, null, _completed_sets_decorators, { kind: "field", name: "completed_sets", static: false, private: false, access: { has: function (obj) { return "completed_sets" in obj; }, get: function (obj) { return obj.completed_sets; }, set: function (obj, value) { obj.completed_sets = value; } }, metadata: _metadata }, _completed_sets_initializers, _completed_sets_extraInitializers);
            __esDecorate(null, null, _planId_decorators, { kind: "field", name: "planId", static: false, private: false, access: { has: function (obj) { return "planId" in obj; }, get: function (obj) { return obj.planId; }, set: function (obj, value) { obj.planId = value; } }, metadata: _metadata }, _planId_initializers, _planId_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.CreateExerciseDto = CreateExerciseDto;
