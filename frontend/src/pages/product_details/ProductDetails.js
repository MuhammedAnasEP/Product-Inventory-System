import React, { useEffect, useState } from "react";
import "./productDetails.css";
import { useParams } from "react-router-dom";
import usePrvateAxios from "../../hooks/useAxiosPrivate";
import { productDetailsURL } from "../../utils/Constants";
import { addRemoveStockURL } from "../../utils/Constants";
import { imageURL } from "../../utils/Constants";

function ProductDetails() {
  const params = useParams();
  const [productData, setProductData] = useState();
  const [subVariant, setSubVariant] = useState();
  const [variantName, setVariantName] = useState();
  const [subVariantName, setSubVariantName] = useState();
  const [serverError, setServerError] = useState();
  const axios = usePrvateAxios();
  const [stockFormData, setStockFormData] = useState({
    stock: "",
    variant: "",
    sub_variant: "",
  });

  const [error, setError] = useState();

  useEffect(() => {
    getProductDetails(params.id);
  }, []);

  const getProductDetails = (id) => {
    axios
      .get(productDetailsURL + id)
      .then((response) => {
        setProductData(response.data);
        setSubVariant(response.data.variants[0].sub_variants);
        setVariantName(response.data.variants[0].name);
        setSubVariantName(response.data.variants[0].sub_variants[0].name);
      })
      .catch((error) => {
        
        if (error.code === "ERR_NETWORK") {
          setServerError("Network Error");
        }
        setServerError(error.response.data.detail);
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStockFormData({
      ...stockFormData,
      [name]: value,
    });
  };

  const addStock = (e) => {
    e.preventDefault();
    setServerError();
    if (formStockValidate()) {
      setError();
      axios
        .post(
          addRemoveStockURL + params.id,
          JSON.stringify({
            stock: stockFormData.stock,
            variant: stockFormData.variant,
            sub_variant: stockFormData.sub_variant,
            variant_name: variantName,
            sub_name: subVariantName,
          })
        )
        .then((response) => {
          setStockFormData({
            stock: "",
            variant: "",
            sub_variant: "",
          });
          getProductDetails(params.id)
        })
        .catch((error) => {
          console.log(error);
          if (error.code === "ERR_NETWORK") {
            setServerError("Network Error");
          } else if (error.response.status === 401) {
            setServerError(error.response.data.detail);
          } else if (error.response.status === 404) {
            setServerError(error.response.data.detail);
          } else if (error.response.status === 400) {
            setServerError("Check the field");
          }
        });
    }
  };

  const removeStock = (e) => {
    e.preventDefault();
    setServerError();
    if (formStockValidate()) {
      setError();
      axios
        .put(
          addRemoveStockURL + params.id,
          JSON.stringify({
            stock: stockFormData.stock,
            variant: stockFormData.variant,
            sub_variant: stockFormData.sub_variant,
            variant_name: variantName,
            sub_name: subVariantName,
          })
        )
        .then((response) => {
          setStockFormData({
            stock: "",
            variant: "",
            sub_variant: "",
          });
          getProductDetails(params.id)
        })
        .catch((error) => {
          console.log(error);
          if (error.code === "ERR_NETWORK") {
            setServerError("Network Error");
          } else if (error.response.status === 401) {
            setServerError(error.response.data.detail);
          } else if (error.response.status === 404) {
            setServerError(error.response.data.detail);
          } else if (error.response.status === 400) {
            console.log(error)
            setServerError("Check the field");
          }
        });
    }
  };

  const formStockValidate = () => {
    const validationErrors = {};
    let is_valid = true;
    if (!stockFormData.stock.trim()) {
      validationErrors.stock = "stock is required";
      is_valid = false;
    }

    if (!stockFormData.variant.trim()) {
      validationErrors.variant = "variant is required";
      is_valid = false;
    }

    if (!stockFormData.sub_variant.trim()) {
      validationErrors.sub_variant = "sub variant is required";
      is_valid = false;
    }

    setError(validationErrors);
    return is_valid;
  };

  return (
    <div>
      <div class="body-wrapper"></div>

      {productData && (
        <main class="item">
          <section class="img">
            <img src={imageURL + productData.ProductImage} alt={productData.ProductName} class="img-main" />
          </section>

          <section class="price">
            <h2 class="price-sub__heading">
              {" "}
              Created User : {productData?.CreatedUser?.username}
            </h2>
            <h1 class="price-main__heading">{productData.ProductName}</h1>
            <div class="price-box">
              <div class="price-box__main">
                <span class="price-box__main-new">${productData.Price}</span>
              </div>
            </div>
            <p>Total Stock : {productData.TotalStock}</p>

            <div style={{ display: "flex", gap: "5px" }}>
              <p style={{ fontSize: "18px" }}>{variantName} :</p>
              {productData.variants?.map((data) => (
                <div>
                  <button
                    onClick={() => {
                      setSubVariant(data.sub_variants);
                    }}
                    style={{
                      border: "1px solid",
                      width: "60px",
                      height: "30px",
                      paddingTop: "5px",
                      textAlign: "center",
                      borderRadius: "10px",
                      fontSize: "15px",
                    }}
                  >
                    {data.option}
                  </button>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", gap: "5px" }}>
              <div>
                <p style={{ fontSize: "18px" }}>{subVariantName} :</p>
                <p style={{ fontSize: "18px" }}>Stock :</p>
              </div>
              {subVariant?.map((data) => (
                <div>
                  <button
                    style={{
                      border: "1px solid",
                      width: "60px",
                      height: "30px",
                      paddingTop: "5px",
                      textAlign: "center",
                      borderRadius: "10px",
                      fontSize: "15px",
                      marginBottom: "5px",
                    }}
                  >
                    {data.option}
                  </button>
                  <div
                    style={{
                      border: "1px solid",
                      width: "60px",
                      height: "30px",
                      paddingTop: "5px",
                      textAlign: "center",
                      borderRadius: "10px",
                      fontSize: "15px",
                    }}
                  >
                    {data.stock}
                  </div>
                </div>
              ))}
            </div>

            <div class="price-btnbox">
              <button class="price-cart__btn btn--orange" onClick={removeStock}>Remove Stock</button>
              <input
                onChange={handleChange}
                name="variant"
                placeholder="variant"
                value={stockFormData.variant}
                style={{
                  width: "70px",
                  padding: "5px",
                  textAlign: "center",
                  borderRadius: "15px",
                  border: "1px solid",
                  fontSize: "13px",
                }}
              />
              <input
                onChange={handleChange}
                name="sub_variant"
                placeholder="sub_variant"
                value={stockFormData.sub_variant}
                style={{
                  width: "70px",
                  padding: "5px",
                  textAlign: "center",
                  borderRadius: "15px",
                  border: "1px solid",
                  fontSize: "13px",
                }}
              />
              <input
                onChange={handleChange}
                name="stock"
                placeholder="stock"
                value={stockFormData.stock}
                style={{
                  width: "70px",
                  padding: "5px",
                  textAlign: "center",
                  borderRadius: "15px",
                  border: "1px solid",
                  fontSize: "13px",
                }}
              />
              <button onClick={addStock} class="price-cart__btn btn--orange">
                Add Stock
              </button>
            </div>
            {error && (
              <div className="server_error">
                {error.variant && (
                  <span className="form_error">{error.variant}</span>
                )}
                {error.sub_variant && (
                  <span className="form_error">{error.sub_variant}</span>
                )}
                {error.stock && (
                  <span className="form_error">{error.stock}</span>
                )}
              </div>
            )}
            {serverError && (
              <div className="server_error">
                <p>{serverError}</p>
              </div>
            )}
          </section>
        </main>
      )}
    </div>
  );
}

export default ProductDetails;
