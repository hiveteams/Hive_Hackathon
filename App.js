import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import PhotoMapView from './src/components/PhotoMapView';

export default class App extends React.Component {
  render() {
    return (
      <PhotoMapView />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
