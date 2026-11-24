# DTO設計書（03_IF設計/01_DTO設計書）

このディレクトリには、フロントエンドの `src/app` 配下にあるモデルファイル（`*.model.ts`、`*.model.d.ts`）と、型定義を主とするファイル 1 つずつに対する DTO設計書を置きます。すべての記述は現在のコード（フロントエンドのコミット `570a360`、バックエンドのコミット `423e462`）に基づきます。文書とコードが食い違う場合はコードを正としてください。

各設計書の本文は常体、この README は敬体で書きます。ファイルのパスはリポジトリルート基準です。バックエンドのパスには「バックエンドの」を添えます（バックエンドのパスはフロントエンドのリポジトリには存在いません）。

## 1. 文書一覧

文書名はモデルファイル名から拡張子を除いたものに `_DTO設計書.md` を付けたものです。各設計書の章立ては `0. 改訂履歴`、`1. 概要`、`2. 型定義一覧`、`3. 項目定義`、`4. 使用箇所`、`5. 変換規則` です。

| 文書 | 対象ファイル | 対応するバックエンド | 主な使い先 |
| --- | --- | --- | --- |
| [bank-account_DTO設計書](bank-account_DTO設計書.md) | `src/app/entities/bank-account/bank-account.model.ts` | エンティティ `BankAccount` | 銀行口座の各画面、取引 |
| [label_DTO設計書](label_DTO設計書.md) | `src/app/entities/label/label.model.ts` | エンティティ `Label` | ラベルの各画面、取引 |
| [operation_DTO設計書](operation_DTO設計書.md) | `src/app/entities/operation/operation.model.ts` | エンティティ `Operation` | 取引の各画面、ラベル |
| [user-management_DTO設計書](user-management_DTO設計書.md) | `src/app/entities/admin/user-management/user-management.model.ts` | DTO `AdminUserDTO` | ユーザ管理の各画面 |
| [authority_DTO設計書](authority_DTO設計書.md) | `src/app/entities/admin/authority/authority.model.ts` | エンティティ `Authority` | 権限の各画面、ユーザ管理の登録・編集 |
| [user_DTO設計書](user_DTO設計書.md) | `src/app/entities/user/user.model.ts` | DTO `UserDTO` | 銀行口座の登録・編集 |
| [account_DTO設計書](account_DTO設計書.md) | `src/app/core/auth/account.model.ts` | DTO `AdminUserDTO` | アカウント状態、設定、ログイン |
| [login_DTO設計書](login_DTO設計書.md) | `src/app/core/auth/login.model.ts` | VM `LoginVM` | ログイン |
| [request_DTO設計書](request_DTO設計書.md) | `src/app/core/request/request.model.ts` | なし | なし（本体から未使用） |
| [register_DTO設計書](register_DTO設計書.md) | `src/app/account/register/register.model.ts` | VM `ManagedUserVM` | 登録 |
| [configuration_DTO設計書](configuration_DTO設計書.md) | `src/app/admin/configuration/configuration.model.ts` | ライブラリーの応答（Spring Boot Actuator） | アプリケーション設定 |
| [health_DTO設計書](health_DTO設計書.md) | `src/app/admin/health/health.model.ts` | ライブラリーの応答（Spring Boot Actuator） | ヘルスチェック |
| [log_DTO設計書](log_DTO設計書.md) | `src/app/admin/logs/log.model.ts` | ライブラリーの応答（Spring Boot Actuator） | ログ |
| [metrics_DTO設計書](metrics_DTO設計書.md) | `src/app/admin/metrics/metrics.model.ts` | ライブラリーの応答（JHipster のメトリクス、Spring Boot Actuator） | メトリクス |
| [navbar-item_DTO設計書](navbar-item_DTO設計書.md) | `src/app/layouts/navbar/navbar-item.model.d.ts` | なし | なし（本体から未使用） |
| [profile-info_DTO設計書](profile-info_DTO設計書.md) | `src/app/layouts/profiles/profile-info.model.ts` | ライブラリーの応答（Spring Boot Actuator） | ページリボン、ナビゲーションバー |
| [alert-error_DTO設計書](alert-error_DTO設計書.md) | `src/app/shared/alert/alert-error.model.ts` | なし | アラート（`AlertError`） |
| [filter_DTO設計書](filter_DTO設計書.md) | `src/app/shared/filter/filter.model.ts` | なし | なし（本体から未使用） |
| [headers_DTO設計書](headers_DTO設計書.md) | `src/app/shared/jhipster/headers.ts` | ライブラリーが付けるレスポンスヘッダー | HTTP共通処理、アラート |
| [problem-details_DTO設計書](problem-details_DTO設計書.md) | `src/app/shared/jhipster/problem-details.ts` | バックエンドの `ExceptionTranslator` が作るエラー応答 | なし（本体から未使用） |
| [sort-state_DTO設計書](sort-state_DTO設計書.md) | `src/app/shared/sort/sort-state.ts` | なし | 5 つの一覧画面、アプリケーション設定、ログ |

対象は 21 ファイルです。サービスやフォームサービスのファイルの中で export されている型（`PartialUpdate` で始まる型、`Rest` を含む型、`FormGroup` で終わる型、`AlertModel` など）は独立した文書にせず、関連するモデルの設計書の「5. 変換規則」に書きます。

## 2. 対応するバックエンドによる分類

| 分類 | モデル | 備考 |
| --- | --- | --- |
| バックエンドの DTO・VM に対応するもの | `IUserManagement`、`Account`、`IUser`、`Login`、`Registration` | エンティティをそのまま返さず、DTO や VM を使う API に対応します |
| バックエンドのエンティティに対応するもの | `IBankAccount`、`ILabel`、`IOperation`、`IAuthority` | バックエンドは DTO を使わず、エンティティのクラスをそのまま JSON で返します |
| ライブラリーの応答に対応するもの | configuration、health、log、metrics、profile-info の各モデル | バックエンドの `src/main/java/` 配下に対応するクラスはありません。ヘッダーを読む headers もライブラリーが付けるヘッダーに対応します |
| バックエンドに対応する型がないもの | request、navbar-item、alert-error、filter、sort-state | フロントエンドの内部で使う型、またはバックエンドの複数のクラスにまたがる概念です |
| エラー応答の本文を表すもの | problem-details | バックエンドの `ExceptionTranslator` と `FieldErrorVM` に対応しますが、フロントエンドの本体からは使われていません |

ライブラリーの応答に対応する設計書では、ライブラリーのエンドポイントのクラス名をバッククォートなしで示し、根拠としてバックエンドの `pom.xml` の依存とバックエンドの `src/main/resources/config/application.yml` の設定を挙げます。

## 3. 画面別使用DTO一覧

「使う DTO」は、画面のコンポーネント、フォームサービス、サービス、リゾルバーが import しているモデルです。「間接」は、画面がモデルを import せず、サービスの戻り値やシグナルの型として使うものです。画面名とリンク先は画面設計のチェックリストに合わせます。

### 3.1 画面

| 画面 | 画面設計書 | 使う DTO | 使い方 |
| --- | --- | --- | --- |
| ホーム | [ホーム_画面設計書](../../02_画面設計/100_TOP画面/ホーム/ホーム_画面設計書.md) | なし（間接: [account](account_DTO設計書.md)） | `AccountService.account` の `login` を表示します |
| ログイン | [ログイン_画面設計書](../../02_画面設計/200_アカウント/ログイン/ログイン_画面設計書.md) | なし（間接: [login](login_DTO設計書.md)） | フォームの値を `LoginService.login()` に渡します |
| 登録 | [登録_画面設計書](../../02_画面設計/200_アカウント/登録/登録_画面設計書.md) | [register](register_DTO設計書.md) | `RegisterService.save()` の引数の型です |
| アカウント有効化 | [アカウント有効化_画面設計書](../../02_画面設計/200_アカウント/アカウント有効化/アカウント有効化_画面設計書.md) | なし | 応答に本文がありません |
| パスワード変更 | [パスワード変更_画面設計書](../../02_画面設計/200_アカウント/パスワード変更/パスワード変更_画面設計書.md) | なし（間接: [account](account_DTO設計書.md)） | 現在のアカウントの `login` を表示します |
| パスワード再設定依頼 | [パスワード再設定依頼_画面設計書](../../02_画面設計/200_アカウント/パスワード再設定依頼/パスワード再設定依頼_画面設計書.md) | なし | 要求はメールアドレスの文字列だけです |
| パスワード再設定完了 | [パスワード再設定完了_画面設計書](../../02_画面設計/200_アカウント/パスワード再設定完了/パスワード再設定完了_画面設計書.md) | なし | 要求は画面のサービスが組み立てます |
| 設定 | [設定_画面設計書](../../02_画面設計/200_アカウント/設定/設定_画面設計書.md) | [account](account_DTO設計書.md) | フォームの値の型、保存後にアカウント状態を更新します |
| APIドキュメント | [APIドキュメント_画面設計書](../../02_画面設計/300_管理画面/APIドキュメント/APIドキュメント_画面設計書.md) | なし | API を呼びません |
| アプリケーション設定 | [アプリケーション設定_画面設計書](../../02_画面設計/300_管理画面/アプリケーション設定/アプリケーション設定_画面設計書.md) | [configuration](configuration_DTO設計書.md)、[sort-state](sort-state_DTO設計書.md) | 構成プロパティーとプロパティーソースの応答、並び替えの状態 |
| ヘルスチェック | [ヘルスチェック_画面設計書](../../02_画面設計/300_管理画面/ヘルスチェック/ヘルスチェック_画面設計書.md) | [health](health_DTO設計書.md) | 稼働状況の応答 |
| ログ | [ログ_画面設計書](../../02_画面設計/300_管理画面/ログ/ログ_画面設計書.md) | [log](log_DTO設計書.md)、[sort-state](sort-state_DTO設計書.md) | ロガーの一覧の応答、並び替えの状態 |
| メトリクス | [メトリクス_画面設計書](../../02_画面設計/300_管理画面/メトリクス/メトリクス_画面設計書.md) | [metrics](metrics_DTO設計書.md) | メトリクスとスレッドダンプの応答 |
| 銀行口座一覧 | [銀行口座一覧_画面設計書](../../02_画面設計/400_エンティティ/銀行口座/一覧/銀行口座一覧_画面設計書.md) | [bank-account](bank-account_DTO設計書.md)、[sort-state](sort-state_DTO設計書.md) | 一覧の取得、並び替え、削除ダイアログ |
| 銀行口座詳細 | [銀行口座詳細_画面設計書](../../02_画面設計/400_エンティティ/銀行口座/詳細/銀行口座詳細_画面設計書.md) | [bank-account](bank-account_DTO設計書.md) | リゾルバーの結果を `input` で受けます |
| 銀行口座登録・編集 | [銀行口座登録・編集_画面設計書](../../02_画面設計/400_エンティティ/銀行口座/登録・編集/銀行口座登録・編集_画面設計書.md) | [bank-account](bank-account_DTO設計書.md)、[user](user_DTO設計書.md) | フォームの値の型、ユーザーの選択肢 |
| 銀行口座削除 | [銀行口座削除_画面設計書](../../02_画面設計/400_エンティティ/銀行口座/削除/銀行口座削除_画面設計書.md) | [bank-account](bank-account_DTO設計書.md) | 削除対象 |
| ラベル一覧 | [ラベル一覧_画面設計書](../../02_画面設計/400_エンティティ/ラベル/一覧/ラベル一覧_画面設計書.md) | [label](label_DTO設計書.md)、[sort-state](sort-state_DTO設計書.md) | 一覧の取得、並び替え、削除ダイアログ |
| ラベル詳細 | [ラベル詳細_画面設計書](../../02_画面設計/400_エンティティ/ラベル/詳細/ラベル詳細_画面設計書.md) | [label](label_DTO設計書.md) | リゾルバーの結果を `input` で受けます |
| ラベル登録・編集 | [ラベル登録・編集_画面設計書](../../02_画面設計/400_エンティティ/ラベル/登録・編集/ラベル登録・編集_画面設計書.md) | [label](label_DTO設計書.md)、[operation](operation_DTO設計書.md) | フォームの値の型、取引の選択肢 |
| ラベル削除 | [ラベル削除_画面設計書](../../02_画面設計/400_エンティティ/ラベル/削除/ラベル削除_画面設計書.md) | [label](label_DTO設計書.md) | 削除対象 |
| 取引一覧 | [取引一覧_画面設計書](../../02_画面設計/400_エンティティ/取引/一覧/取引一覧_画面設計書.md) | [operation](operation_DTO設計書.md)、[sort-state](sort-state_DTO設計書.md) | 一覧の取得、並び替え、削除ダイアログ |
| 取引詳細 | [取引詳細_画面設計書](../../02_画面設計/400_エンティティ/取引/詳細/取引詳細_画面設計書.md) | [operation](operation_DTO設計書.md) | リゾルバーの結果を `input` で受けます |
| 取引登録・編集 | [取引登録・編集_画面設計書](../../02_画面設計/400_エンティティ/取引/登録・編集/取引登録・編集_画面設計書.md) | [operation](operation_DTO設計書.md)、[bank-account](bank-account_DTO設計書.md)、[label](label_DTO設計書.md) | フォームの値の型、銀行口座とラベルの選択肢 |
| 取引削除 | [取引削除_画面設計書](../../02_画面設計/400_エンティティ/取引/削除/取引削除_画面設計書.md) | [operation](operation_DTO設計書.md) | 削除対象 |
| ユーザ管理一覧 | [ユーザ管理一覧_画面設計書](../../02_画面設計/400_エンティティ/ユーザ管理/一覧/ユーザ管理一覧_画面設計書.md) | [user-management](user-management_DTO設計書.md)、[sort-state](sort-state_DTO設計書.md)、なし（間接: [account](account_DTO設計書.md)） | 一覧の取得、並び替え、有効・無効の切り替え、削除ダイアログ。現在のアカウントと行の `login` を比べます |
| ユーザ管理詳細 | [ユーザ管理詳細_画面設計書](../../02_画面設計/400_エンティティ/ユーザ管理/詳細/ユーザ管理詳細_画面設計書.md) | [user-management](user-management_DTO設計書.md) | リゾルバーの結果を `input` で受けます |
| ユーザ管理登録・編集 | [ユーザ管理登録・編集_画面設計書](../../02_画面設計/400_エンティティ/ユーザ管理/登録・編集/ユーザ管理登録・編集_画面設計書.md) | [user-management](user-management_DTO設計書.md)、なし（間接: [authority](authority_DTO設計書.md)） | フォームの値の型、権限の選択肢 |
| ユーザ管理削除 | [ユーザ管理削除_画面設計書](../../02_画面設計/400_エンティティ/ユーザ管理/削除/ユーザ管理削除_画面設計書.md) | [user-management](user-management_DTO設計書.md) | 削除対象 |
| 権限一覧 | [権限一覧_画面設計書](../../02_画面設計/400_エンティティ/権限/一覧/権限一覧_画面設計書.md) | [authority](authority_DTO設計書.md)、[sort-state](sort-state_DTO設計書.md) | 一覧の取得、並び替え、削除ダイアログ |
| 権限詳細 | [権限詳細_画面設計書](../../02_画面設計/400_エンティティ/権限/詳細/権限詳細_画面設計書.md) | [authority](authority_DTO設計書.md) | リゾルバーの結果を `input` で受けます |
| 権限登録 | [権限登録_画面設計書](../../02_画面設計/400_エンティティ/権限/登録/権限登録_画面設計書.md) | [authority](authority_DTO設計書.md) | フォームの値の型 |
| 権限削除 | [権限削除_画面設計書](../../02_画面設計/400_エンティティ/権限/削除/権限削除_画面設計書.md) | [authority](authority_DTO設計書.md) | 削除対象 |

画面がテンプレートに置いた共通部品 (`<jhi-alert-error />`、`<jhi-alert />`、`jhiTranslate` など) が使うモデルは、次の「共通部品」の表にまとめます。

### 3.2 共通部品

| 共通部品 | 画面設計書 | 使う DTO | 使い方 |
| --- | --- | --- | --- |
| ナビゲーションバー | [ナビゲーションバー_画面設計書](../../02_画面設計/共通/ナビゲーションバー/ナビゲーションバー_画面設計書.md) | なし（間接: [account](account_DTO設計書.md)、[profile-info](profile-info_DTO設計書.md)） | アカウントの表示、プロファイル情報によるメニューの切り替え |
| フッター | [フッター_画面設計書](../../02_画面設計/共通/フッター/フッター_画面設計書.md) | なし | |
| エラー画面 | [エラー画面_画面設計書](../../02_画面設計/共通/エラー画面/エラー画面_画面設計書.md) | なし | |
| アラート | [アラート_画面設計書](../../02_画面設計/共通/アラート/アラート_画面設計書.md) | [alert-error](alert-error_DTO設計書.md)、[headers](headers_DTO設計書.md) | エラーアラート、レスポンスヘッダーの読み取り |
| アカウント状態と認証 | [アカウント状態と認証_画面設計書](../../02_画面設計/共通/アカウント状態と認証/アカウント状態と認証_画面設計書.md) | [account](account_DTO設計書.md)、[login](login_DTO設計書.md) | アカウント状態の保持、ログインの要求 |
| ルートガードと認可 | [ルートガードと認可_画面設計書](../../02_画面設計/共通/ルートガードと認可/ルートガードと認可_画面設計書.md) | なし（間接: [account](account_DTO設計書.md)） | アカウントの `authorities` による判定 |
| HTTP共通処理 | [HTTP共通処理_画面設計書](../../02_画面設計/共通/HTTP共通処理/HTTP共通処理_画面設計書.md) | [headers](headers_DTO設計書.md) | 成功通知のヘッダーの読み取り |
| 国際化 | [国際化_画面設計書](../../02_画面設計/共通/国際化/国際化_画面設計書.md) | なし | |
| 画面タイトル | [画面タイトル_画面設計書](../../02_画面設計/共通/画面タイトル/画面タイトル_画面設計書.md) | なし | |
| ページリボン | [ページリボン_画面設計書](../../02_画面設計/共通/ページリボン/ページリボン_画面設計書.md) | [profile-info](profile-info_DTO設計書.md) | `ribbonEnv` の表示 |

### 3.3 画面から使われていないモデル

| モデル | 状況 |
| --- | --- |
| [request](request_DTO設計書.md) | 本体から参照していません。バレルの `app/core/request` が再エクスポートするだけです |
| [navbar-item](navbar-item_DTO設計書.md) | 本体にも単体テストにも import している箇所がありません |
| [problem-details](problem-details_DTO設計書.md) | 本体から参照していません。単体テストの `src/app/shared/alert/alert-error.spec.ts` だけが使います |
| [filter](filter_DTO設計書.md) | 共通部品 `Filter`（`jhi-filter`）だけが `IFilterOptions` を使います。`Filter` を使っている画面はありません。`FilterOption` と `FilterOptions` は単体テストだけが使います |

## 4. 記載の約束

- 「必須」はプロパティーを省略できないこと、「任意」は省略できること（`?`）を表します。`null` を取り得るかどうかは「型」の欄に「または `null`」と書きます。
- 型の共用型は、表のセルでは「または」でつなぎます。
- サービスやフォームサービスのファイルの中で export されている型（`PartialUpdate` で始まる型、`Rest` を含む型、`FormGroup` で終わる型、`AlertModel`）は、関連するモデルの設計書の「5. 変換規則」に書きます。
- ライブラリーのクラス名（Spring Boot Actuator、JHipster のライブラリー）はバッククォートで囲まず、出典を添えます。これらの名前はフロントエンドとバックエンドのどちらのリポジトリのコードにも現れません。
- コードから確認できないことは「コードからは確認できない」と書きます。コードから読めるが実行して確かめていない動きは「コードからは〜と読れる」と書きます。

## 5. 関連文書

- [アプリ_画面設計書](../../02_画面設計/000_アプリ/アプリ/アプリ_画面設計書.md)
- [電文レイアウト（索引）](../02_電文レイアウト/README.md)
