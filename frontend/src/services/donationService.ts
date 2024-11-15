import api from './api';
import { AxiosError } from 'axios';

export interface DonationData {
  amount: number;
  currency: string;
  donorName: string;
  donorEmail: string;
  message?: string;
  isMonthly: boolean;
  isAnonymous: boolean;
}

export interface Donor {
  id: string;
  name: string;
  amount: number;
  date: string;
  isAnonymous: boolean;
}

export interface DonationResponse {
  id: string;
  status: 'success' | 'pending' | 'failed';
  message: string;
  donation: DonationData;
}

export const donationService = {
  async processDonation(data: DonationData): Promise<DonationResponse> {
    try {
      const response = await api.post<DonationResponse>('/donations/', data);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      throw new Error(
        (axiosError.response?.data as { message: string })?.message || 
        'Failed to process donation'
      );
    }
  },

  async getDonationHistory(): Promise<DonationData[]> {
    try {
      const response = await api.get<DonationData[]>('/donations/history/');
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      throw new Error(
        (axiosError.response?.data as { message: string })?.message || 
        'Failed to fetch donation history'
      );
    }
  },

  async getRecentDonors(): Promise<Donor[]> {
    try {
      const response = await api.get<Donor[]>('/donations/recent/');
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      throw new Error(
        (axiosError.response?.data as { message: string })?.message ||
        'Failed to fetch recent donors'
      );
    }
  }
};