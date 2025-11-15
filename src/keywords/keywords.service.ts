import { Injectable } from '@nestjs/common';

@Injectable()
export class KeywordsService {
  async getAllKeywords() {
    // Demo data
    return [
      {
        id: 1,
        keyword: 'wireless headphones',
        campaignName: 'Winter Sale 2025',
        matchType: 'BROAD',
        bid: 1.50,
        impressions: 5000,
        clicks: 150,
        ctr: 3.0,
        cpc: 0.95,
        orders: 15,
        acos: 31.5,
        status: 'ENABLED',
      },
      {
        id: 2,
        keyword: 'bluetooth speaker',
        campaignName: 'Spring Collection',
        matchType: 'PHRASE',
        bid: 1.20,
        impressions: 4200,
        clicks: 126,
        ctr: 3.0,
        cpc: 0.88,
        orders: 12,
        acos: 29.3,
        status: 'ENABLED',
      },
    ];
  }

  async getKeywordPerformance() {
    return {
      totalKeywords: 2,
      activeKeywords: 2,
      avgCtr: 3.0,
      avgCpc: 0.915,
      avgAcos: 30.4,
      totalClicks: 276,
      totalOrders: 27,
    };
  }
}
