import { Routes, Route } from "react-router-dom";
import { HomePage } from "./pages/home";
import { Navigation } from "./components/navigation";
import { SiteConfigProvider } from "./providers/site-config";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SiteConfigProvider>
        <Navigation />
        <Routes>
          <Route path="/" element={<HomePage />} />
        </Routes>
      </SiteConfigProvider>
    </QueryClientProvider>
  );
}
