import 'regenerator-runtime/runtime';
import { AppRegistry } from 'react-native';
import App from './src/App';

// CSS import after App so Tailwind overrides react-native-web styles
import './global.css';

AppRegistry.registerComponent('VoiceAgent', () => App);
AppRegistry.runApplication('VoiceAgent', { rootTag: document.getElementById('root') });
