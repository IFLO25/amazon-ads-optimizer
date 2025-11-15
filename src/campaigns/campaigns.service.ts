import { Injectable } from '@nestjs/common';

@Injectable()
export class CampaignsService {
  async getAllCampaigns() {
    // Demo data
    return [
      {
        id: 1,
        name: 'Winter Sale 2025',
        status: 'ENABLED',
        budget: 1000,
        spent: 750,
        impressions: 15000,
        clicks: 450,
        orders: 45,
        sales: 2250,
      },
      {
        id: 2,
        name: 'Spring Collection',
        status: 'ENABLED',
        budget: 800,
        spent: 520,
        impressions: 12000,
        clicks: 380,
        orders: 38,
        sales: 1900,
      },
    ];
  }

  async getCampaignStats() {
    return {
      totalCampaigns: 2,
      activeCampaigns: 2,
      totalBudget: 1800,
      totalSpent: 1270,
      totalClicks: 830,
      totalOrders: 83,
      totalSales: 4150,
    };
  }
}
