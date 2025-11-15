import { Injectable } from '@nestjs/common';

@Injectable()
export class OptimizationService {
  async getOptimizationSuggestions() {
    // Demo data
    return [
      {
        id: 1,
        type: 'BID_INCREASE',
        keyword: 'wireless headphones',
        currentBid: 1.50,
        suggestedBid: 1.75,
        reason: 'High conversion rate, low ACoS',
        potentialImpact: '+15% sales',
        priority: 'HIGH',
      },
      {
        id: 2,
        type: 'BID_DECREASE',
        keyword: 'bluetooth speaker',
        currentBid: 1.20,
        suggestedBid: 0.95,
        reason: 'High ACoS, low conversion',
        potentialImpact: '-20% cost',
        priority: 'MEDIUM',
      },
    ];
  }

  async getOptimizationHistory() {
    return [
      {
        id: 1,
        date: '2025-11-14',
        action: 'Bid increased for "wireless headphones"',
        from: 1.50,
        to: 1.75,
        result: '+12% sales',
      },
      {
        id: 2,
        date: '2025-11-13',
        action: 'Paused keyword "expensive item"',
        result: '-$50 wasted spend',
      },
    ];
  }

  async applyOptimizations() {
    return {
      success: true,
      message: 'Optimizations applied successfully',
      applied: 2,
    };
  }
}
