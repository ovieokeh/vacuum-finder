import { useEffect } from "react";
import { useLocation } from "react-router";

const ROUTE_SEO_CONFIG: {
  [key: string]: {
    title: string;
    description: string;
  };
} = {
  "/": {
    title: "Robot Vacuum Finder & Guide",
    description:
      "Find the best robot vacuum for your needs with our vacuum finder tool. Compare robot vacuums by features, price, and more.",
  },
  "privacy-policy": {
    title: "Privacy Policy",
    description: "Our privacy policy explains how we collect, use, and protect your data",
  },
  "terms-of-service": {
    title: "Terms of Service",
    description: "Our terms of service govern your use of our website and services",
  },
  "/admin": {
    title: "Admin Dashboard",
    description: "Add or update any robot vacuum in the collection",
  },
  "/admin/auth": {
    title: "Admin Login",
    description: "Login to the admin dashboard",
  },
  "/admin/vacuums/add": {
    title: "Add Vacuum",
    description: "Add a new robot vacuum to the collection",
  },
  "/admin/vacuums/:vacuumId": {
    title: "Edit Vacuum",
    description: "Edit an existing robot vacuum in the collection",
  },
};

export const useSeoSetup = () => {
  const location = useLocation();

  const route = location.pathname;

  useEffect(() => {
    // account for dynamic routes
    const matchedRoute = Object.keys(ROUTE_SEO_CONFIG).find((configRoute) => {
      if (configRoute === route) {
        return true;
      }
      if (configRoute.includes(":")) {
        const routeParts = route.split("/");
        const configParts = configRoute.split("/");
        if (routeParts.length !== configParts.length) {
          return false;
        }
        return routeParts.every((part, i) => {
          if (configParts[i].startsWith(":")) {
            return true;
          }
          return part === configParts[i];
        });
      }
      return false;
    });
    console.log("SEO setup for route", route, matchedRoute);
    if (typeof window !== "undefined" && matchedRoute) {
      const config = ROUTE_SEO_CONFIG[matchedRoute];
      document.title = config.title;
      document.querySelector('meta[name="description"]')?.setAttribute("content", config.description);
      document.querySelector('meta[property="og:title"]')?.setAttribute("content", config.title);
      document.querySelector('meta[property="og:description"]')?.setAttribute("content", config.description);
    }
  }, [route]);

  return null;
};
