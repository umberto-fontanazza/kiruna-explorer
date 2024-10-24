import { FC, useState } from "react";
import { Form, Button, Card, Container, Row, Col } from "react-bootstrap";
import { Credentials } from "../utils/interfaces";
import "../styles/LoginForm.css";

interface LoginFormProps {
  login: (credentials: Credentials) => void;
}

const LoginForm: FC<LoginFormProps> = (props): JSX.Element => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    const credentials = { username, password };
    props.login(credentials);
  };

  const handleCancel = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    setUsername("");
    setPassword("");
  };

  return (
    <Container
      fluid
      className="vh-100 d-flex justify-content-center align-items-center"
    >
      <Row className="justify-content-center custom-row" xl={10}>
        <Col>
          <Card className="p-4 bg-dark text-white shadow-lg">
            <Card.Body>
              <Card.Title className="text-center mb-4">Login</Card.Title>
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="username" className="mb-3">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    value={username}
                    onChange={(ev) => setUsername(ev.target.value)}
                    required={true}
                    className="bg-secondary text-white"
                  />
                </Form.Group>

                <Form.Group controlId="password" className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    value={password}
                    onChange={(ev) => setPassword(ev.target.value)}
                    required={true}
                    className="bg-secondary text-white"
                  />
                </Form.Group>

                <Row>
                  <Col>
                    <Button type="submit" className="w-100 mt-2">
                      {" "}
                      Login
                    </Button>
                  </Col>
                  <Col>
                    <Button
                      className="btn btn-danger w-100 mt-2"
                      onClick={handleCancel}
                    >
                      Cancel
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginForm;
