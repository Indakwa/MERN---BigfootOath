import { FaCheck } from 'react-icons/fa';
import { BiArrowBack } from 'react-icons/bi';
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react'
import axios from 'axios'
import Loading from './Loading';
const API_URL = '/api/users/'

const Edit = () => {
  const [isLoading, setIsLoading] = useState(true)
    const [preview, setPreview] = useState("");
    const navigate = useNavigate();
    const [data, setData] = useState({
        nickname: '',
        image: '',
    }); 

    const id = localStorage.getItem("_id");
    const token = localStorage.getItem('token')



    useEffect(() => {
        async function fetchData() {
          try {
            const config = {
                headers: {
                  Authorization: `Bearer ${token}`,
                }
            }

            axios.get(API_URL + 'me', config)
            .then(function(response){
              setData(response.data);
              setPreview(response.data.image);
            })
    
          } catch (error) {
            console.error(error);
          }
        }
        fetchData();
        if(!id || !token){
          navigate('/login')
        }
        setTimeout(() => {
          setIsLoading(false)
        }, 1000);
        // eslint-disable-next-line
    },[]);

    const handleChange = (name) => (e) => {
        const value = name === "image" ? e.target.files[0] : e.target.value;
        setData({ ...data, [name]: value });
        if (e.target.files) {
          setPreview(URL.createObjectURL(e.target.files[0]));
        }
    };

    const handleSubmit = async (e) => {
        setIsLoading(true)
        e.preventDefault();

        let formData = new FormData();
        formData.append("image", data.image);
        formData.append("nickname", data.nickname);

        const config = { 
            headers: {
              Authorization: `Bearer ${token}`,
            }
        }
  
        axios.put(API_URL + id, formData, config)
          .then(function (response) {
            if(response.status === 200){
              setData({ nickname: "", image: "" });
              navigate("/profile");
            }
            console.log(response.status);
          })
          .catch(function (error) {
            console.log(error);
          });
    };


    if (isLoading) {
      return <Loading />
    }



  return (
    <section className='edit'>
        <div className="titleDiv">
            <h2>Edit Profile</h2>
            <hr />
            <p>Do you.</p>
        </div>


        <Link to="/profile"><BiArrowBack id='back'/></Link>
        

        <form >

            <label id='upload' htmlFor="file-input">
                <img src={preview} alt="a friend of a friend" />
            </label>
            <input 
                name="image"
                id="file-input" 
                type="file" 
                onChange={handleChange("image")}
                style={{ display: "none" }} 
            />


            <input 
                name='nickname'
                type="text" 
                value={data.nickname}
                onChange={handleChange("nickname")}
            />
            

            <button onClick={handleSubmit}>
                Save  <FaCheck id='saveIcon'/>
            </button>

        </form>
    </section>
  )
}

export default Edit