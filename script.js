
const output = document.querySelector(".output");

let requestLimit = 10;
let requestSkip = 0;

const infinteObserver = new IntersectionObserver(
    ([entry], observer) => {
        if(entry.isIntersecting) {
            observer.unobserve(entry.target);
            response();
        }
    },
    { threshold: 1 }
)


const getPosts = async (limit, skip) => {
    let response = await fetch(`https://dummyjson.com/posts?limit=${limit}&skip=${skip}&select=title,reactions,userId,body`);
    let result = response.json();
    return result;
}

const getUsers = async () => {
    let response = await fetch('https://dummyjson.com/users');
    let result = response.json();
    return result;
}

async function response() {
    // let newLimit = requestLimit + 10;
    // let newSkip =  requestLimit + 10;

    let posts = await getPosts(requestLimit, requestSkip);
    let users = await getUsers();

    let postsList = displayPost(posts, users);
    output.innerHTML = postsList;

    const lastPost = document.querySelector(".post-card:last-child");
    if(lastPost) infinteObserver.observe(lastPost);

    requestSkip += requestLimit;

    console.log(posts);
    console.log(lastPost);
    console.log(requestLimit);
    console.log(requestSkip);
}

function displayPost(postsData, usersData) {
    let postCardsList = '';

    postsData.posts.forEach(post => {
        let userInfo = usersData.users
                                    .map(user => {
                                        if(user.id === post.userId) return user;
                                    }).filter(item => item != undefined)[0];

        let postCard = `
            <div class="post-card">
                <div class="post-author">
                    <span class="post-author-name">${userInfo? userInfo.firstName : 'Noname'} ${userInfo? userInfo.lastName : 'Anonymous'} </span>
                    <div class="post-author-img" style="background-image: url(${!userInfo? './images/img-mock.png' 
                                                                                            : userInfo.image? userInfo.image 
                                                                                            : './images/img-mock.png'});">
                    </div>
                </div>
                <div class="post-body">
                    <h3 class="post-title">${post.title}</h3>
                    <p class="post-description">${post.body}</p>
                    <div class="post-reactions">
                    <img src="./images/reactions.svg" alt="reactions">
                    <span>${post.reactions}</span>
                </div>
                </div>
            </div>
        `;
        postCardsList += postCard;
    });

    return postCardsList;
}

document.addEventListener("DOMContentLoaded", response)