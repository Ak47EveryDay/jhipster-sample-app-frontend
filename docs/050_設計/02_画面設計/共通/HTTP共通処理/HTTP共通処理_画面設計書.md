# HTTP共通処理 画面設計書

## 0. 改訂履歴

| 項番 | バージョン | 改訂内容 |
| --- | --- | --- |
| 1 | 1.0 | 新規作成 |

## 1. 画面基本情報

| 項目 | 内容 | 根拠 |
| --- | --- | --- |
| 画面ID | なし（共通部品であり、ルートを持たない）。バックエンドへの HTTP 要求のすべてに適用される | `src/app/app.config.ts`（`provideHttpClient(withInterceptors([...]))`） |
| 画面名称 | HTTP共通処理。インターセプター、URL とクエリパラメーターの組み立て、ページングと並び替え、エラー応答の受け取り方をまとめる | `src/app/core/interceptor/` 配下の 4 ファイル、`src/app/core/request/request-util.ts` |
| ルート定義 | なし（ルートを持たない） | 同上 |
| コンポーネント | 画面はない。インターセプターは `authInterceptor`、`authExpiredInterceptor`、`errorHandlerInterceptor`、`notificationInterceptor`（`src/app/core/interceptor/` 配下。いずれも `HttpInterceptorFn` 型の関数）である | 各ファイルの `export const` |
| テンプレート | なし（部品自身はテンプレートを持たない） | 同上 |
| 表示に必要な権限 | 不要。ログインの有無にかかわらず全画面の HTTP 要求で動く | `src/app/app.config.ts` |
| 主な遷移元 | なし | － |
| 主な遷移先 | ログイン（`/login`、HTTP 401 のとき） | `src/app/core/interceptor/auth-expired.interceptor.ts`（`router.navigate(['/login'])`） |

関連文書:

- [アカウント状態と認証_画面設計書](../アカウント状態と認証/アカウント状態と認証_画面設計書.md)（トークンの保存元）
- [アラート_画面設計書](../アラート/アラート_画面設計書.md)（エラーと成功通知の表示）
- [アプリ_画面設計書](../../000_アプリ/アプリ/アプリ_画面設計書.md)（9.3 ビルド時定数と環境ファイル、9.4 プロキシー）
- [headers_DTO設計書](../../../03_IF設計/01_DTO設計書/headers_DTO設計書.md)、[problem-details_DTO設計書](../../../03_IF設計/01_DTO設計書/problem-details_DTO設計書.md)、[request_DTO設計書](../../../03_IF設計/01_DTO設計書/request_DTO設計書.md)、[sort-state_DTO設計書](../../../03_IF設計/01_DTO設計書/sort-state_DTO設計書.md)

## 2. 機能概要

- 画面とバックエンドは HTTP（JSON）だけでつながる。`HttpClient` を使い、共通の処理はインターセプター 4 つが担う。
- インターセプターは `appConfig` に配列の順に登録されている（`authInterceptor`、`authExpiredInterceptor`、`errorHandlerInterceptor`、`notificationInterceptor`）。
- URL の基点はビルド時定数 `SERVER_API_URL`（定数 `serverApiUrl`）である。開発時は開発サーバーのプロキシーが `/api`、`/management` などをバックエンドへ転送する。
- サービスクラスが API の呼び出しをまとめる。URL は `${serverApiUrl}api/...` の形で組み立てる。
- クエリパラメーターは `createRequestOption()` で作る。ページングの指定（`page`、`size`、`sort`）もクエリパラメーターで送る。
- ページ付きの一覧は、レスポンスヘッダー `X-Total-Count`（総件数）と `Link`（前後のページのリンク）でページ情報を得る。
- エラー応答は `errorHandlerInterceptor` がイベントとして配信し、`AlertError` が表示する（表示の内容は [アラート_画面設計書](../アラート/アラート_画面設計書.md) に書く）。
- 成功通知は `notificationInterceptor` がレスポンスヘッダーから作る。
- この部品自身は API を呼ばない（ほかの API 呼び出しに横断的に関わる）。

## 3. 画面レイアウト

この部品は画面を持たない。HTTP 要求の経路は次のとおりである。

```
画面（コンポーネント）
    → サービス（src/app/entities/**/service/*.service.ts、src/app/core/auth/*.service.ts など）
        → HttpClient
            → authInterceptor              … Authorization ヘッダーを付ける
            → authExpiredInterceptor       … （応答側）401 ならログアウトして /login へ
            → errorHandlerInterceptor      … （応答側）エラーをイベントで配信する
            → notificationInterceptor      … （応答側）成功アラートを作る
            → 開発時: プロキシー（proxy.config.mjs）  → バックエンド http://127.0.0.1:8080
            → 本番時: SERVER_API_URL のオリジン     → バックエンド
```

| 構成要素 | ファイル | 役割 | 4 章の対応 |
| --- | --- | --- | --- |
| インターセプター | `src/app/core/interceptor/` 配下の 4 ファイル | トークンの付与、401 の処理、エラーと成功の通知 | `### インターセプター` |
| URL とクエリパラメーター | `src/app/config/endpoint.constants.ts`、`src/app/core/request/request-util.ts`、`proxy.config.mjs` | URL の基点、クエリパラメーターの組み立て、開発時の転送 | `### URL とクエリパラメーター` |
| ページングと並び替え | `src/app/config/pagination.constants.ts`、`src/app/core/util/parse-links.service.ts`、`src/app/shared/jhipster/link-header.ts`、`src/app/shared/sort/` | ページ情報の読み取り、並び替えの状態 | `### ページングと並び替え` |

## 4. 画面表示項目一覧

### インターセプター

| 項目 | 種別 (表示 / 入力 / ボタン / リンク) | バインド先 | 必須 | 説明 | 根拠 |
| --- | --- | --- | --- | --- | --- |
| `authInterceptor` | － | 要求側 | － | 保存されたトークンがあれば `Authorization: Bearer <トークン>` を付ける。URL がない要求と、`http` で始まり `serverApiUrl` から始まらない URL（外部のオリジン）には付けない | `src/app/core/interceptor/auth.interceptor.ts` |
| `authExpiredInterceptor` | － | エラー側 | － | ステータス 401 で、URL に `api/account` を含まないとき、今の URL を保存し、ログアウトして `/login` へ遷移する | `src/app/core/interceptor/auth-expired.interceptor.ts` |
| `errorHandlerInterceptor` | － | エラー側 | － | エラーをイベント `jhipsterSampleApplicationApp.httpError` として配信する。401 で `err.message` が空、または URL に `api/account` を含む場合は配信しない | `src/app/core/interceptor/error-handler.interceptor.ts` |
| `notificationInterceptor` | － | 成功側 | － | レスポンスヘッダー `x-jhipstersampleapplicationapp-alert` に値があれば成功アラートを追加する | `src/app/core/interceptor/notification.interceptor.ts` |

### URL とクエリパラメーター

| 項目 | 種別 (表示 / 入力 / ボタン / リンク) | バインド先 | 必須 | 説明 | 根拠 |
| --- | --- | --- | --- | --- | --- |
| `serverApiUrl` | － | ルート基準の URL 文字列 | － | ビルド時定数 `SERVER_API_URL` の値。末尾に `/` が付く。空文字列なら同一オリジンになる | `src/app/config/endpoint.constants.ts`、`build-plugins/define-esbuild.ts`（`withTrailingSlash(process.env.SERVER_API_URL ?? '')`） |
| `createRequestOption(req?)` | － | 戻り値は `HttpParams` | － | オブジェクトからクエリパラメーターを作る。`undefined` と `null` の項目は除く。配列は展開する。空文字列は除く | `src/app/core/request/request-util.ts` |
| `Pagination`、`Search`、`SearchWithPagination` | － | インターフェース | － | ページングと検索の要求の型。`Pagination` は `page`、`size`、`sort`（文字列の配列）、`Search` は `query` | `src/app/core/request/request.model.ts` |
| プロキシー | － | `proxy.config.mjs` | － | 開発サーバーのプロキシー。`^/(api\|management\|v3/api-docs\|h2-console)` に一致するパスを `http://127.0.0.1:8080` へ転送する（`xfwd: true`） | `proxy.config.mjs`、`angular.json`（`proxyConfig`、`port: 9060`） |

### ページングと並び替え

| 項目 | 種別 (表示 / 入力 / ボタン / リンク) | バインド先 | 必須 | 説明 | 根拠 |
| --- | --- | --- | --- | --- | --- |
| `ITEMS_PER_PAGE` | － | 定数 `20` | － | 1 ページの件数の既定値 | `src/app/config/pagination.constants.ts` |
| `TOTAL_COUNT_RESPONSE_HEADER` | － | 定数 `'X-Total-Count'` | － | 総件数が入るレスポンスヘッダーの名前 | 同上 |
| `PAGE_HEADER`、`SORT` | － | 定数 `'page'`、`'sort'` | － | ページ番号と並び順のクエリパラメーターの名前 | `src/app/config/pagination.constants.ts`、`src/app/config/navigation.constants.ts` |
| `ASC`、`DESC` | － | 定数 `'asc'`、`'desc'` | － | 並び順の値 | `src/app/config/navigation.constants.ts` |
| `ITEM_DELETED_EVENT` | － | 定数 `'deleted'` | － | 削除ダイアログが `close()` で閉じるときの理由 | 同上 |
| `DEFAULT_SORT_DATA` | － | 定数 `'defaultSort'` | － | ルートの `data` のキー。既定の並び順を持つ | 同上 |
| `ParseLinks.parseAll(header)` | － | サービス | － | `Link` ヘッダーを解析し、`rel` の名前（`first`、`prev`、`next`、`last` など）ごとのクエリパラメーターにする | `src/app/core/util/parse-links.service.ts`、`src/app/shared/jhipster/link-header.ts`（`parseLinkHeader()`） |
| `ParseLinks.parse(header)` | － | サービス | － | `Link` ヘッダーを解析し、`rel` の名前ごとのページ番号にする | 同上（`getPageNumberFromLinkHeader()`） |
| `SortState` | － | 型 `{ predicate?: string; order?: 'asc' または 'desc' }` | － | 並び替えの状態 | `src/app/shared/sort/sort-state.ts` |
| `sortStateSignal(state)` | － | 関数 | － | `SortState` を保持するシグナルを作る。`predicate` と `order` が等しければ同じ値とみなす | 同上 |
| `SortService` | － | サービス | － | `parseSortParam()`（`<列>,<順>` を `SortState` にする）、`buildSortParam()`（`SortState` をクエリパラメーターの配列にする）、`startSort()`（画面側で並び替える比較関数） | `src/app/shared/sort/sort.service.ts` |
| `SortDirective`、`SortByDirective` | － | セレクター `[jhiSort]`、`[jhiSortBy]` | － | 見出し行の並び替え。`jhiSortBy` のクリックで `SortDirective.sort()` が `sortState` を更新し、`sortChange` を出す。`SortByDirective` は列の `<fa-icon>` のアイコンを並び順に応じて切り替える | `src/app/shared/sort/sort.directive.ts`、`src/app/shared/sort/sort-by.directive.ts` |
| `ItemCount` | － | セレクター `jhi-item-count`、入力 `params`（`page`、`totalItems`、`itemsPerPage`） | － | 「Showing {{first}} - {{second}} of {{total}} items.」を表示する部品。翻訳キー `global.item-count` | `src/app/shared/pagination/item-count.ts`、`src/i18n/en/global.json` |

## 5. イベント処理

### 5.1 イベント一覧

| No. | イベント発生源 | イベント | 遷移先 | イベント物理名 |
| --- | --- | --- | --- | --- |
| 1 | HTTP 要求 | トークンがある | なし | `authInterceptor`（`req.clone({ setHeaders: ... })`） |
| 2 | HTTP のエラー応答 | ステータス 401（`api/account` 以外） | ログイン（`/login`） | `authExpiredInterceptor`（`stateStorageService.storeUrl()`、`loginService.logout()`、`router.navigate(['/login'])`） |
| 3 | HTTP のエラー応答 | エラーが発生する | なし | `errorHandlerInterceptor`（`eventManager.broadcast(...)`） |
| 4 | HTTP の成功応答 | アラートのヘッダーがある | なし | `notificationInterceptor`（`alertService.addAlert(...)`） |
| 5 | 一覧画面 | ページを移動する、見出し行をクリックする | なし（クエリパラメーターが変わる） | `(pageChange)`、`(sortChange)` |

### 5.2 イベント詳細

#### 5.2.1 インターセプターの連鎖

- トリガー: `HttpClient` のメソッドが呼ばれ、購読されること。
- 処理手順: 要求は登録の順に、応答とエラーは逆の順に各インターセプターを通る。これは Angular の `withInterceptors` の仕様であり、本リポジトリのコードではない。

| 順 | インターセプター | 要求側 | 応答・エラー側 |
| --- | --- | --- | --- |
| 1 | `authInterceptor` | 対象の要求に `Authorization` ヘッダーを付ける | 何もしない |
| 2 | `authExpiredInterceptor` | 何もしない | エラー側。401 の処理（5.2.3） |
| 3 | `errorHandlerInterceptor` | 何もしない | エラー側。イベントの配信（5.2.4） |
| 4 | `notificationInterceptor` | 何もしない | 成功側。成功アラート（5.2.5） |

- 状態変化: 要求のヘッダー（1）、 Web Storage のトークンとアカウント状態（2）、`AlertService` のアラート（4）。
- 遷移: 401 のとき `/login`（2）。

#### 5.2.2 トークンの付与（`authInterceptor`）

- トリガー: HTTP 要求の送信前。
- 処理手順:
  1. `req.url` がなければ、そのまま渡す。
  2. URL が `http` で始まり、かつ `serverApiUrl` から始まらなければ（外部のオリジン）、そのまま渡す。
  3. `stateStorageService.getAuthenticationToken()` でトークンを取り、あれば `req.clone({ setHeaders: { Authorization: \`Bearer ${token}\` } })` でヘッダーを付ける。
- 状態変化: 要求のヘッダー。
- 遷移: なし。
- 補足: `serverApiUrl` が空文字列（同一オリジン）のときは、`http` で始まる URL はすべて外部とみなされてヘッダーが付かないと読める。相対パスの URL には常に付く。

#### 5.2.3 401 の処理（`authExpiredInterceptor`）

- トリガー: エラー応答のステータスが 401 であること。
- 処理手順: `err.url` があり、かつ `api/account` を含まないとき、次の 3 つを実行する。
  1. `stateStorageService.storeUrl(router.routerState.snapshot.url)` で今の URL を保存する。
  2. `loginService.logout()` でトークンを消し、アカウントを `null` にする。
  3. `router.navigate(['/login'])`。
- 状態変化: Web Storage のトークン、アカウント状態、sessionStorage の `previousUrl`。
- 遷移: ログイン（`/login`）。
- 補足:
  - `api/account` の 401 は対象外である。未ログインのまま画面を開いたときのアカウント取得の失敗に当たるためである。
  - `POST api/authenticate`（ログイン）の失敗も 401 である。この URL は `api/account` を含まないため、この処理の対象になる。保存される URL は `/login` であると読める（[ログイン_画面設計書](../../200_アカウント/ログイン/ログイン_画面設計書.md) 参照）。
  - 401 のとき `errorHandlerInterceptor` がイベントを配信するかどうかは、`err.message` が空かどうかで決まる（5.2.4）。

#### 5.2.4 エラーの配信（`errorHandlerInterceptor`）

- トリガー: エラー応答。
- 処理手順: `tap()` の `error` の中で、次の条件以外のとき `eventManager.broadcast(new EventWithContent('jhipsterSampleApplicationApp.httpError', err))` を実行する。
  - ステータスが 401 で、かつ `err.message` が空文字列である。
  - ステータスが 401 で、かつ `err.url` に `api/account` を含む。
- 状態変化: なし（`AlertError` が受け取ってアラートを追加する）。
- 遷移: なし。
- 補足: イベントを受け取るのは画面にある `<jhi-alert-error />` である。置いていない画面では、エラーは表示されない。

#### 5.2.5 成功通知（`notificationInterceptor`）

- トリガー: 成功応答（`HttpResponse`）。
- 処理手順:
  1. レスポンスヘッダーを `getMessageFromHeaders()`（`src/app/shared/jhipster/headers.ts`）で読む。
  2. `alertKey` があれば `alertService.addAlert({ type: 'success', translationKey: message.alertKey, translationParams: { param: message.param } })` を実行する。
  3. なければ `alertMessage` があれば `alertService.addAlert({ type: 'success', message: message.alertMessage })` を実行する。
- 状態変化: `AlertService` のアラート。
- 遷移: なし。
- 補足: 表示のされ方は [アラート_画面設計書](../アラート/アラート_画面設計書.md) に書く。

#### 5.2.6 ページング（ページの移動）

- トリガー: ページ付きの一覧画面でページ番号が変わること（取引一覧とユーザ管理一覧）。
- 処理手順:
  1. 画面がクエリパラメーター `page` と `sort` を持つ URL へ遷移する。
  2. 画面の初期化で、`page` と `sort` をルートから読み、サービスの `query(req)` を呼ぶ。`req` は `page`、`size`、`sort` を持つ。
  3. サービスは `createRequestOption(req)` でクエリパラメーターを作り、`GET` を送る。
  4. 応答では、本文の配列のほかに、レスポンスヘッダー `X-Total-Count`（総件数）と `Link`（前後のページへのリンク）を読む。
  5. `Link` ヘッダーは `parseLinks.parseAll(linkHeader)` で解析し、次のページと前のページの有無を判定する。
- 状態変化: 一覧のデータ、総件数、ページのリンク。
- 遷移: なし（同じルートのクエリパラメーターだけが変わる）。
- 補足:
  - ページ番号は 0 から始まる。`ngb-pagination` のページ番号は 1 から始まるため、画面は両者を 1 だけずらして扱うと読める（詳細は各画面の画面設計書に書く）。
  - ヘッダー名は定数 `TOTAL_COUNT_RESPONSE_HEADER`、`PAGE_HEADER`、`ITEMS_PER_PAGE` である（`src/app/config/pagination.constants.ts`）。

#### 5.2.7 並び替え

- トリガー: 一覧の見出し行の列をクリックすること。
- 処理手順:
  1. `SortByDirective.onClick()` が親の `SortDirective.sort(this.jhiSortBy())` を呼ぶ。
  2. `SortDirective.sort(field)` は、今の `predicate` と同じ列なら `order` を反転させ、別の列なら `asc` にする。`sortState` を更新し、`sortChange` に出す。
  3. 画面は `sortChange` を受けて、`sortService.buildSortParam(sortState)` の結果をクエリパラメーター `sort` にして同じルートへ遷移する。
  4. 並び替えの実体は画面ごとに異なる。バックエンドに `sort` を渡して並び替える画面（取引一覧、ユーザ管理一覧、権限一覧）と、画面の `refineData()` で並び替える画面（銀行口座一覧、ラベル一覧）がある。
- 状態変化: `sortState`、URL のクエリパラメーター `sort`、一覧のデータ。
- 遷移: なし（同じルートのクエリパラメーターだけが変わる）。
- 補足: `SortService.startSort()` は `new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' })` で比較する。`a[predicate]` を直接比較するため、`user.login` のようなドットを含む `predicate` では表示順は変わらない。

### 5.4 画面遷移

| 遷移先 | 条件 | トリガー |
| --- | --- | --- |
| ログイン（`/login`） | 保護された API が 401 を返した（URL に `api/account` を含まない） | `authExpiredInterceptor` の `router.navigate(['/login'])` |

### 5.5 利用箇所

- インターセプターの登録は `src/app/app.config.ts` の 1 か所だけである。`HttpClient` を注入しているサービスはすべてこの連鎖を通る。
- `createRequestOption()` を呼んでいるのは、エンティティの各サービスの `query()` である（`src/app/entities/bank-account/service/bank-account.service.ts`、`src/app/entities/label/service/label.service.ts`、`src/app/entities/operation/service/operation.service.ts`、`src/app/entities/user/service/user.service.ts`、`src/app/entities/admin/user-management/service/user-management.service.ts`、`src/app/entities/admin/authority/service/authority.service.ts`）。
- `ParseLinks` を使っているのは取引一覧（`src/app/entities/operation/list/operation.ts`）だけである。
- `ITEMS_PER_PAGE` を使っているのは取引一覧とユーザ管理一覧である。
- `jhiSort` を使っているテンプレートは、銀行口座、ラベル、取引、ユーザ管理、権限の一覧と、アプリケーション設定、ログである。
- `ItemCount`（`jhi-item-count`）を使っているのはユーザ管理一覧だけである（`src/app/entities/admin/user-management/list/user-management.html`）。
- `DataUtil`（`src/app/core/util/data-util.service.ts`）と `src/app/shared/jhipster/data-utils.ts` は、定義があるが本体から使われていない。
- `problem-details.ts` の型は、`AlertError` は使っていない。`AlertError` はエラー応答の本文を `any` のまま読む（`src/app/shared/alert/alert-error.ts`）。
- `isProblemWithMessage()` を呼んでいる箇所は本体のコードにない。

### 5.6 内部構造

- クエリパラメーターの実例（`createRequestOption({ page: 0, size: 20, sort: ['id,asc'] })` の場合）: `page=0&size=20&sort=id,asc` になる。値は `HttpParams.append()` で追加され、ブラウザーの送信時にエンコードされる。
- `getMessageFromHeaders()` の判定（`src/app/shared/jhipster/headers.ts`）: ヘッダー `x-jhipstersampleapplicationapp-alert`、`x-jhipstersampleapplicationapp-error` の値が英数字とドットだけの文字列なら翻訳キーとみなす（正規表現で判定する。正規表現は `getMessageFromHeaders()` の中にある）。`x-jhipstersampleapplicationapp-params` は URL デコードし、`+` を半角スペースに置き換える。同じヘッダーに複数の値があるときは `TypeError` を投げる。
- バックエンド側の対応:
  - エラーのヘッダーは `ExceptionTranslator.buildHeaders()` が `BadRequestAlertException` のときだけ `HeaderUtil.createFailureAlert()` で作る（バックエンドの `src/main/java/io/github/jhipster/sample/web/rest/errors/ExceptionTranslator.java`）。
  - エラーの本文は Problem Details（RFC 7807）である。`type`、`title`、`status`、`detail`、`instance` に、翻訳キーの `message`、埋め込み値の `params`、項目単位のエラーの `fieldErrors` が加わる（`src/app/shared/jhipster/problem-details.ts` の `ProblemWithMessage`）。
  - ページ付きの一覧は `X-Total-Count` と `Link` を返す（`Page` を返す Spring Data のリポジトリーメソッドの結果を `ResponseEntity` に包んで返すリソース。例: バックエンドの `src/main/java/io/github/jhipster/sample/web/rest/OperationResource.java` の `getAllOperations()` と `UserResource.java` の `getAllUsers()`）。`X-Total-Count` と `Link` を設定しているのは、JHipster ライブラリーの `PaginationUtil.generatePaginationHttpHeaders()` である。各リソース（`UserResource`、`OperationResource`、`PublicUserResource`）が呼び出すが、この処理自体はバックエンドのソースにはない。
- CORS（別オリジンで動かす場合）: `SERVER_API_URL` に別のオリジンを指定すると、ブラウザーは CORS の制約を受ける。バックエンドの `WebConfigurer.corsFilter()` は `jhipster.cors.allowed-origins` に値があるときだけ `/api/**`、`/management/**`、`/v3/api-docs`、`/swagger-ui/**` に CORS の設定を登録する（バックエンドの `src/main/java/io/github/jhipster/sample/config/WebConfigurer.java`）。開発のプロファイルでは `allowed-origins` に `http://localhost:9060` などが、`exposed-headers` に `Authorization,Link,X-Total-Count` とアラートの 3 ヘッダーが設定されている（バックエンドの `src/main/resources/config/application-dev.yml`）。`exposed-headers` にないヘッダーは JavaScript から読めないため、アラートと総件数の表示にはこの設定が要る。
- 開発サーバーのプロキシー（`proxy.config.mjs`）: 転送先は `http://127.0.0.1:8080`、対象は `^/(api|management|v3/api-docs|h2-console)` である。`xfwd: true` のため、`X-Forwarded-*` ヘッダーが付く。開発サーバーのポートは `9060` である（`angular.json` の `serve` の `options.port`）。
- 本番ビルドでは `SERVER_API_URL` の既定値は `''`（`angular.json` の `define`）であり、同一オリジンで動く。
