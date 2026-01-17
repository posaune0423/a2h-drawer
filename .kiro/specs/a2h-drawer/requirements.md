# Requirements Document

## Project Description (Input)

a2h-drawer

- iOSブラウザでPWAを使う際に、`Add to Home Screen`（ホーム画面に追加）の導線が深く、利用者が手順に迷いやすい課題を解決する。
- 利用者がアプリ側の「Install」などの導線を押下したときに、専用のグローバルモーダルを表示し、`Add to Home Screen` までの手順を案内する。
- 上記を実現するための React コンポーネントおよび Hooks を提供するライブラリとする。
- 手順案内には、理解を促進するための画像または動画を含める。

## Introduction

本仕様は、iOSブラウザ上でPWAを利用するユーザーに対し、ホーム画面追加（A2HS: Add to Home Screen）までの操作手順を分かりやすく提示するための、UIコンポーネントおよびHooksを提供するライブラリの要求を定義する。

## Requirements

### Requirement 1: 対象環境の判定と起動条件

**Objective:** As a プロダクト開発者, I want iOSブラウザの利用者に対してA2HS手順を適切な条件で提示できる, so that 不要な案内を避けつつ迷いを最小化できる

#### Acceptance Criteria

1.1 When 利用者がアプリ側の「Install」相当の導線を押下したとき, the a2h-drawer shall A2HS手順モーダルを表示できる
1.2 If 実行環境がiOSブラウザではないと判定されたとき, the a2h-drawer shall A2HS手順モーダルを表示しない（もしくは無操作として扱う）ことができる
1.3 If 利用者がすでにホーム画面追加済み（スタンドアロン起動等）と判定されたとき, the a2h-drawer shall A2HS手順モーダルを表示しない（もしくは無操作として扱う）ことができる
1.4 The a2h-drawer shall 利用者がモーダルの表示可否をアプリ側で制御できる手段を提供する

### Requirement 2: グローバルモーダルの表示・操作

**Objective:** As a iOSブラウザの利用者, I want 迷わずに閉じられる一貫したモーダルでA2HS手順を確認したい, so that 操作に集中できる

#### Acceptance Criteria

2.1 When モーダルが表示されたとき, the a2h-drawer shall 画面上で一貫したレイアウトで手順案内を表示する
2.2 When 利用者が閉じる操作を行ったとき, the a2h-drawer shall モーダルを閉じる
2.3 While モーダルが表示されているとき, the a2h-drawer shall 主要操作（閉じる/次へ等）が利用者にとって到達しやすい状態を維持する
2.4 The a2h-drawer shall モーダルの表示/非表示状態をアプリ側で観測できる（例: コールバック/状態取得）手段を提供する

### Requirement 3: A2HS手順コンテンツ（Share → More → Add to Home Screen）

**Objective:** As a iOSブラウザの利用者, I want 具体的な操作手順を段階的に理解したい, so that 迷わずホーム画面に追加できる

#### Acceptance Criteria

3.1 When モーダルが表示されたとき, the a2h-drawer shall 少なくとも以下の手順を順序付きで提示する: 共有ボタンをタップ → その他/More をタップ → ホーム画面に追加 をタップ
3.2 The a2h-drawer shall 各手順が利用者に理解できるよう、短い説明文を表示できる
3.3 Where メディア（画像または動画）が提供されている場合, the a2h-drawer shall 手順理解の補助としてメディアを表示できる
3.4 If メディアが提供されていない場合, the a2h-drawer shall テキストのみで手順案内を成立させる

### Requirement 4: 提供API（コンポーネント/Hook）

**Objective:** As a フロントエンド開発者, I want 最小の実装負荷でA2HS案内を組み込めるAPIが欲しい, so that 既存アプリに安全に導入できる

#### Acceptance Criteria

4.1 The a2h-drawer shall A2HS案内を表示するためのReactコンポーネントを提供する
4.2 The a2h-drawer shall A2HS案内を制御するためのHooksを提供する
4.3 The a2h-drawer shall アプリ側がモーダルを任意のタイミングで開閉できる手段を提供する
4.4 The a2h-drawer shall アプリ側が手順文言や表示内容（例: 見出し、説明）を差し替えできる手段を提供する
4.5 The a2h-drawer shall アプリ情報（アイコン/名称/説明）の自動取得結果をアプリ側で参照できる手段を提供する
4.6 If ランタイムがブラウザ環境ではない（例: SSR）とき, the a2h-drawer shall アプリ情報の自動取得を試みずに安全に動作する（例: 例外を投げない）ことができる
4.7 The a2h-drawer shall アプリ内の任意のコンポーネントからA2HS案内モーダルを開ける、シンプルなHookを提供する
4.8 Where アプリがプロバイダ等のセットアップを行っている場合, the a2h-drawer shall アプリ内のどこからでも一貫した状態でモーダルを開閉できる

### Requirement 5: アプリ情報（favicon / title / description）の自動取得

**Objective:** As a iOSブラウザの利用者, I want インストールしようとしているアプリの情報を確認したい, so that 安心してホーム画面追加の操作を進められる

#### Acceptance Criteria

5.1 When A2HS案内モーダルを表示するとき, the a2h-drawer shall ホストページ（本ライブラリが組み込まれたプロジェクト）のアプリ情報を自動的に取得する
5.2 The a2h-drawer shall アプリ名称としてホストページの `title` 相当の情報を取得できる
5.3 The a2h-drawer shall アプリ説明としてホストページの `description` 相当の情報を取得できる
5.4 The a2h-drawer shall アプリアイコンとしてホストページの `favicon` 相当の画像を取得できる
5.5 If アプリ情報の一部が取得できないとき, the a2h-drawer shall 取得できなかった項目についてフォールバック表示（例: 未設定、プレースホルダー）を行える
5.6 The a2h-drawer shall アプリ情報の自動取得結果を、アプリ側から上書きできる手段を提供する

### Requirement 6: 見た目・ユーザー体験（iOSらしさ/アクセシビリティ）

**Objective:** As a iOSブラウザの利用者, I want ネイティブに近い自然な見た目の案内を見たい, so that 違和感なく操作できる

#### Acceptance Criteria

6.1 The a2h-drawer shall iOSの最新UIトレンドに沿った「liquid glass」調の外観で表示できる
6.2 The a2h-drawer shall 主要な画面サイズで手順が読みやすいレイアウトを維持する
6.3 While モーダルが表示されているとき, the a2h-drawer shall キーボード操作および支援技術で利用可能なアクセシビリティ情報を提供する
6.4 When モーダルを開閉するとき, the a2h-drawer shall iOSらしい自然なトランジション（例: フェード/スライド/ブラー等）で状態変化を表現する
6.5 While 利用者のOS設定が reduced motion を要求しているとき, the a2h-drawer shall アニメーションを抑制または簡略化して表示できる
6.6 The a2h-drawer shall Tailwind CSS v4 を用いたスタイリングで統一された見た目を提供できる

### Requirement 7: モーダル内の表示内容（アプリ情報＋手順）

**Objective:** As a iOSブラウザの利用者, I want アプリ情報と操作手順を同じ画面で把握したい, so that 迷わずにホーム画面追加できる

#### Acceptance Criteria

7.1 When A2HS案内モーダルが表示されているとき, the a2h-drawer shall 少なくとも以下のアプリ情報を表示する: アイコン画像 / アプリ名称 / アプリ説明
7.2 When A2HS案内モーダルが表示されているとき, the a2h-drawer shall 手順（Share/More/Add to Home Screen 等）を表示する
7.3 Where 手順の表示が折りたたみ可能な設定である場合, the a2h-drawer shall 利用者が手順の表示/非表示を切り替えできる
7.4 The a2h-drawer shall モーダルの閉じる操作（例: 閉じるボタン）を提供する

### Requirement 8: サンプルプロジェクト（/example）

**Objective:** As a 開発者, I want 実際に動作するサンプルで導入方法を確認したい, so that すぐに自分のアプリへ適用できる

#### Acceptance Criteria

8.1 The a2h-drawer shall `/example` 配下にサンプルReactプロジェクトを含める
8.2 When 開発者がサンプルを起動したとき, the a2h-drawer shall 「Install」導線の押下でモーダルが表示される一連のフローを確認できる
8.3 The a2h-drawer shall サンプル内で基本的なカスタマイズ（文言やメディア差し替え）の例を示す

### Requirement 9: テスト（lib / example）

**Objective:** As a 開発者, I want 自動化されたテストで主要な挙動を継続的に検証したい, so that 変更による回帰を早期に検知できる

#### Acceptance Criteria

9.1 The a2h-drawer shall ライブラリ側でコンポーネント単位のユニットテストを含める
9.2 The a2h-drawer shall ライブラリ側でHooks単位のユニットテストを含める
9.3 The a2h-drawer shall ライブラリ側で最小限の結合テスト（例: Hook + コンポーネントの組み合わせ）を含める
9.4 The a2h-drawer shall `/example` 側で、実際のDOMレンダリング結果を担保するテストを含める
9.5 When `/example` の利用者がクリック操作を行うとき, the a2h-drawer shall モーダルの開閉状態が期待通りに変化することをテストで確認できる
9.6 When `/example` をテストするとき, the a2h-drawer shall favicon（`icon.png` 等、設定されている画像を優先して取得）を取得して表示できていることを確認できる
9.7 When `/example` をテストするとき, the a2h-drawer shall title および description が正常に取得・表示できていることを確認できる
9.8 Where `/example` が動画を含む設定である場合, the a2h-drawer shall 動画が再生されている（もしくは再生開始が試行されている）ことを確認できる
9.9 When テストを実行するとき, the a2h-drawer shall 失敗時に原因が特定できる情報（例: 期待値と実際値）を出力する
