"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw } from "lucide-react";
import Image from "next/image";
import { fetchPosts } from "@/app/services/RequestManager";
import { Post } from "@/app/types/post";
import { Button } from "@/components/ui/button";

const PostItem = ({
  post,
  index,
  total,
}: {
  post: Post;
  index: number;
  total: number;
}) => {
  const isLast = index === total - 1;
  const displayId = (index + 1).toString().padStart(2, "0");
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);

  const placeholderImage = "/images/placeholder-room.jpg";
  const postImage = imageError ? placeholderImage : (post.mainPictureUrl || placeholderImage);

  return (
    <div
      className={`relative ${!isLast ? "border-b border-gray-100" : ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="py-12 flex items-center justify-between relative z-10"
      >
        <div className="flex items-center gap-10 md:gap-16 lg:gap-24">
          <span className="text-gray-400 text-lg font-medium">{displayId}</span>
          <h3 className="text-gray-800 text-xl md:text-2xl font-medium">
            {post.name}
          </h3>
        </div>
      </motion.div>

      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3 }}
            className="absolute right-0 top-0 bottom-0 z-0 w-[500px] overflow-hidden shadow-lg"
            style={{
              height: "calc(100% - 24px)",
              marginTop: "12px",
              marginBottom: "12px",
            }}
          >
            <div className="relative w-full h-full">
              <Image
                src={postImage}
                alt={post.name || "Post image"}
                fill
                sizes="(max-width: 768px) 100vw, 500px"
                className="object-cover rounded-lg"
                onError={() => setImageError(true)}
                priority={index === 0}
                loading={index === 0 ? "eager" : "lazy"}
                quality={75}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent z-10"></div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const EmptyState = () => {
  return (
    <motion.div
      key="empty"
      className="text-center p-10 bg-gray-50 rounded-lg"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="text-gray-500 text-lg">Không có bài đăng nào</div>
    </motion.div>
  );
};

const PostSection = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [pagination, setPagination] = useState<{
    total: number;
    perPage: number;
    currentPage: number;
  } | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [empty, setEmpty] = useState<boolean>(false);

  const fetchPostsData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetchPosts();
      
      const postsData = response.posts;
      setPagination(response.pagination || null);

      if (!postsData || postsData.length === 0) {
        setEmpty(true);
      } else {
        setEmpty(false);
      }

      setPosts(postsData || []);
    } catch (err) {
      setError("Failed to load posts");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPostsData();
  }, []);

  if (loading) {
    return (
      <section className="py-20 md:py-28">
        <div className="w-3/4 mx-auto">
          <div className="bg-white rounded-2xl shadow-sm p-6 md:p-12 flex justify-center items-center min-h-[300px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 md:py-28">
        <div className="w-3/4 mx-auto">
          <div className="bg-white rounded-2xl shadow-sm p-6 md:p-12">
            <motion.div
              key="error"
              className="text-center p-10 rounded-lg"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-red-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <RefreshCw className="h-8 w-8 text-red-500" />
              </div>
              <div className="text-red-600 text-lg font-medium mb-4">
                {error}
              </div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={fetchPostsData}
                  className="mt-4 bg-indigo-500 hover:bg-indigo-600 text-white font-medium px-6 py-2 rounded-lg"
                >
                  Thử lại
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>
    );
  }

  if (empty) {
    return (
      <section className="py-20 md:py-28">
        <div className="w-3/4 mx-auto">
          <div className="bg-slate-600 rounded-2xl shadow-sm md:p-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mb-12 md:mb-16"
            >
              <h2 className="text-2xl md:text-3xl font-semibold text-gray-800">
                Danh sách bài đăng
              </h2>
            </motion.div>

            <EmptyState />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 md:py-28">
      <div className="w-3/4 mx-auto">
        <div className="bg-white rounded-2xl shadow-sm p-6 md:p-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-12 md:mb-16"
          >
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-800">
              Danh sách bài đăng
            </h2>
          </motion.div>

          <div className="space-y-0 overflow-hidden">
            {posts.slice(0, 5).map((post, index) => (
              <PostItem
                key={post.id}
                post={post}
                index={index}
                total={Math.min(posts.length, 5)}
              />
            ))}
          </div>
          
          {posts.length > 5 && (
            <div className="mt-8 text-center">
              <Button
                className="bg-indigo-500 hover:bg-indigo-600 text-white font-medium px-6 py-2 rounded-lg"
                onClick={() => window.location.href = "/posts"}
              >
                Xem tất cả bài đăng
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default PostSection;
