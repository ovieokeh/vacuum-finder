import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import { Link, Outlet } from "react-router";
import { Helmet } from "react-helmet";
import { Button } from "@headlessui/react";

import { PageHeader } from "../../components/page-header";
import { useProtectedRoute } from "../../hooks/use-protected-route";
import { useSiteConfig } from "../../providers/site-config";
import { useWindowWidth } from "../../hooks/use-window-width";
import { useSearchVacuums } from "../../database/hooks";
import { VacuumsTable } from "../../components/vacuums-table";
import { useContentScroll } from "../../hooks/use-disable-body-scroll";

export function AdminDashboardPage() {
  useContentScroll();

  useProtectedRoute();

  const [page, setPage] = useState(1);

  const { user, userToken, currency, logout } = useSiteConfig();
  const windowWidth = useWindowWidth();

  const vacuumsQuery = useSearchVacuums({
    filters: {},
    owned: true,
    page,
    limit: 15,
  });
  const refetch = vacuumsQuery.refetch;
  const vacuums = useMemo(() => vacuumsQuery.data, [vacuumsQuery.data]);

  useEffect(() => {
    if (userToken) {
      refetch();
    }
  }, [currency, userToken, refetch]);

  const displayName = user?.user_metadata.full_name ?? user?.email;

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Dashboard - Robot Vacuum Finder & Guide</title>
        <meta name="description" content="Add or update any robot vacuum in the collection" />
      </Helmet>
      <div className="flex flex-col bg-background text-text w-full">
        <PageHeader
          title="Dashboard"
          subtitle={`Welcome back, ${displayName}`}
          containerClassName="border-b border-border"
        >
          <Button onClick={logout} className="w-fit bg-background-alt border! border-border! hover:border-red-800">
            Logout
          </Button>
        </PageHeader>

        <div className="grow flex flex-col gap-4 md:mx-auto max-w-[1240px] w-full p-4">
          <h2 className="text-2xl font-semibold">Your vacuum entries</h2>

          <div className="flex flex-col gap-2">
            <Link
              to="/admin/vacuums/add"
              className="block w-fit bg-background-alt text-text border border-border py-2 px-4 rounded"
            >
              Add a new vacuum
            </Link>
            <VacuumsTable
              navigateRoot="/admin/vacuums"
              results={vacuums?.results}
              containerWidth={windowWidth}
              emptyView={
                <div className="py-2 text-text/90 italic">
                  You don't have any vacuum entries yet. Add a new vacuum with the button above
                </div>
              }
            />

            <TablePagination
              page={vacuums?.page ?? 1}
              setPage={(page) => setPage(page)}
              totalCount={vacuumsQuery.data?.total ?? 0}
              limit={vacuums?.limit ?? 10}
            />
          </div>
        </div>

        <Outlet />
      </div>
    </>
  );
}

interface TablePaginationProps {
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
  limit: number;
  totalCount: number;
}

const TablePagination = ({ page, setPage, limit, totalCount }: TablePaginationProps) => {
  const pages = useMemo(() => {
    const totalPages = Math.ceil(totalCount / limit);
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }, [totalCount, limit]);

  const hasNextPage = pages.length > 0 && page < pages[pages.length - 1];

  return (
    <div className="flex items-center justify-center gap-2">
      <Button
        onClick={() => setPage((prev) => Math.max(1, prev - 1))}
        disabled={page === 1}
        className="w-fit bg-background-alt border border-border disabled:opacity-50"
      >
        Previous
      </Button>
      {pages.map((p) => (
        <Button
          key={p}
          onClick={() => setPage(p)}
          className={`size-8 text-xs p-0! bg-background-alt border border-border ${
            p === page ? "font-bold! bg-accent!" : ""
          }`}
        >
          {p}
        </Button>
      ))}
      <Button
        onClick={() => setPage((prev) => prev + 1)}
        disabled={!hasNextPage}
        className="w-fit bg-background-alt border border-border disabled:opacity-50"
      >
        Next
      </Button>
    </div>
  );
};
