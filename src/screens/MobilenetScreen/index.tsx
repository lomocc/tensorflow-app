import * as mobilenet from '@tensorflow-models/mobilenet';
import * as tf from '@tensorflow/tfjs';
import { fetch } from '@tensorflow/tfjs-react-native';
import * as jpeg from 'jpeg-js';
import React, { Component, Fragment } from 'react';
import {
  Image,
  ImageSourcePropType,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Run from './components/Run';

interface Props {
  image: ImageSourcePropType;
}

interface State {
  prediction: Array<{ className: string; probability: number }>;
  predictionTime?: number;
  imageChecksum?: number;
}

export default class MobilenetScreen extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      prediction: [],
    };
  }
  async componentDidMount() {
    // Load mobilenet
    const model = await mobilenet.load();

    //warmup mobilenet
    // @ts-ignore
    await model.classify(tf.zeros([1, 224, 224, 3]));

    //     const image = require('../../assets/mobilenet/catsmall.jpg');
    // const imageAssetPath = Image.resolveAssetSource(image);
    // const response = await fetch(imageAssetPath.uri, {}, { isBinary: true });
    // const imageData = await response.arrayBuffer();

    // const imageTensor = decodeJpeg(imageData);

    // const prediction = await model.classify(imageTensor);

    const image = require('../../assets/mobilenet/catsmall.jpg');
    // const image = require('../../assets/mobilenet/human2Zombie.jpg');
    // const image = require('../../assets/mobilenet/img_1023.jpg');
    // const image = require('../../assets/mobilenet/img_0783.jpg');
    // console.log('image', image);

    // Read the image into a tensor
    const imageAssetPath = Image.resolveAssetSource(image);
    const response = await fetch(imageAssetPath.uri, {}, { isBinary: true });
    const imageDataArrayBuffer = await response.arrayBuffer();
    // const imageData = new Uint8Array(imageDataArrayBuffer);
    // const imageTensor = decodeJpeg(imageData);
    const imageTensor = this.imageToTensor(imageDataArrayBuffer);

    // Compute a checksum for the image. Useful for debugging.
    const imageTensorSum = imageTensor.sum();
    const imageChecksum = (await imageTensorSum.data())[0];

    // Classify the image.
    const start = Date.now();

    const prediction = await model.classify(imageTensor);

    const end = Date.now();

    this.setState({
      prediction,
      predictionTime: end - start,
      imageChecksum,
    });
    tf.dispose([imageTensor, imageTensorSum]);
  }
  imageToTensor(rawImageData: ArrayBuffer): tf.Tensor3D {
    const TO_UINT8ARRAY = true;
    const { width, height, data } = jpeg.decode(rawImageData, TO_UINT8ARRAY);
    // Drop the alpha channel info for mobilenet
    const buffer = new Uint8Array(width * height * 3);
    let offset = 0; // offset into original data
    for (let i = 0; i < buffer.length; i += 3) {
      buffer[i] = data[offset];
      buffer[i + 1] = data[offset + 1];
      buffer[i + 2] = data[offset + 2];

      offset += 4;
    }

    return tf.tensor3d(buffer, [height, width, 3]);
  }
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
    const { image } = this.props;
    const { prediction } = this.state;

    return (
      <Fragment>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView>
          <ScrollView
            contentInsetAdjustmentBehavior="automatic"
            style={styles.scrollView}
          >
            <View style={styles.body}>
              <View style={styles.sectionContainer}>
                {/* <Button onPress={this.props.returnToMain} title="Back" /> */}
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
                  <Image style={{ width: 245, height: 166 }} source={image} />
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
