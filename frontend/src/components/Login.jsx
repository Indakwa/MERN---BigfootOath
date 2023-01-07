import { AiOutlineArrowRight } from 'react-icons/ai';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useState } from 'react';
import { toast } from 'react-toastify';
import Loading from './Loading';
const API_URL = '/api/users/'




const Login = () => {
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        nickname: '',
        password: '',
    })
    

    const { nickname, password } = formData

    const onChange = (e) => {
        setFormData((prevState) => ({
          ...prevState,
          [e.target.name]: e.target.value,
        }))
    }

    const onSubmit = async (e) => {
        setIsLoading(true)
        e.preventDefault()

    
        try {
            const response = await axios.post(API_URL + 'login', formData)
            if (response.status === 201) {
                localStorage.setItem('user', JSON.stringify(response.data))
                localStorage.setItem('token', response.data.token)
                localStorage.setItem('_id', response.data._id)
                navigate("/circle");
            }
            toast(response.data);
            setIsLoading(false)
        } catch (error) {
            console.error(`EISHHHH  ---  ${error}`);
        }

    }


    
    if (isLoading) {
        return <Loading />
    }

    
  return (
    <section className='signUp'>
        <div className="titleDiv">
            <h2>Login</h2>
            <hr />
            <p>see who else joined the circle recently</p>
        </div>



        <form onSubmit={onSubmit}>
            <input 
                name='nickname'
                type="text" 
                placeholder='Enter your nickname'
                onChange={onChange}
                value={nickname}
            />
            
            <input 
                type="password" 
                name='password'
                value={password}
                placeholder='Enter your password'
                onChange={onChange}
            />

            <button type='submit'>
                LOG IN  <AiOutlineArrowRight id='submitIcon'/>
            </button>

        </form>

        <p id='toLogin'>
            If you have not taken the oath already,
            <Link to="/"> Take Oath</Link>
        </p>
    </section>
  )
}

export default Login