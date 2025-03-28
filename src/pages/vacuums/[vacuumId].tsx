import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { invariant } from "es-toolkit";
import { CiCircleInfo } from "react-icons/ci";

import { Modal } from "../../components/modal";
import { useAppSelector } from "../../redux";

import { useGetVacuum } from "../../database/hooks";
import { CurrencySymbolMapping, VacuumsFilters } from "../../types";
import { AffiliateLink, VacuumWithAffiliateLink } from "../../database/types";
import { countryCodeToReadable } from "../../shared-utils/locale/locale";
import { SEO } from "../../components/seo";

export function VacuumInfoPage() {
  const { vacuumId } = useParams();
  invariant(vacuumId, "Expected vacuumId to be defined");

  const navigate = useNavigate();
  const vacuumQuery = useGetVacuum(vacuumId);
  const vacuum = vacuumQuery.data;
  const name = useMemo(() => `${vacuum?.brand} ${vacuum?.model}`, [vacuum?.brand, vacuum?.model]);

  const filters = useAppSelector((state) => state.vacuumsFilters);

  const handleClose = () => {
    navigate(-1);
  };

  return (
    <>
      <SEO
        title={vacuum ? `${name} - Robot Vacuum Finder & Guide` : "Robot Vacuum Finder & Guide"}
        description={vacuum ? `Read about the ${name} robot vacuum cleaner. Compare features, price, and more.` : ""}
        image={vacuum?.imageUrl}
      />
      <Modal title={name ?? ""} isOpen close={handleClose} panelClassName="w-full! max-w-[800px]!">
        <div className="flex flex-col flex-grow gap-4">
          {vacuum ? (
            <>
              <div className="flex flex-col items-center sm:space-x-6">
                <img
                  src={vacuum.imageUrl}
                  alt={`${vacuum.brand} ${vacuum.model}`}
                  className="w-full sm:w-1/2 object-cover"
                />
              </div>

              {/* Main Content */}
              <main className="flex flex-col flex-grow space-y-8 md:p-4">
                {Object.keys(filters).length > 0 && <FilterMatchSummary vacuum={vacuum} userFilters={filters} />}
                <SpecsGrid vacuum={vacuum} />
                <FeaturesSection vacuum={vacuum} userFilters={filters} />
                {vacuum.surfaceRecommendations && vacuum.surfaceRecommendations.length > 0 && (
                  <SurfaceRecommendations surfaces={vacuum.surfaceRecommendations} />
                )}
                {vacuum.otherFeatures && vacuum.otherFeatures.length > 0 && (
                  <OtherFeaturesAccordion features={vacuum.otherFeatures} />
                )}
                <PricingSection affiliateLinks={vacuum.affiliateLinks} />
              </main>
            </>
          ) : vacuumQuery.isLoading ? (
            <VacuumInfoSkeleton />
          ) : (
            <div className="flex flex-col items-center justify-center gap-4">
              <CiCircleInfo className="w-12 h-12 text-accent" />
              <p className="text-lg font-semibold text-accent">Vacuum not found</p>
            </div>
          )}
        </div>
      </Modal>
    </>
  );
}

/* Skeleton Loader Component */
function VacuumInfoSkeleton() {
  return (
    <div className="animate-pulse flex flex-col gap-4 items-center">
      {/* Header/Hero Skeleton */}
      <div className="bg-gray-200 rounded w-full sm:w-[320px] h-92" />

      {/* Main Content Skeleton */}
      <div className="space-y-8 p-4">
        {/* FilterMatchSummary Skeleton */}
        <div className="bg-green-200 rounded h-10 w-full" />

        {/* Specs Grid Skeleton */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Specifications</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div key={idx} className="bg-gray-200 rounded h-18" />
            ))}
          </div>
        </div>

        {/* Features Section Skeleton */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Key Features</h3>
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 12 }).map((_, idx) => (
              <div key={idx} className="bg-gray-200 rounded h-8 w-24" />
            ))}
          </div>
        </div>

        {/* Surface Recommendations Skeleton */}
        <div>
          <h4 className="text-lg font-medium mb-2">Surface Recommendations</h4>
          <ul className="space-y-2">
            {Array.from({ length: 3 }).map((_, idx) => (
              <li key={idx} className="bg-gray-200 rounded h-4 w-1/2" />
            ))}
          </ul>
        </div>

        {/* Other Features Accordion Skeleton */}
        <div>
          <div className="bg-gray-200 rounded h-10 w-full" />
          <div className="mt-2 space-y-2">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="bg-gray-200 rounded h-4 w-full" />
            ))}
          </div>
        </div>

        {/* Pricing Section Skeleton */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Where to Buy</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Array.from({ length: 2 }).map((_, idx) => (
              <div key={idx} className="bg-gray-200 rounded h-20" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Helper Functions ---

function meetsFilter<T extends keyof VacuumsFilters>(
  key: T,
  vacuum: VacuumWithAffiliateLink,
  userFilters: VacuumsFilters
): boolean {
  const filterValue = userFilters[key];
  if (filterValue == null) {
    return false; // No filter specified for this key.
  }
  const vacuumValue = vacuum[key as keyof VacuumWithAffiliateLink];
  if (typeof filterValue === "number") {
    if (typeof vacuumValue !== "number") return false;
    return (vacuumValue as number) >= filterValue;
  }
  if (typeof filterValue === "boolean") {
    return vacuumValue === filterValue;
  }
  if (typeof filterValue === "string") {
    if (typeof vacuumValue !== "string") return false;
    return vacuumValue.toLowerCase() === filterValue.toLowerCase();
  }
  return false;
}

function compareFilters(
  vacuum: VacuumWithAffiliateLink,
  userFilters: VacuumsFilters
): { matchedCount: number; totalFilters: number } {
  let matchedCount = 0;
  let totalFilters = 0;
  const withoutNull = Object.fromEntries(
    Object.entries(userFilters).filter(
      ([, v]) => v != null && v !== "" && v !== undefined && v !== 0 && (Array.isArray(v) ? v.length > 0 : true)
    )
  );
  for (const key in withoutNull) {
    const filterKey = key as keyof VacuumsFilters;
    const filterValue = userFilters[filterKey];
    if (filterValue != null) {
      totalFilters++;
      if (meetsFilter(filterKey, vacuum, userFilters)) {
        matchedCount++;
      }
    }
  }
  return { matchedCount, totalFilters };
}

// --- Subcomponents ---

interface FilterMatchSummaryProps {
  vacuum: VacuumWithAffiliateLink;
  userFilters: VacuumsFilters;
}

function FilterMatchSummary({ vacuum, userFilters }: FilterMatchSummaryProps) {
  const { matchedCount, totalFilters } = compareFilters(vacuum, userFilters);
  return (
    <section className="bg-green-200 text-black p-4 rounded">
      <p>
        This vacuum meets {matchedCount} of your {totalFilters} search criteria.
      </p>
    </section>
  );
}

interface SpecsGridProps {
  vacuum: VacuumWithAffiliateLink;
}

function SpecsGrid({ vacuum }: SpecsGridProps) {
  return (
    <section>
      <h3 className="text-lg font-semibold">Specifications</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
        <SpecItem label="Battery Life (min)" value={vacuum.batteryLifeInMinutes} />
        <SpecItem label="Suction (Pa)" value={vacuum.suctionPowerInPascals} />
        <SpecItem label="Noise (dB)" value={vacuum.noiseLevelInDecibels} />
        <SpecItem label="Dustbin (L)" value={vacuum.dustbinCapacityInLiters} />
        <SpecItem label="Water Tank (L)" value={vacuum.waterTankCapacityInLiters} />
        <SpecItem label="Max Clearance (mm)" value={vacuum.maxObjectClearanceInMillimeters} />
      </div>
    </section>
  );
}

interface SpecItemProps {
  label: string;
  value: number | null;
}

function SpecItem({ label, value }: SpecItemProps) {
  return (
    <div className="p-3 rounded border border-border">
      <div className="text-sm text-text/90">{label}</div>
      <div className="text-base">{value !== null ? value : "N/A"}</div>
    </div>
  );
}

interface FeaturesSectionProps {
  vacuum: VacuumWithAffiliateLink;
  userFilters: VacuumsFilters;
}

function FeaturesSection({ vacuum, userFilters }: FeaturesSectionProps) {
  return (
    <section className="space-y-4">
      <h3 className="text-lg font-semibold">Key Features</h3>
      <div className="flex flex-wrap gap-2">
        <FeatureBadge
          label="Mopping"
          filterKey="hasMoppingFeature"
          active={vacuum.hasMoppingFeature}
          vacuum={vacuum}
          userFilters={userFilters}
        />
        <FeatureBadge
          label="Self-Emptying"
          filterKey="hasSelfEmptyingFeature"
          active={vacuum.hasSelfEmptyingFeature}
          vacuum={vacuum}
          userFilters={userFilters}
        />
        <FeatureBadge
          label="Self-Cleaning"
          filterKey="hasSelfCleaningFeature"
          active={vacuum.hasSelfCleaningFeature}
          vacuum={vacuum}
          userFilters={userFilters}
        />
        <FeatureBadge
          label="Child Lock"
          filterKey="hasChildLockFeature"
          active={vacuum.hasChildLockFeature}
          vacuum={vacuum}
          userFilters={userFilters}
        />
        <FeatureBadge
          label="Auto Lift Mop"
          filterKey="hasAutoLiftMopFeature"
          active={vacuum.hasAutoLiftMopFeature}
          vacuum={vacuum}
          userFilters={userFilters}
        />
        <FeatureBadge
          label="Google/Alexa Integration"
          filterKey="hasGoogleOrAlexaIntegrationFeature"
          active={vacuum.hasGoogleOrAlexaIntegrationFeature}
          vacuum={vacuum}
          userFilters={userFilters}
        />
        <FeatureBadge
          label="Zone Cleaning"
          filterKey="hasZoneCleaningFeature"
          active={vacuum.hasZoneCleaningFeature}
          vacuum={vacuum}
          userFilters={userFilters}
        />
        <FeatureBadge
          label="Multi-Floor Mapping"
          filterKey="hasMultiFloorMappingFeature"
          active={vacuum.hasMultiFloorMappingFeature}
          vacuum={vacuum}
          userFilters={userFilters}
        />
        <FeatureBadge
          label="Virtual Walls"
          filterKey="hasVirtualWallsFeature"
          active={vacuum.hasVirtualWallsFeature}
          vacuum={vacuum}
          userFilters={userFilters}
        />
        <FeatureBadge
          label="App Control"
          filterKey="hasAppControlFeature"
          active={vacuum.hasAppControlFeature}
          vacuum={vacuum}
          userFilters={userFilters}
        />
        <FeatureBadge
          label="Manual Control"
          filterKey="hasManualControlFeature"
          active={vacuum.hasManualControlFeature}
          vacuum={vacuum}
          userFilters={userFilters}
        />
        <FeatureBadge
          label="Voice Control"
          filterKey="hasVoiceControlFeature"
          active={vacuum.hasVoiceControlFeature}
          vacuum={vacuum}
          userFilters={userFilters}
        />
      </div>
    </section>
  );
}

interface FeatureBadgeProps {
  label: string;
  filterKey: keyof VacuumsFilters;
  active: boolean | null;
  vacuum: VacuumWithAffiliateLink;
  userFilters: VacuumsFilters;
}

function FeatureBadge({ label, filterKey, active, vacuum, userFilters }: FeatureBadgeProps) {
  const meets = meetsFilter(filterKey, vacuum, userFilters);
  const bgClass = meets ? "bg-green-200" : "bg-gray-100";
  return (
    <span className={`inline-block px-3 py-1 rounded text-black ${bgClass}`}>
      {label}: {active ? "Yes" : "No"}
    </span>
  );
}

interface SurfaceRecommendationsProps {
  surfaces: string[];
}

function SurfaceRecommendations({ surfaces }: SurfaceRecommendationsProps) {
  return (
    <section>
      <h4 className="text-lg font-medium">Surface Recommendations</h4>
      <ul className="list-disc list-inside ml-4 mt-1">
        {surfaces.map((surface, idx) => (
          <li key={idx}>{surface}</li>
        ))}
      </ul>
    </section>
  );
}

interface OtherFeaturesAccordionProps {
  features: string[];
}

function OtherFeaturesAccordion({ features }: OtherFeaturesAccordionProps) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <section>
      <button className="w-full text-left bg-gray-200 px-4 py-2 rounded" onClick={() => setIsOpen(!isOpen)}>
        Other Features {isOpen ? "▲" : "▼"}
      </button>
      {isOpen && features.filter(Boolean).length > 0 && (
        <div className="mt-2 p-4 border border-gray-300 rounded space-y-1">
          {features.map((feature, idx) => (
            <div key={idx} className="text-sm">
              • {feature}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

interface PricingSectionProps {
  affiliateLinks: AffiliateLink[];
}

function PricingSection({ affiliateLinks }: PricingSectionProps) {
  return (
    <section className="space-y-2">
      <h3 className="text-lg font-semibold">Where to Buy</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {affiliateLinks.map((linkItem, idx) => (
          <a
            key={idx}
            href={linkItem.link}
            className="block p-4 border rounded hover:shadow"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="font-medium capitalize">
              {countryCodeToReadable(linkItem.countryCode!)} — {CurrencySymbolMapping[linkItem.currency]}
              {linkItem.price}
            </div>
            <div className="text-blue-600 underline mt-1">View Offer</div>
          </a>
        ))}
      </div>
    </section>
  );
}
