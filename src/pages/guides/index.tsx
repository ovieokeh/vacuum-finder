import { PageHeader } from "../../components/page-header";

export function GuidesPage() {
  return (
    <>
      <PageHeader
        title="Guides"
        subtitle="Learn how to use the app"
        containerClassName="border-b border-border"
        showBreadcrumbs
      />

      <div className="md:mx-auto md:max-w-[1240px] px-4"></div>
    </>
  );
}
