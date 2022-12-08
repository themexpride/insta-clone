import { Link } from 'react-router-dom'
import useWindowWidth from './useWindowWidth'


const DropdownNav = ({state, logoutAct, dispatch, clean, query, setQuery, searchAct}) => {

    const { width } = useWindowWidth()
    
    if (width >= 720) return
    
    const renderList2 = () => {
        if (state) {
            return [
                <li className="Navbar-Item" key="mobile-state-true-profile"><Link to="/profile">Profile</Link></li>,
                <li className="Navbar-Item" key="mobile-state-true-create"><Link to="/create">Create</Link></li>,
                <li className="Navbar-Item-Input" key="mobile-state-true-search"><input value={query} type="search" placeholder="Search" onChange={(e) => setQuery(e.target.value)}/></li>,
                <li className="Navbar-Item-Button" key="mobile-state-true-search-button"><button className="Navbar-Item-Button" type="button" onClick={(e) => searchAct(e)}>Search</button></li>,
                <li className="Navbar-Item" key="state-true-logout"><button className="navbar-logout" onClick={() => logoutAct(dispatch, clean)}>Logout</button></li>,
            ]
        }
        else {
            return [
                <li className="Navbar-Item" key="mobile-state-false-login"><Link to="/login">Login</Link></li>,
                <li className="Navbar-Item" key="mobile-state-false-signup"><Link to="/signup">Signup</Link></li>
            ]
        }
    }

    return (
        <div className="top-bar Navbar" id="nav-links">
            <div className="top-bar-left">
                <ul className="menu Navbar-left-side">
                    {renderList2()}
                </ul>
            </div>
        </div>
    )
}

export default DropdownNav