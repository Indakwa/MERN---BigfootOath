import { useState, useRef, useEffect } from 'react'
import { ImAttachment } from 'react-icons/im';
import { AiOutlineArrowRight } from 'react-icons/ai';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify'
import Loading from './Loading';
const API_URL = '/api/users/'


const SignUp = () => {
    const [isLoading, setIsLoading] = useState(true)
    const fileInputRef = useRef(null);
    const [labelText, setLabelText] = useState('Upload your favorite picture');

    const navigate = useNavigate();

    const [data, setData] = useState({
        nickname: '',
        email: '',
        password: '',
        password2: '',
        image: '',
    })

    const { password, password2} = data

    const handleChange = (name) => (e) => {
        let value;
        if (name === "image") {
          if (e.target.files.length) {
            value = e.target.files[0];
            setLabelText(e.target.files[0].name);
          } else {
            value = null;
          }
        } else {
          value = e.target.value;
        }
        setData({ ...data, [name]: value });
    };
      

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true)

        if (password !== password2) {
            setIsLoading(false)
            toast.info('Passwords do not match');
          } else if (password.length < 8){
            setIsLoading(false)
            toast('Password must be at least 8 characters long')
          } else if (labelText === "Upload your favorite picture"){
            setIsLoading(false)
            toast('Please upload your favourite picture')
          } else{

            let formData = new FormData();
            formData.append("nickname", data.nickname);
            formData.append("email", data.email);
            formData.append("password", data.password);
            formData.append("image", data.image);


            try {
                const response = await axios.post(API_URL, formData);
                
                if (response.status === 201) {
                  setData({ 
                    nickname: "",
                    email: "",
                    password: "",
                    password2: "",
                    image: "",
                  });
                  localStorage.setItem('token', response.data.token)
                  localStorage.setItem('_id', response.data._id)
                  navigate("/circle");
                }else{
                    setIsLoading(false)
                }

                toast(response.data)
                
              } catch (error) {
                console.log(error.message)
                toast(`EISHHHH  ---  ${error}`);
              }
          }
      




    };


    useEffect(() => {
        setTimeout(() => {
            setIsLoading(false)
        }, 1000);
    }, []);

    if (isLoading) {
        return <Loading />
    }


  return (
    <section className='signUp'>
        <div className="titleDiv">
            <h2>Bigfoot Oath</h2>
            <hr />
            <p>take oath to join the circle</p>
        </div>
        

        <form >
            <input 
                name='nickname'
                type="text" 
                placeholder='Enter your nickname'
                value={data.nickname}
                onChange={handleChange("nickname")}
                required
            />
            
            <input 
                type="email" 
                name='email'
                placeholder='Enter your email'
                value={data.email}
                onChange={handleChange("email")}
                required
            />

            <input 
                type="password" 
                name='password'
                placeholder='Enter your password'
                value={data.password}
                onChange={handleChange("password")}
                required
            />

            <input 
                type="password" 
                name='password2'
                placeholder='Confirm your password'
                value={data.password2}
                onChange={handleChange("password2")}
                required
            />

            <label id='upload' htmlFor="file-input">
                {labelText.substr(0, 30)}
                <span>
                    <ImAttachment id='uploadIcon' style={{ color: '#fff' }}/>
                </span>
            </label>
            <input 
                id="file-input" 
                type="file"
                accept="image/*"
                name="image"
                onChange={handleChange("image")}
                style={{ display: "none" }} 
                ref={fileInputRef}
            />

            <button onClick={handleSubmit}>
                SUBMIT  <AiOutlineArrowRight id='submitIcon'/>
            </button>

        </form>

        <p id='toLogin'>
            Have you taken the oath already?  
            <Link to="/login"> Log in</Link>
        </p>
    </section>
  )
}

export default SignUp