
import { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Pagination,
  Box,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  IconButton,
  Tooltip,
  Snackbar,
  Alert,
  InputAdornment,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import api from "../api";

function Products() {
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 5,
    total_pages: 1,
  });
  const [openForm, setOpenForm] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" }); // ✅ Snackbar message

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    qty_initial: "",
    qty_sold: 0,
    images: [],
  });

  // 🔹 Fetch danh sách sản phẩm (hỗ trợ search)
  const fetchProducts = async (page = 1) => {
    try {
      const query = search ? `&search=${encodeURIComponent(search)}` : "";
      const res = await api.get(`/products?page=${page}&limit=${pagination.limit}${query}`);
      setProducts(res.data.products || []);
      setPagination(res.data.pagination);
    } catch (err) {
      console.error("Error fetching products", err);
    }
  };

  useEffect(() => {
    fetchProducts(1);
  }, [search]);

  const handlePageChange = (_, value) => {
    fetchProducts(value);
  };

  // 🔹 Mở / Đóng form thêm sản phẩm
  const handleOpenForm = () => setOpenForm(true);
  const handleCloseForm = () => {
    setOpenForm(false);
    setFormData({
      name: "",
      description: "",
      price: "",
      qty_initial: "",
      qty_sold: 0,
      images: [],
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, images: e.target.files }));
  };

  // 🔹 Submit form thêm sản phẩm
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("price", formData.price);
      data.append("qty_initial", formData.qty_initial);
      data.append("qty_sold", formData.qty_sold);
      for (let i = 0; i < formData.images.length; i++) {
        data.append("images", formData.images[i]);
      }

      await api.post("/admin/create-product", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      handleCloseForm();
      setMessage({ text: "Thêm sản phẩm thành công!", type: "success" });
      fetchProducts(pagination.page);
    } catch (err) {
      console.error("Error creating product:", err);
      setMessage({ text: "Lỗi khi thêm sản phẩm", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Xóa sản phẩm
  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setOpenConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;
    setLoading(true);
    try {
      await api.delete(`/admin/products/${productToDelete.id}`);
      setOpenConfirm(false);
      setProductToDelete(null);
      setMessage({ text: "Xóa sản phẩm thành công!", type: "success" });
      fetchProducts(pagination.page);
    } catch (err) {
      console.error("Error deleting product:", err);
      setMessage({ text: "Lỗi khi xóa sản phẩm", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      {/* Tiêu đề + tìm kiếm + nút thêm */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 3, mb: 2 }}>
        <Typography variant="h4" gutterBottom>
          Quản lý Sản phẩm
        </Typography>
        <TextField
          size="small"
          placeholder="Tìm sản phẩm..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
          sx={{ width: 250 }}
        />
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpenForm}
        >
          Thêm sản phẩm
        </Button>
      </Box>

      {/* Bảng sản phẩm */}
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Ảnh</TableCell>
            <TableCell>ID</TableCell>
            <TableCell>Tên</TableCell>
            <TableCell>Mô tả</TableCell>
            <TableCell>Giá</TableCell>
            <TableCell>Số lượng</TableCell>
            <TableCell>Đã bán</TableCell>
            <TableCell align="center">Hành động</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {products.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} align="center">
                Không có sản phẩm nào
              </TableCell>
            </TableRow>
          ) : (
            products.map((p) => {
              const mainImage =
                p.images?.find((img) => img.IsMain)?.URL ||
                p.images?.[0]?.URL ||
                "";
              return (
                <TableRow key={p.id}>
                  <TableCell>
                    <Avatar src={mainImage} variant="square">
                      {p.name[0]}
                    </Avatar>
                  </TableCell>
                  <TableCell>{p.id}</TableCell>
                  <TableCell>{p.name}</TableCell>
                  <TableCell>{p.description}</TableCell>
                  <TableCell>{p.price.toLocaleString()} đ</TableCell>
                  <TableCell>{p.qty_initial}</TableCell>
                  <TableCell>{p.qty_sold}</TableCell>
                  <TableCell align="center">
                    <Tooltip title="Xóa sản phẩm">
                      <IconButton color="error" onClick={() => handleDeleteClick(p)} size="small">
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>

      {/* Phân trang */}
      <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
        <Pagination
          count={pagination.total_pages}
          page={pagination.page}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>

      {/* Dialog thêm sản phẩm */}
      <Dialog open={openForm} onClose={handleCloseForm} maxWidth="sm" fullWidth>
        <DialogTitle>Thêm sản phẩm mới</DialogTitle>
        <DialogContent>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
          >
            <TextField label="Tên sản phẩm" name="name" value={formData.name} onChange={handleChange} required />
            <TextField label="Mô tả" name="description" value={formData.description} onChange={handleChange} multiline required />
            <TextField label="Giá" name="price" value={formData.price} onChange={handleChange} type="number" required />
            <TextField label="Số lượng ban đầu" name="qty_initial" value={formData.qty_initial} onChange={handleChange} type="number" required />
            <Button variant="outlined" component="label">
              Chọn ảnh
              <input type="file" hidden multiple accept="image/*" onChange={handleFileChange} />
            </Button>
            {formData.images.length > 0 && (
              <Typography variant="body2" color="text.secondary">
                {formData.images.length} ảnh đã chọn
              </Typography>
            )}
            <DialogActions>
              <Button onClick={handleCloseForm} color="inherit">
                Hủy
              </Button>
              <Button type="submit" variant="contained" color="primary" disabled={loading}>
                {loading ? <CircularProgress size={20} /> : "Thêm"}
              </Button>
            </DialogActions>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Dialog xác nhận xóa */}
      <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>
          <Typography>
            Bạn có chắc chắn muốn xóa sản phẩm <strong>{productToDelete?.name}</strong> không?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirm(false)} color="inherit">
            Hủy
          </Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained" disabled={loading}>
            {loading ? <CircularProgress size={20} /> : "Xóa"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar thông báo */}
      <Snackbar
        open={!!message.text}
        autoHideDuration={3000}
        onClose={() => setMessage({ text: "", type: "" })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert severity={message.type}>{message.text}</Alert>
      </Snackbar>
    </Container>
  );
}

export default Products;
