import { useNavigate } from "react-router";

import { useSiteConfig } from "../providers/site-config";
import { useEffect } from "react";

export const useProtectedRoute = () => {
  const { isLoaded, user } = useSiteConfig();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user?.id && isLoaded) {
      navigate("/admin/auth");
    }
  }, [user?.id, isLoaded, navigate]);

  return user;
};
