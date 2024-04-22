import Image from "next/image";
import React from "react";
import { FiTrash2 } from "react-icons/fi";
import { useCart } from "react-use-cart";

const RecapCard = ({ prod }) => {
  const { removeItem, updateItemQuantity } = useCart();

  return (
    <div className="recap-card">
      <div className="left">
        <div className="img">
          <Image
            src={prod.image}
            alt={"image de " + prod.nom_produit}
            height={130}
            width={100}
            loader={() => `${prod.image}`}
          />
        </div>
        <div className="infos">
          <h3>{prod.nom_produit}</h3>
          <h5 className="size">
            Taille : <span>{prod.chosenSize.taille}</span>
          </h5>
          <h5 className="quantity">
            Quantité : <span>{prod.quantity}</span>
          </h5>
          <p className="price">{prod.price.toLocaleString()} FCFA</p>
        </div>
      </div>
      <div className="right">
        <div className="btn-container">
          <div className="quantity">
            <div className="content">
              <button
                id="moins"
                onClick={() => updateItemQuantity(prod.id, prod.quantity - 1)}
              >
                <span>-</span>
              </button>
              <span> {prod.quantity} </span>

              <button
                id="plus"
                onClick={() => updateItemQuantity(prod.id, prod.quantity + 1)}
              >
                <span>+</span>
              </button>
            </div>
          </div>
          <button className="delete" onClick={() => removeItem(prod.id)}>
            <FiTrash2 />
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecapCard;
