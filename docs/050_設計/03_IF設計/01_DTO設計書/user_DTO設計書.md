# user DTO設計書

## 0. 改訂履歴

| 項番 | バージョン | 改訂内容 |
| --- | --- | --- |
| 1 | 1.0 | 新規作成 |

## 1. 概要

| 項目 | 内容 | 根拠 |
| --- | --- | --- |
| ファイル | `src/app/entities/user/user.model.ts` | 同左 |
| モデル化対象 | ユーザーのうち公開してよい 2 項目（`id`、`login`）。`src/app/entities/user/` はモデルとサービスだけを持ち、画面を持たない。銀行口座の関連先として使う | `src/app/entities/user/user.model.ts`、`src/app/entities/bank-account/bank-account.model.ts` |
| 対応するバックエンド | DTO `UserDTO`（バックエンドの `src/main/java/io/github/jhipster/sample/service/dto/UserDTO.java`）。REST は `PublicUserResource.getAllPublicUsers()`（バックエンドの `src/main/java/io/github/jhipster/sample/web/rest/PublicUserResource.java`、`GET /api/users`） | 同左 |
| エクスポート | 1 つ（`interface`） | `src/app/entities/user/user.model.ts` |
| 依存するモデル | なし | 同上 |

## 2. 型定義一覧

| 型名 | 種別 | 用途 | 根拠 |
| --- | --- | --- | --- |
| `IUser` | `interface` | ユーザー 1 件。銀行口座の登録・編集画面の選択肢と、銀行口座の項目 `user` の型の元 | `src/app/entities/user/user.model.ts`（`IUser`） |

## 3. 項目定義

### `IUser`

| 項目 | 型 | 必須 | 説明 | 対応するバックエンド (DTO / field) | 根拠 |
| --- | --- | --- | --- | --- | --- |
| `id` | `number` | 必須 | ユーザーの ID。`getUserIdentifier()` の戻り値であり、選択肢の比較 (`compareUser()`) に使う | DTO `UserDTO` の `id`（`Long`） | `src/app/entities/user/user.model.ts`（`IUser.id`）、バックエンドの `src/main/java/io/github/jhipster/sample/service/dto/UserDTO.java`（`id`） |
| `login` | `string` または `null` | 任意 | ログイン ID。銀行口座の登録・編集画面の選択肢の文言に使う | DTO `UserDTO` の `login`（`String`） | 同上（`login`） |

- 「任意」は、プロパティーを省略できること（`?`）と、`null` を取り得ることを表す。
- DTO `UserDTO` は `id` と `login` の 2 項目だけのクラスであり、管理者向けの `UserResource` では使わない（バックエンドの `src/main/java/io/github/jhipster/sample/service/dto/UserDTO.java`）。
- `GET /api/users` は `Pageable` を受け取って 1 ページ分を返す。並び順に `ALLOWED_ORDERED_PROPERTIES` (`id`、`login`、`firstName`、`lastName`、`email`、`activated`、`langKey`) 以外のプロパティーを指定すると 400 を返す（バックエンドの `src/main/java/io/github/jhipster/sample/web/rest/PublicUserResource.java`）。
- `/api/users` は管理者権限を要求せず、認証だけを要求する（バックエンドの `src/main/java/io/github/jhipster/sample/config/SecurityConfiguration.java` の `/api/**`）。
- 銀行口座の項目 `user` はこのモデルの部分型 `Pick<IUser, …>`（`id`、`login`）である。対応するバックエンド側はエンティティ `BankAccount` の `user`（エンティティ `User`）であり、`UserDTO` ではない（[bank-account_DTO設計書](bank-account_DTO設計書.md)）。

## 4. 使用箇所

本体（単体テストを除く）のうち、このモデルを import しているファイルである。

| 分類 | ファイル | クラス・関数 | 使っている型 | 用途 |
| --- | --- | --- | --- | --- |
| サービス | `src/app/entities/user/service/user.service.ts` | `UsersService` | `IUser` | `usersResource`（`httpResource`）と `users`（`computed`）の型。本体から参照していない |
| サービス | 同上 | `UserService` | `IUser` | `find()`、`query()` の戻り値、`getUserIdentifier()`、`compareUser()`、`addUserToCollectionIfMissing()` の引数 |
| 画面 | `src/app/entities/bank-account/update/bank-account-update.ts` | `BankAccountUpdate` | `IUser` | シグナル `usersSharedCollection`、`compareUser()`、`updateForm()`、`loadRelationshipsOptions()` |
| モデル | `src/app/entities/bank-account/bank-account.model.ts` | `IBankAccount` | `IUser` | 項目 `user` の型の元 |

使う画面と共通部品は次のとおりである。

- 銀行口座の登録・編集（[銀行口座登録・編集_画面設計書](../../02_画面設計/400_エンティティ/銀行口座/登録・編集/銀行口座登録・編集_画面設計書.md)）。`loadRelationshipsOptions()` が `userService.query()` で `GET api/users` を呼び、ユーザーの選択肢をシグナル `usersSharedCollection` に入れる。
- 銀行口座の一覧（[銀行口座一覧_画面設計書](../../02_画面設計/400_エンティティ/銀行口座/一覧/銀行口座一覧_画面設計書.md)）、詳細（[銀行口座詳細_画面設計書](../../02_画面設計/400_エンティティ/銀行口座/詳細/銀行口座詳細_画面設計書.md)）。銀行口座の項目 `user` の `login` を表示する（型は `IBankAccount.user` を通じて使う）。
- このモデルを画面のテンプレートで直接 import する箇所はない。

単体テストでは `src/app/entities/user/user.test-samples.ts` がサンプルデータの型として使う。

関連文書:

- [アプリ_画面設計書](../../02_画面設計/000_アプリ/アプリ/アプリ_画面設計書.md)（3.4、6.4、7.5）
- [bank-account_DTO設計書](bank-account_DTO設計書.md)
- [電文レイアウト（索引）](../02_電文レイアウト/README.md)

## 5. 変換規則

- モデルと JSON の変換はない。`UserService` は日付の項目を持たないため、変換メソッドを持たない。
- フォームサービスはない。銀行口座の登録・編集画面は、選択肢の同一性を `[compareWith]="compareUser"` で `compareUser()`（`id` の比較）により判定する（`src/app/entities/bank-account/update/bank-account-update.html`、`src/app/entities/bank-account/update/bank-account-update.ts`）。
- `addUserToCollectionIfMissing()` は、選択肢の一覧に現在の値が含まれていなければそれを先頭に補める。銀行口座の登録・編集画面の `updateForm()` と `loadRelationshipsOptions()` が使う。
- `query(req?)` の呼び出しは引数なしである。ページ番号と件数を指定しないため、1 回で得られる件数はバックエンドの `Pageable` の既定値による（コードからは確認できない）。
- 単票の URL は `${this.resourceUrl}/${encodeURIComponent(id)}` の形である。`find()` を本体から呼ぶ箇所はない。
