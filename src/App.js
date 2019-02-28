import React, { Component } from 'react';
import WebService from './WebService';
import FilterService from './FilterService';

class App extends Component {
  constructor(props) {
    super(props);
    this.WS = new WebService();
    this.FS = new FilterService();
    this.state = {
      resultMessage: null, // Action message
      filter: {
        code: null, // Listfilter
      },
      action: 'create', // Defaul action
      products: [], // Defaul product list
    };

    // Binds the contexts to the button handlers
    this.handleSubmit = this.handleSubmit.bind(this);
    this.resetForm    = this.resetForm.bind(this);
    this.searchByCode = this.searchByCode.bind(this);
  }

  // Component is ready
  componentDidMount() {
    this.loadProducts()
  }

  // Brings the form to the original state
  resetForm() {
    this.setState({'action': 'create'});

    let form = document.getElementById('productForm');
    form.reset();
  }

  // Loads the product to the list
  loadProducts() {
    this.WS
      .listProducts()
      .then(data => {
        let filteredData = this.filterProducts(data);
        if ( filteredData.length > 0 ) {
          data = filteredData;
        }
        this.setState({products: data});
        this.setState({filter: {'code': null }});
      });
  }

  // Aplly filter to the list
  filterProducts(products) {
    let filter = this.state.filter;
    if ( ! filter.code ) {
      return products;
    }

    this.FS.filterList( products, filter );
    return this.FS.state.filteredList;
  }

  // Enable product edition
  editProduct( product ) {
    this.setState({'action' : 'update' });
    this.setState({ resultMessage: null});

    for( let index in product ) {
      let field = document.getElementById(index);
      if ( field ) {
        field.value=product[index];
      }
    }
  }

  // Deletes a product
  deleteProduct( product ) {
    this.setState({ resultMessage: null});

    if ( window.confirm( 'Excluir: '  + product.code  + ' ?') ) {
      this.WS
        .deleteProduct(product.id)
        .then(data => {
          this.setState({'resultMessage': 'Registro excluido com sucesso'})
          this.resetForm();
          this.loadProducts();

        })
        .catch(error => {
          console.log(error);
        });
    }
  }

  // Perform a search by code
  searchByCode() {
    let element = document.getElementById('filter-code');
    if ( element.value ) {
      this.setState({
        'filter': {'code': element.value }
      });

    }
    this.loadProducts();
  }

  // Handles the submit form
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
            this.setState({'resultMessage': 'Registro salvo com sucesso'})
            this.resetForm();
            this.loadProducts();
          })
          .catch(error => {
            console.log(error);
          });
      break;
      case 'update':
        this.WS
          .updateProduct(data)
          .then(data => {
            this.setState({'resultMessage': 'Registro atualizado com sucesso'})
            this.resetForm();
            this.loadProducts();
          })
          .catch(error => {
            console.log(error);
          });
      break;
    }
  }

/* RENDERINGS */

  render() {
    return (
      <div className="container">
        { this.actionMessage() }
        <h4>Produto</h4>
        <form  onSubmit={this.handleSubmit} id="productForm">
          <input type="hidden" id="id" name="id" />

          <div className="row">
            <div className="col-md-3">
                <label >Código</label>
                <input type="text" id="code" name="code"   maxLength="30"/>
            </div>
            <div className="col-md-3">
                <label>Valor</label>
                <input type="number" step="0.01" id="value" name="value" />
            </div>
            <div className="col-md-3">
                <label>Status</label>
                <select id="status" name="status">
                  <option value="enable">Habilitado</option>
                  <option value="disable">Desabilitado</option>
                </select>
            </div>
            <div className="col-md-3">
                <label>Quantidade</label>
                <input type="number" id="qty" name="qty" />
            </div>
          </div>

          <div className="row">
            <div className="col-md-12">
                <label>Descrição</label>
                <textarea id="description" name="description" maxLength="150"/>
            </div>
          </div>

          <div className="row">
            <div className="col-md-12">
                <label>Descrição Curta</label>
                <textarea id="short_description" name="short_description"  maxLength="30"/>
            </div>
          </div>

          <div className="row">
            <div className="col-md-12">
              <button className="btn btn-success float-right">Salvar</button>
              <a onClick={ this.resetForm } className="btn btn-primary btn-reset float-right">Reset</a>
            </div>
          </div>
        </form>

        { this.productTable() }

      </div>
    );
  }

  actionMessage() {
    if ( ! this.state.resultMessage ) {
      return;
    }

    return(
      <div className='alert alert-success' role="alert">
        { this.state.resultMessage }
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
          <tr>
            <td colSpan="4">
              <input type="text" id="filter-code" placeholder="Buscar pelo código produto" />
            </td>
            <td>
              <button className="btn btn-search btn-info btn-sm" onClick={ this.searchByCode } >Buscar</button>
            </td>
          </tr>

          {
            products.map((product, index) =>
              <tr key={index}>
                <th scope="row">{product.id}</th>
                <td>{product.code}</td>
                <td>{product.short_description}</td>
                <td>{product.value}</td>
                <td>
                  <button className="btn btn-primary btn-sm" onClick={ () => this.editProduct( product ) }>Editar</button>
                  <button className="btn btn-danger btn-sm" onClick={ () => this.deleteProduct( product ) }>Excluir</button>
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
