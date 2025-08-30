import { BadRequestException } from '@nestjs/common';

export function validateUUID(id: string, fieldName: string = 'ID'): void {
  // UUID v4 regex pattern
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  if (!id) {
    throw new BadRequestException(`${fieldName} is required`);
  }

  if (!uuidRegex.test(id)) {
    throw new BadRequestException(
      `Invalid ${fieldName} format. Must be a valid UUID`,
    );
  }
}

// Bu yerdagi regexni AI dan oldim matryal sifatida sorab oldim ishlatish uchun
