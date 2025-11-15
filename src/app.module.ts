import { Module, Controller, Get } from '@nestjs/common';
import { CampaignsModule } from './campaigns/campaigns.module';
import { KeywordsModule } from './keywords/keywords.module';
import { OptimizationModule } from './optimization/optimization.module';

@Controller()
export class AppController {
  @Get()
  getHealthCheck() {
    return {
      status: 'ok',
      message: '🚀 Amazon Ads Optimizer API is running!',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('health')
  getHealth() {
    return { status: 'ok' };
  }
}

@Module({
  imports: [CampaignsModule, KeywordsModule, OptimizationModule],
  controllers: [AppController],
})
export class AppModule {}
