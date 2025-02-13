import React, { useState } from 'react'
import axios from 'axios';
import { useNavigate } from "react-router-dom"

const RegisterAdmin = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confPassword, setConfPassword] = useState("");
    const [msg, setMsg] = useState("");

    const Register = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/register/admin', {
                email,
                password,
                confPassword
            })
            navigate("/");
        } catch (error) {
            if (error.response.data) {
                setMsg(error.response.data.msg)
            }
        }
    }

    return (
        <section className="hero is-fullheight is-fullwidth">
            <div className="hero-body">
                <div className="container">
                    <div className="columns is-centered">
                        <div className="columns is-4-desktop">
                            <form onSubmit={Register} className="box">
                                <p className="has-text-centered is-size-4 has-text-weight-bold">ADMIN SIGN UP</p>
                                {msg && (
                                    <p className="has-text-centered">{msg}</p>
                                )}
                                <div className="field mt-5">
                                    <label className="label">Email</label>
                                    <div className="controls">
                                        <input type="text" className="input" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} />
                                    </div>
                                </div>
                                <div className="field mt-5">
                                    <label className="label">Password</label>
                                    <div className="controls">
                                        <input type="password" className="input" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                                    </div>
                                </div>
                                <div className="field mt-5">
                                    <label className="label">Confirm Password</label>
                                    <div className="controls">
                                        <input type="password" className="input" placeholder="Confirm Password" value={confPassword} onChange={(e) => setConfPassword(e.target.value)} />
                                    </div>
                                </div>
                                <div className="field mt-5">
                                    <button type='submit' className="button is-success is-fullwidth">Sign Up</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default RegisterAdmin;
