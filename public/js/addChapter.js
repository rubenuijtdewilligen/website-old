const addChapterForm = document.querySelector('.chapter-form');
const subjectSelect = document.querySelector('#subject');

const amountOfChildren = addChapterForm.children.length;

subjectsToSelect(subjectSelect);

async function subjectsToSelect(selectElement) {
  let subjects = [];
  await fetch('/api/samenvattingen/subjects', { method: 'GET' })
    .then(async (response) => {
      const res = await response.json();
      subjects = res;
    })
    .catch((error) => console.log(error));

  subjects.forEach((subject) => {
    const option = document.createElement('option');
    option.value = subject;
    option.innerText = subject;
    selectElement.appendChild(option);
  });
}

addChapterForm.addEventListener('submit', (event) => {
  event.preventDefault();

  if (addChapterForm.children.length > amountOfChildren) addChapterForm.removeChild(addChapterForm.firstChild);

  const formData = new FormData(addChapterForm);
  const subject = formData.get('subject');
  const name = formData.get('name');

  const chapterData = { subject, name };

  fetch('/api/samenvattingen/add_chapter', {
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
        addChapterForm.insertBefore(errorDiv, addChapterForm.firstChild);
      }

      if (res.message) {
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.innerHTML = '<i class="fa-solid fa-circle-check"></i> ' + res.message;
        addChapterForm.insertBefore(successDiv, addChapterForm.firstChild);
      }
    })
    .catch((error) => console.log(error));
});
