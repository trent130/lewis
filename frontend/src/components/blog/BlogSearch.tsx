import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { debounce } from '../../utils/performance';

const searchSchema = z.object({
  query: z.string()
});

type SearchFormData = z.infer<typeof searchSchema>;

interface Props {
  onSearch: (query: string) => void;
}

export function BlogSearch({ onSearch }: Props) {
  const { register, watch } = useForm<SearchFormData>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      query: ''
    }
  });

  const debouncedSearch = React.useMemo(
    () => debounce((value: string) => onSearch(value), 300),
    [onSearch]
  );

  React.useEffect(() => {
    const subscription = watch((value) => {
      if (value.query !== undefined) {
        debouncedSearch(value.query);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, debouncedSearch]);

  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
      </div>
      <input
        type="search"
        {...register('query')}
        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-red-500 focus:border-red-500 sm:text-sm"
        placeholder="Search articles..."
      />
    </div>
  );
}