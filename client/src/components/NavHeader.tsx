import { FC } from "react";
import "../styles/NavHeader.scss"; // Importiamo il file SCSS personalizzato
import { useNavigate } from "react-router-dom";
interface NavHeaderProps {
  logout: () => void;
  login: boolean;
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
        {props.login ? (
          <button className="btn-logout" onClick={props.logout}>
            Logout
          </button>
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
