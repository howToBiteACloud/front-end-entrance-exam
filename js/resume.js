function main() {
  const closeButton = document.querySelector("#close");
  const dialog = document.querySelector("dialog");
  const saveButton = document.querySelector('#save');
  const editor = document.getElementById('editor');
  const editableElems = Array.from(document.querySelectorAll('[data-textedited]'));
  const toPDFButton = document.querySelector('.toPDF');
  const toPDFButton2 = document.querySelector('.toPDF2');

  const resumeContent = document.querySelector('.resume-content');

  const arrData = editableElems.map(el => el.textContent);

  if (!localStorage.getItem('arrData')) {
    saveDataInLS(JSON.stringify(arrData));
  }

  let activeElem = null;

  fillDAta();

  registerHandlers();

  function registerHandlers() {
    document.body.addEventListener('click', onEdit);

    dialog.addEventListener('mousedown', closeDialog);

    toPDFButton.addEventListener('click', generatePDF);

    toPDFButton2.addEventListener('click', convertAndDownload);
  }

  function onEdit(event) {
    const target = event.target;
    const resumeCard = target.closest('.resume-block');

    if (resumeCard) {
      createRipple(event, resumeCard);
    }

    if (!target.hasAttribute('data-textedited')) return;

    activeElem = target;

    dialog.showModal();

    editor.focus();

    editor.value = target.innerHTML;

    document.body.classList.add('overflow-none');

    closeButton.addEventListener("click", dialogOff);

    saveButton.addEventListener('click', onSave);
  }

  function onSave() {
    const content = editor.value;

    if (activeElem.textContent === editor.value) {
      dialogOff();
      return;
    }

    activeElem.innerHTML = content;

    dialogOff();

    saveData();

    activeElem.classList.add('animation');

    setTimeout(() => {
      activeElem.classList.remove('animation');
    }, 800);
  }

  function dialogOff() {
    dialog.close();

    document.body.classList.remove('overflow-none');

    closeButton.removeEventListener("click", dialogOff);
    saveButton.removeEventListener('click', onSave);
  }

  function closeDialog({target}) {
    if (target.closest('.redactor')) return;

    dialogOff();
  }

  function saveData() {
    const index = editableElems.indexOf(activeElem, 0);
    
    arrData[index] = activeElem.textContent;
    saveDataInLS(JSON.stringify(arrData));
  }

  function saveDataInLS(item) {
    localStorage.setItem('arrData', item);
  }

  function fillDAta() {
    const arrData = JSON.parse(localStorage.getItem('arrData'));

    if (!arrData) return;

    for (let i = 0; i < editableElems.length; i++) {
      editableElems[i].textContent = arrData[i];
    }
  }
  
  function convertAndDownload() {
    const element = document.querySelector('.resume-content');
    const options = {
      margin:       1,
      filename:     'myfile.pdf',
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2 },
      jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
  };
    html2pdf().from(element).set(options).save();

    // html2pdf(element);
  }

  function generatePDF() {
    let pdf = new jsPDF("p", "pt", "a4");
    let options = { pagesplit: true };
  
    pdf.addHTML(resumeContent, options, () => {
      pdf.save("myDocument.pdf");
    });
  }

  function createRipple(event, elem) {

    const circle = document.createElement("span");
    const diameter = Math.max(elem.clientWidth, elem.clientHeight);
    const radius = diameter / 2;

    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${event.clientX - (elem.offsetLeft + radius)}px`;
    circle.style.top = `${event.clientY - (elem.offsetTop + radius)}px`;
    circle.classList.add("ripple"); 

    elem.appendChild(circle);

    setTimeout(() => {
      circle.remove();
     }, 700);
  }
}

main();
