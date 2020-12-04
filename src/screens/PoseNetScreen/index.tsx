import * as posenet from '@tensorflow-models/posenet';
import { PoseNet } from '@tensorflow-models/posenet';
import { decodeJpeg, fetch } from '@tensorflow/tfjs-react-native';
import * as ImagePicker from 'expo-image-picker';
import { ImageInfo } from 'expo-image-picker/build/ImagePicker.types';
import React, { Component, Fragment } from 'react';
import {
  ActivityIndicator,
  Button,
  Image,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import Svg, { Circle, G, Text } from 'react-native-svg';
import models from '../../models';

interface Props {}

interface State {
  pose: posenet.Pose | null;
  loading?: boolean;
  // image?: ImageSourcePropType;
  imageUri?: string;
  imageWidth?: number;
  imageHeight?: number;
}

export default class CocoSSDScreen extends Component<Props, State> {
  state: State = {
    loading: false,
    pose: null,
  };
  modelPoseNet?: PoseNet;
  onPressStart = async () => {
    const { granted } = await ImagePicker.requestCameraRollPermissionsAsync();
    if (!granted) {
      alert('Permission to access camera roll is required!');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });
    if (!result.cancelled) {
      this.onImagePickerResult(result);
    }
  };
  onImagePickerResult = async (imageInfo: ImageInfo) => {
    console.log('====================================');
    console.log('imageInfo', imageInfo);
    console.log('====================================');
    this.setState({
      imageUri: imageInfo.uri,
      imageWidth: imageInfo.width,
      imageHeight: imageInfo.height,
      loading: true,
      pose: null,
    });
    // const image = require('../../assets/mobilenet/pose1.jpg');
    // this.setState({
    //   loading: true,
    //   image: image,
    // });
    // Read the image into a tensor
    // const imageAssetPath = Image.resolveAssetSource(image);
    const response = await fetch(imageInfo.uri, {}, { isBinary: true });
    const imageDataArrayBuffer = await response.arrayBuffer();
    const imageData = new Uint8Array(imageDataArrayBuffer);
    const imageTensor = decodeJpeg(imageData);

    if (!this.modelPoseNet) {
      this.modelPoseNet = await posenet.load(
        models.posenet_resnet50_quantized_1_1_default_1
      );
    }
    let start = Date.now();
    console.log('====================================');
    console.log('tick start');
    const pose = await this.modelPoseNet.estimateSinglePose(imageTensor, {
      flipHorizontal: false,
    });
    console.log('pose', JSON.stringify(pose));
    console.log('====================================');
    console.log('tick', Date.now() - start);
    this.setState({
      loading: false,
      pose,
    });
  };
  componentWillUnmount() {
    if (this.modelPoseNet) {
      this.modelPoseNet.dispose();
      this.modelPoseNet = undefined;
    }
  }
  render() {
    const { loading, pose, imageUri, imageWidth, imageHeight } = this.state;
    const itemSize = Math.min(imageWidth!, imageHeight!) / 100;
    return (
      <Fragment>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView
          style={{
            flex: 1,
          }}
        >
          <View
            style={{
              position: 'relative',
              flex: 1,
            }}
          >
            <View style={StyleSheet.absoluteFill}>
              {imageUri && (
                <Image
                  style={{
                    width: '100%',
                    height: '100%',
                    resizeMode: 'contain',
                  }}
                  source={{ uri: imageUri }}
                />
              )}
            </View>
            <View style={[StyleSheet.absoluteFill]}>
              {pose && (
                <Svg
                  style={StyleSheet.absoluteFill}
                  viewBox={`0 0 ${imageWidth} ${imageHeight}`}
                >
                  {pose.keypoints.map((keypoint, index) => (
                    <G
                      x={keypoint.position.x}
                      y={keypoint.position.y}
                      key={index}
                    >
                      <Circle r={itemSize} fill="black" />
                      <Text fill="black" fontSize="20">
                        {keypoint.part}
                      </Text>
                    </G>
                  ))}
                </Svg>
              )}
            </View>
            {loading && (
              <View
                style={[
                  StyleSheet.absoluteFill,
                  {
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#0000007f',
                  },
                ]}
              >
                <ActivityIndicator color="white" size="large" />
              </View>
            )}
            <View
              style={[StyleSheet.absoluteFill, { alignItems: 'flex-start' }]}
            >
              <Button onPress={this.onPressStart} title="选择图片..." />
            </View>
          </View>
        </SafeAreaView>
      </Fragment>
    );
  }
}
