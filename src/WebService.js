import React, { Component } from 'react';

const API = 'http://18.228.14.48/api';

class WebService extends Component {
  // List products
  listProducts() {
    return this.request(
      'products/?cmd=list',
      'get'
    );
  }

  // detail a product
  detailProduct(id) {
    return this.request(
      'products/?cmd=details&id=' + id,
      'get'
    );
  }

  // Create a product
  createProduct(data) {
    return this.request(
      'products',
      'post',
      data
    );
  }

  // Update a product
  updateProduct(data) {
    return this.request(
      'products/' + data.id,
      'put',
      data
    );
  }

  // delete a product
  deleteProduct(id) {
    return this.request(
      'products/' + id,
      'delete'
    );
  }

  request(endpoint, method, body=null){
    let url = API + '/' + endpoint;
    let headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    };
    let config = {
      method: method,
      headers: headers
    };

    if ( body ) {
      config.body = JSON.stringify(body);
    }

    return fetch(url, config)
    .then(response => {
        return response.json()
    });
  }

}

export default WebService;
