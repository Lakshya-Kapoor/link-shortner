import { useState } from "react";
import Input from "../components/Input";

function Home() {
  const [longLink, setLongLink] = useState("");
  const [aliasLink, setAliasLink] = useState("");

  return (
    <div className="mt-20 flex-grow flex justify-center items-start">
      <div className="bg-slate-300 bg-opacity-5 w-1/3 p-10 text-slate-300">
        <Input
          id="longLink"
          label="Long Link"
          placeHolder="Paste URL to shorten"
          value={longLink}
          onChange={(e) => {
            setLongLink(e.target.value);
          }}
        />
        <div className="mt-5 flex items-end gap-4">
          <div className="">
            <Input
              id="aliasLink"
              label="Alias"
              placeHolder="Enter an alias"
              value={aliasLink}
              onChange={(e) => {
                setAliasLink(e.target.value);
              }}
            />
          </div>
          <button className="bg-violet-600 text-white font-medium p-3 rounded-lg">
            Shorten
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;
