  import { useState } from "react";
  import { useNavigate } from "react-router-dom";
  import axiosApi from "../api/axiosApi.jsx";
  import { useCart } from "../components/CartContext.jsx";
  import { toast } from "react-toastify";

  const SignIn = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const { setUser } = useCart();
    const signIN = async () => {
      try {
        const { data} = await axiosApi.post("/user/signin", {
          email,
          password,
        });
        
        if (data.accessToken !== data.refreshToken) {
          setUser(data);
          toast.success(data.message,{
                      style:{
                        color:"#f90b0bff",
                        fontWeight:"600",
                        fontSize:"17px",
                        background:'#F7F7F7',
                      }
                    })
          navigate("/");

          
        }
      } catch (error) {
        console.log(error);
      }
    };

    return (
      <>
        <div
          style={{
            border: "0.5px ",
            borderRadius: "7px",
            width: "350px",
            height: "410px",
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            background: "#EFEFEF",

            paddingInline: "12px",
          }}
        >
          <h2
            style={{
              color: "red",
            }}
          >
            Sign In:
          </h2>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            placeholder="email"
            onChange={(e) => setEmail(e.target.value)}
            style={{
              padding: "8px",
              marginBlock: "8px",
              border: "0.5px ",
              borderRadius: "5px",
            }}
          />
          <label>Password:</label>
          <input
            type="password"
            value={password}
            placeholder="password"
            onChange={(e) => setPassword(e.target.value)}
            style={{
              padding: "8px",
              marginBlock: "8px",
              border: "0.5px ",
              borderRadius: "5px",
            }}
          />

          <button
            onClick={signIN}
            style={{
              padding: "8px",
              border: "0.5px ",
              background: "red",
              color: "white",
              marginBlock: "8px",
              borderRadius: "5px",
            }}
          >
            Sign In
          </button>
        </div>
      </>
    );
  };

  export default SignIn;
