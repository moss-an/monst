import io
import os
import re
import struct
from PIL import Image, ImageDraw

# 512x512 基準のジオメトリ（favicon.svg と同一）
VIEWBOX_SIZE = 512.0
CIRCLE_CX = 256.0
CIRCLE_CY = 256.0
CIRCLE_R = 240.0


def _cubic_bezier(p0, p1, p2, p3, steps=200):
    pts = []
    for i in range(steps + 1):
        t = i / steps
        mt = 1.0 - t
        x = (
            (mt ** 3) * p0[0]
            + 3.0 * (mt ** 2) * t * p1[0]
            + 3.0 * mt * (t ** 2) * p2[0]
            + (t ** 3) * p3[0]
        )
        y = (
            (mt ** 3) * p0[1]
            + 3.0 * (mt ** 2) * t * p1[1]
            + 3.0 * mt * (t ** 2) * p2[1]
            + (t ** 3) * p3[1]
        )
        pts.append((x, y))
    return pts


def extract_character_polygon(svg_text: str):
    """favicon.svg の <path d="..."> からキャラクター形状の多角形頂点列を抽出する"""
    path_match = re.search(r'<path\b[^>]*\bd="([^"]+)"', svg_text, flags=re.DOTALL | re.IGNORECASE)
    if not path_match:
        raise ValueError("favicon.svg に <path d=...> が見つかりませんでした。")

    d_attr = path_match.group(1)
    tokens = re.findall(r"[A-Za-z]|[-+]?(?:\d+\.\d*|\d+|\.\d+)", d_attr)
    idx = 0
    cur = (0.0, 0.0)
    points = []

    while idx < len(tokens):
        cmd = tokens[idx]
        idx += 1
        if cmd in ("M", "m"):
            x = float(tokens[idx])
            y = float(tokens[idx + 1])
            idx += 2
            cur = (x, y) if cmd == "M" else (cur[0] + x, cur[1] + y)
            points.append(cur)
        elif cmd in ("C", "c"):
            while idx + 5 < len(tokens) and not re.match(r"^[A-Za-z]$", tokens[idx]):
                vals = [float(v) for v in tokens[idx : idx + 6]]
                idx += 6
                if cmd == "C":
                    p1 = (vals[0], vals[1])
                    p2 = (vals[2], vals[3])
                    p3 = (vals[4], vals[5])
                else:
                    p1 = (cur[0] + vals[0], cur[1] + vals[1])
                    p2 = (cur[0] + vals[2], cur[1] + vals[3])
                    p3 = (cur[0] + vals[4], cur[1] + vals[5])
                seg = _cubic_bezier(cur, p1, p2, p3, steps=200)
                points.extend(seg[1:])
                cur = p3
        elif cmd in ("Z", "z"):
            break

    if len(points) < 3:
        raise ValueError("キャラクター形状の頂点を十分に抽出できませんでした。")
    return points


def render_master_512(poly_points, super_sample=4) -> Image.Image:
    """四角い白背景 + 黒い円形 + 白いキャラクターシルエットを高精細描画して 512x512 に縮小"""
    base_px = int(VIEWBOX_SIZE)
    s = base_px * super_sample
    scale = s / VIEWBOX_SIZE

    img = Image.new("RGBA", (s, s), (255, 255, 255, 255))
    draw = ImageDraw.Draw(img)

    cx = CIRCLE_CX * scale
    cy = CIRCLE_CY * scale
    r = CIRCLE_R * scale
    draw.ellipse([cx - r, cy - r, cx + r, cy + r], fill=(0, 0, 0, 255))

    scaled_poly = [(px * scale, py * scale) for (px, py) in poly_points]
    draw.polygon(scaled_poly, fill=(255, 255, 255, 255))

    return img.resize((base_px, base_px), Image.Resampling.LANCZOS)


def build_multi_size_ico(master_512: Image.Image, target_sizes=(48, 32, 16)) -> bytes:
    """各サイズ（48x48, 32x32, 16x16）をPNG格納形式で確実にパックした ICO バイナリを生成"""
    entries_data = []
    for sz in target_sizes:
        resized = master_512.resize((sz, sz), Image.Resampling.LANCZOS).convert("RGBA")
        buf = io.BytesIO()
        resized.save(buf, format="PNG", optimize=True)
        entries_data.append((sz, buf.getvalue()))

    header = struct.pack("<HHH", 0, 1, len(entries_data))
    offset = 6 + 16 * len(entries_data)
    dir_entries = bytearray()
    image_blobs = bytearray()

    for sz, png_bytes in entries_data:
        w = 0 if sz == 256 else sz
        h = 0 if sz == 256 else sz
        dir_entries += struct.pack("<BBBBHHII", w, h, 0, 0, 1, 32, len(png_bytes), offset)
        image_blobs += png_bytes
        offset += len(png_bytes)

    return header + bytes(dir_entries) + bytes(image_blobs)


def main() -> None:
    favicon_svg_path = "../favicon.svg"
    out_dir = "../public"
    os.makedirs(out_dir, exist_ok=True)

    if not os.path.exists(favicon_svg_path):
        raise FileNotFoundError(f"favicon.svg not found at: {favicon_svg_path}")

    with open(favicon_svg_path, "r", encoding="utf-8") as f:
        svg_text = f.read()

    poly_points = extract_character_polygon(svg_text)
    master_512 = render_master_512(poly_points, super_sample=4)
    ico_bytes = build_multi_size_ico(master_512, target_sizes=(48, 32, 16))

    ico_path = os.path.join(out_dir, "favicon.ico")
    with open(ico_path, "wb") as f:
        f.write(ico_bytes)

    print(f"Generated {ico_path} ({len(ico_bytes)} bytes, sizes: 48x48, 32x32, 16x16)")


if __name__ == "__main__":
    main()
