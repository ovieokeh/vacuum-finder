import { PageHeader } from "../../components/page-header";
import { AdminVacuumForm } from "../../components/vacuum-form";

export function AdminVacuumAddPage() {
  return (
    <div>
      <PageHeader
        title="Add Vacuum"
        subtitle="Add a new robot vacuum to the collection"
        containerClassName="border-b border-border"
        showBreadcrumbs
      />

      <div className="md:mx-auto md:max-w-[1200px] pt-2 px-4">
        <AdminVacuumForm />
      </div>
    </div>
  );
}
