import { View } from 'react-native';
export const SafeAreaProvider = ({ children }: { children: React.ReactNode }) => <>{children}</>;
export const SafeAreaView = View;
export const useSafeAreaInsets = () => ({ top: 0, right: 0, bottom: 0, left: 0 });
