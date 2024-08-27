import { NextRequest } from "next/server";
import { nanoid } from "nanoid";
import { redis } from "@/lib/redis";

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const { text, tags } = body;

    const commentId = nanoid();

    const comment = {
      text,
      timestamp: new Date(),
      author: req.cookies.get("userId")?.value,
      tags,
    };

    await Promise.all([
      await redis.rpush(`comments`, commentId),
      await redis.sadd(`tags:${commentId}`, tags),
      await redis.hset(`comment:${commentId}`, comment),
    ]);

    await redis.rpush(`comments`, commentId);

    await redis.sadd(`comment:${commentId}`, "text", text);

    await redis.hset(`comment:${commentId}`, comment);

    await Promise.all([
      redis.rpush(`comments`, commentId),
      redis.json.set("key", "$.tags", { Typescript: false }),
    ]);

    return new Response("OK", { status: 200 });
  } catch (e) {
    return new Response("Internal Server Error", { status: 500 });
  }
};
