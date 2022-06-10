import React, { useEffect, useState } from 'react';
import DashboardHeader from "../../components/DashboardHeader";
import Footer from "../../components/Footer";
import jwtDecode from "jwt-decode";
import * as moment from "moment";
import {useNavigate} from 'react-router-dom';



const Home = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const tokenString = localStorage.getItem("token")
    if (!tokenString) navigate('/login')
	if (tokenString) {
        const token = JSON.parse(tokenString)
        const decodedAccessToken = jwtDecode(token.access_token)
        if(moment.unix(decodedAccessToken.exp).toDate() > new Date()){
            setIsLoggedIn(true)
        } else {
            navigate('/login')
        }
    }
  }, [])

/*
  useEffect(() => {
    if(!isLoggedIn){
      navigate("/login")
    }
  }, []); 
*/

    return (
        <>
               <section className="bg-black ">
                    <DashboardHeader />
                    <div className="container px-5 py-12 mx-auto lg:px-20">

                         <div className="flex flex-col flex-wrap pb-6 mb-12 text-white ">
                              <h1 className="mb-6 text-3xl font-medium text-white">
                                   Acropyx
                              </h1>
                            {isLoggedIn && <p>loggedin</p>}
                          </div>
                    </div>
                    <Footer />
               </section>
        </>
    )
}

export default Home;
