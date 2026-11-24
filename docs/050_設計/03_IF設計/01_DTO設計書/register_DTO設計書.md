# register DTO設計書

## 0. 改訂履歴

| 項番 | バージョン | 改訂内容 |
| --- | --- | --- |
| 1 | 1.0 | 新規作成 |

## 1. 概要

| 項目 | 内容 | 根拠 |
| --- | --- | --- |
| ファイル | `src/app/account/register/register.model.ts` | 同左 |
| モデル化対象 | アカウント登録の要求（ログイン ID、メールアドレス、パスワード、言語） | `src/app/account/register/register.service.ts`（`save(registration)`） |
| 対応するバックエンド | VM `ManagedUserVM`（バックエンドの `src/main/java/io/github/jhipster/sample/web/rest/vm/ManagedUserVM.java`。DTO `AdminUserDTO` を継承し `password` を加えたクラス）。REST は `AccountResource.registerAccount()`（バックエンドの `src/main/java/io/github/jhipster/sample/web/rest/AccountResource.java`、`POST /api/register`） | 同左 |
| エクスポート | 1 つ（`class`） | `src/app/account/register/register.model.ts` |
| 依存するモデル | なし | 同上 |

## 2. 型定義一覧

| 型名 | 種別 | 用途 | 根拠 |
| --- | --- | --- | --- |
| `Registration` | `class`（コンストラクターの引数で各項目を `public` のプロパティーにする） | アカウント登録の要求。`RegisterService.save()` の引数の型 | `src/app/account/register/register.model.ts`（`Registration`） |

## 3. 項目定義

### `Registration`

| 項目 | 型 | 必須 | 説明 | 対応するバックエンド (DTO / field) | 根拠 |
| --- | --- | --- | --- | --- | --- |
| `login` | `string` | 必須 | ログイン ID | VM `ManagedUserVM` が継承する DTO `AdminUserDTO` の `login`（`String`。`@NotBlank`、`@Pattern`、`@Size(min = 1, max = 50)`） | `src/app/account/register/register.model.ts`（`login`）、バックエンドの `src/main/java/io/github/jhipster/sample/service/dto/AdminUserDTO.java`（`login`） |
| `email` | `string` | 必須 | メールアドレス。アクティベーションのメールの宛先になる | DTO `AdminUserDTO` の `email`（`String`。`@Email`、`@Size(min = 5, max = 254)`） | 同上（`email`） |
| `password` | `string` | 必須 | パスワード | VM `ManagedUserVM` の `password`（`String`。`@Size(min = 4, max = 100)`） | `src/app/account/register/register.model.ts`（`password`）、バックエンドの `src/main/java/io/github/jhipster/sample/web/rest/vm/ManagedUserVM.java`（`password`） |
| `langKey` | `string` | 必須 | 言語。登録画面は現在の表示言語を入れる | DTO `AdminUserDTO` の `langKey`（`String`。`@Size(min = 2, max = 10)`） | 同上（`langKey`）、バックエンドの `src/main/java/io/github/jhipster/sample/service/dto/AdminUserDTO.java`（`langKey`） |

- 「必須」はプロパティーの省略ができないことである。
- `Registration` は `ManagedUserVM` の一部である。`ManagedUserVM` のほかの項目（`id`、`firstName`、`lastName`、`imageUrl`、`activated`、`createdBy` など）はフロントエンドから送らない。バックエンドの `UserService.registerUser()` は、登録するユーザーを無効 (`activated` は `false`) にし、アクティベーションのキーを生成し、権限 `AuthoritiesConstants.USER` を付ける（バックエンドの `src/main/java/io/github/jhipster/sample/service/UserService.java`）。
- `POST /api/register` は成功すると 201 を返し、本文はない。バックエンドはアクティベーションのメールを送る（バックエンドの `src/main/java/io/github/jhipster/sample/web/rest/AccountResource.java` の `registerAccount()`）。
- パスワードの長さが 4 文字未満または 100 文字を超えるとき、バックエンドは `InvalidPasswordException`（400）を返す。フロントエンドの登録画面はこの応答を個別に判別せず、汎用のエラー表示にする。

## 4. 使用箇所

本体（単体テストを除く）のうち、このモデルを import しているファイルである。

| 分類 | ファイル | クラス・関数 | 使っている型 | 用途 |
| --- | --- | --- | --- | --- |
| サービス | `src/app/account/register/register.service.ts` | `RegisterService` | `Registration` | `save(registration)` の引数の型 |

登録画面のコンポーネント `Register`（`src/app/account/register/register.ts`）はこのモデルを import しない。`{ login, email, password, langKey }` のオブジェクトリテラルを `registerService.save()` に渡し、形が一致することで引数の型を満たす。

使う画面と共通部品は次のとおりである。

- 登録（[登録_画面設計書](../../02_画面設計/200_アカウント/登録/登録_画面設計書.md)）。`RegisterService.save()` の引数の型として使う。
- このモデルを画面のテンプレートで使う箇所はない。

単体テストでは `src/app/account/register/register.service.spec.ts` が `new Registration(login, email, password, langKey)` として使う。

関連文書:

- [アプリ_画面設計書](../../02_画面設計/000_アプリ/アプリ/アプリ_画面設計書.md)（7.5）
- [アカウント_電文レイアウト](../02_電文レイアウト/アカウント_電文レイアウト.md)

## 5. 変換規則

### 5.1 登録画面のフォームとの対応（`Register` コンポーネント）

`registerForm`（`src/app/account/register/register.ts`）は 4 つのコントロールを持つ。いずれも `nonNullable: true` で、初期値は `''` である。

| フォームコントロール | バリデーター | 送信する項目 |
| --- | --- | --- |
| `login` | `Validators.required`、`Validators.minLength(1)`、`Validators.maxLength(50)`、`Validators.pattern(...)` | `login` |
| `email` | `Validators.required`、`Validators.minLength(5)`、`Validators.maxLength(254)`、`Validators.email` | `email` |
| `password` | `Validators.required`、`Validators.minLength(4)`、`Validators.maxLength(50)` | `password` |
| `confirmPassword` | `Validators.required`、`Validators.minLength(4)`、`Validators.maxLength(50)` | 送信しない |

- `Register.register()` は、`password` と `confirmPassword` が一致しなければシグナル `doNotMatch` を `true` にして送信しない。
- 一致していれば `{ login, email, password, langKey: this.translateService.getCurrentLang() ?? 'en' }` を `registerService.save()` に渡す。`langKey` はフォームに入力がなく、現在の表示言語で決まる。
- `RegisterService.save()` はモデルをそのまま `POST api/register` の本文にする。項目の変換はない。

### 5.2 エラー応答の判別（`Register.processError()`）

| 条件 | シグナル | バックエンド側の発生箇所 |
| --- | --- | --- |
| ステータス 400 で、本文の `type` が `LOGIN_ALREADY_USED_TYPE` | `errorUserExists` が `true` | ログイン ID が既に使われている。バックエンドの `src/main/java/io/github/jhipster/sample/web/rest/errors/LoginAlreadyUsedException.java` |
| ステータス 400 で、本文の `type` が `EMAIL_ALREADY_USED_TYPE` | `errorEmailExists` が `true` | メールアドレスが既に使われている。バックエンドの `src/main/java/io/github/jhipster/sample/web/rest/errors/EmailAlreadyUsedException.java` |
| 上記以外 | `error` が `true` | ― |

- `LOGIN_ALREADY_USED_TYPE`、`EMAIL_ALREADY_USED_TYPE` は `src/app/shared/jhipster/error.constants.ts` の定数であり、`PROBLEM_BASE_URL`（`'https://www.jhipster.tech/problem'`）に `/login-already-used`、`/email-already-used` を付けた文字列である。
- バックエンドの対応する定数はバックエンドの `src/main/java/io/github/jhipster/sample/web/rest/errors/ErrorConstants.java` にある。エラー応答の本文の形は [problem-details_DTO設計書](problem-details_DTO設計書.md) に書く。
