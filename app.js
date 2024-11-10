document.addEventListener("DOMContentLoaded", () => {
  const newPostButton = document.getElementById("newPostButton");
  const postModal = document.getElementById("postModal");
  const closeModal = document.querySelector(".close");
  const postForm = document.getElementById("postForm");

  // Show modal on button click
  newPostButton.addEventListener("click", () => {
    postModal.classList.remove("hidden");
  });

  // Close modal
  closeModal.addEventListener("click", () => {
    postModal.classList.add("hidden");
  });

  // Handle form submission
  postForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const title = document.getElementById("title").value;
    const content = document.getElementById("content").value;

    try {
      const response = await fetch("anonymous-forum-production.up.railway.app:8080/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password, title, content }),
      });

      if (response.ok) {
        alert("Post created successfully!");
        postModal.classList.add("hidden");
        loadPosts(); // Reload posts after successful post creation
      } else {
        alert("Error creating post. Please check your credentials.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  });

  // Load posts from API
  async function loadPosts() {
    try {
      const response = await fetch("anonymous-forum-production.up.railway.app:8080/api/posts");
      const posts = await response.json();

      const postList = document.getElementById("postList");
      postList.innerHTML = ""; // Clear existing posts

      posts.forEach((post) => {
        const postItem = document.createElement("div");
        postItem.classList.add("post-item");
        postItem.innerHTML = `
                    <h3>${post.title}</h3>
                    <p>${post.content}</p>
                `;
        postList.appendChild(postItem);
      });
    } catch (error) {
      console.error("Error loading posts:", error);
    }
  }

  // Initial load of posts
  loadPosts();
});
