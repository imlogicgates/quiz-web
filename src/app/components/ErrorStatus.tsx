export const ErrorStatus = ({ error }: { error: string }) => {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <div className="bg-pink-100 border border-pink-400 text-pink-700 px-4 py-3 rounded mb-4">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="bg-pink-600 hover:bg-pink-700 text-white font-medium py-2 px-4 rounded"
        >
          Try Again
        </button>
      </div>
    </div>
  );
};
