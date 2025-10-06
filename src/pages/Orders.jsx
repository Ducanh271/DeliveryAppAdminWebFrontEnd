
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
  Avatar,
  Pagination,
  Chip,
  CircularProgress,
  Button,
  Snackbar,
  Alert,
  TextField,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import api from "../api";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });

  // 🔹 Lấy danh sách đơn hàng
  const fetchOrders = async (pageNumber) => {
    setLoading(true);
    try {
      const query = search ? `&search=${encodeURIComponent(search)}` : "";
      const res = await api.get(`/admin/orders?page=${pageNumber}&limit=10${query}`);
      setOrders(res.data.orders || []);
      setPagination(res.data.pagination || {});
    } catch (err) {
      console.error("Failed to fetch orders:", err);
      setMessage({ text: "Không thể tải danh sách đơn hàng", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(1);
  }, [search]);

  const handlePageChange = (_, value) => {
    setPage(value);
    fetchOrders(value);
  };

  // 🔹 Nhận đơn
  const handleAcceptOrder = async (orderId) => {
    try {
      await api.post(`/admin/orders/accept-order/${orderId}`);
      setMessage({ text: "Đã nhận đơn thành công!", type: "success" });
      fetchOrders(page);
    } catch (err) {
      console.error("Failed to accept order:", err);
      setMessage({ text: "Lỗi khi nhận đơn", type: "error" });
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("vi-VN");
  };

  // 🔹 Hiển thị trạng thái đơn hàng
  const renderStatusChip = (status) => {
    const colorMap = {
      paid: "success",
      unpaid: "warning",
      cancelled: "error",
      shipped: "info",
      delivered: "success",
      pending: "default",
      processing: "primary",
      shipping: "info",
    };
    const color = colorMap[status] || "default";
    const display = status.charAt(0).toUpperCase() + status.slice(1);
    return (
      <Chip
        label={display}
        color={color}
        variant="filled"
        size="small"
        sx={{
          fontWeight: 600,
          color:
            status === "pending"
              ? "#555"
              : status === "processing"
                ? "#1976d2"
                : "white",
          backgroundColor:
            status === "pending"
              ? "#f5f5f5"
              : status === "processing"
                ? "#e3f2fd"
                : undefined,
        }}
      />
    );
  };

  return (
    <Box sx={{ p: 2 }}>
      {/* Tiêu đề + Tìm kiếm */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          Quản lý Đơn hàng
        </Typography>
        <TextField
          size="small"
          placeholder="Tìm theo Order ID hoặc User ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
          sx={{ width: 280 }}
        />
      </Box>

      {/* Loading */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh" }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper} elevation={3}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center">Ảnh</TableCell>
                <TableCell align="center">Mã đơn</TableCell>
                <TableCell align="center">User ID</TableCell>
                <TableCell align="center">Tổng tiền (₫)</TableCell>
                <TableCell align="center">Thanh toán</TableCell>
                <TableCell align="center">Trạng thái</TableCell>
                <TableCell align="center">Ngày tạo</TableCell>
                <TableCell align="center">Hành động</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {orders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                    Không có đơn hàng nào
                  </TableCell>
                </TableRow>
              ) : (
                orders.map((order) => (
                  <TableRow key={order.id} hover>
                    <TableCell align="center">
                      <Avatar
                        src={order.thumbnail}
                        variant="rounded"
                        sx={{ width: 56, height: 56, margin: "0 auto" }}
                      />
                    </TableCell>
                    <TableCell align="center">#{order.id}</TableCell>
                    <TableCell align="center">{order.user_id}</TableCell>
                    <TableCell align="center">
                      {order.total_amount.toLocaleString("vi-VN")}
                    </TableCell>
                    <TableCell align="center">
                      {renderStatusChip(order.payment_status)}
                    </TableCell>
                    <TableCell align="center">
                      {renderStatusChip(order.order_status)}
                    </TableCell>
                    <TableCell align="center">{formatDate(order.created_at)}</TableCell>
                    <TableCell align="center">
                      {order.order_status === "pending" ? (
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          onClick={() => handleAcceptOrder(order.id)}
                        >
                          Nhận đơn
                        </Button>
                      ) : order.order_status === "cancelled" ? (
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          disabled
                        >
                          Không nhận
                        </Button>
                      ) : (
                        <Button
                          variant="outlined"
                          color="success"
                          size="small"
                          disabled
                        >
                          Đã nhận
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Phân trang */}
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

      {/* Snackbar thông báo */}
      <Snackbar
        open={!!message.text}
        autoHideDuration={3000}
        onClose={() => setMessage({ text: "", type: "" })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert severity={message.type}>{message.text}</Alert>
      </Snackbar>
    </Box>
  );
}

export default Orders;
