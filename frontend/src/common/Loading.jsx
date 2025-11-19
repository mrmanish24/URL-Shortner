import { Spinner } from "@/components/ui/spinner"


const Loading = () => {
  return (
    <div className="h-screen w-full flex items-center justify-center">
      <div className="flex items-center gap-3 text-lg font-medium">
        <span>Loading</span>
        <Spinner />
      </div>
    </div>
  );
};

export default Loading;
