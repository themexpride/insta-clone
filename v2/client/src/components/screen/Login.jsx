import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { LoginData } from '../../js/networkReq.js'
import { useGlobalContext } from '../../context.jsx'


const Login = () => {
    const { dispatch } = useGlobalContext()
    const [password, setPassword] = useState("")
    const [email, setEmail] = useState("")

    const nav = useNavigate()
    const loginSuccess = () => {
        nav('/')
    }

    const sign_in = (e) => {
        e.preventDefault()
        LoginData(password, email, loginSuccess, dispatch)
    }

    return (
        <form className="login-form">
            <div className="login-box">
                <div className="row collapse">
                    <div className="small-12 medium-6 column small-order-2 medium-order-1">
                        <div className="login-box-form-section">
                            <h1 className="login-box-title">Login</h1>
                            <h5 className="login-box-subtitle">Email</h5>
                            <input className="login-box-input" type="text" name="email" placeholder="Email" maxLength={45} onChange={(e)=>setEmail(e.target.value)}/>
                            <h5 className="login-box-subtitle">Password</h5>
                            <input className="login-box-input" type="password" name="password" placeholder="Password" maxLength={30} onChange={(e)=>setPassword(e.target.value)}/>
                            <input className="login-box-submit-button" type="submit" name="login_submit" value="Log In" onClick={(e)=>sign_in(e)}/>
                            <h5 className="login-box-link"><Link to="/signup">Don't have an account?</Link></h5>
                            <h5 className="login-box-link"><Link to="/reset">Forgot password??</Link></h5>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    )
}

export default Login