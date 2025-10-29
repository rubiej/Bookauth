import { useState } from "react";
import { useRouter } from "next/router";

export default function Home() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState("login"); // or "register"
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = mode === "login" ? "/login" : "/register";

    const res = await fetch(`https://booklist-1-aghg.onrender.com${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();
    if (data.token) {
      localStorage.setItem("token", data.token);
      router.push("/dashboard");
    } else {
      alert(data.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-80">
        <h2 className="text-xl font-bold mb-4">{mode === "login" ? "Login" : "Register"}</h2>
        <input
          type="text"
          placeholder="Username"
          className="w-full mb-2 p-2 border"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full mb-4 p-2 border"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="w-full bg-blue-500 text-white p-2 rounded">
          {mode === "login" ? "Login" : "Register"}
        </button>
        <p className="mt-4 text-sm text-center">
          {mode === "login" ? "No account?" : "Already registered?"}{" "}
          <span
            className="text-blue-500 cursor-pointer"
            onClick={() => setMode(mode === "login" ? "register" : "login")}
          >
            {mode === "login" ? "Register" : "Login"}
          </span>
        </p>
      </form>
    </div>
  );
}
