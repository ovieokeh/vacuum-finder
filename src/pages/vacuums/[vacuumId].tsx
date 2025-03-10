import { useNavigate, useParams } from "react-router-dom";
import { invariant } from "es-toolkit";
import { CiCircleInfo } from "react-icons/ci";
import { Helmet } from "react-helmet";

import { Modal } from "../../components/modal";
import { VacuumSpecExplanations } from "../../components/vacuum-spec-explanations";
import { VacuumInfo } from "../../components/vacuum-info";
import { useAppSelector } from "../../redux";

import { AffiliateLinksTable } from "../../components/affiliate-links";
import { useGetVacuum } from "../../database/hooks";

export function VacuumInfoPage() {
  const { vacuumId } = useParams();
  invariant(vacuumId, "Expected vacuumId to be defined");

  const navigate = useNavigate();

  const vacuumQuery = useGetVacuum(vacuumId);
  const vacuum = vacuumQuery.data;
  const name = `${vacuum?.brand} ${vacuum?.model}`;

  const filters = useAppSelector((state) => state.vacuumsFilters);

  const handleClose = () => {
    navigate("/vacuums");
  };

  return (
    <>
      <Helmet>
        <title>{`${name} - Robot Vacuum Finder & Guide`}</title>
        <meta
          name="description"
          content={`Read about the ${name} robot vacuum cleaner. Compare features, price, and more.`}
        />
      </Helmet>
      <Modal title={name ?? ""} isOpen close={handleClose} panelClassName="w-full! max-w-[800px]!">
        <div className="flex flex-col flex-grow gap-4">
          {vacuum ? (
            <>
              <VacuumInfo vacuum={vacuum} imageClassName="w-full h-64 md:size-52 mx-auto grow" />
              <AffiliateLinksTable links={vacuum.affiliateLinks} vacuumName={name} />
              <VacuumSpecExplanations vacuum={vacuum} filters={filters} />
            </>
          ) : (
            <div className="flex flex-col items-center justify-center gap-4">
              <CiCircleInfo className="w-12 h-12 text-accent" />
              <p className="text-lg font-semibold text-accent">Vacuum not found</p>
            </div>
          )}
          {/* Future expansions: affiliate links, user reviews, etc. */}
        </div>
      </Modal>
    </>
  );
}
