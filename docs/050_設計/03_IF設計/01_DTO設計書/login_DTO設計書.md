# login DTO設計書

## 0. 改訂履歴

| 項番 | バージョン | 改訂内容 |
| --- | --- | --- |
| 1 | 1.0 | 新規作成 |

## 1. 概要

| 項目 | 内容 | 根拠 |
| --- | --- | --- |
| ファイル | `src/app/core/auth/login.model.ts` | 同左 |
| モデル化対象 | ログインの要求（ユーザー名、パスワード、ログイン状態の保持）。ログイン画面のフォームの値の型であり、認証 API の要求本文になる | `src/app/login/login.ts`（`loginForm`）、`src/app/login/login.service.ts`（`login(credentials)`） |
| 対応するバックエンド | VM `LoginVM`（バックエンドの `src/main/java/io/github/jhipster/sample/web/rest/vm/LoginVM.java`）。REST は `AuthenticateController.authorize()`（バックエンドの `src/main/java/io/github/jhipster/sample/web/rest/AuthenticateController.java`、`POST /api/authenticate`） | 同左 |
| エクスポート | 1 つ（`class`） | `src/app/core/auth/login.model.ts` |
| 依存するモデル | なし | 同上 |

## 2. 型定義一覧

| 型名 | 種別 | 用途 | 根拠 |
| --- | --- | --- | --- |
| `Login` | `class`（コンストラクターの引数で各項目を `public` のプロパティーにする） | ログインの要求。`LoginService.login()` と `AuthServerProvider.login()` の引数の型 | `src/app/core/auth/login.model.ts`（`Login`） |

同名のクラスに注意する。ログイン画面のコンポーネントも `Login` である（`src/app/login/login.ts`、既定のエクスポート）。本書で扱うのはモデルの `Login`（`src/app/core/auth/login.model.ts`）である。

## 3. 項目定義

### `Login`

| 項目 | 型 | 必須 | 説明 | 対応するバックエンド (DTO / field) | 根拠 |
| --- | --- | --- | --- | --- | --- |
| `username` | `string` | 必須 | ユーザー名（ログイン ID） | VM `LoginVM` の `username`（`String`。`@NotNull`、`@Size(min = 1, max = 254)`） | `src/app/core/auth/login.model.ts`（`username`）、バックエンドの `src/main/java/io/github/jhipster/sample/web/rest/vm/LoginVM.java`（`username`） |
| `password` | `string` | 必須 | パスワード | VM `LoginVM` の `password`（`String`。`@NotNull`、`@Size(min = 4, max = 100)`） | 同上（`password`） |
| `rememberMe` | `boolean` | 必須 | ログイン状態を保持するか。トークンの保存先（`localStorage` か `sessionStorage`）と、バックエンドのトークンの有効期間の選択に使う | VM `LoginVM` の `rememberMe`（`boolean`） | 同上（`rememberMe`） |

- 「必須」はプロパティーの省略ができないことである。
- バックエンドの `authorize()` は、`rememberMe` が `true` のとき `tokenValidityInSecondsForRememberMe`、`false` のとき `tokenValidityInSeconds` でトークンの有効期限を計算する（バックエンドの `src/main/java/io/github/jhipster/sample/web/rest/AuthenticateController.java` の `createToken()`）。
- 応答はフロントエンドのモデルにはない。バックエンドは `Authorization` ヘッダーに Bearer トークンを付け、本文に `JWTToken`（`id_token`）を返す。フロントエンドは `src/app/core/auth/auth-jwt.service.ts` のファイル内の型 `JwtToken`（`{ id_token: string }`、export なし）として受け取る。

## 4. 使用箇所

本体（単体テストを除く）のうち、このモデルを import しているファイルである。`src/app/core/auth/index.ts` が `export * from './login.model'` で再エクスポートする。

| 分類 | ファイル | クラス・関数 | 使っている型 | 用途 |
| --- | --- | --- | --- | --- |
| サービス | `src/app/core/auth/auth-jwt.service.ts` | `AuthServerProvider` | `Login`（直接 import） | `login(credentials)` の引数の型 |
| サービス | `src/app/login/login.service.ts` | `LoginService` | `Login`（`app/core/auth` から） | `login(credentials)` の引数の型 |
| バレル | `src/app/core/auth/index.ts` | `export * from './login.model'` | `Login` | 再エクスポート |

ログイン画面のコンポーネント `Login`（`src/app/login/login.ts`）はこのモデルを import しない。`loginForm.getRawValue()` の結果（`username`、`password`、`rememberMe`）をそのまま `loginService.login()` に渡し、形が一致することで引数の型を満たす。

使う画面と共通部品は次のとおりである。

- ログイン（[ログイン_画面設計書](../../02_画面設計/200_アカウント/ログイン/ログイン_画面設計書.md)）。フォームの値の型として使う。
- 共通部品のアカウント状態と認証（[アカウント状態と認証_画面設計書](../../02_画面設計/共通/アカウント状態と認証/アカウント状態と認証_画面設計書.md)）。`LoginService.login()` と `AuthServerProvider.login()` の引数の型として使う。

関連文書:

- [アプリ_画面設計書](../../02_画面設計/000_アプリ/アプリ/アプリ_画面設計書.md)（6.2、7.2）
- [認証_電文レイアウト](../02_電文レイアウト/認証_電文レイアウト.md)

## 5. 変換規則

### 5.1 ログイン画面のフォームとの対応（`Login` コンポーネント）

`loginForm`（`src/app/login/login.ts`）は 3 つのコントロールを持つ。いずれも `nonNullable: true` で、`Validators.required` が付く。

| フォームコントロール | 初期値 | バリデーター | 対応する項目 |
| --- | --- | --- | --- |
| `username` | `''` | `Validators.required` | `username` |
| `password` | `''` | `Validators.required` | `password` |
| `rememberMe` | `false` | `Validators.required` | `rememberMe` |

- `Login.login()` は `this.loginForm.getRawValue()` を `loginService.login()` に渡す。項目の変換はない。モデルの `Login` のコンストラクターを呼ぶ箇所はなく、引数の値はフォームからオブジェクトリテラルとして得られる。
- `LoginService.login()` は `authServerProvider.login(credentials)` を呼ぶ。`AuthServerProvider.login()` は `credentials` をそのまま `POST api/authenticate` の本文にする（`this.http.post<JwtToken>(..., credentials)`）。

### 5.2 応答の扱い（`AuthServerProvider`）

- 応答の `id_token` を `authenticateSuccess(response, credentials.rememberMe)` に渡す。
- `authenticateSuccess()` は `stateStorageService.storeAuthenticationToken(response.id_token, rememberMe)` でトークンを保存する。`rememberMe` が `true` なら `localStorage`、`false` なら `sessionStorage` である（`src/app/core/auth/state-storage.service.ts`）。
- 保存するトークンは `JSON.stringify()` した文字列であり、読むときは `JSON.parse()` する。
