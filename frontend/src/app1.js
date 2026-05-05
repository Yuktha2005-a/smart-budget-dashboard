import React, { useState, useEffect } from "react";
import Login from "./Login";
import Dashboard from "./Dashboard";

function App() {
  const [token, setToken] = useState(null);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");

    if (savedToken && savedToken !== "undefined" && savedToken !== "null") {
      setToken(savedToken);
    } else {
      setToken(null);
    }
  }, []);

  const handleLogin = (newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  return (
    <div>
      {token ? (
        <Dashboard logout={handleLogout} />
      ) : (
        <Login setToken={handleLogin} />
      )}
    </div>
  );
}

export default App;