import axios from "axios";
import { getComments, cache } from "../../services/comment";
import { Comment } from "../../models/comment";

jest.mock("axios");

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("getComments", () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  it("should fetch fresh data and cache it", async () => {
    const postId = 1;
    const mockComments: Comment[] = [
      { postId: 1, id: 1, name: "Test", email: "test@example.com", body: "Comment 1" },
      { postId: 1, id: 2, name: "Test2", email: "test2@example.com", body: "Comment 2" },
    ];

    mockedAxios.get.mockResolvedValueOnce({ data: mockComments });

    const result = await getComments(postId, "");

    expect(mockedAxios.get).toHaveBeenCalledTimes(1);
    expect(mockedAxios.get).toHaveBeenCalledWith("https://jsonplaceholder.typicode.com/comments", {
      params: { postId },
    });
    expect(result).toEqual(mockComments);

    // Call the function again and expect it to return cached data
    const cachedResult = await getComments(postId, "");
    expect(mockedAxios.get).toHaveBeenCalledTimes(1);
    expect(cachedResult).toEqual(mockComments);
  });

  it("should return cached data if available and not expired", async () => {
    const postId = 2;
    const mockComments: Comment[] = [
      { postId: 2, id: 3, name: "Test3", email: "test3@example.com", body: "Comment 3" },
    ];

    const cacheKey = `${postId}`;
    cache[cacheKey] = {
      data: mockComments,
      expiry: Date.now() + 5 * 60 * 1000,
    };

    const result = await getComments(postId, "");

    expect(mockedAxios.get).not.toHaveBeenCalled();
    expect(result).toEqual(mockComments);
  });

  it("should return filtered comments when a query is provided", async () => {
    const postId = 3;
    const mockComments: Comment[] = [
      { postId: 3, id: 4, name: "Test4", email: "test4@example.com", body: "This is a test" },
      { postId: 3, id: 5, name: "Test5", email: "test5@example.com", body: "Another comment" },
    ];

    mockedAxios.get.mockResolvedValueOnce({ data: mockComments });

    const result = await getComments(postId, "test");

    expect(mockedAxios.get).toHaveBeenCalledTimes(1);
    expect(result).toEqual([
      { postId: 3, id: 4, name: "Test4", email: "test4@example.com", body: "This is a test" },
    ]);
  });

  it("should fetch fresh data if the cache is expired", async () => {
    const postId = 4;
    const mockComments: Comment[] = [
      { postId: 4, id: 6, name: "Test6", email: "test6@example.com", body: "Old data" },
    ];

    const newComments: Comment[] = [
      { postId: 4, id: 7, name: "Test7", email: "test7@example.com", body: "New data" },
    ];

    const cacheKey = `${postId}`;
    cache[cacheKey] = {
      data: mockComments,
      expiry: Date.now() - 1,
    };

    mockedAxios.get.mockResolvedValueOnce({ data: newComments });

    const result = await getComments(postId, "");

    expect(mockedAxios.get).toHaveBeenCalledTimes(1);
    expect(result).toEqual(newComments);
  });
});