import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

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
  const [hoveredId, setHoveredId] = useState<null | string>(null);

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
          setUrls(responseData);
          console.log(responseData);
        }
      } catch (error) {
        console.log(error);
      }
    }

    fetchUrls();
  }, []);

  function copyToClipboard(text: string) {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        alert("Copied to clipboard");
      })
      .catch((err) => {
        alert(`Failed to copy: ${err}`);
      });
  }

  return (
    <div className="flex-grow flex flex-col gap-10 items-center overflow-auto max-h-[71vh] scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-zinc-900">
      {urls.map((url) => (
        <div
          key={url._id}
          className="text-white p-5 flex flex-col gap-5 w-1/2 bg-neutral-950 rounded-xl"
        >
          <div>
            <span className="text-2xl font-semibold">Short URL: </span>
            <span className="text-2xl font-light text-purple-400">
              https://linkly/{url.shortURL}
            </span>
          </div>
          <div>
            <span className="text-xl">Original URL: </span>
            <span className="text-lg font-light  text-blue-400">
              {url.originalURL.substring(0, 50)}...
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default MyUrl;
