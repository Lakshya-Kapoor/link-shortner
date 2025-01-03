import { useEffect, useState } from "react";
import LinkCard from "../components/LinkCard";

type URL = {
  _id: string;
  shortURL: string;
  originalURL: string;
};

type ErrorResponse = {
  error: string;
};

function MyUrl() {
  const [urls, setUrls] = useState<URL[]>([]);

  useEffect(() => {
    async function fetchUrls() {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch("http://localhost:8080/api/url/list", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const responseData: ErrorResponse | URL[] = await response.json();
        if ("error" in responseData) {
          throw new Error(responseData.error);
        } else {
          setUrls(responseData.reverse());
        }
      } catch (error) {
        console.log(error);
      }
    }

    fetchUrls();
  }, []);

  return (
    <div className="flex-grow flex flex-col gap-10 items-center overflow-auto max-h-[71vh] scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-zinc-900">
      {urls.map((url) => (
        <LinkCard key={url._id} url={url} />
      ))}
    </div>
  );
}

export default MyUrl;
