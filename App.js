import React from 'react';
import { Magnetometer } from 'expo';
import { StyleSheet, Text, View, TouchableOpacity, ImageBackground, Image, Dimensions } from 'react-native';

export default class App extends React.Component {
  state = {
    MagnetometerData: {},
    subscription: false
  };

  componentDidMount() {
    this._toggle();
  }

  componentWillUnmount() {
    this._unsubscribe();
  }

  _toggle = () => {
    if (this._subscription) {
      this._unsubscribe();
    } else {
      this._subscribe();
    }
  }

  _slow = () => {
    Magnetometer.setUpdateInterval(1000);
  }

  _fast = () => {
    Magnetometer.setUpdateInterval(16);
  }

  _subscribe = () => {
    this.setState({subscription: true});
    this._subscription = Magnetometer.addListener((result) => {
      this.setState({MagnetometerData: result});
    });
  }

  _unsubscribe = () => {
    this.setState({subscription: false});
    this._subscription && this._subscription.remove();
    this._subscription = null;
  }

  render() {
    let { x, y, z } = this.state.MagnetometerData;
    let subscription = this.state.subscription;

    let degree = -Math.atan2(y, x) * (180 / Math.PI) + 90;
    let degreeVal = "0deg";
    if (!isNaN(degree)) {
      degreeVal = `${degree}deg`;
    }
    let headingText = `Heading in degrees: ${degree}`;

    return (
        <View style={styles.sensor}>
          <Text>Magnetometer:</Text>
          <Text>x: {round(x)} y: {round(y)} z: {round(z)}</Text>

          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={this._toggle} style={styles.button}>
              <Text>
                {subscription ? "Unsubscribe" : "Subscribe"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={this._slow} style={[styles.button, styles.middleButton]}>
              <Text>Slow</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={this._fast} style={styles.button}>
              <Text>Fast</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.compassText}>{headingText}</Text>
          <View>
            <ImageBackground
                source={require('./assets/grados.png')}
                style={styles.compassImage}>
                <Image
                    source={require('./assets/needle.png')}
                    style={{...styles.needleImage, "transform": [{"rotate": degreeVal}]}}/>
            </ImageBackground>
          </View>
        </View>
    );
  }
}

function round(n) {
  if (!n) {
    return 0;
  }

  return Math.floor(n * 100) / 100;
}

const dimensions = Dimensions.get('window');
console.log(dimensions.width);

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'stretch',
    marginTop: 15,
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eee',
    padding: 10,
  },
  middleButton: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#ccc',
  },
  sensor: {
    marginTop: 15,
    paddingHorizontal: 10,
  },
  compassText: {
    marginTop: 20,
    marginBottom: 30
  },
  compassImage: {
    width: dimensions.width - 20,
    height: dimensions.width - 20
  },
  needleImage: {
    width: dimensions.width - 20,
    height: dimensions.width - 20
  }
});
