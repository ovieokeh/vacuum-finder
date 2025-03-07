import { Button } from "@headlessui/react";
import { PageHeader } from "../../components/page-header";
import { useProtectedRoute } from "../../hooks/use-protected-route";
import { useSiteConfig } from "../../providers/site-config";
import { useQuery } from "@tanstack/react-query";
import { Vacuum } from "../../types";
import { VacuumResults } from "../../components/vacuum-results";
import { useWindowWidth } from "../../hooks/use-window-width";
import { useEffect, useMemo } from "react";
import { Link, Outlet } from "react-router-dom";

export function AdminDashboardPage() {
  useProtectedRoute();

  const { userToken, currency, logout } = useSiteConfig();
  const windowWidth = useWindowWidth();

  const vacuumsQuery = useQuery<Vacuum[]>({
    queryKey: ["user-vacuums"],
    queryFn: async () => {
      const response = await fetch("/api/vacuums?owned=true", {
        headers: { Authorization: `${userToken}` },
      });
      if (!response.ok) throw new Error("Failed to fetch vacuums");
      return response.json();
    },
    enabled: !!userToken,
  });

  const refetch = vacuumsQuery.refetch;
  useEffect(() => {
    if (userToken) {
      refetch();
    }
  }, [refetch, currency, userToken]);

  const vacuums = useMemo(() => vacuumsQuery.data, [vacuumsQuery.data]);

  console.log("rendering AdminDashboardPage");

  return (
    <div className="flex flex-col min-h-screen bg-background text-text w-full">
      <PageHeader
        title="Dashboard"
        subtitle="Add or update any robot vacuum in the collection"
        containerClassName="border-b border-border"
      >
        <Button onClick={logout} className="w-fit bg-background-alt border! border-border! hover:border-red-800">
          Logout
        </Button>
      </PageHeader>

      <div className="grow flex flex-col gap-4 md:mx-auto max-w-[1200px] w-full p-4">
        <h2 className="text-2xl font-semibold">Your vacuum entries</h2>

        <div className="flex flex-col gap-2">
          <Link
            to="/admin/vacuum/add"
            className="block w-fit bg-background-alt text-text border border-border py-2 px-4 rounded"
          >
            Add a new vacuum
          </Link>
          <VacuumResults
            results={vacuums}
            containerWidth={windowWidth}
            navigateRoot="/admin/vacuum"
            emptyView={
              <div className="py-2 text-text/90 italic">
                You don't have any vacuum entries yet. Add a new vacuum with the button above
              </div>
            }
          />
        </div>
      </div>

      <Outlet />
    </div>
  );
}
