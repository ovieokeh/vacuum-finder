import { Helmet } from "react-helmet";

import { PageHeader } from "../../components/page-header";

export function GuidesPage() {
  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Guide - Robot Vacuum Finder & Guide</title>
        <meta
          name="description"
          content="Browse through resources and guides to help you make the best decision when buying a robot vacuum."
        />
      </Helmet>
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
