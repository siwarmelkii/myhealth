import React, { useState, useEffect } from "react";
import {ScrollView} from "react-native"
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";

import { InitialScreenOnStart } from "./InitialScreenOnStart";
import AuthStack from "./AuthStack";
import {  signOut } from "firebase/auth";

import { User, onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";
 
const Stack = createNativeStackNavigator();

export default function Navigation() {
  const [user, setUser] = useState<User | null>(null);
 
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      // console.log("user", user);
      if(user?.emailVerified){
        setUser(user);
       }else {
        setUser(null)
       }  
    });
  }, []);
  

  
   return (
    //   {user ? <AuthStack /> : <InitialScreenOnStart />}
    <NavigationContainer>
 
      <Stack.Navigator initialRouteName="InitialScreenOnStart">
        {user ? (
          <Stack.Screen
            name="AuthStack"
            component={AuthStack}
            options={{ headerShown: true }}
          />
        ) : (
          <Stack.Screen
            name="InitialScreenOnStart"
            component={InitialScreenOnStart}
            options={{ headerShown: false }}
          />
        )}
      </Stack.Navigator>
 
    </NavigationContainer>
  );
}
