'use client';
import { useSearchParams } from 'next/navigation';

// This component provides search params to its children
// and handles the Suspense boundary requirement for useSearchParams
export default function SearchParamsProvider({ children }) {
  const searchParams = useSearchParams();
  
  return children({ searchParams });
}
