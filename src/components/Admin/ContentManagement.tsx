import React, { useState, useEffect } from 'react';
import { Comment as CommentType } from '../../types';
import { AdminService } from '../../services/adminService';

const ContentManagement: React.FC = () => {
  const [comments, setComments] = useState<CommentType[]>([]);

  useEffect(() => {
    const fetchComments = async () => {
      const commentList = await AdminService.getComments();
      setComments(commentList as unknown as CommentType[]);
    };
    fetchComments();
  }, []);

  const handleDelete = async (commentId: string) => {
    await AdminService.deleteComment(commentId);
    setComments(comments.filter(comment => comment.id !== commentId));
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Content Management</h2>
      <div className="space-y-4">
        {comments.map(comment => (
          <div key={comment.id} className="p-4 border rounded">
            <p>{comment.content}</p>
            <p className="text-sm text-gray-600">By {comment.authorName}</p>
            <button onClick={() => handleDelete(comment.id)} className="mt-2 px-4 py-2 bg-red-500 text-white rounded">Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContentManagement;
