import { FaBatteryHalf, FaDog, FaTrashAlt, FaMobileAlt } from "react-icons/fa";
import { BsFillVolumeUpFill } from "react-icons/bs";
import { GiVacuumCleaner, GiWaterDrop } from "react-icons/gi";
import { MdSensors, MdLayers } from "react-icons/md";

import { CurrencySymbolMapping, Vacuum } from "../types";
import { useSiteConfig } from "../providers/site-config";

interface VacuumResultsProps {
  results: Vacuum[];
}

export function VacuumResults({ results }: VacuumResultsProps) {
  return (
    <>
      {results.length === 0 ? (
        <p className="text-gray-500">No results found. Adjust filters and try again.</p>
      ) : (
        <ul className="space-y-2">
          {results.map((vacuum) => (
            <VacuumResult key={vacuum.id} vacuum={vacuum} />
          ))}
        </ul>
      )}
    </>
  );
}

const VacuumResult = ({ vacuum }: { vacuum: Vacuum }) => {
  const { currency } = useSiteConfig();

  const USD_TO_EUR = 0.85;
  const price = currency === "USD" ? vacuum.price : (vacuum.price * USD_TO_EUR).toFixed(2);

  return (
    <li className="flex flex-col sm:flex-row items-start sm:items-center p-4 border border-border rounded-lg shadow">
      {/* Image */}
      <div className="w-24 h-24 flex-shrink-0 mr-4 mb-2 sm:mb-0 overflow-hidden rounded">
        <img className="object-cover w-full h-full" src={vacuum.image} alt={vacuum.name} />
      </div>

      {/* Main info */}
      <div className="flex flex-col flex-grow">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-base font-semibold text-primary">{vacuum.name}</h3>
            <p className="text-sm text-gray-500">
              {vacuum.brand} – {vacuum.model}
            </p>
          </div>
          <p className="mt-2 sm:mt-0 text-lg font-bold text-accent">
            {CurrencySymbolMapping[currency]}
            {price}
          </p>
        </div>

        {/* Feature icons */}
        <div className="mt-3 flex flex-wrap gap-3 text-sm text-gray-600">
          {/* Battery life */}
          <div className="inline-flex items-center space-x-1">
            <FaBatteryHalf />
            <span>{vacuum.batteryLifeMins} min</span>
          </div>

          {/* Suction Power */}
          <div className="inline-flex items-center space-x-1">
            <GiVacuumCleaner />
            <span>{vacuum.suctionPowerPa} Pa</span>
          </div>

          {/* Noise Level */}
          {vacuum.noiseLevelDb !== null && (
            <div className="inline-flex items-center space-x-1">
              <BsFillVolumeUpFill />
              <span>{vacuum.noiseLevelDb} dB</span>
            </div>
          )}

          {/* Mapping Tech */}
          <div className="inline-flex items-center space-x-1">
            <MdSensors />
            <span>{vacuum.mappingTechnology}</span>
          </div>

          {/* Multi-floor Mapping */}
          {vacuum.multiFloorMapping && (
            <div className="inline-flex items-center space-x-1">
              <MdLayers />
              <span>Multi-floor</span>
            </div>
          )}

          {/* Virtual Walls */}
          {vacuum.virtualWalls && (
            <div className="inline-flex items-center space-x-1">
              <MdSensors />
              <span>Virtual walls</span>
            </div>
          )}

          {/* Mop Function */}
          {vacuum.mopFunction && (
            <div className="inline-flex items-center space-x-1">
              <GiWaterDrop />
              <span>Mop</span>
            </div>
          )}

          {/* Self-emptying */}
          {vacuum.selfEmptying && (
            <div className="inline-flex items-center space-x-1">
              <FaTrashAlt />
              <span>Self-empty</span>
            </div>
          )}

          {/* App Control */}
          {vacuum.appControl && (
            <div className="inline-flex items-center space-x-1">
              <FaMobileAlt />
              <span>App Control</span>
            </div>
          )}

          {/* Good for Pet Hair */}
          {vacuum.petHair && (
            <div className="inline-flex items-center space-x-1">
              <FaDog />
              <span>Pet-friendly</span>
            </div>
          )}
        </div>

        {/* More info */}

        {/* Affiliate links (todo) */}
      </div>
    </li>
  );
};

// const MoreInfoModal = ({ vacuum }: { vacuum: Vacuum }) => {}
