import PropTypes from 'prop-types';

export const PTypes = {
  message: PropTypes.string,
  title: PropTypes.string.isRequired,
  data: PropTypes.arrayOf(PropTypes.any).isRequired,
  errors: PropTypes.arrayOf(PropTypes.string),
  loading: PropTypes.bool.isRequired,
  fetchData: PropTypes.func.isRequired,
  objectHolder: PropTypes.object,
  status: PropTypes.string.isRequired,
  selectRow: PropTypes.func.isRequired,
  enableEditing: PropTypes.func.isRequired,
  enableCreating: PropTypes.func.isRequired,
  enableDefaultStatus: PropTypes.func.isRequired,
  createEntity: PropTypes.func.isRequired,
  editEntity: PropTypes.func.isRequired,
  deleteEntity: PropTypes.func.isRequired,
  setEditingObjectProperty: PropTypes.func.isRequired,
  restoreTableState: PropTypes.func.isRequired,
  uploadFile: PropTypes.func.isRequired,
  token: PropTypes.string.isRequired
};
