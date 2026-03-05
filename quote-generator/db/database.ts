import * as SQLite from 'expo-sqlite';

export type Quote = {
  id: number;
  text: string;
  author: string;
};

const INITIAL_QUOTES: Omit<Quote, 'id'>[] = [
  { text: '千里の道も一歩から。', author: '老子' },
  { text: '継続は力なり。', author: '日本のことわざ' },
  { text: '七転び八起き。', author: '日本のことわざ' },
  { text: '失敗は成功のもと。', author: '日本のことわざ' },
  { text: '明日は明日の風が吹く。', author: '日本のことわざ' },
  { text: '人生は短し、芸術は長し。', author: 'ヒポクラテス' },
  { text: '知ることは少なく、感じることは多い。', author: 'レイチェル・カーソン' },
  { text: '夢は見るものではなく、叶えるものだ。', author: '不詳' },
  { text: '今日という日は、残りの人生の最初の日だ。', author: 'アビー・ホフマン' },
  { text: '成功の秘訣は、始めることだ。', author: 'マーク・トウェイン' },
  { text: '努力は必ず報われる。', author: '王貞治' },
  { text: 'やってみせ、言って聞かせて、させてみせ、ほめてやらねば、人は動かじ。', author: '山本五十六' },
  { text: '人は負けることを知りて、人より勝れり。', author: '徳川家康' },
  { text: '石の上にも三年。', author: '日本のことわざ' },
  { text: '一期一会。', author: '千利休' },
];

export async function migrateDbIfNeeded(db: SQLite.SQLiteDatabase) {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS quotes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      text TEXT NOT NULL,
      author TEXT NOT NULL
    );
  `);

  const row = await db.getFirstAsync<{ count: number }>(
    'SELECT COUNT(*) as count FROM quotes'
  );
  if ((row?.count ?? 0) === 0) {
    for (const q of INITIAL_QUOTES) {
      await db.runAsync('INSERT INTO quotes (text, author) VALUES (?, ?)', [q.text, q.author]);
    }
  }
}
