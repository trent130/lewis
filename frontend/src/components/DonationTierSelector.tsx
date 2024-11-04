import React from 'react';
import { cn } from '../utils/cn';

interface DonationTier {
  amount: number;
  label: string;
  description: string;
}

const tiers: DonationTier[] = [
  { amount: 25, label: 'Friend', description: 'Support educational programs' },
  { amount: 100, label: 'Advocate', description: 'Fund research initiatives' },
  { amount: 500, label: 'Champion', description: 'Make a lasting impact' },
];

interface Props {
  selectedAmount: number;
  onSelect: (amount: number) => void;
}

export function DonationTierSelector({ selectedAmount, onSelect }: Props) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {tiers.map((tier) => (
        <button
          key={tier.amount}
          type="button"
          onClick={() => onSelect(tier.amount)}
          className={cn(
            'relative rounded-lg p-4 cursor-pointer focus:outline-none',
            'border-2 transition-colors duration-200',
            selectedAmount === tier.amount
              ? 'border-red-600 bg-red-50'
              : 'border-gray-300 hover:border-red-300'
          )}
        >
          <div className="flex flex-col text-left">
            <span className="text-lg font-semibold text-gray-900">{tier.label}</span>
            <span className="mt-1 text-2xl font-bold text-red-600">${tier.amount}</span>
            <span className="mt-2 text-sm text-gray-500">{tier.description}</span>
          </div>
        </button>
      ))}
    </div>
  );
}