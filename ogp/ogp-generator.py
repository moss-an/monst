from PIL import Image, ImageDraw, ImageFont

W, H = 1200, 630
img = Image.new("RGB", (W, H), "#0f172a")
draw = ImageDraw.Draw(img)

# 背景アクセント枠・ライン
draw.rectangle([28, 28, W - 28, H - 28], outline="#334155", width=3)
draw.rectangle([28, 28, 44, H - 28], fill="#f59e0b")

# アイコン
cx, cy, r = 210, 315, 115
draw.ellipse([cx - r, cy - r, cx + r, cy + r], fill="#181717", outline="#475569", width=4)
draw.ellipse([cx - 72, cy - 35, cx + 72, cy + 85], fill="#ffffff")
draw.polygon([(cx, cy - 82), (cx - 28, cy - 22), (cx + 28, cy - 22)], fill="#ffffff")

# テキスト描画
font_title = ImageFont.truetype("/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc", 64)
font_sub = ImageFont.truetype("/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc", 30)
font_tag = ImageFont.truetype("/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc", 24)

draw.text((380, 195), "モンスト 便利ツール集", font=font_title, fill="#fbbf24")
draw.text((380, 290), "～ランク上げ・編成考察のお供に～", font=font_sub, fill="#e2e8f0")
draw.text((380, 375), "moss-an.github.io/monst", font=font_tag, fill="#94a3b8")

img.save("../public/ogp.png")