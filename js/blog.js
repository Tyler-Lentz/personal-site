import {myConfirm, myAlert} from "./customdialog.js"
import { update, push, getDatabase, ref, get, child, onValue, remove, set } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-database.js";
import { getAuth, signInWithEmailAndPassword, signOut} from "https://www.gstatic.com/firebasejs/9.6.8/firebase-auth.js";

import {app} from "./analytics.js"
import {formatDate} from "./date.js"

function myPostPrompt(title, content, tag) {
    let personalChecked = '';
    if (tag == 'Personal') {
        personalChecked = 'Checked';
    }
    let workChecked = '';
    if (tag == 'Work') {
        workChecked = 'Checked';
    }

    let promptDialog = document.createElement('dialog');
    promptDialog.innerHTML = `<form method="dialog">
                              <fieldset>
                                <label for="title-input">Title:</label>
                                <input type="text" name="title-input" id="title-input" value="${title}">
                                <label for="content-input">Content:</label>
                                <textarea name="content-input" id="content-input">${content}</textarea>
                                <div>
                                  <input type="radio" id="work-tag-btn" name="tag" value="Work" ${workChecked}>
                                  <label for="work-tag-btn">Work</label>
                                  <input type="radio" id="personal-tag-btn" name="tag" value="Personal" ${personalChecked}>
                                  <label for="personal-tag-btn">Personal</label>
                                </div>
                              </fieldset>
                              <div class="submit-container">
                                <button id="confirm-post-button" value="">Ok</button>
                                <button value="">Cancel</button>
                              </div>
                              </form>`;

    document.body.appendChild(promptDialog);

    let confirmButton = document.getElementById('confirm-post-button');
    confirmButton.addEventListener('click', () => {
        let titleInput = document.getElementById('title-input');
        let summaryInput = document.getElementById('content-input');
        let tagButton = document.querySelector('input[name="tag"]:checked');
        let tag = "";
        if (tagButton != null) {
            tag = tagButton.value;
        }
        let post = {
            'title': DOMPurify.sanitize(titleInput.value),
            'date': formatDate(new Date()),
            'content': DOMPurify.sanitize(summaryInput.value),
            'tag': tag
        };
        confirmButton.value = JSON.stringify(post);
    });

    promptDialog.showModal();
    promptDialog.addEventListener('close', () => {
        document.body.removeChild(promptDialog);
    });
    return promptDialog;
}

function addPostPrompt() {
    if (isLoggedIn()) {
        let dialog = myPostPrompt("", "", "Work");
        dialog.addEventListener('close', () => {
            if (dialog.returnValue != "") {
                let newPost = JSON.parse(dialog.returnValue);
                console.log(newPost);
                newPost.email = auth.currentUser.email;

                addPost(newPost);
            }
        });
    } else {
        myAlert("You can only add posts if you are logged in!");
   }
}

function deletePostPrompt(key) {
    return function() {
        if (isLoggedIn()) {
            let dialog = myConfirm("Are you sure you want to delete this post?");
            dialog.addEventListener('close', () => {
                if (dialog.returnValue == "true") {
                    deletePost(key);
                }
            });
       } else {
            myAlert("You can only delete posts if you are logged in!");
       }
    }
}

function editPostPrompt(key) {
    return function() {
        if (isLoggedIn()) {
            let post = getPosts()[key];
            let dialog = myPostPrompt(post.title, post.content, post.tag);
            dialog.addEventListener('close', () => {
                if (dialog.returnValue != "") {
                    let newPost = JSON.parse(dialog.returnValue);
                    newPost.email = auth.currentUser.email;
                    editPost(key, newPost);
                }
            });
        } else {
            myAlert("You can only edit posts if you are logged in!");
        }
    }
}

// Get the first sentence and append ...
function getSummaryFromContent(content) {
    return content.split('.')[0] + '...';
}

function displayPosts(postData) {
    let outputArea = document.getElementById("post-list-output"); // <output>
    outputArea.style.visibility = 'hidden';

    if (postData != null && Object.keys(postData).length > 0) {

        let filter = getCurrentFilter();
        
        // Create the ul for all the blog posts
        let blogList = document.createElement('ul');
        Object.keys(postData).forEach(key => {
            if (filter[`${postData[key].tag}`] === false) {
                return;
            }

            // Create each individual li for each post
            let li = document.createElement('li');
            li.classList.add('post-card');
            li.innerHTML = 
                `<b class="post-title"><a href="post.html?id=${key}">${postData[key].title}</a></b>
                 <i class="post-date">${postData[key].date}</i>
                 <p class="post-summary">${getSummaryFromContent(postData[key].content)}</p>
                 <i class="post-author">${postData[key].email}</i>
                 <b class="post-tag">${postData[key].tag}</b>`;
            // Can't get the functions to work when embedded directly in the onclick
            // inside of the HTML. The function isn't correctly getting set in onclick
            // when done inside of the template literal

            /* 
            Images downloaded from here:

            https://www.freeiconspng.com/downloadimg/28675
            https://www.freeiconspng.com/downloadimg/3585

            Unsure if I should actually directly link to the page for the image, or if I should
            have something directly in the page that mentions these links. I kinda feel uneasy about
            linking to a random site like this, so not sure if that is the best approach.
            I did shrink them so that they would fit better in my site.
            */

            let buttonContainer = document.createElement('div');
            buttonContainer.classList.add('button-container');

            let editButton = document.createElement('button');
            editButton.innerHTML = `<img src="../images/edit-icon.png" width="32" height="32" alt="Edit"></img>`
            editButton.classList.add('edit-button');
            editButton.classList.add('require-auth');
            editButton.onclick = editPostPrompt(key);
            let deleteButton = document.createElement('button');
            deleteButton.innerHTML = `<img src="../images/trash-icon.png" width="32" height="32" alt="Delete"></img>`
            deleteButton.classList.add('delete-button');
            deleteButton.classList.add('require-auth');
            deleteButton.onclick = deletePostPrompt(key);
            buttonContainer.appendChild(editButton);
            buttonContainer.appendChild(deleteButton);
            
            li.appendChild(buttonContainer);
            blogList.appendChild(li);
        });

        // wipe the output area
        while (outputArea.firstChild) {
            outputArea.removeChild(outputArea.firstChild);
        }

        // Add in ul tag
        outputArea.appendChild(blogList);
    } else {
        outputArea.innerHTML = "<p>No posts saved!</p>";
    }
    
    outputArea.style.visibility = 'visible';
    if (isLoggedIn()) {
        setPageToLoggedInMode();
    } else {
        setPageToLoggedOutMode();
    }
}

// Access local copy of database from local storage, which is kept up to date with the online database
function getPosts() {
    let data = localStorage.getItem('posts');
    return JSON.parse(data);
}

// Database stuff

const db = getDatabase(app)

function addPost(post) {
    // Get a key for a new Post.
    const newPostKey = push(child(ref(db), 'posts')).key;

    const updates = {};
    updates['/posts/' + newPostKey] = post;

    return update(ref(db), updates);
}

function deletePost(key) {
    return remove(child(ref(db), `posts/${key}`));
}

function editPost(key, newPost) {
    return set(child(ref(db), `posts/${key}`), newPost);
}

// Auth stuff

const auth = getAuth();
console.log(auth);

function isLoggedIn() {
    return auth.currentUser != null;
}

function initLoginButton() {
    let loginButton = document.getElementById('login-button');
    loginButton.addEventListener('click', () => {
        let dialog = myLoginPrompt();
        dialog.addEventListener('close', () => {
            if (dialog.returnValue != "") {
                let authData = JSON.parse(dialog.returnValue);
                signInWithEmailAndPassword(auth, authData.email, authData.password)
                    .then((userCredential) => {
                        setPageToLoggedInMode();
                        myAlert("You have been successfully logged in.");
                    })
                    .catch((error) => {
                        const errorCode = error.code;
                        const errorMessage = error.message;
                        myAlert(`Error Logging in: ${errorCode}`);
                    });
            }
        });
    });
}

function setPageToLoggedInMode() {
    let authElems = document.getElementsByClassName('require-auth');
    for (let i = 0; i < authElems.length; i++) {
        authElems.item(i).style.visibility = 'visible';
    }

    let noAuthElems = document.getElementsByClassName('require-no-auth');
    for (let i = 0; i < noAuthElems.length; i++) {
        noAuthElems.item(i).style.visibility = 'hidden';
    }
    
    let loginInfo = document.getElementById('login-display');
    loginInfo.innerText = auth.currentUser.email;
}

function initLogoutButton() {
    let logoutButton = document.getElementById('logout-button');
    logoutButton.addEventListener('click', () => {
        let dialog = myConfirm('Are you sure you want to sign out?');
        dialog.addEventListener('close', () => {
            if (dialog.returnValue == "true") {
                signOut(auth)
                    .then(() => {
                        setPageToLoggedOutMode();
                        myAlert('You have been successfully signed out.');
                    })
                    .catch((error) => {
                        myAlert(`Error Logging Out: ${error}`);
                    });
            }
        });
    });
}

function setPageToLoggedOutMode() {
    let authElems = document.getElementsByClassName('require-auth');
    for (let i = 0; i < authElems.length; i++) {
        authElems.item(i).style.visibility = 'hidden';
    }

    let noAuthElems = document.getElementsByClassName('require-no-auth');
    for (let i = 0; i < noAuthElems.length; i++) {
        noAuthElems.item(i).style.visibility = 'visible';
    }

    let loginInfo = document.getElementById('login-display');
    loginInfo.innerText = 'Not currently logged in';
}

function myLoginPrompt() {
    let promptDialog = document.createElement('dialog');
    promptDialog.innerHTML = `<form method="dialog">
                              <fieldset>
                              <label for="email-input">Email:</label>
                              <input type="email" name="email-input" id="email-input">
                              <label for="password-input">Password:</label>
                              <input type="password" name="password-input" id="password-input">
                              </fieldset>
                              <div class="submit-container">
                              <button id="confirm-button" value="yes">Log in</button>
                              <button value="">Cancel</button>
                              </div>
                              </form>`;

    document.body.appendChild(promptDialog);

    let emailInput = document.getElementById('email-input');
    let passwordInput = document.getElementById('password-input');
    let confirmButton = document.getElementById('confirm-button');
    confirmButton.addEventListener('click', () => {
        let authData = {
            "email": DOMPurify.sanitize(emailInput.value),
            "password": DOMPurify.sanitize(passwordInput.value)
        };
        confirmButton.value = JSON.stringify(authData);
    });

    promptDialog.showModal();
    promptDialog.addEventListener('close', () => {
        document.body.removeChild(promptDialog);
    });
    return promptDialog;
}

// filters

function setFilterInformation(filter) {
    // save to local storage
    localStorage.setItem('filter', JSON.stringify(filter));
}

function getCurrentFilter() {
    return JSON.parse(localStorage.getItem('filter'));
}

function getFilterFromForm() {
    let workCB = document.getElementById('filter-work');
    let personalCB = document.getElementById('filter-personal');

    let filter = {
        'Work': workCB.checked,
        'Personal': personalCB.checked
    };

    return filter;
}

function initFilterFormHandler() {
    // Sets the filter object in local storage so it can be accessed when we need to in displayPosts
    let filterForm = document.getElementById('filter-form');
    filterForm.addEventListener('submit', (event) => {
        event.preventDefault();

        let filter = getFilterFromForm();
        setFilterInformation(filter);

        displayPosts(getPosts());
    });

    // also set the filter information right now based on initial status of webpage
    let filter = getFilterFromForm();
    setFilterInformation(filter);
}

// DOM Content Loaded;

window.addEventListener('DOMContentLoaded', () => {
    // Set up the add post event listener
    let addPostButton = document.getElementById('add-post-button');
    addPostButton.addEventListener('click', () => addPostPrompt());

    // Set up filters
    initFilterFormHandler();

    // always keep local storage with an up to date copy of the database
    // and always render the updated database
    const postsRef = ref(db, 'posts');
    onValue(postsRef, (snapshot) => {
        const posts = snapshot.val();
        localStorage.setItem('posts', JSON.stringify(posts));
        displayPosts(posts);
    });

    // authentification code
    if (isLoggedIn()) {
        setPageToLoggedInMode();
    } else {
        setPageToLoggedOutMode();
    }

    initLoginButton();
    initLogoutButton();
});