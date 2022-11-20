import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'IsEmailOrNull', async: false })
@Injectable()
export class IsEmailOrNullConstraint implements ValidatorConstraintInterface {
  constructor() {}

  validate(social_info_email: string) {
    const emailReg: RegExp =
      /^[a-zA-Z0-9+-\_.]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    if (!social_info_email || emailReg.test(social_info_email)) {
      return true;
    }
    return false;
  }
}

export function IsEmailOrNull(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsEmailOrNullConstraint,
    });
  };
}

@ValidatorConstraint({ name: 'IsUrlOrNull', async: false })
@Injectable()
export class IsUrlOrNullConstraint implements ValidatorConstraintInterface {
  constructor() {}

  validate(social_info_url: string) {
    const urlReg: RegExp =
      /[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;
    if (!social_info_url || urlReg.test(social_info_url)) {
      return true;
    }
    return false;
  }
}

export function IsUrlOrNull(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsUrlOrNullConstraint,
    });
  };
}

@ValidatorConstraint({ name: 'IsBooleanOrNull', async: false })
@Injectable()
export class IsBooleanOrNullConstraint implements ValidatorConstraintInterface {
  constructor() {}

  validate(alert: number) {
    if (alert === 1 || alert === 0 || alert === undefined) {
      return true;
    } else {
      return false;
    }
  }
}

export function IsBooleanOrNull(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsBooleanOrNullConstraint,
    });
  };
}
