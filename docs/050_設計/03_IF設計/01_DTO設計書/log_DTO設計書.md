# log DTO設計書

## 0. 改訂履歴

| 項番 | バージョン | 改訂内容 |
| --- | --- | --- |
| 1 | 1.0 | 新規作成 |

## 1. 概要

| 項目 | 内容 | 根拠 |
| --- | --- | --- |
| ファイル | `src/app/admin/logs/log.model.ts` | 同左 |
| モデル化対象 | ログ画面が扱う、ロガーの一覧 (`management/loggers`) の応答と、画面で並び替えるロガー 1 行分のデータ | `src/app/admin/logs/logs.service.ts`（`findAll()`、`changeLevel()`） |
| 対応するバックエンド | ライブラリーの応答（Spring Boot Actuator のロガーのエンドポイント）であり、バックエンドの `src/main/java/` 配下に対応するクラスはない。バックエンドは `management.endpoints.web.exposure.include` に `loggers` を指定している | バックエンドの `pom.xml`（`spring-boot-starter-actuator`）、バックエンドの `src/main/resources/config/application.yml` |
| エクスポート | 4 つ（`type` 1、`interface` 2、`class` 1） | `src/app/admin/logs/log.model.ts` |
| 依存するモデル | なし | 同上 |

## 2. 型定義一覧

| 型名 | 種別 | 用途 | 根拠 |
| --- | --- | --- | --- |
| `Level` | `type` | ログレベル 6 種類 | `src/app/admin/logs/log.model.ts`（`Level`） |
| `Logger` | `interface` | ロガー 1 つの状態（設定レベルと実効レベル） | 同上（`Logger`） |
| `LoggersResponse` | `interface` | `management/loggers` の応答全体 | 同上（`LoggersResponse`） |
| `Log` | `class`（コンストラクターの引数で各項目を `public` のプロパティーにする） | 画面の行 1 行分。ロガー名と実効レベル | 同上（`Log`） |

## 3. 項目定義

対応するバックエンドはライブラリーの応答（Spring Boot Actuator の LoggersEndpoint）である。クラス名はリポジトリのコードには現れない（バックエンドの `pom.xml` の `spring-boot-starter-actuator` に含まれる）。以下の表の LoggersDescriptor、LoggerLevelsDescriptor、SingleLoggerLevelsDescriptor は、LoggersEndpoint の応答を作る内部クラスである。

### `LoggersResponse`

| 項目 | 型 | 必須 | 説明 | 対応するバックエンド (DTO / field) | 根拠 |
| --- | --- | --- | --- | --- | --- |
| `levels` | `Level` の配列 | 必須 | ログレベルの一覧。画面は使わない（画面のボタンは 6 階級を固定で持つ） | ライブラリーの応答: LoggersEndpoint の応答を作る LoggersDescriptor の `levels` | `src/app/admin/logs/log.model.ts`（`levels`）、`src/app/admin/logs/logs.ts`（`findAndExtractLoggers()`） |
| `loggers` | `Logger` を値にとるレコード（キーはロガー名） | 必須 | ロガー名をキーとしたロガーの状態 | ライブラリーの応答: LoggersDescriptor の `loggers` | 同上 |

- ライブラリーの応答には groups もあるが、`LoggersResponse` は宣言していない。
- ライブラリーのログレベルの列挙には FATAL もあるが、フロントエンドの `Level` は宣言していない。`levels` に FATAL が含まれるかどうかはコードからは確認できない。

### `Logger`

| 項目 | 型 | 必須 | 説明 | 対応するバックエンド (DTO / field) | 根拠 |
| --- | --- | --- | --- | --- | --- |
| `configuredLevel` | `Level` または `null` | 必須 | 明示的に設定されているレベル。設定がなければ `null`。画面は使わない | ライブラリーの応答: LoggerLevelsDescriptor の `configuredLevel` | `src/app/admin/logs/log.model.ts`（`configuredLevel`） |
| `effectiveLevel` | `Level` | 必須 | 実際に効いているレベル。画面の行の `level` になる | ライブラリーの応答: SingleLoggerLevelsDescriptor の `effectiveLevel` | 同上（`effectiveLevel`）、`src/app/admin/logs/logs.ts`（`findAndExtractLoggers()`） |

### `Level`

| 値 | 画面のボタン | 根拠 |
| --- | --- | --- |
| `'TRACE'` | TRACE | `src/app/admin/logs/log.model.ts`（`Level`）、`src/app/admin/logs/logs.html` |
| `'DEBUG'` | DEBUG | 同上 |
| `'INFO'` | INFO | 同上 |
| `'WARN'` | WARN | 同上 |
| `'ERROR'` | ERROR | 同上 |
| `'OFF'` | OFF | 同上 |

### `Log`

| 項目 | 型 | 必須 | 説明 | 対応するバックエンド (DTO / field) | 根拠 |
| --- | --- | --- | --- | --- | --- |
| `name` | `string` | 必須 | ロガー名。`changeLevel()` の URL に使う。絞り込みと並び替えの対象 | 対応するバックエンドの型はない（`loggers` のキーから作る） | `src/app/admin/logs/log.model.ts`（`name`）、`src/app/admin/logs/logs.ts`（`findAndExtractLoggers()`、`changeLevel()`） |
| `level` | `Level` | 必須 | 実効レベル。ボタンの強調表示と並び替えに使う | 対応するバックエンドの型はない（`effectiveLevel` から作る） | 同上 |

## 4. 使用箇所

本体（単体テストを除く）のうち、このモデルを import しているファイルである。

| 分類 | ファイル | クラス・関数 | 使っている型 | 用途 |
| --- | --- | --- | --- | --- |
| サービス | `src/app/admin/logs/logs.service.ts` | `LogsService` | `Level`、`LoggersResponse` | `changeLevel()` の引数、`findAll()` の戻り値の Observable の型 |
| 画面 | `src/app/admin/logs/logs.ts` | `Logs` | `Level`、`Log`、`LoggersResponse` | シグナル `loggers`（`Log` の配列または `undefined`）、`computed` の `filteredAndOrderedLoggers`、`changeLevel()` の引数、`findAndExtractLoggers()` の引数 |

使う画面と共通部品は次のとおりである。

- ログ（[ログ_画面設計書](../../02_画面設計/300_管理画面/ログ/ログ_画面設計書.md)）。サービスと画面の型として使う。
- `Logger` はモデルのファイルの中だけで参照する。
- このモデルを画面のテンプレートで直接 import する箇所はない（テンプレートは `filteredAndOrderedLoggers()` の値を読む）。

単体テストでは `src/app/admin/logs/logs.spec.ts` が `Log` と `LoggersResponse` を使う。

関連文書:

- [アプリ_画面設計書](../../02_画面設計/000_アプリ/アプリ/アプリ_画面設計書.md)（6.6、7.5）
- [管理_電文レイアウト](../02_電文レイアウト/管理_電文レイアウト.md)

## 5. 変換規則

### 5.1 応答から `Log` の配列への変換（`Logs.findAndExtractLoggers()`）

- `logsService.findAll()` の応答 (`LoggersResponse`) から、`Object.entries(response.loggers)` でロガー名と `Logger` の組を取り出す。
- 各組を `new Log(key, logger.effectiveLevel)` にして、シグナル `loggers` に入れる。`configuredLevel` は使わない。
- 失敗したときはシグナル `loggers` に空配列を入れる。読み込み中はシグナル `isLoading` が `true` である。

### 5.2 ログレベルの変更（`Logs.changeLevel()`、`LogsService.changeLevel()`）

- 画面は行ごとに TRACE、DEBUG、INFO、WARN、ERROR、OFF の 6 つのボタンを持ち、`changeLevel(logger.name, 'TRACE')` の形で呼ぶ。ボタンの強調表示は `logger.level` と値が一致するかで決まる。
- `LogsService.changeLevel(name, configuredLevel)` は `POST management/loggers/{name}` に `{ configuredLevel }` を送る。URL のロガー名は `encodeURIComponent()` でエンコードしていない。
- 成功したら `findAndExtractLoggers()` で一覧を取り直す（`src/app/admin/logs/logs.ts`）。

### 5.3 画面での絞り込みと並び替え（`Logs.filteredAndOrderedLoggers`）

- `computed` は、`loggers()`（なければ空配列）のうち、`name` が絞り込みの文字列 (`filter`) を大文字・小文字を区別なく含むものだけを残す。
- 残ったものを `sortState`（初期値は `predicate: 'name'`、`order: 'asc'`）に従い `sortService.startSort()` で並び替える。比較が等しいときの予備の並び順は `name` の昇順である。
- テンプレートはロガー名を `slice: 0 : 140` で 140 文字までに切って表示する（`src/app/admin/logs/logs.html`）。
