### Frontend Architecture & Theming Guidelines
- **Strict Componentization**: Follow a rigorous component-based architecture. Break down the UI into granular, reusable components (e.g., `<Logo />`, `<NavBar />`, `<AnimatedBackground />`, `<ServiceCard />`) rather than monolithic pages.
- **Developer Handoff**: Structure files so that a front-end developer can easily locate and modify specific UI elements without wading through complex page logic.
- **Theme Support**: Every UI component MUST support both light and dark themes using Tailwind's `dark:` modifier (or the chosen theming strategy). Never hardcode colors that only work in one theme.
- **Consistency**: Maintain a consistent design language across all components.
