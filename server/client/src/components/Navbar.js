import React,{useContext,useRef,useEffect,useState} from 'react'
import {Link ,useHistory} from 'react-router-dom'
import {UserContext} from '../App'
import M from 'materialize-css'

const NavBar = () =>{
    const searchModal = useRef(null)
    const [search,setSearch] = useState('')
    const {state,dispatch} = useContext(UserContext)
    const history = useHistory()
    const [userDetails,setUserDetails] = useState([])
    useEffect(()=>{
      M.Modal.init(searchModal.current)
  },[])
    
    const renderList = ()=>{
      if(state){
        return [
          <li key="1"><i  data-target="modal1" className="large material-icons modal-trigger" style={{color:"black"}}>search</i></li>,
          <li key="2"><Link to="/profile">Profile</Link></li>,
          <li key="3"><Link to="/create">Create Post</Link></li>,
          <li key="4"><Link to="/myfollowingpost">My following Posts</Link></li>,
          <li key="5">
            <button className="btn waves-effect waves-red #e53935 red darken-1"
              onClick={()=>{
                localStorage.clear()
                dispatch({type:"CLEAR"})
                history.push('/signin')
              }}
              >
                  Logout
              </button>
          </li>


        ]
      }else{
        return [
          <li key="6"><Link to="/signin">Login</Link></li>,
          <li key="7"><Link to="/signup">Sign Up</Link></li>
        ]
      }
    }
    return(
        <nav>
        <div className="nav-wrapper white">
          <Link to={state?"/":"/signin"} className="brand-logo left">Instagram Clone</Link>
          <ul id="nav-mobile" className="right">
            {renderList()}
          </ul>
        </div>
      </nav>
            
    )
}

export default NavBar