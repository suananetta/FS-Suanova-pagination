
const output = document.querySelector(".output");

let requestLimit = 10;
let requestSkip = 0;

const infinteObserver = new IntersectionObserver(
    ([entry], observer) => {
        if(entry.isIntersecting) {
            observer.unobserve(entry.target);
            getContent();
        }
    },
    { 
        rootMargin: '50px',
        threshold: 0.5 
    }
)

const getPosts = async (limit, skip) => {
    let response = await fetch(`https://dummyjson.com/posts?limit=${limit}&skip=${skip}&select=title,reactions,userId,body,tags`);
    let result = response.json();
    return result;
}

const getUsers = async () => {
    let response = await fetch('https://dummyjson.com/users');
    let result = response.json();
    return result;
}

async function getContent() {
    let posts = await getPosts(requestLimit, requestSkip);
    let users = await getUsers();

    displayPosts(posts, users);

    requestSkip += requestLimit;

    let lastPost = document.querySelector(".post-card:last-child");
    if (lastPost) {infinteObserver.observe(lastPost)};

    // console.log(lastPost);
    // console.log(posts);
    // console.log(requestLimit);
    // console.log(requestSkip);
}

function displayPosts(postsData, usersData) {
    postsData.posts.forEach(post => {
        let userInfo = usersData.users.filter(user => user.id === post.userId)[0];

        let postCard = document.createElement("div");
        postCard.className = "post-card";

        postCard.innerHTML = `
            <div class="post-author">
                <span class="post-author-name">${userInfo? userInfo.firstName : 'Noname'} ${userInfo? userInfo.lastName : 'Anonymous'} </span>
                <div class="post-author-img" style="background-image: url(${!userInfo? './images/img-mock.png' 
                                                                                        : userInfo.image? userInfo.image 
                                                                                        : './images/img-mock.png'});">
                </div>
            </div>
            <div class="post-body">
                <h3 class="post-title">${post.title}</h3>
                <div class="post-tags">
                    <div class="post-tag-item" style="display: ${post.tags[0]? 'block' : 'none'};">${post.tags[0]}</div>
                    <div class="post-tag-item" style="display: ${post.tags[1]? 'block' : 'none'};">${post.tags[1]}</div>
                    <div class="post-tag-item" style="display: ${post.tags[2]? 'block' : 'none'};">${post.tags[2]}</div>
                </div>
                <p class="post-description">${post.body}</p>
                <div class="post-reactions">
                    <img src="./images/reactions.svg" alt="reactions">
                    <span>${post.reactions}</span>
                </div>
            </div>
        `;
        output.append(postCard);
    });
}

document.addEventListener("DOMContentLoaded", getContent)