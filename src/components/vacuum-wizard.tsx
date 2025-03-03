import { useState } from "react";
import { VacuumForm } from "./vacuum-form";
import { VacuumResults } from "./vacuum-results";
import { VacuumFilterOptions, Vacuum } from "../types";

export function VacuumWizard() {
  const [results, setResults] = useState<Vacuum[]>([]);

  const handleSubmit = (formData: VacuumFilterOptions) => {
    console.log(formData);
    // TODO: Fetch or filter results based on formData
    setResults([]); // Placeholder for now
  };

  return (
    <div className="flex flex-col sm:flex-row">
      <VacuumForm onSubmit={handleSubmit} />
      <VacuumResults results={results} />
    </div>
  );
}
