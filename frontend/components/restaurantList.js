import React, { useState, useEffect } from 'react';
import { gql, useQuery } from '@apollo/client';
import Dishes from './dishes';
import { Button, Card, CardBody, CardImg, CardText, Col, Container, Row } from 'reactstrap';
import styles from '../styles/Home.module.css';

function RestaurantList(props) {
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [restaurantID, setRestaurantID] = useState(null);
  const [visibleDescriptionId, setVisibleDescriptionId] = useState(null);

  useEffect(() => {
    const checkIfSmallScreen = () => {
      setIsSmallScreen(window.innerWidth <= 1000);
    };

    checkIfSmallScreen();
    window.addEventListener('resize', checkIfSmallScreen);

    return () => {
      window.removeEventListener('resize', checkIfSmallScreen);
    };
  }, []);

  const GET_RESTAURANTS = gql`
    query Restaurants {
      restaurants {
        data {
          id
          attributes {
            title
            description
            image {
              data {
                attributes {
                  url
                }
              }
            }
            dishes {
              data {
                id
                attributes {
                  Dish
                  Description
                  Price
                  Image {
                    data {
                      attributes {
                        url
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  const { loading, error, data } = useQuery(GET_RESTAURANTS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!data) return <p>No data found</p>;

  let searchQuery = data.restaurants.data.filter((res) =>
    res.attributes.title.toLowerCase().includes(props.search.toLowerCase())
  );

  const toggleDescription = (id) => {
    setVisibleDescriptionId(visibleDescriptionId === id ? null : id);
    // Reset restaurantID to hide dishes from other restaurants
    if (restaurantID) setRestaurantID(null);
  };

  const handleRestaurantClick = (id) => {
    setRestaurantID(restaurantID === id ? null : id);
  };

  const renderDishes = () => {
    if (!restaurantID) return null;
    const restaurant = data.restaurants.data.find(res => res.id === restaurantID);
    if (!restaurant) return <p>Dishes not found</p>;

    return <Dishes dishes={restaurant.attributes.dishes.data} />;
  };

  const restList = searchQuery.map((res) => (
    <Col xs="3" sm="4" key={res.id} className={styles.restaurantCol}>
      <Card className={styles.restaurantCard}>
        <div className={styles.imageContainer}>
          <CardImg
            top
            className={styles.restaurantImage}
            src={`http://localhost:1337${res.attributes.image.data.attributes.url}`}
          />
        </div>
        <CardBody className={styles.cardBody}>
          <Button 
            className={`${styles.viewDishesButton} ${isSmallScreen ? styles.smallScreenViewDishesButton : ''}`}
            onClick={() => toggleDescription(res.id)}
          >
            {res.attributes.title}
          </Button>
          {visibleDescriptionId === res.id && (
            <>
              <CardText className={styles.cardText}>{res.attributes.description}</CardText>
              <div className="text-center">
                <Button 
                  className={styles.showDishesButton}
                  onClick={() => handleRestaurantClick(res.id)}
                >
                  {restaurantID === res.id ? 'Hide Dishes' : 'Show Dishes'}
                </Button>
              </div>
            </>
          )}
        </CardBody>
      </Card>
    </Col>
  ));

  return (
    <Container>
      <Row xs="3">{restList}</Row>
      <Row xs="3">{renderDishes()}</Row>
    </Container>
  );
}

export default RestaurantList;
