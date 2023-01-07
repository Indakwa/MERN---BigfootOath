import { RxAvatar } from 'react-icons/rx';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react'
import axios from 'axios'
import Loading from './Loading';
const API_URL = '/api/users/'

const Circle = () => {
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(true)

    const theToken = localStorage.getItem('token')
    const theId = localStorage.getItem('_id')



    const [users, setUsers] = useState();

    useEffect(() => {
    const fetchUsers = async () => {
        try {
        const response = await axios.get(API_URL + 'all');
        setUsers(response.data);
        setTimeout(() => {
            setIsLoading(false)
        }, 1000);
        
        } catch (error) {
        console.error(error);
        }
    };
    fetchUsers();
    if(!theId || !theToken){
        navigate('/login')
    }
    //eslint-disable-next-line
    }, []);

    if (isLoading) {
        return <Loading />
    }

  return (
    <section className='circlePage'>
        <div className="titleDiv">
            <h2>BigFOOT'S CIRCLE</h2>
            <hr />
            <p>friends of friends</p>
        </div>


        <Link to="/profile"><RxAvatar id='toProfile'/></Link>
        

        <div className="container">

            {users?.map((user, index) => (
                <div className="card" key={index}>
                    <img src={user.image} alt="a friend of a friend" />
                    <p className='nickname'>{user.nickname}</p>
                </div>
            ))}
        </div>

        <p id='copy'>&copy; 2023 </p>
    </section>
  )
}

export default Circle