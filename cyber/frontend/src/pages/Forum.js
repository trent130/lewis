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
  Box,
  Alert,
  CircularProgress,
  Chip,
  InputAdornment,
  IconButton,
  Divider,
  Paper,
  useTheme,
  Tabs,
  Tab,
  MenuItem, 
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import ForumPost from '../components/forum/ForumPost';
import { api } from '../services/api';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import FilterListIcon from '@mui/icons-material/FilterList';
import SortIcon from '@mui/icons-material/Sort';
import ForumIcon from '@mui/icons-material/Forum';

const Forum = () => {
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '', category: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const { user } = useAuth();
  const theme = useTheme();

  const categories = [
    'General',
    'Support',
    'Research',
    'Events',
    'Questions',
  ];

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/forum/posts/');
      setPosts(response.data);
      setError('');
    } catch (err) {
      setError('Failed to load posts. Please try again later.');
      console.error('Error fetching posts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async () => {
    if (!newPost.title.trim() || !newPost.content.trim()) {
      return;
    }

    try {
      setLoading(true);
      await api.post('/api/forum/posts/', newPost);
      setOpen(false);
      setNewPost({ title: '', content: '', category: '' });
      await fetchPosts();
    } catch (err) {
      setError('Failed to create post. Please try again.');
      console.error('Error creating post:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredPosts = posts
    .filter(post => {
      const matchesSearch = 
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.content.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = category === 'all' || post.category === category;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.created_at) - new Date(a.created_at);
      }
      return b.comments.length - a.comments.length;
    });

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 8 }}>
        {/* Header Section */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <ForumIcon 
            sx={{ 
              fontSize: 60, 
              color: theme.palette.primary.main,
              mb: 2 
            }} 
          />
          <Typography
            variant="h2"
            gutterBottom
            sx={{
              fontWeight: 700,
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
            }}
          >
            Community Forum
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ maxWidth: 800, mx: 'auto', mb: 4 }}
          >
            Connect, share, and learn from our community members
          </Typography>
        </Box>

        {error && (
          <Alert 
            severity="error" 
            sx={{ mb: 4 }}
            onClose={() => setError('')}
          >
            {error}
          </Alert>
        )}

        {/* Search and Filter Section */}
        <Paper elevation={1} sx={{ p: 3, mb: 4 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="Search posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Chip
                  label="All"
                  onClick={() => setCategory('all')}
                  color={category === 'all' ? 'primary' : 'default'}
                />
                {categories.map((cat) => (
                  <Chip
                    key={cat}
                    label={cat}
                    onClick={() => setCategory(cat)}
                    color={category === cat ? 'primary' : 'default'}
                  />
                ))}
              </Box>
            </Grid>
          </Grid>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Chip
                icon={<SortIcon />}
                label="Newest"
                onClick={() => setSortBy('newest')}
                color={sortBy === 'newest' ? 'primary' : 'default'}
              />
              <Chip
                icon={<SortIcon />}
                label="Most Active"
                onClick={() => setSortBy('active')}
                color={sortBy === 'active' ? 'primary' : 'default'}
              />
            </Box>
            {user && (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setOpen(true)}
              >
                Create Post
              </Button>
            )}
          </Box>
        </Paper>

        {/* Posts Grid */}
        <Grid container spacing={3}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : filteredPosts.length > 0 ? (
            filteredPosts.map((post) => (
              <Grid item xs={12} key={post.id}>
                <ForumPost post={post} onUpdate={fetchPosts} />
              </Grid>
            ))
          ) : (
            <Box sx={{ textAlign: 'center', width: '100%', py: 4 }}>
              <Typography variant="h6" color="text.secondary">
                No posts found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {searchTerm
                  ? 'Try adjusting your search terms'
                  : 'Be the first to start a discussion!'}
              </Typography>
            </Box>
          )}
        </Grid>

        {/* Create Post Dialog */}
        <Dialog 
          open={open} 
          onClose={() => setOpen(false)} 
          maxWidth="md" 
          fullWidth
        >
          <DialogTitle>
            <Typography variant="h6" component="div">
              Create New Post
            </Typography>
          </DialogTitle>
          <DialogContent>
            <Box sx={{ mt: 2 }}>
              <TextField
                autoFocus
                fullWidth
                label="Title"
                value={newPost.title}
                onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                sx={{ mb: 2 }}
              />
              <TextField
                select
                fullWidth
                label="Category"
                value={newPost.category}
                onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
                sx={{ mb: 2 }}
              >
                {categories.map((cat) => (
                  <MenuItem key={cat} value={cat}>
                    {cat}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                fullWidth
                label="Content"
                multiline
                rows={6}
                value={newPost.content}
                onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
              />
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button 
              onClick={() => {
                setOpen(false);
                setNewPost({ title: '', content: '', category: '' });
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleCreatePost}
              disabled={!newPost.title.trim() || !newPost.content.trim() || !newPost.category}
            >
              Post
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default Forum;