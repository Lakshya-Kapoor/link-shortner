import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import MyUrl from "./pages/MyUrl";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";
import AuthProvider from "./contexts/AuthProvider";
import { useContext } from "react";
import AuthContext from "./utils/AuthContext";
import Redirect from "./pages/Redirect";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isLoggedIn } = useContext(AuthContext);
  if (!isLoggedIn) {
    return <Navigate to="/auth/login" />;
  } else {
    return children;
  }
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isLoggedIn } = useContext(AuthContext);
  if (isLoggedIn) {
    return <Navigate to="/" />;
  } else {
    return children;
  }
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Main Layout */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route
              path="myurls"
              element={
                <ProtectedRoute>
                  <MyUrl />
                </ProtectedRoute>
              }
            />
            <Route
              path="profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
          </Route>
          <Route path="/auth/" element={<AuthLayout />}>
            <Route
              path="login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
            <Route
              path="signup"
              element={
                <PublicRoute>
                  <Signup />
                </PublicRoute>
              }
            />
          </Route>
          <Route path="*" element={<Redirect />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
