
// A funvtion for refreshing access tokens before accessing
// an api needing authorization

const tokenRefresh = async () => {
  await fetch('http://localhost:8000/api/token/refresh/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ refresh: localStorage.getItem('refresh_token')})
  })
  .then(response => {
    if (response.ok) {
      return response.json();
    }
    throw new Error('Something went wrong!');
  })
  .then(data => {
    localStorage.setItem('access_token', data.access);
    localStorage.setItem('refresh_token', data.refresh);
  })
  .catch(error => {
    return false;
  });
  return true;
}

export default tokenRefresh;
