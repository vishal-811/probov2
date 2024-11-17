import  { useState } from 'react';
import { Sparkles, X, ArrowRight, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="relative bg-white rounded-2xl shadow-2xl w-full md:w-[500px] overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-50 to-zinc-100 z-0" />
        
        <div className="relative z-10 p-8">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-zinc-100 transition-colors"
          >
            <X className="w-5 h-5 text-zinc-600" />
          </button>

          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-zinc-900 rounded-2xl">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-zinc-900 mb-2">
              Begin Your Trading Journey
            </h1>
            <p className="text-zinc-600">
              Create your unique trading ID and start exploring the markets
            </p>
          </div>

          <div className="space-y-6">
            <div className="relative">
              <input
                type="text"
                className="w-full px-4 py-3 ps-12 border border-zinc-200 rounded-xl 
                           focus:outline-none focus:ring-2 focus:ring-zinc-600 focus:border-transparent
                           transition-all duration-200 bg-white"
                placeholder="Create your trading ID"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                required
              />
              <Shield className="absolute left-4 top-1/2 transform -translate-y-1/2 text-zinc-400 w-5 h-5" />
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full py-3 px-4 bg-gradient-to-r from-zinc-900 to-zinc-800 
                         text-white rounded-xl font-semibold hover:opacity-90 
                         transition-all duration-200 flex items-center justify-center space-x-2
                         disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin" />
                  <span>Creating...</span>
                </div>
              ) : (
                <>
                  <span>Start Trading</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>

            <div className="mt-6 space-y-3">
              <div className="flex items-center space-x-3 text-sm text-zinc-600">
                <div className="w-1 h-1 bg-zinc-400 rounded-full" />
                <span>Real-time market updates</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-zinc-600">
                <div className="w-1 h-1 bg-zinc-400 rounded-full" />
                <span>Secure trading environment</span>
              </div>
            </div>

            {response && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 border border-zinc-200 bg-zinc-50 rounded-xl text-center text-zinc-800"
              >
                {response}
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CreateUserPage;