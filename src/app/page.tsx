'use client';

export default function HomePage() {
  // Middleware handles all routing logic, this page should never be reached
  // But we'll show a loading state just in case
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading Tripilot Admin...</p>
      </div>
    </div>
  );
}
