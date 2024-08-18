import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { jwtDecode } from "jwt-decode";
import { Link, useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const navigate = useNavigate();
    const [userId, setUserId] = useState("");
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("");
    const [token, setToken] = useState("");
    const [expire, setExpire] = useState("");
    const [users, setUsers] = useState([]);

    useEffect(() => {
        refreshToken();
        getUsers();
    }, []);

    const refreshToken = async () => {
        try {
            const response = await axios.get('http://localhost:5000/token');
            setToken(response.data.accessToken);
            const decoded = jwtDecode(response.data.accessToken);
            setUserId(decoded.userId)
            setEmail(decoded.email)
            setRole(decoded.role)
            setExpire(decoded.exp)
        } catch (error) {
            if (error.response) {
                navigate("/");
            }
        }
    }

    const axiosJWT = axios.create();

    axiosJWT.interceptors.request.use(async (config) => {
        const currentDate = new Date();
        if (expire * 1000 < currentDate.getTime()) {
            const response = await axios.get('http://localhost:5000/token');
            config.headers.Authorization = `Bearer ${response.data.accessToken}`;
            setToken(response.data.accessToken);
            const decoded = jwtDecode(response.data.accessToken);
            setUserId(decoded.userId)
            setEmail(decoded.email)
            setRole(decoded.role)
            setExpire(decoded.exp)
        }
        return config;
    }, (error) => {
        return Promise.reject(error);
    })

    const getUsers = async () => {
        const response = await axiosJWT.get('http://localhost:5000/users', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        console.log(response.data);
        setUsers(response.data);
    }
    return (
        <div className="container mt-5">
            <h1 className="title">Welcome to Dashboard {email}</h1>
            <table className="table is-stripped is-fullwidth">
                <thead>
                    <tr>
                        <th>No</th>
                        <th>Nama</th>
                        <th>Email</th>
                        <th>TTL</th>
                        <th>Posisi Yg Dilamar</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user, index) => (
                        <tr key={user.id}>
                            <th>{index + 1}</th>
                            <th>{user?.Profile?.name}</th>
                            <th>{user?.email}</th>
                            <th>{!user?.Profile?.birthday
                                ? "-"
                                : user?.Profile?.birthPlace + ", " + user?.Profile?.birthday?.slice(0, 10)
                            }</th>
                            <th>{user?.Profile?.position}</th>
                            <td>
                                <Link to={`/dashboard/user/${user.id}`} className='button is-small is-info'>Detail</Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default Dashboard;
