# AI-Powered Tutoring App - Design Guidelines

## Design Approach

**Selected Approach**: Design System - Material Design with Educational Adaptations

**Justification**: As a utility-focused educational tool prioritizing clarity, learnability, and information density, Material Design provides:
- Strong visual hierarchy for structured content
- Clear feedback mechanisms for AI processing states
- Robust component patterns for complex interactions
- Excellent readability for long-form educational content

**Reference Inspirations**: Linear (clean typography and spacing), Notion (content organization), Codecademy (code-focused educational interface)

## Core Design Elements

### A. Typography

**Font Families**:
- Primary: Inter (via Google Fonts) - All UI text, explanations, labels
- Code: JetBrains Mono (via Google Fonts) - Code examples, technical terms

**Type Scale**:
- Hero/Page Title: text-4xl font-bold (main app title)
- Section Headers: text-2xl font-semibold (explanation sections)
- Subsection Headers: text-lg font-semibold (definition, step-by-step, summary headers)
- Body Text: text-base font-normal (explanations, chat messages)
- Small Text: text-sm (timestamps, metadata, topic tags)
- Code Text: text-sm font-mono (inline code and code blocks)

**Line Heights**: Use generous line-height-relaxed (1.625) for explanation text to enhance readability of educational content

### B. Layout System

**Spacing Primitives**: Use Tailwind units of **2, 4, 6, 8, 12, 16** for consistent rhythm
- Micro spacing: p-2, gap-2 (tight element spacing)
- Standard spacing: p-4, gap-4, m-4 (default component padding)
- Section spacing: p-6, py-8 (content area padding)
- Major sections: p-8, gap-12 (between major UI regions)
- Generous spacing: p-16 (outer containers, hero areas)

**Grid Structure**:
- Main container: max-w-7xl mx-auto px-4
- Chat/Query area: max-w-4xl (optimal reading width for explanations)
- Sidebar (history): Fixed width w-80 on desktop, full-width drawer on mobile
- Code blocks: Full width of content container with horizontal scroll if needed

### C. Component Library

**Navigation/Header**:
- Fixed top bar (h-16) with app logo/title on left
- User actions on right (settings, history toggle if not using sidebar)
- Subtle bottom border for separation
- Minimal, stays out of the way of content

**Query Input Interface**:
- Prominent textarea with min-h-32, rounded-lg border
- Floating "Ask Question" button positioned at bottom-right of textarea
- Character count indicator (text-sm) at bottom-left
- Placeholder text: "Ask me anything about coding, math, science, or AI/ML..."
- Auto-focus on load for immediate interaction

**Chat/Conversation Container**:
- Alternating message bubbles: user queries vs AI responses
- User messages: Right-aligned, max-w-3xl, rounded-2xl padding p-4
- AI responses: Left-aligned, full-width of container, structured sections
- Clear visual distinction between message types through spacing and borders

**AI Response Structure**:
- Container: Border-l-4 accent border, rounded-lg, p-6 bg-subtle
- Section headers (Definition, Explanation, Code Example, Summary): text-lg font-semibold mb-3
- Vertical spacing between sections: space-y-6
- Each section has rounded-md bg-subtle-secondary p-4 treatment
- Code blocks: Dark background, syntax highlighting, rounded-md p-4, with copy button top-right

**Topic Tags**:
- Small pills: rounded-full px-3 py-1 text-sm
- Auto-detected subject badges (Python, Math, Data Science)
- Positioned at top of AI response or as metadata
- Use subtle border treatment, not filled backgrounds

**Chat History Panel** (Sidebar or Drawer):
- Fixed sidebar w-80 on desktop (lg:)
- Slide-in drawer on mobile
- List of previous conversations with timestamps
- Each item shows: First line of question (text-sm truncate), topic tag, timestamp
- Current conversation highlighted with subtle border-l-4
- Scrollable list with space-y-2 between items
- Download/export button at bottom of panel

**Loading States**:
- Three animated dots (typing indicator) for AI processing
- Skeleton screens for loading history
- Progress bar or spinner during model inference
- Clear "AI is thinking..." text indicator

**Code Syntax Highlighting**:
- Use Prism.js or Highlight.js via CDN
- Dark theme for code blocks (even in light mode app)
- Line numbers for multi-line code
- Copy-to-clipboard button (icon-only) positioned top-right of code block

**Empty States**:
- Centered content when no conversation history
- Welcoming illustration placeholder or large icon
- Helpful prompt: "Start by asking your first question"
- 3-4 example questions as clickable suggestions (rounded-lg border cards)

**Icons**:
- Use Heroicons via CDN
- 20x20 (w-5 h-5) for inline icons
- 24x24 (w-6 h-6) for primary actions
- Icons for: Send (paper airplane), History (clock), Download (arrow-down), Copy (duplicate), Settings (gear)

### D. Interaction Patterns

**Input Behavior**:
- Textarea auto-expands as user types (max-h-64)
- Enter to submit, Shift+Enter for new line
- Clear visual feedback on submit (textarea clears, focus returns)
- Submit button disables during AI processing

**Response Rendering**:
- Fade-in animation (duration-300) as AI response loads
- Markdown rendering with proper HTML semantics
- Collapsible code examples if very long (>30 lines)
- Smooth scroll to new response after generation

**History Interaction**:
- Click history item loads that conversation
- Smooth transition when switching conversations
- Delete button (trash icon) on hover for each history item
- Confirmation modal before deletion

**Responsive Behavior**:
- Mobile: Stack everything vertically, full-width inputs
- Tablet: Maintain similar layout to desktop, adjust spacing
- Desktop: Sidebar always visible (if using sidebar pattern)
- Breakpoints: sm:, md:, lg:, xl: for major layout shifts

## Images

**No Hero Image Required**: This is a web application, not a marketing site. Focus is on functional interface, not promotional imagery.

**Icon/Illustration Usage**:
- Welcome state illustration (abstract education/learning graphic)
- Empty state icons (book, lightbulb, question mark)
- Loading state: Simple animated icon
- All sourced from free illustration libraries (unDraw, Humaaans)

## Design Principles

1. **Clarity First**: Educational content must be immediately readable and well-structured
2. **Progressive Disclosure**: Show information as needed, collapse lengthy code examples
3. **Minimal Friction**: One-click actions, auto-focus inputs, keyboard shortcuts
4. **Feedback Always**: Every action has visual confirmation (loading, success, error)
5. **Content is King**: UI stays subtle, letting AI explanations take center stage