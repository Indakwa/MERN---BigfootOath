import { FaSpinner } from 'react-icons/fa';

const Loading = () => {
  return (
    <div className='isLoading'>
        <FaSpinner id='spinnerIcon'/> <p>Preparing your bucket loads of fun</p>
    </div>
  )
}

export default Loading