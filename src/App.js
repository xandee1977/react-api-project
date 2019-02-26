import React, { Component } from 'react';
import WebService from './WebService';

//const API = 'http://18.228.14.48/api/products/?cmd=list';

class App extends Component {
  constructor(props) {
    super(props);
    this.WS = new WebService();

    this.state = {
      products: []
    };
  }

  componentDidMount() {
    // Loads the product list
    this.WS
      .listProducts()
      .then(data => {
        this.setState({ products: data});
      });
  }

  render() {
    let products = this.state.products;
    return(
      <ul>
        { products.map((product) => <li>{product.code} - {product.description}</li>)}
      </ul>
    )
  }
}

export default App;
