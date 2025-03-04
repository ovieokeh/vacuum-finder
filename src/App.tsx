import { Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { HomePage } from "./pages/home";
import { HelpCenterPage } from "./pages/help-center";
import { Navigation } from "./components/navigation";
import { SiteConfigProvider } from "./providers/site-config";
import "./index.css";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SiteConfigProvider>
        <Navigation />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/help-center" element={<HelpCenterPage />} />
        </Routes>
      </SiteConfigProvider>
    </QueryClientProvider>
  );
}
