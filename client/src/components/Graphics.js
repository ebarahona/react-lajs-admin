import React, {Component, PropTypes} from 'react';
import View from './View';
import * as GraphicModel from '../../../common/models/graphic.json';
const Graphic = GraphicModel.properties;

export default class GraphicsComponent extends Component {
  static propTypes = {
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
    graphicsCategories: PropTypes.array.isRequired,
    token: PropTypes.string
  };

  handleSelectedObjectChange = (propertyName, event) => {
    this.props.setEditingObjectProperty(propertyName, event.target.value);
  };

  handleFileChoose = (prop, e) => {
    this.props.setEditingObjectProperty(prop, e.target.files[0]);
  };

  render() {
    return (
      <View {...this.props} objectSample={Graphic} sortingSupport={true}
            hiddenProperties={['id', 'categoryId', 'colors', 'colorize',
              'colorizableElements', 'multicolor', 'description', 'image']}
            hiddenInputs={['id', 'categoryId']}
            changedInputs={{
              image: <input type='file' className='form-control'
                            onChange={e => this.handleFileChoose('image', e)}/>,
              thumb: <input type='file' className='form-control'
                            onChange={e => this.handleFileChoose('thumb', e)}/>,
              description: <textarea className='form-control' rows='3'
                                     value={this.props.objectHolder['description']}
                                     onChange={e => this.handleSelectedObjectChange('description', e)}>
                          </textarea>,
              colorize: <select style={{width: '100%'}}
                                value={this.props.objectHolder['colorize']}
                                onChange={e => this.handleSelectedObjectChange('colorize', e)}>
                <option value={false}>No</option>
                <option value={true}>Yes</option>
              </select>

            }}
            customInputs={{
              category: <select style={{width: '100%'}}
                                value={this.props.objectHolder['categoryId']}
                                onChange={e => this.handleSelectedObjectChange('categoryId', e)}>
                <option key='defGroup' value={''}>Root category</option>
                {this.props.graphicsCategories.map((gc, key) => (
                  <option key={key} value={gc.id}>{gc.name}</option>
                ))}
              </select>
            }}
      />
    );
  }
}
