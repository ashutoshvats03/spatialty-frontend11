
export default function LoadingPage() {
  return (
    <div className="flex items-center justify-center h-screen w-screen bg-gradient-to-r from-white via-white to-red-400">
      <div className="flex flex-col items-center space-y-6">
        {/* Spinner */}
        <div className="w-16 h-16 border-4 border-red-400 border-dashed rounded-full animate-spin"></div>

        {/* Loading Text */}
        <p className="text-black text-2xl font-bold animate-pulse">
          Loading, please wait...
        </p>
      </div>
    </div>
  );
}
