import React from 'react';

interface Props {
  current: number;
  goal: number;
  donorsCount: number;
}

export function DonationProgress({ current, goal, donorsCount }: Props) {
  const percentage = Math.min((current / goal) * 100, 100);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-baseline">
        <div>
          <span className="text-2xl font-bold text-gray-900">${current.toLocaleString()}</span>
          <span className="text-gray-500"> raised of ${goal.toLocaleString()}</span>
        </div>
        <span className="text-sm font-medium text-gray-500">
          {donorsCount} donors
        </span>
      </div>

      <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="absolute h-full bg-red-600 transition-all duration-500 ease-in-out"
          style={{ width: `${percentage}%` }}
        />
      </div>

      <p className="text-sm text-gray-500 text-center">
        Help us reach our goal! Every donation makes a difference.
      </p>
    </div>
  );
}