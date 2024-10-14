# パーソナルブログフロントエンド

これは私のパーソナルブログプロジェクトのフロントエンド部分です。ユーザーがブログ記事を閲覧し、Markdown形式でコンテンツを表示できます。このプロジェクトは **React** で構築されており、APIバックエンドと連携して記事データを取得しています。

## 特徴

- ブログ記事の一覧表示
- Markdownフォーマットでの記事表示
- 記事の作成および編集機能
- デスクトップとモバイルの両方に対応したレスポンシブデザイン

## 使用技術

- **React**: UIコンポーネントの構築
- **npm**: パッケージ管理ツール
- **react-markdown**: Markdownコンテンツを表示するためのライブラリ
- **axios**: APIリクエストを行うためのライブラリ
- **CSS/SCSS**: スタイリング

## セットアップ手順

ローカルでこのプロジェクトを実行するための手順は以下の通りです：

1. **リポジトリをクローンする:**
   ```bash
   git clone https://github.com/dimensionFree/reactTest
   cd reactTest
   ```

2. **依存関係をインストールする: Node.jsがインストールされていることを確認した上で、以下のコマンドを実行します:**
   ```bash
   npm install
   ```

3. **開発サーバーを起動する: 依存関係のインストールが完了したら、開発サーバーを起動します：**
   ```bash
   npm start
   ```

4. **アプリケーションを表示する: ブラウザで http://localhost:3000 を開いてアプリを確認します。**
   ```bash
   npm start
   ```
## フォルダ構成

```plaintext
blog-frontend/
├── public/             # 公開ファイル (index.htmlなど)
├── src/                # ソースコード
│   ├── components/     # 再利用可能なコンポーネント
│   ├── pages/          # メインページコンポーネント
│   ├── utils/          # ユーティリティ関数
│   └── App.js          # メインアプリケーションコンポーネント
├── package.json        # プロジェクトの依存関係とスクリプト
└── README.md           # このファイル
```
## API統合

フロントエンドはRESTful APIを通じてバックエンドと通信します。
バックエンドが [http://localhost:8080](http://localhost:8080) で動作しているか、
環境変数で /.envの`REACT_APP_API_HOST`を設定してください。

記事取得のためのAPIエンドポイントの例：
```javascript
axios.get(`${process.env.REACT_APP_API_HOST}/articles`);
```
   

