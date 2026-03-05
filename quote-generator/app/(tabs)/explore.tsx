import { useEffect, useState, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

import { useQuotes } from '@/hooks/use-quotes';
import { Quote } from '@/db/database';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';

export default function ExploreScreen() {
  const { getAllQuotes, addQuote, deleteQuote } = useQuotes();
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [newText, setNewText] = useState('');
  const [newAuthor, setNewAuthor] = useState('');
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const loadQuotes = useCallback(async () => {
    const all = await getAllQuotes();
    setQuotes(all);
  }, [getAllQuotes]);

  useEffect(() => {
    loadQuotes();
  }, [loadQuotes]);

  const handleAdd = async () => {
    const text = newText.trim();
    const author = newAuthor.trim();
    if (!text || !author) {
      Alert.alert('入力エラー', '名言と著者名を入力してください');
      return;
    }
    await addQuote(text, author);
    setNewText('');
    setNewAuthor('');
    loadQuotes();
  };

  const handleDelete = (item: Quote) => {
    Alert.alert('削除確認', `「${item.text}」を削除しますか？`, [
      { text: 'キャンセル', style: 'cancel' },
      {
        text: '削除',
        style: 'destructive',
        onPress: async () => {
          await deleteQuote(item.id);
          loadQuotes();
        },
      },
    ]);
  };

  const isDark = colorScheme === 'dark';
  const inputBg = isDark ? '#2a2a2a' : '#f5f5f5';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        style={{ flex: 1, width: '100%' }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <Text style={[styles.header, { color: colors.tint }]}>名言一覧</Text>

        {/* 追加フォーム */}
        <View style={styles.form}>
          <TextInput
            style={[styles.input, { backgroundColor: inputBg, color: colors.text }]}
            placeholder="名言を入力..."
            placeholderTextColor={colors.icon}
            value={newText}
            onChangeText={setNewText}
            multiline
          />
          <TextInput
            style={[styles.input, { backgroundColor: inputBg, color: colors.text }]}
            placeholder="著者名"
            placeholderTextColor={colors.icon}
            value={newAuthor}
            onChangeText={setNewAuthor}
          />
          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: colors.tint }]}
            onPress={handleAdd}
            activeOpacity={0.8}>
            <Text style={styles.addButtonText}>追加</Text>
          </TouchableOpacity>
        </View>

        {/* 名言リスト */}
        <FlatList
          data={quotes}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <View style={[styles.row, { borderColor: colors.icon + '44' }]}>
              <View style={styles.rowText}>
                <Text style={[styles.quoteText, { color: colors.text }]}>{item.text}</Text>
                <Text style={[styles.authorText, { color: colors.icon }]}>— {item.author}</Text>
              </View>
              <TouchableOpacity onPress={() => handleDelete(item)} style={styles.deleteBtn}>
                <Text style={styles.deleteText}>削除</Text>
              </TouchableOpacity>
            </View>
          )}
          ListEmptyComponent={
            <Text style={{ color: colors.icon, textAlign: 'center', marginTop: 40 }}>
              名言がありません
            </Text>
          }
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: 2,
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  form: {
    marginBottom: 12,
    gap: 8,
  },
  input: {
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
  },
  addButton: {
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
  list: {
    paddingBottom: 40,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    paddingVertical: 14,
    gap: 8,
  },
  rowText: {
    flex: 1,
    gap: 4,
  },
  quoteText: {
    fontSize: 15,
    lineHeight: 22,
  },
  authorText: {
    fontSize: 12,
  },
  deleteBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: '#ff3b3033',
    borderRadius: 8,
  },
  deleteText: {
    color: '#ff3b30',
    fontSize: 13,
    fontWeight: '600',
  },
});
