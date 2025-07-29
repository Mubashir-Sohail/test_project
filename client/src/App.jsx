import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import MainLayout from "./layout/Mainlayout";
import SignUp from "./pages/SignUp.jsx";
import SignIn from "./pages/SignIn.jsx";
import Home from "./pages/Home.jsx";
import CreateProd from "./pages/CreateProd.jsx";
import Cart from "./pages/Cart.jsx";
import MyProduct from "./pages/MyProduct.jsx";
import UpdateProduct from "./pages/UpdateProd.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const appRouter = createBrowserRouter([
    {
      path: "/",
      element: <MainLayout />,
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "signUp",
          element: <SignUp />,
        },
        {
          path: "signIn",
          element: <SignIn />,
        },
        {
          path: "createdProd",
          element: <CreateProd />,
        },
        {
          path: "cart",
          element: <Cart />,
        },
        {
          path: "myproduct",
          element: <MyProduct />,
        },
        {
          path: "updateProd",
          element: <UpdateProduct />,
        },
      ],
    },
  ]);

  return (
    <>
      <RouterProvider router={appRouter} />
      <ToastContainer hideProgressBar={true} icon={false} position="bottom-right"/>
    </>
  );
}

export default App;
