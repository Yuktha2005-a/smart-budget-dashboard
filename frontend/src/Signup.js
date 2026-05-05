import React, { useState } from "react";

function Signup({ goToLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = () => {
    if (!username || !password) {
      alert("Fill all fields");
      return;
    }

    const user = { username, password };

    localStorage.setItem("user", JSON.stringify(user));

    alert("✅ Account created! Please login");
    goToLogin();
  };

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h2>📝 Signup</h2>

      <input
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <br /><br />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <br /><br />

      <button onClick={handleSignup}>Signup</button>
      <br /><br />

      <button onClick={goToLogin}>Go to Login</button>
    </div>
  );
}

export default Signup;