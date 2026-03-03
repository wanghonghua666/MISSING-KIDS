# Missing Kids Web UI 规范（简版）

> 目标：保证之后所有页面的 UI 行为一致，特别是 **头/尾布局** 和 **页面过渡动画**，避免未来的实现偏离现在的设计。

## 布局骨架

- **整体结构**
  - 顶层页面（例如 `StartPage`、`HomePage`、`WorkPage` 等）应统一使用如下结构：
    - 固定的 `Header`
    - 内容区域由 `MainContent` 组件承载
    - 固定的 `Footer`
  - 头部和尾部属于「框架」，**任何新页面都不要改动它们的结构和定位方式**，只在中间内容区域变化。

- **示意结构（简化）**

  ```tsx
  <div className="w-full min-h-screen flex flex-col">
    <Header />
    <div className="mk-header-spacer" aria-hidden />
    <MainContent className="...">
      {/* 页面主内容 */}
    </MainContent>
    <Footer />
  </div>
  ```

## 页面过渡（Transition）约定

- **核心规则**
  - 只有 `MainContent` 所包裹的中间内容参与 **页面淡入/淡出** 动画。
  - `Header` / `Footer` 在普通路由切换时 **不做淡入淡出**，始终保持稳定。

- **统一入口：`MainContent` 组件**
  - 组件位置：`components/layout/main-content.tsx`
  - 约定：
    - 通过 `useRouteTransition()` 获取当前是否为退出态。
    - 初次挂载时避免错误应用 `exiting`（已在组件内部处理）。
    - 根据状态给 `<main>` 自动追加以下类：
      - 进入：`mk-content-enter`
      - 退出：`mk-content-exit`
  - **所有需要页面过渡动画的中间内容，都必须包在 `MainContent` 里，而不是自己再写一套动画。**

- **动画类定义（只做参考，不要随意改语义）**
  - `mk-content-enter`：`mkContentIn 260ms ease both`，从透明到不透明。
  - `mk-content-exit`：`mkContentOut 220ms ease both`，从不透明到透明，并禁止指针事件。
  - 这些类在 `app/globals.css` 中定义，未来如需调整时，只改动画表现，不改类名语义。

- **特殊序列：从 Start → Home**
  - 从 `/`（Start 页面）跳转到 `/home` 时，遵循已实现的「**Header → Footer → Main 顺序淡入**」：
    - `.mk-from-start .mk-header` 使用 `mkFadeIn 800ms ease both`
    - `.mk-from-start .mk-footer` 使用 `mkFadeIn 800ms ease 150ms both`
    - `.mk-from-start-main` 使用 `mkFadeIn 700ms ease 850ms both`
  - 之后如再新增「起始落地页 → 主站」的动效，**复用这一套节奏**，不要另起新名字和时序。

## Work 页面布局对齐约定（当前状态）

> 这一节是为了记住你现在看到的布局状态，之后如果再改 Work 页时不至于忘记。

- **MainContent 对齐**
  - `WorkPage` 中的 `MainContent` 使用：

    ```tsx
    <MainContent className="flex-1 w-full flex items-center justify-center pb-[42px]">
    ```

  - 含义：
    - 垂直方向用 `items-center`，让中间大块内容在视口中线附近。
    - 水平方向 `justify-center`，保证内容区域居中，而不是贴边。

- **Work 主内容容器**
  - 容器类名（JSX 中）：  
    `w-full max-w-[1438px] h-[594px] flex justify-start gap-[48px] p-[48px] mk-work-layout`
  - 左侧为分类侧边栏，右侧为商品区域；PC 端保持左右结构，移动端通过 `.mk-work-layout` 媒体查询改为竖排。

- **商品区域容器**
  - 容器类名（JSX 中当前状态）：  
    `flex-1 flex flex-col items-center justify-start gap-[16px] h-[600px]`
  - 约定：
    - 高度固定为 `600px`，方便两行商品网格整体对齐。
    - 主轴顶部对齐（`justify-start`），交叉轴居中（`items-center`），视觉上中央有一个整块商品区。

## Tailwind 与自定义类的使用约定

- **优先使用 Tailwind 原子类** 做布局、间距、对齐（如 `flex`, `items-center`, `justify-center`, `gap-[16px]` 等）。
- **只在以下场景使用自定义类（`mk-*`）**：
  - 需要跨页面共享的设计语言（如 `.mk-header`, `.mk-footer`, `.mk-product-card`）。
  - 动画与状态类（如 `.mk-content-enter`, `.mk-content-exit`, `.mk-from-start-main`）。
  - 复杂的视觉效果（如 `.mk-glass`, `.mk-product-overlay-box`）。

## 以后修改时要记住的事

- 新页面 / 新路由：
  - 头尾结构沿用现有实现，不要复制一套新的 header/footer。
  - 中间内容统一通过 `MainContent` 注入过渡动画，不在局部组件里再写整页 fade。
- 想改页面过渡效果时：
  - 只调 `globals.css` 里相关动画的细节（时长、 easing、透明度），**不要随意改类名或分散实现**。
- Work 页如果有布局调整：
  - 优先调整 `work/page.tsx` 里的 Tailwind 类，而不是在别处增加覆盖样式。

