import { Link } from "react-router";

export const Footer = () => {
  return (
    <footer className="mt-auto w-full bg-background">
      <div className="mx-auto max-w-7xl px-6 py-6 flex flex-col md:flex-row justify-between items-center">
        <p className="text-sm text-text/90">
          &copy; {new Date().getFullYear()} Robot Vacuum Finder. All rights reserved.
        </p>
        <nav className="mt-4 md:mt-0">
          <ul className="flex gap-4 text-sm px-0! *:list-none!">
            <li>
              <Link to="/terms-of-service" className="text-text! hover:underline">
                Terms of Service
              </Link>
            </li>
            <li>
              <Link to="/privacy-policy" className="text-text! hover:underline">
                Privacy Policy
              </Link>
            </li>
          </ul>
          <p className="text-sm text-text/70">
            Vacuum Finder is not affiliated with any vacuum brands or manufacturers. We are a participant in the Amazon
            Services LLC Associates Program.
          </p>
        </nav>
      </div>
    </footer>
  );
};
