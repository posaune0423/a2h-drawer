# Research & Design Decisions

## Summary

- **Feature**: `a2h-drawer`
- **Discovery Scope**: New Feature
- **Key Findings**:
  - Tailwind は `motion-safe:` / `motion-reduce:` バリアントで reduced motion を扱えるため、iOSライクなアニメーションの適用/抑制を設計で明示できる。
  - shadcn/ui の Dialog（Radix UI 由来）はフォーカストラップや Escape 閉じなどの基本アクセシビリティを満たしやすい一方、スクロールロック等の副作用があり得るため、採用時の注意点を設計で固定する必要がある。
  - `liquid-glass-react` は Safari で一部エフェクトが限定される可能性があるため、効果の「段階的劣化（degrade gracefully）」を前提にする必要がある。
  - Bun のテストランナーで React Testing Library を使う場合、`jsdom` ではなく `happy-dom` を前提にするのが現実的。
  - `/example` の「実DOM」検証は、`happy-dom` による DOM 検証（表示/クリック/状態/属性）で成立する一方、「動画が再生されている」等のブラウザ依存挙動は E2E（Playwright等）が必要になり得る。Playwright は Bun 互換が限定的なため、実行環境の取り扱いを設計上で分離しておく。

## Research Log

### Tailwind CSS v4 での iOS ライクなアニメーションと reduced motion

- **Context**: 6.4, 6.5, 6.6（iOSライクなトランジション + reduced motion + Tailwind v4）
- **Sources Consulted**:
  - [Tailwind CSS - Animation](https://tailwindcss.com/docs/animation)
  - [MDN - prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion)
- **Findings**:
  - `motion-safe:` / `motion-reduce:` により、OS設定に応じてアニメーションを適用/抑制できる。
- **Implications**:
  - 設計として、開閉アニメーションを `motion-safe:` に寄せ、`motion-reduce:` で `transition-none` 等に落とす方針を明記する。

### shadcn/ui（Radix UI）Dialog のアクセシビリティと副作用

- **Context**: 2.x（グローバルモーダル）、6.3（アクセシビリティ）
- **Sources Consulted**:
  - [shadcn/ui - Dialog](https://www.shadcn.io/ui/dialog)
  - [Radix UI issue: focus return behavior](https://github.com/radix-ui/primitives/issues/2942)
  - [shadcn-ui issue: scroll lock](https://github.com/shadcn-ui/ui/issues/6988)
- **Findings**:
  - 基本的なフォーカストラップ、Escape 閉じ、ARIA セマンティクスを満たしやすい。
  - スクロールロックやレイアウトシフト等の副作用が発生し得る。
- **Implications**:
  - 設計で「Dialog を採用する場合の前提（フォーカス/スクロール/戻りフォーカス）」を固定し、必要ならライブラリ側でオプション化する。

### liquid-glass-react の対応範囲（Safari での劣化）

- **Context**: 6.1（liquid glass 外観）、iOS Safari 対象
- **Sources Consulted**:
  - [liquid-glass-react (npm)](https://www.npmjs.com/package/liquid-glass-react)
  - [rdev/liquid-glass-react (GitHub)](https://github.com/rdev/liquid-glass-react)
- **Findings**:
  - 一部の視覚効果はブラウザ依存で完全再現できない可能性がある（特に Safari）。
- **Implications**:
  - 視覚効果は「必須の機能要件」ではなく「UX品質要件」として扱い、最低限の可読性・操作性を優先する。

### Bun + React テスト（happy-dom）

- **Context**: 9.1〜9.3（lib側 unit/integration）
- **Sources Consulted**:
  - [Bun - Testing Library guide](https://bun.com/docs/guides/test/testing-library)
  - [Bun - bun test](https://bun.sh/docs/cli/test)
- **Findings**:
  - Bun では `happy-dom` を preloaded して Testing Library を動かす構成が公式ガイドに沿う。
- **Implications**:
  - ライブラリ側の unit/integration は Bun + Testing Library + happy-dom を標準にする。

### `/example` の DOM 検証と E2E の扱い

- **Context**: 9.4〜9.8（DOM/クリック/開閉/アイコン/title/description/動画）
- **Sources Consulted**:
  - [Playwright issue: Bun support not planned](https://github.com/microsoft/playwright/issues/27139)
- **Findings**:
  - 「動画が再生されている」等は実ブラウザが必要になる可能性が高い。
  - Playwright は Bun 実行に制約があるため、E2E を切り離す必要がある。
- **Implications**:
  - `/example` テストは二層で設計する:
    - DOM 検証（表示/属性/クリック/状態）は `happy-dom` で必須要件を担保
    - ブラウザ依存（実再生等）は任意の E2E として補完（CI/開発での実行方法を設計で分離）

## Architecture Pattern Evaluation

| Option              | Description                                         | Strengths                                | Risks / Limitations         | Notes                                                     |
| ------------------- | --------------------------------------------------- | ---------------------------------------- | --------------------------- | --------------------------------------------------------- |
| UI + State Provider | Provider + Hook + Portal でグローバルモーダルを制御 | 導入が容易、どこからでも開閉、テスト容易 | Provider 必須に見える可能性 | Provider を推奨しつつ、限定的に非Provider運用も設計で検討 |

## Design Decisions

### Decision: グローバルモーダル制御は Provider + Hook を中核にする

- **Context**: 4.7, 4.8（どこからでも開けるシンプルHook）
- **Alternatives Considered**:
  1. グローバルシングルトン（モジュールスコープ状態）
  2. Provider + Hook（React Context）
- **Selected Approach**: Provider + Hook を P0 の標準導入経路として採用する。
- **Rationale**: React の流儀に合い、状態の一貫性とテスト容易性が高い。
- **Trade-offs**: Provider 未設置時の取り扱い（no-op/例外）を設計で明確化する必要がある。
- **Follow-up**: Provider 未設置時の API 契約（安全に no-op か、開発時警告か）を `design.md` で固定する。

### Decision: `/example` テストは DOM 検証を必須、E2E を任意として分離する

- **Context**: 9.4〜9.8（DOM/動画など）
- **Alternatives Considered**:
  1. 全てを `happy-dom` で完結（動画再生は play 呼び出し確認）
  2. 実ブラウザ E2E を必須（Playwright 等）
- **Selected Approach**: 1 を必須、2 を任意とし、動画は「再生開始が試行される」ことを DOM レベルで確認可能な設計にする。
- **Rationale**: Bun 中心の開発体験を保ちつつ、現実的に回るテスト戦略にする。
- **Trade-offs**: 実ブラウザでの完全保証は任意テストに委ねる。
- **Follow-up**: video の再生開始 API 呼び出しを抽象化/観測可能にしてテスト可能性を担保する。

## Risks & Mitigations

- Safari で glass 表現が劣化する可能性 — 最低限の可読性/コントラストを優先し、効果は段階的劣化を許容する。
- モーダルのスクロールロックやレイアウトシフト — 実装で副作用を最小化できるよう、設計でオプション/注意点を明記する。
- `/example` の動画再生検証が環境依存 — DOM 検証（play 試行）を必須にし、実ブラウザ E2E は任意として分離する。

## References

- [Tailwind CSS - Animation](https://tailwindcss.com/docs/animation)
- [Bun - Testing Library guide](https://bun.com/docs/guides/test/testing-library)
- [shadcn/ui - Dialog](https://www.shadcn.io/ui/dialog)
- [rdev/liquid-glass-react](https://github.com/rdev/liquid-glass-react)
