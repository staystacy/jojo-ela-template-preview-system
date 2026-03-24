# JOJO ELA Template Preview System

Internal review tool for rendering and reviewing 16 JOJO ELA Worksheet Templates across PreK-G3.

## Directory Structure

```
docs/
  framework/          # Core design documents
    JOJO-ELA-Template-System-v2.md        # 16 Template specs (layout, variants, JSON fields)
    JOJO-ELA-Workbook-Library-Framework.md # 43 Workbook library (PreK-G3)
    JOJO-ELA-Framework-Design-Doc.md       # Design rationale & research summary
  research/           # Background research (7 areas)
    01-KUMON-Reading/
    02-Phonics-Worksheets/
    03-SightWords-Vocab-Spelling/
    04-ReadingComp-Fluency-Writing/
    05-Standards-Research/
    06-iXL-Worksheets/
    07-Workbook-Market/
  prompt/             # Claude Code build prompt
    Claude-Code-Prompt-Template-Preview-v2.md
src/                  # Preview tool source code (TBD)
```

## Usage with Claude Code

1. Open this repo in Claude Code
2. Reference `docs/prompt/Claude-Code-Prompt-Template-Preview-v2.md` as the build prompt
3. Claude Code reads the framework docs and builds the preview tool into `src/`

## Key Documents

| Document | Purpose |
|----------|---------|
| Template System v2 | 16 templates with variants, JSON schema, layout specs |
| Workbook Library | 43 workbooks across PreK-G3, unit breakdowns |
| Framework Design Doc | Why decisions were made, research data, expert/parent optimizations |
| Preview Prompt v2 | Full build instructions for the preview tool |
