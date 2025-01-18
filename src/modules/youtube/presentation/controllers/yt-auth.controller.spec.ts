import { LoggerService, LoggingModule } from '@leocodeio-njs/njs-logging';
import { Test, TestingModule } from '@nestjs/testing';
import { YtAuthService } from '../../application/services/yt-auth.service';
import { YtAuthController } from './yt-auth.controller';
import { AppConfigModule } from '@leocodeio-njs/njs-config';
import { YtAuthModule } from '../../yt-auth.module';
import { IYtCreatorEntity } from '../../../creator/domain/models/yt-creator.model';
import { YtCreatorModule } from '../../../creator/yt-creator.module';
import { YtCreatorService } from '../../../creator/application/services/yt-creator.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { YtCreatorEntity } from '../../../creator/infrastructure/entities/yt-creator.entity';

import { AppConfigService } from '@leocodeio-njs/njs-config';
import { IYtCreatorRepository } from '../../../creator/domain/ports/yt-creator.repository';
import { YtCreatorRepository } from '../../../creator/infrastructure/adapters/yt-creator.repository';
describe('YtAuthController', () => {
  let ytAuthController: YtAuthController;
  let ytAuthService: YtAuthService;
  let logger: LoggerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        LoggingModule,
        AppConfigModule,
        YtCreatorModule,
        YtAuthModule,
        TypeOrmModule.forFeature([YtCreatorEntity]),
        TypeOrmModule.forRootAsync({
          imports: [AppConfigModule, YtCreatorModule],
          useFactory: (configService: AppConfigService) => ({
            ...configService.databaseConfig,
            entities: [__dirname + '/**/*.entity{.ts,.js}'],
            synchronize: false,
          }),
          inject: [AppConfigService],
        }),
      ],
      providers: [
        YtAuthService,
        YtCreatorService,
        {
          provide: IYtCreatorRepository,
          useClass: YtCreatorRepository,
        },
      ],
      controllers: [YtAuthController],
    }).compile();

    ytAuthController = await module.resolve<YtAuthController>(YtAuthController);
    ytAuthService = await module.resolve<YtAuthService>(YtAuthService);
    logger = await module.resolve<LoggerService>(LoggerService);
    logger.setLogContext('YtAuthController.Test');
  });

  describe('GET /auth', () => {
    it('should return authentication URL', async () => {
      logger.log('Starting test: get auth URL');
      const expectedAuthUrl = 'https://accounts.google.com/o/oauth2/auth?...';

      jest
        .spyOn(ytAuthService, 'getAuthUrl')
        .mockResolvedValue(expectedAuthUrl);

      const result = await ytAuthController.authenticateYouTube();
      expect(result).toBe(expectedAuthUrl);
    });
  });

  describe('GET /oauth2callback', () => {
    it('should handle OAuth callback', async () => {
      logger.log('Starting test: handle OAuth callback');
      const authCode = 'test_auth_code';
      const expectedResult = {
        accessToken: 'access_token',
        refreshToken: 'refresh_token',
      } as IYtCreatorEntity;

      jest
        .spyOn(ytAuthService, 'handleOAuthCallback')
        .mockResolvedValue(expectedResult);

      const result = await ytAuthController.handleOAuthCallback(authCode);
      expect(result).toBe(expectedResult);
    });
  });

  describe('GET /channel-info', () => {
    it('should return channel information', async () => {
      logger.log('Starting test: get channel info');
      const expectedResult = {
        channelId: 'channel_id',
        title: 'Channel Title',
        description: 'Channel Description',
      };

      jest
        .spyOn(ytAuthService, 'getChannelInfo')
        .mockResolvedValue(expectedResult);

      const result = await ytAuthController.getChannelInfo('creator_id');
      expect(result).toBe(expectedResult);
    });
  });

  afterEach(() => {
    logger.log('Test completed');
  });
});
