import api from './api';

export interface DonationData {
  amount: number;
  currency: string;
  donorName: string;
  donorEmail: string;
  message?: string;
  isMonthly: boolean;
  isAnonymous: boolean;
}

interface Donor {
  id: string;
  name: string;
  amount: number;
  date: string;
  isAnonymous: boolean;
}

export const donationService = {
  async processDonation(data: DonationData) {
    const response = await api.post('/donations', data);
    return response.data;
  },

  async getDonationHistory() {
    const response = await api.get('/donations/history');
    return response.data;
  },

  async getRecentDonors(): Promise<Donor[]> {
    const response = await api.get('/donations/recent');
    return response.data;
  }
};