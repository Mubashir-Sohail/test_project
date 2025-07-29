import { useState } from "react";
import axiosApi from "../api/axiosApi";
import { toast } from "react-toastify";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signUP = async () => {
    try {
      const { data } = await axiosApi.post("/user/signup", {
        name,
        email,
        password,
      });

      toast.success(data.message, {
        style: {
          color: "#f90b0bff",
          fontWeight: "600",
          fontSize: "17px",
          background: "#F7F7F7",
        },
      });
    } catch (error) {
      console.log(error);
      toast.error("Signup failed!");
    }
  };

  return (
    <div className="signup-container">
      <h2 className="signup-title">Sign Up:</h2>

      <label>Name:</label>
      <input
        type="text"
        value={name}
        placeholder="name"
        onChange={(e) => setName(e.target.value)}
        className="signup-input"
      />

      <label>Email:</label>
      <input
        type="email"
        value={email}
        placeholder="email"
        onChange={(e) => setEmail(e.target.value)}
        className="signup-input"
      />

      <label>Password:</label>
      <input
        type="password"
        value={password}
        placeholder="password"
        onChange={(e) => setPassword(e.target.value)}
        className="signup-input"
      />

      <button onClick={signUP} className="signup-button">
        Sign Up
      </button>
    </div>
  );
};

export default SignUp;
