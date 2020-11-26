import React,{useState,useEffect,useContext} from 'react'
import {UserContext} from '../../App'
import {Link} from 'react-router-dom'


const Home = ()=>{
    const [data,setData] = useState([])
    const {state, dispatch} = useContext(UserContext)

    useEffect(()=>{
        fetch('/allpost',{
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result=>{
            setData(result.posts)
        })
    },[])


    const likePost = (id)=>{
        fetch('/like',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                postId:id
            })
        }).then(res=>res.json())
        .then(result=>{
            const newData = data.map(item=>{
                if(item._id==result._id){
                    return result
                }
                else{
                    return item
                }
            })
            setData(newData)
        })
    }

    
    const unlikePost = (id)=>{
        fetch('/unlike',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                postId:id
            })
        }).then(res=>res.json())
        .then(result=>{
            const newData = data.map(item=>{
                if(item._id==result._id){
                    return result
                }
                else{
                    return item
                }
            })
            setData(newData)
        })
    }


    const makeComment = (text,postId)=>{
        fetch('/comment',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                postId,
                text
                })
            }).then(res=>res.json())
            .then(result=>{
                const newData = data.map(item=>{
                    if(item._id==result._id){
                        return result
                    }
                    else{
                        return item
                    }
                })
                setData(newData)
            }) 
    }

    const deletePost = (postId)=>{
        fetch(`/deletepost/${postId}`,{
            method:"delete",
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result=>{
            console.log(result)
            const newData = data.filter(item=>{
                return item._id !== result._id
            })
            setData(newData)
        })
    }

        return (
            <div className="home">
                {
                    data.map(item=>{
                        return(
                            <div className="card home-card input-field" key={item._id}>
                                <h5><Link to={item.postedBy._id !== state._id?"/profile/"+item.postedBy._id : "/profile" }>{item.postedBy.name}</Link> {item.postedBy._id == state._id
                                && <i className="material-icons unlike1" style={{
                                    float:"right"
                                }}
                                onClick={()=>deletePost(item._id)}
                                >delete</i>
                                
                                }</h5>
                            <div className="card-image">
                                <img src={item.photo}/>
                            </div>
                            <div className="card-content">
                                {item.likes.includes(state._id)
                                ?
                                <i className="material-icons unlike1"
                                     onClick={()=>{
                                unlikePost(item._id)
                                }}
                                >thumb_down</i>
                                :
                                <i className="material-icons pulse like1"
                                    onClick={()=>{
                                    likePost(item._id)
                                }}
                                >thumb_up</i>
                                }
                            
                            
                                <h6>{item.likes.length} likes</h6>
                                <h6>{item.title}</h6>
                                <p>{item.body}</p>
                                {
                                    item.comments.map(record=>{
                                        return(
                                            <h6 key={record._id}><span style={{fontWeight:"500"}}>{record.postedBy.name}</span> {record.text}</h6>
                                        )
                                    })
                                }
                                <form onSubmit={(e)=>{
                                    e.preventDefault()
                                    makeComment(e.target[0].value,item._id)
                                }}>
                                    <input type="text" placeholder="add a comment"/>   
                                </form>
                                
                            </div>
                        </div>
                        )
                    })
                }
            </div>
        )      
}

export default Home