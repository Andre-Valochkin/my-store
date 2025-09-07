import "./ProductCard.css";

const ProductCard = ({ product }) => {
  const img =
    product.images && product.images.length > 0 ? product.images[0] : null;
  return (
    <div className="product-card">
      {img ? (
        <img src={img} alt={product.name} />
      ) : (
        <div className="no-image">Нет изображения</div>
      )}
      <h3>{product.name}</h3>
      <p className="price">{product.price ? product.price + " грн" : "—"}</p>
      <button className="product-btn">Добавить в корзину</button>
    </div>
  );
};

export default ProductCard;
