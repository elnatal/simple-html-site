interface Comment {
  postId: number;
  id: number;
  name: string;
  email: string;
  body: string;
}

document
  .getElementById("search-input")
  ?.addEventListener("keyup", async (e) => {
    const target = e.target as HTMLInputElement;
    const searchTerm = target.value.trim();

    try {
      // Fetch comments with the search term
      const res = await fetch(
        `http://localhost:3001/comments/?q=${encodeURIComponent(searchTerm)}`
      );
      if (!res.ok) {
        throw new Error(`Error: ${res.status} - ${res.statusText}`);
      }

      const comments: Comment[] = await res.json();

      // Generate HTML for the results
      const resultsHtml = comments
        .map(
          (comment) =>
            `<li>
                <div class="comment_name">${comment.name}</div>
                <p class="comment_body">${comment.body}</p>
              </li>`
        )
        .join("");

      // Update the UI
      const $results = document.getElementById("results");
      if ($results) {
        $results.innerHTML = resultsHtml || "<li>No results found</li>";
      }
    } catch (error) {
      console.error("Error fetching comments:", error);

      // Display an error message
      const $results = document.getElementById("results");
      if ($results) {
        $results.innerHTML =
          "<li>Error fetching results. Please try again later.</li>";
      }
    }
  });
