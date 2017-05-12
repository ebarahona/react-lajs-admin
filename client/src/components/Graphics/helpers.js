import {ASSIGN_GROUP, ADD_COLOR} from '../../definitions';
import map from 'lodash/map';
import forEach from 'lodash/forEach';

export function updateArray(resObj) {
  this.props.setEditingObjectProperty(resObj.name, [...resObj.array]);
}

export function updateNestedArray(objectHolder, arrName, ind, propName, event) {
  console.warn(objectHolder, arrName, ind, propName, event)
  const arr = [...objectHolder[arrName]];
  (arr[ind])[propName] = event.target.value;
  this.props.setEditingObjectProperty(arrName, [...arr]);
}

export function addToNestedArray(objectHolder, arrName, obj) {
  let arr = [...objectHolder[arrName]];
  if (typeof arr !== 'object') {
    arr = [];
  }
  arr[arr.length] = {...obj};
  return {name: arrName, array: arr};
}

export function deleteFromNestedArray(objectHolder, arrName, key) {
  let arr = [...objectHolder[arrName]];
  arr.splice(key, 1);
  return {name: arrName, array: arr};
}

export function deleteFromDblNestedArray(objectHolder, fArr, sArr, colorizableKey, key) {
  let arr = [...objectHolder[fArr]];
  arr[colorizableKey][sArr].splice(key, 1);
  return {name: fArr, array: arr};
}

export function updateDblNestedArray(objectHolder, fArrName, sArrName, fInd, sInd, propName, event) {
  const arr = [...objectHolder[fArrName]];
  arr[fInd][sArrName][sInd][propName] = event.target.value;
  return {name: fArrName, array: arr};
}

export function onColorizableChange(objectHolder, option, key) {
  let colorizables = [...objectHolder['colorizables']];
  colorizables[key].assignColorgroup = option.value;
  this.props.setEditingObjectProperty('colorizables', colorizables);
}

export function onColorizableColorsSelectChange(objectHolder, val, key) {
  let colorizables = [...objectHolder['colorizables']];
  let colors = [];
  if (val) {
    forEach(val, v => colors.push({name: v.name, value: v.value}));
    colorizables[key]._colors = colors;
    this.props.setEditingObjectProperty('colorizables', colorizables);
  }
}

export function onColorizableColorgroupSelectChange(objectHolder, val, key) {
  let colorizables = [...objectHolder['colorizables']];
  if (val) {
    colorizables[key].colorgroup = {name: val.name, id: val.id};
    this.props.setEditingObjectProperty('colorizables', colorizables);
  }
}

export function getColorizableColorsOptions() {
  return [{value: false, name: ADD_COLOR}, {value: true, name: ASSIGN_GROUP}];
}

export function getColorsOptionsByColorizable(colorizables, key) {
  if (!colorizables[key]._colors ||
    !colorizables[key]._colors.length) {
    return [];
  }
  let arr = colorizables;
  if (arr[key]._colors) {
    return map(arr[key]._colors, col => ({value: col.value, name: col.name}));
  }
}

export function getSelectedColorizableOptions(colorizables, key) {
  let arr = colorizables;
  if (!arr[key].assignColorgroup) {
    return {value: arr[key].assignColorgroup, name: ADD_COLOR};
  } else {
    return {value: arr[key].assignColorgroup, name: ASSIGN_GROUP};
  }
}

export function getSelectedColorizableColorgroupOptions(colorizables, key) {
  if (!colorizables[key].colorgroup) {
    return {};
  }
  let arr = colorizables;
  if (arr[key].colorgroup) {
    return {id: arr[key].colorgroup.id, name: arr[key].colorgroup.name};
  }
}

export function getOptions(prop) {
  if (!prop || !prop.length) {
    return [];
  }
  return prop;
}

export function getSelectedOptions(prop) {
  if (!prop || !prop.length) {
    return [];
  }
  if (typeof (prop)[0] === 'string') {
    return map(prop, col => ({value: col, name: col}));
  }
  return prop;
}

export function toCanvas(image, ref) {
  const img = new Image();
  let imageOut = new Image();
  const reader = new FileReader();
  reader.onload = e => img.src = e.target.result;
  reader.readAsDataURL(image);
  let c = ref;
  let ctx = c.getContext('2d');
  ctx.clearRect(0, 0, c.width, c.height);
  img.onload = () => imageOut = ctx.drawImage(img, 0, 0, 100, 100);
}