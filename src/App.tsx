import { Routes, Route, useLocation } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { Helmet } from "react-helmet";

import { SiteConfigProvider } from "./providers/site-config";
import { Navigation } from "./components/navigation";
import { HomePage } from "./pages/home";
import { GuidesPage } from "./pages/guides";
import { VacuumSearchPage } from "./pages/vacuums";
import { VacuumInfoPage } from "./pages/vacuums/[vacuumId]";
import { PrivacyPolicyPage } from "./pages/privacy-policy";
import { TermsOfServicePage } from "./pages/terms-of-service";
import { AdminAuthPage } from "./pages/admin/auth";
import { AdminDashboardPage } from "./pages/admin/dashboard";
import { AdminVacuumAddPage } from "./pages/admin/vacuums/add";
import { AdminVacuumEditPage } from "./pages/admin/vacuums/[vacuumId]";
import { reduxStore } from "./redux";
import "./index.css";
import { useEffect, useRef, useState } from "react";

import { useSeoSetup } from "./hooks/use-seo-setup";

const queryClient = new QueryClient();

export default function App() {
  const location = useLocation();
  const navRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [navHeight, setNavHeight] = useState(0);
  useSeoSetup();

  // scroll restoration
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo(0, 0);
    }
  }, [location.pathname]);

  useEffect(() => {
    if (navRef.current) {
      setNavHeight(navRef.current.clientHeight);
    }
  }, []);

  return (
    <>
      <Provider store={reduxStore}>
        <QueryClientProvider client={queryClient}>
          <SiteConfigProvider>
            <Helmet>
              <meta charSet="utf-8" />
              <title>Robot Vacuum Finder & Guide</title>
              <meta
                name="description"
                content="Find the best robot vacuum for your needs with our vacuum finder tool. Compare robot vacuums by features, price, and more."
              />
            </Helmet>
            <Navigation ref={navRef} />

            <div
              className={`mt-0 overflow-y-scroll`}
              ref={scrollRef}
              style={{
                height: `calc(100vh - ${navHeight + 10}px)`,
                overflow: "hidden",
              }}
            >
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="guides" element={<GuidesPage />} />
                <Route path="vacuums" element={<VacuumSearchPage />}>
                  <Route path=":vacuumId" element={<VacuumInfoPage />} />
                </Route>
                <Route path="privacy-policy" element={<PrivacyPolicyPage />} />
                <Route path="terms-of-service" element={<TermsOfServicePage />} />

                <Route path="admin/auth" element={<AdminAuthPage />} />

                <Route path="admin/vacuums/add" element={<AdminVacuumAddPage />} />
                <Route path="admin" element={<AdminDashboardPage />}>
                  <Route path="vacuums/:vacuumId" element={<AdminVacuumEditPage />} />
                </Route>
              </Routes>
            </div>
          </SiteConfigProvider>
        </QueryClientProvider>
      </Provider>
    </>
  );
}
