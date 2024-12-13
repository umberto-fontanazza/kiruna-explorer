import { FC, useContext, useRef, useState } from "react";
import { Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { authContext } from "../context/auth";
import "../styles/LoginForm.scss";
import { LoginErrors } from "../utils/interfaces";

const LoginForm: FC = (): JSX.Element => {
  const { user, login } = useContext(authContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<LoginErrors>({});

  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const timeoutRef = useRef<number | null>(null);

  const nav = useNavigate();

  if (user) {
    // interrupt rendering
    nav("/map");
  }

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    try {
      await login(email, password);
      nav("/map");
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_: unknown) {
      setErrors({ login: "Email and/or password wrong" });
    }
  };

  const handleNotImplemented = (message: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setAlertMessage(message);
    timeoutRef.current = setTimeout(() => {
      setAlertMessage(null);
      timeoutRef.current = null;
    }, 2000);
  };

  return (
    <div className="form">
      {alertMessage && <div className="custom-alert">{alertMessage}</div>}
      <div className="login-container">
        <div className="left-panel">
          <h1>Kiruna eXplorer.</h1>
          <p>
            Welcome to the Kiruna eXplorer,
            <br />
            Where tales of the Arctic come alive.
            <br />
            Embark on a journey through Kiruna's history,
            <br />
            A place where Sweden's heart and heritage thrive.
            <br />
            Enjoy your adventure!
          </p>
          <img src="/kiruna-background.png" alt="Tourist destination"></img>
        </div>

        <div className="right-panel">
          <button className="back-home-btn" onClick={() => nav("/home")}>
            <span className="material-symbols-outlined">home</span>
          </button>
          <h3>Welcome Back!</h3>
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
              <a
                href="#"
                onClick={() =>
                  handleNotImplemented(
                    "Forgot password functionality is not implemented yet.",
                  )
                }
              >
                Forgot password?
              </a>
            </div>
            <button type="submit">Login</button>
          </Form>

          <div className="signup">
            Doesn’t have an account?{" "}
            <a
              href="#"
              onClick={() =>
                handleNotImplemented("Sign up is not implemented yet.")
              }
            >
              Sign up for free
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
