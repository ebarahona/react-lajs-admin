import React, {Component, PropTypes} from 'react';
import {FormControl} from 'react-bootstrap';
import {findDOMNode} from 'react-dom';
import {ID_PROP, STATUS_EDITING, STATUS_CREATING, STATUS_DEFAULT} from '../../definitions';
import * as ColorModel from '../../../../common/models/color.json';
const Color = ColorModel.properties;
import * as ColorgroupModel from '../../../../common/models/colorgroup.json';
const Colorgroup = ColorgroupModel.properties;

export default class Table extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    secondaryData: PropTypes.arrayOf(PropTypes.any),
    data: PropTypes.arrayOf(PropTypes.any).isRequired,
    error: PropTypes.string,
    loading: PropTypes.bool.isRequired,
    fetchData: PropTypes.func.isRequired,
    fetchSecondaryData: PropTypes.func.isRequired,
    selectedRowId: PropTypes.string,
    status: PropTypes.string.isRequired,
    selectRow: PropTypes.func.isRequired,
    enableEditing: PropTypes.func.isRequired,
    enableCreating: PropTypes.func.isRequired,
    enableDefaultStatus: PropTypes.func.isRequired,
    createEntity: PropTypes.func.isRequired,
    editEntity: PropTypes.func.isRequired,
    deleteEntity: PropTypes.func.isRequired
  };

  componentWillMount() {
    this.props.fetchSecondaryData();
    this.editingEntityInput = {};
    this.newEntityInput = {};
    this.props.fetchData();
  }

  renderTableHeadings = object => {
    return Object.getOwnPropertyNames(object).map((prop, i) => {
      if (prop === ID_PROP) {
        return (
          null
        );
      } else {
        return (<th key={i}>{prop}</th>);
      }
    });
  };

  renderCreatingRow = () => {
    return (
      <tr>{Object.getOwnPropertyNames(Color).map((prop, i) => {
        if (prop === ID_PROP) {
          return null;
        }

        return (<td key={i}><FormControl type='text' ref={input => this.newEntityInput[prop] = input}/>
        </td>);
      })}
      </tr>
    );
  };

  renderTableData = (data, object) => {
    if (!data.length) {
      return null;
    }

    return data.map((item, k) => {

      if (this.props.status === STATUS_EDITING && item[ID_PROP] === this.props.selectedRowId) {
        return (
          <tr key={k}
              onClick={() => this.handleRowClick(item[ID_PROP])}>
            {Object.getOwnPropertyNames(object).map((prop, j) => {
              if (prop === ID_PROP) {
                return null;
              }

              return (
                <td key={j}><FormControl type='text'
                                         defaultValue={typeof item[prop] === 'object' && !item[prop] ? '' : item[prop]}
                                         ref={input => this.editingEntityInput[prop] = input}/>
                </td>
              );
            })}
          </tr>
        );
      }

      return (
        <tr key={k} className={item[ID_PROP] === this.props.selectedRowId ? 'selected' : null}
            onClick={() => this.handleRowClick(item[ID_PROP])}>
          {Object.getOwnPropertyNames(object).map((prop, j) => {
            if (prop === ID_PROP) {
              return null;
            } else {
              if (!(typeof this.props.selected2RowId === 'object' && !this.props.selected2RowId)) {
                if (item['colorgroup_name'] !== this.props.secondaryData.filter(
                    group => group.id === this.props.selected2RowId)[0].name) {
                  return null;
                }
              }

              if (prop === 'value') {
                return <td key={j}>
                  {item[prop]}
                  <div className='preview' style={{background: item[prop]}}></div>
                </td>;
              }
              return <td key={j}>{item[prop]}</td>;
            }
          })}
        </tr>
      );
    });
  };

  renderSecondaryTableData = (data, object) => {
    if (!data.length) {
      return null;
    }

    return data.map((item, k) => {
      if (this.props.status === STATUS_EDITING && item[ID_PROP] === this.props.selectedRowId) {
        return (
          <tr key={k}
              onClick={() => this.handleRowClickSecondTable(item[ID_PROP])}>
            {Object.getOwnPropertyNames(object).map((prop, j) => {
              if (prop === ID_PROP) {
                return null;
              }

              return (
                <td key={j}><FormControl type='text'
                                         defaultValue={typeof item[prop] === 'object' && !item[prop] ? '' : item[prop]}
                                         ref={input => this.editingEntityInput[prop] = input}/>
                </td>
              );
            })}
          </tr>
        );
      }

      return (
        <tr key={k} className={item[ID_PROP] === this.props.selected2RowId ? 'selected' : null}
            onClick={() => this.handleRowClickSecondTable(item[ID_PROP])}>
          {Object.getOwnPropertyNames(object).map((prop, j) => {
            if (prop === ID_PROP) {
              return null;
            } else {
              return (
                <td key={j}>{item[prop]}</td>
              );
            }
          })}
        </tr>
      );
    });
  };

  renderTable = (data, object) => (
    <section className='panel panel-default'>
      <div style={{'maxHeight': '60vh', 'overflow': 'scroll'}}>
        <tb className='table-responsive'>
          <table className='table no-margin table-hover'>
            <thead>
            <tr>
              {this.renderTableHeadings(object)}
            </tr>
            </thead>
            <tbody>
            {this.props.status === STATUS_CREATING ? this.renderCreatingRow() : null}
            {this.renderTableData(data, object)}
            </tbody>
          </table>
        </tb>
      </div>
    </section>
  );

  renderButtons = () => (
    this.props.status === STATUS_EDITING || this.props.status === STATUS_CREATING ?
      this.renderEditingButtons() : this.renderDefButtons()
  );

  renderDefButtons = () => (
    <div className='pull-right'>
      <a className='btn btn-app' onClick={this.handleCreateBtnClick}><i className='fa fa-plus'/>Add
      </a>
      <a className='btn btn-app' onClick={this.handleEditBtnClick}><i className='fa fa-pencil-square-o'/>Edit
      </a>
      <a className='btn btn-app' onClick={this.handleDeleteBtnClick}><i className='fa fa-trash-o'/>Delete
      </a>
      <a className='btn btn-app' onClick={() => {
        this.props.fetchData();
        this.props.fetchSecondaryData();
      }}>
        <i className='fa fa-refresh'/>Sync
      </a>
    </div>
  );

  renderEditingButtons = () => (
    <div className='pull-right'>
      <a className='btn btn-app' onClick={this.handleSaveBtnClick}><i className='fa fa-check'/>Save</a>
      <a className='btn btn-app' onClick={this.handleCancelBtnClick}><i className='fa fa-ban'/>Cancel</a>
    </div>
  );

  renderSecondaryTable = (data, object) => (

    <section className='panel panel-default'>
      <div>
        <div className='table-responsive'>
          <table className='table no-margin'>
            <thead>
            <tr>
              {this.renderTableHeadings(object)}
            </tr>
            </thead>
            <tbody>
            {this.renderSecondaryTableData(data, object)}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );

  handleRowClick = id => {
    if (this.props.status !== STATUS_EDITING) {
      this.props.selectRow(id);
    }
  };

  handleRowClickSecondTable = id => {
    this.props.enableDefaultStatus();
    this.props.selectSecondaryRow(id);
  };

  handleCreateBtnClick = () => {
    if (this.props.status === STATUS_DEFAULT) {
      this.props.enableCreating();
    }
  };

  handleEditBtnClick = () => {
    if (this.props.status === STATUS_DEFAULT
      && !(typeof this.props.selectedRowId === 'object' && !this.props.selectedRowId)) {
      this.props.enableEditing();
    }
  };

  handleDeleteBtnClick = () => {
    if (this.props.status === STATUS_DEFAULT) {
      this.props.deleteEntity(this.props.selectedRowId);
    }
  };

  handleSaveBtnClick = () => {
    if (this.props.status === STATUS_EDITING) {
      const properties = Object.getOwnPropertyNames(Color);
      const entity = {};
      properties.forEach(prop => {
        if (prop !== ID_PROP) {
          entity[prop] = findDOMNode(this.editingEntityInput[prop]).value || undefined;
        }
      });
      this.props.editEntity(this.props.selectedRowId, entity);
    } else if (this.props.status === STATUS_CREATING) {
      const properties = Object.getOwnPropertyNames(Color);
      const entity = {};
      properties.forEach(prop => {
        if (prop !== ID_PROP) {
          entity[prop] = findDOMNode(this.newEntityInput[prop]).value || undefined;
        }
      });
      this.props.createEntity(entity);
    }
    this.props.enableDefaultStatus();
    setTimeout(this.props.fetchData, 1000);
  };

  handleCancelBtnClick = () => {
    if (this.props.status !== STATUS_DEFAULT) {
      this.props.enableDefaultStatus();
    }
  };

  render() {
    const {secondaryData, data, loading, error, title, secondaryTitle} = this.props;

    if (loading) {
      return (
        <main>
          <div className='loader'></div>
          <section className='content-header'>
            <h1>Loading...</h1>
          </section>
          <section className='content'>
          </section>
        </main>
      );
    }

    if (error) {
      return (<div className='alert alert-danger'>Error: {error}</div>);
    }

    return (
      <main>
        <section className='content-header'>
          <h1>Navigator</h1>
        </section>
        <section className='content'>
          <div className='row'>
            <div className='col-lg-4'>
              {this.renderSecondaryTable(secondaryData, Colorgroup)}
              <p>{secondaryTitle + ': ' + secondaryData.length}</p>
            </div>
            <div className='col-lg-8'>
              {this.renderTable(data, Color)}

              {this.renderButtons()}
              <p>{title + ': ' + data.length}</p>
            </div>
          </div>
        </section>
      </main>
    );
  }
}