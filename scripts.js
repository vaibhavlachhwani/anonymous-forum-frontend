const API_URL = "anonymous-forum-production.up.railway.app:8080/api";

// Load specific post and comments for post.html
if (document.getElementById("postContainer")) {
  const postId = new URLSearchParams(window.location.search).get("id");
  fetch(`${API_URL}/posts/${postId}`)
    .then((response) => response.json())
    .then((post) => {
      // Insert the post details including the username
      document.getElementById("postContainer").innerHTML = `
                <div class="post-details">
                    <h2>${post.title}</h2>
                    <p class="post-author">Posted by: <strong>${
                      post.user.username
                    }</strong></p>
                    <p>${post.content}</p>
                </div>
                <div class="comments-section">
                    <h3>Comments</h3>
                    ${
                      post.comments.length > 0
                        ? post.comments
                            .map(
                              (comment) => `
                        <div class="comment">
                            <div class="comment-author">${comment.user.username}</div>
                            <div class="comment-content">${comment.content}</div>
                        </div>
                    `
                            )
                            .join("")
                        : "<p>No comments yet.</p>"
                    }
                </div>
                <div class="add-comment-button">
                </div>
            `;
    })
    .catch((error) => console.error("Error loading post:", error));
}

// Comment modal toggle
function toggleCommentModal() {
  const modal = document.getElementById("commentModal");
  modal.classList.toggle("show");
}

// Handle comment form submission
if (document.getElementById("commentForm")) {
  document.getElementById("commentForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const postId = new URLSearchParams(window.location.search).get("id");

    fetch(`${API_URL}/posts/${postId}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(formData)),
    })
      .then((response) => {
        if (response.ok) {
          alert("Comment added successfully!");
          toggleCommentModal();
          window.location.reload();
        } else {
          alert("Failed to add comment.");
        }
      })
      .catch((error) => console.error("Error:", error));
  });
}

// Handle new post creation
if (document.getElementById("postForm")) {
  document.getElementById("postForm").addEventListener("submit", (event) => {
    event.preventDefault();

    // Get form data
    const formData = new FormData(event.target);
    const postData = Object.fromEntries(formData);

    // Send post data to the backend
    fetch(`${API_URL}/posts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(postData),
    })
      .then((response) => {
        if (response.ok) {
          alert("Post created successfully!");
          window.location.href = "index.html"; // Redirect to index page
        } else {
          alert("Failed to create post. Please check your credentials.");
        }
      })
      .catch((error) => console.error("Error:", error));
  });
}

if (document.getElementById("registerForm")) {
  document
    .getElementById("registerForm")
    .addEventListener("submit", (event) => {
      event.preventDefault();
      const formData = new FormData(event.target);
      fetch(`${API_URL}/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(formData)),
      }).then(() => {
        alert("Registration successful!");
        window.location.href = "index.html";
      });
    });
}

if (document.getElementById("postsContainer")) {
  fetch(`${API_URL}/posts`)
    .then((response) => response.json())
    .then((posts) => {
      const postsContainer = document.getElementById("postsContainer");
      postsContainer.innerHTML = posts
        .map(
          (post) => `
                <div class="post-card">
                    <a href="post.html?id=${post.id}">
                        <h3>${post.title}</h3>
                    </a>
                </div>
            `
        )
        .join("");
    });
}
