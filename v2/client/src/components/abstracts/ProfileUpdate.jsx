import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGlobalContext } from '../../context.jsx'
import { UpdateProfileData } from '../../js/networkReq.js'

const ProfileUpdate = () => {
    const { state, dispatch } = useGlobalContext()
    const nav = useNavigate()

    const [bio, setBio] = useState(state ? state.bio ? state.bio: "" : "")
    const [picture, setPicture] = useState(state?state.profilePic:null)
    const [pictureName, setPictureName] = useState(state ? state.profilePic ? state.profilePic : "" :"")

    const updatePic = (e) => {
        setPicture(e.target.files[0])
        setPictureName(e.target.files[0].name)
    }

    const updateBio = (e) => {
        setBio(e.target.value)
    }

    const updateProfile = async (e) => {
        e.preventDefault()
        if (bio !== state.bio && pictureName !== state.profilePic) {
            await UpdateProfileData(bio, picture, updateProfileHelper, changeProfileData)
        }
        else if ((bio === state.bio) && (pictureName !== state.profilePic)) {
            await UpdateProfileData(null, picture, updateProfileHelper, changeProfileData)        }
        else if((bio !== state.bio) && (pictureName === "" || picture === state.profilePic)) {
            await UpdateProfileData(bio, null, updateProfileHelper, changeProfileData)
        }
    }

    const updateProfileHelper = (user, changeProfileData) => {
        if (user.profilePic && user.bio) {
            changeProfileData(user.bio, user.profilePic)
        }
        else if (user.profilePic && !user.bio) {
            changeProfileData(state.bio, user.profilePic)
        }
        else if (!user.profilePic && user.bio) {
            changeProfileData(user.bio, state.profilePic)
        }
    }

    const changeProfileData = (bio, profilePic) => {
        localStorage.setItem("user", JSON.stringify({...state,bio,profilePic}))
        dispatch({type:"UPDATEPROFILE", payload:{bio,profilePic}})
        nav("/profile")
    }

    return (
        <>{ state ? 
            <form className="login-form">
                <div className="login-box">
                    <div className="row collapse">
                        <div className="small-12 medium-6 column small-order-2 medium-order-1">
                            <div className="login-box-form-section">
                                <h1 className="login-box-title">Update Profile</h1>
                                <h5 className="login-box-subtitle">Bio</h5>
                                <input className="login-box-input" type="text" value={bio} name="bio" placeholder="Bio" maxLength={60} onChange={updateBio} />
                                <h5 className="login-box-subtitle">Upload Profile Picture</h5>
                                <div className="create-post-form-file-path">
                                    <label className="button create-post-form-button">Upload File <input type="file" value={""} accept="image/*" id="exampleFileUpload" className="show-for-sr" onChange={updatePic}/></label>
                                    <label className="file-path validate" type="text">{pictureName}</label>
                                </div>
                                <button className="login-box-submit-button" type="submit" name="update_profile" onClick={(e)=>updateProfile(e)}>Update Profile</button>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
            : <h5>Loading...</h5>
        }
        </>
    )

}

export default ProfileUpdate