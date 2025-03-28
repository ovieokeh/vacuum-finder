import { useNavigate, useParams } from "react-router";
import { invariant } from "es-toolkit";

import { Modal } from "../../../components/modal";
import { AdminVacuumForm } from "../../../components/vacuum-form";
import { useProtectedRoute } from "../../../hooks/use-protected-route";
import { useGetVacuum } from "../../../database/hooks";
import { SEO } from "../../../components/seo";

export function AdminVacuumEditPage() {
  useProtectedRoute();

  const { vacuumId } = useParams();
  invariant(vacuumId, "Expected vacuumId to be defined");
  const navigate = useNavigate();

  const vacuumQuery = useGetVacuum(vacuumId);
  const vacuum = vacuumQuery.data;
  const name = `${vacuum?.brand ?? "Brand"} ${vacuum?.model ?? "Model"}`;

  return (
    <>
      <SEO title={`${name} - Edit Vacuum`} description={`Edit the vacuum ${name}`} image={vacuum?.imageUrl} />

      <Modal title={name ?? ""} isOpen close={() => navigate("/admin")} panelClassName="min-w-[80%]">
        <div className="flex flex-col flex-grow gap-4">
          <AdminVacuumForm vacuum={vacuum} />
        </div>
      </Modal>
    </>
  );
}
