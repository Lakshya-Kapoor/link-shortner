import { useState } from "react";

type URL = {
  _id: string;
  shortURL: string;
  originalURL: string;
};

export default function LinkCard({ url }: { url: URL }) {
  const [copied, setCopied] = useState(false);

  function copyToClipboard() {
    navigator.clipboard.writeText("https://linkly/" + url.shortURL).then(() => {
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 800);
    });
  }

  return (
    <div className="text-white p-5 flex flex-col gap-5 w-1/2 bg-neutral-950 rounded-xl">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-2xl font-semibold">Short URL: </span>
          <span className="text-2xl font-light text-purple-400">
            https://linkly/{url.shortURL}
          </span>
        </div>
        <div
          className="flex items-center gap-1 hover:cursor-pointer"
          onClick={copyToClipboard}
        >
          {copied ? (
            <>
              <img src="/check-white.svg" /> <span>Copied!</span>
            </>
          ) : (
            <>
              <img src="/copy-white.svg" /> <span>Copy</span>
            </>
          )}
        </div>
      </div>
      <div>
        <span className="text-xl">Original URL: </span>
        <span className="text-lg font-light  text-blue-400">
          {url.originalURL.substring(0, 50)}...
        </span>
      </div>
    </div>
  );
}
