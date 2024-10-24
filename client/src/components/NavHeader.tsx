import { FC } from "react";
import { Navbar, Container, Button } from "react-bootstrap";

interface NavHeaderProps {
  logout: () => void;
}

const NavHeader: FC<NavHeaderProps> = (props): JSX.Element => {
  return (
    <Navbar expand="lg" bg="dark" data-bs-theme="dark">
      <Container>
        <Navbar.Brand>Next Project</Navbar.Brand>
      </Container>
      <Button
        variant="outline-light"
        onClick={() => {
          props.logout();
        }}
      >
        Logout
      </Button>
    </Navbar>
  );
};

export default NavHeader;
