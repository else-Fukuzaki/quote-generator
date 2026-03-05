import { useEffect, useState, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';

import { useQuotes } from '@/hooks/use-quotes';
import { Quote } from '@/db/database';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors, Fonts } from '@/constants/theme';

export default function HomeScreen() {
  const { getRandomQuote } = useQuotes();
  const [quote, setQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(true);
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const loadQuote = useCallback(async () => {
    setLoading(true);
    const q = await getRandomQuote();
    setQuote(q);
    setLoading(false);
  }, [getRandomQuote]);

  useEffect(() => {
    loadQuote();
  }, [loadQuote]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.header, { color: colors.tint, fontFamily: Fonts?.rounded }]}>
        今日のひと言
      </Text>

      <View style={[styles.card, { borderColor: colors.tint }]}>
        {loading ? (
          <ActivityIndicator size="large" color={colors.tint} />
        ) : quote ? (
          <>
            <Text style={[styles.quoteText, { color: colors.text, fontFamily: Fonts?.serif }]}>
              「{quote.text}」
            </Text>
            <Text style={[styles.author, { color: colors.icon }]}>— {quote.author}</Text>
          </>
        ) : (
          <Text style={{ color: colors.icon }}>名言がありません</Text>
        )}
      </View>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: colors.tint }]}
        onPress={loadQuote}
        activeOpacity={0.8}>
        <Text style={styles.buttonText}>次の名言</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 4,
    marginBottom: 40,
    textTransform: 'uppercase',
  },
  card: {
    width: '100%',
    minHeight: 200,
    borderWidth: 1.5,
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  quoteText: {
    fontSize: 22,
    lineHeight: 36,
    textAlign: 'center',
    marginBottom: 20,
  },
  author: {
    fontSize: 14,
    textAlign: 'center',
  },
  button: {
    paddingHorizontal: 48,
    paddingVertical: 16,
    borderRadius: 50,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 1,
  },
});
