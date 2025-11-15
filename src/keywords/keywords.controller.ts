import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { KeywordsService } from './keywords.service';

@ApiTags('keywords')
@Controller('keywords')
export class KeywordsController {
  constructor(private readonly keywordsService: KeywordsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all keywords' })
  async getAllKeywords() {
    return this.keywordsService.getAllKeywords();
  }

  @Get('performance')
  @ApiOperation({ summary: 'Get keyword performance metrics' })
  async getKeywordPerformance() {
    return this.keywordsService.getKeywordPerformance();
  }
}
