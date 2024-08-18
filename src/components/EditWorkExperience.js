import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

const EditWork = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [userId, setUserId] = useState("");
    const [company, setCompany] = useState("");
    const [position, setPosition] = useState("");
    const [salary, setSalary] = useState("");
    const [yearIn, setYearIn] = useState("");
    const [yearOut, setYearOut] = useState("");
    const [expire, setExpire] = useState("");
    const [msg, setMsg] = useState("");
    const [token, setToken] = useState("");
    const [works, setWorks] = useState([]);

    useEffect(() => {
        refreshToken();
        getWorks();
    }, []);



    const refreshToken = async () => {
        try {
            const response = await axios.get('http://localhost:5000/token');
            setToken(response.data.accessToken);
            const decoded = jwtDecode(response.data.accessToken);
            setUserId(decoded.userId)
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
            setExpire(decoded.exp)
        }
        return config;
    }, (error) => {
        return Promise.reject(error);
    })

    const addWorkData = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`http://localhost:5000/entry-data/work/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                company: company,
                position: position,
                salary: salary,
                yearIn: yearIn,
                yearOut: yearOut,
            })
            getWorks();
        } catch (error) {
            if (error.response.data) {
                setMsg(error.response.data.msg)
            }
        }
    }

    const getWorks = async () => {
        const data = await axiosJWT.get(`http://localhost:5000/profile/work/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        setWorks(data.data);
    }

    const deleteWorks = async (id) => {
        try {
            await axiosJWT.delete(`http://localhost:5000/profile/work/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            getWorks();
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="container">
            <p className="has-text-centered is-size-4 has-text-weight-bold mt-5">EDIT WORK EXPERIENCE</p>
            <table className="table is-stripped is-fullwidth mt-5">
                <thead>
                    <tr>
                        <th>NO</th>
                        <th>COMPANY NAME</th>
                        <th>POSITION</th>
                        <th>SALARY</th>
                        <th>YEAR</th>
                        <th>ACTIONS</th>
                    </tr>
                </thead>
                <tbody>
                    {works?.map((data, index) => (
                        <tr key={data.id}>
                            <td>{index + 1}</td>
                            <td>{data?.company}</td>
                            <td>{data?.position}</td>
                            <td>{"Rp " + data?.salary}</td>
                            <td>{data?.yearIn + " - " + data?.yearOut}</td>
                            <td>
                                <button className='button is-small is-danger'
                                    onClick={() => deleteWorks(data.id)}
                                >Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <form onSubmit={addWorkData} className="box">
                {msg && (
                    <p className="has-text-centered">{msg}</p>
                )}
                <div className="fixed-grid has-2-cols has-text-white">
                    <div className="grid">
                        <div className="field mt-5">
                            <label className="label">Company Name</label>
                            <div className="controls">
                                <input type="text" className="input" placeholder="Company Name" value={company} onChange={(e) => setCompany(e.target.value)} />
                            </div>
                        </div>
                        <div className="field mt-5">
                            <label className="label">Position</label>
                            <div className="controls">
                                <input type="text" className="input" placeholder="Position" value={position} onChange={(e) => setPosition(e.target.value)} />
                            </div>
                        </div>
                        <div className="field">
                            <label className="label">Salary</label>
                            <div className="controls">
                                <input type="text" className="input" placeholder="contoh : 10000000" value={salary} onChange={(e) => setSalary(e.target.value)} />
                            </div>
                        </div>
                        <div className="field">
                            <label className="label">Year In</label>
                            <div className="controls">
                                <input type="text" className="input" placeholder="Year In" value={yearIn} onChange={(e) => setYearIn(e.target.value)} />
                            </div>
                        </div>
                        <div className="field">
                            <label className="label">Year Out</label>
                            <div className="controls">
                                <input type="text" className="input" placeholder="Year Out" value={yearOut} onChange={(e) => setYearOut(e.target.value)} />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="field mt-5">
                    <button type='submit' className="button is-success is-fullwidth">Tambah</button>
                </div>
                <Link to={`/dashboard/user/edit/education/${id}`} className="button is-link mt-5 is-fullwidth">Selanjutnya</Link>
            </form>
        </div>
    )
}

export default EditWork;