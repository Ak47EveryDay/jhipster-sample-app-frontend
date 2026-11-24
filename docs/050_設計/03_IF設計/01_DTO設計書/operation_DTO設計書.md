# operation DTO設計書

## 0. 改訂履歴

| 項番 | バージョン | 改訂内容 |
| --- | --- | --- |
| 1 | 1.0 | 新規作成 |

## 1. 概要

| 項目 | 内容 | 根拠 |
| --- | --- | --- |
| ファイル | `src/app/entities/operation/operation.model.ts` | 同左 |
| モデル化対象 | 取引（エンティティ `operation`）。1 つの銀行口座と、複数のラベルに関連する。一覧・詳細・登録・編集・削除の対象であり、ラベルの関連先としても使う | `src/app/entities/operation/operation.routes.ts`、`src/app/entities/label/label.model.ts` |
| 対応するバックエンド | エンティティ `Operation`（バックエンドの `src/main/java/io/github/jhipster/sample/domain/Operation.java`）。REST は `OperationResource`（バックエンドの `src/main/java/io/github/jhipster/sample/web/rest/OperationResource.java`、`/api/operations`） | 同左 |
| エクスポート | 2 つ（`interface` 1、`type` 1） | `src/app/entities/operation/operation.model.ts` |
| 依存するモデル | `IBankAccount`（[bank-account_DTO設計書](bank-account_DTO設計書.md)）、`ILabel`（[label_DTO設計書](label_DTO設計書.md)） | `src/app/entities/operation/operation.model.ts`（`import { IBankAccount }`、`import { ILabel }`） |
| 日付の扱い | 日時の項目 `date` がある。REST では文字列、モデルでは dayjs のオブジェクトで持つ（5 章） | `src/app/entities/operation/operation.model.ts`、`src/app/entities/operation/service/operation.service.ts` |

## 2. 型定義一覧

| 型名 | 種別 | 用途 | 根拠 |
| --- | --- | --- | --- |
| `IOperation` | `interface` | 取引 1 件。取得・更新・削除の対象と、一覧の要素 | `src/app/entities/operation/operation.model.ts`（`IOperation`） |
| `NewOperation` | `type` | 登録に使う型。`IOperation` から `id` を除いた型に `{ id: null }` を交差させたもの | 同上（`NewOperation`） |

## 3. 項目定義

### `IOperation`

| 項目 | 型 | 必須 | 説明 | 対応するバックエンド (DTO / field) | 根拠 |
| --- | --- | --- | --- | --- | --- |
| `id` | `number` | 必須 | 主キー。`getOperationIdentifier()` の戻り値であり、URL の `{id}` に使う | エンティティ `Operation` の `id`（`Long`） | `src/app/entities/operation/operation.model.ts`（`IOperation.id`）、バックエンドの `src/main/java/io/github/jhipster/sample/domain/Operation.java`（`id`） |
| `date` | `dayjs.Dayjs` または `null` | 任意 | 取引日時 | エンティティ `Operation` の `date`（`Instant`。`@NotNull`） | 同上（`date`） |
| `description` | `string` または `null` | 任意 | 説明 | エンティティ `Operation` の `description`（`String`） | 同上（`description`） |
| `amount` | `number` または `null` | 任意 | 金額 | エンティティ `Operation` の `amount`（`BigDecimal`。`@NotNull`） | 同上（`amount`） |
| `bankAccount` | `IBankAccount` または `null` | 任意 | 取引の銀行口座（多対 1） | エンティティ `Operation` の `bankAccount`（`BankAccount`。`@ManyToOne`） | 同上（`bankAccount`）、`src/app/entities/bank-account/bank-account.model.ts` |
| `labels` | `ILabel` の配列または `null` | 任意 | 取引に付いたラベル（多対多） | エンティティ `Operation` の `labels`（`Set<Label>`。`@ManyToMany`。中間テーブル `rel_operation__label`） | 同上（`labels`）、`src/app/entities/label/label.model.ts` |

- 「任意」は、プロパティーを省略できること（`?`）と、`null` を取り得ることを表す。
- バックエンドは DTO を使わず、エンティティの `Operation` をそのまま JSON で返す。
- バックエンドのエンティティでは、`bankAccount` に `@JsonIgnoreProperties(value = { "user", "operations" }, allowSetters = true)`、`labels` に `@JsonIgnoreProperties(value = { "operations" }, allowSetters = true)` がある（バックエンドの `src/main/java/io/github/jhipster/sample/domain/Operation.java`）。
- バックエンドの `date` は `Instant` である。JSON での表現は Jackson の既定に依存し、バックエンドの設定ファイルに日時の書式の指定はないため、コードからは確認できない。

### `NewOperation`

| 項目 | 型 | 必須 | 説明 | 対応するバックエンド (DTO / field) | 根拠 |
| --- | --- | --- | --- | --- | --- |
| `id` | `null` | 必須 | 固定で `null`。登録画面はこの値で登録か更新かを判別する | `OperationResource.createOperation()` は `id` が `null` でないとき 400 と `idexists` を返す | `src/app/entities/operation/operation.model.ts`（`NewOperation`）、バックエンドの `src/main/java/io/github/jhipster/sample/web/rest/OperationResource.java`（`createOperation()`） |
| `date` | `dayjs.Dayjs` または `null` | 任意 | `IOperation` に同じ | `IOperation` に同じ | 同上 |
| `description` | `string` または `null` | 任意 | `IOperation` に同じ | `IOperation` に同じ | 同上 |
| `amount` | `number` または `null` | 任意 | `IOperation` に同じ | `IOperation` に同じ | 同上 |
| `bankAccount` | `IBankAccount` または `null` | 任意 | `IOperation` に同じ | `IOperation` に同じ | 同上 |
| `labels` | `ILabel` の配列または `null` | 任意 | `IOperation` に同じ | `IOperation` に同じ | 同上 |

## 4. 使用箇所

本体（単体テストを除く）のうち、このモデルを import しているファイルである。

| 分類 | ファイル | クラス・関数 | 使っている型 | 用途 |
| --- | --- | --- | --- | --- |
| サービス | `src/app/entities/operation/service/operation.service.ts` | `OperationsService` | `IOperation`、`NewOperation`（`RestOperation` の元になる型） | `operationsResource`（`httpResource`）と `operations`（`computed`）の型、変換メソッド |
| サービス | 同上 | `OperationService` | `IOperation`、`NewOperation` | `create()` の引数、`update()`、`partialUpdate()`、`find()`、`query()` の戻り値、`getOperationIdentifier()`、`compareOperation()`、`addOperationToCollectionIfMissing()` の引数 |
| リゾルバー | `src/app/entities/operation/route/operation-routing-resolve.service.ts` | `operationResolve` | `IOperation` | 戻り値の Observable の型 |
| 画面 | `src/app/entities/operation/list/operation.ts` | `Operation` | `IOperation` | シグナル `operations`、`trackId()`、`delete()`、`fillComponentAttributesFromResponseBody()` |
| 画面 | `src/app/entities/operation/detail/operation-detail.ts` | `OperationDetail` | `IOperation` | `input` の `operation` |
| 画面 | `src/app/entities/operation/update/operation-update.ts` | `OperationUpdate` | `IOperation` | フィールド `operation`、`updateForm()`、`subscribeToSaveResponse()` |
| 画面 | `src/app/entities/operation/delete/operation-delete-dialog.ts` | `OperationDeleteDialog` | `IOperation` | フィールド `operation` |
| フォームサービス | `src/app/entities/operation/update/operation-form.service.ts` | `OperationFormService` | `IOperation`、`NewOperation` | `createOperationFormGroup()` と `resetForm()` の引数、`getOperation()` の戻り値、`OperationFormGroup` の型 |
| モデル | `src/app/entities/label/label.model.ts` | `ILabel` | `IOperation` | 項目 `operations` の型 |
| 画面 | `src/app/entities/label/update/label-update.ts` | `LabelUpdate` | `IOperation` | シグナル `operationsSharedCollection`、`compareOperation()` |

使う画面と共通部品は次のとおりである。

- 取引の一覧（[取引一覧_画面設計書](../../02_画面設計/400_エンティティ/取引/一覧/取引一覧_画面設計書.md)）、詳細（[取引詳細_画面設計書](../../02_画面設計/400_エンティティ/取引/詳細/取引詳細_画面設計書.md)）、登録・編集（[取引登録・編集_画面設計書](../../02_画面設計/400_エンティティ/取引/登録・編集/取引登録・編集_画面設計書.md)）、削除（[取引削除_画面設計書](../../02_画面設計/400_エンティティ/取引/削除/取引削除_画面設計書.md)。削除は一覧上のダイアログである）。
- ラベルの一覧（[ラベル一覧_画面設計書](../../02_画面設計/400_エンティティ/ラベル/一覧/ラベル一覧_画面設計書.md)）、詳細（[ラベル詳細_画面設計書](../../02_画面設計/400_エンティティ/ラベル/詳細/ラベル詳細_画面設計書.md)）。ラベルの項目 `operations` の型として使う。
- ラベルの登録・編集（[ラベル登録・編集_画面設計書](../../02_画面設計/400_エンティティ/ラベル/登録・編集/ラベル登録・編集_画面設計書.md)）。取引の選択肢の型として使う。
- このモデルを画面のテンプレートで直接 import する箇所はない（テンプレートはコンポーネントのフィールドを通じて値を読む）。

単体テストでは `src/app/entities/operation/operation.test-samples.ts` がサンプルデータの型として使う。

関連文書:

- [アプリ_画面設計書](../../02_画面設計/000_アプリ/アプリ/アプリ_画面設計書.md)（6.3、6.4、10 章）
- [bank-account_DTO設計書](bank-account_DTO設計書.md)
- [label_DTO設計書](label_DTO設計書.md)
- [取引_電文レイアウト](../02_電文レイアウト/取引_電文レイアウト.md)

## 5. 変換規則

### 5.1 REST 用の型（`operation.service.ts`）

`src/app/entities/operation/service/operation.service.ts` は、`date` を文字列で持つ型を export している。`RestOf<T>` は `T` から `date` を除き、`date?: string | null` を加えた型であり、ファイルの外に出ない。

| 型名 | 定義 | 使い先 |
| --- | --- | --- |
| `PartialUpdateOperation` | `Partial<IOperation>` に `id` を必須で加えた型 | `partialUpdate()` の引数 |
| `RestOperation` | `RestOf<IOperation>` | `operationsResource`（`httpResource`）、HTTP の要求と応答 |
| `NewRestOperation` | `RestOf<NewOperation>` | export だけで、本体から参照していない |
| `PartialUpdateRestOperation` | `RestOf<PartialUpdateOperation>` | export だけで、本体から参照していない |

### 5.2 モデルと JSON の変換（`OperationsService`、`OperationService`）

| メソッド | 向き | 変換 | 根拠 |
| --- | --- | --- | --- |
| `convertValueFromServer(restOperation)` | 応答からモデルへ | `date` が真の値なら `dayjs(restOperation.date)`、そうでなければ `undefined` | `src/app/entities/operation/service/operation.service.ts`（`convertValueFromServer()`） |
| `convertValueFromClient(operation)` | モデルから要求へ | `date: operation.date?.toJSON() ?? null`（dayjs の `toJSON()` による文字列。値がなければ `null`） | 同上（`convertValueFromClient()`） |
| `convertResponseFromServer(res)` | 応答からモデルへ | `convertValueFromServer()` に委譲 | 同上 |
| `convertResponseArrayFromServer(res)` | 応答からモデルへ | 配列の各要素に `convertValueFromServer()` を適用 | 同上 |

- `create()`、`update()`、`partialUpdate()` は `convertValueFromClient()` で要求を作り、`convertResponseFromServer()` で応答をモデルにする。
- `find()` と `query()` は `convertResponseFromServer()`、`convertResponseArrayFromServer()` で応答をモデルにする。
- サービスの `operations`（`computed`）は `operationsResource` の値（`RestOperation` の配列）の各要素を `convertValueFromServer()` で変換する。
- ほかの項目 (`description`、`amount`、`bankAccount`、`labels`) は変換しない。

### 5.3 モデルとフォームの変換（`OperationFormService`）

`OperationFormService`（`src/app/entities/operation/update/operation-form.service.ts`）は、フォームでは `date` を `DATE_TIME_FORMAT`（`'YYYY-MM-DDTHH:mm'`、`src/app/config/input.constants.ts`）の文字列で持つ。

| フォームコントロール | 初期値（`getFormDefaults()`） | バリデーター | 対応する項目 |
| --- | --- | --- | --- |
| `id` | `null`（`disabled: true`、`nonNullable: true`） | `Validators.required` | `id` |
| `date` | `dayjs()`（フォームを作った時刻） | `Validators.required` | `date` |
| `description` | なし（`undefined`） | なし | `description` |
| `amount` | なし（`undefined`） | `Validators.required` | `amount` |
| `bankAccount` | なし（`undefined`） | なし | `bankAccount` |
| `labels` | `[]` | なし | `labels` |

- `convertOperationToOperationRawValue()`: モデルからフォームへ。`date: operation.date ? operation.date.format(DATE_TIME_FORMAT) : undefined` とし、`labels` がなければ `[]` にする。
- `convertOperationRawValueToOperation()`: フォームからモデルへ。`date: dayjs(rawOperation.date, DATE_TIME_FORMAT)` とする。`getOperation(form)` が `form.getRawValue()` に対してこれを適用する。
- `createOperationFormGroup()` は既定値に引数を重ねてからフォーム値に変換する。`resetForm()` も同じ変換をして `form.reset()` する。
- `FormValueOf`、`OperationFormRawValue`、`NewOperationFormRawValue`、`PartialWithRequiredKeyOf`、`OperationFormGroupInput`、`OperationFormDefaults`、`OperationFormGroupContent` はファイルの外に出ない型である。export しているのは `OperationFormGroup` だけであり、`OperationUpdate` が `editForm` の型として使う。

### 5.4 登録と更新の判別（`OperationUpdate.save()`）

- `getOperation(this.editForm)` の結果の `id` が `null` なら `operationService.create(operation)`（`POST api/operations`）、`null` 以外なら `operationService.update(operation)`（`PUT api/operations/{id}`）を呼ぶ。

### 5.5 テンプレートでの表示

- 登録・編集画面の日時の入力は `<input type="datetime-local" ... formControlName="date" placeholder="YYYY-MM-DD HH:mm">` である（`src/app/entities/operation/update/operation-update.html`）。
- 一覧と詳細は `formatMediumDatetime` パイプで日時を表示する。パイプの書式は `'D MMM YYYY HH:mm:ss'` である（`src/app/shared/date/format-medium-datetime.pipe.ts`、`src/app/entities/operation/list/operation.html`、`src/app/entities/operation/detail/operation-detail.html`）。
- 一覧と詳細は、関連する銀行口座の `id` と `name` を銀行口座詳細へのリンクとして表示する（`src/app/entities/operation/list/operation.html`、`src/app/entities/operation/detail/operation-detail.html`）。

### 5.6 サービスでの扱い（`OperationService`）

- 単票の URL は `${this.resourceUrl}/${encodeURIComponent(this.getOperationIdentifier(operation))}` の形である。
- `partialUpdate()`（`PATCH api/operations/{id}`）を本体から呼ぶ箇所はない。
- 一覧画面はクエリパラメーター `size` と `eagerload`（`true`）を送る。バックエンドの `getAllOperations()` は `eagerload` が `true` のとき `operationRepository.findAllWithEagerRelationships(pageable)` を呼ぶ（バックエンドの `src/main/java/io/github/jhipster/sample/web/rest/OperationResource.java`）。
