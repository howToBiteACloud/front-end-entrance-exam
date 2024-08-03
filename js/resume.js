function main() {
  const closeButton = document.querySelector("#close");
  const dialog = document.querySelector("dialog");
  const saveButton = document.querySelector('#save');
  const editor = document.getElementById('editor');
  const editableElems = Array.from(document.querySelectorAll('[data-textedited]'));
  const toPDFButton = document.querySelector('.toPDF');

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

    toPDFButton.addEventListener('click', convertAndDownload);
  }

  function onEdit(event) {
    const target = event.target;
    const resumeCard = target.closest('.resume-card')
    console.log(target, event.currentTarget);

    if (resumeCard) {
      console.log('CARD');
      createRipple(event, resumeCard);
    }

    if (!target.hasAttribute('data-textedited')) return;

    activeElem = target;

    dialog.showModal();

    editor.focus();

    editor.value = target.innerHTML;

    closeButton.addEventListener("click", dialogOff);

    saveButton.addEventListener('click', onSave);

    document.add
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
    saveDataInLS(JSON.stringify(arrData))
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
    const element = document.querySelector('.resume-container');
    html2pdf(element);
  }

  function createRipple(event, elem) {

    const circle = document.createElement("span");
    const diameter = Math.max(elem.clientWidth, elem.clientHeight);
    const radius = diameter / 2;

    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${event.clientX - (elem.offsetLeft + radius)}px`;
    circle.style.top = `${event.clientY - (elem.offsetTop + radius)}px`;
    circle.classList.add("ripple"); 

    const ripple = elem.getElementsByClassName("ripple")[0];

    if (ripple) {
      ripple.remove();
    }

    elem.appendChild(circle);
  }
}

main();