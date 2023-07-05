'use client';
import {useEffect, useRef, useState} from 'react'
import login_bg from '../assets/images/login_bg.jpg';
import {Button, Card, Checkbox, Label, TextInput} from 'flowbite-react';
import {useVisitorData} from '@fingerprintjs/fingerprintjs-pro-react'
import axios from "axios";
import { Link } from 'react-router-dom';
import {toast, ToastContainer} from "react-toastify";
import {retrieveCookieData, saveCookieData} from "../utils/CookieManager.js";

const LoginPage = () => {
    const {isLoading, error, data, getData} = useVisitorData(
        {extendedResult: true},
        {immediate: true}
    )


    const [errorText, setErrorText] = useState("");
    const [colorUsername, setColorUsername] = useState("");
    const [colorUserPass, setColorUserPass] = useState("")
    const [errorUsername, setErrorUsername] = useState("")
    const [errorUserPass, setErrorUserPass] = useState("")
    const [username, setUsername] = useState("")
    const [userPass, setUserPass] = useState("")
    const [rememberMe, setRememberMe] = useState(false)

    const usernameElementRef = useRef(null)
    const userPasswordElementRef = useRef(null)
    const rememberUserElementRef = useRef(null)

    const api = axios.create({
        baseURL: 'https://bb88-102-176-65-196.ngrok-free.app',
        // baseURL: 'http://localhost:3000',
    })

    useEffect(() => {
        document.title = "Login";
        api.post("/authenticate", {
            username: retrieveCookieData("username")
        }).then(response => {
            window.location.href = "/dashboard"
        })
    }, [])

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


    const handleLoginClick = () => {
        if (validateUsername() && validatePassword()) {
            getData({ignoreCache: true})

            if (error) {
                setErrorText(error.message);
            } else {
                const fingerprint = {
                    visitorID: data.visitorId,
                    browser: data.browserName,
                    browserField: data.browserVersion,
                    country: data.ipLocation.country.name,
                    city: data.ipLocation.city.name,
                    os: data.os,
                    lastSeen: data.lastSeenAt.global,
                    isLoggedIn: true,
                }
                const loginInfo = {
                    username: username,
                    password: userPass,
                    remember_me: rememberMe
                }
                console.log(data);
                setErrorText("");

                toast.promise(api.post('/login', {
                    username: username,
                    password: userPass,
                    remember_me: rememberMe,
                    fingerprint: fingerprint
                })
                    .then(function (response) {
                        console.log(response.data);
                        saveCookieData("username", username, "10");
                        saveCookieData("nameOfUser", response.data.user.name, "10");
                        saveCookieData("lastSeen", response.data.lastSeen, "10");
                        saveCookieData("rememberMe", rememberMe, "10")
                    })
                    .catch(function (error) {
                        console.log(error);
                        setErrorText(error.response.data.message);
                        throw new Error("Additional condition not met");
                    }),
                    {
                        pending: "Logging in!",
                        success: "Logged in successfully!",
                        error: errorText
                    }
                ).then(() => {
                    window.location.href = "/dashboard"
                })
            }
        } else {
            setErrorText("Fix errors to proceed!");
        }
    }

    return (
        <>
            <ToastContainer />
            <div className="h-screen flex items-center justify-center">
                <div className="md:grid md:grid-cols-2 items-center p-4">
                    <div>
                        <img
                            src={login_bg}
                            className="lg:rounded-l-lg md:h-screen md:py-8 md:object-cover md:pr-4 h-15 mb-2"
                            alt="interior design"/>
                    </div>
                    <div>
                        <h3 className="text-center text-2xl font-bold">Welcome</h3>
                        <form className="flex flex-col gap-4 px-4">
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
                                    onChange = {() => {
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
                            <div className="flex items-center gap-2">
                                <Checkbox
                                    id="remember"
                                    ref={rememberUserElementRef}
                                    onChange={() => setRememberMe(rememberUserElementRef.current.checked)}
                                />
                                <Label htmlFor="remember">
                                    Remember me
                                </Label>
                            </div>
                            <div className="flex-col items-center">
                                <label
                                    className={`text-red-500 text-sm ${errorText !== "" ? "" : "hidden"} text-center`}>
                                    {errorText}
                                </label>
                            </div>
                            <Button
                                type="button"
                                onClick={() => handleLoginClick()}>
                                Login
                            </Button>
                            <p className="text-sm text-right">
                                New here?
                            <Link to="/signup" className="text-[#0e7490] font-bold ml-1 mr-2 underline" >Sign up here</Link>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default LoginPage