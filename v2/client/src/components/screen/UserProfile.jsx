import React, { useEffect, useState } from 'react'
import { NotOwnPostsData, FollowUserData, UnfollowUserData } from '../../js/networkReq.js'
import { useParams } from 'react-router-dom'
import { useGlobalContext } from '../../context.jsx'

const UserProfile = () => {
    const [userInfo, setUserInfo] = useState(null)

    const { state, dispatch } = useGlobalContext()
    const { userName } = useParams()

    const [userIsFollowing, setUserIsFollowing] = useState(state?state.following.includes(userName):false)

    const fetchUserPosts = async () => {
        try {
            const result = await NotOwnPostsData(userName)
            if (result) {
                setUserInfo(result)
            }
            else {
                setUserInfo(null)
            }
        }
        catch (err) {
            console.log(err)
        }
    }
    
    const followUser = async (followingId, name) => {
        try {
            const result = await FollowUserData(followingId, name)
            if (result) {
                dispatch({type:"UPDATE",payload:{following:result.user.following, followers:result.user.followers}})
                localStorage.setItem("user", JSON.stringify(result.user))
                setUserInfo((prevState)=>{
                    return{
                        ...prevState,
                        user:{
                            ...prevState.user,
                            followers:[...prevState.user.followers, result.user.name]
                        }
                    }
                })
                setUserIsFollowing(true)
            }
        }
        catch (err) {
            console.log(err)
        }
    }

    const unfollowUser = async (unfollowingId, name) => {
        try {
            const result = await UnfollowUserData(unfollowingId, name)
            if (result) {
                dispatch({type:"UPDATE",payload:{following:result.user.following, followers:result.user.followers}})
                localStorage.setItem("user", JSON.stringify(result.user))
                setUserInfo((prevState)=>{
                    const newfollower = prevState.user.followers.filter(item=>item !== result.user.name)
                    return{
                        ...prevState,
                        user:{
                            ...prevState.user,
                            followers:newfollower
                        }
                    }    
                })
                setUserIsFollowing(false)
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
        <>
        { userInfo ? 
            <div className="profile">
                <div className="profile-section">
                    <div className="small-12 medium-6 profile-content">
                        <div className="profile-content-avatar">
                            <img className="avatar-image" src={userInfo.user.profilePic} alt={userInfo.user.name} />
                        </div>
                        <div className="profile-content-user">
                            <p className="user-name">{userInfo.user.name}</p>
                            <div className="user-details grid-x">
                                <div className="cell shrink">{userInfo.posts.length === 1 ? "1 post" : userInfo.user.posts.length + " posts"}</div>
                                <div className="cell shrink">{userInfo.user.followers.length === 1 ? "1 follower" : userInfo.user.followers.length + " followers"}</div>
                                <div className="cell shrink">{userInfo.user.following.length + " following"}</div>
                            </div>
                            {userInfo.user.bio &&
                                <div className="user-details"><p className="user-bio">{userInfo.user.bio}</p></div>
                            }
                            <div className="user-actions grid-x">
                            {userIsFollowing ? (
                                <div className="cell shrink">
                                    <button onClick={() => unfollowUser(userInfo.user._id, userInfo.user.name)}>
                                        Unfollow
                                    </button>
                                </div>
                                ) : (
                                <div className="cell shrink">
                                    <button onClick={() => followUser(userInfo.user._id, userInfo.user.name)}>
                                        Follow
                                    </button>
                                </div>
                                )
                            }
                            </div>
                        </div>    
                    </div>
                </div>
                <div className="profile-gallery">
                    <div className="grid-x">
                        {
                            userInfo.posts.map((pos) => {
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
        : <h5>Loading...</h5>
        }
        </>
    )
}

export default UserProfile