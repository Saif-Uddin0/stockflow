import axios from 'axios';
import React, { useEffect } from 'react';
import useAuth from './useAuth';
import { useNavigate } from 'react-router-dom';

const axiosSecure = axios.create({
        baseURL: 'http://localhost:3000'

    })


const useAxiosSecure = () => {
    const {user ,signOutUser} = useAuth();
    const navigate = useNavigate()

    useEffect(()=>{
        // intercent request
       const reqInterceptor = axiosSecure.interceptors.request.use(config=>{
            config.headers.Authorization = `Bearer ${user?.accessToken}`
            return config
        })

        // interceptor response
        const resInterceptor = axiosSecure.interceptors.response.use((response) =>{
            return response;
        } , (error)=>{
            console.log(error);

            const statusCode = error.status;
            if(statusCode === 401 || statusCode === 403){
                signOutUser()
                .then(()=>{
                    navigate('/auth/signin')
                })
            }
            return Promise.reject(error)
        })




        return() =>{
            axiosSecure.interceptors.request.eject(reqInterceptor)
            axiosSecure.interceptors.request.eject(resInterceptor)
        }
    },[user ,signOutUser,navigate])
    return axiosSecure ;
};

export default useAxiosSecure;