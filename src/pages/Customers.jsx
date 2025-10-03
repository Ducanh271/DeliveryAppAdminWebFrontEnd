
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
} from "@mui/material";
import api from "../api";

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  const fetchCustomers = async (pageNumber) => {
    setLoading(true);
    try {
      const res = await api.get(`/admin/customers?page=${pageNumber}&limit=10`);
      setCustomers(res.data.users || []);
      setPagination(res.data.pagination || {});
    } catch (err) {
      console.error("Failed to fetch customers:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers(page);
  }, [page]);

  const handlePageChange = (_, value) => {
    setPage(value);
  };


  const handleBanUnban = async (id, isBanned) => {
    try {
      if (isBanned) {
        await api.post(`/admin/customers/unban-customer/${id}`);
      } else {
        await api.post(`/admin/customers/ban-customer/${id}`);
      }

      // ✅ Cập nhật trực tiếp trạng thái user trong state (không fetch lại toàn trang)
      setCustomers((prev) =>
        prev.map((u) =>
          u.id === id ? { ...u, status: isBanned ? 1 : 2 } : u
        )
      );
    } catch (err) {
      console.error("Failed to update customer status:", err);
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

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
        Customer Management
      </Typography>

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
                <TableCell align="center">User ID</TableCell>
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
              {customers.map((user) => (
                <TableRow key={user.id} hover>
                  <TableCell align="center">{user.id}</TableCell>
                  <TableCell align="center">{user.name}</TableCell>
                  <TableCell align="center">{user.email}</TableCell>
                  <TableCell align="center">{user.phone}</TableCell>
                  <TableCell align="center">{user.address}</TableCell>
                  <TableCell align="center">{user.role}</TableCell>
                  <TableCell align="center">
                    {renderStatusChip(user.status)}
                  </TableCell>
                  <TableCell align="center">
                    {user.status === 2 ? (
                      <Button
                        variant="contained"
                        color="success"
                        size="small"
                        onClick={() => handleBanUnban(user.id, true)}
                      >
                        Unban
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        color="error"
                        size="small"
                        onClick={() => handleBanUnban(user.id, false)}
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
    </Box>
  );
}

export default Customers;
