import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Pressable, ScrollView, Share, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BIOMARKERS, TEST_DATES } from '../data';
import { RootStackParamList } from '../types';
import { outOfRangeSince, questionsFor, rangeState, trendSentence } from '../utils';
import { colors, fonts } from '../theme';
import { useFlags } from '../useFlags';

type Props = NativeStackScreenProps<RootStackParamList, 'Detail'>;

function GrowBar({ target, color, delay }: { target: number; color: string; delay: number }) {
  const h = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(h, { toValue: target, duration: 600, delay, easing: Easing.out(Easing.cubic), useNativeDriver: false }).start();
  }, [target]);
  return <Animated.View style={{ width: 30, borderRadius: 8, marginTop: 4, height: h, backgroundColor: color }} />;
}

export default function DetailScreen({ route }: Props) {
  const m = BIOMARKERS.find((x) => x.id === route.params.id);
  const { flags, toggle } = useFlags();

  if (!m) return <Text style={s.empty}>This result could not be found.</Text>;

  const max = Math.max(...m.history);
  const flagged = flags.includes(m.id);
  const label = m.status === 'normal' ? 'Normal' : m.status === 'watch' ? 'Keep an eye on this' : 'Needs attention';
  const since = outOfRangeSince(m);
  const outColor = colors[m.status === 'normal' ? 'watch' : m.status];
  const barColor = (v: number, i: number) =>
    rangeState(v, m.range) !== 'in' ? outColor : i === m.history.length - 1 ? colors.normal : colors.barMuted;

  const questions = questionsFor(m);
  const shareQuestions = async () => {
    try {
      await Share.share({ message: `Questions about my ${m.name}\n\n${questions.map((q) => `- ${q}`).join('\n')}` });
    } catch { }
  };

  return (
    <ScrollView style={s.screen} contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
      <Text style={s.title}>{m.name}</Text>
      <Text style={[s.status, { color: colors[m.status] }]}>{label}</Text>

      <View style={s.chart} accessibilityLabel={`Past values: ${m.history.join(', ')} ${m.unit}`}>
        {m.history.map((v, i) => (
          <View key={i} style={s.barWrap}>
            <Text style={s.barLabel}>{v}</Text>
            <GrowBar
              target={Math.max(8, (v / max) * 110)}
              color={barColor(v, i)}
              delay={i * 120}
            />
            <Text style={s.barDate}>{TEST_DATES[i]}</Text>
          </View>
        ))}
      </View>

      <Text style={s.legend}>Coloured bars are outside the usual range ({m.range} {m.unit}).</Text>
      <Text style={s.body}>{trendSentence(m)}</Text>
      {since >= 0 && (
        <Text style={s.sub}>
          It first went outside the usual range in {TEST_DATES[since]} and has stayed there.
        </Text>
      )}
      <Text style={s.sub}>{m.meaning} Usual range: {m.range} {m.unit}.</Text>

      <View style={s.qCard}>
        <Text style={s.qTitle}>Questions for your doctor</Text>
        {questions.map((q, i) => (
          <View key={i} style={s.qRow}>
            <Text style={s.qNum}>{i + 1}</Text>
            <Text style={s.qText}>{q}</Text>
          </View>
        ))}
        <Pressable onPress={shareQuestions} accessibilityRole="button" style={({ pressed }) => [s.qShare, pressed && { opacity: 0.75 }]}>
          <Text style={s.qShareText}>Share these questions</Text>
        </Pressable>
      </View>

      <Pressable style={[s.btn, flagged && s.btnOn]} onPress={() => toggle(m.id)} accessibilityRole="button">
        <Text style={[s.btnText, flagged && { color: colors.onAccent }]}>{flagged ? 'Flagged for doctor' : 'Flag for doctor'}</Text>
      </Pressable>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  title: { fontFamily: fonts.serif, fontSize: 46, lineHeight: 50, color: colors.ink },
  status: { fontFamily: fonts.sansMd, fontSize: 15, marginTop: 4, marginBottom: 20 },
  chart: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-around', height: 185, backgroundColor: colors.glass, borderRadius: 24, padding: 14, borderWidth: 1, borderColor: colors.edge },
  barWrap: { alignItems: 'center', justifyContent: 'flex-end' },
  barLabel: { fontFamily: fonts.sans, fontSize: 12, color: colors.cream },
  barDate: { fontFamily: fonts.sans, fontSize: 11, color: colors.sub, marginTop: 6 },
  legend: { fontFamily: fonts.sans, fontSize: 12, color: colors.sub, marginTop: 8 },
  body: { fontFamily: fonts.sansMd, fontSize: 18, color: colors.ink, marginTop: 22 },
  sub: { fontFamily: fonts.sans, fontSize: 14, color: colors.sub, marginTop: 8, lineHeight: 21 },
  qCard: { marginTop: 24, backgroundColor: colors.card, borderRadius: 24, padding: 18 },
  qTitle: { fontFamily: fonts.serif, fontSize: 26, color: colors.ink, marginBottom: 10 },
  qRow: { flexDirection: 'row', marginTop: 10 },
  qNum: { fontFamily: fonts.sansMd, fontSize: 13, color: colors.onAccent, backgroundColor: colors.accent, width: 22, height: 22, borderRadius: 11, textAlign: 'center', lineHeight: 22, marginRight: 12, marginTop: 1 },
  qText: { flex: 1, fontFamily: fonts.sans, fontSize: 15, lineHeight: 22, color: colors.ink },
  qShare: { marginTop: 16, paddingVertical: 12, borderRadius: 24, alignItems: 'center', borderWidth: 1, borderColor: colors.cream },
  qShareText: { fontFamily: fonts.sansMd, color: colors.cream, fontSize: 15 },
  btn: { marginTop: 26, paddingVertical: 14, borderRadius: 28, alignItems: 'center', borderWidth: 1, borderColor: colors.cream },
  btnOn: { backgroundColor: colors.accent, borderColor: colors.accent },
  btnText: { fontFamily: fonts.sansMd, color: colors.cream, fontSize: 16 },
  empty: { fontFamily: fonts.sans, padding: 20, color: colors.sub },
});