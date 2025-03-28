import { PageHeader } from "../../../components/page-header";
import { AdminVacuumForm } from "../../../components/vacuum-form";
import { useProtectedRoute } from "../../../hooks/use-protected-route";
import { SEO } from "../../../components/seo";

export function AdminVacuumAddPage() {
  useProtectedRoute();

  return (
    <>
      <SEO title="Add an entry - Robot Vacuum Finder & Guide" description="Add a new robot vacuum to the collection" />
      <PageHeader
        title="Add Vacuum"
        subtitle="Add a new robot vacuum to the collection"
        containerClassName="border-b border-border"
        showBreadcrumbs
      />

      <div className="md:mx-auto md:max-w-[1400px] pt-2 px-4">
        <AdminVacuumForm />
      </div>
    </>
  );
}
