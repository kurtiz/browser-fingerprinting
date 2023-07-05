'use client';
import {useEffect, useRef, useState} from 'react'
import login_bg from '../assets/images/login_bg.jpg';
import {Button, Card, Checkbox, Label, TextInput} from 'flowbite-react';
import {useVisitorData} from '@fingerprintjs/fingerprintjs-pro-react'
import axios from "axios";
import {Link, useNavigate} from "react-router-dom";
import {ToastContainer, toast} from 'react-toastify';

const SignUpPage = () => {
    const {isLoading, error, data, getData} = useVisitorData(
        {extendedResult: true},
        {immediate: true}
    )

    useEffect(() => {
        document.title = "Sign Up";
    }, [])

    const [errorText, setErrorText] = useState("");
    const [errorUsername, setErrorUsername] = useState("");
    const [errorUserFullname, setErrorUserFullname] = useState("");
    const [errorUserEmail, setErrorUserEmail] = useState("");
    const [errorUserPass, setErrorUserPass] = useState("");
    const [username, setUsername] = useState("");
    const [userFullname, setUserFullname] = useState("");
    const [userPass, setUserPass] = useState("");
    const [userEmail, setUserEmail] = useState("");

    const notify = () => {
        toast("Easy peezy!");
    }

    const usernameElementRef = useRef(null);
    const userFullnameElementRef = useRef(null);
    const userPasswordElementRef = useRef(null);
    const userEmailElementRef = useRef(null);
    const api = axios.create({
        baseURL: 'https://bb88-102-176-65-196.ngrok-free.app',
        // baseURL: 'http://localhost:3000',
    })

    const validateUsername = () => {
        if (username === "") {
            setErrorUsername("Please enter username!");
            return false;
        } else if (username.length < 5) {
            setErrorUsername("Username must be more than 5 characters long!");
            return false;
        } else {
            setErrorUsername("");
            return true;
        }
    }
    const validateUserFullname = () => {
        if (userFullname === "") {
            setErrorUserFullname("Please enter Full name!");
            return false;
        } else if (userFullname.length < 5) {
            setErrorUserFullname("Come on your name is longer than 5 characters 😒");
            return false;
        } else {
            setErrorUserFullname("");
            return true;
        }
    }
    const validateEmail = () => {
        if (userEmail === "") {
            setErrorUserEmail("Please enter email!");
            return false;
        } else if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(userEmail)) {
            setErrorUserEmail("Please enter a valid email!");
            return false;
        } else {
            setErrorUserEmail("");
            return true;
        }
    }
    const validatePassword = () => {
        if (userPass === "") {
            setErrorUserPass("Please enter password!");
            return false;
        } else if (userPass.length < 8) {
            setErrorUserPass("Password must be more than 8 characters long!");
            return false;
        } else {
            setErrorUserPass("");
            return true;
        }
    }
    const handleSignUpClick = () => {
        if (validateUserFullname() && validateUsername() && validateEmail() && validatePassword()) {
            getData({ignoreCache: true})

            if (error) {
                setErrorText(error.message);
            } else {
                console.log("signing up: ")
                setErrorText("");

                toast.promise(api.post('/signup',
                        {
                            username: username,
                            password: userPass,
                            email: userEmail,
                            name: userFullname,
                            visitorID: data.visitorId,
                        }
                    )
                        .then(function (response) {
                            setErrorText("")
                        })
                        .catch(function (error) {
                            console.log(error);
                            setErrorText(error.response.data.message);
                            throw new Error("Additional condition not met");
                        })
                    , {
                        pending: "Signing up!",
                        success: "Signed up Successfully!",
                        error: errorText
                    }
                )
            }
        } else {
            setErrorText("Fix errors to proceed!");
        }
    }


    return (
        <>
            <ToastContainer/>
            <div className="h-screen flex items-center justify-center">
                <div className="md:grid md:grid-cols-2 items-center p-4">
                    <div>
                        <img
                            src={login_bg}
                            className="lg:rounded-l-lg md:h-screen md:py-8 md:object-cover md:pr-4 h-15 mb-2"
                            alt="interior design"/>
                    </div>
                    <div>
                        <h3 className="text-center text-2xl font-bold">Join Us</h3>
                        <form className="flex flex-col gap-4 px-4">
                            <div>
                                <div className="mb-2 block">
                                    <Label
                                        htmlFor="fullname"
                                        value="Your Full name"
                                    />
                                </div>
                                <input
                                    ref={userFullnameElementRef}
                                    type="text"
                                    id="fullname"
                                    placeholder="Full name"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    required
                                    onChange={() => {
                                        setUserFullname(userFullnameElementRef.current.value)
                                    }}
                                />
                                <div className="ml-3 flex-col items-center">
                                    <label
                                        className={`text-red-500 text-sm  ${errorUserFullname !== "" ? "" : "hidden"} text-center`}>
                                        {errorUserFullname}
                                    </label>
                                </div>
                            </div>
                            <div>
                                <div className="mb-2 block">
                                    <Label
                                        htmlFor="username"
                                        value="Your Username"
                                    />
                                </div>
                                <input
                                    ref={usernameElementRef}
                                    type="text"
                                    id="username"
                                    placeholder="username"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    required
                                    onChange={() => {
                                        setUsername(usernameElementRef.current.value)
                                    }}
                                />
                                <div className="ml-3 flex-col items-center">
                                    <label
                                        className={`text-red-500 text-sm  ${errorUsername !== "" ? "" : "hidden"} text-center`}>
                                        {errorUsername}
                                    </label>
                                </div>
                            </div>
                            <div>
                                <div className="mb-2 block">
                                    <Label
                                        htmlFor="email"
                                        value="Your Email"
                                    />
                                </div>
                                <input
                                    ref={userEmailElementRef}
                                    type="email"
                                    id="email"
                                    placeholder="name@domain.com"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    required
                                    onChange={() => {
                                        setUserEmail(userEmailElementRef.current.value)
                                    }}
                                />
                                <div className="ml-3 flex-col items-center">
                                    <label
                                        className={`text-red-500 text-sm  ${errorUserEmail !== "" ? "" : "hidden"} text-center`}>
                                        {errorUserEmail}
                                    </label>
                                </div>
                            </div>
                            <div>
                                <div className="mb-2 block">
                                    <Label
                                        htmlFor="user_password"
                                        value="Your Password"
                                    />
                                </div>
                                <input
                                    ref={userPasswordElementRef}
                                    type="password"
                                    id="user_password"
                                    placeholder="***********"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    required
                                    onChange={() => {
                                        setUserPass(userPasswordElementRef.current.value)
                                    }}
                                />
                                <div className="flex-col items-center">
                                    <label
                                        className={`text-red-500 text-sm  ${errorUserPass !== "" ? "" : "hidden"} text-center`}>
                                        {errorUserPass}
                                    </label>
                                </div>
                            </div>
                            <div className="flex-col items-center">
                                <label
                                    className={`text-red-500 text-sm ${errorText !== "" ? "" : "hidden"} text-center`}>
                                    {errorText}
                                </label>
                            </div>
                            <Button
                                type="button"
                                onClick={() => handleSignUpClick()}>
                                Sign Up
                            </Button>
                            <p className="text-sm text-right">
                                Already have an account?
                                <Link to="/" className="text-[#0e7490] font-bold ml-1 mr-2 underline">Login here</Link>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default SignUpPage;