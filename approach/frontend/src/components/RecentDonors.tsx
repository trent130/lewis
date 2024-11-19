import React, { Suspense } from "react";
import { donationService } from "../services/donationService";
import { LoadingSpinner } from "./ui/LoadingSpinner";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";

const queryClient = new QueryClient();

function DonorsList() {
  const { data: donors } = useQuery({
    queryKey: ["recent-donors"],
    queryFn: () => donationService.getRecentDonors(),
  });

  return (
    <div className="space-y-4">
      {donors?.map((donor) => (
        <div key={donor.id} className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
            <span className="text-red-600 font-medium">
              {donor.name.charAt(0)}
            </span>
          </div>
          <div>
            <p className="font-medium text-gray-900">
              {donor.isAnonymous ? "Anonymous Donor" : donor.name}
            </p>
            <p className="text-sm text-gray-500">
              Donated ${donor.amount} •{" "}
              {new Date(donor.date).toLocaleDateString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

export function RecentDonors() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Recent Supporters
        </h3>
        <Suspense
          fallback={
            <div className="flex justify-center py-8">
              <LoadingSpinner />
            </div>
          }
        >
          <DonorsList />
        </Suspense>
        <div className="mt-6 text-center">
          <a
            href="/donate"
            className="text-red-600 hover:text-red-700 font-medium"
          >
            Make a Donation →
          </a>
        </div>
      </div>
    </QueryClientProvider>
  );
}
