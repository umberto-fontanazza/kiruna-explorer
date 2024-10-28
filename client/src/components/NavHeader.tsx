import { FC } from "react";
import "../styles/NavHeader.scss"; // Importiamo il file SCSS personalizzato
interface NavHeaderProps {
  logout: () => void;
}

const NavHeader: FC<NavHeaderProps> = (props): JSX.Element => {
  return (
    <nav className="nav-header">
      <div className="nav-container">
        <div className="nav-brand">Kiruna eXplorer</div>
        <button className="btn-logout" onClick={props.logout}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default NavHeader;
