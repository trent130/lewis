import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  TextField,
  Box,
  Avatar,
  Divider,
} from '@mui/material';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';

const ForumPost = ({ post, onUpdate }) => {
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [comment, setComment] = useState('');
  const { user } = useAuth();

  const handleAddComment = async () => {
    try {
      await api.post(`/api/forum/posts/${post.id}/comments/`, {
        content: comment,
      });
      setComment('');
      setShowCommentForm(false);
      onUpdate();
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar src={post.author.profile_picture} />
          <Box sx={{ ml: 2 }}>
            <Typography variant="subtitle1">
              {post.author.first_name} {post.author.last_name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
            </Typography>
          </Box>
        </Box>

        <Typography variant="h6" gutterBottom>
          {post.title}
        </Typography>
        <Typography variant="body1" paragraph>
          {post.content}
        </Typography>

        <Divider sx={{ my: 2 }} />

        {post.comments.map((comment) => (
          <Box key={comment.id} sx={{ mt: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar
                src={comment.author.profile_picture}
                sx={{ width: 24, height: 24 }}
              />
              <Typography variant="subtitle2" sx={{ ml: 1 }}>
                {comment.author.first_name} {comment.author.last_name}
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ mt: 1, ml: 4 }}>
              {comment.content}
            </Typography>
          </Box>
        ))}
      </CardContent>

      <CardActions>
        {user && (
          <>
            <Button
              size="small"
              onClick={() => setShowCommentForm(!showCommentForm)}
            >
              Add Comment
            </Button>
          </>
        )}
      </CardActions>

      {showCommentForm && (
        <Box sx={{ p: 2 }}>
          <TextField
            fullWidth
            multiline
            rows={2}
            placeholder="Write a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <Box sx={{ mt: 1, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              size="small"
              onClick={() => setShowCommentForm(false)}
              sx={{ mr: 1 }}
            >
              Cancel
            </Button>
            <Button
              size="small"
              variant="contained"
              onClick={handleAddComment}
            >
              Post Comment
            </Button>
          </Box>
        </Box>
      )}
    </Card>
  );
};

export default ForumPost;
