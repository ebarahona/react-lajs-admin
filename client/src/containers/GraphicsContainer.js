import {connect} from 'react-redux';
import {fetchGraphics, createGraphic, editGraphic, deleteGraphic} from '../actions/graphics';
import {uploadFile} from '../actions/files';
import {fetchGraphicsCategories, createGraphicsCategory} from '../actions/graphicsCategories';
import {fetchColors} from '../actions/colors';
import {fetchColorgroups} from '../actions/colorgroups';
import {
  selectRow, setObjectHolderProperty, enableImportJson,
  enableEditing, enableCreating, enableDefaultStatus, setInitialState
} from '../actions/table';
import Graphics from '../components/Graphics';

const mapStateToProps = state => {
  const {token} = state.user;
  const {graphics, graphicsError, graphicsLoading, graphicsMessage} = state.graphics;
  const {colors, colorsLoading} = state.colors;
  const {colorgroups, colorgroupsLoading} = state.colorgroups;
  const {graphicsCategories, graphicsCategoriesLoading} = state.graphicsCategories;
  const {objectHolder, status} = state.table;
  const errors = graphicsError ? [graphicsError] : [];
  return {
    title: 'Graphic',
    data: graphics,
    colors,
    colorgroups,
    colorgroupsLoading,
    errors,
    loading: graphicsLoading || graphicsCategoriesLoading || colorsLoading,
    colorsLoading,
    message: graphicsMessage,
    objectHolder,
    status,
    graphicsCategories,
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
    createRelatedCategory(category, token) {
      dispatch(createGraphicsCategory(category, token));
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
    fetchGraphicsCategories() {
      dispatch(fetchGraphicsCategories());
    },
    enableImportJson() {
      dispatch(enableImportJson());
    },
    createGraphicsCategory(category, token) {
      dispatch(createGraphicsCategory(category, token));
    },
    fetchColors() {
      dispatch(fetchColors());
    },
    fetchColorgroups() {
      dispatch(fetchColorgroups());
    },
    uploadFile(file, endpoint) {
      dispatch(uploadFile(file, endpoint));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Graphics);
