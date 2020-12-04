import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';
import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import MobilenetScreen from '../screens/MobilenetScreen';
import PoseNetScreen from '../screens/PoseNetScreen';
import TabTwoScreen from '../screens/TabTwoScreen';

const BottomTab = createBottomTabNavigator();

export default function BottomTabNavigator() {
  const colorScheme = useColorScheme();

  return (
    <BottomTab.Navigator
      initialRouteName="TabMobilenet"
      tabBarOptions={{ activeTintColor: Colors[colorScheme].tint }}
    >
      <BottomTab.Screen
        name="TabMobilenet"
        component={TabMobilenetNavigator}
        options={{
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="ios-code" color={color} />
          ),
        }}
      />
      <BottomTab.Screen
        name="TabPoseNet"
        component={TabPoseNetNavigator}
        options={{
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="ios-code" color={color} />
          ),
        }}
      />
      <BottomTab.Screen
        name="TabTwo"
        component={TabTwoNavigator}
        options={{
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="ios-code" color={color} />
          ),
        }}
      />
    </BottomTab.Navigator>
  );
}

// You can explore the built-in icon families and icons on the web at:
// https://icons.expo.fyi/
function TabBarIcon(props: { name: string; color: string }) {
  return <Ionicons size={30} style={{ marginBottom: -3 }} {...props} />;
}

// Each tab has its own navigation stack, you can read more about this pattern here:
// https://reactnavigation.org/docs/tab-based-navigation#a-stack-navigator-for-each-tab

const TabMobilenetStack = createStackNavigator();

function TabMobilenetNavigator() {
  return (
    <TabMobilenetStack.Navigator>
      <TabMobilenetStack.Screen
        name="TabOneScreen"
        component={MobilenetScreen}
        options={{ headerTitle: 'Tab One Title' }}
      />
    </TabMobilenetStack.Navigator>
  );
}

const TabPoseNetStack = createStackNavigator();

function TabPoseNetNavigator() {
  return (
    <TabPoseNetStack.Navigator>
      <TabPoseNetStack.Screen
        name="TabPoseNetScreen"
        component={PoseNetScreen}
        options={{ headerTitle: 'PoseNet' }}
      />
    </TabPoseNetStack.Navigator>
  );
}

const TabTwoStack = createStackNavigator();

function TabTwoNavigator() {
  return (
    <TabTwoStack.Navigator>
      <TabTwoStack.Screen
        name="TabTwoScreen"
        component={TabTwoScreen}
        options={{ headerTitle: 'Tab Two Title' }}
      />
    </TabTwoStack.Navigator>
  );
}
