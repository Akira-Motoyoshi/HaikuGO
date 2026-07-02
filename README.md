# 俳句GO

場所と俳句を結びつける地図アプリです。俳句ゆかりの地にピンを立て、クリックするとその土地にまつわる一句を詠めます。

## 公開サイト

### [俳句GOを開く](https://akira-motoyoshi.github.io/HaikuGO/)

iPad、スマートフォン、パソコンのブラウザからアクセスできます。

## 現在の内容

- Mapbox GL JS v3.3.0 を使った日本地図表示
- 日本と海外の有名俳句・デモ俳句のピン表示
- ピンをクリックして俳句カードを表示
- 俳句投稿フォーム
- 返句と「をかし」
- 週間・月間ランキング
- メールアドレスによるアカウント作成・ログイン
- 確認メール、パスワード再設定メール
- Firebaseによる投稿・返句・をかし・プロフィール・俳友の端末間共有
- アイコン画像アップロード
- 地図クリックで座標選択
- 現在地取得による座標入力
- Mapbox Geocoding API による場所検索
- カテゴリ: 自然、水辺、都市、生活、娯楽

## ファイル

- `index.html`: 現在のデモ版本体
- `backups/haiku_go_2026-06-16.html`: 2026-06-16 時点のバックアップ

## 海外作品の出典

- Ezra Pound, “In a Station of the Metro” — [Poetry Foundation](https://www.poetryfoundation.org/poetrymagazine/poems/12675/in-a-station-of-the-metro)
- Amy Lowell, “Autumn Haze” — [京都大学 花山天文台](https://www.kwasan.kyoto-u.ac.jp/~cmo/cmomn3/Amy.htm)
- Sadakichi Hartmann, “Haikai” — [Academy of American Poets](https://poets.org/poem/haikai/print)

追加した海外作品は20世紀初頭に発表されたパブリックドメイン作品です。

## アカウントとオンライン保存

アカウントと投稿データはFirebase Authentication / Cloud Firestoreに保存されます。初回登録時は確認メールのリンクを開いてからログインしてください。

安全のため、パスワードそのものをメールで送信したり、アプリ内に保存したりはしません。忘れた場合はログイン画面の「パスワードを忘れた」から再設定メールを送れます。

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

- 季語・季節フィルタ
- 奥の細道ルート表示
- 多言語対応

## 修正が必要な箇所

- 俳句を詠む際の場所検索機能が正しい場所を指していない
- をかしボタンのUI
