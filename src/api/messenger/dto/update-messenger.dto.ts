import { PartialType } from '@nestjs/mapped-types';
import { CreateMessengerDto } from './create-messenger.dto';

export class UpdateMessengerDto extends PartialType(CreateMessengerDto) {}
