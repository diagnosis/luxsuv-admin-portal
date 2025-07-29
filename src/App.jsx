import {createRouter, RouterProvider} from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { routeTree } from './routeTree.gen'
const router = createRouter({ routeTree })


// Create a query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      retry: (failureCount, error) => {
        // Don't retry on 401/403 errors
        if (error?.response?.status === 401 || error?.response?.status === 403) {
          return false;
        }
        return failureCount < 3;
      },
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* Hidden element to ensure Tailwind generates all utility classes used in CSS */}
      <div className="hidden bg-primary-50 bg-primary-100 bg-primary-200 bg-primary-300 bg-primary-400 bg-primary-500 bg-primary-600 bg-primary-700 bg-primary-800 bg-primary-900 text-primary-50 text-primary-100 text-primary-200 text-primary-300 text-primary-400 text-primary-500 text-primary-600 text-primary-700 text-primary-800 text-primary-900 border-primary-50 border-primary-100 border-primary-200 border-primary-300 border-primary-400 border-primary-500 border-primary-600 border-primary-700 border-primary-800 border-primary-900 bg-success-50 bg-success-100 bg-success-500 bg-success-600 text-success-50 text-success-100 text-success-500 text-success-600 bg-warning-50 bg-warning-100 bg-warning-500 bg-warning-600 text-warning-50 text-warning-100 text-warning-500 text-warning-600 bg-error-50 bg-error-100 bg-error-500 bg-error-600 text-error-50 text-error-100 text-error-500 text-error-600 bg-accent-50 bg-accent-100 bg-accent-200 bg-accent-300 bg-accent-400 bg-accent-500 bg-accent-600 bg-accent-700 bg-accent-800 bg-accent-900 text-accent-50 text-accent-100 text-accent-200 text-accent-300 text-accent-400 text-accent-500 text-accent-600 text-accent-700 text-accent-800 text-accent-900"></div>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export default App;