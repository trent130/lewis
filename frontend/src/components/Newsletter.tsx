import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from './ui/Buttons';
import toast from 'react-hot-toast';

const newsletterSchema = z.object({
  email: z.string().email('Please enter a valid email address')
});

type NewsletterFormData = z.infer<typeof newsletterSchema>;

export function Newsletter() {
  const [isLoading, setIsLoading] = React.useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<NewsletterFormData>({
    resolver: zodResolver(newsletterSchema)
  });

  const onSubmit = async (data: NewsletterFormData) => {
    try {
      setIsLoading(true);
      // API call would go here
      toast.success('Thank you for subscribing to our newsletter!');
      reset();
    } catch (error) {
      toast.error('Failed to subscribe. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-red-600 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
          <p className="text-lg mb-8 text-red-100">
            Join our newsletter to receive updates about our work and impact
          </p>
          <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto">
            <div className="flex gap-2">
              <div className="flex-1">
                <input
                  {...register('email')}
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-2 rounded-md text-gray-900"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-200">{errors.email.message}</p>
                )}
              </div>
              <Button 
                type="submit" 
                disabled={isLoading}
                className="bg-white text-red-600 hover:bg-red-50"
              >
                Subscribe
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}