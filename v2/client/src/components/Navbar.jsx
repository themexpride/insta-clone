import React, { useState } from 'react'
import DropdownNav from './abstracts/DropdownNav.jsx'
import { Link, useNavigate } from 'react-router-dom'
import { useGlobalContext } from '../context'
import { SearchQueryData } from '../js/networkReq.js'

const Navbar = () => {
    const { state, dispatch, setSearch } = useGlobalContext()
    const nav = useNavigate()

    const [query, setQuery] = useState("")

    const clean = (dispatch) => {
        localStorage.clear()
        dispatch({type:"CLEAR"})
    }

    const logoutAct = (dispatch, clean) => {
        clean(dispatch)
        nav('/login')
    }

    const goToSearchResults = () => {
        nav('/search')
    }

    const searchAct = (e) => {
        e.preventDefault()
        SearchQueryData(query, setSearch, goToSearchResults)
    }

    const renderList = () => {
        if (state) {
            return [
                <li className="Navbar-Item Logo-font-parent" key="state-true-logo"><Link className="Logo-font" to={state?"/":"/login"}>Insta-Clone</Link></li>,
                <li className="Navbar-Item show-for-medium" key="state-true-profile"><Link to="/profile">Profile</Link></li>,
                <li className="Navbar-Item show-for-medium" key="state-true-create"><Link to="/create">Create</Link></li>,
                <li className="Navbar-Item-Input show-for-medium" key="state-true-search"><input value={query} type="search" placeholder="Search" onChange={(e) => setQuery(e.target.value)}/></li>,
                <li className="show-for-medium" key="state-true-search-button"><button className="Navbar-Item-Button" type="button" onClick={(e) => searchAct(e)}>Search</button></li>,
                <li className="Navbar-Item show-for-medium" key="state-true-logout"><button className="navbar-logout" onClick={() => logoutAct(dispatch, clean)}>Logout</button></li>,
            ]
        }
        else {
            return [
                <li className="Navbar-Item Logo-font-parent" key="state-false-logo"><Link className="Logo-font" to={state?"/":"/login"}>Insta-Clone</Link></li>,
                <li className="Navbar-Item show-for-medium" key="state-false-login"><Link to="/login">Login</Link></li>,
                <li className="Navbar-Item show-for-medium" key="state-false-signup"><Link to="/signup">Signup</Link></li>
            ]
        }
    }

    return (
        <div className="grid-container fluid Navbar">
            <div className="top-bar Navbar">
                <div className="top-bar-left">
                    <ul className="dropdown menu Navbar-left-side" data-dropdown-menu>
                        {renderList()}
                    </ul>
                </div>
            </div>
            <DropdownNav 
                state={state}
                logoutAct={logoutAct}
                dispatch={dispatch}
                clean={clean}
                query={query}
                setQuery={setQuery}
                searchAct={searchAct}
                />
        </div>
    )
}

export default Navbar
