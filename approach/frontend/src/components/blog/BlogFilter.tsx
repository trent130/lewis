import React from 'react';
import { CheckIcon } from '@heroicons/react/24/outline';
import { cn } from '../../utils/cn';

interface Category {
  id: string;
  name: string;
  count: number;
}

interface Props {
  categories: Category[];
  selectedCategories: string[];
  onCategoryChange: (categoryId: string) => void;
}

export function BlogFilter({ categories, selectedCategories, onCategoryChange }: Props) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">Categories</h3>
      <div className="space-y-2">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={cn(
              'flex items-center justify-between w-full px-3 py-2 text-sm rounded-md',
              selectedCategories.includes(category.id)
                ? 'bg-red-50 text-red-700'
                : 'text-gray-700 hover:bg-gray-50'
            )}
          >
            <div className="flex items-center">
              <div className={cn(
                'w-4 h-4 mr-2 rounded flex items-center justify-center',
                selectedCategories.includes(category.id)
                  ? 'bg-red-600'
                  : 'border border-gray-300'
              )}>
                {selectedCategories.includes(category.id) && (
                  <CheckIcon className="w-3 h-3 text-white" />
                )}
              </div>
              <span>{category.name}</span>
            </div>
            <span className="text-sm text-gray-500">{category.count}</span>
          </button>
        ))}
      </div>
    </div>
  );
}