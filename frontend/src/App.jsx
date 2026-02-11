import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Route,
  RouterProvider,
} from "react-router-dom";
import RootLayout from "./layouts/rootLayout";
import ChatPage from "./pages/chatPage";
import LoginPage from "./pages/loginPage";
import SignUpPage from "./pages/signUpPage";
import { useAuthStore } from "./store/useAuthStore";
import { useEffect, useMemo } from "react";
import { Toaster } from "react-hot-toast";
import Loading from "./components/pageLoader";

const App = () => {
  const { checkAuth, isCheckingAuth, authUser } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const router = useMemo(
    () =>
      createBrowserRouter(
        createRoutesFromElements(
          <Route path="/" element={<RootLayout />}>
            <Route
              index
              element={authUser ? <ChatPage /> : <Navigate to="/login" />}
            />
            <Route
              path="login"
              element={!authUser ? <LoginPage /> : <Navigate to="/" />}
            />
            <Route
              path="signup"
              element={!authUser ? <SignUpPage /> : <Navigate to="/" />}
            />
          </Route>
        )
      ),
    [authUser]
  );

  if (isCheckingAuth) return <Loading />;
  return (
    <>
      <RouterProvider router={router} />
      <Toaster />
    </>
  );
};

export default App;
