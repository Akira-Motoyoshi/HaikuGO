# 俳句GO

場所と俳句を結びつける地図アプリです。俳句ゆかりの地にピンを立て、クリックするとその土地にまつわる一句を詠めます。

## 現在の内容

- Mapbox GL JS v3.3.0 を使った日本地図表示
- 有名俳句・デモ俳句 50 件のピン表示
- ピンをクリックして俳句カードを表示
- 俳句投稿フォーム
- 地図クリックで座標選択
- 現在地取得による座標入力
- Mapbox Geocoding API による場所検索
- カテゴリ: 自然、水辺、都市、生活、娯楽
- 「をかし」ボタンによるローカルいいね保存

## 今回の永続化改善

このブランチでは、ログイン状態と投稿データを他デバイスでも共有できるようにするための Firebase 永続化モジュールを追加しています。

追加ファイル:

- `src/firebase-persistence.js`: Firebase Authentication / Firestore を使う保存モジュール
- `firebase.firestore.rules`: Firestore セキュリティルール

### 解決する問題

| 問題 | 原因 | 改善内容 |
|---|---|---|
| ログイン情報が保存されない | 認証状態をブラウザ永続化していない | `browserLocalPersistence` を使用 |
| 投稿した俳句が保存されない | localStorage または一時データのみ | Firestore の `haikuPosts` に保存 |
| 他デバイスから投稿が見れない | 端末内保存のみ | Firestore のリアルタイム購読で共有 |

## Firebase 設定手順

1. Firebase Console でプロジェクトを作成
2. Authentication を開き、匿名認証または Email/Password 認証を有効化
3. Firestore Database を作成
4. `src/firebase-persistence.js` の `firebaseConfig` に Webアプリ設定を入れる
5. `firebase.firestore.rules` を Firestore Rules に反映
6. GitHub Pages にデプロイ

`firebaseConfig` の例:

```js
export const firebaseConfig = {
  apiKey: '...',
  authDomain: 'your-project.firebaseapp.com',
  projectId: 'your-project',
  appId: '...'
};
```

## 既存画面への組み込み例

既存の `index.html` 側で、保存処理を localStorage から次の形に差し替えてください。

```js
import { initPersistence, saveHaiku, addOkashi } from './src/firebase-persistence.js';

await initPersistence({
  onUserChange: (user) => {
    console.log('login user', user?.uid);
  },
  onPostsChange: (posts) => {
    renderHaikuPins(posts);
    renderHaikuList(posts);
  },
  onError: (message) => {
    console.error(message);
  }
});

await saveHaiku({
  poem,
  place,
  lat,
  lng,
  category
});

await addOkashi(postId);
```

## ファイル

- `index.html`: 現在のデモ版本体
- `src/firebase-persistence.js`: Firebase 永続化処理
- `firebase.firestore.rules`: Firestore セキュリティルール
- `backups/haiku_go_2026-06-16.html`: 2026-06-16 時点のバックアップ

## ローカルで開く

Mapboxの地図タイルは `file://` では正常に表示されない場合があります。ローカルサーバ経由で開いてください。

```bash
python3 -m http.server 8765
```

その後、ブラウザで次を開きます。

```text
http://localhost:8765/index.html
```

## 今後の予定

- 返句機能
- 季語・季節フィルタ
- 奥の細道ルート表示
- 多言語対応
- をかし数によるランキング
- 俳友機能

## 修正が必要な箇所

- 俳句を詠む際の場所検索機能が正しい場所を指していない
- をかしボタンのUI
