import { Controller, Get, Post } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { OptimizationService } from './optimization.service';

@ApiTags('optimization')
@Controller('optimization')
export class OptimizationController {
  constructor(private readonly optimizationService: OptimizationService) {}

  @Get('suggestions')
  @ApiOperation({ summary: 'Get optimization suggestions' })
  async getOptimizationSuggestions() {
    return this.optimizationService.getOptimizationSuggestions();
  }

  @Get('history')
  @ApiOperation({ summary: 'Get optimization history' })
  async getOptimizationHistory() {
    return this.optimizationService.getOptimizationHistory();
  }

  @Post('apply')
  @ApiOperation({ summary: 'Apply optimization suggestions' })
  async applyOptimizations() {
    return this.optimizationService.applyOptimizations();
  }
}
