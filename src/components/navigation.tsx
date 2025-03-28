import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { Link, useLocation } from "react-router";
import { LuUser } from "react-icons/lu";

import { useSiteConfig } from "../providers/site-config";

export const Navigation = forwardRef<HTMLDivElement>((_, ref) => {
  const navRef = useRef<HTMLDivElement>(null);
  useImperativeHandle(ref, () => navRef.current as HTMLDivElement);
  const location = useLocation();

  const { user, setNavHeight } = useSiteConfig();

  useEffect(() => {
    if (navRef.current) {
      setNavHeight(navRef.current.clientHeight);
    }
  }, [setNavHeight]);

  const appPages = ["/vacuums", "/vacuums/:id"];
  const isAppPage = appPages.some((page) => location.pathname.startsWith(page));

  return (
    <div className="z-20 p-4 grow shadow sticky h-[66px]" ref={navRef}>
      <div className="max-w-[1400px] mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2 md:gap-6 text-sm md:text-base text-text!">
          <Link to="/" className="text-text! font-semibold">
            <span className="hidden md:block">Robot Vacuum Finder</span>
            <span className="md:hidden">Home</span>
          </Link>

          <div className="flex gap-2 md:gap-6">
            <Link to="/quiz" className="text-text hover:text-text/90">
              Quiz
            </Link>
            {!isAppPage && (
              <Link to="/vacuums" className="text-text hover:text-text/90">
                Search
              </Link>
            )}
            {/* <Link to="/guides" className="text-text hover:text-text/90">
              Guides
            </Link> */}
          </div>
        </div>

        <div className="flex flow-row gap-1 md:gap-4 items-center justify-between">
          {user?.id ? (
            <Link to="/admin" className="text-text hover:text-text/90">
              <LuUser className="size-6" />
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
});
