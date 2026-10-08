# Taste (Continuously Learned by [CommandCode][cmd])

[cmd]: https://commandcode.ai/

# env
See [env/taste.md](env/taste.md)
# web
See [web/taste.md](web/taste.md)
# ui/form
See [ui/form/taste.md](ui/form/taste.md)
# ui/navigation

- Nested `<Tabs>` layouts that exist only for route/screen organization (not actual bottom navigation) must hide the tab bar via `tabBarStyle: { display: 'none' }` — sub-screens like trip detail use custom header tabs for navigation, and the bottom tab bar should not appear there. The main app-level `(tabs)` group is the only place the bottom tab bar should be visible. Confidence: 0.8

# ui/icons
See [ui/icons/taste.md](ui/icons/taste.md)
# workflow
See [workflow/taste.md](workflow/taste.md)
# communication

- Communication is a mix of Indonesian and English; agent may respond in Indonesian, but all code must be written in English (variable names, comments, strings, file content). Confidence: 0.9
- Provides structured IDE context in messages using `<ide-context>` blocks containing file path, language, and line number — signals that the agent should reference the exact file location to understand the current working context. Reconfirmed when the user pasted an IDE error for `backend/api/index.ts` (line 5) with a bare `<ide-context>` block and no further explanation — the agent anchored on that exact file/line to investigate. Confidence: 0.9

# architecture
See [architecture/taste.md](architecture/taste.md)
