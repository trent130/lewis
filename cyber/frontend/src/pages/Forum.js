import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Button,
  Grid,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import ForumPost from '../components/forum/ForumPost';
import { api } from '../services/api';

const Forum = () => {
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '' });
  const { user } = useAuth();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await api.get('/api/forum/posts/');
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const handleCreatePost = async () => {
    try {
      await api.post('/api/forum/posts/', newPost);
      setOpen(false);
      setNewPost({ title: '', content: '' });
      fetchPosts();
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h4" gutterBottom>
            Community Forum
          </Typography>
          {user && (
            <Button
              variant="contained"
              color="primary"
              onClick={() => setOpen(true)}
              sx={{ mb: 3 }}
            >
              Create New Post
            </Button>
          )}
        </Grid>

        {posts.map((post) => (
          <Grid item xs={12} key={post.id}>
            <ForumPost post={post} onUpdate={fetchPosts} />
          </Grid>
        ))}
      </Grid>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Post</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Title"
            fullWidth
            value={newPost.title}
            onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Content"
            fullWidth
            multiline
            rows={4}
            value={newPost.content}
            onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleCreatePost} variant="contained">
            Post
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Forum;