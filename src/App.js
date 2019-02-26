import React, { Component } from 'react';
import WebService from './WebService';

class App extends Component {
  constructor(props) {
    super(props);
    this.WS = new WebService();
    this.state = {
      products: [],
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

  loadProduct( data ) {
    this.setState({'product': data});
  }

  deleteProduct( id ) {
    console.log(id);
  }

  saveProduct( data ) {
    console.log(data.id);
  }

  // Renders the form
  render() {
    return (
      <div className="container">
        <h4>Produto</h4>
        <div className="row">
          <div className="col-md-3">
              <label >Código</label>
              <input type="text" id="code" />
          </div>
          <div className="col-md-3">
              <label>Valor</label>
              <input type="text" id="value" />
          </div>
          <div className="col-md-3">
              <label>Status</label>
              <input type="text" id="status" />
          </div>
          <div className="col-md-3">
              <label>Quantidade</label>
              <input type="text" id="qty" />
          </div>
        </div>

        <div className="row">
          <div className="col-md-12">
              <label>Descrição</label>
              <textarea id="description" />
          </div>
        </div>

        <div className="row">
          <div className="col-md-12">
              <label>Descrição Curta</label>
              <textarea id="short_description" />
          </div>
        </div>

        <div className="row">
          <div className="col-md-12">
            <button className="btn btn-success float-right">Salvar</button>
          </div>
        </div>

        { this.productTable() }

      </div>
    );
  }

  // Renders the product table
  productTable () {
    let products = this.state.products;

    return <div className="row">
      <table className="table">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Código</th>
            <th scope="col">Produto</th>
            <th scope="col">Valor</th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody>
          {
            products.map((product, index) =>
              <tr key={index}>
                <th scope="row">{product.id}</th>
                <td>{product.code}</td>
                <td>{product.short_description}</td>
                <td>{product.value}</td>
                <td>
                  <button className="btn btn-primary btn-sm" onClick={ () => this.loadProduct( product ) }>Editar</button>
                  <button className="btn btn-danger btn-sm">Excluir</button>
                </td>
              </tr>
            )
          }
        </tbody>
      </table>
    </div>
  }
}

export default App;
