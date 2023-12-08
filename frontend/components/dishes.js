import React, { useContext, useEffect, useState } from 'react';
import AppContext from "./context";
import { Button, Card, CardBody, CardImg, CardText, CardTitle, Row, Col } from 'reactstrap';
import styles from '../styles/Home.module.css';

function Dishes({ dishes }) {
  // State to check if the screen is small
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  // Context to interact with the global cart state
  const { addItem } = useContext(AppContext);

  // Effect to handle window resize and set the isSmallScreen state
  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 800);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Function to get the image URL of a dish
  const getImageUrl = (dish) => {
    if (dish.attributes.Image && dish.attributes.Image.data) {
      // If image data exists, construct the URL
      return `http://localhost:1337${dish.attributes.Image.data.attributes.url}`;
    } else {
      // Fallback URL if no image data
      return 'path_to_default_image';
    }
  };

  // Function to handle the add-to-cart action
  const handleAddToCart = (item, event) => {
    event.preventDefault(); // Prevent default button behavior
    addItem(item); // Add item to cart
  };

  // The main render function for the component
  return (
    <Row className={styles.customGrid}>
      {/* Map through each dish and create a card */}
      {dishes.map((dish) => (
        <Col className={styles.customCol} xs="3" key={dish.id}>
          <Card className={styles.customCard}>
            <CardImg
              top
              src={getImageUrl(dish)} // Set the image source
              alt="Dish image"
            />
            <CardBody>
              {/* Dish name */}
              <CardTitle tag="h5" className={isSmallScreen ? styles.smallScreenDishTitle : styles.dishTitle}>
                {dish.attributes.Dish}
              </CardTitle>

              {/* Dish description (hidden on small screens) */}
              {!isSmallScreen && <CardText>{dish.attributes.Description}</CardText>}

              {/* Price and add-to-cart button */}
              <div className={styles.priceAndCartContainer}>
              <Button
                  type="button"
                  className={`${isSmallScreen ? styles.buttonSmallScreen : ''} ${styles.addToCartButton}`}
                  color="info"
                  onClick={(event) => handleAddToCart({
                    id: dish.id, 
                    Dish: dish.attributes.Dish, 
                    Price: dish.attributes.Price
                  }, event)}
                >
                  {isSmallScreen ? '+' : 'Add to Cart +'}
                </Button>
                <div className={styles.priceBox}>
                  ${dish.attributes.Price}
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>
      ))}
    </Row>
  );
}

export default Dishes;
