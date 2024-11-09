import { FC } from "react";
import "../styles/NavHeader.scss"; // Importiamo il file SCSS personalizzato
import { useNavigate } from "react-router-dom";
import { User } from "../utils/interfaces";
interface NavHeaderProps {
  logout: () => void;
  loggedIn: boolean;
  user: User;
}

const NavHeader: FC<NavHeaderProps> = (props): JSX.Element => {
  const nav = useNavigate();
  return (
    <nav className="nav-header">
      <div className="nav-container">
        <div className="nav-left">
          <img
            src="/LOGO.png"
            alt="Kiruna eXplorer Logo"
            className="nav-logo"
          ></img>
          <div className="nav-brand">Kiruna eXplorer.</div>
        </div>
        {props.loggedIn ? (
          <div className="d-flex align-items-center gap-3">
            <h4 className="m-0 text-white">Ciao {props.user.name}</h4>
            <button className="btn-logout" onClick={props.logout}>
              Logout
            </button>
          </div>
        ) : (
          <button className="btn-login" onClick={() => nav("/login")}>
            Login
          </button>
        )}
      </div>
    </nav>
  );
};

export default NavHeader;
