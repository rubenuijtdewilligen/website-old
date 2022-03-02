// Get the form
const loginForm = document.querySelector('#login-form');
const amountOfChildren = loginForm.children.length;

// Check for a requirement in the url queries
window.addEventListener('load', () => {
  const queryString = window.location.search;
  const parameters = new URLSearchParams(queryString);
  const requirement = parameters.get('requirement');

  if (requirement) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';

    if (requirement == 'login') {
      errorDiv.innerHTML = '<i class="fa-solid fa-circle-xmark"></i> You need to log in to view that page.';
    } else if (requirement == 'admin') {
      errorDiv.innerHTML = '<i class="fa-solid fa-circle-xmark"></i> You must be an admin to view that page.';
    }

    loginForm.insertBefore(errorDiv, loginForm.firstChild);
  }
});

// Make the post request when the form is submitted
loginForm.addEventListener('submit', (event) => {
  event.preventDefault();

  if (loginForm.children.length > amountOfChildren) loginForm.removeChild(loginForm.firstChild);

  const formData = new FormData(loginForm);
  const email = formData.get('email');
  const password = formData.get('password');

  const userData = {
    email,
    password,
  };

  fetch('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(userData),
    headers: {
      'content-type': 'application/json',
    },
  })
    .then(async (response) => {
      const res = await response.json();

      if (res.error) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.innerHTML = '<i class="fa-solid fa-circle-xmark"></i> ' + res.error;
        loginForm.insertBefore(errorDiv, loginForm.firstChild);
      }

      if (res.token) {
        const queryString = window.location.search;
        const parameters = new URLSearchParams(queryString);
        const redirectUrl = parameters.get('redirect');

        if (redirectUrl) {
          window.location = redirectUrl;
        } else {
          const successDiv = document.createElement('div');
          successDiv.className = 'success-message';
          successDiv.innerHTML = '<i class="fa-solid fa-circle-check"></i> Successfully logged in. <a href="/">Return to home</a>.';
          loginForm.insertBefore(successDiv, loginForm.firstChild);
        }
      }
    })
    .catch((error) => console.log(error));
});
