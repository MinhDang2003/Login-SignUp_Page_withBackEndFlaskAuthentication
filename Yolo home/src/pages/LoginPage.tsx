import COVER_IMAGE from "../assets/Background.png";
//import Google_Icon from '../assets/icons8-google.svg';
import HCMUTlogo from "../assets/OIP.png";
import { useForm } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
import { useNavigate, NavLink, useLocation } from "react-router-dom";
import { axiosPublic } from "../api/axios";
import axios, { AxiosError } from "axios";
import React, { useState, useEffect } from "react";
import useAuth from "../hooks/useAuth";
// const color = {
//    primary: "#060606",
//    background: "#faf0dc",
//    disabled: "#D9D9D9"
// }
type FormValues = {
	email: string;
	password: string;
	saved: boolean;
};
function Login() {
	const { setAuth, persist, setPersist } = useAuth();
	const form = useForm({
		defaultValues: {
			email: "",
			password: "",
			saved: false,
		},
		mode: "onSubmit",
	});
	const { register, control, handleSubmit, formState, setValue, reset } = form;
	const { errors, isSubmitting } = formState;
	const navigate = useNavigate();
	const location = useLocation();
	const from = location.state?.from?.pathname || "/";
	const [errorMessage, setErrorMessage] = useState("");
	const onSubmit = async (
		data: FormValues,
		event: React.FormEvent<HTMLFormElement>
	) => {
		event.preventDefault();
		if (isSubmitting) return;
		try {
			const response = await axiosPublic.post("/users/signin", {
				saved: data.saved,
				email: data.email,
				password: data.password,
			});
			setAuth((prev) => {
				return { ...prev, token: response?.data?.token };
			});

			localStorage.setItem("persist", data.saved.toString());
			setPersist(data.saved);

			reset();
			navigate(from, { replace: true });
		} catch (error) {
			if (axios.isAxiosError(error)) {
				const axiosError = error as AxiosError;
				if (axiosError.response?.status === 400) {
					setErrorMessage(axiosError.response?.data?.msg);
				} else {
					console.error(axiosError);
				}
				setValue("password", "", {
					shouldValidate: false,
				});
				setValue("saved", false, {
					shouldValidate: false,
				});
			} else {
				setErrorMessage("Some thing else");
				console.error(error);
			}
		}
	};

	return (
		<div className="w-screen h-screen flex items-start ">
			<div className="relative w-2/3 h-full flex flex-col">
				<div className="absolute top-[10%] left-[12%] flex flex-col">
					<h1 className="text-6xl text-white font-bold my-4">YoloHome</h1>
					<p className="text-xl text-white font-normal">
						Be in control of your house and your appliances
					</p>
				</div>
				<img src={COVER_IMAGE} className="w-full h-full object-cover" />
			</div>
			<div className="w-1/2 h-full bg-[#faf0dc] flex flex-col pt-10 pl-[44px] p-20 justify-center font-poppins">
				<div className="w-full flex flex-row items-center ">
					<img src={HCMUTlogo} className="h-12 mr-6" />
					<h1 className="text-3xl text-[#060606] font-semibold">
						{" "}
						HCMUT-CC01-TeamDEV
					</h1>
				</div>
				<div className="w-full flex flex-col mt-12 max-w-[650px]">
					<div className="w-full flex flex-col mb-2">
						<h3 className="text-3xl fornt-semibold mb-4 text-black">Login</h3>
						<p className="text-base mb-2 text-black">
							Welcome Back! Please enter your details.
						</p>
					</div>

					<form onSubmit={handleSubmit(onSubmit)} noValidate>
						<div className="w-full flex flex-col">
							<input
								type="email"
								id="email"
								{...register("email", {
									required: "Email is required",
									pattern: {
										value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
										message: "Invalid email format",
									},
									validate: {
										notGoogleEmail: (fieldValue) => {
											return (
												!fieldValue.endsWith("baddomain.com") ||
												"We only support google email"
											);
										},
									},
								})}
								placeholder="Email"
								className="w-full text-black pl-1 py-4 my-2 bg-transparent border-b border-black outline-none focus:outline-none"
							></input>
							<p className="text-sm pl-1 text-red-600 font-sans">
								{errors.email?.message}
							</p>

							<input
								type="password"
								id="password"
								{...register("password", {
									required: "Password is required",
								})}
								placeholder="Password"
								className="w-full text-black pl-1 py-4 my-2 bg-transparent border-b border-black outline-none focus:outline-none"
							></input>
							<p className="text-sm pl-1 text-red-600 font-sans">
								{errors.password?.message}
							</p>
						</div>

						<div className="w-full flex items-center justify-between mt-3">
							<div className="w-full flex items-center ">
								<input
									type="checkbox"
									id="saved"
									{...register("saved")}
									className="w-4 h-4 mr-2"
								></input>
								<p className="text-sm text-black">Remember me</p>
							</div>

							<p className="text-sm font-medium whitespace-nowrap cursor-pointer underline underline-offset-2 text-black">
								Forgot Password
							</p>
						</div>

						<div className="w-full flex flex-col my-4">
							<button
								type="submit"
								disabled={isSubmitting}
								className="w-full text-white my-2 font-semibold bg-[#060606] rounded-md p-4 text-center flex items-center justify-center cursor-pointer"
							>
								Log in
							</button>
						</div>
					</form>
					<DevTool control={control}></DevTool>
					{errorMessage && (
						<p className="text-base pl-1 pb-4 text-red-600 font-sans">
							{errorMessage}
						</p>
					)}
					{/*
                    <div className='w-full flex flex-col items-center justify-center relative py-2'>
                        <div className='w-full h-[1px] bg-black/40 z-10'></div>
                        <p className = 'w-[32px] text-center text-base absolute text-black/90 bg-[#faf0dc] z-20'>Or</p>
                    </div>

                    <button className='w-full text-[#060606] my-8 mb-12 font-semibold bg-white border-1.5 border-black/40 rounded-md p-4  text-center flex items-center justify-center cursor-pointer'>
                        <img src={Google_Icon} className='h-6 mr-2'/>
                        Sign In With Google
                    </button>
                    */}

					<div className="w-full flex items-center justify-center">
						<p className="text-sm font-normal text-[#060606]">
							Dont have a account?{" "}
							<span className="font-semibold ">
								<NavLink
									to="/signup"
									className="underline underline-offset-2 cursor-pointer"
								>
									Sign up
								</NavLink>{" "}
								for free
							</span>
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Login;
