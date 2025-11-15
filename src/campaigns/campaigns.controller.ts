import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CampaignsService } from './campaigns.service';

@ApiTags('campaigns')
@Controller('campaigns')
export class CampaignsController {
  constructor(private readonly campaignsService: CampaignsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all campaigns' })
  async getAllCampaigns() {
    return this.campaignsService.getAllCampaigns();
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get campaign statistics' })
  async getCampaignStats() {
    return this.campaignsService.getCampaignStats();
  }
}
