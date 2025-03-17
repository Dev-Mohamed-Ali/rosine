import axios from 'axios';

// Load environment variables
const baseURL = process.env.REACT_APP_BASE_URL || 'http://localhost:5000';

axios.defaults.baseURL = baseURL;

export default axios;
