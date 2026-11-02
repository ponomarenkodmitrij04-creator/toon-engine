# toon-engine

Renderer for short animated stories (Remotion). Contains the characters, rooms, captions and the parallel render workflow.
Episodes, scripts and voices are kept in a separate private repository and overlaid at render time.

Run the workflow `render` (Actions tab, Run workflow): episode prefix (for example `Day3`), languages, number of chunks.
Needs the variable `CONTENT_REPO` and the secret `CONTENT_TOKEN`.
