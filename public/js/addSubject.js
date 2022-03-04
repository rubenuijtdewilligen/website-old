const addSubjectForm = document.querySelector('.subject-form');
const subjectSelect = document.querySelector('#subject');

const amountOfChildren = addSubjectForm.children.length;

addSubjectForm.addEventListener('submit', (event) => {
  event.preventDefault();

  if (addSubjectForm.children.length > amountOfChildren) addSubjectForm.removeChild(addSubjectForm.firstChild);

  const formData = new FormData(addSubjectForm);
  const name = formData.get('name');

  const chapterData = { name };

  fetch('/api/samenvattingen/add_subject', {
    method: 'POST',
    body: JSON.stringify(chapterData),
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
        addSubjectForm.insertBefore(errorDiv, addSubjectForm.firstChild);
      }

      if (res.subjectId) {
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.innerHTML = '<i class="fa-solid fa-circle-check"></i> The subject was added to the database.';
        addSubjectForm.insertBefore(successDiv, addSubjectForm.firstChild);
      }
    })
    .catch((error) => console.log(error));
});
