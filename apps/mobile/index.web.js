import { AppRegistry } from 'react-native';
import App from './src/App';

AppRegistry.registerComponent('VoiceAgent', () => App);
AppRegistry.runApplication('VoiceAgent', { rootTag: document.getElementById('root') });
