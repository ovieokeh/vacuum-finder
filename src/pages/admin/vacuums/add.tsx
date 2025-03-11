import { Helmet } from "react-helmet";

import { PageHeader } from "../../../components/page-header";
import { AdminVacuumForm } from "../../../components/vacuum-form";
import { useProtectedRoute } from "../../../hooks/use-protected-route";

export function AdminVacuumAddPage() {
  useProtectedRoute();

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Add an entry - Robot Vacuum Finder & Guide</title>
        <meta name="description" content="Add a new robot vacuum to the collection" />
      </Helmet>
      <PageHeader
        title="Add Vacuum"
        subtitle="Add a new robot vacuum to the collection"
        containerClassName="border-b border-border"
        showBreadcrumbs
      />

      <div className="md:mx-auto md:max-w-[1240px] pt-2 px-4">
        <AdminVacuumForm />
      </div>
    </>
  );
}
