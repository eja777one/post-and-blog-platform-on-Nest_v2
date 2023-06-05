import {
  ValidatorConstraint, ValidatorConstraintInterface,
  ValidationArguments
} from 'class-validator';
import { Types } from 'mongoose';

@ValidatorConstraint({ name: 'checkObjectId', async: false })
export class CheckObjectId implements ValidatorConstraintInterface {
  validate(id: string, args: ValidationArguments) {
    return Types.ObjectId.isValid(id);
    // for async validations you must return a Promise<boolean> here
  };

  defaultMessage(args: ValidationArguments) {
    // here you can provide default error message if validation failed
    return 'Id is not ObjectId';
  };
};