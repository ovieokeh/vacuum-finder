import { Outlet } from "react-router-dom";
import { Helmet } from "react-helmet";

import { VacuumWizard } from "../../components/vacuum-wizard";

export function VacuumSearchPage() {
  return (
    <>
      <Helmet>
        <title>Robot Vacuum Finder</title>
        <meta name="description" content="Find the best robot vacuum for your needs with our vacuum finder tool." />
      </Helmet>
      <VacuumWizard className="md:mx-auto md:max-w-[1200px] p-4" />
      <Outlet />
    </>
  );
}
