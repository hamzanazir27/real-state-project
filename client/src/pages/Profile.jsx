import { useSelector } from "react-redux";

function Profile() {
  const { currentUser } = useSelector((state) => state.user);
  return (
    <div className="mx-auto p-3 max-w-lg">
      <h1 className="text-3xl text-center font-semibold my-7">Profile</h1>
      <form className="flex flex-col gap-4">
        <img
          className="w-24 h-24 rounded-full self-center mt-2 cursor-pointer"
          src={currentUser.avatar}
        />
        <input
          type="text"
          className=" p-3 rounded-lg  bg-white"
          placeholder={currentUser.username}
        />
        <input
          type="email"
          className=" p-3 rounded-lg  bg-white"
          placeholder={currentUser.email}
        />
        <input type="password" className="p-3 rounded-lg  bg-white" />
        <button className="bg-slate-700 p-3 rounded-lg text-white uppercase hover:opacity-95">
          update
        </button>
      </form>
      <div className="flex justify-between mt-5">
        <span className="text-red-700">Delete Account</span>
        <span className="text-red-700">Sign Out</span>
      </div>
    </div>
  );
}

export default Profile;
