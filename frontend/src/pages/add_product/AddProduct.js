import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./addProduct.css";
import { productURL } from "../../utils/Constants";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useAuth from "../../hooks/useAuth";

function AddProduct() {
  const [image, setImage] = useState();
  const [isImage, setIsImage] = useState(false);
  const [error, setError] = useState({})
  const [serverError, setServerError] = useState()
  const axios = useAxiosPrivate()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    ProductName: "",
    ProductID: "",
    ProductCode: "",
    HSNCode: "",
    Price: "",
    variant_name: "",
    sub_variant_name: "",
    variant: "",
    sub_variant: "",
    stock:""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  
  function handleSubmit (e){
    e.preventDefault()
    setServerError()
    let formdata = new FormData();
    formdata.append('ProductImage',image)
    formdata.append('CreatedUser',user.username)
    formdata.append('ProductName',formData.ProductName)
    formdata.append('ProductID',formData.ProductID)
    formdata.append('ProductCode',formData.ProductCode)
    formdata.append('HSNCode',formData.HSNCode)
    formdata.append('Price',formData.Price)
    formdata.append('variant_name',formData.variant_name)
    formdata.append('sub_variant_name',formData.sub_variant_name)
    formdata.append('variant',formData.variant)
    formdata.append('sub_variant',formData.sub_variant)
    formdata.append('stock',formData.stock)
    const body = formdata
    if (formValidate()) {
        setError({})
        axios.post(productURL,body,{
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }).then((res)=>{
            navigate('/details/'+res.data.data.ProductID)
        }).catch((error)=>{
          if (error.code === "ERR_NETWORK") {
            setServerError("Network Error");
          } else if (error.response.status === 401) {
            setServerError("UnAuthorized");
          } else if (error.response.status === 400) {
            setServerError(error.response.data.detail);
          } else if (error.response.status === 500) {
            setServerError("Somthing Went worng, Check the field and try again");
          }

        })
    }else{
        console.log()
    }

  }


    const formValidate = () => {
      const validationErrors = {};
      let is_valid = true;
      if (!formData.ProductName.trim()) {
        validationErrors.name = "Name is required";
        is_valid = false;
      }

      if (!formData.ProductID.trim()) {
        validationErrors.id = "Id is required";
        is_valid = false;
      }

      if (!formData.HSNCode.trim()) {
        validationErrors.hsn = "HSN Code is required";
        is_valid = false;
      }

      if (!formData.ProductCode.trim()) {
        validationErrors.code = "Product Code is required";
        is_valid = false;
      }

      if (!formData.Price.trim()) {
        validationErrors.price = "Price is required";
        is_valid = false;
      }

      if (!formData.variant_name.trim()) {
        validationErrors.variant_name = "Variant Name Code is required";
        is_valid = false;
      }

      if (!formData.variant.trim()) {
        validationErrors.variant = "Variant is required";
        is_valid = false;
      }

      if (!formData.sub_variant_name.trim()) {
        validationErrors.sub_variant_name = "Sub Name Code is required";
        is_valid = false;
      }

      if (!formData.sub_variant.trim()) {
        validationErrors.sub_variant = "Sub variant is required";
        is_valid = false;
      }

      if (!formData.stock.trim()) {
        validationErrors.stock = "Stock is required";
        is_valid = false;
      }

      setError(validationErrors);
      return is_valid;
  };

  return (
    <div class="container-add-product">
      <form onSubmit={handleSubmit}>
        <div class="row">
          <div class="col">
            <h3 class="title">Fill the product details.</h3>

            <div class="inputBox">
              <span>Product Name :</span>
              <input
                type="text"
                placeholder="Product Name"
                name="ProductName"
                onChange={handleChange}
              />
              {error?.name && <span className='login_error'>{error.name}</span>}
            </div>

            <div class="flex">
              <div class="inputBox">
                <span>Product ID :</span>
                <input
                  type="text"
                  onChange={handleChange}
                  placeholder="ProductID"
                  name="ProductID"
                />
                {error.id && <span className='login_error'>{error.id}</span>}
              </div>
              <div class="inputBox">
                <span>Product CODE :</span>
                <input
                  type="text"
                  onChange={handleChange}
                  placeholder="Product CODE"
                  name="ProductCode"
                />
                {error.code && <span className='login_error'>{error.code}</span>}
              </div>
            </div>
            <div class="inputBox">
              <span>HSN Code :</span>
              <input
                type="text"
                onChange={handleChange}
                placeholder="HSN Code"
                name="HSNCode"
              />
              {error.hsn && <span className='login_error'>{error.hsn}</span>}
            </div>
            <div class="inputBox">
              <span>Price :</span>
              <input
                type="text"
                onChange={handleChange}
                placeholder="Price"
                name="Price"
              />
              {error.price && <span className='login_error'>{error.price}</span>}
            </div>
          </div>

          <div class="col">
            <div class="flex" style={{ alignContent: "center" }}>
              <div class="inputBox">
                <span>Product Image :</span>
                <input
                  onChange={(e) => {
                    setImage(e.target.files[0]);
                    setIsImage(true);
                  }}
                  name="image"
                  type="file"
                />
              </div>
              <div class="inputBox">
                {image && (
                  <img
                    src={URL.createObjectURL(image)}
                    style={{ width: "60px", height: "100%" }}
                  />
                )}
              </div>
            </div>

            <div class="flex">
              <div class="inputBox">
                <span>Variant Name:</span>
                <input
                  type="text"
                  onChange={handleChange}
                  placeholder="Name"
                  name="variant_name"
                />
                {error.variant_name && <span className='login_error'>{error.variant_name}</span>}
              </div>
              <div class="inputBox">
                <span>option 1 :</span>
                <input
                  type="text"
                  onChange={handleChange}
                  placeholder="variant"
                  name="variant"
                />
                {error.variant && <span className='login_error'>{error.variant}</span>}
              </div>
            </div>
            <div class="flex">
              <div class="inputBox">
                <span>Subvariant Name:</span>
                <input
                  type="text"
                  onChange={handleChange}
                  placeholder="Sub"
                  name="sub_variant_name"
                />
                {error.sub_variant_name && <span className='login_error'>{error.sub_variant_name}</span>}
              </div>
              <div class="inputBox">
                <span>option :</span>
                <input
                  type="text"
                  onChange={handleChange}
                  placeholder="sub_variant"
                  name="sub_variant"
                />
                {error.sub_variant && <span className='login_error'>{error.sub_variant}</span>}
              </div>
              <div class="inputBox">
                <span>Stock :</span>
                <input
                  type="text"
                  onChange={handleChange}
                  placeholder="stock"
                  name="stock"
                />
                {error.stock && <span className='login_error'>{error.stock}</span>}
              </div>
            </div>
            <div class="inputBox">
              <span>Info :</span>
              <p>
                To Add more variant option and sub variant option go to product
                details page. After the submission of this for it will redirect
                to product detals page for this spesific product.
              </p>
            </div>
          </div>
        </div>
        <input type="submit" value="Add Product" class="submit-btn" />
        {serverError && (
              <div className="server_error">
                <p>{serverError}</p>
              </div>
            )}
      </form>
    </div>
  );
}

export default AddProduct;
