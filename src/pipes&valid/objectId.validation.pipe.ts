import { PipeTransform, Injectable, NotFoundException } from '@nestjs/common';
import { Types } from 'mongoose';

@Injectable()
export class CheckObjectIdPipe implements PipeTransform<any, Types.ObjectId> {
  transform(value: any): Types.ObjectId {
    const validObjectId = Types.ObjectId.isValid(value);
    // console.log('pipe ok');
    if (!validObjectId) {
      // throw new BadRequestException('Invalid ObjectId');
      throw new NotFoundException()
    };

    return value;
  };
};