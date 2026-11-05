# Voices on a GitHub runner: every <lang>.lines.json in a folder -> <out>/<lang>/l00.mp3 + l00.json + voice.txt.
#   python3 scripts/voices.py <folder with lines.json files> <out dir>
# Prints only progress numbers: this repo is public, the text stays in the private one.
import asyncio, glob, json, os, random, sys
import edge_tts

async def one(text, voice, rate, pitch):
    c = edge_tts.Communicate(text, voice, rate=rate, pitch=pitch, boundary="WordBoundary")
    audio, words = bytearray(), []
    async for ch in c.stream():
        if ch["type"] == "audio": audio += ch["data"]
        elif ch["type"] == "WordBoundary": words.append({"w": ch["text"], "t": ch["offset"] / 1e7})
    if not audio: raise RuntimeError("no audio")
    return bytes(audio), words

async def main(src, out):
    for p in sorted(glob.glob(f"{src}/*.lines.json")):
        code = os.path.basename(p).split(".")[0]; cfg = json.load(open(p, encoding="utf-8"))
        d = f"{out}/{code}"; os.makedirs(d, exist_ok=True)
        for i, ln in enumerate(cfg["lines"]):
            for attempt in range(14):
                try:
                    a, w = await asyncio.wait_for(one(ln["say"], ln.get("voice", cfg["voice"]), ln.get("rate", cfg["rate"]), ln.get("pitch", cfg["pitch"])), 30); break
                except Exception as e:
                    print("retry", code, i, type(e).__name__, flush=True); await asyncio.sleep(min(90, 5 * 2 ** attempt) + random.random() * 5)
            else:
                sys.exit(f"failed {code} line {i}")
            open(f"{d}/l{i:02d}.mp3", "wb").write(a); json.dump(w, open(f"{d}/l{i:02d}.json", "w"))
            await asyncio.sleep(1.5)  # long episodes: the service stops answering if lines come too fast
        open(f"{d}/voice.txt", "w").write(cfg["voice"])
        print("ok", code, len(cfg["lines"]), flush=True)

asyncio.run(main(*sys.argv[1:3]))
