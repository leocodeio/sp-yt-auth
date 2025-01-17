import { IsEnum, IsNotEmpty } from 'class-validator';
import { BaseDto } from '../../../common/base.dto';
import { IsOptional, IsString } from 'class-validator';
import { YtCreatorStatus } from '../../domain/enums/yt-creator-status.enum';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateEntryDto extends BaseDto {
  @ApiProperty({
    description: 'YouTube access token',
    example: 'ya29.a0AfH6SMBx7-gYj5N...',
  })
  @IsString()
  @IsNotEmpty()
  accessToken: string;

  @ApiProperty({
    description: 'YouTube refresh token',
    example: '1//04dXy7-gYj5N...',
  })
  @IsString()
  @IsOptional()
  refreshToken: string;

  @ApiProperty({
    description: 'Authentication status',
    enum: YtCreatorStatus,
    example: YtCreatorStatus.ACTIVE,
  })
  @IsEnum(YtCreatorStatus)
  @IsNotEmpty()
  status: YtCreatorStatus;
}
