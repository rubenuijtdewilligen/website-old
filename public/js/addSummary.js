const addSummaryForm = document.querySelector('.summary-form');
const subjectSelect = document.querySelector('#subject');
const chapterSelect = document.querySelector('#chapter');

const addSummaryAmountOfChildren = addSummaryForm.children.length;

subjectsToSelect(subjectSelect);

subjectSelect.onchange = (event) => {
  const subject = event.target.value;
  chaptersToSelect(chapterSelect, subject);
};

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

async function chaptersToSelect(selectElement, subject) {
  while (selectElement.lastChild) {
    selectElement.removeChild(selectElement.lastChild);
  }

  const subjectData = { subject };

  fetch('/api/samenvattingen/chapters', {
    method: 'POST',
    body: JSON.stringify(subjectData),
    headers: {
      'content-type': 'application/json',
    },
  })
    .then(async (response) => {
      const res = await response.json();

      res.forEach((chapter) => {
        const option = document.createElement('option');
        const chapterNumberString = chapter.split(':')[0];
        option.value = chapterNumberString.substr(chapterNumberString.length - 1);
        option.innerText = chapter;
        selectElement.appendChild(option);
      });
    })
    .catch((error) => console.log(error));
}

addSummaryForm.addEventListener('submit', (event) => {
  event.preventDefault();

  if (addSummaryForm.children.length > addSummaryAmountOfChildren) addSummaryForm.removeChild(addSummaryForm.firstChild);

  const formData = new FormData(addSummaryForm);
  const subject = formData.get('subject');
  const chapter = parseInt(formData.get('chapter'));
  const name = formData.get('name');
  const content = formData.get('content');

  const summaryData = { subject, chapter, name, content };

  fetch('/api/samenvattingen/add_summary', {
    method: 'POST',
    body: JSON.stringify(summaryData),
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
        addSummaryForm.insertBefore(errorDiv, addSummaryForm.firstChild);
      }

      if (res.message) {
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.innerHTML = '<i class="fa-solid fa-circle-check"></i> ' + res.message;
        addSummaryForm.insertBefore(successDiv, addSummaryForm.firstChild);
      }
    })
    .catch((error) => console.log(error));
});

// Still not entirely sure how I got this mess to work. DO NOT TOUCH.
function refresh() {
  const content = document.getElementById('content').value;
  const viewerContent = `
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <meta http-equiv="X-UA-Compatible" content="IE=edge" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Document</title>

            <link
              rel="stylesheet"
              href="https://cdn.jsdelivr.net/npm/katex@0.15.2/dist/katex.min.css"
              integrity="sha384-MlJdn/WNKDGXveldHDdyRP1R4CTHr3FeuDNfhsLPYrq2t0UBkUdK2jyTnXPEK1NQ"
              crossorigin="anonymous"
            />
            <script
              src="https://cdn.jsdelivr.net/npm/katex@0.15.2/dist/katex.min.js"
              integrity="sha384-VQ8d8WVFw0yHhCk5E8I86oOhv48xLpnDZx5T9GogA/Y84DcCKWXDmSDfn13bzFZY"
              crossorigin="anonymous"
            ></script>

            <style>
              #content {
                font-family: Arial, Helvetica, sans-serif;
              }
            </style>
          </head>
          <body>
            <div id="content"></div>

            <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
            <script>
              function math(expression) {
                return katex.renderToString(expression);
              }
              document.getElementById('content').innerHTML = marked.parse(\`${content}\`);
            </script>
          </body>
        </html>
        `;

  document.getElementById('viewer').srcdoc = viewerContent;
}
