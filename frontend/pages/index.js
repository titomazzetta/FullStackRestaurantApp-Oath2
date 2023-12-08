import React, { useState, useContext } from "react";
import Cart from "../components/cart"
import {ApolloProvider,ApolloClient,HttpLink, InMemoryCache} from '@apollo/client';
import RestaurantList from '../components/restaurantList';
import { InputGroup, InputGroupText,Input} from "reactstrap";
import styles from '../styles/Home.module.css';
import AppContext from '../components/context';



function Home() {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337";
    const [query, setQuery] = useState("");
    const link = new HttpLink({ uri: `${API_URL}/graphql` });
    const cache = new InMemoryCache();
    const client = new ApolloClient({ link, cache });

    // Use context to access cart data
    const { cart } = useContext(AppContext);
    const hasCartItems = cart.items && cart.items.length > 0;

    return (
        <ApolloProvider client={client}>
            <div className="search">
                <br></br>
                <h2 className={styles.centerText}>Restaurants</h2>
                <br></br>
                <InputGroup>
                    <InputGroupText> Search </InputGroupText>
                    <Input
                        onChange={(e) => setQuery(e.target.value.toLocaleLowerCase())}
                        value={query}
                    />
                </InputGroup>
                <br></br>
            </div>
            <RestaurantList search={query} />
            {hasCartItems && <Cart />} {/* Conditional rendering of Cart */}
            <br></br>
            <br></br>
        </ApolloProvider>
    );
}

export default Home;