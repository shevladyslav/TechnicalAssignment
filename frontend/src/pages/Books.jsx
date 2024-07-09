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
  const [bookAction, setBookAction] = useState(0);

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
  }, [bookAction]);

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
        muiEditTextFieldProps: {
          required: true,
          error: !!validationErrors?.title,
          helperText: validationErrors?.title,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              title: undefined,
            }),
        },
      },
      {
        accessorKey: 'author',
        header: 'Author',
        muiEditTextFieldProps: {
          required: true,
          error: !!validationErrors?.author,
          helperText: validationErrors?.author,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              author: undefined,
            }),
        },
      },
      {
        accessorKey: 'isbn',
        header: 'ISBN',
        muiEditTextFieldProps: {
          required: true,
          error: !!validationErrors?.isbn,
          helperText: validationErrors?.isbn,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              isbn: undefined,
            }),
        },
      },
      {
        accessorKey: 'pages',
        header: 'Pages',
        muiEditTextFieldProps: {
          required: true,
          error: !!validationErrors?.pages,
          helperText: validationErrors?.pages,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              pages: undefined,
            }),
        },
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
    const newValidationErrors = validateBook(values);
    if (Object.values(newValidationErrors).some((error) => error)) {
      setValidationErrors(newValidationErrors);
      return;
    }

    try {
      const formattedDate = publishedDate ? dayjs(publishedDate).format('YYYY-MM-DD') : null;

      const dataToSend = {
        ...values,
        published_date: formattedDate,
      };

      const response = await axios.post(`${baseURL}api/v1/books`, dataToSend);
      table.setCreatingRow(null);
      setBookAction(bookAction + 1);
    } catch (error) {
      setValidationErrors({ submit: 'Failed to create book' });
    }
  };

  const deleteBook = async (id) => {
    try {
      await axios.delete(`${baseURL}api/v1/books/${id}`);
      setBookAction(bookAction + 1);
    } catch (error) {
      console.error('Error deleting book:', error);
    }
  };

  const openDeleteConfirmModal = (row) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      deleteBook(row.original.id);
    }
  };

  const handleSaveBook = async ({ values, table }) => {
    const newValidationErrors = validateBook(values);
    if (Object.values(newValidationErrors).some((error) => error)) {
      setValidationErrors(newValidationErrors);
      return;
    }

    try {
      const formattedDate = publishedDate ? dayjs(publishedDate).format('YYYY-MM-DD') : null;

      const dataToSend = {
        ...values,
        published_date: formattedDate,
      };

      const response = await axios.put(`${baseURL}api/v1/books/${values.id}`, dataToSend);
      table.setEditingRow(null);
      setBookAction(bookAction + 1);
    } catch (error) {
      setValidationErrors({ submit: 'Failed to update book' });
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
    onEditingRowSave: handleSaveBook,
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

const validateRequired = (value) => !!value && !!value.length;
const validateInteger = (value) => Number.isInteger(Number(value));

const validatePages = (value) => {
  if (value === null || value === undefined || value === '') {
    return 'Pages is Required';
  }
  if (!validateInteger(value)) {
    return 'Pages must be an integer';
  }
  return '';
};

function validateBook(book) {
  return {
    title: !validateRequired(book.title) ? 'Title is Required' : '',
    author: !validateRequired(book.author) ? 'Author is Required' : '',
    isbn: !validateRequired(book.isbn) ? 'ISBN is Required' : '',
    pages: validatePages(book.pages),
  };
}
