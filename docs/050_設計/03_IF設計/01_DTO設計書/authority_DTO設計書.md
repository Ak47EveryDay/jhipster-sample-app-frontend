# authority DTO設計書

## 0. 改訂履歴

| 項番 | バージョン | 改訂内容 |
| --- | --- | --- |
| 1 | 1.0 | 新規作成 |

## 1. 概要

| 項目 | 内容 | 根拠 |
| --- | --- | --- |
| ファイル | `src/app/entities/admin/authority/authority.model.ts` | 同左 |
| モデル化対象 | 権限（エンティティ `authority`）。権限名だけの 1 項目である。一覧・詳細・登録・削除の対象であり、ユーザ管理の権限の選択肢としても使う | `src/app/entities/admin/authority/authority.routes.ts`、`src/app/entities/admin/user-management/update/user-management-update.ts` |
| 対応するバックエンド | エンティティ `Authority`（バックエンドの `src/main/java/io/github/jhipster/sample/domain/Authority.java`）。REST は `AuthorityResource`（バックエンドの `src/main/java/io/github/jhipster/sample/web/rest/AuthorityResource.java`、`/api/authorities`） | 同左 |
| エクスポート | 2 つ（`interface` 1、`type` 1） | `src/app/entities/admin/authority/authority.model.ts` |
| 依存するモデル | なし | 同上 |

## 2. 型定義一覧

| 型名 | 種別 | 用途 | 根拠 |
| --- | --- | --- | --- |
| `IAuthority` | `interface` | 権限 1 件。取得・登録・削除の対象と、一覧の要素 | `src/app/entities/admin/authority/authority.model.ts`（`IAuthority`） |
| `NewAuthority` | `type` | 登録に使う型。`IAuthority` から `name` を除いた型に `{ name: null }` を交差させたもの | 同上（`NewAuthority`） |

## 3. 項目定義

### `IAuthority`

| 項目 | 型 | 必須 | 説明 | 対応するバックエンド (DTO / field) | 根拠 |
| --- | --- | --- | --- | --- | --- |
| `name` | `string` | 必須 | 権限名。主キーであり、`getAuthorityIdentifier()` の戻り値であり、URL の `{name}` に使う。ユーザ管理の `authorities` の要素と同じ値である | エンティティ `Authority` の `name`（`String`。`@Id`。`@NotNull`、`@Size(max = 50)`） | `src/app/entities/admin/authority/authority.model.ts`（`IAuthority.name`）、バックエンドの `src/main/java/io/github/jhipster/sample/domain/Authority.java`（`name`） |

- フロントエンドの定数には `Authority.ADMIN`（`'ROLE_ADMIN'`）と `Authority.USER`（`'ROLE_USER'`）がある（`src/app/shared/jhipster/constants.ts`）。本体で使っているのは `Authority.ADMIN` だけであり、`/admin` のルートの `data.authorities` である（`src/app/app.routes.ts`）。
- バックエンドは DTO を使わず、エンティティの `Authority` をそのまま JSON で返す。エンティティには `@JsonIgnoreProperties(value = { "new", "id" })` がある（バックエンドの `src/main/java/io/github/jhipster/sample/domain/Authority.java`）。
- バックエンドの `AuthorityResource` の 4 つのメソッド（登録、一覧、1 件の取得、削除）には `@PreAuthorize("hasAnyAuthority('ROLE_ADMIN')")` がある。1 件の取得と削除のパス変数は `@PathVariable("id") String id` であり、値は権限名である（バックエンドの `src/main/java/io/github/jhipster/sample/web/rest/AuthorityResource.java`）。
- バックエンドに更新 (`PUT`) と部分更新 (`PATCH`) のマッピングはない。フロントエンドの `AuthorityService` にも `update()` と `partialUpdate()` はなく、ルートに `:name/edit` もない（`src/app/entities/admin/authority/authority.routes.ts`）。

### `NewAuthority`

| 項目 | 型 | 必須 | 説明 | 対応するバックエンド (DTO / field) | 根拠 |
| --- | --- | --- | --- | --- | --- |
| `name` | `null` | 必須 | 固定で `null` | `AuthorityResource.createAuthority()` は権限名が既に存在するとき 400 と `idexists` を返す | `src/app/entities/admin/authority/authority.model.ts`（`NewAuthority`）、バックエンドの `src/main/java/io/github/jhipster/sample/web/rest/AuthorityResource.java`（`createAuthority()`） |

`NewAuthority` は `Omit<IAuthority, 'name'>`（項目なし）と `{ name: null }` の交差型であるため、項目は `name` だけである。

## 4. 使用箇所

本体（単体テストを除く）のうち、このモデルを import しているファイルである。

| 分類 | ファイル | クラス・関数 | 使っている型 | 用途 |
| --- | --- | --- | --- | --- |
| サービス | `src/app/entities/admin/authority/service/authority.service.ts` | `AuthoritiesService` | `IAuthority` | `authoritiesResource`（`httpResource`）と `authorities`（`computed`）の型 |
| サービス | 同上 | `AuthorityService` | `IAuthority`、`NewAuthority` | `create()` の引数、`find()`、`query()` の戻り値、`getAuthorityIdentifier()`、`compareAuthority()`、`addAuthorityToCollectionIfMissing()` の引数 |
| リゾルバー | `src/app/entities/admin/authority/route/authority-routing-resolve.service.ts` | `authorityResolve` | `IAuthority` | 戻り値の Observable の型 |
| 画面 | `src/app/entities/admin/authority/list/authority.ts` | `Authority` | `IAuthority` | シグナル `authorities`、`trackName()`、`delete()`、`refineData()` |
| 画面 | `src/app/entities/admin/authority/detail/authority-detail.ts` | `AuthorityDetail` | `IAuthority` | `input` の `authority` |
| 画面 | `src/app/entities/admin/authority/update/authority-update.ts` | `AuthorityUpdate` | `IAuthority` | フィールド `authority`、`updateForm()`、`subscribeToSaveResponse()` |
| 画面 | `src/app/entities/admin/authority/delete/authority-delete-dialog.ts` | `AuthorityDeleteDialog` | `IAuthority` | フィールド `authority` |
| フォームサービス | `src/app/entities/admin/authority/update/authority-form.service.ts` | `AuthorityFormService` | `IAuthority`、`NewAuthority` | `createAuthorityFormGroup()` と `resetForm()` の引数、`getAuthority()` の戻り値、`AuthorityFormGroup` の型 |
| 画面（間接） | `src/app/entities/admin/user-management/update/user-management-update.ts` | `UserManagementUpdate` | import はなし。`authorityService.authorities()` の戻り値の型として間接に使う | `computed` の `authorities`（`authority.name` の配列） |

使う画面と共通部品は次のとおりである。

- 権限の一覧（[権限一覧_画面設計書](../../02_画面設計/400_エンティティ/権限/一覧/権限一覧_画面設計書.md)）、詳細（[権限詳細_画面設計書](../../02_画面設計/400_エンティティ/権限/詳細/権限詳細_画面設計書.md)）、登録（[権限登録_画面設計書](../../02_画面設計/400_エンティティ/権限/登録/権限登録_画面設計書.md)）、削除（[権限削除_画面設計書](../../02_画面設計/400_エンティティ/権限/削除/権限削除_画面設計書.md)。削除は一覧上のダイアログである）。
- ユーザ管理の登録・編集（[ユーザ管理登録・編集_画面設計書](../../02_画面設計/400_エンティティ/ユーザ管理/登録・編集/ユーザ管理登録・編集_画面設計書.md)）。権限の選択肢として間接に使う。
- このモデルを画面のテンプレートで直接 import する箇所はない（テンプレートはコンポーネントのフィールドを通じて値を読む）。

単体テストでは `src/app/entities/admin/authority/authority.test-samples.ts` がサンプルデータの型として使う。

関連文書:

- [アプリ_画面設計書](../../02_画面設計/000_アプリ/アプリ/アプリ_画面設計書.md)（5.1、6.3、10 章）
- [user-management_DTO設計書](user-management_DTO設計書.md)
- [権限_電文レイアウト](../02_電文レイアウト/権限_電文レイアウト.md)

## 5. 変換規則

### 5.1 モデルとフォームの変換（`AuthorityFormService`）

`AuthorityFormService`（`src/app/entities/admin/authority/update/authority-form.service.ts`）が `FormGroup` とモデルを相互に変換する。

| フォームコントロール | 初期値（`getFormDefaults()`） | バリデーター | 対応する項目 |
| --- | --- | --- | --- |
| `name` | `null`（`nonNullable: true`） | `Validators.required`、`Validators.maxLength(50)` | `name` |

- `createAuthorityFormGroup(authority?)`: 既定値 (`{ name: null }`) に引数のモデルを重ねて（引数がなければ `{ name: null }`）、コントロールを作る。引数の型は `IAuthority` または `PartialWithRequiredKeyOf<NewAuthority>`（`name` だけを必須にした部分型）である。`PartialWithRequiredKeyOf`、`AuthorityFormGroupInput`、`AuthorityFormDefaults`、`AuthorityFormGroupContent` はファイルの外に出ない型である。
- `getAuthority(form)`: `form.getRawValue() as NewAuthority` を返す。
- `resetForm(form, authority)`: 既定値に引数を重ね、`name` が `null` 以外のときは `name` のコントロールを無効化して `form.reset()` する。テンプレートは `[readonly]="editForm.get('name')!.disabled"` で入力欄を読み取り専用にする（`src/app/entities/admin/authority/update/authority-update.html`）。

### 5.2 保存（`AuthorityUpdate.save()`）

- `getAuthority(this.editForm)` の結果を `authorityService.create(authority)`（`POST api/authorities`）に渡す。画面に更新の処理はなく、登録かどうかの判別もない。

### 5.3 サービスでの扱い（`AuthorityService`）

- モデルと JSON の変換はない。
- 単票の URL は `${this.resourceUrl}/${encodeURIComponent(this.getAuthorityIdentifier(authority))}` の形である。
- 一覧画面が送るクエリパラメーターは `sort` だけである。バックエンドの `getAllAuthorities()` には引数がない（バックエンドの `src/main/java/io/github/jhipster/sample/web/rest/AuthorityResource.java`）。

### 5.4 ユーザ管理の登録・編集での使い方

- `UserManagementUpdate.ngOnInit()` は `authorityService.authoritiesParams.set({})` を実行して権限の一覧を取得する。
- `computed` の `authorities` は `authorityService.authorities().map(authority => authority.name)` で権限名の配列を作る。
- テンプレートは `<select multiple name="authority" formControlName="authorities">` の選択肢として `<option [value]="authority">` を置き、値は権限名の文字列である（`src/app/entities/admin/user-management/update/user-management-update.html`）。これは [user-management_DTO設計書](user-management_DTO設計書.md) の `authorities` に対応する。
