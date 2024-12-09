import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function IsISO8601Duration(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: 'isISO8601Duration',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate(value: any, args: ValidationArguments) {
                    // Regex to match ISO 8601 duration format
                    const iso8601DurationRegex = /^P(?=\d|T\d)(?:\d+Y)?(?:\d+M)?(?:\d+W)?(?:\d+D)?(?:T(?:\d+H)?(?:\d+M)?(?:\d+S)?)?$/;
                    return typeof value === 'string' && iso8601DurationRegex.test(value);
                },
                defaultMessage(args: ValidationArguments) {
                    return `${args.property} must be a valid ISO 8601 duration string (e.g., "PT3M30S", "P1DT2H").`;
                },
            },
        });
    };
}