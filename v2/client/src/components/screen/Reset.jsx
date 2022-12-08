import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ResetAccountData } from '../../js/networkReq'

const Reset = () => {
    const nav = useNavigate()
    
    const [email, setEmail] = useState("")

    const goToSignin = () => {
        nav("/login")
    }

    const resetAccount = (e) => {
        e.preventDefault()
        ResetAccountData(email, goToSignin)
    }

    return (
        <form className="login-form">
            <div className="login-box">
                <div className="row collapse">
                    <div className="small-12 medium-6 column small-order-2 medium-order-1">
                        <div className="login-box-form-section">
                            <h1 className="login-box-title">Reset Account</h1>
                            <h5 className="login-box-subtitle">Email</h5>
                            <input className="login-box-input" type="email" name="email" placeholder="E-mail" maxLength={45} onChange={(e)=>setEmail(e.target.value)}/>
                            <button className="login-box-submit-button" type="submit" name="reset_submit" onClick={(e)=>resetAccount(e)}>Reset Account</button>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    )
}

export default Reset