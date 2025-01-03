import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function Redirect() {
  const location = useLocation();
  const path = location.pathname;

  useEffect(() => {
    async function getExpandedURL() {
      try {
        const response = await fetch(
          `http://localhost:8080/api/url/expand${path}`
        );
        const data = await response.json();
        const originalURL = data.originalURL;
        window.location.href = originalURL;
      } catch (error) {
        console.error(error);
      }
    }

    getExpandedURL();
  }, [path]);

  return <></>;
}
