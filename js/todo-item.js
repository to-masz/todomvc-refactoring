'use strict';
/* global React module */

var TodoItem = React.createClass({
  sbmt: function() {
    var val = this.state.editText.trim();
    if (val) {
      this.props.onSave(val);
      this.setState({editText: val});
    } else {
      this.props.onDestroy();
    }
  },

  dblclk: function() {
    this.props.onEdit(function() {
      var node = this.refs.editField.getDOMNode();
      node.focus();
      node.setSelectionRange(node.value.length, node.value.length);
    }.bind(this));
    this.setState({editText: this.props.todo.title});
  },

  doun: function(event) {
    if (event.which === 27) {
      this.setState({editText: this.props.todo.title});
      this.props.onCancel(event);
    } else if (event.which === 13) {
      this.sbmt(event);
    }
  },

  handleChange: function(event) {
    this.setState({editText: event.target.value});
  },

  getInitialState: function() {
    return {editText: this.props.todo.title};
  },

  render: function() {
    return (
      <li className={React.addons.classSet({
        completed: this.props.todo.completed,
        editing: this.props.editing
      })}>
        <div className="view">
          <input className="toggle" type="checkbox" checked={this.props.todo.completed} onChange={this.props.onToggle}/>
          <label onDoubleClick={this.dblclk}>{this.props.todo.title}</label>
          <button className="destroy" onClick={this.props.onDestroy}/>
        </div>
        <input ref="editField" className="edit" value={this.state.editText} onBlur={this.sbmt}
               onChange={this.handleChange} onKeyDown={this.doun}/>
      </li>
    );
  }
});

module.exports = TodoItem;
