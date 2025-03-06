import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import { useSiteConfig } from "../../providers/site-config";

export function AdminPage() {
  const { user } = useSiteConfig();
  const navigate = useNavigate();

  console.log("user", user);

  useEffect(() => {
    if (!user) {
      navigate("auth");
    } else {
      navigate("dashboard");
    }
  }, [user, navigate]);

  return <Outlet />;
}
