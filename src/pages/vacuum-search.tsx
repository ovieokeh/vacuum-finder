import { Outlet } from "react-router-dom";
import { Helmet } from "react-helmet";

import { VacuumWizard } from "../components/vacuum-wizard";

export function VacuumSearchPage() {
  return (
    <>
      <Helmet>
        <title>Robot Vacuum Buyer Tool</title>
        <meta name="description" content="Find the best robot vacuum for your needs with our buyer tool." />
      </Helmet>
      <VacuumWizard className="md:mx-auto md:max-w-[1200px] pt-2 px-4 md:p-0" />
      <Outlet />
    </>
  );
}
