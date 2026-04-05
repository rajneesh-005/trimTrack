import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
// Types
type FormData = {
  email: string;
  password: string;
};

type FormErrors = Partial<Record<keyof FormData, string>>;
export default function Auth(){
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [form, setForm] = useState<FormData>({ email: "", password: "" });
  const [errors, setErrors] = useState<FormErrors>({});
  const [serverError,setServerError] = useState<string>('');

  const navigate = useNavigate();
  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!form.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Invalid email";
    }

    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 6) {
      newErrors.password = "Minimum 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (): Promise<void> => {
    if (!validate()) return;

    const endpoint = isLogin ? '/api/login' : '/api/register';

    const response = await fetch(endpoint,{
        method:'POST',
        headers:{'Content-type':'application/json'},
        body:JSON.stringify({email: form.email,password: form.password})
    });

    const data = await response.json();

    if(response.ok){
        localStorage.setItem('token',data.token);
        navigate('/');
    }else{
        setServerError(data.message);
    }

  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="relative w-[700px] h-[420px] bg-gray-800 rounded-2xl overflow-hidden shadow-lg">

        {/* Sliding Container */}
        <div
          className={`absolute top-0 left-0 w-[200%] h-full flex transition-transform duration-500 ${
            isLogin ? "translate-x-0" : "-translate-x-1/2"
          }`}
        >
          {/* Login */}
          <div className="w-1/2 flex flex-col justify-center items-center p-10">
            <motion.h2
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-white text-2xl mb-5"
            >
              Login
            </motion.h2>

            <input
              name="email"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="w-full mb-2 p-2 rounded bg-gray-700 text-white outline-none focus:ring-2 focus:ring-green-500"
            />
            {errors.email && (
              <p className="text-red-400 text-sm mb-2">{errors.email}</p>
            )}

            <input
              name="password"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="w-full mb-2 p-2 rounded bg-gray-700 text-white outline-none focus:ring-2 focus:ring-green-500"
            />
            {errors.password && (
              <p className="text-red-400 text-sm mb-2">{errors.password}</p>
            )}

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSubmit}
              className="w-full bg-green-500 hover:bg-green-600 text-white p-2 rounded mt-2"
            >
              Login
            </motion.button>

            <p
              className="text-gray-400 mt-4 cursor-pointer hover:text-white transition"
              onClick={() => {
                setErrors({});
                setForm({ email: "", password: "" });
                setIsLogin(false);
              }}
            >
              Don’t have an account? Register
            </p>
          </div>

          {/* Register */}
          <div className="w-1/2 flex flex-col justify-center items-center p-10">
            <motion.h2
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-white text-2xl mb-5"
            >
              Register
            </motion.h2>

            <input
              name="email"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="w-full mb-2 p-2 rounded bg-gray-700 text-white outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.email && (
              <p className="text-red-400 text-sm mb-2">{errors.email}</p>
            )}

            <input
              name="password"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="w-full mb-2 p-2 rounded bg-gray-700 text-white outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.password && (
              <p className="text-red-400 text-sm mb-2">{errors.password}</p>
            )}

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSubmit}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white p-2 rounded mt-2"
            >
              Register
            </motion.button>

            <p
              className="text-gray-400 mt-4 cursor-pointer hover:text-white transition"
              onClick={() => {
                setErrors({});
                setForm({ email: "", password: "" });
                setIsLogin(true);
              }}
            >
              Already have an account? Login
            </p>
          </div>
        </div>
        {serverError && <p className="text-red-400 text-sm mt-2">{serverError}</p>}
      </div>
    </div>
  );
}