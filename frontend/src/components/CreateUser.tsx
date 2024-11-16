import { useState } from "react";
import axios from "axios";
import { Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface CreateUserPageProps {
  onClose: () => void;
  onAuthaction: () => void;
}

const CreateUserPage = ({ onClose, onAuthaction }: CreateUserPageProps) => {
  const [userId, setUserId] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!userId) {
      alert("Please enter a User ID");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        `http://localhost:3000/user/create/${userId}`
      );
      if (res.status === 200) {
        const data = res.data.msg;
        setResponse(data);
        localStorage.setItem("userId", userId);
        onClose();
        onAuthaction();
        navigate("/activemarket");
      }
    } catch (error) {
      setResponse("Error in getting data from pub/sub");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex p-3 z-50 w-full justify-center items-center">
      <div className="relative bg-white md:p-8 p-4 rounded-lg shadow-lg w-full md:w-[60%]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-900 hover:text-gray-700"
        >
          X
        </button>
        <h1 className="text-3xl font-semibold text-center mt-8 text-zinc-800">
          Create Unique ID
        </h1>
        <p className="text-gray-600 text-center mt-2 mb-6">
          Enter a User ID to subscribe.
        </p>

        <div className="relative">
          <input
            type="text"
            className="w-full px-4 py-2 ps-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            placeholder="Enter User ID"
            value={userId}
            required
            onChange={(e) => setUserId(e.target.value)}
          />
          <Sparkles className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary/70" />
        </div>

        <button
          onClick={handleSubmit}
          className={`w-full mt-4 px-4 py-2 bg-zinc-800 text-white rounded-lg font-semibold transition duration-200 ${
            loading ? "opacity-50 cursor-not-allowed" : "hover:bg-zinc-700"
          }`}
          disabled={loading}
        >
          {loading ? "Creating..." : "Create User"}
        </button>

        {response && (
          <div className="mt-6 p-4 border border-blue-200 bg-blue-50 rounded-lg text-center text-blue-800 font-semibold">
            {response}
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateUserPage;
