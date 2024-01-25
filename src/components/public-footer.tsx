import { SignInButton } from "@clerk/nextjs";

const PublicFooter = () => {
  return (
    <footer className="flex min-h-12 items-center justify-center">
      <div className="md:hidden">
        <SignInButton redirectUrl="/" mode="modal">
          <button className="dark:hover:bg-blud-700 mx-10 mb-4 h-12 rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 md:mb-0 dark:bg-blue-600 dark:focus:ring-blue-800">
            Login
          </button>
        </SignInButton>
      </div>
    </footer>
  );
};

export default PublicFooter;
