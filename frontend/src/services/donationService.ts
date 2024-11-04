import api from './api';

export interface DonationData {
  amount: number;
  currency: string;
  donorName: string;
  donorEmail: string;
  message?: string;
}

export const donationService = {
  async processDonation(data: DonationData) {
    const response = await api.post('/donations', data);
    return response.data;
  },

  async getDonationHistory() {
    const response = await api.get('/donations/history');
    return response.data;
  }
};