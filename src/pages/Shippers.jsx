
import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Chip,
  Pagination,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  Alert,
} from "@mui/material";
import api from "../api";

function Shippers() {
  const [shippers, setShippers] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [openDialog, setOpenDialog] = useState(false);
  const [newShipper, setNewShipper] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    password: "",
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const fetchShippers = async (pageNumber) => {
    setLoading(true);
    try {
      const res = await api.get(`/admin/shippers?page=${pageNumber}&limit=10`);
      setShippers(res.data.users || []);
      setPagination(res.data.pagination || {});
    } catch (err) {
      console.error("Failed to fetch shippers:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShippers(page);
  }, [page]);

  const handlePageChange = (_, value) => {
    setPage(value);
  };

  const handleBanUnban = async (id, isBanned) => {
    try {
      if (isBanned) {
        await api.post(`/admin/shippers/unban-shipper/${id}`);
      } else {
        await api.post(`/admin/shippers/ban-shipper/${id}`);
      }
      fetchShippers(page);
    } catch (err) {
      console.error("Failed to update shipper status:", err);
    }
  };

  const renderStatusChip = (status) => {
    switch (status) {
      case 0:
        return <Chip label="Inactive" color="default" variant="outlined" />;
      case 1:
        return <Chip label="Active" color="success" variant="outlined" />;
      case 2:
        return <Chip label="Banned" color="error" variant="outlined" />;
      default:
        return <Chip label="Unknown" variant="outlined" />;
    }
  };

  const handleInputChange = (e) => {
    setNewShipper({ ...newShipper, [e.target.name]: e.target.value });
  };

  const handleCreateShipper = async () => {
    try {
      await api.post("/admin/create-shipper", newShipper);
      setSnackbar({
        open: true,
        message: "Shipper created successfully!",
        severity: "success",
      });
      setOpenDialog(false);
      setNewShipper({ name: "", email: "", phone: "", address: "", password: "" });
      fetchShippers(page); // refresh danh sách
    } catch (err) {
      console.error("Failed to create shipper:", err);
      setSnackbar({
        open: true,
        message: "Failed to create shipper.",
        severity: "error",
      });
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      {/* Header + Nút thêm shipper */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          Shipper Management
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpenDialog(true)}
        >
          + Add Shipper
        </Button>
      </Box>

      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "60vh",
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper} elevation={3}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center">Shipper ID</TableCell>
                <TableCell align="center">Name</TableCell>
                <TableCell align="center">Email</TableCell>
                <TableCell align="center">Phone</TableCell>
                <TableCell align="center">Address</TableCell>
                <TableCell align="center">Role</TableCell>
                <TableCell align="center">Status</TableCell>
                <TableCell align="center">Action</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {shippers.map((shipper) => (
                <TableRow key={shipper.id} hover>
                  <TableCell align="center">{shipper.id}</TableCell>
                  <TableCell align="center">{shipper.name}</TableCell>
                  <TableCell align="center">{shipper.email}</TableCell>
                  <TableCell align="center">{shipper.phone}</TableCell>
                  <TableCell align="center">{shipper.address}</TableCell>
                  <TableCell align="center">{shipper.role}</TableCell>
                  <TableCell align="center">
                    {renderStatusChip(shipper.status)}
                  </TableCell>
                  <TableCell align="center">
                    {shipper.status === 2 ? (
                      <Button
                        variant="contained"
                        color="success"
                        size="small"
                        onClick={() => handleBanUnban(shipper.id, true)}
                      >
                        Unban
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        color="error"
                        size="small"
                        onClick={() => handleBanUnban(shipper.id, false)}
                      >
                        Ban
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Pagination */}
      {pagination.total_pages > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
          <Pagination
            count={pagination.total_pages}
            page={page}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      )}

      {/* Dialog thêm shipper */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Add New Shipper</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          <TextField
            name="name"
            label="Name"
            value={newShipper.name}
            onChange={handleInputChange}
            fullWidth
          />
          <TextField
            name="email"
            label="Email"
            value={newShipper.email}
            onChange={handleInputChange}
            fullWidth
          />
          <TextField
            name="phone"
            label="Phone"
            value={newShipper.phone}
            onChange={handleInputChange}
            fullWidth
          />
          <TextField
            name="address"
            label="Address"
            value={newShipper.address}
            onChange={handleInputChange}
            fullWidth
          />
          <TextField
            name="password"
            label="Password"
            type="password"
            value={newShipper.password}
            onChange={handleInputChange}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button variant="contained" color="primary" onClick={handleCreateShipper}>
            Create
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar thông báo */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          severity={snackbar.severity}
          sx={{ width: "100%" }}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default Shippers;
