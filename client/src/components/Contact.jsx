import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Contact({ listing }) {
  const [landlord, setLandlord] = useState(null);
  const [message, setMessage] = useState("");
  useEffect(() => {
    const fetchLandlord = async () => {
      // console.log("listing : ", listing.userRef);
      try {
        const response = await fetch(`/api/users/${listing.userRef}`);
        const data = await response.json();
        setLandlord(data);
        // console.log("data by card : ", data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchLandlord();
  }, [listing]);

  const onChange = (e) => {
    setMessage(e.target.value);
  };
  // console.log(landlord);

  return (
    <div>
      {landlord && (
        <div className="flex flex-col gap-2">
          <p>
            Contact <span className="font-semibold">{landlord.username}</span>{" "}
            for{" "}
            <span className="font-semibold">{listing.name.toLowerCase()}</span>
          </p>

          <textarea
            name="message"
            id="message"
            rows="2"
            value={message}
            onChange={onChange}
            placeholder="Enter your message here..."
            className="w-full border p-3 rounded-lg"
          />
          <Link
            to={`https://mail.google.com/mail/?view=cm&fs=1&to=${
              landlord.email
            }&su=${encodeURIComponent(
              "Regarding " + listing.name
            )}&body=${encodeURIComponent(message)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-slate-700 text-white text-center p-3 uppercase rounded-lg hover:opacity-95"
          >
            Send Message
          </Link>
        </div>
      )}
    </div>
  );
}

export default Contact;
