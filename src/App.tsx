import { Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { Helmet } from "react-helmet";

import { SiteConfigProvider } from "./providers/site-config";
import { Navigation } from "./components/navigation";
import { HomePage } from "./pages/home";
import { GuidesPage } from "./pages/guides";
import { VacuumSearchPage } from "./pages/vacuum-search";
import { VacuumInfoPage } from "./pages/vacuum-info";
import { PrivacyPolicyPage } from "./pages/privacy-policy";
import { TermsOfServicePage } from "./pages/terms-of-service";
import { reduxStore } from "./redux";
import "./index.css";

const queryClient = new QueryClient();

export default function App() {
  return (
    <Provider store={reduxStore}>
      <QueryClientProvider client={queryClient}>
        <SiteConfigProvider>
          <Helmet>
            <meta charSet="utf-8" />
            <title>Robot Vacuum Buyer Tool & Guide</title>
            <meta
              name="description"
              content="Find the best robot vacuum for your needs with our buyer tool. Compare robot vacuums by features, price, and more."
            />
          </Helmet>
          <Navigation />

          <div className="h-[calc(100%-4rem)] overflow-y-scroll">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="guides" element={<GuidesPage />} />
              <Route path="vacuum-search" element={<VacuumSearchPage />}>
                <Route path=":vacuumId" element={<VacuumInfoPage />} />
              </Route>
              <Route path="privacy-policy" element={<PrivacyPolicyPage />} />
              <Route path="terms-of-service" element={<TermsOfServicePage />} />
            </Routes>
          </div>
        </SiteConfigProvider>
      </QueryClientProvider>
    </Provider>
  );
}
