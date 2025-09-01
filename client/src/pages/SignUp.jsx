import { Link } from "react-router-dom";

function SignUp() {
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-center text-3xl font-semibold my-7 ">Sign Up</h1>
      <form className="flex flex-col gap-4">
        <input
          type="text"
          className="border p-3 bg-white rounded-lg"
          placeholder="Enter Username"
        />
        <input
          className="border p-3 rounded-lg"
          type="email"
          placeholder="Enter Email"
        />
        <input
          className="border p-3 rounded-lg"
          type="password"
          placeholder="Enter Password"
        />

        <button className="bg-slate-700 uppercase text-white p-3 rounded-lg hover:opacity-95 disabled:opecity-30">
          sign up
        </button>

        <div className="flex gap-2 mt-3">
          <p>Have not account?</p>
          <Link to={"/signin"}>
            <span className="text-blue-700 hover:underline">Sign in</span>
          </Link>
        </div>
      </form>
    </div>
  );
}

export default SignUp;
