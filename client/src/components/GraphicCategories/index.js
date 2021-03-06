import React, {Component} from 'react';
import {PTypes} from './PropTypes';
import {
  STATUS_CONFIRM_DELETE,
  DELETE_CATEGORY,
  MOVE_GRAPHICS_TO_OTHER_CATEGORY,
  MOVE_CATEGORY_TO_OTHER_CATEGORY,
  DELETE_GRAPHICS
} from '../../definitions';
import * as GraphicsCategoryModel from '../../../../common/models/graphics-category.json';
import View from './View';
import filter from 'lodash/filter';
import {getFileUrl, getName} from '../../utils';
const GraphicsCategory = GraphicsCategoryModel.properties;

export default class extends Component {
  static propTypes = PTypes;

  constructor(props) {
    super(props);
    this.state = {
      deleting: false,
      selectedValue: DELETE_CATEGORY,
      newGraphicsCategory: '',
      selectedSecondaryValue: DELETE_GRAPHICS,
      newGraphic: '',
      imgUrl: ''
    };
  }

  handleSelectedObjectChange = (propertyName, event) => {
    this.props.setEditingObjectProperty(propertyName, event.target.value);
  };

  deleteRelatedCats = (catId, cats, graphicsAction) => {
    this.props.deleteEntity(catId, this.props.token);
    if (graphicsAction !== MOVE_GRAPHICS_TO_OTHER_CATEGORY || catId !== this.props.objectHolder.id) {
      this.props.secondaryData.forEach(g => {
        if (g.categoryId === catId) {
          this.props.deleteSecondaryEntity(g.id, this.props.token);
        }
      });
    }
    cats = filter(cats, cat => cat.id !== catId);
    cats.forEach(cat => {
      if (cat.graphicsCategoryId === catId) {
        this.deleteRelatedCats(cat.id, cats, graphicsAction);
      }
    });
  };

  handleDeleteBtnClick = confirmed => {
    if (this.props.status === STATUS_CONFIRM_DELETE && confirmed) {
      if (this.state.selectedValue === DELETE_CATEGORY) {
        const cats = [...this.props.data];
        this.deleteRelatedCats(this.props.objectHolder.id, cats, this.state.selectedSecondaryValue);
      } else {
        if (this.state.selectedValue === MOVE_CATEGORY_TO_OTHER_CATEGORY) {
          this.props.data.forEach(c => {
            if (c.graphicsCategoryId === this.props.objectHolder.id) {
              this.props.editEntity(c.id, {...c, graphicsCategoryId: this.state.newGraphicsCategory}, this.props.token);
            }
          });
          this.props.deleteEntity(this.props.objectHolder.id, this.props.token);
        }
      }
      if (this.state.selectedSecondaryValue === MOVE_GRAPHICS_TO_OTHER_CATEGORY) {
        this.props.secondaryData.forEach(c => {
          if (c.categoryId === this.props.objectHolder.id) {
            this.props.editSecondaryEntity(c.id, {...c, categoryId: this.state.newGraphic}, this.props.token);
          }
        });
      }
      this.props.enableDefaultStatus();
      this.props.restoreTableState(GraphicsCategory);

    }
  };

  handleCategoryActionOption = option => {
    if (option === DELETE_CATEGORY) {
      this.setState({...this.state, selectedValue: option, newGraphic: ''});
    } else if (option === MOVE_CATEGORY_TO_OTHER_CATEGORY) {
      this.setState({...this.state, selectedValue: option});
    }

  };

  handleMoveToCategory = e => {
    this.setState({...this.state, newGraphicsCategory: e.target.value});

  };

  handleGraphicActionOption = option => {
    this.setState({...this.state, selectedSecondaryValue: option});

  };

  handleMoveGraphicToCategory = e => {
    this.setState({...this.state, newGraphic: e.target.value});
  };

  render() {
    return (
      <View {...this.props} {...this}
            newGraphic={this.state.newGraphic}
            newGraphicsCategory={this.state.newGraphicsCategory}
            selectedValue={this.state.selectedValue}
            selectedSecondaryValue={this.state.selectedSecondaryValue}
            imgUrl={this.state.imgUrl}
            getFileUrl={getFileUrl}
            getName={getName}
      />
    );
  }
}
