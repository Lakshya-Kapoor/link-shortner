import { useEffect, useState } from "react";
import Input from "../components/Input";
import axios from "axios";

function Home() {
  const [longLink, setLongLink] = useState("");
  const [aliasLink, setAliasLink] = useState("");
  const [shortLink, setShortLink] = useState("");
  const [isShortened, setIsShortened] = useState(false);

  useEffect(() => {
    const longLinkString = sessionStorage.getItem("longLink");
    if (longLinkString) {
      setLongLink(longLinkString);
    }
  }, []);

  async function handleShortenLink() {
    const url = `http://localhost:8080/api/url/shorten?aliasURL=${aliasLink}`;

    const alreadyShortened = localStorage.getItem(longLink + aliasLink);
    if (alreadyShortened) {
      setShortLink(alreadyShortened);
      setIsShortened(true);
      return;
    }

    const data = { originalURL: longLink };
    try {
      const response = await axios.post<{ shortURL: string }>(url, data);
      const shortURL = response.data.shortURL;
      setShortLink(shortURL);
      setIsShortened(true);
      localStorage.setItem(longLink + aliasLink, shortURL);
    } catch (error) {
      if (error.response) {
        console.log(error.response.data.error);
      } else {
        console.log(error);
      }
    }
  }

  function copyToClipboard() {
    navigator.clipboard
      .writeText(shortLink)
      .then(() => {
        alert("Copied to clipboard");
      })
      .catch((err) => {
        alert(`Failed to copy: ${err}`);
      });
  }

  return (
    <div className="flex justify-center items-start">
      <div className="bg-slate-300 bg-opacity-5 rounded-lg p-10 text-slate-300 flex flex-col gap-5 w-[550px]">
        <Input
          id="longLink"
          label="Long Link"
          placeHolder="Paste URL to shorten"
          value={longLink}
          onChange={(e) => {
            setLongLink(e.target.value);
            sessionStorage.setItem("longLink", e.target.value);
          }}
          disabled={isShortened}
        />

        {isShortened ? (
          <>
            <div className="flex items-end gap-2">
              <div className="flex-grow">
                <Input
                  id="shortLink"
                  label="Short Link"
                  value={shortLink}
                  disabled={true}
                />
              </div>
              <button
                onClick={copyToClipboard}
                className="group flex justify-center items-center bg-purple-600 hover:bg-purple-500 active:bg-purple-700 p-3 rounded-md"
              >
                <img src="/copy.svg" className="group-active:hidden w-6" />
                <img
                  src="/copy-active.svg"
                  className="w-6 hidden group-active:block"
                />
              </button>
            </div>
            <button
              onClick={() => {
                setIsShortened(false);
                setAliasLink("");
                setLongLink("");
              }}
              className="mt-2 flex justify-center items-center bg-purple-600 hover:bg-purple-500 active:bg-purple-700 p-3 rounded-md"
            >
              Shorten Another Link
            </button>
          </>
        ) : (
          <div className="flex items-end gap-4">
            <Input
              id="aliasLink"
              label="Alias"
              placeHolder="Enter an alias"
              value={aliasLink}
              onChange={(e) => setAliasLink(e.target.value)}
            />
            <button
              type="button"
              onClick={handleShortenLink}
              className="bg-purple-600 text-white font-medium p-3 rounded-lg hover:bg-purple-500 active:bg-purple-700"
            >
              Shorten
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
