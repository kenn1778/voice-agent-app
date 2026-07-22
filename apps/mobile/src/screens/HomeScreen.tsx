import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../auth';
import type { RootStackParamList } from '../navigation';

const colors = {
  canvasA: '#1B0F30',
  surface: '#291B49',
  surfaceAlt: '#33235C',
  borderSoft: 'rgba(255,255,255,0.07)',
  textPrimary: '#FBF7FF',
  textSecondary: '#C7B7E8',
  textFaint: '#8B77B3',
  coral: '#FF6B5B',
  pink: '#FF3D9A',
  gold: '#FFC259',
  mint: '#2FE6C0',
  violet: '#9B6BFF',
  sky: '#4EA8FF',
};


function PromptPill({ onPress }: { onPress: () => void }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      accessible
      accessibilityLabel="Ask Prism or tap to talk"
      accessibilityRole="button"
      style={{
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.borderSoft,
        borderRadius: 999,
        paddingVertical: 13,
        paddingHorizontal: 16,
      }}
    >
      <Text style={{ color: colors.textFaint, fontSize: 14 }}>{'🔍'}</Text>
      <Text style={{ flex: 1, color: colors.textFaint, fontSize: 14, textAlign: 'left' }}>
        Ask Prism, or tap to talk
      </Text>
      <View
        style={{
          width: 28,
          height: 28,
          borderRadius: 14,
          backgroundColor: colors.mint,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text style={{ fontSize: 14, color: '#1D1333' }}>{'🎤'}</Text>
      </View>
    </TouchableOpacity>
  );
}

function Chip({ label, dotColor }: { label: string; dotColor: string }) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      accessibilityLabel={label}
      accessibilityRole="button"
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: colors.surfaceAlt,
        borderWidth: 1,
        borderColor: colors.borderSoft,
        borderRadius: 999,
        paddingVertical: 9,
        paddingHorizontal: 14,
      }}
    >
      <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: dotColor }} />
      <Text style={{ color: colors.textPrimary, fontSize: 13 }}>{label}</Text>
    </TouchableOpacity>
  );
}

function ConvoCard({
  title,
  meta,
  accentColor,
  waveHeights,
}: {
  title: string;
  meta: string;
  accentColor: string;
  waveHeights: number[];
}) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.borderSoft,
        borderLeftWidth: 3,
        borderLeftColor: accentColor,
        borderRadius: 16,
        paddingVertical: 12,
        paddingHorizontal: 14,
        marginBottom: 10,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 3, height: 22 }}>
        {waveHeights.map((h, i) => (
          <View
            key={i}
            style={{
              width: 3,
              height: `${h}%` as any,
              backgroundColor: accentColor,
              borderRadius: 2,
              opacity: 0.85,
            }}
          />
        ))}
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ color: colors.textPrimary, fontSize: 14, fontWeight: '600', margin: 0 }}>
          {title}
        </Text>
        <Text style={{ color: colors.textFaint, fontSize: 11, margin: 0 }}>{meta}</Text>
      </View>
    </View>
  );
}

export function HomeScreen() {
  const { signOut } = useAuth();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <View style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ paddingHorizontal: 22, paddingTop: 18, paddingBottom: 6 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Text style={{ color: '#2FE6C0', fontSize: 11, letterSpacing: 1.76 }}>MOBILE UI</Text>
            </View>
            <TouchableOpacity onPress={signOut} accessibilityLabel="Sign out" accessibilityRole="button">
              <Text style={{ color: colors.textFaint, fontSize: 13 }}>Sign Out</Text>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingHorizontal: 22, paddingBottom: 130 }}
          showsVerticalScrollIndicator={false}
        >
          <View style={{ marginBottom: 26 }}>
            <Text style={{ color: colors.gold, fontSize: 12, letterSpacing: 1.92, textTransform: 'uppercase' }}>
              Good morning, Ada
            </Text>
            <Text
              style={{
                color: colors.textPrimary,
                fontSize: 24,
                fontWeight: '700',
                lineHeight: 28,
                letterSpacing: -0.24,
                marginTop: 8,
              }}
            >
              What do you want to talk through?
            </Text>
          </View>

          <View style={{ marginBottom: 26 }}>
            <PromptPill onPress={() => navigation.navigate('VoiceSession')} />
          </View>

          <View style={{ marginBottom: 26 }}>
            <Text style={{ color: colors.textFaint, fontSize: 11, letterSpacing: 1.1, textTransform: 'uppercase', marginBottom: 12 }}>
              Quick starts
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10 }}>
              <Chip label="Plan my day" dotColor={colors.coral} />
              <Chip label="Translate live" dotColor={colors.mint} />
              <Chip label="Brainstorm names" dotColor={colors.gold} />
              <Chip label="Summarize email" dotColor={colors.sky} />
            </ScrollView>
          </View>

          <View>
            <Text style={{ color: colors.textFaint, fontSize: 11, letterSpacing: 1.1, textTransform: 'uppercase', marginBottom: 12 }}>
              Recent conversations
            </Text>
            <ConvoCard
              title="Morning stand-up notes"
              meta="4 min · 8:02 AM"
              accentColor={colors.coral}
              waveHeights={[40, 80, 55, 95, 35]}
            />
            <ConvoCard
              title="Rebooking the Tuesday flight"
              meta="2 min · Yesterday"
              accentColor={colors.mint}
              waveHeights={[60, 30, 90, 45, 70]}
            />
            <ConvoCard
              title="Brainstorm: podcast names"
              meta="9 min · Yesterday"
              accentColor={colors.violet}
              waveHeights={[50, 85, 40, 65, 30]}
            />
          </View>
        </ScrollView>

        <View
          pointerEvents="box-none"
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 78,
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              color: colors.textFaint,
              fontSize: 11,
              backgroundColor: 'rgba(13,8,24,0.6)',
              paddingHorizontal: 10,
              paddingVertical: 4,
              borderRadius: 999,
              marginBottom: 8,
              overflow: 'hidden',
            }}
          >
            Tap to start a session
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('VoiceSession')}
            activeOpacity={0.85}
            accessible
            accessibilityLabel="Start voice session"
            accessibilityRole="button"
            style={{
              width: 64,
              height: 64,
              borderRadius: 32,
              backgroundColor: colors.mint,
              alignItems: 'center',
              justifyContent: 'center',
              shadowColor: '#FF3D9A',
              shadowOffset: { width: 0, height: 14 },
              shadowOpacity: 0.55,
              shadowRadius: 30,
              elevation: 20,
            }}
          >
            <Text style={{ fontSize: 26, color: '#1D1333' }}>{'🎤'}</Text>
          </TouchableOpacity>
        </View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            paddingVertical: 14,
            paddingHorizontal: 10,
            paddingBottom: 18,
            borderTopWidth: 1,
            borderTopColor: colors.borderSoft,
          }}
        >
          <TouchableOpacity style={{ alignItems: 'center', gap: 4 }} accessibilityLabel="Home" accessibilityRole="button">
            <Text style={{ fontSize: 20, color: colors.mint }}>{'🏠'}</Text>
            <Text style={{ color: colors.mint, fontSize: 10 }}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ alignItems: 'center', gap: 4 }} accessibilityLabel="History" accessibilityRole="button">
            <Text style={{ fontSize: 20, color: colors.textFaint }}>{'🕐'}</Text>
            <Text style={{ color: colors.textFaint, fontSize: 10 }}>History</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ alignItems: 'center', gap: 4 }} accessibilityLabel="Profile" accessibilityRole="button">
            <Text style={{ fontSize: 20, color: colors.textFaint }}>{'👤'}</Text>
            <Text style={{ color: colors.textFaint, fontSize: 10 }}>Profile</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}
