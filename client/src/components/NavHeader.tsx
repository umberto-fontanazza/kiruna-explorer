import { FC } from "react";
import "../styles/NavHeader.scss"; // Importiamo il file SCSS personalizzato
import { useNavigate } from "react-router-dom";
import { User } from "../utils/interfaces";
interface NavHeaderProps {
  logout: () => void;
  loggedIn: boolean;
  user: User;
}

const NavHeader: FC<NavHeaderProps> = ({
  logout,
  loggedIn,
  user,
}: NavHeaderProps): JSX.Element => {
  const navigate = useNavigate();
  const login = () => {
    navigate("/login");
  };

  return (
    <nav className="nav-header">
      <div className="nav-container">
        <div className="nav-left">
          <div className="nav-brand">Kiruna eXplorer.</div>
        </div>
        <div className={`nav-right ${loggedIn ? "logged-in" : ""}`}>
          {loggedIn ? (
            <span className="username">
              <h4>Hi {user.name}!</h4>
            </span>
          ) : null}
          <button onClick={loggedIn ? logout : login}>
            {loggedIn ? "Logout" : "Login"}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default NavHeader;
