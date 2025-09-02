import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function SignIn() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  function handleInput(e) {
    setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault(); // page reload prevent
    setIsLoading(true);

    const res = await fetch("/api/auth/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (data.success == false) {
      setErrorMessage(data.message);
      setIsLoading(false);
      setError(true);
    } else {
      setIsLoading(false);
      setError(false);
      setFormData({
        email: "",
        password: "",
      });
      navigate("/");
    }
  }

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-center text-3xl font-semibold my-7 ">Sign In</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          disabled={isLoading}
          required
          className="border p-3 rounded-lg bg-white"
          type="email"
          placeholder="Enter Email"
          id="email"
          onChange={handleInput}
        />
        <input
          disabled={isLoading}
          required
          className="border p-3 rounded-lg bg-white"
          type="password"
          placeholder="Enter Password"
          id="password"
          onChange={handleInput}
        />
        {error && (
          <div>
            <span className="text-red-500 p-2">{errorMessage}</span>
          </div>
        )}

        <button
          disabled={isLoading}
          className="bg-slate-700 uppercase text-white p-3 rounded-lg hover:opacity-95 disabled:opecity-30"
        >
          {isLoading ? "loading..." : "sign in"}
        </button>

        <div className="flex gap-2 mt-3">
          <p>Don't not account?</p>
          <Link to={"/signup"}>
            <span className="text-blue-700 hover:underline">Sign up</span>
          </Link>
        </div>
      </form>
    </div>
  );
}

export default SignIn;
