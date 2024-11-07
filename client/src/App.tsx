import { FC, useEffect, useState } from "react";
import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import LoginForm from "./components/LoginForm";
import Home from "./components/Home";
import NotFound from "./components/NotFound";
import API from "./API/API";
import "./styles/global.scss";
import { User, UserRole } from "./utils/interfaces";

const App: FC = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState<User>({
    email: "",
    name: "",
    surname: "",
    role: UserRole.Visitor,
  });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await API.getUser();
        setLoggedIn(true);
        setUser(user);
      } catch {
        setLoggedIn(false);
      }
    };
    checkAuth();
  }, []);

  const handleLogout = async () => {
    await API.logout();
    setLoggedIn(false);
    setUser({});
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
        <Route
          path="/login"
          element={
            <LoginForm
              setUser={setUser}
              loggedIn={loggedIn}
              setLoggedIn={setLoggedIn}
            />
          }
        />

        {/* Route /home for the Home page with the map and diagram */}
        <Route
          path="/home"
          element={
            <Home loggedIn={loggedIn} user={user} handleLogout={handleLogout} />
          }
        />
        {/* Route /* to cath all bad urls */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default App;
