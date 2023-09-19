import {Dimensions, PixelRatio, Platform} from "react-native";

export const lightTheme = {
  background: "#FFFFFF",
  backgroundDark: "#2F2F2F",
  backgroundFocused: "#57575760",
  backgroundAlt: "#4C4C4CF0",
  controlOutline: "#8C8C8C",
  controlOutlineAlt: "#cecece",
  text: "#8C8C8C",
  textAlt: "#000000",
  accentColor: "#0078D4",
  errorColor: "#fa3a40",
  importantColor: "#ff9900"
};

export const {
  width: SCREEN_WIDTH,
  height: SCREEN_HEIGHT
} = Dimensions.get('window');

// note: we can change the '400' to any scale factor we want for real time scaling.
const scale = SCREEN_WIDTH / 420;

// scaled size should be used with any hard coded pixel value, ideally it will calculate
// the pixel value based on the resolution of your device
export function scaledSize(size) {

  const newSize = size * scale

  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize))
  }
  else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2
  }
}