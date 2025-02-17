import DUX from "@/components/ui/Dux";

const LoadingFullScreen = () => {
  return (
    <div className=" h-svh flex flex-col items-center justify-center bg-background w-full">
      {/* Logo */}
      <DUX />

      {/* Spinner and Text */}
      <div className="flex flex-col items-center gap-3">
        {/* Framer Motion Spinner */}

        {/* Loading Text */}
        <p className="text-lg font-medium text-gray-800">Please Wait...</p>
      </div>
    </div>
  );
};

export default LoadingFullScreen;
