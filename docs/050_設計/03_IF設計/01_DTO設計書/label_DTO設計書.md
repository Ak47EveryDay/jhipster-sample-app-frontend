# label DTO設計書

## 0. 改訂履歴

| 項番 | バージョン | 改訂内容 |
| --- | --- | --- |
| 1 | 1.0 | 新規作成 |

## 1. 概要

| 項目 | 内容 | 根拠 |
| --- | --- | --- |
| ファイル | `src/app/entities/label/label.model.ts` | 同左 |
| モデル化対象 | ラベル（エンティティ `label`）。取引に複数付けることができる。一覧・詳細・登録・編集・削除の対象であり、取引の関連先としても使う | `src/app/entities/label/label.routes.ts`、`src/app/entities/operation/operation.model.ts` |
| 対応するバックエンド | エンティティ `Label`（バックエンドの `src/main/java/io/github/jhipster/sample/domain/Label.java`）。REST は `LabelResource`（バックエンドの `src/main/java/io/github/jhipster/sample/web/rest/LabelResource.java`、`/api/labels`） | 同左 |
| エクスポート | 2 つ（`interface` 1、`type` 1） | `src/app/entities/label/label.model.ts` |
| 依存するモデル | `IOperation`（[operation_DTO設計書](operation_DTO設計書.md)）。`operation.model.ts` も `ILabel` を参照する（相互参照） | `src/app/entities/label/label.model.ts`（`import { IOperation }`）、`src/app/entities/operation/operation.model.ts`（`import { ILabel }`） |

## 2. 型定義一覧

| 型名 | 種別 | 用途 | 根拠 |
| --- | --- | --- | --- |
| `ILabel` | `interface` | ラベル 1 件。取得・更新・削除の対象と、一覧の要素 | `src/app/entities/label/label.model.ts`（`ILabel`） |
| `NewLabel` | `type` | 登録に使う型。`ILabel` から `id` を除いた型に `{ id: null }` を交差させたもの | 同上（`NewLabel`） |

## 3. 項目定義

### `ILabel`

| 項目 | 型 | 必須 | 説明 | 対応するバックエンド (DTO / field) | 根拠 |
| --- | --- | --- | --- | --- | --- |
| `id` | `number` | 必須 | 主キー。`getLabelIdentifier()` の戻り値であり、URL の `{id}` に使う | エンティティ `Label` の `id`（`Long`） | `src/app/entities/label/label.model.ts`（`ILabel.id`）、バックエンドの `src/main/java/io/github/jhipster/sample/domain/Label.java`（`id`） |
| `label` | `string` または `null` | 任意 | ラベル名 | エンティティ `Label` の `label`（`String`。`@NotNull`、`@Size(min = 3)`） | 同上（`label`） |
| `operations` | `IOperation` の配列または `null` | 任意 | このラベルが付いた取引（多対多） | エンティティ `Label` の `operations`（`Set<Operation>`。`@ManyToMany(mappedBy = "labels")`） | 同上（`operations`） |

- 「任意」は、プロパティーを省略できること（`?`）と、`null` を取り得ることを表す。
- バックエンドは DTO を使わず、エンティティの `Label` をそのまま JSON で返す。
- バックエンドの `getAllLabels()` は `labelRepository.findAll()`、`getLabel()` は `labelRepository.findById(id)` を呼び、関連を一緒に読み込むメソッドは使わない。`operations` が JSON に出るかどうかは Jackson と Hibernate の設定によるため、コードからは確認できない（バックエンドの `src/main/java/io/github/jhipster/sample/web/rest/LabelResource.java`）。

### `NewLabel`

| 項目 | 型 | 必須 | 説明 | 対応するバックエンド (DTO / field) | 根拠 |
| --- | --- | --- | --- | --- | --- |
| `id` | `null` | 必須 | 固定で `null`。登録画面はこの値で登録か更新かを判別する | `LabelResource.createLabel()` は `id` が `null` でないとき 400 と `idexists` を返す | `src/app/entities/label/label.model.ts`（`NewLabel`）、バックエンドの `src/main/java/io/github/jhipster/sample/web/rest/LabelResource.java`（`createLabel()`） |
| `label` | `string` または `null` | 任意 | `ILabel` に同じ | `ILabel` に同じ | 同上 |
| `operations` | `IOperation` の配列または `null` | 任意 | `ILabel` に同じ | `ILabel` に同じ | 同上 |

## 4. 使用箇所

本体（単体テストを除く）のうち、このモデルを import しているファイルである。

| 分類 | ファイル | クラス・関数 | 使っている型 | 用途 |
| --- | --- | --- | --- | --- |
| サービス | `src/app/entities/label/service/label.service.ts` | `LabelsService` | `ILabel` | `labelsResource`（`httpResource`）と `labels`（`computed`）の型 |
| サービス | 同上 | `LabelService` | `ILabel`、`NewLabel` | `create()` の引数、`update()`、`partialUpdate()`、`find()`、`query()` の戻り値、`PartialUpdateLabel` の型、`getLabelIdentifier()`、`compareLabel()`、`addLabelToCollectionIfMissing()` の引数 |
| リゾルバー | `src/app/entities/label/route/label-routing-resolve.service.ts` | `labelResolve` | `ILabel` | 戻り値の Observable の型 |
| 画面 | `src/app/entities/label/list/label.ts` | `Label` | `ILabel` | シグナル `labels`、`trackId()`、`delete()`、`refineData()` |
| 画面 | `src/app/entities/label/detail/label-detail.ts` | `LabelDetail` | `ILabel` | `input` の `label` |
| 画面 | `src/app/entities/label/update/label-update.ts` | `LabelUpdate` | `ILabel` | フィールド `label`、`updateForm()`、`subscribeToSaveResponse()` |
| 画面 | `src/app/entities/label/delete/label-delete-dialog.ts` | `LabelDeleteDialog` | `ILabel` | フィールド `label` |
| フォームサービス | `src/app/entities/label/update/label-form.service.ts` | `LabelFormService` | `ILabel`、`NewLabel` | `createLabelFormGroup()` と `resetForm()` の引数、`getLabel()` の戻り値、`LabelFormGroup` の型 |
| モデル | `src/app/entities/operation/operation.model.ts` | `IOperation` | `ILabel` | 項目 `labels` の型 |
| 画面 | `src/app/entities/operation/update/operation-update.ts` | `OperationUpdate` | `ILabel` | シグナル `labelsSharedCollection`、`compareLabel()` |

使う画面と共通部品は次のとおりである。

- ラベルの一覧（[ラベル一覧_画面設計書](../../02_画面設計/400_エンティティ/ラベル/一覧/ラベル一覧_画面設計書.md)）、詳細（[ラベル詳細_画面設計書](../../02_画面設計/400_エンティティ/ラベル/詳細/ラベル詳細_画面設計書.md)）、登録・編集（[ラベル登録・編集_画面設計書](../../02_画面設計/400_エンティティ/ラベル/登録・編集/ラベル登録・編集_画面設計書.md)）、削除（[ラベル削除_画面設計書](../../02_画面設計/400_エンティティ/ラベル/削除/ラベル削除_画面設計書.md)。削除は一覧上のダイアログである）。
- 取引の一覧（[取引一覧_画面設計書](../../02_画面設計/400_エンティティ/取引/一覧/取引一覧_画面設計書.md)）、詳細（[取引詳細_画面設計書](../../02_画面設計/400_エンティティ/取引/詳細/取引詳細_画面設計書.md)）。取引の項目 `labels` の型として使う。
- 取引の登録・編集（[取引登録・編集_画面設計書](../../02_画面設計/400_エンティティ/取引/登録・編集/取引登録・編集_画面設計書.md)）。ラベルの選択肢の型として使う。
- このモデルを画面のテンプレートで直接 import する箇所はない（テンプレートはコンポーネントのフィールドを通じて値を読む）。

単体テストでは `src/app/entities/label/label.test-samples.ts` がサンプルデータの型として使う。

関連文書:

- [アプリ_画面設計書](../../02_画面設計/000_アプリ/アプリ/アプリ_画面設計書.md)（6.3、6.4、10 章）
- [operation_DTO設計書](operation_DTO設計書.md)
- [ラベル_電文レイアウト](../02_電文レイアウト/ラベル_電文レイアウト.md)

## 5. 変換規則

### 5.1 モデルとフォームの変換（`LabelFormService`）

`LabelFormService`（`src/app/entities/label/update/label-form.service.ts`）が `FormGroup` とモデルを相互に変換する。

| フォームコントロール | 初期値（`getFormDefaults()`） | バリデーター | 対応する項目 |
| --- | --- | --- | --- |
| `id` | `null`（`disabled: true`、`nonNullable: true`） | `Validators.required` | `id` |
| `label` | なし（`undefined`） | `Validators.required`、`Validators.minLength(3)` | `label` |
| `operations` | `[]`（モデルの `operations` が `null` または `undefined` のとき） | なし | `operations` |

- `createLabelFormGroup(label?)`: 既定値 (`{ id: null, operations: [] }`) に引数のモデルを重ねて（引数がなければ `{ id: null }`）、各コントロールを作る。引数の型は `ILabel` または `PartialWithRequiredKeyOf<NewLabel>`（`id` だけを必須にした部分型）である。`PartialWithRequiredKeyOf`、`LabelFormGroupInput`、`LabelFormDefaults`、`LabelFormGroupContent` はファイルの外に出ない型である。
- `getLabel(form)`: `form.getRawValue()` の結果を `ILabel` または `NewLabel` として返す。
- `resetForm(form, label)`: 既定値に引数を重ね、`id` を無効化したまま `form.reset()` する。
- 項目の変換（日付の文字列化など）はない。モデルの値とフォームの値は同じ形である。

### 5.2 登録と更新の判別（`LabelUpdate.save()`）

- `getLabel(this.editForm)` の結果の `id` が `null` なら `labelService.create(label)`（`POST api/labels`）、`null` 以外なら `labelService.update(label)`（`PUT api/labels/{id}`）を呼ぶ。

### 5.3 サービスでの扱い（`LabelService`）

- モデルと JSON の変換はない。日付の項目がないため、変換メソッドを持たない。
- 単票の URL は `${this.resourceUrl}/${encodeURIComponent(this.getLabelIdentifier(label))}` の形である。
- `partialUpdate()`（`PATCH api/labels/{id}`）を本体から呼ぶ箇所はない。
- 一覧画面が送るクエリパラメーターは `sort` だけである。バックエンドの `getAllLabels()` には引数がない（バックエンドの `src/main/java/io/github/jhipster/sample/web/rest/LabelResource.java`）。

### 5.4 テンプレートでの表示

- 一覧と詳細は `operations` の各取引の `id` を、取引詳細へのリンクとして表示する（`src/app/entities/label/list/label.html`、`src/app/entities/label/detail/label-detail.html`）。
- 登録・編集画面は `<select multiple name="operations" formControlName="operations" [compareWith]="compareOperation">` で取引を複数選ぶ。選択肢の文言は `operationOption.id` である（`src/app/entities/label/update/label-update.html`）。
