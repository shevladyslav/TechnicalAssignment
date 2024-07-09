import { useMemo, useState, useEffect } from 'react';
import {
  MRT_EditActionButtons,
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Tooltip,
} from '@mui/material';
import axios from 'axios';
import dayjs from 'dayjs';

import CustomDatePicker from '../components/CustomDatePicker';

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const baseURL = 'http://127.0.0.1:5000/';

const Books = () => {
  const [validationErrors, setValidationErrors] = useState({});
  const [books, setBooks] = useState([]);
  const [publishedDate, setPublishedDate] = useState(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get(`${baseURL}api/v1/books`);
        setBooks(response.data);
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    };

    fetchBooks();
  }, []);

  const columns = useMemo(
    () => [
      {
        accessorKey: 'id',
        header: 'Id',
        enableEditing: false,
        size: 80,
      },
      {
        accessorKey: 'title',
        header: 'Title',
      },
      {
        accessorKey: 'author',
        header: 'Author',
      },
      {
        accessorKey: 'isbn',
        header: 'ISBN',
      },
      {
        accessorKey: 'pages',
        header: 'Pages',
      },
      {
        accessorKey: 'published_date',
        header: 'Published date',
        Edit: ({ cell, column, row, table }) => (
          <CustomDatePicker onChange={(date) => setPublishedDate(date)} />
        ),
      },
    ],
    [validationErrors]
  );

  const handleCreateBook = async ({ values, table }) => {
    try {
      const formattedDate = publishedDate ? dayjs(publishedDate).format('YYYY-MM-DD') : null;

      const dataToSend = {
        ...values,
        published_date: formattedDate,
      };

      const response = await axios.post(`${baseURL}api/v1/books`, dataToSend);
      table.setCreatingRow(null);
    } catch (error) {
      setValidationErrors({ submit: 'Failed to create book' });
    }
  };

  const openDeleteConfirmModal = (row) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      // deleteBook(row.original.id);
    }
  };

  const table = useMaterialReactTable({
    columns,
    data: books,
    createDisplayMode: 'modal',
    editDisplayMode: 'modal',
    enableEditing: true,
    getRowId: (row) => row.id,
    onCreatingRowCancel: () => setValidationErrors({}),
    onCreatingRowSave: handleCreateBook,
    onEditingRowCancel: () => setValidationErrors({}),
    renderCreateRowDialogContent: ({ table, row, internalEditComponents }) => (
      <>
        <DialogTitle variant="h3">Create New Book</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {internalEditComponents}
        </DialogContent>
        <DialogActions>
          <MRT_EditActionButtons variant="text" table={table} row={row} />
        </DialogActions>
      </>
    ),
    renderEditRowDialogContent: ({ table, row, internalEditComponents }) => (
      <>
        <DialogTitle variant="h3">Edit Book</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {internalEditComponents}
        </DialogContent>
        <DialogActions>
          <MRT_EditActionButtons variant="text" table={table} row={row} />
        </DialogActions>
      </>
    ),
    renderRowActions: ({ row, table }) => (
      <Box sx={{ display: 'flex', gap: '1rem' }}>
        <Tooltip title="Edit">
          <IconButton onClick={() => table.setEditingRow(row)}>
            <EditIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete">
          <IconButton color="error" onClick={() => openDeleteConfirmModal(row)}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </Box>
    ),
    renderTopToolbarCustomActions: ({ table }) => (
      <Button
        variant="contained"
        onClick={() => {
          table.setCreatingRow(true);
        }}
      >
        Create New Book
      </Button>
    ),
  });

  return <MaterialReactTable table={table} />;
};

export default Books;