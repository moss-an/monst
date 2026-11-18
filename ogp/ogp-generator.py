import os
from PIL import Image, ImageDraw, ImageFont, ImageFilter

W, H = 1200, 630

# フォントパス
FONT_BOLD = "/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc"
if not os.path.exists(FONT_BOLD):
    FONT_BOLD = "/usr/share/fonts/truetype/noto/NotoSansCJK-Bold.ttc"
FONT_REGGAE = "/app/public/fonts/reggae-one-v20-japanese_latin-regular.woff2"

# ダークグラデーション背景
base = Image.new("RGBA", (W, H), "#090d16")
draw_bg = ImageDraw.Draw(base)

for y in range(H):
    ratio = y / H
    r = int(11 + (24 - 11) * ratio)
    g = int(17 + (34 - 17) * ratio)
    b = int(32 + (58 - 32) * ratio)
    draw_bg.line([(0, y), (W, y)], fill=(r, g, b, 255))

# 背景グリッド
grid_layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
draw_grid = ImageDraw.Draw(grid_layer)
grid_spacing = 48
for x in range(0, W, grid_spacing):
    draw_grid.line([(x, 0), (x, H)], fill=(148, 163, 184, 14), width=1)
for y in range(0, H, grid_spacing):
    draw_grid.line([(0, y), (W, y)], fill=(148, 163, 184, 14), width=1)
base = Image.alpha_composite(base, grid_layer)

# グローエフェクト
glow_layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
draw_glow = ImageDraw.Draw(glow_layer)
draw_glow.ellipse([40, 80, 460, 500], fill=(245, 158, 11, 55))
draw_glow.ellipse([750, 280, 1300, 750], fill=(56, 189, 248, 45))
glow_layer = glow_layer.filter(ImageFilter.GaussianBlur(radius=75))
base = Image.alpha_composite(base, glow_layer)

# メインカードパネル
panel_layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
draw_panel = ImageDraw.Draw(panel_layer)
margin_x, margin_y = 44, 44
card_rect = [margin_x, margin_y, W - margin_x, H - margin_y]
draw_panel.rounded_rectangle(
    card_rect,
    radius=32,
    fill=(15, 23, 42, 190),
    outline=(255, 255, 255, 35),
    width=2,
)
# 上部にゴールドのアクセントハイライトバー
draw_panel.rounded_rectangle(
    [margin_x + 48, margin_y, margin_x + 260, margin_y + 6],
    radius=3,
    fill=(251, 191, 36, 255),
)
base = Image.alpha_composite(base, panel_layer)

draw = ImageDraw.Draw(base)

#  左側：アイコン
cx, cy, r = 225, 315, 125
draw.ellipse([cx - r, cy - r, cx + r, cy + r], fill="#181717", outline="#475569", width=4)
draw.ellipse([cx - 78, cy - 38, cx + 78, cy + 92], fill="#ffffff")
draw.polygon([(cx, cy - 89), (cx - 30, cy - 24), (cx + 30, cy - 24)], fill="#ffffff")

# 右側：タイポグラフィ（NotoSansCJK-Bold）
font_badge = ImageFont.truetype(FONT_BOLD, 25)
font_sub = ImageFont.truetype(FONT_BOLD, 33)
try:
    font_title_main = ImageFont.truetype(FONT_REGGAE, 92)
    font_title_sub = ImageFont.truetype(FONT_REGGAE, 74)
except Exception:
    # 万が一読み込めない場合のフォールバック
    font_title_main = ImageFont.truetype(FONT_BOLD, 92)
    font_title_sub = ImageFont.truetype(FONT_BOLD, 74)


text_x = 415

# カテゴリバッジ
badge_text = "MONST UTILITY TOOLS"
badge_bbox = draw.textbbox((0, 0), badge_text, font=font_badge)
badge_text_w = badge_bbox[2] - badge_bbox[0]
badge_text_h = badge_bbox[3] - badge_bbox[1]

badge_pad_x = 24
badge_pad_y = 12
badge_w = badge_text_w + badge_pad_x * 2
badge_h = badge_text_h + badge_pad_y * 2
badge_y = 112

draw.rounded_rectangle(
    [text_x, badge_y, text_x + badge_w, badge_y + badge_h],
    radius=badge_h // 2,
    fill=(15, 23, 42, 245),
    outline=(251, 191, 36, 255),
    width=2,
)
draw.text(
    (text_x + badge_pad_x - badge_bbox[0], badge_y + badge_pad_y - badge_bbox[1]),
    badge_text,
    font=font_badge,
    fill="#ffffff",
)

# メインタイトル
# 1行目：「モンスト」
title1_y = 185
draw.text((text_x + 4, title1_y + 4), "モンスト", font=font_title_main, fill=(0, 0, 0, 150))
draw.text((text_x, title1_y), "モンスト", font=font_title_main, fill="#fbbf24")

# 2行目：「便利ツール集」
title2_y = 292
draw.text((text_x + 4, title2_y + 4), "便利ツール集", font=font_title_sub, fill=(0, 0, 0, 150))
draw.text((text_x, title2_y), "便利ツール集", font=font_title_sub, fill="#ffffff")

# サブコピー
sub_text = "ランク上げ・編成考察のお供に"
sub_y = 422
sub_bbox = draw.textbbox((0, 0), sub_text, font=font_sub)
sub_text_w = sub_bbox[2] - sub_bbox[0]
sub_text_h = sub_bbox[3] - sub_bbox[1]

dot_r = 7
dot_left_pad = 24
dot_gap = 16
right_pad = 28
sub_pad_y = 16

sub_w = dot_left_pad + (dot_r * 2) + dot_gap + sub_text_w + right_pad
sub_h = sub_text_h + sub_pad_y * 2
center_y = sub_y + sub_h / 2

draw.rounded_rectangle(
    [text_x, sub_y, text_x + sub_w, sub_y + sub_h],
    radius=sub_h // 2,
    fill=(30, 41, 59, 240),
    outline=(56, 189, 248, 160),
    width=2,
)

# 左側の丸いアクセントドット
dot_cx = text_x + dot_left_pad + dot_r
draw.ellipse(
    [dot_cx - dot_r, center_y - dot_r, dot_cx + dot_r, center_y + dot_r],
    fill=(56, 189, 248, 255),
)

# テキスト
sub_text_x = dot_cx + dot_r + dot_gap - sub_bbox[0]
sub_text_y = center_y - (sub_text_h / 2) - sub_bbox[1]
draw.text((sub_text_x, sub_text_y), sub_text, font=font_sub, fill="#f8fafc")

# 保存
os.makedirs("../public", exist_ok=True)
final_img = base.convert("RGB")
final_img.save("../public/ogp.png", optimize=True)
print("Generated OGP image successfully.")
