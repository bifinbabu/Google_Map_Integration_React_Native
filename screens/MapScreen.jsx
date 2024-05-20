import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  BackHandler,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import Modal from "react-native-modal";
import axios from "axios";
import { getMapBoxUrl, mapTypes, screens } from "../utils";

const MapScreen = ({ navigation }) => {
  const [markers, setMarkers] = useState([
    {
      id: 1,
      title: "Marker 1",
      description: "Description for Marker 1",
      locationDetails:
        "LOCATION 1: Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequatur soluta at ad, recusandae perspiciatis numquam ut, praesentium debitis expedita et dolorem voluptates laudantium quis iste nisi accusamus quisquam alias pariatur.",
      coordinate: { latitude: 13.0357949, longitude: 77.5317351 },
    },
    {
      id: 2,
      title: "Marker 2",
      description: "Description for Marker 2",
      locationDetails:
        "LOCATION 2: Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequatur soluta at ad, recusandae perspiciatis numquam ut, praesentium debitis expedita et dolorem voluptates laudantium quis iste nisi accusamus quisquam alias pariatur.",
      coordinate: { latitude: 13.0468949, longitude: 77.5428351 },
    },
    {
      id: 3,
      title: "Marker 3",
      description: "Description for Marker 3",
      locationDetails:
        "LOCATION 3: Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequatur soluta at ad, recusandae perspiciatis numquam ut, praesentium debitis expedita et dolorem voluptates laudantium quis iste nisi accusamus quisquam alias pariatur.",
      coordinate: { latitude: 13.0468949, longitude: 77.5317351 },
    },
    {
      id: 4,
      title: "Marker 4",
      description: "Description for Marker 4",
      locationDetails:
        "LOCATION 4: Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequatur soluta at ad, recusandae perspiciatis numquam ut, praesentium debitis expedita et dolorem voluptates laudantium quis iste nisi accusamus quisquam alias pariatur.",
      coordinate: { latitude: 13.0357949, longitude: 77.5428351 },
    },
  ]);

  const [selectedMarker, setSelectedMarker] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [search, setSearch] = useState("");
  const [mapType, setMapType] = useState("standard");
  const [region, setRegion] = useState({
    latitude: markers[0].coordinate.latitude,
    longitude: markers[0].coordinate.longitude,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [searchResults, setSearchResults] = useState([]);

  const handleMarkerPress = (marker) => {
    setSelectedMarker(marker);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedMarker(null);
  };

  const navigateToMovies = () => {
    if (selectedMarker) {
      navigation.navigate(screens.Movies, { marker: selectedMarker });
    }
  };

  const handleSearch = async () => {
    const url = getMapBoxUrl(search);
    try {
      const response = await axios.get(url);
      const { features } = response.data;
      setSearchResults(features);
    } catch (error) {
      console.error(error);
    }
  };

  const handleResultPress = (result) => {
    const [longitude, latitude] = result.geometry.coordinates;
    setRegion({
      latitude,
      longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    });
    setSearchResults([]);
  };

  useEffect(() => {
    const backAction = () => {
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Search for a place..."
        value={search}
        onChangeText={setSearch}
        onSubmitEditing={handleSearch}
      />
      {searchResults.length > 0 && (
        <FlatList
          style={styles.resultsList}
          data={searchResults}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.resultItem}
              onPress={() => handleResultPress(item)}
            >
              <Text style={styles.resultText}>{item.place_name}</Text>
            </TouchableOpacity>
          )}
        />
      )}
      <View style={styles.mapTypeContainer}>
        <TouchableOpacity
          style={
            mapType === mapTypes.Standard
              ? styles.mapTypeButtonSelected
              : styles.mapTypeButton
          }
          onPress={() => setMapType(mapTypes.Standard)}
        >
          <Text style={styles.mapTypeText}>Standard</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={
            mapType === mapTypes.Satellite
              ? styles.mapTypeButtonSelected
              : styles.mapTypeButton
          }
          onPress={() => setMapType(mapTypes.Satellite)}
        >
          <Text style={styles.mapTypeText}>Satellite</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={
            mapType === mapTypes.Terrain
              ? styles.mapTypeButtonSelected
              : styles.mapTypeButton
          }
          onPress={() => setMapType(mapTypes.Terrain)}
        >
          <Text style={styles.mapTypeText}>Terrain</Text>
        </TouchableOpacity>
      </View>
      <MapView style={styles.map} mapType={mapType} region={region}>
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            coordinate={marker.coordinate}
            title={marker.title}
            onPress={() => handleMarkerPress(marker)}
          />
        ))}
      </MapView>
      <Modal
        isVisible={isModalVisible}
        onBackdropPress={closeModal}
        style={styles.bottomModal}
      >
        <View style={styles.modalContent}>
          {selectedMarker && (
            <>
              <Text style={styles.title}>{selectedMarker.title}</Text>
              <TouchableOpacity onPress={navigateToMovies}>
                <Text style={styles.description}>
                  {selectedMarker.description}
                  {" (Press here)"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchBar: {
    position: "absolute",
    top: 10,
    left: 10,
    right: 10,
    zIndex: 1,
    padding: 10,
    backgroundColor: "white",
    borderRadius: 5,
  },
  resultsList: {
    position: "absolute",
    top: 60,
    left: 10,
    right: 10,
    zIndex: 2,
    backgroundColor: "white",
    borderRadius: 5,
    maxHeight: 200,
  },
  resultItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  resultText: {
    fontSize: 16,
  },
  mapTypeContainer: {
    position: "absolute",
    top: 70,
    left: 10,
    flexDirection: "row",
    zIndex: 1,
  },
  mapTypeButton: {
    padding: 10,
    backgroundColor: "#4285F4",
    borderRadius: 5,
    marginRight: 5,
  },
  mapTypeButtonSelected: {
    padding: 10,
    backgroundColor: "#34A853",
    borderRadius: 5,
    marginRight: 5,
  },
  mapTypeText: {
    color: "white",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  bottomModal: {
    justifyContent: "flex-end",
    margin: 0,
  },
  modalContent: {
    backgroundColor: "white",
    padding: 22,
    borderTopLeftRadius: 17,
    borderTopRightRadius: 17,
    borderColor: "rgba(0, 0, 0, 0.1)",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
  },
  description: {
    fontSize: 20,
    marginVertical: 10,
    color: "blue",
    paddingBottom: 20,
  },
  closeButton: {
    alignItems: "center",
    marginTop: 10,
    padding: 10,
    backgroundColor: "#2196F3",
    borderRadius: 5,
  },
  closeButtonText: {
    color: "white",
    fontSize: 16,
  },
});

export default MapScreen;
