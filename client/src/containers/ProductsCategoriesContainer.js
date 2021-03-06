import {connect} from 'react-redux';
import {
  fetchProductsCategories,
  createProductsCategory,
  deleteProductsCategory,
  editProductsCategory
} from '../actions/productsCategories';
import {uploadFile} from '../actions/files';
import {
  selectRow,
  enableEditing,
  enableCreating,
  enableDefaultStatus,
  setObjectHolderProperty,
  setInitialState,
  enableConfirmDelete
} from '../actions/table';
import {fetchProducts, deleteProduct, editProduct} from '../actions/products';
import ProductsCategories from '../components/ProductCategories';

const mapStateToProps = state => {
  const {products} = state.products;
  const {token} = state.user;
  const {productsCategories, productsCategoriesError, productsCategoriesLoading, productsCategoriesMessage} = state.productsCategories;
  const {status, objectHolder} = state.table;
  const errors = productsCategoriesError ? [productsCategoriesError] : [];
  return {
    title: 'Product Category',
    pluralTitle: 'Product Categories',
    data: productsCategories,
    productsCategories,
    secondaryData: products,
    message: productsCategoriesMessage,
    errors,
    loading: productsCategoriesLoading,
    objectHolder,
    status,
    token
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchData() {
      dispatch(fetchProductsCategories());
    },
    fetchSecondaryData() {
      dispatch(fetchProducts());
    },
    selectRow(object) {
      dispatch(selectRow(object));
    },
    setEditingObjectProperty(propertyName, value) {
      dispatch(setObjectHolderProperty(propertyName, value));
    },
    enableEditing(object) {
      dispatch(enableEditing(object));
    },
    enableCreating(object) {
      dispatch(enableCreating(object));
    },
    enableDefaultStatus() {
      dispatch(enableDefaultStatus());
    },
    createEntity(productsCategory, token) {
      dispatch(createProductsCategory(productsCategory, token));
    },
    editEntity(id, newProductsCategory, token) {
      dispatch(editProductsCategory(id, newProductsCategory, token));
    },
    deleteEntity(id, token) {
      dispatch(deleteProductsCategory(id, token));
    },
    restoreTableState(object) {
      dispatch(setInitialState(object));
    },
    enableConfirmDelete() {
      dispatch(enableConfirmDelete());
    },
    deleteSecondaryEntity(id, token) {
      dispatch(deleteProduct(id, token));
    },
    editSecondaryEntity(id, newProduct, token) {
      dispatch(editProduct(id, newProduct, token));
    },
    uploadFile(file, endpoint) {
      dispatch(uploadFile(file, endpoint));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProductsCategories);

