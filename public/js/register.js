// Get the form
const registerForm = document.querySelector('#register-form');
const amountOfChildren = registerForm.children.length;

// Make the post request when the form is submitted
registerForm.addEventListener('submit', (event) => {
  event.preventDefault();

  if (registerForm.children.length > amountOfChildren) registerForm.removeChild(registerForm.firstChild);

  const formData = new FormData(registerForm);
  const username = formData.get('username');
  const email = formData.get('email');
  const password = formData.get('password');

  const userData = {
    username,
    email,
    password,
  };

  fetch('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
    headers: {
      'content-type': 'application/json',
    },
  }).then(async (response) => {
    const res = await response.json();

    if (res.error) {
      const errorDiv = document.createElement('div');
      errorDiv.className = 'error-message';
      errorDiv.innerHTML = '<i class="fa-solid fa-circle-xmark"></i> ' + res.error;
      registerForm.insertBefore(errorDiv, registerForm.firstChild);
    }

    if (res.userId) {
      const successDiv = document.createElement('div');
      successDiv.className = 'success-message';
      successDiv.innerHTML =
        '<i class="fa-solid fa-circle-check"></i> Your account has been created. You can now <a href="/login">log in</a>.';
      registerForm.insertBefore(successDiv, registerForm.firstChild);
    }
  });
});
