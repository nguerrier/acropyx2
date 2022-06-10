import React, {useState} from 'react';
import DashboardHeader from "../../components/DashboardHeader";
import {useNavigate} from "react-router-dom";
import FastAPIClient from '../../client';
import config from '../../config';
import Button from '../../components/Button/Button';
import FormInput from '../../components/FormInput/FormInput';

const client = new FastAPIClient(config);

const Login = () => {
  const [error, setError] = useState({username: "", password: "", error: false});
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });

  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const onLogin = (e) => {
    e.preventDefault();
    setError(false);
    setLoading(true)

    if(loginForm.username.length <= 0)
    {
      setLoading(false)
      return setError({username: "Please Enter Username"}) 
    }
    if(loginForm.password.length <= 0)
    {
      setLoading(false)
      return setError({password: "Please Enter Password"})
    }

    client.login(loginForm.username, loginForm.password)
      .then( () => {
        navigate('/')
      })
      .catch( (err) => {
        setLoading(false)
        setError({error:true});
        console.error(err)
      });
  }


  return (
      <>
      <section className="bg-black ">
        <DashboardHeader />
        <div className="flex items-center justify-center min-h-screen bg-gray-100 text-left ">
            <div className="w-full max-w-xs m-auto bg-indigo-100 rounded p-5 shadow-lg">  
              <header>
                {/* <img className="w-20 mx-auto mb-5" src="https://img.icons8.com/fluent/344/year-of-tiger.png" /> */}
                <div className="flex items-center justify-center w-20 h-20 mx-auto mb-5 bg-teal-500 rounded-full ">
                <svg className=" h-8 w-8" width="54" height="54" viewBox="0 0 54 54" fill='white'  xmlns="http://www.w3.org/2000/svg" >
                  <path d="M13.5 22.1c1.8-7.2 6.3-10.8 13.5-10.8 10.8 0 12.15 8.1 17.55 9.45 3.6.9 6.75-.45 9.45-4.05-1.8 7.2-6.3 10.8-13.5 10.8-10.8 0-12.15-8.1-17.55-9.45-3.6-.9-6.75.45-9.45 4.05zM0 38.3c1.8-7.2 6.3-10.8 13.5-10.8 10.8 0 12.15 8.1 17.55 9.45 3.6.9 6.75-.45 9.45-4.05-1.8 7.2-6.3 10.8-13.5 10.8-10.8 0-12.15-8.1-17.55-9.45-3.6-.9-6.75.45-9.45 4.05z"/>
                </svg>
                </div>
                <div className={`bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative ${error.error ? null : "invisible"}`} role="alert">
                    <strong className="font-bold">Failed to authenticate !</strong>
                    <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
                        <a onClick={() => setError({error:false})}>
                            <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/></svg>
                        </a>
                    </span>
                </div>
              </header>
              <form onSubmit={(e) => onLogin(e)}>
                <FormInput 
                  type={"text"}
                  name={"username"}
                  label={"Username"}
                  error={error.username}
                  value={loginForm.username}
                  onChange={(e) => setLoginForm({...loginForm, username: e.target.value })}
                />
                <FormInput 
                  type={"password"}
                  name={"password"}
                  label={"Password"}
                  error={error.password}
                  value={loginForm.password} 
                  onChange={(e) => setLoginForm({...loginForm, password: e.target.value })}
                />
                <Button 
                  title={"Login"}  
                  loading={loading}
                  error={error.password}
                  />      
              </form>
            </div>
          </div>
      </section>
    </>
  )
}

export default Login;


