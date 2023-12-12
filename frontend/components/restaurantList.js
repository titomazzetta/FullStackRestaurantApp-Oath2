import React, { useState, useEffect } from 'react';
import { gql, useQuery } from '@apollo/client';
import Dishes from './dishes';
import { Button, Card, CardBody, CardImg, CardText, Col, Container, Row } from 'reactstrap';
import styles from '../styles/Home.module.css';

function RestaurantList(props) {
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [restaurantID, setRestaurantID] = useState(null);
  const [visibleDescriptionId, setVisibleDescriptionId] = useState(null);
  const [filteredDishes, setFilteredDishes] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [isDishSearch, setIsDishSearch] = useState(false);



  useEffect(() => {

    const checkIfSmallScreen = () => {
      setIsSmallScreen(window.innerWidth <= 1000);
    }; 

    checkIfSmallScreen();
    window.addEventListener('resize', checkIfSmallScreen);

    return () => window.removeEventListener('resize', checkIfSmallScreen);
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

  useEffect(() => {
    if (data) {
      const searchLowerCase = props.search.toLowerCase();
      let searchDishes = [];
      let searchRestaurants = [];
      let isDishMatch = false;
      let isRestaurantMatch = false;

      if (searchLowerCase) {
        data.restaurants.data.forEach(restaurant => {
          // Check for restaurant match
          if (restaurant.attributes.title.toLowerCase().includes(searchLowerCase) ||
              restaurant.attributes.description.toLowerCase().includes(searchLowerCase)) {
            searchRestaurants.push(restaurant);
            isRestaurantMatch = true;
          }

          // Check for dish match
          restaurant.attributes.dishes.data.forEach(dish => {
            if (dish.attributes.Dish.toLowerCase().includes(searchLowerCase)) {
              searchDishes.push(dish);
              isDishMatch = true;
            }
          });
        });
      }

      setFilteredDishes(isDishMatch ? searchDishes : []);
      setFilteredRestaurants(isRestaurantMatch ? searchRestaurants : []);
      setIsDishSearch(isDishMatch);
    }
  }, [props.search, data]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!data) return <p>No data found</p>;

  const toggleDescription = (id) => {
    setVisibleDescriptionId(visibleDescriptionId === id ? null : id);
    if (restaurantID !== id) {
      setRestaurantID(id);
    } else {
      setRestaurantID(null);
    }
  };

  const handleRestaurantClick = (id) => {
    setRestaurantID(restaurantID === id ? null : id);
    setIsDishSearch(false);
  };

  const renderDishes = () => {
    if (restaurantID && visibleDescriptionId === restaurantID && !isDishSearch) {
      const restaurant = data.restaurants.data.find(res => res.id === restaurantID);
      if (!restaurant) return null;
      return <Dishes dishes={restaurant.attributes.dishes.data} />;
    } else if (isDishSearch) {
      return <Dishes dishes={filteredDishes} />;
    }
    return null;
  };


  const renderRestaurants = () => {
    // Determine which list of restaurants to use based on search
    const restaurantsToRender = props.search ? filteredRestaurants : data.restaurants.data;
    return restaurantsToRender.map((res)  => (
      <Col xs="12" sm="6" md="4" key={res.id} className={styles.restaurantCol}>
        <Card className={styles.restaurantCard}>
          <div className={styles.imageContainer}>
            <CardImg
              top
              src={`http://localhost:1337${res.attributes.image.data.attributes.url}`}
              className={styles.restaurantImage}
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
              <div className="text-center">
                <CardText className={styles.cardText}>{res.attributes.description}</CardText>
                <Button 
                  className={styles.showDishesButton}
                  onClick={() => handleRestaurantClick(res.id)}
                >
                  {restaurantID === res.id ? 'Hide Dishes' : 'Show Dishes'}
                </Button>
              </div>
            )}
          </CardBody>
        </Card>
      </Col>
    ));
  };

  return (
    <Container>
      <Row xs="3">{renderRestaurants()}</Row>
      <Row xs="3">{renderDishes()}</Row>
    </Container>
  );
}

export default RestaurantList;
