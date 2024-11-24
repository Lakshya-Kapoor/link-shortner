import { useContext, useState } from "react";
import Input from "../components/Input";
import { Link } from "react-router-dom";
import AuthContext from "../utils/AuthContext";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { logIn } = useContext(AuthContext);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const data = { username, password };
    const url = "http://localhost:8080/api/auth/login";
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (responseData.error) {
        alert(responseData.error);
        throw new Error(responseData.error);
      } else {
        const token = responseData.token;
        localStorage.setItem("token", token);
        logIn();
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-slate-300 bg-opacity-5 rounded-lg p-10 text-slate-300 flex flex-col gap-5 w-[500px]"
    >
      <h2 className="self-center text-4xl font-semibold">Login</h2>
      <Input
        id="username"
        label="Username"
        placeHolder="Enter your username"
        value={username}
        onChange={(e) => {
          setUsername(e.target.value);
        }}
      />
      <Input
        id="password"
        label="Password"
        type="password"
        placeHolder="Enter your password"
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
        }}
      />

      <button
        type="submit"
        className="mt-3 bg-purple-600/95 hover:bg-purple-600 active:bg-purple-700 p-3 rounded-lg text-lg font-bold"
      >
        Login
      </button>

      <p className="self-center">
        Don't have an account?{" "}
        <Link
          className="underline text-sky-600 hover:text-sky-500 active:text-sky-700"
          to={"/signup"}
        >
          {" "}
          signup{" "}
        </Link>
      </p>
    </form>
  );
}
