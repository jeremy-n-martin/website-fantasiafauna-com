#!/usr/bin/env python3
"""Transform audio files to make them unique and minimize disk space.

Transformations:
1. Pitch shift ±15% randomly (changes sonic signature)
2. Convert to OGG Vorbis (better compression than MP3/WAV)
3. Reduce sample rate: 22kHz for SFX, 44kHz for music
4. VBR quality 4 (good balance of quality/size)
5. Normalize volume
6. Mono for SFX (halves size vs stereo)
"""
import json, subprocess, random, sys
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor, as_completed

SONS_ROOT = Path('D:/dev/website-fantasiafauna-com/sons')
OUTPUT_ROOT = Path('D:/dev/website-fantasiafauna-com/sons_processed')
CATALOG_INPUT = Path('D:/dev/website-fantasiafauna-com/audio_catalog.json')
CATALOG_OUTPUT = Path('D:/dev/website-fantasiafauna-com/audio_catalog_processed.json')

# Quality settings
SFX_SAMPLE_RATE = 22050
MUSIC_SAMPLE_RATE = 44100
VBR_QUALITY = 4
PITCH_RANGE = (-0.15, 0.15)

def transform_audio(src: Path, dst: Path, is_music: bool = False) -> dict:
    """Transform audio file with pitch shift and compression."""
    dst.parent.mkdir(parents=True, exist_ok=True)
    
    pitch_shift = random.uniform(*PITCH_RANGE)
    pitch_ratio = 1.0 + pitch_shift
    sample_rate = MUSIC_SAMPLE_RATE if is_music else SFX_SAMPLE_RATE
    
    filters = [
        f'asetrate={sample_rate}*{pitch_ratio}',
        'aresample',
        'loudnorm=I=-16:LRA=11:TP=-1.5',
    ]
    
    cmd = [
        'ffmpeg', '-y', '-hide_banner', '-loglevel', 'error',
        '-i', str(src),
        '-af', ','.join(filters),
        '-ar', str(sample_rate),
        '-ac', '2' if is_music else '1',
        '-c:a', 'libvorbis',
        '-q:a', str(VBR_QUALITY),
        str(dst)
    ]
    
    try:
        result = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, timeout=60, text=True)
        if result.returncode != 0:
            return {'success': False, 'error': result.stderr[:200]}
        return {
            'success': True,
            'pitch_shift': round(pitch_shift, 4),
            'src_size': src.stat().st_size,
            'dst_size': dst.stat().st_size,
        }
    except subprocess.TimeoutExpired:
        return {'success': False, 'error': 'timeout'}
    except Exception as e:
        return {'success': False, 'error': str(e)}

def process_dir(category: str, is_music: bool = False):
    """Process all files in a category directory."""
    src_dir = SONS_ROOT / category
    dst_dir = OUTPUT_ROOT / category
    dst_dir.mkdir(parents=True, exist_ok=True)
    
    files = sorted(src_dir.glob('*'))
    files = [f for f in files if f.suffix.lower() in {'.wav', '.mp3', '.ogg'}]
    
    if not files:
        return {'count': 0, 'original': 0, 'compressed': 0, 'errors': []}
    
    print(f"  {category}: {len(files)} files", end='', flush=True)
    
    original_total = 0
    compressed_total = 0
    errors = []
    processed = 0
    
    for src in files:
        dst = dst_dir / f"{src.stem}.ogg"
        info = transform_audio(src, dst, is_music)
        if info['success']:
            original_total += info['src_size']
            compressed_total += info['dst_size']
        else:
            errors.append(f"{src.name}: {info['error']}")
        processed += 1
        if processed % 100 == 0:
            print(f" [{processed}]", end='', flush=True)
    
    print(f" → {original_total/1024/1024:.1f} MB → {compressed_total/1024/1024:.1f} MB")
    return {
        'count': len(files),
        'original': original_total,
        'compressed': compressed_total,
        'errors': errors,
    }

def main():
    print("=== Audio Transformation Pipeline ===")
    print(f"Pitch shift: ±{abs(PITCH_RANGE[0])*100:.0f}%")
    print(f"SFX: {SFX_SAMPLE_RATE} Hz mono, OGG q{VBR_QUALITY}")
    print(f"Music: {MUSIC_SAMPLE_RATE} Hz stereo, OGG q{VBR_QUALITY}")
    print()
    
    stats = {}
    all_errors = []
    
    # SFX categories
    for cat in ['creatures', 'spells', 'battle', 'ui']:
        stats[cat] = process_dir(cat, is_music=False)
        all_errors.extend(stats[cat]['errors'])
    
    # Music (higher quality)
    stats['music'] = process_dir('music', is_music=True)
    all_errors.extend(stats['music']['errors'])
    
    # Summary
    print("\n=== Results ===")
    total_orig = sum(s['original'] for s in stats.values())
    total_comp = sum(s['compressed'] for s in stats.values())
    
    for cat, s in stats.items():
        ratio = s['compressed'] / s['original'] * 100 if s['original'] > 0 else 0
        saved = (s['original'] - s['compressed']) / 1024 / 1024
        print(f"  {cat:12s}: {s['count']:4d} files, {s['original']/1024/1024:7.1f} MB → {s['compressed']/1024/1024:6.1f} MB ({ratio:.0f}%, saved {saved:.1f} MB)")
    
    if total_orig > 0:
        print(f"\n  TOTAL: {total_orig/1024/1024:.1f} MB → {total_comp/1024/1024:.1f} MB")
        print(f"  Saved: {((total_orig-total_comp)/1024/1024):.1f} MB ({(1-total_comp/total_orig)*100:.1f}%)")
    
    if all_errors:
        print(f"\n  Errors: {len(all_errors)}")
        for e in all_errors[:5]:
            print(f"    {e}")
    
    # Build updated catalog
    print("\nBuilding updated catalog...")
    new_catalog = {
        'metadata': {
            'total_files': sum(s['count'] for s in stats.values()),
            'source': 'Transformed from Heroes of Might and Magic III Complete',
            'formats': ['ogg'],
            'processing': {
                'pitch_shift': f'random ±{abs(PITCH_RANGE[0])*100:.0f}%',
                'sfx_sample_rate': SFX_SAMPLE_RATE,
                'music_sample_rate': MUSIC_SAMPLE_RATE,
                'vbr_quality': VBR_QUALITY,
                'sfx_channels': 'mono',
                'music_channels': 'stereo',
                'total_original_mb': round(total_orig / 1024 / 1024, 1),
                'total_compressed_mb': round(total_comp / 1024 / 1024, 1),
                'compression_ratio': f'{total_comp/total_orig*100:.1f}%' if total_orig > 0 else 'N/A',
            },
            'by_category': {cat: s['count'] for cat, s in stats.items()},
        },
        'creatures': {},
        'spells': {},
        'battle': [],
        'ui': [],
        'music': [],
    }
    
    # Scan output directories and rebuild catalog entries
    for cat in ['creatures', 'spells', 'battle', 'ui', 'music']:
        out_dir = OUTPUT_ROOT / cat
        if not out_dir.exists():
            continue
        for f in sorted(out_dir.glob('*.ogg')):
            size = f.stat().st_size
            name = f.stem
            entry = {
                'file': f"sons_processed/{cat}/{f.name}",
                'name': name,
                'format': 'ogg',
                'size_bytes': size,
            }
            
            if cat == 'creatures':
                # Parse creature_id and action from filename: aagl_attack
                parts = name.split('_', 1)
                creature_id = parts[0].upper()
                action = parts[1] if len(parts) > 1 else 'unknown'
                if creature_id not in new_catalog['creatures']:
                    new_catalog['creatures'][creature_id] = {'name': creature_id, 'sounds': {}}
                new_catalog['creatures'][creature_id]['sounds'][action] = entry
            elif cat == 'spells':
                new_catalog['spells'][name] = entry
            else:
                new_catalog[cat].append(entry)
    
    CATALOG_OUTPUT.write_text(json.dumps(new_catalog, indent=2, ensure_ascii=False), encoding='utf-8')
    print(f"Catalog written: {CATALOG_OUTPUT}")

if __name__ == '__main__':
    main()
