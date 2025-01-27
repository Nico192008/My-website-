async function register() {
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;

    const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    alert(data.message);
}

async function login() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    if (data.success) {
        localStorage.setItem('token', data.token);
        window.location.href = 'main.html'; // Redirect to main feed
    } else {
        alert(data.message);
    }
}

async function createPost() {
    const content = document.getElementById('post-content').value;

    const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ content })
    });

    const data = await response.json();
    alert(data.message);
    loadPosts(); // Refresh posts
}

async function loadPosts() {
    const response = await fetch('/api/posts', {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    });

    const posts = await response.json();
    const postsContainer = document.getElementById('posts');
    postsContainer.innerHTML = '';
    posts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.className = 'post';
        postElement.innerText = post.content;
        postsContainer.appendChild(postElement);
    });
}

async function updateProfile() {
    const bio = document.getElementById('bio').value;
    const profilePic = document.getElementById('profile-pic').files[0];
    const coverPic = document.getElementById('cover-pic').files[0];

    const formData = new FormData();
    formData.append('bio', bio);
    if (profilePic) formData.append('profilePic', profilePic);
    if (coverPic) formData.append('coverPic', coverPic);

    const response = await fetch('/api/profile', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
    });

    const data = await response.json();
    alert(data.message);
}

async function addFriend() {
    const email = document.getElementById('friend-email').value;
    const response = await fetch('/api/friends/search', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ email })
    });

    const data = await response.json();
    if (data.friendId) {
        const addResponse = await fetch('/api/friend/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ friendId: data.friendId })
        });
        const addData = await addResponse.json();
        alert(addData.message);
        loadFriends(); // Refresh friend list
    } else {
        alert('Friend not found');
    }
}

async function loadFriends() {
    const response = await fetch('/api/friends', {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    });

    const friends = await response.json();
    const friendList = document.getElementById('friend-list');
    friendList.innerHTML = '';
    friends.forEach(friend => {
        const friendElement = document.createElement('div');
        friendElement.innerText = friend.email;
        friendList.appendChild(friendElement);
    });
}

window.onload = () => {
    loadPosts();
    loadFriends(); // Load friends on page load
};
