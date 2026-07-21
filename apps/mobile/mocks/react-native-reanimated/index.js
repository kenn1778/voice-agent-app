const React = require('react');
const { Animated } = require('react-native');

const useSharedValue = (init) => ({ value: init });
const useAnimatedStyle = (factory) => factory();
const useDerivedValue = (fn) => fn();
const useAnimatedProps = (factory) => factory();
const withTiming = (to, _opts) => to;
const withRepeat = (anim, _count) => anim;
const withSpring = (to) => to;
const withDelay = (_delay, anim) => anim;
const Easing = { ease: 0, linear: 1, elastic: 2, in: (e) => e, out: (e) => e, inOut: (e) => e };
const cancelAnimation = () => {};
const runOnJS = (fn) => fn;
const runOnUI = (fn) => fn;

const createAnimatedComponent = (Component) =>
  React.forwardRef((props, ref) => React.createElement(Component, { ...props, ref }));

const ReanimatedMock = {
  View: Animated.View,
  Text: Animated.Text,
  Image: Animated.Image,
  ScrollView: Animated.ScrollView,
  createAnimatedComponent,
  useSharedValue,
  useAnimatedStyle,
  useDerivedValue,
  useAnimatedProps,
  withTiming,
  withRepeat,
  withSpring,
  withDelay,
  Easing,
  cancelAnimation,
  runOnJS,
  runOnUI,
  default: { View: Animated.View, Text: Animated.Text },
};

module.exports = ReanimatedMock;
module.exports.useSharedValue = useSharedValue;
module.exports.useAnimatedStyle = useAnimatedStyle;
module.exports.useDerivedValue = useDerivedValue;
module.exports.useAnimatedProps = useAnimatedProps;
module.exports.withTiming = withTiming;
module.exports.withRepeat = withRepeat;
module.exports.withSpring = withSpring;
module.exports.withDelay = withDelay;
module.exports.Easing = Easing;
module.exports.cancelAnimation = cancelAnimation;
module.exports.runOnJS = runOnJS;
module.exports.runOnUI = runOnUI;
module.exports.createAnimatedComponent = createAnimatedComponent;
module.exports.View = Animated.View;
module.exports.Text = Animated.Text;
module.exports.Image = Animated.Image;
module.exports.ScrollView = Animated.ScrollView;