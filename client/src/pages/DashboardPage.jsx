'use client';
import {useEffect, useRef, useState} from 'react'
import login_bg from '../assets/images/login_bg.jpg';
import user from '../assets/images/user.png';
import {Button, Card, Checkbox, Label, TextInput} from 'flowbite-react';
import {useVisitorData} from '@fingerprintjs/fingerprintjs-pro-react'
import axios from "axios";
import {Link, useNavigate} from "react-router-dom";
import {ToastContainer, toast} from 'react-toastify';
import {deleteCookieData, retrieveCookieData} from "../utils/CookieManager.js";

const DashboardPage = () => {
    const {isLoading, error, data, getData} = useVisitorData(
        {extendedResult: true},
        {immediate: true}
    )

    const [username, setUserName] = useState("");
    const [name, setName] = useState("");
    const [lastSeen, setLastSeen] = useState("");
    const [rememberMe, setRememberMe] = useState("");

    useEffect(() => {
        document.title = "Dashboard";
        setUserName(retrieveCookieData("username"))
        if(username !== "" || username !== undefined){
            api.post("/authenticate", {
                username: username
            }).then(response => {
                console.log(response)
                setLastSeen(retrieveCookieData("lastSeen"))
                setName(retrieveCookieData("nameOfUser"))
            }).catch(error =>  {
                // window.location.href = "/"
                if(!rememberMe){
                    setLastSeen(retrieveCookieData("lastSeen"))
                    setName(retrieveCookieData("nameOfUser"))
                } else {
                    window.location.href = "/"
                }
            })
        }
    }, [])

    const [errorText, setErrorText] = useState("");

    const api = axios.create({
        baseURL: 'https://bb88-102-176-65-196.ngrok-free.app',
        // baseURL: 'http://localhost:3000',
    })

    const handleLogOutClick = () => {

        getData({ignoreCache: true})

        if (error) {
            setErrorText(error.message);
        } else {
            console.log("logging out: ")
            setErrorText("");

            toast.promise(api.post('/logout',
                    {
                        username: username,
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
                    pending: "Logging out!",
                    success: "Logged Out Successfully!",
                    error: errorText
                }
            ).then( () => {
                deleteCookieData("username");
                deleteCookieData("nameOfUser")
                deleteCookieData("lastSeen")
                window.location.href = "/"
            })
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
                        <h3 className="text-center text-2xl font-bold">You are logged in as</h3>
                        <form className="flex flex-col gap-4 mt-4 items-center px-4">
                            <div className="">
                                <img src={user} className="h-[100px] " alt="user icon"/>
                            </div>
                            <p className="text-xl font-bold">
                                {name}
                            </p>
                            <p className="text-lg">
                                Username: {username}
                            </p>
                            <p className="text-lg">
                                Last Seen: {lastSeen}
                            </p>
                            <Button
                                type="button"
                                onClick={() => handleLogOutClick()}>
                                Log out
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default DashboardPage;