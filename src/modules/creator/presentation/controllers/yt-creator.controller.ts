import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { YtCreatorService } from '../../application/services/yt-creator.service';
import { YtCreatorStatus } from '../../domain/enums/yt-creator-status.enum';
import { CreateEntryDto } from '../../application/dtos/create-entry.dto';
import { UpdateEntryDto } from '../../application/dtos/update-entry.dto';
import { IYtCreatorEntity } from '../../domain/models/yt-creator.model';
import { ApiQuery, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { GetCreatorEntryModel } from '../../domain/enums/get-creator-entry.model';
import { Public } from '@leocodeio-njs/njs-auth';

@ApiTags('Creator')
@ApiSecurity('x-api-key')
@Controller('youtube/creator')
export class YtCreatorController {
  constructor(private readonly ytCreatorService: YtCreatorService) {}

  // creator endpoints
  @Post('')
  async createCreatorEntry(
    @Body() creatorDto: CreateEntryDto,
  ): Promise<IYtCreatorEntity> {
    return this.ytCreatorService.createCreatorEntry(creatorDto);
  }

  @Get('')
  @ApiQuery({
    name: 'creatorId',
    required: false,
    description: 'Filter by creator ID',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: YtCreatorStatus,
    description: 'Filter by status',
  })
  async getCreatorEntries(
    @Query('creatorId') creatorId?: string,
    @Query('status') status?: YtCreatorStatus,
  ): Promise<IYtCreatorEntity[] | IYtCreatorEntity> {
    const query: GetCreatorEntryModel = {
      creatorId,
      status,
    };
    return this.ytCreatorService.getCreatorEntries(query);
  }

  @Put('')
  async updateCreatorEntry(
    @Query('creatorId') creatorId: string,
    @Body() updateDto: UpdateEntryDto,
  ): Promise<IYtCreatorEntity> {
    return this.ytCreatorService.updateCreatorEntry(creatorId, updateDto);
  }

  @Delete('')
  async deleteCreatorEntry(
    @Query('creatorId') creatorId: string,
  ): Promise<string> {
    console.log('test possibilities', creatorId);
    return this.ytCreatorService.deleteCreatorEntry(creatorId);
  }
}
