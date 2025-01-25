import axios from "axios";
import { Comment } from "../models/comment";

export const cache: Record<string, { data: Comment[]; expiry: number }> = {};

export const getComments = async (
  postId: number,
  q: string
): Promise<Comment[]> => {
  const cacheKey = `${postId}`;
  const currentTime = Date.now();

  let comments: Comment[] = [];

  // Check if the data exists in the cache and hasn't expired
  if (cache[cacheKey] && cache[cacheKey].expiry > currentTime) {
    console.log("Returning cached data");
    comments = cache[cacheKey].data;
  } else {
    console.log("Fetching fresh data");
    // Fetch fresh data
    const response = await axios.get<Comment[]>(
      "https://jsonplaceholder.typicode.com/comments",
      {
        params: { postId },
      }
    );

    comments = response.data;

    // Store the data in the cache with a 5-minute expiry
    cache[cacheKey] = {
      data: comments,
      expiry: currentTime + 5 * 60 * 1000, // 5 minutes in milliseconds
    };
  }

  if (!q) {
    return comments;
  }

  // Return filtered data
  return comments.filter((comment: Comment) => comment.body.includes(q));
};
