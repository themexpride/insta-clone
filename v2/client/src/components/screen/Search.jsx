import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useGlobalContext } from '../../context'

const Search = () => {
    const { state, search } = useGlobalContext()

    const [data, setData] = useState(search ? search : [])

    useEffect(() => {
        setData(search)
    }, [search])

    return (
        <main>
            { data ? 
                data.length > 0 ?
                    data.map((user) => {
                        const { _id:id, name, profilePic } = user
                        return (
                            <div className="card post-card-action-icons" key={"post-" + id} style={{"margin-top":"0.5rem"}}>
                                <div className="card-section">
                                    <div className="post-card-header" style={{"border-bottom":"none"}}>
                                        <div className="post-card-avatar">
                                            <img className="avatar-image" src={profilePic} alt={name} />
                                        </div>
                                        <div className="post-card-author">
                                            <h5 className="author-title"><Link to={state.name === name ? "/profile" : "/u/" + name}>{name}</Link></h5>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                : <center className="search-not-found">
                    <img className="search-error-img" src="https://emojigraph.org/media/apple/face-with-spiral-eyes_1f635-200d-1f4ab.png" alt="Spiral Eyes"/>
                    <div className="search-error-text">Users not found</div>
                  </center>
            : <h5>Loading...</h5>
            }
        </main>
    )
}

export default Search