import React, { useContext, useState, useReducer } from 'react'

const AppContext = React.createContext()

const AppProvider = ({ children }) => {

    const userReducer = (state, action) => {
        if (action.type === "USER") {
            return action.payload
        }
        if (action.type === "CLEAR") {
            return null
        }
        if (action.type === "UPDATE") {
            return {
                ...state,
                followers: action.payload.followers,
                following: action.payload.following
            }
        }
        if (action.type === "UPDATEPROFILE") {
            return {
                ...state,
                bio: action.payload.bio,
                profilePic: action.payload.profilePic
            }
        }
        return state
    }

    const initialState = null
    const [showModal, setShowModal] = useState(false)
    const [state, dispatch] = useReducer(userReducer, initialState)
    const [search, setSearch] = useState("")

    const selectComments = () => {
        setShowModal(true)
    }

    const closeModal = () => {
        setShowModal(false)
    }

    const fetchUserEmail = () => {
        const user = JSON.parse(localStorage.getItem("user"))
        return user.email
    }

    const fetchUserName = () => {
        const user = JSON.parse(localStorage.getItem("user"))
        return user.name
    }

    return (
        <AppContext.Provider
            value={{ state, showModal, selectComments, closeModal, dispatch, fetchUserEmail, fetchUserName, search, setSearch }}
        >
            {children}
        </AppContext.Provider>
    )
}

export const useGlobalContext = () => {
    return useContext(AppContext)
}

export { AppContext, AppProvider }