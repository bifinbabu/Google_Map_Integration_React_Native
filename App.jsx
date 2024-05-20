import React, { useEffect } from "react";
import { Button } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { Provider } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import store from "./redux/store";
import LoginScreen from "./screens/LoginScreen";
import MapScreen from "./screens/MapScreen";
import { logout } from "./redux/authSlice";
import { screens } from "./utils";
import MovieListScreen from "./screens/MoviesScreen";

const Stack = createStackNavigator();

const App = () => {
  useEffect(() => {
    const setDummyCredentials = async () => {
      await AsyncStorage.setItem("username", "Test");
      await AsyncStorage.setItem("password", "Pass");
    };
    setDummyCredentials();
  }, []);

  const headerOptions = ({ navigation, route }) => ({
    headerLeft: route.name === screens.Map ? null : undefined,
    headerRight: () => (
      <Button
        onPress={() => {
          store.dispatch(logout());
          navigation.reset({
            index: 0,
            routes: [{ name: screens.Login }],
          });
        }}
        title="Log out"
        color="#4285F4"
      />
    ),
  });

  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName={screens.Login}>
          <Stack.Screen name={screens.Login} component={LoginScreen} />
          <Stack.Screen
            name={screens.Map}
            component={MapScreen}
            options={headerOptions}
          />
          <Stack.Screen
            name={screens.Movies}
            component={MovieListScreen}
            options={headerOptions}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
};

export default App;
