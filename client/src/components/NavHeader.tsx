import { FC, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { authContext } from "../context/auth";
import "../styles/NavHeader.scss"; // Importiamo il file SCSS personalizzato

const NavHeader: FC = (): JSX.Element => {
  const location = useLocation();
  const { user, logout } = useContext(authContext);
  const navigate = useNavigate();

  return (
    <nav className="nav-header">
      <div className="nav-title-btns">
        <span className="brand">
          <Link style={{ color: "white" }} to={"/home"}>
            Kiruna eXplorer.
          </Link>
        </span>
        <button
          className={location.pathname === "/map" ? "active" : ""}
          onClick={() => navigate("/map")}
        >
          Map
        </button>
        <button
          className={location.pathname === "/diagram" ? "active" : ""}
          onClick={() => navigate("/diagram")}
        >
          Diagram
        </button>
        <button
          className={location.pathname === "/documents" ? "active" : ""}
          onClick={() => navigate("/documents")}
        >
          Documents
        </button>
        <button
          className={location.pathname === "/uploads" ? "active" : ""}
          onClick={() => navigate("/uploads")}
        >
          Uploads
        </button>
      </div>
      <div className={`${user ? "logged-in" : ""}`}>
        {user ? <span className="user-name">Hi {user.name}!</span> : null}
        <button onClick={user ? logout : () => navigate("/login")}>
          {user ? "Logout" : "Login"}
        </button>
      </div>
    </nav>
  );
};

export default NavHeader;
