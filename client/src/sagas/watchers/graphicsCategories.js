import {takeLatest} from 'redux-saga';
import * as actionTypes from '../../actionTypes/graphicsCategories';
import * as graphicsCategoriesSagas from '../graphicsCategories';

export function* watchFetchGraphicsCategories() {
  yield takeLatest(actionTypes.FETCH_GRAPHICS_CATEGORIES, graphicsCategoriesSagas.fetchGraphicsCategories);
}

export function* watchFetchGraphicsCategoryById() {
  yield takeLatest(actionTypes.FETCH_GRAPHICS_CATEGORIES_BY_ID, graphicsCategoriesSagas.fetchGraphicsCategoryById);
}

export function* watchFetchGraphicsCategoriesNumber() {
  yield takeLatest(actionTypes.FETCH_GRAPHICS_CATEGORIES_NUMBER, graphicsCategoriesSagas.fetchGraphicsCategoriesNumber);
}

export function* watchCreateGraphicsCategory() {
  yield takeLatest(actionTypes.CREATE_GRAPHICS_CATEGORIES, graphicsCategoriesSagas.createGraphicsCategory);
}

export function* watchUploadThumbnail() {
  yield takeLatest(actionTypes.UPLOAD_THUMBNAIL, graphicsCategoriesSagas.uploadThumbnail);
}

export function* watchDeleteThumbnail() {
  yield takeLatest(actionTypes.DELETE_THUMBNAIL, graphicsCategoriesSagas.deleteThumbnail);
}

export function* watchEditGraphicsCategory() {
  yield takeLatest(actionTypes.EDIT_GRAPHICS_CATEGORY, graphicsCategoriesSagas.editGraphicsCategory);
}

export function* watchDeleteGraphicsCategory() {
  yield takeLatest(actionTypes.DELETE_GRAPHICS_CATEGORY, graphicsCategoriesSagas.deleteGraphicsCategory);
}
