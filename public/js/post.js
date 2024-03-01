// Function to fetch and display all posts
async function displayPosts() {
    const response = await fetch('/posts');
    const posts = await response.json();

    const tableBody = document.getElementById('postTableBody');
    tableBody.innerHTML = '';

    posts.forEach(post => {
        const row = `<tr>
            <td>${post._id}</td>
            <td>${post.title}</td>
            <td>${post.body}</td>
            <td>
                <button onclick="editPost('${post._id}')">Edit</button>
                <button onclick="deletePost('${post._id}')">Delete</button>
            </td>
        </tr>`;
        tableBody.innerHTML += row;
    });
}

// Function to create a new post
async function createPost() {
    const title = document.getElementById('title').value;
    const body = document.getElementById('body').value;

    const response = await fetch('/posts', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, body }),
    });

    // After creating a post, refresh the display
    if (response.ok) {
        displayPosts();
    } else {
        alert('Failed to create a post');
    }
}

// Function to edit a post
async function editPost(postId) {
    // Implement edit logic if needed
}

// Function to delete a post
async function deletePost(postId) {
    const response = await fetch(`/posts/${postId}`, {
        method: 'DELETE',
    });

    // After deleting a post, refresh the display
    if (response.ok) {
        displayPosts();
    } else {
        alert('Failed to delete the post');
    }
}

// Initial display of posts when the page loads
displayPosts();
