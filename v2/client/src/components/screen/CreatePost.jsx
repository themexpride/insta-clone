import React, { useState } from 'react'
import { useNavigate } from 'react-router'
import { ImageData } from '../../js/networkReq'

const CreatePost = () => {

    const [title, setTitle] = useState("")
    const [body, setBody] = useState("")
    const [image, setImage] = useState("")

    const nav = useNavigate()

    const newPostSuccess = () => {
        nav('/')
    }

    const post_picture = (e) => {
        e.preventDefault()
        ImageData(title, body, image, newPostSuccess)
    }
    
    return (
        <form className="create-post-form">
            <div className="create-post-box">
                <div className="row collapse">
                    <div className="small-12 medium-6 column small-order-2 medium-order-1">
                        <div className="create-post-form-main-section">
                            <h1 className="create-post-form-title">Create Post</h1>
                            <h5 className="create-post-form-subtitle">Title</h5>
                            <input className="create-post-form-main-input" type="text" name="title" placeholder="Title" maxLength={30} onChange={(e)=>setTitle(e.target.value)}/>
                            <h5 className="login-box-subtitle">Body</h5>
                            <input className="create-post-form-main-input" type="text" name="body" placeholder="Body" maxLength={120} onChange={(e)=>setBody(e.target.value)}/>
                            <h5 className="login-box-subtitle">File</h5>
                            <div className="create-post-form-file-path">
                                <label className="button create-post-form-button">Upload File <input type="file" accept="image/*" id="exampleFileUpload" className="show-for-sr" onChange={(e)=>setImage(e.target.files[0])}/></label>
                                <label className="file-path validate" type="text">{image.name}</label>
                            </div>
                            <input className="create-post-form-main-submit-button" type="submit" name="post_submit" value="Submit Post" onClick={(e)=>post_picture(e)}/>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    )
}

export default CreatePost