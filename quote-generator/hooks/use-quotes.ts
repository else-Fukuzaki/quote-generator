import { useCallback } from 'react';
import { useSQLiteContext, SQLiteRunResult } from 'expo-sqlite';
import { Quote } from '@/db/database';

export function useQuotes() {
  const db = useSQLiteContext();

  const getRandomQuote = useCallback((): Promise<Quote | null> => {
    return db.getFirstAsync<Quote>('SELECT * FROM quotes ORDER BY RANDOM() LIMIT 1');
  }, [db]);

  const getAllQuotes = useCallback((): Promise<Quote[]> => {
    return db.getAllAsync<Quote>('SELECT * FROM quotes ORDER BY id ASC');
  }, [db]);

  const addQuote = useCallback(
    (text: string, author: string): Promise<SQLiteRunResult> => {
      return db.runAsync('INSERT INTO quotes (text, author) VALUES (?, ?)', [text, author]);
    },
    [db]
  );

  const deleteQuote = useCallback(
    (id: number): Promise<SQLiteRunResult> => {
      return db.runAsync('DELETE FROM quotes WHERE id = ?', [id]);
    },
    [db]
  );

  return { getRandomQuote, getAllQuotes, addQuote, deleteQuote };
}
