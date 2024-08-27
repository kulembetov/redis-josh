import Link from "next/link";
import axios from "axios";

export default function Home() {
  const comment = async () => {
    const { data } = await axios.post("/api/comment", {
      text: "Hello, world!",
      tags: ["Typescript", "React"],
    });

    console.log(data);
  };

  return (
    <div className="flex flex-col gap-8 items-start">
      <Link href="/comments">See comments</Link>
      <button onClick={comment}>Leave a comment</button>
    </div>
  );
}
