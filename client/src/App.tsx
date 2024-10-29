import { FC, useState } from "react";
import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import LoginForm from "./components/LoginForm";
import Home from "./components/Home";
import NavHeader from "./components/NavHeader";
import NotFound from "./components/NotFound";
import API from "./API/API";
import "./styles/global.scss";

const App: FC = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState("");

  const handleLogin = async (credentials: unknown) => {
    try {
      console.log("Ho chiamato il login");
      const user = await API.login(credentials);
      setLoggedIn(true);
      setUser(user);
    } catch (error) {
      console.error("Error occured while logging: " + error);
    }
  };

  const handleLogout = async () => {
    console.log("Ho chiamato il logout");
    await API.logout();
    setLoggedIn(false);
    setUser("");
  };

  return (
    <Routes>
      <Route
        path="/"
        element={
          <>
            <Outlet />
          </>
        }
      >
        {/* Default redirect to /home */}
        <Route index element={<Navigate replace to="/home" />} />

        {/* Route /login for the Home page with the form to perform the login */}
        <Route path="/login" element={<LoginForm login={handleLogin} />} />

        {/* Route /home for the Home page with the map and diagram */}
        <Route
          path="/home"
          element={<Home login={loggedIn} handleLogout={handleLogout} />}
        />

        {/* Route /* to cath all bad urls */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default App;
