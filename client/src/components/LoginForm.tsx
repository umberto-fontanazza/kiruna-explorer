import { FC, useEffect, useState } from "react";
import { LoginErrors, User } from "../utils/interfaces";
import "../styles/LoginForm.scss";
import { useNavigate } from "react-router-dom";
import API from "../API/API";
import { Form } from "react-bootstrap";

interface LoginFormProps {
  setUser: (user: User) => void;
  loggedIn: boolean;
  setLoggedIn: (bool: boolean) => void;
}

const LoginForm: FC<LoginFormProps> = (props): JSX.Element => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<LoginErrors>({});

  const nav = useNavigate();

  useEffect(() => {
    if (props.loggedIn) nav("/home");
  });

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    const response = await API.login(email, password);

    if (response.status === 201) {
      const user = await response.json();
      props.setUser(user);
      props.setLoggedIn(true);
      nav("/home");
    } else if (response.status === 401) {
      setErrors({ login: "Email and/or password wrong" });
    }
    console.log(errors);
  };

  return (
    <div className="form">
      <div className="login-container">
        <div className="left-panel">
          <h1>Kiruna eXplorer.</h1>
          <p>
            Welcome to the Kiruna eXplorer,
            <br />
            Where tales of the Arctic come alive.
            <br />
            Embark on a journey through Kiruna’s history,
            <br />
            A place where Sweden's heart and heritage thrive.
            <br />
            Enjoy your adventure!
          </p>
          <img
            src="/kiruna-bg-1920-Photoroom.png"
            alt="Tourist destination"
          ></img>
        </div>

        <div className="right-panel">
          <h2>Welcome Back!</h2>
          <Form onSubmit={handleSubmit}>
            <Form.Label htmlFor="email">Email</Form.Label>
            <Form.Control
              type="email"
              id="email"
              name="email"
              placeholder="example@gmail.com"
              value={email}
              onChange={(ev) => setEmail(ev.target.value)}
              required
              className="input-email"
              isInvalid={errors.login ? true : false}
            />

            <Form.Label htmlFor="password">Password</Form.Label>
            <Form.Control
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              value={password}
              onChange={(ev) => setPassword(ev.target.value)}
              required
              className="input-password"
              isInvalid={errors.login ? true : false}
            />

            <p className="m-0 text-danger text-center">{errors.login}</p>

            <div className="forgot-password">
              <a href="/forgot-password">Forgot password?</a>
            </div>
            <button type="submit">Login</button>
          </Form>

          <div className="signup">
            Doesn’t have an account? <a href="/signup">Sign up for free</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
