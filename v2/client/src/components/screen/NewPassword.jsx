import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { NewPasswordData } from '../../js/networkReq'

const NewPassword = () => {
    const nav = useNavigate()
    
    const [password, setPassword] = useState("")
    const { token } = useParams()

    const goToSignin = () => {
        nav("/login")
    }

    const submitNewPassword = (e) => {
        e.preventDefault()
        NewPasswordData(password, token, goToSignin)
    }

    return (
        <form className="login-form">
            <div className="login-box">
                <div className="row collapse">
                    <div className="small-12 medium-6 column small-order-2 medium-order-1">
                        <div className="login-box-form-section">
                            <h1 className="login-box-title">Enter New Password</h1>
                            <h5 className="login-box-subtitle">Password</h5>
                            <input className="login-box-input" type="password" name="password" placeholder="Password" maxLength={30} onChange={(e)=>setPassword(e.target.value)}/>
                            <button className="login-box-submit-button" type="submit" name="reset_submit" onClick={(e)=>submitNewPassword(e)}>Reset Account</button>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    )
}

export default NewPassword