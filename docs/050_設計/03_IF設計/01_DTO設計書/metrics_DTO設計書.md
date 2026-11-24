# metrics DTO設計書

## 0. 改訂履歴

| 項番 | バージョン | 改訂内容 |
| --- | --- | --- |
| 1 | 1.0 | 新規作成 |

## 1. 概要

| 項目 | 内容 | 根拠 |
| --- | --- | --- |
| ファイル | `src/app/admin/metrics/metrics.model.ts` | 同左 |
| モデル化対象 | メトリクス画面が表示する、アプリケーションのメトリクス (`management/jhimetrics`) とスレッドダンプ (`management/threaddump`) の応答 | `src/app/admin/metrics/metrics.service.ts`（`getMetrics()`、`threadDump()`） |
| 対応するバックエンド | ライブラリーの応答であり、バックエンドの `src/main/java/` 配下に対応するクラスはない。メトリクスは JHipster のライブラリー (`jhipster-framework`) のエンドポイント、スレッドダンプは Spring Boot Actuator のエンドポイントである | バックエンドの `pom.xml`（`jhipster-framework`、`spring-boot-starter-actuator`）、バックエンドの `src/main/resources/config/application.yml`（`management.endpoints.web.exposure.include`、`management.endpoint.jhimetrics.access`、`management.metrics.distribution.percentiles`） |
| エクスポート | 18 つ（`interface` 15、`type` 1、`enum` 2） | `src/app/admin/metrics/metrics.model.ts` |
| 依存するモデル | なし | 同上 |

## 2. 型定義一覧

| 型名 | 種別 | 用途 | 根拠 |
| --- | --- | --- | --- |
| `MetricsModel` | `interface` | メトリクスの応答全体 | `src/app/admin/metrics/metrics.model.ts`（`MetricsModel`） |
| `JvmMetrics` | `interface` | JVM のメモリ領域 1 つの使用量 | 同上（`JvmMetrics`） |
| `Databases` | `interface` | データベース接続プールの統計 | 同上（`Databases`） |
| `Value` | `interface` | 値 1 つを包む型 | 同上（`Value`） |
| `MetricsWithPercentile` | `interface` | 回数、平均、最大、パーセンタイルを持つ統計 | 同上（`MetricsWithPercentile`） |
| `HttpServerRequests` | `interface` | HTTP リクエストの統計（全体とステータスコード別） | 同上（`HttpServerRequests`） |
| `MaxMeanCount` | `interface` | 最大、平均、回数 | 同上（`MaxMeanCount`） |
| `CacheMetrics` | `interface` | キャッシュ 1 つの統計 | 同上（`CacheMetrics`） |
| `GarbageCollector` | `interface` | ガベージコレクションの統計 | 同上（`GarbageCollector`） |
| `Services` | `type` | エンドポイントと HTTP メソッドごとの統計のマップ | 同上（`Services`） |
| `ProcessMetrics` | `interface` | プロセスとシステムの統計 | 同上（`ProcessMetrics`） |
| `ThreadDump` | `interface` | スレッドダンプの応答全体 | 同上（`ThreadDump`） |
| `Thread` | `interface` | スレッド 1 つの情報 | 同上（`Thread`） |
| `LockInfo` | `interface` | ロックの情報 | 同上（`LockInfo`） |
| `LockedMonitor` | `interface` | スレッドが保持するモニターの情報 | 同上（`LockedMonitor`） |
| `StackTrace` | `interface` | スタックトレースの 1 要素 | 同上（`StackTrace`） |
| `HttpMethod` | `enum` | HTTP メソッド 5 種類 | 同上（`HttpMethod`） |
| `ThreadState` | `enum` | スレッドの状態 5 種類 | 同上（`ThreadState`） |

## 3. 項目定義

対応するバックエンドはライブラリーの応答である。以下では、`management/jhimetrics` の応答を「メトリクスの応答」、`management/threaddump` の応答を「スレッドダンプの応答」と書く。エンドポイントのクラス名（JHipster の JHipsterMetricsEndpoint、Spring Boot Actuator の ThreadDumpEndpoint）はリポジトリのコードには現れない。

メトリクスの応答は、ライブラリーのクラスが `jvm`、`databases`、`http.server.requests`、`cache`、`garbageCollector`、`services`、`processMetrics` の 7 つのグループを組み立てて返す。グループより下のキーの内容は実行時のメトリクスの登録に依存するため、コードからは確認できない。

### `MetricsModel`

| 項目 | 型 | 必須 | 説明 | 対応するバックエンド (DTO / field) | 根拠 |
| --- | --- | --- | --- | --- | --- |
| `jvm` | `JvmMetrics` を値にとるレコード | 必須 | JVM のメモリ領域ごとの使用量。キーは領域名 | メトリクスの応答の `jvm` | `src/app/admin/metrics/metrics.model.ts`（`jvm`）、`src/app/admin/metrics/metrics.html` |
| `databases` | `Databases` | 必須 | データベース接続プールの統計 | メトリクスの応答の `databases` | 同上 |
| `'http.server.requests'` | `HttpServerRequests` | 必須 | HTTP リクエストの統計（ステータスコード別） | メトリクスの応答の `http.server.requests` | 同上 |
| `cache` | `CacheMetrics` を値にとるレコード | 必須 | キャッシュごとの統計。キーはキャッシュ名 | メトリクスの応答の `cache` | 同上 |
| `garbageCollector` | `GarbageCollector` | 必須 | ガベージコレクションの統計 | メトリクスの応答の `garbageCollector` | 同上 |
| `services` | `Services` | 必須 | エンドポイントと HTTP メソッドごとの統計 | メトリクスの応答の `services` | 同上 |
| `processMetrics` | `ProcessMetrics` | 必須 | プロセスとシステムの統計 | メトリクスの応答の `processMetrics` | 同上 |

### `JvmMetrics`

| 項目 | 型 | 必須 | 説明 | 対応するバックエンド (DTO / field) | 根拠 |
| --- | --- | --- | --- | --- | --- |
| `committed` | `number` | 必須 | 確保済みのメモリ量。画面は 1048576 で割って MB で表示する | メトリクスの応答の JVM のメモリの `committed` | `src/app/admin/metrics/metrics.model.ts`（`committed`）、`src/app/admin/metrics/blocks/jvm-memory/jvm-memory.html` |
| `max` | `number` | 必須 | 最大のメモリ量。画面は 1048576 で割って MB で表示する。`-1` のときはプログレスバーを描かない | メトリクスの応答の JVM のメモリの `max` | 同上 |
| `used` | `number` | 必須 | 使用中のメモリ量。画面は 1048576 で割って MB で表示する | メトリクスの応答の JVM のメモリの `used` | 同上 |

### `Databases`

| 項目 | 型 | 必須 | 説明 | 対応するバックエンド (DTO / field) | 根拠 |
| --- | --- | --- | --- | --- | --- |
| `min` | `Value` | 必須 | 接続数の最小値 | メトリクスの応答のデータベースの `min` | `src/app/admin/metrics/metrics.model.ts`（`min`）、`src/app/admin/metrics/blocks/metrics-datasource/metrics-datasource.html` |
| `idle` | `Value` | 必須 | 待機中の接続数 | メトリクスの応答のデータベースの `idle` | 同上 |
| `max` | `Value` | 必須 | 接続数の最大値 | メトリクスの応答のデータベースの `max` | 同上 |
| `usage` | `MetricsWithPercentile` | 必須 | Connection Pool Usage の統計（画面の見出しに time in milliseconds がある）。画面は回数、平均、最小、パーセンタイル、最大を表示する | メトリクスの応答のデータベースの `usage` | 同上 |
| `pending` | `Value` | 必須 | `pending` の値。画面は表示しない | メトリクスの応答のデータベースの `pending` | `src/app/admin/metrics/metrics.model.ts`（`pending`） |
| `active` | `Value` | 必須 | 使用中の接続数。画面は Connection Pool Usage の active として表示する | メトリクスの応答のデータベースの `active` | 同上、`src/app/admin/metrics/blocks/metrics-datasource/metrics-datasource.html` |
| `acquire` | `MetricsWithPercentile` | 必須 | 接続の取得の統計。画面は回数、平均、最小、パーセンタイル、最大を表示する | メトリクスの応答のデータベースの `acquire` | 同上 |
| `creation` | `MetricsWithPercentile` | 必須 | 接続の生成の統計。画面は回数、平均、最小、パーセンタイル、最大を表示する | メトリクスの応答のデータベースの `creation` | 同上 |
| `connections` | `Value` | 必須 | `connections` の値。画面は表示しない | メトリクスの応答のデータベースの `connections` | `src/app/admin/metrics/metrics.model.ts`（`connections`） |

### `Value`

| 項目 | 型 | 必須 | 説明 | 対応するバックエンド (DTO / field) | 根拠 |
| --- | --- | --- | --- | --- | --- |
| `value` | `number` | 必須 | 値そのもの | メトリクスの応答の `value` | `src/app/admin/metrics/metrics.model.ts`（`value`）、`src/app/admin/metrics/blocks/metrics-datasource/metrics-datasource.html` |

### `MetricsWithPercentile`

| 項目 | 型 | 必須 | 説明 | 対応するバックエンド (DTO / field) | 根拠 |
| --- | --- | --- | --- | --- | --- |
| `'0.0'` | `number` | 必須 | パーセンタイル 0（最小に近い値）。画面は Min の列に表示する | メトリクスの応答の `'0.0'` | `src/app/admin/metrics/metrics.model.ts`（`'0.0'`）、`src/app/admin/metrics/blocks/metrics-datasource/metrics-datasource.html` |
| `'0.5'` | `number` | 必須 | パーセンタイル 50。画面は p50 の列に表示する | メトリクスの応答の `'0.5'` | 同上 |
| `'0.75'` | `number` | 必須 | パーセンタイル 75。画面は p75 の列に表示する | メトリクスの応答の `'0.75'` | 同上 |
| `'0.95'` | `number` | 必須 | パーセンタイル 95。画面は p95 の列に表示する | メトリクスの応答の `'0.95'` | 同上 |
| `'0.99'` | `number` | 必須 | パーセンタイル 99。画面は p99 の列に表示する | メトリクスの応答の `'0.99'` | 同上 |
| `'1.0'` | `number` | 必須 | パーセンタイル 100。画面は表示しない | メトリクスの応答の `'1.0'` | `src/app/admin/metrics/metrics.model.ts`（`'1.0'`） |
| `max` | `number` | 必須 | 最大値 | メトリクスの応答の `max` | 同上、`src/app/admin/metrics/blocks/metrics-datasource/metrics-datasource.html` |
| `totalTime` | `number` | 必須 | 合計時間。画面は表示しない | メトリクスの応答の `totalTime` | `src/app/admin/metrics/metrics.model.ts`（`totalTime`） |
| `mean` | `number` | 必須 | 平均値 | メトリクスの応答の `mean` | 同上、`src/app/admin/metrics/blocks/metrics-datasource/metrics-datasource.html` |
| `count` | `number` | 必須 | 回数 | メトリクスの応答の `count` | 同上 |

- パーセンタイルの 6 値は、バックエンドの設定の `management.metrics.distribution.percentiles` の `all` の値 (`0`、`0.5`、`0.75`、`0.95`、`0.99`、`1.0`) に対応する（バックエンドの `src/main/resources/config/application.yml`）。

### `HttpServerRequests`

| 項目 | 型 | 必須 | 説明 | 対応するバックエンド (DTO / field) | 根拠 |
| --- | --- | --- | --- | --- | --- |
| `all` | `count: number` を持つオブジェクト | 必須 | リクエストの総数。画面はステータスコード別の割合を求める分母に使う | メトリクスの応答の `http.server.requests` の `all` | `src/app/admin/metrics/metrics.model.ts`（`all`）、`src/app/admin/metrics/blocks/metrics-request/metrics-request.html` |
| `percode` | `MaxMeanCount` を値にとるレコード | 必須 | ステータスコードをキーとした統計 | メトリクスの応答の `http.server.requests` の `percode` | 同上 |

### `MaxMeanCount`

| 項目 | 型 | 必須 | 説明 | 対応するバックエンド (DTO / field) | 根拠 |
| --- | --- | --- | --- | --- | --- |
| `max` | `number` | 必須 | 最大の所要時間 | メトリクスの応答の `max` | `src/app/admin/metrics/metrics.model.ts`（`MaxMeanCount.max`）、`src/app/admin/metrics/blocks/metrics-request/metrics-request.html` |
| `mean` | `number` | 必須 | 平均の所要時間 | メトリクスの応答の `mean` | 同上、`src/app/admin/metrics/blocks/metrics-endpoints-requests/metrics-endpoints-requests.html` |
| `count` | `number` | 必須 | 回数 | メトリクスの応答の `count` | 同上 |

### `CacheMetrics`

| 項目 | 型 | 必須 | 説明 | 対応するバックエンド (DTO / field) | 根拠 |
| --- | --- | --- | --- | --- | --- |
| `'cache.gets.miss'` | `number` | 必須 | キャッシュの取得に失敗した回数 | メトリクスの応答のキャッシュの `'cache.gets.miss'` | `src/app/admin/metrics/metrics.model.ts`（`'cache.gets.miss'`）、`src/app/admin/metrics/blocks/metrics-cache/metrics-cache.html` |
| `'cache.puts'` | `number` | 必須 | キャッシュへの格納の回数 | メトリクスの応答のキャッシュの `'cache.puts'` | 同上 |
| `'cache.gets.hit'` | `number` | 必須 | キャッシュの取得に成功した回数 | メトリクスの応答のキャッシュの `'cache.gets.hit'` | 同上 |
| `'cache.removals'` | `number` | 必須 | キャッシュからの削除の回数 | メトリクスの応答のキャッシュの `'cache.removals'` | 同上 |
| `'cache.evictions'` | `number` | 必須 | キャッシュからの追い出しの回数 | メトリクスの応答のキャッシュの `'cache.evictions'` | 同上 |

### `GarbageCollector`

| 項目 | 型 | 必須 | 説明 | 対応するバックエンド (DTO / field) | 根拠 |
| --- | --- | --- | --- | --- | --- |
| `'jvm.gc.max.data.size'` | `number` | 必須 | GC の最大データサイズ。画面は GC Max Data Size として 1048576 で割って MB で表示する | メトリクスの応答のガベージコレクションの `'jvm.gc.max.data.size'` | `src/app/admin/metrics/metrics.model.ts`、`src/app/admin/metrics/blocks/metrics-garbagecollector/metrics-garbagecollector.html` |
| `'jvm.gc.pause'` | `MetricsWithPercentile` | 必須 | GC の一時停止時間の統計。画面は回数、平均、最小、p50、p75、p95、p99、最大を表示する | メトリクスの応答のガベージコレクションの `'jvm.gc.pause'` | 同上 |
| `'jvm.gc.memory.promoted'` | `number` | 必須 | GC で昇格されたメモリ量。画面は GC Memory Promoted として MB で表示する | メトリクスの応答のガベージコレクションの `'jvm.gc.memory.promoted'` | 同上 |
| `'jvm.gc.memory.allocated'` | `number` | 必須 | GC で割り当てられたメモリ量。画面は GC Memory Allocated として MB で表示する | メトリクスの応答のガベージコレクションの `'jvm.gc.memory.allocated'` | 同上 |
| `classesLoaded` | `number` | 必須 | 読み込まれたクラス数。画面は Classes loaded として表示する | メトリクスの応答のガベージコレクションの `classesLoaded` | 同上 |
| `'jvm.gc.live.data.size'` | `number` | 必須 | GC の生存データサイズ。画面は GC Live Data Size として MB で表示する | メトリクスの応答のガベージコレクションの `'jvm.gc.live.data.size'` | 同上 |
| `classesUnloaded` | `number` | 必須 | 解放されたクラス数。画面は Classes unloaded として表示する | メトリクスの応答のガベージコレクションの `classesUnloaded` | 同上 |

### `Services`

- `Record<string, Record<HttpMethod, MaxMeanCount>>` である。第 1 のキーはエンドポイント、第 2 のキーは HTTP メソッドである。
- 対応するバックエンドはメトリクスの応答の `services` である（`src/app/admin/metrics/metrics.model.ts`（`Services`）、`src/app/admin/metrics/blocks/metrics-endpoints-requests/metrics-endpoints-requests.html`）。
- 画面は `keyvalue` パイプで 2 段に展開し、HTTP メソッド、エンドポイント、回数 (`count`)、平均 (`mean`) を表示する。

### `ProcessMetrics`

| 項目 | 型 | 必須 | 説明 | 対応するバックエンド (DTO / field) | 根拠 |
| --- | --- | --- | --- | --- | --- |
| `'system.cpu.usage'` | `number` | 必須 | システム全体の CPU 使用率。画面は 100 倍してパーセントで表示する | メトリクスの応答のプロセスの `'system.cpu.usage'` | `src/app/admin/metrics/metrics.model.ts`、`src/app/admin/metrics/blocks/metrics-system/metrics-system.html` |
| `'system.cpu.count'` | `number` | 必須 | CPU の数 | メトリクスの応答のプロセスの `'system.cpu.count'` | 同上 |
| `'system.load.average.1m'` | `number` | 任意 | 直近 1 分の平均負荷 | メトリクスの応答のプロセスの `'system.load.average.1m'` | 同上 |
| `'process.cpu.usage'` | `number` | 必須 | プロセスの CPU 使用率。画面は 100 倍してパーセントで表示する | メトリクスの応答のプロセスの `'process.cpu.usage'` | 同上 |
| `'process.files.max'` | `number` | 任意 | ファイル記述子の最大数 | メトリクスの応答のプロセスの `'process.files.max'` | 同上 |
| `'process.files.open'` | `number` | 任意 | 開いているファイル記述子の数 | メトリクスの応答のプロセスの `'process.files.open'` | 同上 |
| `'process.start.time'` | `number` | 必須 | プロセスの開始時刻。画面は `date` パイプの `full` の書式で表示する | メトリクスの応答のプロセスの `'process.start.time'` | 同上 |
| `'process.uptime'` | `number` | 必須 | プロセスの稼働時間（ミリ秒）。画面は年・月・日・時・分・秒に換算して表示する | メトリクスの応答のプロセスの `'process.uptime'` | 同上 |

- 「任意」はプロパティーを省略できること（`?`）を表す。

### `ThreadDump`

| 項目 | 型 | 必須 | 説明 | 対応するバックエンド (DTO / field) | 根拠 |
| --- | --- | --- | --- | --- | --- |
| `threads` | `Thread` の配列 | 必須 | スレッドの一覧 | スレッドダンプの応答の `threads` | `src/app/admin/metrics/metrics.model.ts`（`threads`）、`src/app/admin/metrics/metrics.ts`（`refresh()`） |

### `Thread`

スレッドダンプの応答は、JDK のスレッド情報のクラスを JSON にしたものである。`showThreadDump` 以外の項目名はそのクラスのプロパティー名に対応する。

| 項目 | 型 | 必須 | 説明 | 対応するバックエンド (DTO / field) | 根拠 |
| --- | --- | --- | --- | --- | --- |
| `threadName` | `string` | 必須 | スレッド名 | スレッドダンプの応答の `threadName` | `src/app/admin/metrics/metrics.model.ts`（`threadName`）、`src/app/admin/metrics/blocks/metrics-modal-threads/metrics-modal-threads.html` |
| `threadId` | `number` | 必須 | スレッド ID | スレッドダンプの応答の `threadId` | 同上 |
| `blockedTime` | `number` | 必須 | ブロックされていた時間 | スレッドダンプの応答の `blockedTime` | 同上 |
| `blockedCount` | `number` | 必須 | ブロックされた回数 | スレッドダンプの応答の `blockedCount` | 同上 |
| `waitedTime` | `number` | 必須 | 待機していた時間 | スレッドダンプの応答の `waitedTime` | 同上 |
| `waitedCount` | `number` | 必須 | 待機した回数 | スレッドダンプの応答の `waitedCount` | 同上 |
| `lockName` | `string` または `null` | 必須 | 待機しているロックの名前 | スレッドダンプの応答の `lockName` | 同上 |
| `lockOwnerId` | `number` | 必須 | ロックを保持するスレッドの ID | スレッドダンプの応答の `lockOwnerId` | `src/app/admin/metrics/metrics.model.ts`（`lockOwnerId`） |
| `lockOwnerName` | `string` または `null` | 必須 | ロックを保持するスレッドの名前 | スレッドダンプの応答の `lockOwnerName` | 同上 |
| `daemon` | `boolean` | 必須 | デーモンスレッドかどうか | スレッドダンプの応答の `daemon` | 同上 |
| `inNative` | `boolean` | 必須 | ネイティブのメソッドを実行中かどうか | スレッドダンプの応答の `inNative` | 同上 |
| `suspended` | `boolean` | 必須 | 中断されているかどうか | スレッドダンプの応答の `suspended` | 同上 |
| `threadState` | `ThreadState` | 必須 | スレッドの状態。集計、絞り込み、バッジの色に使う | スレッドダンプの応答の `threadState` | 同上、`src/app/admin/metrics/blocks/jvm-threads/jvm-threads.ts` |
| `priority` | `number` | 必須 | スレッドの優先度 | スレッドダンプの応答の `priority` | `src/app/admin/metrics/metrics.model.ts`（`priority`） |
| `stackTrace` | `StackTrace` の配列 | 必須 | スタックトレース | スレッドダンプの応答の `stackTrace` | 同上、`src/app/admin/metrics/blocks/metrics-modal-threads/metrics-modal-threads.html` |
| `lockedMonitors` | `LockedMonitor` の配列 | 必須 | スレッドが保持するモニターの一覧 | スレッドダンプの応答の `lockedMonitors` | `src/app/admin/metrics/metrics.model.ts`（`lockedMonitors`） |
| `lockedSynchronizers` | `string` の配列 | 必須 | スレッドが保持する同期オブジェクトのクラス名の一覧 | スレッドダンプの応答の `lockedSynchronizers` | 同上 |
| `lockInfo` | `LockInfo` または `null` | 必須 | 待機しているロックの情報 | スレッドダンプの応答の `lockInfo` | 同上 |
| `showThreadDump` | `boolean` | 任意 | フロントエンド独自の項目。モデルのコメントに custom field for showing-hiding thread dump とある。スレッドダンプのモーダルがスタックトレースの表示を切り替えるために書き換える | なし | 同上（`showThreadDump`）、`src/app/admin/metrics/blocks/metrics-modal-threads/metrics-modal-threads.html` |

### `LockInfo`

| 項目 | 型 | 必須 | 説明 | 対応するバックエンド (DTO / field) | 根拠 |
| --- | --- | --- | --- | --- | --- |
| `className` | `string` | 必須 | ロックのクラス名 | スレッドダンプの応答のロック情報の `className` | `src/app/admin/metrics/metrics.model.ts`（`LockInfo.className`） |
| `identityHashCode` | `number` | 必須 | ロックの識別用のハッシュコード | スレッドダンプの応答のロック情報の `identityHashCode` | 同上 |

### `LockedMonitor`

| 項目 | 型 | 必須 | 説明 | 対応するバックエンド (DTO / field) | 根拠 |
| --- | --- | --- | --- | --- | --- |
| `className` | `string` | 必須 | モニターのクラス名 | スレッドダンプの応答のモニター情報の `className` | `src/app/admin/metrics/metrics.model.ts`（`LockedMonitor.className`） |
| `identityHashCode` | `number` | 必須 | モニターの識別用のハッシュコード | スレッドダンプの応答のモニター情報の `identityHashCode` | 同上 |
| `lockedStackDepth` | `number` | 必須 | ロックを取得した位置のスタックの深さ | スレッドダンプの応答のモニター情報の `lockedStackDepth` | 同上 |
| `lockedStackFrame` | `StackTrace` | 必須 | ロックを取得した位置のスタックフレーム | スレッドダンプの応答のモニター情報の `lockedStackFrame` | 同上 |

### `StackTrace`

| 項目 | 型 | 必須 | 説明 | 対応するバックエンド (DTO / field) | 根拠 |
| --- | --- | --- | --- | --- | --- |
| `classLoaderName` | `string` または `null` | 必須 | クラスローダー名 | スレッドダンプの応答のスタックフレームの `classLoaderName` | `src/app/admin/metrics/metrics.model.ts`（`StackTrace.classLoaderName`） |
| `moduleName` | `string` または `null` | 必須 | モジュール名 | スレッドダンプの応答のスタックフレームの `moduleName` | 同上 |
| `moduleVersion` | `string` または `null` | 必須 | モジュールのバージョン | スレッドダンプの応答のスタックフレームの `moduleVersion` | 同上 |
| `methodName` | `string` | 必須 | メソッド名。画面は `className.methodName` の形で表示する | スレッドダンプの応答のスタックフレームの `methodName` | 同上、`src/app/admin/metrics/blocks/metrics-modal-threads/metrics-modal-threads.html` |
| `fileName` | `string` | 必須 | ファイル名。画面は `fileName:lineNumber` の形で表示する | スレッドダンプの応答のスタックフレームの `fileName` | 同上 |
| `lineNumber` | `number` | 必須 | 行番号 | スレッドダンプの応答のスタックフレームの `lineNumber` | 同上 |
| `className` | `string` | 必須 | クラス名 | スレッドダンプの応答のスタックフレームの `className` | 同上 |
| `nativeMethod` | `boolean` | 必須 | ネイティブメソッドかどうか | スレッドダンプの応答のスタックフレームの `nativeMethod` | `src/app/admin/metrics/metrics.model.ts`（`StackTrace.nativeMethod`） |

### `HttpMethod`

| メンバー | 値 | 根拠 |
| --- | --- | --- |
| `Post` | `'POST'` | `src/app/admin/metrics/metrics.model.ts`（`HttpMethod.Post`） |
| `Get` | `'GET'` | 同上（`HttpMethod.Get`） |
| `Put` | `'PUT'` | 同上（`HttpMethod.Put`） |
| `Patch` | `'PATCH'` | 同上（`HttpMethod.Patch`） |
| `Delete` | `'DELETE'` | 同上（`HttpMethod.Delete`） |

- 対応するバックエンドはメトリクスの応答の `services` の HTTP メソッドのキーである。
- 画面は `keyvalue` パイプでキーをそのまま表示するため、この列挙型のメンバーを参照する箇所はない。

### `ThreadState`

| メンバー | 値 | 画面での扱い | 根拠 |
| --- | --- | --- | --- |
| `Runnable` | `'RUNNABLE'` | 実行中として集計する。バッジは `bg-success` | `src/app/admin/metrics/metrics.model.ts`（`ThreadState.Runnable`）、`src/app/admin/metrics/blocks/jvm-threads/jvm-threads.ts`、`src/app/admin/metrics/blocks/metrics-modal-threads/metrics-modal-threads.ts` |
| `TimedWaiting` | `'TIMED_WAITING'` | 時限待機として集計する。バッジは `bg-warning` | 同上 |
| `Waiting` | `'WAITING'` | 待機として集計する。バッジは `bg-info` | 同上 |
| `Blocked` | `'BLOCKED'` | ブロックとして集計する。バッジは `bg-danger` | 同上 |
| `New` | `'NEW'` | 集計には含めない | 同上 |

- 対応するバックエンドはスレッドダンプの応答の `threadState` である。
- 画面は状態を All、Runnable、Timed Waiting、Waiting、Blocked の 5 つのボタンで絞り込む（`src/app/admin/metrics/blocks/metrics-modal-threads/metrics-modal-threads.html`）。

## 4. 使用箇所

本体（単体テストを除く）のうち、このモデルを import しているファイルである。

| 分類 | ファイル | クラス | 使っている型 | 用途 |
| --- | --- | --- | --- | --- |
| サービス | `src/app/admin/metrics/metrics.service.ts` | `MetricsService` | `MetricsModel`、`ThreadDump` | `getMetrics()`、`threadDump()` の戻り値の Observable の型 |
| 画面 | `src/app/admin/metrics/metrics.ts` | `Metrics` | `MetricsModel`、`Thread` | シグナル `metrics`、`threads`、`metricsKeyExistsAndObjectNotEmpty()` の引数 |
| 部品 | `src/app/admin/metrics/blocks/jvm-memory/jvm-memory.ts` | `JvmMemory` | `JvmMetrics` | `input` の `jvmMemoryMetrics` |
| 部品 | `src/app/admin/metrics/blocks/jvm-threads/jvm-threads.ts` | `JvmThreads` | `Thread`、`ThreadState` | `input` の `threads`、`computed` の `threadStats` |
| 部品 | `src/app/admin/metrics/blocks/metrics-cache/metrics-cache.ts` | `MetricsCache` | `CacheMetrics` | `input` の `cacheMetrics` |
| 部品 | `src/app/admin/metrics/blocks/metrics-datasource/metrics-datasource.ts` | `MetricsDatasource` | `Databases` | `input` の `datasourceMetrics` |
| 部品 | `src/app/admin/metrics/blocks/metrics-endpoints-requests/metrics-endpoints-requests.ts` | `MetricsEndpointsRequests` | `Services` | `input` の `endpointsRequestsMetrics` |
| 部品 | `src/app/admin/metrics/blocks/metrics-garbagecollector/metrics-garbagecollector.ts` | `MetricsGarbageCollector` | `GarbageCollector` | `input` の `garbageCollectorMetrics` |
| 部品 | `src/app/admin/metrics/blocks/metrics-modal-threads/metrics-modal-threads.ts` | `MetricsModalThreads` | `Thread`、`ThreadState` | フィールド `threads`、`threadStateFilter`、`getBadgeClass()`、`getThreads()` |
| 部品 | `src/app/admin/metrics/blocks/metrics-request/metrics-request.ts` | `MetricsRequest` | `HttpServerRequests` | `input` の `requestMetrics` |
| 部品 | `src/app/admin/metrics/blocks/metrics-system/metrics-system.ts` | `MetricsSystem` | `ProcessMetrics` | `input` の `systemMetrics` |

使う画面と共通部品は次のとおりである。

- メトリクス（[メトリクス_画面設計書](../../02_画面設計/300_管理画面/メトリクス/メトリクス_画面設計書.md)）。画面は応答のグループごとに部品コンポーネントへ `input` で値を渡す（`src/app/admin/metrics/metrics.html`）。
- `Value`、`MetricsWithPercentile`、`MaxMeanCount`、`LockInfo`、`LockedMonitor`、`StackTrace`、`HttpMethod` はモデルのファイルの中だけで参照する。
- このモデルを画面のテンプレートで直接 import する箇所はない。

単体テストでは `src/app/admin/metrics/metrics.service.spec.ts`（`ThreadDump`、`ThreadState`）、`src/app/admin/metrics/metrics.spec.ts`（`MetricsModel`、`Thread`）、`src/app/admin/metrics/blocks/metrics-modal-threads/metrics-modal-threads.spec.ts`（`Thread`、`ThreadState`）が使う。

関連文書:

- [アプリ_画面設計書](../../02_画面設計/000_アプリ/アプリ/アプリ_画面設計書.md)（6.6、7.5）
- [管理_電文レイアウト](../02_電文レイアウト/管理_電文レイアウト.md)

## 5. 変換規則

### 5.1 取得（`Metrics.refresh()`）

- `combineLatest([this.metricsService.getMetrics(), this.metricsService.threadDump()])` で 2 つの応答を受け、`metrics` に `MetricsModel` を、`threads` に `threadDump.threads` を入れる。
- 取得の間はシグナル `updatingMetrics` が `true` である。
- 項目の変換はない。応答の値をそのまま入れる。
- `metricsKeyExistsAndObjectNotEmpty('databases')` は、`metrics()` の当該のグループに値があり、キーが 1 つ以上あるときだけ `true` を返す。テンプレートはデータベースの部品の表示をこれで判定する。

### 5.2 スレッドの集計

- `JvmThreads` の `computed` の `threadStats` は、`threads()` の各スレッドを `threadState` で数える。`Runnable`、`Waiting`、`TimedWaiting`、`Blocked` の 4 状態の件数と、その合計 (`threadDumpAll`) を返す。`New` は数えない（`src/app/admin/metrics/blocks/jvm-threads/jvm-threads.ts`）。
- `MetricsModalThreads.ngOnInit()` は同じ集計をフィールドに保持する。`getThreads()` は `threadStateFilter` がなければ全件、あればその状態だけを返す（`src/app/admin/metrics/blocks/metrics-modal-threads/metrics-modal-threads.ts`）。

### 5.3 `showThreadDump` の書き換え

- スレッドダンプのモーダルのテンプレートは、リンクのクリックで `thread.showThreadDump = !thread.showThreadDump` を実行し、スタックトレースの表示を切り替える（`src/app/admin/metrics/blocks/metrics-modal-threads/metrics-modal-threads.html`）。これはテンプレートからモデルのオブジェクトを直接書き換える箇所である。

### 5.4 表示上の換算

- バイト数は 1048576 で割って MB にする（JVM のメモリ、ガベージコレクションの各部品）。
- 使用率は 100 倍してパーセントで表示する（`system.cpu.usage`、`process.cpu.usage`）。
- `MetricsSystem.convertMillisecondsToDuration()` はミリ秒を年、月、日、時、分、秒に換算する（`src/app/admin/metrics/blocks/metrics-system/metrics-system.ts`）。
- `MetricsCache`、`MetricsDatasource`、`MetricsRequest` の各部品は `filterNaN`（`NaN` を 0 に置き換える関数、`src/app/core/util/operators.ts`）をテンプレートで使う。
- 数値は `number` パイプで小数部の桁数をそろえ、`process.start.time` は `date` パイプの `full` の書式で表示する。
