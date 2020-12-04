import { ModelConfig } from '@tensorflow-models/mobilenet';
import { bundleResourceIO } from '@tensorflow/tfjs-react-native';

// v1
const imagenet_mobilenet_v1_100_224_classification_1_default_1: ModelConfig = {
  version: 1,
  alpha: 1,
  modelUrl: bundleResourceIO(
    require('./imagenet_mobilenet_v1_100_224_classification_1_default_1/model.json'),
    [
      require('./imagenet_mobilenet_v1_100_224_classification_1_default_1/group1-shard1of5.bin'),
      require('./imagenet_mobilenet_v1_100_224_classification_1_default_1/group1-shard2of5.bin'),
      require('./imagenet_mobilenet_v1_100_224_classification_1_default_1/group1-shard3of5.bin'),
      require('./imagenet_mobilenet_v1_100_224_classification_1_default_1/group1-shard4of5.bin'),
      require('./imagenet_mobilenet_v1_100_224_classification_1_default_1/group1-shard5of5.bin'),
    ]
  ),
};

////////////////////////////////////////////////////////////////////////////////
// v2
////////////////////////////////////////////////////////////////////////////////
const imagenet_mobilenet_v2_100_224_classification_1_default_1: ModelConfig = {
  version: 2,
  alpha: 1,
  modelUrl: bundleResourceIO(
    require('./imagenet_mobilenet_v2_100_224_classification_1_default_1/model.json'),
    [
      require('./imagenet_mobilenet_v2_100_224_classification_1_default_1/group1-shard1of4.bin'),
      require('./imagenet_mobilenet_v2_100_224_classification_1_default_1/group1-shard2of4.bin'),
      require('./imagenet_mobilenet_v2_100_224_classification_1_default_1/group1-shard3of4.bin'),
      require('./imagenet_mobilenet_v2_100_224_classification_1_default_1/group1-shard4of4.bin'),
    ]
  ),
};
// posenet
// const posenet_mobilenet_quantized_1_100_1_default_1: any = {
//   architecture: 'MobileNetV1', // 'ResNet50' | 'MobileNetV1';,
//   outputStride: 8, // 32 | 16 | 8,
//   inputResolution: 257, // [257, 353, 449, 513, 801]
//   multiplier: 1, // 0.5 | 0.75 | 1 ,
//   quantBytes: 1, // 1 | 2 | 4 ,
//   modelUrl: bundleResourceIO(
//     require('./posenet_mobilenet_quantized_1_100_1_default_1/model-stride8.json'),
//     [
//       require('./posenet_mobilenet_quantized_1_100_1_default_1/group1-shard1of1.bin'),
//     ]
//   ),
// };
const posenet_resnet50_quantized_1_1_default_1: any = {
  architecture: 'ResNet50', // 'ResNet50' | 'MobileNetV1';,
  // architecture: 'MobileNetV1', // 'ResNet50' | 'MobileNetV1';,
  outputStride: 16, // 32 | 16 | 8,
  inputResolution: 257, // [257, 353, 449, 513, 801]
  multiplier: 1, // 0.5 | 0.75 | 1 ,
  quantBytes: 1, // 1 | 2 | 4 ,
  modelUrl: bundleResourceIO(
    require('./posenet_resnet50_quantized_1_1_default_1/model-stride16.json'),
    [
      require('./posenet_resnet50_quantized_1_1_default_1/group1-shard1of6.bin'),
      require('./posenet_resnet50_quantized_1_1_default_1/group1-shard2of6.bin'),
      require('./posenet_resnet50_quantized_1_1_default_1/group1-shard3of6.bin'),
      require('./posenet_resnet50_quantized_1_1_default_1/group1-shard4of6.bin'),
      require('./posenet_resnet50_quantized_1_1_default_1/group1-shard5of6.bin'),
      require('./posenet_resnet50_quantized_1_1_default_1/group1-shard6of6.bin'),
    ]
  ),
};

export default {
  imagenet_mobilenet_v1_100_224_classification_1_default_1,
  imagenet_mobilenet_v2_100_224_classification_1_default_1,
  // posenet_mobilenet_quantized_1_100_1_default_1,
  posenet_resnet50_quantized_1_1_default_1,
};
