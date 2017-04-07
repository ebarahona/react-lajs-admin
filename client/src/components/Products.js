import React, {Component, PropTypes} from 'react';
import View from './View';
import * as ProductModel from '../../../common/models/product.json';
import {
  STATUS_EDITING,
  STATUS_CREATING,
  STATUS_DEFAULT,
  RELATIVE_URL,
  PRODUCT_THUMB_FOLDER,
  PRODUCT_IMG_FOLDER,
  PRODUCT_LOCATION_IMAGE_FOLDER,
  PRODUCT_LOCATION_MASK_FOLDER,
  PRODUCT_LOCATION_OVERLAY_FOLDER,
  SIZES,
  PRODUCT_TEMPLATES_FOLDER
} from '../definitions';
const LEAVE_URL_OPTION = 'Import';
const ASSIGN_GROUP = 'Assign Color Group';
const ADD_COLOR = 'Add Individual Colors';
const COLORS_OPTIONS = ['Assign Color Group', 'Add Individual Colors'];
const Product = ProductModel.properties;

import {parseJson} from '../ProductJsonParser';
import * as LocationModel from '../../../common/models/location.json';
const Location = LocationModel.properties;
import * as _ from 'lodash';
import Select, {Creatable} from 'react-select';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';

export default class ProductsComponent extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    addNotification: PropTypes.func.isRequired,
    fetchColors: PropTypes.func.isRequired,
    colors: PropTypes.arrayOf(PropTypes.object),
    colorsLoading: PropTypes.bool.isRequired,
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
    createProductsCategory: PropTypes.func.isRequired,
    setEditingObjectProperty: PropTypes.func.isRequired,
    restoreTableState: PropTypes.func.isRequired,
    productsCategories: PropTypes.array.isRequired,
    uploadProductImage: PropTypes.func.isRequired,
    uploadProductThumb: PropTypes.func.isRequired,
    uploadProductLocationMask: PropTypes.func.isRequired,
    uploadProductLocationOverlay: PropTypes.func.isRequired,
    uploadProductLocationImage: PropTypes.func.isRequired,
    fetchProductsCategories: PropTypes.func.isRequired,
    token: PropTypes.string,
    uploadProductTemplate: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      newColorizables: [],
      newColors: [],
      imgUrl: '',
      mainImgUrl: '',
      location: -1,
      selectedValue: ASSIGN_GROUP,
    };
    if (!Array.prototype.remove) {
      Array.prototype.remove = function (from, to) {
        const rest = this.slice((to || from) + 1 || this.length);
        this.length = from < 0 ? this.length + from : from;
        return this.push.apply(this, rest);
      };
    }
  }

  componentWillMount() {
    this.props.fetchProductsCategories();
  }

  componentWillReceiveProps(props) {
    if (this.props.status === STATUS_DEFAULT && (props.status === STATUS_CREATING || props.status === STATUS_EDITING)) {
      this.props.fetchColors();
      if (this.state.location > -1) {
        this.setState({
          ...this.state, location: -1
        });
      }
    }
  }

  handleSelectedObjectArrayChange = (arrName, ind, propName, event) => {
    const arr = this.props.objectHolder[arrName];
    (arr[ind])[propName] = event.target.value;
    this.props.setEditingObjectProperty(arrName, [...arr]);
  };

  handleSelectedObjectArrayAddNew = (arrName, obj) => {
    let arr = this.props.objectHolder[arrName];
    if (typeof arr !== 'object') {
      arr = [];
    }
    arr[arr.length] = {...obj};
    this.props.setEditingObjectProperty(arrName, [...arr]);
  };

  changeNestedHolderArrValue = (topArrPropName, topInd, changingArrPropName, changingArrInd, value) => {
    const topArr = [...this.props.objectHolder[topArrPropName]];
    ((topArr[topInd])[changingArrPropName])[changingArrInd] = value;
    this.props.setEditingObjectProperty(topArrPropName, [...topArr]);
  };

  changeLocationsNestedArrValue = (changingArrPropName, changingArrInd, value) =>
    this.changeNestedHolderArrValue('locations', this.state.location, changingArrPropName, changingArrInd, value);

  deleteCurrentLocation = () => {
    const locs = this.props.objectHolder.locations;
    locs.remove(this.state.location);
    this.props.setEditingObjectProperty('locations', [...locs]);
    this.setState({
      ...this.state, location: -1
    });
  };

  changeNestedHolderValue = (topArrPropName, topInd, changingPropName, value) => {
    const topArr = this.props.objectHolder[topArrPropName];
    ((topArr[topInd])[changingPropName]) = value;
    this.props.setEditingObjectProperty(topArrPropName, [...topArr]);
  };

  changeLocationsNestedHolderValue = (changingPropName, value) =>
    this.changeNestedHolderValue('locations', this.state.location, changingPropName, value);

  handleSelectedObjectArrayDeleteElement = (arrName, key) => {
    const arr = this.props.objectHolder[arrName];
    arr.remove(key);
    this.props.setEditingObjectProperty(arrName, [...arr]);
  };

  handleSelectedObjectArrayArrayAddNew = (fArr, sArr, colorizableKey, obj) => {
    let arr = (this.props.objectHolder[fArr]);
    if (typeof (arr[colorizableKey])[sArr] !== 'object') {
      (arr[colorizableKey])[sArr] = [];
    }
    ((arr[colorizableKey])[sArr])[(arr[colorizableKey])[sArr].length] = {...obj};
    this.props.setEditingObjectProperty(fArr, [...arr]);
  };

  handleSelectedObjectAddNewArray = (fArr, sArr, key, obj) => {
    let arr = (this.props.objectHolder[fArr]);
    if (typeof (arr[key])[sArr] !== 'object') {
      (arr[key])[sArr] = [];
    }
    ((arr[key])[sArr])[(arr[key])[sArr].length] = [...obj];
    this.props.setEditingObjectProperty(fArr, [...arr]);
  };

  handleSelectedObjectArrayArrayDeleteElement = (fArr, sArr, colorizableKey, key) => {
    const arr = (this.props.objectHolder[fArr]);
    ((arr[colorizableKey])[sArr]).remove(key);
    this.props.setEditingObjectProperty(fArr, [...arr]);
  };

  handleSelectedObjectArrayArrayChange = (fArrName, sArrName, fInd, sInd, propName, event) => {
    const colorizables = this.props.objectHolder[fArrName];
    if (propName === 'image') {
      ((((colorizables[fInd])[sArrName])[sInd])[propName]) = event.target.files[0];
    } else if (sArrName === 'editableAreaUnitsRange') {
      ((((colorizables[fInd])[sArrName])[sInd])[propName]) = Number(event.target.value);
    } else {
      ((((colorizables[fInd])[sArrName])[sInd])[propName]) = event.target.value;
    }
    this.props.setEditingObjectProperty(fArrName, [...colorizables]);
  };

  handleSelectedObjectChange = (propertyName, event) => {
    this.props.setEditingObjectProperty(propertyName, event.target.value);
  };

  handleSelectedObjectDataChange = (prop, propertyName, event) => {
    const object = this.props.objectHolder[prop];
    object[propertyName] = event.target.value;
    this.props.setEditingObjectProperty(prop, object);
  };

  toCanvas = prop => {
    const image = this.props.objectHolder[prop];
    const img = new Image();
    let imageOut = new Image();
    const reader = new FileReader();
    reader.onload = function (e) {
      img.src = e.target.result;
    };
    reader.readAsDataURL(image);
    const c = this.refs.canvas;
    const ctx = c.getContext('2d');
    img.onload = function () {
      imageOut = ctx.drawImage(img, 0, 0, 110, 110);
    };
  };

  handleFileChoose = (prop, e) => {
    this.props.setEditingObjectProperty(prop, e.target.files[0]);
    if (this.props.status === STATUS_CREATING || this.props.status === STATUS_EDITING) {
      if (prop === 'image') {
        const image = this.props.objectHolder['image'];
        const reader = new FileReader();
        reader.onloadend = () => {
          this.setState({
            ...this.state,
            imgUrl: reader.result
          });
        };
        reader.readAsDataURL(image);
      }
      if (prop === 'thumbUrl') {
        this.toCanvas(prop);
      }
    }
  };

  handleLocationsNestedFileChoose = (prop, e) => {
    const locs = [...this.props.objectHolder['locations']];
    (locs[this.state.location])[prop] = e.target.files[0];
    this.props.setEditingObjectProperty('locations', locs);
  };

  handleImageUpload = file => {
    this.props.uploadProductImage(file);
  };

  handleThumbUpload = () => {
    if (this.props.status === STATUS_CREATING || this.props.status === STATUS_EDITING) {
      const image = this.props.objectHolder['thumbUrl'];
      const uploadThumbnail = file => {
        this.props.uploadProductThumb(file);
      };
      if (image.type !== 'image/svg+xml') {
        const c = this.refs.canvas;
        c.toBlob(function (blob) {
          blob.name = image.name;
          uploadThumbnail(blob);
        }, 'image/*', 0.95);
      } else {
        uploadThumbnail(image);
      }
    }
  };

  getOptions = () => {
    if (!this.props.colorsList || !this.props.colorsList.length) {
      return [];
    }

    return this.props.colorsList;
  };

  getColorizableColorsOptions = () => {
    if (!COLORS_OPTIONS || !COLORS_OPTIONS.length) {
      return [];
    }

    return _.map(COLORS_OPTIONS, col => ({value: col, name: col}));
  };
  getSelectedOptions = key => {
    if (!this.props.objectHolder['colors'] || !this.props.objectHolder['colors'].length) {
      return [];
    }

    if (this.props.objectHolder['colors'][key]) {
      return this.props.objectHolder['colors'][key];
    }
  };

  getSelectedColorizableColorsOptions = (key, k) => {
    if (!this.props.objectHolder['colorizables']['_colors'] || !this.props.objectHolder['colors']['_colors'].length) {
      return [];
    }
    let arr = this.props.objectHolder['colors'];

    if (((arr[key])['_colors'])[k]) {
      return ((arr[key])['_colors'])[k];
    }
  };


  onColorsSelectChange = (val, key) => {
    const arr = this.props.objectHolder['colors'];
    if (val) {
      (arr[key])['name'] = val.name;
      (arr[key])['value'] = val.value;
      this.props.setEditingObjectProperty('colors', [...arr]);
    }
  };
  onColorizableColorsSelectChange = (val, key, k) => {
    if (val) {
      this.handleSelectedObjectArrayArrayChange('colorizables', '_colors', key, k, 'name', val.name);
      this.handleSelectedObjectArrayArrayChange('colorizables', '_colors', key, k, 'value', val.value);
    }
  };

  getNameFromUrl = (name) => {
    if (typeof (name) === 'string') {
      return name.substring(name.lastIndexOf('/') + 1);
    }
  };

  renderColorsTable = () => (
    <div className='panel panel-default'>
      <table className='table table-bordered'>
        <thead>
        <tr>
          <th>Color</th>
          <th>Locations</th>
          <th/>
        </tr>
        </thead>
        <tbody>
        {this.props.objectHolder['colors'] ?
          this.props.objectHolder['colors'].map((c, key) =>
            <tr key={key}>
              <td className='col-md-4'>
                <Select
                  name='colors'
                  value={this.getSelectedOptions(key)}
                  multi={false}
                  labelKey='name'
                  options={this.getOptions()}
                  onChange={os => this.onColorsSelectChange(os, key)}
                  isLoading={this.props.colorsLoading}
                />
              </td>
              <td className='col-md-8'>
                <div className='panel panel-default'>
                  <table className='table'>
                    <thead>
                    <tr>
                      <th>Name</th>
                      <th>Image</th>
                      <th/>
                    </tr>
                    </thead>
                    <tbody>
                    {c._locations ? c._locations.map((col, k) => (
                      <tr key={k}>
                        <td><input type='text' className='form-control'
                                   value={col.name}
                                   onChange={e =>
                                     this.handleSelectedObjectArrayArrayChange('colors', '_locations', key, k, 'name', e)}/>
                        </td>
                        <td><input type='file' className='form-control' accept='image/*'
                                   onChange={e =>
                                     this.handleSelectedObjectArrayArrayChange('colors', '_locations', key, k, 'image', e)}/>
                          {typeof (col.image) === 'string' ?
                            <a href={this.getFileUrl(col.image)}>{this.getNameFromUrl(col.image)}</a> : null
                          }  </td>
                        <td><a className='btn btn-danger btn-xs' href='#'
                               onClick={() => this.deleteLocationRow(key, k)}>
                          <i className='fa fa-ban'/></a></td>
                      </tr>
                    )) : null}
                    </tbody>
                  </table>
                  <div className='panel-footer'>
                    <a className='btn btn-primary btn-xs' href='#' onClick={() => this.addLocationRow(key)}>
                      <i className='fa fa-plus'/> Add location</a>
                  </div>
                </div>
              </td>
              <td><a className='btn btn-danger btn-xs' href='#' onClick={() => this.deleteColorsRow(key)}>
                <i className='fa fa-ban'/></a></td>
            </tr>) : null}
        </tbody>
      </table>
      <div className='panel-footer'>
        <a className='btn btn-primary btn-xs' href='#' onClick={() => this.addColorsRow()}>
          <i className='fa fa-plus'/> Add color</a>
      </div>
    </div>
  );

  handleColorActionOption = option => {
    this.setState({...this.state, selectedValue: option.value});
  };

  renderColorizableTable = () => (
    <div className='panel panel-default'>
      <table className='table table-bordered'>
        <thead>
        <tr>
          <th>Name</th>
          <th>Id</th>
          <th>Colors</th>
          <th/>
        </tr>
        </thead>
        <tbody>
        {this.props.objectHolder['colorizables'] ?
          this.props.objectHolder['colorizables'].map((c, key) =>
            <tr key={key}>
              <td><input type='text' className='form-control'
                         value={c.name}
                         onChange={e => this.handleSelectedObjectArrayChange('colorizables', key, 'name', e)}/>
              </td>
              <td><input type='text' className='form-control'
                         value={c.id}
                         onChange={e => this.handleSelectedObjectArrayChange('colorizables', key, 'id', e)}/>
              </td>
              <td>
                <Select
                  name='colors'
                  value={this.state.selectedValue}
                  multi={false}
                  labelKey='name'
                  options={this.getColorizableColorsOptions()}
                  onChange={os => this.handleColorActionOption(os)}
                />
                {this.state.selectedValue === ADD_COLOR ? c._colors.map((col, k) =>
                  <Creatable
                    name='colors'
                    value={this.getSelectedColorizableColorsOptions(key, k)}
                    multi={true}
                    labelKey='name'
                    options={this.getOptions()}
                    onChange={os => this.onColorizableColorsSelectChange(os, key, k)}
                    isLoading={this.props.colorsLoading}
                  />) : null }
              </td>
              <td><a className='btn btn-danger btn-xs' href='#' onClick={() => this.deleteColorizableRow(key)}>
                <i className='fa fa-ban'/></a></td>
            </tr>) : null}
        </tbody>
      </table>
      <div className='panel-footer'>
        <a className='btn btn-primary btn-xs' href='#' onClick={() => this.addColorizableRow()}>
          <i className='fa fa-plus'/> Add element</a>
      </div>
    </div>
  );

  addColorsRow = () => (
    this.handleSelectedObjectArrayAddNew('colors', {name: '', value: '', _locations: []})
  );

  deleteColorsRow = key => (
    this.handleSelectedObjectArrayDeleteElement('colors', key)
  );

  addEditableAreaSizeRow = () => (
    this.handleSelectedObjectArrayAddNew('editableAreaSizes', {label: '', width: 0, height: 0})
  );

  deleteEditableAreaSizeRow = key => (
    this.handleSelectedObjectArrayDeleteElement('editableAreaSizes', key)
  );

  addLocationRow = colorId => (
    this.handleSelectedObjectArrayArrayAddNew('colors', '_locations', colorId, {name: '', image: ''})
  );

  deleteLocationRow = (colorId, key) => (
    this.handleSelectedObjectArrayArrayDeleteElement('colors', '_locations', colorId, key)
  );

  addColorizableRow = () => (
    this.handleSelectedObjectArrayAddNew('colorizables', {name: '', id: '', _colors: [{name: '', value: ''}]})
  );

  deleteColorizableRow = key => (
    this.handleSelectedObjectArrayDeleteElement('colorizables', key)
  );

  addColorRow = colorizableId => (
    this.handleSelectedObjectArrayArrayAddNew('colorizables', '_colors', colorizableId, {name: '', value: ''})
  );

  deleteColorRow = (colorizableId, key) => (
    this.handleSelectedObjectArrayArrayDeleteElement('colorizables', '_colors', colorizableId, key)
  );

  getFileUrl = url => {
    if (url.substring(0, RELATIVE_URL.length) === RELATIVE_URL) {
      return url.substring(RELATIVE_URL.length);
    }
    return url;
  };

  getName = (obj, url) => {
    if (typeof obj === 'object') {
      return RELATIVE_URL + '/' + url + obj.name;
    }

    return undefined;
  };

  getSizeOptions = () => {
    if (!SIZES || !SIZES.length) {
      return [];
    }

    return _.map(SIZES, col => ({value: col, name: col}));
  };

  getSelectedSizeOptions = () => {
    if (!this.props.objectHolder['sizes'] || !this.props.objectHolder['sizes'].length) {
      return [];
    }

    if (typeof (this.props.objectHolder['sizes'])[0] === 'string') {
      return _.map(this.props.objectHolder['sizes'], col => ({value: col, name: col}));
    }

    return this.props.objectHolder['sizes'];

  };

  crop = () => {
    if (!this.cropper) {
      return;
    }
    const data = this.cropper.getData();
    _.forOwn(data, (value, key) => {
      if (value === '-0.00') {
        data[key] = '0.00';
      }
    });
    this.changeLocationsNestedArrValue('editableArea', 0, Number(data.x.toFixed(2)));
    this.changeLocationsNestedArrValue('editableArea', 1, Number(data.y.toFixed(2)));
    this.changeLocationsNestedArrValue('editableArea', 2, Number((data.width + data.x).toFixed(2)));
    this.changeLocationsNestedArrValue('editableArea', 3, Number((data.height + data.y).toFixed(2)));
  };

  onSizeSelectChange = val => {
    const arr = [];
    if (val) {
      _.forEach(val, v => arr.push(v.name));
      this.props.setEditingObjectProperty('sizes', arr);
    }
  };

  handleImportJson = (json, baseUrl, urlOption, forceNoBase) => {
    if (!baseUrl.length && !forceNoBase && urlOption !== LEAVE_URL_OPTION) {
      this.props.addNotification('warning', 'Base url is not set',
        'Not setting correct base url will result in broken links.',
        15, f => this.handleImportJson(json, baseUrl, urlOption, true));
      return;
    }
    if (!forceNoBase && urlOption !== LEAVE_URL_OPTION) {
      const r = new RegExp('^(?:[a-z]+:)?//', 'i');
      if (!r.test(baseUrl)) {
        this.props.addNotification('warning', 'The specified base url seems not to have a protocol',
          'Not setting correct base url will result in broken links.',
          15, f => this.handleImportJson(json, baseUrl, urlOption, true));
        return;
      }
    }
    let parsed = parseJson(json, baseUrl);
    try {
      const categories = [...parsed.categories];
      if (categories && categories.length) {
        this.props.createProductsCategory(categories, this.props.token);
      }
      const products = [...parsed.products];
      if (products && products.length) {
        this.props.createEntity(products, this.props.token);
      }
      this.props.enableDefaultStatus();
      this.props.restoreTableState({...Product});
      this.setState({...this.state, json: '', baseUrl: ''});
    } catch (e) {
      this.props.addNotification('error', 'Json structure is invalid.');
    }
  };

  getLocationsInputValue = propertyName => {
    if (this.state.location < 0 || !this.props.objectHolder['locations'] ||
      !this.props.objectHolder['locations'].length) {
      return '';
    }
    return ((this.props.objectHolder['locations'])[this.state.location])[propertyName];
  };

  renderEditableAreaSizesTable = () => (
    <div className='panel panel-default'>
      <table className='table table-bordered'>
        <thead>
        <tr>
          <th>Label</th>
          <th>Width</th>
          <th>Height</th>
          <th/>
        </tr>
        </thead>
        <tbody>
        {this.props.objectHolder['editableAreaSizes'] ?
          this.props.objectHolder['editableAreaSizes'].map((c, key) =>
            <tr key={key}>
              <td><input type='text' className='form-control'
                         value={c.label}
                         onChange={e =>
                           this.handleSelectedObjectArrayChange('editableAreaSizes', key, 'label', e)}/>
              </td>
              <td><input type='text' className='form-control'
                         value={c.width}
                         onChange={e =>
                           this.handleSelectedObjectArrayChange('editableAreaSizes', key, 'width', e)}/>
              </td>
              <td><input type='text' className='form-control'
                         value={c.height}
                         onChange={e =>
                           this.handleSelectedObjectArrayChange('editableAreaSizes', key, 'height', e)}/>
              </td>
              <td><a className='btn btn-danger btn-xs' href='#' onClick={() => this.deleteEditableAreaSizeRow(key)}>
                <i className='fa fa-ban'/></a></td>
            </tr>) : null}
        </tbody>
      </table>
      <div className='panel-footer'>
        <a className='btn btn-primary btn-xs' href='#' onClick={() => this.addEditableAreaSizeRow()}>
          <i className='fa fa-plus'/> Add size</a>
      </div>
    </div>
  );

//  addUnitsRangeRow = () => (
  //  this.handleSelectedObjectArrayAddNew('locations', {editableAreaUnitsRange: [[0, 0, 1]]})
  //);

  addUnitsRangeRow = key => (
    this.handleSelectedObjectAddNewArray('locations', 'editableAreaUnitsRange', key, [])
  );

  deleteUnitsRangeRow = (locationId, key) => (
    this.handleSelectedObjectArrayArrayDeleteElement('locations', 'editableAreaUnitsRange', locationId, key)
  );

  renderUnitsRangeTable = () => (
    <div className='panel panel-default'>
      <table className='table table-bordered'>
        <thead>
        <tr>
          <th>Min</th>
          <th>Max</th>
          <th>Step</th>
          <th/>
        </tr>
        </thead>
        <tbody>
        { this.getLocationsInputValue('editableAreaUnitsRange') ?
          this.getLocationsInputValue('editableAreaUnitsRange').map((col, k) =>
            <tr key={k}>
              <td><input type='text' className='form-control'
                         value={col[0]}
                         onChange={e =>
                           this.handleSelectedObjectArrayArrayChange('locations', 'editableAreaUnitsRange',
                             this.state.location, k, 0, e)}/>
              </td>
              <td><input type='text' className='form-control'
                         value={col[1]}
                         onChange={e =>
                           this.handleSelectedObjectArrayArrayChange('locations', 'editableAreaUnitsRange', this.state.location, k, 1, e)}/>
              </td>
              <td><input type='text' className='form-control'
                         value={col[2]}
                         onChange={e =>
                           this.handleSelectedObjectArrayArrayChange('locations', 'editableAreaUnitsRange', this.state.location, k, 2, e)}/>
              </td>
              <td><a className='btn btn-danger btn-xs' href='#'
                     onClick={() => this.deleteUnitsRangeRow(this.state.location, k)}>
                <i className='fa fa-ban'/></a></td>
            </tr>
          ) : null}
        </tbody>
      </table>

      <div className='panel-footer'>
        <a className='btn btn-primary btn-xs' href='#' onClick={() => this.addUnitsRangeRow(this.state.location)}>
          <i className='fa fa-plus'/> Add units range</a>
      </div>
    </div>
  );

  handleFileUpload = () => {
    if (this.props.status === STATUS_CREATING || this.props.status === STATUS_EDITING) {
      this.props.uploadProductTemplate(this.props.objectHolder['template']);
    }
  };

  getImageUrl = image => {
    if (!image) {
      return;
    }
    if (typeof image === 'string') {
      return this.getFileUrl(image);
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      this.setState({
        ...this.state,
        mainImgUrl: reader.result
      });
    };
    reader.readAsDataURL(image);
    return this.state.mainImgUrl;
  };

  saveMulticolor = () => {
    if (this.props.objectHolder['multicolor'] === true) {
      this.props.setEditingObjectProperty('colors', []);
    } else if (this.props.objectHolder['multicolor'] === false) {
      this.props.setEditingObjectProperty('colorizables', []);
    }
  };

  render() {
    return (
      <View {...this.props} objectSample={{...Product}}
            sortingSupport={true}
            hiddenProperties={['id', 'colors', 'locations', 'multicolor', 'description', 'colorizables', 'minDPU', 'minQuantity',
              'namesNumbersEnabled', 'hideEditableAreaBorder', 'namesNumbersEnabled', 'pantones', 'resizable',
              'editableAreaSizes', 'showRuler', 'template', 'data', 'sizes']}
            changedLabels={{
              hideEditableAreaBorder: 'Editable area border', namesNumbersEnabled: 'Name numbers',
              editableAreaSizes: 'Editable Area Sizes', minDPU: 'Min DPU', minQuantity: 'Min quantity',
              useForDecoration: 'Use for decoration', useForProduct: 'Use for product', showRuler: 'Ruler'
            }}
            handleImportJson={this.handleImportJson}
            hiddenInputs={['id', 'categoryId', 'thumbUrl', 'data', 'pantones',
              this.props.objectHolder['multicolor'] === true ?
                'colors' : 'colorizables']}
            enableImportJson={this.props.enableImportJson}
            representations={{
              thumbUrl: {
                getElem: val =>
                  val ? <a href={this.getFileUrl(val)} className='thumbnail'
                           style={{width: 110}}><img
                    src={this.getFileUrl(val)} alt='thumb'
                    style={{width: 110}}/></a> :
                    null,
                sortable: false,
                header: 'Thumb'
              },
              categoryId: {
                getElem: val => {
                  let cat = this.props.productsCategories.find(c => String(c.id) === val);
                  if (cat) {
                    return cat.name;
                  }

                  return null;
                },
                sortable: true,
                sortElem: <Select value={this.props.objectHolder['categoryId']}
                                  options={this.props.productsCategories}
                                  valueKey='id'
                                  labelKey='name'
                                  onChange={el => {
                                    if (el) {
                                      this.props.setEditingObjectProperty('categoryId', el.id);
                                    } else {
                                      this.props.setEditingObjectProperty('categoryId', '');
                                    }
                                  }}
                />,
                header: 'Category'
              }
            }}
            changedInputs={{
              template: {
                elem: <div><input type='file' className='form-control'
                                  onChange={e => this.handleFileChoose('template', e)}/>
                  {typeof (this.props.objectHolder['template']) === 'string' ?
                    <a
                      href={this.getFileUrl(this.props.objectHolder['template'])}>{this.getNameFromUrl(this.props.objectHolder['template'])}</a> : null
                  }
                </div>,
                saveF: this.handleFileUpload,
                getName: obj => this.getName(obj, PRODUCT_TEMPLATES_FOLDER)
              },
              thumbUrl: {
                saveF: this.handleThumbUpload,
                getName: obj => this.getName(obj, PRODUCT_THUMB_FOLDER)
              },
              locations: {
                saveF: locs => {
                  _.forEach(locs, loc => {
                    if (loc.image && typeof loc.image === 'object') {
                      this.props.uploadProductLocationImage(loc.image);
                      loc.image = this.getName(loc.image, PRODUCT_LOCATION_IMAGE_FOLDER);
                    }

                    if (loc.mask && typeof loc.mask === 'object') {
                      this.props.uploadProductLocationMask(loc.mask);
                      loc.mask = this.getName(loc.mask, PRODUCT_LOCATION_MASK_FOLDER);
                    }

                    if (loc.overlayInfo && typeof loc.overlayInfo === 'object') {
                      this.props.uploadProductLocationOverlay(loc.overlayInfo);
                      loc.overlayInfo = this.getName(loc.overlayInfo, PRODUCT_LOCATION_OVERLAY_FOLDER);
                    }
                  });

                },
                elem: <div>
                  <div className='row' style={{marginBottom: 6}}>
                    <div className='col-lg-12'>
                      <Creatable
                        name='location'
                        className='onTop'
                        placeholder={this.props.objectHolder['locations'] && this.props.objectHolder['locations'].length ?
                          _.map(this.props.objectHolder['locations'], 'name').join(', ') :
                          'No locations linked. Type a name to add location...'}
                        noResultsText='No locations currently linked...'
                        labelKey='name'
                        valueKey='name'
                        value={this.state.location > -1 && this.props.objectHolder['locations'] &&
                        this.props.objectHolder['locations'].length ?
                          (this.props.objectHolder['locations'])[this.state.location] : null}
                        options={this.props.objectHolder['locations'] && this.props.objectHolder['locations'].length ?
                          this.props.objectHolder['locations'] : []}
                        onNewOptionClick={val => {
                          let obj = {};
                          _.forEach(Object.getOwnPropertyNames(Location), p => {
                            if (Location[p].type === 'array') {
                              obj[p] = [];
                            } else {
                              if (typeof Location[p].default === 'boolean') {
                                obj[p] = Location[p].default;
                              } else {
                                obj[p] = '';
                              }
                            }
                          });
                          this.props.setEditingObjectProperty('locations', [...this.props.objectHolder['locations'],
                            {...obj, name: val.name}]);
                          this.setState({
                            ...this.state, location: _.findIndex(this.props.objectHolder['locations'],
                              loc => loc.name === val.name)
                          });
                        }}
                        onChange={val => {
                          if (!val) {
                            this.setState({
                              ...this.state, location: -1
                            });
                            return;
                          }
                          this.setState({
                            ...this.state, location: _.findIndex(this.props.objectHolder['locations'],
                              loc => loc.name === val.name)
                          });
                        }}
                      />
                    </div>
                  </div>
                  {this.state.location < 0 ||
                  !this.props.objectHolder['locations'] || !this.props.objectHolder['locations'].length ? null :
                    <div className='panel panel-default'>
                      <div className='panel-body'>
                        <div className='row'>
                          <div className='col-lg-4'>

                            <div className='row' style={{marginBottom: 6}}>
                              <div className='col-lg-12'>
                                <div className='input-group input-group-sm'>
                                  <span className='input-group-addon'>Name</span>
                                  <input type='text' className='form-control'
                                         onChange={e => this.changeLocationsNestedHolderValue('name', e.target.value)}
                                         value={this.getLocationsInputValue('name')}/>
                                </div>
                              </div>
                            </div>

                            <div className='row' style={{marginBottom: 6}}>
                              <div className='col-lg-12'>
                                <div className='input-group input-group-sm'>
                                  <span className='input-group-addon'>Image</span>
                                  <input type='file' className='form-control'
                                         onChange={e => this.handleLocationsNestedFileChoose('image', e)}/>
                                  {typeof this.getLocationsInputValue('image') === 'string' ?
                                    <div className='input-group-btn'>
                                      <a href={this.getFileUrl(this.getLocationsInputValue('image'))}
                                         className='btn btn-default btn-sm'>{(() => {
                                        let url = this.getFileUrl(this.getLocationsInputValue('image'));
                                        if (url.length > 8) {
                                          url = '...' + url.substr(url.length - 8);
                                        }
                                        return url;
                                      })()
                                      }</a>
                                    </div> : null
                                  }
                                </div>
                              </div>
                            </div>

                            <div className='row' style={{marginBottom: 6}}>
                              <div className='col-lg-12'>
                                <div className='input-group input-group-sm'>
                                  <span className='input-group-addon'>Mask</span>
                                  <input type='file' className='form-control'
                                         onChange={e => this.handleLocationsNestedFileChoose('mask', e)}/>
                                  {typeof this.getLocationsInputValue('mask') === 'string' ?
                                    <div className='input-group-btn'>
                                      <a href={this.getFileUrl(this.getLocationsInputValue('mask'))}
                                         className='btn btn-default btn-sm'>{(() => {
                                        let url = this.getFileUrl(this.getLocationsInputValue('mask'));
                                        if (url.length > 8) {
                                          url = '...' + url.substr(url.length - 8);
                                        }
                                        return url;
                                      })()
                                      }</a>
                                    </div> : null
                                  }
                                </div>
                              </div>
                            </div>

                            <div className='row' style={{marginBottom: 6}}>
                              <div className='col-lg-12'>
                                <div className='input-group input-group-sm'>
                                  <span className='input-group-addon'>Overlay</span>
                                  <input type='file' className='form-control'
                                         onChange={e => this.handleLocationsNestedFileChoose('overlayInfo', e)}/>
                                  {typeof this.getLocationsInputValue('overlayInfo') === 'string' ?
                                    <div className='input-group-btn'>
                                      <a href={this.getFileUrl(this.getLocationsInputValue('overlayInfo'))}
                                         className='btn btn-default btn-sm'>{(() => {
                                        let url = this.getFileUrl(this.getLocationsInputValue('overlayInfo'));
                                        if (url.length > 8) {
                                          url = '...' + url.substr(url.length - 8);
                                        }
                                        return url;
                                      })()
                                      }</a>
                                    </div> : null
                                  }
                                </div>
                              </div>
                            </div>

                            <div className='row' style={{marginBottom: 6}}>
                              <div className='col-lg-6'>
                                <div className='input-group input-group-sm'>
                                  <span className='input-group-addon'>Width</span>
                                  <input type='text' className='form-control'
                                         onChange={e =>
                                           this.changeLocationsNestedArrValue('editableAreaUnits', 0, e.target.value)}
                                         value={(() => {
                                           const vals = this.getLocationsInputValue('editableAreaUnits') || [];
                                           if (vals && vals.length) {
                                             return vals[0];
                                           }

                                           return '';
                                         })()}/>
                                </div>
                              </div>
                              <div className='col-lg-6'>
                                <div className='input-group input-group-sm'>
                                  <span className='input-group-addon'>Height</span>
                                  <input type='text' className='form-control'
                                         onChange={e =>
                                           this.changeLocationsNestedArrValue('editableAreaUnits', 1, e.target.value)}
                                         value={(() => {
                                           const vals = this.getLocationsInputValue('editableAreaUnits') || [];
                                           if (vals && vals.length > 1) {
                                             return vals[1];
                                           }

                                           return '';
                                         })()}/>
                                </div>
                              </div>
                            </div>

                            <div className='row' style={{marginBottom: 6}}>
                              <div className='col-lg-12'>
                                {this.renderUnitsRangeTable()}
                              </div>
                            </div>

                            <div className='row' style={{marginBottom: 6}}>
                              <div className='col-lg-6'>
                                <div className='input-group input-group-sm'>
                                  <span className='input-group-addon'>x0</span>
                                  <input type='text' className='form-control'
                                         onChange={e => {
                                           if (this.cropper) {
                                             const {x, width} = this.cropper.getData();
                                             const xNew = Number(e.target.value);
                                             const newData = {};

                                             newData.x = xNew;
                                             newData.width = width - (xNew - x);

                                             this.changeLocationsNestedArrValue('editableArea', 0, Number(xNew));
                                             this.cropper.setData(newData);
                                           }
                                         }}
                                         value={(() => {
                                           const vals = this.getLocationsInputValue('editableArea');
                                           if (vals && vals.length) {
                                             return vals[0];
                                           }

                                           return '';
                                         })()}/>
                                </div>
                              </div>
                              <div className='col-lg-6'>
                                <div className='input-group input-group-sm'>
                                  <span className='input-group-addon'>x1</span>
                                  <input type='text' className='form-control'
                                         onChange={e => {
                                           if (this.cropper) {
                                             const {x} = this.cropper.getData();
                                             const x1New = Number(e.target.value);
                                             const newData = {};

                                             newData.width = x1New - x;

                                             this.changeLocationsNestedArrValue('editableArea', 2, Number(x1New));

                                             this.cropper.setData(newData);
                                           }
                                         }}
                                         value={(() => {
                                           const vals = this.getLocationsInputValue('editableArea');
                                           if (vals && vals.length > 2) {
                                             return vals[2];
                                           }

                                           return '';
                                         })()}/>
                                </div>
                              </div>
                            </div>
                            <div className='row' style={{marginBottom: 6}}>
                              <div className='col-lg-6'>
                                <div className='input-group input-group-sm'>
                                  <span className='input-group-addon'>y0</span>
                                  <input type='text' className='form-control'
                                         onChange={e => {
                                           if (this.cropper) {
                                             const {y, height} = this.cropper.getData();
                                             const yNew = Number(e.target.value);
                                             const newData = {};

                                             newData.y = yNew;
                                             newData.height = height - (yNew - y);
                                             this.changeLocationsNestedArrValue('editableArea', 1, Number(yNew));
                                             this.cropper.setData(newData);
                                           }
                                         }}
                                         value={(() => {
                                           const vals = this.getLocationsInputValue('editableArea');
                                           if (vals && vals.length > 1) {
                                             return vals[1];
                                           }

                                           return '';
                                         })()}/>
                                </div>
                              </div>
                              <div className='col-lg-6'>
                                <div className='input-group input-group-sm'>
                                  <span className='input-group-addon'>y1</span>
                                  <input type='text' className='form-control'
                                         onChange={e => {
                                           if (this.cropper) {
                                             const {y} = this.cropper.getData();
                                             const y1New = Number(e.target.value);
                                             const newData = {};

                                             newData.height = y1New - y;
                                             this.changeLocationsNestedArrValue('editableArea', 3, Number(y1New));

                                             this.cropper.setData(newData);
                                           }
                                         }}
                                         value={(() => {
                                           const vals = this.getLocationsInputValue('editableArea');
                                           if (vals && vals.length > 3) {
                                             return vals[3];
                                           }

                                           return '';
                                         })()}/>
                                </div>
                              </div>
                            </div>
                            <div className='row' style={{marginBottom: 6}}>
                              <div className='col-lg-12'>
                                <Select
                                  name='rotation'
                                  placeholder='Restrict rotation...'
                                  searchable={false}
                                  options={[{value: false, label: 'Rotation restricted'},
                                    {value: true, label: 'Rotation allowed'}]}
                                  value={
                                    this.props.objectHolder.locations[this.state.location]
                                      .editableAreaUnitsRestrictRotation
                                  }
                                  onChange={op =>
                                    this.changeLocationsNestedHolderValue('editableAreaUnitsRestrictRotation',
                                      op ? op.value : false)
                                  }
                                />
                              </div>
                            </div>
                            <div className='row' style={{marginBottom: 6}}>
                              <div className='col-lg-12'>
                                <button type='button' className='btn btn-block btn-danger'
                                        onClick={this.deleteCurrentLocation}>Delete this location
                                </button>
                              </div>
                            </div>
                          </div>
                          <div className='col-lg-8'>
                            <div className="panel panel-default">
                              <Cropper
                                ref={cr => this.cropper = cr}
                                src={this.getImageUrl(this.props.objectHolder.locations[this.state.location].image)}
                                style={{height: 400, width: '100%'}}
                                guides={false}
                                zoomable={false}
                                viewMode={1}
                                autoCropArea={1}
                              />
                              <button type='button' className='btn btn-block btn-primary'
                                      onClick={this.crop}>Crop
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>}
                </div>
              },
              description: {
                elem: <textarea className='form-control' rows='3'
                                value={this.props.objectHolder['description']}
                                onChange={e => this.handleSelectedObjectChange('description', e)}>
              </textarea>
              },
              sizes: {
                elem: <Creatable
                  name='sizes'
                  className='onTop1'
                  value={this.getSelectedSizeOptions()}
                  multi={true}
                  labelKey='name'
                  options={this.getSizeOptions()}
                  onChange={this.onSizeSelectChange}
                />
              },
              multicolor: {
                elem: <select className='form-control'
                              value={this.props.objectHolder['multicolor']}
                              onChange={e => this.props.setEditingObjectProperty('multicolor', e.target.value === 'true')}>
                  <option value={false}>No</option>
                  <option value={true}>Yes</option>
                </select>
              },
              colorizables: {
                elem: this.renderColorizableTable(),
                saveF: this.saveMulticolor
              },
              colors: {
                elem: this.renderColorsTable(),
                saveF: this.saveMulticolor,
                getName: color => _.forEach(color, clr => {
                  if (clr !== null) {
                    if (clr._locations.length) {
                      _.forEach(clr._locations, lc => {
                        if (typeof (lc.image) === 'object') {
                          this.handleImageUpload(lc.image);
                          lc.image = this.getName(lc.image, PRODUCT_IMG_FOLDER);
                        }
                      });
                    }
                  }
                })
              },
              editableAreaSizes: {
                elem: this.renderEditableAreaSizesTable()
              },
              hideEditableAreaBorder: {
                elem: <select className='form-control'
                              value={this.props.objectHolder['hideEditableAreaBorder']}
                              onChange={e => this.handleSelectedObjectChange('hideEditableAreaBorder', e)}>
                  <option value={false}>Hidden</option>
                  <option value={true}>Visible</option>
                </select>
              },
              namesNumbersEnabled: {
                elem: <select className='form-control'
                              value={this.props.objectHolder['namesNumbersEnabled']}
                              onChange={e => this.handleSelectedObjectChange('namesNumbersEnabled', e)}>
                  <option value={false}>Disabled</option>
                  <option value={true}>Enabled</option>
                </select>
              },
              resizable: {
                elem: <select className='form-control'
                              value={this.props.objectHolder['resizable']}
                              onChange={e => this.handleSelectedObjectChange('resizable', e)}>
                  <option value={false}>No</option>
                  <option value={true}>Yes</option>
                </select>
              },
              showRuler: {
                elem: <select className='form-control'
                              value={this.props.objectHolder['showRuler']}
                              onChange={e => this.handleSelectedObjectChange('showRuler', e)}>
                  <option value={false}>Hidden</option>
                  <option value={true}>Visible</option>
                </select>
              },
            }
            }
            customInputs={{
              price: {
                elem: <input type='text' className='form-control'
                             value={this.props.objectHolder['data'] ? this.props.objectHolder['data'].price : ''}
                             onChange={e => this.handleSelectedObjectDataChange('data', 'price', e)}/>
              },
              material: {
                elem: <input type='text' className='form-control'
                             value={this.props.objectHolder['data'] ? this.props.objectHolder['data'].material : ''}
                             onChange={e => this.handleSelectedObjectDataChange('data', 'material', e)}/>
              },
              useForDecoration: {
                elem: <select className='form-control'
                              value={this.props.objectHolder['pantones'] ? this.props.objectHolder['pantones'].useForDecoration : ''}
                              onChange={e => this.handleSelectedObjectDataChange('pantones', 'useForDecoration', e)}>
                  <option value={false}>No</option>
                  <option value={true}>Yes</option>
                </select>
              },
              useForProduct: {
                elem: <select className='form-control'
                              value={this.props.objectHolder['pantones'] ? this.props.objectHolder['pantones'].useForProduct : ''}
                              onChange={e => this.handleSelectedObjectDataChange('pantones', 'useForProduct', e)}>
                  <option value={false}>No</option>
                  <option value={true}>Yes</option>
                </select>
              },
              thumb: {
                elem: <div>
                  <input type='file' className='form-control' accept='image/*'
                         onChange={e => this.handleFileChoose('thumbUrl', e)}/>

                  {typeof (this.props.objectHolder['thumbUrl']) === 'string' && this.props.status === STATUS_EDITING ?
                    <div style={{float: 'left'}}><a href={this.getFileUrl(this.props.objectHolder['thumbUrl'])}
                                                    className='thumbnail'
                                                    style={{marginTop: 8, width: 110}}><img
                      style={{width: 110}} src={this.getFileUrl(this.props.objectHolder['thumbUrl'])}/>
                    </a>
                    </div>
                    : null}
                  <div style={{float: 'left'}}>
                    {this.props.status === STATUS_CREATING && !this.props.objectHolder['thumbUrl'] ?
                      <canvas style={{marginTop: 8}} ref='canvas' width='110'
                              height='110' hidden/> :
                      <canvas style={{marginTop: 8}} ref='canvas' width='110'
                              height='110'/>}
                  </div>
                </div>,
                required: true
              },
              category: {
                elem: <select className='form-control'
                              value={this.props.objectHolder['categoryId']}
                              onChange={e => this.handleSelectedObjectChange('categoryId', e)}>
                  <option key='defGroup' value={undefined}>Choose category...</option>
                  {this.props.productsCategories.map((gc, key) => (
                    <option key={key} value={gc.id}>{gc.name}</option>
                  ))}
                </select>,
                required: true
              }
            }}
      />
    )
      ;
  }

}