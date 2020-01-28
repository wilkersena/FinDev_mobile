import React from 'react';
import { View,StatusBar } from 'react-native';


import Routes from './src/routes';


export default function App() {
  return (
    <> 
      <StatusBar  barStyle="light-content" backgroundColor="#F76e35" />
      <Routes/>
    </>
  );
}


