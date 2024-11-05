import { FC, useState } from "react";
import { Credentials } from "../utils/interfaces";
import "../styles/LoginForm.scss";
import { useNavigate } from "react-router-dom";

interface LoginFormProps {
  login: (credentials: Credentials) => void;
}

const LoginForm: FC<LoginFormProps> = (props): JSX.Element => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const nav = useNavigate();

  const handleSubmit = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    const credentials = { username, password };
    props.login(credentials);
    nav("/home");
  };

  return (
    <div className="form">
      <div className="login-container">
        <div className="left-panel">
          <h1>Kiruna eXplorer.</h1>
          <p>
            Welcome in the Kiruna eXplorer, <br />
            I don't know what to write here, <br />
            But I think we will show you <br />
            the story of Kiruna in Sweden, <br />
            Enjoy !
          </p>
          <img
            src="/public/kiruna-bg-1920-Photoroom.png"
            alt="Tourist destination"
          ></img>
        </div>

        <div className="right-panel">
          <h2>Welcome Back!</h2>
          <form onSubmit={handleSubmit}>
            <label htmlFor="username">Username</label>
            <input
              type="email"
              id="username"
              name="username"
              placeholder="example@gmail.com"
              value={username}
              onChange={(ev) => setUsername(ev.target.value)}
              required
              className="input-username"
            />

            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              value={password}
              onChange={(ev) => setPassword(ev.target.value)}
              required
              className="input-password"
            />

            <div className="forgot-password">
              <a href="/forgot-password">Forgot password?</a>
            </div>
            <button type="submit">Login</button>
          </form>

          <div className="signup">
            Doesn’t have an account? <a href="/signup">Sign up for free</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
