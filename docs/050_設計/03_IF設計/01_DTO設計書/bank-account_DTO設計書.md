# bank-account DTO設計書

## 0. 改訂履歴

| 項番 | バージョン | 改訂内容 |
| --- | --- | --- |
| 1 | 1.0 | 新規作成 |

## 1. 概要

| 項目 | 内容 | 根拠 |
| --- | --- | --- |
| ファイル | `src/app/entities/bank-account/bank-account.model.ts` | 同左 |
| モデル化対象 | 銀行口座（エンティティ `bank-account`）。一覧・詳細・登録・編集・削除の対象であり、取引の関連先としても使う | `src/app/entities/bank-account/bank-account.routes.ts`、`src/app/entities/operation/operation.model.ts` |
| 対応するバックエンド | エンティティ `BankAccount`（バックエンドの `src/main/java/io/github/jhipster/sample/domain/BankAccount.java`）。REST は `BankAccountResource`（バックエンドの `src/main/java/io/github/jhipster/sample/web/rest/BankAccountResource.java`、`/api/bank-accounts`） | 同左 |
| エクスポート | 2 つ（`interface` 1、`type` 1） | `src/app/entities/bank-account/bank-account.model.ts` |
| 依存するモデル | `IUser`（[user_DTO設計書](user_DTO設計書.md)） | `src/app/entities/bank-account/bank-account.model.ts`（`import { IUser }`） |

## 2. 型定義一覧

| 型名 | 種別 | 用途 | 根拠 |
| --- | --- | --- | --- |
| `IBankAccount` | `interface` | 銀行口座 1 件。取得・更新・削除の対象と、一覧の要素 | `src/app/entities/bank-account/bank-account.model.ts`（`IBankAccount`） |
| `NewBankAccount` | `type` | 登録に使う型。`IBankAccount` から `id` を除いた型に `{ id: null }` を交差させたもの | 同上（`NewBankAccount`） |

## 3. 項目定義

### `IBankAccount`

| 項目 | 型 | 必須 | 説明 | 対応するバックエンド (DTO / field) | 根拠 |
| --- | --- | --- | --- | --- | --- |
| `id` | `number` | 必須 | 主キー。`getBankAccountIdentifier()` の戻り値であり、URL の `{id}` に使う | エンティティ `BankAccount` の `id`（`Long`） | `src/app/entities/bank-account/bank-account.model.ts`（`IBankAccount.id`）、バックエンドの `src/main/java/io/github/jhipster/sample/domain/BankAccount.java`（`id`） |
| `name` | `string` または `null` | 任意 | 口座名 | エンティティ `BankAccount` の `name`（`String`） | 同上（`name`） |
| `balance` | `number` または `null` | 任意 | 残高 | エンティティ `BankAccount` の `balance`（`BigDecimal`） | 同上（`balance`） |
| `user` | `Pick` による `IUser` の部分型（`id`、`login`）または `null` | 任意 | 紐づくユーザー。`id` と `login` だけを持つ | エンティティ `BankAccount` の `user`（`User`） | 同上（`user`）、`src/app/entities/user/user.model.ts`（`IUser`） |

- 「任意」は、プロパティーを省略できること（`?`）と、`null` を取り得ることを表す。
- バックエンドは DTO を使わず、エンティティの `BankAccount` をそのまま JSON で返す。エンティティにはこのほかに `operations`（`Set<Operation>`）があるが、`IBankAccount` は宣言していない。
- バックエンドの `user` の型はエンティティの `User` である。フロントエンドはそのうち `id` と `login` だけを型として宣言している。`User` のどの項目が JSON に出るかは Jackson の設定によるため、コードからは確認できない。
- バックエンドの `name` と `balance` には `@NotNull` がある（バックエンドの `src/main/java/io/github/jhipster/sample/domain/BankAccount.java`）。

### `NewBankAccount`

| 項目 | 型 | 必須 | 説明 | 対応するバックエンド (DTO / field) | 根拠 |
| --- | --- | --- | --- | --- | --- |
| `id` | `null` | 必須 | 固定で `null`。登録画面はこの値で登録か更新かを判別する | `BankAccountResource.createBankAccount()` は `id` が `null` でないとき 400 と `idexists` を返す | `src/app/entities/bank-account/bank-account.model.ts`（`NewBankAccount`）、バックエンドの `src/main/java/io/github/jhipster/sample/web/rest/BankAccountResource.java`（`createBankAccount()`） |
| `name` | `string` または `null` | 任意 | `IBankAccount` に同じ | `IBankAccount` に同じ | 同上 |
| `balance` | `number` または `null` | 任意 | `IBankAccount` に同じ | `IBankAccount` に同じ | 同上 |
| `user` | `Pick` による `IUser` の部分型（`id`、`login`）または `null` | 任意 | `IBankAccount` に同じ | `IBankAccount` に同じ | 同上 |

## 4. 使用箇所

本体（単体テストを除く）のうち、このモデルを import しているファイルである。

| 分類 | ファイル | クラス・関数 | 使っている型 | 用途 |
| --- | --- | --- | --- | --- |
| サービス | `src/app/entities/bank-account/service/bank-account.service.ts` | `BankAccountsService` | `IBankAccount` | `bankAccountsResource`（`httpResource`）と `bankAccounts`（`computed`）の型 |
| サービス | 同上 | `BankAccountService` | `IBankAccount`、`NewBankAccount` | `create()` の引数、`update()`、`partialUpdate()`、`find()`、`query()` の戻り値、`PartialUpdateBankAccount` の型、`getBankAccountIdentifier()`、`compareBankAccount()`、`addBankAccountToCollectionIfMissing()` の引数 |
| リゾルバー | `src/app/entities/bank-account/route/bank-account-routing-resolve.service.ts` | `bankAccountResolve` | `IBankAccount` | 戻り値の Observable の型 |
| 画面 | `src/app/entities/bank-account/list/bank-account.ts` | `BankAccount` | `IBankAccount` | シグナル `bankAccounts`、`trackId()`、`delete()`、`refineData()` |
| 画面 | `src/app/entities/bank-account/detail/bank-account-detail.ts` | `BankAccountDetail` | `IBankAccount` | `input` の `bankAccount` |
| 画面 | `src/app/entities/bank-account/update/bank-account-update.ts` | `BankAccountUpdate` | `IBankAccount` | フィールド `bankAccount`、`updateForm()`、`subscribeToSaveResponse()` |
| 画面 | `src/app/entities/bank-account/delete/bank-account-delete-dialog.ts` | `BankAccountDeleteDialog` | `IBankAccount` | フィールド `bankAccount` |
| フォームサービス | `src/app/entities/bank-account/update/bank-account-form.service.ts` | `BankAccountFormService` | `IBankAccount`、`NewBankAccount` | `createBankAccountFormGroup()` と `resetForm()` の引数、`getBankAccount()` の戻り値、`BankAccountFormGroup` の型 |
| モデル | `src/app/entities/operation/operation.model.ts` | `IOperation` | `IBankAccount` | 項目 `bankAccount` の型 |
| 画面 | `src/app/entities/operation/update/operation-update.ts` | `OperationUpdate` | `IBankAccount` | シグナル `bankAccountsSharedCollection`、`compareBankAccount()` |

使う画面と共通部品は次のとおりである。

- 銀行口座の一覧（[銀行口座一覧_画面設計書](../../02_画面設計/400_エンティティ/銀行口座/一覧/銀行口座一覧_画面設計書.md)）、詳細（[銀行口座詳細_画面設計書](../../02_画面設計/400_エンティティ/銀行口座/詳細/銀行口座詳細_画面設計書.md)）、登録・編集（[銀行口座登録・編集_画面設計書](../../02_画面設計/400_エンティティ/銀行口座/登録・編集/銀行口座登録・編集_画面設計書.md)）、削除（[銀行口座削除_画面設計書](../../02_画面設計/400_エンティティ/銀行口座/削除/銀行口座削除_画面設計書.md)。削除は一覧上のダイアログである）。
- 取引の一覧（[取引一覧_画面設計書](../../02_画面設計/400_エンティティ/取引/一覧/取引一覧_画面設計書.md)）、詳細（[取引詳細_画面設計書](../../02_画面設計/400_エンティティ/取引/詳細/取引詳細_画面設計書.md)）。取引の項目 `bankAccount` の型として使う。
- 取引の登録・編集（[取引登録・編集_画面設計書](../../02_画面設計/400_エンティティ/取引/登録・編集/取引登録・編集_画面設計書.md)）。銀行口座の選択肢の型として使う。
- このモデルを画面のテンプレートで直接 import する箇所はない（テンプレートはコンポーネントのフィールドを通じて値を読む）。

単体テストでは `src/app/entities/bank-account/bank-account.test-samples.ts` がサンプルデータの型として使う。

関連文書:

- [アプリ_画面設計書](../../02_画面設計/000_アプリ/アプリ/アプリ_画面設計書.md)（6.3、6.4、10 章）
- [user_DTO設計書](user_DTO設計書.md)
- [銀行口座_電文レイアウト](../02_電文レイアウト/銀行口座_電文レイアウト.md)

## 5. 変換規則

### 5.1 モデルとフォームの変換（`BankAccountFormService`）

`BankAccountFormService`（`src/app/entities/bank-account/update/bank-account-form.service.ts`）が `FormGroup` とモデルを相互に変換する。

| フォームコントロール | 初期値（`getFormDefaults()`） | バリデーター | 対応する項目 |
| --- | --- | --- | --- |
| `id` | `null`（`disabled: true`、`nonNullable: true`） | `Validators.required` | `id` |
| `name` | なし（`undefined`） | `Validators.required` | `name` |
| `balance` | なし（`undefined`） | `Validators.required` | `balance` |
| `user` | なし（`undefined`） | なし | `user` |

- `createBankAccountFormGroup(bankAccount?)`: 既定値 (`{ id: null }`) に引数のモデルを重ねて（引数がなければ `{ id: null }`）、各コントロールを作る。引数の型は `IBankAccount` または `PartialWithRequiredKeyOf<NewBankAccount>`（`id` だけを必須にした部分型）である。`PartialWithRequiredKeyOf`、`BankAccountFormGroupInput`、`BankAccountFormDefaults`、`BankAccountFormGroupContent` はファイルの外に出ない型である。
- `getBankAccount(form)`: `form.getRawValue()` の結果を `IBankAccount` または `NewBankAccount` として返す。`getRawValue()` なので、無効化している `id` の値も含まれる。
- `resetForm(form, bankAccount)`: 既定値に引数を重ね、`id` を無効化したまま `form.reset()` する。
- 項目の変換（日付の文字列化など）はない。モデルの値とフォームの値は同じ形である。

### 5.2 登録と更新の判別（`BankAccountUpdate.save()`）

- `getBankAccount(this.editForm)` の結果の `id` が `null` なら `bankAccountService.create(bankAccount)`（`POST api/bank-accounts`）、`null` 以外なら `bankAccountService.update(bankAccount)`（`PUT api/bank-accounts/{id}`）を呼ぶ。

### 5.3 サービスでの扱い（`BankAccountService`）

- モデルと JSON の変換はない。日付の項目がないため、変換メソッドを持たない。
- 単票の URL は `${this.resourceUrl}/${encodeURIComponent(this.getBankAccountIdentifier(bankAccount))}` の形である。
- `partialUpdate()`（`PATCH api/bank-accounts/{id}`）を本体から呼ぶ箇所はない。
- 一覧画面はクエリパラメーター `eagerload` を `true` で送る。バックエンドの `getAllBankAccounts(eagerload)` は、`true` のとき `bankAccountRepository.findAllWithEagerRelationships()` を呼ぶ（バックエンドの `src/main/java/io/github/jhipster/sample/web/rest/BankAccountResource.java`）。
