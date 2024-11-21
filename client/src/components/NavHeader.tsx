import { FC, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { authContext } from "../context/auth";
import "../styles/NavHeader.scss"; // Importiamo il file SCSS personalizzato

const NavHeader: FC = (): JSX.Element => {
  const { user, logout } = useContext(authContext);
  const navigate = useNavigate();

  return (
    <nav className="nav-header">
      <span className="brand" onClick={() => navigate("/home")}>
        Kiruna eXplorer.
      </span>
      <div className={`${user ? "logged-in" : ""}`}>
        <button onClick={() => navigate("/documents")}>Documents</button>
        {user ? <span className="user-name">Hi {user.name}!</span> : null}
        <button onClick={user ? logout : () => navigate("/login")}>
          {user ? "Logout" : "Login"}
        </button>
      </div>
    </nav>
  );
};

export default NavHeader;
