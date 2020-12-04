import * as mobilenet from '@tensorflow-models/mobilenet';
import * as tf from '@tensorflow/tfjs';
import { decodeJpeg, fetch } from '@tensorflow/tfjs-react-native';
import React, { Component, Fragment } from 'react';
import {
  ActivityIndicator,
  Button,
  Image,
  ImageSourcePropType,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import models from '../../models';
import Run from './components/Run';

interface Props {}

interface State {
  prediction: {
    className: string;
    probability: number;
  }[];
  predictionTime?: number;
  imageChecksum?: number;
  loading?: boolean;
  image?: ImageSourcePropType;
}

export default class MobilenetScreen extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      prediction: [],
      loading: false,
    };
  }
  onClassify = async (modelConfig: mobilenet.ModelConfig) => {
    // const image = require('../../assets/mobilenet/catsmall.jpg');
    // const image = require('../../assets/mobilenet/img_0783.jpg');
    const image = require('../../assets/mobilenet/horse.jpeg');
    // const image = require('../../assets/mobilenet/WX20201201-151227@2x.png');

    this.setState({
      loading: true,
      image: image,
    });
    const model = await mobilenet.load(modelConfig);
    // Read the image into a tensor
    const imageAssetPath = Image.resolveAssetSource(image);
    const response = await fetch(imageAssetPath.uri, {}, { isBinary: true });
    const imageDataArrayBuffer = await response.arrayBuffer();
    const imageData = new Uint8Array(imageDataArrayBuffer);
    const imageTensor = decodeJpeg(imageData);

    // Compute a checksum for the image. Useful for debugging.
    const imageTensorSum = imageTensor.sum();
    const imageChecksum = (await imageTensorSum.data())[0];

    // Classify the image.
    const start = Date.now();

    const prediction = await model.classify(imageTensor);

    console.log('====================================');
    console.log('prediction', prediction);
    console.log('====================================');

    const end = Date.now();
    this.setState({
      prediction,
      predictionTime: end - start,
      imageChecksum,
      loading: false,
    });
    tf.dispose([imageTensor, imageTensorSum]);
  };
  async componentDidMount() {}
  renderPrediction() {
    const { prediction, predictionTime, imageChecksum } = this.state;
    return (
      <View>
        <Text style={styles.resultTextHeader}>Results</Text>
        {prediction.map((pred, i) => {
          return (
            <View style={styles.prediction} key={i}>
              <Text style={styles.resultClass}>{pred.className}</Text>
              <Text style={styles.resultProb}>{pred.probability}</Text>
            </View>
          );
        })}
        <View style={styles.sectionContainer}>
          <Run label="Prediction Time" result={`${predictionTime}`} />
          <Run label="Checksum" result={`${imageChecksum}`} />
        </View>
      </View>
    );
  }

  render() {
    const { prediction, loading, image } = this.state;

    return (
      <Fragment>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView>
          <ScrollView
            contentInsetAdjustmentBehavior="automatic"
            style={styles.scrollView}
          >
            {loading && <ActivityIndicator size="large" color="#0000ff" />}
            <View style={styles.body}>
              <View style={styles.sectionContainer}>
                {Object.keys(models).map((name) => (
                  <Button
                    key={name}
                    title={name.replace(
                      /imagenet_mobilenet_(.*)_classification_1_default_1/,
                      '$1'
                    )}
                    onPress={() =>
                      this.onClassify(
                        // @ts-ignore
                        models[name]
                      )
                    }
                  />
                ))}
              </View>

              <View style={styles.sectionContainer}>
                {/* Title Area */}
                <View>
                  <Text style={styles.sectionTitle}>
                    Mobilenet Image Classification in React Native
                  </Text>
                </View>
                {/* Image Area */}
                <View style={styles.imageArea}>
                  {image && (
                    <Image style={{ width: 245, height: 166 }} source={image} />
                  )}
                </View>
                {/* Result Area */}
                <View style={styles.resultArea}>
                  {prediction ? this.renderPrediction() : undefined}
                </View>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Fragment>
    );
  }
}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: 'white',
  },
  body: {
    backgroundColor: 'white',
    marginBottom: 60,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: 'black',
    marginBottom: 6,
  },
  imageArea: {
    marginTop: 12,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultArea: {
    marginLeft: 5,
    paddingLeft: 5,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  resultTextHeader: {
    fontSize: 21,
    fontWeight: 'bold',
    marginBottom: 12,
    marginTop: 12,
    textAlign: 'center',
  },
  prediction: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultClass: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultProb: {
    fontSize: 16,
    marginLeft: 5,
  },
});
