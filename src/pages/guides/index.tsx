import { PageHeader } from "../../components/page-header";
import { SEO } from "../../components/seo";

export function GuidesPage() {
  return (
    <>
      <SEO
        title="Guide - Robot Vacuum Finder & Guide"
        description="Browse through resources and guides to help you make the best decision when buying a robot vacuum."
      />
      <PageHeader
        title="Guides"
        subtitle="Learn how to use the app"
        containerClassName="border-b border-border"
        showBreadcrumbs
      />

      <div className="md:mx-auto md:max-w-[1400px] px-4"></div>
    </>
  );
}
