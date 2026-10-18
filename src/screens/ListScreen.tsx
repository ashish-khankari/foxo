import React, { useEffect, useRef, useState } from 'react';
import { Animated, FlatList, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BIOMARKERS } from '../data';
import { RootStackParamList } from '../types';
import { getTrend } from '../utils';
import { colors, fonts } from '../theme';
import { useFlags } from '../useFlags';

type Props = NativeStackScreenProps<RootStackParamList, 'List'>;
const ARROW = { up: '↑', down: '↓', steady: '→' } as const;
const LEVELS = ['All levels', 'Basic', 'Intermediate', 'Advanced'];

function FadeInRow({ index, children }: { index: number; children: React.ReactNode }) {
  const v = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(v, { toValue: 1, duration: 350, delay: Math.min(index, 8) * 70, useNativeDriver: true }).start();
  }, []);
  return (
    <Animated.View style={{ opacity: v, transform: [{ translateY: v.interpolate({ inputRange: [0, 1], outputRange: [16, 0] }) }] }}>
      {children}
    </Animated.View>
  );
}

export default function ListScreen({ navigation }: Props) {
  const { flags } = useFlags();
  const [cat, setCat] = useState('All');
  const [level, setLevel] = useState('All levels');
  const [open, setOpen] = useState(false);

  const cats = ['All', ...Array.from(new Set(BIOMARKERS.map((m) => m.category)))];
  const data = BIOMARKERS.filter(
    (m) => (cat === 'All' || m.category === cat) && (level === 'All levels' || m.complexity === level),
  );
  const attention = BIOMARKERS.filter((m) => m.status !== 'normal').length;
  const active = (cat !== 'All' ? 1 : 0) + (level !== 'All levels' ? 1 : 0);
  const reset = () => {
    setCat('All');
    setLevel('All levels');
  };

  const renderOptions = (items: string[], value: string, onPick: (v: string) => void, label: string) => (
    <View style={s.optRow}>
      {items.map((o) => (
        <Pressable
          key={o}
          onPress={() => onPick(o)}
          accessibilityRole="button"
          accessibilityState={{ selected: o === value }}
          accessibilityLabel={`${label}: ${o}`}
          style={[s.chip, o === value && s.chipOn]}
        >
          <Text style={[s.chipText, o === value && { color: colors.accent }]}>{o}</Text>
        </Pressable>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={s.screen}>
      <View style={s.head}>
        <View style={s.headRow}>
          <Text style={s.big}>Results</Text>
          <Pressable
            onPress={() => setOpen(true)}
            accessibilityRole="button"
            accessibilityLabel={active ? `Filter, ${active} active` : 'Filter'}
            style={({ pressed }) => [s.filterBtn, active > 0 && s.filterBtnOn, pressed && { opacity: 0.75 }]}
          >
            <View style={s.icon}>
              <View style={[s.iconLine, { width: 20 }]} />
              <View style={[s.iconLine, { width: 14 }]} />
              <View style={[s.iconLine, { width: 8 }]} />
            </View>
            {active > 0 && <View style={s.badge} />}
          </Pressable>
        </View>
        <Text style={s.lockSub}>{attention} of {BIOMARKERS.length} need attention</Text>
        {active > 0 && (
          <Text style={s.filterNote}>
            Showing {data.length}: {[cat !== 'All' && cat, level !== 'All levels' && level].filter(Boolean).join(' · ')}
          </Text>
        )}
      </View>

      <Modal visible={open} transparent animationType="slide" onRequestClose={() => setOpen(false)}>
        <Pressable style={s.backdrop} onPress={() => setOpen(false)} accessibilityLabel="Close filter" />
        <SafeAreaView edges={['bottom']} style={s.sheet}>
          <View style={s.grab} />
          <Text style={s.sheetTitle}>Filter results</Text>
          <Text style={s.sheetLabel}>Complexity</Text>
          {renderOptions(LEVELS, level, setLevel, 'Complexity')}
          <Text style={s.sheetLabel}>Category</Text>
          {renderOptions(cats, cat, setCat, 'Category')}
          <View style={s.sheetActions}>
            <Pressable onPress={reset} style={s.resetBtn} accessibilityRole="button">
              <Text style={s.resetText}>Reset</Text>
            </Pressable>
            <Pressable onPress={() => setOpen(false)} style={s.applyBtn} accessibilityRole="button">
              <Text style={s.ctaText}>Show {data.length} results</Text>
            </Pressable>
          </View>
        </SafeAreaView>
      </Modal>

      <FlatList
        key={`${cat}-${level}`}
        data={data}
        keyExtractor={(m) => m.id}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 8 }}
        ListEmptyComponent={<Text style={s.empty}>No results in this group yet.</Text>}
        renderItem={({ item, index }) => (
          <FadeInRow index={index}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`${item.name}, status ${item.status}`}
              style={({ pressed }) => [s.row, pressed && { opacity: 0.75 }]}
              onPress={() => navigation.navigate('Detail', { id: item.id })}
            >
              <View style={[s.dot, { backgroundColor: colors[item.status] }]} />
              <View style={{ flex: 1 }}>
                <Text style={s.name}>{item.name}{flags.includes(item.id) ? '  ★' : ''}</Text>
                <Text style={s.sub}>{item.history[item.history.length - 1]} {item.unit}</Text>
              </View>
              <Text style={s.trend}>{ARROW[getTrend(item.history)]}</Text>
            </Pressable>
          </FadeInRow>
        )}
      />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  head: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 16 },
  big: { fontFamily: fonts.serif, fontSize: 56, lineHeight: 60, color: colors.ink },
  lockSub: { fontFamily: fonts.sans, fontSize: 18, color: colors.cream, marginTop: 2 },
  chip: { paddingVertical: 9, paddingHorizontal: 16, borderRadius: 18, borderWidth: 1, borderColor: colors.edge, backgroundColor: colors.glass, marginRight: 8 },
  chipOn: { backgroundColor: colors.card, borderColor: colors.cream },
  chipText: { fontFamily: fonts.sansMd, color: colors.cream, fontSize: 14 },
  row: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card, paddingVertical: 16, paddingHorizontal: 20, borderRadius: 24, marginBottom: 10 },
  dot: { width: 11, height: 11, borderRadius: 6, marginRight: 14 },
  name: { fontFamily: fonts.sansMd, fontSize: 16, color: colors.ink },
  sub: { fontFamily: fonts.sans, fontSize: 13, color: colors.sub, marginTop: 2 },
  trend: { fontFamily: fonts.sans, fontSize: 20, color: colors.cream },
  empty: { fontFamily: fonts.sans, textAlign: 'center', color: colors.sub, marginTop: 40 },
  headRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  filterBtn: { width: 48, height: 48, borderRadius: 24, borderWidth: 1, borderColor: colors.edge, backgroundColor: colors.glass, alignItems: 'center', justifyContent: 'center' },
  filterBtnOn: { borderColor: colors.accent },
  icon: { gap: 4, alignItems: 'center' },
  iconLine: { height: 2.5, borderRadius: 2, backgroundColor: colors.cream },
  badge: { position: 'absolute', top: 10, right: 10, width: 9, height: 9, borderRadius: 5, backgroundColor: colors.accent },
  filterNote: { fontFamily: fonts.sans, fontSize: 13, color: colors.accent, marginTop: 6 },
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.55)' },
  sheet: { backgroundColor: colors.bgDeep, borderTopLeftRadius: 28, borderTopRightRadius: 28, paddingHorizontal: 20, paddingBottom: 12, borderWidth: 1, borderColor: colors.edge },
  grab: { alignSelf: 'center', width: 40, height: 4, borderRadius: 2, backgroundColor: colors.edge, marginTop: 10, marginBottom: 14 },
  sheetTitle: { fontFamily: fonts.serif, fontSize: 32, color: colors.ink, marginBottom: 6 },
  sheetLabel: { fontFamily: fonts.sansMd, fontSize: 13, color: colors.sub, marginTop: 14, marginBottom: 10, textTransform: 'uppercase', letterSpacing: 1 },
  optRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  sheetActions: { flexDirection: 'row', gap: 12, marginTop: 24, marginBottom: 8 },
  resetBtn: { paddingVertical: 15, paddingHorizontal: 24, borderRadius: 28, borderWidth: 1, borderColor: colors.cream, alignItems: 'center' },
  resetText: { fontFamily: fonts.sansMd, color: colors.cream, fontSize: 16 },
  applyBtn: { flex: 1, backgroundColor: colors.accent, paddingVertical: 15, borderRadius: 28, alignItems: 'center' },
  cta: { margin: 20, backgroundColor: colors.accent, paddingVertical: 15, borderRadius: 28, alignItems: 'center' },
  ctaText: { fontFamily: fonts.sansMd, color: colors.onAccent, fontSize: 16 },
});