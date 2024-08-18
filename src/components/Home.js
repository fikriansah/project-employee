import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { jwtDecode } from "jwt-decode";
import { Link, useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();
    const [userId, setUserId] = useState("");
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("");
    const [token, setToken] = useState("");
    const [expire, setExpire] = useState("");
    const [users, setUsers] = useState([]);

    useEffect(() => {
        refreshToken();
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
            const detailUsers = await axiosJWT.get(`http://localhost:5000/users/${decoded.userId}`, {
                headers: {
                    Authorization: `Bearer ${response.data.accessToken}`
                }
            })
            setUsers(detailUsers.data);
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

    return (
        <div className="container mt-5">
            <h1 className="title">Hello, {email}</h1>
            {users.Profile === null ? (
                <div className="notification is-link has-text-centered">
                    Mohon maaf, data akun Anda belum lengkap. Silakan mengklik button "OK" di bawah untuk melengkapi data Anda. Terima Kasih.
                    <Link to={`/entry-data/${userId}`} className="button is-light mt-5 is-fullwidth">OK</Link>
                </div>
            ) : (
                <>
                    <div className="fixed-grid has-3-cols has-text-white">
                        <div className="grid">
                            <div className="cell has-text-weight-bold">NAMA</div>
                            <div className="cell is-col-span-2">{users?.Profile?.name}</div>
                            <div className="cell has-text-weight-bold">EMAIL</div>
                            <div className="cell is-col-span-2">{users?.email}</div>
                            <div className="cell has-text-weight-bold">NO TELEPON</div>
                            <div className="cell is-col-span-2">{users?.Profile?.phoneNumber}</div>
                            <div className="cell has-text-weight-bold">NO KTP</div>
                            <div className="cell is-col-span-2">{users?.Profile?.noKtp}</div>
                            <div className="cell has-text-weight-bold">JENIS KELAMIN</div>
                            <div className="cell is-col-span-2">{users?.Profile?.gender}</div>
                            <div className="cell has-text-weight-bold">TTL</div>
                            <div className="cell is-col-span-2">{users?.Profile?.birthPlace + ", " + users?.Profile?.birthday?.slice(0, 10)}</div>
                            <div className="cell has-text-weight-bold">POSISI YG DILAMAR</div>
                            <div className="cell is-col-span-2">{users?.Profile?.position}</div>
                            <div className="cell has-text-weight-bold">ALAMAT</div>
                            <div className="cell is-col-span-2">{users?.Profile?.address}</div>
                            <div className="cell has-text-weight-bold">BERSEDIA DI LUAR KOTA</div>
                            <div className="cell is-col-span-2">{users?.Profile?.cityOut}</div>
                            <div className="cell has-text-weight-bold">GAJI YANG DIHARAPKAN</div>
                            <div className="cell is-col-span-2">{"Rp " + users?.Profile?.salary}</div>
                        </div>
                    </div>
                    <p className="has-text-centered is-size-4 has-text-weight-bold mt-5">WORK EXPERIENCE</p>
                    <table className="table is-stripped is-fullwidth mt-5">
                        <thead>
                            <tr>
                                <th>NO</th>
                                <th>COMPANY</th>
                                <th>POSITION</th>
                                <th>SALARY</th>
                                <th>YEAR</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users?.Profile?.WorkExperiences?.map((data, index) => (
                                <tr key={data.id}>
                                    <td>{index + 1}</td>
                                    <td>{data?.company}</td>
                                    <td>{data?.position}</td>
                                    <td>{"Rp "+data?.salary}</td>
                                    <td>{data?.yearIn + " - " + data?.yearOut}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <p className="has-text-centered is-size-4 has-text-weight-bold mt-5">EDUCATION EXPERIENCE</p>
                    <table className="table is-stripped is-fullwidth mt-5">
                        <thead>
                            <tr>
                                <th>NO</th>
                                <th>LEVEL</th>
                                <th>NAME</th>
                                <th>MAJOR</th>
                                <th>GRADUATION YEAR</th>
                                <th>IPK</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users?.Profile?.EducationExperiences?.map((data, index) => (
                                <tr key={data.id}>
                                    <td>{index + 1}</td>
                                    <td>{data?.eduLevel}</td>
                                    <td>{data?.name}</td>
                                    <td>{data?.major}</td>
                                    <td>{data?.graduationYear}</td>
                                    <td>{data?.ipk}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <p className="has-text-centered is-size-4 has-text-weight-bold mt-5">COURSE EXPERIENCE</p>
                    <table className="table is-stripped is-fullwidth mt-5">
                        <thead>
                            <tr>
                                <th>NO</th>
                                <th>NAME</th>
                                <th>CERTIFICATE</th>
                                <th>YEAR</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users?.Profile?.CourseExperiences?.map((data, index) => (
                                <tr key={data.id}>
                                    <td>{index + 1}</td>
                                    <td>{data?.name}</td>
                                    <td>{data?.isCertificate}</td>
                                    <td>{data?.year}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            )}
        </div>
    )
}

export default Home;
