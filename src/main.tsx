import { useEffect, useRef } from "react";
import { Routes, Route, useLocation } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { SiteConfigProvider } from "./providers/site-config";
import { Navigation } from "./components/navigation";
import { HomePage } from "./pages/home";
// import { GuidesPage } from "./pages/guides";
import { VacuumSearchPage } from "./pages/vacuums";
import { VacuumInfoPage } from "./pages/vacuums/[vacuumId]";
import { PrivacyPolicyPage } from "./pages/privacy-policy";
import { TermsOfServicePage } from "./pages/terms-of-service";
import { AdminAuthPage } from "./pages/admin/auth";
import { AdminDashboardPage } from "./pages/admin/dashboard";
import { AdminVacuumAddPage } from "./pages/admin/vacuums/add";
import { AdminVacuumEditPage } from "./pages/admin/vacuums/[vacuumId]";
import { QuizPage } from "./pages/quiz";
import "./index.css";

import { useDisableNumberInputScroll } from "./hooks/use-disable-number-input-scroll";
import { PageHeader } from "./components/page-header";
import { SEO } from "./components/seo";

const queryClient = new QueryClient();

export default function App() {
  const location = useLocation();
  const navRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useDisableNumberInputScroll();

  // scroll restoration
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo(0, 0);
    }
  }, [location.pathname]);

  return (
    <QueryClientProvider client={queryClient}>
      <SiteConfigProvider>
        <SEO />
        <Navigation ref={navRef} />

        <div id="content" className={`mt-0 overflow-y-scroll pb-12 h-[calc(100svh-66px)]`} ref={scrollRef}>
          <Routes>
            {/* <Route path="guides" element={<GuidesPage />} /> */}
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

            <Route path="quiz" element={<QuizPage />} />

            <Route path="/" element={<HomePage />} index />

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
      </SiteConfigProvider>
    </QueryClientProvider>
  );
}

const NotFoundPage = () => {
  return (
    <div className="flex items-center justify-center">
      <PageHeader
        title="404 - Page Not Found"
        subtitle="The page you are looking for does not exist. Try checking the URL for errors or return to the homepage."
        showBreadcrumbs
      />
    </div>
  );
};
