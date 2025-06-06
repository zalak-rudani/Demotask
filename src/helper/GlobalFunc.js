import {Dimensions} from 'react-native';

import {
  widthPercentageToDP,
  heightPercentageToDP,
} from 'react-native-responsive-screen';

export const screenHeight = Dimensions.get('screen').height;
export const screenWidth = Dimensions.get('screen').width;

export const hp = val => {
  return heightPercentageToDP(val * 100) / screenHeight;
};

export const wp = val => {
  return widthPercentageToDP(val * 100) / screenWidth;
};
