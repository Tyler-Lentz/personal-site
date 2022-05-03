import {app} from './analytics.js'
import { update, push, getDatabase, ref, get, child, onValue, remove, set } from "https://www.gstatic.com/firebasejs/9.7.0/firebase-database.js";
import {myAlert} from './customdialog.js'

const db = getDatabase(app);

window.addEventListener('DOMContentLoaded', () => {
    let form = document.getElementById('contact');
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        let fname = document.getElementById('input_fname');
        let lname = document.getElementById('input_lname');
        let email = document.getElementById('input_email');
        let message = document.getElementById('input_message');
        let data = {
            'fname': fname.value,
            'lname': lname.value,
            'email': email.value,
            'message': message.value
        }

        // Get a key for a new Post.
        const newMsgKey = push(child(ref(db), 'messages')).key;

        const updates = {};
        updates['/messages/' + newMsgKey] = data;

        update(ref(db), updates)
            .then(() => {
                fname.value = '';
                lname.value = '';
                email.value = '';
                message.value = '';
                myAlert('Message successfully sent!');
            })
            .catch((error) => {
                myAlert(`Error submitting form: ${error}`);
            })
    });
});