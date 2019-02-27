import React, { Component } from 'react';
import WebService from './WebService';

class App extends Component {
  constructor(props) {
    super(props);

    this.WS = new WebService();
    this.state = {
      action: 'create',
      id: null,
      products: [],
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    // Loads the product list
    this.WS
      .listProducts()
      .then(data => {
        this.setState({ products: data});
      });
  }

  editProduct( product ) {
    this.setState({
      action: 'update',
      id: product.id
    });

    // Need to load the data to edit
  }

  handleSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    let data = {}

    for (let name of formData.keys()) {
      const input = form.elements[name];
      data[input.name] = input.value;
    }

    switch(this.state.action) {
      case 'create':
        //Create new register
        this.WS
          .createProduct(data)
          .then(data => {
            console.log('Registro salvo com sucesso');
          });
      break;
      case 'update':
        //Create new register
        let id = this.state.id;
        this.WS
          .updateProduct(id, data)
          .then(data => {
            console.log('Registro atualizado com sucesso');
          });
      break;
    }

    return false;
  }


  // Renders the form
  render() {
    return (
      <div className="container">
        <h4>Produto</h4>
        <form  onSubmit={this.handleSubmit}>
          <div className="row">
            <div className="col-md-3">
                <label >Código</label>
                <input type="text" id="code" name="code" />
            </div>
            <div className="col-md-3">
                <label>Valor</label>
                <input type="text" name="value" />
            </div>
            <div className="col-md-3">
                <label>Status</label>
                <input type="text" name="status" />
            </div>
            <div className="col-md-3">
                <label>Quantidade</label>
                <input type="text" name="qty" />
            </div>
          </div>

          <div className="row">
            <div className="col-md-12">
                <label>Descrição</label>
                <textarea name="description" />
            </div>
          </div>

          <div className="row">
            <div className="col-md-12">
                <label>Descrição Curta</label>
                <textarea name="short_description" />
            </div>
          </div>

          <div className="row">
            <div className="col-md-12">
              <button className="btn btn-success float-right">Salvar</button>
            </div>
          </div>
        </form>

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
                  <button className="btn btn-primary btn-sm" onClick={ () => this.editProduct( product ) }>Editar</button>
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
