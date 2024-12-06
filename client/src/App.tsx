import { FC, useEffect, useState } from "react";
import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import API from "./API/API";
import DocumentForm from "./components/DocumentForm";
import NotFound from "./components/NotFound";
import Popup from "./components/Popup";
import { useAppContext } from "./context/appContext";
import { authContext } from "./context/auth";
import { DocumentFormProvider } from "./providers/DocumentFormProvider";
import { PopupProvider } from "./providers/PopupProvider";
import Diagram from "./routes/Diagram";
import DocumentsList from "./routes/DocumentsList";
import Home from "./routes/Home";
import LoginForm from "./routes/LoginForm";
import UploadsList from "./routes/UploadsList";
import "./styles/App.scss";
import { User } from "./utils/interfaces";
const App: FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const { isPopupOpen, modalOpen } = useAppContext();

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
      <DocumentFormProvider>
        <PopupProvider>
          <Routes>
            <Route
              path="/"
              element={
                <>
                  {isPopupOpen && <Popup />}
                  {modalOpen && <DocumentForm />}
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

              {/* Route /documents where can be find the list of all documents */}
              <Route path="/uploads" element={<UploadsList />} />

              <Route path="/diagram" element={<Diagram />} />

              {/* Route /* to cath all bad urls */}
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </PopupProvider>
      </DocumentFormProvider>
    </authContext.Provider>
  );
};

export default App;
