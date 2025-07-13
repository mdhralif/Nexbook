import Image from "next/image";
import Comments from "./Comments";
import { Post as PostType, User } from "@prisma/client";
import PostInteraction from "./PostInteraction";
import { Suspense } from "react";
import PostInfo from "./PostInfo";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";


type FeedPostType = PostType & { user: User } & {
    likes: [{ userId: string }];
} & {
    _count: { comments: number };
};

const Post = ({ post }: { post: FeedPostType }) => {
    const { userId } = auth();

    return (
        <div className="flex flex-col gap-4">
            {/* USER */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href={`/profile/${post.user.username}`}>
                        <Image
                            src={post.user.avatar || "/noAvatar.png"}
                            width={40}
                            height={40}
                            alt=""
                            className="w-10 h-10 rounded-full cursor-pointer hover:opacity-80 transition-opacity"
                        />
                    </Link>
                    <Link href={`/profile/${post.user.username}`} className="hover:underline">
                        <span className="font-medium cursor-pointer">
                            {post.user.name && post.user.surname
                                ? post.user.name + " " + post.user.surname
                                : post.user.username}
                        </span>
                    </Link>
                </div>
                {userId === post.user.id && <PostInfo postId={post.id} />}
            </div>
            {/* DESC */}
            <div className="flex flex-col gap-4">
                {post.img && (
                    <div className="w-full relative">
                        <Image
                            src={post.img}
                            width={600}
                            height={400}
                            className="w-full h-auto rounded-md object-contain max-h-96"
                            alt=""
                        />
                    </div>
                )}
                <p>{post.desc}</p>
            </div>
            {/* INTERACTION */}
            <Suspense fallback="Loading...">
                <PostInteraction
                    postId={post.id}
                    likes={post.likes.map((like) => like.userId)}
                    commentNumber={post._count.comments}
                />
            </Suspense>
            <Suspense fallback="Loading...">
                <Comments postId={post.id} />
            </Suspense>

        </div>
    );
};

export default Post;
