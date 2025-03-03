import { Vacuum } from "../types";

interface VacuumResultsProps {
  results: Vacuum[]; // Will replace 'any' with proper type later
}

export function VacuumResults({ results }: VacuumResultsProps) {
  return (
    <div className="bg-background grow p-4 rounded-lg">
      <h2 className="text-lg font-bold text-secondary">Recommended Vacuums</h2>
      {results.length === 0 ? (
        <p className="text-gray-500">No results found. Adjust filters and try again.</p>
      ) : (
        <ul className="mt-2 space-y-2">
          {results.map((vacuum) => (
            <li key={vacuum.id} className="p-2 bg-white border rounded-md shadow">
              {vacuum.name} - ${vacuum.price}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
