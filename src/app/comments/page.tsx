import React from "react";
import Link from "next/link";
import { redis } from "@/lib/redis";

interface CommentDetails {
  author: string;
  text: string;
}

interface Comment {
  id: string;
  details: CommentDetails;
}

const CommentsPage = async () => {
  const commentIds = await redis.lrange("comments", 0, 3);

  const comments: Comment[] = await Promise.all(
    commentIds.map(async (commendId) => {
      const rawDetails = await redis.hgetall(`comment:${commendId}`);
      const details: CommentDetails = {
        author: (rawDetails?.author as string) || "",
        text: (rawDetails?.text as string) || "",
      };
      return { id: commendId, details };
    }),
  );

  return (
    <div className="flex flex-col gap-8 items-start">
      <Link href="/">Homepage</Link>
      <div className="flex flex-col gap-2">
        {comments.map((comment: Comment) => (
          <div key={comment.id}>
            <h1>{comment.details.author}</h1>
            <h2>{comment.details.text}</h2>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentsPage;
