import PropTypes from 'prop-types';

export const PTypes = {
  addNotification: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  data: PropTypes.arrayOf(PropTypes.any).isRequired,
  errors: PropTypes.arrayOf(PropTypes.string),
  message: PropTypes.string,
  loading: PropTypes.bool.isRequired,
  colorsLoading: PropTypes.bool.isRequired,
  fetchColorgroups: PropTypes.func.isRequired,
  colorgroups: PropTypes.arrayOf(PropTypes.object),
  colorgroupsLoading: PropTypes.bool.isRequired,
  fetchData: PropTypes.func.isRequired,
  objectHolder: PropTypes.object,
  status: PropTypes.string.isRequired,
  selectRow: PropTypes.func.isRequired,
  enableEditing: PropTypes.func.isRequired,
  enableImportJson: PropTypes.func.isRequired,
  enableCreating: PropTypes.func.isRequired,
  enableDefaultStatus: PropTypes.func.isRequired,
  createGraphicsCategory: PropTypes.func.isRequired,
  createEntity: PropTypes.func.isRequired,
  editEntity: PropTypes.func.isRequired,
  deleteEntity: PropTypes.func.isRequired,
  setEditingObjectProperty: PropTypes.func.isRequired,
  uploadThumbnail: PropTypes.func.isRequired,
  restoreTableState: PropTypes.func.isRequired,
  graphicsCategories: PropTypes.array.isRequired,
  uploadGraphicImage: PropTypes.func.isRequired,
  uploadGraphicThumb: PropTypes.func.isRequired,
  fetchGraphicsCategories: PropTypes.func.isRequired,
  fetchColors: PropTypes.func.isRequired,
  colors: PropTypes.arrayOf(PropTypes.object),
  token: PropTypes.string
};