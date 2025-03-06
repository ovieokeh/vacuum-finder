import { Button } from "@headlessui/react";
import { PageHeader } from "../../components/page-header";
import { useProtectedRoute } from "../../hooks/use-protected-route";
import { useSiteConfig } from "../../providers/site-config";

export function AdminDashboardPage() {
  useProtectedRoute();
  const { logout } = useSiteConfig();

  return (
    <div className="flex flex-col min-h-screen bg-background text-text">
      <PageHeader
        title="Dashboard"
        subtitle="Add or update any robot vacuum in the collection"
        containerClassName="border-b border-border"
      >
        <Button onClick={logout} className="w-fit bg-background-alt border! border-border! hover:border-red-800">
          Logout
        </Button>
      </PageHeader>
    </div>
  );
}
