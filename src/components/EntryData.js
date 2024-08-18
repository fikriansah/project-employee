import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const EntryData = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [userId, setUserId] = useState("");
    const [name, setName] = useState("");
    const [position, setPosition] = useState("");
    const [address, setAddress] = useState("");
    const [noKtp, setNoKtp] = useState("");
    const [birthPlace, setBirthPlace] = useState("");
    const [birthday, setBirthday] = useState("");
    const [gender, setGender] = useState("LAKI_LAKI");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [cityOut, setCityOut] = useState("YES");
    const [salary, setSalary] = useState("");
    const [expire, setExpire] = useState("");
    const [msg, setMsg] = useState("");
    const [token, setToken] = useState("");

    useEffect(() => {
        refreshToken();
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

    const updateData = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`http://localhost:5000/entry-data/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                name: name,
                position: position,
                address: address,
                noKtp: noKtp,
                birthPlace: birthPlace,
                birthday: birthday,
                gender: gender,
                phoneNumber: phoneNumber,
                cityOut: cityOut,
                salary: salary
            })
            navigate(`/entry-data/work/${response.data.result.id}`);
        } catch (error) {
            if (error.response.data) {
                setMsg(error.response.data.msg)
            }
        }
    }

    return (
        <div className="container">
            <form onSubmit={updateData} className="box">
                <p className="has-text-centered is-size-4 has-text-weight-bold">ENTRY DATA {id}</p>
                {msg && (
                    <p className="has-text-centered">{msg}</p>
                )}
                <div className="field mt-5">
                    <label className="label">Name</label>
                    <div className="controls">
                        <input type="text" className="input" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                </div>
                <div className="field mt-5">
                    <label className="label">Position</label>
                    <div className="controls">
                        <input type="text" className="input" placeholder="Position" value={position} onChange={(e) => setPosition(e.target.value)} />
                    </div>
                </div>
                <div className="field mt-5">
                    <label className="label">Address</label>
                    <div className="controls">
                        <input type="text" className="input" placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} />
                    </div>
                </div>
                <div className="field mt-5">
                    <label className="label">No KTP</label>
                    <div className="controls">
                        <input type="text" className="input" placeholder="No KTP" value={noKtp} onChange={(e) => setNoKtp(e.target.value)} />
                    </div>
                </div>
                <div className="field mt-5">
                    <label className="label">Tempat Lahir</label>
                    <div className="controls">
                        <input type="text" className="input" placeholder="Tempat Lahir" value={birthPlace} onChange={(e) => setBirthPlace(e.target.value)} />
                    </div>
                </div>
                <div className="field mt-5">
                    <label className="label">Tanggal Lahir</label>
                    <div className="controls">
                        <input type="date" className="input" placeholder="Name" value={birthday} onChange={(e) => setBirthday(e.target.value)} />
                    </div>
                </div>
                <div className="field mt-5">
                    <label className="label">Gender</label>
                    <div className="control">
                        <div className="select is-fullwidth">
                            <select value={gender} onChange={(e) => setGender(e.target.value)}>
                                <option value="LAKI-LAKI">Laki-Laki</option>
                                <option value="PEREMPUAN">Perempuan</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div className="field mt-5">
                    <label className="label">NO HP</label>
                    <div className="controls">
                        <input type="text" className="input" placeholder="No Handphone" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
                    </div>
                </div>
                <div className="field mt-5">
                    <label className="label">Bersedia Penempatan di Luar Kota</label>
                    <div className="control">
                        <div className="select is-fullwidth">
                            <select value={cityOut} onChange={(e) => setCityOut(e.target.value)}>
                                <option value="YES">YES</option>
                                <option value="NO">NO</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div className="field mt-5">
                    <label className="label">Gaji yang diharapkan</label>
                    <div className="controls">
                        <input type="text" className="input" placeholder="contoh : 10000000" value={salary} onChange={(e) => setSalary(e.target.value)} />
                    </div>
                </div>
                <div className="field mt-5">
                    <button type='submit' className="button is-success is-fullwidth">Selanjutnya</button>
                </div>
            </form>
        </div>
    )
}

export default EntryData;