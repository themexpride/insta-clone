import React, { useState, useEffect } from 'react'
import CommentsModal from '../abstracts/CommentsModal.jsx'
import { useGlobalContext } from '../../context.jsx'
import { FeedPostsData, LikePostData, UnlikePostData, DeletePostData, FollowingPostData } from '../../js/networkReq.js'
import { Link } from 'react-router-dom'

const Home = () => {
    const { showModal, selectComments, state } = useGlobalContext()

    const [data, setData] = useState([])
    const [currentPost, setCurrentPost] = useState("")

    const [feed, setFeed] = useState("global")

    const fetchPosts = () => {
        FeedPostsData().then((data) => {
            if (data) {
                setData(data.posts)
            }
        })
        .catch((err) => {
            console.log(err)
        })
    }

    const changeFeed = async (feed) => {
        try {
            if (feed === "global") {
                const result = await FeedPostsData()
                if (result) {
                    setData(result.posts)
                    setFeed("global")
                }
            }
            else if (feed === "following") {
                const result = await FollowingPostData()
                if (result) {
                    setData(result)
                    setFeed("following")
                }
            }
        }
        catch (err) {
            console.log(err)
        }
    }

    const likePost = async (postId) => {
        try {
            const result = await LikePostData(postId)
            if (result) {
                const newData = data.map((post) => {
                    if (post._id === result._id) {
                        return result
                    }
                    else {
                        return post
                    }
                })
                setData(newData)
            }
        }
        catch (err) {
            console.log(err)
        }
    }

    const dislikePost = async (postId) => {
        try {
            const result = await UnlikePostData(postId)
            if (result) {
                const newData = data.map((post) => {
                    if (post._id === result._id) {
                        return result
                    }
                    else {
                        return post
                    }
                })
                setData(newData)
            }
        }
        catch (err) {
            console.log(err)
        }
    }

    const deletePost = async (postId) => {
        try {
            const result = await DeletePostData(postId)
            if (result) {
                const newData = data.filter((post) => {
                  return post._id !==  result._id
                })
                setData(newData)
            }
        }
        catch (err) {
            console.log(err)
        }
    }

    const openCommentsModal = (id) => {
        setCurrentPost(id)
        selectComments()
    }

    const updateHomeComments = (updatePost) => {
        const newData = data.map((post) => {
            if (post._id === updatePost._id) {
                return updatePost
            }
            else {
                return post
            }
        })
        setData(newData)
    }

    useEffect(() => {
        if (state) {
            fetchPosts()
        }
    }, [state])

    return (
        <main>
            { data ? 
                <div data-sticky-container>
                    <div className="responsive-nav-social" id="responsive-nav-social" data-sticky data-options="marginTop:0;">
                        <div className="row align-justify align-middle" id="responsive-menu">
                            <div className="responsive-nav-social-left">
                                <ul className="menu vertical medium-horizontal align-center">
                                    <li className={feed === "global" ? "responsive-nav-social-active":""} onClick={() => changeFeed("global")}><button type="button">Global</button></li>
                                    <li className={feed === "following" ? "responsive-nav-social-active":""} onClick={() => changeFeed("following")}><button type="button">Following</button></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                : <h5>Loading...</h5>
            }
            { data ?
                data.map((pos) => {
                    const { _id:id, postedBy, photo, title, body, likes, dislikes, comments } = pos
                    const { name:author, _id:authorId, profilePic } = postedBy
                    return (
                        <div className="card post-card-action-icons" key={"post-" + id}>
                            <div className="card-section">
                                <div className="post-card-header">
                                    <div className="post-card-avatar">
                                        <img className="avatar-image" src={profilePic} alt={author} />
                                    </div>
                                    <div className="post-card-author">
                                        <h5 className="author-title"><Link to={state.name === author ? "/profile" : "/u/" + author}>{author}</Link></h5>
                                    </div>
                                    { authorId === state._id &&
                                        <div className="post-card-icon" onClick={() => deletePost(id)}>
                                            <i className="fa-solid fa-trash"></i>
                                        </div>
                                    }
                                </div>
                                <div className="post-card-main">
                                    <div className="row main-img">
                                        <div className="small-12 columns">
                                            <img src={photo} alt="img" />
                                        </div>
                                    </div>
                                    <div className="row main-title">
                                        <div className="small-12 columns">
                                            <p>{title}</p>
                                        </div>
                                    </div>
                                    <div className="row main-body">
                                        <div className="small-12 columns">
                                            <p>{body}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="post-card-action">
                                    <div className="action-area" onClick={() => likePost(id)}>
                                        <button className="action-anchor has-tip bottom" data-tooltip  data-disable-hover="false" tabIndex="2" title="Like the post">
                                            <i className="fa fa-thumbs-up" aria-hidden="true"></i>
                                            <span className="show-for-sr">Like the Post</span>
                                        </button>
                                        <span className="action-data">{likes.length}</span>
                                    </div>
                                    <div className="action-area" onClick={() => openCommentsModal(id)}>
                                        <button className="action-anchor has-tip bottom" data-tooltip  data-disable-hover="false" tabIndex="2" title="Open comments section">
                                            <i className="fa fa-comment" aria-hidden="true"></i>
                                            <span className="show-for-sr">Comment on the Post</span>
                                        </button>
                                        <span className="action-data">{comments.length}</span>
                                    </div>
                                    <div className="action-area" onClick={() => dislikePost(id)}>
                                        <button href="#" className="action-anchor has-tip bottom" data-tooltip  data-disable-hover="false" tabIndex="2" title="Dislike the post">
                                            <i className="fa fa-thumbs-down" aria-hidden="true"></i>
                                            <span className="show-for-sr">Dislike the Post</span>
                                        </button>
                                        <span className="action-data">{dislikes.length}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })
                : <h5>Loading...</h5>
            }
            {showModal && <CommentsModal postId={currentPost} updateHomeComments={updateHomeComments}/>} 
        </main>
    )
}

export default Home