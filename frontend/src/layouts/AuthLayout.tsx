import { Outlet } from "react-router-dom";

const AuthLayout = () => (
  <div className="flex flex-col justify-between w-full min-h-screen bg-zinc-900">
    <header className="flex justify-center mt-7">
      <h1 className="text-8xl font-bold">
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">
          Linkly
        </span>
      </h1>
    </header>
    <div className="flex justify-center">
      <Outlet />
    </div>
    <footer>
      <p className="text-center text-white">© 2024 Linkly</p>
    </footer>
  </div>
);

export default AuthLayout;
