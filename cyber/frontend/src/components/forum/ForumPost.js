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
  IconButton,
  Collapse,
  Chip,
  Alert,
  CircularProgress,
  useTheme,
} from '@mui/material';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import CommentIcon from '@mui/icons-material/Comment';
import ShareIcon from '@mui/icons-material/Share';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import MoreVertIcon from '@mui/icons-material/MoreVert';

const ForumPost = ({ post, onUpdate }) => {
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [liked, setLiked] = useState(false);
  const { user } = useAuth();
  const theme = useTheme();

  const handleAddComment = async () => {
    if (!comment.trim()) return;
    
    setLoading(true);
    setError('');
    
    try {
      await api.post(`/api/forum/posts/${post.id}/comments/`, {
        content: comment.trim(),
      });
      setComment('');
      setShowCommentForm(false);
      onUpdate();
    } catch (err) {
      setError(err.response?.data?.message || 'Error adding comment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    // You could add a toast notification here
  };

  const handleLike = async () => {
    try {
      await api.post(`/api/forum/posts/${post.id}/like/`);
      setLiked(!liked);
      onUpdate();
    } catch (err) {
      console.error('Error liking post:', err);
    }
  };

  return (
    <Card
      elevation={2}
      sx={{
        mb: 3,
        borderRadius: 2,
        transition: 'transform 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-2px)',
        },
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar
              src={post.author.profile_picture}
              sx={{
                width: 48,
                height: 48,
                border: `2px solid ${theme.palette.primary.main}`,
              }}
            />
            <Box sx={{ ml: 2 }}>
              <Typography variant="subtitle1" fontWeight="bold">
                {post.author.first_name} {post.author.last_name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
              </Typography>
            </Box>
          </Box>
          <IconButton size="small">
            <MoreVertIcon />
          </IconButton>
        </Box>

        <Typography 
          variant="h6" 
          gutterBottom
          sx={{ 
            fontWeight: 600,
            color: theme.palette.primary.main 
          }}
        >
          {post.title}
        </Typography>
        
        <Typography 
          variant="body1" 
          paragraph
          sx={{ 
            lineHeight: 1.7,
            color: theme.palette.text.primary 
          }}
        >
          {post.content}
        </Typography>

        {post.tags && post.tags.length > 0 && (
          <Box sx={{ mt: 2, mb: 3 }}>
            {post.tags.map((tag) => (
              <Chip
                key={tag}
                label={tag}
                size="small"
                sx={{ mr: 1, mb: 1 }}
              />
            ))}
          </Box>
        )}

        <Divider sx={{ my: 2 }} />

        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            {post.comments.length} Comments
          </Typography>
          {post.comments.map((comment) => (
            <Box 
              key={comment.id} 
              sx={{ 
                mt: 2,
                p: 2,
                backgroundColor: theme.palette.action.hover,
                borderRadius: 1,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar
                  src={comment.author.profile_picture}
                  sx={{ width: 32, height: 32 }}
                />
                <Box sx={{ ml: 1 }}>
                  <Typography variant="subtitle2">
                    {comment.author.first_name} {comment.author.last_name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                  </Typography>
                </Box>
              </Box>
              <Typography 
                variant="body2" 
                sx={{ 
                  mt: 1,
                  ml: 5,
                  color: theme.palette.text.secondary 
                }}
              >
                {comment.content}
              </Typography>
            </Box>
          ))}
        </Box>
      </CardContent>

      <CardActions sx={{ px: 2, pb: 2 }}>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <IconButton 
            size="small" 
            onClick={handleLike}
            color={liked ? 'primary' : 'default'}
          >
            {liked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
          </IconButton>
          <IconButton 
            size="small"
            onClick={() => setShowCommentForm(!showCommentForm)}
          >
            <CommentIcon />
          </IconButton>
          <IconButton size="small" onClick={handleShare}>
            <ShareIcon />
          </IconButton>
        </Box>
      </CardActions>

      <Collapse in={showCommentForm}>
        <Box sx={{ p: 2, pt: 0 }}>
          {error && (
            <Alert 
              severity="error" 
              sx={{ mb: 2 }}
              onClose={() => setError('')}
            >
              {error}
            </Alert>
          )}
          
          <TextField
            fullWidth
            multiline
            rows={3}
            placeholder="Write a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            disabled={loading}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              },
            }}
          />
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
            <Button
              size="small"
              onClick={() => {
                setShowCommentForm(false);
                setComment('');
                setError('');
              }}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              size="small"
              variant="contained"
              onClick={handleAddComment}
              disabled={loading || !comment.trim()}
              startIcon={loading && <CircularProgress size={16} />}
            >
              {loading ? 'Posting...' : 'Post Comment'}
            </Button>
          </Box>
        </Box>
      </Collapse>
    </Card>
  );
};

export default ForumPost;
