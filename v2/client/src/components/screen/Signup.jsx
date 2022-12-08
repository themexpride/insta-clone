import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { SignupData } from '../../js/networkReq.js'

const Signup = () => {
    const [name, setName] = useState("")
    const [password, setPassword] = useState("")
    const [password2, setPassword2] = useState("")
    const [email, setEmail] = useState("")
    const [bio, setBio] = useState("")
    const [image, setImage] = useState("")

    const nav = useNavigate()
    const signupSuccess = () => {
        nav('/login')
    }

    const sign_up = (e) => {
        e.preventDefault()
        SignupData(name, password, password2, bio, email, image, signupSuccess)
    }

    return (
        <form className="login-form">
            <div className="login-box">
                <div className="row collapse">
                    <div className="small-12 medium-6 column small-order-2 medium-order-1">
                        <div className="login-box-form-section">
                            <h1 className="login-box-title">Signup</h1>
                            <h5 className="login-box-subtitle">Username</h5>
                            <input className="login-box-input" type="text" name="name" placeholder="Username" maxLength={25} onChange={(e)=>setName(e.target.value)}/>
                            <h5 className="login-box-subtitle">Email</h5>
                            <input className="login-box-input" type="email" name="email" placeholder="E-mail" maxLength={45} onChange={(e)=>setEmail(e.target.value)}/>
                            <h5 className="login-box-subtitle">Password</h5>
                            <input className="login-box-input" type="password" name="password" placeholder="Password" maxLength={30} onChange={(e)=>setPassword(e.target.value)}/>
                            <h5 className="login-box-subtitle">Retype Password</h5>
                            <input className="login-box-input" type="password" name="password2" placeholder="Password" maxLength={30} onChange={(e)=>setPassword2(e.target.value)}/>
                            <h5 className="login-box-subtitle">Bio</h5>
                            <input className="login-box-input" type="text" name="bio" placeholder="Bio" maxLength={60} onChange={(e)=>setBio(e.target.value)} />
                            <h5 className="login-box-subtitle">Upload Profile Picture</h5>
                            <div className="create-post-form-file-path">
                                <label className="button create-post-form-button">Upload File <input type="file" accept="image/*" id="exampleFileUpload" className="show-for-sr" onChange={(e)=>setImage(e.target.files[0])}/></label>
                                <label className="file-path validate" type="text">{image.name}</label>
                            </div>
                            <button className="login-box-submit-button" type="submit" name="signup_submit" onClick={(e)=>sign_up(e)}>Sign me up</button>
                            <h5 className="login-box-link"><Link to="/login">Already have an account?</Link></h5>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    )
}

export default Signup