// Correct function declaration using arrow syntax
const checkUserLoggedIn = () => {
    const token = localStorage.getItem('authToken'); // Store token in localStorage during login
    if (token) {
      return true; // User is logged in
    }
    return false; // User is not logged in
  }
  

  const checkIfAdmin = () => {
    const token = localStorage.getItem('authToken'); // Retrieve the token from localStorage
    if (token === 'admin') {
    console.log(token)
      return true; // Token matches 'admin', user is admin
    }
    return false; // Token doesn't match 'admin'
  }



 
  



const saveUserResponse = (response) => {
  localStorage.setItem('user', JSON.stringify(response));
}

const getUserResponse = () => {
  const response = localStorage.getItem('user');
  return response ? JSON.parse(response) : null;
}

export { saveUserResponse, getUserResponse,checkUserLoggedIn,checkIfAdmin }