import request from "supertest";
import app from "../../app";
import  * as commentService from "../../services/comment";
import { Comment } from "../../models/comment";

jest.spyOn(commentService, "getComments");

describe("GET /comments API", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return comments for a valid postId", async () => {
    const mockComments: Comment[] = [
      { postId: 1, id: 1, name: "John Doe", email: "john@example.com", body: "Sample comment 1" },
      { postId: 1, id: 2, name: "Jane Doe", email: "jane@example.com", body: "Sample comment 2" },
    ];

    jest.spyOn(commentService, "getComments").mockResolvedValueOnce(mockComments);

    const response = await request(app).get("/comments").query({ postId: 1 });

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockComments);
    expect(commentService.getComments).toHaveBeenCalledWith(1, "");
  });

  it("should return filtered comments when a query is provided", async () => {
    const mockComments: Comment[] = [
      { postId: 1, id: 1, name: "John Doe", email: "john@example.com", body: "Filtered comment" },
    ];

    jest.spyOn(commentService, "getComments").mockResolvedValueOnce(mockComments);

    const response = await request(app).get("/comments").query({ postId: 1, q: "Filtered" });

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockComments);
    expect(commentService.getComments).toHaveBeenCalledWith(1, "Filtered");
  });

  it("should return 400 for invalid postId", async () => {
    const response = await request(app).get("/comments").query({ postId: "invalid" });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: "Invalid postId" });
  });
});