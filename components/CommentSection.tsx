"use client";

import { useEffect, useState } from "react";

interface CommentSectionProps {
  videoId: string;
}

export default function CommentSection({ videoId }: CommentSectionProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    console.log("Stored User:", storedUser);
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);
  useEffect(() => {
    if (videoId) {
      fetchComments();
    }
  }, [videoId]);
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    setMounted(true);
  }, []);

  const fetchComments = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/comment/${videoId}`,
      );

      const data = await res.json();
      console.log("Comments API:", data);

      setComments(Array.isArray(data) ? data : []);
    } catch (error) {
      console.log(error);
    }
  };

  const addComment = async () => {
    if (!user?._id) {
      alert("please login first");
      return;
    }
    if (!comment.trim()) return;

    const specialCharRegex = /[!@#$%^&*()_+\=\[\]{};':"\\|,.<>\/?]+/;

    if (specialCharRegex.test(comment)) {
      alert("Special characters are not allowed");
      return;
    }

    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/comment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          videoId,
          userId: user?._id,
          text: comment,
          city: localStorage.getItem("city") || "Unknown",
        }),
      });
      console.log({ videoId, userId: user?._id, text: comment });

      setComment("");

      fetchComments();
    } catch (error) {
      console.log(error);
    }
  };

  const likeComment = async (commentId: string) => {
    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/comment/${commentId}/like`,
        {
          method: "PUT",
        },
      );
      fetchComments();
    } catch (error) {
      console.log(error);
    }
  };
  const dislikeComment = async (commentId: string) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/comment/${commentId}/dislike`,
        {
          method: "PUT",
        },
      );

      const data = await res.json();

      console.log("Dislike Response:", data);

      if (!res.ok) {
        alert(data.message);
        return;
      }

      fetchComments();
    } catch (error) {
      console.log(error);
    }
  };

  const translateComment = (index: number) => {
    const updated = [...comments];

    const translations: Record<string, string> = {
      ನಮಸ್ಕಾರ: "Hello",
      ಹೇಗಿದ್ದೀರಾ: "How are you?",
      हैलो: "Hello",
      नमस्ते: "Hello",
      வணக்கம்: "Hello",
      హలో: "Hello",
    };

    updated[index].translated = true;
    updated[index].translatedText =
      translations[updated[index].text] || `Translated: ${updated[index].text}`;

    setComments(updated);
  };
  const deleteComment = async (id: string) => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/comment/${id}`, {
      method: "DELETE",
    });
    fetchComments();
  };
  const editComment = async (id: string) => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/comment/${id}/edit`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: editText }),
      });
      setEditingId("");
      setEditText("");
      fetchComments();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="mt-8 rounded-3xl border border-slate-800 bg-slate-900/60 backdrop-blur-xl p-6">
      <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
        💬 Comments
        <span className="text-lg text-gray-400">({comments.length})</span>
      </h2>

      {/* Comment Input */}

      <div
        className="
rounded-3xl
border
border-slate-800
bg-slate-900/70
backdrop-blur-xl
p-6
mb-8
"
      >
        <div className="flex gap-4">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-lg font-bold">
            {mounted && user ? user.username.charAt(0).toUpperCase() : ""}
          </div>

          <div className="flex-1">
            <textarea
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add a public comment..."
              className="
w-full
rounded-2xl
bg-slate-800/60
border
border-slate-700
p-5
resize-none
outline-none
focus:border-blue-500
focus:ring-2
focus:ring-blue-500/30
transition
"
            />

            <div className="flex justify-end mt-4">
              <button
                onClick={addComment}
                className="
h-11
px-8
rounded-full
bg-gradient-to-r
from-blue-600
to-cyan-500
hover:scale-105
transition
font-semibold
shadow-lg
"
              >
                Post
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Comments */}

      <div className="space-y-5 hover:scale-[1.01]">
        {comments.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            💬 No comments yet.
            <br />
            Be the first to comment.
          </div>
        )}
        {comments.map((c: any, index: number) => (
          <div
            key={c._id}
            className="
relative
overflow-visible
rounded-3xl
border
border-slate-800
bg-slate-900/60
backdrop-blur
p-6
hover:border-blue-500/40
transition
"
          >
            <div className="flex gap-4">
              {/* Avatar */}

              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-lg font-bold">
                {c.userName?.charAt(0)?.toUpperCase() || "U"}
              </div>

              {/* Content */}

              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-semibold text-lg">
                    {c.userName || "Anonymous"}
                  </h3>

                  <span className="text-xs bg-blue-600/20 text-blue-400 px-3 py-1 rounded-full">
                    📍 {c.city}
                  </span>

                  <span className="text-xs text-gray-500">
                    {c.createdAt
                      ? new Date(c.createdAt).toLocaleDateString()
                      : ""}
                  </span>
                </div>

                {/* Comment */}

                {editingId === c._id ? (
                  <textarea
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="
w-full
mt-4
rounded-2xl
bg-slate-800/70
border
border-slate-700
p-4
outline-none
focus:border-blue-500
transition-all
"
                  />
                ) : (
                  <p
                    className="
mt-4
text-[15px]
leading-8
text-gray-300
"
                  >
                    {c.translated ? c.translatedText : c.text}
                  </p>
                )}

                {/* Buttons */}

                <div className="mt-5 flex items-center justify-between">
                  <button
                    onClick={() => likeComment(c._id)}
                    className="flex items-center gap-2 px-4 h-10 rounded-full bg-slate-800 hover:bg-slate-700 transition"
                  >
                    👍
                    <span>{c.likes || 25}</span>
                  </button>
                  <div className="relative">
                    <button
                      onClick={() => dislikeComment(c._id)}
                      className="w-11 h-11 rounded-full bg-slate-800 hover:bg-slate-700 transition"
                    >
                      👎
                    </button>
                  </div>

                  <div className="relative">
                    <button
                      onClick={() =>
                        setMenuOpen(menuOpen === c._id ? null : c._id)
                      }
                      className="w-11 h-11 rounded-full bg-slate-800 hover:bg-slate-700 transition"
                    >
                      ⋮
                    </button>
                    {menuOpen === c._id && (
                      <div
                        className="absolute
right-0
bottom-12
z-[999] w-44 rounded-xl bg-slate-900 border border-slate-700 shadow-xl z-50"
                      >
                        <button
                          onClick={() => {
                            translateComment(index);
                            setMenuOpen(null);
                          }}
                          className="w-full text-left px-4 py-3 hover:bg-slate-800"
                        >
                          🌐 Translate
                        </button>

                        {editingId === c._id ? (
                          <div className="mt-4">
                            <textarea
                              value={editText}
                              onChange={(e) => setEditText(e.target.value)}
                              className="
w-full
rounded-2xl
bg-slate-800/70
border
border-slate-700
p-4
outline-none
focus:border-blue-500
transition-all
"
                            />

                            <div className="flex justify-end gap-3 mt-4">
                              <button
                                onClick={() => {
                                  setEditingId(null);
                                  setEditText("");
                                }}
                                className="
px-5
py-2
rounded-full
bg-slate-700
hover:bg-slate-600
transition
"
                              >
                                Cancel
                              </button>

                              <button
                                onClick={() => editComment(c._id)}
                                className="
px-5
py-2
rounded-full
bg-blue-600
hover:bg-blue-500
transition
"
                              >
                                Save
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              setEditingId(c._id);
                              setEditText(c.text);
                              setMenuOpen(null);
                            }}
                            className="w-full text-left px-4 py-3 hover:bg-slate-800"
                          >
                            ✏ Edit
                          </button>
                        )}

                        <button
                          onClick={() => {
                            deleteComment(c._id);
                            setMenuOpen(null);
                          }}
                          className="w-full text-left px-4 py-3 hover:bg-red-600"
                        >
                          🗑 Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
