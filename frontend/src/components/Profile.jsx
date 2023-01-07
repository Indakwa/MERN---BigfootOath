import React from 'react'
import { AiOutlineDelete } from 'react-icons/ai';
import { MdLogout } from 'react-icons/md';
import { MdOutlineModeEditOutline } from 'react-icons/md';
import { BiArrowBack } from 'react-icons/bi';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import axios from 'axios'
import Loading from './Loading';
const API_URL = '/api/users/'


const Profile = () => {
    const [isLoading, setIsLoading] = useState(true)
    const navigate = useNavigate();
    const [user, setUser] = useState();
    const [preview, setPreview] = useState("");
    const token = localStorage.getItem('token')
    const id = localStorage.getItem("_id");



    useEffect(() => {
        const fetchUser = async () => {
            try {
                const config = {
                    headers: {
                    Authorization: `Bearer ${token}`,
                    }
                }

                const response = await axios.get(API_URL + 'me', config);
                setUser(response.data.nickname);
                setPreview(response.data.image);

            } catch (error) {
            console.error(`WDFGHJKL  ${error}`);
            toast(error)
            }
        };
        fetchUser();

        if(!id || !token){
            navigate('/login')
        }

        setTimeout(() => {
            setIsLoading(false)
        }, 1000);
    });


    


    const handleDelete = async () => {
        console.log(`11111  ${isLoading}`)
        try {
            const config = {
                headers: {
                Authorization: `Bearer ${token}`,
                }
            }
            const response = await axios.delete(API_URL + id, config);
            if (response.status === 204) {
                localStorage.removeItem("token")
                localStorage.removeItem("_id")
                navigate("/");
            }
        } catch (error) {
            toast(error)
            //console.log(`WUUUUU  ${error}`);
        }
    };

    // Logout user
    const logout = () => {
        setIsLoading(true)
        localStorage.removeItem('user');
        localStorage.removeItem('token')
        localStorage.removeItem('_id')
        navigate('/login');
    }

    const toEdit = () => {
        navigate('/edit')
    }

    if (isLoading) {
        return <Loading />
    }

  return (
    <section className='profile'>
        <div className="titleDiv">
            <h2>Your Profile</h2>
            <hr />
            <p>stunning</p>
        </div>

        <Link to="/circle"><BiArrowBack id='back'/></Link>

        <div className="container">
            <div className="card">
                <img src={preview} alt="a friend of a friend" />
                <p className='nickname'>{user}</p>
            </div>

            <button id='editBtn' onClick={toEdit}>
                Edit Profile <MdOutlineModeEditOutline className='icon'/>
            </button>

            <button id='logoutBtn' onClick={logout}>
                Log Out <MdLogout className='icon'/>
            </button>
            <button id='deleteBtn' onClick={handleDelete}>
                Delete Account <AiOutlineDelete className='icon'/>
            </button>
        </div>
    </section>
  )
}

export default Profile