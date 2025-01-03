import { useEffect, useState } from "react";

type ErrorResponse = {
  error: string;
};

function Profile() {
  const [username, setUsername] = useState("");
  const [urlCount, setUrlCount] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("token");

    const parts = token!.split(".");
    const payload = JSON.parse(atob(parts[1]));
    setUsername(payload.userName);

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
          setUrlCount(responseData.length);
        }
      } catch (error) {
        console.log(error);
      }
    }

    fetchUrls();
  }, []);

  return (
    <div className="flex justify-center">
      <div className="bg-slate-300 bg-opacity-5 rounded-xl p-10 text-2xl text-violet-400 flex flex-col gap-2">
        <div>
          Username:{" "}
          <span className="text-3xl font-semibold text-slate-300">
            {username}
          </span>
        </div>
        <div className="text-xl">
          No of saved URLs:{" "}
          <span className="text-3xl font-semibold text-slate-300">
            {urlCount}
          </span>
        </div>
      </div>
    </div>
  );
}

export default Profile;

// Username
// No of URLS
//
