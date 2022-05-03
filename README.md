# CSE134B-S22-HW5
# Name: Tyler Lentz
# PID: A16366194

## Link to Website Homepage

[Click Here](https://cse134b-hw5-1149b.web.app/)

## Discussion of my approach for part 3

### Files
The files used for this part are `blog.html`, `blog.js`, `blog.css`, `post.html`, `post.js`, and `post.css`

### Back End

Like recommended, I used firebase for my authentification and database. I created an account with email `cse134grader@ucsd.edu` and password `winter2022hw5` as required. I did not make any other accounts because once this course is over I plan to restructure my project, at which time I will add an account for myself. For the database, I used firebase realtime database and added a rule so that everybody could read from the `posts` part of the database, but only the admin cse134grader user could write to that part of the database. This approach is limited because if I were to want to add more accounts to the website then I would have to restructure to database to hold user information. However, due to the stress from other courses I opted to just get something working for this homework assignment, since just a check that `auth.uid === [uid of cse134grader@ucsd.edu]` was enough to protect the database from everybody except this user.

### Front End

On the front end, the main page where you can view the blog posts is on `html/blog.html`. From this page, if the user is not logged in they will be able to view all the posts but not edit, delete, or add posts. This is achieved by setting `visibility: hidden` on any element in the page that requires authentification. However, even if the user tried to get around this by messing around in dev tools, the javascript in `blog.js` checks to make sure that the user has logged in when clicking on the add/delete/edit buttons. These checks are all just to provide a good user experience, however, and the ultimate protection in place is the rule on the database that makes sure the user making the write request has the uid of the admin accounts.

On the main blog page, each post is represented by a card that contains the information about the post in addition to the first sentence from the post. The user can click on the title of the post (which is a link) to take them to `html/post.html` which will then display the full post. It achieves this by sending the user to `post.html` with a query string in the format `?id=[id of post]`, and then the javascript in `post.js` handles getting the post information.

One important note about my approach is that I keep an up to date copy of the database in local storage. If you go to the DOMContentLoaded event handler in `blog.js`, you will see that there is a call to `onValue` on the database, which constantly keeps the page updated with an up to date view of the database alongside storing a copy of all the posts in local storage. I chose this approach because it means that if you leave the blog page open and someone else updates the database, it will update in real time. Also, if you have clicked on a post then at that point the javascript in `post.js` will just have to check the cached version of the post in local storage, so if a post is deleted while you are on the page for that post it wont 404 you. This also makes it so only `blog.js` has to make calls to the firebase server, and that we only ever have to get all the posts from the database when it actually changes. If we didn't store the posts in local storage, then every time we wanted to check something about a specific post we would have to requery the database for all the posts.

A possible bad point of my approach is that the blog post page could change as a user is attempting to interact with it if the database gets updated, and it could cause more data usage. However, I think that this could also be a good thing. For example, if there was an error in a blog post and it gets fixed right before a user is attempting to click on the post, even though they didn't refresh the page they still will get the updated version of the post that had it fixed. 