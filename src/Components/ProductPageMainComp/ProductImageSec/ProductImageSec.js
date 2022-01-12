import React, { useState } from "react";
import { useSelector } from "react-redux";

import styles from "./ProductImageSec.module.css";
import Button from "./../../Button/index";
import { PRODUCT_PAGE_DATA } from "../../../Utils/Constants/StaticData";
import WishlistIcon from "./../../WishlistIcon/index";
import notify from "./../../../Utils/Helpers/notifyToast";
import { addProductToCart } from "../../../Services/user.service";

function ProductImageSec({
  images,
  productId,
  productDetails,
  currentSelections,
}) {
  const userData = useSelector((state) => state.userReducer.userData);

  const [currentImage, setCurrentImage] = useState(0);

  const addToCart = async () => {
    try {
      const response = await addProductToCart(
        userData.accessToken,
        productId,
        productDetails.various_size[currentSelections.size],
        Object.values(currentSelections.attachments)
      );
      notify("Successfully added to cart", "success");
    } catch (err) {
      console.log(err);
      notify("Failed to add product to cart", "error");
    }
  };

  const placeOrder = () => {
    console.log("Place order");
  };

  return (
    <div className={styles.Wrapper}>
      <div className={styles.LeftSecWrapper}>
        {images.map((image, index) => (
          <div
            key={index}
            className={
              styles.ImageWrapper +
              " " +
              (index === currentImage ? styles.Active : "")
            }
            onMouseEnter={() => setCurrentImage(index)}
          >
            <img src={image} alt="product" className={styles.Image} />
          </div>
        ))}
      </div>
      <div className={styles.RightSecWrapper}>
        <div className={styles.PrimaryImageWrapper}>
          <img
            src={images[currentImage]}
            alt="product"
            className={styles.PrimaryImage}
            onLoad={(e) => {
              e.target.style.opacity = 1;
            }}
          />
          <div className={styles.AddToWishListWrapper}>
            <WishlistIcon productId={productId} />
          </div>
        </div>
        <div className={styles.ButtonsWrapper}>
          <Button
            name={PRODUCT_PAGE_DATA.addToCart}
            onClick={addToCart}
            primaryColor="var(--primary-blue)"
            inverted
            wrapperClass={styles.AddToCartButton + " " + styles.Button}
          />
          <Button
            name={PRODUCT_PAGE_DATA.placeOrder}
            onClick={() => {
              console.log("place order");
            }}
            primaryColor="var(--primary-blue)"
            wrapperClass={styles.PlaceOrderButton + " " + styles.Button}
          />
        </div>
      </div>
    </div>
  );
}

export default ProductImageSec;
