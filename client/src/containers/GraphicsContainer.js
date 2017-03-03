import {connect} from 'react-redux';
import {fetchGraphics, createGraphic, editGraphic, deleteGraphic} from '../actions/graphics';

import {
  selectRow, setObjectHolderProperty,
  enableEditing, enableCreating, enableDefaultStatus, setInitialState
} from '../actions/table';
import Graphics from '../components/Graphics';

const mapStateToProps = state => {
  const {token} = state.user;
  const {graphics, graphicsError, graphicsLoading} = state.graphics;
  const {objectHolder, status} = state.table;
  const errors = graphicsError ? [graphicsError] : [];

  return {
    title: 'Graphic',
    data: graphics,
    errors,
    loading: graphicsLoading,
    objectHolder,
    status,
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
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Graphics);
