import axios from 'axios';


const API_URL = process.env.REACT_APP_BACKEND_API;




export const getUserById = async (userId) => {
    try{

        
        const response = await  axios.get(`${API_URL}/user/info/${userId}`);
        return response.data

    }catch(err){
      console.log(err)
    }


  }