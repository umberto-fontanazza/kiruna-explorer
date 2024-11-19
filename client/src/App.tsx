import { FC, useEffect, useState } from "react";
import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import API from "./API/API";
import NotFound from "./components/NotFound";
import { authContext } from "./context/auth";
import DocumentsList from "./routes/DocumentsList";
import Home from "./routes/Home";
import LoginForm from "./routes/LoginForm";
import "./styles/App.scss";
import { User } from "./utils/interfaces";

const App: FC = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const user = await API.getUser();
        setUser(user);
      } catch (error: unknown) {
        console.error(error);
      }
    })();
  }, []);

  const login = async (email: string, password: string) => {
    const user: User = await API.login(email, password);
    setUser(user);
  };

  const logout = async () => {
    await API.logout();
    setUser(null);
  };

  return (
    <authContext.Provider value={{ user, login, logout }}>
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
          <Route path="/login" element={<LoginForm />} />

          {/* Route /home for the Home page with the map and diagram */}
          <Route path="/home" element={<Home />} />

          {/* Route /documents where can be find the list of all documents */}
          <Route path="/documents" element={<DocumentsList />} />
          {/* Route /* to cath all bad urls */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </authContext.Provider>
  );
};

export default App;
