# user-management DTO設計書

## 0. 改訂履歴

| 項番 | バージョン | 改訂内容 |
| --- | --- | --- |
| 1 | 1.0 | 新規作成 |

## 1. 概要

| 項目 | 内容 | 根拠 |
| --- | --- | --- |
| ファイル | `src/app/entities/admin/user-management/user-management.model.ts` | 同左 |
| モデル化対象 | ユーザ管理（エンティティ `user-management`）。管理者が扱うユーザーの一覧・詳細・登録・編集・削除 | `src/app/entities/admin/user-management/user-management.routes.ts` |
| 対応するバックエンド | DTO `AdminUserDTO`（バックエンドの `src/main/java/io/github/jhipster/sample/service/dto/AdminUserDTO.java`）。REST は `UserResource`（バックエンドの `src/main/java/io/github/jhipster/sample/web/rest/UserResource.java`、`/api/admin/users`） | 同左 |
| エクスポート | 2 つ（`interface` 1、`type` 1） | `src/app/entities/admin/user-management/user-management.model.ts` |
| 依存する定数 | `LANGUAGES`（`langKey` の型の元） | `src/app/entities/admin/user-management/user-management.model.ts`（`import { LANGUAGES }`）、`src/app/config/language.constants.ts` |
| 日付の扱い | 日時の項目 `createdDate`、`lastModifiedDate` がある。REST では文字列、モデルでは dayjs のオブジェクトで持つ（5 章） | `src/app/entities/admin/user-management/user-management.model.ts`、`src/app/entities/admin/user-management/service/user-management.service.ts` |

## 2. 型定義一覧

| 型名 | 種別 | 用途 | 根拠 |
| --- | --- | --- | --- |
| `IUserManagement` | `interface` | 管理対象のユーザー 1 件。取得・更新・削除の対象と、一覧の要素 | `src/app/entities/admin/user-management/user-management.model.ts`（`IUserManagement`） |
| `NewUserManagement` | `type` | 登録に使う型。`IUserManagement` から `login` を除いた型に `{ login: null }` を交差させたもの | 同上（`NewUserManagement`） |

## 3. 項目定義

### `IUserManagement`

| 項目 | 型 | 必須 | 説明 | 対応するバックエンド (DTO / field) | 根拠 |
| --- | --- | --- | --- | --- | --- |
| `id` | `number` または `null` | 任意 | バックエンドの主キー。このモデルの識別子は `login` であり、URL には `login` を使う。登録画面は `id` の値で登録か更新かを判別する（5.4） | DTO `AdminUserDTO` の `id`（`Long`） | `src/app/entities/admin/user-management/user-management.model.ts`（`IUserManagement.id`）、バックエンドの `src/main/java/io/github/jhipster/sample/service/dto/AdminUserDTO.java`（`id`） |
| `login` | `string` | 必須 | ログイン ID。`getUserManagementIdentifier()` の戻り値であり、URL の `{login}` に使う | DTO `AdminUserDTO` の `login`（`String`。`@NotBlank`、`@Pattern`、`@Size(min = 1, max = 50)`） | 同上（`login`） |
| `firstName` | `string` または `null` | 任意 | 名 | DTO `AdminUserDTO` の `firstName`（`String`。`@Size(max = 50)`） | 同上（`firstName`） |
| `lastName` | `string` または `null` | 任意 | 姓 | DTO `AdminUserDTO` の `lastName`（`String`。`@Size(max = 50)`） | 同上（`lastName`） |
| `email` | `string` または `null` | 任意 | メールアドレス | DTO `AdminUserDTO` の `email`（`String`。`@Email`、`@Size(min = 5, max = 254)`） | 同上（`email`） |
| `activated` | `boolean` または `null` | 任意 | 有効かどうか | DTO `AdminUserDTO` の `activated`（`boolean`） | 同上（`activated`） |
| `langKey` | `string` または `null` | 任意 | 言語。`(typeof LANGUAGES)[number]` であり、`LANGUAGES` が `string[]` と型付けされているため `string` になる | DTO `AdminUserDTO` の `langKey`（`String`。`@Size(min = 2, max = 10)`） | 同上（`langKey`）、`src/app/config/language.constants.ts` |
| `imageUrl` | `string` または `null` | 任意 | 画像の URL | DTO `AdminUserDTO` の `imageUrl`（`String`。`@Size(max = 256)`） | 同上（`imageUrl`） |
| `createdBy` | `string` または `null` | 任意 | 作成者 | DTO `AdminUserDTO` の `createdBy`（`String`） | 同上（`createdBy`） |
| `createdDate` | `dayjs.Dayjs` または `null` | 任意 | 作成日時 | DTO `AdminUserDTO` の `createdDate`（`Instant`） | 同上（`createdDate`） |
| `lastModifiedBy` | `string` または `null` | 任意 | 最終更新者 | DTO `AdminUserDTO` の `lastModifiedBy`（`String`） | 同上（`lastModifiedBy`） |
| `lastModifiedDate` | `dayjs.Dayjs` または `null` | 任意 | 最終更新日時 | DTO `AdminUserDTO` の `lastModifiedDate`（`Instant`） | 同上（`lastModifiedDate`） |
| `authorities` | `string` の配列または `null` | 任意 | 権限名の一覧 | DTO `AdminUserDTO` の `authorities`（`Set<String>`） | 同上（`authorities`） |

- 「任意」は、プロパティーを省略できること（`?`）と、`null` を取り得ることを表す。`login` だけが必須で、`null` を取らない。
- バックエンドの `UserResource` のうち、一覧 (`getAllUsers()`)、1 件の取得 (`getUser()`)、更新 (`updateUser()`) は `AdminUserDTO` を返す。登録 (`createUser()`) の要求は `AdminUserDTO` であるが、応答はエンティティの `User` である。フロントエンドは `create()` の戻り値も `IUserManagement` としている（バックエンドの `src/main/java/io/github/jhipster/sample/web/rest/UserResource.java`）。
- バックエンドのエンティティ `User` の `setLogin()` は、ログイン ID を英小文字に変換する（バックエンドの `src/main/java/io/github/jhipster/sample/domain/User.java`）。
- バックエンドの `createdDate`、`lastModifiedDate` は `Instant` である。JSON での表現は Jackson の既定に依存し、バックエンドの設定ファイルに日時の書式の指定はないため、コードからは確認できない。

### `NewUserManagement`

| 項目 | 型 | 必須 | 説明 | 対応するバックエンド (DTO / field) | 根拠 |
| --- | --- | --- | --- | --- | --- |
| `login` | `null` | 必須 | 固定で `null` | DTO `AdminUserDTO` の `login`（`String`。`@NotBlank`、`@Pattern`、`@Size(min = 1, max = 50)`） | `src/app/entities/admin/user-management/user-management.model.ts`（`NewUserManagement`）、バックエンドの `src/main/java/io/github/jhipster/sample/service/dto/AdminUserDTO.java`（`login`） |
| `id` | `number` または `null` | 任意 | `IUserManagement` に同じ。登録 (`POST api/admin/users`) では `id` は `null` でなければならない（`null` 以外なら 400 と `idexists`） | DTO `AdminUserDTO` の `id`（`Long`） | 同上、バックエンドの `src/main/java/io/github/jhipster/sample/web/rest/UserResource.java`（`createUser()`） |
| `firstName`、`lastName`、`email`、`imageUrl`、`createdBy`、`lastModifiedBy` | `string` または `null` | 任意 | `IUserManagement` に同じ | `IUserManagement` に同じ | 同上 |
| `activated` | `boolean` または `null` | 任意 | `IUserManagement` に同じ | `IUserManagement` に同じ | 同上 |
| `langKey` | `string` または `null` | 任意 | `IUserManagement` に同じ | `IUserManagement` に同じ | 同上 |
| `createdDate`、`lastModifiedDate` | `dayjs.Dayjs` または `null` | 任意 | `IUserManagement` に同じ | `IUserManagement` に同じ | 同上 |
| `authorities` | `string` の配列または `null` | 任意 | `IUserManagement` に同じ | `IUserManagement` に同じ | 同上 |

## 4. 使用箇所

本体（単体テストを除く）のうち、このモデルを import しているファイルである。

| 分類 | ファイル | クラス・関数 | 使っている型 | 用途 |
| --- | --- | --- | --- | --- |
| サービス | `src/app/entities/admin/user-management/service/user-management.service.ts` | `UserManagementsService` | `IUserManagement`、`NewUserManagement`（`RestUserManagement` の元になる型） | `userManagementsResource`（`httpResource`）と `userManagements`（`computed`）の型、変換メソッド |
| サービス | 同上 | `UserManagementService` | `IUserManagement`、`NewUserManagement` | `create()` の引数、`update()`、`partialUpdate()`、`find()`、`query()` の戻り値、`getUserManagementIdentifier()`、`compareUserManagement()`、`addUserManagementToCollectionIfMissing()` の引数 |
| リゾルバー | `src/app/entities/admin/user-management/route/user-management-routing-resolve.service.ts` | `userManagementResolve` | `IUserManagement` | 戻り値の Observable の型 |
| 画面 | `src/app/entities/admin/user-management/list/user-management.ts` | `UserManagement` | `IUserManagement` | シグナル `userManagements`、`trackLogin()`、`delete()`、`setActive()` |
| 画面 | `src/app/entities/admin/user-management/detail/user-management-detail.ts` | `UserManagementDetail` | `IUserManagement` | `input` の `userManagement` |
| 画面 | `src/app/entities/admin/user-management/update/user-management-update.ts` | `UserManagementUpdate` | `IUserManagement`、`NewUserManagement` | フィールド `userManagement`、`updateForm()`、`subscribeToSaveResponse()`、`save()` |
| 画面 | `src/app/entities/admin/user-management/delete/user-management-delete-dialog.ts` | `UserManagementDeleteDialog` | `IUserManagement` | フィールド `userManagement` |
| フォームサービス | `src/app/entities/admin/user-management/update/user-management-form.service.ts` | `UserManagementFormService` | `IUserManagement`、`NewUserManagement` | `createUserManagementFormGroup()` と `resetForm()` の引数、`getUserManagement()` の戻り値、`UserManagementFormGroup` の型 |

使う画面と共通部品は次のとおりである。

- ユーザ管理の一覧（[ユーザ管理一覧_画面設計書](../../02_画面設計/400_エンティティ/ユーザ管理/一覧/ユーザ管理一覧_画面設計書.md)）、詳細（[ユーザ管理詳細_画面設計書](../../02_画面設計/400_エンティティ/ユーザ管理/詳細/ユーザ管理詳細_画面設計書.md)）、登録・編集（[ユーザ管理登録・編集_画面設計書](../../02_画面設計/400_エンティティ/ユーザ管理/登録・編集/ユーザ管理登録・編集_画面設計書.md)）、削除（[ユーザ管理削除_画面設計書](../../02_画面設計/400_エンティティ/ユーザ管理/削除/ユーザ管理削除_画面設計書.md)。削除は一覧上のダイアログである）。
- ほかのエンティティのモデルから参照していない。
- このモデルを画面のテンプレートで直接 import する箇所はない（テンプレートはコンポーネントのフィールドを通じて値を読む）。

単体テストでは `src/app/entities/admin/user-management/user-management.test-samples.ts` がサンプルデータの型として使う。

関連文書:

- [アプリ_画面設計書](../../02_画面設計/000_アプリ/アプリ/アプリ_画面設計書.md)（6.3、6.4、10 章）
- [authority_DTO設計書](authority_DTO設計書.md)（登録・編集画面の権限の選択肢）
- [ユーザ管理_電文レイアウト](../02_電文レイアウト/ユーザ管理_電文レイアウト.md)

## 5. 変換規則

### 5.1 REST 用の型（`user-management.service.ts`）

`src/app/entities/admin/user-management/service/user-management.service.ts` は、`createdDate` と `lastModifiedDate` を文字列で持つ型を export している。`RestOf<T>` は `T` からこの 2 つを除き、`createdDate?: string | null` と `lastModifiedDate?: string | null` を加えた型であり、ファイルの外に出ない。

| 型名 | 定義 | 使い先 |
| --- | --- | --- |
| `PartialUpdateUserManagement` | `Partial<IUserManagement>` に `login` を必須で加えた型 | `partialUpdate()` の引数 |
| `RestUserManagement` | `RestOf<IUserManagement>` | `userManagementsResource`（`httpResource`）、HTTP の要求と応答 |
| `NewRestUserManagement` | `RestOf<NewUserManagement>` | export だけで、本体から参照していない |
| `PartialUpdateRestUserManagement` | `RestOf<PartialUpdateUserManagement>` | export だけで、本体から参照していない |

### 5.2 モデルと JSON の変換（`UserManagementsService`、`UserManagementService`）

| メソッド | 向き | 変換 | 根拠 |
| --- | --- | --- | --- |
| `convertValueFromServer(restUserManagement)` | 応答からモデルへ | `createdDate`、`lastModifiedDate` が真の値なら `dayjs()` でパースし、そうでなければ `undefined` | `src/app/entities/admin/user-management/service/user-management.service.ts`（`convertValueFromServer()`） |
| `convertValueFromClient(userManagement)` | モデルから要求へ | `createdDate: userManagement.createdDate?.toJSON() ?? null`、`lastModifiedDate` も同じ（dayjs の `toJSON()` による文字列。値がなければ `null`） | 同上（`convertValueFromClient()`） |
| `convertResponseFromServer(res)` | 応答からモデルへ | `convertValueFromServer()` に委譲 | 同上 |
| `convertResponseArrayFromServer(res)` | 応答からモデルへ | 配列の各要素に `convertValueFromServer()` を適用 | 同上 |

- `create()`、`update()`、`partialUpdate()` は `convertValueFromClient()` で要求を作り、`convertResponseFromServer()` で応答をモデルにする。
- `find()` と `query()` は `convertResponseFromServer()`、`convertResponseArrayFromServer()` で応答をモデルにする。
- サービスの `userManagements`（`computed`）は `userManagementsResource` の値の各要素を `convertValueFromServer()` で変換する。
- ほかの項目は変換しない。

### 5.3 モデルとフォームの変換（`UserManagementFormService`）

`UserManagementFormService`（`src/app/entities/admin/user-management/update/user-management-form.service.ts`）は、フォームでは `createdDate` と `lastModifiedDate` を `DATE_TIME_FORMAT`（`'YYYY-MM-DDTHH:mm'`、`src/app/config/input.constants.ts`）の文字列で持つ。

| フォームコントロール | 初期値（`getFormDefaults()`） | バリデーター | 対応する項目 |
| --- | --- | --- | --- |
| `id` | なし（コントロールの値は `null`。5.4 参照） | なし | `id` |
| `login` | `null`（`nonNullable: true`） | `Validators.required`、`Validators.maxLength(50)`、`Validators.pattern(...)` | `login` |
| `firstName` | なし（コントロールの値は `null`） | `Validators.maxLength(50)` | `firstName` |
| `lastName` | なし（コントロールの値は `null`） | `Validators.maxLength(50)` | `lastName` |
| `email` | なし（コントロールの値は `null`） | `Validators.required`、`Validators.email`、`Validators.minLength(5)`、`Validators.maxLength(191)` | `email` |
| `activated` | `true` | なし | `activated` |
| `langKey` | `'en'` | `Validators.maxLength(10)` | `langKey` |
| `imageUrl` | なし（コントロールの値は `null`） | `Validators.maxLength(256)` | `imageUrl` |
| `createdBy`、`createdDate`、`lastModifiedBy`、`lastModifiedDate` | `createdDate`、`lastModifiedDate` は `dayjs()`（フォームを作った時刻）。ほかはなし（`undefined`） | なし | 同名の項目 |
| `authorities` | `[]` | なし | `authorities` |

- `login` の `Validators.pattern()` の正規表現は、メールアドレス形式の文字列と、`_`、`.`、`@`、英数字、`-` だけからなる文字列の 2 つの選択肢を持つ（`src/app/entities/admin/user-management/update/user-management-form.service.ts`）。
- `convertUserManagementToUserManagementRawValue()`: モデルからフォームへ。2 つの日時を `format(DATE_TIME_FORMAT)` の文字列にし（値がなければ `undefined`）、`authorities` がなければ `[]` にする。
- `convertUserManagementRawValueToUserManagement()`: フォームからモデルへ。2 つの日時を `dayjs(値, DATE_TIME_FORMAT)` にする。`getUserManagement(form)` が `form.getRawValue()` に対してこれを適用する。
- `resetForm(form, userManagement)`: 既定値に引数を重ねてフォーム値に変換し、`form.reset()` する。コントロールを無効化しない。
- ファイルの外に出る型は `UserManagementFormGroup` だけであり、`UserManagementUpdate` が `editForm` の型として使う。

### 5.4 登録と更新の判別（`UserManagementUpdate.save()`）

- `getUserManagement(this.editForm)` の結果の `id` が `null` なら `userManagementService.create()`（`POST api/admin/users`）、それ以外のときは `userManagementService.update()`（`PUT api/admin/users/{login}`）を呼ぶ。
- フォームの既定値 (`getFormDefaults()`) に `id` はなく、`/user-management/new` ではリゾルバーが `null` を返すため `resetForm()` も呼ばれない。このとき `new FormControl(userManagementRawValue.id)` の第 1 引数は `undefined` であるが、`FormControl` のコンストラクターの第 1 引数の既定値は `null` であるため（インストール済みの `@angular/forms` の `constructor(formState = null, …)`）、コントロールの値は `null` になる。したがって新規の画面のまま保存すると `create()` が呼ばれる（E2E テスト `cypress/e2e/entity/user-management.cy.ts` も `POST` の 201 を期待している）。
- 単体テストは `getUserManagement()` が `{ id: null, login: null }` を返すように置き換えて、`create()` が呼ばれることを確認している（`src/app/entities/admin/user-management/update/user-management-update.spec.ts`）。

### 5.5 一覧画面での更新（`UserManagement.setActive()`）

- 一覧画面は有効・無効の切り替えで `userManagementService.update({ ...userManagement, activated: isActivated })` を呼び、完了後に一覧を再取得する（`src/app/entities/admin/user-management/list/user-management.ts`）。

### 5.6 サービスでの扱い（`UserManagementService`）

- 単票の URL は `${this.resourceUrl}/${encodeURIComponent(this.getUserManagementIdentifier(userManagement))}` の形で、識別子は `login` である。
- `partialUpdate()` は `PATCH api/admin/users/{login}` を送るが、このメソッドを本体から呼ぶ箇所はなく、バックエンドの `UserResource` にも `PATCH` のマッピングはない。
- 登録・編集画面は `authorityService.authoritiesParams.set({})` で権限の一覧を取得し、`computed` の `authorities` で権限名 (`authority.name`) の配列を作って選択肢にする（`src/app/entities/admin/user-management/update/user-management-update.ts`）。
- 一覧と詳細は `formatMediumDatetime` パイプで `createdDate`、`lastModifiedDate` を表示する（`src/app/entities/admin/user-management/list/user-management.html`、`src/app/entities/admin/user-management/detail/user-management-detail.html`）。
