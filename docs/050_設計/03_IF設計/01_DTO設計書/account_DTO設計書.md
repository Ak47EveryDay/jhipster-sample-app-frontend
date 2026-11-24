# account DTO設計書

## 0. 改訂履歴

| 項番 | バージョン | 改訂内容 |
| --- | --- | --- |
| 1 | 1.0 | 新規作成 |

## 1. 概要

| 項目 | 内容 | 根拠 |
| --- | --- | --- |
| ファイル | `src/app/core/auth/account.model.ts` | 同左 |
| モデル化対象 | ログイン中のユーザーのアカウント情報。`AccountService` がシグナルで保持し、全画面で共有する | `src/app/core/auth/account.service.ts`（`userIdentity`、`account`） |
| 対応するバックエンド | DTO `AdminUserDTO`（バックエンドの `src/main/java/io/github/jhipster/sample/service/dto/AdminUserDTO.java`）。REST は `AccountResource.getAccount()`（`GET /api/account`）と `AccountResource.saveAccount()`（`POST /api/account`）（バックエンドの `src/main/java/io/github/jhipster/sample/web/rest/AccountResource.java`） | 同左 |
| エクスポート | 1 つ（`class`） | `src/app/core/auth/account.model.ts` |
| 依存するモデル | なし | 同上 |

## 2. 型定義一覧

| 型名 | 種別 | 用途 | 根拠 |
| --- | --- | --- | --- |
| `Account` | `class`（コンストラクターの引数で各項目を `public` のプロパティーにする） | ログイン中のアカウント。`AccountService` のシグナルの値の型であり、設定画面のフォームの値の型でもある | `src/app/core/auth/account.model.ts`（`Account`） |

## 3. 項目定義

### `Account`

| 項目 | 型 | 必須 | 説明 | 対応するバックエンド (DTO / field) | 根拠 |
| --- | --- | --- | --- | --- | --- |
| `activated` | `boolean` | 必須 | アカウントが有効かどうか | DTO `AdminUserDTO` の `activated`（`boolean`） | `src/app/core/auth/account.model.ts`（`activated`）、バックエンドの `src/main/java/io/github/jhipster/sample/service/dto/AdminUserDTO.java`（`activated`） |
| `authorities` | `string` の配列 | 必須 | 権限名の一覧。`hasAnyAuthority()` が参照する | DTO `AdminUserDTO` の `authorities`（`Set<String>`） | 同上（`authorities`） |
| `email` | `string` | 必須 | メールアドレス | DTO `AdminUserDTO` の `email`（`String`） | 同上（`email`） |
| `firstName` | `string` または `null` | 必須 | 名 | DTO `AdminUserDTO` の `firstName`（`String`） | 同上（`firstName`） |
| `langKey` | `string` | 必須 | 言語。ログイン後に翻訳の言語を切り替えるときに使う | DTO `AdminUserDTO` の `langKey`（`String`） | 同上（`langKey`） |
| `lastName` | `string` または `null` | 必須 | 姓 | DTO `AdminUserDTO` の `lastName`（`String`） | 同上（`lastName`） |
| `login` | `string` | 必須 | ログイン ID。ホームとナビゲーションバーの表示に使う | DTO `AdminUserDTO` の `login`（`String`） | 同上（`login`） |
| `imageUrl` | `string` または `null` | 必須 | アカウントの画像の URL。ナビゲーションバーが表示に使う | DTO `AdminUserDTO` の `imageUrl`（`String`） | 同上（`imageUrl`） |

- 「必須」はプロパティーの省略ができないことである。`firstName`、`lastName`、`imageUrl` は省略できないが `null` を取り得る。
- DTO `AdminUserDTO` にはこのほかに `id`、`createdBy`、`createdDate`、`lastModifiedBy`、`lastModifiedDate` がある。`Account` はこれらを宣言していない（バックエンドの `src/main/java/io/github/jhipster/sample/service/dto/AdminUserDTO.java`）。
- `GET /api/account` は `AdminUserDTO` を返す。`POST /api/account` の要求も `AdminUserDTO` であり、バックエンドの `saveAccount()` は本文のうち `firstName`、`lastName`、`email`、`langKey`、`imageUrl` だけを使う（バックエンドの `src/main/java/io/github/jhipster/sample/web/rest/AccountResource.java`）。
- `AdminUserDTO` はユーザ管理のモデル ([user-management_DTO設計書](user-management_DTO設計書.md) の `IUserManagement`) と同じ DTO である。

## 4. 使用箇所

本体（単体テストを除く）のうち、このモデルを import しているファイルである。`src/app/core/auth/index.ts` が `export * from './account.model'` で再エクスポートするため、`app/core/auth` から import する箇所もある。

| 分類 | ファイル | クラス・関数 | 使っている型 | 用途 |
| --- | --- | --- | --- | --- |
| サービス | `src/app/core/auth/account.service.ts` | `AccountService` | `Account`（直接 import） | シグナル `userIdentity`、読み取り専用シグナル `account`、`accountCache$`、`save()`、`authenticate()`、`identity()`、`fetch()` の型 |
| サービス | `src/app/login/login.service.ts` | `LoginService` | `Account`（`app/core/auth` から） | `login()` の戻り値の Observable の型 |
| 画面 | `src/app/account/settings/settings.ts` | `Settings` | `Account`（`app/core/auth` から） | 定数 `initialAccount`、`settingsForm` の初期値、`save()` で送る値、`accountService.authenticate(account)` |
| バレル | `src/app/core/auth/index.ts` | `export * from './account.model'` | `Account` | 再エクスポート |

モデルを import せずに、`AccountService.account` の値の型として間接に使う箇所は次のとおりである。

| ファイル | クラス | 用途 |
| --- | --- | --- |
| `src/app/home/home.ts` | `Home` | ログイン中のアカウントの `login` の表示 |
| `src/app/layouts/navbar/navbar.ts` | `Navbar` | アカウントのメニューの表示 (`login`、`imageUrl`) |
| `src/app/account/password/password.ts` | `Password` | 見出しに現在のアカウントの `login` を表示する |
| `src/app/entities/admin/user-management/list/user-management.ts` | `UserManagement` | シグナル `currentAccount`。現在のアカウントの `login` と行の `login` を比較してボタンの無効化に使う |
| `src/app/shared/auth/has-any-authority.directive.ts` | `HasAnyAuthorityDirective` | `authorities` による表示の判定 |

使う画面と共通部品は次のとおりである。

- 設定（[設定_画面設計書](../../02_画面設計/200_アカウント/設定/設定_画面設計書.md)）。フォームの値の型として使い、保存後に `accountService.authenticate(account)` でアカウント状態を更新する。
- ログイン（[ログイン_画面設計書](../../02_画面設計/200_アカウント/ログイン/ログイン_画面設計書.md)）。`LoginService.login()` の戻り値の型として使う。
- ホーム（[ホーム_画面設計書](../../02_画面設計/100_TOP画面/ホーム/ホーム_画面設計書.md)）、パスワード変更（[パスワード変更_画面設計書](../../02_画面設計/200_アカウント/パスワード変更/パスワード変更_画面設計書.md)）、ユーザ管理の一覧（[ユーザ管理一覧_画面設計書](../../02_画面設計/400_エンティティ/ユーザ管理/一覧/ユーザ管理一覧_画面設計書.md)）。`AccountService.account` の値を表示や判定に使う。
- 共通部品のナビゲーションバー、アカウント状態と認証、ルートガードと認可。`account` シグナルと `hasAnyAuthority()` を通じて使う。

単体テストでは `src/app/core/auth/account.service.spec.ts`、`src/app/layouts/navbar/navbar.spec.ts`、`src/app/account/settings/settings.spec.ts`、`src/app/shared/auth/has-any-authority.directive.spec.ts` が使う。

関連文書:

- [アプリ_画面設計書](../../02_画面設計/000_アプリ/アプリ/アプリ_画面設計書.md)（6.2）
- [アカウント状態と認証_画面設計書](../../02_画面設計/共通/アカウント状態と認証/アカウント状態と認証_画面設計書.md)
- [user-management_DTO設計書](user-management_DTO設計書.md)
- [アカウント_電文レイアウト](../02_電文レイアウト/アカウント_電文レイアウト.md)

## 5. 変換規則

### 5.1 モデルと JSON の変換

- 変換はない。`AccountService.fetch()` は `this.http.get<Account>(...)` で受け、`save(account)` はモデルをそのまま本文にする。日付の項目がないため、変換メソッドを持たない。
- `Account` のコンストラクターを呼ぶ箇所はない。値は HTTP の応答の JSON と、設定画面の `settingsForm.getRawValue()` からオブジェクトリテラルとして得られる。

### 5.2 設定画面のフォームとの変換（`Settings`）

`Settings`（`src/app/account/settings/settings.ts`）はリアクティブフォームで 8 項目を持つ。テンプレートに置かれているのは `firstName`、`lastName`、`email`、`langKey` の 4 つである（`src/app/account/settings/settings.html`）。

| フォームコントロール | 初期値 | バリデーター | テンプレート | 対応する項目 |
| --- | --- | --- | --- | --- |
| `firstName` | `initialAccount.firstName`（`undefined`。`nonNullable: true`） | `Validators.required`、`Validators.minLength(1)`、`Validators.maxLength(50)` | あり | `firstName` |
| `lastName` | `initialAccount.lastName`（`undefined`。`nonNullable: true`） | `Validators.required`、`Validators.minLength(1)`、`Validators.maxLength(50)` | あり | `lastName` |
| `email` | `initialAccount.email`（`undefined`。`nonNullable: true`） | `Validators.required`、`Validators.minLength(5)`、`Validators.maxLength(254)`、`Validators.email` | あり | `email` |
| `langKey` | `initialAccount.langKey`（`undefined`。`nonNullable: true`） | なし | あり | `langKey` |
| `activated`、`authorities`、`imageUrl`、`login` | `initialAccount` の同名の項目（`undefined`。`nonNullable: true`） | なし | なし | 同名の項目 |

- `initialAccount` は `{} as Account` であり、各初期値は `undefined` である。
- `ngOnInit()` は `accountService.identity()` の結果で `settingsForm.patchValue(account)` を実行する。
- `save()` は `settingsForm.getRawValue()` を `accountService.save(account)` に渡す。成功したら `accountService.authenticate(account)` でアカウント状態をフォームの値で置き換え、`account.langKey` が現在の言語と違えば `translateService.use(account.langKey)` を実行する。
- 項目の変換（文字列化など）はない。フォームの値とモデルの値は同じ形である。
