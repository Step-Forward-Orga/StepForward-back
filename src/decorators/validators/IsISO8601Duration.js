"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsISO8601Duration = IsISO8601Duration;
var class_validator_1 = require("class-validator");
function IsISO8601Duration(validationOptions) {
    return function (object, propertyName) {
        (0, class_validator_1.registerDecorator)({
            name: 'isISO8601Duration',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate: function (value, args) {
                    // Regex to match ISO 8601 duration format
                    var iso8601DurationRegex = /^P(?=\d|T\d)(?:\d+Y)?(?:\d+M)?(?:\d+W)?(?:\d+D)?(?:T(?:\d+H)?(?:\d+M)?(?:\d+S)?)?$/;
                    return typeof value === 'string' && iso8601DurationRegex.test(value);
                },
                defaultMessage: function (args) {
                    return "".concat(args.property, " must be a valid ISO 8601 duration string (e.g., \"PT3M30S\", \"P1DT2H\").");
                },
            },
        });
    };
}
