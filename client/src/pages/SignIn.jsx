import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useSelector, useDispatch } from "react-redux";
import {
  signInStart,
  signInSucess,
  signInFalure,
} from "../redux/user/userSlice";
import OAth from "../components/OAth";

function SignIn() {
  const { error, loading } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  function handleInput(e) {
    setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    dispatch(signInStart());

    const res = await fetch("/api/auth/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (data.success == false) {
      dispatch(signInFalure(data.message));
    } else {
      dispatch(signInSucess(data));
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
          disabled={loading}
          required
          className="border p-3 rounded-lg bg-white"
          type="email"
          placeholder="Enter Email"
          id="email"
          onChange={handleInput}
        />
        <input
          disabled={loading}
          required
          className="border p-3 rounded-lg bg-white"
          type="password"
          placeholder="Enter Password"
          id="password"
          onChange={handleInput}
        />
        {error && (
          <div>
            <span className="text-red-500 p-2">{error}</span>
          </div>
        )}

        <button
          disabled={loading}
          className="bg-slate-700 uppercase text-white p-3 rounded-lg hover:opacity-95 disabled:opecity-30"
        >
          {loading ? "loading..." : "sign in"}
        </button>
        <OAth />

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
