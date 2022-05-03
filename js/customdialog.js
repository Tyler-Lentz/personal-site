// Used this article as a reference:
// https://wesbos.com/sanitize-html-es6-template-strings/
export function sanitize(strings, ...values) {
    const dirty = strings.reduce((prev, next, i) => `${prev}${next}${values[i] || ''}`, '');
    return DOMPurify.sanitize(dirty);
}

export function myAlert(s) {
    let alertDialog = document.createElement('dialog');
    alertDialog.innerHTML = `<p>${s}</p>
                             <form method="dialog">
                             <button type="submit" id="accept-button" value="true">Ok</button>
                             </form>`;
    document.body.appendChild(alertDialog);
    alertDialog.showModal();
    alertDialog.addEventListener('close', () => {
        document.body.removeChild(alertDialog);
    });
    return alertDialog;
}

export function myConfirm(s) {
    let confirmDialog = document.createElement('dialog');
    confirmDialog.innerHTML = `<p>${s}</p>
                               <form method="dialog">
                               <button type="submit" id="cancel-button" value="false">Cancel</button>
                               <button type="submit" id="accept-button" value="true">Ok</button>
                               </form>`;

    document.body.appendChild(confirmDialog);
    confirmDialog.showModal();
    confirmDialog.addEventListener('close', () => {
        document.body.removeChild(confirmDialog);
    });
    return confirmDialog;
}

export function myNamePrompt(s) {
    let promptDialog = document.createElement('dialog');
    promptDialog.innerHTML = `<form method="dialog">
                              <label for="custom-name-input">Enter your name:</label>
                              <input type="text" name="custom-name-input" id="custom-name-input">
                              <menu>
                              <button id="confirm-name-button" value="">Ok</button>
                              <button value="User did not enter anything!">Cancel</button>
                              </menu>
                              </form>`;

    document.body.appendChild(promptDialog);

    let nameInput = document.getElementById('custom-name-input');
    let confirmButton = document.getElementById('confirm-name-button');
    nameInput.addEventListener('change', () => {
        confirmButton.value = nameInput.value;
    });

    promptDialog.showModal();
    promptDialog.addEventListener('close', () => {
        document.body.removeChild(promptDialog);
    });
    return promptDialog;
}