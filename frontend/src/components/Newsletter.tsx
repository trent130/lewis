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
    <div className="bg-gradient-to-r from-red-600 to-red-700 text-white py-16">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-4xl font-extrabold mb-4">Stay Updated</h2>
          <p className="text-lg mb-8 text-red-100 max-w-md mx-auto">
            Join our newsletter to receive updates about our work and impact.
          </p>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col md:flex-row items-center gap-4 max-w-md mx-auto">
            <div className="flex-1 w-full">
              <input
                {...register('email')}
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-3 rounded-lg text-gray-800 focus:ring-2 focus:ring-offset-2 focus:ring-red-300 outline-none transition-all duration-200"
              />
              {errors.email && (
                <p className="mt-2 text-sm text-red-200">{errors.email.message}</p>
              )}
            </div>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-white text-red-600 font-semibold px-6 py-2 rounded-lg transition duration-300 hover:bg-red-50 hover:shadow-lg disabled:opacity-50"
              variant="ghost"
            >
              {isLoading ? 'Subscribing...' : 'Subscribe'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
