import {useState} from "react";
import axios from "axios";


const useSubmit = () => {
  const [isLoading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  const submit = async (url, data) => {
    setLoading(true);
    try {
    let response = await axios.post(url,data)
    if(response.data.success){
      localStorage.setItem('authToken', response.data.authToken);
      setAlert({
        type: 'success',
        message: response.data.message,
      })
    }else{
    setAlert({
        type: 'error',
        message: response.data.error
        })
    }
    } catch (error) {
      setAlert({
        type: 'error',
        message: 'Something went wrong, please try again later!',
      })
    } finally {
      setLoading(false);
    }
  };

  
  return { isLoading, alert, submit};
}

export default useSubmit;

