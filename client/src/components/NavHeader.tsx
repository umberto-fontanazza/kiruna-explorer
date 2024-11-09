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
          <>
            <div className="nav-loggedIn">
              <div className="username">
                <h4>Hi {props.user.name}!</h4>
              </div>
              <div className="button-container">
                <button onClick={props.logout}>Logout</button>
              </div>
            </div>
          </>
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
