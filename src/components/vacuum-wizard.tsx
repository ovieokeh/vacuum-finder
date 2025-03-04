import { VacuumForm } from "./vacuum-form";
import { VacuumResults } from "./vacuum-results";
import { VacuumsFilter } from "../types";
import { useDatabase } from "../database/hooks";
import { useSiteConfig } from "../providers/site-config";

export function VacuumWizard() {
  const { navHeight } = useSiteConfig();
  const { filterVacuumsMutation } = useDatabase();

  const handleSubmit = (formData: VacuumsFilter) => {
    filterVacuumsMutation.mutate(formData);
  };

  return (
    <div
      className={`flex flex-col-reverse justify-between sm:mx-auto sm:max-w-[1200px] sm:flex-row sm:justify-normal`}
      style={{
        height: `calc(100vh - ${navHeight + 16}px)`,
      }}
    >
      <div className="grow">
        <VacuumForm onSubmit={handleSubmit} />
      </div>

      <div className="h-[84%] sm:w-3/4 sm:h-full overflow-y-scroll py-4 sm:px-4 pt-0 bg-background-alt">
        <h2 className="text-lg font-bold text-secondary">Recommended Vacuums</h2>
        <VacuumResults results={filterVacuumsMutation.data ?? []} />
      </div>
    </div>
  );
}
