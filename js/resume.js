function main() {
  const closeButton = document.querySelector("#close");
  const dialog = document.querySelector("dialog");
  const saveButton = document.querySelector('#save');
  const editor = document.getElementById('editor');
  const editableElems = document.querySelectorAll('[data-textedited]');

  const arrData = [];

  let activeElem = null;

  fillDAta();

  registerHandlers();

  function registerHandlers() {
    document.body.addEventListener('click', onEdit);

    dialog.addEventListener('click', closeDialog);
  }

  function onEdit(event) {
    const target = event.target;

    if (!target.hasAttribute('data-textedited')) return;

    activeElem = target;

    dialog.showModal();

    editor.value = target.innerHTML;

    closeButton.addEventListener("click", dialogOff);

    saveButton.addEventListener('click', onSave);
  }

  function onSave() {
    const content = editor.value;

    activeElem.innerHTML = content;

    dialogOff();

    saveData();
  }

  function dialogOff() {

    dialog.close();

    closeButton.removeEventListener("click", dialogOff);
    saveButton.removeEventListener('click', onSave);
  }

  function closeDialog({target}) {
    console.log(target);

    if (target.closest('.redactor')) return;

    dialogOff();
  }

  function saveData() {
    for (let i = 0; i < editableElems.length; i++) {
      const elem = editableElems[i];

      arrData.push(elem.textContent);
    }
     console.log(arrData);
    localStorage.setItem('arrData', JSON.stringify(arrData));
  }

  function fillDAta() {
    const arrData = JSON.parse(localStorage.getItem('arrData'));

    if (!arrData) return;

    for (let i = 0; i < editableElems.length; i++) {
      editableElems[i].textContent = arrData[i];
    }
  }
}

main();