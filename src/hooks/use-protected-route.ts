import { useNavigate } from "react-router-dom";

import { useSiteConfig } from "../providers/site-config";

export const useProtectedRoute = () => {
  const { user } = useSiteConfig();
  const navigate = useNavigate();

  if (!user) {
    navigate("/admin/auth");
    return null;
  }

  return user;
};
