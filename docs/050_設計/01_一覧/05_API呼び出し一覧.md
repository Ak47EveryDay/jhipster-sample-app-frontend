# API呼び出し一覧

## 0. 改訂履歴

| 項番 | バージョン | 改訂内容 |
| --- | --- | --- |
| 1 | 1.0 | 新規作成 |

## 1. 概要

本文書は、フロントエンドがバックエンドを呼ぶ API を、呼び出し元（画面・部品）と操作ごとに一覧にしたものである。すべての記述は現在のコード（フロントエンドのコミット `570a360`、バックエンドのコミット `423e462`）に基づく。

- パスは `serverApiUrl` を除いた `api/...`、`management/...` の形で書く。パスパラメーターは `{id}`、`{login}`、`{name}` と書く。
- 電文の内容（要求・応答の項目、エラーの形式）は各 [電文レイアウト](../03_IF設計/02_電文レイアウト/README.md) を参照すること。本文書では呼び出し元と目的だけを扱う。
- 一覧の取得のうち `httpResource` と書いたものは、`HttpClient` を直接使わず Angular の `httpResource` で要求するものである（サービスの `*Resource`）。パラメーターのシグナルが変わるたびに再要求される。
- フロントエンドのサービスに定義があるが、本体から呼ばれていないものも「未使用」として載せた。

## 2. 認証・アカウント

| No. | 画面・部品 | 操作 | メソッド | パス | フロントエンドのサービスとメソッド | 備考 |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | ログイン | Sign in ボタン | POST | `api/authenticate` | `AuthServerProvider.login()` | トークンを保存する |
| 2 | 全画面（ページフレーム `Main`） | 初期表示（自動ログイン） | GET | `api/account` | `AccountService.fetch()`（`identity()` から） | キャッシュがあり、`force` が `false` のときは呼ばない |
| 3 | ログイン | ログイン成功後 | GET | `api/account` | `AccountService.fetch()`（`identity(true)` から） | キャッシュを無視して再取得する |
| 4 | ルートガード | 保護されたルートに入るとき | GET | `api/account` | `AccountService.fetch()`（`identity()` から） | キャッシュがあれば呼ばない |
| 5 | 設定 | Save ボタン | POST | `api/account` | `AccountService.save()` | － |
| 6 | 登録 | Register ボタン | POST | `api/register` | `RegisterService.save()` | － |
| 7 | アカウント有効化 | 初期表示 | GET | `api/activate` | `ActivateService.get(key)` | クエリパラメーター `key` |
| 8 | パスワード変更 | Save ボタン | POST | `api/account/change-password` | `PasswordService.save()` | － |
| 9 | パスワード再設定依頼 | Reset password ボタン | POST | `api/account/reset-password/init` | `PasswordResetInitService.save()` | 本文はメールアドレスの文字列 |
| 10 | パスワード再設定完了 | Validate new password ボタン | POST | `api/account/reset-password/finish` | `PasswordResetFinishService.save()` | － |

- 電文は [認証_電文レイアウト](../03_IF設計/02_電文レイアウト/認証_電文レイアウト.md) と [アカウント_電文レイアウト](../03_IF設計/02_電文レイアウト/アカウント_電文レイアウト.md) を参照する。
- ログアウトは API を呼ばない（`AuthServerProvider.logout()` はトークンを削除するだけである）。

## 3. 銀行口座

| No. | 画面・部品 | 操作 | メソッド | パス | フロントエンドのサービスとメソッド | 備考 |
| --- | --- | --- | --- | --- | --- | --- |
| 11 | 銀行口座一覧 | 初期表示、Refresh list、並び替え、削除後の再取得 | GET | `api/bank-accounts` | `BankAccountsService.bankAccountsResource`（`httpResource`） | クエリパラメーター `eagerload=true`、`sort` |
| 12 | 取引登録・編集 | Bank Account の選択肢の取得 | GET | `api/bank-accounts` | `BankAccountService.query()` | 引数なし |
| 13 | 銀行口座詳細・編集 | リゾルバー（画面を開くとき） | GET | `api/bank-accounts/{id}` | `BankAccountService.find(id)` | 登録（`new`）のときは呼ばない |
| 14 | 銀行口座登録 | Save ボタン | POST | `api/bank-accounts` | `BankAccountService.create()` | － |
| 15 | 銀行口座編集 | Save ボタン | PUT | `api/bank-accounts/{id}` | `BankAccountService.update()` | － |
| 16 | 銀行口座削除 | Delete ボタン（削除ダイアログ） | DELETE | `api/bank-accounts/{id}` | `BankAccountService.delete(id)` | － |
| 17 | （未使用） | － | PATCH | `api/bank-accounts/{id}` | `BankAccountService.partialUpdate()` | 本体から呼ばれていない |

電文は [銀行口座_電文レイアウト](../03_IF設計/02_電文レイアウト/銀行口座_電文レイアウト.md) を参照する。銀行口座登録・編集の User の選択肢は `api/users` であり、8 章の No. 48 に載せている。

## 4. ラベル

| No. | 画面・部品 | 操作 | メソッド | パス | フロントエンドのサービスとメソッド | 備考 |
| --- | --- | --- | --- | --- | --- | --- |
| 18 | ラベル一覧 | 初期表示、Refresh list、並び替え、削除後の再取得 | GET | `api/labels` | `LabelsService.labelsResource`（`httpResource`） | クエリパラメーター `sort` |
| 19 | 取引登録・編集 | Label の選択肢の取得 | GET | `api/labels` | `LabelService.query()` | 引数なし |
| 20 | ラベル詳細・編集 | リゾルバー（画面を開くとき） | GET | `api/labels/{id}` | `LabelService.find(id)` | 登録（`new`）のときは呼ばない |
| 21 | ラベル登録 | Save ボタン | POST | `api/labels` | `LabelService.create()` | － |
| 22 | ラベル編集 | Save ボタン | PUT | `api/labels/{id}` | `LabelService.update()` | － |
| 23 | ラベル削除 | Delete ボタン（削除ダイアログ） | DELETE | `api/labels/{id}` | `LabelService.delete(id)` | － |
| 24 | （未使用） | － | PATCH | `api/labels/{id}` | `LabelService.partialUpdate()` | 本体から呼ばれていない |

電文は [ラベル_電文レイアウト](../03_IF設計/02_電文レイアウト/ラベル_電文レイアウト.md) を参照する。

## 5. 取引

| No. | 画面・部品 | 操作 | メソッド | パス | フロントエンドのサービスとメソッド | 備考 |
| --- | --- | --- | --- | --- | --- | --- |
| 25 | 取引一覧 | 初期表示、Refresh list、並び替え、無限スクロール | GET | `api/operations` | `OperationsService.operationsResource`（`httpResource`） | クエリパラメーター `size=20`、`eagerload=true`、`sort`、`page` |
| 26 | ラベル登録・編集 | Operation の選択肢の取得 | GET | `api/operations` | `OperationService.query()` | 引数なし |
| 27 | 取引詳細・編集 | リゾルバー（画面を開くとき） | GET | `api/operations/{id}` | `OperationService.find(id)` | 登録（`new`）のときは呼ばない |
| 28 | 取引登録 | Save ボタン | POST | `api/operations` | `OperationService.create()` | － |
| 29 | 取引編集 | Save ボタン | PUT | `api/operations/{id}` | `OperationService.update()` | － |
| 30 | 取引削除 | Delete ボタン（削除ダイアログ） | DELETE | `api/operations/{id}` | `OperationService.delete(id)` | － |
| 31 | （未使用） | － | PATCH | `api/operations/{id}` | `OperationService.partialUpdate()` | 本体から呼ばれていない |

電文は [取引_電文レイアウト](../03_IF設計/02_電文レイアウト/取引_電文レイアウト.md) を参照する。

## 6. ユーザ管理

| No. | 画面・部品 | 操作 | メソッド | パス | フロントエンドのサービスとメソッド | 備考 |
| --- | --- | --- | --- | --- | --- | --- |
| 32 | ユーザ管理一覧 | 初期表示、Refresh list、ページ切り替え、並び替え、削除後の再取得 | GET | `api/admin/users` | `UserManagementsService.userManagementsResource`（`httpResource`） | クエリパラメーター `page`、`size=20`、`sort` |
| 33 | ユーザ管理詳細・編集 | リゾルバー（画面を開くとき） | GET | `api/admin/users/{login}` | `UserManagementService.find(login)` | 登録（`new`）のときは呼ばない |
| 34 | ユーザ管理登録 | Save ボタン | POST | `api/admin/users` | `UserManagementService.create()` | － |
| 35 | ユーザ管理一覧、ユーザ管理編集 | Activated / Deactivated ボタン、Save ボタン | PUT | `api/admin/users/{login}` | `UserManagementService.update()` | 有効・無効の切り替えも同じ API を使う |
| 36 | ユーザ管理削除 | Delete ボタン（削除ダイアログ） | DELETE | `api/admin/users/{login}` | `UserManagementService.delete(login)` | － |
| 37 | （未使用） | － | PATCH | `api/admin/users/{login}` | `UserManagementService.partialUpdate()` | 本体から呼ばれていない。バックエンドにも対応するエンドポイントがない |

電文は [ユーザ管理_電文レイアウト](../03_IF設計/02_電文レイアウト/ユーザ管理_電文レイアウト.md) を参照する。

## 7. 権限

| No. | 画面・部品 | 操作 | メソッド | パス | フロントエンドのサービスとメソッド | 備考 |
| --- | --- | --- | --- | --- | --- | --- |
| 38 | 権限一覧 | 初期表示、Refresh list、並び替え、削除後の再取得 | GET | `api/authorities` | `AuthoritiesService.authoritiesResource`（`httpResource`） | クエリパラメーター `sort` |
| 39 | ユーザ管理登録・編集 | Profiles の選択肢の取得 | GET | `api/authorities` | `AuthoritiesService.authoritiesResource`（`authorityService.authoritiesParams.set({})`） | パラメーターなし |
| 40 | 権限詳細 | リゾルバー（画面を開くとき） | GET | `api/authorities/{name}` | `AuthorityService.find(name)` | 登録（`new`）のときは呼ばない |
| 41 | 権限登録 | Save ボタン | POST | `api/authorities` | `AuthorityService.create()` | － |
| 42 | 権限削除 | Delete ボタン（削除ダイアログ） | DELETE | `api/authorities/{name}` | `AuthorityService.delete(name)` | － |

電文は [権限_電文レイアウト](../03_IF設計/02_電文レイアウト/権限_電文レイアウト.md) を参照する。

## 8. 管理

| No. | 画面・部品 | 操作 | メソッド | パス | フロントエンドのサービスとメソッド | 備考 |
| --- | --- | --- | --- | --- | --- | --- |
| 43 | ページリボン、ナビゲーションバー | 初期表示 | GET | `management/info` | `ProfileService.getProfileInfo()` | `shareReplay()` で 1 回だけ呼ぶ |
| 44 | アプリケーション設定 | 初期表示 | GET | `management/configprops` | `ConfigurationService.getBeans()` | － |
| 45 | アプリケーション設定 | 初期表示 | GET | `management/env` | `ConfigurationService.getPropertySources()` | － |
| 46 | ヘルスチェック | 初期表示、Refresh | GET | `management/health` | `HealthService.checkHealth()` | 503 のときも本文を表示に使う |
| 47 | ログ | 初期表示、レベル変更後の再取得 | GET | `management/loggers` | `LogsService.findAll()` | － |
| 48 | ログ | レベルのボタン（TRACE 〜 OFF） | POST | `management/loggers/{name}` | `LogsService.changeLevel()` | 本文は `{ configuredLevel }` |
| 49 | メトリクス | 初期表示、Refresh | GET | `management/jhimetrics` | `MetricsService.getMetrics()` | － |
| 50 | メトリクス | 初期表示、Refresh | GET | `management/threaddump` | `MetricsService.threadDump()` | No. 49 と `combineLatest()` で同時に呼ぶ |
| 51 | 銀行口座登録・編集 | User の選択肢の取得 | GET | `api/users` | `UserService.query()` | 引数なし。管理用ではないが、適切なグループがないためここに載せる |

電文は [管理_電文レイアウト](../03_IF設計/02_電文レイアウト/管理_電文レイアウト.md) を参照する。

## 9. バックエンドが提供するが、フロントエンドが呼ばない API

| メソッド | パス | 備考 | 根拠 |
| --- | --- | --- | --- |
| GET | `api/authenticate` | 認証済みかどうかの確認 | バックエンドの `src/main/java/io/github/jhipster/sample/web/rest/AuthenticateController.java` |
| PATCH | `api/bank-accounts/{id}`、`api/labels/{id}`、`api/operations/{id}` | フロントエンドに `partialUpdate()` があるが、本体から呼ばれていない | 各サービスの `partialUpdate()` |
| GET | `management/prometheus`、`management/jhiopenapigroups`、`management/logfile`、`management/caches`、`management/liquibase` | 公開されている管理エンドポイント。フロントエンドは呼ばない | バックエンドの `src/main/resources/config/application.yml`（`management.endpoints.web.exposure.include`） |

## 10. 参照資料

- [電文レイアウト（索引）](../03_IF設計/02_電文レイアウト/README.md)
- [共通_電文レイアウト](../03_IF設計/02_電文レイアウト/共通_電文レイアウト.md)
- [画面一覧](01_画面一覧.md)
- [画面遷移一覧](02_画面遷移一覧.md)
- [HTTP共通処理_画面設計書](../02_画面設計/共通/HTTP共通処理/HTTP共通処理_画面設計書.md)
- [アカウント状態と認証_画面設計書](../02_画面設計/共通/アカウント状態と認証/アカウント状態と認証_画面設計書.md)
