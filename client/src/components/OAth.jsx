import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../firebase.js";
import { useDispatch } from "react-redux";
import { signInSucess } from "../redux/user/userSlice";
import { useNavigate } from "react-router-dom";

function OAth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  async function handleGoogleClick() {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);
      const result = await signInWithPopup(auth, provider);

      // ✅ Get Firebase ID token
      const token = await result.user.getIdToken();

      // ✅ Send token to backend
      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // secure way
        },
      });

      const data = await res.json();

      dispatch(signInSucess(data));
      navigate("/");
    } catch (e) {
      console.error("Google Sign-in Error:", e.message || e);
    }
  }

  return (
    <button
      type="button"
      onClick={handleGoogleClick}
      className="bg-red-700 text-white p-3 rounded-lg uppercase hover:opacity-90"
    >
      Continue With Google
    </button>
  );
}

export default OAth;
