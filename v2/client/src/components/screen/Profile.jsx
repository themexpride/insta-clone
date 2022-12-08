import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { OwnPostsData } from '../../js/networkReq.js'
import { useGlobalContext } from '../../context.jsx'

const Profile = () => {

    const { state, dispatch } = useGlobalContext()

    const nav = useNavigate()

    const [posts, setPosts] = useState([])

    const fetchUserPosts = async () => {
        try {
            const result = await OwnPostsData()
            if (result) {
                setPosts(result)
            }
            else {
                setPosts([])
            }
        }
        catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        fetchUserPosts()
    }, [])
    
    return (
        <div className="profile">
            <div className="profile-section">
                <div className="small-12 medium-6 profile-content">
                    <div className="profile-content-avatar">
                        <img className="avatar-image" src={state?state.profilePic:""} alt={state?state.name:"Pic"} />
                    </div>
                    <div className="profile-content-user">
                        { state ?
                        <><p className="user-name">{state.name}</p><div className="user-details grid-x">
                                <div className="cell shrink">{posts.length === 1 ? "1 post" : posts.length + " posts"}</div>
                                <div className="cell shrink">{state.followers.length === 1 ? "1 follower" : state.followers.length + " followers"}</div>
                                <div className="cell shrink">{state.following.length + " following"}</div>
                            </div>
                            { state.bio ?
                                <div className="user-details"><p className="user-bio">{state.bio}</p></div>
                                :<></>
                            }
                            <div className="user-actions grid-x">
                                <div className="cell shrink">
                                    <button type="button" onClick={() => nav("/profile/update")}>
                                        Update Profile
                                    </button>
                                </div>
                            </div>
                        </>
                        :<h5>Loading...</h5>
                        }
                    </div>    
                </div>
            </div>
            <div className="profile-gallery">
                <div className="grid-x">
                    {
                        posts.map((pos) => {
                            const { photo, _id:id } = pos
                            return (
                                <div className="small-12 medium-4 columns" key={"post-" + id}>
                                    <img src={photo} alt='img'/>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </div>
    )
}

export default Profile