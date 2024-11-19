import React from 'react';
import { cn } from '../utils/cn';

interface DonationTier {
  amount: number;
  label: string;
  description: string;
  monthlyDiscount?: number;
}

const tiers: DonationTier[] = [
  { 
    amount: 25, 
    label: 'Friend', 
    description: 'Support educational programs',
    monthlyDiscount: 10
  },
  { 
    amount: 100, 
    label: 'Advocate', 
    description: 'Fund research initiatives',
    monthlyDiscount: 15
  },
  { 
    amount: 500, 
    label: 'Champion', 
    description: 'Make a lasting impact',
    monthlyDiscount: 20
  },
];

interface Props {
  selectedAmount: number;
  onSelect: (amount: number) => void;
  isMonthly: boolean;
}

export function DonationTierSelector({ selectedAmount, onSelect, isMonthly }: Props) {
  const calculateDiscountedAmount = (amount: number, discount: number) => {
    return amount - (amount * (discount / 100));
  };

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {tiers.map((tier) => {
        const displayAmount = isMonthly && tier.monthlyDiscount
          ? calculateDiscountedAmount(tier.amount, tier.monthlyDiscount)
          : tier.amount;

        return (
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
              <div className="mt-1">
                {isMonthly && tier.monthlyDiscount ? (
                  <>
                    <span className="text-2xl font-bold text-red-600">${displayAmount}</span>
                    <span className="ml-2 text-sm text-gray-500 line-through">${tier.amount}</span>
                    <span className="ml-2 text-sm text-green-600">-{tier.monthlyDiscount}%</span>
                  </>
                ) : (
                  <span className="text-2xl font-bold text-red-600">${displayAmount}</span>
                )}
                {isMonthly && <span className="text-sm text-gray-500">/month</span>}
              </div>
              <span className="mt-2 text-sm text-gray-500">{tier.description}</span>
              {isMonthly && tier.monthlyDiscount && (
                <span className="mt-2 text-sm text-green-600">
                  Save ${(tier.amount - displayAmount).toFixed(2)} monthly
                </span>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}