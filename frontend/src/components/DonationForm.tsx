import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from './ui/Buttons';
import { LoadingSpinner } from './ui/LoadingSpinner';
import { donationService, type DonationData } from '../services/donationService';
import { DonationTierSelector } from './DonationTierSelector';
import { SocialShare } from './SocialShare';
import { DonationProgress } from './DonationProgress';
import toast from 'react-hot-toast';

const donationSchema = z.object({
  amount: z.number().min(1, 'Amount must be at least 1'),
  donorName: z.string().min(2, 'Name must be at least 2 characters'),
  donorEmail: z.string().email('Invalid email address'),
  message: z.string().optional(),
});

type DonationFormData = z.infer<typeof donationSchema>;

export default function DonationForm() {
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const { 
      register, 
      handleSubmit, 
      formState: { errors }, 
      setValue, 
      watch,
      reset  // Add reset here
    } = useForm<DonationFormData>({
      resolver: zodResolver(donationSchema),
      defaultValues: {
        amount: 25
      }
    });
  

  const currentAmount = watch('amount');

  const handleTierSelect = (amount: number) => {
    setValue('amount', amount, { shouldValidate: true });
  };

  const onSubmit = async (data: DonationFormData) => {
    try {
      setIsSubmitting(true);
      await donationService.processDonation({
        ...data,
        currency: 'USD'
      });
      toast.success('Thank you for your donation!');
      // Reset form but keep the amount
      const amount = data.amount;
      reset();
      setValue('amount', amount);
    } catch (error) {
      toast.error('Failed to process donation. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <DonationProgress 
        current={15000} 
        goal={50000} 
        donorsCount={127}
      />

      <DonationTierSelector 
        selectedAmount={currentAmount}
        onSelect={handleTierSelect}
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
            Donation Amount (USD)
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">$</span>
            </div>
            <input
              {...register('amount', { valueAsNumber: true })}
              type="number"
              min="1"
              step="any"
              className="pl-7 mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>
          {errors.amount && (
            <p className="mt-1 text-sm text-red-600">{errors.amount.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="donorName" className="block text-sm font-medium text-gray-700">
            Your Name
          </label>
          <input
            {...register('donorName')}
            type="text"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
          {errors.donorName && (
            <p className="mt-1 text-sm text-red-600">{errors.donorName.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="donorEmail" className="block text-sm font-medium text-gray-700">
            Email Address
          </label>
          <input
            {...register('donorEmail')}
            type="email"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
          {errors.donorEmail && (
            <p className="mt-1 text-sm text-red-600">{errors.donorEmail.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700">
            Message (Optional)
          </label>
          <textarea
            {...register('message')}
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
          {errors.message && (
            <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
          )}
        </div>

        <Button type="submit" disabled={isSubmitting} fullWidth>
          {isSubmitting ? (
            <div className="flex items-center justify-center">
              <LoadingSpinner size="sm" className="mr-2" />
              Processing...
            </div>
          ) : (
            'Make Donation'
          )}
        </Button>
      </form>

      <div className="pt-6 border-t border-gray-200">
        <SocialShare 
          url={window.location.href}
          title="Support the Lewis Paul Foundation"
          description="Help us make a difference in the lives of those affected by sickle cell disease."
        />
      </div>
    </div>
  );
}