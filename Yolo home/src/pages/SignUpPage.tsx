import COVER_IMAGE from '../assets/Background.png';
//import Google_Icon from '../assets/icons8-google.svg';
import HCMUTlogo from '../assets/OIP.png';
import {useForm} from "react-hook-form"
import {DevTool} from "@hookform/devtools"
import {NavLink,useNavigate} from "react-router-dom";
import './SignUpPage.css'
import axios,{ AxiosError } from 'axios';
import {axiosPublic} from '../api/axios';
import React,{useState } from 'react';

// import {faCheck, faTimes, faInfoCircle} from "@fortawesome/free-solid-svg-icons"
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// const color = {
//    primary: "#060606",
//    background: "#E0E0E0",
//    disabled: "#D9D9D9" 
// }
type FormValues = {
    name: string;
    email: string;
    password: string;
    password_confirmed: string;
}
function SignUp() {
    
    const form = useForm<FormValues>(
    {
        defaultValues: {
            email: "",
            password: "",
            password_confirmed: ""
        },
        mode: 'onSubmit'
    }
    );
  
    const {register,control,handleSubmit,formState,getValues,setValue,reset} = form;
    const {errors,isSubmitting} = formState;
    const navigate = useNavigate();
    //const location = useLocation();
    //const from = location.state?.from?.pathname || "/";
    const [errorMessage, setErrorMessage] = useState('');
    const onSubmit = async(data: FormValues,event: React.FormEvent<HTMLFormElement>) => {   
        event.preventDefault();
        if (isSubmitting) return;
        try {
            const response = await axiosPublic.post("/users/signup",{name: data.name,email: data.email,password: data.password})
            console.log(response?.data)
            
            
            reset()
            navigate("/login", {replace: true});
        } catch(error) {
            if (axios.isAxiosError(error)) {
                const axiosError = error as AxiosError;
                if (axiosError.response?.status === 400) {setErrorMessage(axiosError.response?.data?.msg);}
                else {console.error(axiosError);}
                setValue('password','',{
                    shouldValidate: false
                })
                setValue('password_confirmed','',{
                    shouldValidate: false
                })
            }
            else {
                setErrorMessage("Some thing else")
                console.error(error)
            }
        }
    }
    const onError = () => {
        setValue('password','',{
            shouldValidate: false
        })
        setValue('password_confirmed','',{
            shouldValidate: false
        })
    }
    // useEffect(()=>{
    //     const subcription = watch((value)=>{
    //         //console.log(value)
    //     })
    //     return () => subcription.unsubscribe();
    // },[watch])
    
    
    return(
        <div className= "w-screen h-screen flex items-start flex-row-reverse font-poppins ">
            <div className = 'relative w-2/3 h-full flex flex-col'>
                <div className='absolute top-[10%] left-[12%] flex flex-col'>
                    <h1 className='text-6xl text-white font-bold my-4'>
                        YoloHome
                    </h1>
                    <p className='text-xl text-white font-normal'>
                        Be in control of your house and your appliances 
                    </p>
                    
                </div>
                <img src={COVER_IMAGE} className="w-full h-full object-cover"/>
            </div>
            <div className='w-1/2 h-full bg-[#faf0dc] flex flex-col pt-10 pl-[44px] p-20 justify-start'>
                <div className='w-full flex flex-row items-center '>
                    <img src={HCMUTlogo} className='h-12 mr-6'/>
                    <h1 className='text-3xl text-[#060606] font-semibold'> HCMUT-CC01-TeamDEV</h1>
                </div>
                <div className='w-full flex flex-col mt-12 max-w-[650px]'>
                    <div className='w-full flex flex-col mb-2'>
                        <h3 className='text-3xl fornt-semibold mb-4 text-black'>SignUp</h3>
                        <p className='text-base mb-2 text-black'>Please fill out all the fields below.</p>
                    </div>

                    
                    <form onSubmit={handleSubmit(onSubmit,onError)} noValidate action=''>

                        

                        <div className='w-full flex flex-col'>
                            <input type="name" id ="name" {...register("name",{
                                required: "Please input your name",
                            })} placeholder="Name" className='w-full text-black pl-1 py-4 my-2 bg-transparent border-b border-black outline-none focus:outline-none'></input>
                            <input type="email" id="email" {...register("email",{
                                required: "Email is required",
                                pattern: {
                                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        
                                    message: 'Invalid email format'
                                },
                                validate: {
                                    badDomain: (fieldValue) => {
                                        return (
                                            !fieldValue.endsWith("baddomain.com") || "We only support google email"
                                        )
                                    },
                                    emailAvailable: async(fieldValue) => {
                                        try {
                                            const response = await axiosPublic.post("/users/checkEmail",{email: fieldValue});
                                            return (
                                                (response?.status === 200 && response?.data?.msg === true) || "Email already used"
                                            )
                                        } catch(error) {
                                            if (axios.isAxiosError(error)) {
                                                const axiosError = error as AxiosError;
                                                if (axiosError.response?.status === 400) {setErrorMessage(axiosError.response?.data?.msg);}
                                                else {console.error(axiosError);}
                                                setValue('password','',{
                                                    shouldValidate: false
                                                })
                                                setValue('password_confirmed','',{
                                                    shouldValidate: false
                                                })
                                                
                                            }
                                            else {
                                                setErrorMessage("Some thing else")
                                                console.error(error)
                                            }
                                        }

                                    }
                                }
                            })} placeholder="Email" className='w-full text-black pl-1 py-4 my-2 bg-transparent border-b border-black outline-none focus:outline-none'>
                            
                            </input>
                            <p className='text-sm pl-1 text-red-600 font-sans'>{errors.email?.message}</p>

                            <input type="password" id ="password" {...register("password",{
                                required: "Password is required",
                                minLength: {
                                    value: 8,
                                    message: "Password must be at least 8 characters long"
                                },
                                maxLength: {
                                    value: 29,
                                    message: "Password must be less than 30 characters long"
                                },
                                pattern: {
                                    value: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
                                    message: 'Password must contain at least 1 special character and 1 number'
                                }
                            })} placeholder="Password" className='w-full text-black pl-1 py-4 my-2 bg-transparent border-b border-black outline-none focus:outline-none'></input>

                            <p className='text-sm pl-1 text-red-600 font-sans'>{errors.password?.message}</p>
                            
                            <input type="password" id ="password_confirmed" {...register("password_confirmed",{
                                required: "Please confirm the password",
                                validate: {
                                    matchPassword: (value) => {
                                        const password = getValues("password");
                                        
                                        return password === value || "Passwords should match!";
                                    }
                                }
                            })} placeholder="Confirm password" className='w-full text-black pl-1 py-4 my-2 bg-transparent border-b border-black outline-none focus:outline-none'></input>
                            
                        </div>

                        

                        <div className='w-full flex flex-col my-4'>
                            <button type='submit' disabled={isSubmitting} className='w-full text-white my-2 font-semibold bg-[#060606] rounded-md p-4 text-center flex items-center justify-center cursor-pointer'>
                                Register
                            </button>
                    
        

                        </div>
                    </form>
                    <DevTool control={control}></DevTool>
                    {errorMessage && <p className='text-base pl-1 pb-4 text-red-600 font-sans'>{errorMessage}</p>}
                    {/*
                    <div className='w-full flex flex-col items-center justify-center relative py-2'>
                        <div className='w-full h-[1px] bg-black/40 z-10'></div>
                        <p className = 'w-[32px] text-center text-base absolute text-black/90 bg-[#E0E0E0] z-20'>Or</p>
                    </div>
                    
                    <button className='w-full text-[#060606] my-8 mb-12 font-semibold bg-white border-1.5 border-black/40 rounded-md p-4 text-center flex items-center justify-center cursor-pointer'>
                        <img src={Google_Icon} className='h-6 mr-2'/>
                        Sign In With Google
                    </button>
                        */}

                    <div className='w-full flex items-center justify-center'>
                        <p className='text-sm font-normal text-[#060606]'>Already have a account? <span className='font-semibold '><NavLink to='/login' className='underline underline-offset-2 cursor-pointer'>Sign in</NavLink> </span></p>
                    </div>

                </div>

                

            </div>
        </div>
    )
}

export default SignUp