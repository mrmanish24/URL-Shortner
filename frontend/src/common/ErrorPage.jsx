import { Link } from "react-router-dom";

const ErrorPage = () => {
  return (
    <div className="relative bg-[url('/background/404Errorwithacuteanimalbro.svg')] bg-no-repeat bg-center w-full h-screen">
      <div className="absolute bottom-2 right-3">
        <Link
          to="https://storyset.com/web"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[10px] text-gray-400 hover:text-gray-300"
        >
          web illustrations by Storyset
        </Link>
      </div>
    </div>
  );
};

export default ErrorPage;
