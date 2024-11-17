import { Link, useLocation } from "react-router-dom";

function NavOption({
  to,
  icon,
  activeIcon,
  name,
}: {
  to: string;
  icon: string;
  activeIcon: string;
  name: string;
}) {
  const location = useLocation();
  const routeMatch = location.pathname == to;

  return (
    <Link to={to}>
      <div className="flex items-center gap-3">
        <div
          className={`p-3 rounded-lg w-12 h-12 ${
            routeMatch ? "bg-violet-600" : "bg-neutral-800"
          }`}
        >
          <img src={routeMatch ? activeIcon : icon} className="w-full h-full" />
        </div>
        <p
          className={`text-lg font-medium ${
            routeMatch ? "text-slate-100" : "text-neutral-400"
          }`}
        >
          {name}
        </p>
      </div>
    </Link>
  );
}

export default NavOption;
