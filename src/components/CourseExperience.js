import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

const AddCourse = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [userId, setUserId] = useState("");
    const [name, setName] = useState("");
    const [isCertificate, setIsCertificate] = useState("YES");
    const [year, setYear] = useState("");
    const [expire, setExpire] = useState("");
    const [msg, setMsg] = useState("");
    const [token, setToken] = useState("");
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        refreshToken();
        getCourses();
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

    const addCourseData = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`http://localhost:5000/entry-data/course/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                name: name,
                isCertificate: isCertificate,
                year: year
            })
            getCourses();
        } catch (error) {
            if (error.response.data) {
                setMsg(error.response.data.msg)
            }
        }
    }

    const getCourses = async () => {
        const data = await axiosJWT.get(`http://localhost:5000/profile/course/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        setCourses(data.data);
    }

    const deleteCourses = async (id) => {
        try {
            await axiosJWT.delete(`http://localhost:5000/profile/course/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            getCourses();
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="container">
            <p className="has-text-centered is-size-4 has-text-weight-bold mt-5">COURSE EXPERIENCE</p>
            <table className="table is-stripped is-fullwidth mt-5">
                <thead>
                    <tr>
                        <th>NO</th>
                        <th>NAME</th>
                        <th>CERTIFICATE</th>
                        <th>YEAR</th>
                        <th>ACTIONS</th>
                    </tr>
                </thead>
                <tbody>
                    {courses?.map((data, index) => (
                        <tr key={data.id}>
                            <td>{index + 1}</td>
                            <td>{data?.name}</td>
                            <td>{data?.isCertificate}</td>
                            <td>{data?.year}</td>
                            <td>
                                <button className='button is-small is-danger'
                                    onClick={() => deleteCourses(data.id)}
                                >Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <form onSubmit={addCourseData} className="box">
                {msg && (
                    <p className="has-text-centered">{msg}</p>
                )}
                <div className="fixed-grid has-2-cols has-text-white">
                    <div className="grid">
                        <div className="field mt-5">
                            <label className="label">Name</label>
                            <div className="controls">
                                <input type="text" className="input" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
                            </div>
                        </div>
                        <div className="field mt-5">
                            <label className="label">Certificate</label>
                            <div className="control">
                                <div className="select is-fullwidth">
                                    <select value={isCertificate} onChange={(e) => setIsCertificate(e.target.value)}>
                                        <option value="YES">YES</option>
                                        <option value="NO">NO</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="field">
                            <label className="label">Year</label>
                            <div className="controls">
                                <input type="text" className="input" placeholder="Year" value={year} onChange={(e) => setYear(e.target.value)} />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="field mt-5">
                    <button type='submit' className="button is-success is-fullwidth">Tambah</button>
                </div>
                <Link to={`/home`} className="button is-link mt-5 is-fullwidth">Simpan</Link>
            </form>
        </div>
    )
}

export default AddCourse;