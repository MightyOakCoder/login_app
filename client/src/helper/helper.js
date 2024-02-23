import axios from 'axios'

axios.defaults.baseURL = process.env.REACT_APP_SERVER_DOMAIN

/** Make API Requests */


/** authenticate function */
export async function authenticate(username){
  try {
    const response = await axios.post('/api/authenticate', { username });
    return response;
  } catch (error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      if (error.response.status === 404) {
        // User not found
        return { error: "User does not exist!" };
      } else {
        // Other server errors
        return { error: "Server error. Please try again later." };
      }
    } else if (error.request) {
      // The request was made but no response was received
      return { error: "Network error. Please check your connection." };
    } else {
      // Something happened in setting up the request that triggered an Error
      return { error: "An unexpected error occurred." };
    }
  }
}

/** get User details */
export async function getUser({ username }){
  try {
      const { data } = await axios.get(`/api/user/${username}`);
      return { data };
  } catch (error) {
      return { error : "Password doesn't Match...!"}
  }
}

/** register User details */
export async function registerUser(credentials){
  try {
      const { data : { msg }, status } = await axios.post(`/api/register`, credentials);

      let { username, email } = credentials;

      /** send email */
      if(status === 201){
          await axios.post('/api/registerMail', { username, userEmail : email, text : msg})
      }

      return Promise.resolve(msg)
  } catch (error) {
      return Promise.reject({ error })
  }
}

/** login function */
export async function verifyPassword({ username, password }){
  try {
      if(username){
          const { data } = await axios.post('/api/login', { username, password })
          return Promise.resolve({ data });
      }
  } catch (error) {
      return Promise.reject({ error : "Password doesn't Match...!"})
  }
}


/** update User profile function */
export async function updateUser(response){
  try {
      
      const token = await localStorage.getItem('token');
      const data = await axios.put('/api/updateuser', response, { headers : { "Authorization" : `Bearer ${token}`}});

      return Promise.resolve({ data })
  } catch (error) {
      return Promise.reject({ error : "Couldn't Update Profile...!"})
  }
}

/** generate OTP */
export async function generateOTP(username){
  try {
      const {data : { code }, status } = await axios.get('/api/generateOTP', { params : { username }});

      // send mail with the OTP
      if(status === 201){
          let { data : { email }} = await getUser({ username });
          let text = `Your Password Recovery OTP is ${code}. Verify and recover your password.`;
          await axios.post('/api/registerMail', { username, userEmail: email, text, subject : "Password Recovery OTP"})
      }
      return Promise.resolve(code);
  } catch (error) {
      return Promise.reject({ error });
  }
}

/** verify OTP */
export async function verifyOTP({ username, code }){
  try {
     const { data, status } = await axios.get('/api/verifyOTP', { params : { username, code }})
     return { data, status }
  } catch (error) {
      return Promise.reject(error);
  }
}

/** reset password */
export async function resetPassword({ username, password }){
  try {
      const { data, status } = await axios.put('/api/resetPassword', { username, password });
      return Promise.resolve({ data, status})
  } catch (error) {
      return Promise.reject({ error })
  }
}