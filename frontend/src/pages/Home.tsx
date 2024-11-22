import { useState } from "react";
import Input from "../components/Input";
import useFormInput from "../hooks/useFormInput";
import axios from "axios";

function Home() {
  const longLinkProps = useFormInput("");
  const aliasLinkProps = useFormInput("");
  const [shortLink, setShortLink] = useState("");

  async function handleShortenLink() {
    const url = `http://localhost:8080/api/url/shorten?aliasURL=${aliasLinkProps.value}`;
    const data = {
      originalURL: longLinkProps.value,
    };
    try {
      const response = await axios.post(url, data);
      setShortLink(response.data.shortURL);
    } catch (error) {
      console.error(error);
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
      <div className="bg-slate-300 bg-opacity-5 rounded-lg p-10 text-slate-300">
        <Input
          id="longLink"
          label="Long Link"
          placeHolder="Paste URL to shorten"
          {...longLinkProps}
        />
        <div className="mt-5 flex items-end gap-4">
          <div className="">
            <Input
              id="aliasLink"
              label="Alias"
              placeHolder="Enter an alias"
              {...aliasLinkProps}
            />
          </div>
          <button
            onClick={handleShortenLink}
            className="bg-purple-600 text-white font-medium p-3 rounded-lg"
          >
            Shorten
          </button>
        </div>

        {shortLink && (
          <div className="mt-5 flex items-end gap-2">
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
              className="group flex justify-center items-center bg-purple-600 hover:bg-purple-500 active:bg-purple-600 p-3 rounded-md"
            >
              <img src="/copy.svg" className="group-active:hidden w-6" />
              <img
                src="/copy-active.svg"
                className="w-6 hidden group-active:block"
              />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
