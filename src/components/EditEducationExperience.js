import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

const EditEducation = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [userId, setUserId] = useState("");
    const [eduLevel, setEduLevel] = useState("SMA/SMK");
    const [name, setName] = useState("");
    const [major, setMajor] = useState("");
    const [graduationYear, setGraduationYear] = useState("");
    const [ipk, setIpk] = useState("");
    const [expire, setExpire] = useState("");
    const [msg, setMsg] = useState("");
    const [token, setToken] = useState("");
    const [educations, setEducations] = useState([]);

    useEffect(() => {
        refreshToken();
        getEducations();
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

    const addEducationData = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`http://localhost:5000/entry-data/education/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                eduLevel: eduLevel,
                name: name,
                major: major,
                graduationYear: graduationYear,
                ipk: ipk
            })
            getEducations();
        } catch (error) {
            if (error.response.data) {
                setMsg(error.response.data.msg)
            }
        }
    }

    const getEducations = async () => {
        const data = await axiosJWT.get(`http://localhost:5000/profile/education/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        setEducations(data.data);
    }

    const deleteEducations = async (id) => {
        try {
            await axiosJWT.delete(`http://localhost:5000/profile/education/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            getEducations();
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="container">
            <p className="has-text-centered is-size-4 has-text-weight-bold mt-5">EDIT EDUCATION EXPERIENCE</p>
            <table className="table is-stripped is-fullwidth mt-5">
                <thead>
                    <tr>
                        <th>NO</th>
                        <th>LEVEL</th>
                        <th>NAME</th>
                        <th>MAJOR</th>
                        <th>GRADUATION YEAR</th>
                        <th>IPK</th>
                        <th>ACTIONS</th>
                    </tr>
                </thead>
                <tbody>
                    {educations?.map((data, index) => (
                        <tr key={data.id}>
                            <td>{index + 1}</td>
                            <td>{data?.eduLevel}</td>
                            <td>{data?.name}</td>
                            <td>{data?.major}</td>
                            <td>{data?.graduationYear}</td>
                            <td>{data?.ipk}</td>
                            <td>
                                <button className='button is-small is-danger'
                                    onClick={() => deleteEducations(data.id)}
                                >Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <form onSubmit={addEducationData} className="box">
                {msg && (
                    <p className="has-text-centered">{msg}</p>
                )}
                <div className="fixed-grid has-2-cols has-text-white">
                    <div className="grid">
                        <div className="field mt-5">
                            <label className="label">Level</label>
                            <div className="control">
                                <div className="select is-fullwidth">
                                    <select value={eduLevel} onChange={(e) => setEduLevel(e.target.value)}>
                                        <option value="SMA/SMK">SMA/SMK</option>
                                        <option value="D1">D1</option>
                                        <option value="D2">D2</option>
                                        <option value="D3">D3</option>
                                        <option value="D4">D4</option>
                                        <option value="S1">S1</option>
                                        <option value="S2">S2</option>
                                        <option value="S3">S3</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="field mt-5">
                            <label className="label">Name</label>
                            <div className="controls">
                                <input type="text" className="input" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
                            </div>
                        </div>
                        <div className="field">
                            <label className="label">Major</label>
                            <div className="controls">
                                <input type="text" className="input" placeholder="Major" value={major} onChange={(e) => setMajor(e.target.value)} />
                            </div>
                        </div>
                        <div className="field">
                            <label className="label">Graduation Year</label>
                            <div className="controls">
                                <input type="text" className="input" placeholder="Graduation Year" value={graduationYear} onChange={(e) => setGraduationYear(e.target.value)} />
                            </div>
                        </div>
                        <div className="field">
                            <label className="label">IPK</label>
                            <div className="controls">
                                <input type="number" className="input" placeholder="IPK" value={ipk} onChange={(e) => setIpk(e.target.value)} />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="field mt-5">
                    <button type='submit' className="button is-success is-fullwidth">Tambah</button>
                </div>
                <Link to={`/dashboard/user/edit/course/${id}`} className="button is-link mt-5 is-fullwidth">Selanjutnya</Link>
            </form>
        </div>
    )
}

export default EditEducation;