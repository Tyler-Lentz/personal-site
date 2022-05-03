import {formatDate} from "./date.js"

function setDateToToday() {
    let dateInput = document.getElementById('date')
    dateInput.value = formatDate(new Date());
}

function formulateURL(method, queryParams) {
    let url = new URL(`https://httpbin.org/${method}`);
    Object.keys(queryParams).forEach((key) => {
        url.searchParams.append(key, queryParams[key]);
    });
    return url;
}

function clearOutput() {
    let output = document.getElementById('response');
    output.innerHTML = "";
}

function putResponseInOutput(response) {
    console.log(response);
    let output = document.getElementById('response');
    output.innerHTML = `<textarea>${response}</textarea>`;
}

function makeXHRRequest(reqType, formData, id) {
    let xhr = new XMLHttpRequest();
    switch (reqType) {
        case 'GET':
            // would it be good practice to set content type here even though theres no body being sent?
            xhr.open('GET', formulateURL('get', {'id': id}));
            xhr.send();
            break;
        case 'POST':
            xhr.open('POST', formulateURL('post', {}));
            xhr.send(formData);
            break;
        case 'PUT':
            xhr.open('PUT', formulateURL('put', {'id': id}));
            xhr.send(formData);
            break;
        case 'DELETE':
            xhr.open('DELETE', formulateURL('delete', {'id': id}));
            xhr.send();
            break;
        default:
            alert('Error: Invalid HTTP Method!');
            return;
    }

    xhr.onload = () => {
        if (xhr.status != 200) { 
            alert(`Error ${xhr.status}: ${xhr.statusText}`); 
        } else { 
            putResponseInOutput(xhr.response);
        }
    };
}

function makeFetchRequest(reqType, formData, id) {
    switch (reqType) {
        case 'GET':
            fetch(formulateURL('get', {'id': id}))
                .then(response => response.text())
                .then(data => {putResponseInOutput(data)})
                .catch(error => {alert(`Error: ${error}`)})
            break;
        case 'POST':
            fetch(formulateURL('post', {}), {'method': 'POST', 'body': formData})
                .then(response => response.text())
                .then(data => {putResponseInOutput(data)})
                .catch(error => {alert(`Error: ${error}`)})
            break;
        case 'PUT':
            fetch(formulateURL('put', {'id': id}), {'method': 'PUT', 'body': formData})
                .then(response => response.text())
                .then(data => {putResponseInOutput(data)})
                .catch(error => {alert(`Error: ${error}`)})
            break;
        case 'DELETE':
            fetch(formulateURL('delete', {'id': id}), {'method': 'DELETE'})
                .then(response => response.text())
                .then(data => {putResponseInOutput(data)})
                .catch(error => {alert(`Error: ${error}`)})
            break;
        default:
            alert("Error: invalid HTTP method!");
            break;
    }
}

function disableFormFields(reqType) {
    let idInput = document.getElementById('article-id');
    let nameInput = document.getElementById('article-name');
    let bodyInput = document.getElementById('article-body');

    switch (reqType) {
        case 'GET':
            idInput.disabled = false;
            nameInput.disabled = true;
            bodyInput.disabled = true;
            break;
        case 'POST':
            idInput.disabled = true;
            nameInput.disabled = false;
            bodyInput.disabled = false;
            break;
        case 'PUT':
            idInput.disabled = false;
            nameInput.disabled = false;
            bodyInput.disabled = false;
            break;
        case 'DELETE':
            idInput.disabled = false;
            nameInput.disabled = true;
            bodyInput.disabled = true;
            break;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    setDateToToday();
    disableFormFields('GET'); // defaults to get

    let getBtn = document.getElementById('get-btn');
    getBtn.addEventListener('click', () => {
        disableFormFields('GET');
    });
    let postBtn = document.getElementById('post-btn');
    postBtn.addEventListener('click', () => {
        disableFormFields('POST');
    });
    let putBtn = document.getElementById('put-btn');
    putBtn.addEventListener('click', () => {
        disableFormFields('PUT');
    });
    let deleteBtn = document.getElementById('delete-btn');
    deleteBtn.addEventListener('click', () => {
        disableFormFields('DELETE');
    });

    let form = document.getElementById('article-form');
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        clearOutput();

        let formData = new FormData(document.getElementById('article-form'));

        let id = formData.get('article-id');
        formData.delete('article-id');

        let reqApi = formData.get('request-api');
        formData.delete('request-api');

        let reqType = formData.get('request-type');
        formData.delete('request-type');

        if (reqApi == "fetch") {
            makeFetchRequest(reqType, formData, id);
        } else {
            makeXHRRequest(reqType, formData, id);
        }
    });
});