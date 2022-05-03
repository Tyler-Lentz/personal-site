function putPostInPage(post) {
    if (post != null) {
        let title = document.getElementById('post-title');
        let author = document.getElementById('post-author');
        let date = document.getElementById('post-date');
        let content = document.getElementById('post-content');

        title.innerText = post.title;
        author.innerText = post.email;
        date.innerText = post.date;
        content.innerText = post.content; 
    } else {
        window.location.replace('404.html');
    }
}

window.addEventListener('DOMContentLoaded' , () => {
    // Parse the URL for the post id
    let params = new URLSearchParams(window.location.search);
    let postID = params.get('id');

    // Get the cached blog post from local storage and put it in the page
    let post = JSON.parse(localStorage.getItem('posts'))[postID];
    putPostInPage(post);
})