import React, { Component } from 'react';

class FilterService extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filteredList: [],
      control: []
    }
  }

  // Filter a list of items
  filter(array, field, value) {
    for (let i=0; i<array.length; i++) {
      let list    = this.state.filteredList;
      let control = this.state.control;
      let object  = array[i];

      object.hash = JSON.stringify(object);

      if ( object[field] != value || control.includes( object.hash) ) {
        continue;
      }

      list.push(object);
      control.push(object.hash);
      this.state.filteredList = list;
    }
  }

  // Filter a single item
  filterList( array, filterObhect ) {
    for ( let field in filterObhect ) {
      this.filter(array, field, filterObhect[field]);
    }
  }
}

export default FilterService;
