import React, { useEffect, useState } from "react";
import "./Products.css";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { productURL } from "../../utils/Constants";
import { Link } from "react-router-dom";
import { imageURL } from "../../utils/Constants";

function Products() {
  const [data, setData] = useState();
  const [nextUrl, setNextUrl] = useState();
  const [previousUrl, setPreviousUrl] = useState();
  const axios = useAxiosPrivate();

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    axios.get(productURL).then((res) => {
      setData(res.data.results);
      setNextUrl(res.data.next);
      setPreviousUrl(res.data.previous);
    });
  };

  const paginationHandler = (url) => {
    axios.get(url).then((res) => {
      setData(res.data.results);
      setNextUrl(res.data.next);
      setPreviousUrl(res.data.previous);
    });
  };

  return (
    <div>
      <div class="container d-flex justify-content-center mt-50">
      <div class="row">
        {data?.map((data) => (
          <div class="col-md-10">
            <div class="card card-body">
              <div class="media align-items-center align-items-lg-start text-center text-lg-left flex-column flex-lg-row">
                <div class="mr-5 mb-3 mb-lg-0">
                  <img
                    src={imageURL + data.ProductImage}
                    width="150"
                    height="150"
                    alt={data.ProductName}
                    style={{ borderRadius: "10px" }}
                  />
                </div>

                <div class="media-body">
                  <h6 class="media-title font-weight-semibold">
                    <a href="#" data-abc="true">
                      <Link to={`/details/${data.ProductID}`}>
                        {data.ProductName}
                      </Link>
                    </a>
                  </h6>

                  <p class="mb-4" style={{ color: "gray" }}>
                    Created User : {data.CreatedUser.username}
                  </p>

                  <div>
                    {data.variants?.map((variant) => (
                      <p>
                        {variant.name}:{variant.option} -{" "}
                        {variant.sub_variants?.map((sub) => (
                          <span>{sub.option}</span>
                        ))}
                      </p>
                    ))}
                  </div>
                </div>

                <div class="mt-3 mt-lg-0 ml-lg-3 text-center">
                  <h3 class="mb-0 font-weight-semibold">${data.Price}</h3>
                  <div class="text-muted">{data.TotalStock} Stock</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
    <div style={{ display: "flex", justifyContent: "center" }}>
      <nav aria-label="Page navigation example" style={{ marginTop: "20px" , marginBottom: "20px", fontSize: "16px", fontWeight: "500"}}>
      <ul class="pagination">
      {previousUrl && <li class="page-item"><button class="page-link" onClick={() => paginationHandler(previousUrl)}>Previous</button></li>}
        {/* <li class="page-item"><a class="page-link" href="#">1</a></li>
        <li class="page-item"><a class="page-link" href="#">2</a></li>
        <li class="page-item"><a class="page-link" href="#">3</a></li> */}
        {nextUrl && <li class="page-item"><button class="page-link" disabled={!nextUrl} onClick={() => paginationHandler(nextUrl)}>Next</button></li>}
      </ul>
    </nav></div>
    </div>
  );
}

export default Products;
