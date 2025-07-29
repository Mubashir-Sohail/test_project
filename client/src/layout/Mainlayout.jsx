import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../pages/Navbar";


const MianLayout=()=>{
    return(
        <>
        <Navbar/>
        <Outlet/>
        </>
    )
}

export default MianLayout