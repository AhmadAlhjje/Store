const port=5000
export const BASE_URL = `http://localhost:${port}`;

export const getUserIdFromToken = () => {
    const token = localStorage.getItem('token');
    if (!token) return null;
  
    const payload = token.split('.')[1];
    const decodedPayload = JSON.parse(atob(payload));
    return decodedPayload.id;
  };

