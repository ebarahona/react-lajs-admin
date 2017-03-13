import {connect} from 'react-redux';
import {
  fetchGraphics, createGraphic, editGraphic, deleteGraphic,
  uploadGraphicImage, uploadGraphicThumb
} from '../actions/graphics';
import {
  fetchColors
} from '../actions/colors';
import {
  fetchColorizableColorConnections
} from '../actions/colorizableColorConnection';
import {
  selectRow, setObjectHolderProperty,
  enableEditing, enableCreating, enableDefaultStatus, setInitialState
} from '../actions/table';
import {
  fetchColorizables
} from '../actions/colorizable';
import Graphics from '../components/Graphics';

const mapStateToProps = state => {
  const {token} = state.user;
  const {colors, colorsError, colorsLoading} = state.colors;
  const {graphics, graphicsError, graphicsLoading} = state.graphics;
  const {colorizables, colorizablesError, colorizablesLoading} = state.colorizables;
  const {colorizableColorConnections} = state.colorizableColorConns;
  const {objectHolder, status} = state.table;
  const error = colorizablesError || graphicsError || colorsError;
  const errors = error ? [error] : [];

  return {
    title: 'Graphic',
    data: graphics,
    colors,
    colorizables,
    colorizableColorConnections,
    errors,
    loading: graphicsLoading || colorizablesLoading || colorsLoading,
    objectHolder,
    status,
    graphicsCategories: [{id: 1, name: 'first'}, {id: 2, name: 'second'}],
    token
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchData() {
      dispatch(fetchGraphics());
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
    createEntity(graphic, token) {
      dispatch(createGraphic(graphic, token));
    },
    editEntity(id, newGraphic, token) {
      dispatch(editGraphic(id, newGraphic, token));
    },
    deleteEntity(id, token) {
      dispatch(deleteGraphic(id, token));
    },
    restoreTableState(object) {
      dispatch(setInitialState(object));
    },
    uploadGraphicImage(file) {
      dispatch(uploadGraphicImage(file));
    },
    uploadGraphicThumb(file) {
      dispatch(uploadGraphicThumb(file));
    },
    fetchColorizables(graphicId) {
      dispatch(fetchColorizables(graphicId));
    },
    fetchColors() {
      dispatch(fetchColors());
    },
    fetchColorizableColorConnections() {
      dispatch(fetchColorizableColorConnections());
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Graphics);
