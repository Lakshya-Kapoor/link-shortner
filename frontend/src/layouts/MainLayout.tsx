import { useContext } from "react";
import NavOption from "../components/NavOption";
import { Outlet, useNavigate } from "react-router-dom";
import AuthContext from "../utils/AuthContext";

function MainLayout() {
  const { isLoggedIn, logOut } = useContext(AuthContext);
  const navigate = useNavigate();

  function handleLogin() {
    navigate("/login");
  }

  function handleLogout() {
    logOut();
  }

  return (
    <div className="flex flex-col min-h-screen min-w-full bg-zinc-900">
      <header className="relative flex justify-center mt-7 mb-20">
        <h1 className="text-8xl font-bold">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">
            Linkly
          </span>
        </h1>
        <button
          onClick={() => {
            if (isLoggedIn) handleLogout();
            else handleLogin();
          }}
          className="absolute top-4 right-6 p-3 text-md font-medium border border-red-500 text-red-500 hover:text-black hover:bg-red-500/85 active:bg-red-500 rounded-lg"
        >
          {isLoggedIn ? "logout" : "login"}
        </button>
      </header>
      <div className="flex-grow flex-shrink-0 flex">
        <nav className="flex flex-col pl-5 gap-10 w-[200px]">
          <NavOption
            to="/"
            icon="/home.svg"
            activeIcon="/home-active.svg"
            name="Home"
          />
          <NavOption
            to="/myurls"
            icon="/url.svg"
            activeIcon="/url-active.svg"
            name="My URLs"
          />
          <NavOption
            to="/profile"
            icon="/profile.svg"
            activeIcon="/profile-active.svg"
            name="Profile"
          />
        </nav>
        <div className="flex-grow pr-[200px] ">
          <Outlet />
        </div>
      </div>
      <footer>
        <p className="text-center text-white">© 2024 Linkly</p>
      </footer>
    </div>
  );
}

export default MainLayout;
