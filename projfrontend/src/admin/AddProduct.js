import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { isAuthenticated } from "../auth/helper";
import Base from "../core/Base";
import { createSingleProduct, getAllCategories } from "./helper/adminapicall";

const AddProduct = ({history}) => {

    const {user, token} = isAuthenticated();

  const [value, setValue] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    photo: "",
    categories: [],
    category: "",
    loading: false,
    error: "",
    createdProduct: "",
    getaRedirect: "",
    formData: "",
  });

  const {
    name,
    description,
    price,
    stock,
    categories,
    category,
    loading,
    error,
    createdProduct,
    getaRedirect,
    formData,
  } = value;

  useEffect(()=>{
    preLoad()
  }, [])

  const preLoad = () => {
    getAllCategories().then(data => {
        
        if(data.error){
            setValue({...value, error: data.error})
        }
        else{
            setValue({...value, categories: data, formData: new FormData()})
            console.log(categories)
        }
    })
  }

  const onSubmit = e => {
      e.preventDefault();
      setValue({...value, error: "", loading:true})
      createSingleProduct(user._id, token, formData).then(data =>{
          if(data.error){
              setValue({...value, error: data.error})
          }
          else{
              setValue({
                  ...value,
                  name: "",
                  description: "",
                  price: "",
                  photo: "",
                  stock: "",
                  loading: false,
                  createdProduct: data.name
              })

              setTimeout(()=>{
                history.push("/admin/dashboard")
            }, 2000)
          }
      })
  };

  const handleChange = (name) => (event) => {
      const v = name === "photo" ? event.target.files[0] : event.target.value;
      formData.set(name, v);
      setValue({...value, [name]: v})
  };

  const createProductForm = () => (
    <form>
      <span>Post photo</span>
      <div className="form-group mb-2">
        <label className="btn btn-block btn-success ">
          <input
            onChange={handleChange("photo")}
            type="file"
            name="photo"
            accept="image"
            placeholder="choose a file"
          />
        </label>
      </div>
      <div className="form-group mb-2">
        <input
          onChange={handleChange("name")}
          name="photo"
          className="form-control"
          placeholder="Name"
          value={name}
        />
      </div>
      <div className="form-group mb-2">
        <textarea
          onChange={handleChange("description")}
          name="photo"
          className="form-control"
          placeholder="Description"
          value={description}
        />
      </div>
      <div className="form-group mb-2">
        <input
          onChange={handleChange("price")}
          type="number"
          className="form-control"
          placeholder="Price"
          value={price}
        />
      </div>
      <div className="form-group mb-2">
        <select
          onChange={handleChange("category")}
          className="form-control"
          placeholder="Category"
        >
          <option>Select</option>
          {categories && categories.map((cate, index) =>{
              return(
                  <option key={index} value={cate._id}>{cate.name} </option>
              )
          })}
        </select>
      </div>
      <div className="form-group mb-2">
        <input
          onChange={handleChange("stock")}
          type="number"
          className="form-control"
          placeholder="Stock"
          value={stock}
        />
      </div>

      <button
        type="submit"
        onClick={onSubmit}
        className="btn btn-outline-success my-3"
      >
        Create Product
      </button>
    </form>
  );

  const successMessage = () =>{
      return(
          <div className="alert alert-success mt-3" style={{display: createdProduct ? "" : "none"}}>
              <h4>{createdProduct} created successfully!</h4>
              
          </div>
      )
  }

  const errorMessage = () =>{
    return(
        <div className="alert alert-danger mt-3" style={{display: error ? "" : "none" }}>
            <h4>Error</h4>
        </div>
    )
}

  return (
    <Base
      title="Add a product here!"
      description="Welcome to product creation section"
      className="container bg-info p-4"
    >
      <Link to="/admin/dashboard" className="btn btn-md btn-dark mb-3">
        Admin Home
      </Link>
      <div className="row bg-dark text-white rounded">
        <div className="col-md-8 offset-md-2">
            {successMessage()}
            {errorMessage()}
            {createProductForm()}
        </div>
      </div>
    </Base>
  );
};

export default AddProduct;
