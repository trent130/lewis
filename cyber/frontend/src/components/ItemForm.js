import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
  IconButton,
  useTheme,
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

const ItemForm = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const theme = useTheme();

  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .min(2, 'Name must be at least 2 characters')
        .max(50, 'Name must be 50 characters or less')
        .required('Name is required'),
      description: Yup.string()
        .min(10, 'Description must be at least 10 characters')
        .max(500, 'Description must be 500 characters or less')
        .required('Description is required'),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      setError('');
      try {
        await axios.post('http://localhost:8000/api/items/', values);
        navigate('/');
      } catch (err) {
        setError(
          err.response?.data?.message || 
          'An error occurred while creating the item. Please try again.'
        );
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          mt: 4,
          mb: 4,
          position: 'relative',
        }}
      >
        <IconButton
          onClick={() => navigate(-1)}
          sx={{
            position: 'absolute',
            left: 0,
            top: 0,
            color: 'primary.main',
          }}
        >
          <ArrowBackIcon />
        </IconButton>

        <Paper
          elevation={3}
          sx={{
            p: 4,
            mt: 4,
            borderRadius: 2,
            backgroundColor: 'background.paper',
            transition: 'transform 0.3s ease-in-out',
            '&:hover': {
              transform: 'translateY(-4px)',
            },
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              mb: 4,
            }}
          >
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: '50%',
                backgroundColor: 'primary.main',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                mb: 2,
              }}
            >
              <AddCircleOutlineIcon sx={{ color: 'white', fontSize: 30 }} />
            </Box>
            <Typography component="h1" variant="h5" fontWeight="bold">
              Add New Item
            </Typography>
          </Box>

          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                mb: 3,
                animation: 'fadeIn 0.5s ease-in',
                '@keyframes fadeIn': {
                  '0%': { opacity: 0, transform: 'translateY(-10px)' },
                  '100%': { opacity: 1, transform: 'translateY(0)' },
                },
              }}
            >
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={formik.handleSubmit}>
            <TextField
              fullWidth
              margin="normal"
              name="name"
              label="Item Name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
              disabled={loading}
              sx={{ mb: 3 }}
            />

            <TextField
              fullWidth
              multiline
              rows={4}
              margin="normal"
              name="description"
              label="Description"
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.description && Boolean(formik.errors.description)}
              helperText={formik.touched.description && formik.errors.description}
              disabled={loading}
              sx={{ mb: 3 }}
            />

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                onClick={() => navigate(-1)}
                disabled={loading}
                sx={{
                  px: 4,
                  py: 1.5,
                }}
              >
                Cancel
              </Button>
              
              <Button
                type="submit"
                variant="contained"
                disabled={loading || !formik.isValid || !formik.dirty}
                sx={{
                  px: 4,
                  py: 1.5,
                  position: 'relative',
                  '&:disabled': {
                    backgroundColor: theme.palette.action.disabledBackground,
                  },
                }}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Add Item'
                )}
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default ItemForm;
