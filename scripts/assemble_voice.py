# Builds voice.wav + voice.json from per-line mp3 + word timings made on another machine (make_voices.py).
#   python3 scripts/assemble_voice.py <lines.json> <dir with l00.mp3, l00.json ...> <out_dir>
import json, os, subprocess, sys, wave
lines_p, src, out = sys.argv[1:4]
cfg = json.load(open(lines_p, encoding='utf-8')); os.makedirs(out, exist_ok=True)
voice = open(f'{src}/voice.txt').read().strip() if os.path.exists(f'{src}/voice.txt') else cfg['voice']
trim = 'silenceremove=start_periods=1:start_threshold=-50dB,areverse,silenceremove=start_periods=1:start_threshold=-50dB,areverse'
t = cfg.get('lead', 0.4); lines, parts = [], []
for i, ln in enumerate(cfg['lines']):
    words = json.load(open(f'{src}/l{i:02d}.json')); wav = f'{out}/l{i:02d}.wav'
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', f'{src}/l{i:02d}.mp3', '-af', trim, '-ar', '48000', '-ac', '1', wav], check=True)
    with wave.open(wav) as w: d = w.getnframes() / w.getframerate()
    lead = words[0]['t'] if words else 0
    subw = (ln.get('sub') or ln['say']).split()
    ws = [{'w': subw[k] if len(subw) == len(words) else w['w'], 't': round(t + w['t'] - lead, 3)} for k, w in enumerate(words)]
    lines.append({'i': i, 'text': ln.get('sub') or ln['say'], 'start': round(t, 3), 'end': round(t + d, 3), 'words': ws})
    if len(subw) != len(words): print('note: line', i, 'word count differs', len(subw), len(words))
    parts.append((wav, t)); t += d + ln.get('gap', 0.4)
total = round(t + cfg.get('tail', 1.2), 3)
inputs = sum([['-i', p] for p, _ in parts], [])
flt = ''.join(f'[{k}]adelay={int(st * 1000)}|{int(st * 1000)}[a{k}];' for k, (_, st) in enumerate(parts))
flt += ''.join(f'[a{k}]' for k in range(len(parts))) + f'amix=inputs={len(parts)}:normalize=0,apad=whole_dur={total}[o]'
subprocess.run(['ffmpeg', '-v', 'error', '-y', *inputs, '-filter_complex', flt, '-map', '[o]', '-ar', '48000', f'{out}/voice.wav'], check=True)
json.dump({'voice': voice, 'total': total, 'lines': lines}, open(f'{out}/voice.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print('ok', voice, total)
