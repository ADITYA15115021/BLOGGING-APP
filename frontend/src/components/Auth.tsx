import { ChangeEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SignupInput } from "@aditya-15-kamboj/vlog-common";
import { BACKEND_URL } from "../config";
import axios from "axios";

export function Auth( {type} : {type : "signup" | "signin"}){
    const navigate = useNavigate();

    const [postInputs, setInputs] = useState<SignupInput>( {
        name : "",
        username:"",
        password:""
    })

    async function sendRequest() {

    try{
        const resposnse = await axios.post(`${BACKEND_URL}/api/v1/user/${type === "signup" ? "signup" : "signin"}` , postInputs )
        const jwt = resposnse.data;
        localStorage.setItem("token",jwt);
        navigate("/blogs");

    }catch(e){
        alert("error");
    }

    }

    return(
        <>
        <div className="flex flex-col justify-center h-screen">
            <div className="flex justify-center">
              <div>
                    <div>
                        <div className="text-3xl font-extrabold px-16">
                            {type === "signup" ? "Create an Account"  : "SIGNIN" }
                        </div>
                        <div className="text-slate-500">
                            {type === "signin" ? "Don't have an account ?" : "Already have an account ?"}
                            <Link to={type==="signup" ? "/signin" : "/signup"}  className="underline pl-2">{type === "signup" ? "signin" : "signup"}</Link>
                        </div>
                    </div>

                    <div>

                    { type === "signup" ? <Input type="text" label="name" placeholder="aditya..." onChange={ 
                            (e) => { setInputs( {...postInputs, name:e.target.value })}
                        }></Input> : null} 

                        <Input type="text" label="username" placeholder="aditya@gmail.com..." onChange={ 
                            (e) => { setInputs( {...postInputs, username:e.target.value })}
                        }></Input>

                        <Input  type="password" label="password" placeholder="12345..." onChange={ 
                            (e) => { setInputs( {...postInputs, password:e.target.value })}
                        }></Input>

                        <button onClick={sendRequest } type="button" className="w-full mt-3 text-white bg-gray-800 hover:bg-gray-900 focus:outline-none
                         focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2
                        dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">
                        {type === "signup"? "SIGN UP" : "SIGN IN"}
                          
                        </button>

                        

                    </div>
                </div>
            </div>
        </div>
        </>
    )
}

interface InputType{
    label : string;
    placeholder:string;
    onChange : ( e : ChangeEvent<HTMLInputElement>) => void;
    type: string

}

function Input( {label , placeholder , onChange,type} : InputType){
    
    return(
        <>
         <label className="block mb-2 text-sm font-medium text-black" >{label}</label>
         <input  className="bg-gray-50 border border-gray-300 text-gray-900
            ext-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"  
         placeholder={placeholder}  onChange={onChange}  required type={type}
         >
         
         </input>
        </>
    )
}