import { Loader2 } from "lucide-react";

export const Loader = () => {
  return (
    <div className="h-screen w-full flex items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center">
        <Loader2 className="h-12 w-12 text-primary animate-spin" />
        <p className="mt-4 text-gray-500 text-lg">Carregando...</p>
      </div>
    </div>
  );
};
