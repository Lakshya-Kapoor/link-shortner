import { useState } from "react";
import Input from "../components/Input";
import { Link, useNavigate } from "react-router-dom";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const data = { username, password };
    const url = "http://localhost:8080/api/auth/signup";
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
        navigate("/auth/login");
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
      <h2 className="self-center text-4xl font-semibold">Signup</h2>
      <Input
        id="username"
        label="Username"
        placeHolder="Enter your username"
        required={true}
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
        required={true}
        onChange={(e) => {
          setPassword(e.target.value);
        }}
      />
      <Input
        id="confirm-password"
        label="Confirm Password"
        type="password"
        placeHolder="Confirm password"
        value={confirmPassword}
        required={true}
        onChange={(e) => {
          setConfirmPassword(e.target.value);
        }}
      />

      <button
        type="submit"
        className="mt-3 bg-purple-600/95 hover:bg-purple-600 active:bg-purple-700 p-3 rounded-lg text-lg font-bold"
      >
        Signup
      </button>

      <p className="self-center">
        Already have an account?{" "}
        <Link
          className="underline text-sky-600 hover:text-sky-500 active:text-sky-700"
          to={"/auth/login"}
        >
          login
        </Link>
      </p>
    </form>
  );
}
