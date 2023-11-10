import React from "react";

const ProductList = ({ products, onDataFromChild1 }: any) => {
  const handleClick = (product: any) => {
    onDataFromChild1(product);
  };
  return (
    <>
      {products.map((product: any) => {
        return (
          <div className="w-full rounded-2xl bg-blue-200 text-slate-900 p-6 transition-all mt-1 mb-3">
            <h1 className="font-medium">{`Shop Name : ${product?.shopName} `}</h1>
            <h2>
              Distance From your Location :
              <span className="font-semibold">
                {product?.distance / 1000} KM
              </span>
            </h2>
            <button
              className="bg-teal-700 text-white px-4 py-2 rounded-xl"
              onClick={() => handleClick(product)}
            >
              Goto Location
            </button>
          </div>
        );
      })}
    </>
  );
};

export default ProductList;
