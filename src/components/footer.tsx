import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="mt-auto w-full bg-background">
      <div className="mx-auto max-w-7xl px-6 py-6 flex flex-col md:flex-row justify-between items-center">
        <p className="text-sm text-text/90">
          &copy; {new Date().getFullYear()} Robot Vacuum Finder. All rights reserved.
        </p>
        <nav className="mt-4 md:mt-0">
          <ul className="flex gap-4 text-sm">
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
        </nav>
      </div>
    </footer>
  );
};
