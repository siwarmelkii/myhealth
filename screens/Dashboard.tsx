import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Alert, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Colors from "../constants/Colors";
import { auth, db } from "../firebase/firebase";
import { WebView } from 'react-native-webview';

export default function Dashboard({ navigation }: { navigation: any }) {
  const [userInfo, setUserInfo] = useState<any | undefined>(null);
  const [userData,setUserData]=useState<any | undefined>(null);

  const handleSignout = async () => {
    // if(confirm("vous voulez vous deconnecter ?"))
    await auth.signOut();
   
  };

  const Modal = () => {
    Alert.alert("Auth App", "Vous voulez vous déconnecter", [
      {
        text: "Cancel",
        onPress: () => console.log("Annulation de la déconnexion!"),
      },
      { text: "Logout", onPress: handleSignout },
    ]);
  };

  const getData = async () => {

    const docRef = doc(db, "users", "info");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
      setUserInfo(docSnap.data());
    } else {
      console.log("aucun document!");
    }
    // read data from firestore database user

  };
// get data with email from firestore database users collection
const readDataFromFirestore = async () => {
  const usersCollection = collection(db, "users");
  const usersSnapshot = await getDocs(usersCollection);
  usersSnapshot.forEach((doc) => {
    if (doc.data().email === auth.currentUser?.email) {
      console.log("Document data:", doc.data());
      setUserData(doc.data());
      setUserInfo(doc.data());
    }
  });
};
const [data, setData] = useState(null);
const [loading, setLoading] = useState(false);
const UBIDOTS_TOKEN = "BBFF-8n4LCs1dNlM4LN3MfESLsi8KjMt8CU";

const UBIDOTS_URL = "https://industrial.api.ubidots.com/api/v1.6/devices/heart/heartbeat/values";

// function to get Hisotory Values from ubidots
const readDataFromUbidots = async () => {
  try {
    setLoading(true)
    const response = await fetch(UBIDOTS_URL, {
      headers: {
        'X-Auth-Token': UBIDOTS_TOKEN
      }
    });
    const responseData = await response.json();
    setData(responseData.results);
    setLoading(false)
  } catch (error) {
    // console.error("Error fetching data from Ubidots:", error);
  }  
}
useEffect(() => {
  getData();
  setUserInfo(auth.currentUser);
  readDataFromFirestore();
  readDataFromUbidots()
}, []);

// setInterval(readDataFromUbidots, 6000);
   return (
    <View style={styles.container}>
    <Text style={{ fontSize: 25 }}>Bienvenue à la supervision ! </Text>
    <View>
      <Text style={styles.userInfo}>{userInfo ? `Email: ${userInfo.email}` : ""}</Text>
    </View>
    {Platform.OS === 'web' ? (
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <iframe
          style={{ flex: 1, height: 450 }}
          src="https://stem.ubidots.com/app/dashboards/public/widget/H7HpCgZepYjjvxuVDwePr4h6w6xb75E4VjtEsDUOO_0?embed=true"
        ></iframe>
        <iframe
          style={{ flex: 1, height: 450, width: '600px' }}
          src="https://stem.ubidots.com/app/dashboards/public/widget/mclNmaQqBH789HvQaRsGghtn2kGjdRySyy5YHXpSpAs?embed=true"
        ></iframe>
      </View>
    ) : (
      <View>
        <WebView
          style={styles.webView}
          source={{ uri: 'https://stem.ubidots.com/app/dashboards/public/widget/H7HpCgZepYjjvxuVDwePr4h6w6xb75E4VjtEsDUOO_0?embed=true' }}
        />
        <WebView
          style={styles.webView}
          source={{ uri: 'https://stem.ubidots.com/app/dashboards/public/widget/mclNmaQqBH789HvQaRsGghtn2kGjdRySyy5YHXpSpAs?embed=true' }}
        />
      </View>
    )}
    <View>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('UpdateProfile')}>
        <Text style={{ color: Colors.white, fontSize: 20 }}>Profile</Text>
      </TouchableOpacity>
    </View>
    <View>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Profile')}>
        <Text style={{ color: Colors.white, fontSize: 20 }}>Suivi</Text>
      </TouchableOpacity>
    </View>
    <View>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Rappel')}>
        <Text style={{ color: Colors.white, fontSize: 20 }}>Rappel</Text>
      </TouchableOpacity>
    </View>
    <View>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Prescription')}>
        <Text style={{ color: Colors.white, fontSize: 20 }}>Prescription</Text>
      </TouchableOpacity>
    </View>
    <View>
      <TouchableOpacity style={styles.button} onPress={handleSignout}>
        <Text style={{ color: Colors.white, fontSize: 20 }}>Déconnexion</Text>
      </TouchableOpacity>
    </View>
  </View>
);
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    backgroundColor: Colors.primary,
    padding: 10,
    borderRadius: 8,
    height: 55,
    justifyContent: "center",
    alignItems: "center",
    width: 200,
    marginTop: 30,
  },
  // center iframe
  // iframe: {
  //   display: "flex",
  //   margin: "auto",
  // },
  webView: {
    flex: 1,
  },
  userInfo: {
    fontSize: 18,
    marginVertical: 5,
  },
});
