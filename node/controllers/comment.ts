import { Request, Response } from "express";
import { getComments } from "../services/comment";

export const index = async (req: Request, res: Response) => {
  const q = (req.query.q as string) || "";
  let postId = 3;

  if (req.query.postId) {
    postId = parseInt(req.query.postId as string);
  }

  if (Number.isNaN(postId)) {
    res.status(400).json({ error: "Invalid postId" });
    return;
  }

  const comments = await getComments(postId, q);
  res.json(comments);
};
