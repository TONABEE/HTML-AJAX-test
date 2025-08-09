# シンプルカード・ディレクトリ

JSONPlaceholder APIを使用したレスポンシブな写真ギャラリーサイトです。

## 🚀 機能

- **レスポンシブデザイン**: モバイル1列 → タブレット2列 → デスクトップ3列
- **リアルタイム検索**: タイトルでの部分一致検索
- **ページング**: 12件ずつ表示、前後ページ移動
- **詳細表示**: カードクリックでモーダル表示
- **キーボードショートカット**: 矢印キー、`/`キーでの操作

## 🛠 技術スタック

- **HTML5**: セマンティック構造
- **CSS3**: Flexbox、レスポンシブデザイン
- **JavaScript (ES6+)**: Modules、async/await、配列メソッド
- **API**: JSONPlaceholder Photos API

## 📁 プロジェクト構成

```
/
├── public/
│   └── index.html          # メインHTML
├── src/
│   ├── css/
│   │   └── style.css       # スタイルシート
│   └── js/
│       ├── api.js          # データ操作(純粋関数)
│       ├── dom.js          # DOM操作(副作用関数)
│       └── main.js         # メインコントローラー
├── .gitignore
└── README.md
```

## 🌐 デモ

[GitHub Pagesで公開中](https://tonabee.github.io/simple-card-directory/)

## 💻 ローカル開発

1. リポジトリをクローン
```bash
git clone https://github.com/TONABEE/simple-card-directory.git
cd simple-card-directory
```

2. ローカルサーバーで起動
```bash
# Python 3の場合
python -m http.server 8000

# Node.jsのlive-serverを使用する場合
npx live-server public
```

3. ブラウザで `http://localhost:8000/public/` にアクセス

## 🎯 学習ポイント

このプロジェクトは以下の技術要素を学習できます：

- **HTML5**: セマンティックタグ、フォーム、アクセシビリティ
- **CSS3**: Flexbox、メディアクエリ、レスポンシブデザイン
- **JavaScript**: ES Modules、async/await、DOM操作、イベント処理
- **API通信**: fetch、エラーハンドリング、非同期処理
- **関数型プログラミング**: 純粋関数、配列メソッド活用

## 📝 ライセンス

MIT License
