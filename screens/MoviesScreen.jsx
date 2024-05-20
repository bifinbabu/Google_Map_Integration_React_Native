import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import { moviesURL } from "../utils";

const MovieListScreen = ({ route }) => {
  const { marker } = route.params;
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    setLoading(true);
    try {
      const response = await axios.get(moviesURL);
      setMovies(response.data);
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
    setLoading(false);
  };

  const renderItem = ({ item, index }) => (
    <View style={styles.card}>
      <Text style={styles.index}>{index + 1}.</Text>
      <View style={styles.movieInfo}>
        <Text style={styles.movieTitle}>{item?.movie}</Text>
        <Text style={styles.rating}>{item?.rating}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          <View style={styles.locationContainer}>
            <Text style={styles.locationTitle}>Location Details</Text>
            <Text style={styles.locationDetails}>
              {marker?.locationDetails}
            </Text>
          </View>
          <Text style={styles.movieListTitle}>Movies</Text>
          <FlatList
            data={movies}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  locationContainer: {
    padding: 20,
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    margin: 20,
    alignItems: "center",
  },
  locationTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  locationDetails: {
    fontSize: 18,
    color: "#555",
    textAlign: "center",
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    marginVertical: 5,
    marginHorizontal: 10,
    borderRadius: 10,
    backgroundColor: "#f8f8f8",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 4,
  },
  index: {
    fontSize: 23,
    marginRight: 10,
    color: "#333",
  },
  movieInfo: {
    flexDirection: "column",
  },
  movieTitle: {
    fontSize: 20,
    color: "blue",
  },
  rating: {
    fontSize: 20,
    color: "green",
  },
  movieListTitle: {
    fontSize: 35,
    color: "blue",
    textAlign: "center",
    marginVertical: 20,
  },
});

export default MovieListScreen;
