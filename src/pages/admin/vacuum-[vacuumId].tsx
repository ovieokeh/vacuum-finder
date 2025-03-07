import { useNavigate, useParams } from "react-router-dom";
import { invariant } from "es-toolkit";
import { Helmet } from "react-helmet";

import { Modal } from "../../components/modal";
import { AdminVacuumForm } from "../../components/vacuum-form";
import { useVacuumQuery } from "../../database/hooks";
import { useProtectedRoute } from "../../hooks/use-protected-route";

export function AdminVacuumEditPage() {
  useProtectedRoute();

  const { vacuumId } = useParams();
  invariant(vacuumId, "Expected vacuumId to be defined");
  const navigate = useNavigate();

  const vacuumQuery = useVacuumQuery(vacuumId);
  const vacuum = vacuumQuery.data;
  const name = `${vacuum?.brand} ${vacuum?.model}`;

  return (
    <>
      <Helmet>
        <title>{`${name} - Edit Vacuum`}</title>
      </Helmet>
      <Modal title={name ?? ""} isOpen close={() => navigate("/admin")} panelClassName="min-w-[80%]">
        <div className="flex flex-col flex-grow gap-4">
          <AdminVacuumForm vacuum={vacuum} />
        </div>
      </Modal>
    </>
  );
}
